"use client";

import { useState } from "react";
import { DAILY_GOALS, type Instrument } from "@/core/schemas/api";
import { soundSteps, type BlockOf } from "@/core/schemas/content";
import { PlayButton } from "@/features/lesson-player/PlayButton";
import { Button } from "@/components/ui/button";
import { api, hardNavigate } from "@/lib/api";
import { cn } from "@/lib/utils";

type Level = "beginner" | "intermediate" | "advanced";
type Question = { lessonSlug: string; blockIndex: number; block: BlockOf<"quiz-choice"> | BlockOf<"quiz-ear"> };
type Answer = { lessonSlug: string; blockIndex: number; answer: number };
type Prefs = { instrument: Instrument; level: Level; dailyGoalMinutes: number };

const LEVELS: [Level, string, string][] = [
  ["beginner", "New to theory", "Start from the first lesson."],
  ["intermediate", "I know some", "Take a short quiz and skip what you know."],
  ["advanced", "I know a lot", "Take a short quiz and skip what you know."],
];

const card = "flex min-h-14 flex-col justify-center rounded-lg border bg-card px-5 py-3 text-left outline-none transition-colors duration-150 hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50";
const chosen = "border-primary bg-accent";

function Choice<T extends string | number>({ legend, value, options, onChange }: { legend: string; value: T; options: [T, string, string?][]; onChange: (v: T) => void }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="pb-3 text-xl">{legend}</legend>
      <div className="grid gap-3 sm:grid-flow-col sm:auto-cols-fr">
        {options.map(([id, title, detail]) => (
          <button key={id} type="button" aria-pressed={id === value} onClick={() => onChange(id)} className={cn(card, id === value && chosen)}>
            <span className="text-lg font-medium">{title}</span>
            {detail && <span className="text-sm text-muted-foreground">{detail}</span>}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** First run: pick instrument, level and daily goal; anyone past beginner takes the placement quiz. */
export function OnboardingFlow({ initial }: { initial: Prefs }) {
  const [prefs, setPrefs] = useState(initial);
  const [questions, setQuestions] = useState<Question[]>();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [asked, setAsked] = useState(0);
  const [skipped, setSkipped] = useState<number>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  /** Run a save; on failure stay put and say why. */
  const run = async (work: () => Promise<void>) => {
    setBusy(true);
    setError(undefined);
    try {
      await work();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const home = () => hardNavigate("/dashboard");

  const save = () => run(async () => {
    await api("/me", { method: "PATCH", body: { ...prefs, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone } });
    if (prefs.level === "beginner") return home();
    const placement = await api<Question[]>("/placement");
    if (!placement.length) return home();
    setQuestions(placement);
  });

  const answer = (choice?: number) => {
    const q = questions![asked];
    const all = choice === undefined ? answers : [...answers, { lessonSlug: q.lessonSlug, blockIndex: q.blockIndex, answer: choice }];
    setAnswers(all);
    if (asked < questions!.length - 1) return setAsked(asked + 1);
    void run(async () => setSkipped((await api<{ skippedLessons: number }>("/placement", { method: "POST", body: { answers: all } })).skippedLessons));
  };

  const shell = "mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-4 py-12";

  if (skipped !== undefined) {
    return (
      <div className={cn(shell, "step-in")}>
        <p className="text-sm font-medium tracking-widest text-primary uppercase">You are set</p>
        <h1 className="text-4xl">{skipped ? `You can skip ${skipped} ${skipped === 1 ? "lesson" : "lessons"}.` : "Starting from the first lesson."}</h1>
        <p className="text-lg text-muted-foreground">
          {skipped ? "They are marked as done, and their ideas will come back in review so nothing slips." : "A solid start never hurts. You can move quickly through anything familiar."}
        </p>
        <div><Button size="lg" onClick={home}>Go to your home</Button></div>
      </div>
    );
  }

  if (questions) {
    const q = questions[asked];
    return (
      <div key={asked} className={cn(shell, "step-in")}>
        <p className="text-sm text-muted-foreground" aria-live="polite">Question {asked + 1} of {questions.length}</p>
        <h1 className="font-sans text-2xl font-normal tracking-normal">{q.block.prompt}</h1>
        {q.block.sound && <PlayButton steps={soundSteps(q.block.sound)} label="Listen" bpm={"bpm" in q.block.sound ? q.block.sound.bpm : undefined} variant="default" />}
        <div className="flex flex-col gap-3">
          {q.block.options.map((option, i) => <button key={i} type="button" disabled={busy} onClick={() => answer(i)} className={cn(card, "text-lg")}>{option}</button>)}
          <Button variant="ghost" disabled={busy} onClick={() => answer()}>I do not know</Button>
        </div>
        {error && <p role="alert" className="text-destructive">{error} <button type="button" className="underline" onClick={() => answer()}>Try again</button></p>}
      </div>
    );
  }

  return (
    <div className={shell}>
      <h1 className="text-4xl">Set up your path</h1>
      <Choice legend="Which instrument do you play?" value={prefs.instrument} options={[["guitar", "Guitar"], ["piano", "Piano"]]} onChange={(instrument) => setPrefs({ ...prefs, instrument })} />
      <Choice legend="How much music theory do you know?" value={prefs.level} options={LEVELS} onChange={(level) => setPrefs({ ...prefs, level })} />
      <Choice legend="Daily goal" value={prefs.dailyGoalMinutes} options={DAILY_GOALS.map((n) => [n, `${n} min`] as [number, string])} onChange={(dailyGoalMinutes) => setPrefs({ ...prefs, dailyGoalMinutes })} />
      {error && <p role="alert" className="text-destructive">{error}</p>}
      <div><Button size="lg" onClick={save} disabled={busy}>Continue</Button></div>
    </div>
  );
}
