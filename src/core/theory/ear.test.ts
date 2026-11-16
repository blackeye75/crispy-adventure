import { describe, expect, test } from "vitest";
import { EAR_MODES, earQuestion } from "./ear";

/** A repeatable stand-in for Math.random. */
function seeded(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

describe("ear trainer questions", () => {
  test("every question has four different options, a valid answer and something to hear inside the instruments' range", () => {
    for (const mode of EAR_MODES) {
      const random = seeded(42);
      for (let n = 0; n < 200; n++) {
        const q = earQuestion(mode, random);
        expect(new Set(q.options).size, mode).toBe(4);
        expect(q.answer >= 0 && q.answer < 4).toBe(true);
        expect(q.steps.length).toBeGreaterThan(0);
        for (const m of q.steps.flatMap((s) => s.midis)) expect(m >= 40 && m <= 88, `${mode}: ${m}`).toBe(true);
      }
    }
  });
  test("an interval question plays the two notes, then both together, the right distance apart", () => {
    const q = earQuestion("interval", seeded(7));
    const [low, high, both] = q.steps;
    expect(both.midis).toEqual([low.midis[0], high.midis[0]]);
    const distance = high.midis[0] - low.midis[0];
    expect(q.why).toBe(`${distance} half step${distance === 1 ? "" : "s"} apart.`);
  });
  test("a scale question climbs from the root to the octave", () => {
    const q = earQuestion("scale", seeded(3));
    const notes = q.steps.map((s) => s.midis[0]);
    expect(notes.at(-1)! - notes[0]).toBe(12);
    expect([...notes].sort((a, b) => a - b)).toEqual(notes);
  });
});
