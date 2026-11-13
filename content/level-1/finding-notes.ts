import type { LessonInput } from "@/core/schemas/content";
import { along, audio, choice, ear, everyNote, find, pitches, seq, show, text } from "../helpers";

const base = { moduleSlug: "finding-notes", isFree: true, version: 1, minutes: 6 } as const;
const guitar = { ...base, strand: "guitar" } as const;
const piano = { ...base, strand: "piano" } as const;
const G = { only: "guitar" } as const;
const P = { only: "piano" } as const;

const STRING_6 = "E2 F2 G2 A2 B2 C3 D3 E3";
const STRING_5 = "A2 B2 C3 D3 E3 F3 G3 A3";

export const findingNotes: LessonInput[] = [
  {
    ...guitar,
    slug: "notes-on-strings-6-and-5",
    title: "Notes on strings 6 and 5",
    order: 1,
    concepts: ["guitar-strings-6-and-5"],
    needs: ["guitar-layout", "half-and-whole-steps"],
    steps: [
      { kind: "understand", blocks: [text(`Strings 6 and 5 are your map of the neck. Barre chords and many scale patterns take their name from a note on one of these two strings.

You already have what you need: the open strings are E and A, and each fret is one half step. Walk up the musical alphabet, remembering that B–C and E–F are one fret apart and every other pair is two frets apart.

- **String 6:** E open, F at fret 1, G 3, A 5, B 7, C 8, D 10, E 12.
- **String 5:** A open, B at fret 2, C 3, D 5, E 7, F 8, G 10, A 12.`)] },
      { kind: "listen", blocks: [
        audio("The natural notes up string 6, from E to E", seq(STRING_6, 90)),
        audio("The natural notes up string 5, from A to A", seq(STRING_5, 90)),
      ] },
      { kind: "learn", blocks: [
        show(pitches(STRING_6, { strings: [6] }), "String 6: E F G A B C D E. Notice the one-fret gaps at E–F and B–C.", "guitar"),
        show(pitches(STRING_5, { strings: [5] }), "String 5: A B C D E F G A.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        find("Tap G on string 6.", "G", "G is at fret 3 of string 6.", { strings: [6], ...G }),
        find("Tap C on string 5.", "C", "C is at fret 3 of string 5.", { strings: [5], ...G }),
        choice("Which note is at fret 5 of string 6?", ["A", "G", "B"], 0, "E, F at 1, G at 3, A at 5."),
        choice("Which note is at fret 7 of string 5?", ["E", "D", "F"], 0, "A, B at 2, C at 3, D at 5, E at 7."),
        find("Tap D on string 6.", "D", "D is at fret 10 of string 6, two frets above C.", { strings: [6], ...G }),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "one-fret-one-half-step",
    title: "One fret, one half step",
    order: 2,
    concepts: ["fret-half-step"],
    needs: ["notes-on-strings-6-and-5"],
    steps: [
      { kind: "understand", blocks: [text(`Every fret is exactly one half step. That single fact finds every sharp and flat on the neck.

The frets you skipped in the last lesson are the in-between notes. F is at fret 1 of string 6 and G is at fret 3, so fret 2 is F♯, which is also G♭.

To find any sharp, go one fret above the natural note. To find any flat, go one fret below. A whole step is two frets.`)] },
      { kind: "listen", blocks: [audio("String 6: open, then frets 1, 2 and 3. Each is a half step higher", seq("E2 F2 F#2 G2", 60))] },
      { kind: "learn", blocks: [show(pitches("E2 F2 F#2 G2 G#2 A2", { strings: [6] }), "Fret by fret along string 6. The frets between the natural notes are the sharps and flats.", "guitar")] },
      { kind: "practice", blocks: [
        choice("F is at fret 1 of string 6. What is at fret 2?", ["F♯, also called G♭", "G", "E"], 0, "One fret above F is F♯; it is also one fret below G, so G♭."),
        choice("How many frets is a whole step?", ["One", "Two", "Three"], 1, "A whole step is two half steps, so two frets."),
        find("Tap B♭ on string 5.", "Bb", "B is at fret 2, so B♭ is one fret lower, at fret 1.", { strings: [5], ...G }),
        find("Tap F♯ on string 6.", "F#", "F is at fret 1, so F♯ is at fret 2.", { strings: [6], ...G }),
        choice("C is at fret 8 of string 6. Where is C♯?", ["Fret 9", "Fret 7", "Fret 10"], 0, "A sharp is one fret higher."),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "the-twelfth-fret",
    title: "The 12th fret starts again",
    order: 3,
    concepts: ["twelfth-fret"],
    needs: ["one-fret-one-half-step"],
    steps: [
      { kind: "understand", blocks: [text(`There are twelve notes, and each fret is one of them. So twelve frets up, you are back on the note you started from, one octave higher.

Fret 12 of every string has the same name as the open string. Most guitars mark it with two dots.

Above fret 12 the whole pattern repeats: fret 13 is the same note as fret 1, fret 15 the same as fret 3. To find a note's octave on the same string, add 12.`)] },
      { kind: "listen", blocks: [audio("String 5 open, then at fret 12: A, and A an octave higher", seq("A2 A3", 50))] },
      { kind: "learn", blocks: [show(pitches("E3 A3 D4 G4 B4 E5", { within: [12, 12] }), "Fret 12 on every string: E A D G B E again, one octave above the open strings.", "guitar")] },
      { kind: "practice", blocks: [
        choice("Which note is at fret 12 of string 5?", ["A", "E", "D"], 0, "Fret 12 has the same name as the open string."),
        choice("G is at fret 3 of string 6. Where is the next G up the same string?", ["Fret 15", "Fret 12", "Fret 9"], 0, "Add 12 frets for one octave: 3 + 12 = 15."),
        find("Tap the note one octave above the open D string, on the same string.", "D4", "Fret 12 of string 4 is D again.", { strings: [4], ...G }),
        ear("You hear open string 6, then a second note. Where on string 6 is the second note?", seq("E2 E3", 50), ["Fret 12", "Fret 7"], 0, "It is the same note an octave higher, and that is fret 12."),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "octave-shapes",
    title: "Octave shapes",
    order: 4,
    concepts: ["octave-shapes"],
    needs: ["the-twelfth-fret"],
    steps: [
      { kind: "understand", blocks: [text(`An **octave shape** is a fixed pattern that takes you from a note to the same note one octave higher. With two shapes, the notes you know on strings 6 and 5 unlock the rest of the neck.

- **From string 6 or 5:** go two strings over, towards the thinner strings, and two frets up.
- **From string 4 or 3:** go two strings over and three frets up.

The extra fret makes up for the B string, which is tuned one half step closer to its neighbour than the other strings are.`)] },
      { kind: "listen", blocks: [
        audio("G on string 6, then its octave on string 4", seq("G2 G3", 50)),
        audio("G on string 4, then its octave on string 2", seq("G3 G4", 50)),
      ] },
      { kind: "learn", blocks: [
        show(pitches("G2 G3", { strings: [6, 4], within: [3, 5] }), "String 6 fret 3 to string 4 fret 5: two strings over, two frets up.", "guitar"),
        show(pitches("G3 G4", { strings: [4, 2], within: [5, 8] }), "String 4 fret 5 to string 2 fret 8: two strings over, three frets up.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        find("A is at fret 5 of string 6. Tap its octave on string 4.", "A3", "Two strings over and two frets up: fret 7 of string 4.", { strings: [4], ...G }),
        find("C is at fret 3 of string 5. Tap its octave on string 3.", "C4", "Two strings over and two frets up: fret 5 of string 3.", { strings: [3], ...G }),
        find("E is at fret 2 of string 4. Tap its octave on string 2.", "E4", "From string 4 it is three frets up: fret 5 of string 2.", { strings: [2], ...G }),
        choice("Starting on string 3, the octave is two strings over and how many frets up?", ["Two", "Three", "Four"], 1, "From strings 4 and 3 the shape is three frets up, because it crosses the B string."),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "notes-on-all-strings",
    title: "Notes on all six strings",
    order: 5,
    concepts: ["fretboard-notes"],
    needs: ["octave-shapes"],
    steps: [
      { kind: "understand", blocks: [text(`You now have three ways to name any fret:

- **String 1 is an E string**, like string 6. The same frets have the same note names, two octaves higher.
- **Octave shapes** carry a note you know on strings 6 and 5 over to strings 4 and 3, and on to strings 2 and 1.
- **The next open string:** fret 5 of a string is the same note as the open string above it. The one exception is string 3, where it is fret 4 that matches open string 2.

With practice the natural notes on strings 4, 3 and 2 become landmarks of their own.`)] },
      { kind: "listen", blocks: [
        audio("Fret 5 of string 6, then open string 5: the same A", seq("A2 A2", 50)),
        audio("Fret 4 of string 3, then open string 2: the same B", seq("B3 B3", 50)),
      ] },
      { kind: "learn", blocks: [
        show(pitches("D3 E3 F3 G3 A3 B3 C4 D4", { strings: [4] }), "String 4: D E F G A B C D.", "guitar"),
        show(pitches("G3 A3 B3 C4 D4 E4 F4 G4", { strings: [3] }), "String 3: G A B C D E F G.", "guitar"),
        show(pitches("B3 C4 D4 E4 F4 G4 A4 B4", { strings: [2] }), "String 2: B C D E F G A B.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        find("Tap F on string 1.", "F", "String 1 is an E string, like string 6: F is at fret 1.", { strings: [1], ...G }),
        find("Tap C on string 2.", "C", "String 2 is B open, and C is one fret above B.", { strings: [2], ...G }),
        find("Tap A on string 3.", "A", "String 3 is G open; A is a whole step up, at fret 2.", { strings: [3], ...G }),
        find("Tap G on string 4.", "G", "Fret 5 of string 4 matches open string 3, which is G.", { strings: [4], ...G }),
        choice("Which fret of string 3 gives the same note as open string 2?", ["Fret 4", "Fret 5", "Fret 3"], 0, "String 3 is the exception: fret 4, not fret 5."),
      ] },
    ],
  },
  {
    ...piano,
    slug: "naming-white-keys",
    title: "Naming every white key",
    order: 6,
    concepts: ["white-keys"],
    needs: ["piano-layout", "natural-notes"],
    steps: [
      { kind: "understand", blocks: [text(`The black keys tell you the name of every white key.

Around each group of **two** black keys: C is just to the left, D sits between them, E is just to the right.

Around each group of **three** black keys: F is just to the left, G and A sit inside the group, B is just to the right.

Then the pattern starts again at the next C.`)] },
      { kind: "listen", blocks: [audio("The white keys from middle C up to the next C", seq("C4 D4 E4 F4 G4 A4 B4 C5", 90))] },
      { kind: "learn", blocks: [show(pitches("C4 D4 E4 F4 G4 A4 B4 C5"), "C D E around the two black keys, F G A B around the three.", "piano")] },
      { kind: "practice", blocks: [
        find("Tap any F.", "F", "F is just left of each group of three black keys.", P),
        find("Tap any D.", "D", "D sits between the two black keys.", P),
        find("Tap any B.", "B", "B is just right of each group of three black keys.", P),
        choice("Which white key is just right of the group of two black keys?", ["E", "D", "F"], 0, "C, D, E surround the group of two; E is on the right."),
        find("Tap any A.", "A", "A is inside the group of three black keys, on the right-hand side.", P),
      ] },
    ],
  },
  {
    ...piano,
    slug: "naming-black-keys",
    title: "Naming the black keys",
    order: 7,
    concepts: ["black-keys"],
    needs: ["naming-white-keys", "enharmonic-notes"],
    steps: [
      { kind: "understand", blocks: [text(`A black key takes its name from the white key beside it, so each one has two names.

The group of two: **C♯ or D♭**, then **D♯ or E♭**.

The group of three: **F♯ or G♭**, then **G♯ or A♭**, then **A♯ or B♭**.

Sharp names look to the white key on the left; flat names look to the white key on the right.`)] },
      { kind: "listen", blocks: [audio("The five black keys above middle C", seq("C#4 D#4 F#4 G#4 A#4", 80))] },
      { kind: "learn", blocks: [
        show(pitches("C#4 D#4 F#4 G#4 A#4"), "Named from the white key on the left: the sharp names.", "piano"),
        show(pitches("Db4 Eb4 Gb4 Ab4 Bb4"), "The same keys named from the white key on the right: the flat names.", "piano"),
      ] },
      { kind: "practice", blocks: [
        find("Tap any F♯.", "F#", "F♯ is the first black key of the group of three, just right of F.", P),
        find("Tap any B♭.", "Bb", "B♭ is the last black key of the group of three, just left of B.", P),
        find("Tap any E♭.", "Eb", "E♭ is the second black key of the group of two, just left of E.", P),
        choice("The middle key of the group of three black keys can be called…", ["G♯ or A♭", "F♯ or G♭", "A♯ or B♭"], 0, "It sits between G and A."),
        choice("Which black key is just right of C?", ["C♯, also called D♭", "D♯, also called E♭", "B♭, also called A♯"], 0, "It is one key above C and one key below D."),
      ] },
    ],
  },
  {
    ...piano,
    slug: "octave-numbers",
    title: "Octave numbers",
    order: 8,
    concepts: ["octave-numbers"],
    needs: ["naming-black-keys"],
    steps: [
      { kind: "understand", blocks: [text(`There are many Cs on a piano. To say which one, each note gets a number.

The number goes up at every C: C4, D4, E4, F4, G4, A4, B4, and then C5. Middle C is **C4**. The white key just below it is B3.

A4, the A above middle C, is the note orchestras tune to. It vibrates 440 times a second.`)] },
      { kind: "listen", blocks: [audio("C3, C4 and C5", seq("C3 C4 C5", 60))] },
      { kind: "learn", blocks: [
        show(everyNote("C"), "Every C on this keyboard, labelled from C3 to C6.", "piano"),
        show(pitches("B3 C4 D4"), "The number changes at C: B3, then C4, then D4.", "piano"),
      ] },
      { kind: "practice", blocks: [
        find("Tap C5.", "C5", "C5 is the C one octave above middle C.", P),
        find("Tap B3.", "B3", "B3 is the white key just below C4.", P),
        choice("Which note comes right after B4?", ["C5", "C4", "A4"], 0, "The number goes up at every C."),
        find("Tap A4.", "A4", "A4 is the A above middle C.", P),
        choice("What is middle C called?", ["C4", "C3", "C1"], 0, "Middle C is C4."),
      ] },
    ],
  },
  {
    ...piano,
    slug: "finger-numbers",
    title: "Finger numbers",
    order: 9,
    concepts: ["finger-numbers"],
    needs: ["octave-numbers"],
    steps: [
      { kind: "understand", blocks: [text(`Pianists number their fingers the same way on both hands: the thumb is **1**, the index finger 2, the middle finger 3, the ring finger 4 and the little finger **5**.

Written piano music prints these numbers above or below notes to suggest which finger plays them.

A **five-finger position** rests one finger on each of five neighbouring white keys. With the right thumb on middle C, fingers 1 to 5 sit on C, D, E, F and G.`)] },
      { kind: "listen", blocks: [audio("Five notes under five fingers: C D E F G", seq("C4 D4 E4 F4 G4", 80))] },
      { kind: "learn", blocks: [show(pitches("C4 D4 E4 F4 G4"), "Right hand: thumb (1) on middle C, then fingers 2, 3, 4 and 5 on D, E, F and G.", "piano")] },
      { kind: "practice", blocks: [
        choice("Which finger is number 1?", ["The thumb", "The index finger", "The little finger"], 0, "On both hands the thumb is 1 and the little finger is 5."),
        choice("Right thumb on middle C, one finger per white key. Which note is under finger 3?", ["E", "D", "F"], 0, "1 on C, 2 on D, 3 on E."),
        choice("And which note is under finger 5?", ["G", "F", "A"], 0, "Five fingers cover C D E F G."),
        choice("The left hand rests over the same five keys, C to G. Which finger is on C?", ["Finger 5, the little finger", "Finger 1, the thumb"], 0, "The left hand mirrors the right: its little finger is on the lowest note."),
        along("Play C D E F G and back down, one finger per key, along with the track.", seq("C4 D4 E4 F4 G4 F4 E4 D4 C4"), 60, pitches("C4 D4 E4 F4 G4")),
      ] },
    ],
  },
];
