import type { LessonInput } from "@/core/schemas/content";
import { audio, build, choice, chordOf, ear, find, prog, progression, show, text } from "../helpers";

const base = { moduleSlug: "secondary-dominants", isFree: false, version: 1, minutes: 6 } as const;
const IN_KEY = ["It stays in the key", "A chord from outside the key appears"];

export const secondaryDominants: LessonInput[] = [
  {
    ...base,
    slug: "five-of-five",
    title: "V of V",
    order: 1,
    concepts: ["five-of-five"],
    needs: ["the-tritone-in-the-dominant-seventh", "two-five-one"],
    steps: [
      { kind: "understand", blocks: [text(`The dominant chord pulls to the tonic. Nothing stops you from giving that same pull to a different chord.

In C major the V chord is G. Treat G for a moment as if it were home, and ask what **its** dominant would be: D7. Playing D7 before G makes the arrival on G much stronger.

That D7 is a **secondary dominant**, written **V/V** and read "five of five".

In the key it would normally be Dm. The change is one note: F becomes **F♯**, which is the leading tone of G. Hearing a note from outside the key lean into a chord inside it is the whole effect.

A typical use: C, D7, G7, C.`)] },
      { kind: "listen", blocks: [
        audio("Inside the key: C, Dm, G7, C", prog("C", "I ii V7 I", 76)),
        audio("With V of V: C, D7, G7, C", prog("C", "I II7 V7 I", 76)),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "I II7 V7 I"), "Press play: C, D7, G7, C. The F♯ in D7 rises to G."),
        show(chordOf("D", "7"), "D7: D F♯ A C. In the key of C the chord on D would be Dm, with F natural."),
      ] },
      { kind: "practice", blocks: [
        choice("In C major, what is V of V?", ["D7", "G7", "A7"], 0, "The dominant of G is D7."),
        choice("Which note in D7 comes from outside the key of C?", ["F♯", "A", "C"], 0, "It is the leading tone of G."),
        choice("Where does a V/V chord lead?", ["To the V chord", "To the I chord directly", "To the IV chord"], 0, "It is the dominant of the dominant."),
        choice("In G major, what is V of V?", ["A7", "D7", "E7"], 0, "V of G major is D, and the dominant of D is A7."),
        build("Build D7.", "D F# A C", "A major triad on D with a minor seventh."),
        ear("Does this progression stay inside the key?", prog("C", "I II7 V7 I", 76), IN_KEY, 1, "The second chord is D7, with F♯: V of V."),
      ] },
    ],
  },
  {
    ...base,
    slug: "other-secondary-dominants",
    title: "A dominant for every chord",
    order: 2,
    concepts: ["secondary-dominants"],
    needs: ["five-of-five"],
    steps: [
      { kind: "understand", blocks: [text(`Any major or minor chord of the key can be given its own dominant. The rule is always the same: go up a perfect fifth from the target and build a dominant 7 there.

In C major:

- **V/ii:** A7, leading to Dm.
- **V/iii:** B7, leading to Em.
- **V/IV:** C7, leading to F.
- **V/V:** D7, leading to G.
- **V/vi:** E7, leading to Am.

Each one brings in a note from outside the key, and that note is the leading tone of its target. E7 has G♯, which rises to A.

The vii° chord has no secondary dominant: a diminished chord is too unstable to feel like a home, even briefly.`)] },
      { kind: "listen", blocks: [
        audio("V of vi: C, E7, Am", prog("C", "I III7 vi", 76)),
        audio("V of IV: C, C7, F", prog("C", "I I7 IV", 76)),
        audio("V of ii: C, A7, Dm, G7, C", prog("C", "I VI7 ii V7 I", 76)),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "I III7 vi"), "C, E7, Am. The G♯ in E7 is the leading tone of A."),
        show(progression("C", "I I7 IV"), "C, C7, F. Adding B♭ turns the home chord into the dominant of F."),
      ] },
      { kind: "practice", blocks: [
        choice("In C major, which chord is V of vi?", ["E7", "A7", "D7"], 0, "vi is Am, and the dominant of A is E7."),
        choice("In C major, which chord is V of ii?", ["A7", "E7", "B7"], 0, "ii is Dm, and the dominant of D is A7."),
        choice("How do you find the secondary dominant of any chord?", ["Build a dominant 7 a perfect fifth above it", "Build a minor chord a step below it", "Raise its root a half step"], 0, "The same relationship as V to I."),
        find("E7 leads to Am. Tap the note in E7 that is outside the key of C.", "G#", "G♯ is the leading tone of A."),
        choice("C7 in the key of C major is the dominant of which chord?", ["F, the IV chord", "G, the V chord", "Am, the vi chord"], 0, "C is a fifth above F."),
        ear("Does this progression stay inside the key?", prog("C", "I vi ii V7 I", 76), IN_KEY, 0, "C, Am, Dm, G7, C: every chord belongs to C major."),
      ] },
    ],
  },
  {
    ...base,
    slug: "secondary-leading-tone-chords",
    title: "Secondary leading-tone chords",
    order: 3,
    concepts: ["secondary-leading-tone-chords"],
    needs: ["other-secondary-dominants", "half-diminished-diminished-and-minor-major"],
    steps: [
      { kind: "understand", blocks: [text(`In a key, two chords do the dominant job: V and vii°. A secondary dominant borrows V. You can borrow vii° as well.

A **secondary leading-tone chord** is a diminished chord built a **half step below** its target. Its root is the target's leading tone, so the whole chord slides up into place.

In C major, the leading tone of G is F♯. So **F♯°** (F♯ A C) leads to G. It is written **vii°/V**.

It works the same way for the other chords: C♯° leads to Dm, G♯° leads to Am.

Often it is played as a diminished 7 chord, F♯°7, which adds one more note of tension. Compared with a secondary dominant it sounds smoother, because the bass moves by a half step.`)] },
      { kind: "listen", blocks: [
        audio("F, F♯°, G: the bass climbs by half step into G", prog("C", "IV #iv° V", 76)),
        audio("The same arrival with V of V: F, D7, G", prog("C", "IV II7 V", 76)),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "IV #iv° V"), "F, F♯°, G. Watch the lowest note of each chord: F, F♯, G."),
        show(chordOf("F#", "dim"), "F♯°: F♯ A C. All three of its notes are also in D7, which is why the two chords do the same job."),
      ] },
      { kind: "practice", blocks: [
        choice("Where is a secondary leading-tone chord built?", ["A half step below its target", "A fifth above its target", "A whole step above its target"], 0, "Its root is the target's leading tone."),
        choice("In C major, which diminished chord leads to G?", ["F♯°", "B°", "D°"], 0, "F♯ is a half step below G."),
        choice("Which diminished chord leads to Am?", ["G♯°", "A♯°", "F♯°"], 0, "G♯ is a half step below A."),
        build("Build F♯ diminished.", "F# A C", "Two minor thirds from F♯."),
        choice("What kind of chord is a secondary leading-tone chord?", ["Diminished", "Major", "Augmented"], 0, "Like vii° in the key."),
        ear("In this progression, how does the bass reach the last chord?", prog("C", "IV #iv° V", 76), ["By half steps", "By a leap of a fifth"], 0, "F, F♯, G."),
      ] },
    ],
  },
];
