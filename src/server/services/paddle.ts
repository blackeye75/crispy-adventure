// The only file that talks to Paddle, the merchant of record for learners outside India. Paddle collects the
// payment and the sales tax or VAT; card details never pass through or get stored here.
// Formats follow Paddle's own SDK (@paddle/paddle-node-sdk 3.x): Bearer API key, "Paddle-Signature: ts=…;h1=…".
import { createHmac, timingSafeEqual } from "node:crypto";
import { ServiceError } from "../api";
import type { PlanId, PlanPrice } from "./razorpay";

// Each plan is a Paddle price id in the environment; the price shown is read from Paddle, so it matches the charge.
export const PADDLE_PRICES: Record<PlanId, string> = { monthly: "PADDLE_PRICE_MONTHLY", yearly: "PADDLE_PRICE_YEARLY" };

export const paddleEnvironment = () => (process.env.PADDLE_ENV === "sandbox" ? "sandbox" : "production");
const baseUrl = () => process.env.PADDLE_API_URL ?? (paddleEnvironment() === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com");

async function call<T>(path: string, body?: unknown): Promise<T> {
  const key = process.env.PADDLE_API_KEY;
  if (!key) throw new ServiceError(503, "billing_unavailable", "Payments are not set up yet.");
  const unreachable = new ServiceError(502, "provider_error", "The payment provider could not be reached. Try again in a moment.");
  const res = await fetch(`${baseUrl()}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  }).catch((err) => {
    console.error("Paddle unreachable", err);
    throw unreachable;
  });
  if (!res.ok) {
    console.error("Paddle error", res.status, path, await res.text().catch(() => ""));
    throw unreachable;
  }
  return ((await res.json()) as { data: T }).data;
}

/** Stop renewing at the end of the period already paid for. */
export function cancelPaddleAtPeriodEnd(subscriptionId: string) {
  return call(`/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, { effective_from: "next_billing_period" });
}

let priceCache: { at: number; prices: PlanPrice[] } | undefined;

/** The Paddle plans on sale with their live prices (smallest currency unit), cached for ten minutes. */
export async function getPaddlePlans(now = Date.now()): Promise<PlanPrice[]> {
  if (priceCache && now - priceCache.at < 600_000) return priceCache.prices;
  const prices = await Promise.all(
    (Object.keys(PADDLE_PRICES) as PlanId[]).filter((plan) => process.env[PADDLE_PRICES[plan]]).map(async (plan) => {
      const { unit_price } = await call<{ unit_price: { amount: string; currency_code: string } }>(`/prices/${process.env[PADDLE_PRICES[plan]]}`);
      return { provider: "paddle" as const, plan, amount: Number(unit_price.amount), currency: unit_price.currency_code };
    }),
  );
  priceCache = { at: now, prices };
  return prices;
}

/**
 * Paddle signs `${ts}:${rawBody}` with the endpoint's secret key: HMAC-SHA256, hex, sent as "ts=…;h1=…".
 * A signature more than five seconds old is refused, as in Paddle's SDK, so a captured request cannot be replayed.
 */
export function validPaddleSignature(rawBody: string, header: string | null, secret: string, now = Date.now()): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(";").map((part) => part.split("=") as [string, string]));
  const ts = Number(parts.ts);
  if (!Number.isFinite(ts) || !parts.h1 || Math.abs(now - ts * 1000) > 5_000) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(`${ts}:${rawBody}`).digest("hex"));
  const given = Buffer.from(parts.h1);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
