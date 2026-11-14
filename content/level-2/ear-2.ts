import type { LessonInput } from "@/core/schemas/content";
import { along, audio, choice, chord, ear, scale, seq, show, text, together } from "../helpers";

const base = { moduleSlug: "ear-2", isFree: false, version: 1, minutes: 5, strand: "ear" } as const;
const MAJOR_MINOR = ["Major", "Minor"];
const FINISHED = ["Yes: it sounds finished", "No: it is left hanging"];

export const ear2: LessonInput[] = [
  {
    ...base,
    slug: "major-or-minor-sound",
    title: "Major or minor?",
    order: 1,
    concepts: ["ear-major-minor"],
    needs: ["seconds-and-thirds"],
    steps: [
      { kind: "understand", blocks: [text(`Major and minor are the two basic colours of music. Most people hear major as bright and open, and minor as darker or sadder.

The difference is one note moved by one half step: the third. C, E and G together make a major sound. Lower the E to E♭ and it turns minor.

When you listen, aim your ear at the middle note.`)] },
      { kind: "listen", blocks: [
        audio("A major sound: C, E and G together", together("C4 E4 G4")),
        audio("A minor sound: C, E♭ and G together", together("C4 Eb4 G4")),
        audio("The note that changes: E, then E♭", seq("E4 Eb4", 50)),
      ] },
      { kind: "learn", blocks: [
        show(chord("C", "major"), "Major: C, E, G."),
        show(chord("C", "minor"), "Minor: C, E♭, G. Only the middle note has moved."),
      ] },
      { kind: "practice", blocks: [
        ear("Major or minor?", together("G3 B3 D4"), MAJOR_MINOR, 0, "G, B, D: the third is four half steps above the bottom note."),
        ear("Major or minor?", together("A3 C4 E4"), MAJOR_MINOR, 1, "A, C, E: the third is only three half steps up."),
        ear("Major or minor?", together("F3 A3 C4"), MAJOR_MINOR, 0, "F, A, C is major."),
        ear("Major or minor?", together("D4 F4 A4"), MAJOR_MINOR, 1, "D, F, A is minor."),
        ear("Major or minor?", together("E3 G3 B3"), MAJOR_MINOR, 1, "E, G, B is minor."),
      ] },
    ],
  },
  {
    ...base,
    slug: "hearing-intervals-going-up",
    title: "Hearing intervals going up",
    order: 2,
    concepts: ["ear-ascending-intervals"],
    needs: ["major-or-minor-sound", "sixths-sevenths-and-the-octave", "scale-degrees"],
    steps: [
      { kind: "understand", blocks: [text(`To name an interval by ear, treat the lower note as degree 1 and sing up the major scale, counting, until you land on the upper note. If you arrive on 3, it is a major third. If you arrive on 5, a perfect fifth.

If the upper note falls in a gap between two scale notes, it is the minor version of the interval above, or the tritone between 4 and 5.

A few landmarks to learn first: the octave is the same note again, the perfect fifth sounds open and strong, and the major third is the bright start of a major sound.`)] },
      { kind: "listen", blocks: [
        audio("Perfect fifth: degrees 1 and 5", seq("C4 G4", 50)),
        audio("Major third: degrees 1 and 3", seq("C4 E4", 50)),
        audio("Octave: degrees 1 and 8", seq("C4 C5", 50)),
      ] },
      { kind: "learn", blocks: [show(scale("C", "major", "degrees"), "Sing up from 1 and count until you land on the upper note.")] },
      { kind: "practice", blocks: [
        ear("Which interval is this?", seq("D4 A4", 50), ["Perfect fifth", "Major third", "Octave"], 0, "Singing up the scale from D, you land on degree 5."),
        ear("And this?", seq("F4 A4", 50), ["Perfect fifth", "Major third", "Octave"], 1, "The upper note is degree 3."),
        ear("And this?", seq("G3 G4", 50), ["Perfect fifth", "Major third", "Octave"], 2, "The same note, an octave higher."),
        ear("And this?", seq("E4 A4", 50), ["Perfect fourth", "Perfect fifth", "Major third"], 0, "The upper note is degree 4."),
        ear("And this?", seq("A3 B3", 50), ["Major second", "Major third", "Perfect fourth"], 0, "One step up the scale: degree 2."),
        ear("And this?", seq("C4 A4", 50), ["Major sixth", "Perfect fifth", "Octave"], 0, "The upper note is degree 6."),
      ] },
    ],
  },
  {
    ...base,
    slug: "finding-the-home-note",
    title: "Finding the home note",
    order: 3,
    concepts: ["ear-tonic"],
    needs: ["hearing-intervals-going-up", "what-is-a-key"],
    steps: [
      { kind: "understand", blocks: [text(`Every tune pulls towards one note: its home, the tonic.

To find it, listen to the tune and then hum the note that would make it sound finished. Often that is the last note. When a tune stops anywhere else, you can feel it hanging in the air.

Once you can hum the home note, find it on your instrument, and you have the key.`)] },
      { kind: "listen", blocks: [
        audio("A tune that ends at home", seq("C4 E4 G4 E4 D4 C4", 90)),
        audio("The same tune, left hanging", seq("C4 E4 G4 E4 D4", 90)),
      ] },
      { kind: "learn", blocks: [show(scale("C", "major"), "Both tunes use these notes. C is where they come to rest.")] },
      { kind: "practice", blocks: [
        ear("Does this tune come to rest on its home note?", seq("E4 G4 C5 B4 A4 G4 D4", 90), FINISHED, 1, "It stops on D, one step above home."),
        ear("And this one?", seq("G4 E4 F4 D4 C4", 90), FINISHED, 0, "It steps down to C and rests."),
        ear("And this one?", seq("C4 D4 E4 G4 A4 B4", 90), FINISHED, 1, "It stops on B, the leading tone, a half step short of home."),
        ear("And this one, in a different key?", seq("G3 A3 B3 D4 C4 B3 A3 G3", 90), FINISHED, 0, "This tune is in G, and it returns to G."),
        choice("A tune stops on the leading tone. Which way does it want to go?", ["Up a half step, to the tonic", "Down a whole step", "Nowhere: it is at rest"], 0, "The leading tone leans up into home."),
        along("This tune stops one note early. Hum the note that would finish it.", seq("C4 E4 G4 E4 D4"), 70),
      ] },
    ],
  },
];
