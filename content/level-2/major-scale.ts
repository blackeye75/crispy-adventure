import type { LessonInput } from "@/core/schemas/content";
import { along, audio, build, choice, ear, find, pitches, scale, seq, show, text } from "../helpers";

const base = { moduleSlug: "major-scale", isFree: false, version: 1, minutes: 6 } as const;
const C_MAJOR = "C4 D4 E4 F4 G4 A4 B4 C5";
const G_SHAPE = "G2 A2 B2 C3 D3 E3 F#3 G3";
const A_ON_STRING_5 = "A2 B2 C#3 D3 E3 F#3 G#3 A3";

export const majorScale: LessonInput[] = [
  {
    ...base,
    slug: "the-major-scale-formula",
    title: "The major scale formula",
    order: 1,
    concepts: ["major-scale-formula"],
    needs: ["half-and-whole-steps"],
    steps: [
      { kind: "understand", blocks: [text(`A **scale** is a set of notes in order, from a home note up to the same note an octave higher. The **major scale** is the one all other scales are measured against. You know its sound already: do re mi fa sol la ti do.

What makes it major is its pattern of steps: **W W H W W W H**. Whole, whole, half, whole, whole, whole, half.

Start on C and follow the pattern and you get C D E F G A B C: only white keys. The two half steps fall between notes 3 and 4 (E–F) and between notes 7 and 8 (B–C), exactly where the natural notes have no sharp between them.`)] },
      { kind: "listen", blocks: [
        audio("C major, going up", seq(C_MAJOR, 110)),
        audio("C major, coming down", seq(C_MAJOR.split(" ").reverse().join(" "), 110)),
      ] },
      { kind: "learn", blocks: [show(scale("C", "major"), "C major on the instrument. C is home; follow W W H W W W H from any C to the next.")] },
      { kind: "practice", blocks: [
        choice("What is the step pattern of the major scale?", ["W W H W W W H", "W H W W H W W", "W W W H W W H"], 0, "Whole, whole, half, then whole, whole, whole, half."),
        choice("Where do the half steps fall in a major scale?", ["Between notes 3–4 and 7–8", "Between notes 2–3 and 5–6", "Between notes 1–2 and 4–5"], 0, "The two H's in W W H W W W H are the third and the seventh steps."),
        build("Build the C major scale: tap its seven notes, anywhere on the instrument.", "C D E F G A B", "Following W W H W W W H from C needs no sharps or flats."),
        ear("Is this a major scale?", seq(C_MAJOR, 120), ["Yes, a major scale", "No, something else"], 0, "Do re mi fa sol la ti do."),
        ear("And this one?", seq("C4 D4 Eb4 F4 G4 Ab4 Bb4 C5", 120), ["Yes, a major scale", "No, something else"], 1, "Notes 3, 6 and 7 are lower than in the major scale. This is a minor scale, which comes later."),
      ] },
    ],
  },
  {
    ...base,
    slug: "scale-degrees",
    title: "Scale degrees and their names",
    order: 2,
    concepts: ["scale-degrees"],
    needs: ["the-major-scale-formula"],
    steps: [
      { kind: "understand", blocks: [text(`The notes of a scale are numbered 1 to 7. These are its **degrees**, and numbers let you talk about music in any key: the 5th of C major is G, the 5th of G major is D.

Each degree also has a name: 1 tonic, 2 supertonic, 3 mediant, 4 subdominant, 5 dominant, 6 submediant, 7 leading tone.

Three matter most to begin with. The **tonic** is home. The **dominant** has the strongest pull back towards home. The **leading tone** sits a half step below the tonic and leans up into it.`)] },
      { kind: "listen", blocks: [
        audio("Tonic, dominant, tonic: degrees 1, 5, 1", seq("C4 G4 C4", 60)),
        audio("Leading tone to tonic: degree 7 rising to 8", seq("B4 C5", 50)),
      ] },
      { kind: "learn", blocks: [show(scale("C", "major", "degrees"), "C major by number. 1 is the tonic, 5 the dominant, 7 the leading tone.")] },
      { kind: "practice", blocks: [
        choice("Which degree is the dominant?", ["The 5th", "The 4th", "The 7th"], 0, "Tonic is 1, dominant is 5."),
        choice("The leading tone is a half step below the…", ["Tonic", "Dominant", "Mediant"], 0, "Degree 7 leads up to degree 8, the tonic again."),
        choice("In C major, which note is degree 3?", ["E", "D", "F"], 0, "C is 1, D is 2, E is 3."),
        find("Tap the 5th degree of C major.", "G", "C D E F G: the fifth note is G, the dominant."),
        ear("The scale stops on degree 7. Does it sound finished?", seq("C4 D4 E4 F4 G4 A4 B4", 110), ["No: it wants to rise to the tonic", "Yes: it sounds at rest"], 0, "The leading tone leans up into the tonic, a half step away."),
      ] },
    ],
  },
  {
    ...base,
    slug: "major-scales-in-any-key",
    title: "The major scale in any key",
    order: 3,
    concepts: ["major-scale-spelling"],
    needs: ["scale-degrees"],
    steps: [
      { kind: "understand", blocks: [text(`Start on any note, apply W W H W W W H, and you have that note's major scale. Two rules keep the names right:

- Use every letter exactly once.
- Use sharps or flats as needed, never both in the same scale.

**G major** is G A B C D E F♯. The seventh note has to be some kind of F, and the pattern puts it a whole step above E, so it is F♯.

**F major** is F G A B♭ C D E. The fourth note has to be some kind of B, a half step above A, so it is B♭. Calling it A♯ would use A twice and skip B.`)] },
      { kind: "listen", blocks: [
        audio("G major: one sharp", seq("G3 A3 B3 C4 D4 E4 F#4 G4", 110)),
        audio("F major: one flat", seq("F3 G3 A3 Bb3 C4 D4 E4 F4", 110)),
      ] },
      { kind: "learn", blocks: [
        show(scale("G", "major"), "G major: G A B C D E F♯."),
        show(scale("F", "major"), "F major: F G A B♭ C D E."),
      ] },
      { kind: "practice", blocks: [
        build("Build G major: tap its seven notes.", "G A B C D E F#", "W W H W W W H from G lands on F♯ for the seventh note."),
        build("Build F major: tap its seven notes.", "F G A Bb C D E", "The fourth note is a half step above A: B♭."),
        choice("Why is the fourth note of F major called B♭ and not A♯?", ["Every letter is used once, and A is already taken", "B♭ sounds different from A♯", "Flats are easier to play"], 0, "F G A must be followed by some kind of B."),
        choice("D major has two sharps. Which ones?", ["F♯ and C♯", "F♯ and G♯", "C♯ and G♯"], 0, "D E F♯ G A B C♯."),
        find("Tap the 4th degree of G major.", "C", "G A B C: the fourth note is C."),
      ] },
    ],
  },
  {
    ...base,
    slug: "solfege-and-sargam",
    title: "Do Re Mi and Sa Re Ga",
    order: 4,
    concepts: ["solfege-and-sargam"],
    needs: ["major-scales-in-any-key"],
    steps: [
      { kind: "understand", blocks: [text(`Singers give each degree of the major scale a syllable. This is **solfege**: Do Re Mi Fa Sol La Ti, and Do again. In this course Do is always the tonic, whatever the key: in C major Do is C, in G major Do is G.

Indian music does the same with **sargam**: Sa Re Ga Ma Pa Dha Ni, and Sa again. Sa is the home note, wherever you choose to place it.

Sung with all natural (shuddha) notes, sargam gives the same seven notes as the major scale:

Do = Sa · Re = Re · Mi = Ga · Fa = Ma · Sol = Pa · La = Dha · Ti = Ni`)] },
      { kind: "listen", blocks: [audio("Do Re Mi Fa Sol La Ti Do, or Sa Re Ga Ma Pa Dha Ni Sa", seq(C_MAJOR, 90))] },
      { kind: "learn", blocks: [show(scale("C", "major", "degrees"), "Degree 1 is Do and Sa, degree 5 is Sol and Pa. Sing along as you tap.")] },
      { kind: "practice", blocks: [
        choice("In C major, which note is Sol?", ["G", "F", "A"], 0, "Sol is degree 5, and the 5th of C is G."),
        choice("Which swara matches Mi?", ["Ga", "Ma", "Pa"], 0, "Do Re Mi lines up with Sa Re Ga."),
        choice("In G major, which note is Sa?", ["G", "C", "D"], 0, "Sa is the home note of whatever key you are in."),
        choice("Which swara matches Sol?", ["Pa", "Dha", "Ma"], 0, "Sol and Pa are both degree 5."),
        ear("You hear degrees 1, 3 and 5. What are they in solfege?", seq("C4 E4 G4", 70), ["Do Mi Sol", "Do Re Mi", "Do Fa La"], 0, "Degrees 1, 3, 5 are Do, Mi, Sol: in sargam, Sa, Ga, Pa."),
      ] },
    ],
  },
  {
    ...base,
    slug: "guitar-major-scale-shapes",
    title: "A major scale shape you can move",
    order: 5,
    strand: "guitar",
    concepts: ["guitar-major-scale-shape"],
    needs: ["major-scales-in-any-key", "notes-on-strings-6-and-5"],
    steps: [
      { kind: "understand", blocks: [text(`Here is G major in one octave, starting from G on string 6:

- String 6: frets 3 and 5.
- String 5: frets 2, 3 and 5.
- String 4: frets 2, 4 and 5.

The shape has no open strings, so it moves. Slide every note up two frets and it becomes A major; the first note on string 6 always names the scale.

You can also play a scale along a single string, where the formula is easy to see: a whole step is two frets and a half step is one. A major along string 5 uses frets 0, 2, 4, 5, 7, 9, 11 and 12.`)] },
      { kind: "listen", blocks: [
        audio("G major in the one-octave shape", seq(G_SHAPE, 110)),
        audio("A major along string 5", seq(A_ON_STRING_5, 110)),
      ] },
      { kind: "learn", blocks: [
        show(pitches(G_SHAPE, { strings: [6, 5, 4], within: [2, 5] }), "G major, one octave: frets 2 to 5 on strings 6, 5 and 4.", "guitar"),
        show(pitches(A_ON_STRING_5, { strings: [5] }), "A major along string 5: two frets, two, one, two, two, two, one.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        find("In the G major shape, tap degree 3. It is on string 5.", "B2", "G and A are on string 6; B is the first note on string 5, at fret 2.", { strings: [5], only: "guitar" }),
        choice("Move the whole shape up two frets. Which scale is it now?", ["A major", "B major", "G♯ major"], 0, "The first note on string 6 moves from G at fret 3 to A at fret 5."),
        find("A major along string 5: tap degree 4.", "D3", "Frets 0, 2 and 4, then a half step to fret 5: D.", { strings: [5], only: "guitar" }),
        choice("Along one string, how many frets separate degrees 3 and 4?", ["One", "Two", "Three"], 0, "It is one of the two half steps in the formula."),
        choice("And degrees 1 and 2?", ["Two", "One", "Three"], 0, "The scale begins with a whole step."),
      ] },
    ],
  },
  {
    ...base,
    slug: "piano-major-scale-fingering",
    title: "Major scale fingering",
    order: 6,
    strand: "piano",
    concepts: ["piano-scale-fingering"],
    needs: ["major-scales-in-any-key", "finger-numbers"],
    steps: [
      { kind: "understand", blocks: [text(`A scale has eight notes on the way up and a hand has five fingers, so the thumb has to pass under.

C, G, D, A and E major all share one fingering:

- **Right hand, going up:** 1 2 3, thumb under, 1 2 3 4 5.
- **Left hand, going up:** 5 4 3 2 1, third finger over, 3 2 1.

Coming down, each hand does the same in reverse.

**F major** changes the right hand to 1 2 3 4, thumb under, 1 2 3 4, so that the fourth finger takes the B♭. **B major** changes the left hand to 4 3 2 1, 4 3 2 1.

The flat keys each have their own fingering. One idea guides them all: the thumbs stay on white keys.`)] },
      { kind: "listen", blocks: [audio("C major, one octave up", seq(C_MAJOR, 90))] },
      { kind: "learn", blocks: [show(scale("C", "major"), "C major. Right hand: 1 2 3 on C D E, thumb under to F, then 2 3 4 5 up to C.", "piano")] },
      { kind: "practice", blocks: [
        choice("Right hand, C major going up: which finger plays F?", ["1, the thumb", "4", "3"], 0, "After 1 2 3 on C D E the thumb passes under to F."),
        choice("Left hand, C major going up: after the thumb plays G, which finger crosses over to A?", ["3", "2", "4"], 0, "5 4 3 2 1 on C D E F G, then 3 2 1 on A B C."),
        choice("Which of these scales uses the same fingering as C major in both hands?", ["G major", "F major", "B major"], 0, "C, G, D, A and E share the fingering; F changes the right hand and B the left."),
        choice("In F major, the right hand's fourth finger plays…", ["B♭", "A", "C"], 0, "1 2 3 4 on F G A B♭, then the thumb passes under to C."),
        along("Play C major up and down, right hand, along with the track.", seq("C4 D4 E4 F4 G4 A4 B4 C5 B4 A4 G4 F4 E4 D4 C4"), 60, scale("C", "major")),
      ] },
    ],
  },
];
