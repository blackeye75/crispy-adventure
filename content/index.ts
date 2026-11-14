// Source of truth for lesson content. `npm run seed` validates this and upserts it into MongoDB.
import { ear1 } from "./level-1/ear-1";
import { findingNotes } from "./level-1/finding-notes";
import { musicalAlphabet } from "./level-1/musical-alphabet";
import { readingMusic } from "./level-1/reading-music";
import { rhythm1 } from "./level-1/rhythm-1";
import { soundAndPitch } from "./level-1/sound-and-pitch";
import { ear2 } from "./level-2/ear-2";
import { intervals } from "./level-2/intervals";
import { keys } from "./level-2/keys";
import { majorScale } from "./level-2/major-scale";
import { rhythm2 } from "./level-2/rhythm-2";
import { chordsOfAKey } from "./level-3/chords-of-a-key";
import { chordsOnYourInstrument } from "./level-3/chords-on-your-instrument";
import { ear3 } from "./level-3/ear-3";
import { inversions } from "./level-3/inversions";
import { minorKeys } from "./level-3/minor-keys";
import { progressions } from "./level-3/progressions";
import { triads } from "./level-3/triads";
import { modules, tracks } from "./modules";

export const content = {
  tracks,
  modules,
  lessons: [...soundAndPitch, ...musicalAlphabet, ...findingNotes, ...rhythm1, ...readingMusic, ...ear1, ...intervals, ...majorScale, ...keys, ...rhythm2, ...ear2,
    ...triads, ...chordsOfAKey, ...progressions, ...minorKeys, ...inversions, ...chordsOnYourInstrument, ...ear3,
  ],
};
