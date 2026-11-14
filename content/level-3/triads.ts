import type { LessonInput } from "@/core/schemas/content";
import { audio, build, choice, chordOf, ear, seq, show, text, together } from "../helpers";

const base = { moduleSlug: "triads", isFree: false, version: 1, minutes: 6 } as const;
const QUALITY = ["Major", "Minor"];

export const triads: LessonInput[] = [
  {
    ...base,
    slug: "stacking-thirds",
    title: "Stacking thirds",
    order: 1,
    concepts: ["triad"],
    needs: ["seconds-and-thirds", "the-major-scale-formula"],
    steps: [
      { kind: "understand", blocks: [text(`A **chord** is three or more notes sounded together. The simplest kind is the **triad**: three notes made by stacking thirds.

Start on any note, the **root**. Add the note a third above it, called the **third**. Add the note a third above that, called the **fifth**, because it is a fifth above the root.

In a scale this is easy to do: take a note, skip one, take one, skip one, take one. From C in C major: C, skip D, E, skip F, G.`)] },
      { kind: "listen", blocks: [
        audio("Root, third, fifth, one at a time: C, E, G", seq("C4 E4 G4", 60)),
        audio("All three together: a C triad", together("C4 E4 G4")),
      ] },
      { kind: "learn", blocks: [show(chordOf("C", "major"), "The C triad. C is the root; E and G are its third and fifth.")] },
      { kind: "practice", blocks: [
        choice("How many notes are in a triad?", ["Three", "Two", "Four"], 0, "Tri- means three."),
        choice("What are the three notes of a triad called?", ["Root, third and fifth", "Root, second and third", "First, middle and last"], 0, "Each is named for its distance above the root."),
        build("Build the C triad: C, skip a note, E, skip a note, G.", "C E G", "Root C, third E, fifth G."),
        choice("Stack thirds on G using only notes of C major. Which notes do you get?", ["G B D", "G A B", "G C E"], 0, "G, skip A, B, skip C, D."),
        ear("How many notes sound together here?", together("F3 A3 C4"), ["Three: a triad", "Two", "One"], 0, "F, A and C: root, third and fifth."),
      ] },
    ],
  },
  {
    ...base,
    slug: "major-and-minor-triads",
    title: "Major and minor triads",
    order: 2,
    concepts: ["major-and-minor-triads"],
    needs: ["stacking-thirds"],
    steps: [
      { kind: "understand", blocks: [text(`A triad stacks two thirds, and the order decides its sound.

- A **major triad** is a major third with a minor third on top: C E G. Its formula is 1 3 5.
- A **minor triad** is a minor third with a major third on top: C E♭ G. Its formula is 1 ♭3 5.

Both span a perfect fifth from root to top. Only the middle note differs, by one half step, and that note carries the whole mood.`)] },
      { kind: "listen", blocks: [
        audio("C major: C, E, G", together("C4 E4 G4")),
        audio("C minor: C, E♭, G", together("C4 Eb4 G4")),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("C", "major"), "C major: 1 3 5."),
        show(chordOf("C", "minor"), "C minor: 1 ♭3 5. The third has dropped one half step."),
      ] },
      { kind: "practice", blocks: [
        choice("A major triad stacks…", ["A major third, then a minor third", "A minor third, then a major third", "Two major thirds"], 0, "Four half steps, then three."),
        build("Build A minor.", "A C E", "A to C is a minor third; C to E is a major third."),
        build("Build D major.", "D F# A", "D to F♯ is a major third; F♯ to A is a minor third."),
        choice("Which note changes between C major and C minor?", ["The third: E becomes E♭", "The fifth: G becomes G♭", "The root"], 0, "Root and fifth stay; the third moves."),
        ear("Major or minor?", together("D4 F#4 A4"), QUALITY, 0, "D, F♯, A: a major third at the bottom."),
        ear("Major or minor?", together("E4 G4 B4"), QUALITY, 1, "E, G, B: a minor third at the bottom."),
      ] },
    ],
  },
  {
    ...base,
    slug: "diminished-and-augmented-triads",
    title: "Diminished and augmented triads",
    order: 3,
    concepts: ["diminished-and-augmented-triads"],
    needs: ["major-and-minor-triads"],
    steps: [
      { kind: "understand", blocks: [text(`Two thirds can be stacked in two more ways.

- A **diminished triad** is two minor thirds: B D F. Its formula is 1 ♭3 ♭5. The fifth is one half step smaller than perfect, a tritone above the root.
- An **augmented triad** is two major thirds: C E G♯. Its formula is 1 3 ♯5. The fifth is one half step larger than perfect.

Neither sounds at rest. Diminished is tight and tense; augmented is unsettled, as if hovering. Both usually move on to a major or minor chord.`)] },
      { kind: "listen", blocks: [
        audio("B diminished: B, D, F", together("B3 D4 F4")),
        audio("C augmented: C, E, G♯", together("C4 E4 G#4")),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("B", "dim"), "B diminished: two minor thirds."),
        show(chordOf("C", "aug"), "C augmented: two major thirds."),
      ] },
      { kind: "practice", blocks: [
        choice("A diminished triad stacks…", ["Two minor thirds", "Two major thirds", "A major third, then a minor third"], 0, "Three half steps, then three more."),
        choice("What kind of fifth does an augmented triad have?", ["Raised: one half step above perfect", "Perfect", "Lowered: one half step below perfect"], 0, "Two major thirds add up to eight half steps."),
        build("Build B diminished.", "B D F", "B to D and D to F are both minor thirds."),
        build("Build C augmented.", "C E G#", "C to E and E to G♯ are both major thirds."),
        ear("Which triad is this?", together("B3 D4 F4"), ["Diminished", "Major", "Augmented"], 0, "Two minor thirds: tight and tense."),
        ear("And this?", together("F3 A3 C#4"), ["Diminished", "Major", "Augmented"], 2, "Two major thirds: F, A, C♯."),
      ] },
    ],
  },
  {
    ...base,
    slug: "sus-and-power-chords",
    title: "Sus chords and power chords",
    order: 4,
    concepts: ["sus-and-power-chords"],
    needs: ["diminished-and-augmented-triads"],
    steps: [
      { kind: "understand", blocks: [text(`Some chords leave the third out.

A **suspended** chord replaces the third with a neighbour. **Sus4** uses the fourth: 1 4 5, so Csus4 is C F G. **Sus2** uses the second: 1 2 5, so Csus2 is C D G. With no third they are neither major nor minor, and they often resolve to the ordinary triad.

A **power chord** is just root and fifth: 1 5. It is written with a 5, as in C5. It too is neither major nor minor, which is why it works over almost anything and stays clear under distortion.`)] },
      { kind: "listen", blocks: [
        audio("Csus4, then C major: the fourth falls to the third", { kind: "progression", chords: [["C4", "F4", "G4"], ["C4", "E4", "G4"]] }),
        audio("Csus2: C, D, G", together("C4 D4 G4")),
        audio("A power chord: C and G", together("C3 G3")),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("C", "sus4"), "Csus4: 1 4 5."),
        show(chordOf("C", "sus2"), "Csus2: 1 2 5."),
        show(chordOf("C", "5"), "C5, the power chord: 1 5."),
      ] },
      { kind: "practice", blocks: [
        choice("What does a sus4 chord do to the third?", ["Replaces it with the fourth", "Lowers it by a half step", "Doubles it"], 0, "The third is suspended; the fourth takes its place."),
        build("Build Dsus4.", "D G A", "Root D, fourth G, fifth A."),
        build("Build the power chord A5.", "A E", "Root and fifth only."),
        choice("Why is a power chord neither major nor minor?", ["It has no third", "It has two thirds", "It has no fifth"], 0, "The third is the note that decides major or minor."),
        ear("Which chord is this?", together("C4 F4 G4"), ["Sus4", "Major", "Minor"], 0, "The middle note is a fourth above the root, not a third."),
      ] },
    ],
  },
  {
    ...base,
    slug: "reading-chord-symbols",
    title: "Reading chord symbols",
    order: 5,
    concepts: ["chord-symbols"],
    needs: ["sus-and-power-chords"],
    steps: [
      { kind: "understand", blocks: [text(`A chord symbol is shorthand. The capital letter is the root; what follows says what kind of chord it is.

- **C**: nothing after the letter means major.
- **Cm**: minor. You may also see C- or Cmin.
- **Cdim** or **C°**: diminished.
- **Caug** or **C+**: augmented.
- **Csus4**, **Csus2**: suspended.
- **C5**: power chord.

A sharp or flat right after the letter belongs to the root: B♭m is a minor chord built on B♭.`)] },
      { kind: "listen", blocks: [audio("C, then Cm, then C°: one root, three symbols", { kind: "progression", chords: [["C4", "E4", "G4"], ["C4", "Eb4", "G4"], ["C4", "Eb4", "Gb4"]] })] },
      { kind: "learn", blocks: [
        show(chordOf("A", "minor"), "Am: A minor."),
        show(chordOf("Bb", "major"), "B♭: B♭ major. The flat belongs to the root."),
      ] },
      { kind: "practice", blocks: [
        choice("What does Am mean?", ["A minor", "A major", "A diminished"], 0, "A small m means minor."),
        choice("What is F♯°?", ["F♯ diminished", "F♯ augmented", "F♯ minor"], 0, "The small circle means diminished."),
        choice("Which symbol means G augmented?", ["G+", "G°", "Gsus4"], 0, "A plus sign means augmented."),
        build("Build Em.", "E G B", "E minor: 1 ♭3 5 from E."),
        build("Build B♭.", "Bb D F", "B♭ major: 1 3 5 from B♭."),
        choice("Which notes are in E5?", ["E and B", "E, G♯ and B", "E, G and B"], 0, "A power chord is root and fifth."),
      ] },
    ],
  },
];
