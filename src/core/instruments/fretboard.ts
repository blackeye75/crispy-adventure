import { midi } from "../theory/notes";

/** Low to high. Strings are indexed the same way everywhere in core: 0 = lowest string. */
export const STANDARD_TUNING = ["E2", "A2", "D3", "G3", "B3", "E4"];

/** MIDI number at a string and fret (fret 0 = open string). */
export function fretMidi(tuning: readonly string[], string: number, fret: number): number {
  return midi(tuning[string]) + fret;
}

/** Every place one exact pitch can be played, for any tuning. */
export function positionsOf(pitch: number, tuning: readonly string[], frets: number) {
  return tuning.flatMap((open, string) => {
    const fret = pitch - midi(open);
    return fret >= 0 && fret <= frets ? [{ string, fret }] : [];
  });
}

/**
 * A chord shape written string by string from the lowest: "x32010" is the open C chord.
 * Returns the MIDI number each string sounds, or null where the string is not played.
 */
export function shapeMidis(shape: string, tuning: readonly string[] = STANDARD_TUNING): (number | null)[] {
  // shortcut: one character per string, so frets 0–9 only; enough for open and barre chords
  if (shape.length !== tuning.length || !/^[x0-9]+$/.test(shape)) throw new Error(`Not a chord shape for ${tuning.length} strings: "${shape}"`);
  return [...shape].map((fret, string) => (fret === "x" ? null : midi(tuning[string]) + Number(fret)));
}

/** Column a fret is drawn in, counting from the left edge. Left-handed mirrors the board. */
export function fretColumn(fret: number, frets: number, leftHanded: boolean): number {
  return leftHanded ? frets - fret : fret;
}
