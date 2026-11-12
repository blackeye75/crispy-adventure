import { describe, expect, test } from "vitest";
import { content } from "../../../content";
import { isQuiz, soundSteps, validateContent } from "@/core/schemas/content";
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
    expect(theory.levels[0].modules[0].lessons[0]).toEqual({ slug: "what-is-a-note", title: "What a note is", minutes: 5, strand: "core", locked: false });
    expect(JSON.stringify(theory)).not.toContain("blocks");
  });
  test("a lesson comes with the next one in path order, across modules", async () => {
    const first = await getLesson("what-is-a-note");
    expect(first).toMatchObject({ status: "ok", next: { slug: "the-octave" } });
    expect(await getLesson("piano-layout")).toMatchObject({ status: "ok", next: { slug: "natural-notes" } });
    expect(await getLesson("nope")).toEqual({ status: "not-found" });
  });
});
