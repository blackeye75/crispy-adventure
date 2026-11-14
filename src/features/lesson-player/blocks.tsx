"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { playbackSteps, resolveCanvas, type Marker } from "@/core/instruments/resolveCanvas";
import { canvasToQuery } from "@/core/schemas/canvas";
import { soundPlayback, soundSteps, type BlockOf } from "@/core/schemas/content";
import { playNotes } from "@/features/audio/engine";
import type { Instrument } from "@/core/schemas/api";
import { InstrumentView, lessonState } from "./InstrumentView";
import { PlayButton } from "./PlayButton";

export function AudioBlock({ block }: { block: BlockOf<"audio"> }) {
  return <PlayButton {...soundPlayback(block.sound)} label={block.label} variant="default" />;
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
  const [activeIndex, setActiveIndex] = useState(0); // which chord of a progression is showing
  const [sounding, setSounding] = useState<number[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const state = useMemo(() => {
    const base = lessonState(canvas);
    return { ...base, show: base.show.kind === "progression" ? { ...base.show, activeIndex } : base.show, focusPitch };
  }, [canvas, focusPitch, activeIndex]);
  const resolved = useMemo(() => resolveCanvas(state), [state]);
  const play = steps ?? playbackSteps(state, "up");
  const tap = (marker: Marker) => {
    clearTimeout(timer.current);
    setSounding([marker.midi]);
    playNotes([marker.midi]);
    timer.current = setTimeout(() => setSounding([]), 500);
  };
  return (
    <>
      {resolved.chords && (
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-lg" aria-live="off">
          {resolved.chords.map((c, i) => (
            <span key={i} className={i === activeIndex ? "font-semibold text-primary" : "text-muted-foreground"}>{c.symbol}</span>
          ))}
        </p>
      )}
      <InstrumentView instrument={instrument} markers={resolved} position={state.position} sounding={sounding} onNoteHover={(m) => setFocusPitch(m?.pitch)} onNoteTap={tap} />
      <div className="flex flex-wrap items-center gap-4">
        {/* in a progression, the instrument follows the chord that is sounding */}
        <PlayButton steps={play} label={playLabel} bpm={bpm} loop={loop} onSounding={setSounding} onStep={(i) => setActiveIndex((i === undefined ? undefined : play[i]?.index) ?? 0)} />
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
      <LinkedInstrument canvas={block.canvas} instrument={block.only ?? instrument} playLabel={block.canvas.show.kind === "progression" ? "Play the chords" : "Play these notes"} />
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
        : <PlayButton key={bpm} steps={steps} label="Play along (loops)" bpm={bpm} loop metronome={soundPlayback(block.sound).metronome} />}
    </div>
  );
}
