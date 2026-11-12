import { Interval } from "tonal";
import { CHORDS, getChord, type ChordId } from "./chords";
import { degreeToInterval } from "./intervals";
import { transpose } from "./notes";
import { getScale, type ScaleId } from "./scales";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];
const MINOR_THIRD: ReadonlySet<ChordId> = new Set(["minor", "dim", "m7", "m7b5", "dim7", "mmaj7", "m6", "m9"]);
const NUMERAL_SUFFIX: Partial<Record<ChordId, string>> = {
  dim: "°", aug: "+", maj7: "maj7", "7": "7", m7: "7", m7b5: "ø7", dim7: "°7",
};

export type KeyChord = { numeral: string; root: string; chord: ChordId; symbol: string };

/**
 * Chords of a key: stack thirds on each scale degree (size 3 = triads, 4 = sevenths) and name
 * what comes out. C major → I ii iii IV V vi vii°.
 */
export function harmonise(root: string, scale: ScaleId, size: 3 | 4 = 3): KeyChord[] {
  const { notes } = getScale(root, scale);
  if (notes.length !== 7) throw new Error(`Cannot harmonise "${scale}": needs a seven-note scale`);
  return notes.map((chordRoot, i) => {
    const stacked = Array.from({ length: size }, (_, k) => notes[(i + 2 * k) % 7]);
    const shape = stacked.map((n) => Interval.distance(chordRoot, n)).join(" ");
    const match = CHORDS.find((c) => c.formula.split(" ").map(degreeToInterval).join(" ") === shape);
    if (!match) throw new Error(`No chord for ${stacked.join(" ")} in ${root} ${scale}`);
    const roman = MINOR_THIRD.has(match.id) ? ROMAN[i].toLowerCase() : ROMAN[i];
    return {
      numeral: roman + (NUMERAL_SUFFIX[match.id] ?? ""),
      root: chordRoot,
      chord: match.id,
      symbol: getChord(chordRoot, match.id).symbol,
    };
  });
}

export const NUMERAL_PATTERN = /^(b|#)?(VII|VI|V|IV|III|II|I|vii|vi|v|iv|iii|ii|i)(°7|ø7|maj7|°|\+|7)?$/;

/**
 * A Roman numeral read against the major scale of `keyRoot`: upper case = major, lower = minor,
 * "b" lowers the degree (bVII in C = Bb). Suffixes: ° + 7 maj7 ø7 °7.
 */
export function parseNumeral(keyRoot: string, numeral: string): KeyChord {
  const m = NUMERAL_PATTERN.exec(numeral);
  if (!m) throw new Error(`Not a Roman numeral: "${numeral}"`);
  const [, accidental = "", roman, suffix = ""] = m;
  const minor = roman === roman.toLowerCase();
  const qualities: Record<string, ChordId> = minor
    ? { "": "minor", "7": "m7", "°": "dim", "ø7": "m7b5", "°7": "dim7" }
    : { "": "major", "7": "7", maj7: "maj7", "+": "aug" };
  const chord: ChordId | undefined = qualities[suffix];
  if (!chord) throw new Error(`Numeral "${numeral}": "${suffix}" does not fit a ${minor ? "minor" : "major"} chord`);
  const degree = ROMAN.indexOf(roman.toUpperCase()) + 1;
  const root = transpose(keyRoot, degreeToInterval(accidental + degree));
  return { numeral, root, chord, symbol: getChord(root, chord).symbol };
}

/** The minor key that shares a major key's notes (C → A), and the reverse (A → C). */
export const relativeMinor = (majorRoot: string) => transpose(majorRoot, "6M");
export const relativeMajor = (minorRoot: string) => transpose(minorRoot, "3m");
