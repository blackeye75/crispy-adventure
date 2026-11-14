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
import { chordTonesAndMelody } from "./level-4/chord-tones-and-melody";
import { ear4 } from "./level-4/ear-4";
import { expression } from "./level-4/expression";
import { pentatonicAndBlues } from "./level-4/pentatonic-and-blues";
import { rhythm3 } from "./level-4/rhythm-3";
import { seventhChords } from "./level-4/seventh-chords";
import { wholeInstrument } from "./level-4/whole-instrument";
import { borrowedChords } from "./level-5/borrowed-chords";
import { ear5 } from "./level-5/ear-5";
import { extendedChords } from "./level-5/extended-chords";
import { modulation } from "./level-5/modulation";
import { modes } from "./level-5/modes";
import { secondaryDominants } from "./level-5/secondary-dominants";
import { voiceLeading } from "./level-5/voice-leading";
import { arranging } from "./level-6/arranging";
import { formAndAnalysis } from "./level-6/form-and-analysis";
import { furtherTopics } from "./level-6/further-topics";
import { improvisation } from "./level-6/improvisation";
import { jazzHarmony } from "./level-6/jazz-harmony";
import { minorModes } from "./level-6/minor-modes";
import { substitution } from "./level-6/substitution";
import { symmetricScales } from "./level-6/symmetric-scales";
import { fingerstyleBasic } from "./playing/fingerstyle-basic";
import { leadBasic } from "./playing/lead-basic";
import { strummingBasic } from "./playing/strumming-basic";
import { modules, tracks } from "./modules";

export const content = {
  tracks,
  modules,
  lessons: [...soundAndPitch, ...musicalAlphabet, ...findingNotes, ...rhythm1, ...readingMusic, ...ear1, ...intervals, ...majorScale, ...keys, ...rhythm2, ...ear2,
    ...triads, ...chordsOfAKey, ...progressions, ...minorKeys, ...inversions, ...chordsOnYourInstrument, ...ear3,
    ...pentatonicAndBlues, ...wholeInstrument, ...seventhChords, ...chordTonesAndMelody, ...rhythm3, ...expression, ...ear4,
    ...modes, ...secondaryDominants, ...borrowedChords, ...voiceLeading, ...extendedChords, ...modulation, ...ear5,
    ...jazzHarmony, ...substitution, ...minorModes, ...symmetricScales, ...improvisation, ...arranging, ...formAndAnalysis, ...furtherTopics,
    ...strummingBasic, ...leadBasic, ...fingerstyleBasic,
  ],
};
