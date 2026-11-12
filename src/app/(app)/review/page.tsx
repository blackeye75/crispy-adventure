import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ReviewSession } from "@/features/lesson-player/ReviewSession";
import { requireLearner } from "@/server/auth/session";
import { getDueReview } from "@/server/services/review";

export const metadata: Metadata = { title: "Review · Fretkey" };

async function Review() {
  const { viewer, profile } = await requireLearner("/review");
  if (!viewer.subscriber) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-5 px-4 py-16">
        <p className="text-sm font-medium tracking-widest text-primary uppercase">Subscribers only</p>
        <h1 className="text-4xl">Review brings back what you are about to forget.</h1>
        <p className="text-lg text-muted-foreground">Every idea from the lessons you finish is already queued. Subscribe and they return at the right moment.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg"><Link href="/subscribe?next=/review">See plans</Link></Button>
          <Button asChild size="lg" variant="ghost"><Link href="/dashboard">Back to home</Link></Button>
        </div>
      </div>
    );
  }
  return <ReviewSession drills={await getDueReview(viewer)} instrument={profile.instrument} />;
}

export default function ReviewPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense fallback={<div className="mx-auto mt-16 h-96 w-full max-w-4xl animate-pulse rounded-2xl bg-muted" aria-hidden />}>
        <Review />
      </Suspense>
    </main>
  );
}
