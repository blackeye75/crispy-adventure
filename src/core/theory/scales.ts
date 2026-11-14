import { degreeToInterval, semitones } from "./intervals";
import { transpose } from "./notes";

/** Reference table from docs/CURRICULUM.md: degrees relative to the major scale. */
export const SCALES = [
  { id: "major", name: "major scale", formula: "1 2 3 4 5 6 7" },
  { id: "natural-minor", name: "natural minor scale", formula: "1 2 b3 4 5 b6 b7" },
  { id: "harmonic-minor", name: "harmonic minor scale", formula: "1 2 b3 4 5 b6 7" },
  { id: "melodic-minor", name: "melodic minor scale", formula: "1 2 b3 4 5 6 7" },
  { id: "major-pentatonic", name: "major pentatonic scale", formula: "1 2 3 5 6" },
  { id: "minor-pentatonic", name: "minor pentatonic scale", formula: "1 b3 4 5 b7" },
  { id: "blues", name: "blues scale", formula: "1 b3 4 b5 5 b7" },
  { id: "dorian", name: "Dorian mode", formula: "1 2 b3 4 5 6 b7" },
  { id: "phrygian", name: "Phrygian mode", formula: "1 b2 b3 4 5 b6 b7" },
  { id: "lydian", name: "Lydian mode", formula: "1 2 3 #4 5 6 7" },
  { id: "mixolydian", name: "Mixolydian mode", formula: "1 2 3 4 5 6 b7" },
  { id: "locrian", name: "Locrian mode", formula: "1 b2 b3 4 b5 b6 b7" },
  { id: "whole-tone", name: "whole-tone scale", formula: "1 2 3 #4 #5 b7" },
  // Level 6: modes of melodic and harmonic minor, and the symmetric scales.
  { id: "lydian-dominant", name: "Lydian dominant scale", formula: "1 2 3 #4 5 6 b7" },
  // Spelled the way players name its notes over a dominant chord: b9 #9 3 #11 b13 b7.
  { id: "altered", name: "altered scale", formula: "1 b2 #2 3 #4 b6 b7" },
  { id: "phrygian-dominant", name: "Phrygian dominant scale", formula: "1 b2 3 4 5 b6 b7" },
  { id: "locrian-natural-2", name: "Locrian natural 2 scale", formula: "1 2 b3 4 b5 b6 b7" },
  { id: "lydian-augmented", name: "Lydian augmented scale", formula: "1 2 3 #4 #5 6 7" },
  { id: "diminished-half-whole", name: "half-whole diminished scale", formula: "1 b2 b3 3 #4 5 6 b7" },
  { id: "diminished-whole-half", name: "whole-half diminished scale", formula: "1 2 b3 4 b5 b6 6 7" },
  { id: "augmented", name: "augmented scale", formula: "1 b3 3 5 #5 7" },
] as const;

export type ScaleId = (typeof SCALES)[number]["id"];
export const SCALE_IDS = SCALES.map((s) => s.id) as [ScaleId, ...ScaleId[]];

const STEP_NAMES: Record<number, string> = { 1: "H", 2: "W", 3: "W+H" };

export function scaleIntervals(id: ScaleId): string[] {
  const scale = SCALES.find((s) => s.id === id);
  if (!scale) throw new Error(`Unknown scale: "${id}"`);
  return scale.formula.split(" ").map(degreeToInterval);
}

export function getScale(root: string, id: ScaleId) {
  const scale = SCALES.find((s) => s.id === id)!;
  const intervals = scaleIntervals(id);
  const semis = [...intervals.map(semitones), 12];
  return {
    id,
    root,
    name: `${root} ${scale.name}`,
    intervals,
    degrees: scale.formula.split(" "),
    notes: intervals.map((ivl) => transpose(root, ivl)),
    /** Step pattern back up to the octave: W = whole step, H = half step. */
    steps: intervals.map((_, i) => STEP_NAMES[semis[i + 1] - semis[i]]),
  };
}
