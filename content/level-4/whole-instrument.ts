import type { LessonInput } from "@/core/schemas/content";
import { along, audio, choice, chords, diagram, find, pitches, position, rhythm, scale, seq, shape, show, text } from "../helpers";

const base = { moduleSlug: "whole-instrument", isFree: false, version: 1, minutes: 7 } as const;
const guitar = { ...base, strand: "guitar" } as const;
const piano = { ...base, strand: "piano" } as const;
const G = { only: "guitar" } as const;
const THREE_PER_STRING = "6:3 6:5 6:7 5:3 5:5 5:7 4:4 4:5 4:7 3:4 3:5 3:7 2:5 2:7 2:8 1:5 1:7 1:8";

export const wholeInstrument: LessonInput[] = [
  {
    ...guitar,
    slug: "the-caged-system",
    title: "The CAGED system",
    order: 1,
    concepts: ["caged"],
    needs: ["barre-chords", "octave-shapes"],
    steps: [
      { kind: "understand", blocks: [text(`You know five open major chord shapes: C, A, G, E and D. **CAGED** is the discovery that those five shapes, moved up the neck, are all the same chord in five different places.

Take C major. Its open shape is the C shape. Further up:

- the **A shape** at fret 3,
- the **G shape** at fret 5,
- the **E shape** at fret 8,
- the **D shape** at fret 10,

and then the C shape again at fret 12. The order always spells C-A-G-E-D, and each shape shares notes with the next.

The same is true for every major chord; only the starting shape changes.`)] },
      { kind: "listen", blocks: [audio("C major in its C, A, G, E and D shapes, climbing the neck", chords("C3 E3 G3 C4 E4", "C3 G3 C4 E4 G4", "C3 E3 G3 C4 E4 C5", "C3 G3 C4 E4 G4 C5", "C4 G4 C5 E5"))] },
      { kind: "learn", blocks: [
        diagram("x32010", "C", "major", "C shape: open position."),
        diagram("x35553", "C", "major", "A shape: barre at fret 3."),
        diagram("8-7-5-5-5-8", "C", "major", "G shape: frets 5 to 8."),
        diagram("8-10-10-9-8-8", "C", "major", "E shape: barre at fret 8."),
        diagram("x-x-10-12-13-12", "C", "major", "D shape: frets 10 to 13."),
      ] },
      { kind: "practice", blocks: [
        choice("What does CAGED describe?", ["Five shapes that play the same chord in five places", "Five different chords in one key", "The names of the open strings"], 0, "One chord, five shapes, up the whole neck."),
        choice("C major as an E shape has its barre at which fret?", ["Fret 8", "Fret 3", "Fret 5"], 0, "The E shape's root is on string 6, and fret 8 there is C."),
        choice("After the C shape, which shape comes next up the neck?", ["The A shape", "The G shape", "The D shape"], 0, "The order spells C-A-G-E-D."),
        choice("C major as an A shape has its root at which fret of string 5?", ["Fret 3", "Fret 5", "Fret 8"], 0, "Fret 3 of string 5 is C."),
        find("G major as an E shape: tap its root on string 6.", "G2", "Fret 3 of string 6 is G.", { strings: [6], ...G }),
        choice("For D major, which shape is the open one?", ["The D shape", "The C shape", "The E shape"], 0, "Every major chord starts from its own open shape, or the nearest one, and follows the same order."),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "five-major-scale-positions",
    title: "Five major scale positions",
    order: 2,
    concepts: ["major-scale-positions"],
    needs: ["the-caged-system", "guitar-major-scale-shapes"],
    steps: [
      { kind: "understand", blocks: [text(`Each CAGED chord shape sits inside a **major scale position**: the notes of the scale that lie under your hand around that shape.

For C major the five positions are:

- **C shape:** frets 0 to 3.
- **A shape:** frets 2 to 6.
- **G shape:** frets 4 to 8.
- **E shape:** frets 7 to 10.
- **D shape:** frets 9 to 13.

Because the chord lives inside the scale position, you always know where the chord tones are while you play the scale. For another key, slide the whole set: G major's E-shape position starts at fret 2 instead of fret 7.`)] },
      { kind: "listen", blocks: [audio("C major in the E-shape position, from string 6 up", seq("B2 C3 D3 E3 F3 G3 A3 B3 C4 D4 E4 F4 G4 A4 B4 C5 D5", 150))] },
      { kind: "learn", blocks: [
        show(position("C", "major", 0, 3), "C shape: frets 0 to 3.", "guitar"),
        show(position("C", "major", 2, 6), "A shape: frets 2 to 6.", "guitar"),
        show(position("C", "major", 4, 8), "G shape: frets 4 to 8.", "guitar"),
        show(position("C", "major", 7, 10), "E shape: frets 7 to 10.", "guitar"),
        show(position("C", "major", 9, 13), "D shape: frets 9 to 13.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("What sits inside each major scale position?", ["One of the CAGED chord shapes", "A different scale", "Only open strings"], 0, "The chord is the skeleton of the position."),
        choice("In C major, the E-shape position covers which frets?", ["7 to 10", "0 to 3", "4 to 8"], 0, "It surrounds the E-shape barre chord at fret 8."),
        find("In the E-shape position of C major, tap the root on string 6.", "C3", "Fret 8 of string 6 is C.", { strings: [6], ...G }),
        choice("To play the E-shape position in G major, where is the root on string 6?", ["Fret 3", "Fret 8", "Fret 5"], 0, "G is at fret 3 of string 6."),
        choice("How many positions cover the neck before the pattern repeats?", ["Five", "Three", "Seven"], 0, "One for each CAGED shape."),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "three-notes-per-string",
    title: "Three-notes-per-string scales",
    order: 3,
    concepts: ["three-notes-per-string"],
    needs: ["five-major-scale-positions"],
    steps: [
      { kind: "understand", blocks: [text(`A second way to lay out a scale puts exactly **three notes on every string**.

G major, starting from G at fret 3 of string 6:

- String 6: frets 3, 5, 7.
- String 5: frets 3, 5, 7.
- String 4: frets 4, 5, 7.
- String 3: frets 4, 5, 7.
- String 2: frets 5, 7, 8.
- String 1: frets 5, 7, 8.

The pattern drifts up the neck as it crosses the strings, covering more ground than a CAGED position. Because every string has the same number of notes, it suits fast, even runs. There are seven of these patterns, one starting from each note of the scale.`)] },
      { kind: "listen", blocks: [audio("G major, three notes per string", seq("G2 A2 B2 C3 D3 E3 F#3 G3 A3 B3 C4 D4 E4 F#4 G4 A4 B4 C5", 160))] },
      { kind: "learn", blocks: [show(shape(THREE_PER_STRING), "G major with three notes on every string, from fret 3 to fret 8.", "guitar")] },
      { kind: "practice", blocks: [
        choice("How many notes does each string carry in this kind of pattern?", ["Three", "Two", "Four"], 0, "Three on every string, without exception."),
        find("In the G major pattern, tap the third note on string 6.", "B2", "Frets 3, 5 and 7: G, A, B.", { strings: [6], ...G }),
        choice("In the G major pattern, which frets are used on string 4?", ["4, 5 and 7", "3, 5 and 7", "5, 7 and 8"], 0, "F♯, G and A."),
        choice("What is this layout especially good for?", ["Fast, even runs", "Open chords", "Playing in one fret only"], 0, "The same number of notes on each string keeps the picking regular."),
        choice("How many three-notes-per-string patterns does a major scale have?", ["Seven", "Five", "Three"], 0, "One starting from each of the seven notes."),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "linking-positions",
    title: "Linking positions along the neck",
    order: 4,
    concepts: ["linking-positions"],
    needs: ["five-pentatonic-positions", "three-notes-per-string"],
    steps: [
      { kind: "understand", blocks: [text(`Knowing five boxes is not the same as knowing the neck. The skill is moving between them without stopping.

Three ways to travel:

- **Through shared notes.** Neighbouring positions overlap. Play up to a note they share, then carry on in the next position.
- **Along one string.** Stay on a single string and follow the scale up it; you pass through every position in turn.
- **By octave.** Find the same root an octave higher with an octave shape and restart the pattern there.

A good exercise is to climb the neck in position 1, cross into position 2 on the top strings, and come back down in position 2.`)] },
      { kind: "listen", blocks: [audio("A minor pentatonic along string 3, passing through every position", seq("A3 C4 D4 E4 G4", 100))] },
      { kind: "learn", blocks: [
        show(position("A", "minor-pentatonic", 5, 10), "Positions 1 and 2 together: frets 5 to 10. The notes at frets 7 and 8 belong to both.", "guitar"),
        show(shape("3:2 3:5 3:7 3:9 3:12"), "A minor pentatonic along string 3: frets 2, 5, 7, 9 and 12.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("What makes it possible to slide from one position into the next?", ["They share notes", "They use different scales", "They are tuned differently"], 0, "The edge of one box is the edge of the next."),
        find("A minor pentatonic along string 3: tap the note after fret 5.", "D4", "C at fret 5, then D at fret 7.", { strings: [3], ...G }),
        choice("Playing a scale along a single string takes you…", ["Through every position in turn", "Nowhere new", "Out of the key"], 0, "Each note on the string belongs to a different box."),
        choice("Which tool finds the same root one octave higher?", ["An octave shape", "A capo", "A barre"], 0, "Two strings over and two or three frets up."),
        along("Climb position 1, then come back down in position 2.", seq("A2 C3 D3 E3 G3 A3 C4 D4 E4 G4 A4 C5 D5 C5 A4 G4 E4 D4 C4 A3 G3 E3 D3 C3"), 70, position("A", "minor-pentatonic", 5, 10)),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "triads-across-the-neck",
    title: "Triads across the neck",
    order: 5,
    concepts: ["triads-across-the-neck"],
    needs: ["triad-shapes-on-three-strings", "the-caged-system"],
    steps: [
      { kind: "understand", blocks: [text(`A three-note triad fits on any three neighbouring strings, so one chord can be played on four different string sets. C major in root position:

- Strings 6, 5, 4: frets 8, 7, 5.
- Strings 5, 4, 3: frets 3, 2, 0.
- Strings 4, 3, 2: frets 10, 9, 8.
- Strings 3, 2, 1: frets 5, 5, 3.

Small triads are how guitarists play chords high up the neck and stay out of the bass player's way.

They also make changes easy. On strings 3, 2 and 1, the chords C, F and G sit almost on top of one another: C is 5, 5, 3; F is 5, 6, 5; G is 4, 3, 3.`)] },
      { kind: "listen", blocks: [audio("C, F, G, C as small triads on the top three strings", chords("C4 E4 G4", "C4 F4 A4", "B3 D4 G4", "C4 E4 G4"))] },
      { kind: "learn", blocks: [
        show(shape("6:8 5:7 4:5"), "C major on strings 6, 5, 4.", "guitar"),
        show(shape("3:5 2:5 1:3"), "C major on strings 3, 2, 1: frets 5, 5, 3.", "guitar"),
        show(shape("3:5 2:6 1:5"), "F major right beside it: frets 5, 6, 5. The C on string 3 has not moved.", "guitar"),
        show(shape("3:4 2:3 1:3"), "G major: frets 4, 3, 3.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("On how many sets of three neighbouring strings can a triad be played?", ["Four", "Two", "Six"], 0, "Strings 6-5-4, 5-4-3, 4-3-2 and 3-2-1."),
        find("C major on strings 3, 2, 1: tap the note on string 1.", "G4", "Fret 3 of string 1 is G, the fifth.", { strings: [1], ...G }),
        choice("Going from C (5, 5, 3) to F (5, 6, 5) on the top strings, which note stays?", ["C, on string 3", "E, on string 2", "G, on string 1"], 0, "C belongs to both chords."),
        choice("The F shape 5, 6, 5 is F major in which inversion?", ["Second inversion: C is lowest", "Root position", "First inversion"], 0, "Its lowest note is C, the fifth of F."),
        along("Play C, F, G, C with the three small shapes, two beats each.", chords("C4 E4 G4", "C4 F4 A4", "B3 D4 G4", "C4 E4 G4"), 60),
      ] },
    ],
  },
  {
    ...piano,
    slug: "scales-in-every-key",
    title: "Scales in every key",
    order: 6,
    concepts: ["piano-all-scales"],
    needs: ["piano-major-scale-fingering", "the-natural-minor-scale"],
    steps: [
      { kind: "understand", blocks: [text(`Twelve major scales and twelve minor scales sounds like a lot to learn. Three ideas shrink it.

**The white-key group.** C, G, D, A and E major share one fingering, which you already know. The minor scales on those same five notes use it too.

**The black-key rule.** In every other scale, the long fingers take the black keys and the thumbs take white keys. Fingers 2 and 3 sit on the group of two black keys; fingers 2, 3 and 4 sit on the group of three.

**One new note at a time.** Follow the circle of fifths. Each key keeps six notes of the last one and changes a single note, so each new scale is a small step from one you know.`)] },
      { kind: "listen", blocks: [
        audio("D major: two sharps", seq("D4 E4 F#4 G4 A4 B4 C#5 D5", 110)),
        audio("B♭ major: two flats", seq("Bb3 C4 D4 Eb4 F4 G4 A4 Bb4", 110)),
      ] },
      { kind: "learn", blocks: [
        show(scale("D", "major"), "D major with the white-key fingering: in the right hand F♯ falls under finger 3 and C♯ under finger 4.", "piano"),
        show(scale("Bb", "major"), "B♭ major: the two flats are black keys, so the thumbs stay on white keys.", "piano"),
      ] },
      { kind: "practice", blocks: [
        choice("Which major scales share the fingering of C major?", ["G, D, A and E", "F and B♭", "All of them"], 0, "The white-key group: C, G, D, A, E."),
        choice("In scales with black keys, where do the thumbs go?", ["On white keys", "On black keys", "On the first note, always"], 0, "The long fingers take the black keys."),
        choice("Which fingers sit on the group of three black keys?", ["2, 3 and 4", "1, 2 and 3", "3, 4 and 5"], 0, "And 2 and 3 on the group of two."),
        choice("Moving one step round the circle of fifths changes how many notes of the scale?", ["One", "Two", "Three"], 0, "Each new key adds one sharp or drops one flat."),
        along("Play D major up and down, right hand, along with the track.", seq("D4 E4 F#4 G4 A4 B4 C#5 D5 C#5 B4 A4 G4 F#4 E4 D4"), 60, scale("D", "major")),
      ] },
    ],
  },
  {
    ...piano,
    slug: "arpeggios",
    title: "Arpeggios",
    order: 7,
    concepts: ["piano-arpeggios"],
    needs: ["block-and-broken-chords", "scales-in-every-key"],
    steps: [
      { kind: "understand", blocks: [text(`An **arpeggio** plays the notes of a chord one after another, up and down the keyboard. Where a scale moves by step, an arpeggio moves by skip, so the hand has to open out.

For C major over one octave the right hand plays **1 2 3 5**: C, E, G, C.

Over two octaves the thumb passes under, just as in a scale: **1 2 3, 1 2 3 5**.

The left hand going up plays **5 4 2 1** for one octave.

The shape under the hand changes from chord to chord depending on where the black keys fall, but the idea is the same in every key: the three notes of the triad, repeated octave after octave.`)] },
      { kind: "listen", blocks: [
        audio("C major arpeggio, one octave up and down", seq("C4 E4 G4 C5 G4 E4 C4", 110)),
        audio("C major arpeggio, two octaves", seq("C3 E3 G3 C4 E4 G4 C5", 140)),
      ] },
      { kind: "learn", blocks: [show(pitches("C3 E3 G3 C4 E4 G4 C5"), "C major arpeggio over two octaves: only C, E and G.", "piano")] },
      { kind: "practice", blocks: [
        choice("How does an arpeggio move, compared with a scale?", ["By skips, through the notes of a chord", "By steps, through every note", "By octaves only"], 0, "It outlines the chord."),
        choice("Right hand, C major arpeggio over one octave: which fingers?", ["1 2 3 5", "1 2 3 4", "1 3 5 5"], 0, "C, E, G and the C above."),
        choice("In a two-octave arpeggio, what does the thumb do after finger 3?", ["Passes under to start the next octave", "Stays where it is", "Crosses over the top"], 0, "1 2 3, then 1 again."),
        choice("Which notes are in an A minor arpeggio?", ["A, C and E", "A, B and C", "A, D and E"], 0, "The notes of the A minor triad."),
        along("Play the C major arpeggio up and down, along with the track.", seq("C4 E4 G4 C5 G4 E4 C4"), 60, pitches("C4 E4 G4 C5")),
      ] },
    ],
  },
  {
    ...piano,
    slug: "spread-voicings",
    title: "Close and spread voicings",
    order: 8,
    concepts: ["piano-voicings"],
    needs: ["smooth-chord-changes"],
    steps: [
      { kind: "understand", blocks: [text(`A **voicing** is the way a chord's notes are arranged: which octave each one is in and how far apart they are.

In a **close voicing** the notes are packed as tightly as possible: C E G within one hand.

In a **spread voicing** they are opened out. Take the middle note of C E G and move it up an octave: C, G, and E on top. The same three notes now cover more than an octave.

Spread voicings sound fuller and clearer, especially low down, where close chords turn muddy. They usually take both hands: the left plays the root, or root and fifth, and the right takes the rest.`)] },
      { kind: "listen", blocks: [
        audio("C major, close: C E G", chords("C3 E3 G3", "C3 E3 G3")),
        audio("C major, spread: C, G, then E above", chords("C3 G3 E4", "C3 G3 E4")),
      ] },
      { kind: "learn", blocks: [
        show(pitches("C3 E3 G3"), "Close voicing: all three notes within a fifth.", "piano"),
        show(pitches("C3 G3 E4"), "Spread voicing: the E has moved up an octave.", "piano"),
      ] },
      { kind: "practice", blocks: [
        choice("What is a voicing?", ["How the notes of a chord are arranged", "A different chord", "How loudly a chord is played"], 0, "Same notes, different spacing and octaves."),
        choice("To turn C E G into a spread voicing, which note moves up an octave?", ["The middle note, E", "The root, C", "All of them"], 0, "C, G, then E on top."),
        choice("Why are spread voicings useful low on the keyboard?", ["Close chords sound muddy down there", "Low notes cannot be played together", "They are quieter"], 0, "Space between low notes keeps them clear."),
        find("Spread voicing of F major, root at the bottom: after F and C, tap the top note.", "A", "F, C, then A above: the third moved up an octave.", { only: "piano" }),
        choice("In a two-handed spread voicing, what does the left hand usually play?", ["The root, or root and fifth", "The melody", "Only black keys"], 0, "The right hand takes the remaining notes above."),
      ] },
    ],
  },
  {
    ...piano,
    slug: "accompaniment-patterns",
    title: "Accompaniment patterns",
    order: 9,
    concepts: ["piano-accompaniment"],
    needs: ["left-hand-patterns", "spread-voicings"],
    steps: [
      { kind: "understand", blocks: [text(`To accompany a singer or another instrument, the piano supplies bass and chords together. Three patterns cover a lot of songs.

- **Root and pulses.** The left hand plays the root on beat 1; the right hand repeats the chord on every beat. Steady and simple.
- **Bass and chord.** The left hand plays the root on beats 1 and 3; the right hand answers with the chord on beats 2 and 4.
- **Rolling arpeggio.** The left hand rolls up through root, fifth and octave while the right hand holds the chord. This suits slow songs.

In all three the left hand gives the bass and the right hand stays in the middle of the keyboard, out of the melody's way.`)] },
      { kind: "listen", blocks: [
        audio("Bass on 1 and 3, chord on 2 and 4", rhythm("C3/q C4+E4+G4/q G2/q C4+E4+G4/q | C3/q C4+E4+G4/q G2/q C4+E4+G4/q")),
        audio("A rolling left hand: root, fifth, octave", rhythm("C3/8 G3/8 C4/8 G3/8 C3/8 G3/8 C4/8 G3/8", 70)),
      ] },
      { kind: "learn", blocks: [{
        type: "notation",
        staves: [{ clef: "treble", notes: "r/q C4+E4+G4/q r/q C4+E4+G4/q | r/q C4+E4+G4/q r/q C4+E4+G4/q" }, { clef: "bass", notes: "C3/q r/q G2/q r/q | C3/q r/q G2/q r/q" }],
        time: "4/4",
        caption: "Bass and chord: the left hand on beats 1 and 3, the right hand on beats 2 and 4.",
      }] },
      { kind: "practice", blocks: [
        choice("In the bass-and-chord pattern, on which beats does the right hand play?", ["2 and 4", "1 and 3", "Every beat"], 0, "The left hand takes 1 and 3; the right hand answers."),
        choice("In root and pulses, how often does the right hand play the chord?", ["On every beat", "Once a bar", "Only on beat 1"], 0, "It pulses steadily while the left hand marks beat 1."),
        choice("Which pattern suits a slow song best?", ["The rolling arpeggio", "Fast repeated chords", "Single bass notes only"], 0, "A flowing left hand fills the space."),
        choice("Why does the right hand stay in the middle of the keyboard when accompanying?", ["To leave room for the melody above", "Because high notes are out of tune", "To play more quietly"], 0, "The accompaniment supports; it does not compete."),
        along("Play the bass-and-chord pattern on C major along with the track.", rhythm("C3/q C4+E4+G4/q G2/q C4+E4+G4/q", 70), 70),
      ] },
    ],
  },
];
