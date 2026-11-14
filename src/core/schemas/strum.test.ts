import { expect, test } from "vitest";
import { blockSchema, soundPlayback, strumSteps } from "./content";

const G = ["G2", "B2", "D3"];
test("strum steps: sixteenths are a quarter beat, swing is long-short, a miss is silent", () => {
  expect(strumSteps("D - D U - U D U", G).map((s) => s.beats)).toEqual(Array(8).fill(0.5));
  expect(strumSteps("D - D U - U D U", G).map((s) => s.midis.length)).toEqual([3, 0, 3, 3, 0, 3, 3, 3]);
  expect(strumSteps(Array(16).fill("D").join(" "), G, "16ths").reduce((sum, s) => sum + s.beats, 0)).toBe(4);
  const swung = strumSteps("D U D U D U D U", G, "swing");
  expect(swung[0].beats).toBeCloseTo(2 / 3);
  expect(swung[1].beats).toBeCloseTo(1 / 3);
  expect(strumSteps("D - D U D U", G, "3/4").reduce((sum, s) => sum + s.beats, 0)).toBe(3);
});
test("strum steps: accents are louder than the strums around them; muted and short strums are cut off", () => {
  const [accent, plain, muted, short] = strumSteps("D> U x D. - - - -", G);
  expect(accent.velocity).toBe(1);
  expect(plain.velocity).toBeLessThan(1);
  expect(muted.holds![0]).toBeLessThan(0.1);
  expect(short.holds![0]).toBeLessThan(short.beats);
  expect(strumSteps("D U D U D U D U", G)[0].velocity).toBeUndefined(); // no accents: nothing is turned down
});
test("a pattern must fill its bar, and the click follows the feel", () => {
  const block = (pattern: string, feel?: string) => blockSchema.safeParse({ type: "strum-pattern", pattern, chord: G, feel }).success;
  expect(block("D - D U - U D U")).toBe(true);
  expect(block("D - D U - U D")).toBe(false);
  expect(block("D> D D D> D D", "6/8")).toBe(true);
  expect(block("D U D U D U D U", "16ths")).toBe(false);
  expect(block("D ? D U - U D U")).toBe(false);
  expect(soundPlayback({ kind: "strum", pattern: "D> D D D> D D", chord: G, feel: "6/8", bpm: 80 }).metronome).toEqual({ every: 0.5, accent: 3 });
});
