import type { CanvasShow, CanvasState } from "../schemas/canvas";
import { chordPitches, getChord } from "../theory/chords";
import { INTERVALS, intervalToDegree, semitones, shortName } from "../theory/intervals";
import { harmonise, parseNumeral, relativeMajor, relativeMinor } from "../theory/keys";
import { chroma, glyphs, midi, spellMidi, transpose } from "../theory/notes";
import { getScale } from "../theory/scales";
import { fretMidi } from "./fretboard";
import { keyboardKeys } from "./keyboard";

/** The only three visual roles a note can have (docs/CANVAS.md). */
export type Role = "root" | "chord" | "scale";

/** One note of the current selection, independent of octave and instrument. */
export type Tone = { pitchClass: string; chroma: number; interval: string; degree: string; role: Role; label: string };

export type Marker = {
  midi: number;
  pitch: string; // spelled for the key: "E#4"
  pitchClass: string;
  role: Role;
  label: string;
  focus: boolean; // this exact pitch is hovered or tapped
  echo: boolean; // same note in another octave
  dimmed: boolean; // outside the position window
};

export type Related = { label: string; root: string; show: CanvasShow };

export type ResolvedCanvas = {
  title: string;
  tones: Tone[];
  /** Panel line 4: step pattern for scales, interval stack for chords. */
  pattern: string;
  sentence: string;
  /** Progression mode only: the chords in order. */
  chords?: { numeral: string; symbol: string }[];
  related: Related[];
  /** Screen-reader text: "C major scale: C D E F G A B". */
  announce: string;
  fretboard: (Marker & { string: number; fret: number })[];
  keyboard: (Marker & { keyIndex: number })[];
};

const THIRDS = new Set(["3m", "3M"]);
const COUNT = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function tonesFrom(root: string, intervals: string[], roleOf: (interval: string) => Role, labels: CanvasState["labels"]): Tone[] {
  return intervals.map((interval) => {
    const pitchClass = transpose(root, interval);
    const degree = intervalToDegree(interval);
    const label = labels === "notes" ? glyphs(pitchClass) : labels === "degrees" ? glyphs(degree) : shortName(interval);
    return { pitchClass, chroma: chroma(pitchClass), interval, degree, role: roleOf(interval), label };
  });
}

/** In a scale, the root's own triad is "chord tones": the third, and the perfect fifth if there is one. */
function scaleRole(intervals: string[]) {
  const fifth = intervals.includes("5P") ? "5P" : intervals.find((i) => i.startsWith("5"));
  return (interval: string): Role => (interval === "1P" ? "root" : THIRDS.has(interval) || interval === fifth ? "chord" : "scale");
}

const chordRole = (interval: string): Role => (interval === "1P" ? "root" : "chord");

function describe(state: CanvasState): Omit<ResolvedCanvas, "fretboard" | "keyboard" | "announce"> {
  const { root, show, labels } = state;
  const r = glyphs(root);

  if (show.kind === "scale") {
    const scale = getScale(root, show.scale);
    const triads = scale.notes.length === 7 && ["major", "natural-minor", "harmonic-minor"].includes(show.scale)
      ? harmonise(root, show.scale).map((c): Related => ({ label: glyphs(c.symbol), root: c.root, show: { kind: "chord", chord: c.chord } }))
      : [];
    const scaleChip = (label: string, chipRoot: string, id: "major" | "natural-minor"): Related =>
      ({ label: `${label}: ${glyphs(chipRoot)} ${id === "major" ? "major" : "minor"}`, root: chipRoot, show: { kind: "scale", scale: id } });
    const keys =
      show.scale === "major" ? [scaleChip("Relative minor", relativeMinor(root), "natural-minor"), scaleChip("Parallel minor", root, "natural-minor")]
      : show.scale === "natural-minor" ? [scaleChip("Relative major", relativeMajor(root), "major"), scaleChip("Parallel major", root, "major")]
      : [];
    return {
      title: glyphs(root) + scale.name.slice(root.length),
      tones: tonesFrom(root, scale.intervals, scaleRole(scale.intervals), labels),
      pattern: scale.steps.join(" "),
      sentence: `${COUNT[scale.notes.length]} notes. ${r} is home.`,
      related: [...triads, ...keys],
    };
  }

  if (show.kind === "chord") {
    const chord = getChord(root, show.chord);
    const bass = chord.notes[Math.min(show.inversion ?? 0, chord.notes.length - 1)];
    const scaleOf = show.chord === "major" ? "major" : show.chord === "minor" ? "natural-minor" : undefined;
    return {
      title: glyphs(chord.symbol) + (bass === root ? "" : `/${glyphs(bass)}`) + ` (${chord.name.slice(root.length + 1)})`,
      tones: tonesFrom(root, chord.intervals, chordRole, labels),
      pattern: chord.stack.join(" + "),
      sentence: `${COUNT[chord.notes.length]} notes built on ${r}.` + (bass === root ? "" : ` ${glyphs(bass)} is the lowest note.`),
      related: scaleOf ? [{ label: `${r} ${scaleOf === "major" ? "major" : "minor"} scale`, root, show: { kind: "scale", scale: scaleOf } }] : [],
    };
  }

  if (show.kind === "interval") {
    const info = INTERVALS.find((i) => i.id === show.interval)!;
    const top = transpose(root, show.interval);
    return {
      title: info.name,
      tones: tonesFrom(root, show.interval === "1P" ? ["1P"] : ["1P", show.interval], chordRole, labels),
      pattern: plural(info.semitones, "half step"),
      sentence: `From ${r} up to ${glyphs(top)}.`,
      related: [],
    };
  }

  // Progression: the key's major scale as outlines, the active chord filled in.
  const chords = show.numerals.map((n) => parseNumeral(root, n));
  const index = Math.min(show.activeIndex, chords.length - 1);
  const active = getChord(chords[index].root, chords[index].chord);
  const activeChromas = new Map(active.notes.map((n, i) => [chroma(n), i]));
  const scale = getScale(root, "major");
  const scaleChromas = new Set(scale.notes.map(chroma));
  // Chord tones outside the key (as in bVII) keep the chord's own spelling.
  const outside = active.notes.filter((n) => !scaleChromas.has(chroma(n))).map((n) => INTERVALS[(chroma(n) - chroma(root) + 12) % 12].id as string);
  const role = (interval: string): Role => {
    const at = activeChromas.get((chroma(root) + semitones(interval)) % 12);
    return at === undefined ? "scale" : at === 0 ? "root" : "chord";
  };
  return {
    title: `${show.numerals.join("–")} in ${r}`,
    tones: tonesFrom(root, [...scale.intervals, ...outside], role, labels).map((tone) => {
      const at = activeChromas.get(tone.chroma);
      if (at === undefined || tone.pitchClass === active.notes[at]) return tone;
      return { ...tone, pitchClass: active.notes[at], label: labels === "notes" ? glyphs(active.notes[at]) : tone.label };
    }),
    pattern: `${glyphs(active.symbol)}: ${active.notes.map(glyphs).join(" ")}`,
    sentence: `Chord ${index + 1} of ${chords.length}. ${r} is home.`,
    chords: chords.map((c) => ({ numeral: c.numeral, symbol: glyphs(c.symbol) })),
    related: [],
  };
}

/** One CanvasState in; everything the fretboard, keyboard and theory panel draw comes out. */
export function resolveCanvas(state: CanvasState): ResolvedCanvas {
  const described = describe(state);
  const byChroma = new Map(described.tones.map((t) => [t.chroma, t]));
  const focus = state.focusPitch ? midi(state.focusPitch) : undefined;
  const { tuning, frets } = state.guitar;

  const marker = (m: number, dimmed: boolean): Marker | undefined => {
    const tone = byChroma.get(m % 12);
    return tone && {
      midi: m,
      pitch: spellMidi(m, tone.pitchClass),
      pitchClass: tone.pitchClass,
      role: tone.role,
      label: tone.label,
      focus: m === focus,
      echo: focus !== undefined && m !== focus && m % 12 === focus % 12,
      dimmed,
    };
  };

  const fretboard = tuning.flatMap((_, string) =>
    Array.from({ length: frets + 1 }, (_, fret) => {
      const outside = state.position ? fret < state.position.fromFret || fret > state.position.toFret : false;
      const mk = marker(fretMidi(tuning, string, fret), outside);
      return mk ? [{ ...mk, string, fret }] : [];
    }).flat(),
  );
  const keyboard = keyboardKeys(state.keyboard.from, state.keyboard.to).flatMap((key, keyIndex) => {
    const mk = marker(key.midi, false);
    return mk ? [{ ...mk, keyIndex }] : [];
  });

  const spoken = described.chords ? described.chords.map((c) => c.symbol) : described.tones.map((t) => glyphs(t.pitchClass));
  return { ...described, announce: `${described.title}: ${spoken.join(" ")}`, fretboard, keyboard };
}

export type PlaybackStep = { midis: number[]; beats: number; /** progression chord index */ index?: number };

/** What the transport plays for the current selection. The root starts in octave 3 (C3–B3). */
export function playbackSteps(state: CanvasState, mode: "up" | "down" | "chord"): PlaybackStep[] {
  const { root, show } = state;
  const at = (interval: string) => midi(transpose(`${root}3`, interval));
  const run = (pitches: number[]): PlaybackStep[] =>
    mode === "chord" ? [{ midis: pitches, beats: 2 }] : (mode === "up" ? pitches : [...pitches].reverse()).map((p) => ({ midis: [p], beats: 1 }));

  if (show.kind === "scale") {
    const { intervals } = getScale(root, show.scale);
    const role = scaleRole(intervals);
    // "Chord" on a scale plays the filled markers: the root's triad.
    return run(mode === "chord" ? intervals.filter((i) => role(i) !== "scale").map(at) : [...intervals.map(at), at("8P")]);
  }
  if (show.kind === "chord") return run(chordPitches(root, show.chord, 3, show.inversion));
  if (show.kind === "interval") return run([...new Set([at("1P"), at(show.interval)])]);
  return show.numerals.map((numeral, index) => {
    const chord = parseNumeral(root, numeral);
    const octave = chroma(chord.root) >= chroma(root) ? 3 : 4; // keep every chord root above the key root
    return { midis: chordPitches(chord.root, chord.chord, octave), beats: 2, index };
  });
}
