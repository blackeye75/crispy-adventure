"use client";

import { Play, Square } from "lucide-react";
import { useEffect, useState } from "react";
import type { PlaybackStep } from "@/core/instruments/resolveCanvas";
import { playSteps, stopAudio } from "@/features/audio/engine";
import { Button } from "@/components/ui/button";

type Props = {
  steps: PlaybackStep[];
  label: string;
  bpm?: number;
  loop?: boolean;
  variant?: "default" | "secondary";
  /** The notes sounding right now, in time with the audio; empty when playback ends. */
  onSounding?: (midis: number[]) => void;
};

/** Plays a sequence. Starting another one, or leaving the screen, stops it. */
export function PlayButton({ steps, label, bpm = 90, loop, variant = "secondary", onSounding }: Props) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => stopAudio, []);

  const toggle = () => {
    if (playing) return stopAudio();
    setPlaying(true);
    playSteps(steps, {
      bpm,
      loop,
      onStep: (i) => onSounding?.(steps[i].midis),
      onEnd: () => {
        setPlaying(false);
        onSounding?.([]);
      },
    });
  };

  return (
    <Button variant={variant} size="lg" onClick={toggle} aria-pressed={playing} className="h-auto min-h-12 justify-start py-3 text-left whitespace-normal">
      {playing ? <Square /> : <Play />}
      {label}
    </Button>
  );
}
