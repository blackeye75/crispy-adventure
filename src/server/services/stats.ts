import { currentStreak, localDate } from "@/core/review/streak";
import type { Viewer } from "../auth/session";
import { PracticeSessionModel, ReviewItemModel } from "../db/models";
import { getPath } from "./content";
import { requireProfile } from "./profile";

const STRONG_AFTER_DAYS = 8; // a concept recalled across more than a week counts as strong
const HISTORY_DAYS = 14;

/** GET /stats: streak, practice totals and history, accuracy, and how far each topic has come. */
export async function getStats(viewer: Viewer, now = new Date()) {
  const profile = await requireProfile(viewer.userId);
  const [path, sessions, items] = await Promise.all([
    getPath(viewer),
    // shortcut: reads every practice day to total them; fine for years of daily use, aggregate in the database if it ever is not
    PracticeSessionModel.find({ userId: viewer.userId }).sort({ date: -1 }).lean(),
    ReviewItemModel.find({ userId: viewer.userId }, { intervalDays: 1, dueAt: 1 }).lean(),
  ]);
  const other = profile.instrument === "guitar" ? "piano" : "guitar";
  const sum = (pick: (s: (typeof sessions)[number]) => number) => sessions.reduce((total, s) => total + pick(s), 0);
  const accuracy = (correct: number, answered: number) => (answered ? correct / answered : null);

  return {
    streak: { current: currentStreak(profile.streak, localDate(now, profile.timezone)), longest: profile.streak.longest },
    totals: {
      minutes: Math.round(sum((s) => s.minutes)),
      lessonsCompleted: sum((s) => s.lessonsCompleted),
      daysPractised: sessions.length,
      accuracy: accuracy(sum((s) => s.drillsCorrect), sum((s) => s.drillsAnswered)),
    },
    history: sessions.slice(0, HISTORY_DAYS).map((s) => ({ date: s.date, minutes: Math.round(s.minutes), accuracy: accuracy(s.drillsCorrect, s.drillsAnswered) })),
    topics: path.flatMap((track) => track.levels).flatMap((level) => level.modules.map((m) => {
      const lessons = m.lessons.filter((l) => l.strand !== other);
      return { level: level.level, title: m.title, done: lessons.filter((l) => l.completed).length, total: lessons.length };
    })).filter((topic) => topic.total > 0),
    review: {
      concepts: items.length,
      strong: items.filter((i) => i.intervalDays >= STRONG_AFTER_DAYS).length,
      due: items.filter((i) => i.dueAt <= now).length,
    },
  };
}
export type Stats = Awaited<ReturnType<typeof getStats>>;
