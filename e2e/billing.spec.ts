import { expect, test } from "./test";
import { MongoClient } from "mongodb";
import { MONGODB_URI } from "../playwright.config";
import { nowSecs, paddleWebhook, signUp, webhook } from "./helpers";

const DAY = 86_400;

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
  await page.getByRole("button", { name: "India · ₹" }).click(); // outside India (no country header here) Paddle is the default
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
  expect(plans.data).toEqual([
    { provider: "razorpay", plan: "monthly", amount: 5000, currency: "INR" }, { provider: "razorpay", plan: "yearly", amount: 50000, currency: "INR" },
    { provider: "paddle", plan: "monthly", amount: 900, currency: "USD" }, { provider: "paddle", plan: "yearly", amount: 9000, currency: "USD" },
  ]);
  expect((await request.post("/api/v1/billing/webhook", { data: "not json" })).status()).toBe(400);
  expect((await request.post("/api/v1/billing/paddle-webhook", { data: "{}", headers: { "paddle-signature": "ts=1;h1=forged" } })).status()).toBe(400);
  expect((await request.post("/api/v1/billing/subscribe", { data: { plan: "monthly" } })).status()).toBe(401);
});

test("outside India: dollar prices, Paddle checkout, unlocked only by Paddle's signed webhook", async ({ page, request }) => {
  await signUp(page);
  await page.goto("/subscribe?next=/learn/e2e-paid-lesson");
  await expect(page.getByRole("button", { name: "Outside India · $" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Monthly plan")).toContainText("$9");
  await expect(page.getByLabel("Yearly plan")).toContainText("$90");
  await expect(page.getByText("Payment is handled by Paddle")).toBeVisible();

  // Paddle.js, replaced by a stub that records how checkout was opened
  await page.route("https://cdn.paddle.com/paddle/v2/paddle.js", (route) =>
    route.fulfill({ contentType: "text/javascript", body: "window.Paddle = { Initialized: false, Environment: { set(e) { window.__env = e; } }, Initialize(o) { this.Initialized = true; window.__init = o; }, Update(o) { window.__init = o; }, Checkout: { open(o) { window.__open = o; } } };" }));
  const created = page.waitForResponse((r) => r.url().endsWith("/api/v1/billing/subscribe"));
  await page.getByRole("button", { name: "Subscribe monthly" }).click();
  const { customData } = (await (await created).json()).data;
  await expect.poll(() => page.evaluate(() => (window as unknown as { __open?: unknown }).__open)).toBeTruthy();
  const opened = await page.evaluate(() => { const w = window as unknown as { __env: string; __init: { token: string }; __open: { items: { priceId: string }[]; customData: { userId: string } } }; return [w.__env, w.__init.token, w.__open.items[0].priceId, w.__open.customData.userId]; });
  expect(opened).toEqual(["sandbox", "test_e2e_client_token", "pri_e2e_monthly", customData.userId]);

  // Paddle saying checkout completed unlocks nothing
  await page.evaluate(() => (window as unknown as { __init: { eventCallback: (e: { name: string }) => void } }).__init.eventCallback({ name: "checkout.completed" }));
  await expect(page.getByRole("heading", { name: "Confirming your payment…" })).toBeVisible();
  expect((await page.request.get("/api/v1/lessons/e2e-paid-lesson")).status()).toBe(403);

  // Paddle's signed webhook does, and the waiting page moves on by itself
  const subscriptionId = `sub_e2e_${Date.now()}`;
  expect((await (await paddleWebhook(request, { subscriptionId, status: "active", userId: customData.userId })).json()).data.result).toBe("applied");
  await expect(page.getByRole("heading", { name: "A paid lesson" })).toBeVisible({ timeout: 15_000 });
});
