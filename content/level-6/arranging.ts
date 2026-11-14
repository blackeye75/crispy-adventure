import type { LessonInput } from "@/core/schemas/content";
import { audio, chords, choice, diagram, ear, find, seq, shape, show, staff, text } from "../helpers";

const base = { moduleSlug: "arranging", isFree: false, version: 1, minutes: 7 } as const;
const MELODY = "E4/h D4/h | C4/w";
const PLAIN = chords("C3 E3 G3 E4", "G2 B2 D3 D4", "C3 E3 G3 C4");
const REHARMONISED = chords("F2 A2 C3 E4", "G2 B2 F3 D4", "A2 E3 A3 C4");
const CHORD_MELODY = chords("C3 E3 G3 C4 G4", "G2 B2 D3 G3 B3 F4", "C3 E3 G3 C4 E4");

export const arranging: LessonInput[] = [
  {
    ...base,
    slug: "reharmonising-a-melody",
    title: "Reharmonising a melody",
    order: 1,
    concepts: ["reharmonisation"],
    needs: ["tritone-substitution", "modal-interchange", "ninths-elevenths-and-thirteenths"],
    steps: [
      { kind: "understand", blocks: [text(`To **reharmonise** is to keep a melody and change the chords under it. The tune stays recognisable; its mood changes.

One rule makes it work: **the melody note must fit the new chord.** It should be a chord tone, or an extension that sounds good on that chord, such as a ninth.

So start by asking what a melody note could be. Take E:

- the **third** of C,
- the **fifth** of Am,
- the **root** of Em,
- the **seventh** of Fmaj7,
- the **ninth** of Dm9.

Five chords, five different colours for one note.

The tools are ones you already have:

- **Swap in a relative.** C, Am and Em share notes and can replace each other.
- **Approach a chord with its ii–V**, or with a secondary dominant.
- **Use a tritone substitute** for a dominant.
- **Borrow** from the parallel minor.
- **Change the ending.** Finish on vi instead of I and the tune ends with a question.

Then check every melody note against its new chord, and trust your ear over the rule.`)] },
      { kind: "listen", blocks: [
        audio("The melody alone: E, D, C", seq("E4 D4 C4", 72)),
        audio("With plain chords: C, G, C", PLAIN),
        audio("Reharmonised: Fmaj7, G7, Am", REHARMONISED),
      ] },
      { kind: "learn", blocks: [
        staff("treble", MELODY, "The melody. Three notes, stepping down to C.", { time: true, names: true, bpm: 72 }),
        { type: "notation", staves: [{ clef: "treble", notes: MELODY }, { clef: "bass", notes: "C3+E3+G3/h G2+B2+D3/h | C3+E3+G3/w" }], time: "4/4", bpm: 72, caption: "Plain: C, G, C. The melody notes are the third, the fifth and the root." },
        { type: "notation", staves: [{ clef: "treble", notes: MELODY }, { clef: "bass", notes: "F2+A2+C3/h G2+B2+F3/h | A2+E3+A3/w" }], time: "4/4", bpm: 72, caption: "Reharmonised: Fmaj7, G7, Am. Now the melody notes are the seventh, the fifth and the third." },
      ] },
      { kind: "practice", blocks: [
        choice("What does reharmonising change?", ["The chords under a melody", "The notes of the melody", "The tempo"], 0, "The tune stays; its harmony is replaced."),
        choice("What must be true of a melody note and its new chord?", ["The note fits the chord as a chord tone or good extension", "The note is always the root", "The note is outside the chord"], 0, "Otherwise the melody and harmony fight."),
        choice("Over Fmaj7, the melody note E is which part of the chord?", ["The seventh", "The third", "The root"], 0, "F A C E."),
        choice("Which of these chords does NOT contain the note E?", ["G7", "Am", "Cmaj7"], 0, "G7 is G B D F. Am has E as its fifth, Cmaj7 as its third."),
        choice("The melody ends on C. Which chord gives a surprise ending in place of C major?", ["Am", "G7", "Bm7♭5"], 0, "C is the third of A minor. Ending on vi sounds unfinished in a pleasing way."),
        ear("Plain or reharmonised?", REHARMONISED, ["Plain: C, G, C", "Reharmonised: Fmaj7, G7, Am"], 1, "The melody is the same, and it ends on a minor chord."),
      ] },
    ],
  },
  {
    ...base,
    slug: "chord-melody-on-guitar",
    title: "Chord-melody on guitar",
    order: 2,
    strand: "guitar",
    concepts: ["chord-melody"],
    needs: ["reharmonising-a-melody", "drop-2-voicings", "open-major-chords"],
    steps: [
      { kind: "understand", blocks: [text(`**Chord-melody** means playing a tune and its chords at once, on one guitar. The idea is simple: **the melody is the top note of every chord.**

The layers, from high to low:

- **Melody** on the top strings, mostly strings 1 and 2.
- **Chord notes** in the middle.
- **Bass note** at the bottom, usually the root.

How to build an arrangement:

1. **Put the melody on strings 1 and 2.** If it sits too low, move the whole tune up an octave or change key.
2. **For each chord change, find a shape with the melody note on top.** This is why it pays to know several shapes for each chord.
3. **Do not harmonise every note.** Play a chord where the harmony changes or on a strong beat, and play the melody notes in between on their own.

The example here takes a three-note melody, G, F, E, over the chords C, G7, C. Each shape is an open chord you know, chosen or adjusted so the melody note is its highest note.`)] },
      { kind: "listen", blocks: [
        audio("The melody: G, F, E", seq("G4 F4 E4", 72)),
        audio("As chord-melody: C, G7, C with the melody on top", CHORD_MELODY),
      ] },
      { kind: "learn", blocks: [
        diagram("x32013", "C", "major", "C with G on top. The usual C shape, with string 1 at fret 3."),
        diagram("320001", "G", "7", "G7 with F on top: string 1, fret 1."),
        diagram("x32010", "C", "major", "C with E on top: string 1 open."),
        show(shape("1:3 1:1 1:0"), "The melody alone, all on string 1: G, F, E.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("In chord-melody, where is the melody?", ["On top of each chord", "In the bass", "In the middle of the chord"], 0, "The highest note is the one the ear follows."),
        choice("Which strings usually carry the melody?", ["Strings 1 and 2", "Strings 5 and 6", "Strings 3 and 4"], 0, "The thinnest strings, so the chord can sit below."),
        choice("The melody note is F and the chord is G7. Which part of the chord is on top?", ["The seventh", "The root", "The third"], 0, "G B D F."),
        find("Tap the melody note of the first chord on string 1.", "G4", "String 1, fret 3: the top of the C shape x32013.", { strings: [1], only: "guitar" }),
        choice("Must every melody note have a full chord under it?", ["No: chords go where the harmony changes", "Yes, always", "Only the last note"], 0, "Notes in between are played alone, which also makes it playable."),
        choice("The melody sits too low to put chords under it. What can you do?", ["Move it up an octave or change key", "Leave out the melody", "Tune the guitar down"], 0, "You need room below the melody for the chord and bass."),
      ] },
    ],
  },
  {
    ...base,
    slug: "solo-piano-arranging",
    title: "Solo piano arranging",
    order: 3,
    strand: "piano",
    concepts: ["solo-piano"],
    needs: ["reharmonising-a-melody", "shell-voicings"],
    steps: [
      { kind: "understand", blocks: [text(`A lead sheet gives you a melody and chord symbols. A solo pianist has to turn that into a full sound with two hands. Think in **three layers**:

- **Melody** on top, in the right hand.
- **Bass** at the bottom, in the left hand.
- **Harmony** in the middle, shared by whichever hand is free.

A dependable way to start:

1. **Left hand plays the root**, or a shell: root and seventh, or root and third.
2. **Right hand plays the melody as its highest note.**
3. **Under the melody, the right hand adds one or two chord notes**, most usefully the third or seventh if the left hand is not already playing it.

Keep the low notes spread out. Thirds and seconds played close together low on the piano sound muddy. Roots, fifths and sevenths work down there; close clusters belong around middle C and above.

As with chord-melody on guitar, not every melody note needs a chord. Change the harmony where the chord symbols change and let the tune move freely in between.`)] },
      { kind: "listen", blocks: [
        audio("The melody: G, F, E", seq("G4 F4 E4", 72)),
        audio("Arranged for two hands", chords("C3 E4 G4", "G2 B3 F4", "C3 C4 E4")),
        audio("Close notes low down sound muddy; spread out, the same chord is clear", chords("E2 G2 B2", "E2 B2 G3")),
      ] },
      { kind: "learn", blocks: [
        { type: "notation", staves: [{ clef: "treble", notes: "E4+G4/h B3+F4/h | C4+E4/w" }, { clef: "bass", notes: "C3/h G2/h | C3/w" }], time: "4/4", bpm: 72, caption: "Left hand: roots. Right hand: the melody on top with one chord note under it. Over G the right hand holds B and F, the third and seventh of G7." },
        { type: "instrument", canvas: { root: "C", show: { kind: "notes", pitches: ["G2", "B3", "F4"] } }, caption: "The G7 in the middle: root in the left hand, third and seventh in the right. Three notes, and the chord is complete.", only: "piano" },
      ] },
      { kind: "practice", blocks: [
        choice("What are the three layers of a solo piano arrangement?", ["Melody, harmony, bass", "Melody, rhythm, lyrics", "Left hand, right hand, pedal"], 0, "Melody on top, bass at the bottom, harmony between."),
        choice("Where does the melody go?", ["On top, in the right hand", "In the left hand", "In the middle"], 0, "As on the guitar, the top note is the one listeners follow."),
        choice("The left hand plays the root G. Which two notes complete a G7 in the right hand?", ["B and F", "G and D", "C and E"], 0, "The third and the seventh define the chord."),
        choice("Why avoid close chords low on the piano?", ["They sound muddy", "They are too quiet", "They are out of tune"], 0, "Low notes need space between them."),
        find("Tap the seventh of G7.", "F", "G B D F.", { only: "piano" }),
        choice("What is a shell voicing in the left hand?", ["Root with the third or the seventh", "All four notes in close position", "The melody doubled an octave lower"], 0, "Two notes that outline the chord and leave room above."),
      ] },
    ],
  },
];
