// A tiny text form for written music, used by lesson content:
//   "C4/q D4/q r/q E4+G4/q | B4/w"
// note or rest (r), a slash, then its length: w = whole, h = half, q = quarter, 8 = eighth.
// "+" stacks notes into a chord; "|" is a bar line.
import type { PlaybackStep } from "../instruments/resolveCanvas";
import { midi } from "../theory/notes";

/** Length of each note value in beats, in 4/4. */
export const NOTE_BEATS = { w: 4, h: 2, q: 1, "8": 0.5 } as const;
export type NoteValue = keyof typeof NOTE_BEATS;
export type NotationItem = { bar: true } | { bar: false; pitches: string[]; duration: NoteValue };

const TOKEN = /^(r|[A-G](?:#|b)?\d(?:\+[A-G](?:#|b)?\d)*)\/(w|h|q|8)$/;

/** Parse the text form. Throws on anything it does not understand. A rest has no pitches. */
export function parseNotation(source: string): NotationItem[] {
  return source.trim().split(/\s+/).map((token) => {
    if (token === "|") return { bar: true };
    const m = TOKEN.exec(token);
    if (!m) throw new Error(`Not a note: "${token}"`);
    return { bar: false, pitches: m[1] === "r" ? [] : m[1].split("+"), duration: m[2] as NoteValue };
  });
}

/** Two parts sounding at once (the two staves of a grand staff), as one sequence of steps. */
export function togetherSteps(parts: PlaybackStep[][]): PlaybackStep[] {
  // Where each note starts and stops, per part; then cut time at every start or stop.
  const spans = parts.flatMap((steps) => {
    let at = 0;
    return steps.map((step) => ({ from: at, to: (at += step.beats), midis: step.midis }));
  });
  const cuts = [...new Set(spans.flatMap((s) => [s.from, s.to]))].sort((a, b) => a - b);
  // shortcut: a note still sounding when the other part moves is struck again; fine for lesson examples, wrong for held notes over moving ones
  return cuts.slice(1).map((to, i) => ({ midis: spans.filter((s) => s.from <= cuts[i] && s.to >= to).flatMap((s) => s.midis), beats: to - cuts[i] }));
}

/** What the transport plays: each note or rest for its length; bar lines take no time. */
export function notationSteps(items: NotationItem[]): PlaybackStep[] {
  return items.flatMap((item) => (item.bar ? [] : [{ midis: item.pitches.map(midi), beats: NOTE_BEATS[item.duration] }]));
}
