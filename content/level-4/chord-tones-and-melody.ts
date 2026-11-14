import type { LessonInput } from "@/core/schemas/content";
import { along, audio, choice, chordOf, chords, ear, find, prog, progression, rhythm, seq, show, staff, text } from "../helpers";

const base = { moduleSlug: "chord-tones-and-melody", isFree: false, version: 1, minutes: 6 } as const;

export const chordTonesAndMelody: LessonInput[] = [
  {
    ...base,
    slug: "targeting-chord-tones",
    title: "Targeting chord tones",
    order: 1,
    concepts: ["chord-tones"],
    needs: ["one-four-five", "the-major-pentatonic-scale"],
    steps: [
      { kind: "understand", blocks: [text(`A scale tells you which notes fit the key. It does not tell you which notes fit **this chord, right now**.

The notes of the chord being played are its **chord tones**. A melody note that is a chord tone sounds settled and sure. The other scale notes sound like they are on their way somewhere.

So the first rule of melodic playing: when the chord changes, **land on a note of the new chord**. Over C, aim for C, E or G. When the harmony moves to F, aim for F, A or C.

This is what makes a solo sound as though it knows the song, instead of running up and down a scale.`)] },
      { kind: "listen", blocks: [
        audio("Over C then F: a melody landing on chord tones, E then A", seq("G4 E4 C5 A4", 70)),
        audio("The chords underneath: C, then F", prog("C", "I IV", 70)),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("C", "major"), "Over a C chord, the chord tones are C, E and G."),
        show(chordOf("F", "major"), "Over an F chord, they are F, A and C."),
      ] },
      { kind: "practice", blocks: [
        choice("What are the chord tones of a C major chord?", ["C, E and G", "C, D and E", "C, F and G"], 0, "The notes of the chord itself."),
        choice("The chord changes from C to F. Which note is a good one to land on?", ["A", "B", "E"], 0, "A is the third of F; B and E are not in the F chord."),
        find("The chord is G major. Tap its third.", "B", "G B D: the third is B."),
        choice("Which note belongs to both the C chord and the F chord?", ["C", "E", "A"], 0, "C is the root of one and the fifth of the other."),
        choice("How does a melody note that is a chord tone sound?", ["Settled", "Clashing", "Out of key"], 0, "It agrees with the harmony underneath."),
      ] },
    ],
  },
  {
    ...base,
    slug: "passing-and-neighbour-tones",
    title: "Passing tones and neighbour tones",
    order: 2,
    concepts: ["non-chord-tones"],
    needs: ["targeting-chord-tones"],
    steps: [
      { kind: "understand", blocks: [text(`A melody made only of chord tones sounds like an arpeggio. The notes between them give it shape, and there are two basic ways to use them.

A **passing tone** fills the gap between two different chord tones by step. Over a C chord, going from C to E, the D in the middle is a passing tone.

A **neighbour tone** steps away from a chord tone and straight back. Over a C chord, E to F to E: the F is a neighbour tone.

Both work best on weak beats, with the chord tones on the strong ones. The ear accepts almost any note that arrives by step and leaves by step.`)] },
      { kind: "listen", blocks: [
        audio("A passing tone: C, D, E over a C chord", seq("C4 D4 E4", 80)),
        audio("A neighbour tone: E, F, E over a C chord", seq("E4 F4 E4", 80)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", "C4/q D4/q E4/h | E4/q F4/q E4/h", "Bar 1: D passes between C and E. Bar 2: F steps away from E and returns.", { time: true, names: true }),
      ] },
      { kind: "practice", blocks: [
        choice("What does a passing tone do?", ["Connects two different chord tones by step", "Steps away and comes back", "Leaps to a new chord"], 0, "It passes through on the way."),
        choice("Over a C chord, E to F to E. What is the F?", ["A neighbour tone", "A passing tone", "A chord tone"], 0, "It leaves E by step and returns to E."),
        choice("Over a C chord, moving from E up to G, which note passes between them?", ["F", "D", "A"], 0, "E, F, G: F fills the gap."),
        choice("Where do passing and neighbour tones usually sit?", ["On weak beats", "On the first beat of the bar", "Only at the end"], 0, "The chord tones take the strong beats."),
        ear("Passing tone or neighbour tone?", seq("G4 A4 G4", 80), ["Neighbour tone", "Passing tone"], 0, "The melody steps up and comes straight back to G."),
        ear("And this?", seq("G4 F4 E4", 80), ["Neighbour tone", "Passing tone"], 1, "F carries the melody from G down to E."),
      ] },
    ],
  },
  {
    ...base,
    slug: "guide-tones",
    title: "Guide tones: thirds and sevenths",
    order: 3,
    concepts: ["guide-tones"],
    needs: ["passing-and-neighbour-tones", "seventh-chords-of-the-major-key", "two-five-one"],
    steps: [
      { kind: "understand", blocks: [text(`In a seventh chord, the third and the seventh define its character. They are called its **guide tones**.

Follow them through a ii–V–I in C and something neat appears:

- Dm7: third F, seventh C.
- G7: third B, seventh F.
- Cmaj7: third E, seventh B.

From Dm7 to G7, the F stays and the C slips down a half step to B. From G7 to Cmaj7, the B stays and the F slips down a half step to E.

A line that follows these small moves is a **guide-tone line**. Two notes, moving a half step at a time, spell out the whole progression. Build a melody around them and it will always fit the chords.`)] },
      { kind: "listen", blocks: [
        audio("The guide tones alone: F and C, then F and B, then E and B", chords("F3 C4", "F3 B3", "E3 B3")),
        audio("The full progression: Dm7, G7, Cmaj7", prog("C", "ii7 V7 Imaj7", 66)),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "ii7 V7 Imaj7"), "Press play and watch the thirds and sevenths: from one chord to the next they barely move."),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes of a seventh chord are its guide tones?", ["The third and the seventh", "The root and the fifth", "The root and the third"], 0, "They decide what kind of chord it is."),
        choice("What are the guide tones of G7?", ["B and F", "G and D", "D and F"], 0, "Third B, seventh F."),
        choice("From Dm7 to G7, where does the note C go?", ["Down a half step to B", "Up a whole step to D", "It stays"], 0, "The seventh of Dm7 falls to the third of G7."),
        choice("From G7 to Cmaj7, where does the note F go?", ["Down a half step to E", "Up to G", "It stays"], 0, "The seventh of G7 falls to the third of Cmaj7."),
        find("Tap the third of Cmaj7.", "E", "C E G B: the third is E."),
      ] },
    ],
  },
  {
    ...base,
    slug: "building-a-melody",
    title: "Building a melody over a progression",
    order: 4,
    concepts: ["melody-writing"],
    needs: ["guide-tones"],
    steps: [
      { kind: "understand", blocks: [text(`You now have everything needed to write a melody that fits a set of chords. A method that always works:

- **Choose a target** for each chord: one of its chord tones, ideally the third.
- **Put the targets on strong beats**, usually beat 1 of each bar.
- **Connect them** with passing and neighbour tones from the scale.
- **Repeat a rhythm.** A short rhythmic idea used twice sounds like a melody; new rhythms every bar sound like wandering.
- **Leave space.** A rest is part of the tune.

Over C, F, G, C, the targets E, A, B, C already make a line. The notes between are yours to choose.`)] },
      { kind: "listen", blocks: [
        audio("The targets alone: E, A, B, C", seq("E4 A4 B4 C5", 50)),
        audio("The same targets joined into a melody", rhythm("E4/q D4/8 E4/8 G4/h | A4/q G4/8 A4/8 C5/h | B4/q A4/8 B4/8 D5/h | C5/w", 90)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", "E4/q D4/8 E4/8 G4/h | A4/q G4/8 A4/8 C5/h | B4/q A4/8 B4/8 D5/h | C5/w", "The first three bars start on the third of their chord, E over C, A over F and B over G, and share one rhythm. The last bar comes home to C.", { time: true, bpm: 90 }),
      ] },
      { kind: "practice", blocks: [
        choice("Where should the target notes of a melody fall?", ["On strong beats", "On the weakest beats", "Only at the very end"], 0, "The ear checks the harmony on strong beats."),
        choice("Over an F chord, which note is the strongest target?", ["A, the third", "B", "E"], 0, "The third says most clearly which chord it is."),
        choice("What helps a line sound like a melody rather than wandering?", ["Repeating a rhythm", "Changing the rhythm in every bar", "Using every note of the scale"], 0, "Repetition makes an idea recognisable."),
        choice("Over C, F, G, C, the thirds of the chords are…", ["E, A, B, E", "C, F, G, C", "G, C, D, G"], 0, "The third of each: E, A, B and E again."),
        ear("Does each bar of this melody begin on a note of its chord? The chords are C, then F.", rhythm("E4/q D4/8 E4/8 G4/h | A4/q G4/8 A4/8 C5/h", 90), ["Yes", "No"], 0, "E over C and A over F: both are thirds."),
        along("Make up your own melody over C, F, G, C. Aim for E, A, B, C at the start of each chord.", prog("C", "I IV V I"), 60),
      ] },
    ],
  },
];
