"use client";

import { useMemo, useState } from "react";
import { resolveCanvas } from "@/core/instruments/resolveCanvas";
import type { BlockOf } from "@/core/schemas/content";
import { handNotes, handsPlayback } from "@/core/schemas/hands";
import { itemBeats } from "@/core/schemas/notation";
import { glyphs, midi } from "@/core/theory/notes";
import { cn } from "@/lib/utils";
import { InstrumentView, lessonState } from "./InstrumentView";
import { BarPlayer } from "./BarPlayer";

const BEAT = 56; // width of one beat in the lane

/** A piano part for two hands: one row per hand, each note as wide as it is long, finger numbers under the notes; the keyboard above follows along. */
export function HandsBlock({ block }: { block: BlockOf<"hands"> }) {
  const [step, setStep] = useState<number>();
  const rows = useMemo(() => [
    { name: "Right hand", short: "RH", items: handNotes(block.right), fingers: block.rightFingers?.split(" ") },
    ...(block.left ? [{ name: "Left hand", short: "LH", items: handNotes(block.left), fingers: block.leftFingers?.split(" ") }] : []),
  ], [block]);
  const { steps, active } = useMemo(() => handsPlayback(block.right, block.left), [block.right, block.left]);
  const now = step === undefined ? undefined : active[step];
  const sounding = now ? rows.flatMap((row, h) => (now[h] === undefined ? [] : row.items[now[h]].pitches.map(midi))) : [];
  const keyboard = useMemo(() => resolveCanvas(lessonState({ root: "C", show: { kind: "notes", pitches: [...new Set(rows.flatMap((row) => row.items.flatMap((item) => item.pitches)))] }, labels: "notes" })), [rows]);
  const beats = Math.max(...rows.map((row) => row.items.reduce((sum, item) => sum + itemBeats(item), 0)));

  return (
    <figure className="flex flex-col gap-4">
      {block.caption && <figcaption className="text-lg text-foreground/85">{block.caption}</figcaption>}
      <InstrumentView instrument="piano" markers={keyboard} sounding={sounding} />
      <div className="overflow-x-auto rounded-xl border bg-card p-3">
        <div className="flex flex-col gap-2" style={{ width: beats * BEAT + 44 }}>
          {rows.map((row, h) => (
            <div key={row.short} role="group" aria-label={row.name} className="flex items-stretch">
              <span aria-hidden className="w-11 shrink-0 self-center text-sm font-medium text-muted-foreground">{row.short}</span>
              <ol className="flex">
                {row.items.map((item, i) => (
                  <li key={i} data-active={now?.[h] === i || undefined} style={{ width: itemBeats(item) * BEAT }}
                    className={cn("hand-note flex min-h-14 flex-col items-center justify-center border-l px-1 text-center transition-colors duration-150", item.pitches.length && "rounded-md border bg-muted/40", now?.[h] === i && item.pitches.length > 0 && "border-primary bg-accent")}>
                    <span className="text-sm font-medium">{item.pitches.length ? item.pitches.map((p) => glyphs(p.slice(0, -1))).join(" ") : <span className="sr-only">rest</span>}</span>
                    {row.fingers && item.pitches.length > 0 && <span className="text-xs text-primary tabular-nums"><span className="sr-only">fingers </span>{row.fingers[i].split("").join(" ")}</span>}
                  </li>
                ))}
              </ol>
            </div>
          ))}
          <div aria-hidden className="flex pl-11 text-xs text-muted-foreground tabular-nums">
            {Array.from({ length: Math.ceil(beats) }, (_, b) => <span key={b} style={{ width: BEAT }} className="pl-1">{(b % block.beatsPerBar) + 1}</span>)}
          </div>
        </div>
      </div>
      <BarPlayer steps={steps} barBeats={block.beatsPerBar} label="Play both hands" bpm={block.bpm} metronome={{ every: 1, accent: block.beatsPerBar }} onStep={setStep} />
    </figure>
  );
}
