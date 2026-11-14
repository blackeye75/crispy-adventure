import type { LessonInput } from "@/core/schemas/content";
import { audio, chordOf, ear, scale, seq, show, text, together } from "../helpers";

const base = { moduleSlug: "ear-4", isFree: false, version: 1, minutes: 5, strand: "ear" } as const;
const SEVENTHS = ["Major 7", "Dominant 7", "Minor 7", "Half-diminished"];

export const ear4: LessonInput[] = [
  {
    ...base,
    slug: "seventh-chord-quality-by-ear",
    title: "Hearing seventh chords",
    order: 1,
    concepts: ["ear-seventh-chords"],
    needs: ["half-diminished-diminished-and-minor-major", "triad-quality-by-ear"],
    steps: [
      { kind: "understand", blocks: [text(`To name a seventh chord by ear, listen in two layers.

**The triad underneath.** Is the bottom of the chord major, minor or diminished? You can already hear that.

**The seventh on top.** A major seventh sits a half step under the octave and gives a bright, close shimmer. A minor seventh is a whole step under and sounds rounder.

Put them together: major triad with major seventh is **major 7**, lush and still. Major triad with minor seventh is **dominant 7**, restless. Minor triad with minor seventh is **minor 7**, mellow. Diminished triad with minor seventh is **half-diminished**, dark and unsettled.`)] },
      { kind: "listen", blocks: [
        audio("Major 7", together("C4 E4 G4 B4")),
        audio("Dominant 7", together("C4 E4 G4 Bb4")),
        audio("Minor 7", together("C4 Eb4 G4 Bb4")),
        audio("Half-diminished", together("C4 Eb4 Gb4 Bb4")),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("C", "maj7"), "Cmaj7: the seventh, B, is right under the octave."),
        show(chordOf("C", "7"), "C7: the seventh, B♭, is a whole step under."),
      ] },
      { kind: "practice", blocks: [
        ear("Which seventh chord is this?", together("G3 B3 D4 F4"), SEVENTHS, 1, "A major triad with a minor seventh: G7."),
        ear("And this?", together("F3 A3 C4 E4"), SEVENTHS, 0, "A major triad with a major seventh: Fmaj7."),
        ear("And this?", together("D4 F4 A4 C5"), SEVENTHS, 2, "A minor triad with a minor seventh: Dm7."),
        ear("And this?", together("B3 D4 F4 A4"), SEVENTHS, 3, "A diminished triad with a minor seventh: Bm7♭5."),
        ear("And this?", together("A3 C4 E4 G4"), SEVENTHS, 2, "Am7."),
        ear("And this?", together("D4 F#4 A4 C5"), SEVENTHS, 1, "D7."),
      ] },
    ],
  },
  {
    ...base,
    slug: "pentatonic-phrases-by-ear",
    title: "Pentatonic phrases by ear",
    order: 2,
    concepts: ["ear-pentatonic"],
    needs: ["seventh-chord-quality-by-ear", "the-minor-pentatonic-scale"],
    steps: [
      { kind: "understand", blocks: [text(`A great deal of melody is pentatonic, so being able to copy a pentatonic phrase by ear unlocks a lot of music.

With only five notes, two questions settle most phrases:

- **Where is home?** Hum the note the phrase rests on. That tells you whether it is major or minor pentatonic.
- **Step or skip?** Neighbouring notes of the scale are either a whole step apart or a minor third apart. A whole step sounds close; a minor third is a small leap.

To copy a phrase, find its first note on your instrument, then follow it one move at a time: up or down, step or skip.`)] },
      { kind: "listen", blocks: [
        audio("A phrase that rests on A: minor pentatonic", seq("E4 D4 C4 A3", 90)),
        audio("The same notes resting on C: major pentatonic", seq("E4 D4 C4 D4 C4", 90)),
      ] },
      { kind: "learn", blocks: [show(scale("A", "minor-pentatonic"), "A minor pentatonic. Tap out the first phrase: E, D, C, A.")] },
      { kind: "practice", blocks: [
        ear("Does this phrase rest on a major or a minor home?", seq("G4 E4 D4 C4 A3", 90), ["Minor: it rests on A", "Major: it rests on C"], 0, "It ends on A, with C a minor third above."),
        ear("And this one?", seq("A4 G4 E4 D4 C4", 90), ["Minor: it rests on A", "Major: it rests on C"], 1, "It settles on C."),
        ear("The last move of this phrase: a step or a skip?", seq("A3 C4 D4 E4", 90), ["A step: a whole step", "A skip: a minor third"], 0, "D up to E is a whole step."),
        ear("And the last move of this one?", seq("E4 D4 C4 A3", 90), ["A step: a whole step", "A skip: a minor third"], 1, "C down to A is a minor third."),
        ear("Does this phrase go mostly up or mostly down?", seq("A3 C4 D4 E4 G4", 90), ["Up", "Down"], 0, "It climbs the scale from A to G."),
      ] },
    ],
  },
  {
    ...base,
    slug: "descending-and-harmonic-intervals",
    title: "Intervals going down and sounding together",
    order: 3,
    concepts: ["ear-descending-harmonic-intervals"],
    needs: ["pentatonic-phrases-by-ear", "hearing-intervals-going-up"],
    steps: [
      { kind: "understand", blocks: [text(`You can name intervals when they climb. They are harder to catch in two other forms.

**Going down.** The method still works, turned over: hum the two notes, then sing them from the bottom up, and name what you hear.

**Together.** When both notes sound at once there is no order to follow, so listen to the blend instead. Thirds and sixths are sweet. Fourths and fifths are hollow and open. Seconds and sevenths rub against each other. The tritone is restless.

If you are unsure, sing each of the two notes separately, lowest first, and you are back to an interval going up.`)] },
      { kind: "listen", blocks: [
        audio("A perfect fifth going down: G to C", seq("G4 C4", 50)),
        audio("A major third sounding together: sweet", together("C4 E4")),
        audio("A perfect fifth sounding together: open", together("C4 G4")),
        audio("A major second sounding together: a rub", together("C4 D4")),
      ] },
      { kind: "learn", blocks: [show(scale("C", "major", "degrees"), "For a falling interval, find both notes, then count up from the lower one.")] },
      { kind: "practice", blocks: [
        ear("Which interval is this, going down?", seq("A4 D4", 50), ["Perfect fifth", "Major third", "Octave"], 0, "From D up to A is five scale steps."),
        ear("And this, going down?", seq("E4 C4", 50), ["Perfect fifth", "Major third", "Octave"], 1, "From C up to E is a major third."),
        ear("And this, going down?", seq("G4 G3", 50), ["Perfect fifth", "Major third", "Octave"], 2, "The same note, an octave lower."),
        ear("Two notes together. Which interval?", together("F3 A3"), ["Major third: sweet", "Perfect fifth: open", "Major second: a rub"], 0, "F and A blend sweetly."),
        ear("And these?", together("D4 A4"), ["Major third: sweet", "Perfect fifth: open", "Major second: a rub"], 1, "Hollow and strong."),
        ear("And these?", together("G4 A4"), ["Major third: sweet", "Perfect fifth: open", "Major second: a rub"], 2, "Two neighbouring notes rubbing together."),
      ] },
    ],
  },
];
