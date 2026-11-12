import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LessonPlayer } from "@/features/lesson-player/LessonPlayer";
import { Button } from "@/components/ui/button";
import { requireLearner } from "@/server/auth/session";
import { getLesson } from "@/server/services/content";
import { getProgress } from "@/server/services/progress";

type Params = PageProps<"/learn/[slug]">["params"];

async function Lesson({ params }: { params: Params }) {
  const { slug } = await params;
  const { viewer, profile } = await requireLearner(`/learn/${slug}`);
  const result = await getLesson(slug, viewer);
  if (result.status === "not-found") notFound();
  if (result.status === "locked") {
    // The lesson content never reaches this page for a non-subscriber. The paywall arrives in Phase 4.
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-16">
        <p className="text-sm font-medium tracking-widest text-primary uppercase">Subscribers only</p>
        <h1 className="text-4xl">{result.title}</h1>
        <p className="text-lg text-muted-foreground">This lesson is part of the paid path. Level 1 is free to finish first.</p>
        <div><Button asChild size="lg"><Link href="/learn">Back to the path</Link></Button></div>
      </div>
    );
  }
  const progress = await getProgress(viewer.userId, slug);
  return <LessonPlayer key={slug} lesson={result.lesson} next={result.next} instrument={profile.instrument} startIndex={progress?.status === "started" ? progress.stepIndex : 0} />;
}

export default function LessonPage({ params }: { params: Params }) {
  return (
    <main className="flex-1">
      <Suspense fallback={<div className="mx-auto mt-16 h-96 w-full max-w-4xl animate-pulse rounded-2xl bg-muted" aria-hidden />}>
        <Lesson params={params} />
      </Suspense>
    </main>
  );
}
