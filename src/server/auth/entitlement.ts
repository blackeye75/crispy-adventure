import type { Subscription } from "../db/models";

/**
 * Does this subscription unlock paid content right now?
 * Active and trialing do. A cancelled or past-due plan keeps access until the period already paid for ends.
 */
export function isEntitled(sub: Pick<Subscription, "status" | "currentPeriodEnd"> | null | undefined, now: Date): boolean {
  if (!sub) return false;
  if (sub.status === "active" || sub.status === "trialing") return true;
  if (sub.status === "cancelled" || sub.status === "past_due") return Boolean(sub.currentPeriodEnd && sub.currentPeriodEnd > now);
  return false;
}
