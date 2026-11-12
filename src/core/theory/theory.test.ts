import { Scale } from "tonal";
import { describe, expect, test } from "vitest";
import { CHORDS, chordPitches, getChord } from "./chords";
import { INTERVALS, degreeToInterval, intervalToDegree, invert, semitones, shortName } from "./intervals";
import { harmonise, parseNumeral, relativeMajor, relativeMinor } from "./keys";
import { chroma, glyphs, midi, respellRoot, rootChoices, spellMidi, transpose } from "./notes";
import { SCALES, getScale, scaleIntervals } from "./scales";

describe("notes", () => {
  test("midi numbers: middle C is 60, A4 is 69, enharmonic edge cases", () => {
    expect(midi("C4")).toBe(60);
    expect(midi("A4")).toBe(69);
    expect(midi("B#3")).toBe(60);
    expect(midi("Cb4")).toBe(59);
    expect(() => midi("H2")).toThrow();
  });
  test("spellMidi keeps the key's spelling and the right octave", () => {
    expect(spellMidi(65, "E#")).toBe("E#4");
    expect(spellMidi(60, "B#")).toBe("B#3");
    expect(spellMidi(59, "Cb")).toBe("Cb4");
    expect(midi(spellMidi(71, "Cb"))).toBe(71);
  });
  test("enharmonic notes share a chroma", () => {
    expect(chroma("C#")).toBe(chroma("Db"));
    expect(chroma("E#")).toBe(chroma("F"));
  });
  test("transpose spells by letter, not by key colour", () => {
    expect(transpose("F#", "7M")).toBe("E#");
    expect(transpose("Bb", "4P")).toBe("Eb");
  });
  test("glyphs", () => {
    expect(glyphs("F#")).toBe("F♯");
    expect(glyphs("Bb")).toBe("B♭");
    expect(glyphs("Bm7b5")).toBe("Bm7♭5");
  });
  test("root choices pick the simpler spelling", () => {
    const major = rootChoices(scaleIntervals("major"));
    expect(major).toEqual(["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]);
    const minor = rootChoices(scaleIntervals("natural-minor"));
    expect(minor[1]).toBe("C#");
    expect(minor[8]).toBe("G#");
    expect(minor[10]).toBe("Bb");
    expect(respellRoot("Db", scaleIntervals("natural-minor"))).toBe("C#");
  });
});

describe("intervals", () => {
  test("reference table: half steps match", () => {
    for (const i of INTERVALS) expect(semitones(i.id)).toBe(i.semitones);
    expect(INTERVALS.map((i) => i.short).join(" ")).toBe("P1 m2 M2 m3 M3 P4 A4 P5 m6 M6 m7 M7 P8");
    expect(semitones("5d")).toBe(6);
  });
  test("degree and interval names convert both ways", () => {
    for (const [degree, interval] of [["1", "1P"], ["b3", "3m"], ["#4", "4A"], ["b5", "5d"], ["#5", "5A"], ["bb7", "7d"], ["9", "9M"]]) {
      expect(degreeToInterval(degree)).toBe(interval);
      expect(intervalToDegree(interval)).toBe(degree);
    }
    expect(shortName("3m")).toBe("m3");
    expect(() => degreeToInterval("bb5")).toThrow();
  });
  test("inversion: a third becomes a sixth", () => {
    expect(invert("3M")).toBe("6m");
    expect(invert("4P")).toBe("5P");
  });
});

describe("scales", () => {
  test("formulas match the CURRICULUM reference table", () => {
    expect(Object.fromEntries(SCALES.map((s) => [s.id, s.formula]))).toEqual({
      major: "1 2 3 4 5 6 7",
      "natural-minor": "1 2 b3 4 5 b6 b7",
      "harmonic-minor": "1 2 b3 4 5 b6 7",
      "melodic-minor": "1 2 b3 4 5 6 7",
      "major-pentatonic": "1 2 3 5 6",
      "minor-pentatonic": "1 b3 4 5 b7",
      blues: "1 b3 4 b5 5 b7",
      dorian: "1 2 b3 4 5 6 b7",
      phrygian: "1 b2 b3 4 5 b6 b7",
      lydian: "1 2 3 #4 5 6 7",
      mixolydian: "1 2 3 4 5 6 b7",
      locrian: "1 b2 b3 4 b5 b6 b7",
      "whole-tone": "1 2 3 #4 #5 b7",
    });
  });
  test("agree with tonal's independent scale dictionary", () => {
    const tonalName: Record<string, string> = { "natural-minor": "minor", "harmonic-minor": "harmonic minor", "melodic-minor": "melodic minor", "major-pentatonic": "major pentatonic", "minor-pentatonic": "minor pentatonic" };
    // whole-tone is left out: tonal spells its last note as #6, the reference table as b7
    for (const s of SCALES.filter((s) => s.id !== "whole-tone")) {
      expect(scaleIntervals(s.id), s.id).toEqual(Scale.get(`C ${tonalName[s.id] ?? s.id}`).intervals);
    }
  });
  test("real keys are spelled correctly", () => {
    expect(getScale("C", "major").notes.join(" ")).toBe("C D E F G A B");
    expect(getScale("F#", "major").notes.join(" ")).toBe("F# G# A# B C# D# E#");
    expect(getScale("Bb", "major").notes.join(" ")).toBe("Bb C D Eb F G A");
    expect(getScale("A", "harmonic-minor").notes.join(" ")).toBe("A B C D E F G#");
    expect(getScale("A", "minor-pentatonic").notes.join(" ")).toBe("A C D E G");
    expect(getScale("A", "blues").notes.join(" ")).toBe("A C D Eb E G");
    expect(getScale("D", "dorian").notes.join(" ")).toBe("D E F G A B C");
    expect(getScale("C", "whole-tone").notes.join(" ")).toBe("C D E F# G# Bb");
  });
  test("step patterns", () => {
    expect(getScale("C", "major").steps.join("–")).toBe("W–W–H–W–W–W–H");
    expect(getScale("A", "natural-minor").steps.join("–")).toBe("W–H–W–W–H–W–W");
    expect(getScale("A", "minor-pentatonic").steps.join(" ")).toBe("W+H W W W+H W");
  });
});

describe("chords", () => {
  test("formulas match the CURRICULUM reference table", () => {
    expect(Object.fromEntries(CHORDS.map((c) => [c.id, c.formula]))).toEqual({
      major: "1 3 5", minor: "1 b3 5", dim: "1 b3 b5", aug: "1 3 #5",
      sus2: "1 2 5", sus4: "1 4 5", "5": "1 5",
      maj7: "1 3 5 7", "7": "1 3 5 b7", m7: "1 b3 5 b7", m7b5: "1 b3 b5 b7",
      dim7: "1 b3 b5 bb7", mmaj7: "1 b3 5 7",
      "6": "1 3 5 6", m6: "1 b3 5 6", add9: "1 3 5 9",
      "9": "1 3 5 b7 9", maj9: "1 3 5 7 9", m9: "1 b3 5 b7 9",
    });
  });
  test("real chords", () => {
    expect(getChord("C", "major").notes.join(" ")).toBe("C E G");
    expect(getChord("A", "m7").notes.join(" ")).toBe("A C E G");
    expect(getChord("B", "m7b5").notes.join(" ")).toBe("B D F A");
    expect(getChord("C", "dim7").notes.join(" ")).toBe("C Eb Gb Bbb");
    expect(getChord("E", "aug").notes.join(" ")).toBe("E G# B#");
    expect(getChord("G", "7").symbol).toBe("G7");
    expect(getChord("C", "add9").notes.join(" ")).toBe("C E G D");
  });
  test("interval stack", () => {
    expect(getChord("C", "major").stack).toEqual(["M3", "m3"]);
    expect(getChord("C", "minor").stack).toEqual(["m3", "M3"]);
    expect(getChord("G", "7").stack).toEqual(["M3", "m3", "m3"]);
  });
  test("voicings and inversions", () => {
    expect(chordPitches("C", "major", 3)).toEqual([48, 52, 55]);
    expect(chordPitches("C", "major", 3, 1)).toEqual([52, 55, 60]);
    expect(chordPitches("C", "major", 3, 2)).toEqual([55, 60, 64]);
    expect(chordPitches("C", "5", 3, 3)).toEqual([55, 60]);
  });
});

describe("keys", () => {
  const numerals = (root: string, scale: Parameters<typeof harmonise>[1], size?: 3 | 4) =>
    harmonise(root, scale, size).map((c) => c.numeral).join(" ");
  test("chords of a key match the CURRICULUM reference table", () => {
    expect(numerals("C", "major")).toBe("I ii iii IV V vi vii°");
    expect(numerals("C", "major", 4)).toBe("Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7");
    expect(numerals("A", "natural-minor")).toBe("i ii° III iv v VI VII");
    expect(numerals("A", "natural-minor", 4)).toBe("i7 iiø7 IIImaj7 iv7 v7 VImaj7 VII7");
    expect(numerals("A", "harmonic-minor")).toBe("i ii° III+ iv V VI vii°");
  });
  test("real keys", () => {
    expect(harmonise("C", "major").map((c) => c.symbol).join(" ")).toBe("C Dm Em F G Am B°");
    expect(harmonise("F#", "major").map((c) => c.symbol).join(" ")).toBe("F# G#m A#m B C# D#m E#°");
    expect(harmonise("G", "major", 4).map((c) => c.symbol).join(" ")).toBe("Gmaj7 Am7 Bm7 Cmaj7 D7 Em7 F#m7b5");
    expect(() => harmonise("A", "minor-pentatonic")).toThrow();
  });
  test("Roman numerals", () => {
    expect(["I", "V", "vi", "IV"].map((n) => parseNumeral("C", n).symbol)).toEqual(["C", "G", "Am", "F"]);
    expect(["ii7", "V7", "Imaj7"].map((n) => parseNumeral("Bb", n).symbol)).toEqual(["Cm7", "F7", "Bbmaj7"]);
    expect(parseNumeral("C", "bVII").symbol).toBe("Bb");
    expect(parseNumeral("C", "vii°").symbol).toBe("B°");
    expect(parseNumeral("C", "viiø7").symbol).toBe("Bm7b5");
    expect(() => parseNumeral("C", "VIII")).toThrow();
    expect(() => parseNumeral("C", "I°")).toThrow();
  });
  test("relative keys", () => {
    expect(relativeMinor("C")).toBe("A");
    expect(relativeMinor("F#")).toBe("D#");
    expect(relativeMajor("A")).toBe("C");
    expect(relativeMajor("G")).toBe("Bb");
  });
});
