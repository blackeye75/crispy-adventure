import type { LessonInput } from "@/core/schemas/content";
import { along, audio, build, choice, ear, find, pitches, position, scale, seq, show, text } from "../helpers";

const base = { moduleSlug: "pentatonic-and-blues", isFree: false, version: 1, minutes: 6 } as const;
const C_MAJOR_PENT = "C4 D4 E4 G4 A4 C5";
const A_MINOR_PENT = "A3 C4 D4 E4 G4 A4";
const A_BLUES = "A3 C4 D4 Eb4 E4 G4 A4";

export const pentatonicAndBlues: LessonInput[] = [
  {
    ...base,
    slug: "the-major-pentatonic-scale",
    title: "The major pentatonic scale",
    order: 1,
    concepts: ["major-pentatonic"],
    needs: ["scale-degrees"],
    steps: [
      { kind: "understand", blocks: [text(`**Pentatonic** means five notes. The **major pentatonic** scale is the major scale with two notes taken out: the 4th and the 7th.

Its formula is **1 2 3 5 6**. In C that is C D E G A.

The 4th and 7th are the notes that form the major scale's two half steps. Without them, no two notes of the scale are a half step apart, so nothing clashes. That is why the pentatonic is so easy to make melodies with, and why it turns up in folk music all over the world.`)] },
      { kind: "listen", blocks: [
        audio("C major pentatonic: C, D, E, G, A, C", seq(C_MAJOR_PENT, 110)),
        audio("A short tune using only those five notes", seq("E4 G4 A4 G4 E4 D4 C4 D4 E4 C4", 120)),
      ] },
      { kind: "learn", blocks: [show(scale("C", "major-pentatonic", "degrees"), "C major pentatonic by degree: 1 2 3 5 6. Degrees 4 and 7 are missing.")] },
      { kind: "practice", blocks: [
        choice("Which degrees of the major scale does the major pentatonic leave out?", ["4 and 7", "2 and 6", "3 and 7"], 0, "1 2 3 5 6 remain."),
        build("Build C major pentatonic.", "C D E G A", "C major without F and B."),
        build("Build G major pentatonic.", "G A B D E", "G major without C and F♯."),
        choice("Why is the pentatonic scale easy to make melodies with?", ["It has no half steps, so nothing clashes", "It has more notes than the major scale", "It only works in one key"], 0, "The two notes it drops are the ones that make half steps."),
        ear("Five-note pentatonic scale, or seven-note major scale?", seq("G3 A3 B3 D4 E4 G4", 110), ["Pentatonic", "Major scale"], 0, "It skips from B to D and from E to G."),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-minor-pentatonic-scale",
    title: "The minor pentatonic scale",
    order: 2,
    concepts: ["minor-pentatonic"],
    needs: ["the-major-pentatonic-scale", "the-natural-minor-scale"],
    steps: [
      { kind: "understand", blocks: [text(`The **minor pentatonic** is the natural minor scale with the 2nd and 6th taken out.

Its formula is **1 ♭3 4 5 ♭7**. In A that is A C D E G.

Look at those notes again: they are the same five as C major pentatonic. A minor pentatonic and C major pentatonic are relatives, exactly as A minor and C major are. Which one you are hearing depends on which note the music treats as home.

This is the scale behind most rock and blues soloing.`)] },
      { kind: "listen", blocks: [
        audio("A minor pentatonic: A, C, D, E, G, A", seq(A_MINOR_PENT, 110)),
        audio("A short phrase that rests on A", seq("E4 G4 E4 D4 C4 A3 C4 A3", 120)),
      ] },
      { kind: "learn", blocks: [show(scale("A", "minor-pentatonic", "degrees"), "A minor pentatonic by degree: 1 ♭3 4 5 ♭7.")] },
      { kind: "practice", blocks: [
        choice("What is the formula of the minor pentatonic scale?", ["1 ♭3 4 5 ♭7", "1 2 3 5 6", "1 2 ♭3 5 ♭6"], 0, "Natural minor without its 2nd and 6th."),
        build("Build A minor pentatonic.", "A C D E G", "A natural minor without B and F."),
        build("Build E minor pentatonic.", "E G A B D", "E natural minor without F♯ and C."),
        choice("A minor pentatonic has the same notes as…", ["C major pentatonic", "A major pentatonic", "C minor pentatonic"], 0, "They are relatives: same five notes, different home."),
        ear("Does this pentatonic phrase rest on a minor or a major home?", seq("A3 C4 D4 E4 D4 C4 A3", 110), ["Minor", "Major"], 0, "It rests on A, with C a minor third above it."),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-blues-scale",
    title: "The blues scale",
    order: 3,
    concepts: ["blues-scale"],
    needs: ["the-minor-pentatonic-scale"],
    steps: [
      { kind: "understand", blocks: [text(`Add one note to the minor pentatonic and you have the **blues scale**. The extra note is the **♭5**, squeezed in between the 4th and the 5th.

Its formula is **1 ♭3 4 ♭5 5 ♭7**. In A that is A C D E♭ E G.

The ♭5 is called the **blue note**. It is a tritone above the root and sounds tense on its own, so players rarely stop on it. They pass through it on the way to the 4th or the 5th, and that slide is the sound of the blues.`)] },
      { kind: "listen", blocks: [
        audio("The A blues scale", seq(A_BLUES, 110)),
        audio("Passing through the blue note: D, E♭, E", seq("D4 Eb4 E4", 80)),
      ] },
      { kind: "learn", blocks: [show(scale("A", "blues", "degrees"), "The A blues scale: minor pentatonic plus the ♭5.")] },
      { kind: "practice", blocks: [
        choice("Which note does the blues scale add to the minor pentatonic?", ["The ♭5", "The 2nd", "The major 3rd"], 0, "It sits between the 4th and the 5th."),
        build("Build the A blues scale.", "A C D Eb E G", "A minor pentatonic plus E♭."),
        choice("In the A blues scale, which note is the blue note?", ["E♭", "C", "G"], 0, "E♭ is the ♭5 of A."),
        choice("How is the blue note usually played?", ["As a passing note between the 4th and the 5th", "As the note to end on", "Held for a whole bar"], 0, "It is tense, so it moves on."),
        ear("Minor pentatonic or blues scale?", seq(A_BLUES, 110), ["Blues scale", "Minor pentatonic"], 0, "You can hear the extra half step in the middle: D, E♭, E."),
      ] },
    ],
  },
  {
    ...base,
    slug: "five-pentatonic-positions",
    title: "The five pentatonic positions",
    order: 4,
    strand: "guitar",
    concepts: ["pentatonic-positions"],
    needs: ["the-minor-pentatonic-scale", "notes-on-all-strings"],
    steps: [
      { kind: "understand", blocks: [text(`The five notes of a pentatonic scale repeat all over the neck. Guitarists learn them as **five positions**, each a box of two notes per string.

In A minor pentatonic:

- **Position 1:** frets 5 to 8. The root is under the first note on string 6.
- **Position 2:** frets 7 to 10.
- **Position 3:** frets 9 to 13.
- **Position 4:** frets 12 to 15.
- **Position 5:** frets 2 to 5, and again at frets 14 to 17.

Each position shares its upper notes with the lower notes of the next. That shared edge is how you slide from one box to another, and after position 5 you are back at position 1, an octave higher.`)] },
      { kind: "listen", blocks: [audio("Position 1, from string 6 up to string 1", seq("A2 C3 D3 E3 G3 A3 C4 D4 E4 G4 A4 C5", 140))] },
      { kind: "learn", blocks: [
        show(position("A", "minor-pentatonic", 5, 8), "Position 1: frets 5 to 8. Notes outside the box are dimmed.", "guitar"),
        show(position("A", "minor-pentatonic", 7, 10), "Position 2: frets 7 to 10. Its lower notes are the upper notes of position 1.", "guitar"),
        show(position("A", "minor-pentatonic", 9, 13), "Position 3: frets 9 to 13.", "guitar"),
        show(position("A", "minor-pentatonic", 12, 15), "Position 4: frets 12 to 15.", "guitar"),
        show(position("A", "minor-pentatonic", 2, 5), "Position 5: frets 2 to 5. It joins on below position 1.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("How many notes per string does each pentatonic position have?", ["Two", "Three", "Four"], 0, "Five notes spread two to a string."),
        choice("In A minor pentatonic, position 1 covers which frets?", ["5 to 8", "7 to 10", "2 to 5"], 0, "It starts from A at fret 5 of string 6."),
        find("In position 1, tap the root on string 6.", "A2", "Fret 5 of string 6 is A.", { strings: [6], only: "guitar" }),
        choice("How are neighbouring positions connected?", ["They share a row of notes", "They share nothing", "They are an octave apart"], 0, "The top of one box is the bottom of the next."),
        choice("To play position 1 in G minor pentatonic, where does it start?", ["Fret 3", "Fret 5", "Fret 7"], 0, "The root moves to G, at fret 3 of string 6."),
        along("Play position 1 up and back, along with the track.", seq("A2 C3 D3 E3 G3 A3 C4 D4 E4 G4 A4 C5 A4 G4 E4 D4 C4 A3 G3 E3 D3 C3 A2"), 70, position("A", "minor-pentatonic", 5, 8)),
      ] },
    ],
  },
  {
    ...base,
    slug: "pentatonic-patterns-at-the-piano",
    title: "Pentatonic patterns in both hands",
    order: 5,
    strand: "piano",
    concepts: ["piano-pentatonic"],
    needs: ["the-minor-pentatonic-scale", "hands-together"],
    steps: [
      { kind: "understand", blocks: [text(`The piano gives you a pentatonic scale for free: the five **black keys**. Played from F♯ they are F♯ major pentatonic; played from D♯ they are D♯ minor pentatonic. Any black key sounds right against any other.

On the white keys, C major pentatonic is C D E G A: the white keys without F and B.

A simple way to improvise: the left hand holds the root and fifth, C and G, as a steady base. The right hand plays any of C D E G A above it, in any order and rhythm. Nothing will clash.`)] },
      { kind: "listen", blocks: [
        audio("The five black keys, from F♯", seq("F#4 G#4 A#4 C#5 D#5 F#5", 110)),
        audio("C major pentatonic on the white keys", seq(C_MAJOR_PENT, 110)),
      ] },
      { kind: "learn", blocks: [
        show(pitches("F#4 G#4 A#4 C#5 D#5"), "The black keys: F♯ major pentatonic.", "piano"),
        show(pitches("C3 G3 C4 D4 E4 G4 A4"), "Left hand: C and G. Right hand: C D E G A.", "piano"),
      ] },
      { kind: "practice", blocks: [
        choice("Which keys on the piano form a pentatonic scale by themselves?", ["The black keys", "The white keys", "Every third key"], 0, "Five black keys, five notes."),
        choice("Which white keys does C major pentatonic leave out?", ["F and B", "D and A", "E and B"], 0, "Degrees 4 and 7 of C major."),
        find("Tap the third degree of C major pentatonic.", "E", "C D E: the third note is E.", { only: "piano" }),
        choice("For a simple pentatonic improvisation, what does the left hand hold?", ["The root and the fifth", "The whole scale", "The 4th and the 7th"], 0, "C and G make a steady base under the right hand."),
        along("Left hand: hold C and G. Right hand: make up a melody with C D E G A over the track.", seq("C3 G3 C3 G3"), 60, pitches("C3 G3 C4 D4 E4 G4 A4")),
      ] },
    ],
  },
];
