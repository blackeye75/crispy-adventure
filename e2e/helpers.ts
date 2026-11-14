import { createHmac } from "node:crypto";
import { expect, type APIRequestContext, type Page } from "@playwright/test";
import { WEBHOOK_SECRET } from "../playwright.config";

export const newUser = () => ({ name: "Asha", email: `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`, password: "correct-horse-battery" });

/** Create an account through the UI. Ends on the onboarding screen. */
export async function createAccount(page: Page, user = newUser()) {
  await page.goto("/sign-up");
  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Set up your path" })).toBeVisible();
  return user;
}

/** A new beginner on guitar with the default goal. Ends on Home. */
export async function signUp(page: Page) {
  const user = await createAccount(page);
  await expect(async () => { // on a slow machine the first click can land before the page is interactive
    await page.getByRole("button", { name: "Continue" }).click({ timeout: 2000 }).catch(() => {});
    await expect(page.getByRole("link", { name: "Start the first lesson" })).toBeVisible({ timeout: 6000 });
  }).toPass();
  return user;
}

export const nowSecs = () => Math.floor(Date.now() / 1000);

/** Deliver a webhook the way Razorpay does: raw JSON body, HMAC-SHA256 signature header. */
export async function webhook(request: APIRequestContext, subscriptionId: string, status: string, opts: { signature?: string; eventId?: string; at?: number } = {}) {
  const body = JSON.stringify({
    entity: "event",
    event: `subscription.${status}`,
    created_at: opts.at ?? nowSecs(),
    payload: { subscription: { entity: { id: subscriptionId, status, customer_id: "cust_e2e", current_end: nowSecs() + 30 * 86_400 } } },
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

/** A new learner with an active subscription, for tests of paid lessons. Ends on Home. */
export async function signUpSubscribed(page: Page) {
  const user = await signUp(page);
  const { data } = await (await page.request.post("/api/v1/billing/subscribe", { data: { plan: "monthly" } })).json();
  expect((await (await webhook(page.request, data.subscriptionId, "active")).json()).data.result).toBe("applied");
  return user;
}
