import type { LessonInput } from "@/core/schemas/content";
import { audio, build, choice, chordOf, chords, diagram, ear, find, pitches, prog, progression, show, text, together } from "../helpers";

const base = { moduleSlug: "seventh-chords", isFree: false, version: 1, minutes: 6 } as const;
const P = { only: "piano" } as const;

export const seventhChords: LessonInput[] = [
  {
    ...base,
    slug: "major-dominant-and-minor-sevenths",
    title: "Major 7, dominant 7 and minor 7",
    order: 1,
    concepts: ["seventh-chords"],
    needs: ["major-and-minor-triads", "sixths-sevenths-and-the-octave"],
    steps: [
      { kind: "understand", blocks: [text(`Stack one more third on top of a triad and you have a **seventh chord**: root, third, fifth and seventh. The three most common:

- **Major 7** (Cmaj7): a major triad with a major seventh. 1 3 5 7. C E G B.
- **Dominant 7** (C7): a major triad with a minor seventh. 1 3 5 ♭7. C E G B♭.
- **Minor 7** (Cm7): a minor triad with a minor seventh. 1 ♭3 5 ♭7. C E♭ G B♭.

A plain 7 after the letter always means the dominant kind. Major 7 is lush and settled; dominant 7 is restless and wants to move; minor 7 is soft and mellow.`)] },
      { kind: "listen", blocks: [
        audio("Cmaj7", together("C4 E4 G4 B4")),
        audio("C7", together("C4 E4 G4 Bb4")),
        audio("Cm7", together("C4 Eb4 G4 Bb4")),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("C", "maj7"), "Cmaj7: 1 3 5 7."),
        show(chordOf("C", "7"), "C7: the seventh drops a half step, to B♭."),
        show(chordOf("C", "m7"), "Cm7: the third drops as well, to E♭."),
      ] },
      { kind: "practice", blocks: [
        choice("What does a seventh chord add to a triad?", ["A fourth note, a seventh above the root", "A second root", "A lower fifth"], 0, "One more third on top of the stack."),
        build("Build Cmaj7.", "C E G B", "C major triad plus B, a major seventh above C."),
        build("Build G7.", "G B D F", "G major triad plus F, a minor seventh above G."),
        build("Build Am7.", "A C E G", "A minor triad plus G, a minor seventh above A."),
        choice("What is the difference between Cmaj7 and C7?", ["The seventh: B in Cmaj7, B♭ in C7", "The third", "The fifth"], 0, "Major seventh against minor seventh."),
        ear("Which seventh chord is this?", together("F3 A3 C4 E4"), ["Major 7", "Dominant 7", "Minor 7"], 0, "F A C E: a major triad with a major seventh."),
      ] },
    ],
  },
  {
    ...base,
    slug: "half-diminished-diminished-and-minor-major",
    title: "Half-diminished, diminished 7 and minor-major 7",
    order: 2,
    concepts: ["more-seventh-chords"],
    needs: ["major-dominant-and-minor-sevenths", "diminished-and-augmented-triads"],
    steps: [
      { kind: "understand", blocks: [text(`Three more seventh chords complete the family.

- **Half-diminished**, written m7♭5 or ø: a diminished triad with a minor seventh. 1 ♭3 ♭5 ♭7. Bm7♭5 is B D F A.
- **Diminished 7**, written dim7 or °7: a diminished triad with a diminished seventh. 1 ♭3 ♭5 ♭♭7. C°7 is C E♭ G♭ B♭♭, and B♭♭ is the same key or fret as A. Every note is a minor third from the next, so the chord sounds the same whichever note is lowest.
- **Minor-major 7**, written m(maj7): a minor triad with a major seventh. 1 ♭3 5 7. Cm(maj7) is C E♭ G B. Dark and uneasy, it is the tonic chord of harmonic minor.`)] },
      { kind: "listen", blocks: [
        audio("Bm7♭5: half-diminished", together("B3 D4 F4 A4")),
        audio("C°7: diminished 7", together("C4 Eb4 Gb4 A4")),
        audio("Cm(maj7): minor-major 7", together("C4 Eb4 G4 B4")),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("B", "m7b5"), "Bm7♭5: B D F A."),
        show(chordOf("C", "dim7"), "C°7: four notes, each a minor third apart."),
        show(chordOf("C", "mmaj7"), "Cm(maj7): C E♭ G B."),
      ] },
      { kind: "practice", blocks: [
        build("Build Bm7♭5.", "B D F A", "B diminished triad plus A, a minor seventh above B."),
        choice("What is another name for m7♭5?", ["Half-diminished", "Diminished 7", "Minor-major 7"], 0, "Diminished triad, but only a minor seventh."),
        choice("What is special about a diminished 7 chord?", ["Every note is a minor third from the next", "It has no third", "It has two roots"], 0, "It divides the octave into four equal parts."),
        choice("Which notes are in Cm(maj7)?", ["C, E♭, G, B", "C, E, G, B♭", "C, E♭, G♭, B♭"], 0, "Minor triad, major seventh."),
        ear("Which chord is this?", together("B3 D4 F4 A4"), ["Half-diminished", "Major 7", "Dominant 7"], 0, "A diminished triad with a minor seventh on top."),
        ear("And this?", together("C4 Eb4 Gb4 A4"), ["Diminished 7", "Minor 7", "Major 7"], 0, "A stack of minor thirds: tense from top to bottom."),
      ] },
    ],
  },
  {
    ...base,
    slug: "seventh-chords-of-the-major-key",
    title: "The seventh chords of a major key",
    order: 3,
    concepts: ["diatonic-sevenths"],
    needs: ["half-diminished-diminished-and-minor-major", "harmonising-the-major-scale"],
    steps: [
      { kind: "understand", blocks: [text(`Stack four thirds on each degree of the major scale and the seven chords of the key become seventh chords:

**Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7**

In C major: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7♭5.

Three things to notice. The two major 7 chords are I and IV. The three minor 7 chords are ii, iii and vi. And there is exactly **one dominant 7**, on V. That is why any dominant 7 chord points so clearly at one key.`)] },
      { kind: "listen", blocks: [audio("The seven seventh chords of C major, then Cmaj7 again", prog("C", "Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7 Imaj7", 96))] },
      { kind: "learn", blocks: [show(progression("C", "Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7"), "Press play to step through the seventh chords of C major.")] },
      { kind: "practice", blocks: [
        choice("In a major key, which degrees carry major 7 chords?", ["I and IV", "I and V", "IV and V"], 0, "Imaj7 and IVmaj7."),
        choice("Which degree carries the only dominant 7 chord?", ["V", "I", "IV"], 0, "V7 is unique in the key."),
        choice("In C major, what is the seventh chord on degree 2?", ["Dm7", "D7", "Dmaj7"], 0, "D F A C."),
        choice("In G major, what is the V7 chord?", ["D7", "G7", "C7"], 0, "D F♯ A C."),
        choice("In C major, the chord on degree 7 is…", ["Bm7♭5", "Bm7", "B7"], 0, "B D F A: half-diminished."),
        ear("Does this progression end on the dominant 7 or on the tonic major 7?", prog("C", "ii7 V7", 72), ["On the dominant 7: it wants to continue", "On the tonic major 7: it is at rest"], 0, "Dm7, then G7, left waiting for Cmaj7."),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-tritone-in-the-dominant-seventh",
    title: "The tritone inside the dominant 7",
    order: 4,
    concepts: ["dominant-tritone"],
    needs: ["seventh-chords-of-the-major-key", "fourths-fifths-and-the-tritone", "why-chords-want-to-move"],
    steps: [
      { kind: "understand", blocks: [text(`The dominant 7 chord pulls harder than any other, and the reason is two of its notes.

In G7 the third is B and the seventh is F. Between them is a **tritone**, the most unstable interval there is.

Both notes are a half step from a note of the C chord. **B rises to C**, the leading tone going home. **F falls to E**, degree 4 falling to 3. The tritone closes inward to a third, and the tension is gone.

This is the engine of V7 to I. Wherever you hear a tritone resolve like this, you are hearing a dominant chord go home.`)] },
      { kind: "listen", blocks: [
        audio("The tritone B and F, resolving to C and E", chords("B3 F4", "C4 E4")),
        audio("The whole chords: G7 to C", prog("C", "V7 I", 60)),
      ] },
      { kind: "learn", blocks: [
        show(pitches("B3 F4", { strings: [3, 2], within: [4, 6] }), "The tritone inside G7: B and F."),
        show(pitches("C4 E4", { strings: [3, 2], within: [5, 5] }), "Where it goes: B has risen to C, F has fallen to E."),
      ] },
      { kind: "practice", blocks: [
        choice("Which two notes of G7 form a tritone?", ["B and F", "G and D", "G and B"], 0, "The third and the seventh."),
        choice("When G7 resolves to C, where does B go?", ["Up a half step to C", "Down a whole step to A", "It stays"], 0, "B is the leading tone of C major."),
        choice("And where does F go?", ["Down a half step to E", "Up a whole step to G", "It stays"], 0, "Degree 4 falls to degree 3."),
        find("In C7, the third is E. Tap the other note of its tritone.", "Bb", "E and B♭, the third and seventh of C7, are a tritone apart."),
        ear("Does this tritone resolve?", chords("B3 F4", "C4 E4"), ["Yes: it closes to a settled third", "No: it stays tense"], 0, "B up to C and F down to E."),
      ] },
    ],
  },
  {
    ...base,
    slug: "movable-seventh-chord-shapes",
    title: "Movable seventh-chord shapes",
    order: 5,
    strand: "guitar",
    concepts: ["guitar-seventh-shapes"],
    needs: ["major-dominant-and-minor-sevenths", "barre-chords"],
    steps: [
      { kind: "understand", blocks: [text(`The E-shape and A-shape barre chords each turn into seventh chords by changing one or two notes. As with barre chords, the note under the barre on string 6 or string 5 names the chord.

**Root on string 6** (shown as G, at fret 3):

- G7: 3 5 3 4 3 3
- Gm7: 3 5 3 3 3 3
- Gmaj7: 3 × 4 4 3 ×

**Root on string 5** (shown as C, at fret 3):

- C7: × 3 5 3 5 3
- Cm7: × 3 5 3 4 3
- Cmaj7: × 3 5 4 5 3

Six shapes, and every dominant, minor and major seventh chord is under your hand anywhere on the neck.`)] },
      { kind: "listen", blocks: [audio("Gmaj7, G7, Gm7: one root, three colours", chords("G2 F#3 B3 D4", "G2 D3 F3 B3 D4 G4", "G2 D3 F3 Bb3 D4 G4"))] },
      { kind: "learn", blocks: [
        diagram("353433", "G", "7", "G7: root on string 6."),
        diagram("353333", "G", "m7", "Gm7: one note lower on string 3."),
        diagram("3x443x", "G", "maj7", "Gmaj7: four strings; strings 5 and 1 are left out."),
        diagram("x35353", "C", "7", "C7: root on string 5."),
        diagram("x35343", "C", "m7", "Cm7."),
        diagram("x35453", "C", "maj7", "Cmaj7."),
      ] },
      { kind: "practice", blocks: [
        choice("The shape 3 5 3 4 3 3 moved up two frets is…", ["A7", "B7", "G♯7"], 0, "The root moves from G at fret 3 to A at fret 5."),
        choice("Between G7 and Gm7, which string changes?", ["String 3, from fret 4 to fret 3", "String 6", "String 1"], 0, "That note is the third: B drops to B♭."),
        choice("The shape × 3 5 3 5 3 moved up two frets is…", ["D7", "E7", "C♯7"], 0, "The root moves from C at fret 3 of string 5 to D at fret 5."),
        find("Where is the root of a string-5 Em7 shape? Tap it on string 5.", "E3", "Fret 7 of string 5 is E.", { strings: [5], only: "guitar" }),
        choice("What names a movable seventh chord?", ["The note under the root on string 6 or 5", "The highest note", "The fret number alone"], 0, "The shape gives the type; the root gives the letter."),
      ] },
    ],
  },
  {
    ...base,
    slug: "seventh-chord-inversions",
    title: "Seventh-chord inversions",
    order: 6,
    strand: "piano",
    concepts: ["piano-seventh-inversions"],
    needs: ["major-dominant-and-minor-sevenths", "root-position-and-inversions"],
    steps: [
      { kind: "understand", blocks: [text(`A seventh chord has four notes, so it has four positions: root position and three inversions.

For Cmaj7:

- **Root position:** C E G B.
- **First inversion:** E G B C. The third is lowest.
- **Second inversion:** G B C E. The fifth is lowest.
- **Third inversion:** B C E G. The seventh is lowest.

In the inversions, the root and seventh end up side by side, a step apart. That close pair gives inverted seventh chords their rich, slightly crunchy sound.

As with triads, inversions let you move between chords while the hand stays in one place.`)] },
      { kind: "listen", blocks: [audio("Cmaj7 in root position and its three inversions", chords("C4 E4 G4 B4", "E4 G4 B4 C5", "G3 B3 C4 E4", "B3 C4 E4 G4"))] },
      { kind: "learn", blocks: [
        show(pitches("C4 E4 G4 B4"), "Root position: C E G B.", "piano"),
        show(pitches("E4 G4 B4 C5"), "First inversion: B and C are now neighbours at the top.", "piano"),
        show(pitches("B3 C4 E4 G4"), "Third inversion: the seventh, B, is lowest.", "piano"),
      ] },
      { kind: "practice", blocks: [
        choice("How many inversions does a seventh chord have?", ["Three", "Two", "Four"], 0, "Four notes: root position plus three inversions."),
        choice("Which note is lowest in third inversion?", ["The seventh", "The fifth", "The third"], 0, "Only seventh chords have a third inversion."),
        choice("G B C E is Cmaj7 in…", ["Second inversion", "First inversion", "Third inversion"], 0, "The fifth, G, is lowest."),
        find("You are holding E, G and B. Tap the note that completes Cmaj7 in first inversion.", "C", "E G B C: the root goes on top.", P),
        choice("In an inverted seventh chord, which two notes sit a step apart?", ["The seventh and the root", "The third and the fifth", "The root and the third"], 0, "B and C in Cmaj7."),
      ] },
    ],
  },
  {
    ...base,
    slug: "shell-voicings",
    title: "Shell voicings",
    order: 7,
    strand: "piano",
    concepts: ["piano-shell-voicings"],
    needs: ["seventh-chord-inversions", "spread-voicings"],
    steps: [
      { kind: "understand", blocks: [text(`A seventh chord does not need all four notes to be recognised. The **root** says which chord it is; the **third** and **seventh** say what kind. The fifth adds very little.

A **shell voicing** keeps only the essentials: root, third and seventh.

For Cmaj7 that is C, E and B. For C7 it is C, E and B♭. For Cm7 it is C, E♭ and B♭.

Shells are small, clear and easy to move. A common way to play them is with the root low in the left hand and the third and seventh above it. They are the starting point for jazz piano.`)] },
      { kind: "listen", blocks: [
        audio("Cmaj7 complete, then as a shell: C, E, B", chords("C3 E3 G3 B3", "C3 E3 B3")),
        audio("Shells for Dm7, G7 and Cmaj7", chords("D3 F3 C4", "G2 F3 B3", "C3 E3 B3")),
      ] },
      { kind: "learn", blocks: [
        show(pitches("C3 E3 B3"), "Cmaj7 shell: root, third, seventh. No fifth.", "piano"),
        show(pitches("C3 E3 Bb3"), "C7 shell: only the seventh has changed.", "piano"),
        show(pitches("C3 Eb3 Bb3"), "Cm7 shell: now the third has changed too.", "piano"),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes make up a shell voicing?", ["Root, third and seventh", "Root, third and fifth", "Third, fifth and seventh"], 0, "The fifth is the note that can go."),
        choice("Why can the fifth be left out?", ["It adds little to the chord's character", "It clashes with the root", "It is too high"], 0, "Third and seventh carry the type of chord."),
        choice("Which notes are the shell of G7?", ["G, B and F", "G, B and D", "G, D and F"], 0, "Root G, third B, seventh F."),
        find("Shell of Dm7: you have D and F. Tap the missing note.", "C", "The minor seventh above D is C.", P),
        choice("Between the shells of Cmaj7 and C7, what changes?", ["The seventh: B becomes B♭", "The third", "The root"], 0, "Major seventh to minor seventh."),
        ear("Is this a full seventh chord or a three-note shell?", together("C3 E3 B3"), ["A shell: three notes", "A full chord: four notes"], 0, "Root, third and seventh only."),
      ] },
    ],
  },
];
