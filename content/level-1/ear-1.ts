import type { LessonInput } from "@/core/schemas/content";
import { along, audio, choice, ear, pitches, rhythm, seq, show, text } from "../helpers";

const base = { moduleSlug: "ear-1", isFree: true, version: 1, minutes: 5, strand: "ear" } as const;
const UP_DOWN = ["Higher", "Lower"];
const SAME = ["The same note", "Two different notes"];
/** One long note with a pause after it, no click: something to hum against. */
const drone = (note: string) => rhythm(`${note}/w r/h`, 60, 0);

export const ear1: LessonInput[] = [
  {
    ...base,
    slug: "higher-or-lower",
    title: "Higher or lower?",
    order: 1,
    concepts: ["ear-direction"],
    needs: ["what-is-a-note"],
    steps: [
      { kind: "understand", blocks: [text(`Ear training starts with one question: did the sound go up or down?

Big jumps are easy to hear. The skill is in the small ones, where the second note is only a step away.

If you are unsure, hum the two notes. Your voice can feel the direction even when your ear hesitates.`)] },
      { kind: "listen", blocks: [
        audio("A big jump up", seq("C4 G4", 50)),
        audio("A small step up", seq("C4 D4", 50)),
        audio("A small step down", seq("E4 D4", 50)),
      ] },
      { kind: "learn", blocks: [show(pitches("C4 D4", { strings: [2] }), "A small step up: C to D, close neighbours on the instrument.")] },
      { kind: "practice", blocks: [
        ear("Is the second note higher or lower than the first?", seq("A3 E4", 50), UP_DOWN, 0, "A up to E: a clear jump upwards."),
        ear("Higher or lower?", seq("G4 D4", 50), UP_DOWN, 1, "G down to D."),
        ear("Higher or lower? This step is smaller.", seq("E4 F#4", 50), UP_DOWN, 0, "A whole step up, from E to F♯."),
        ear("Higher or lower? Smaller still.", seq("C4 B3", 50), UP_DOWN, 1, "A half step down, from C to B."),
        ear("Higher or lower?", seq("F4 F#4", 50), UP_DOWN, 0, "A half step up: the smallest move there is."),
      ] },
    ],
  },
  {
    ...base,
    slug: "same-or-different",
    title: "Same or different?",
    order: 2,
    concepts: ["ear-same-different"],
    needs: ["higher-or-lower"],
    steps: [
      { kind: "understand", blocks: [text(`You hear two notes. Are they the same pitch, or has the second one moved?

A half step is the smallest difference your instrument can make. Hearing it takes attention: listen for whether the second note sits in exactly the same place as the first.`)] },
      { kind: "listen", blocks: [
        audio("The same note twice", seq("E4 E4", 50)),
        audio("Two notes a half step apart", seq("E4 F4", 50)),
      ] },
      { kind: "learn", blocks: [show(pitches("E4 F4", { strings: [1] }), "E and F: as close as two different notes can be.")] },
      { kind: "practice", blocks: [
        ear("The same note twice, or two different notes?", seq("G4 G4", 50), SAME, 0, "G, then G again."),
        ear("Same or different?", seq("A3 Bb3", 50), SAME, 1, "The second note is a half step higher: A, then B♭."),
        ear("Same or different?", seq("D4 D4", 50), SAME, 0, "D both times."),
        ear("Same or different?", seq("C4 C#4", 50), SAME, 1, "C, then C♯, a half step up."),
        ear("Same or different?", seq("F4 E4", 50), SAME, 1, "The second note is a half step lower: F, then E."),
      ] },
    ],
  },
  {
    ...base,
    slug: "singing-back-a-note",
    title: "Singing a note back",
    order: 3,
    concepts: ["ear-sing-back"],
    needs: ["same-or-different"],
    steps: [
      { kind: "understand", blocks: [text(`Singing a note back ties your ear to your instrument. You do not need a good voice; a hum is enough.

Hear the note, then hum it. If it is too high or too low for your voice, hum the same note in a lower or higher octave. That still counts.

When your voice matches the note, the two sounds melt into one. When you are slightly off, you hear a wobble. As you slide closer the wobble slows down, and when you arrive it disappears.`)] },
      { kind: "listen", blocks: [
        audio("One long note. Listen, then hum it back", drone("A3")),
        audio("Another one", drone("C4")),
      ] },
      { kind: "learn", blocks: [show(pitches("A3"), "The first note was this A. Tap it as often as you like and hum along.")] },
      { kind: "practice", blocks: [
        choice("You hum along with a note and hear a slow wobble. What does that tell you?", ["You are very close, but not quite on the note", "You are exactly on the note", "You are an octave away"], 0, "The wobble slows as you get closer and vanishes when you match."),
        choice("The note is too high for your voice. What can you do?", ["Hum the same note an octave lower", "Hum any note that feels comfortable", "Skip it"], 0, "An octave lower is still the same note."),
        along("Hum this note while it repeats. Slide your voice until the wobble is gone.", drone("A3"), 60),
        along("Now this one.", drone("D4"), 60),
        along("And a lower one.", drone("G3"), 60),
      ] },
    ],
  },
];
