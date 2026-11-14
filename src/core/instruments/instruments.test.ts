import { describe, expect, test } from "vitest";
import { DEFAULT_CANVAS, canvasFromQuery, canvasToQuery, type CanvasState } from "../schemas/canvas";
import { STANDARD_TUNING, fretColumn, fretMidi, positionsOf, shapeMidis } from "./fretboard";
import { keyboardKeys } from "./keyboard";
import { playbackSteps, resolveCanvas } from "./resolveCanvas";

const canvas = (patch: Partial<CanvasState>): CanvasState => ({ ...DEFAULT_CANVAS, ...patch });

describe("fretboard", () => {
  test("standard tuning: fourths, except G to B which is a major third", () => {
    const open = STANDARD_TUNING.map((_, s) => fretMidi(STANDARD_TUNING, s, 0));
    expect(open.slice(1).map((m, i) => m - open[i])).toEqual([5, 5, 5, 4, 5]);
  });
  test("the 12th fret is the open string an octave up; 5th fret of low E is A2", () => {
    expect(fretMidi(STANDARD_TUNING, 0, 12)).toBe(fretMidi(STANDARD_TUNING, 0, 0) + 12);
    expect(fretMidi(STANDARD_TUNING, 0, 5)).toBe(fretMidi(STANDARD_TUNING, 1, 0));
  });
  test("middle C lives in five places within 24 frets, four within 15", () => {
    expect(positionsOf(60, STANDARD_TUNING, 15)).toEqual([{ string: 1, fret: 15 }, { string: 2, fret: 10 }, { string: 3, fret: 5 }, { string: 4, fret: 1 }]);
    expect(positionsOf(60, STANDARD_TUNING, 24)).toHaveLength(5);
    expect(positionsOf(39, STANDARD_TUNING, 24)).toEqual([]); // below the low E string
  });
  test("tuning is a parameter: Drop D", () => {
    const dropD = ["D2", ...STANDARD_TUNING.slice(1)];
    expect(fretMidi(dropD, 0, 2)).toBe(40); // E2 moves to the 2nd fret
    expect(positionsOf(38, dropD, 15)).toEqual([{ string: 0, fret: 0 }]);
  });
  test("chord shapes: open C is C E G C E, with string 6 silent", () => {
    expect(shapeMidis("x32010")).toEqual([null, 48, 52, 55, 60, 64]);
    expect(shapeMidis("133211").map((m) => m! % 12)).toEqual([5, 0, 5, 9, 0, 5]); // F barre: F C F A C F
    expect(shapeMidis("8-10-10-9-8-8").map((m) => m! % 12)).toEqual([0, 7, 0, 4, 7, 0]); // C as an E-shape barre at fret 8
    expect(() => shapeMidis("x3201")).toThrow();
    expect(() => shapeMidis("x3201y")).toThrow();
  });
  test("left-handed mirrors the columns", () => {
    expect(fretColumn(0, 15, false)).toBe(0);
    expect(fretColumn(0, 15, true)).toBe(15);
    expect(fretColumn(15, 15, true)).toBe(0);
  });
});

describe("keyboard", () => {
  const keys = keyboardKeys("E2", "E6");
  test("E2 to E6 is 49 keys, 29 of them white", () => {
    expect(keys).toHaveLength(49);
    expect(keys.filter((k) => !k.black)).toHaveLength(29);
    expect(keys[0].midi).toBe(40);
    expect(keys.at(-1)!.midi).toBe(88);
  });
  test("black keys sit on the boundary above their lower white neighbour; none between E–F or B–C", () => {
    const byMidi = new Map(keys.map((k) => [k.midi, k]));
    expect(byMidi.get(61)).toMatchObject({ black: true, x: byMidi.get(60)!.x + 1 }); // C#4
    expect(byMidi.get(65)).toMatchObject({ black: false, x: byMidi.get(64)!.x + 1 }); // F4 right after E4
    expect(byMidi.get(60)).toMatchObject({ black: false, x: byMidi.get(59)!.x + 1 }); // C4 right after B3
  });
});

describe("resolveCanvas", () => {
  test("C major scale: panel data and roles", () => {
    const r = resolveCanvas(DEFAULT_CANVAS);
    expect(r.title).toBe("C major scale");
    expect(r.announce).toBe("C major scale: C D E F G A B");
    expect(r.pattern).toBe("W W H W W W H");
    expect(r.tones.map((t) => t.role)).toEqual(["root", "scale", "chord", "scale", "chord", "scale", "scale"]);
    expect(r.related.slice(0, 7).map((c) => c.label).join(" ")).toBe("C Dm Em F G Am B°");
    expect(r.related[7]).toMatchObject({ label: "Relative minor: A minor", root: "A", show: { kind: "scale", scale: "natural-minor" } });
  });
  test("fretboard and keyboard never show different notes", () => {
    for (const state of [DEFAULT_CANVAS, canvas({ root: "F#" }), canvas({ root: "Bb", show: { kind: "chord", chord: "m7" } }), canvas({ show: { kind: "progression", numerals: ["I", "bVII"], activeIndex: 1 } })]) {
      const r = resolveCanvas(state);
      const classes = (markers: { pitchClass: string }[]) => [...new Set(markers.map((m) => m.pitchClass))].sort();
      expect(classes(r.fretboard)).toEqual(classes(r.keyboard));
      expect(classes(r.fretboard)).toEqual(r.tones.map((t) => t.pitchClass).sort());
    }
  });
  test("F# major shows E#, also in marker pitches", () => {
    const r = resolveCanvas(canvas({ root: "F#" }));
    expect(r.tones.map((t) => t.label)).toContain("E♯");
    expect(r.keyboard.find((m) => m.midi === 65)!.pitch).toBe("E#4");
    expect(r.tones.map((t) => t.pitchClass)).not.toContain("F");
  });
  test("focusing C4 lights exactly the C4 positions on both instruments; other Cs echo", () => {
    const r = resolveCanvas(canvas({ focusPitch: "C4" }));
    expect(r.fretboard.filter((m) => m.focus).map((m) => [m.string, m.fret])).toEqual([[1, 15], [2, 10], [3, 5], [4, 1]]);
    expect(r.keyboard.filter((m) => m.focus).map((m) => m.pitch)).toEqual(["C4"]);
    expect(r.keyboard.filter((m) => m.echo).map((m) => m.pitch)).toEqual(["C3", "C5", "C6"]);
    expect(r.fretboard.filter((m) => m.echo).every((m) => m.pitchClass === "C" && m.midi !== 60)).toBe(true);
  });
  test("labels: degrees and intervals", () => {
    const state = canvas({ root: "A", show: { kind: "scale", scale: "minor-pentatonic" } });
    expect(resolveCanvas({ ...state, labels: "degrees" }).tones.map((t) => t.label).join(" ")).toBe("1 ♭3 4 5 ♭7");
    expect(resolveCanvas({ ...state, labels: "intervals" }).tones.map((t) => t.label).join(" ")).toBe("P1 m3 P4 P5 m7");
  });
  test("chords: title, stack, inversion", () => {
    const r = resolveCanvas(canvas({ root: "A", show: { kind: "chord", chord: "m7" } }));
    expect(r.title).toBe("Am7 (minor 7)");
    expect(r.pattern).toBe("m3 + M3 + m3");
    expect(r.tones.map((t) => t.role)).toEqual(["root", "chord", "chord", "chord"]);
    expect(resolveCanvas(canvas({ show: { kind: "chord", chord: "major", inversion: 1 } })).title).toBe("C/E (major)");
  });
  test("intervals", () => {
    const r = resolveCanvas(canvas({ show: { kind: "interval", interval: "5P" } }));
    expect(r.title).toBe("Perfect fifth");
    expect(r.pattern).toBe("7 half steps");
    expect(r.tones.map((t) => t.pitchClass)).toEqual(["C", "G"]);
  });
  test("progression: active chord is filled over the key's scale; borrowed notes keep their spelling", () => {
    const show = { kind: "progression" as const, numerals: ["I", "V", "vi", "bVII"], activeIndex: 1 };
    const v = resolveCanvas(canvas({ show }));
    expect(v.chords!.map((c) => c.symbol)).toEqual(["C", "G", "Am", "B♭"]);
    expect(v.tones.filter((t) => t.role === "root").map((t) => t.pitchClass)).toEqual(["G"]);
    expect(v.tones.filter((t) => t.role === "chord").map((t) => t.pitchClass)).toEqual(["D", "B"]);
    const flat7 = resolveCanvas(canvas({ show: { ...show, activeIndex: 3 } }));
    expect(flat7.tones.find((t) => t.role === "root")!.pitchClass).toBe("Bb");
    expect(flat7.tones).toHaveLength(8);
  });
  test("position window dims frets outside it, never keys", () => {
    const r = resolveCanvas(canvas({ position: { fromFret: 5, toFret: 8 } }));
    expect(r.fretboard.every((m) => m.dimmed === (m.fret < 5 || m.fret > 8))).toBe(true);
    expect(r.keyboard.some((m) => m.dimmed)).toBe(false);
  });
  test("notes: exact pitches only, with string and fret limits on the guitar", () => {
    const open = ["E2", "A2", "D3", "G3", "B3", "E4"];
    const r = resolveCanvas(canvas({ root: "E", show: { kind: "notes", pitches: open, within: [0, 0] } }));
    expect(r.fretboard.map((m) => [m.string, m.fret, m.pitch])).toEqual(open.map((p, i) => [i, 0, p]));
    expect(r.keyboard.map((m) => m.pitch)).toEqual(open);
    expect(r.fretboard.every((m) => m.role === "chord")).toBe(true);
    const fifth = resolveCanvas(canvas({ root: "A", show: { kind: "notes", pitches: ["A2", "C#3"], strings: [5] } }));
    expect(fifth.fretboard.map((m) => [m.string, m.fret, m.label])).toEqual([[1, 0, "A"], [1, 4, "C♯"]]);
    expect(playbackSteps(canvas({ show: { kind: "notes", pitches: ["C4", "E4"] } }), "up").map((s) => s.midis)).toEqual([[60], [64]]);
  });
  test("notes pinned to exact string and fret: a shape, with each note in one place", () => {
    // G major, three notes per string, lowest two strings
    const show = { kind: "notes" as const, pitches: ["G2", "A2", "B2", "C3", "D3", "E3"], at: [[6, 3], [6, 5], [6, 7], [5, 3], [5, 5], [5, 7]] as [number, number][] };
    const r = resolveCanvas(canvas({ show }));
    expect(r.fretboard.map((m) => [6 - m.string, m.fret, m.pitch])).toEqual([[6, 3, "G2"], [6, 5, "A2"], [6, 7, "B2"], [5, 3, "C3"], [5, 5, "D3"], [5, 7, "E3"]]);
    expect(r.keyboard.map((m) => m.pitch)).toEqual(show.pitches); // the keyboard just shows the pitches
  });
  test("left-handed changes no notes", () => {
    const lefty = resolveCanvas(canvas({ guitar: { ...DEFAULT_CANVAS.guitar, leftHanded: true } }));
    expect(lefty.fretboard).toEqual(resolveCanvas(DEFAULT_CANVAS).fretboard);
  });
});

describe("playback", () => {
  test("scale goes up to the octave, down reverses, chord is the root triad", () => {
    expect(playbackSteps(DEFAULT_CANVAS, "up").map((s) => s.midis[0])).toEqual([48, 50, 52, 53, 55, 57, 59, 60]);
    expect(playbackSteps(DEFAULT_CANVAS, "down").map((s) => s.midis[0])).toEqual([60, 59, 57, 55, 53, 52, 50, 48]);
    expect(playbackSteps(DEFAULT_CANVAS, "chord")).toEqual([{ midis: [48, 52, 55], beats: 2 }]);
  });
  test("everything played stays on a standard-tuned guitar and the E2–E6 keyboard", () => {
    for (const root of ["C", "E", "B", "Bb"]) {
      for (const mode of ["up", "chord"] as const) {
        const steps = [
          ...playbackSteps(canvas({ root, show: { kind: "chord", chord: "maj9", inversion: 3 } }), mode),
          ...playbackSteps(canvas({ root, show: { kind: "progression", numerals: ["I", "vii°", "bVII"], activeIndex: 0 } }), mode),
        ];
        for (const m of steps.flatMap((s) => s.midis)) expect(m >= 40 && m <= 88).toBe(true);
      }
    }
  });
  test("progression plays one block chord per numeral and reports its index", () => {
    const steps = playbackSteps(canvas({ show: { kind: "progression", numerals: ["I", "IV", "V"], activeIndex: 0 } }), "up");
    expect(steps).toEqual([
      { midis: [48, 52, 55], beats: 2, index: 0 },
      { midis: [53, 57, 60], beats: 2, index: 1 },
      { midis: [55, 59, 62], beats: 2, index: 2 },
    ]);
  });
});

describe("canvas URL", () => {
  test("round-trips", () => {
    const states: CanvasState[] = [
      DEFAULT_CANVAS,
      canvas({ root: "F#", labels: "degrees" }),
      canvas({ root: "Bb", show: { kind: "chord", chord: "m7b5", inversion: 2 } }),
      canvas({ show: { kind: "interval", interval: "4A" } }),
      canvas({ show: { kind: "progression", numerals: ["ii7", "V7", "Imaj7"], activeIndex: 0 } }),
      canvas({ show: { kind: "notes", pitches: ["A2", "C#3"], strings: [5], within: [0, 5] } }),
      canvas({ show: { kind: "notes", pitches: ["G2", "C3"], at: [[6, 3], [5, 3]] } }),
      canvas({ guitar: { tuning: ["D2", "A2", "D3", "G3", "B3", "E4"], frets: 24, leftHanded: true } }),
    ];
    for (const s of states) expect(canvasFromQuery(Object.fromEntries(new URLSearchParams(canvasToQuery(s))))).toEqual(s);
    expect(canvasToQuery(DEFAULT_CANVAS)).toBe("root=C&scale=major");
  });
  test("bad input falls back to the default instead of throwing", () => {
    expect(canvasFromQuery({ root: "H", scale: "major" })).toEqual(DEFAULT_CANVAS);
    expect(canvasFromQuery({ scale: "nope" })).toEqual(DEFAULT_CANVAS);
    expect(canvasFromQuery({ prog: "I-XI" })).toEqual(DEFAULT_CANVAS);
    expect(canvasFromQuery({ root: ["C", "D"] })).toEqual(DEFAULT_CANVAS);
  });
});
