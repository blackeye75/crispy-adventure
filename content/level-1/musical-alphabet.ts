import type { LessonInput } from "@/core/schemas/content";
import { audio, pitches, seq, show, text } from "../helpers";

const base = { moduleSlug: "musical-alphabet", isFree: true, version: 1, minutes: 5 } as const;
const NATURALS = "A2 B2 C3 D3 E3 F3 G3 A3";
const CHROMATIC = "A2 A#2 B2 C3 C#3 D3 D#3 E3 F3 F#3 G3 G#3 A3";
const interval = (root: string, id: "2m" | "2M") => ({ root, show: { kind: "interval" as const, interval: id } });

export const musicalAlphabet: LessonInput[] = [
  {
    ...base,
    slug: "natural-notes",
    title: "The seven natural notes",
    order: 1,
    concepts: ["natural-notes"],
    needs: ["the-octave"],
    steps: [
      { kind: "understand", blocks: [text(`Music names its notes with just seven letters: **A B C D E F G**.

After G the letters start again at A. That next A is one octave above the first.

These seven are the **natural notes**. On a piano they are the white keys. On a guitar they look like any other fret, so you learn where they sit.`)] },
      { kind: "listen", blocks: [audio("The natural notes, from A up to the next A", seq(NATURALS, 80))] },
      { kind: "learn", blocks: [show(pitches(NATURALS, { strings: [5] }), "A to A. Guitar: all on string 5. Piano: white keys only.")] },
      { kind: "practice", blocks: [
        { type: "quiz-choice", prompt: "Which letter comes after G?", options: ["A", "H", "C"], answer: 0, why: "The musical alphabet stops at G and starts again at A." },
        { type: "quiz-choice", prompt: "How many natural notes are there?", options: ["5", "7", "12"], answer: 1, why: "A B C D E F G: seven letters." },
        { type: "quiz-find", prompt: "Tap a D. On guitar, use string 5.", answer: "D", strings: [5], why: "D comes after C and before E." },
        { type: "play-along", prompt: "Play the natural notes from A up to A along with the track. Say each letter as you play it.", sound: seq(NATURALS), bpm: 60, canvas: pitches(NATURALS, { strings: [5] }) },
      ] },
    ],
  },
  {
    ...base,
    slug: "sharps-and-flats",
    title: "Sharps and flats",
    order: 2,
    concepts: ["sharps-and-flats"],
    needs: ["natural-notes"],
    steps: [
      { kind: "understand", blocks: [text(`Most natural notes have another note squeezed in between them. On a piano these are the black keys.

They take their names from their neighbours:

- A **sharp** (♯) is the note just above. C♯ is one key or one fret higher than C.
- A **flat** (♭) is the note just below. D♭ is one key or one fret lower than D.`)] },
      { kind: "listen", blocks: [audio("C, then C♯, then D", seq("C4 C#4 D4", 60))] },
      { kind: "learn", blocks: [show(pitches("C4 C#4 D4", { strings: [2] }), "C♯ sits between C and D. Guitar: string 2, frets 1, 2 and 3.")] },
      { kind: "practice", blocks: [
        { type: "quiz-choice", prompt: "What does a sharp do to a note?", options: ["Raises it by one key or fret", "Lowers it by one key or fret", "Raises it by an octave"], answer: 0, why: "Sharp means the very next note up." },
        { type: "quiz-choice", prompt: "Which note is one key or fret below B?", options: ["B♭", "B♯", "A♭"], answer: 0, why: "Flat means the very next note down, so one below B is B♭." },
        { type: "quiz-find", prompt: "Tap an F♯. On guitar, use string 5.", answer: "F#", strings: [5], why: "F♯ is one key or fret above F." },
        { type: "quiz-find", prompt: "Tap an E♭. On guitar, use string 5.", answer: "Eb", strings: [5], why: "E♭ is one key or fret below E." },
        { type: "quiz-build", prompt: "Build it: tap a G, a G♯ and an A, anywhere on the instrument.", notes: ["G", "G#", "A"], why: "G♯ is the one note between G and A." },
      ] },
    ],
  },
  {
    ...base,
    slug: "enharmonic-notes",
    title: "One sound, two names",
    order: 3,
    concepts: ["enharmonic"],
    needs: ["sharps-and-flats"],
    steps: [
      { kind: "understand", blocks: [text(`C♯ is one step above C. D♭ is one step below D. Look closely: that is the same key, the same fret, the same sound.

One pitch with two names is called **enharmonic**. Every black key has a sharp name and a flat name:

C♯ = D♭ · D♯ = E♭ · F♯ = G♭ · G♯ = A♭ · A♯ = B♭

Which name gets used depends on the music around it. You will see why when you reach scales and keys.`)] },
      { kind: "listen", blocks: [audio("C♯, then D♭: the same sound twice", seq("C#4 Db4", 50))] },
      { kind: "learn", blocks: [
        show(pitches("C#4 D#4 F#4 G#4 A#4", { strings: [2] }), "The five in-between notes with their sharp names."),
        show(pitches("Db4 Eb4 Gb4 Ab4 Bb4", { strings: [2] }), "The same five notes with their flat names."),
      ] },
      { kind: "practice", blocks: [
        { type: "quiz-choice", prompt: "What is another name for G♯?", options: ["A♭", "G♭", "A♯"], answer: 0, why: "One step above G is also one step below A." },
        { type: "quiz-choice", prompt: "What is another name for B♭?", options: ["A♯", "A♭", "C♯"], answer: 0, why: "One step below B is also one step above A." },
        { type: "quiz-ear", prompt: "You hear F♯, then G♭. Same pitch or different?", sound: seq("F#4 Gb4", 50), options: ["The same pitch", "Different pitches"], answer: 0, why: "F♯ and G♭ are two names for one pitch." },
        { type: "quiz-find", prompt: "Tap a D♭. On guitar, use string 5.", answer: "Db", strings: [5], why: "D♭ is the same key or fret as C♯." },
      ] },
    ],
  },
  {
    ...base,
    slug: "chromatic-scale",
    title: "All twelve notes",
    order: 4,
    concepts: ["chromatic-scale"],
    needs: ["enharmonic-notes"],
    steps: [
      { kind: "understand", blocks: [text(`Seven natural notes plus five in-between notes makes **twelve notes** in all. After the twelfth, the pattern starts again an octave higher.

Played in order, one after another, the twelve notes form the **chromatic scale**:

A · A♯ · B · C · C♯ · D · D♯ · E · F · F♯ · G · G♯ · then A again

- **Guitar:** walk up one string fret by fret. Twelve frets later you are back on the note you started with.
- **Piano:** play every key in order, white and black.

Notice there is no sharp between B and C, or between E and F. The next lesson explains why.`)] },
      { kind: "listen", blocks: [audio("The chromatic scale, from A up to the next A", seq(CHROMATIC, 120))] },
      { kind: "learn", blocks: [show(pitches(CHROMATIC, { strings: [5] }), "All twelve notes, then A again. Guitar: string 5, open to fret 12.")] },
      { kind: "practice", blocks: [
        { type: "quiz-choice", prompt: "How many different notes are there before the pattern repeats?", options: ["7", "12", "13"], answer: 1, why: "Seven natural notes plus five sharps or flats." },
        { type: "quiz-choice", prompt: "Going up the chromatic scale, which note comes after G♯?", options: ["A", "G", "B"], answer: 0, why: "After G♯ the alphabet starts again at A." },
        { type: "quiz-find", prompt: "Tap the note one key or fret above D. On guitar, use string 5.", answer: "D#", strings: [5], why: "One step above D is D♯, also called E♭." },
        { type: "play-along", prompt: "Play the chromatic scale from A up to A along with the track: every fret on string 5, or every key.", sound: seq(CHROMATIC), bpm: 60, canvas: pitches(CHROMATIC, { strings: [5] }) },
      ] },
    ],
  },
  {
    ...base,
    slug: "half-and-whole-steps",
    title: "Half steps and whole steps",
    order: 5,
    concepts: ["half-and-whole-steps"],
    needs: ["chromatic-scale"],
    steps: [
      { kind: "understand", blocks: [text(`The distance from one note to the very next one is a **half step**: one fret on a guitar, or the next key on a piano, black or white.

Two half steps make a **whole step**: two frets, or two keys along.

Most natural notes are a whole step apart, with a sharp or flat between them. Two pairs are different: **B to C** and **E to F** are only a half step apart. There is no room for a note between them, which is why a piano has no black key there.`)] },
      { kind: "listen", blocks: [
        audio("A half step: E to F", seq("E4 F4", 50)),
        audio("A whole step: C to D", seq("C4 D4", 50)),
      ] },
      { kind: "learn", blocks: [
        show(interval("E", "2m"), "E and F, a half step apart: neighbouring frets, neighbouring keys."),
        show(interval("C", "2M"), "C and D, a whole step apart: one fret or key is skipped."),
      ] },
      { kind: "practice", blocks: [
        { type: "quiz-ear", prompt: "You hear B, then C. Half step or whole step?", sound: seq("B3 C4", 50), options: ["Half step", "Whole step"], answer: 0, why: "B to C is one of the two natural half steps." },
        { type: "quiz-ear", prompt: "You hear G, then A. Half step or whole step?", sound: seq("G3 A3", 50), options: ["Half step", "Whole step"], answer: 1, why: "G to A skips one note, G♯." },
        { type: "quiz-choice", prompt: "Which pairs of natural notes are only a half step apart?", options: ["B–C and E–F", "A–B and D–E", "C–D and F–G"], answer: 0, why: "B–C and E–F have no sharp or flat between them." },
        { type: "quiz-choice", prompt: "Which note is a whole step above E?", options: ["F♯", "F", "G"], answer: 0, why: "E to F is a half step, so one more half step lands on F♯." },
        { type: "quiz-find", prompt: "Tap the note a half step above B. On guitar, use string 5.", answer: "C", strings: [5], why: "B to C is a natural half step." },
      ] },
    ],
  },
];
