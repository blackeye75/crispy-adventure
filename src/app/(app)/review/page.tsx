import type { Metadata } from "next";
import { Suspense } from "react";
import { ReviewSession } from "@/features/lesson-player/ReviewSession";
import { requireLearner } from "@/server/auth/session";
import { getDueReview } from "@/server/services/review";

export const metadata: Metadata = { title: "Review · Fretkey" };

async function Review() {
  const { viewer, profile } = await requireLearner("/review");
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
