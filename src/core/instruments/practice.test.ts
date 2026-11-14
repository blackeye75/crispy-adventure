import { expect, test } from "vitest";
import { loopSection, trainerBpm } from "./practice";

test("the tempo trainer adds 5 bpm every second pass and stops at the limit", () => {
  expect([0, 1, 2, 3, 4].map((p) => trainerBpm(60, p))).toEqual([60, 60, 65, 65, 70]);
  expect(trainerBpm(190, 40)).toBe(200);
});
test("a loop section keeps only the chosen chords", () => {
  const steps = [0, 1, 2, 3].map((index) => ({ midis: [60 + index], beats: 2, index }));
  expect(loopSection(steps, 1, 2).map((s) => s.index)).toEqual([1, 2]);
  expect(loopSection(steps, 3, 3)).toHaveLength(1);
});
