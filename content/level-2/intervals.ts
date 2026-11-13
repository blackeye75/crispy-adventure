import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, ear, find, interval, pitches, seq, show, text, together } from "../helpers";

const base = { moduleSlug: "intervals", isFree: false, version: 1, minutes: 6 } as const;
const G = { only: "guitar" } as const;
const P = { only: "piano" } as const;

export const intervals: LessonInput[] = [
  {
    ...base,
    slug: "what-is-an-interval",
    title: "What an interval is",
    order: 1,
    concepts: ["interval-number-and-quality"],
    needs: ["half-and-whole-steps"],
    steps: [
      { kind: "understand", blocks: [text(`An **interval** is the distance between two notes. Its name has two parts.

The **number** counts letter names, including both ends. C up to E covers C, D and E, so it is a third. C up to G covers five letters, so it is a fifth.

The **quality** says exactly how big it is: major, minor or perfect. C up to E is four half steps, a major third. C up to E♭ is three half steps, a minor third. Both are thirds, because both span three letters.

An interval can be played one note after the other (melodic) or both at once (harmonic).`)] },
      { kind: "listen", blocks: [
        audio("A major third, one note after the other", seq("C4 E4", 50)),
        audio("The same two notes together", together("C4 E4")),
        audio("A minor third: one half step smaller", seq("C4 Eb4", 50)),
      ] },
      { kind: "learn", blocks: [
        show(interval("C", "3M"), "C and E: a major third."),
        show(interval("C", "3m"), "C and E♭: a minor third. The same letters apart, one half step closer."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the number of the interval from C up to G?", ["A fifth", "A fourth", "A sixth"], 0, "Count the letters: C D E F G is five."),
        choice("And from D up to F?", ["A third", "A second", "A fourth"], 0, "D E F is three letters."),
        choice("C–E and C–E♭ are both thirds. What is different about them?", ["Their quality: one is major, one is minor", "Their number", "Nothing"], 0, "Same number of letters, different number of half steps."),
        ear("Are these two notes played together or one after the other?", together("D4 F4"), ["Together: a harmonic interval", "One after the other: a melodic interval"], 0, "Both notes sound at once."),
        choice("What is the interval from A up to the next A?", ["An octave, which means an eighth", "A seventh", "A sixth"], 0, "A B C D E F G A is eight letters."),
      ] },
    ],
  },
  {
    ...base,
    slug: "seconds-and-thirds",
    title: "Seconds and thirds",
    order: 2,
    concepts: ["seconds-and-thirds"],
    needs: ["what-is-an-interval"],
    steps: [
      { kind: "understand", blocks: [text(`The four smallest intervals, counted in half steps:

- **Minor second:** 1 half step, like E to F.
- **Major second:** 2 half steps, like C to D. This is the whole step you already know.
- **Minor third:** 3 half steps, like A to C.
- **Major third:** 4 half steps, like C to E.

Seconds are the steps that melodies walk on. Thirds are what chords are built from.`)] },
      { kind: "listen", blocks: [
        audio("Minor second: E to F", seq("E4 F4", 50)),
        audio("Major second: C to D", seq("C4 D4", 50)),
        audio("Minor third: A to C", seq("A3 C4", 50)),
        audio("Major third: C to E", seq("C4 E4", 50)),
      ] },
      { kind: "learn", blocks: [
        show(interval("A", "3m"), "A and C: a minor third, three half steps."),
        show(interval("C", "3M"), "C and E: a major third, four half steps."),
      ] },
      { kind: "practice", blocks: [
        choice("How many half steps are in a major third?", ["4", "3", "5"], 0, "Minor third 3, major third 4."),
        choice("Which interval is E up to G?", ["A minor third", "A major third", "A major second"], 0, "E F G is three letters, and it is three half steps: minor."),
        find("Tap the note a major third above C.", "E", "Four half steps above C is E."),
        find("Tap the note a minor third above D.", "F", "Three half steps above D is F."),
        ear("Major third or minor third?", seq("D4 F4", 50), ["Minor third", "Major third"], 0, "D to F is three half steps."),
        ear("Major third or minor third?", seq("G3 B3", 50), ["Minor third", "Major third"], 1, "G to B is four half steps."),
      ] },
    ],
  },
  {
    ...base,
    slug: "fourths-fifths-and-the-tritone",
    title: "Fourths, fifths and the tritone",
    order: 3,
    concepts: ["fourths-and-fifths"],
    needs: ["seconds-and-thirds"],
    steps: [
      { kind: "understand", blocks: [text(`Fourths and fifths are not called major or minor. Their usual size is called **perfect**.

- **Perfect fourth:** 5 half steps, like C to F.
- **Perfect fifth:** 7 half steps, like C to G.

Between them, at 6 half steps, sits the **tritone**, like C to F♯. It is written either as an augmented fourth (C–F♯) or as a diminished fifth (C–G♭).

Perfect intervals sound open and settled. The tritone sounds tense, as if it wants to move somewhere.`)] },
      { kind: "listen", blocks: [
        audio("Perfect fourth: C to F", seq("C4 F4", 50)),
        audio("Perfect fifth: C to G", seq("C4 G4", 50)),
        audio("Tritone: C to F♯", seq("C4 F#4", 50)),
      ] },
      { kind: "learn", blocks: [
        show(interval("C", "4P"), "C and F: a perfect fourth, five half steps."),
        show(interval("C", "5P"), "C and G: a perfect fifth, seven half steps."),
        show(interval("C", "4A"), "C and F♯: the tritone, six half steps, exactly between the two."),
      ] },
      { kind: "practice", blocks: [
        choice("How many half steps are in a perfect fifth?", ["7", "5", "6"], 0, "Fourth 5, tritone 6, fifth 7."),
        choice("Which interval is 6 half steps?", ["The tritone", "A perfect fourth", "A perfect fifth"], 0, "It sits between the fourth and the fifth."),
        find("Tap the note a perfect fourth above G.", "C", "Five half steps above G is C."),
        ear("Which interval is this?", seq("D4 A4", 50), ["Perfect fifth", "Perfect fourth", "Tritone"], 0, "D to A is seven half steps."),
        ear("And this?", seq("E4 A4", 50), ["Perfect fifth", "Perfect fourth", "Tritone"], 1, "E to A is five half steps."),
        ear("And this?", seq("F4 B4", 50), ["Perfect fifth", "Perfect fourth", "Tritone"], 2, "F to B is six half steps: the tritone."),
      ] },
    ],
  },
  {
    ...base,
    slug: "sixths-sevenths-and-the-octave",
    title: "Sixths, sevenths and the octave",
    order: 4,
    concepts: ["sixths-and-sevenths"],
    needs: ["fourths-fifths-and-the-tritone"],
    steps: [
      { kind: "understand", blocks: [text(`The larger intervals come in major and minor pairs again, until the octave closes the set.

- **Minor sixth:** 8 half steps, like E to C.
- **Major sixth:** 9 half steps, like C to A.
- **Minor seventh:** 10 half steps, like C to B♭.
- **Major seventh:** 11 half steps, like C to B.
- **Perfect octave:** 12 half steps, like C to the next C.

A handy check: a major seventh is one half step short of the octave, and a minor seventh is a whole step short.`)] },
      { kind: "listen", blocks: [
        audio("Major sixth: C to A", seq("C4 A4", 50)),
        audio("Minor seventh: C to B♭", seq("C4 Bb4", 50)),
        audio("Major seventh: C to B", seq("C4 B4", 50)),
        audio("Octave: C to C", seq("C4 C5", 50)),
      ] },
      { kind: "learn", blocks: [
        show(interval("C", "6M"), "C and A: a major sixth, nine half steps."),
        show(interval("C", "7m"), "C and B♭: a minor seventh, ten half steps."),
        show(interval("C", "7M"), "C and B: a major seventh, one half step below the octave."),
      ] },
      { kind: "practice", blocks: [
        choice("How many half steps are in a minor seventh?", ["10", "11", "9"], 0, "A whole step short of the 12 in an octave."),
        choice("Which interval is C up to A?", ["A major sixth", "A minor sixth", "A minor seventh"], 0, "Six letters, nine half steps."),
        find("Tap the note a major seventh above C.", "B", "One half step below the next C."),
        find("Tap the note a minor sixth above E.", "C", "Eight half steps above E is C."),
        ear("Which interval is this?", seq("C4 B4", 50), ["Major seventh", "Minor seventh", "Octave"], 0, "It stops one half step short of the octave."),
        ear("And this?", seq("D4 B4", 50), ["Major sixth", "Minor sixth", "Minor seventh"], 0, "D to B is nine half steps."),
      ] },
    ],
  },
  {
    ...base,
    slug: "interval-inversion",
    title: "Turning intervals upside down",
    order: 5,
    concepts: ["interval-inversion"],
    needs: ["sixths-sevenths-and-the-octave"],
    steps: [
      { kind: "understand", blocks: [text(`Take two notes and move the lower one up an octave. The same two notes now make a different interval: its **inversion**.

C up to E is a major third. E up to C is a minor sixth.

Three rules cover every case:

- The two numbers add up to 9: a 3rd becomes a 6th, a 2nd becomes a 7th, a 4th becomes a 5th.
- Major becomes minor, and minor becomes major. Perfect stays perfect.
- The half steps add up to 12.`)] },
      { kind: "listen", blocks: [
        audio("C up to E: a major third", seq("C4 E4", 50)),
        audio("E up to C: a minor sixth", seq("E4 C5", 50)),
      ] },
      { kind: "learn", blocks: [
        show(pitches("C4 E4", { strings: [2] }), "C below E: a major third, four half steps."),
        show(pitches("E4 C5", { strings: [1] }), "E below C: a minor sixth, eight half steps. The same two notes, flipped."),
      ] },
      { kind: "practice", blocks: [
        choice("A major third turned upside down becomes…", ["A minor sixth", "A major sixth", "A minor third"], 0, "3 + 6 = 9, and major becomes minor."),
        choice("A perfect fourth turned upside down becomes…", ["A perfect fifth", "A perfect fourth", "A tritone"], 0, "4 + 5 = 9, and perfect stays perfect."),
        choice("A minor second turned upside down becomes…", ["A major seventh", "A minor seventh", "A major second"], 0, "2 + 7 = 9, and minor becomes major."),
        choice("An interval and its inversion: their half steps add up to…", ["12", "9", "7"], 0, "Together they fill exactly one octave."),
        ear("You hear A up to C, a minor third. If the A moves above the C instead, what do you get?", seq("A3 C4", 50), ["A major sixth", "A minor sixth"], 0, "Minor third becomes major sixth: 3 + 9 half steps make 12."),
      ] },
    ],
  },
  {
    ...base,
    slug: "compound-intervals",
    title: "Beyond the octave: 9ths, 11ths and 13ths",
    order: 6,
    concepts: ["compound-intervals"],
    needs: ["interval-inversion"],
    steps: [
      { kind: "understand", blocks: [text(`Intervals wider than an octave are called **compound**. Each is an octave plus an interval you already know. Subtract 7 from the number to find it.

- A **9th** is an octave plus a 2nd.
- An **11th** is an octave plus a 4th.
- A **13th** is an octave plus a 6th.

The quality carries over: a major 9th is an octave plus a major 2nd, 14 half steps.

These numbers come back later in chord names such as C9 and C13.`)] },
      { kind: "listen", blocks: [
        audio("A major ninth: C up to the D beyond the octave", seq("C3 D4", 50)),
        audio("The major second inside it: C up to the nearest D", seq("C3 D3", 50)),
      ] },
      { kind: "learn", blocks: [
        show(pitches("C3 D4", { within: [0, 3] }), "C up to D, more than an octave apart: a major ninth."),
        show(pitches("C3 F4", { within: [0, 3] }), "C up to F, more than an octave apart: an eleventh."),
      ] },
      { kind: "practice", blocks: [
        choice("A 9th is an octave plus…", ["A 2nd", "A 3rd", "A 4th"], 0, "9 − 7 = 2."),
        choice("A 13th is an octave plus…", ["A 6th", "A 5th", "A 7th"], 0, "13 − 7 = 6."),
        choice("Which compound interval has a 4th inside it?", ["An 11th", "A 9th", "A 13th"], 0, "4 + 7 = 11."),
        choice("How many half steps are in a major ninth?", ["14", "13", "12"], 0, "An octave is 12, and a major second adds 2."),
        ear("Is the second note within an octave of the first, or beyond it?", seq("C3 E4", 50), ["Beyond the octave", "Within the octave"], 0, "C3 up to E4 is a tenth: an octave plus a third."),
      ] },
    ],
  },
  {
    ...base,
    slug: "guitar-interval-shapes",
    title: "Interval shapes on the guitar",
    order: 7,
    strand: "guitar",
    concepts: ["guitar-interval-shapes"],
    needs: ["compound-intervals"],
    steps: [
      { kind: "understand", blocks: [text(`Most neighbouring strings are tuned a perfect fourth apart. That gives every interval a shape you can move anywhere on the neck.

Start from a note on the thicker string and look at the next string:

- **Same fret:** a perfect fourth.
- **One fret lower:** a major third.
- **Two frets lower:** a minor third.
- **One fret higher:** a tritone.
- **Two frets higher:** a perfect fifth. This is the power chord shape.

The one exception is between strings 3 and 2, which are only a major third apart. There, every shape moves one fret higher: the same fret is a major third, and one fret higher is a perfect fourth.`)] },
      { kind: "listen", blocks: [
        audio("The same fret on the next string: a perfect fourth", seq("A2 D3", 50)),
        audio("Two frets higher on the next string: a perfect fifth", seq("A2 E3", 50)),
      ] },
      { kind: "learn", blocks: [
        show(pitches("A2 D3", { strings: [6, 5], within: [5, 5] }), "Perfect fourth: the same fret on the next string.", "guitar"),
        show(pitches("A2 E3", { strings: [6, 5], within: [5, 7] }), "Perfect fifth: two frets higher on the next string.", "guitar"),
        show(pitches("A2 C#3", { strings: [6, 5], within: [4, 5] }), "Major third: one fret lower on the next string.", "guitar"),
        show(pitches("G3 B3", { strings: [3, 2], within: [0, 0] }), "Strings 3 and 2: here the same fret is a major third, not a fourth.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("The same fret on the next string (not strings 3 and 2) is which interval?", ["A perfect fourth", "A perfect fifth", "A major third"], 0, "The strings themselves are a perfect fourth apart."),
        choice("The power chord shape, two frets higher on the next string, is a…", ["Perfect fifth", "Perfect fourth", "Tritone"], 0, "A fourth plus two more half steps: seven in all."),
        find("G is at fret 3 of string 6. Tap the note a perfect fifth above it, on string 5.", "D3", "Two frets higher on the next string: fret 5 of string 5.", { strings: [5], ...G }),
        find("C is at fret 3 of string 5. Tap the major third above it, on string 4.", "E3", "One fret lower on the next string: fret 2 of string 4.", { strings: [4], ...G }),
        choice("Between strings 3 and 2, the same fret gives a…", ["Major third", "Perfect fourth", "Minor third"], 0, "Those two strings are tuned a major third apart."),
        find("D is at fret 7 of string 3. Tap the perfect fourth above it, on string 2.", "G4", "Between strings 3 and 2 the fourth is one fret higher: fret 8.", { strings: [2], ...G }),
      ] },
    ],
  },
  {
    ...base,
    slug: "piano-interval-shapes",
    title: "Intervals under the hand",
    order: 8,
    strand: "piano",
    concepts: ["piano-interval-shapes"],
    needs: ["compound-intervals"],
    steps: [
      { kind: "understand", blocks: [text(`On the keyboard, two counts name any interval.

Count the **white-key letters** for the number: C up to E passes C, D, E, so it is a third.

Count the **half steps**, every key black or white, for the quality: C to E is four, so it is major.

In a five-finger position on white keys, neighbouring fingers are a second apart, skipping a finger gives a third, and thumb to little finger is a fifth. Whether a third is major or minor depends on where it sits: C–E is major, D–F is minor.`)] },
      { kind: "listen", blocks: [
        audio("C to E: a major third", seq("C4 E4", 50)),
        audio("D to F: a minor third", seq("D4 F4", 50)),
      ] },
      { kind: "learn", blocks: [
        show(pitches("C4 E4"), "C to E: skip one white key. Four half steps, a major third.", "piano"),
        show(pitches("D4 F4"), "D to F: skip one white key again, but only three half steps: a minor third.", "piano"),
        show(pitches("C4 G4"), "C to G, thumb to little finger: a perfect fifth.", "piano"),
      ] },
      { kind: "practice", blocks: [
        find("Tap the note a major third above F.", "A", "Four half steps above F is A.", P),
        find("Tap the note a minor third above E.", "G", "Three half steps above E is G.", P),
        find("Tap the note a perfect fifth above A.", "E", "Seven half steps above A is E.", P),
        choice("E up to G skips one white key. Count the half steps: which third is it?", ["Minor", "Major"], 0, "E to F is one, F to F♯ two, F♯ to G three: minor."),
        choice("In a five-finger position on white keys, thumb to little finger spans a…", ["Fifth", "Fourth", "Sixth"], 0, "Five fingers, five letters."),
        find("Tap the note a perfect fourth above F.", "Bb", "Five half steps above F is B♭, a black key. F up to B would be a tritone.", P),
      ] },
    ],
  },
];
