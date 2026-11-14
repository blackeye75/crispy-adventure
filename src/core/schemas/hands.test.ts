import { expect, test } from "vitest";
import { midi } from "../theory/notes";
import { fingersFit, handsPlayback } from "./hands";

test("two hands play together, and each step knows which written note of each hand is sounding", () => {
  const { steps, active } = handsPlayback("C4+E4+G4/q C4+E4+G4/q r/h", "C3/h G2/h");
  expect(steps.map((s) => s.beats)).toEqual([1, 1, 2]);
  expect(steps[0].midis.sort()).toEqual([midi("C3"), midi("C4"), midi("E4"), midi("G4")].sort());
  expect(steps[1].midis).toHaveLength(3); // the left hand is still holding its half note
  expect(active).toEqual([[0, 0], [1, 0], [2, 1]]);
});
test("one hand alone, and a hand that has finished", () => {
  expect(handsPlayback("C4/q D4/q").active).toEqual([[0], [1]]);
  expect(handsPlayback("C4/q D4/q", "C3/q").active).toEqual([[0, 0], [1, undefined]]);
});
test("finger numbers: one per note, a dash for a rest", () => {
  expect(fingersFit("C4+E4+G4/q r/q C4/h", "135 - 1")).toBe(true);
  expect(fingersFit("C4+E4+G4/q r/q C4/h", "13 - 1")).toBe(false);
  expect(fingersFit("C4+E4+G4/q r/q", "135 1")).toBe(false);
  expect(fingersFit("C4/q", "6")).toBe(false);
});
