import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LessonPlayer } from "@/features/lesson-player/LessonPlayer";
import { Button } from "@/components/ui/button";
import { requireLearner } from "@/server/auth/session";
import { getLesson, lessonsBefore } from "@/server/services/content";
import { getProgress } from "@/server/services/progress";

type Params = PageProps<"/learn/[slug]">["params"];

async function Lesson({ params }: { params: Params }) {
  const { slug } = await params;
  const { viewer, profile } = await requireLearner(`/learn/${slug}`);
  const result = await getLesson(slug, viewer);
  if (result.status === "not-found") notFound();
  if (result.status === "locked") {
    // The lesson content never reaches this page for a non-subscriber.
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-16">
        <p className="text-sm font-medium tracking-widest text-primary uppercase">Subscribers only</p>
        <h1 className="text-4xl">{result.title}</h1>
        <p className="text-lg text-muted-foreground">This lesson is part of the paid path. Level 1 stays free.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg"><Link href={`/subscribe?next=${encodeURIComponent(`/learn/${slug}`)}`}>See plans</Link></Button>
          <Button asChild size="lg" variant="ghost"><Link href="/learn">Back to the path</Link></Button>
        </div>
      </div>
    );
  }
  const [progress, before] = await Promise.all([getProgress(viewer.userId, slug), lessonsBefore(result.lesson, viewer)]);
  return (
    <>
      {before.length > 0 && (
        // A soft gate: experienced players may carry on, but they are told what this lesson assumes.
        <aside className="mx-auto mt-6 w-full max-w-4xl rounded-xl border border-primary/40 bg-card px-5 py-4 text-sm" aria-label="Lessons this one builds on">
          <p className="font-medium">This lesson builds on {before.length === 1 ? "a lesson" : `${before.length} lessons`} you have not done yet:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {before.map((b) => <li key={b.slug}><Link href={`/learn/${b.slug}`} className="inline-flex min-h-11 items-center rounded-full border px-4 underline-offset-4 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none">{b.title}</Link></li>)}
          </ul>
          <p className="mt-2 text-muted-foreground">You can carry on, but those first will make this one easier.</p>
        </aside>
      )}
      <LessonPlayer key={slug} lesson={result.lesson} next={result.next} instrument={profile.instrument} leftHanded={profile.leftHanded} noteNaming={profile.noteNaming} startIndex={progress?.status === "started" ? progress.stepIndex : 0} />
    </>
  );
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
