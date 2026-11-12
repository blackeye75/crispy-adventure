// Spaced repetition, one item per learner per concept. A simplified SM-2: answers are right or
// wrong (first try), intervals grow by an ease factor, a miss starts the concept over tomorrow.

export type ReviewState = {
  ease: number; // growth factor, 1.3–3.0
  intervalDays: number;
  dueAt: Date;
  lapses: number; // times forgotten
  lastResult?: "correct" | "wrong";
};

const DAY = 24 * 60 * 60 * 1000;
const MIN_EASE = 1.3;
const MAX_EASE = 3;

/** A concept just learned in a lesson: first review tomorrow. */
export function newReview(now: Date): ReviewState {
  return { ease: 2.5, intervalDays: 1, dueAt: new Date(now.getTime() + DAY), lapses: 0 };
}

/** Reschedule after a review answer. */
export function schedule(item: ReviewState, correct: boolean, now: Date): ReviewState {
  if (!correct) {
    return { ease: Math.max(MIN_EASE, item.ease - 0.2), intervalDays: 1, dueAt: new Date(now.getTime() + DAY), lapses: item.lapses + 1, lastResult: "wrong" };
  }
  // 1 day → 3 days → then multiply by ease.
  const intervalDays = item.intervalDays < 3 ? 3 : Math.round(item.intervalDays * item.ease);
  return { ease: Math.min(MAX_EASE, item.ease + 0.05), intervalDays, dueAt: new Date(now.getTime() + intervalDays * DAY), lapses: item.lapses, lastResult: "correct" };
}
