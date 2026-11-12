// Source of truth for lesson content. `npm run seed` validates this and upserts it into MongoDB.
import { musicalAlphabet } from "./level-1/musical-alphabet";
import { soundAndPitch } from "./level-1/sound-and-pitch";
import { modules, tracks } from "./modules";

export const content = { tracks, modules, lessons: [...soundAndPitch, ...musicalAlphabet] };
