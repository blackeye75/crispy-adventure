import type { LessonInput } from "@/core/schemas/content";
import { audio, build, choice, chordOf, chords, ear, prog, progression, show, text } from "../helpers";

const base = { moduleSlug: "borrowed-chords", isFree: false, version: 1, minutes: 6 } as const;

export const borrowedChords: LessonInput[] = [
  {
    ...base,
    slug: "modal-interchange",
    title: "Borrowing from the parallel minor",
    order: 1,
    concepts: ["modal-interchange"],
    needs: ["relative-and-parallel-minor", "chords-of-a-minor-key"],
    steps: [
      { kind: "understand", blocks: [text(`C major and C minor share a home note. Because of that, a song in C major can **borrow** chords from C minor without losing its sense of home. This is called **modal interchange**.

Four borrowed chords are everywhere in popular music. In the key of C:

- **iv:** Fm in place of F. A sudden shadow, often as IV, iv, I.
- **♭VII:** B♭. A rock staple: I, ♭VII, IV.
- **♭VI:** A♭. Grand and cinematic, often as ♭VI, ♭VII, I.
- **♭III:** E♭. Bold, and common in rock and blues.

Each brings in notes from the minor scale, the lowered 3rd, 6th or 7th, and so darkens the major key for a moment.`)] },
      { kind: "listen", blocks: [
        audio("IV, iv, I: F, Fm, C", prog("C", "IV iv I", 72)),
        audio("I, ♭VII, IV, I: C, B♭, F, C", prog("C", "I bVII IV I", 80)),
        audio("♭VI, ♭VII, I: A♭, B♭, C", prog("C", "bVI bVII I", 72)),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "IV iv I"), "F, Fm, C. One note changes between F and Fm: A falls to A♭, then to G."),
        show(progression("C", "bVI bVII I"), "A♭, B♭, C: two borrowed chords climbing by whole steps to home."),
      ] },
      { kind: "practice", blocks: [
        choice("Where do borrowed chords in a major key usually come from?", ["The parallel minor key", "The relative minor key", "A key a fifth higher"], 0, "Same home note, so home is not disturbed."),
        choice("In C major, what is the borrowed iv chord?", ["Fm", "F", "Dm"], 0, "The IV chord made minor."),
        choice("In C major, what is ♭VII?", ["B♭", "B°", "A♭"], 0, "A major chord a whole step below the tonic."),
        choice("In G major, what is ♭VII?", ["F", "F♯°", "E♭"], 0, "A whole step below G."),
        build("Build A♭ major, the ♭VI of C.", "Ab C Eb", "A major triad on A♭."),
        ear("Is the middle chord major or minor?", prog("C", "IV iv I", 72), ["It changes: major, then minor", "It stays major"], 0, "F turns to Fm before resolving to C."),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-picardy-third",
    title: "The Picardy third",
    order: 2,
    concepts: ["picardy-third"],
    needs: ["modal-interchange", "harmonic-minor"],
    steps: [
      { kind: "understand", blocks: [text(`Borrowing works in the other direction too. A piece in a minor key can borrow from the parallel major, and the most famous case is its very last chord.

A **Picardy third** is a major tonic chord at the end of a piece in a minor key. The third of the final chord is raised by a half step: a piece in A minor ends not on A C E but on A **C♯** E.

After a whole piece of minor, the major chord arrives like sunlight. It has been used this way for centuries, and it still works.

Only the third changes. The root and fifth of the home chord are the same in major and minor.`)] },
      { kind: "listen", blocks: [
        audio("A minor ending as expected: Am, Dm, E, Am", prog("A", "i iv V i", 66)),
        audio("With a Picardy third: Am, Dm, E, A major", prog("A", "i iv V I", 66)),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("A", "minor"), "A minor: A C E. The expected last chord."),
        show(chordOf("A", "major"), "A major: A C♯ E. The third has been raised."),
      ] },
      { kind: "practice", blocks: [
        choice("What is a Picardy third?", ["A major tonic chord ending a piece in a minor key", "A minor chord ending a piece in a major key", "A third added on top of a chord"], 0, "The last chord's third is raised."),
        choice("A piece in A minor ends with a Picardy third. Which note is in the last chord?", ["C♯", "C", "G♯"], 0, "A C♯ E in place of A C E."),
        choice("A piece in D minor ends with a Picardy third. What is the last chord?", ["D major", "D minor", "F major"], 0, "The tonic, made major."),
        choice("Which notes of the home chord stay the same?", ["The root and the fifth", "Only the root", "None"], 0, "Only the third moves."),
        ear("Does this piece in A minor end on a minor chord or with a Picardy third?", prog("A", "i iv V I", 66), ["With a Picardy third: a major chord", "On a minor chord"], 0, "The final chord has C♯."),
        ear("And this one?", prog("A", "i iv V i", 66), ["With a Picardy third: a major chord", "On a minor chord"], 1, "It ends where it began, on A minor."),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-neapolitan-chord",
    title: "The Neapolitan chord",
    order: 3,
    concepts: ["neapolitan"],
    needs: ["the-picardy-third", "root-position-and-inversions"],
    steps: [
      { kind: "understand", blocks: [text(`The **Neapolitan** is a major chord built on the **lowered 2nd degree** of the scale. In A minor the 2nd degree is B, so the Neapolitan is **B♭ major**: B♭ D F.

It is written ♭II, or N. It does the job of a subdominant, leading to V, and it is most at home in minor keys.

It is usually played in **first inversion**, with its third in the bass, which is why it is also called the Neapolitan sixth. In A minor that puts D at the bottom: D F B♭. The bass then steps up from D to E for the V chord.

The sound is dark and dramatic: the ♭2 is only a half step above home, and it falls through the leading tone on its way there.`)] },
      { kind: "listen", blocks: [
        audio("In A minor: Am, B♭ over D, E, Am", chords("A2 E3 A3 C4", "D3 F3 Bb3 D4", "E3 G#3 B3 E4", "A2 E3 A3 C4")),
        audio("The same with the ordinary iv chord: Am, Dm, E, Am", chords("A2 E3 A3 C4", "D3 F3 A3 D4", "E3 G#3 B3 E4", "A2 E3 A3 C4")),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("Bb", "major"), "B♭ major: the Neapolitan of A minor."),
        show(progression("A", "i bII V i"), "Am, B♭, E, Am. The Neapolitan takes the place of iv."),
      ] },
      { kind: "practice", blocks: [
        choice("On which degree is the Neapolitan chord built?", ["The lowered 2nd", "The lowered 6th", "The raised 4th"], 0, "A half step above the tonic."),
        choice("In A minor, which chord is the Neapolitan?", ["B♭ major", "B diminished", "D minor"], 0, "A major chord on B♭."),
        choice("In C minor, which chord is the Neapolitan?", ["D♭ major", "D minor", "E♭ major"], 0, "The lowered 2nd of C is D♭."),
        choice("Which inversion is the Neapolitan usually played in?", ["First inversion", "Root position", "Second inversion"], 0, "Hence its other name, the Neapolitan sixth."),
        choice("Which chord does the Neapolitan usually lead to?", ["V", "IV", "vi"], 0, "It acts as a subdominant."),
        ear("Is the second chord the ordinary iv or the Neapolitan?", chords("A2 E3 A3 C4", "D3 F3 Bb3 D4", "E3 G#3 B3 E4", "A2 E3 A3 C4"), ["The Neapolitan: it has B♭", "The ordinary iv: Dm"], 0, "D F B♭ in place of D F A."),
      ] },
    ],
  },
];
