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
import { modules, tracks } from "./modules";

export const content = {
  tracks,
  modules,
  lessons: [...soundAndPitch, ...musicalAlphabet, ...findingNotes, ...rhythm1, ...readingMusic, ...ear1, ...intervals, ...majorScale, ...keys, ...rhythm2, ...ear2],
};
