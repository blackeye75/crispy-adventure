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
export const rhythm = (notes: string, bpm = 80, beatsPerBar = 4): Sound => ({ kind: "rhythm", notes, bpm, beatsPerBar });
export const staff = (clef: "treble" | "bass", notes: string, caption: string, opts: { names?: boolean; time?: boolean; bpm?: number } = {}): BlockInput => ({ type: "notation", staves: [{ clef, notes }], caption, ...opts });
export const choice = (prompt: string, options: string[], answer: number, why: string): BlockInput => ({ type: "quiz-choice", prompt, options, answer, why });
/** "Which note is this?" over one written note. */
export const read = (clef: "treble" | "bass", note: string, options: string[], answer: number, why: string): BlockInput => ({ type: "quiz-choice", prompt: "Which note is this?", staff: { clef, notes: note }, options, answer, why });
export const ear = (prompt: string, sound: Sound, options: string[], answer: number, why: string): BlockInput => ({ type: "quiz-ear", prompt, sound, options, answer, why });
export const find = (prompt: string, answer: string, why: string, opts: FindOpts = {}): BlockInput => ({ type: "quiz-find", prompt, answer, why, ...opts });
export const along = (prompt: string, sound: Sound, bpm = 60, canvas?: CanvasInput): BlockInput => ({ type: "play-along", prompt, sound, bpm, canvas });
export const interval = (root: string, id: "2m" | "2M" | "3m" | "3M" | "4P" | "4A" | "5P" | "6m" | "6M" | "7m" | "7M" | "8P"): CanvasInput => ({ root, show: { kind: "interval", interval: id } });
