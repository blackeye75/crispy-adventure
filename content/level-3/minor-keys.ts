import type { LessonInput } from "@/core/schemas/content";
import { audio, build, choice, ear, prog, progression, scale, seq, show, text } from "../helpers";

const base = { moduleSlug: "minor-keys", isFree: false, version: 1, minutes: 6 } as const;
const A_NATURAL = "A3 B3 C4 D4 E4 F4 G4 A4";
const A_HARMONIC = "A3 B3 C4 D4 E4 F4 G#4 A4";
const A_MELODIC = "A3 B3 C4 D4 E4 F#4 G#4 A4";

export const minorKeys: LessonInput[] = [
  {
    ...base,
    slug: "the-natural-minor-scale",
    title: "The natural minor scale",
    order: 1,
    concepts: ["natural-minor"],
    needs: ["relative-major-and-minor"],
    steps: [
      { kind: "understand", blocks: [text(`The **natural minor scale** has its own pattern of steps: **W H W W H W W**.

From A it uses only white keys: A B C D E F G.

Set beside a major scale from the same note, three degrees are a half step lower: the 3rd, the 6th and the 7th. Its formula is 1 2 ♭3 4 5 ♭6 ♭7. The lowered third is what makes it minor; the lowered sixth and seventh deepen the colour.`)] },
      { kind: "listen", blocks: [
        audio("A natural minor", seq(A_NATURAL, 110)),
        audio("A major, for comparison", seq("A3 B3 C#4 D4 E4 F#4 G#4 A4", 110)),
      ] },
      { kind: "learn", blocks: [
        show(scale("A", "natural-minor"), "A natural minor: A B C D E F G."),
        show(scale("A", "natural-minor", "degrees"), "The same scale by degree: 1 2 ♭3 4 5 ♭6 ♭7."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the step pattern of the natural minor scale?", ["W H W W H W W", "W W H W W W H", "W H W W W H W"], 0, "Whole, half, whole, whole, half, whole, whole."),
        build("Build A natural minor.", "A B C D E F G", "From A the pattern needs no sharps or flats."),
        build("Build E natural minor.", "E F# G A B C D", "The pattern from E needs one sharp, F♯."),
        choice("Compared with the major scale, natural minor lowers which degrees?", ["3, 6 and 7", "2, 3 and 6", "3, 4 and 7"], 0, "1 2 ♭3 4 5 ♭6 ♭7."),
        ear("Major scale or natural minor scale?", seq("D4 E4 F4 G4 A4 Bb4 C5 D5", 110), ["Natural minor", "Major"], 0, "The third note is only three half steps above the first."),
      ] },
    ],
  },
  {
    ...base,
    slug: "relative-and-parallel-minor",
    title: "Relative minor and parallel minor",
    order: 2,
    concepts: ["parallel-minor"],
    needs: ["the-natural-minor-scale"],
    steps: [
      { kind: "understand", blocks: [text(`A major key has two minor relations, and they are easy to mix up.

The **relative minor** shares the notes and has a different home. C major and A minor: same seven notes.

The **parallel minor** shares the home and has different notes. C major and C minor both rest on C, but C minor lowers the 3rd, 6th and 7th: C D E♭ F G A♭ B♭.

C minor's three flats are the key signature of E♭ major, because C minor is the relative minor of E♭.`)] },
      { kind: "listen", blocks: [
        audio("C major, then its parallel minor, C minor", seq("C4 D4 E4 F4 G4 G4 F4 Eb4 D4 C4", 100)),
        audio("C major, then its relative minor, A minor", seq("C4 D4 E4 F4 G4 E4 D4 C4 B3 A3", 100)),
      ] },
      { kind: "learn", blocks: [
        show(scale("C", "major"), "C major."),
        show(scale("C", "natural-minor"), "C minor, the parallel minor: same home, three notes lowered."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the parallel minor of C major?", ["C minor", "A minor", "E minor"], 0, "Parallel keys share the home note."),
        choice("What is the relative minor of C major?", ["A minor", "C minor", "D minor"], 0, "Relative keys share the notes."),
        choice("C major and C minor share…", ["The same home note", "The same key signature", "All seven notes"], 0, "Same tonic, different scale."),
        choice("C minor has the same key signature as…", ["E♭ major", "C major", "A♭ major"], 0, "C minor is the relative minor of E♭ major: three flats."),
        build("Build C natural minor.", "C D Eb F G Ab Bb", "Lower degrees 3, 6 and 7 of C major."),
        choice("What is the parallel minor of G major?", ["G minor", "E minor", "B minor"], 0, "Same home note, G."),
      ] },
    ],
  },
  {
    ...base,
    slug: "harmonic-minor",
    title: "Harmonic minor and the major V",
    order: 3,
    concepts: ["harmonic-minor"],
    needs: ["relative-and-parallel-minor", "why-chords-want-to-move"],
    steps: [
      { kind: "understand", blocks: [text(`Natural minor has a weakness. Its 7th degree is a whole step below the tonic, so there is no leading tone, and its V chord is minor. In A minor that chord is Em, and it pulls home only gently.

The fix is to raise the 7th by a half step. That gives the **harmonic minor** scale: A B C D E F G♯. Its formula is 1 2 ♭3 4 5 ♭6 7.

Now the V chord is major: E, G♯, B. The G♯ is a leading tone, and it pulls strongly up to A.

The raised 7th leaves a gap of three half steps between degrees 6 and 7, F to G♯. That gap gives harmonic minor its distinctive sound.`)] },
      { kind: "listen", blocks: [
        audio("A harmonic minor", seq(A_HARMONIC, 110)),
        audio("Natural minor ending: Am, Em, Am", prog("A", "i v i", 66)),
        audio("Harmonic minor ending: Am, E, Am", prog("A", "i V i", 66)),
      ] },
      { kind: "learn", blocks: [
        show(scale("A", "harmonic-minor"), "A harmonic minor. G has become G♯."),
        show(progression("A", "i V i"), "Am, E, Am. The G♯ in the E chord rises to A."),
      ] },
      { kind: "practice", blocks: [
        choice("Which degree does harmonic minor raise?", ["The 7th", "The 6th", "The 3rd"], 0, "Raising the 7th creates a leading tone."),
        choice("In A harmonic minor, what is the V chord?", ["E major", "E minor", "G major"], 0, "E, G♯, B."),
        build("Build A harmonic minor.", "A B C D E F G#", "Natural minor with the 7th raised."),
        choice("How big is the gap between degrees 6 and 7 of harmonic minor?", ["Three half steps", "Two half steps", "One half step"], 0, "F to G♯."),
        ear("Is the middle chord major or minor?", prog("A", "i V i", 66), ["Major: the V of harmonic minor", "Minor: the v of natural minor"], 0, "E major, with its G♯, leans hard into Am."),
        ear("And here?", prog("A", "i v i", 66), ["Major: the V of harmonic minor", "Minor: the v of natural minor"], 1, "E minor: a softer return."),
      ] },
    ],
  },
  {
    ...base,
    slug: "melodic-minor",
    title: "Melodic minor",
    order: 4,
    concepts: ["melodic-minor"],
    needs: ["harmonic-minor"],
    steps: [
      { kind: "understand", blocks: [text(`Harmonic minor is strong for chords but awkward to sing: the leap from degree 6 to 7 is three half steps wide.

**Melodic minor** smooths it out by raising the 6th as well: A B C D E F♯ G♯. Its formula is 1 2 ♭3 4 5 6 7.

Only the lowered 3rd now separates it from the major scale.

In classical music the raised notes are used on the way up, where they lead to the tonic; on the way down the scale usually returns to natural minor. Jazz musicians use the raised form in both directions.`)] },
      { kind: "listen", blocks: [
        audio("A melodic minor, going up", seq(A_MELODIC, 110)),
        audio("Coming down as natural minor", seq(A_NATURAL.split(" ").reverse().join(" "), 110)),
      ] },
      { kind: "learn", blocks: [show(scale("A", "melodic-minor"), "A melodic minor: F and G are both raised.")] },
      { kind: "practice", blocks: [
        choice("Which degrees does melodic minor raise, compared with natural minor?", ["6 and 7", "3 and 7", "Only 7"], 0, "Both are raised by a half step."),
        build("Build A melodic minor, as it goes up.", "A B C D E F# G#", "Natural minor with the 6th and 7th raised."),
        choice("Why raise the 6th as well as the 7th?", ["To remove the three-half-step gap", "To make the scale major", "To add a flat"], 0, "With F♯, the steps to G♯ and A are a whole step and a half step."),
        choice("How does melodic minor differ from the major scale?", ["Only the 3rd is lowered", "The 3rd and 6th are lowered", "The 7th is lowered"], 0, "1 2 ♭3 4 5 6 7."),
        ear("Which scale is this?", seq(A_MELODIC, 110), ["Melodic minor", "Natural minor"], 0, "The top of the scale sounds major: F♯, G♯, A."),
      ] },
    ],
  },
  {
    ...base,
    slug: "chords-of-a-minor-key",
    title: "The chords of a minor key",
    order: 5,
    concepts: ["minor-key-chords"],
    needs: ["melodic-minor", "harmonising-the-major-scale"],
    steps: [
      { kind: "understand", blocks: [text(`Stack thirds on each note of the natural minor scale and you get the chords of the minor key:

**i ii° III iv v VI VII**

In A minor: Am, B°, C, Dm, Em, F, G. These are the same seven chords as C major, numbered from a different home.

In practice the V chord is usually borrowed from harmonic minor and made major: E instead of Em.

Three minor-key progressions to know: **i–iv–V**, **i–VI–VII** and **i–VII–VI–V**.`)] },
      { kind: "listen", blocks: [
        audio("i–iv–V–i in A minor: Am, Dm, E, Am", prog("A", "i iv V i", 72)),
        audio("i–VI–VII–i in A minor: Am, F, G, Am", prog("A", "i bVI bVII i", 72)),
      ] },
      { kind: "learn", blocks: [
        show(progression("A", "i ii° bIII iv v bVI bVII"), "The seven chords of A natural minor: Am, B°, C, Dm, Em, F, G."),
        show(progression("A", "i iv V i"), "Am, Dm, E, Am: the V is major, borrowed from harmonic minor."),
      ] },
      { kind: "practice", blocks: [
        choice("In A minor, what is the iv chord?", ["Dm", "D", "Em"], 0, "The fourth degree is D, and iv is minor."),
        choice("In A minor, what is the VI chord?", ["F", "Fm", "G"], 0, "The sixth degree is F, and VI is major."),
        choice("The chords of A natural minor are the same as the chords of…", ["C major", "A major", "E major"], 0, "Relative keys share their notes, and so their chords."),
        choice("Which chord is usually made major in a minor key?", ["The V chord", "The iv chord", "The i chord"], 0, "The raised 7th of harmonic minor gives V its leading tone."),
        ear("Is the home chord of this progression major or minor?", prog("A", "i iv V i", 72), ["Minor", "Major"], 0, "It begins and ends on A minor."),
        ear("Which progression is this?", prog("A", "i bVI bVII i", 72), ["i–VI–VII–i", "i–iv–V–i"], 0, "Two major chords climb by step back to the minor home."),
      ] },
    ],
  },
];
