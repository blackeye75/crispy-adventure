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
