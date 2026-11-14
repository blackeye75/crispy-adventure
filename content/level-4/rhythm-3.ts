import type { LessonInput } from "@/core/schemas/content";
import { along, audio, choice, ear, rhythm, staff, text } from "../helpers";

const base = { moduleSlug: "rhythm-3", isFree: false, version: 1, minutes: 6, strand: "rhythm" } as const;
const TRIPLETS = "B4/8t B4/8t B4/8t";
const SWUNG = "B4/qt B4/8t";
const STRAIGHT = "B4/8 B4/8";

export const rhythm3: LessonInput[] = [
  {
    ...base,
    slug: "triplets",
    title: "Triplets",
    order: 1,
    concepts: ["triplets"],
    needs: ["sixteenth-notes"],
    steps: [
      { kind: "understand", blocks: [text(`So far every beat has been divided in two or in four. A **triplet** divides it in **three**.

Three eighth-note triplets take the time of two ordinary eighth notes: one beat. They are written as three notes joined by a bracket or beam with a small **3**.

Count them **1-trip-let, 2-trip-let**, with all three syllables evenly spaced.

The feel is rounder than straight eighths. It is the same rolling motion as 6/8, borrowed for a moment inside 4/4.`)] },
      { kind: "listen", blocks: [
        audio("Straight eighth notes: two to a beat", rhythm(`${STRAIGHT} ${STRAIGHT} ${STRAIGHT} ${STRAIGHT}`, 70)),
        audio("Triplets: three to a beat", rhythm(`${TRIPLETS} ${TRIPLETS} ${TRIPLETS} ${TRIPLETS}`, 70)),
      ] },
      { kind: "learn", blocks: [staff("treble", `B4/q ${STRAIGHT} ${TRIPLETS} B4/q`, "One beat of each: a quarter, two eighths, a triplet, a quarter.", { time: true, bpm: 70 })] },
      { kind: "practice", blocks: [
        choice("How many notes of a triplet fit in one beat?", ["Three", "Two", "Four"], 0, "The beat is divided in three."),
        choice("Three eighth-note triplets last as long as…", ["Two ordinary eighth notes", "Three ordinary eighth notes", "One eighth note"], 0, "Three in the time of two."),
        choice("How are triplets counted?", ["1-trip-let, 2-trip-let", "1 e and a", "1 and 2 and"], 0, "Three even syllables to a beat."),
        ear("Two notes to a beat, or three?", rhythm(`${TRIPLETS} ${TRIPLETS} B4/h`, 70), ["Three: triplets", "Two: straight eighths"], 0, "Count the notes between clicks: three."),
        ear("And here?", rhythm(`${STRAIGHT} ${STRAIGHT} B4/h`, 70), ["Three: triplets", "Two: straight eighths"], 1, "Two notes between each pair of clicks."),
        along("Count 1-trip-let out loud and clap or play along.", rhythm(`B4/q ${TRIPLETS} B4/q ${TRIPLETS}`, 60), 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "swing-and-shuffle",
    title: "Swing and shuffle",
    order: 2,
    concepts: ["swing"],
    needs: ["triplets"],
    steps: [
      { kind: "understand", blocks: [text(`Play a triplet and leave out its middle note. What remains is **long-short, long-short**: the first note takes two thirds of the beat and the second takes one third.

That uneven pair is **swing**. In jazz and blues, eighth notes are written as ordinary eighths but played this way. The page looks straight; the feel is triplets.

A **shuffle** is the same long-short pattern played steadily as an accompaniment, bar after bar. It is the rhythm of countless blues songs.

How long the long note is varies with the tempo and the player. That is part of what gives each musician a feel of their own.`)] },
      { kind: "listen", blocks: [
        audio("Straight eighth notes", rhythm(`${STRAIGHT} ${STRAIGHT} ${STRAIGHT} ${STRAIGHT}`, 80)),
        audio("The same notes swung: long-short", rhythm(`${SWUNG} ${SWUNG} ${SWUNG} ${SWUNG}`, 80)),
      ] },
      { kind: "learn", blocks: [staff("treble", `${TRIPLETS} ${SWUNG} ${SWUNG} ${SWUNG}`, "A full triplet, then three swung pairs: the first note of each pair lasts as long as two triplet notes.", { time: true })] },
      { kind: "practice", blocks: [
        choice("In swing, how is each beat divided?", ["Long then short", "Two equal halves", "Short then long"], 0, "Two thirds, then one third."),
        choice("Swing comes from a triplet with which note left out?", ["The middle one", "The first one", "The last one"], 0, "First and last remain: long, short."),
        choice("What is a shuffle?", ["The swung long-short pattern played steadily as accompaniment", "Very fast straight eighths", "A bar of rests"], 0, "The engine of blues rhythm."),
        ear("Straight or swung?", rhythm(`${SWUNG} ${SWUNG} ${SWUNG} ${SWUNG}`, 80), ["Swung", "Straight"], 0, "The notes come in uneven pairs: long, short."),
        ear("And this?", rhythm(`${STRAIGHT} ${STRAIGHT} ${STRAIGHT} ${STRAIGHT}`, 80), ["Swung", "Straight"], 1, "Every note is the same length."),
        along("Clap or play the shuffle along with the track: long-short, long-short.", rhythm(`${SWUNG} ${SWUNG} ${SWUNG} ${SWUNG}`, 70), 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "syncopation",
    title: "Syncopation",
    order: 3,
    concepts: ["syncopation"],
    needs: ["swing-and-shuffle", "dotted-notes-and-ties"],
    steps: [
      { kind: "understand", blocks: [text(`The beats of a bar are not equal. Beats 1 and 3 are strong, 2 and 4 are weaker, and the "ands" between them are weaker still.

**Syncopation** means putting the emphasis where it is not expected: on the weak beats or the "ands", often while leaving a strong beat empty.

The usual way to write it is with a tie or a rest. A note that starts on the "and" of 2 and is tied across beat 3 makes you feel beat 3 without hearing anything new there.

The pulse does not change. Your foot keeps tapping on the beat while the notes land around it, and that pull between the two is what makes a rhythm groove.`)] },
      { kind: "listen", blocks: [
        audio("On the beat: 1, 2, 3, 4", rhythm("B4/q B4/q B4/q B4/q", 80)),
        audio("Syncopated: 1, the and of 2, held through 3, then 4", rhythm("B4/q r/8 B4/8~ B4/q B4/q", 80)),
        audio("All on the ands", rhythm("r/8 B4/8 r/8 B4/8 r/8 B4/8 r/8 B4/8", 80)),
      ] },
      { kind: "learn", blocks: [staff("treble", "B4/q r/8 B4/8~ B4/q B4/q | r/8 B4/8 r/8 B4/8 r/8 B4/8 r/8 B4/8", "Bar 1: a note starts on the and of 2 and is tied over beat 3. Bar 2: every note is on an and.", { time: true })] },
      { kind: "practice", blocks: [
        choice("What is syncopation?", ["Emphasis on weak beats or between the beats", "Playing faster", "Playing only on beat 1"], 0, "The accent falls where it is not expected."),
        choice("Which beats of a 4/4 bar are the strong ones?", ["1 and 3", "2 and 4", "Only 4"], 0, "Syncopation plays against them."),
        choice("During a syncopated rhythm, what happens to the pulse?", ["It stays steady", "It speeds up", "It stops"], 0, "The notes move; the beat does not."),
        ear("On the beat, or syncopated?", rhythm("r/8 B4/8 r/8 B4/8 r/8 B4/8 r/8 B4/8", 80), ["Syncopated: on the ands", "On the beat"], 0, "Every note falls between the clicks."),
        ear("And this?", rhythm("B4/q B4/q B4/q B4/q", 80), ["Syncopated: on the ands", "On the beat"], 1, "Every note lands with a click."),
        along("Keep your foot on the beat and clap or play the notes on the ands.", rhythm("r/8 B4/8 r/8 B4/8 r/8 B4/8 r/8 B4/8", 70), 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "odd-meters",
    title: "Odd meters: 5/4 and 7/8",
    order: 4,
    concepts: ["odd-meters"],
    needs: ["syncopation", "three-four-and-six-eight"],
    steps: [
      { kind: "understand", blocks: [text(`A bar does not have to hold two, three or four beats.

**5/4** has five quarter-note beats. It is almost always felt as two smaller groups: **3 + 2**, counted 1 2 3, 1 2, or the other way round, 2 + 3.

**7/8** has seven eighth notes. It is felt as three groups, commonly **2 + 2 + 3**: 1 2, 1 2, 1 2 3. The last group is one eighth note longer, which gives the bar a limp.

The trick with any odd meter is not to count to five or seven. Count the small groups of twos and threes, and feel where each group starts.`)] },
      { kind: "listen", blocks: [
        audio("5/4: five beats in a bar", rhythm("B4/q B4/q B4/q B4/q B4/q | B4/q B4/q B4/q B4/q B4/q", 110, 5)),
        audio("7/8: seven eighth notes in a bar", rhythm("B4/8 B4/8 B4/8 B4/8 B4/8 B4/8 B4/8 | B4/8 B4/8 B4/8 B4/8 B4/8 B4/8 B4/8", 90, 7, 0.5)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", "B4/h. B4/h | B4/q B4/q B4/q B4/q B4/q", "5/4 as 3 + 2: a dotted half note and a half note fill the bar.", { time: "5/4", bpm: 110 }),
        staff("treble", "B4/8 B4/8 B4/8 B4/8 B4/8 B4/8 B4/8", "7/8 as 2 + 2 + 3: the beams show the groups.", { time: "7/8" }),
      ] },
      { kind: "practice", blocks: [
        choice("How many quarter-note beats are in a bar of 5/4?", ["5", "4", "10"], 0, "The top number counts the beats."),
        choice("How is 5/4 usually felt?", ["As 3 + 2 or 2 + 3", "As one group of five", "As 4 + 1"], 0, "Two smaller groups."),
        choice("A common grouping of 7/8 is…", ["2 + 2 + 3", "4 + 3 + 1", "7 equal beats"], 0, "Two short groups and one long one."),
        ear("Listen for the higher click. How many beats in the bar?", rhythm("B4/q B4/q B4/q B4/q B4/q | B4/q B4/q B4/q B4/q B4/q", 110, 5), ["5", "4", "3"], 0, "The higher click returns every five beats."),
        ear("And this bar?", rhythm("B4/q B4/q B4/q B4/q | B4/q B4/q B4/q B4/q", 110, 4), ["5", "4", "3"], 1, "The higher click returns every four beats: ordinary 4/4."),
        along("Count 1 2 3, 1 2 and clap or play along in 5/4.", rhythm("B4/q B4/q B4/q B4/q B4/q", 90, 5), 90),
      ] },
    ],
  },
];
