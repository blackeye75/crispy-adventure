"use client";

import { Check, Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EAR_MODES, earQuestion, type EarMode, type EarQuestion } from "@/core/theory/ear";
import { playNotes, playSteps, preloadAudio, stopAudio } from "@/features/audio/engine";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";

const MODE_NAMES: Record<EarMode, string> = { interval: "Intervals", chord: "Chords", scale: "Scales" };
const PROMPTS: Record<EarMode, string> = { interval: "Which interval is this?", chord: "Which chord is this?", scale: "Which scale is this?" };

/** Free ear practice: listen, choose, get the answer and the reason at once, and go again. */
export function EarTrainer() {
  const [mode, setMode] = useState<EarMode>("interval");
  const [question, setQuestion] = useState<EarQuestion>(); // made on the first tap, so server and browser render the same page
  const [picked, setPicked] = useState<number[]>([]);
  const [score, setScore] = useState({ asked: 0, right: 0, streak: 0 });
  useEffect(() => {
    preloadAudio();
    return stopAudio;
  }, []);

  const solved = question !== undefined && picked.includes(question.answer);
  const play = (q: EarQuestion) => playSteps(q.steps, { bpm: 80, onStep: () => {}, onEnd: () => {} });
  const next = (nextMode = mode) => {
    const q = earQuestion(nextMode);
    setQuestion(q);
    setPicked([]);
    play(q);
  };
  const answer = (i: number) => {
    if (!question || solved || picked.includes(i)) return;
    const right = i === question.answer;
    const firstTry = picked.length === 0;
    setPicked([...picked, i]);
    playNotes(right ? [76, 83] : [43], 0.25); // the same chime as lesson drills
    if (right) setScore((s) => ({ asked: s.asked + 1, right: s.right + (firstTry ? 1 : 0), streak: firstTry ? s.streak + 1 : 0 }));
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <h1 className="text-4xl">Ear trainer</h1>
      <Segmented label="What to listen for" value={mode} options={EAR_MODES.map((m) => [m, MODE_NAMES[m]] as [EarMode, string])} onChange={(m) => { stopAudio(); setMode(m); setQuestion(undefined); setPicked([]); }} />
      <p className="text-muted-foreground tabular-nums" aria-live="polite">
        {score.asked === 0 ? "Nothing answered yet." : `${score.right} of ${score.asked} right first time · streak ${score.streak}`}
      </p>

      {question === undefined ? (
        <div><Button size="lg" onClick={() => next()}><Play />Start</Button></div>
      ) : (
        <>
          <p className="text-2xl">{PROMPTS[mode]}</p>
          <div><Button variant="secondary" size="lg" onClick={() => play(question)}><Play />Hear it again</Button></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {question.options.map((option, i) => {
              const state = !picked.includes(i) ? "idle" : i === question.answer ? "right" : "wrong";
              return (
                <button key={option} type="button" onClick={() => answer(i)} aria-disabled={solved || state === "wrong"}
                  className={cn("flex min-h-14 items-center justify-between gap-3 rounded-xl border bg-card px-5 text-left text-lg outline-none transition-colors duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    state === "right" && "border-success text-success", state === "wrong" && "border-destructive text-destructive", state === "idle" && !solved && "hover:bg-accent")}>
                  {option}
                  {state === "right" && <Check aria-hidden />}
                  {state === "wrong" && <X aria-hidden />}
                </button>
              );
            })}
          </div>
          <p role="status" className={cn("flex min-h-12 items-start gap-2 text-lg", solved ? "text-success" : "text-destructive")}>
            {solved && <><Check className="mt-1 shrink-0" aria-hidden /><span><strong>Correct.</strong> {question.options[question.answer]}. {question.why}</span></>}
            {!solved && picked.length > 0 && <><X className="mt-1 shrink-0" aria-hidden /><span>Not quite. Listen again and try another.</span></>}
          </p>
          {solved && <div><Button size="lg" onClick={() => next()}>Next</Button></div>}
        </>
      )}
    </div>
  );
}
