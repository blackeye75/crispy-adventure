import { Interval } from "tonal";
import { degreeToInterval, shortName } from "./intervals";
import { midi, transpose } from "./notes";

/** Reference table from docs/CURRICULUM.md: degrees relative to the major scale. */
export const CHORDS = [
  { id: "major", name: "major", suffix: "", formula: "1 3 5" },
  { id: "minor", name: "minor", suffix: "m", formula: "1 b3 5" },
  { id: "dim", name: "diminished", suffix: "°", formula: "1 b3 b5" },
  { id: "aug", name: "augmented", suffix: "+", formula: "1 3 #5" },
  { id: "sus2", name: "suspended 2nd", suffix: "sus2", formula: "1 2 5" },
  { id: "sus4", name: "suspended 4th", suffix: "sus4", formula: "1 4 5" },
  { id: "5", name: "power chord", suffix: "5", formula: "1 5" },
  { id: "maj7", name: "major 7", suffix: "maj7", formula: "1 3 5 7" },
  { id: "7", name: "dominant 7", suffix: "7", formula: "1 3 5 b7" },
  { id: "m7", name: "minor 7", suffix: "m7", formula: "1 b3 5 b7" },
  { id: "m7b5", name: "half-diminished", suffix: "m7b5", formula: "1 b3 b5 b7" },
  { id: "dim7", name: "diminished 7", suffix: "°7", formula: "1 b3 b5 bb7" },
  { id: "mmaj7", name: "minor-major 7", suffix: "m(maj7)", formula: "1 b3 5 7" },
  { id: "6", name: "6", suffix: "6", formula: "1 3 5 6" },
  { id: "m6", name: "minor 6", suffix: "m6", formula: "1 b3 5 6" },
  { id: "add9", name: "add9", suffix: "add9", formula: "1 3 5 9" },
  { id: "9", name: "9", suffix: "9", formula: "1 3 5 b7 9" },
  { id: "maj9", name: "major 9", suffix: "maj9", formula: "1 3 5 7 9" },
  { id: "m9", name: "minor 9", suffix: "m9", formula: "1 b3 5 b7 9" },
] as const;

export type ChordId = (typeof CHORDS)[number]["id"];
export const CHORD_IDS = CHORDS.map((c) => c.id) as [ChordId, ...ChordId[]];

export function chordIntervals(id: ChordId): string[] {
  const chord = CHORDS.find((c) => c.id === id);
  if (!chord) throw new Error(`Unknown chord: "${id}"`);
  return chord.formula.split(" ").map(degreeToInterval);
}

export function getChord(root: string, id: ChordId) {
  const chord = CHORDS.find((c) => c.id === id)!;
  const intervals = chordIntervals(id);
  const notes = intervals.map((ivl) => transpose(root, ivl));
  return {
    id,
    root,
    symbol: root + chord.suffix,
    name: `${root} ${chord.name}`,
    intervals,
    degrees: chord.formula.split(" "),
    notes,
    /** Interval from each chord tone to the next: C major → ["M3", "m3"]. */
    stack: notes.slice(1).map((note, i) => shortName(Interval.distance(notes[i], note))),
  };
}

/**
 * MIDI numbers of a close-position voicing going up from `octave`.
 * Inversion n moves the lowest n notes up an octave (1 = third in the bass).
 */
export function chordPitches(root: string, id: ChordId, octave: number, inversion = 0): number[] {
  const pitches = chordIntervals(id).map((ivl) => midi(transpose(`${root}${octave}`, ivl)));
  const n = Math.min(inversion, pitches.length - 1);
  return [...pitches.slice(n), ...pitches.slice(0, n).map((p) => p + 12)];
}
