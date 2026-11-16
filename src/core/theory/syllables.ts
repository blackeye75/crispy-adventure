// Note names that are relative to the home note: movable-do solfège, and the swar of Indian music.
// Both name a scale degree, not a fixed pitch, so they are built from the degree ("b3", "#4"), never from the letter.

export const NOTE_NAMINGS = ["letters", "solfege", "sargam"] as const;
export type NoteNaming = (typeof NOTE_NAMINGS)[number];

// Movable do with chromatic syllables: raised notes end in -i, lowered notes in -e (or -a for the second).
const SOLFEGE: Record<string, string> = {
  "1": "Do", b2: "Ra", "2": "Re", "#2": "Ri", b3: "Me", "3": "Mi", "4": "Fa", "#4": "Fi",
  b5: "Se", "5": "Sol", "#5": "Si", b6: "Le", "6": "La", bb7: "La", b7: "Te", "7": "Ti",
};
// Shuddha swar are capitalised, komal (lowered) swar are lower case, and tivra Ma carries a mark.
// Sa and Pa have only one form, so a raised 5th is written as the komal Dha it sounds like.
const SARGAM: Record<string, string> = {
  "1": "Sa", b2: "re", "2": "Re", "#2": "ga", b3: "ga", "3": "Ga", "4": "Ma", "#4": "Ma′",
  b5: "Ma′", "5": "Pa", "#5": "dha", b6: "dha", "6": "Dha", bb7: "Dha", b7: "ni", "7": "Ni",
};

/** The syllable for a scale degree such as "b3" or "#11". Degrees above 7 fold back into the octave. */
export function syllable(degree: string, naming: Exclude<NoteNaming, "letters">): string {
  const [, accidental, number] = /^([b#]*)(\d+)$/.exec(degree) ?? [];
  if (!number) return degree;
  const folded = `${accidental}${((Number(number) - 1) % 7) + 1}`;
  return (naming === "solfege" ? SOLFEGE : SARGAM)[folded] ?? degree;
}
