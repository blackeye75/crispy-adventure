import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Paywall } from "@/features/billing/billing";
import { requireLearner, safeNext } from "@/server/auth/session";
import { getAllPlans } from "@/server/services/billing";

export const metadata: Metadata = { title: "Subscribe · Fretkey" };

type Query = PageProps<"/subscribe">["searchParams"];

async function Plans({ searchParams }: { searchParams: Query }) {
  const next = safeNext((await searchParams).next);
  const { viewer } = await requireLearner(`/subscribe?next=${encodeURIComponent(next)}`);
  if (viewer.subscriber) redirect(next);
  // Vercel sets the visitor's country; India pays through Razorpay, everyone else through Paddle. The learner can switch.
  const region = (await headers()).get("x-vercel-ip-country") === "IN" ? "razorpay" : "paddle";
  return <Paywall plans={await getAllPlans()} next={next} region={region} />;
}

export default function SubscribePage({ searchParams }: { searchParams: Query }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-12">
      <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-muted" aria-hidden />}>
        <Plans searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
