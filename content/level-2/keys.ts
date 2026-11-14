import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, circle, ear, find, scale, seq, show, staff, text } from "../helpers";

const base = { moduleSlug: "keys", isFree: false, version: 1, minutes: 6 } as const;
const YES_NO = ["Yes: it sounds finished", "No: it is left hanging"];

export const keys: LessonInput[] = [
  {
    ...base,
    slug: "what-is-a-key",
    title: "What being in a key means",
    order: 1,
    concepts: ["key"],
    needs: ["major-scales-in-any-key"],
    steps: [
      { kind: "understand", blocks: [text(`A piece of music is **in a key** when it is built from one scale and treats that scale's first note as home.

In the key of G major, the notes come from the G major scale, and G is where the music sounds finished.

Knowing the key tells you three things at once: which notes to expect, which note is home, and which sharps or flats are in force.`)] },
      { kind: "listen", blocks: [
        audio("A short tune in G major. It ends at home", seq("G4 A4 B4 D5 C5 B4 A4 G4", 100)),
        audio("The same tune, stopped one note early", seq("G4 A4 B4 D5 C5 B4 A4", 100)),
      ] },
      { kind: "learn", blocks: [show(scale("G", "major"), "The key of G major: these seven notes, with G as home.")] },
      { kind: "practice", blocks: [
        choice("A song is in D major. Which note is home?", ["D", "A", "G"], 0, "The key is named after its home note."),
        choice("A tune in G major mostly uses notes from…", ["The G major scale", "The C major scale", "All twelve notes equally"], 0, "The key's scale supplies the notes."),
        ear("Does this tune end on its home note?", seq("G4 B4 D5 C5 A4 F#4 G4", 100), YES_NO, 0, "F♯, the leading tone, rises into G, and the tune rests there."),
        ear("And this one?", seq("G4 B4 D5 C5 B4 A4", 100), YES_NO, 1, "It stops on A, one step above home."),
        choice("Which of these notes belongs to the key of G major?", ["F♯", "F", "B♭"], 0, "G major has one sharp, F♯."),
      ] },
    ],
  },
  {
    ...base,
    slug: "key-signatures",
    title: "Key signatures",
    order: 2,
    concepts: ["key-signatures"],
    needs: ["what-is-a-key", "the-staff-and-treble-clef"],
    steps: [
      { kind: "understand", blocks: [text(`Rather than write a sharp or flat in front of every note that needs one, music states them once at the start of each line. That is the **key signature**.

Sharps always appear in the same order: **F C G D A E B**. Flats appear in the opposite order: **B E A D G C F**.

To read one:

- **Sharps:** the key is a half step above the last sharp. One sharp, F♯: G major.
- **Flats:** the second-to-last flat names the key. Flats B♭ and E♭: B♭ major. One flat alone is F major.
- **Nothing:** C major.`)] },
      { kind: "listen", blocks: [audio("G major, the key with one sharp", seq("G4 A4 B4 C5 D5 E5 F#5 G5", 110))] },
      { kind: "learn", blocks: [
        staff("treble", "G4/q A4/q B4/q C5/q D5/q E5/q F#5/q G5/q", "G major with its key signature. The sharp on the top line makes every F an F♯, so the F in the scale needs no sign of its own.", { key: "G", names: true }),
        staff("treble", "F4/q G4/q A4/q Bb4/q C5/q D5/q E5/q F5/q", "F major: one flat, B♭, on the middle line.", { key: "F", names: true }),
      ] },
      { kind: "practice", blocks: [
        choice("In what order do sharps appear in a key signature?", ["F C G D A E B", "B E A D G C F", "C G D A E B F"], 0, "Sharps start with F; flats run the same list backwards."),
        choice("A key signature has two sharps, F♯ and C♯. Which major key is it?", ["D major", "A major", "G major"], 0, "A half step above the last sharp, C♯, is D."),
        choice("The flats are B♭, E♭ and A♭. Which major key is it?", ["E♭ major", "A♭ major", "B♭ major"], 0, "The second-to-last flat names the key."),
        choice("Which major key has one flat?", ["F major", "B♭ major", "C major"], 0, "One flat, B♭, is F major."),
        choice("A key signature with no sharps or flats is…", ["C major", "G major", "F major"], 0, "C major uses only natural notes."),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-circle-of-fifths",
    title: "The circle of fifths",
    order: 3,
    concepts: ["circle-of-fifths"],
    needs: ["key-signatures", "fourths-fifths-and-the-tritone"],
    steps: [
      { kind: "understand", blocks: [text(`Start at C major, with no sharps or flats. Go up a perfect fifth to G: one sharp. Up another fifth to D: two sharps. Every step up a fifth adds one sharp.

Go the other way, down a fifth each time, and you collect flats: F has one, B♭ has two, and so on.

Arrange the twelve keys in that order around a circle and you have the **circle of fifths**. Keys that sit side by side differ by just one note, which is why music moves between them so easily.

At the bottom the two sides meet: F♯ major, with six sharps, sounds the same as G♭ major, with six flats.`)] },
      { kind: "listen", blocks: [audio("Climbing in fifths: C, G, D, A", seq("C3 G3 D4 A4", 60))] },
      { kind: "learn", blocks: [circle("C", "Major keys on the outside, their relative minors inside. Tap a key to see its signature.")] },
      { kind: "practice", blocks: [
        choice("Going clockwise, each key is how far above the last?", ["A perfect fifth", "A perfect fourth", "A whole step"], 0, "C to G to D to A: fifths."),
        choice("Clockwise from D, which key comes next?", ["A", "G", "E"], 0, "A perfect fifth above D is A."),
        choice("How many sharps does A major have?", ["3", "2", "4"], 0, "C none, G one, D two, A three."),
        choice("One step anticlockwise from C is…", ["F, with one flat", "G, with one sharp", "B♭, with two flats"], 0, "Down a fifth from C is F."),
        choice("Keys that sit side by side on the circle differ by…", ["One note", "Two notes", "Every note"], 0, "Each step changes a single sharp or flat."),
      ] },
    ],
  },
  {
    ...base,
    slug: "relative-major-and-minor",
    title: "Relative major and minor",
    order: 4,
    concepts: ["relative-keys"],
    needs: ["the-circle-of-fifths"],
    steps: [
      { kind: "understand", blocks: [text(`Every major key has a **relative minor**: a minor key that uses exactly the same notes and the same key signature, but treats a different note as home.

That home is degree 6 of the major scale, three half steps below the tonic.

C major and A minor share all the white keys. G major and E minor share one sharp.

Same notes, different home, different mood. Most people hear major as bright and minor as darker.`)] },
      { kind: "listen", blocks: [
        audio("C major: home is C", seq("C4 D4 E4 F4 G4 A4 B4 C5", 110)),
        audio("A minor: the same notes, home is A", seq("A3 B3 C4 D4 E4 F4 G4 A4", 110)),
      ] },
      { kind: "learn", blocks: [
        show(scale("C", "major"), "C major."),
        show(scale("A", "natural-minor"), "A minor: the same seven notes, with A as home."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the relative minor of C major?", ["A minor", "E minor", "D minor"], 0, "Degree 6 of C major is A."),
        choice("And of G major?", ["E minor", "B minor", "A minor"], 0, "Three half steps below G is E."),
        choice("A major key and its relative minor share…", ["The same notes and key signature", "The same home note", "Nothing"], 0, "Only the home note differs."),
        find("Tap the home note of F major's relative minor.", "D", "Degree 6 of F major, three half steps below F, is D."),
        ear("This tune uses the notes of C major. Which note does it treat as home?", seq("A3 C4 E4 A4 E4 C4 A3", 100), ["A", "C"], 0, "It starts, turns and ends on A: this is A minor."),
      ] },
    ],
  },
  {
    ...base,
    slug: "finding-the-key-of-a-song",
    title: "Working out the key of a song",
    order: 5,
    concepts: ["finding-the-key"],
    needs: ["relative-major-and-minor"],
    steps: [
      { kind: "understand", blocks: [text(`Three clues tell you the key of a song. Use them together.

- **The key signature** narrows it to two: a major key and its relative minor.
- **The last note or chord** is usually home.
- **Your ear:** hum the note on which the music would sound finished. That note is the tonic.

With one sharp, a song that comes to rest on G is in G major. If it comes to rest on E, it is in E minor.`)] },
      { kind: "listen", blocks: [
        audio("One sharp, resting on G: G major", seq("G4 A4 B4 G4 D5 C5 B4 A4 G4", 110)),
        audio("One sharp, resting on E: E minor", seq("E4 F#4 G4 B4 A4 G4 F#4 E4", 110)),
      ] },
      { kind: "learn", blocks: [circle("G", "One sharp means G major or its relative, E minor. The resting note decides between them.")] },
      { kind: "practice", blocks: [
        choice("A key signature has no sharps or flats. Which two keys are possible?", ["C major or A minor", "C major or G major", "A minor or E minor"], 0, "A major key and its relative minor share a signature."),
        choice("One flat, and the song comes to rest on F. The key is…", ["F major", "D minor", "B♭ major"], 0, "One flat is F major or D minor, and it rests on F."),
        choice("One flat, and the song comes to rest on D. The key is…", ["D minor", "F major", "D major"], 0, "Same signature, but home is D."),
        ear("The signature has one sharp, and this tune rests on G. What key is it in?", seq("D4 G4 B4 A4 F#4 G4", 100), ["G major", "E minor"], 0, "One sharp with G as home is G major."),
        ear("Same signature, but this tune rests on E. What key is it in?", seq("B4 G4 E4 F#4 G4 E4", 100), ["E minor", "G major"], 0, "One sharp with E as home is E minor."),
      ] },
    ],
  },
];
