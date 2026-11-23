// Playing track P2, Intermediate stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (fingering for runs, octaves and thirds, how to play a crushed
// note) is standard teaching written from memory, not checked against a pianist. All licks, phrases and the
// study solo are original and have not been played by anyone. The app plays everything straight (blues is
// usually swung). These lessons also still need their demo videos.
import type { LessonInput } from "@/core/schemas/content";
import { audio, build, choice, ear, find, hands, handsSound, rhythm, scale, show, text } from "../helpers";

const base = { moduleSlug: "melody-intermediate", track: "piano-melody", stage: "intermediate", strand: "piano", isFree: false, version: 1, minutes: 7 } as const;
const P = { only: "piano" } as const;

// Left-hand shells for a blues in C: root and 7th.
const SHELL = { C7: "C3+Bb3", F7: "F2+Eb3", G7: "G2+F3" };
type Chord = keyof typeof SHELL;
const shells = (names: Chord[]) => names.map((n) => `${SHELL[n]}/w`).join(" | ");

const LICK_1 = "G4/8 Bb4/8 C5/q Bb4/8 G4/8 F4/q";
const LICK_2 = "C5/8 Bb4/8 G4/8 Gb4/8 F4/8 Eb4/8 C4/q";
const CRUSHED = rhythm("Eb4/16 E4/8. G4/q C5/h", 76);
const PLAIN_THIRD = rhythm("E4/q G4/q C5/h", 76);
const TARGETS = "G4/8 A4/8 Bb4/q G4/q E4/q | Eb4/q F4/q A4/h | G4/8 F4/8 E4/q C4/h | r/w";
const RANDOM = "G4/8 A4/8 Bb4/q G4/q A4/q | D4/q E4/q G4/h | G4/8 F4/8 D4/q A4/h | r/w";
const ARPEGGIO_UP = "C4/8 E4/8 G4/8 Bb4/8 C5/8 E5/8 G5/8 Bb5/8";
const RUN_DOWN = "C6/8 Bb5/8 G5/8 Gb5/8 F5/8 Eb5/8 C5/q";
const PHRASE_WITH_FILL = `E4/q G4/q C5/h | ${ARPEGGIO_UP} | ${RUN_DOWN} | C5/w`;
const TUNE = "E5/q F5/q G5/q E5/q | D5/q E5/q C5/h";
const OCTAVES = "E4+E5/q F4+F5/q G4+G5/q E4+E5/q | D4+D5/q E4+E5/q C4+C5/h";
const THIRDS = "C5+E5/q D5+F5/q E5+G5/q C5+E5/q | B4+D5/q C5+E5/q A4+C5/h";
const SIXTHS = "G4+E5/q A4+F5/q B4+G5/q G4+E5/q | F4+D5/q G4+E5/q E4+C5/h";
const TUNE_LEFT = "C3/w | G2/h C3/h";
const MOTIF = "G4/8 Bb4/8 C5/q r/h";
const VARIED = "G4/8 Bb4/8 C5/8 Eb5/8 C5/q r/q";
const BUILD = "C5/8 Eb5/8 F5/8 G5/8 Bb5/8 G5/8 F5/8 Eb5/8";
const RESOLVE = "C5/h. r/q";
const SHAPED = [MOTIF, VARIED, BUILD, RESOLVE].join(" | ");
// The study: twelve bars over C7 C7 C7 C7 | F7 F7 C7 C7 | G7 F7 C7 G7.
const BLUES: Chord[] = ["C7", "C7", "C7", "C7", "F7", "F7", "C7", "C7", "G7", "F7", "C7", "G7"];
const SOLO = [
  "r/8 G4/8 Bb4/8 C5/8 Bb4/q G4/q", "Eb4/8 E4/8 G4/q C4/h", "r/8 G4/8 Bb4/8 C5/8 Eb5/q C5/q", "Bb4/8 G4/8 E4/8 G4/8 Bb4/h",
  "A4/q C5/q Eb5/q C5/q", "D5/8 C5/8 A4/8 F4/8 Eb4/h", "E4/q G4/q C5/h", "r/q Bb4/8 C5/8 D5/8 C5/8 Bb4/q",
  "B4/q D5/q F5/q D5/q", "C5/8 A4/8 F4/8 A4/8 Eb5/h", "E5/8 D5/8 C5/8 G4/8 E4/h", "D4/8 F4/8 G4/8 B4/8 D5/h",
].join(" | ");

export const melodyIntermediate: LessonInput[] = [
  {
    ...base,
    slug: "blues-licks-at-the-piano",
    title: "Blues licks and crushed notes",
    order: 1,
    concepts: ["piano-blues-licks"],
    needs: ["call-and-response-at-the-piano", "the-blues-scale"],
    steps: [
      // OWNER REVIEW: how a crushed note is played.
      { kind: "understand", blocks: [text(`The **C blues scale** is C, E♭, F, G♭, G, B♭: the minor pentatonic plus one extra note, the **G♭**, the "blue note". On the keyboard it sits comfortably under the right hand around middle C.

A **lick** is a short phrase you can carry around and drop into a solo. Two to start:

- **Lick 1:** G, B♭, C, B♭, G, F. It circles the top of the scale and falls back.
- **Lick 2:** C, B♭, G, G♭, F, E♭, C. It runs down the scale, straight through the blue note.

The piano cannot bend a note like a guitar, so blues pianists **fake the bend** with two neighbouring keys.

**The crushed note.** Over a C chord, play **E♭ and E almost at the same time**, letting go of the E♭ at once, so you hear a smear from the minor third up to the major third. It is the piano's version of a guitarist bending the third.

A **grace note** is the gentler cousin: a very quick note just before the main one. Same idea, a touch more separated.

The left hand keeps it simple: **C and B♭**, the root and 7th of C7, held for the bar.`)] },
      { kind: "listen", blocks: [
        audio("Lick 1, then lick 2, over C7", handsSound(`${LICK_1} | ${LICK_2}`, shells(["C7", "C7"]), 84)),
        audio("A plain third", PLAIN_THIRD),
        audio("A crushed third: E♭ smeared into E", CRUSHED),
      ] },
      { kind: "learn", blocks: [
        show(scale("C", "blues"), "The C blues scale. G♭ is the blue note.", "piano"),
        hands({ right: `${LICK_1} | ${LICK_2}`, left: shells(["C7", "C7"]) }, "Two licks over C7 shells in the left hand.", 72),
      ] },
      { kind: "practice", blocks: [
        build("Build the C blues scale.", "C Eb F Gb G Bb", "Minor pentatonic plus the blue note G♭.", "piano"),
        choice("What is a crushed note?", ["Two neighbouring keys struck almost together, the lower let go at once", "A note played very loudly", "A note held with the pedal"], 0, "The piano's way of faking a bend."),
        choice("Over C, which two notes make the classic crush?", ["E♭ and E", "C and D", "G and A"], 0, "Minor third smeared into the major third."),
        find("Tap the blue note in C.", "Gb", "The flattened fifth.", P),
        ear("Plain third, or crushed?", CRUSHED, ["Plain", "Crushed"], 1, "A quick smear into the E."),
        hands({ right: `${LICK_1} | ${LICK_2}`, left: shells(["C7", "C7"]) }, "Play the licks along at 72.", 72),
      ] },
    ],
  },
  {
    ...base,
    slug: "targeting-chord-tones-at-the-piano",
    title: "Targeting chord tones over changes",
    order: 2,
    concepts: ["chord-tone-targeting"],
    needs: ["blues-licks-at-the-piano", "targeting-chord-tones"],
    steps: [
      { kind: "understand", blocks: [text(`A blues scale works over the whole blues. But if you want your lines to **follow the chords**, aim for their notes at the moment each chord arrives.

The chord tones:

| Chord | Notes |
|---|---|
| C7 | C, E, G, B♭ |
| F7 | F, A, C, E♭ |

When C7 changes to F7, look for the smallest move:

- **E** (the 3rd of C7) falls a half step to **E♭** (the 7th of F7).
- **B♭** (the 7th of C7) falls a half step to **A** (the 3rd of F7).

Those are the guide tones from Level 4, and they are the strongest targets. Land on one of them **on beat 1** of the new chord, and the melody sounds as if it knows where the harmony is going.

The phrase in this lesson ends bar 1 on **E**, then starts bar 2 on **E♭**. Same shape of line, but it bends with the chord. Compare it with a line that ignores the change: correct notes, but it wanders.

How to practise:

1. Play only the target notes, one per bar, over the changes.
2. Add a note or two before each target.
3. Fill the bar, always arriving on a target.`)] },
      { kind: "listen", blocks: [
        audio("Aiming at chord tones: E, then E♭ on the F7", handsSound(TARGETS, shells(["C7", "F7", "C7", "C7"]), 84)),
        audio("A line that ignores the change", handsSound(RANDOM, shells(["C7", "F7", "C7", "C7"]), 84)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: TARGETS, left: shells(["C7", "F7", "C7", "C7"]) }, "Bar 2 lands on E♭, the 7th of F7, right on beat 1.", 70),
      ] },
      { kind: "practice", blocks: [
        build("Build F7.", "F A C Eb", "Root, 3rd, 5th, ♭7.", "piano"),
        choice("From C7 to F7, where does E move to?", ["E♭, a half step down", "G, up a third", "It stays"], 0, "3rd of C7 to 7th of F7."),
        choice("Which notes are the best targets?", ["The 3rd and 7th of each chord", "Any note of the scale", "The root only"], 0, "The guide tones."),
        choice("When should you land on a target?", ["On beat 1 as the chord arrives", "At the end of the song", "Never on a strong beat"], 0, "That is what makes the line follow the harmony."),
        ear("Which line follows the chords?", handsSound(TARGETS, shells(["C7", "F7", "C7", "C7"]), 84), ["This one", "Neither"], 0, "It lands on E♭ as the F7 arrives."),
        hands({ right: TARGETS, left: shells(["C7", "F7", "C7", "C7"]) }, "Play along at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "runs-and-arpeggio-fills",
    title: "Runs and arpeggio fills",
    order: 3,
    concepts: ["runs-and-fills"],
    needs: ["targeting-chord-tones-at-the-piano", "arpeggios"],
    steps: [
      // OWNER REVIEW: fingering through two octaves.
      { kind: "understand", blocks: [text(`A held note at the end of a phrase leaves a gap. Pianists fill it with **runs** and **arpeggios**: quick lines that sweep from one phrase into the next.

**The arpeggio fill.** Play the chord's notes one after another, up through two octaves. For C7: **C, E, G, B♭, C, E, G, B♭**, in even eighth notes. It is just the chord, spread out, so it always fits.

**The run.** A scale played fast. Coming down the blues scale from the top: **C, B♭, G, G♭, F, E♭, C**. Runs downward fall naturally under the hand and land solidly.

Up the arpeggio, down the run: that is a complete fill, two bars long, and it arrives back on C.

Keys to making them sound good:

- **Even.** Every note the same length. A lumpy run sounds like a stumble.
- **Shaped.** A little louder as you climb, softer as you fall.
- **Arrive on a chord tone, on a beat.** The note at the end matters more than the notes in the middle.

Fingering: for an arpeggio, the thumb passes under after every three or four notes, just as in a scale. Work out a fingering once, write it down, and use it every time.`)] },
      { kind: "listen", blocks: [
        audio("A phrase, then the arpeggio up and the run down", handsSound(PHRASE_WITH_FILL, shells(["C7", "C7", "C7", "C7"]), 84)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: PHRASE_WITH_FILL, left: shells(["C7", "C7", "C7", "C7"]) }, "Up C7 through two octaves, down the blues scale, land on C.", 66),
      ] },
      { kind: "practice", blocks: [
        build("Tap the notes of C7, the chord this arpeggio uses.", "C E G Bb", "Root, 3rd, 5th, ♭7.", "piano"),
        choice("Why does an arpeggio fill always fit the harmony?", ["It only uses the chord's own notes", "It is played quietly", "It uses every note"], 0, "It is the chord, spread out in time."),
        choice("What matters most in a run?", ["Even notes and a strong landing", "Playing as fast as possible", "Using the pedal"], 0, "Evenness, and the note it arrives on."),
        choice("Where should a fill end?", ["On a chord tone, on a beat", "On any note", "In the middle of a beat"], 0, "The arrival is what the ear remembers."),
        ear("Is this going up the arpeggio, or down the scale?", rhythm(RUN_DOWN, 84), ["Up the arpeggio", "Down the scale"], 1, "Falling, step by step, through the blues scale."),
        hands({ right: PHRASE_WITH_FILL, left: shells(["C7", "C7", "C7", "C7"]) }, "Play along at 66.", 66),
      ] },
    ],
  },
  {
    ...base,
    slug: "octaves-thirds-and-sixths",
    title: "Octaves, thirds and sixths",
    order: 4,
    concepts: ["doubled-melody"],
    needs: ["runs-and-arpeggio-fills", "harmonising-the-major-scale"],
    steps: [
      // OWNER REVIEW: fingers for octaves (1 and 5) and for thirds and sixths.
      { kind: "understand", blocks: [text(`A single melody line can sound thin. Three ways to make it fuller, all in the right hand:

**1. Octaves.** Play every melody note together with the same note an octave below: thumb and little finger. Bold and bright; the sound of a big pop-piano hook.

**2. Thirds.** Add the note a third below each melody note, **using only notes of the key**. Under E it is C, under F it is D, under G it is E. Because you stay in the key, some thirds are major and some are minor, and that mix is exactly what sounds right. Sweet and close.

**3. Sixths.** Add the note a sixth below: under E it is G, under F it is A. Sixths are thirds turned upside down, so they sound related but more open. Very singable.

For the tune E, F, G, E, D, E, C:

| Melody | E | F | G | E | D | E | C |
|---|---|---|---|---|---|---|---|
| Third below | C | D | E | C | B | C | A |
| Sixth below | G | A | B | G | F | G | E |

The rule that keeps it working: **the melody stays on top and stays the loudest.** The added note is support. Let the little finger lead.`)] },
      { kind: "listen", blocks: [
        audio("The tune alone", handsSound(TUNE, TUNE_LEFT, 84)),
        audio("In octaves", handsSound(OCTAVES, TUNE_LEFT, 84)),
        audio("In thirds", handsSound(THIRDS, TUNE_LEFT, 84)),
        audio("In sixths", handsSound(SIXTHS, TUNE_LEFT, 84)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: THIRDS, left: TUNE_LEFT }, "Thirds below the tune, all from the key of C.", 66),
        hands({ right: SIXTHS, left: TUNE_LEFT }, "Sixths below the tune.", 66),
      ] },
      { kind: "practice", blocks: [
        choice("In C major, which note is a third below F?", ["D", "D♯", "E"], 0, "Stay in the key: F, E, D."),
        choice("In C major, which note is a sixth below E?", ["G", "G♯", "A"], 0, "Down six letters from E: G."),
        choice("How are sixths related to thirds?", ["A sixth is a third turned upside down", "They are unrelated", "A sixth is two thirds"], 0, "Interval inversion: 3 and 6 add up to 9."),
        choice("In doubled melodies, which note should be loudest?", ["The melody on top", "The added note", "Both the same"], 0, "The added note supports."),
        ear("Octaves, thirds or sixths?", handsSound(OCTAVES, TUNE_LEFT, 84), ["Octaves", "Thirds", "Sixths"], 0, "Hollow and bright: the same note twice."),
        hands({ right: OCTAVES, left: TUNE_LEFT }, "Now in octaves, along at 66.", 66),
      ] },
    ],
  },
  {
    ...base,
    slug: "shaping-a-solo-at-the-piano",
    title: "Shaping a solo",
    order: 5,
    concepts: ["solo-shape"],
    needs: ["octaves-thirds-and-sixths", "building-a-melody"],
    steps: [
      { kind: "understand", blocks: [text(`A solo that is all fast notes from start to finish is tiring to hear. Good solos have a **shape**, like a story: they start simply, grow, reach a high point, and come home.

Four stages:

1. **Motif.** A short idea, three or four notes: **G, B♭, C**. Then space.
2. **Develop.** Repeat it, changed a little: the same start, a new ending (**G, B♭, C, E♭, C**). The listener recognises it and leans in.
3. **Build.** Higher, busier, louder: a line of eighth notes climbing to **B♭** near the top of the hand.
4. **Resolve.** Come down and land on the home note, **C**, and let it ring.

The space after the motif is not wasted time. **Silence is what makes the next phrase land.** Beginners fill every beat; experienced players leave room.

You can shape a single chorus this way, or a whole solo over several choruses: start low and sparse, peak near the end, then resolve.

Here the shape fits four bars of C7, so you can hear the whole arc at once.`)] },
      { kind: "listen", blocks: [
        audio("Motif, develop, build, resolve", handsSound(SHAPED, shells(["C7", "C7", "C7", "C7"]), 84)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: SHAPED, left: shells(["C7", "C7", "C7", "C7"]) }, "Four bars, four stages. Feel the space in bars 1 and 2.", 66),
      ] },
      { kind: "practice", blocks: [
        choice("What is a motif?", ["A short idea that the solo develops", "The fastest part of a solo", "The final note"], 0, "Three or four notes, then space."),
        choice("What does developing a motif mean?", ["Repeating it with a change", "Never playing it again", "Playing it louder each time, unchanged"], 0, "Familiar, but new."),
        choice("Where does a well-shaped solo usually peak?", ["Near the end", "In the first bar", "Nowhere: it stays level"], 0, "Build towards it, then resolve."),
        choice("Why leave space after a phrase?", ["It makes the next phrase land", "Because you ran out of notes", "It is a mistake"], 0, "Silence is part of the music."),
        ear("Which stage is this?", handsSound(BUILD, SHELL.C7 + "/w", 84), ["Motif", "Build", "Resolve"], 1, "Busy eighth notes, climbing."),
        hands({ right: SHAPED, left: shells(["C7", "C7", "C7", "C7"]) }, "Play along at 66, then make up your own motif and shape it the same way.", 66),
      ] },
    ],
  },
  {
    ...base,
    slug: "piano-blues-solo-study",
    title: "Study: a twelve-bar blues solo",
    order: 6,
    minutes: 8,
    concepts: ["blues-solo-study"],
    needs: ["shaping-a-solo-at-the-piano", "twelve-bar-blues"],
    steps: [
      { kind: "understand", blocks: [text(`The study piece is one chorus of a **twelve-bar blues in C**, solo in the right hand, shells in the left.

\`\`\`
| C7 | C7 | C7 | C7 |
| F7 | F7 | C7 | C7 |
| G7 | F7 | C7 | G7 |
\`\`\`

It uses everything in this stage:

- **Bars 1–4:** a motif (G, B♭, C) and its development, with a **crushed** E♭–E in bar 2.
- **Bar 5:** the chord changes to F7, and the line lands on **A**, its 3rd.
- **Bar 6:** down through F7 to **E♭**, its 7th.
- **Bar 9:** G7, outlined by its own notes: B, D, F.
- **Bar 12:** a turnaround line that rises to **D**, pointing back to the top.

The left hand plays one shell per bar: **C–B♭** for C7, **F–E♭** for F7, **G–F** for G7.

How to learn it:

1. Left hand alone, saying the chord names out loud.
2. Right hand alone, four bars at a time.
3. Together, slowly. Then swing the eighth notes, which the app does not do: long-short, long-short.

When it is solid, keep the left hand and **change the right hand**: your own motif, your own build.`)] },
      { kind: "listen", blocks: [
        audio("The whole chorus", handsSound(SOLO, shells(BLUES), 92)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: SOLO, left: shells(BLUES) }, "Twelve bars: right-hand solo over left-hand shells.", 72),
      ] },
      { kind: "practice", blocks: [
        choice("Which chord is in bar 5 of a twelve-bar blues in C?", ["F7", "G7", "C7"], 0, "The IV chord."),
        choice("Which shell does the left hand play for F7?", ["F and E♭", "F and A", "C and B♭"], 0, "Root and 7th."),
        choice("In bar 5, the solo lands on A. Why?", ["It is the 3rd of F7", "It is the root of C7", "It is the blue note"], 0, "A chord tone, on beat 1."),
        choice("What does the line in bar 12 do?", ["Points back to the top of the form", "Ends the song", "Repeats bar 1"], 0, "A turnaround."),
        ear("Is the chord here C7 or F7?", handsSound("A4/q C5/q Eb5/q C5/q", `${SHELL.F7}/w`, 92), ["C7", "F7"], 1, "A, C and E♭ over F and E♭."),
        hands({ right: SOLO, left: shells(BLUES) }, "Play the study along at 72.", 72),
      ] },
    ],
  },
];
