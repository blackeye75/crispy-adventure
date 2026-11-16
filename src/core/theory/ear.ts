// Questions for the ear trainer: something to listen to and four names to choose from.
import type { PlaybackStep } from "../instruments/resolveCanvas";
import { chordIntervals, CHORDS, type ChordId } from "./chords";
import { INTERVALS, semitones } from "./intervals";
import { scaleIntervals, SCALES, type ScaleId } from "./scales";

export const EAR_MODES = ["interval", "chord", "scale"] as const;
export type EarMode = (typeof EAR_MODES)[number];
export type EarQuestion = { mode: EarMode; steps: PlaybackStep[]; options: string[]; answer: number; why: string };

// What the trainer asks about. Kept to sounds the lessons teach and that can be told apart by ear.
const CHORD_POOL: ChordId[] = ["major", "minor", "dim", "aug", "maj7", "7", "m7", "sus4"];
const SCALE_POOL: ScaleId[] = ["major", "natural-minor", "harmonic-minor", "dorian", "mixolydian", "lydian", "phrygian", "major-pentatonic", "minor-pentatonic", "blues"];
const capital = (text: string) => text[0].toUpperCase() + text.slice(1);

/** `count` different items from `pool`, in random order. `random` returns a number from 0 up to 1, like Math.random. */
function pick<T>(pool: readonly T[], count: number, random: () => number): T[] {
  const rest = [...pool];
  return Array.from({ length: Math.min(count, rest.length) }, () => rest.splice(Math.floor(random() * rest.length), 1)[0]);
}

/** One question. The root moves around so nothing can be learned by absolute pitch. */
export function earQuestion(mode: EarMode, random: () => number = Math.random): EarQuestion {
  const root = 55 + Math.floor(random() * 10); // G3 to E4
  if (mode === "interval") {
    const choices = pick(INTERVALS.filter((i) => i.id !== "1P"), 4, random);
    const answer = Math.floor(random() * choices.length);
    const top = root + semitones(choices[answer].id);
    return {
      mode,
      steps: [{ midis: [root], beats: 1 }, { midis: [top], beats: 1 }, { midis: [root, top], beats: 2 }],
      options: choices.map((i) => capital(i.name)),
      answer,
      why: `${semitones(choices[answer].id)} half step${semitones(choices[answer].id) === 1 ? "" : "s"} apart.`,
    };
  }
  if (mode === "chord") {
    const choices = pick(CHORD_POOL, 4, random);
    const answer = Math.floor(random() * choices.length);
    const chord = CHORDS.find((c) => c.id === choices[answer])!;
    const midis = chordIntervals(chord.id).map((i) => root + semitones(i));
    return {
      mode,
      steps: [{ midis, beats: 2 }, ...midis.map((m) => ({ midis: [m], beats: 0.5 })), { midis, beats: 2 }],
      options: choices.map((id) => capital(CHORDS.find((c) => c.id === id)!.name)),
      answer,
      why: `Its formula is ${chord.formula.replaceAll("b", "♭").replaceAll("#", "♯")}.`,
    };
  }
  const choices = pick(SCALE_POOL, 4, random);
  const answer = Math.floor(random() * choices.length);
  const scale = SCALES.find((s) => s.id === choices[answer])!;
  const up = [...scaleIntervals(scale.id).map((i) => root + semitones(i)), root + 12];
  return {
    mode,
    steps: up.map((m, i) => ({ midis: [m], beats: i === up.length - 1 ? 1.5 : 0.5 })),
    options: choices.map((id) => capital(SCALES.find((s) => s.id === id)!.name)),
    answer,
    why: `Its formula is ${scale.formula.replaceAll("b", "♭").replaceAll("#", "♯")}.`,
  };
}
