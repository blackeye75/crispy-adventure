import type { LessonInput } from "@/core/schemas/content";
import { along, audio, choice, chords, diagram, ear, find, pitches, prog, progression, show, text } from "../helpers";

const base = { moduleSlug: "voice-leading", isFree: false, version: 1, minutes: 6 } as const;

export const voiceLeading: LessonInput[] = [
  {
    ...base,
    slug: "common-tones-and-stepwise-motion",
    title: "Common tones and stepwise motion",
    order: 1,
    concepts: ["voice-leading"],
    needs: ["root-position-and-inversions", "harmonising-the-major-scale"],
    steps: [
      { kind: "understand", blocks: [text(`Think of a chord not as a block but as a few singers, each holding one note. When the chord changes, each singer moves to a note of the new chord. **Voice leading** is the art of making those moves as small as possible.

Two rules do most of the work:

- **Keep common tones.** If a note belongs to both chords, it stays where it is.
- **Move the rest by step.** Each remaining note goes to the nearest note of the new chord.

C major to A minor shares two notes, C and E; only G moves, up to A. C major to F major shares one, C. C major to D minor shares none, so every voice moves a step.

Chords joined this way sound like one flowing thing, not a row of separate blocks.`)] },
      { kind: "listen", blocks: [
        audio("C to Am to F to G, every chord in root position: the hand jumps", chords("C4 E4 G4", "A3 C4 E4", "F3 A3 C4", "G3 B3 D4")),
        audio("The same chords, voice-led: almost nothing moves", chords("C4 E4 G4", "C4 E4 A4", "C4 F4 A4", "B3 D4 G4")),
      ] },
      { kind: "learn", blocks: [
        show(pitches("C4 E4 G4", { strings: [3, 2, 1], within: [3, 5] }), "C major: C E G."),
        show(pitches("C4 E4 A4", { strings: [3, 2, 1], within: [5, 5] }), "A minor: C and E stay, G steps up to A."),
        show(pitches("C4 F4 A4", { strings: [3, 2, 1], within: [5, 6] }), "F major: C and A stay, E steps up to F."),
      ] },
      { kind: "practice", blocks: [
        choice("What is voice leading about?", ["Moving each note of a chord as little as possible", "Playing chords as loudly as possible", "Always using root position"], 0, "Smooth lines between chords."),
        choice("How many notes do C major and A minor share?", ["Two: C and E", "One: C", "None"], 0, "C E G and A C E."),
        choice("How many notes do C major and F major share?", ["One: C", "Two", "None"], 0, "C E G and F A C."),
        choice("How many notes do C major and D minor share?", ["None", "One", "Two"], 0, "C E G and D F A: every voice moves by step."),
        find("You hold C, E and G, and the chord changes to A minor. Tap the note G should move to.", "A", "C and E stay; G steps up to A."),
        ear("Is this progression voice-led smoothly, or does every chord jump?", chords("C4 E4 G4", "C4 E4 A4", "C4 F4 A4", "B3 D4 G4"), ["Smoothly: the notes barely move", "It jumps from chord to chord"], 0, "Each change moves one or two notes by a step."),
      ] },
    ],
  },
  {
    ...base,
    slug: "contrary-motion",
    title: "Contrary motion",
    order: 2,
    concepts: ["contrary-motion"],
    needs: ["common-tones-and-stepwise-motion", "slash-chords"],
    steps: [
      { kind: "understand", blocks: [text(`Two voices can move in relation to each other in four ways.

- **Parallel:** the same direction, keeping the same distance apart.
- **Similar:** the same direction, with the distance changing.
- **Oblique:** one stays while the other moves.
- **Contrary:** opposite directions.

**Contrary motion** is the one to reach for between the melody and the bass. When the top line climbs and the bass falls, the two sound independent, and the music seems to open out. When they close in towards each other, it seems to gather.

A simple example: the bass walks down C, B, A while the melody rises E, G, C. The chords are C, G/B and Am.`)] },
      { kind: "listen", blocks: [
        audio("Contrary motion: bass down C, B, A; melody up E, G, C", chords("C3 E4", "B2 G4", "A2 C5")),
        audio("Parallel motion: both lines move up together", chords("C3 E4", "D3 F4", "E3 G4")),
      ] },
      { kind: "learn", blocks: [{
        type: "notation",
        staves: [{ clef: "treble", notes: "E4/h G4/h | C5/w" }, { clef: "bass", notes: "C3/h B2/h | A2/w" }],
        time: "4/4",
        names: true,
        caption: "The top line rises while the bass falls: contrary motion.",
      }] },
      { kind: "practice", blocks: [
        choice("What is contrary motion?", ["Two voices moving in opposite directions", "Two voices moving the same way", "One voice staying still"], 0, "One rises as the other falls."),
        choice("One voice holds its note while the other moves. What is that called?", ["Oblique motion", "Parallel motion", "Contrary motion"], 0, "One stays, one moves."),
        choice("Which motion makes melody and bass sound most independent?", ["Contrary", "Parallel", "Similar"], 0, "Opposite directions keep the two lines distinct."),
        ear("Contrary or parallel?", chords("C3 E4", "B2 G4", "A2 C5"), ["Contrary: the lines move apart", "Parallel: they move together"], 0, "The bass falls while the top rises."),
        ear("And this?", chords("C3 E4", "D3 F4", "E3 G4"), ["Contrary: the lines move apart", "Parallel: they move together"], 1, "Both lines climb by step, a tenth apart."),
      ] },
    ],
  },
  {
    ...base,
    slug: "guide-tone-lines",
    title: "Guide-tone lines",
    order: 3,
    concepts: ["guide-tone-lines"],
    needs: ["contrary-motion", "guide-tones"],
    steps: [
      { kind: "understand", blocks: [text(`You have seen the third and seventh of each chord move by half step through a ii–V–I. Stretch the progression and the pattern keeps going.

Take vi, ii, V, I in C with seventh chords: Am7, Dm7, G7, Cmaj7. The roots fall by a fifth each time. Now follow just two voices:

- One line: **G, F, F, E**.
- The other: **C, C, B, B**.

At every change, one voice stays and the other falls a step. The note that was the third of one chord becomes the seventh of the next without moving; the old seventh steps down to become the new third.

These two **guide-tone lines** are the thread through any progression whose roots fall by fifths. Play them alone and you can still hear every chord.`)] },
      { kind: "listen", blocks: [
        audio("The two guide-tone lines alone", chords("C4 G4", "C4 F4", "B3 F4", "B3 E4")),
        audio("The full progression: Am7, Dm7, G7, Cmaj7", prog("C", "vi7 ii7 V7 Imaj7", 66)),
      ] },
      { kind: "learn", blocks: [show(progression("C", "vi7 ii7 V7 Imaj7"), "Press play and follow the thirds and sevenths through Am7, Dm7, G7, Cmaj7.")] },
      { kind: "practice", blocks: [
        choice("When roots fall by a fifth, what does the third of a chord become in the next chord?", ["The seventh, without moving", "The root", "The fifth"], 0, "C is the third of Am7 and the seventh of Dm7."),
        choice("And what does the seventh do?", ["Falls a step to become the next third", "Stays where it is", "Leaps up a fifth"], 0, "G, the seventh of Am7, falls to F, the third of Dm7."),
        choice("From Dm7 to G7, which guide tone moves?", ["C falls to B", "F falls to E", "Neither"], 0, "F stays as the seventh of G7."),
        choice("From G7 to Cmaj7, which guide tone moves?", ["F falls to E", "B falls to A", "Neither"], 0, "B stays as the seventh of Cmaj7."),
        ear("These are two guide-tone lines. At each change, how many of the two notes move?", chords("C4 G4", "C4 F4", "B3 F4", "B3 E4"), ["One", "Both"], 0, "One stays, one steps down, every time."),
      ] },
    ],
  },
  {
    ...base,
    slug: "drop-2-voicings",
    title: "Drop-2 voicings",
    order: 4,
    strand: "guitar",
    concepts: ["drop-2"],
    needs: ["guide-tone-lines", "movable-seventh-chord-shapes"],
    steps: [
      { kind: "understand", blocks: [text(`A seventh chord in close position, C E G B, is almost unplayable on the guitar: the notes are too near each other for the tuning. **Drop-2** voicings fix that.

Take a close voicing and **drop the second note from the top** down an octave. C E G B becomes G C E B: four notes that fall neatly on four neighbouring strings.

On strings 4, 3, 2 and 1:

- **Dm7:** frets 7, 7, 6, 8.
- **G7:** frets 5, 7, 6, 7.
- **Cmaj7:** frets 5, 5, 5, 7.

Play them in that order and you have a ii–V–I in which every voice moves by a step or stays put. Drop-2 chords are compact, clear, and the standard vocabulary of jazz guitar accompaniment.`)] },
      { kind: "listen", blocks: [audio("ii–V–I in drop-2 voicings: Dm7, G7, Cmaj7", chords("A3 D4 F4 C5", "G3 D4 F4 B4", "G3 C4 E4 B4"))] },
      { kind: "learn", blocks: [
        diagram("x-x-7-7-6-8", "D", "m7", "Dm7: A, D, F, C from string 4 to string 1."),
        diagram("x-x-5-7-6-7", "G", "7", "G7: D and F have not moved; A fell to G and C fell to B."),
        diagram("x-x-5-5-5-7", "C", "maj7", "Cmaj7: G and B stay; D fell to C and F fell to E."),
      ] },
      { kind: "practice", blocks: [
        choice("How is a drop-2 voicing made?", ["Drop the second note from the top down an octave", "Leave out the second note", "Play two notes only"], 0, "From a close voicing."),
        choice("C E G B in close position becomes which drop-2 voicing?", ["G C E B", "C G E B", "E C G B"], 0, "G, second from the top, moves to the bottom."),
        choice("From Dm7 (7, 7, 6, 8) to G7 (5, 7, 6, 7), how many strings change fret?", ["Two", "Four", "None"], 0, "Strings 4 and 1 move; strings 3 and 2 stay."),
        find("In the Cmaj7 voicing 5, 5, 5, 7, tap the note on string 1.", "B4", "Fret 7 of string 1 is B, the seventh of the chord.", { strings: [1], only: "guitar" }),
        along("Play Dm7, G7, Cmaj7 in drop-2 voicings, two beats each.", chords("A3 D4 F4 C5", "G3 D4 F4 B4", "G3 C4 E4 B4", "G3 C4 E4 B4"), 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "rootless-voicings",
    title: "Rootless voicings",
    order: 5,
    strand: "piano",
    concepts: ["rootless-voicings"],
    needs: ["guide-tone-lines", "shell-voicings"],
    steps: [
      { kind: "understand", blocks: [text(`When a bass player is playing the roots, the pianist does not need to. Leaving the root out frees a finger for a more colourful note. That is a **rootless voicing**.

The usual recipe is four notes built around the guide tones, with the 5th and the 9th or 13th for colour. For a ii–V–I in C, in one hand:

- **Dm9:** F A C E. That is 3, 5, 7, 9.
- **G13:** F A B E. That is 7, 9, 3, 13.
- **Cmaj9:** E G B D. That is 3, 5, 7, 9.

From Dm9 to G13 only one note moves: C falls to B. From G13 to Cmaj9, B stays and the other three notes each step down.

Alone they can sound ambiguous. Add the root in the bass and they sound rich and complete.`)] },
      { kind: "listen", blocks: [
        audio("The rootless voicings alone: Dm9, G13, Cmaj9", chords("F3 A3 C4 E4", "F3 A3 B3 E4", "E3 G3 B3 D4")),
        audio("With the roots played below", chords("D3 F3 A3 C4 E4", "G2 F3 A3 B3 E4", "C3 E3 G3 B3 D4")),
      ] },
      { kind: "learn", blocks: [
        show(pitches("F3 A3 C4 E4"), "Dm9 without its root: F A C E.", "piano"),
        show(pitches("F3 A3 B3 E4"), "G13 without its root: only C has moved, down to B.", "piano"),
        show(pitches("E3 G3 B3 D4"), "Cmaj9 without its root: E G B D.", "piano"),
      ] },
      { kind: "practice", blocks: [
        choice("Why can a pianist leave out the root?", ["The bass player is playing it", "The root is never needed", "It is too hard to reach"], 0, "The root is covered elsewhere in the band."),
        choice("Which notes are the rootless Dm9 voicing?", ["F A C E", "D F A C", "D A C E"], 0, "Third, fifth, seventh and ninth."),
        choice("From the Dm9 voicing to the G13 voicing, which note moves?", ["C falls to B", "F falls to E", "A falls to G"], 0, "The seventh of Dm becomes the third of G."),
        find("Rootless Cmaj9 is E, G, B and one more note. Tap it.", "D", "D is the ninth of C.", { only: "piano" }),
        choice("In the G13 voicing F A B E, which note is the 13th?", ["E", "A", "F"], 0, "E is a sixth above G, played an octave higher: the 13th."),
        ear("Is the root sounding in the bass, or is this voicing alone?", chords("D3 F3 A3 C4 E4", "G2 F3 A3 B3 E4", "C3 E3 G3 B3 D4"), ["The roots are in the bass", "The voicings are alone"], 0, "D, G and C sound underneath."),
      ] },
    ],
  },
];
