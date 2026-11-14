// Needs a real MongoDB: MONGODB_TEST_URI=mongodb://127.0.0.1:27017/fretkey_test npm run test
import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, test } from "vitest";

const uri = process.env.MONGODB_TEST_URI;
if (uri) process.env.MONGODB_URI = uri;

describe.skipIf(!uri)("accounts and progress (MongoDB)", async () => {
  const { default: mongoose } = await import("mongoose");
  const { content } = await import("../../../content");
  const { validateContent } = await import("@/core/schemas/content");
  const { connectDb } = await import("../db/connect");
  const { LessonModel, ModuleModel, TrackModel, ReviewItemModel, LessonProgressModel } = await import("../db/models");
  const { getPath } = await import("./content");
  const { getMe, updateProfile } = await import("./profile");
  const { saveProgress } = await import("./progress");
  const { getStats } = await import("./stats");
  const { answerReview, getDueReview } = await import("./review");
  const { getPlacement, submitPlacement } = await import("./placement");

  if (uri) {
    await connectDb();
    const valid = validateContent(content);
    for (const [m, docs] of [[TrackModel, valid.tracks], [ModuleModel, valid.modules], [LessonModel, valid.lessons]] as const) {
      await m.bulkWrite(docs.map((doc) => ({ replaceOne: { filter: { slug: doc.slug }, replacement: doc, upsert: true } })));
    }
  }
  afterAll(() => mongoose.disconnect());

  const user = (subscriber = false) => ({ userId: randomUUID(), name: "Asha", email: "asha@example.com", subscriber });
  const setup = { instrument: "guitar", level: "beginner", dailyGoalMinutes: 10, timezone: "Asia/Kolkata" } as const;
  const day1 = new Date("2026-03-09T06:00:00Z");
  const later = (days: number) => new Date(day1.getTime() + days * 86_400_000);

  test("a profile is created by the first complete update, and named after the user", async () => {
    const viewer = user();
    expect((await getMe(viewer, day1)).profile).toBeNull();
    await expect(updateProfile(viewer, { instrument: "piano" })).rejects.toMatchObject({ code: "profile_incomplete" });
    const profile = await updateProfile(viewer, setup);
    expect(profile).toMatchObject({ ...setup, displayName: "Asha", leftHanded: false, streak: { current: 0, longest: 0 } });
    expect((await updateProfile(viewer, { instrument: "piano" })).instrument).toBe("piano");
  });

  test("progress needs a profile, an existing lesson, and saves the position", async () => {
    const viewer = user();
    const input = { lessonSlug: "what-is-a-note", stepIndex: 2, completed: false };
    await expect(saveProgress(viewer, input, day1)).rejects.toMatchObject({ code: "onboarding_required" });
    await updateProfile(viewer, setup);
    await expect(saveProgress(viewer, { ...input, lessonSlug: "nope" }, day1)).rejects.toMatchObject({ status: 404 });
    await saveProgress(viewer, input, day1);
    expect(await LessonProgressModel.findOne({ userId: viewer.userId }).lean()).toMatchObject({ status: "started", stepIndex: 2 });
    await saveProgress(viewer, { ...input, stepIndex: 1 }, day1); // an older save arriving late
    expect((await LessonProgressModel.findOne({ userId: viewer.userId }).lean())!.stepIndex).toBe(2);
  });

  test("review is for subscribers; finishing lessons still queues it up for later", async () => {
    const viewer = user();
    await updateProfile(viewer, setup);
    await saveProgress(viewer, { lessonSlug: "the-octave", stepIndex: 6, completed: true }, day1);
    await expect(getDueReview(viewer, later(1))).rejects.toMatchObject({ status: 403, code: "subscription_required" });
    await expect(answerReview(viewer, { conceptId: "octave", correct: true }, later(1))).rejects.toMatchObject({ status: 403 });
    expect(await getDueReview({ ...viewer, subscriber: true }, later(1))).toHaveLength(1);
  });

  test("finishing a lesson marks the path, fills the daily goal, starts a streak and schedules review", async () => {
    const viewer = user(true);
    await updateProfile(viewer, setup);
    const done = { lessonSlug: "what-is-a-note", stepIndex: 6, completed: true, drills: { answered: 4, correct: 3 } };
    expect((await saveProgress(viewer, done, day1)).today).toEqual({ streak: 1, minutes: 5, goalMinutes: 10 });
    const [theory] = await getPath(viewer);
    expect(theory.levels[0].modules[0].lessons.map((l) => l.completed)).toEqual([true, false, false, false]);
    expect((await LessonProgressModel.findOne({ userId: viewer.userId }).lean())!.score).toBe(0.75);

    // replaying a step must not un-complete it
    await saveProgress(viewer, { lessonSlug: "what-is-a-note", stepIndex: 1, completed: false }, day1);
    expect((await LessonProgressModel.findOne({ userId: viewer.userId }).lean())!.status).toBe("completed");

    expect(await getDueReview(viewer, day1)).toEqual([]); // not due yet
    const me = await getMe(viewer, later(1));
    expect(me.reviewDue).toBe(1);
    expect(me.today).toMatchObject({ streak: 1, minutes: 0 }); // a new day: streak still alive, goal reset

    const [drill] = await getDueReview(viewer, later(1));
    expect(drill).toMatchObject({ conceptId: "pitch", lessonTitle: "What a note is" });
    const answered = await answerReview(viewer, { conceptId: "pitch", correct: true }, later(1));
    expect(answered).toMatchObject({ intervalDays: 3, today: { streak: 2 } });
    expect(await getDueReview(viewer, later(2))).toEqual([]);
    expect(await getDueReview(viewer, later(4))).toHaveLength(1);

    await answerReview(viewer, { conceptId: "pitch", correct: false }, later(4));
    expect(await ReviewItemModel.findOne({ userId: viewer.userId }).lean()).toMatchObject({ intervalDays: 1, lapses: 1, lastResult: "wrong" });
    expect((await getMe(viewer, later(4))).today!.streak).toBe(1); // days 2 and 3 were missed
    await expect(answerReview(viewer, { conceptId: "octave", correct: true }, later(4))).rejects.toMatchObject({ status: 404 });
  });

  test("practice time is what the device measured, capped at three times the lesson's length", async () => {
    const viewer = user();
    await updateProfile(viewer, setup);
    const done = (lessonSlug: string, seconds?: number) => saveProgress(viewer, { lessonSlug, stepIndex: 6, completed: true, seconds }, day1);
    expect((await done("what-is-a-note", 240)).today!.minutes).toBe(4);
    expect((await done("the-octave", 7200)).today!.minutes).toBe(4 + 15); // a tab left open for two hours
    expect((await done("guitar-layout")).today!.minutes).toBe(4 + 15 + 5); // older clients send no time: planned length
  });

  test("stats: totals, accuracy, history, topics for the learner's instrument, and review strength", async () => {
    const viewer = user(true);
    await updateProfile(viewer, setup);
    expect(await getStats(viewer, day1)).toMatchObject({ totals: { minutes: 0, lessonsCompleted: 0, accuracy: null }, history: [], review: { concepts: 0 } });
    await saveProgress(viewer, { lessonSlug: "what-is-a-note", stepIndex: 6, completed: true, seconds: 300, drills: { answered: 4, correct: 3 } }, day1);
    await answerReview(viewer, { conceptId: "pitch", correct: true, seconds: 30 }, later(1));
    await answerReview(viewer, { conceptId: "pitch", correct: true, seconds: 999 }, later(4)); // capped at two minutes
    const stats = await getStats(viewer, later(4));
    expect(stats.streak).toEqual({ current: 1, longest: 2 });
    expect(stats.totals).toEqual({ minutes: 8, lessonsCompleted: 1, daysPractised: 3, accuracy: 5 / 6 });
    expect(stats.history.map((h) => [h.date, h.minutes])).toEqual([["2026-03-13", 2], ["2026-03-10", 1], ["2026-03-09", 5]]);
    expect(stats.topics[0]).toEqual({ level: 1, title: "Sound and pitch", done: 1, total: 3 }); // the piano lesson is not counted for a guitarist
    expect(stats.review).toEqual({ concepts: 1, strong: 1, due: 0 });
  });

  test("placement skips modules from the start of the path while every answer is right", async () => {
    const viewer = user();
    await updateProfile(viewer, setup);
    const asked = await getPlacement(viewer);
    // three questions from each free module with lessons, in path order; paid modules are not asked of a free learner
    expect([...new Set(asked.map((q) => q.moduleSlug))]).toEqual(["sound-and-pitch", "musical-alphabet", "finding-notes", "rhythm-1", "reading-music", "ear-1"]);
    expect(asked).toHaveLength(18);
    const answers = asked.map((q) => ({ lessonSlug: q.lessonSlug, blockIndex: q.blockIndex, answer: q.block.answer }));

    const oneWrong = answers.map((a, i) => (i === 4 ? { ...a, answer: (a.answer + 1) % 2 } : a));
    expect(await submitPlacement(viewer, { answers: oneWrong }, day1)).toEqual({ skippedLessons: 4, skippedModules: 1 });
    expect(await LessonProgressModel.countDocuments({ userId: viewer.userId, status: "completed" })).toBe(4);
    expect(await ReviewItemModel.countDocuments({ userId: viewer.userId })).toBe(4);

    const other = user();
    expect(await submitPlacement(other, { answers: answers.slice(3) }, day1)).toEqual({ skippedLessons: 0, skippedModules: 0 }); // first module unanswered
    expect(await submitPlacement(other, { answers }, day1)).toEqual({ skippedLessons: 31, skippedModules: 6 }); // all of Level 1
  });
});
