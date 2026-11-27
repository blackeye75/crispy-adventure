// Facts about the business that appear in more than one place.
export const SITE = {
  name: "Fretkey",
  description: "Learn music theory on your instrument. Understand it, hear it, see it on the fretboard or keyboard, then play it.",
  url: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  /** Shown on the policy pages. Set NEXT_PUBLIC_SUPPORT_EMAIL before launch. */
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "",
};

/** "₹50" from 5000 paise. */
export const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: amount % 100 ? 2 : 0 }).format(amount / 100);

export const INSTAGRAM_URL = "https://www.instagram.com/fret.key/";

/**
 * Landing-only mode, for hosting the landing page before the full product goes live (no database, no sign-in).
 * Set NEXT_PUBLIC_LANDING_ONLY=1 on the host; remove it to launch the app. Read at build time.
 */
export const LANDING_ONLY = process.env.NEXT_PUBLIC_LANDING_ONLY === "1";

/** The pages that work without a database: the landing page and the policies. Everything else waits for launch. */
export const landingOnlyAllows = (pathname: string) => ["/", "/privacy", "/terms", "/refunds"].includes(pathname.replace(/\/$/, "") || "/");
