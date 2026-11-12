import { describe, expect, test } from "vitest";
import { newReview, schedule } from "./schedule";
import { advanceStreak, currentStreak, isTimeZone, localDate } from "./streak";

const now = new Date("2026-03-09T10:00:00Z");
const days = (state: { dueAt: Date }) => (state.dueAt.getTime() - now.getTime()) / 86_400_000;

describe("schedule", () => {
  test("a new concept is due tomorrow", () => {
    expect(days(newReview(now))).toBe(1);
  });
  test("correct answers space out: 3 days, then by the ease factor", () => {
    const first = schedule(newReview(now), true, now);
    expect([first.intervalDays, days(first)]).toEqual([3, 3]);
    const second = schedule(first, true, now);
    expect(second.intervalDays).toBe(8); // round(3 × 2.55)
    const third = schedule(second, true, now);
    expect(third.intervalDays).toBe(21); // round(8 × 2.6)
    expect(third.lastResult).toBe("correct");
  });
  test("a miss comes back tomorrow, counts as a lapse and lowers the ease", () => {
    const grown = schedule(schedule(newReview(now), true, now), true, now);
    const missed = schedule(grown, false, now);
    expect(missed).toMatchObject({ intervalDays: 1, lapses: 1, lastResult: "wrong" });
    expect(days(missed)).toBe(1);
    expect(missed.ease).toBeCloseTo(grown.ease - 0.2);
  });
  test("ease stays within 1.3 and 3.0", () => {
    let low = newReview(now);
    let high = newReview(now);
    for (let i = 0; i < 30; i++) {
      low = schedule(low, false, now);
      high = schedule(high, true, now);
    }
    expect(low.ease).toBe(1.3);
    expect(high.ease).toBe(3);
  });
});

describe("streak", () => {
  test("the day follows the learner's time zone", () => {
    const lateEvening = new Date("2026-03-09T19:00:00Z"); // 00:30 on the 10th in India
    expect(localDate(lateEvening, "Asia/Kolkata")).toBe("2026-03-10");
    expect(localDate(lateEvening, "America/New_York")).toBe("2026-03-09");
    expect(isTimeZone("Asia/Kolkata")).toBe(true);
    expect(isTimeZone("Mars/Olympus")).toBe(false);
  });
  test("grows on consecutive days, ignores a second session, resets after a gap", () => {
    let s = advanceStreak({ current: 0, longest: 0 }, "2026-02-28");
    expect(s).toEqual({ current: 1, longest: 1, lastActiveDate: "2026-02-28" });
    s = advanceStreak(s, "2026-02-28");
    expect(s.current).toBe(1);
    s = advanceStreak(s, "2026-03-01"); // across a month end
    expect(s.current).toBe(2);
    s = advanceStreak(s, "2026-03-03"); // missed the 2nd
    expect(s).toEqual({ current: 1, longest: 2, lastActiveDate: "2026-03-03" });
  });
  test("the shown streak survives until the end of the next day", () => {
    const s = { current: 4, longest: 6, lastActiveDate: "2026-03-08" };
    expect(currentStreak(s, "2026-03-08")).toBe(4);
    expect(currentStreak(s, "2026-03-09")).toBe(4);
    expect(currentStreak(s, "2026-03-10")).toBe(0);
  });
});
