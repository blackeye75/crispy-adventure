import { expect, test } from "vitest";
import { notationSteps, parseNotation, togetherSteps } from "./notation";

test("notes, chords, rests and bar lines", () => {
  const items = parseNotation("C4/q r/q E4+G4/h | Bb3/8 F#4/8 A4/w");
  expect(items[0]).toEqual({ bar: false, pitches: ["C4"], duration: "q", dotted: false, tie: false });
  expect(items[1]).toEqual({ bar: false, pitches: [], duration: "q", dotted: false, tie: false });
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

test("two staves sound together, and a held note is struck once", () => {
  const right = notationSteps(parseNotation("E4/h G4/h | C5/w"));
  const left = notationSteps(parseNotation("C3/q C3/q C3/h | C3/w"));
  expect(togetherSteps([right, left])).toEqual([
    { midis: [64, 48], beats: 1, holds: [2, 1] }, // E4 rings for two beats while the left hand moves
    { midis: [48], beats: 1, holds: [1] },
    { midis: [67, 48], beats: 2, holds: [2, 2] },
    { midis: [72, 48], beats: 4, holds: [4, 4] },
  ]);
  expect(togetherSteps([right])).toBe(right);
  // total length is unchanged, and rests in one part do not shorten the other
  const withRest = togetherSteps([notationSteps(parseNotation("r/q C4/q")), notationSteps(parseNotation("C3/h"))]);
  expect(withRest).toEqual([{ midis: [48], beats: 1, holds: [2] }, { midis: [60], beats: 1, holds: [1] }]);
});

test("dots add half the length, sixteenths are a quarter beat, ties join notes across a bar line", () => {
  expect(notationSteps(parseNotation("B4/h. B4/q")).map((s) => s.beats)).toEqual([3, 1]);
  expect(notationSteps(parseNotation("B4/q. B4/8 B4/16 B4/16 B4/8")).map((s) => s.beats)).toEqual([1.5, 0.5, 0.25, 0.25, 0.5]);
  expect(notationSteps(parseNotation("B4/h B4/h~ | B4/h B4/h"))).toEqual([{ midis: [71], beats: 2 }, { midis: [71], beats: 4 }, { midis: [71], beats: 2 }]);
  // six eighths fill a bar of 6/8 and a bar of 3/4 alike
  expect(notationSteps(parseNotation("B4/q. B4/q.")).reduce((sum, s) => sum + s.beats, 0)).toBe(3);
});
