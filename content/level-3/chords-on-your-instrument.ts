import type { LessonInput } from "@/core/schemas/content";
import { along, audio, choice, chords, diagram, ear, find, prog, rhythm, seq, staff, text, together } from "../helpers";

const base = { moduleSlug: "chords-on-your-instrument", isFree: false, version: 1, minutes: 7 } as const;
const guitar = { ...base, strand: "guitar" } as const;
const piano = { ...base, strand: "piano" } as const;
const G = { only: "guitar" } as const;

export const chordsOnYourInstrument: LessonInput[] = [
  {
    ...guitar,
    slug: "open-major-chords",
    title: "Open chords: E, A, D, G and C",
    order: 1,
    concepts: ["open-major-chords"],
    needs: ["reading-chord-symbols", "tab-and-chord-diagrams"],
    steps: [
      { kind: "understand", blocks: [text(`**Open chords** mix fretted notes with open strings. They sit in the first three frets and ring more fully than any other chords on the guitar.

Five major shapes cover a great deal of music: **E, A, D, G and C**.

Each diagram shows which strings to play. A string marked × is left out: the D chord uses only the top four strings, and A and C leave out string 6.

However many strings a shape uses, it contains only the three notes of its triad, some of them doubled in different octaves.`)] },
      { kind: "listen", blocks: [audio("E, A and D: the I, IV and V of A major", chords("E2 B2 E3 G#3 B3 E4", "A2 E3 A3 C#4 E4", "D3 A3 D4 F#4"))] },
      { kind: "learn", blocks: [
        diagram("022100", "E", "major", "E: all six strings."),
        diagram("x02220", "A", "major", "A: five strings, three of them at fret 2."),
        diagram("xx0232", "D", "major", "D: the top four strings only."),
        diagram("320003", "G", "major", "G: all six strings."),
        diagram("x32010", "C", "major", "C: five strings."),
      ] },
      { kind: "practice", blocks: [
        choice("Above a chord diagram, what does × mean?", ["Do not play that string", "Play that string open", "Press the first fret"], 0, "× is a string left out."),
        choice("Which open chord is written 0 2 2 1 0 0, from string 6 to string 1?", ["E", "A", "G"], 0, "The E chord uses all six strings."),
        choice("In the D chord, which strings are not played?", ["Strings 6 and 5", "Strings 1 and 2", "String 6 only"], 0, "D is × × 0 2 3 2."),
        find("In the C chord, tap the note on string 5.", "C3", "Fret 3 of string 5 is C, the root of the chord.", { strings: [5], ...G }),
        choice("In the A chord, which strings ring open?", ["Strings 5 and 1", "Strings 6 and 1", "Strings 4 and 3"], 0, "A is × 0 2 2 2 0."),
        choice("How many different note names are in a six-string G chord?", ["Three: G, B and D", "Six", "Four"], 0, "It is still a triad; the notes are doubled in other octaves."),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "open-minor-chords",
    title: "Open chords: Em, Am and Dm",
    order: 2,
    concepts: ["open-minor-chords"],
    needs: ["open-major-chords"],
    steps: [
      { kind: "understand", blocks: [text(`Each of the E, A and D shapes turns minor by moving one note down one fret. That note is the third of the chord.

- **E to Em:** string 3 goes from fret 1 to open.
- **A to Am:** string 2 goes from fret 2 to fret 1.
- **D to Dm:** string 1 goes from fret 2 to fret 1.

It is the lesson on major and minor triads made physical: lower the third by a half step, one fret.`)] },
      { kind: "listen", blocks: [
        audio("E major, then E minor", chords("E2 B2 E3 G#3 B3 E4", "E2 B2 E3 G3 B3 E4")),
        audio("A major, then A minor", chords("A2 E3 A3 C#4 E4", "A2 E3 A3 C4 E4")),
      ] },
      { kind: "learn", blocks: [
        diagram("022000", "E", "minor", "Em: the E shape with string 3 open."),
        diagram("x02210", "A", "minor", "Am: the A shape with string 2 at fret 1."),
        diagram("xx0231", "D", "minor", "Dm: the D shape with string 1 at fret 1."),
      ] },
      { kind: "practice", blocks: [
        choice("To turn E into Em, which string changes?", ["String 3", "String 2", "String 5"], 0, "Fret 1 of string 3 is G♯, the major third; open, it is G."),
        choice("To turn A into Am, string 2 moves from fret 2 to…", ["Fret 1", "Fret 3", "Open"], 0, "C♯ drops to C."),
        choice("Which note of the chord moves when a major shape becomes minor?", ["The third", "The root", "The fifth"], 0, "Major to minor always lowers the third."),
        find("In the Am chord, tap the third. It is on string 2.", "C4", "Fret 1 of string 2 is C, the minor third above A.", { strings: [2], ...G }),
        ear("E major or E minor?", together("E2 B2 E3 G3 B3 E4"), ["E minor", "E major"], 0, "String 3 is open: G, the minor third."),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "barre-chords",
    title: "Barre chords: the E shape and the A shape",
    order: 3,
    concepts: ["barre-chords"],
    needs: ["open-minor-chords", "notes-on-strings-6-and-5"],
    steps: [
      { kind: "understand", blocks: [text(`In a **barre chord** one finger lies flat across the strings and does the job of the nut. That frees an open chord shape to move up the neck.

**The E shape** has its root on string 6. Move the E chord up one fret behind a barre and it is F. At fret 3 it is G, at fret 5 it is A: the chord is named by the note under the barre on string 6.

**The A shape** has its root on string 5. With the barre at fret 2 it is B; at fret 3 it is C.

Both shapes have a minor version, made the same way as in open position.

This is why you learned the notes on strings 6 and 5 first: they name every barre chord.`)] },
      { kind: "listen", blocks: [audio("The E shape moving up: F, G, A", chords("F2 C3 F3 A3 C4 F4", "G2 D3 G3 B3 D4 G4", "A2 E3 A3 C#4 E4 A4"))] },
      { kind: "learn", blocks: [
        diagram("133211", "F", "major", "F: the E shape behind a barre at fret 1."),
        diagram("133111", "F", "minor", "Fm: the Em shape behind the same barre."),
        diagram("x24442", "B", "major", "B: the A shape behind a barre at fret 2. Root on string 5."),
        diagram("x24432", "B", "minor", "Bm: the Am shape behind the same barre."),
      ] },
      { kind: "practice", blocks: [
        choice("An E-shape barre chord at fret 3 is…", ["G", "F", "A"], 0, "Fret 3 of string 6 is G."),
        choice("And at fret 5?", ["A", "G", "B"], 0, "Fret 5 of string 6 is A."),
        choice("An A-shape barre chord with its root at fret 2 of string 5 is…", ["B", "C", "A"], 0, "Fret 2 of string 5 is B."),
        choice("And an A-shape barre chord at fret 3?", ["C", "D", "B"], 0, "Fret 3 of string 5 is C."),
        find("Where is the root of an E-shape B♭ barre chord? Tap it on string 6.", "Bb", "Fret 6 of string 6 is B♭.", { strings: [6], ...G }),
        choice("The Em shape behind a barre at fret 1 gives…", ["Fm", "F", "Em"], 0, "The shape decides major or minor; the barre decides the root."),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "clean-chord-changes",
    title: "Clean changes and quiet strings",
    order: 4,
    concepts: ["chord-changes"],
    needs: ["barre-chords", "down-up-strumming"],
    steps: [
      { kind: "understand", blocks: [text(`A chord change sounds clean when the rhythm does not stop for it. Three ideas help.

**Look for what stays.** Many pairs of chords share fretted notes. C and Am have two notes in the same place: string 4 at fret 2 and string 2 at fret 1. Only one finger has to travel.

**Change early.** Start moving on the last eighth note of the bar, while the strumming hand keeps swinging. The open strings that ring for that instant are hardly heard; a late arrival on beat 1 always is.

**Keep the unwanted strings quiet.** A string marked × should not sound. Either the strumming hand avoids it, or a fretting finger rests lightly against it so that it cannot ring.`)] },
      { kind: "listen", blocks: [audio("C to Am and back, without a gap", prog("C", "I vi I vi", 72))] },
      { kind: "learn", blocks: [
        diagram("x32010", "C", "major", "C. Notice string 4 at fret 2 and string 2 at fret 1."),
        diagram("x02210", "A", "minor", "Am. Those two notes have not moved."),
      ] },
      { kind: "practice", blocks: [
        choice("Between C and Am, how many fretted notes stay exactly where they are?", ["Two", "None", "Three"], 0, "String 4 at fret 2 and string 2 at fret 1."),
        choice("What does changing early mean?", ["Start moving during the last eighth note of the bar", "Stop strumming before the change", "Play the new chord one bar ahead"], 0, "The hand keeps time while the fingers travel."),
        choice("What should a string marked × do?", ["Stay silent", "Ring open", "Be played loudest"], 0, "Avoid it or mute it."),
        choice("Which matters more for a clean change?", ["Arriving on time, even if imperfectly", "A perfect chord that arrives late", "Strumming harder"], 0, "The rhythm must not stop."),
        along("Change between C and Am, two beats each, along with the track.", prog("C", "I vi I vi"), 60),
      ] },
    ],
  },
  {
    ...piano,
    slug: "block-and-broken-chords",
    title: "Block chords, broken chords and arpeggios",
    order: 5,
    concepts: ["block-and-broken-chords"],
    needs: ["major-and-minor-triads", "finger-numbers"],
    steps: [
      { kind: "understand", blocks: [text(`There are three basic ways to play a chord on the piano.

- A **block chord** sounds all its notes at once.
- A **broken chord** plays the same notes one after another.
- An **arpeggio** is a broken chord that keeps going, up or down through more than one octave.

They are the same harmony with different amounts of motion. Block chords are firm; broken chords and arpeggios flow.`)] },
      { kind: "listen", blocks: [
        audio("C major as a block chord", together("C4 E4 G4")),
        audio("C major as a broken chord", seq("C4 E4 G4 E4", 100)),
        audio("C major as an arpeggio over two octaves", seq("C3 E3 G3 C4 E4 G4 C5", 140)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", "C4+E4+G4/h C4+E4+G4/h | C4/8 E4/8 G4/8 E4/8 C4/8 E4/8 G4/8 E4/8", "Bar 1: block chords. Bar 2: the same chord broken into eighth notes.", { time: true }),
      ] },
      { kind: "practice", blocks: [
        ear("Block chord or broken chord?", together("F3 A3 C4"), ["Block: all at once", "Broken: one note at a time"], 0, "All three notes start together."),
        ear("And this?", seq("F3 A3 C4 A3", 100), ["Block: all at once", "Broken: one note at a time"], 1, "F, A, C, A in turn."),
        choice("What is an arpeggio?", ["A broken chord that runs on through more than one octave", "Two chords at once", "A chord with a note left out"], 0, "The chord's notes, climbing or falling."),
        choice("A broken C major chord uses which notes?", ["C, E and G", "C, D and E", "C, F and G"], 0, "The same three notes as the block chord."),
        along("Play C major as a broken chord, C E G E, along with the track.", rhythm("C4/8 E4/8 G4/8 E4/8 C4/8 E4/8 G4/8 E4/8", 70), 70),
      ] },
    ],
  },
  {
    ...piano,
    slug: "left-hand-patterns",
    title: "Left-hand patterns",
    order: 6,
    concepts: ["left-hand-patterns"],
    needs: ["block-and-broken-chords", "hands-together"],
    steps: [
      { kind: "understand", blocks: [text(`While the right hand plays a melody or chords, the left hand keeps the harmony moving. Three patterns do most of the work.

- **Root and fifth:** the two outer notes of the chord, alternating. For C: C, G, C, G.
- **Root, fifth, octave:** the same, reaching up to the root an octave higher. For C: C, G, C.
- **Alberti bass:** a broken chord in the order lowest, highest, middle, highest. For C: C, G, E, G.

Each one outlines the chord without playing all of it at once, which keeps the low register clear.`)] },
      { kind: "listen", blocks: [
        audio("Root and fifth: C, G, C, G", rhythm("C3/q G3/q C3/q G3/q")),
        audio("Alberti bass: C, G, E, G", rhythm("C3/8 G3/8 E3/8 G3/8 C3/8 G3/8 E3/8 G3/8")),
      ] },
      { kind: "learn", blocks: [
        staff("bass", "C3/q G3/q C3/q G3/q", "Root and fifth, in quarter notes.", { time: true }),
        staff("bass", "C3/8 G3/8 E3/8 G3/8 C3/8 G3/8 E3/8 G3/8", "Alberti bass: lowest, highest, middle, highest.", { time: true }),
      ] },
      { kind: "practice", blocks: [
        choice("In what order does an Alberti bass play the notes of a chord?", ["Lowest, highest, middle, highest", "Lowest, middle, highest, middle", "Highest, middle, lowest, middle"], 0, "For C major: C, G, E, G."),
        choice("What is the Alberti pattern for F major (F A C)?", ["F, C, A, C", "F, A, C, A", "C, A, F, A"], 0, "Lowest F, highest C, middle A, highest C."),
        choice("The root-and-fifth pattern for G major plays…", ["G and D", "G and B", "G and C"], 0, "The fifth above G is D."),
        ear("Which pattern is this?", rhythm("C3/8 G3/8 E3/8 G3/8 C3/8 G3/8 E3/8 G3/8"), ["Alberti bass", "Root and fifth"], 0, "Three different notes, with the top one repeating."),
        ear("And this?", rhythm("C3/q G3/q C3/q G3/q"), ["Alberti bass", "Root and fifth"], 1, "Only two notes, alternating."),
        along("Play an Alberti bass on C major, left hand, along with the track.", rhythm("C3/8 G3/8 E3/8 G3/8 C3/8 G3/8 E3/8 G3/8", 60), 60),
      ] },
    ],
  },
];
