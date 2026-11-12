"use client";

import { Check, Circle, Lock } from "lucide-react";
import Link from "next/link";
import type { LessonSummary, Path } from "@/server/services/content";
import { Button } from "@/components/ui/button";
import { useCompleted, useInstrument } from "@/lib/local-store";

const LEVEL_NAMES = ["Foundations", "Building blocks", "Harmony basics", "Fluency on the instrument", "Colour and movement", "Advanced"];
const STRAND_NAMES: Partial<Record<LessonSummary["strand"], string>> = { guitar: "Guitar", piano: "Piano", ear: "Ear", rhythm: "Rhythm" };

/** Lessons a learner on this instrument is expected to take, in path order. */
function useProgress(path: Path) {
  const [completed] = useCompleted();
  const [instrument] = useInstrument();
  const other = instrument === "guitar" ? "piano" : "guitar";
  const mine = path.flatMap((t) => t.levels).flatMap((l) => l.modules).flatMap((m) => m.lessons.map((l) => ({ ...l, module: m.title })))
    .filter((l) => !l.locked && l.strand !== other);
  return { completed, mine, done: mine.filter((l) => completed.has(l.slug)).length, next: mine.find((l) => !completed.has(l.slug)) };
}

/** Home: the one thing to do next. */
export function HomeView({ path }: { path: Path }) {
  const { mine, done, next } = useProgress(path);
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 lg:py-16">
      <section className="flex flex-col gap-5 rounded-2xl border bg-card p-6 sm:p-8">
        {next ? (
          <>
            <p className="text-sm font-medium tracking-widest text-primary uppercase">{done ? "Continue" : "Start here"}</p>
            <h1 className="text-4xl">{next.title}</h1>
            <p className="text-muted-foreground">{next.module} · {next.minutes} min</p>
            <div><Button asChild size="lg"><Link href={`/learn/${next.slug}`}>{done ? "Continue" : "Start the first lesson"}</Link></Button></div>
          </>
        ) : (
          <>
            <p className="text-sm font-medium tracking-widest text-primary uppercase">All caught up</p>
            <h1 className="text-4xl">You have finished every lesson so far.</h1>
            <p className="text-muted-foreground">New modules are on the way. Until then, explore in the practice room.</p>
            <div><Button asChild size="lg"><Link href="/practice">Open the practice room</Link></Button></div>
          </>
        )}
      </section>
      <section className="flex flex-col gap-3" aria-label="Progress">
        <div className="flex justify-between text-sm text-muted-foreground"><span>Lessons completed</span><span className="tabular-nums">{done} of {mine.length}</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={mine.length} aria-valuenow={done}>
          <div className="h-full origin-left rounded-full bg-primary transition-transform duration-200 ease-out" style={{ transform: `scaleX(${mine.length ? done / mine.length : 0})` }} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button asChild variant="secondary"><Link href="/learn">See the whole path</Link></Button>
          {next && <Button asChild variant="ghost"><Link href="/practice">Practice room</Link></Button>}
        </div>
      </section>
    </div>
  );
}

/** The whole curriculum as a map: done, available, locked, and still to come. */
export function PathView({ path }: { path: Path }) {
  const { completed } = useProgress(path);
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 py-10 lg:py-16">
      <h1 className="text-4xl">Your path</h1>
      {path.flatMap((track) => track.levels).map((level) => (
        <section key={level.level} className="flex flex-col gap-4">
          <h2 className="text-2xl">
            <span className="text-primary">Level {level.level}</span> · {LEVEL_NAMES[level.level - 1]}
            {level.isFree && <span className="ml-3 rounded-full border px-2.5 py-0.5 align-middle font-sans text-xs tracking-normal text-muted-foreground">Free</span>}
          </h2>
          {level.modules.map((m) => (
            <div key={m.slug} className="rounded-xl border bg-card p-5">
              <h3 className="font-sans text-lg font-medium tracking-normal">{m.title}</h3>
              <p className="text-sm text-muted-foreground">{m.summary}</p>
              {m.lessons.length === 0 ? (
                <p className="pt-3 text-sm text-muted-foreground">Coming soon</p>
              ) : (
                <ol className="flex flex-col pt-3">
                  {m.lessons.map((lesson) => {
                    const state = lesson.locked ? "Locked" : completed.has(lesson.slug) ? "Completed" : "Not started";
                    return (
                      <li key={lesson.slug}>
                        <Link href={`/learn/${lesson.slug}`} className="-mx-2 flex min-h-12 items-center gap-3 rounded-md px-2 outline-none transition-colors duration-150 hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">
                          {state === "Locked" ? <Lock className="size-5 text-muted-foreground" aria-hidden /> : state === "Completed" ? <Check className="size-5 text-success" aria-hidden /> : <Circle className="size-5 text-muted-foreground" aria-hidden />}
                          <span className="flex-1">{lesson.title}<span className="sr-only">, {state}</span></span>
                          {STRAND_NAMES[lesson.strand] && <span className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">{STRAND_NAMES[lesson.strand]}</span>}
                          <span className="text-sm text-muted-foreground tabular-nums">{lesson.minutes} min</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
