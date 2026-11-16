// Request contracts for /api/v1, shared with the mobile app.
import { NOTE_NAMINGS } from "../theory/syllables";
import { z } from "zod";
import { isTimeZone } from "../review/streak";

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(80);

export type Instrument = "guitar" | "piano";
export const DAILY_GOALS = [5, 10, 15, 20] as const;

/** PATCH /me. The first call must carry instrument, level, dailyGoalMinutes and timezone: it creates the profile. */
export const profilePatchSchema = z.object({
  displayName: z.string().trim().min(1).max(60),
  instrument: z.enum(["guitar", "piano"]),
  leftHanded: z.boolean(),
  noteNaming: z.enum(NOTE_NAMINGS),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  dailyGoalMinutes: z.union(DAILY_GOALS.map((n) => z.literal(n))),
  timezone: z.string().refine(isTimeZone, "unknown time zone"),
}).partial();
export type ProfilePatch = z.infer<typeof profilePatchSchema>;

/** POST /progress: where the learner is in a lesson, or that they finished it. */
export const progressInputSchema = z.object({
  lessonSlug: slug,
  stepIndex: z.number().int().min(0).max(100),
  completed: z.boolean().default(false),
  /** With `completed`: drills in the lesson and how many were right first time. */
  /** With `completed`: seconds actually spent in the lesson this sitting. */
  seconds: z.number().int().min(0).max(7200).optional(),
  drills: z.object({ answered: z.number().int().min(0).max(50), correct: z.number().int().min(0).max(50) }).refine((d) => d.correct <= d.answered).optional(),
});
export type ProgressInput = z.infer<typeof progressInputSchema>;

/** POST /review/answer */
export const reviewAnswerSchema = z.object({ conceptId: slug, correct: z.boolean(), /** seconds spent on the drill */ seconds: z.number().int().min(0).max(600).optional() });

/** POST /placement: the learner's answers to the placement questions GET /placement returned. */
export const placementAnswersSchema = z.object({
  answers: z.array(z.object({ lessonSlug: slug, blockIndex: z.number().int().min(0).max(50), answer: z.number().int().min(0).max(3) })).max(60),
});
export type PlacementAnswers = z.infer<typeof placementAnswersSchema>;

/** POST /billing/subscribe */
export const subscribeSchema = z.object({ plan: z.enum(["monthly", "yearly"]) });
