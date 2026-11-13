"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import { soundPlayback, type BlockOf } from "@/core/schemas/content";
import { chroma, glyphs, nameMidi, pitchClass } from "@/core/theory/notes";
import { playNotes } from "@/features/audio/engine";
import { InstrumentView, stringNumber, tapMarkers, type Tap } from "@/features/lesson-player/InstrumentView";
import { PlayButton } from "@/features/lesson-player/PlayButton";
import { NotationBlock } from "@/features/notation/Notation";
import { Button } from "@/components/ui/button";
import type { Instrument } from "@/core/schemas/api";
import { cn } from "@/lib/utils";

/** Called once, when the drill is solved: was the first answer right? */
type OnSolved = (firstTry: boolean) => void;

const chime = (ok: boolean) => playNotes(ok ? [76, 83] : [43], 0.25); // bright fifth, or a low thud

/** Instant feedback: an icon and words as well as colour, plus the one-line reason. */
function Feedback({ state, why, hint = "Not quite. Try again." }: { state: "idle" | "wrong" | "solved"; why: string; hint?: string }) {
  return (
    <p role="status" className={cn("flex min-h-12 items-start gap-2 text-lg", state === "solved" ? "text-success" : "text-destructive")}>
      {state === "solved" && <><Check className="mt-1 shrink-0" aria-hidden /><span><strong>Correct.</strong> {why}</span></>}
      {state === "wrong" && <><X className="mt-1 shrink-0" aria-hidden /><span>{hint}</span></>}
    </p>
  );
}

/** Multiple choice, with or without something to listen to first (quiz-choice and quiz-ear). */
export function ChoiceQuiz({ block, onSolved }: { block: BlockOf<"quiz-choice"> | BlockOf<"quiz-ear">; onSolved: OnSolved }) {
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const pick = (i: number) => {
    const ok = i === block.answer;
    chime(ok);
    if (!ok) return setWrong([...wrong, i]);
    setSolved(true);
    onSolved(wrong.length === 0);
  };
  return (
    <div className="flex flex-col gap-5">
      <p className="text-xl">{block.prompt}</p>
      {"staff" in block && block.staff && <NotationBlock block={{ type: "notation", staves: [block.staff], time: false, names: false, bpm: 80 }} />}
      {block.sound && <PlayButton {...soundPlayback(block.sound)} label="Listen" variant="default" />}
      <div className="flex flex-col gap-3">
        {block.options.map((option, i) => {
          const state = solved && i === block.answer ? "correct" : wrong.includes(i) ? "wrong" : undefined;
          return (
            <button key={i} type="button" disabled={solved || state === "wrong"} onClick={() => pick(i)}
              className={cn("flex min-h-14 items-center justify-between gap-3 rounded-lg border bg-card px-5 text-left text-lg outline-none transition-colors duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/50 enabled:hover:bg-accent",
                state === "correct" && "border-success", state === "wrong" && "border-destructive opacity-60")}>
              {option}
              {state === "correct" && <Check className="text-success" aria-label="correct" />}
              {state === "wrong" && <X className="text-destructive" aria-label="wrong" />}
            </button>
          );
        })}
      </div>
      <Feedback state={solved ? "solved" : wrong.length ? "wrong" : "idle"} why={block.why} />
    </div>
  );
}

/** Tap the right note on the fretboard or keyboard. Wrong taps stay marked; keep going until it is found. */
export function FindQuiz({ block, instrument, onSolved }: { block: BlockOf<"quiz-find">; instrument: Instrument; onSolved: OnSolved }) {
  const shown = block.only ?? instrument;
  const [taps, setTaps] = useState<(Tap & { ok: boolean })[]>([]);
  const solved = taps.some((t) => t.ok);
  const exact = /\d$/.test(block.answer);

  const tap = (t: Tap) => {
    if (solved) return;
    const rightNote = exact ? nameMidi(t.midi, [block.answer]) === block.answer : t.midi % 12 === chroma(block.answer);
    const rightString = !block.strings || t.string === undefined || block.strings.includes(stringNumber(t)!);
    const ok = rightNote && rightString;
    playNotes([t.midi]);
    setTaps([...taps, { ...t, ok }]);
    if (ok) onSolved(taps.length === 0);
  };
  const markers = tapMarkers(taps.map((t) => {
    const pitch = nameMidi(t.midi, [block.answer]);
    return { ...t, pitch, label: t.ok ? glyphs(pitchClass(pitch)) : "✕", state: t.ok ? "correct" as const : "wrong" as const };
  }));

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xl">{block.prompt}</p>
      <InstrumentView instrument={shown} markers={markers} onTap={tap} />
      <Feedback state={solved ? "solved" : taps.length ? "wrong" : "idle"} why={block.why} />
    </div>
  );
}

/** Build a set of notes by tapping them, then check. Tap a note again to remove it. */
export function BuildQuiz({ block, instrument, onSolved }: { block: BlockOf<"quiz-build">; instrument: Instrument; onSolved: OnSolved }) {
  const shown = block.only ?? instrument;
  const [taps, setTaps] = useState<Tap[]>([]);
  const [checks, setChecks] = useState(0);
  const [result, setResult] = useState<"idle" | "wrong" | "solved">("idle");
  const wanted = new Set(block.notes.map(chroma));
  const chosen = new Set(taps.map((t) => t.midi % 12));
  const found = [...wanted].filter((c) => chosen.has(c)).length;
  const extra = [...chosen].filter((c) => !wanted.has(c)).length;

  const toggle = (t: Tap) => {
    if (result === "solved") return;
    const same = (a: Tap) => a.midi === t.midi && a.string === t.string;
    setResult("idle");
    if (taps.some(same)) return setTaps(taps.filter((a) => !same(a)));
    playNotes([t.midi]);
    setTaps([...taps, t]);
  };
  const check = () => {
    const ok = found === wanted.size && extra === 0;
    chime(ok);
    setChecks(checks + 1);
    setResult(ok ? "solved" : "wrong");
    if (ok) onSolved(checks === 0);
  };
  const markers = tapMarkers(taps.map((t) => {
    const pitch = nameMidi(t.midi, block.notes);
    const state = result === "idle" ? undefined : wanted.has(t.midi % 12) ? "correct" as const : "wrong" as const;
    return { ...t, pitch, label: glyphs(pitchClass(pitch)), state };
  }));

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xl">{block.prompt}</p>
      <InstrumentView instrument={shown} markers={markers} onTap={toggle} onNoteTap={(m) => toggle(taps.find((t) => t.midi === m.midi && ("string" in m ? t.string === m.string : true))!)} />
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="secondary" onClick={check} disabled={taps.length === 0 || result === "solved"}>Check</Button>
        <Feedback state={result} why={block.why} hint={`${found} of ${wanted.size} found${extra ? `, and ${extra} that ${extra === 1 ? "does" : "do"} not belong` : ""}. Adjust and check again.`} />
      </div>
    </div>
  );
}
