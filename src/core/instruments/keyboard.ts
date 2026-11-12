import { midi } from "../theory/notes";

const BLACK = new Set([1, 3, 6, 8, 10]);

export type Key = {
  midi: number;
  black: boolean;
  /** In white-key widths from the left edge: a white key's left side, a black key's centre. */
  x: number;
};

/** Keys of a keyboard between two pitches, inclusive ("E2" to "E6"). */
export function keyboardKeys(from: string, to: string): Key[] {
  const keys: Key[] = [];
  let whites = 0;
  for (let m = midi(from); m <= midi(to); m++) {
    const black = BLACK.has(m % 12);
    keys.push({ midi: m, black, x: whites });
    if (!black) whites++;
  }
  return keys;
}
