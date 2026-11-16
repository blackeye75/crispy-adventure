import { expect, test } from "vitest";
import { midi } from "../theory/notes";
import { parseTab, tabFretted, tabSteps } from "./tab";

test("tab: strings count from the thinnest, frets give the pitch, lengths give the beats", () => {
  const items = parseTab("6:5/8 5:7/8 | 3:5/q. r/8 2:5+1:5/h");
  expect(items.map((i) => (i.bar ? "|" : i.notes.length))).toEqual([1, 1, "|", 1, 0, 2]);
  expect(tabSteps(items)).toEqual([
    { midis: [midi("A2")], beats: 0.5 },
    { midis: [midi("E3")], beats: 0.5 },
    { midis: [midi("C4")], beats: 1.5 },
    { midis: [], beats: 0.5 },
    { midis: [midi("E4"), midi("A4")], beats: 2 },
  ]);
});
test("tab: a bend sounds its target, the finger stays on its fret", () => {
  const [whole, half, hammer] = parseTab("3:7/q^b 3:7/q^bh 3:7/q^h");
  expect(tabSteps([whole, half, hammer]).map((s) => s.midis[0])).toEqual([midi("E4"), midi("Eb4"), midi("D4")]);
  expect(tabFretted(whole)).toEqual([midi("D4")]);
});
test("tab: a release sounds the fretted note, a pre-bend its target, a unison bend two equal notes", () => {
  const steps = tabSteps(parseTab("3:7/q^pb 3:7/q^r 3:7+2:5/h^ub"));
  expect(steps.map((s) => s.midis)).toEqual([[midi("E4")], [midi("D4")], [midi("E4"), midi("E4")]]);
});
test("tab: natural harmonics sound an octave, an octave and a fifth, and two octaves above the open string", () => {
  expect(tabSteps(parseTab("3:12/q^n 3:7/q^n 3:5/q^n")).map((s) => s.midis[0])).toEqual([midi("G4"), midi("D5"), midi("G5")]);
  expect(() => parseTab("3:9/q^n")).toThrow();
});
test("tab: another tuning moves every note on the retuned strings", () => {
  const dropD = ["D2", "A2", "D3", "G3", "B3", "E4"];
  expect(tabSteps(parseTab("6:0+5:0+4:0/h"), dropD)[0].midis).toEqual([midi("D2"), midi("A2"), midi("D3")]);
  expect(tabSteps(parseTab("6:0/q 1:0/q"))[0].midis).toEqual([midi("E2")]);
});
test("tab: bad input is refused", () => {
  for (const bad of ["7:5/q", "3:25/q", "3:5", "3:5/q^x", "3:5+3:7/q"]) expect(() => parseTab(bad), bad).toThrow();
});
