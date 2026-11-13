import { expect, test } from "vitest";
import { notationSteps, parseNotation, togetherSteps } from "./notation";

test("notes, chords, rests and bar lines", () => {
  const items = parseNotation("C4/q r/q E4+G4/h | Bb3/8 F#4/8 A4/w");
  expect(items[0]).toEqual({ bar: false, pitches: ["C4"], duration: "q" });
  expect(items[1]).toEqual({ bar: false, pitches: [], duration: "q" });
  expect(items[3]).toEqual({ bar: true });
  expect(notationSteps(items)).toEqual([
    { midis: [60], beats: 1 }, { midis: [], beats: 1 }, { midis: [64, 67], beats: 2 },
    { midis: [58], beats: 0.5 }, { midis: [66], beats: 0.5 }, { midis: [69], beats: 4 },
  ]);
});

test("a bar of 4/4 adds up to four beats whatever it is made of", () => {
  for (const bar of ["B4/w", "B4/h B4/h", "B4/q B4/q B4/q B4/q", "B4/8 B4/8 B4/q r/h"]) {
    expect(notationSteps(parseNotation(bar)).reduce((sum, s) => sum + s.beats, 0), bar).toBe(4);
  }
});

test("rejects what it does not understand", () => {
  for (const bad of ["C4", "H4/q", "C4/x", "C/q", "r+C4/q"]) expect(() => parseNotation(bad), bad).toThrow();
});

test("two staves sound together", () => {
  const right = notationSteps(parseNotation("E4/h G4/h | C5/w"));
  const left = notationSteps(parseNotation("C3/h C3/h | C3/w"));
  expect(togetherSteps([right, left])).toEqual([{ midis: [64, 48], beats: 2 }, { midis: [67, 48], beats: 2 }, { midis: [72, 48], beats: 4 }]);
  expect(togetherSteps([right])).toEqual(right);
  const moving = togetherSteps([notationSteps(parseNotation("C4/q D4/q")), notationSteps(parseNotation("C3/h"))]);
  expect(moving.map((s) => s.beats)).toEqual([1, 1]);
});
