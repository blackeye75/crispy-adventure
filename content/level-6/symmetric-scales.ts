import type { LessonInput } from "@/core/schemas/content";
import { audio, build, chordOf, chords, choice, ear, scale, seq, show, text } from "../helpers";

const base = { moduleSlug: "symmetric-scales", isFree: false, version: 1, minutes: 6 } as const;
const C_WHOLE_TONE = "C4 D4 E4 F#4 G#4 Bb4 C5";
const G_HALF_WHOLE = "G3 Ab3 Bb3 B3 C#4 D4 E4 F4 G4";
const C_WHOLE_HALF = "C4 D4 Eb4 F4 Gb4 Ab4 A4 B4 C5";
const C_AUGMENTED = "C4 Eb4 E4 G4 G#4 B4 C5";

export const symmetricScales: LessonInput[] = [
  {
    ...base,
    slug: "the-whole-tone-scale",
    title: "The whole-tone scale",
    order: 1,
    concepts: ["whole-tone-scale"],
    needs: ["altered-dominants", "half-and-whole-steps"],
    steps: [
      { kind: "understand", blocks: [text(`Every scale so far has mixed whole steps and half steps, and the uneven pattern is what tells your ear where home is. A **symmetric scale** repeats one small pattern all the way up. It has no built-in home, and that gives it a floating, unsettled sound.

The simplest is the **whole-tone scale**: nothing but whole steps. From C: **C D E F♯ G♯ B♭**. Six notes, then C again.

Things that follow from the pattern:

- **There are only two.** Start a whole step higher, on D, and you get the same six notes. The only other whole-tone scale is the one a half step away: D♭ E♭ F G A B.
- **Every triad in it is augmented.** C E G♯, D F♯ A♯, and so on. There are no perfect fifths and no half steps.
- Its formula is **1 2 3 ♯4 ♯5 ♭7**. That is the core of a dominant chord (1, 3, ♭7) with the fifth both lowered and raised.

So its main use is over a **dominant seventh with a raised fifth**, written G7♯5 or G+7. Film and cartoon music also uses it for dream sequences, for exactly the floating quality you will hear.`)] },
      { kind: "listen", blocks: [
        audio("The C whole-tone scale", seq(C_WHOLE_TONE, 120)),
        audio("The C major scale, for comparison", seq("C4 D4 E4 F4 G4 A4 B4 C5", 120)),
        audio("G7♯5 from the whole-tone scale, resolving to C", chords("G2 F3 B3 D#4", "C3 E3 G3 C4")),
      ] },
      { kind: "learn", blocks: [
        show(scale("C", "whole-tone", "degrees"), "C whole-tone: 1 2 3 ♯4 ♯5 ♭7. Every note is two frets, or two keys, from the next."),
        show(chordOf("C", "aug"), "C augmented, C E G♯: every other note of the scale."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the step pattern of the whole-tone scale?", ["All whole steps", "Whole and half steps in turn", "All half steps"], 0, "Six whole steps fill the octave."),
        choice("How many notes does it have?", ["Six", "Seven", "Eight"], 0, "C D E F♯ G♯ B♭."),
        choice("How many different whole-tone scales exist?", ["Two", "Six", "Twelve"], 0, "Six notes each, and together they cover all twelve."),
        build("Build the C whole-tone scale.", "C D E F# G# Bb", "A whole step between every pair of notes."),
        choice("Which kind of triad does the scale produce on every note?", ["Augmented", "Major", "Diminished"], 0, "Two whole steps, then two more: stacked major thirds."),
        ear("Major scale or whole-tone scale?", seq(C_WHOLE_TONE, 120), ["Major scale", "Whole-tone scale"], 1, "Every step is the same size, and it reaches the octave in six notes."),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-diminished-scales",
    title: "The diminished scales",
    order: 2,
    concepts: ["diminished-scale"],
    needs: ["the-whole-tone-scale", "diminished-passing-chords", "the-altered-scale"],
    steps: [
      { kind: "understand", blocks: [text(`The **diminished scale** alternates half steps and whole steps. That gives **eight** notes, one more than you are used to. It comes in two forms, depending on which step you take first.

**Half–whole**, for dominant chords. From G: **G A♭ B♭ B C♯ D E F**. Over G7 these are 1, ♭9, ♯9, 3, ♯11, 5, 13 and ♭7. Compared with the altered scale it keeps the **natural fifth and thirteenth**, so it fits a chord written G13♭9.

**Whole–half**, for diminished seventh chords. From C: **C D E♭ F G♭ A♭ A B**. It holds C°7 (C, E♭, G♭, A) and a note a whole step above each chord tone.

The two forms are the same scale started in different places: G half–whole is A♭ whole–half.

Because the pattern repeats every minor third, there are only **three** diminished scales. The G, B♭, D♭ and E half–whole scales are all the same eight notes. Any phrase you play can be moved up or down three frets, or three keys, and it will still fit.`)] },
      { kind: "listen", blocks: [
        audio("G half–whole diminished", seq(G_HALF_WHOLE, 132)),
        audio("C whole–half diminished", seq(C_WHOLE_HALF, 132)),
        audio("One phrase, moved up a minor third each time", seq("G3 Ab3 Bb3 B3 Bb3 B3 C#4 D4 C#4 D4 E4 F4", 132)),
        audio("G13♭9, then Cmaj7", chords("G2 F3 Ab3 B3 E4", "C3 E3 G3 B3 E4")),
      ] },
      { kind: "learn", blocks: [
        show(scale("G", "diminished-half-whole", "degrees"), "G half–whole: for G7. It starts with a half step."),
        show(scale("C", "diminished-whole-half", "degrees"), "C whole–half: for C°7. It starts with a whole step."),
        show(chordOf("C", "dim7"), "C°7 sits inside the whole–half scale as every other note."),
      ] },
      { kind: "practice", blocks: [
        choice("How many notes does a diminished scale have?", ["Eight", "Six", "Seven"], 0, "Half and whole steps in turn take eight notes to fill the octave."),
        choice("Which form fits a dominant seventh chord?", ["Half–whole", "Whole–half"], 0, "Starting with a half step gives the ♭9 and keeps the major third."),
        choice("Which form fits a diminished seventh chord?", ["Whole–half", "Half–whole"], 0, "Chord tone, then a whole step up to the note in between."),
        choice("How many different diminished scales exist?", ["Three", "Two", "Twelve"], 0, "The pattern repeats every minor third, so four starting notes share each scale."),
        choice("What does half–whole diminished have that the altered scale does not?", ["A natural fifth and thirteenth", "A ♭9", "A major third"], 0, "Over G7: D and E. The altered scale has E♭ and no D."),
        ear("Which form is this?", seq(C_WHOLE_HALF, 132), ["Half–whole", "Whole–half"], 1, "The first step is a whole step."),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-augmented-scale",
    title: "The augmented scale",
    order: 3,
    concepts: ["augmented-scale"],
    needs: ["the-diminished-scales", "diminished-and-augmented-triads"],
    steps: [
      { kind: "understand", blocks: [text(`The third symmetric scale is the **augmented scale**. It alternates a **minor third** and a **half step**. From C: **C E♭ E G G♯ B**. Six notes.

The easy way to build it is from two augmented triads a minor third apart:

- C E G♯
- E♭ G B

Interlock them and you have the scale.

Although it comes from augmented triads, it hides ordinary ones. From C, E and A♭ you can build both a **major** and a **minor** triad: C major and C minor, E major and E minor, A♭ major and A♭ minor. Players use those triads to make lines that sound clear in shape and strange in key.

The pattern repeats every major third, so C, E and A♭ augmented scales are the same notes, and there are only **four** different ones.

It is the rarest of the three symmetric scales. You will hear it mostly in modern jazz, over major seventh chords and maj7♯5 chords, as a colour to pass through.`)] },
      { kind: "listen", blocks: [
        audio("The C augmented scale", seq(C_AUGMENTED, 120)),
        audio("Its two augmented triads: C E G♯, then E♭ G B", chords("C4 E4 G#4", "Eb4 G4 B4")),
        audio("Major triads hidden inside: C, E and A♭", chords("C4 E4 G4", "E4 G#4 B4", "Ab3 C4 Eb4")),
      ] },
      { kind: "learn", blocks: [
        show(scale("C", "augmented", "degrees"), "C augmented: 1 ♭3 3 5 ♯5 7."),
        show(chordOf("C", "aug"), "The first augmented triad: C E G♯."),
        show(chordOf("Eb", "aug"), "The second, a minor third higher: E♭ G B."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the step pattern of the augmented scale?", ["Minor third and half step in turn", "Whole step and half step in turn", "All whole steps"], 0, "C to E♭ is a minor third, E♭ to E a half step, and so on."),
        choice("Which two triads combine to make the C augmented scale?", ["C augmented and E♭ augmented", "C major and D major", "C diminished and D diminished"], 0, "C E G♯ and E♭ G B."),
        build("Build the C augmented scale.", "C Eb E G G# B", "Two augmented triads a minor third apart."),
        choice("Which of these major triads is inside the C augmented scale?", ["E major", "D major", "F major"], 0, "E G♯ B. The others are C major and A♭ major."),
        choice("How many different augmented scales exist?", ["Four", "Two", "Three"], 0, "The pattern repeats every major third, so three starting notes share each scale."),
        ear("Whole-tone or augmented scale?", seq(C_AUGMENTED, 120), ["Whole-tone", "Augmented"], 1, "The steps are uneven: a wide one, then a narrow one."),
      ] },
    ],
  },
];
