import type { LessonInput } from "@/core/schemas/content";
import { along, audio, choice, ear, rhythm, staff, strum, text } from "../helpers";

const base = { moduleSlug: "rhythm-2", isFree: false, version: 1, minutes: 6, strand: "rhythm" } as const;
const SIXTEENTHS = "B4/16 B4/16 B4/16 B4/16";
const SIX_EIGHTHS = "B4/8 B4/8 B4/8 B4/8 B4/8 B4/8";
const G_CHORD = "G2 B2 D3 G3 B3 G4";
const G = G_CHORD.split(" ").join("+");
/** A strumming pattern as a rhythm, for ear drills: eight slots, "-" is a miss. */
const strummed = (pattern: string) => rhythm(pattern.split(" ").map((slot) => (slot === "-" ? "r/8" : `${G}/8`)).join(" "), 80);

export const rhythm2: LessonInput[] = [
  {
    ...base,
    slug: "dotted-notes-and-ties",
    title: "Dotted notes and ties",
    order: 1,
    concepts: ["dots-and-ties"],
    needs: ["counting-out-loud"],
    steps: [
      { kind: "understand", blocks: [text(`A **dot** after a note adds half of its length again.

- A dotted half note lasts 2 + 1 = **3 beats**.
- A dotted quarter note lasts 1 + ½ = **1½ beats**. It is usually followed by an eighth note that completes the second beat.

A **tie** is a curved line joining two notes of the same pitch. You play the first and hold it for the length of both. A tie is how a note lasts across a bar line.`)] },
      { kind: "listen", blocks: [
        audio("A dotted half note, then a quarter note: 3 + 1", rhythm("B4/h. B4/q")),
        audio("Dotted quarter, eighth, half: 1½ + ½ + 2", rhythm("B4/q. B4/8 B4/h")),
        audio("A note tied across the bar line: it lasts four beats", rhythm("B4/h B4/h~ | B4/h B4/h")),
      ] },
      { kind: "learn", blocks: [
        staff("treble", "B4/h. B4/q | B4/q. B4/8 B4/h", "A dotted half and a quarter; then a dotted quarter, an eighth and a half.", { time: true }),
        staff("treble", "B4/h B4/h~ | B4/h B4/h", "The curved line is a tie: the second note of bar 1 is held through the first half of bar 2.", { time: true }),
      ] },
      { kind: "practice", blocks: [
        choice("How long is a dotted half note?", ["3 beats", "2½ beats", "4 beats"], 0, "Two beats plus half of two."),
        choice("How long is a dotted quarter note?", ["1½ beats", "1¼ beats", "2 beats"], 0, "One beat plus half of one."),
        choice("What does a tie do?", ["Joins two notes of the same pitch into one longer note", "Makes a note shorter", "Repeats the bar"], 0, "You play once and hold for both lengths."),
        ear("Over the click, how long is the first note?", rhythm("B4/h. B4/q"), ["Three beats", "Two beats", "One beat"], 0, "It lasts for three clicks; the second note arrives on beat 4."),
        ear("Which count matches what you hear?", rhythm("B4/q. B4/8 B4/q B4/q"), ["1, the and of 2, 3, 4", "1, 2, 3-and, 4", "1-and, 2, 3, 4"], 0, "The long first note covers beat 2; the next note comes on its and."),
        along("Clap or play along, holding each note for its full length.", rhythm("B4/h. B4/q | B4/q. B4/8 B4/h", 70), 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "sixteenth-notes",
    title: "Sixteenth notes",
    order: 2,
    concepts: ["sixteenth-notes"],
    needs: ["dotted-notes-and-ties"],
    steps: [
      { kind: "understand", blocks: [text(`A **sixteenth note** is half as long as an eighth note, so four of them fit in one beat.

They are written with two flags, or two beams when they are joined together.

To count them, each beat is split in four: **1 e and a, 2 e and a**. The number is on the beat, the "and" is halfway, and "e" and "a" fill the gaps.`)] },
      { kind: "listen", blocks: [
        audio("Sixteenth notes: 1 e and a, 2 e and a", rhythm(`${SIXTEENTHS} ${SIXTEENTHS} ${SIXTEENTHS} ${SIXTEENTHS}`, 60)),
        audio("One beat each of quarter, eighths, sixteenths, quarter", rhythm(`B4/q B4/8 B4/8 ${SIXTEENTHS} B4/q`, 60)),
      ] },
      { kind: "learn", blocks: [staff("treble", `B4/q B4/8 B4/8 ${SIXTEENTHS} B4/q`, "One beat of each: a quarter note, two eighths, four sixteenths, then a quarter.", { time: true, bpm: 60 })] },
      { kind: "practice", blocks: [
        choice("How many sixteenth notes fit in one beat?", ["4", "2", "8"], 0, "Two per eighth note, and two eighth notes per beat."),
        choice("How are sixteenth notes counted?", ["1 e and a", "1 and 2 and", "1 2 3 4"], 0, "Each beat is split in four."),
        choice("How many sixteenth notes last as long as one eighth note?", ["2", "4", "3"], 0, "A sixteenth is half an eighth."),
        ear("Which beats have the fast notes?", rhythm(`${SIXTEENTHS} B4/q ${SIXTEENTHS} B4/q`, 60), ["Beats 1 and 3", "Beats 2 and 4", "Every beat"], 0, "Four quick notes on 1, one long note on 2, and the same again."),
        ear("How many notes are played on beat 3?", rhythm(`B4/q B4/8 B4/8 ${SIXTEENTHS} B4/q`, 60), ["4", "2", "1"], 0, "Beat 1 has one note, beat 2 has two, beat 3 has four."),
        along("Count 1 e and a out loud and clap or play along.", rhythm(`B4/q ${SIXTEENTHS} B4/q ${SIXTEENTHS}`, 60), 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "three-four-and-six-eight",
    title: "3/4 and 6/8 time",
    order: 3,
    concepts: ["three-four-and-six-eight"],
    needs: ["sixteenth-notes"],
    steps: [
      { kind: "understand", blocks: [text(`Not all music counts in four.

**3/4** has three quarter-note beats in a bar: 1 2 3, 1 2 3. It is the feel of a waltz.

**6/8** has six eighth notes in a bar, grouped in two threes: **1** 2 3 **4** 5 6. You feel two big beats, and each big beat is a dotted quarter note.

A bar of 3/4 and a bar of 6/8 both hold six eighth notes. The difference is the grouping: three groups of two, or two groups of three.`)] },
      { kind: "listen", blocks: [
        audio("3/4: three beats in a bar", rhythm("B4/q B4/q B4/q | B4/q B4/q B4/q", 100, 3)),
        audio("6/8: six eighth notes in two groups of three", rhythm(`${SIX_EIGHTHS} | ${SIX_EIGHTHS}`, 80, 3, 0.5)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", "B4/q B4/q B4/q | B4/h.", "3/4: three quarter notes fill a bar, and so does one dotted half note.", { time: "3/4", bpm: 100 }),
        staff("treble", `${SIX_EIGHTHS} | B4/q. B4/q.`, "6/8: the eighth notes are beamed in threes; two dotted quarters fill a bar.", { time: "6/8" }),
      ] },
      { kind: "practice", blocks: [
        ear("Listen for the higher click. How many beats are in each bar?", rhythm("B4/h. | B4/h. | B4/h.", 110, 3), ["3", "4"], 0, "The higher click comes every three beats: 3/4."),
        choice("In 6/8, how are the six eighth notes grouped?", ["Two groups of three", "Three groups of two", "One group of six"], 0, "1 2 3, 4 5 6: two big beats."),
        choice("How many quarter-note beats are in a bar of 3/4?", ["3", "4", "6"], 0, "The top number counts the beats."),
        ear("Is this 3/4 or 6/8? Listen to how the quick notes group.", rhythm(`${SIX_EIGHTHS} | ${SIX_EIGHTHS}`, 80, 3, 0.5), ["6/8: groups of three", "3/4: groups of two"], 0, "The higher click comes every three eighth notes."),
        ear("And this?", rhythm(`${SIX_EIGHTHS} | ${SIX_EIGHTHS}`, 100, 3), ["6/8: groups of three", "3/4: groups of two"], 1, "The click is on every second eighth note, three clicks to a bar."),
        choice("One big beat in 6/8 lasts as long as…", ["A dotted quarter note", "A quarter note", "A half note"], 0, "Three eighth notes make a dotted quarter."),
      ] },
    ],
  },
  {
    ...base,
    slug: "down-up-strumming",
    title: "Down-up strumming",
    order: 4,
    strand: "guitar",
    concepts: ["strumming-patterns"],
    needs: ["counting-out-loud"],
    steps: [
      { kind: "understand", blocks: [text(`Strum **down** on the beats and **up** on the "ands".

Your hand swings down and up in steady eighth notes whether or not it touches the strings. This is the **constant-motion rule**: the hand keeps time like a pendulum, and a rhythm is made by choosing which swings hit the strings and which miss.

So a down strum always lands on a number, and an up strum always lands on an "and".

In the patterns below, bold arrows hit the strings and faint arrows are swings that miss.`)] },
      { kind: "listen", blocks: [audio("Down strums on every beat: 1, 2, 3, 4", rhythm(`${G}/q ${G}/q ${G}/q ${G}/q`, 80))] },
      { kind: "learn", blocks: [
        strum("D - D - D - D -", G_CHORD, "Downstrokes on the beat. The hand still comes up between them, missing the strings."),
        strum("D - D U D - D U", G_CHORD, "Down, down-up, down, down-up."),
        strum("D - D U - U D U", G_CHORD, "Down, down-up, up-down-up. On beat 3 the hand goes down without touching the strings."),
      ] },
      { kind: "practice", blocks: [
        choice("In steady down-up strumming, where do the up strums fall?", ["On the ands", "On the beats", "Anywhere"], 0, "Down on the numbers, up on the ands."),
        choice("What does the constant-motion rule say?", ["The hand keeps swinging; some swings miss the strings", "The hand stops between strums", "Every swing must hit the strings"], 0, "The swing keeps the time; hits and misses make the rhythm."),
        ear("Which pattern is this?", strummed("D - D U D - D U"), ["Down, down-up, down, down-up", "Down on every beat", "Down-up all the way through"], 0, "Beats 1 and 3 have one strum; beats 2 and 4 have two."),
        ear("And this one?", strummed("D U D U D U D U"), ["Down, down-up, down, down-up", "Down on every beat", "Down-up all the way through"], 2, "Every swing hits: eight strums in the bar."),
        choice("In the pattern down, down-up, up-down-up, which beat has no down strum?", ["Beat 3", "Beat 2", "Beat 4"], 0, "The hand passes the strings on 3 and catches them on the way back up."),
        strum("D - D U - U D U", G_CHORD, "Strum along with the loop. Start by muting the strings with your fretting hand if the chord gets in the way.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "hands-together",
    title: "Hands together",
    order: 5,
    strand: "piano",
    concepts: ["hands-together"],
    needs: ["counting-out-loud", "which-hand-reads-which-clef"],
    steps: [
      { kind: "understand", blocks: [text(`Each hand has its own line, and both follow the same beat. The trick is to line each hand up against the count, not against the other hand.

Begin with the left hand keeping the beat in quarter notes while the right hand holds half notes: two left-hand notes for each right-hand note.

Then give the right hand eighth notes: now it plays two notes for each one in the left.

Count out loud and go slowly. The count is what holds the hands together.`)] },
      { kind: "listen", blocks: [
        audio("Left hand alone: steady quarter notes", rhythm("C3/q C3/q C3/q C3/q")),
        audio("Right hand alone: two half notes", rhythm("E4/h G4/h")),
      ] },
      { kind: "learn", blocks: [{
        type: "notation",
        staves: [{ clef: "treble", notes: "E4/h G4/h | E4/8 F4/8 G4/8 F4/8 E4/h" }, { clef: "bass", notes: "C3/q C3/q C3/q C3/q | C3/q C3/q C3/h" }],
        time: "4/4",
        bpm: 70,
        caption: "Bar 1: half notes over quarter notes. Bar 2: eighth notes over quarter notes, then both hands hold.",
      }] },
      { kind: "practice", blocks: [
        choice("The left hand plays quarter notes and the right hand half notes. How many left-hand notes go with each right-hand note?", ["Two", "One", "Four"], 0, "A half note lasts as long as two quarter notes."),
        choice("Right-hand eighth notes over left-hand quarter notes: how many right-hand notes for each left-hand note?", ["Two", "Four", "One"], 0, "Two eighth notes fill one beat."),
        choice("What keeps the two hands together?", ["Both follow the same count", "The right hand follows the left", "Playing as fast as possible"], 0, "Line each hand up with the count."),
        ear("Is this the left-hand part or the right-hand part from the example?", rhythm("C3/q C3/q C3/q C3/q"), ["The left hand: low, steady quarter notes", "The right hand: higher, longer notes"], 0, "Low C on every beat."),
      ] },
    ],
  },
];
