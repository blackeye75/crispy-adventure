// Playing track P3, Basic stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (finger numbers, balance between the hands, where the left
// hand sits) is standard teaching written from memory, not checked against a pianist. The harmony chosen
// for "Ode to Joy" (C, G, C, G) is a common simple harmonisation, also unreviewed. No demo videos yet.
import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, ear, find, hands, handsSound, rhythm, staff, text } from "../helpers";
import { ODE, ODE_FINGERS } from "./melody-basic";

const base = { moduleSlug: "solo-piano-basic", track: "piano-solo", strand: "piano", isFree: false, version: 1, minutes: 7 } as const;
const P = { only: "piano" } as const;

const BASS = "C3/w | G2/w | C3/w | G2/w";
const BASS_FINGERS = "5 5 5 5";
const CHORDS = "C3+E3+G3/w | G2+B2+D3/w | C3+E3+G3/w | G2+B2+D3/w";
const CHORD_FINGERS = "531 531 531 531";
const CHORDS_SHORT = "C3+E3+G3/h r/h | G2+B2+D3/h r/h | C3+E3+G3/h r/h | G2+B2+D3/h r/h";

export const soloPianoBasic: LessonInput[] = [
  {
    ...base,
    slug: "melody-over-single-bass-notes",
    title: "A melody over single bass notes",
    order: 1,
    concepts: ["melody-and-bass"],
    needs: ["first-melodies", "left-hand-roots"],
    steps: [
      // OWNER REVIEW: balance between the hands.
      { kind: "understand", blocks: [text(`Solo piano means one player sounding like a whole piece of music: the tune and its harmony together. The smallest version has just two lines.

- **Right hand:** the melody.
- **Left hand:** one low note per bar, the **root** of the chord.

That single bass note does a lot. It tells the ear which chord the melody is sitting on, and it fills the bottom of the sound.

Take the opening of "Ode to Joy". Its four bars sit on two chords: **C, G, C, G**. So the left hand plays **C, G, C, G**, one whole note per bar, while the right hand plays the tune you already know.

Putting hands together:

1. **Play each hand alone** until it needs no thought.
2. **Line up the first beat of every bar.** That is where both hands play at once. In between, the left hand just holds.
3. **Go slowly.** Half the speed you think you need.
4. **Balance.** The melody should sing over the bass. Play the right hand a little more firmly and let the left hand rest into its key.

When the hands feel as if they are arguing, it is nearly always the tempo. Slow down.`)] },
      { kind: "listen", blocks: [
        audio("The melody alone", rhythm(ODE, 90)),
        audio("The bass alone: C, G, C, G", rhythm(BASS, 90)),
        audio("Together", handsSound(ODE, BASS, 90)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: ODE, rightFingers: ODE_FINGERS, left: BASS, leftFingers: BASS_FINGERS }, "Both hands. The left hand plays only on beat 1 of each bar and holds.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("In this arrangement, what does the left hand play?", ["The root of each chord", "The melody", "Every note of the chord"], 0, "One low note per bar."),
        choice("On which beat do the two hands play together?", ["Beat 1 of every bar", "Every beat", "Beat 3"], 0, "The left hand then holds for the rest of the bar."),
        choice("Which hand should be a little louder?", ["The right hand: the melody", "The left hand: the bass", "Both exactly the same"], 0, "The tune sings; the bass supports."),
        find("Tap the bass note for the second bar.", "G", "The chords are C, G, C, G.", P),
        ear("Melody alone, or melody with bass?", handsSound(ODE, BASS, 90), ["Melody alone", "Melody with bass"], 1, "A low note sounds under the first beat of each bar."),
        hands({ right: ODE, rightFingers: ODE_FINGERS, left: BASS, leftFingers: BASS_FINGERS }, "Play along at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "reading-a-lead-sheet",
    title: "Reading a lead sheet",
    order: 2,
    concepts: ["lead-sheets"],
    needs: ["melody-over-single-bass-notes", "reading-chord-symbols"],
    steps: [
      { kind: "understand", blocks: [text(`Most popular music is not written out note for note. It comes as a **lead sheet**: one page with just two things on it.

- **The melody**, on a single treble staff.
- **Chord symbols** above the staff: C, G, Am, F7.

Everything else is left to you. The lead sheet does not say what the left hand plays. It only says which chord is sounding, and for how long.

How to read one:

- **A chord symbol lasts until the next one.** If C is written over bar 1 and nothing over bar 2, bar 2 is still C.
- **The symbol sits above the beat where the chord changes.** Usually that is beat 1.
- **The right hand plays the melody as written.**
- **The left hand makes something from the chord symbol.** The simplest answer is the one from the last lesson: play its root.

Here is the opening of "Ode to Joy" as a lead sheet would show it:

\`\`\`
  C          G          C          G
| E E F G  | G F E D  | C C D E  | E. D D   |
\`\`\`

Four chord symbols, four bars. From this alone you can play the arrangement you already know, and later a fuller one, without the page changing at all. That is the freedom of a lead sheet: the same page serves a beginner and a professional.`)] },
      { kind: "listen", blocks: [
        audio("What the page gives you: the melody", rhythm(ODE, 90)),
        audio("What you add: a left hand from the chord symbols", handsSound(ODE, BASS, 90)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", ODE, "The melody line of the lead sheet. Above it would stand C, G, C, G, one per bar.", { time: true, names: true, bpm: 90 }),
        hands({ right: ODE, left: BASS }, "One way to play it: the root of each chord symbol in the left hand.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What does a lead sheet contain?", ["The melody and chord symbols", "Every note for both hands", "Only the lyrics"], 0, "The rest is up to the player."),
        choice("A bar has no chord symbol over it. Which chord do you play?", ["The same as the bar before", "No chord", "C major"], 0, "A symbol lasts until the next one."),
        choice("What does the lead sheet say about the left hand?", ["Nothing: you build it from the chord symbols", "Every note it plays", "That it rests"], 0, "The symbols name the harmony, not the notes."),
        choice("What is the simplest left hand you can make from a chord symbol?", ["Its root", "The melody again", "All twelve notes"], 0, "One low note names the chord."),
        find("The symbol over a bar is G. Tap the root for your left hand.", "G", "The note the chord is named after.", P),
        hands({ right: ODE, left: BASS }, "Play it from the chord symbols: C, G, C, G.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "left-hand-chords-under-a-melody",
    title: "Left-hand chords under a melody",
    order: 3,
    concepts: ["left-hand-chords"],
    needs: ["reading-a-lead-sheet", "major-and-minor-triads"],
    steps: [
      // OWNER REVIEW: left-hand triad fingering and register.
      { kind: "understand", blocks: [text(`A single bass note names the chord. Playing the **whole chord** in the left hand fills in the harmony, and the arrangement starts to sound complete.

Use the triads you know, in root position:

- **C major:** C, E, G.
- **G major:** G, B, D.

In the left hand, a root-position triad is usually played with fingers **5, 3 and 1**: little finger on the root, middle finger on the third, thumb on the fifth.

Where you play it matters. **Too low, and a full chord turns to mud**; the notes are too close together for that part of the piano. Keep left-hand triads in the octave below middle C, where they are clear.

Two ways to use them:

- **Held:** play the chord on beat 1 and hold it for the bar. Calm and full.
- **Short:** play it on beat 1, let go after two beats, and leave the rest of the bar to the melody. Lighter, with more air.

The same warning as before, and it matters more now: **three notes in the left hand can easily drown one in the right.** Play the chord softly and the melody firmly.`)] },
      { kind: "listen", blocks: [
        audio("With single bass notes", handsSound(ODE, BASS, 90)),
        audio("With held chords", handsSound(ODE, CHORDS, 90)),
        audio("With short chords", handsSound(ODE, CHORDS_SHORT, 90)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: ODE, rightFingers: ODE_FINGERS, left: CHORDS, leftFingers: CHORD_FINGERS }, "Held chords: C, G, C, G with fingers 5, 3 and 1.", 60),
        hands({ right: ODE, left: CHORDS_SHORT }, "Short chords: two beats, then the left hand rests.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("Which fingers play a root-position triad in the left hand?", ["5, 3 and 1", "1, 2 and 3", "5, 4 and 3"], 0, "Little finger on the root, thumb on the fifth."),
        choice("What happens to a full chord played very low on the piano?", ["It sounds muddy", "It sounds brighter", "Nothing changes"], 0, "Low notes need more space between them."),
        choice("Which notes make the G major triad?", ["G, B, D", "G, A, B", "G, C, E"], 0, "Root, third, fifth."),
        ear("Single bass notes, or full chords?", handsSound(ODE, CHORDS, 90), ["Single bass notes", "Full chords"], 1, "Three notes sound together under each bar."),
        choice("With a chord in the left hand, how should the hands balance?", ["Chord soft, melody firm", "Chord loud, melody soft", "Both as loud as possible"], 0, "Three notes can easily cover one."),
        hands({ right: ODE, rightFingers: ODE_FINGERS, left: CHORDS, leftFingers: CHORD_FINGERS }, "Play along at 60.", 60),
      ] },
    ],
  },
];
