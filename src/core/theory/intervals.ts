import { Interval } from "tonal";

/** Reference table from docs/CURRICULUM.md. `id` is the tonal name used across src/core. */
export const INTERVALS = [
  { semitones: 0, id: "1P", name: "Perfect unison", short: "P1" },
  { semitones: 1, id: "2m", name: "Minor second", short: "m2" },
  { semitones: 2, id: "2M", name: "Major second", short: "M2" },
  { semitones: 3, id: "3m", name: "Minor third", short: "m3" },
  { semitones: 4, id: "3M", name: "Major third", short: "M3" },
  { semitones: 5, id: "4P", name: "Perfect fourth", short: "P4" },
  // The tritone is one sound with two spellings; the canvas shows it as an augmented fourth.
  { semitones: 6, id: "4A", name: "Tritone", short: "A4" },
  { semitones: 7, id: "5P", name: "Perfect fifth", short: "P5" },
  { semitones: 8, id: "6m", name: "Minor sixth", short: "m6" },
  { semitones: 9, id: "6M", name: "Major sixth", short: "M6" },
  { semitones: 10, id: "7m", name: "Minor seventh", short: "m7" },
  { semitones: 11, id: "7M", name: "Major seventh", short: "M7" },
  { semitones: 12, id: "8P", name: "Perfect octave", short: "P8" },
] as const;

export type IntervalId = (typeof INTERVALS)[number]["id"];
export const INTERVAL_IDS = INTERVALS.map((i) => i.id) as [IntervalId, ...IntervalId[]];

export function semitones(interval: string): number {
  const s = Interval.semitones(interval);
  if (s === undefined || Number.isNaN(s)) throw new Error(`Not an interval: "${interval}"`);
  return s;
}

/** "3m" → "m3", "5P" → "P5", "7d" → "d7". */
export function shortName(interval: string): string {
  const m = /^(\d+)([PMmAd])$/.exec(interval);
  if (!m) throw new Error(`Not an interval: "${interval}"`);
  return m[2] + m[1];
}

const PERFECT = new Set([1, 4, 5]);
const isPerfect = (n: number) => PERFECT.has(((n - 1) % 7) + 1);

/** Degree relative to the major scale → tonal interval: "b3" → "3m", "#4" → "4A", "bb7" → "7d". */
export function degreeToInterval(degree: string): string {
  const m = /^(bb|b|#|)(\d+)$/.exec(degree);
  const table: Record<string, string> = m && isPerfect(+m[2]) ? { "": "P", b: "d", "#": "A" } : { "": "M", b: "m", bb: "d", "#": "A" };
  const quality = m && table[m[1]];
  if (!m || !quality) throw new Error(`Not a degree: "${degree}"`);
  return m[2] + quality;
}

/** The reverse: "3m" → "b3", "5A" → "#5". */
export function intervalToDegree(interval: string): string {
  const m = /^(\d+)([PMmAd])$/.exec(interval);
  const table: Record<string, string> = m && isPerfect(+m[1]) ? { P: "", d: "b", A: "#" } : { M: "", m: "b", d: "bb", A: "#" };
  const acc = m ? table[m[2]] : undefined;
  if (!m || acc === undefined) throw new Error(`Not an interval: "${interval}"`);
  return acc + m[1];
}

/** Inversion within the octave: a third becomes a sixth ("3M" → "6m"). */
export function invert(interval: string): string {
  return Interval.invert(interval);
}
