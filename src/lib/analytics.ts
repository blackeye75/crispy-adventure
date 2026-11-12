// Privacy-friendly analytics (Plausible: no cookies, no personal data). Does nothing unless
// NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set and the script in the root layout has loaded.
type Event = "Sign up" | "Lesson complete" | "Checkout started";

export function track(event: Event, props?: Record<string, string>) {
  (window as { plausible?: (event: string, options?: { props?: Record<string, string> }) => void }).plausible?.(event, props && { props });
}

/** Report an error to Sentry when it is configured; the SDK is only downloaded in that case. */
export function reportError(error: unknown) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) void import("@sentry/nextjs").then((Sentry) => Sentry.captureException(error));
}
