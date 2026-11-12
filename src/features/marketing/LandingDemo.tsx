"use client";

import { useMemo, useRef, useState } from "react";
import { playbackSteps, resolveCanvas, type Marker } from "@/core/instruments/resolveCanvas";
import type { CanvasShow } from "@/core/schemas/canvas";
import { playNotes } from "@/features/audio/engine";
import { Fretboard } from "@/features/fretboard/Fretboard";
import { Keyboard } from "@/features/keyboard/Keyboard";
import { lessonState } from "@/features/lesson-player/InstrumentView";
import { PlayButton } from "@/features/lesson-player/PlayButton";
import { Segmented } from "@/components/ui/segmented";

const PRESETS: Record<string, { name: string; root: string; show: CanvasShow }> = {
  major: { name: "C major scale", root: "C", show: { kind: "scale", scale: "major" } },
  pentatonic: { name: "A minor pentatonic", root: "A", show: { kind: "scale", scale: "minor-pentatonic" } },
  seventh: { name: "G7 chord", root: "G", show: { kind: "chord", chord: "7" } },
};

/** The Theory Canvas in miniature: one idea on both instruments, linked, playable. */
export function LandingDemo() {
  const [preset, setPreset] = useState("major");
  const [focusPitch, setFocusPitch] = useState<string>();
  const [sounding, setSounding] = useState<number[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { root, show, name } = PRESETS[preset];
  const state = useMemo(() => ({ ...lessonState({ root, show, labels: "notes" }), focusPitch }), [root, show, focusPitch]);
  const resolved = useMemo(() => resolveCanvas(state), [state]);
  const events = {
    sounding,
    onNoteHover: (m: Marker | undefined) => setFocusPitch(m?.pitch),
    onNoteTap: (m: Marker) => {
      clearTimeout(timer.current);
      setSounding([m.midi]);
      playNotes([m.midi]);
      timer.current = setTimeout(() => setSounding([]), 500);
    },
  };
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="-mx-1 overflow-x-auto px-1">
          <Segmented label="What to show" value={preset} options={Object.entries(PRESETS).map(([id, p]) => [id, p.name] as const)} onChange={(id) => { setPreset(id); setFocusPitch(undefined); }} />
        </div>
        <div className="ml-auto"><PlayButton key={preset} steps={playbackSteps(state, "up")} label={`Play ${name}`} bpm={120} onSounding={setSounding} variant="default" /></div>
      </div>
      <Fretboard markers={resolved.fretboard} strings={state.guitar.tuning.length} frets={state.guitar.frets} leftHanded={false} {...events} />
      <Keyboard markers={resolved.keyboard} from={state.keyboard.from} to={state.keyboard.to} {...events} />
      <p className="text-sm text-muted-foreground">Tap any note. The same pitch lights up on the other instrument.</p>
    </div>
  );
}
