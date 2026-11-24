import { createHash } from "node:crypto";
import { z } from "zod";
import { ServiceError } from "../api";
import { isEntitled } from "../auth/entitlement";
import type { Viewer } from "../auth/session";
import { connectDb } from "../db/connect";
import { PaymentEventModel, SubscriptionModel, type Subscription, type SubscriptionStatus } from "../db/models";
import { cancelPaddleAtPeriodEnd, getPaddlePlans, PADDLE_PRICES, paddleEnvironment, validPaddleSignature } from "./paddle";
import { cancelAtCycleEnd, createSubscription, getPlans, PLAN_IDS, PLANS, razorpayKeyId, validWebhookSignature, type PlanId, type PlanPrice, type Provider, type ProviderSubscription } from "./razorpay";

export async function getSubscription(userId: string): Promise<Subscription | null> {
  await connectDb();
  return SubscriptionModel.findOne({ userId }, { _id: 0 }).lean<Subscription>();
}

/** What the client may know about a subscription. */
export function subscriptionView(sub: Subscription | null, now: Date) {
  return {
    status: sub?.status ?? ("none" as SubscriptionStatus),
    plan: sub && sub.status !== "none" ? sub.plan : null,
    currentPeriodEnd: sub?.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
    entitled: isEntitled(sub, now),
  };
}

/** Every plan on sale, from both providers. One provider being down still shows the other's prices. */
export async function getAllPlans(): Promise<PlanPrice[]> {
  const [india, international] = await Promise.all([getPlans().catch(() => []), getPaddlePlans().catch(() => [])]);
  return [...india, ...international];
}

/**
 * POST /billing/subscribe: return what checkout needs. For Razorpay that means creating the subscription first;
 * Paddle creates its own when checkout completes, and our userId travels with it as custom data.
 * Nothing is unlocked here; access starts when the provider's webhook confirms the payment.
 */
export async function subscribe(viewer: Viewer, plan: PlanId, provider: Provider = "razorpay", now = new Date()) {
  const existing = await getSubscription(viewer.userId);
  // Also while a cancelled plan is still running: a new one would charge again for days already paid.
  if (isEntitled(existing, now)) throw new ServiceError(409, "already_subscribed", "You already have access. You can subscribe again when your current plan ends.");
  if (provider === "paddle") {
    const priceId = process.env[PADDLE_PRICES[plan]];
    const clientToken = process.env.PADDLE_CLIENT_TOKEN;
    if (!priceId || !clientToken) throw new ServiceError(503, "billing_unavailable", "That plan is not available yet.");
    return { provider, plan, clientToken, environment: paddleEnvironment(), priceId, customer: { email: viewer.email }, customData: { userId: viewer.userId } };
  }
  // An unpaid attempt for the same plan is reused, so abandoning checkout does not pile up subscriptions.
  const reuse = existing?.status === "none" && existing.plan === plan;
  const providerSubscriptionId = reuse ? existing.providerSubscriptionId : (await createSubscription(plan, viewer.userId)).id;
  if (!reuse) {
    await SubscriptionModel.updateOne(
      { userId: viewer.userId },
      { $set: { provider: "razorpay", providerSubscriptionId, plan, status: "none", cancelAtPeriodEnd: false }, $unset: { currentPeriodEnd: 1, lastEventAt: 1, providerCustomerId: 1 } },
      { upsert: true },
    );
  }
  return { provider, keyId: razorpayKeyId()!, subscriptionId: providerSubscriptionId, plan, prefill: { name: viewer.name, email: viewer.email } };
}

/** POST /billing/cancel: stop renewing. Access continues until the period already paid for ends. */
export async function cancel(viewer: Viewer, now = new Date()) {
  const sub = await getSubscription(viewer.userId);
  if (!sub || !isEntitled(sub, now) || sub.status === "cancelled") throw new ServiceError(409, "not_subscribed", "There is no active subscription to cancel.");
  await (sub.provider === "paddle" ? cancelPaddleAtPeriodEnd(sub.providerSubscriptionId) : cancelAtCycleEnd(sub.providerSubscriptionId));
  // The provider accepted the request; the status itself still only changes when its webhook arrives.
  await SubscriptionModel.updateOne({ userId: viewer.userId }, { $set: { cancelAtPeriodEnd: true } });
  return subscriptionView({ ...sub, cancelAtPeriodEnd: true }, now);
}

const eventSchema = z.object({
  event: z.string(),
  created_at: z.number(),
  payload: z.object({
    subscription: z.object({
      entity: z.object({
        id: z.string(),
        status: z.enum(["created", "authenticated", "active", "pending", "halted", "cancelled", "completed", "expired"]),
        plan_id: z.string().nullish(),
        notes: z.record(z.string(), z.unknown()).or(z.array(z.unknown())).nullish(), // Razorpay sends [] when empty
        customer_id: z.string().nullish(),
        current_end: z.number().nullish(),
        start_at: z.number().nullish(),
      }),
    }).optional(),
  }),
});

/** Razorpay's subscription status in our terms. */
function mapStatus(entity: Pick<ProviderSubscription, "status" | "start_at">, now: Date): SubscriptionStatus {
  switch (entity.status) {
    case "active": return "active";
    // Authorised but not charged yet: a trial only if the first charge is set for later.
    case "authenticated": return entity.start_at && entity.start_at * 1000 > now.getTime() ? "trialing" : "none";
    case "pending": // a charge failed and is being retried
    case "halted": return "past_due"; // retries ran out
    case "cancelled": return "cancelled";
    case "completed":
    case "expired": return "expired";
    default: return "none";
  }
}

/**
 * POST /billing/webhook: the only place subscription status changes.
 * Verifies the signature, applies each event once, and ignores events older than one already applied.
 */
export async function handleWebhook(rawBody: string, signature: string | null, eventIdHeader: string | null, now = new Date()) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new ServiceError(503, "billing_unavailable", "Webhooks are not set up yet.");
  if (!validWebhookSignature(rawBody, signature, secret)) throw new ServiceError(400, "bad_signature", "Invalid webhook signature.");
  const event = eventSchema.parse(JSON.parse(rawBody));
  const entity = event.payload.subscription?.entity;
  const providerEventId = eventIdHeader ?? createHash("sha256").update(rawBody).digest("hex");

  await connectDb();
  const seen = await PaymentEventModel.findOneAndUpdate(
    { providerEventId },
    { $setOnInsert: { type: event.event, payload: entity ? { subscriptionId: entity.id, status: entity.status, currentEnd: entity.current_end ?? null } : {} } },
    { upsert: true, returnDocument: "before" },
  ).lean();
  if (seen?.processedAt) return { result: "duplicate" as const };

  let result: "applied" | "ignored" | "stale" = "ignored"; // not about a subscription we know
  let sub = entity && (await SubscriptionModel.findOne({ providerSubscriptionId: entity.id }));
  if (entity && !sub && entity.status === "active") {
    // Paid, but the learner restarted checkout meanwhile, so their record points at a newer unpaid
    // attempt. The userId we put in the notes at creation says whose money this is: adopt it.
    const userId = !Array.isArray(entity.notes) && typeof entity.notes?.userId === "string" ? entity.notes.userId : undefined;
    sub = userId ? await SubscriptionModel.findOne({ userId, status: "none" }) : null;
    if (sub) {
      sub.providerSubscriptionId = entity.id;
      sub.plan = PLAN_IDS.find((p) => process.env[PLANS[p].env] === entity.plan_id) ?? sub.plan;
      await sub.save();
    }
  }
  if (entity && sub) {
    const eventAt = new Date(event.created_at * 1000);
    if (sub.lastEventAt && eventAt < sub.lastEventAt) {
      result = "stale"; // webhooks can arrive out of order; never let an old one overwrite newer state
    } else {
      const status = mapStatus(entity, now);
      await SubscriptionModel.updateOne({ _id: sub._id }, {
        $set: {
          status,
          lastEventAt: eventAt,
          ...(entity.customer_id ? { providerCustomerId: entity.customer_id } : {}),
          ...(status === "trialing" && entity.start_at ? { currentPeriodEnd: new Date(entity.start_at * 1000) } : entity.current_end ? { currentPeriodEnd: new Date(entity.current_end * 1000) } : {}),
          ...(status === "cancelled" || status === "expired" ? { cancelAtPeriodEnd: false } : {}),
        },
      });
      result = "applied";
    }
  }
  await PaymentEventModel.updateOne({ providerEventId }, { $set: { processedAt: now } });
  return { result };
}

const paddleEventSchema = z.object({
  event_id: z.string(),
  event_type: z.string(),
  occurred_at: z.string(),
  data: z.object({
    id: z.string(),
    status: z.enum(["active", "canceled", "past_due", "paused", "trialing"]).optional(),
    customer_id: z.string().nullish(),
    custom_data: z.record(z.string(), z.unknown()).nullish(),
    items: z.array(z.object({ price: z.object({ id: z.string() }).nullish() })).nullish(),
    current_billing_period: z.object({ starts_at: z.string(), ends_at: z.string() }).nullish(),
    scheduled_change: z.object({ action: z.enum(["cancel", "pause", "resume"]), effective_at: z.string() }).nullish(),
    canceled_at: z.string().nullish(),
  }).passthrough(),
});

/** Paddle's subscription status in our terms. "canceled" is only sent once the cancellation has taken effect. */
const PADDLE_STATUS: Record<string, SubscriptionStatus> = { active: "active", trialing: "trialing", past_due: "past_due", paused: "expired", canceled: "cancelled" };

/**
 * POST /billing/paddle-webhook: Paddle's half of the only place subscription status changes.
 * Same rules as Razorpay's: verified signature, each event applied once, older events never overwrite newer ones.
 */
export async function handlePaddleWebhook(rawBody: string, signature: string | null, now = new Date()) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) throw new ServiceError(503, "billing_unavailable", "Webhooks are not set up yet.");
  if (!validPaddleSignature(rawBody, signature, secret, now.getTime())) throw new ServiceError(400, "bad_signature", "Invalid webhook signature.");
  const event = paddleEventSchema.parse(JSON.parse(rawBody));
  const sub = event.event_type.startsWith("subscription.") && event.data.status ? event.data : undefined;

  await connectDb();
  const seen = await PaymentEventModel.findOneAndUpdate(
    { providerEventId: event.event_id },
    { $setOnInsert: { type: event.event_type, payload: sub ? { subscriptionId: sub.id, status: sub.status, periodEnd: sub.current_billing_period?.ends_at ?? null } : {} } },
    { upsert: true, returnDocument: "before" },
  ).lean();
  if (seen?.processedAt) return { result: "duplicate" as const };

  let result: "applied" | "ignored" | "stale" = "ignored";
  let record = sub && (await SubscriptionModel.findOne({ providerSubscriptionId: sub.id }));
  const userId = typeof sub?.custom_data?.userId === "string" ? sub.custom_data.userId : undefined;
  if (sub && !record && userId) {
    // A subscription we have not seen: Paddle created it at checkout, carrying the learner's id we passed in.
    const existing = await SubscriptionModel.findOne({ userId });
    if (existing && isEntitled(existing, now)) {
      console.error("Paddle subscription for a learner who already has access; refund it by hand", { userId, subscription: sub.id });
    } else {
      const priceId = sub.items?.[0]?.price?.id;
      record = await SubscriptionModel.findOneAndUpdate(
        { userId },
        {
          $set: { provider: "paddle", providerSubscriptionId: sub.id, plan: PLAN_IDS.find((p) => process.env[PADDLE_PRICES[p]] === priceId) ?? "monthly", status: "none", cancelAtPeriodEnd: false },
          $unset: { currentPeriodEnd: 1, lastEventAt: 1, providerCustomerId: 1 },
        },
        { upsert: true, new: true },
      );
    }
  }
  if (sub && record) {
    const eventAt = new Date(event.occurred_at);
    if (record.lastEventAt && eventAt < record.lastEventAt) {
      result = "stale";
    } else {
      const status = PADDLE_STATUS[sub.status!];
      const periodEnd = status === "cancelled" ? sub.canceled_at ?? event.occurred_at : sub.current_billing_period?.ends_at;
      await SubscriptionModel.updateOne({ _id: record._id }, {
        $set: {
          status,
          lastEventAt: eventAt,
          cancelAtPeriodEnd: status !== "cancelled" && sub.scheduled_change?.action === "cancel",
          ...(sub.customer_id ? { providerCustomerId: sub.customer_id } : {}),
          ...(periodEnd ? { currentPeriodEnd: new Date(periodEnd) } : {}),
        },
      });
      result = "applied";
    }
  }
  await PaymentEventModel.updateOne({ providerEventId: event.event_id }, { $set: { processedAt: now } });
  return { result };
}
