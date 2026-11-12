import { z } from "zod";
import type { PlaybackStep } from "../instruments/resolveCanvas";
import { midi } from "../theory/notes";
import { canvasShowSchema, pitchSchema } from "./canvas";

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
const noteName = z.string().regex(/^[A-G](#|b)?$/);
const instrument = z.enum(["guitar", "piano"]);
const bpm = z.number().int().min(30).max(240);

/** Audio is data, synthesised from samples: lessons need no recorded files. */
export const soundSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("sequence"), notes: z.array(pitchSchema).min(1), bpm: bpm.optional() }),
  z.object({ kind: z.literal("chord"), notes: z.array(pitchSchema).min(2) }),
  z.object({ kind: z.literal("progression"), chords: z.array(z.array(pitchSchema).min(2)).min(2), bpm: bpm.optional() }),
]);
export type Sound = z.infer<typeof soundSchema>;

/** What a lesson shows on the instruments: the musical part of a CanvasState. */
const lessonCanvas = z.object({
  root: noteName,
  show: canvasShowSchema,
  labels: z.enum(["notes", "degrees", "intervals"]).default("notes"),
  position: z.object({ fromFret: z.number().int().min(0), toFret: z.number().int().max(24) }).optional(),
});

const quizOptions = { options: z.array(z.string().min(1)).min(2).max(4), answer: z.number().int().min(0), why: z.string().min(1) };
const answerInRange = (q: { options: string[]; answer: number }) => q.answer < q.options.length;

export const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), markdown: z.string().min(1) }),
  z.object({ type: z.literal("audio"), label: z.string().min(1), sound: soundSchema }),
  z.object({ type: z.literal("instrument"), canvas: lessonCanvas, caption: z.string().optional(), only: instrument.optional() }),
  z.object({ type: z.literal("quiz-choice"), prompt: z.string().min(1), sound: soundSchema.optional(), ...quizOptions }).refine(answerInRange, "answer must index an option"),
  z.object({ type: z.literal("quiz-ear"), prompt: z.string().min(1), sound: soundSchema, ...quizOptions }).refine(answerInRange, "answer must index an option"),
  z.object({
    type: z.literal("quiz-find"),
    prompt: z.string().min(1),
    /** A note name ("C": any octave) or an exact pitch ("C4"). */
    answer: z.union([noteName, pitchSchema]),
    /** Guitar only: the answer must be on one of these strings (1 = thinnest). */
    strings: z.array(z.number().int().min(1).max(6)).optional(),
    only: instrument.optional(),
    why: z.string().min(1),
  }),
  z.object({ type: z.literal("quiz-build"), prompt: z.string().min(1), notes: z.array(noteName).min(2), only: instrument.optional(), why: z.string().min(1) }),
  z.object({ type: z.literal("play-along"), prompt: z.string().min(1), sound: soundSchema, bpm: bpm.default(60), canvas: lessonCanvas.optional() }),
]);
export type Block = z.infer<typeof blockSchema>;
export type BlockOf<T extends Block["type"]> = Extract<Block, { type: T }>;

const QUIZZES: ReadonlySet<Block["type"]> = new Set(["quiz-choice", "quiz-ear", "quiz-find", "quiz-build"]);
export const isQuiz = (block: Block) => QUIZZES.has(block.type);

export const STEP_KINDS = ["understand", "listen", "learn", "practice"] as const;
const step = <K extends (typeof STEP_KINDS)[number]>(kind: K) => z.object({ kind: z.literal(kind), blocks: z.array(blockSchema).min(1) });

export const trackSchema = z.object({ slug, title: z.string().min(1), order: z.number().int(), description: z.string().min(1) });

export const moduleSchema = z.object({
  slug,
  trackSlug: slug,
  level: z.number().int().min(1).max(6),
  title: z.string().min(1),
  order: z.number().int(),
  summary: z.string().min(1),
  isFree: z.boolean(),
});

export const lessonSchema = z.object({
  slug,
  moduleSlug: slug,
  title: z.string().min(1),
  order: z.number().int(),
  minutes: z.number().int().min(1).max(15),
  isFree: z.boolean(),
  version: z.number().int().min(1),
  concepts: z.array(slug).min(1),
  track: slug.default("theory"),
  stage: z.enum(["basic", "intermediate", "advanced"]).default("basic"),
  /** Core lessons suit both instruments; guitar and piano lessons apply the idea on one. */
  strand: z.enum(["core", "guitar", "piano", "ear", "rhythm"]).default("core"),
  needs: z.array(slug).default([]),
  // Always the same four steps, in order.
  steps: z.tuple([step("understand"), step("listen"), step("learn"), step("practice")]),
})
  .refine((l) => l.steps[1].blocks.some((b) => b.type === "audio"), "the Listen step needs an audio block")
  .refine((l) => l.steps[3].blocks.some(isQuiz), "the Practice step needs at least one drill");

export type Track = z.infer<typeof trackSchema>;
export type Module = z.infer<typeof moduleSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type LessonInput = z.input<typeof lessonSchema>;
export type Content = { tracks: Track[]; modules: Module[]; lessons: Lesson[] };

/** Validate everything in content/ and the links between items. Throws one readable error. */
export function validateContent(raw: { tracks: unknown[]; modules: unknown[]; lessons: unknown[] }): Content {
  const problems: string[] = [];
  const parse = <T>(schema: z.ZodType<T>, items: unknown[], kind: string): T[] =>
    items.flatMap((item, i) => {
      const result = schema.safeParse(item);
      if (result.success) return [result.data];
      const name = (item as { slug?: string })?.slug ?? `#${i}`;
      problems.push(...result.error.issues.map((issue) => `${kind} ${name}: ${issue.path.join(".")} ${issue.message}`));
      return [];
    });
  const content: Content = {
    tracks: parse(trackSchema, raw.tracks, "track"),
    modules: parse(moduleSchema, raw.modules, "module"),
    lessons: parse(lessonSchema, raw.lessons, "lesson"),
  };

  const unique = (kind: string, slugs: string[]) =>
    slugs.forEach((s, i) => slugs.indexOf(s) !== i && problems.push(`${kind} ${s}: duplicate slug`));
  unique("track", content.tracks.map((t) => t.slug));
  unique("module", content.modules.map((m) => m.slug));
  unique("lesson", content.lessons.map((l) => l.slug));

  const tracks = new Set(content.tracks.map((t) => t.slug));
  const modules = new Map(content.modules.map((m) => [m.slug, m]));
  const lessons = new Set(content.lessons.map((l) => l.slug));
  for (const m of content.modules) if (!tracks.has(m.trackSlug)) problems.push(`module ${m.slug}: unknown track "${m.trackSlug}"`);
  for (const l of content.lessons) {
    const parent = modules.get(l.moduleSlug);
    if (!parent) problems.push(`lesson ${l.slug}: unknown module "${l.moduleSlug}"`);
    // A paid lesson inside a free module would be locked by surprise; the reverse leaks nothing but is a mistake.
    else if (parent.isFree !== l.isFree) problems.push(`lesson ${l.slug}: isFree differs from its module`);
    for (const need of l.needs) if (!lessons.has(need)) problems.push(`lesson ${l.slug}: needs unknown lesson "${need}"`);
  }

  if (problems.length) throw new Error(`Invalid content:\n- ${problems.join("\n- ")}`);
  return content;
}

/** Turn a sound into transport steps. Single notes last one beat, chords two. */
export function soundSteps(sound: Sound): PlaybackStep[] {
  if (sound.kind === "sequence") return sound.notes.map((note) => ({ midis: [midi(note)], beats: 1 }));
  if (sound.kind === "chord") return [{ midis: sound.notes.map(midi), beats: 2 }];
  return sound.chords.map((chord) => ({ midis: chord.map(midi), beats: 2 }));
}
