// Needs a real MongoDB: MONGODB_TEST_URI=mongodb://127.0.0.1:27017/fretkey_test npm run test
import { createHmac, randomUUID } from "node:crypto";
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";
import { validWebhookSignature } from "./razorpay";

const uri = process.env.MONGODB_TEST_URI;
if (uri) process.env.MONGODB_URI = uri;
const SECRET = "whsec_test";
Object.assign(process.env, { RAZORPAY_KEY_ID: "rzp_test_key", RAZORPAY_KEY_SECRET: "s3cret", RAZORPAY_WEBHOOK_SECRET: SECRET, RAZORPAY_PLAN_MONTHLY: "plan_m", RAZORPAY_PLAN_YEARLY: "plan_y" });

const sign = (body: string) => createHmac("sha256", SECRET).update(body).digest("hex");

test("webhook signatures: HMAC-SHA256 of the raw body", () => {
  const body = '{"event":"subscription.charged"}';
  expect(validWebhookSignature(body, sign(body), SECRET)).toBe(true);
  expect(validWebhookSignature(body + " ", sign(body), SECRET)).toBe(false); // any change to the body
  expect(validWebhookSignature(body, sign(body), "other-secret")).toBe(false);
  expect(validWebhookSignature(body, null, SECRET)).toBe(false);
  expect(validWebhookSignature(body, "short", SECRET)).toBe(false);
});

describe.skipIf(!uri)("billing (MongoDB)", async () => {
  const { default: mongoose } = await import("mongoose");
  const { connectDb } = await import("../db/connect");
  const { LessonModel, PaymentEventModel, SubscriptionModel } = await import("../db/models");
  const { cancel, getSubscription, handleWebhook, subscribe, subscriptionView } = await import("./billing");
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
    const checkout = await subscribe(viewer, "monthly", now);
    expect(checkout).toMatchObject({ keyId: "rzp_test_key", plan: "monthly", prefill: { name: "Asha", email: "asha@example.com" } });
    expect(calls).toEqual([{ path: "/subscriptions", body: { plan_id: "plan_m", total_count: 120, customer_notify: 1, notes: { userId: viewer.userId } } }]);
    expect(subscriptionView(await getSubscription(viewer.userId), now)).toMatchObject({ status: "none", plan: null, entitled: false });

    // trying again reuses the unpaid subscription; another plan replaces it
    expect((await subscribe(viewer, "monthly", now)).subscriptionId).toBe(checkout.subscriptionId);
    expect(calls).toHaveLength(1);
    expect((await subscribe(viewer, "yearly", now)).subscriptionId).not.toBe(checkout.subscriptionId);
    expect(calls[1].body).toMatchObject({ plan_id: "plan_y", total_count: 10 });
  });

  test("only a correctly signed webhook activates; each event applies once; late events are ignored", async () => {
    const viewer = user();
    const { subscriptionId } = await subscribe(viewer, "monthly", now);
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
    await expect(subscribe(viewer, "yearly", now)).rejects.toMatchObject({ status: 409, code: "already_subscribed" });
  });

  test("a failed renewal becomes past due; access lasts only to the end of the paid period", async () => {
    const viewer = user();
    const { subscriptionId } = await subscribe(viewer, "monthly", now);
    await deliver(subscriptionId, "active", { end: inDays(2) });
    await deliver(subscriptionId, "halted", { at: inDays(1), end: inDays(2) });
    const sub = await getSubscription(viewer.userId);
    expect(subscriptionView(sub, now)).toMatchObject({ status: "past_due", entitled: true });
    expect(subscriptionView(sub, inDays(3)).entitled).toBe(false);
  });

  test("cancelling stops renewal at Razorpay and keeps access until the period ends", async () => {
    const viewer = user();
    await expect(cancel(viewer, now)).rejects.toMatchObject({ status: 409, code: "not_subscribed" });
    const { subscriptionId } = await subscribe(viewer, "yearly", now);
    await expect(cancel(viewer, now)).rejects.toMatchObject({ status: 409 }); // unpaid
    await deliver(subscriptionId, "active", { end: inDays(200) });

    expect(await cancel(viewer, now)).toMatchObject({ status: "active", cancelAtPeriodEnd: true, entitled: true });
    expect(calls.at(-1)).toEqual({ path: `/subscriptions/${subscriptionId}/cancel`, body: { cancel_at_cycle_end: 1 } });

    await deliver(subscriptionId, "cancelled", { at: inDays(200), end: inDays(200) });
    const sub = await getSubscription(viewer.userId);
    expect(subscriptionView(sub, inDays(199))).toMatchObject({ status: "cancelled", cancelAtPeriodEnd: false, entitled: true });
    expect(subscriptionView(sub, inDays(201)).entitled).toBe(false);
    await expect(subscribe(viewer, "monthly", inDays(199))).rejects.toMatchObject({ code: "already_subscribed" }); // still paid up
    // and they can subscribe again afterwards
    expect((await subscribe(viewer, "monthly", inDays(201))).subscriptionId).not.toBe(subscriptionId);
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
    const first = await subscribe(viewer, "monthly", now);
    const second = await subscribe(viewer, "yearly", now); // restarted checkout with another plan
    const body = JSON.stringify({
      event: "subscription.charged",
      created_at: secs(now),
      payload: { subscription: { entity: { id: first.subscriptionId, status: "active", plan_id: "plan_m", notes: { userId: viewer.userId }, current_end: secs(inDays(30)) } } },
    });
    expect(await handleWebhook(body, sign(body), randomUUID(), now)).toEqual({ result: "applied" });
    expect(await SubscriptionModel.findOne({ userId: viewer.userId }).lean()).toMatchObject({ providerSubscriptionId: first.subscriptionId, plan: "monthly", status: "active" });
    expect(second.subscriptionId).not.toBe(first.subscriptionId);
  });
});
