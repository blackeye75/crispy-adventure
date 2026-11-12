import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthForm } from "@/features/account/AuthForm";
import { googleEnabled } from "@/server/auth/auth";
import { getViewer, safeNext } from "@/server/auth/session";

export const metadata: Metadata = { title: "Create account · Fretkey" };

type Query = PageProps<"/sign-up">["searchParams"];

async function Form({ searchParams }: { searchParams: Query }) {
  const next = safeNext((await searchParams).next);
  if (await getViewer()) redirect(next);
  return <AuthForm mode="sign-up" next={next} google={googleEnabled()} />;
}

export default function Page({ searchParams }: { searchParams: Query }) {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense>
        <Form searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
