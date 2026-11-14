// Small builders so lesson files read like lessons. Everything is still validated by Zod in `npm run seed`.
import type { LessonInput, Sound } from "@/core/schemas/content";

type Step = LessonInput["steps"][number];
type BlockInput = Step["blocks"][number];
type CanvasInput = Extract<BlockInput, { type: "instrument" }>["canvas"];

export const text = (markdown: string): BlockInput => ({ type: "text", markdown });
/** Notes played one after another: seq("C4 D4 E4"). */
export const seq = (notes: string, bpm?: number): Sound => ({ kind: "sequence", notes: notes.split(" "), bpm });
/** Notes played together. */
export const together = (notes: string): Sound => ({ kind: "chord", notes: notes.split(" ") });
export const audio = (label: string, sound: Sound): BlockInput => ({ type: "audio", label, sound });
/** Exact pitches on the instruments, optionally limited to guitar strings (1 = thinnest) and a fret range. */
export const pitches = (notes: string, limit: { strings?: number[]; within?: [number, number] } = {}): CanvasInput => ({
  root: "C",
  show: { kind: "notes", pitches: notes.split(" "), ...limit },
});
export const everyNote = (root: string): CanvasInput => ({ root, show: { kind: "interval", interval: "1P" } });
export const show = (canvas: CanvasInput, caption: string, only?: "guitar" | "piano"): BlockInput => ({ type: "instrument", canvas, caption, only });

// Drills and the blocks added for rhythm and reading.
type FindOpts = { strings?: number[]; only?: "guitar" | "piano" };
/** Notes with lengths over a click: rhythm("B4/q B4/q r/h"). `beatsPerBar` 0 turns the click off. */
export const rhythm = (notes: string, bpm = 80, beatsPerBar = 4, click = 1): Sound => ({ kind: "rhythm", notes, bpm, beatsPerBar, click });
export const staff = (clef: "treble" | "bass", notes: string, caption: string, opts: { names?: boolean; time?: true | "3/4" | "6/8" | "5/4" | "7/8"; key?: string; bpm?: number } = {}): BlockInput => ({ type: "notation", staves: [{ clef, notes }], caption, ...opts, time: opts.time === true ? "4/4" : opts.time });
export const choice = (prompt: string, options: string[], answer: number, why: string): BlockInput => ({ type: "quiz-choice", prompt, options, answer, why });
/** "Which note is this?" over one written note. */
export const read = (clef: "treble" | "bass", note: string, options: string[], answer: number, why: string): BlockInput => ({ type: "quiz-choice", prompt: "Which note is this?", staff: { clef, notes: note }, options, answer, why });
export const ear = (prompt: string, sound: Sound, options: string[], answer: number, why: string): BlockInput => ({ type: "quiz-ear", prompt, sound, options, answer, why });
export const find = (prompt: string, answer: string, why: string, opts: FindOpts = {}): BlockInput => ({ type: "quiz-find", prompt, answer, why, ...opts });
export const along = (prompt: string, sound: Sound, bpm = 60, canvas?: CanvasInput): BlockInput => ({ type: "play-along", prompt, sound, bpm, canvas });
export const interval = (root: string, id: "2m" | "2M" | "3m" | "3M" | "4P" | "4A" | "5P" | "6m" | "6M" | "7m" | "7M" | "8P"): CanvasInput => ({ root, show: { kind: "interval", interval: id } });

// Level 2 additions.
type ScaleName = Extract<CanvasInput["show"], { kind: "scale" }>["scale"];
export const scale = (root: string, id: ScaleName, labels: "notes" | "degrees" = "notes"): CanvasInput => ({ root, show: { kind: "scale", scale: id }, labels });
export const chord = (root: string, id: "major" | "minor"): CanvasInput => ({ root, show: { kind: "chord", chord: id } });
/** Tap a set of notes: build("Build G major", "G A B C D E F#", why). */
export const build = (prompt: string, notes: string, why: string, only?: "guitar" | "piano"): BlockInput => ({ type: "quiz-build", prompt, notes: notes.split(" "), why, only });
export const circle = (highlight: string, caption: string): BlockInput => ({ type: "circle-of-fifths", highlight, caption });
/** Eight eighth-note slots: strum("D - D U - U D U", G_CHORD, caption). */
export const strum = (pattern: string, chordNotes: string, caption: string, bpm = 80): BlockInput => ({ type: "strum-pattern", pattern, chord: chordNotes.split(" "), bpm, caption });

// Level 3 additions.
import { playbackSteps } from "@/core/instruments/resolveCanvas";
import { DEFAULT_CANVAS } from "@/core/schemas/canvas";
import { nameMidi } from "@/core/theory/notes";

type ChordName = Extract<CanvasInput["show"], { kind: "chord" }>["chord"];
export const chordOf = (root: string, id: ChordName): CanvasInput => ({ root, show: { kind: "chord", chord: id } });
/** A progression on the instruments, stepping through its chords as it plays: progression("C", "I IV V"). */
export const progression = (key: string, numerals: string): CanvasInput => ({ root: key, show: { kind: "progression", numerals: numerals.split(" "), activeIndex: 0 } });
/** The same progression as sound, two beats a chord: prog("C", "I IV V I"). Numerals are read against the major scale of the key. */
export const prog = (key: string, numerals: string, bpm = 84): Sound => ({
  kind: "progression",
  chords: playbackSteps({ ...DEFAULT_CANVAS, ...progression(key, numerals), labels: "notes" }, "chord").map((step) => step.midis.map((m) => nameMidi(m))),
  bpm,
});
/** Chords spelled out, two beats each: chords("C3 E3 G3", "B2 D3 G3"). */
export const chords = (...voicings: string[]): Sound => ({ kind: "progression", chords: voicings.map((v) => v.split(" ")) });
/** A guitar chord diagram: diagram("x32010", "C", "major", caption). */
export const diagram = (shape: string, root: string, id: ChordName, caption?: string): BlockInput => ({ type: "chord-diagram", shape, chord: { root, id }, caption });

// Level 4 additions.
import { STANDARD_TUNING, fretMidi } from "@/core/instruments/fretboard";

/**
 * Exact places on the neck, as "string:fret" pairs: shape("6:3 6:5 5:2 5:3"). The keyboard shows the same pitches.
 * `spell` names the notes when sharps are not right for the key: shape("5:1", "Bb").
 */
export function shape(positions: string, spell = ""): CanvasInput {
  const at = positions.split(" ").map((p) => p.split(":").map(Number) as [number, number]);
  const prefer = spell ? spell.split(" ") : [];
  return { root: "C", show: { kind: "notes", pitches: at.map(([string, fret]) => nameMidi(fretMidi(STANDARD_TUNING, 6 - string, fret), prefer)), at } };
}
/** A scale with one position on the neck picked out; notes outside it are dimmed. */
export const position = (root: string, id: ScaleName, fromFret: number, toFret: number, frets = 15): CanvasInput => ({ ...scale(root, id), position: { fromFret, toFret }, frets });
/** Notes played softly or loudly: dynamic("C4 E4 G4", 0.25). */
export const dynamic = (notes: string, velocity: number, bpm = 80): Sound => ({ kind: "sequence", notes: notes.split(" "), bpm, velocity });
