import type { LessonInput } from "@/core/schemas/content";
import { along, audio, build, choice, ear, find, position, prog, progression, scale, seq, show, text } from "../helpers";

const base = { moduleSlug: "modes", isFree: false, version: 1, minutes: 6 } as const;
const D_DORIAN = "D4 E4 F4 G4 A4 B4 C5 D5";
const C_LYDIAN = "C4 D4 E4 F#4 G4 A4 B4 C5";
const C_MIXOLYDIAN = "C4 D4 E4 F4 G4 A4 Bb4 C5";
const C_DORIAN = "C4 D4 Eb4 F4 G4 A4 Bb4 C5";

export const modes: LessonInput[] = [
  {
    ...base,
    slug: "the-seven-modes",
    title: "The seven modes",
    order: 1,
    concepts: ["modes"],
    needs: ["relative-major-and-minor", "the-natural-minor-scale"],
    steps: [
      { kind: "understand", blocks: [text(`You already know that C major and A minor share the same seven notes and differ only in which note is home. Take that idea further: **any** of the seven notes can be home. Each choice is a **mode**, and each has its own name and colour.

Using the white keys:

- From C: **Ionian**, the major scale.
- From D: **Dorian**.
- From E: **Phrygian**.
- From F: **Lydian**.
- From G: **Mixolydian**.
- From A: **Aeolian**, the natural minor scale.
- From B: **Locrian**.

Same notes, seven different homes, seven different moods.`)] },
      { kind: "listen", blocks: [
        audio("White keys from C: Ionian", seq("C4 D4 E4 F4 G4 A4 B4 C5", 120)),
        audio("White keys from D: Dorian", seq(D_DORIAN, 120)),
        audio("White keys from G: Mixolydian", seq("G3 A3 B3 C4 D4 E4 F4 G4", 120)),
      ] },
      { kind: "learn", blocks: [
        show(scale("D", "dorian"), "D Dorian: the notes of C major, with D as home."),
        show(scale("G", "mixolydian"), "G Mixolydian: the same notes again, with G as home."),
      ] },
      { kind: "practice", blocks: [
        choice("What makes two modes of the same scale different?", ["Which note is home", "Which notes they contain", "How fast they are played"], 0, "The notes are shared; the home note changes."),
        choice("The white keys played from D give which mode?", ["Dorian", "Phrygian", "Lydian"], 0, "C Ionian, D Dorian, E Phrygian."),
        choice("Which mode is the same as the major scale?", ["Ionian", "Aeolian", "Mixolydian"], 0, "Ionian is the major scale's modal name."),
        choice("Which mode is the same as the natural minor scale?", ["Aeolian", "Dorian", "Locrian"], 0, "The white keys from A."),
        choice("The white keys played from F give which mode?", ["Lydian", "Mixolydian", "Phrygian"], 0, "F is the fourth note of C major, and the fourth mode is Lydian."),
        build("Build G Mixolydian.", "G A B C D E F", "The white keys, with G as home."),
      ] },
    ],
  },
  {
    ...base,
    slug: "parallel-modes",
    title: "Modes side by side: the parallel approach",
    order: 2,
    concepts: ["parallel-modes"],
    needs: ["the-seven-modes"],
    steps: [
      { kind: "understand", blocks: [text(`Starting each mode on a different white key hides how different they sound. Put them all on the **same** home note and the differences are plain. This is the **parallel** approach.

Each mode is a major or a natural minor scale with one or two notes changed:

- **Lydian:** major with a raised 4th. 1 2 3 ♯4 5 6 7.
- **Mixolydian:** major with a lowered 7th. 1 2 3 4 5 6 ♭7.
- **Dorian:** natural minor with a raised 6th. 1 2 ♭3 4 5 6 ♭7.
- **Phrygian:** natural minor with a lowered 2nd. 1 ♭2 ♭3 4 5 ♭6 ♭7.
- **Locrian:** Phrygian with a lowered 5th as well. 1 ♭2 ♭3 4 ♭5 ♭6 ♭7.

Three modes have a major third and sound major: Lydian, Ionian, Mixolydian. The other four have a minor third.`)] },
      { kind: "listen", blocks: [
        audio("C Lydian: major with F♯", seq(C_LYDIAN, 120)),
        audio("C Mixolydian: major with B♭", seq(C_MIXOLYDIAN, 120)),
        audio("C Dorian: minor with A natural", seq(C_DORIAN, 120)),
      ] },
      { kind: "learn", blocks: [
        show(scale("C", "lydian", "degrees"), "C Lydian: 1 2 3 ♯4 5 6 7."),
        show(scale("C", "mixolydian", "degrees"), "C Mixolydian: 1 2 3 4 5 6 ♭7."),
        show(scale("C", "dorian", "degrees"), "C Dorian: 1 2 ♭3 4 5 6 ♭7."),
      ] },
      { kind: "practice", blocks: [
        choice("Lydian is the major scale with which change?", ["A raised 4th", "A lowered 7th", "A lowered 3rd"], 0, "1 2 3 ♯4 5 6 7."),
        choice("Mixolydian is the major scale with which change?", ["A lowered 7th", "A raised 4th", "A lowered 2nd"], 0, "1 2 3 4 5 6 ♭7."),
        choice("Dorian is natural minor with which change?", ["A raised 6th", "A lowered 2nd", "A raised 7th"], 0, "1 2 ♭3 4 5 6 ♭7."),
        build("Build C Lydian.", "C D E F# G A B", "C major with the 4th raised to F♯."),
        build("Build C Mixolydian.", "C D E F G A Bb", "C major with the 7th lowered to B♭."),
        choice("Which three modes sound major?", ["Lydian, Ionian, Mixolydian", "Dorian, Phrygian, Aeolian", "Lydian, Dorian, Locrian"], 0, "They are the three with a major third."),
      ] },
    ],
  },
  {
    ...base,
    slug: "characteristic-notes",
    title: "The characteristic note of each mode",
    order: 3,
    concepts: ["characteristic-notes"],
    needs: ["parallel-modes"],
    steps: [
      { kind: "understand", blocks: [text(`Each mode has one note that sets it apart from plain major or minor. That is its **characteristic note**. Play it, and the mode announces itself; avoid it, and nobody can tell which mode you are in.

- **Lydian:** the ♯4. Bright and floating.
- **Mixolydian:** the ♭7. Major, but bluesy and unresolved.
- **Dorian:** the natural 6. Minor, but with a lift.
- **Phrygian:** the ♭2. Dark and Spanish-sounding.
- **Locrian:** the ♭5. Unstable; even its home chord is diminished.

Ionian and Aeolian are the references the others are measured against. Their telling notes are the natural 4 and 7 for Ionian and the ♭6 for Aeolian.`)] },
      { kind: "listen", blocks: [
        audio("Lydian's ♯4 against its home chord", seq("C4 E4 G4 F#4 G4", 90)),
        audio("Mixolydian's ♭7", seq("C4 E4 G4 Bb4 G4", 90)),
        audio("Dorian's natural 6", seq("C4 Eb4 G4 A4 G4", 90)),
        audio("Phrygian's ♭2", seq("C4 Db4 C4 Eb4 C4", 90)),
      ] },
      { kind: "learn", blocks: [
        show(scale("C", "phrygian", "degrees"), "C Phrygian. The ♭2, D♭, sits a half step above home."),
        show(scale("C", "dorian", "degrees"), "C Dorian. The natural 6, A, is what separates it from C natural minor."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the characteristic note of Lydian?", ["The ♯4", "The ♭7", "The ♭2"], 0, "A raised fourth over a major chord."),
        choice("What is the characteristic note of Dorian?", ["The natural 6", "The ♭2", "The ♯4"], 0, "It is the one note that differs from natural minor."),
        find("Tap the characteristic note of C Mixolydian.", "Bb", "The ♭7 of C is B♭."),
        find("Tap the characteristic note of C Phrygian.", "Db", "The ♭2 of C is D♭."),
        ear("Which mode's colour is this?", seq("C4 E4 G4 F#4 G4", 90), ["Lydian: the ♯4", "Mixolydian: the ♭7", "Dorian: the natural 6"], 0, "A major chord with a raised fourth leaning on its fifth."),
        ear("And this?", seq("C4 Eb4 G4 A4 G4", 90), ["Lydian: the ♯4", "Mixolydian: the ♭7", "Dorian: the natural 6"], 2, "A minor chord with a bright sixth above it."),
      ] },
    ],
  },
  {
    ...base,
    slug: "modal-progressions",
    title: "Modal chord progressions",
    order: 4,
    concepts: ["modal-progressions"],
    needs: ["characteristic-notes", "harmonising-the-major-scale"],
    steps: [
      { kind: "understand", blocks: [text(`To make harmony sound modal, pair the home chord with a chord that contains the characteristic note. Usually two chords are enough, repeated.

- **Dorian: i to IV.** Dm to G. The major IV holds the natural 6.
- **Mixolydian: I to ♭VII.** G to F. The ♭VII is built on the lowered 7th.
- **Lydian: I to II.** F to G. The major II holds the ♯4.
- **Phrygian: i to ♭II.** Em to F. The ♭II is built on the lowered 2nd.

The home chord must stay clearly home. Modal music avoids the strong V to I of major and minor keys, because that would pull the ear back to an ordinary key.`)] },
      { kind: "listen", blocks: [
        audio("Dorian: Dm to G", prog("D", "i IV i IV", 80)),
        audio("Mixolydian: G to F", prog("G", "I bVII I bVII", 80)),
        audio("Lydian: F to G", prog("F", "I II I II", 80)),
        audio("Phrygian: Em to F", prog("E", "i bII i bII", 80)),
      ] },
      { kind: "learn", blocks: [
        show(progression("D", "i IV"), "D Dorian: Dm and G. The B in the G chord is the natural 6."),
        show(progression("G", "I bVII"), "G Mixolydian: G and F. The F chord sits on the ♭7."),
      ] },
      { kind: "practice", blocks: [
        choice("Which pair of chords sounds Dorian?", ["i to IV", "I to ♭VII", "i to ♭II"], 0, "A minor home chord with a major chord on the 4th."),
        choice("Which pair sounds Mixolydian?", ["I to ♭VII", "I to II", "i to IV"], 0, "A major home chord with a major chord a whole step below."),
        choice("In D Dorian, i to IV is…", ["Dm to G", "Dm to Gm", "D to G"], 0, "The minor home chord and a major IV."),
        ear("Which mode is this vamp in?", prog("D", "i IV i IV", 80), ["Dorian", "Mixolydian", "Phrygian"], 0, "Minor home chord, major chord on the fourth."),
        ear("And this one?", prog("G", "I bVII I bVII", 80), ["Dorian", "Mixolydian", "Phrygian"], 1, "Major home chord, major chord a whole step lower."),
        ear("And this one?", prog("E", "i bII i bII", 80), ["Dorian", "Mixolydian", "Phrygian"], 2, "Minor home chord, major chord just a half step above."),
      ] },
    ],
  },
  {
    ...base,
    slug: "modes-in-shapes-you-know",
    title: "Modes inside shapes you already know",
    order: 5,
    strand: "guitar",
    concepts: ["guitar-modes"],
    needs: ["characteristic-notes", "five-pentatonic-positions"],
    steps: [
      { kind: "understand", blocks: [text(`You do not need new fingerings for the modes. Each one is a pentatonic box with two notes added.

The **minor pentatonic** is 1 ♭3 4 5 ♭7. The three minor modes all contain it:

- add 2 and natural 6: **Dorian**.
- add 2 and ♭6: **Aeolian**.
- add ♭2 and ♭6: **Phrygian**.

The **major pentatonic** is 1 2 3 5 6. The three major modes all contain it:

- add 4 and 7: **Ionian**.
- add ♯4 and 7: **Lydian**.
- add 4 and ♭7: **Mixolydian**.

So in position 1 of A minor pentatonic, adding B and F♯ gives A Dorian; adding B and F gives A Aeolian. One note of difference, and it is the characteristic note.`)] },
      { kind: "listen", blocks: [
        audio("A minor pentatonic", seq("A3 C4 D4 E4 G4 A4", 110)),
        audio("A Dorian: with B and F♯ added", seq("A3 B3 C4 D4 E4 F#4 G4 A4", 110)),
        audio("A Aeolian: with B and F added", seq("A3 B3 C4 D4 E4 F4 G4 A4", 110)),
      ] },
      { kind: "learn", blocks: [
        show(position("A", "minor-pentatonic", 5, 8), "Position 1 of A minor pentatonic.", "guitar"),
        show(position("A", "dorian", 4, 8), "A Dorian in the same place: B and F♯ have joined the box.", "guitar"),
        show(position("A", "natural-minor", 4, 8), "A Aeolian: B again, but F instead of F♯.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes turn a minor pentatonic into Dorian?", ["The 2 and the natural 6", "The ♭2 and the ♭6", "The 4 and the 7"], 0, "In A: B and F♯."),
        choice("Which notes turn a major pentatonic into Mixolydian?", ["The 4 and the ♭7", "The ♯4 and the 7", "The 2 and the 6"], 0, "In A: D and G."),
        find("In A Dorian, tap the characteristic note on string 4.", "F#3", "The natural 6 of A is F♯: fret 4 of string 4.", { strings: [4], only: "guitar" }),
        choice("A Dorian and A Aeolian differ by which note?", ["F♯ in Dorian, F in Aeolian", "B in Dorian, B♭ in Aeolian", "C in Dorian, C♯ in Aeolian"], 0, "The 6th: natural in Dorian, lowered in Aeolian."),
        along("Play A Dorian in position 1, up and back, along with the track.", seq("A2 B2 C3 D3 E3 F#3 G3 A3 G3 F#3 E3 D3 C3 B2 A2"), 70, position("A", "dorian", 4, 8)),
      ] },
    ],
  },
  {
    ...base,
    slug: "modes-from-the-white-keys",
    title: "Modes from each white key, then in any key",
    order: 6,
    strand: "piano",
    concepts: ["piano-modes"],
    needs: ["characteristic-notes", "scales-in-every-key"],
    steps: [
      { kind: "understand", blocks: [text(`The piano makes the modes easy to hear: play from any white key up to the same key an octave higher, using only white keys, and you have played one mode.

To play a mode starting on **another** note, there are two routes.

**From the parent scale.** Dorian is always the second mode of some major scale. For C Dorian, find the major scale whose second note is C: that is B♭ major. Play B♭ major starting from C.

**From the formula.** Start with C major or C minor and change the characteristic note. C Dorian is C natural minor with A natural instead of A♭.

Both routes land on the same notes. The first is faster to play; the second tells you what you are hearing.`)] },
      { kind: "listen", blocks: [
        audio("D Dorian on the white keys", seq(D_DORIAN, 120)),
        audio("C Dorian: the notes of B♭ major, from C", seq(C_DORIAN, 120)),
      ] },
      { kind: "learn", blocks: [
        show(scale("D", "dorian"), "D Dorian: white keys only.", "piano"),
        show(scale("C", "dorian"), "C Dorian: the same pattern moved down a whole step. It needs E♭ and B♭.", "piano"),
      ] },
      { kind: "practice", blocks: [
        choice("Dorian is which mode of a major scale?", ["The second", "The fourth", "The fifth"], 0, "Ionian, then Dorian."),
        choice("C Dorian uses the notes of which major scale?", ["B♭ major", "C major", "F major"], 0, "C is the second note of B♭ major."),
        choice("G Mixolydian uses the notes of which major scale?", ["C major", "G major", "D major"], 0, "Mixolydian is the fifth mode, and G is the fifth note of C major."),
        build("Build C Dorian.", "C D Eb F G A Bb", "C minor with A natural, or B♭ major from C.", "piano"),
        choice("F Lydian uses the notes of which major scale?", ["C major", "F major", "B♭ major"], 0, "Lydian is the fourth mode, and F is the fourth note of C major."),
      ] },
    ],
  },
];
