import type { LessonInput } from "@/core/schemas/content";
import { audio, build, chordOf, chords, choice, ear, prog, progression, show, text } from "../helpers";

const base = { moduleSlug: "substitution", isFree: false, version: 1, minutes: 6 } as const;
const PLAIN_251 = prog("C", "ii7 V7 Imaj7", 76);
const TRITONE_251 = prog("C", "ii7 bII7 Imaj7", 76);
const BACKDOOR = prog("C", "iv7 bVII7 Imaj7", 76);

export const substitution: LessonInput[] = [
  {
    ...base,
    slug: "tritone-substitution",
    title: "Tritone substitution",
    order: 1,
    concepts: ["tritone-substitution"],
    needs: ["the-tritone-in-the-dominant-seventh", "major-and-minor-two-five-one"],
    steps: [
      { kind: "understand", blocks: [text(`What makes G7 pull to C is the tritone inside it: **B and F**, its third and seventh. B rises to C, F falls to E.

Only one other dominant seventh contains those two notes: **D♭7**. It is spelled D♭ F A♭ C♭, and C♭ is the same key or fret as B. In D♭7 the two notes swap jobs: F is the third and B (C♭) is the seventh.

Because the two chords share their tritone, either one can do the dominant's job. Replacing V7 with the dominant a tritone away is called **tritone substitution**. The new chord sits a half step above home, so as a numeral it is **♭II7**.

Dm7 – G7 – Cmaj7 becomes **Dm7 – D♭7 – Cmaj7**.

The gain is in the bass. Instead of leaping D, G, C, it slides down by half steps: D, D♭, C.`)] },
      { kind: "listen", blocks: [
        audio("The tritone B and F, then where it resolves: C and E", chords("B3 F4", "C4 E4")),
        audio("ii–V–I: Dm7, G7, Cmaj7", PLAIN_251),
        audio("With the substitute: Dm7, D♭7, Cmaj7", TRITONE_251),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("G", "7"), "G7: G B D F. The tritone is B and F."),
        show(chordOf("Db", "7"), "D♭7: D♭ F A♭ C♭. The same two notes, with their jobs swapped."),
        show(progression("C", "ii7 bII7 Imaj7"), "Dm7, D♭7, Cmaj7. Watch the roots step down."),
      ] },
      { kind: "practice", blocks: [
        choice("Which two notes do G7 and D♭7 share?", ["B and F", "G and D", "D and A♭"], 0, "The tritone: third and seventh of one, seventh and third of the other."),
        choice("What is the tritone substitute of G7?", ["D♭7", "D7", "A♭7"], 0, "The dominant seventh whose root is a tritone from G."),
        choice("What is the tritone substitute of D7?", ["A♭7", "A7", "E♭7"], 0, "A♭ is a tritone from D. Both chords hold F♯ and C."),
        choice("With the substitute, how does the bass of a ii–V–I in C move?", ["Down by half steps: D, D♭, C", "Down by fifths: D, G, C", "Up by whole steps"], 0, "That smooth bass line is the main reason to use it."),
        build("Build D♭7.", "Db F Ab Cb", "Root, major third, fifth, minor seventh. C♭ is the same key or fret as B."),
        ear("Is the middle chord G7 or its tritone substitute?", TRITONE_251, ["G7", "D♭7"], 1, "The lowest notes slide down by half steps."),
      ] },
    ],
  },
  {
    ...base,
    slug: "diminished-passing-chords",
    title: "Diminished passing chords",
    order: 2,
    concepts: ["passing-diminished"],
    needs: ["secondary-leading-tone-chords", "half-diminished-diminished-and-minor-major", "turnarounds"],
    steps: [
      { kind: "understand", blocks: [text(`When two chords in a key have roots a whole step apart, there is a gap between them: one half step in the bass. A **diminished seventh chord** fits that gap.

Cmaj7 – Dm7 becomes Cmaj7 – **C♯°7** – Dm7. The bass climbs C, C♯, D.

This is more than filler. C♯°7 is C♯ E G B♭. Compare A7 with a flat ninth: A C♯ E G B♭. The diminished chord is **A7♭9 with its root left out**, and A7 is the dominant of Dm. So C♯°7 leads to Dm7 for the same reason A7 does. You met this chord in Level 5 as vii°7 of ii.

The same trick works one step higher: Dm7 – **D♯°7** – Em7.

One useful fact about the chord itself: a diminished seventh is a stack of minor thirds, and it divides the octave into four equal parts. So C♯°7, E°7, G°7 and B♭°7 are the same four notes. Any of them can be called the root.`)] },
      { kind: "listen", blocks: [
        audio("Without the passing chord: Cmaj7, Dm7, G7", prog("C", "Imaj7 ii7 V7", 76)),
        audio("With it: Cmaj7, C♯°7, Dm7, G7", prog("C", "Imaj7 #i°7 ii7 V7", 76)),
        audio("A7♭9, then the same chord without its root", chords("A2 C#3 E3 G3 Bb3", "C#3 E3 G3 Bb3")),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "Imaj7 #i°7 ii7 V7"), "Cmaj7, C♯°7, Dm7, G7. The lowest notes climb by half steps: C, C♯, D."),
        show(chordOf("C#", "dim7"), "C♯°7: C♯ E G B♭. Every note is a minor third from the next."),
      ] },
      { kind: "practice", blocks: [
        choice("Which chord fits between Cmaj7 and Dm7?", ["C♯°7", "C♯m7", "D♭maj7"], 0, "A diminished seventh on the half step between the two roots."),
        choice("C♯°7 is which chord with its root left out?", ["A7♭9", "G7♭9", "D7♭9"], 0, "A C♯ E G B♭ without the A."),
        choice("Why does C♯°7 lead so well to Dm7?", ["It acts as the dominant of Dm", "It belongs to the key of C", "It shares its root with Dm7"], 0, "It is A7♭9 without the root, and A7 is V7 of Dm."),
        build("Build C♯°7.", "C# E G Bb", "A stack of minor thirds."),
        choice("Which of these has the same four notes as C♯°7?", ["E°7", "D°7", "F°7"], 0, "A diminished seventh repeats every minor third: C♯, E, G, B♭."),
        ear("Is there a passing chord between the first chord and Dm7?", prog("C", "Imaj7 #i°7 ii7 V7", 76), ["No", "Yes"], 1, "The bass climbs by half steps: C, C♯, D."),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-backdoor-progression",
    title: "The backdoor progression",
    order: 3,
    concepts: ["backdoor-progression"],
    needs: ["modal-interchange", "major-and-minor-two-five-one"],
    steps: [
      { kind: "understand", blocks: [text(`The usual way home is through V7: G7 to C. Jazz players call another route the **backdoor**: **iv7 – ♭VII7 – I**. In C: **Fm7 – B♭7 – Cmaj7**.

Fm7 and B♭7 look like a ii–V in E♭. The ear expects E♭, and gets C instead. It works because both chords are borrowed from C minor, the parallel key, so C is still the centre.

Follow the notes of B♭7 into C:

- **A♭ falls a half step to G.**
- **F falls a half step to E.**
- B♭ rises a half step to B, the seventh of Cmaj7.

The arrival is soft. There is no leading tone B in B♭7 pushing up to C, so the backdoor sounds warmer and less urgent than V7 – I.

You will often meet it right after the IV chord: Fmaj7 – Fm7 – B♭7 – Cmaj7. Major IV turns minor, then comes home.`)] },
      { kind: "listen", blocks: [
        audio("The front door: Dm7, G7, Cmaj7", prog("C", "ii7 V7 Imaj7", 76)),
        audio("The backdoor: Fm7, B♭7, Cmaj7", BACKDOOR),
        audio("After IV: Fmaj7, Fm7, B♭7, Cmaj7", prog("C", "IVmaj7 iv7 bVII7 Imaj7", 76)),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "iv7 bVII7 Imaj7"), "Fm7, B♭7, Cmaj7."),
        show(chordOf("Bb", "7"), "B♭7: B♭ D F A♭. A♭ and F each fall a half step into C major."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the backdoor progression in C?", ["Fm7 – B♭7 – Cmaj7", "Dm7 – G7 – Cmaj7", "Dm7 – D♭7 – Cmaj7"], 0, "iv7 – ♭VII7 – I."),
        choice("Where do Fm7 and B♭7 come from?", ["C minor, the parallel key", "G major, the dominant key", "The C major scale"], 0, "They are borrowed chords: modal interchange."),
        choice("B♭7 resolves to Cmaj7 by moving its root how?", ["Up a whole step", "Down a fifth", "Down a half step"], 0, "♭VII to I."),
        choice("What is the backdoor progression in G?", ["Cm7 – F7 – Gmaj7", "Am7 – D7 – Gmaj7", "Cm7 – D7 – Gmaj7"], 0, "iv of G is C minor; ♭VII is F."),
        ear("Front door or backdoor?", BACKDOOR, ["Front door: ii – V – I", "Backdoor: iv – ♭VII – I"], 1, "It starts on a minor chord from outside the key and the last move is up a whole step."),
        ear("And this?", prog("C", "ii7 V7 Imaj7", 76), ["Front door: ii – V – I", "Backdoor: iv – ♭VII – I"], 0, "All three chords belong to C major."),
      ] },
    ],
  },
];
