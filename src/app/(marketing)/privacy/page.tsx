import type { Metadata } from "next";
import { Policy } from "@/features/marketing/Policy";

export const metadata: Metadata = { title: "Privacy policy · Fretkey" };

// Keep this in step with what the code actually stores: see src/server/db/models.ts.
export default function PrivacyPage() {
  return (
    <Policy title="Privacy policy" updated="12 November 2026" sections={[
      ["What we collect", `
- **Account:** your name, email address and a scrambled (hashed) form of your password. If you sign in with Google, we receive your name, email address and profile picture from Google instead of a password.
- **Learning:** your instrument, level and daily goal, your time zone, the lessons you have started and finished, your drill results, your review schedule, and how many minutes you practise each day.
- **Subscription:** which plan you are on, its status and renewal date, and the identifiers Razorpay gives us for your subscription.
- **Technical:** a sign-in cookie that keeps you logged in, and for each session your IP address and browser type.`],
      ["What we never hold", `
Payments are handled by Razorpay. Your card number, UPI ID and bank details go straight to Razorpay; Fretkey never sees or stores them.`],
      ["How we use it", `
- To run your account and save your progress.
- To choose what you review and when.
- To take payment for a subscription and unlock paid lessons.
- To find and fix errors, and to understand in aggregate which lessons people finish.

We do not sell your data, and we do not show advertising.`],
      ["Who else is involved", `
- **Razorpay** processes payments.
- **MongoDB Atlas** stores the database, in its Mumbai region.
- **Vercel** hosts the website.
- **Google**, only if you choose to sign in with Google.
- **Sentry** receives error reports, which can include the page you were on and your browser type.
- **Plausible** counts page views without cookies and without identifying you.`],
      ["Cookies", `
Fretkey sets one kind of cookie: the one that keeps you signed in. There are no advertising or tracking cookies.`],
      ["Keeping and deleting", `
We keep your data for as long as you have an account. Write to us to get a copy of your data, to correct it, or to delete your account and everything linked to it. Records we must keep by law, such as payment records, are kept for as long as the law requires.`],
      ["Children", `
Fretkey is not aimed at children under 13. If you are under 18, use it with a parent or guardian's permission.`],
      ["Changes", `
If this policy changes in a way that matters, we will tell you by email or in the app before it takes effect.`],
    ]} />
  );
}
