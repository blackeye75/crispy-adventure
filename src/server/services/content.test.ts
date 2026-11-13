import { describe, expect, test } from "vitest";
import { content } from "../../../content";
import { STANDARD_TUNING, fretMidi } from "@/core/instruments/fretboard";
import { resolveCanvas } from "@/core/instruments/resolveCanvas";
import { DEFAULT_CANVAS, type CanvasState } from "@/core/schemas/canvas";
import { isQuiz, soundSteps, validateContent } from "@/core/schemas/content";
import { chroma, midi } from "@/core/theory/notes";
import { getLesson, getPath } from "./content";

describe("content/", () => {
  const valid = validateContent(content);
  test("is valid: schemas, unique slugs, links, four steps, audio in Listen", () => {
    expect(valid.lessons.length).toBeGreaterThan(0);
  });
  test("every sound stays inside the E2–E6 range the instruments show", () => {
    for (const lesson of valid.lessons) {
      for (const block of lesson.steps.flatMap((s) => s.blocks)) {
        if (!("sound" in block) || !block.sound) continue;
        for (const m of soundSteps(block.sound).flatMap((s) => s.midis)) expect(m >= 40 && m <= 88, `${lesson.slug}: ${m}`).toBe(true);
      }
    }
  });
  test("every note a lesson shows or asks for exists on the lesson instruments (12 frets, E2–E6)", () => {
    const state = (canvas: { root: string; show: CanvasState["show"] }): CanvasState => ({ ...DEFAULT_CANVAS, ...canvas, guitar: { ...DEFAULT_CANVAS.guitar, frets: 12 } });
    for (const lesson of valid.lessons) {
      for (const block of lesson.steps.flatMap((s) => s.blocks)) {
        const canvas = block.type === "instrument" || block.type === "play-along" ? block.canvas : undefined;
        if (canvas?.show.kind === "notes") {
          const r = resolveCanvas(state(canvas));
          const only = "only" in block ? block.only : undefined;
          for (const pitch of canvas.show.pitches) {
            const m = midi(pitch);
            if (only !== "piano") expect(r.fretboard.some((x) => x.midi === m), `${lesson.slug}: ${pitch} on the fretboard`).toBe(true);
            if (only !== "guitar") expect(r.keyboard.some((x) => x.midi === m), `${lesson.slug}: ${pitch} on the keyboard`).toBe(true);
          }
        }
        if (block.type === "quiz-find" && block.only !== "piano") {
          // somewhere on an allowed string, within 12 frets, the answer can be tapped
          const strings = block.strings ?? [1, 2, 3, 4, 5, 6];
          const reachable = strings.some((n) => Array.from({ length: 13 }, (_, fret) => fretMidi(STANDARD_TUNING, 6 - n, fret))
            .some((m) => (/\d$/.test(block.answer) ? m === midi(block.answer) : m % 12 === chroma(block.answer))));
          expect(reachable, `${lesson.slug}: "${block.prompt}"`).toBe(true);
        }
      }
    }
  });
  test("lessons stay short: at most six drills", () => {
    for (const lesson of valid.lessons) expect(lesson.steps[3].blocks.filter(isQuiz).length, lesson.slug).toBeLessThanOrEqual(6);
  });
  test("validation reports broken links and bad answers by name", () => {
    const lesson = structuredClone(content.lessons[0]);
    const broken = { ...content, lessons: [{ ...lesson, moduleSlug: "nope", needs: ["missing"] }, lesson, lesson] };
    expect(() => validateContent(broken)).toThrow(/unknown module "nope"[\s\S]*needs unknown lesson "missing"/);
    expect(() => validateContent(broken)).toThrow(/duplicate slug/);
    const quiz = { type: "quiz-choice", prompt: "?", options: ["a", "b"], answer: 2, why: "." };
    const badAnswer = { ...lesson, steps: [lesson.steps[0], lesson.steps[1], lesson.steps[2], { kind: "practice", blocks: [quiz] }] };
    expect(() => validateContent({ ...content, lessons: [badAnswer] })).toThrow(/answer must index an option/);
  });
});

describe("content service", () => {
  test("the path lists every level without lesson content", async () => {
    const [theory] = await getPath();
    expect(theory.levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(theory.levels[0].modules[0].lessons[0]).toEqual({ slug: "what-is-a-note", title: "What a note is", minutes: 5, strand: "core", locked: false, completed: false });
    expect(JSON.stringify(theory)).not.toContain("blocks");
  });
  test("a lesson comes with the next one in path order, across modules", async () => {
    const first = await getLesson("what-is-a-note");
    expect(first).toMatchObject({ status: "ok", next: { slug: "the-octave" } });
    expect(await getLesson("piano-layout")).toMatchObject({ status: "ok", next: { slug: "natural-notes" } });
    expect(await getLesson("nope")).toEqual({ status: "not-found" });
  });
});
