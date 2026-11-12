import { Note } from "tonal";

/** MIDI number of a pitch with octave ("C4" → 60). Throws on anything that is not a pitch. */
export function midi(pitch: string): number {
  const m = Note.midi(pitch);
  if (m === null) throw new Error(`Not a pitch: "${pitch}"`);
  return m;
}

/** 0–11 position in the chromatic scale ("C" → 0, "E#" → 5). */
export function chroma(note: string): number {
  const c = Note.chroma(note);
  if (c === undefined || Number.isNaN(c)) throw new Error(`Not a note: "${note}"`);
  return c;
}

/** Transpose by a tonal interval ("3M"), keeping correct spelling ("F#" + "7M" → "E#"). */
export function transpose(note: string, interval: string): string {
  const out = Note.transpose(note, interval);
  if (!out) throw new Error(`Cannot transpose "${note}" by "${interval}"`);
  return out;
}

/** Name a MIDI number using a given spelling: (65, "E#") → "E#4", (60, "B#") → "B#3". */
export function spellMidi(midiNumber: number, pitchClass: string): string {
  const { alt } = Note.get(pitchClass);
  return `${pitchClass}${Math.floor((midiNumber - alt) / 12) - 1}`;
}

/** Display form with real glyphs. For notes, degrees and chord symbols only, never prose. */
export function glyphs(text: string): string {
  return text.replace(/#/g, "♯").replace(/b/g, "♭");
}

const SHARP_ROOTS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_ROOTS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

/**
 * The 12 root names to offer for a scale or chord (given as tonal intervals): for each black key,
 * whichever of the sharp or flat name spells the notes with fewer accidentals. Ties go to the sharp
 * name (F# major rather than Gb major).
 */
export function rootChoices(intervals: readonly string[]): string[] {
  const cost = (root: string) =>
    intervals.reduce((sum, ivl) => sum + Math.abs(Note.get(transpose(root, ivl)).alt), 0);
  return SHARP_ROOTS.map((sharp, i) => (cost(FLAT_ROOTS[i]) < cost(sharp) ? FLAT_ROOTS[i] : sharp));
}

/** Re-spell a root for a new scale or chord, keeping the same key on the instrument. */
export function respellRoot(root: string, intervals: readonly string[]): string {
  return rootChoices(intervals)[chroma(root)];
}
