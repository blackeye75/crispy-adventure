import type { ProfilePatch } from "@/core/schemas/api";
import { advanceStreak, currentStreak, localDate } from "@/core/review/streak";
import { ServiceError } from "../api";
import type { Viewer } from "../auth/session";
import { connectDb } from "../db/connect";
import { PracticeSessionModel, ProfileModel, ReviewItemModel, type Profile } from "../db/models";

const FIELDS = { _id: 0, createdAt: 0, updatedAt: 0 };

/** The learner's profile, or null before onboarding. */
export async function getProfile(userId: string): Promise<Profile | null> {
  await connectDb();
  return ProfileModel.findOne({ userId }, FIELDS).lean<Profile>();
}

export async function requireProfile(userId: string): Promise<Profile> {
  const profile = await getProfile(userId);
  if (!profile) throw new ServiceError(409, "onboarding_required", "Finish setting up your profile first.");
  return profile;
}

/** Update preferences. The first call creates the profile and must say instrument, level, goal and time zone. */
export async function updateProfile(viewer: Viewer, patch: ProfilePatch): Promise<Profile> {
  await connectDb();
  const existing = await ProfileModel.exists({ userId: viewer.userId });
  if (!existing) {
    const missing = (["instrument", "level", "dailyGoalMinutes", "timezone"] as const).filter((k) => patch[k] === undefined);
    if (missing.length) throw new ServiceError(400, "profile_incomplete", `A new profile needs: ${missing.join(", ")}.`);
  }
  const profile = await ProfileModel.findOneAndUpdate(
    { userId: viewer.userId },
    { $set: patch, $setOnInsert: { ...(patch.displayName ? {} : { displayName: viewer.name }) } },
    { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true, projection: FIELDS },
  ).lean<Profile>();
  return profile!;
}

export type Today = { streak: number; minutes: number; goalMinutes: number };

async function today(profile: Profile, now: Date): Promise<Today> {
  const date = localDate(now, profile.timezone);
  const session = await PracticeSessionModel.findOne({ userId: profile.userId, date }).lean();
  return { streak: currentStreak(profile.streak, date), minutes: Math.round(session?.minutes ?? 0), goalMinutes: profile.dailyGoalMinutes };
}

/** Count practice towards today's goal and keep the streak going. */
export async function recordActivity(profile: Profile, activity: { minutes: number; lessons?: number; answered?: number; correct?: number }, now: Date): Promise<Today> {
  const date = localDate(now, profile.timezone);
  await PracticeSessionModel.updateOne(
    { userId: profile.userId, date },
    { $inc: { minutes: activity.minutes, lessonsCompleted: activity.lessons ?? 0, drillsAnswered: activity.answered ?? 0, drillsCorrect: activity.correct ?? 0 } },
    { upsert: true },
  );
  const streak = advanceStreak(profile.streak, date);
  if (streak !== profile.streak) await ProfileModel.updateOne({ userId: profile.userId }, { $set: { streak } });
  return today({ ...profile, streak }, now);
}

/** GET /me: who you are, your plan, and where today stands. */
export async function getMe(viewer: Viewer, now = new Date()) {
  const profile = await getProfile(viewer.userId);
  return {
    user: { name: viewer.name },
    profile,
    subscription: { status: viewer.subscriber ? "active" : "none" },
    today: profile && (await today(profile, now)),
    reviewDue: await ReviewItemModel.countDocuments({ userId: viewer.userId, dueAt: { $lte: now } }),
  };
}
export type Me = Awaited<ReturnType<typeof getMe>>;
