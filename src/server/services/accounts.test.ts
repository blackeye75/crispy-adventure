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

  test("placement skips modules from the start of the path while every answer is right", async () => {
    const viewer = user();
    await updateProfile(viewer, setup);
    const asked = await getPlacement(viewer);
    expect(asked.map((q) => q.moduleSlug)).toEqual([...Array(3).fill("sound-and-pitch"), ...Array(3).fill("musical-alphabet")]);
    const answers = asked.map((q) => ({ lessonSlug: q.lessonSlug, blockIndex: q.blockIndex, answer: q.block.answer }));

    const oneWrong = answers.map((a, i) => (i === 4 ? { ...a, answer: (a.answer + 1) % 2 } : a));
    expect(await submitPlacement(viewer, { answers: oneWrong }, day1)).toEqual({ skippedLessons: 4, skippedModules: 1 });
    expect(await LessonProgressModel.countDocuments({ userId: viewer.userId, status: "completed" })).toBe(4);
    expect(await ReviewItemModel.countDocuments({ userId: viewer.userId })).toBe(4);

    const other = user();
    expect(await submitPlacement(other, { answers: answers.slice(3) }, day1)).toEqual({ skippedLessons: 0, skippedModules: 0 }); // first module unanswered
    expect(await submitPlacement(other, { answers }, day1)).toEqual({ skippedLessons: 9, skippedModules: 2 });
  });
});
