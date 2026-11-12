"use client";

import { Flame, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { STEP_KINDS, isQuiz, type Block, type Lesson } from "@/core/schemas/content";
import { stopAudio } from "@/features/audio/engine";
import { BuildQuiz, ChoiceQuiz, FindQuiz } from "@/features/drills/drills";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import type { Instrument } from "@/core/schemas/api";
import { track } from "@/lib/analytics";
import { api } from "@/lib/api";
import type { Today } from "@/server/services/profile";
import { cn } from "@/lib/utils";
import { AudioBlock, InstrumentBlock, PlayAlongBlock } from "./blocks";
import { Markdown } from "./Markdown";

const STEP_NAMES = { understand: "Understand", listen: "Listen", learn: "Learn", practice: "Practice" };

/** One renderer per block type. */
export function BlockView({ block, instrument, onSolved }: { block: Block; instrument: Instrument; onSolved: (firstTry: boolean) => void }) {
  switch (block.type) {
    case "text": return <Markdown>{block.markdown}</Markdown>;
    case "audio": return <AudioBlock block={block} />;
    case "instrument": return <InstrumentBlock block={block} instrument={instrument} />;
    case "play-along": return <PlayAlongBlock block={block} instrument={instrument} />;
    case "quiz-choice":
    case "quiz-ear": return <ChoiceQuiz block={block} onSolved={onSolved} />;
    case "quiz-find": return <FindQuiz block={block} instrument={instrument} onSolved={onSolved} />;
    case "quiz-build": return <BuildQuiz block={block} instrument={instrument} onSolved={onSolved} />;
  }
}

type Props = {
  lesson: Lesson;
  next?: { slug: string; title: string };
  /** From the learner's profile. */
  instrument: Instrument;
  /** Screen to resume at, when the lesson was left part-way. */
  startIndex?: number;
};

/** Full-screen lesson: four steps, one action per screen, one clear next step at the end. */
export function LessonPlayer({ lesson, next, instrument: initialInstrument, startIndex = 0 }: Props) {
  // Understand, Listen and Learn are one screen each; every Practice block gets its own.
  const screens = useMemo(
    () => lesson.steps.flatMap((step, s) => (step.kind === "practice" ? step.blocks.map((b) => ({ step: s, blocks: [b] })) : [{ step: s, blocks: step.blocks }])),
    [lesson],
  );
  const [index, setIndex] = useState(Math.min(startIndex, screens.length - 1));
  const [results, setResults] = useState<Record<number, boolean>>({}); // screen → right first time
  const [instrument, setInstrumentState] = useState(initialInstrument);
  const [today, setToday] = useState<Today | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const done = index >= screens.length;
  const screen = screens[Math.min(index, screens.length - 1)];
  const waiting = !done && screen.blocks.some(isQuiz) && !(index in results);
  const drills = screens.filter((s) => s.blocks.some(isQuiz)).length;
  const firstTry = Object.values(results).filter(Boolean).length;
  const inStep = screens.filter((s) => s.step === screen.step);

  const setInstrument = (value: Instrument) => {
    setInstrumentState(value);
    api("/me", { method: "PATCH", body: { instrument: value } }).catch(() => {}); // remembered next time if it saved; harmless if not
  };

  const advance = async () => {
    stopAudio();
    if (index < screens.length - 1) {
      setIndex(index + 1);
      // Position is a convenience; losing one save only costs the resume point.
      api("/progress", { method: "POST", body: { lessonSlug: lesson.slug, stepIndex: index + 1 } }).catch(() => {});
      return;
    }
    // Completion matters: stay on this screen until it is saved.
    setSaving(true);
    setError(undefined);
    try {
      const saved = await api<{ today: Today }>("/progress", {
        method: "POST",
        body: { lessonSlug: lesson.slug, stepIndex: index, completed: true, drills: { answered: drills, correct: firstTry } },
      });
      setToday(saved.today);
      track("Lesson complete", { lesson: lesson.slug });
      setIndex(index + 1);
    } catch (err) {
      setError(`${(err as Error).message} Your lesson is not saved yet.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background">
      <header className="sticky top-0 z-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-b bg-background px-4 py-3 lg:px-8">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/learn" aria-label="Leave lesson"><X /></Link>
        </Button>
        <ol className="order-last flex w-full gap-2 sm:order-none sm:w-auto sm:flex-1" aria-label="Lesson steps">
          {STEP_KINDS.map((kind, s) => {
            const fill = done || s < screen.step ? 1 : s > screen.step ? 0 : (inStep.indexOf(screen) + 1) / (inStep.length + 1);
            return (
              <li key={kind} className="flex flex-1 flex-col gap-1.5" aria-current={!done && s === screen.step ? "step" : undefined}>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full origin-left rounded-full bg-primary transition-transform duration-200 ease-out" style={{ transform: `scaleX(${fill})` }} />
                </div>
                <span className={cn("text-xs", !done && s === screen.step ? "font-medium text-foreground" : "text-muted-foreground")}>{STEP_NAMES[kind]}</span>
              </li>
            );
          })}
        </ol>
        <div className="ml-auto">
          <Segmented label="Instrument" value={instrument} options={[["guitar", "Guitar"], ["piano", "Piano"]]} onChange={setInstrument} />
        </div>
      </header>

      {done ? (
        <main className="step-in mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-12">
          <p className="text-sm font-medium tracking-widest text-primary uppercase">Lesson complete</p>
          <h1 className="text-4xl">{lesson.title}</h1>
          <p className="text-lg text-muted-foreground">{firstTry} of {drills} drills right first time.</p>
          {today && (
            <p className="step-in flex items-center gap-2 text-lg">
              <Flame className="pop text-primary" aria-hidden />
              <span><strong>{today.streak}-day streak.</strong> {today.minutes} of {today.goalMinutes} minutes today.</span>
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {next && <Button asChild size="lg"><Link href={`/learn/${next.slug}`}>Next: {next.title}</Link></Button>}
            <Button asChild size="lg" variant={next ? "ghost" : "default"}><Link href="/learn">Back to the path</Link></Button>
          </div>
        </main>
      ) : (
        <>
          {/* key: new screen, fresh block state and the step transition */}
          <main key={`${index}-${instrument}`} className="step-in mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 lg:py-12">
            {index === 0 && <h1 className="text-4xl">{lesson.title}</h1>}
            {screen.blocks.map((block, i) => (
              <BlockView key={i} block={block} instrument={instrument} onSolved={(first) => setResults((r) => (index in r ? r : { ...r, [index]: first }))} />
            ))}
          </main>
          <footer className="sticky bottom-0 border-t bg-background px-4 py-3 lg:px-8">
            <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-end gap-3">
              {error && <p role="alert" className="flex-1 text-destructive">{error}</p>}
              <Button size="lg" onClick={advance} disabled={waiting || saving} className="max-sm:w-full">
                {error ? "Try again" : index === screens.length - 1 ? "Finish" : "Continue"}
              </Button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
