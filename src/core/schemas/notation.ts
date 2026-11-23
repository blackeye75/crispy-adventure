// A tiny text form for written music, used by lesson content:
//   "C4/q D4/q r/q E4+G4/q | B4/w"
// note or rest (r), a slash, then its length: w = whole, h = half, q = quarter, 8 = eighth, 16 = sixteenth.
// "." after the length dots it (half as long again); "~" ties it to the next note.
// 8t and qt are triplet values: three 8t (or a qt and an 8t) fill one beat.
// "+" stacks notes into a chord; "|" is a bar line.
import type { PlaybackStep } from "../instruments/resolveCanvas";
import { midi } from "../theory/notes";

/** Length of each note value in beats, in 4/4. */
export const NOTE_BEATS = { w: 4, h: 2, q: 1, "8": 0.5, "16": 0.25, qt: 2 / 3, "8t": 1 / 3 } as const;
export type NoteValue = keyof typeof NOTE_BEATS;
export type NotationItem = { bar: true } | { bar: false; pitches: string[]; duration: NoteValue; dotted: boolean; tie: boolean };

/** Length of one written note in quarter-note beats. */
export const itemBeats = (item: { duration: NoteValue; dotted: boolean }) => NOTE_BEATS[item.duration] * (item.dotted ? 1.5 : 1);

const TOKEN = /^(r|[A-G](?:#|b)?\d(?:\+[A-G](?:#|b)?\d)*)\/(w|h|qt|q|8t|8|16)(\.)?(~)?$/;

/** Parse the text form. Throws on anything it does not understand. A rest has no pitches. */
export function parseNotation(source: string): NotationItem[] {
  return source.trim().split(/\s+/).map((token) => {
    if (token === "|") return { bar: true };
    const m = TOKEN.exec(token);
    if (!m) throw new Error(`Not a note: "${token}"`);
    return { bar: false, pitches: m[1] === "r" ? [] : m[1].split("+"), duration: m[2] as NoteValue, dotted: Boolean(m[3]), tie: Boolean(m[4]) };
  });
}

/** Two parts sounding at once (the two staves of a grand staff), as one sequence of steps. */
export function togetherSteps(parts: PlaybackStep[][]): PlaybackStep[] {
  if (parts.length === 1) return parts[0];
  // When each note starts and how long it lasts, per part; then one step per moment anything starts or stops.
  const notes = parts.flatMap((steps) => {
    let at = 0;
    return steps.flatMap((step) => {
      const from = at;
      at += step.beats;
      return step.midis.map((midi) => ({ from, beats: step.beats, midi }));
    });
  });
  const end = Math.max(...parts.map((steps) => steps.reduce((sum, s) => sum + s.beats, 0)));
  const cuts = [...new Set([0, end, ...notes.flatMap((n) => [n.from, n.from + n.beats])])].sort((x, y) => x - y);
  return cuts.slice(1).map((to, i) => {
    const starting = notes.filter((n) => n.from === cuts[i]);
    // a note is struck once, where it starts, and held for its own length while the other part moves
    return { midis: starting.map((n) => n.midi), beats: to - cuts[i], holds: starting.map((n) => n.beats) };
  });
}

/** What the transport plays: each note or rest for its length; bar lines take no time. */
export function notationSteps(items: NotationItem[]): PlaybackStep[] {
  const steps: PlaybackStep[] = [];
  let tied = false; // the previous note is tied into this one: one longer sound, not two
  for (const item of items) {
    if (item.bar) continue;
    if (tied) steps[steps.length - 1].beats += itemBeats(item);
    else steps.push({ midis: item.pitches.map(midi), beats: itemBeats(item) });
    tied = item.tie;
  }
  return steps;
}

/** The bar each step starts in, counting from 0, for bars `barBeats` quarter notes long (no pickup bar). */
export function stepBars(steps: PlaybackStep[], barBeats: number): number[] {
  let at = 0;
  return steps.map((step) => {
    const bar = Math.floor(at / barBeats + 1e-6); // thirds of a beat never sum exactly
    at += step.beats;
    return bar;
  });
}
