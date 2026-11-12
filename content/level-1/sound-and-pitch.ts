import type { LessonInput } from "@/core/schemas/content";
import { audio, everyNote, pitches, seq, show, text, together } from "../helpers";

const base = { moduleSlug: "sound-and-pitch", isFree: true, version: 1, minutes: 5 } as const;

export const soundAndPitch: LessonInput[] = [
  {
    ...base,
    slug: "what-is-a-note",
    title: "What a note is",
    order: 1,
    concepts: ["pitch"],
    steps: [
      { kind: "understand", blocks: [text(`A **note** is a single musical sound. What makes one note different from another is its **pitch**: how high or low it sounds.

Pitch comes from vibration. A string moves back and forth, and the faster it vibrates, the higher the note you hear.

- **Piano:** notes get higher as you move to the right.
- **Guitar:** thinner strings sound higher, and so does pressing a string at a fret closer to the body.`)] },
      { kind: "listen", blocks: [
        audio("A low note, then a high note", seq("E2 E4", 50)),
        audio("Three notes climbing from low to high", seq("C3 C4 C5", 70)),
      ] },
      { kind: "learn", blocks: [
        show(pitches("E2 E4", { strings: [6, 1], within: [0, 0] }), "One low note, one high note. Tap each to hear it. Guitar: the thickest and the thinnest string, played without pressing a fret."),
      ] },
      { kind: "practice", blocks: [
        { type: "quiz-ear", prompt: "Listen to two notes. Is the second one higher or lower than the first?", sound: seq("C3 G4", 50), options: ["Higher", "Lower"], answer: 0, why: "The second note vibrates faster, so it sounds higher." },
        { type: "quiz-ear", prompt: "Two more notes. Is the second one higher or lower?", sound: seq("A4 D3", 50), options: ["Higher", "Lower"], answer: 1, why: "The second note vibrates more slowly, so it sounds lower." },
        { type: "quiz-choice", prompt: "On a piano, which way do the notes get higher?", options: ["To the right", "To the left"], answer: 0, why: "Low notes are on the left, high notes on the right." },
        { type: "quiz-choice", prompt: "On a guitar, you press the same string at a fret closer to the body. What happens to the note?", options: ["It gets higher", "It gets lower", "It stays the same"], answer: 0, why: "A shorter length of string vibrates faster, and faster means higher." },
      ] },
    ],
  },
  {
    ...base,
    slug: "the-octave",
    title: "The octave",
    order: 2,
    concepts: ["octave"],
    needs: ["what-is-a-note"],
    steps: [
      { kind: "understand", blocks: [text(`Keep playing higher and higher notes and something odd happens: you reach a note that sounds like the one you started on, only higher. That distance is called an **octave**.

Two notes an octave apart sound so alike that they share the same name. The higher one vibrates exactly twice as fast. The note called A4 vibrates 440 times a second; the A one octave above it vibrates 880 times a second.

- **Piano:** twelve keys to the right, counting black and white keys, is the same note one octave higher.
- **Guitar:** the 12th fret of any string is the same note as the open string, one octave higher.`)] },
      { kind: "listen", blocks: [
        audio("An A, then the A one octave higher", seq("A3 A4", 50)),
        audio("Both at once: they blend into one sound", together("A3 A4")),
      ] },
      { kind: "learn", blocks: [show(everyNote("A"), "Every A on the instrument. Tap them: the same note at different heights.")] },
      { kind: "practice", blocks: [
        { type: "quiz-ear", prompt: "Are these two notes the same note an octave apart?", sound: seq("C4 C5", 50), options: ["Yes, an octave apart", "No, two different notes"], answer: 0, why: "The second note is C again, one octave up." },
        { type: "quiz-ear", prompt: "And these two?", sound: seq("C4 E4", 50), options: ["Yes, an octave apart", "No, two different notes"], answer: 1, why: "The second note is E, a different note from C." },
        { type: "quiz-choice", prompt: "A4 vibrates 440 times a second. How fast does the A one octave higher vibrate?", options: ["220 times a second", "660 times a second", "880 times a second"], answer: 2, why: "One octave up is exactly twice as fast." },
        { type: "quiz-choice", prompt: "On a guitar, which fret gives the note one octave above the open string?", options: ["Fret 5", "Fret 7", "Fret 12"], answer: 2, why: "The 12th fret is halfway along the string, and half the length vibrates twice as fast." },
      ] },
    ],
  },
  {
    ...base,
    slug: "guitar-layout",
    title: "How the guitar is laid out",
    order: 3,
    strand: "guitar",
    concepts: ["guitar-layout"],
    needs: ["the-octave"],
    steps: [
      { kind: "understand", blocks: [text(`A guitar has six **strings**. Players number them from thinnest to thickest: string 1 is the thinnest and highest, string 6 is the thickest and lowest.

A string played without pressing anything is called **open**. In standard tuning the open strings, from string 6 to string 1, are **E A D G B E**.

The metal strips across the neck are **frets**. Pressing a string down at a fret shortens the part that vibrates, so the note gets higher. Each fret towards the body is a little higher than the one before.

Fretboard diagrams in this app, like guitar tab, show string 6 at the bottom and string 1 at the top.`)] },
      { kind: "listen", blocks: [audio("The six open strings, from string 6 to string 1", seq("E2 A2 D3 G3 B3 E4", 70))] },
      { kind: "learn", blocks: [show(pitches("E2 A2 D3 G3 B3 E4", { within: [0, 0] }), "The open strings: E A D G B E. Tap each one.", "guitar")] },
      { kind: "practice", blocks: [
        { type: "quiz-choice", prompt: "Which one is string 6?", options: ["The thickest, lowest string", "The thinnest, highest string"], answer: 0, why: "Strings are numbered from the thinnest (1) to the thickest (6)." },
        { type: "quiz-choice", prompt: "What are the open strings, from string 6 to string 1?", options: ["E A D G B E", "E B G D A E", "A B C D E G"], answer: 0, why: "From thickest to thinnest: E A D G B E." },
        { type: "quiz-find", prompt: "Tap the open A string.", answer: "A2", strings: [5], only: "guitar", why: "String 5 played open is A." },
        { type: "quiz-find", prompt: "Tap the open D string.", answer: "D3", strings: [4], only: "guitar", why: "String 4 played open is D." },
        { type: "quiz-ear", prompt: "You hear two open strings. Which ones?", sound: seq("E2 E4", 50), options: ["String 6, then string 1", "String 1, then string 6"], answer: 0, why: "The low note came first, and string 6 is the lowest string." },
      ] },
    ],
  },
  {
    ...base,
    slug: "piano-layout",
    title: "How the piano is laid out",
    order: 4,
    strand: "piano",
    concepts: ["piano-layout"],
    needs: ["the-octave"],
    steps: [
      { kind: "understand", blocks: [text(`A piano keyboard is a repeating pattern of white and black keys. Notes get higher as you move to the right.

The black keys come in groups of **two** and **three**, over and over. That pattern is your map.

The white key just to the left of every group of two black keys is **C**. The C nearest the middle of the piano is called **middle C**.

Find one C and you can find them all: every group of two black keys has a C beside it.`)] },
      { kind: "listen", blocks: [audio("Four Cs, from low to high", seq("C3 C4 C5 C6", 70))] },
      { kind: "learn", blocks: [show(everyNote("C"), "Every C on this keyboard. Each one sits just left of a group of two black keys.", "piano")] },
      { kind: "practice", blocks: [
        { type: "quiz-choice", prompt: "How are the black keys grouped?", options: ["In twos and threes", "In twos and fours", "In threes and fours"], answer: 0, why: "Two black keys, then three, repeating along the whole keyboard." },
        { type: "quiz-choice", prompt: "Where is C?", options: ["Just left of a group of two black keys", "Just left of a group of three black keys", "Just right of a group of two black keys"], answer: 0, why: "Every group of two black keys has a C on its left." },
        { type: "quiz-find", prompt: "Tap any C.", answer: "C", only: "piano", why: "C is the white key just left of each group of two black keys." },
        { type: "quiz-find", prompt: "Tap middle C. On this keyboard it carries a small dot.", answer: "C4", only: "piano", why: "Middle C is the C nearest the middle of a full-size piano." },
      ] },
    ],
  },
];
