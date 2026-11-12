// The only file that talks to Razorpay. Card and UPI details never pass through or get stored here.
import { createHmac, timingSafeEqual } from "node:crypto";
import { ServiceError } from "../api";

// Pricing is configuration: each plan is a Razorpay plan id in the environment, and the price
// shown to the learner is read from that plan, so it can never differ from what is charged.
// `cycles` is how many billing cycles a subscription runs before it completes.
export const PLANS = {
  monthly: { env: "RAZORPAY_PLAN_MONTHLY", cycles: 120 },
  yearly: { env: "RAZORPAY_PLAN_YEARLY", cycles: 10 },
} as const;
export type PlanId = keyof typeof PLANS;
export const PLAN_IDS = Object.keys(PLANS) as [PlanId, ...PlanId[]];

export const razorpayKeyId = () => process.env.RAZORPAY_KEY_ID;

async function call<T>(path: string, body?: unknown): Promise<T> {
  const key = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key || !secret) throw new ServiceError(503, "billing_unavailable", "Payments are not set up yet.");
  const unreachable = new ServiceError(502, "provider_error", "The payment provider could not be reached. Try again in a moment.");
  const res = await fetch(`${process.env.RAZORPAY_API_URL ?? "https://api.razorpay.com/v1"}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`, "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  }).catch((err) => {
    console.error("Razorpay unreachable", err);
    throw unreachable;
  });
  if (!res.ok) {
    console.error("Razorpay error", res.status, path, await res.text().catch(() => ""));
    throw unreachable;
  }
  return (await res.json()) as T;
}

export type ProviderSubscription = {
  id: string;
  status: "created" | "authenticated" | "active" | "pending" | "halted" | "cancelled" | "completed" | "expired";
  plan_id?: string;
  customer_id?: string | null;
  current_end?: number | null; // unix seconds
  start_at?: number | null;
};

export function createSubscription(plan: PlanId, userId: string): Promise<ProviderSubscription> {
  const planId = process.env[PLANS[plan].env];
  if (!planId) throw new ServiceError(503, "billing_unavailable", "That plan is not available yet.");
  return call("/subscriptions", { plan_id: planId, total_count: PLANS[plan].cycles, customer_notify: 1, notes: { userId } });
}

/** Stop renewing; the learner keeps what they paid for until the cycle ends. */
export function cancelAtCycleEnd(subscriptionId: string): Promise<ProviderSubscription> {
  return call(`/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, { cancel_at_cycle_end: 1 });
}

export type PlanPrice = { plan: PlanId; amount: number; currency: string }; // amount in the currency's smallest unit (paise)

let priceCache: { at: number; prices: PlanPrice[] } | undefined;

/** The plans on sale with their live prices, cached for ten minutes. */
export async function getPlans(now = Date.now()): Promise<PlanPrice[]> {
  if (priceCache && now - priceCache.at < 600_000) return priceCache.prices;
  const prices = await Promise.all(
    PLAN_IDS.filter((plan) => process.env[PLANS[plan].env]).map(async (plan) => {
      const { item } = await call<{ item: { amount: number; currency: string } }>(`/plans/${process.env[PLANS[plan].env]}`);
      return { plan, amount: item.amount, currency: item.currency };
    }),
  );
  priceCache = { at: now, prices };
  return prices;
}

/** Razorpay signs the raw request body with the webhook secret: HMAC-SHA256, hex. */
export function validWebhookSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"));
  const given = Buffer.from(signature);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
