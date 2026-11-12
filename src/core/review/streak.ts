export type Streak = { current: number; longest: number; lastActiveDate?: string };

/** Calendar date ("2026-03-09") in the learner's time zone, so a day ends at their midnight. */
export function localDate(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

const dayBefore = (date: string) => new Date(Date.parse(`${date}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);

/** The streak after practising on `today`. Practising twice in a day changes nothing. */
export function advanceStreak(streak: Streak, today: string): Streak {
  if (streak.lastActiveDate === today) return streak;
  const current = streak.lastActiveDate === dayBefore(today) ? streak.current + 1 : 1;
  return { current, longest: Math.max(streak.longest, current), lastActiveDate: today };
}

/** The streak to show: it is still alive today if the learner practised today or yesterday. */
export function currentStreak(streak: Streak, today: string): number {
  return streak.lastActiveDate === today || streak.lastActiveDate === dayBefore(today) ? streak.current : 0;
}

export function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}
