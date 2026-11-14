import type { LessonInput } from "@/core/schemas/content";
import { audio, build, choice, chordOf, chords, ear, find, pitches, shape, show, text, together } from "../helpers";

const base = { moduleSlug: "extended-chords", isFree: false, version: 1, minutes: 6 } as const;

export const extendedChords: LessonInput[] = [
  {
    ...base,
    slug: "sixths-and-added-notes",
    title: "6, 6/9 and add9",
    order: 1,
    concepts: ["added-note-chords"],
    needs: ["major-dominant-and-minor-sevenths", "compound-intervals"],
    steps: [
      { kind: "understand", blocks: [text(`A triad can be coloured by adding a note without turning it into a seventh chord.

- **6:** add the 6th. C6 is C E G A. Warm and settled, a gentler alternative to maj7. The minor version, **m6**, is C E♭ G A.
- **add9:** add the 9th, which is the 2nd an octave up. Cadd9 is C E G D. Open and shimmering.
- **6/9:** add both. C6/9 is C E G A D.

Two look-alikes are worth keeping apart. **Csus2** also has a D, but it replaces the third: C D G. And **C9** is a different chord altogether, because a plain 9 implies a dominant seventh underneath: C E G B♭ D.`)] },
      { kind: "listen", blocks: [
        audio("C, then C6", chords("C3 E3 G3 C4", "C3 E3 A3 C4")),
        audio("C, then Cadd9", chords("C3 E3 G3 C4", "C3 E3 G3 D4")),
        audio("C6/9", together("C3 E3 A3 D4")),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("C", "6"), "C6: C E G A."),
        show(chordOf("C", "add9"), "Cadd9: C E G D."),
        show(shape("5:3 4:2 3:2 2:3"), "A C6/9 voicing: C, E, A, D."),
      ] },
      { kind: "practice", blocks: [
        build("Build C6.", "C E G A", "C major triad plus A, the 6th."),
        build("Build Cadd9.", "C E G D", "C major triad plus D, the 9th."),
        choice("What is the difference between Cadd9 and Csus2?", ["Cadd9 keeps the third; Csus2 replaces it", "They are the same chord", "Csus2 has a seventh"], 0, "C E G D against C D G."),
        choice("What is the difference between Cadd9 and C9?", ["C9 also has a dominant seventh, B♭", "C9 has no third", "Nothing"], 0, "A plain 9 implies the seventh."),
        choice("Which notes are in Cm6?", ["C, E♭, G, A", "C, E♭, G, A♭", "C, E, G, A"], 0, "A minor triad with a major 6th."),
        ear("Plain C major, or C with an added note?", together("C3 E3 G3 D4"), ["With an added note", "Plain C major"], 0, "The D on top is the 9th."),
      ] },
    ],
  },
  {
    ...base,
    slug: "ninths-elevenths-and-thirteenths",
    title: "9th, 11th and 13th chords",
    order: 2,
    concepts: ["extended-chords"],
    needs: ["sixths-and-added-notes", "seventh-chords-of-the-major-key"],
    steps: [
      { kind: "understand", blocks: [text(`Keep stacking thirds on a seventh chord and you reach the **extensions**: the 9th, 11th and 13th. They are the 2nd, 4th and 6th of the scale, an octave up.

The rule for names: an extension **includes the seventh**. The type of seventh chord underneath gives the rest of the name.

- **C9:** C7 plus D. C E G B♭ D.
- **Cmaj9:** Cmaj7 plus D. **Cm9:** Cm7 plus D.
- **11th chords** are mostly minor: Cm11 is C E♭ G B♭ D F. Over a major third the 11th clashes, so major and dominant chords use a raised 11th or leave the third out.
- **C13:** C7 plus the 9th and the 13th, A. The 11th is left out.

In practice nobody plays all the notes. The root, third, seventh and the top extension are enough; the fifth is the first to go.`)] },
      { kind: "listen", blocks: [
        audio("C7, then C9", chords("C3 E3 Bb3", "C3 E3 Bb3 D4")),
        audio("Cmaj9", together("C3 E3 B3 D4")),
        audio("Cm11", together("C3 Eb3 Bb3 D4 F4")),
        audio("G13", together("G2 F3 B3 E4")),
      ] },
      { kind: "learn", blocks: [
        show(shape("5:3 4:2 3:3 2:3", "Bb"), "C9: C, E, B♭, D. No fifth."),
        show(pitches("C3 Eb3 Bb3 D4 F4", { within: [0, 3] }), "Cm11: C, E♭, B♭, D, F."),
        show(shape("6:3 4:3 3:4 2:5"), "G13: G, F, B, E. Root, seventh, third, thirteenth."),
      ] },
      { kind: "practice", blocks: [
        choice("The 9th, 11th and 13th are which scale degrees, an octave up?", ["2, 4 and 6", "1, 3 and 5", "3, 5 and 7"], 0, "Subtract 7 from each."),
        choice("What does the name C9 include besides the 9th?", ["A dominant seventh", "Nothing else", "A major seventh"], 0, "Extensions include the seventh."),
        build("Build C9.", "C E G Bb D", "C7 plus D."),
        choice("Which note is the 13th of G13?", ["E", "A", "C"], 0, "E is the 6th of G, an octave up."),
        choice("Which note of an extended chord is left out first?", ["The fifth", "The third", "The seventh"], 0, "It adds the least to the chord's character."),
        ear("C7, or C9?", together("C3 E3 Bb3 D4"), ["C9: there is a 9th on top", "C7"], 0, "The D above the B♭ is the 9th."),
      ] },
    ],
  },
  {
    ...base,
    slug: "altered-dominants",
    title: "Altered dominants",
    order: 3,
    concepts: ["altered-dominants"],
    needs: ["ninths-elevenths-and-thirteenths", "the-tritone-in-the-dominant-seventh"],
    steps: [
      { kind: "understand", blocks: [text(`A dominant chord exists to create tension before a resolution. Its job is safe as long as the third and seventh, the tritone, are in place. That leaves the extensions free to be **altered**: raised or lowered by a half step for extra bite.

There are four alterations, shown here on G7:

- **♭9:** A♭. Dark and urgent.
- **♯9:** A♯. Gritty, with major and minor thirds sounding at once.
- **♯11:** C♯. Bright and edgy.
- **♭13:** E♭. Dark and heavy.

Each altered note sits a half step from a stable note of the chord that follows, and slides into it. The ♭9 of G7, A♭, falls to G, the fifth of C.

Alterations belong on dominant chords, most of all when they resolve to a minor chord.`)] },
      { kind: "listen", blocks: [
        audio("G7♭9 resolving to C", chords("G3 B3 F4 Ab4", "G3 C4 E4 G4")),
        audio("G7♯9", together("G3 B3 F4 A#4")),
        audio("G7♭13 resolving to C", chords("G2 F3 B3 Eb4", "C3 E3 G3 E4")),
      ] },
      { kind: "learn", blocks: [
        show(shape("5:10 4:9 3:10 2:9", "Ab"), "G7♭9: G, B, F, A♭."),
        show(shape("5:10 4:9 3:10 2:11"), "G7♯9: the top note has moved up two frets, to A♯."),
        show(shape("6:3 4:3 3:4 2:4", "Eb"), "G7♭13: G, F, B, E♭."),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes of a dominant chord must stay for it to keep its pull?", ["The third and the seventh", "The fifth and the ninth", "Only the root"], 0, "The tritone does the work."),
        choice("What is the ♭9 of G7?", ["A♭", "A", "B♭"], 0, "The 9th is A; lowered, it is A♭."),
        choice("What is the ♭13 of G7?", ["E♭", "E", "D♭"], 0, "The 13th is E; lowered, it is E♭."),
        find("Tap the ♯9 of G7.", "A#", "The 9th is A; raised, it is A♯."),
        choice("When G7♭9 resolves to C, where does the A♭ go?", ["Down a half step to G", "Up a whole step to B♭", "It stays"], 0, "To the fifth of the C chord."),
        ear("Plain G7, or G7 with an altered note?", together("G3 B3 F4 Ab4"), ["Altered: G7♭9", "Plain G7"], 0, "The A♭ on top adds a dark edge."),
      ] },
    ],
  },
];
