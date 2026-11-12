// Browser error reporting. The Sentry SDK is fetched only when a DSN is configured, after the
// page is interactive, so it never costs first paint.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  void import("@sentry/nextjs").then((Sentry) => Sentry.init({ dsn, tracesSampleRate: 0.1 }));
}
