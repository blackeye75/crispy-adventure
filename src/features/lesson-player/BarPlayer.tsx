"use client";

import { useMemo, useState } from "react";
import type { PlaybackStep } from "@/core/instruments/resolveCanvas";
import { stepBars } from "@/core/schemas/notation";
import { cn } from "@/lib/utils";
import { PlayButton } from "./PlayButton";

type Props = { steps: PlaybackStep[]; barBeats: number; label: string; bpm?: number; metronome?: { every: number; accent: number }; onStep: (index: number | undefined) => void };

/** Play the whole part, or pick one bar (then a second for a range) to loop just that passage. */
export function BarPlayer({ steps, barBeats, label, bpm, metronome, onStep }: Props) {
  const bars = useMemo(() => stepBars(steps, barBeats), [steps, barBeats]);
  const count = bars.length ? bars[bars.length - 1] + 1 : 0;
  const [range, setRange] = useState<[number, number]>();

  const pick = (bar: number) =>
    setRange((r) => (r && r[0] === r[1] && r[0] !== bar ? [Math.min(r[0], bar), Math.max(r[0], bar)] : r && r[0] === bar && r[1] === bar ? undefined : [bar, bar]));
  const first = range ? bars.indexOf(range[0]) : 0;
  const last = range ? bars.lastIndexOf(range[1]) : steps.length - 1;
  const loopLabel = range && (range[0] === range[1] ? `Loop bar ${range[0] + 1}` : `Loop bars ${range[0] + 1}–${range[1] + 1}`);

  return (
    <div className="flex flex-col gap-3">
      {count > 1 && (
        <div role="group" aria-label="Loop a passage: pick a bar, then another to make a range" className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Loop</span>
          <button type="button" onClick={() => setRange(undefined)} aria-pressed={!range} className={cn("min-h-11 rounded-full border px-4 text-sm transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", !range && "border-primary bg-accent")}>Whole part</button>
          {Array.from({ length: count }, (_, b) => {
            const on = !!range && b >= range[0] && b <= range[1];
            return <button key={b} type="button" onClick={() => pick(b)} aria-pressed={on} aria-label={`Bar ${b + 1}`} className={cn("min-h-11 min-w-11 rounded-full border px-3 text-sm tabular-nums transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", on && "border-primary bg-primary text-primary-foreground")}>{b + 1}</button>;
          })}
        </div>
      )}
      {/* key: a new range restarts playback from its first bar */}
      <div><PlayButton key={`${first}-${last}`} steps={steps.slice(first, last + 1)} label={loopLabel ?? label} bpm={bpm} loop={!!range} metronome={metronome} onStep={(i) => onStep(i === undefined ? undefined : i + first)} /></div>
    </div>
  );
}
