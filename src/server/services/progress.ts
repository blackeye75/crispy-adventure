import type { ProgressInput } from "@/core/schemas/api";
import { newReview } from "@/core/review/schedule";
import { ServiceError } from "../api";
import type { Viewer } from "../auth/session";
import { connectDb } from "../db/connect";
import { LessonProgressModel, ReviewItemModel, type LessonProgress } from "../db/models";
import { getLesson } from "./content";
import { recordActivity, requireProfile } from "./profile";

/** Start reviewing these concepts (tomorrow) unless the learner already is. */
export async function startReviewing(userId: string, concepts: string[], now: Date) {
  if (!concepts.length) return;
  await ReviewItemModel.bulkWrite(
    concepts.map((conceptId) => ({ updateOne: { filter: { userId, conceptId }, update: { $setOnInsert: newReview(now) }, upsert: true } })),
  );
}

/** Where the learner left a lesson, if they have opened it. */
export async function getProgress(userId: string, lessonSlug: string) {
  await connectDb();
  return LessonProgressModel.findOne({ userId, lessonSlug }, { _id: 0 }).lean<LessonProgress>();
}

/** POST /progress: save the position in a lesson, or its completion (which starts review and counts towards today). */
export async function saveProgress(viewer: Viewer, input: ProgressInput, now = new Date()) {
  const profile = await requireProfile(viewer.userId);
  const result = await getLesson(input.lessonSlug, viewer);
  if (result.status === "not-found") throw new ServiceError(404, "not_found", "No such lesson.");
  if (result.status === "locked") throw new ServiceError(403, "subscription_required", "This lesson needs a subscription.");
  const key = { userId: viewer.userId, lessonSlug: input.lessonSlug };

  if (!input.completed) {
    // Never turn a completed lesson back into "started" when it is replayed.
    await LessonProgressModel.updateOne(key, { $set: { stepIndex: input.stepIndex }, $setOnInsert: { status: "started" } }, { upsert: true });
    return { today: null };
  }

  const score = input.drills?.answered ? input.drills.correct / input.drills.answered : undefined;
  await LessonProgressModel.updateOne(key, { $set: { status: "completed", stepIndex: 0, score, completedAt: now }, $inc: { attempts: 1 } }, { upsert: true });
  await startReviewing(viewer.userId, result.lesson.concepts, now);
  // Time comes from the learner's device, so cap it: a tab left open must not fill a week of goals.
  const planned = result.lesson.minutes;
  const minutes = input.seconds === undefined ? planned : Math.min(input.seconds / 60, planned * 3);
  const today = await recordActivity(profile, { minutes, lessons: 1, answered: input.drills?.answered, correct: input.drills?.correct }, now);
  return { today };
}
