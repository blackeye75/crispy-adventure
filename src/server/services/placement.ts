import type { PlacementAnswers } from "@/core/schemas/api";
import type { BlockOf, Lesson } from "@/core/schemas/content";
import type { Viewer } from "../auth/session";
import { connectDb } from "../db/connect";
import { LessonProgressModel } from "../db/models";
import { accessibleLessons } from "./content";
import { startReviewing } from "./progress";

const PER_MODULE = 3;
type Question = { moduleSlug: string; lessonSlug: string; blockIndex: number; block: BlockOf<"quiz-choice"> | BlockOf<"quiz-ear"> };

/** Up to three questions per module: the first multiple-choice drill of its last lessons. Always the same set, so answers can be checked. */
function questions(lessons: Lesson[]): Question[] {
  const modules = [...new Set(lessons.map((l) => l.moduleSlug))];
  return modules.flatMap((moduleSlug) =>
    lessons.filter((l) => l.moduleSlug === moduleSlug).flatMap((lesson) => {
      const blockIndex = lesson.steps[3].blocks.findIndex((b) => b.type === "quiz-choice" || b.type === "quiz-ear");
      return blockIndex < 0 ? [] : [{ moduleSlug, lessonSlug: lesson.slug, blockIndex, block: lesson.steps[3].blocks[blockIndex] as Question["block"] }];
    }).slice(-PER_MODULE),
  );
}

/** GET /placement */
export async function getPlacement(viewer: Viewer): Promise<Question[]> {
  return questions(await accessibleLessons(viewer));
}

/**
 * POST /placement: mark as completed every lesson in the modules the learner clearly knows,
 * from the start of the path up to the first module with a wrong or missing answer.
 */
export async function submitPlacement(viewer: Viewer, { answers }: PlacementAnswers, now = new Date()) {
  const lessons = await accessibleLessons(viewer);
  const asked = questions(lessons);
  const right = (q: Question) => answers.some((a) => a.lessonSlug === q.lessonSlug && a.blockIndex === q.blockIndex && a.answer === q.block.answer);
  const modules = [...new Set(lessons.map((l) => l.moduleSlug))];
  const firstUnknown = modules.findIndex((m) => { const qs = asked.filter((q) => q.moduleSlug === m); return !qs.length || !qs.every(right); });
  const known = new Set(modules.slice(0, firstUnknown < 0 ? modules.length : firstUnknown));
  const skipped = lessons.filter((l) => known.has(l.moduleSlug));

  if (skipped.length) {
    await connectDb();
    await LessonProgressModel.bulkWrite(skipped.map((l) => ({
      updateOne: { filter: { userId: viewer.userId, lessonSlug: l.slug }, update: { $set: { status: "completed", stepIndex: 0 }, $setOnInsert: { completedAt: now, attempts: 0 } }, upsert: true },
    })));
    // Known material still gets reviewed, so anything shaky surfaces quickly.
    await startReviewing(viewer.userId, [...new Set(skipped.flatMap((l) => l.concepts))], now);
  }
  return { skippedLessons: skipped.length, skippedModules: known.size };
}
