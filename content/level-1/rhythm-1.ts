import type { LessonInput } from "@/core/schemas/content";
import { along, audio, choice, ear, rhythm, staff, text } from "../helpers";

const base = { moduleSlug: "rhythm-1", isFree: true, version: 1, minutes: 5, strand: "rhythm" } as const;
const EIGHTHS = "B4/8 B4/8 B4/8 B4/8 B4/8 B4/8 B4/8 B4/8";
const QUARTERS = "B4/q B4/q B4/q B4/q";

export const rhythm1: LessonInput[] = [
  {
    ...base,
    slug: "pulse-and-tempo",
    title: "Pulse and tempo",
    order: 1,
    concepts: ["pulse-and-tempo"],
    steps: [
      { kind: "understand", blocks: [text(`Tap your foot to a song and you have found its **pulse**: the steady beat underneath the music.

**Tempo** is how fast the pulse goes. It is measured in beats per minute, or **BPM**. At 60 BPM there is one beat every second. At 120 BPM there are two.`)] },
      { kind: "listen", blocks: [
        audio("A slow pulse: 60 beats per minute", rhythm("r/w r/w", 60, 1)),
        audio("A fast pulse: 120 beats per minute", rhythm("r/w r/w r/w r/w", 120, 1)),
      ] },
      { kind: "learn", blocks: [along("Move the tempo and hear the pulse change. Tap along on your knee or on muted strings.", rhythm("r/w r/w", 80, 1), 80)] },
      { kind: "practice", blocks: [
        ear("About how fast is this pulse?", rhythm("r/w r/w", 60, 1), ["60 BPM: one beat a second", "120 BPM: two beats a second"], 0, "One click a second is 60 beats per minute."),
        ear("And this one?", rhythm("r/w r/w r/w r/w", 120, 1), ["60 BPM: one beat a second", "120 BPM: two beats a second"], 1, "Two clicks a second is 120 beats per minute."),
        choice("What does BPM stand for?", ["Beats per minute", "Bars per minute", "Beats per measure"], 0, "Tempo counts how many beats go by in one minute."),
        choice("At 60 BPM, how long does one beat last?", ["One second", "Half a second", "Two seconds"], 0, "Sixty beats share sixty seconds."),
        choice("The tempo goes from 80 to 160 BPM. The beats now come…", ["Twice as fast", "Half as fast", "At the same speed"], 0, "Double the BPM, double the speed."),
      ] },
    ],
  },
  {
    ...base,
    slug: "bars-and-four-four",
    title: "Bars and 4/4 time",
    order: 2,
    concepts: ["bars-and-time-signature"],
    needs: ["pulse-and-tempo"],
    steps: [
      { kind: "understand", blocks: [text(`Beats come in groups, and the first beat of each group feels a little stronger. One group is a **bar**, also called a measure.

Most popular music groups its beats in fours. That is written as the **time signature 4/4**. The top 4 says there are four beats in each bar. The bottom 4 says each beat is a quarter note, which the next lesson explains.

You count it 1 2 3 4, 1 2 3 4, starting again at 1 in every bar.`)] },
      { kind: "listen", blocks: [audio("Two bars of 4/4: the first beat of each bar is the higher click", rhythm("r/w | r/w", 90))] },
      { kind: "learn", blocks: [staff("treble", `${QUARTERS} | ${QUARTERS}`, "Two bars of 4/4, one note on each beat. The upright line between them is a bar line.", { time: true, bpm: 90 })] },
      { kind: "practice", blocks: [
        ear("Listen for the higher click. How many beats are in each bar?", rhythm("r/w | r/w | r/w", 100), ["3", "4", "5"], 1, "The higher click comes every four beats: 4/4."),
        ear("And this time?", rhythm("r/w r/w r/q", 100, 3), ["3", "4"], 0, "The higher click comes every three beats. That is 3/4 time, which comes later in the course."),
        choice("In 4/4, what does the top number tell you?", ["How many beats are in each bar", "How fast the music is", "How many bars are in the song"], 0, "The top number counts the beats in a bar."),
        choice("What is another word for a bar?", ["A measure", "A tempo", "A pulse"], 0, "Bar and measure mean the same thing."),
        choice("How do you count two bars of 4/4?", ["1 2 3 4, 1 2 3 4", "1 2 3 4 5 6 7 8", "1 2, 1 2, 1 2, 1 2"], 0, "The count starts again at 1 in every bar."),
      ] },
    ],
  },
  {
    ...base,
    slug: "note-lengths",
    title: "Whole, half, quarter and eighth notes",
    order: 3,
    concepts: ["note-lengths"],
    needs: ["bars-and-four-four"],
    steps: [
      { kind: "understand", blocks: [text(`How long a note lasts is shown by its shape. In 4/4:

- A **whole note** lasts four beats, a whole bar. It is an open oval.
- A **half note** lasts two beats. It is an open oval with a stem.
- A **quarter note** lasts one beat. It is a filled oval with a stem.
- An **eighth note** lasts half a beat, so two fit in one beat. It is a filled oval with a stem and a flag; neighbouring eighth notes are joined by a beam instead.

Each one is half as long as the one before.`)] },
      { kind: "listen", blocks: [
        audio("One whole note: four beats", rhythm("B4/w")),
        audio("Two half notes: two beats each", rhythm("B4/h B4/h")),
        audio("Four quarter notes: one on every beat", rhythm(QUARTERS)),
        audio("Eight eighth notes: two on every beat", rhythm(EIGHTHS)),
      ] },
      { kind: "learn", blocks: [staff("treble", `B4/w | B4/h B4/h | ${QUARTERS} | ${EIGHTHS}`, "One bar each of whole, half, quarter and eighth notes. Every bar lasts four beats.", { time: true })] },
      { kind: "practice", blocks: [
        ear("Over the click, how long is each note?", rhythm("B4/h B4/h"), ["Two beats: half notes", "One beat: quarter notes", "Four beats: a whole note"], 0, "Each note lasts for two clicks."),
        ear("And these?", rhythm(EIGHTHS), ["Half a beat: eighth notes", "One beat: quarter notes"], 0, "There are two notes for every click."),
        choice("How many quarter notes fill one bar of 4/4?", ["2", "4", "8"], 1, "A quarter note is one beat, and the bar has four."),
        choice("How many eighth notes last as long as one half note?", ["2", "4", "8"], 1, "A half note is two beats, and each beat holds two eighth notes."),
        choice("Which note is an open oval with no stem?", ["A whole note", "A half note", "A quarter note"], 0, "The whole note has no stem; the half note is open with a stem."),
        along("Clap or play along: two half notes, then four quarter notes.", rhythm(`B4/h B4/h | ${QUARTERS}`, 70), 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "rests",
    title: "Rests",
    order: 4,
    concepts: ["rests"],
    needs: ["note-lengths"],
    steps: [
      { kind: "understand", blocks: [text(`Silence is part of the rhythm, and it is counted too. Every note length has a **rest** of the same length.

- A **whole rest** is four beats of silence. It is a small block hanging below a line.
- A **half rest** is two beats. It is a small block sitting on top of a line.
- A **quarter rest** is one beat. It looks like a squiggle.
- An **eighth rest** is half a beat. It is a slanted stroke with a dot at the top.

The beat carries on through a rest. You keep counting; you just do not play.`)] },
      { kind: "listen", blocks: [
        audio("Note, rest, note, rest", rhythm("B4/q r/q B4/q r/q")),
        audio("A note, two beats of silence, a note", rhythm("B4/q r/h B4/q")),
      ] },
      { kind: "learn", blocks: [staff("treble", "r/w | r/h B4/h | B4/q r/q B4/q r/q", "A whole rest; a half rest then a half note; quarter notes with quarter rests between them.", { time: true })] },
      { kind: "practice", blocks: [
        ear("One beat of this bar is silent. Which one?", rhythm("B4/q B4/q r/q B4/q"), ["Beat 3", "Beat 2", "Beat 4"], 0, "Notes on 1, 2 and 4; nothing on 3."),
        ear("And in this bar?", rhythm("r/q B4/q B4/q B4/q"), ["Beat 1", "Beat 2", "Beat 4"], 0, "The bar starts with silence: the first note comes on beat 2."),
        choice("How long is a half rest in 4/4?", ["Two beats", "One beat", "Four beats"], 0, "It lasts as long as a half note."),
        choice("What happens to the count during a rest?", ["It keeps going", "It stops, then restarts", "It starts again at 1"], 0, "The pulse never stops; a rest is counted silence."),
        along("Clap or play on the notes, stay silent on the rests, and keep counting.", rhythm("B4/q r/q B4/q r/q | B4/q B4/q r/h", 70), 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "counting-out-loud",
    title: "Counting out loud",
    order: 5,
    concepts: ["counting-eighths"],
    needs: ["rests"],
    steps: [
      { kind: "understand", blocks: [text(`Counting out loud is how musicians keep their place. Quarter notes are counted **1 2 3 4**.

Eighth notes split each beat in two. The second half of the beat is counted "**and**": 1 and 2 and 3 and 4 and.

The numbers fall on the beat. The "ands" fall exactly halfway between, off the beat.`)] },
      { kind: "listen", blocks: [
        audio("Quarter notes: 1, 2, 3, 4", rhythm(QUARTERS, 70)),
        audio("Eighth notes: 1 and 2 and 3 and 4 and", rhythm(EIGHTHS, 70)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", "B4/q B4/q B4/8 B4/8 B4/q", "Counted: 1, 2, 3-and, 4.", { time: true, bpm: 70 }),
        staff("treble", "B4/8 B4/8 B4/q B4/8 B4/8 B4/q", "Counted: 1-and, 2, 3-and, 4.", { time: true, bpm: 70 }),
      ] },
      { kind: "practice", blocks: [
        ear("Which count matches what you hear?", rhythm("B4/q B4/8 B4/8 B4/q B4/q", 70), ["1, 2-and, 3, 4", "1-and, 2, 3, 4", "1, 2, 3-and, 4"], 0, "The two quick notes share beat 2."),
        ear("And this one?", rhythm("B4/8 B4/8 B4/q B4/q B4/8 B4/8", 70), ["1-and, 2, 3, 4-and", "1, 2-and, 3-and, 4", "1-and, 2-and, 3, 4"], 0, "Quick notes on beat 1 and on beat 4."),
        choice("In \"1 and 2 and\", where do the \"ands\" fall?", ["Halfway between the beats", "On the beats", "At the end of the bar"], 0, "Each \"and\" is the second half of a beat."),
        choice("How many \"ands\" are there in one bar of 4/4?", ["4", "2", "8"], 0, "One after each of the four beats."),
        along("Count out loud and clap or play: 1, 2, 3-and, 4, then 1-and, 2, 3-and, 4.", rhythm("B4/q B4/q B4/8 B4/8 B4/q | B4/8 B4/8 B4/q B4/8 B4/8 B4/q", 70), 70),
      ] },
    ],
  },
];
