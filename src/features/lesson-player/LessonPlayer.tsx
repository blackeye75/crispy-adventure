"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { STEP_KINDS, isQuiz, type Block, type Lesson } from "@/core/schemas/content";
import { stopAudio } from "@/features/audio/engine";
import { BuildQuiz, ChoiceQuiz, FindQuiz } from "@/features/drills/drills";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { useCompleted, useInstrument, type Instrument } from "@/lib/local-store";
import { cn } from "@/lib/utils";
import { AudioBlock, InstrumentBlock, PlayAlongBlock } from "./blocks";
import { Markdown } from "./Markdown";

const STEP_NAMES = { understand: "Understand", listen: "Listen", learn: "Learn", practice: "Practice" };

/** One renderer per block type. */
function BlockView({ block, instrument, onSolved }: { block: Block; instrument: Instrument; onSolved: (firstTry: boolean) => void }) {
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

type Props = { lesson: Lesson; next?: { slug: string; title: string } };

/** Full-screen lesson: four steps, one action per screen, one clear next step at the end. */
export function LessonPlayer({ lesson, next }: Props) {
  // Understand, Listen and Learn are one screen each; every Practice block gets its own.
  const screens = useMemo(
    () => lesson.steps.flatMap((step, s) => (step.kind === "practice" ? step.blocks.map((b) => ({ step: s, blocks: [b] })) : [{ step: s, blocks: step.blocks }])),
    [lesson],
  );
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<number, boolean>>({}); // screen → right first time
  const [instrument, setInstrument] = useInstrument();
  const [, complete] = useCompleted();

  const done = index >= screens.length;
  const screen = screens[Math.min(index, screens.length - 1)];
  const waiting = !done && screen.blocks.some(isQuiz) && !(index in results);
  const drills = screens.filter((s) => s.blocks.some(isQuiz)).length;
  const firstTry = Object.values(results).filter(Boolean).length;
  const inStep = screens.filter((s) => s.step === screen.step);

  const advance = () => {
    stopAudio();
    if (index === screens.length - 1) complete(lesson.slug);
    setIndex(index + 1);
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
            <div className="mx-auto flex w-full max-w-4xl justify-end">
              <Button size="lg" onClick={advance} disabled={waiting} className="max-sm:w-full">
                {index === screens.length - 1 ? "Finish" : "Continue"}
              </Button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
