"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { playbackSteps, resolveCanvas, type Marker } from "@/core/instruments/resolveCanvas";
import { canvasToQuery } from "@/core/schemas/canvas";
import { soundSteps, type BlockOf } from "@/core/schemas/content";
import { playNotes } from "@/features/audio/engine";
import type { Instrument } from "@/lib/local-store";
import { InstrumentView, lessonState } from "./InstrumentView";
import { PlayButton } from "./PlayButton";

export function AudioBlock({ block }: { block: BlockOf<"audio"> }) {
  return <PlayButton steps={soundSteps(block.sound)} label={block.label} bpm={"bpm" in block.sound ? block.sound.bpm : undefined} variant="default" />;
}

/** The lesson's selection on the learner's instrument: tap to hear, play it through, or open it in the Canvas. */
function LinkedInstrument({ canvas, instrument, playLabel, bpm, loop, steps }: {
  canvas: BlockOf<"instrument">["canvas"];
  instrument: Instrument;
  playLabel: string;
  bpm?: number;
  loop?: boolean;
  steps?: ReturnType<typeof soundSteps>;
}) {
  const [focusPitch, setFocusPitch] = useState<string>();
  const [sounding, setSounding] = useState<number[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const state = useMemo(() => ({ ...lessonState(canvas), focusPitch }), [canvas, focusPitch]);
  const resolved = useMemo(() => resolveCanvas(state), [state]);
  const tap = (marker: Marker) => {
    clearTimeout(timer.current);
    setSounding([marker.midi]);
    playNotes([marker.midi]);
    timer.current = setTimeout(() => setSounding([]), 500);
  };
  return (
    <>
      <InstrumentView instrument={instrument} markers={resolved} position={state.position} sounding={sounding} onNoteHover={(m) => setFocusPitch(m?.pitch)} onNoteTap={tap} />
      <div className="flex flex-wrap items-center gap-4">
        <PlayButton steps={steps ?? playbackSteps(state, "up")} label={playLabel} bpm={bpm} loop={loop} onSounding={setSounding} />
        <Link href={`/practice?${canvasToQuery(state)}`} target="_blank" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
          Explore in the Canvas
        </Link>
      </div>
    </>
  );
}

export function InstrumentBlock({ block, instrument }: { block: BlockOf<"instrument">; instrument: Instrument }) {
  return (
    <figure className="flex flex-col gap-4">
      {block.caption && <figcaption className="text-lg text-foreground/85">{block.caption}</figcaption>}
      <LinkedInstrument canvas={block.canvas} instrument={block.only ?? instrument} playLabel="Play these notes" />
    </figure>
  );
}

export function PlayAlongBlock({ block, instrument }: { block: BlockOf<"play-along">; instrument: Instrument }) {
  const [bpm, setBpm] = useState(block.bpm);
  const steps = soundSteps(block.sound);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl">{block.prompt}</p>
      <label className="flex items-center gap-3 text-sm tabular-nums">
        <span aria-hidden>♩ {bpm}</span>
        {/* key: restart from the new tempo rather than bending a running loop */}
        <input type="range" aria-label="Tempo in beats per minute" min={40} max={160} step={5} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="h-11 w-48 accent-primary" />
      </label>
      {block.canvas
        ? <LinkedInstrument key={bpm} canvas={block.canvas} instrument={instrument} playLabel="Play along (loops)" bpm={bpm} loop steps={steps} />
        : <PlayButton key={bpm} steps={steps} label="Play along (loops)" bpm={bpm} loop />}
    </div>
  );
}
