import { isQuiz, type Block } from "@/core/schemas/content";
import { schedule } from "@/core/review/schedule";
import { ServiceError } from "../api";
import type { Viewer } from "../auth/session";
import { connectDb } from "../db/connect";
import { ReviewItemModel } from "../db/models";
import { accessibleLessons } from "./content";
import { recordActivity, requireProfile } from "./profile";

const SESSION_SIZE = 20;
const MAX_SECONDS_PER_DRILL = 120; // the time is reported by the device, so cap it

/** Review is part of the subscription. */
function requireSubscriber(viewer: Viewer) {
  if (!viewer.subscriber) throw new ServiceError(403, "subscription_required", "Review is part of the subscription.");
}

export type ReviewDrill = { conceptId: string; lessonTitle: string; block: Block };

/** GET /review/due: one drill for each concept that is due, oldest first. */
export async function getDueReview(viewer: Viewer, now = new Date()): Promise<ReviewDrill[]> {
  requireSubscriber(viewer);
  await connectDb();
  const due = await ReviewItemModel.find({ userId: viewer.userId, dueAt: { $lte: now } }).sort({ dueAt: 1 }).limit(SESSION_SIZE).lean();
  const lessons = await accessibleLessons(viewer);
  return due.flatMap((item) => {
    // Any drill from a lesson that teaches the concept; a different one each time keeps it fresh.
    const pool = lessons.filter((l) => l.concepts.includes(item.conceptId)).flatMap((l) => l.steps[3].blocks.filter(isQuiz).map((block) => ({ lessonTitle: l.title, block })));
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return pick ? [{ conceptId: item.conceptId, ...pick }] : []; // concept no longer taught: nothing to ask
  });
}

/** POST /review/answer: record the result and reschedule the concept. */
export async function answerReview(viewer: Viewer, answer: { conceptId: string; correct: boolean; seconds?: number }, now = new Date()) {
  requireSubscriber(viewer);
  const profile = await requireProfile(viewer.userId);
  const item = await ReviewItemModel.findOne({ userId: viewer.userId, conceptId: answer.conceptId });
  if (!item) throw new ServiceError(404, "not_found", "You are not reviewing that concept.");
  const next = schedule(item, answer.correct, now);
  await ReviewItemModel.updateOne({ _id: item._id }, { $set: next });
  const today = await recordActivity(profile, { minutes: Math.min(answer.seconds ?? 20, MAX_SECONDS_PER_DRILL) / 60, answered: 1, correct: answer.correct ? 1 : 0 }, now);
  return { dueAt: next.dueAt, intervalDays: next.intervalDays, today };
}
