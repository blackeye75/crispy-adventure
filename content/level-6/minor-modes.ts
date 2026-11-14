import type { LessonInput } from "@/core/schemas/content";
import { audio, build, chordOf, chords, choice, ear, find, prog, scale, seq, show, text, together } from "../helpers";

const base = { moduleSlug: "minor-modes", isFree: false, version: 1, minutes: 7 } as const;
const C_LYDIAN_DOMINANT = "C4 D4 E4 F#4 G4 A4 Bb4 C5";
const G_ALTERED = "G3 Ab3 Bb3 B3 Db4 Eb4 F4 G4";
const E_PHRYGIAN_DOMINANT = "E3 F3 G#3 A3 B3 C4 D4 E4";

export const minorModes: LessonInput[] = [
  {
    ...base,
    slug: "lydian-dominant",
    title: "Lydian dominant",
    order: 1,
    concepts: ["lydian-dominant"],
    needs: ["melodic-minor", "parallel-modes", "tritone-substitution"],
    steps: [
      { kind: "understand", blocks: [text(`The major scale gave you seven modes. **Melodic minor** has seven modes too, and several of them are everyday jazz scales. Here, melodic minor means the rising form used both up and down: 1 2 ♭3 4 5 6 7.

Start G melodic minor (G A B♭ C D E F♯) from its fourth note, C, and you get **C Lydian dominant**: C D E F♯ G A B♭.

Its formula is **1 2 3 ♯4 5 6 ♭7**. Two ways to remember it:

- **Mixolydian with a raised 4th**, or
- **Lydian with a lowered 7th**.

It has the major third and flat seventh of a dominant chord, plus the bright ♯4 of Lydian. The chord it fits is written **C7♯11**.

Use it on dominant chords that are **not** about to fall a fifth to their I chord. The main cases are the ones from the last module: the tritone substitute (♭II7) and the backdoor chord (♭VII7).`)] },
      { kind: "listen", blocks: [
        audio("C Mixolydian, for comparison", seq("C4 D4 E4 F4 G4 A4 Bb4 C5", 120)),
        audio("C Lydian dominant: the 4th is raised to F♯", seq(C_LYDIAN_DOMINANT, 120)),
        audio("The ♯4 over C7", chords("C3 E3 Bb3 F#4", "C3 E3 Bb3 G4")),
      ] },
      { kind: "learn", blocks: [
        show(scale("C", "lydian-dominant", "degrees"), "C Lydian dominant: 1 2 3 ♯4 5 6 ♭7."),
        show(scale("G", "melodic-minor"), "G melodic minor has the same seven notes. Start it from C and you have C Lydian dominant."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the formula of Lydian dominant?", ["1 2 3 ♯4 5 6 ♭7", "1 2 3 4 5 6 ♭7", "1 2 3 ♯4 5 6 7"], 0, "Mixolydian with a raised 4th."),
        choice("Lydian dominant is which mode of melodic minor?", ["The fourth", "The fifth", "The seventh"], 0, "C Lydian dominant has the notes of G melodic minor."),
        build("Build C Lydian dominant.", "C D E F# G A Bb", "C major with a raised 4th and a lowered 7th."),
        find("Tap the note that separates C Lydian dominant from C Mixolydian.", "F#", "Mixolydian has F; Lydian dominant raises it to F♯."),
        choice("In the key of C, on which chord is Lydian dominant the usual choice?", ["D♭7, the tritone substitute", "Dm7, the ii chord", "Cmaj7, the I chord"], 0, "It suits dominant chords that do not resolve down a fifth."),
        ear("Mixolydian or Lydian dominant?", seq(C_LYDIAN_DOMINANT, 120), ["Mixolydian", "Lydian dominant"], 1, "The fourth note is raised."),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-altered-scale",
    title: "The altered scale",
    order: 2,
    concepts: ["altered-scale"],
    needs: ["lydian-dominant", "altered-dominants"],
    steps: [
      { kind: "understand", blocks: [text(`In Level 5 you met altered dominants: a V7 chord whose ninth or fifth has been raised or lowered. The **altered scale** holds all of those altered notes at once.

Over G7 it is **G A♭ A♯ B C♯ E♭ F**. Sorted by job:

- The chord's core: **1, 3 and ♭7** (G, B, F).
- Both altered ninths: **♭9 and ♯9** (A♭, A♯).
- Both altered fifths: **♯11 and ♭13** (C♯, E♭), also called ♭5 and ♯5.

There is no natural fifth and no natural ninth. Every note that could be altered is.

It is the **seventh mode of melodic minor**. The shortcut players use: over a dominant chord, play the melodic minor scale **a half step above its root**. Over G7, that is A♭ melodic minor.

Use it on a V7 that is resolving to its I chord, major or minor. The tension is high, and each altered note sits a half step from a note of the home chord, so the release is strong.

One link worth seeing: G altered and D♭ Lydian dominant are the same seven notes. D♭7 is the tritone substitute of G7, so the two scales are two views of one sound.`)] },
      { kind: "listen", blocks: [
        audio("G altered, rising", seq(G_ALTERED, 120)),
        audio("A line from G altered that lands on C", seq("Bb4 Ab4 F4 Eb4 Db4 B3 C4", 132)),
        audio("G7 with altered notes, then Cmaj7", chords("G2 F3 B3 Eb4 Ab4", "C3 E3 B3 D4 G4")),
      ] },
      { kind: "learn", blocks: [
        show(scale("G", "altered", "degrees"), "G altered: 1 ♭2 ♯2 3 ♯4 ♭6 ♭7. Read ♭2 and ♯2 as the ♭9 and ♯9, ♯4 as the ♯11, ♭6 as the ♭13."),
        show(scale("Ab", "melodic-minor"), "A♭ melodic minor. The same notes, a half step above G."),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes of the chord does the altered scale keep unaltered?", ["Root, third and seventh", "Root, fifth and ninth", "Third, fifth and seventh"], 0, "1, 3 and ♭7. Everything else is altered."),
        choice("The altered scale is which mode of melodic minor?", ["The seventh", "The fourth", "The fifth"], 0, "It starts on the last note of the melodic minor scale."),
        choice("Over G7, which melodic minor scale gives G altered?", ["A♭ melodic minor", "G melodic minor", "D melodic minor"], 0, "A half step above the chord's root."),
        choice("Over E7, which melodic minor scale gives E altered?", ["F melodic minor", "E melodic minor", "B melodic minor"], 0, "A half step above E."),
        choice("Which scale shares all seven notes with G altered?", ["D♭ Lydian dominant", "G Mixolydian", "C major"], 0, "Both are modes of A♭ melodic minor, and D♭7 is the tritone substitute of G7."),
        find("Tap the ♭9 of G7.", "Ab", "A ninth above G is A; lowered, it is A♭."),
      ] },
    ],
  },
  {
    ...base,
    slug: "phrygian-dominant",
    title: "Phrygian dominant",
    order: 3,
    concepts: ["phrygian-dominant"],
    needs: ["harmonic-minor", "characteristic-notes", "major-and-minor-two-five-one"],
    steps: [
      { kind: "understand", blocks: [text(`Harmonic minor has modes as well. The one you will use most is its fifth: **Phrygian dominant**.

Play A harmonic minor (A B C D E F G♯) starting on E: **E F G♯ A B C D**.

Its formula is **1 ♭2 3 4 5 ♭6 ♭7**. It is the Phrygian mode with a **major third**. The gap from the ♭2 to the 3, F to G♯, is three half steps wide, and that wide step gives the scale its sound.

It has two main uses.

**On V7 in a minor key.** E7 going to Am already lives inside A harmonic minor, so this is the most natural scale for it. Over E7 it supplies the ♭9 (F) and the ♭13 (C).

**As a sound of its own.** Stay on E major as home and move to F major, a half step above, and back. That I – ♭II movement is the harmony people know from flamenco.`)] },
      { kind: "listen", blocks: [
        audio("E Phrygian dominant", seq(E_PHRYGIAN_DOMINANT, 120)),
        audio("E Phrygian, for comparison: G instead of G♯", seq("E3 F3 G3 A3 B3 C4 D4 E4", 120)),
        audio("E and F, back and forth", prog("E", "I bII I bII I", 92)),
        audio("Over E7, resolving to A minor", seq("E4 D4 C4 B3 G#3 F3 E3 A3", 132)),
      ] },
      { kind: "learn", blocks: [
        show(scale("E", "phrygian-dominant", "degrees"), "E Phrygian dominant: 1 ♭2 3 4 5 ♭6 ♭7."),
        show(scale("A", "harmonic-minor"), "A harmonic minor: the same notes with A as home."),
        show(chordOf("E", "7"), "E7, the chord the scale is built around: E G♯ B D."),
      ] },
      { kind: "practice", blocks: [
        choice("Phrygian dominant is which mode of harmonic minor?", ["The fifth", "The fourth", "The seventh"], 0, "E Phrygian dominant has the notes of A harmonic minor."),
        choice("How does Phrygian dominant differ from Phrygian?", ["It has a major third", "It has a raised 4th", "It has a natural 2nd"], 0, "1 ♭2 3 4 5 ♭6 ♭7."),
        build("Build E Phrygian dominant.", "E F G# A B C D", "A harmonic minor, starting from E."),
        find("Tap the third of E Phrygian dominant.", "G#", "A major third above E."),
        choice("Over which chord is E Phrygian dominant the natural choice?", ["E7 resolving to Am", "Em7 resolving to A7", "Emaj7 as a home chord"], 0, "It is the V7 chord of A minor, and the scale is A harmonic minor."),
        ear("Phrygian or Phrygian dominant?", seq(E_PHRYGIAN_DOMINANT, 120), ["Phrygian", "Phrygian dominant"], 1, "You can hear the wide step between the second and third notes."),
      ] },
    ],
  },
  {
    ...base,
    slug: "locrian-natural-2-and-lydian-augmented",
    title: "Locrian natural 2 and Lydian augmented",
    order: 4,
    concepts: ["locrian-natural-2", "lydian-augmented"],
    needs: ["the-altered-scale", "major-and-minor-two-five-one"],
    steps: [
      { kind: "understand", blocks: [text(`Two more modes of melodic minor finish the set you need.

**Locrian natural 2** is the sixth mode: **1 2 ♭3 4 ♭5 ♭6 ♭7**. B Locrian natural 2 is B C♯ D E F G A, the notes of D melodic minor.

It is the Locrian mode with its second note raised. That matters on a half-diminished chord. Over Bø7, plain Locrian gives C, a half step above the root, which sounds harsh if you hold it. Locrian natural 2 gives C♯, a note you can rest on.

**Lydian augmented** is the third mode: **1 2 3 ♯4 ♯5 6 7**. C Lydian augmented is C D E F♯ G♯ A B, the notes of A melodic minor. It is Lydian with a raised 5th, and it fits a major seventh chord with a raised fifth, written Cmaj7♯5.

Now a whole minor ii–V–i can be played with melodic minor scales:

- **Bø7:** B Locrian natural 2 (D melodic minor).
- **E7:** E altered (F melodic minor).
- **Am:** A melodic minor.

One scale shape, moved to three places.`)] },
      { kind: "listen", blocks: [
        audio("B Locrian", seq("B3 C4 D4 E4 F4 G4 A4 B4", 120)),
        audio("B Locrian natural 2: C becomes C♯", seq("B3 C#4 D4 E4 F4 G4 A4 B4", 120)),
        audio("C Lydian augmented", seq("C4 D4 E4 F#4 G#4 A4 B4 C5", 120)),
        audio("Cmaj7♯5", together("C3 E3 G#3 B3")),
      ] },
      { kind: "learn", blocks: [
        show(scale("B", "locrian-natural-2", "degrees"), "B Locrian natural 2: 1 2 ♭3 4 ♭5 ♭6 ♭7."),
        show(chordOf("B", "m7b5"), "Bø7: B D F A. The scale's 1, ♭3, ♭5 and ♭7."),
        show(scale("C", "lydian-augmented", "degrees"), "C Lydian augmented: 1 2 3 ♯4 ♯5 6 7."),
      ] },
      { kind: "practice", blocks: [
        choice("How does Locrian natural 2 differ from Locrian?", ["Its second note is a whole step above the root", "Its fifth is perfect", "Its third is major"], 0, "1 2 ♭3 4 ♭5 ♭6 ♭7."),
        choice("Which chord does Locrian natural 2 fit?", ["Half-diminished: m7♭5", "Dominant seventh", "Major seventh"], 0, "It contains 1, ♭3, ♭5 and ♭7."),
        find("Tap the second note of B Locrian natural 2.", "C#", "A whole step above B."),
        choice("What is the formula of Lydian augmented?", ["1 2 3 ♯4 ♯5 6 7", "1 2 3 ♯4 5 6 ♭7", "1 2 3 4 ♯5 6 7"], 0, "Lydian with a raised 5th."),
        build("Build C Lydian augmented.", "C D E F# G# A B", "The notes of A melodic minor, with C as home."),
        choice("For Bø7 – E7 – Am, which three melodic minor scales can you use?", ["D, F and A melodic minor", "B, E and A melodic minor", "C, F and G melodic minor"], 0, "Locrian natural 2 on B, altered on E, melodic minor on A."),
      ] },
    ],
  },
];
