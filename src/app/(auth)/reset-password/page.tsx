import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPassword } from "@/features/account/PasswordReset";

export const metadata: Metadata = { title: "Choose a new password · Fretkey" };

type Query = PageProps<"/reset-password">["searchParams"];

// The emailed link goes through Better Auth, which sends the learner here with ?token=… or ?error=INVALID_TOKEN.
async function Form({ searchParams }: { searchParams: Query }) {
  const { token, error } = await searchParams;
  return <ResetPassword token={typeof token === "string" ? token : undefined} invalid={Boolean(error)} />;
}

export default function Page({ searchParams }: { searchParams: Query }) {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense><Form searchParams={searchParams} /></Suspense>
    </main>
  );
}
