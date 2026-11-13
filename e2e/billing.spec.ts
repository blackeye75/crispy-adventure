import { createHmac } from "node:crypto";
import type { APIRequestContext } from "@playwright/test";
import { expect, test } from "./test";
import { MongoClient } from "mongodb";
import { MONGODB_URI, WEBHOOK_SECRET } from "../playwright.config";
import { signUp } from "./helpers";

const DAY = 86_400;
const nowSecs = () => Math.floor(Date.now() / 1000);

/** Deliver a webhook the way Razorpay does: raw JSON body, HMAC-SHA256 signature header. */
async function webhook(request: APIRequestContext, subscriptionId: string, status: string, opts: { signature?: string; eventId?: string; at?: number } = {}) {
  const body = JSON.stringify({
    entity: "event",
    event: `subscription.${status}`,
    created_at: opts.at ?? nowSecs(),
    payload: { subscription: { entity: { id: subscriptionId, status, customer_id: "cust_e2e", current_end: nowSecs() + 30 * DAY } } },
  });
  return request.post("/api/v1/billing/webhook", {
    data: body,
    headers: {
      "content-type": "application/json",
      "x-razorpay-signature": opts.signature ?? createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex"),
      "x-razorpay-event-id": opts.eventId ?? `evt_${Math.random().toString(36).slice(2)}`,
    },
  });
}

test.beforeAll(async () => {
  // The seeded content has no paid lesson yet (only Level 1 is written), so add one to lock.
  const client = new MongoClient(MONGODB_URI);
  const lessons = client.db().collection("lessons");
  const template = await lessons.findOne({ slug: "what-is-a-note" }, { projection: { _id: 0 } });
  await lessons.replaceOne({ slug: "e2e-paid-lesson" }, { ...template, slug: "e2e-paid-lesson", title: "A paid lesson", moduleSlug: "intervals", isFree: false, order: 1 }, { upsert: true });
  await client.close();
});

test("subscribe, unlock by webhook only, then cancel", async ({ page, request }) => {
  await signUp(page);

  // Locked: the paywall shows, and the API refuses the content
  await page.goto("/learn/e2e-paid-lesson");
  await expect(page.getByText("Subscribers only")).toBeVisible();
  const refused = await page.request.get("/api/v1/lessons/e2e-paid-lesson");
  expect(refused.status()).toBe(403);
  expect(JSON.stringify(await refused.json())).not.toContain("blocks");
  expect((await page.request.post("/api/v1/billing/cancel")).status()).toBe(409);

  await page.getByRole("link", { name: "See plans" }).click();
  await expect(page.getByLabel("Monthly plan")).toContainText("₹50");
  await expect(page.getByLabel("Yearly plan")).toContainText("₹500");

  // Razorpay's checkout window, replaced by a stub that records how it was opened
  await page.route("https://checkout.razorpay.com/v1/checkout.js", (route) =>
    route.fulfill({ contentType: "text/javascript", body: "window.Razorpay = class { constructor(o) { window.__checkout = o; } open() { window.__opened = true; } };" }));
  const created = page.waitForResponse((r) => r.url().endsWith("/api/v1/billing/subscribe"));
  await page.getByRole("button", { name: "Subscribe monthly" }).click();
  const { subscriptionId } = (await (await created).json()).data;
  await expect.poll(() => page.evaluate(() => (window as unknown as { __opened?: boolean }).__opened)).toBe(true);
  expect(await page.evaluate(() => { const o = (window as unknown as { __checkout: { key: string; subscription_id: string } }).__checkout; return [o.key, o.subscription_id]; })).toEqual(["rzp_test_e2e", subscriptionId]);

  // The browser claiming success unlocks nothing
  await page.evaluate(() => (window as unknown as { __checkout: { handler: () => void } }).__checkout.handler());
  await expect(page.getByRole("heading", { name: "Confirming your payment…" })).toBeVisible();
  expect((await page.request.get("/api/v1/lessons/e2e-paid-lesson")).status()).toBe(403);

  // Neither does a webhook with a bad signature
  const forged = await webhook(request, subscriptionId, "active", { signature: "f".repeat(64) });
  expect(forged.status()).toBe(400);
  expect((await forged.json()).error.code).toBe("bad_signature");
  expect((await page.request.get("/api/v1/lessons/e2e-paid-lesson")).status()).toBe(403);

  // The real one does, and the waiting page moves on by itself
  const activated = await webhook(request, subscriptionId, "active", { eventId: "evt_first_charge_" + subscriptionId });
  expect((await activated.json()).data.result).toBe("applied");
  await expect(page.getByRole("heading", { name: "A paid lesson" })).toBeVisible({ timeout: 15_000 });
  expect((await (await webhook(request, subscriptionId, "halted", { eventId: "evt_first_charge_" + subscriptionId })).json()).data.result).toBe("duplicate");
  expect((await (await webhook(request, subscriptionId, "pending", { at: nowSecs() - DAY })).json()).data.result).toBe("stale");

  await page.goto("/review");
  await expect(page.getByRole("heading", { name: "Nothing to review right now." })).toBeVisible();
  await page.goto("/subscribe");
  await expect(page).toHaveURL(/\/dashboard/); // already subscribed: nothing to sell

  // Billing settings and the cancel flow
  await page.goto("/settings");
  const billing = page.getByLabel("Subscription");
  await expect(billing).toContainText("Monthly");
  await expect(billing).toContainText("Renews on");
  await billing.getByRole("button", { name: "Cancel subscription" }).click();
  await billing.getByRole("button", { name: "Keep my plan" }).click();
  await billing.getByRole("button", { name: "Cancel subscription" }).click();
  await billing.getByRole("button", { name: "Yes, cancel" }).click();
  await expect(billing).toContainText("Your plan will not renew.");
  await expect(billing.getByRole("button", { name: "Cancel subscription" })).toHaveCount(0);

  // Razorpay confirms the cancellation at the end of the cycle: still unlocked until the paid period is over
  await webhook(request, subscriptionId, "cancelled", { at: nowSecs() + 5 });
  await page.reload();
  await expect(billing).toContainText("Cancelled");
  await expect(billing).toContainText("Access until");
  expect((await page.request.get("/api/v1/lessons/e2e-paid-lesson")).status()).toBe(200);
});

test("plans are public; the webhook endpoint rejects junk", async ({ request }) => {
  const plans = await (await request.get("/api/v1/billing/plans")).json();
  expect(plans.data).toEqual([{ plan: "monthly", amount: 5000, currency: "INR" }, { plan: "yearly", amount: 50000, currency: "INR" }]);
  expect((await request.post("/api/v1/billing/webhook", { data: "not json" })).status()).toBe(400);
  expect((await request.post("/api/v1/billing/subscribe", { data: { plan: "monthly" } })).status()).toBe(401);
});
