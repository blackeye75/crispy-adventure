import type { Metadata } from "next";
import { Policy } from "@/features/marketing/Policy";

export const metadata: Metadata = { title: "Terms of use · Fretkey" };

export default function TermsPage() {
  return (
    <Policy title="Terms of use" updated="24 November 2026" sections={[
      ["The service", `
Fretkey teaches music theory through interactive lessons for guitar and piano. Level 1 and the practice room are free. The other levels and daily review need a paid subscription.`],
      ["Your account", `
- Give a real email address and keep your password to yourself.
- One account is for one person. Do not share it or resell access.
- You are responsible for what happens under your account.`],
      ["Subscriptions", `
- A subscription renews automatically, monthly or yearly, until you cancel.
- The price is shown before you pay. If a price changes, we will tell you before your next renewal.
- You can cancel at any time in Settings. You keep access until the end of the period you have paid for, and you are not charged again.
- Refunds are covered by the refund policy.
- **Outside India**, our order process is conducted by our online reseller Paddle.com. Paddle.com is the merchant of record for those orders: it sells you the subscription, charges any sales tax or VAT, and handles billing questions and refunds for them. In India, Fretkey sells directly and payments are processed by Razorpay.`],
      ["Fair use", `
- Do not copy, scrape or republish the lessons.
- Do not try to break, overload or get around the service or its paywall.
- We may suspend an account that does either.`],
      ["Our content", `
The lessons, exercises, study pieces and software belong to Fretkey. Your subscription lets you use them for your own learning.`],
      ["No guarantees", `
We work to keep lessons accurate and the service running, but it is provided as it is. We do not promise that it will always be available or free of mistakes. To the extent the law allows, our liability to you is limited to what you paid us in the twelve months before the claim.`],
      ["Ending", `
You can stop using Fretkey and ask us to delete your account at any time. We may close an account that breaks these terms.`],
      ["Law", `
These terms are governed by the laws of India.`],
    ]} />
  );
}
