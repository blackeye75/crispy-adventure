// Needs a real MongoDB: MONGODB_TEST_URI=mongodb://127.0.0.1:27017/fretkey_test npm run test
import { createHmac, randomUUID } from "node:crypto";
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";
import { validPaddleSignature } from "./paddle";
import { validWebhookSignature } from "./razorpay";

const uri = process.env.MONGODB_TEST_URI;
if (uri) process.env.MONGODB_URI = uri;
const SECRET = "whsec_test";
Object.assign(process.env, { PADDLE_API_KEY: "pdl_test_key", PADDLE_CLIENT_TOKEN: "test_client_token", PADDLE_WEBHOOK_SECRET: "pdl_whsec", PADDLE_PRICE_MONTHLY: "pri_m", PADDLE_PRICE_YEARLY: "pri_y", RAZORPAY_KEY_ID: "rzp_test_key", RAZORPAY_KEY_SECRET: "s3cret", RAZORPAY_WEBHOOK_SECRET: SECRET, RAZORPAY_PLAN_MONTHLY: "plan_m", RAZORPAY_PLAN_YEARLY: "plan_y" });

const sign = (body: string) => createHmac("sha256", SECRET).update(body).digest("hex");

test("webhook signatures: HMAC-SHA256 of the raw body", () => {
  const body = '{"event":"subscription.charged"}';
  expect(validWebhookSignature(body, sign(body), SECRET)).toBe(true);
  expect(validWebhookSignature(body + " ", sign(body), SECRET)).toBe(false); // any change to the body
  expect(validWebhookSignature(body, sign(body), "other-secret")).toBe(false);
  expect(validWebhookSignature(body, null, SECRET)).toBe(false);
  expect(validWebhookSignature(body, "short", SECRET)).toBe(false);
});

const paddleSign = (body: string, at: number, secret = "pdl_whsec") => `ts=${Math.floor(at / 1000)};h1=${createHmac("sha256", secret).update(`${Math.floor(at / 1000)}:${body}`).digest("hex")}`;

test("Paddle webhook signatures: HMAC-SHA256 of ts:body, refused when old or altered", () => {
  const body = '{"event_type":"subscription.activated"}';
  const at = Date.UTC(2026, 0, 1);
  expect(validPaddleSignature(body, paddleSign(body, at), "pdl_whsec", at)).toBe(true);
  expect(validPaddleSignature(body + " ", paddleSign(body, at), "pdl_whsec", at)).toBe(false); // any change to the body
  expect(validPaddleSignature(body, paddleSign(body, at, "other"), "pdl_whsec", at)).toBe(false);
  expect(validPaddleSignature(body, paddleSign(body, at), "pdl_whsec", at + 6_000)).toBe(false); // replayed later
  expect(validPaddleSignature(body, null, "pdl_whsec", at)).toBe(false);
  expect(validPaddleSignature(body, "ts=1;h1=", "pdl_whsec", at)).toBe(false);
});

describe.skipIf(!uri)("billing (MongoDB)", async () => {
  const { default: mongoose } = await import("mongoose");
  const { connectDb } = await import("../db/connect");
  const { LessonModel, PaymentEventModel, SubscriptionModel } = await import("../db/models");
  const { cancel, getSubscription, handleWebhook, handlePaddleWebhook, subscribe, subscriptionView } = await import("./billing");
  type RazorpayCheckout = { subscriptionId: string; keyId: string; plan: string };
  const rzp = (viewer: Parameters<typeof subscribe>[0], plan: "monthly" | "yearly", at: Date) => subscribe(viewer, plan, "razorpay", at) as Promise<RazorpayCheckout>;
  const { getLesson } = await import("./content");
  const { content } = await import("../../../content");
  if (uri) await connectDb();
  afterAll(() => mongoose.disconnect());

  // Razorpay's API, faked: every call is recorded.
  const calls: { path: string; body: unknown }[] = [];
  beforeEach(() => {
    calls.length = 0;
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      const path = new URL(url).pathname.replace("/v1", "");
      calls.push({ path, body: init.body ? JSON.parse(String(init.body)) : undefined });
      expect(init.headers).toMatchObject({ authorization: `Basic ${Buffer.from("rzp_test_key:s3cret").toString("base64")}` });
      return Response.json(path === "/subscriptions" ? { id: `sub_${randomUUID()}`, status: "created" } : { id: path.split("/")[2], status: "active" });
    });
  });

  const user = () => ({ userId: randomUUID(), name: "Asha", email: "asha@example.com", subscriber: false });
  const now = new Date("2026-03-09T10:00:00Z");
  const secs = (d: Date) => Math.floor(d.getTime() / 1000);
  const inDays = (n: number) => new Date(now.getTime() + n * 86_400_000);

  /** Deliver a webhook the way Razorpay does. */
  const deliver = (subscriptionId: string, status: string, opts: { at?: Date; end?: Date; id?: string; extra?: object } = {}) => {
    const body = JSON.stringify({
      entity: "event",
      event: `subscription.${status}`,
      created_at: secs(opts.at ?? now),
      payload: { subscription: { entity: { id: subscriptionId, status, customer_id: "cust_1", current_end: opts.end ? secs(opts.end) : null } }, ...opts.extra },
    });
    return handleWebhook(body, sign(body), opts.id ?? randomUUID(), now);
  };

  test("subscribing creates a Razorpay subscription but unlocks nothing by itself", async () => {
    const viewer = user();
    const checkout = await rzp(viewer, "monthly", now);
    expect(checkout).toMatchObject({ keyId: "rzp_test_key", plan: "monthly", prefill: { name: "Asha", email: "asha@example.com" } });
    expect(calls).toEqual([{ path: "/subscriptions", body: { plan_id: "plan_m", total_count: 120, customer_notify: 1, notes: { userId: viewer.userId } } }]);
    expect(subscriptionView(await getSubscription(viewer.userId), now)).toMatchObject({ status: "none", plan: null, entitled: false });

    // trying again reuses the unpaid subscription; another plan replaces it
    expect((await rzp(viewer, "monthly", now)).subscriptionId).toBe(checkout.subscriptionId);
    expect(calls).toHaveLength(1);
    expect((await rzp(viewer, "yearly", now)).subscriptionId).not.toBe(checkout.subscriptionId);
    expect(calls[1].body).toMatchObject({ plan_id: "plan_y", total_count: 10 });
  });

  test("only a correctly signed webhook activates; each event applies once; late events are ignored", async () => {
    const viewer = user();
    const { subscriptionId } = await rzp(viewer, "monthly", now);
    const forged = JSON.stringify({ event: "subscription.activated", created_at: secs(now), payload: { subscription: { entity: { id: subscriptionId, status: "active" } } } });
    await expect(handleWebhook(forged, "0".repeat(64), "evt_forged", now)).rejects.toMatchObject({ status: 400, code: "bad_signature" });
    await expect(handleWebhook(forged, null, "evt_forged", now)).rejects.toMatchObject({ status: 400 });
    expect((await getSubscription(viewer.userId))!.status).toBe("none");

    const eventId = randomUUID();
    const card = { payment: { entity: { id: "pay_1", method: "card", card: { last4: "1111" }, vpa: "asha@upi" } } };
    expect(await deliver(subscriptionId, "active", { id: eventId, end: inDays(30), extra: card })).toEqual({ result: "applied" });
    expect(subscriptionView(await getSubscription(viewer.userId), now)).toMatchObject({ status: "active", plan: "monthly", entitled: true, currentPeriodEnd: new Date(secs(inDays(30)) * 1000) });
    expect(await deliver(subscriptionId, "halted", { id: eventId })).toEqual({ result: "duplicate" }); // same event id: not applied again
    expect((await getSubscription(viewer.userId))!.status).toBe("active");

    // we keep no card or UPI details from the event
    const stored = JSON.stringify(await PaymentEventModel.findOne({ providerEventId: eventId }).lean());
    expect(stored).not.toMatch(/1111|asha@upi|card/);

    expect(await deliver(subscriptionId, "pending", { at: inDays(-1) })).toEqual({ result: "stale" }); // older than what we applied
    expect((await getSubscription(viewer.userId))!.status).toBe("active");
    expect(await deliver("sub_unknown", "active")).toEqual({ result: "ignored" });
    await expect(rzp(viewer, "yearly", now)).rejects.toMatchObject({ status: 409, code: "already_subscribed" });
  });

  test("a failed renewal becomes past due; access lasts only to the end of the paid period", async () => {
    const viewer = user();
    const { subscriptionId } = await rzp(viewer, "monthly", now);
    await deliver(subscriptionId, "active", { end: inDays(2) });
    await deliver(subscriptionId, "halted", { at: inDays(1), end: inDays(2) });
    const sub = await getSubscription(viewer.userId);
    expect(subscriptionView(sub, now)).toMatchObject({ status: "past_due", entitled: true });
    expect(subscriptionView(sub, inDays(3)).entitled).toBe(false);
  });

  test("cancelling stops renewal at Razorpay and keeps access until the period ends", async () => {
    const viewer = user();
    await expect(cancel(viewer, now)).rejects.toMatchObject({ status: 409, code: "not_subscribed" });
    const { subscriptionId } = await rzp(viewer, "yearly", now);
    await expect(cancel(viewer, now)).rejects.toMatchObject({ status: 409 }); // unpaid
    await deliver(subscriptionId, "active", { end: inDays(200) });

    expect(await cancel(viewer, now)).toMatchObject({ status: "active", cancelAtPeriodEnd: true, entitled: true });
    expect(calls.at(-1)).toEqual({ path: `/subscriptions/${subscriptionId}/cancel`, body: { cancel_at_cycle_end: 1 } });

    await deliver(subscriptionId, "cancelled", { at: inDays(200), end: inDays(200) });
    const sub = await getSubscription(viewer.userId);
    expect(subscriptionView(sub, inDays(199))).toMatchObject({ status: "cancelled", cancelAtPeriodEnd: false, entitled: true });
    expect(subscriptionView(sub, inDays(201)).entitled).toBe(false);
    await expect(rzp(viewer, "monthly", inDays(199))).rejects.toMatchObject({ code: "already_subscribed" }); // still paid up
    // and they can subscribe again afterwards
    expect((await rzp(viewer, "monthly", inDays(201))).subscriptionId).not.toBe(subscriptionId);
  });

  test("paid lesson content is only returned to subscribers", async () => {
    const paid = { ...content.lessons[0], slug: "test-paid-lesson", moduleSlug: "intervals", isFree: false, track: "theory", stage: "basic", strand: "core", needs: [] };
    await LessonModel.replaceOne({ slug: paid.slug }, paid, { upsert: true });
    const viewer = user();
    const locked = await getLesson(paid.slug, viewer);
    expect(locked).toEqual({ status: "locked", title: paid.title });
    expect(JSON.stringify(locked)).not.toContain("blocks");
    expect(await getLesson(paid.slug, { ...viewer, subscriber: true })).toMatchObject({ status: "ok", lesson: { slug: paid.slug } });
    await LessonModel.deleteOne({ slug: paid.slug });
  });

  test("a payment is never orphaned: paying for an attempt that was since replaced still unlocks", async () => {
    const viewer = user();
    const first = await rzp(viewer, "monthly", now);
    const second = await rzp(viewer, "yearly", now); // restarted checkout with another plan
    const body = JSON.stringify({
      event: "subscription.charged",
      created_at: secs(now),
      payload: { subscription: { entity: { id: first.subscriptionId, status: "active", plan_id: "plan_m", notes: { userId: viewer.userId }, current_end: secs(inDays(30)) } } },
    });
    expect(await handleWebhook(body, sign(body), randomUUID(), now)).toEqual({ result: "applied" });
    expect(await SubscriptionModel.findOne({ userId: viewer.userId }).lean()).toMatchObject({ providerSubscriptionId: first.subscriptionId, plan: "monthly", status: "active" });
    expect(second.subscriptionId).not.toBe(first.subscriptionId);
  });

  test("Paddle: checkout carries the learner's id; only a signed webhook unlocks; cancel waits for the period to end", async () => {
    const viewer = user();
    const checkout = await subscribe(viewer, "yearly", "paddle", now);
    expect(checkout).toMatchObject({ provider: "paddle", plan: "yearly", priceId: "pri_y", clientToken: "test_client_token", customer: { email: "asha@example.com" }, customData: { userId: viewer.userId } });
    expect(calls).toHaveLength(0); // Paddle creates the subscription itself, at checkout
    expect(await getSubscription(viewer.userId)).toBeNull();

    const sub = `sub_${randomUUID()}`;
    const event = (status: string, opts: { id?: string; at?: Date; end?: Date; cancelAt?: Date; canceledAt?: Date } = {}) => JSON.stringify({
      event_id: opts.id ?? `evt_${randomUUID()}`,
      event_type: status === "canceled" ? "subscription.canceled" : "subscription.updated",
      occurred_at: (opts.at ?? now).toISOString(),
      data: {
        id: sub, status, customer_id: "ctm_1", custom_data: { userId: viewer.userId }, items: [{ price: { id: "pri_y" } }],
        current_billing_period: opts.end ? { starts_at: now.toISOString(), ends_at: opts.end.toISOString() } : null,
        scheduled_change: opts.cancelAt ? { action: "cancel", effective_at: opts.cancelAt.toISOString() } : null,
        canceled_at: opts.canceledAt?.toISOString() ?? null,
      },
    });
    const deliverPaddle = (body: string, at = now) => handlePaddleWebhook(body, paddleSign(body, at.getTime()), at);

    const activated = event("active", { id: `evt_first_${sub}`, end: inDays(365) });
    await expect(handlePaddleWebhook(activated, paddleSign(activated, now.getTime(), "wrong"), now)).rejects.toMatchObject({ status: 400, code: "bad_signature" });
    expect(await getSubscription(viewer.userId)).toBeNull();
    expect(await deliverPaddle(activated)).toEqual({ result: "applied" });
    expect(await SubscriptionModel.findOne({ userId: viewer.userId }).lean()).toMatchObject({ provider: "paddle", providerSubscriptionId: sub, plan: "yearly", status: "active" });
    expect(subscriptionView(await getSubscription(viewer.userId), now)).toMatchObject({ entitled: true, currentPeriodEnd: inDays(365) });
    expect(await deliverPaddle(activated)).toEqual({ result: "duplicate" });

    // cancelling asks Paddle to stop at the end of the period; access stays until then
    const paddleCalls: { url: string; body: unknown; auth: unknown }[] = [];
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      paddleCalls.push({ url, body: JSON.parse(String(init.body)), auth: (init.headers as Record<string, string>).authorization });
      return Response.json({ data: { id: sub, status: "active" } });
    });
    await cancel(viewer, now);
    expect(paddleCalls).toEqual([{ url: `https://api.paddle.com/subscriptions/${sub}/cancel`, body: { effective_from: "next_billing_period" }, auth: "Bearer pdl_test_key" }]);
    expect(await deliverPaddle(event("active", { end: inDays(365), cancelAt: inDays(365), at: inDays(1) }), inDays(1))).toEqual({ result: "applied" });
    expect(subscriptionView(await getSubscription(viewer.userId), inDays(1))).toMatchObject({ status: "active", cancelAtPeriodEnd: true, entitled: true });
    expect(await deliverPaddle(event("past_due", { at: inDays(-1) }), inDays(2))).toEqual({ result: "stale" }); // older than what we applied

    expect(await deliverPaddle(event("canceled", { at: inDays(365), canceledAt: inDays(365) }), inDays(365))).toEqual({ result: "applied" });
    expect(subscriptionView(await getSubscription(viewer.userId), inDays(366))).toMatchObject({ status: "cancelled", cancelAtPeriodEnd: false, entitled: false });
  });

  test("Paddle: a second subscription for a learner who already has access is not adopted", async () => {
    const viewer = user();
    const { subscriptionId } = await rzp(viewer, "monthly", now);
    await deliver(subscriptionId, "active", { end: inDays(30) });
    const body = JSON.stringify({ event_id: `evt_${randomUUID()}`, event_type: "subscription.created", occurred_at: now.toISOString(), data: { id: `sub_${randomUUID()}`, status: "active", custom_data: { userId: viewer.userId }, items: [] } });
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await handlePaddleWebhook(body, paddleSign(body, now.getTime()), now)).toEqual({ result: "ignored" });
    expect(errors).toHaveBeenCalled(); // logged, so the double payment can be refunded by hand
    errors.mockRestore();
    expect(await SubscriptionModel.findOne({ userId: viewer.userId }).lean()).toMatchObject({ provider: "razorpay", providerSubscriptionId: subscriptionId, status: "active" });
  });
});
