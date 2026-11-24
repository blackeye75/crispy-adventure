import type { Metadata } from "next";
import { ForgotPassword } from "@/features/account/PasswordReset";

export const metadata: Metadata = { title: "Forgot password · Fretkey" };

export default function Page() {
  return <main className="flex flex-1 flex-col"><ForgotPassword /></main>;
}
