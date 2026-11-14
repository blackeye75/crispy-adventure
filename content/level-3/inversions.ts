import type { LessonInput } from "@/core/schemas/content";
import { along, audio, choice, chords, ear, find, pitches, show, text, together } from "../helpers";

const base = { moduleSlug: "inversions", isFree: false, version: 1, minutes: 6 } as const;
const G = { only: "guitar" } as const;
const P = { only: "piano" } as const;

export const inversions: LessonInput[] = [
  {
    ...base,
    slug: "root-position-and-inversions",
    title: "Root position and inversions",
    order: 1,
    concepts: ["inversions"],
    needs: ["major-and-minor-triads"],
    steps: [
      { kind: "understand", blocks: [text(`A triad stays the same chord whichever of its notes is at the bottom. But the lowest note changes its colour.

- **Root position:** the root is lowest. C E G.
- **First inversion:** the third is lowest. E G C.
- **Second inversion:** the fifth is lowest. G C E.

All three are C major. Root position sounds the most solid; the inversions sound lighter and are useful for moving smoothly between chords.`)] },
      { kind: "listen", blocks: [
        audio("C major in root position, first inversion, second inversion", chords("C4 E4 G4", "E4 G4 C5", "G4 C5 E5")),
      ] },
      { kind: "learn", blocks: [
        show(pitches("C4 E4 G4", { strings: [3, 2, 1], within: [3, 5] }), "Root position: C at the bottom."),
        show(pitches("E4 G4 C5", { strings: [3, 2, 1], within: [8, 9] }), "First inversion: E at the bottom."),
        show(pitches("G3 C4 E4", { strings: [3, 2, 1], within: [0, 1] }), "Second inversion: G at the bottom."),
      ] },
      { kind: "practice", blocks: [
        choice("Which note is lowest in a first inversion triad?", ["The third", "The root", "The fifth"], 0, "First inversion puts the third in the bass."),
        choice("G C E is C major in…", ["Second inversion", "First inversion", "Root position"], 0, "The fifth, G, is lowest."),
        choice("E G C is C major in…", ["First inversion", "Second inversion", "Root position"], 0, "The third, E, is lowest."),
        choice("What does inverting a chord change?", ["Which note is lowest", "Which chord it is", "How many notes it has"], 0, "The notes are the same; only their order from the bottom changes."),
        ear("These are the three notes of C major. Is C at the bottom?", together("E3 G3 C4"), ["No: this is an inversion", "Yes: root position"], 0, "E is lowest: first inversion."),
        ear("And here?", together("C3 E3 G3"), ["No: this is an inversion", "Yes: root position"], 1, "C is lowest."),
      ] },
    ],
  },
  {
    ...base,
    slug: "slash-chords",
    title: "Slash chords and bass lines",
    order: 2,
    concepts: ["slash-chords"],
    needs: ["root-position-and-inversions"],
    steps: [
      { kind: "understand", blocks: [text(`A **slash chord** names the lowest note. **C/E** means a C major chord with E in the bass. The letter before the slash is the chord; the letter after it is the bass note.

Slash chords are how inversions are written, and they are mostly used to make the bass move smoothly.

C, G, Am has a bass that jumps: C, G, A. Play **C, G/B, Am** and the bass walks down by step: C, B, A.

Occasionally the bass note is not in the chord at all, as in C/D. That is a different colour, for later.`)] },
      { kind: "listen", blocks: [
        audio("C, G, Am with the roots in the bass: the bass jumps", chords("C3 E3 G3", "G2 B2 D3", "A2 C3 E3")),
        audio("C, G/B, Am: the bass walks down C, B, A", chords("C3 E3 G3", "B2 D3 G3", "A2 C3 E3")),
      ] },
      { kind: "learn", blocks: [
        show(pitches("C3 E3 G3", { within: [0, 3] }), "C: C in the bass."),
        show(pitches("B2 D3 G3", { within: [0, 2] }), "G/B: the notes of G major with B in the bass."),
        show(pitches("A2 E3 C4", { within: [0, 2] }), "Am: A in the bass. The bass has stepped down C, B, A."),
      ] },
      { kind: "practice", blocks: [
        choice("What does C/E mean?", ["C major with E as the lowest note", "C major, then E major", "A chord between C and E"], 0, "Chord, slash, bass note."),
        choice("What is the lowest note of G/B?", ["B", "G", "D"], 0, "The note after the slash is the bass."),
        choice("In C, G/B, Am, what does the bass line play?", ["C, B, A", "C, G, A", "C, D, E"], 0, "It walks down by step."),
        choice("D/F♯ is D major in…", ["First inversion", "Second inversion", "Root position"], 0, "F♯ is the third of D major."),
        choice("What is the lowest note of Am/C?", ["C", "A", "E"], 0, "Am with its third in the bass."),
        ear("Does the bass walk down by step, or jump?", chords("C3 E3 G3", "B2 D3 G3", "A2 C3 E3"), ["It walks down by step", "It jumps"], 0, "C, B, A: the middle chord is G/B."),
      ] },
    ],
  },
  {
    ...base,
    slug: "triad-shapes-on-three-strings",
    title: "Triad shapes on three strings",
    order: 3,
    strand: "guitar",
    concepts: ["guitar-triad-shapes"],
    needs: ["root-position-and-inversions", "notes-on-all-strings"],
    steps: [
      { kind: "understand", blocks: [text(`On any three neighbouring strings a triad has three shapes, one for each inversion. They are small, they move anywhere, and together they cover the neck.

C major on strings 3, 2 and 1:

- **Root position:** frets 5, 5, 3.
- **First inversion:** frets 9, 8, 8.
- **Second inversion:** frets 0, 1, 0, and the same shape again at 12, 13, 12.

On strings 4, 3 and 2 the same chord is 10, 9, 8 in root position, 2, 0, 1 in first inversion, and a straight line at fret 5 in second inversion.

Slide any shape up two frets and it is D major.`)] },
      { kind: "listen", blocks: [audio("C major up the neck on strings 3, 2 and 1: three shapes", chords("G3 C4 E4", "C4 E4 G4", "E4 G4 C5"))] },
      { kind: "learn", blocks: [
        show(pitches("C4 E4 G4", { strings: [3, 2, 1], within: [3, 5] }), "Root position on strings 3, 2, 1: frets 5, 5, 3.", "guitar"),
        show(pitches("E4 G4 C5", { strings: [3, 2, 1], within: [8, 9] }), "First inversion: frets 9, 8, 8.", "guitar"),
        show(pitches("G3 C4 E4", { strings: [4, 3, 2], within: [5, 5] }), "Second inversion on strings 4, 3, 2: a straight line at fret 5.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        find("C major, root position on strings 3, 2, 1: tap the root, on string 3.", "C4", "Fret 5 of string 3 is C.", { strings: [3], ...G }),
        choice("In the first inversion shape, frets 9, 8, 8, which note is on string 3?", ["E", "C", "G"], 0, "First inversion has the third at the bottom, and fret 9 of string 3 is E."),
        choice("Move the root-position shape up two frets. Which chord is it?", ["D major", "E major", "C♯ major"], 0, "Every note rises a whole step."),
        find("Second inversion on strings 4, 3, 2 is a line at fret 5. Tap its lowest note.", "G3", "Fret 5 of string 4 is G, the fifth of C.", { strings: [4], ...G }),
        choice("How many shapes does a triad have on one set of three strings?", ["Three, one per inversion", "One", "Six"], 0, "Root position, first inversion, second inversion."),
      ] },
    ],
  },
  {
    ...base,
    slug: "smooth-chord-changes",
    title: "Changing chords with the least movement",
    order: 4,
    strand: "piano",
    concepts: ["piano-voice-leading"],
    needs: ["root-position-and-inversions", "finger-numbers"],
    steps: [
      { kind: "understand", blocks: [text(`Jumping the whole hand from one root-position chord to the next is hard work and sounds choppy. Inversions let the hand stay where it is.

The method: keep any note the two chords share, and move the others to the nearest note of the new chord.

From C (C E G) to F, keep the C and move the other two up a step: **C F A**. That is F major in second inversion.

From there to G, slip down to **B D G**, G major in first inversion. Then back to C E G. That is I, IV, V, I with the hand hardly moving.`)] },
      { kind: "listen", blocks: [
        audio("I, IV, V, I in root position: the hand jumps", chords("C4 E4 G4", "F4 A4 C5", "G4 B4 D5", "C4 E4 G4")),
        audio("The same chords with inversions: the hand stays put", chords("C4 E4 G4", "C4 F4 A4", "B3 D4 G4", "C4 E4 G4")),
      ] },
      { kind: "learn", blocks: [
        show(pitches("C4 E4 G4"), "C major, root position.", "piano"),
        show(pitches("C4 F4 A4"), "F major, second inversion: C stays, E and G each move up one step.", "piano"),
        show(pitches("B3 D4 G4"), "G major, first inversion: just below where the hand was.", "piano"),
      ] },
      { kind: "practice", blocks: [
        choice("Going from C major to F major, which note can stay where it is?", ["C", "E", "G"], 0, "C is in both chords."),
        choice("Which F major chord is closest to C E G?", ["C F A", "F A C, an octave up", "A C F"], 0, "One note stays and two move by a single step."),
        choice("C F A is F major in…", ["Second inversion", "First inversion", "Root position"], 0, "The fifth, C, is lowest."),
        choice("From C E G to A minor, how many notes need to move?", ["One: G moves up to A", "Two", "All three"], 0, "C E A is A minor in first inversion."),
        find("You are holding C and E. Tap the third note needed for A minor.", "A", "C, E and A make A minor.", P),
        along("Play C, F, G, C with the closest shapes: C E G, C F A, B D G, C E G.", chords("C4 E4 G4", "C4 F4 A4", "B3 D4 G4", "C4 E4 G4"), 60),
      ] },
    ],
  },
];
