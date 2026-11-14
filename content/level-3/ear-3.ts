import type { LessonInput } from "@/core/schemas/content";
import { audio, chordOf, ear, prog, progression, show, text, together } from "../helpers";

const base = { moduleSlug: "ear-3", isFree: false, version: 1, minutes: 5, strand: "ear" } as const;
const QUALITIES = ["Major", "Minor", "Diminished", "Augmented"];
const MIDDLE = ["IV", "V"];

export const ear3: LessonInput[] = [
  {
    ...base,
    slug: "triad-quality-by-ear",
    title: "Hearing the four triads",
    order: 1,
    concepts: ["ear-triad-quality"],
    needs: ["diminished-and-augmented-triads", "major-or-minor-sound"],
    steps: [
      { kind: "understand", blocks: [text(`You can already tell major from minor. Now add the two unstable triads.

Ask two questions. First: does the chord sound at rest? If yes, it is major or minor, and the third tells you which. If no, it is diminished or augmented.

Then: does it feel squeezed inwards or stretched outwards? Diminished is the tight one; augmented is the wide, hovering one.`)] },
      { kind: "listen", blocks: [
        audio("Major", together("C4 E4 G4")),
        audio("Minor", together("C4 Eb4 G4")),
        audio("Diminished", together("C4 Eb4 Gb4")),
        audio("Augmented", together("C4 E4 G#4")),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("C", "dim"), "C diminished: both thirds are minor, so the chord is narrow."),
        show(chordOf("C", "aug"), "C augmented: both thirds are major, so the chord is wide."),
      ] },
      { kind: "practice", blocks: [
        ear("Which triad is this?", together("D4 F#4 A4"), QUALITIES, 0, "At rest and bright: D major."),
        ear("And this?", together("D4 F4 Ab4"), QUALITIES, 2, "Tight and tense: two minor thirds."),
        ear("And this?", together("G3 Bb3 D4"), QUALITIES, 1, "At rest and darker: G minor."),
        ear("And this?", together("Eb4 G4 B4"), QUALITIES, 3, "Wide and unsettled: two major thirds."),
        ear("And this?", together("A3 C4 Eb4"), QUALITIES, 2, "Two minor thirds: A diminished."),
        ear("And this?", together("F3 A3 C4"), QUALITIES, 0, "F major."),
      ] },
    ],
  },
  {
    ...base,
    slug: "hearing-one-four-and-five",
    title: "Hearing I, IV and V",
    order: 2,
    concepts: ["ear-one-four-five"],
    needs: ["triad-quality-by-ear", "one-four-five"],
    steps: [
      { kind: "understand", blocks: [text(`Most of what you will work out by ear is I, IV and V, so learn how each one feels.

**I** is home. Nothing needs to happen next.

**IV** is a step away from home. It feels open, and it can drift back to I without fuss.

**V** is tension. It leans forward and wants I to follow.

When a chord changes, ask: did we leave gently, or did the music tighten?`)] },
      { kind: "listen", blocks: [
        audio("I, IV, I: away and back", prog("C", "I IV I", 66)),
        audio("I, V, I: tension and release", prog("C", "I V I", 66)),
      ] },
      { kind: "learn", blocks: [show(progression("C", "I IV I V I"), "Press play and listen for the difference between the F chord and the G chord.")] },
      { kind: "practice", blocks: [
        ear("Which chord is in the middle?", prog("C", "I IV I", 66), MIDDLE, 0, "A gentle step away and back."),
        ear("And here?", prog("C", "I V I", 66), MIDDLE, 1, "The middle chord pulls hard towards home."),
        ear("A new key. Which chord is in the middle?", prog("G", "I V I", 66), MIDDLE, 1, "Tension, then release: V."),
        ear("And here?", prog("G", "I IV I", 66), MIDDLE, 0, "It relaxes back without any pull: IV."),
        ear("Which chord does this stop on?", prog("A", "I IV V", 66), ["V", "IV", "I"], 0, "It ends leaning forward, unresolved."),
      ] },
    ],
  },
  {
    ...base,
    slug: "recognising-common-progressions",
    title: "Recognising common progressions",
    order: 3,
    concepts: ["ear-progressions"],
    needs: ["hearing-one-four-and-five", "four-chord-songs", "two-five-one"],
    steps: [
      { kind: "understand", blocks: [text(`Whole progressions have recognisable shapes, just as chords do. A few clues:

- **Does it start on a major or a minor chord?** I–V–vi–IV starts major; vi–IV–I–V starts minor.
- **Where is the minor chord?** In I–V–vi–IV it comes third.
- **How long is it?** ii–V–I has three chords and lands firmly at home; the four-chord loops go round and round.
- **Follow the bass.** The lowest notes trace the roots.`)] },
      { kind: "listen", blocks: [
        audio("I–IV–V–I", prog("C", "I IV V I")),
        audio("I–V–vi–IV", prog("C", "I V vi IV")),
        audio("ii–V–I", prog("C", "ii V I")),
      ] },
      { kind: "learn", blocks: [show(progression("C", "I V vi IV"), "I–V–vi–IV: follow the roots C, G, A, F as it plays.")] },
      { kind: "practice", blocks: [
        ear("Which progression is this?", prog("G", "I V vi IV"), ["I–V–vi–IV", "I–IV–V–I", "ii–V–I"], 0, "Major, major, minor, major, and it does not come to rest."),
        ear("And this?", prog("G", "I IV V I"), ["I–V–vi–IV", "I–IV–V–I", "ii–V–I"], 1, "Three major chords, ending back at home."),
        ear("And this?", prog("G", "ii V I"), ["I–V–vi–IV", "I–IV–V–I", "ii–V–I"], 2, "Three chords, starting minor and landing firmly on I."),
        ear("And this?", prog("D", "vi IV I V"), ["vi–IV–I–V", "I–V–vi–IV", "I–IV–V–I"], 0, "It starts on the minor chord."),
        ear("And this?", prog("D", "I V vi IV"), ["vi–IV–I–V", "I–V–vi–IV", "I–IV–V–I"], 1, "It starts on the major home chord; the minor chord comes third."),
      ] },
    ],
  },
];
