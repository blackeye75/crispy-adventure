import type { Metadata } from "next";
import { Policy } from "@/features/marketing/Policy";

export const metadata: Metadata = { title: "Cancellation and refunds · Fretkey" };

export default function RefundsPage() {
  return (
    <Policy title="Cancellation and refunds" updated="12 November 2026" sections={[
      ["Cancelling", `
Cancel at any time in Settings. Your subscription stops renewing, you keep access until the end of the period you have already paid for, and you are not charged again.`],
      ["Refunds", `
- **First payment:** if Fretkey is not for you, write to us within 7 days of your first payment and we will refund it in full.
- **Renewals:** renewal payments are not refunded, in whole or in part. Cancel before the renewal date to avoid the next charge.
- **Charged by mistake:** if you were charged twice or after cancelling, write to us and we will refund the extra charge.`],
      ["How refunds are paid", `
Refunds go back to the original payment method through Razorpay. They usually arrive within 5 to 7 working days, depending on your bank.`],
    ]} />
  );
}
