import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, ear, find, pitches, prog, progression, show, text } from "../helpers";

const base = { moduleSlug: "progressions", isFree: false, version: 1, minutes: 6 } as const;
const BLUES = "I I I I IV IV I I V IV I I";

export const progressions: LessonInput[] = [
  {
    ...base,
    slug: "one-four-five",
    title: "I, IV and V",
    order: 1,
    concepts: ["one-four-five"],
    needs: ["chord-function"],
    steps: [
      { kind: "understand", blocks: [text(`The I, IV and V chords are the three major chords of a key, and countless songs use nothing else.

Between them they contain every note of the scale. In C major, C has C E G, F has F A C and G has G B D: all seven notes. So any melody in the key can be accompanied with just these three.

In C they are C, F and G. In G they are G, C and D. In A they are A, D and E.`)] },
      { kind: "listen", blocks: [
        audio("I, IV, V, I in C", prog("C", "I IV V I")),
        audio("I, IV, V, I in A", prog("A", "I IV V I")),
      ] },
      { kind: "learn", blocks: [show(progression("C", "I IV V I"), "C, F, G and back to C.")] },
      { kind: "practice", blocks: [
        choice("What are I, IV and V in G major?", ["G, C, D", "G, B, D", "G, A, D"], 0, "Degrees 1, 4 and 5 of G major."),
        choice("And in A major?", ["A, D, E", "A, C, E", "A, D, F"], 0, "Degrees 1, 4 and 5 of A major."),
        choice("And in D major?", ["D, G, A", "D, F, A", "D, E, A"], 0, "Degrees 1, 4 and 5 of D major."),
        ear("Which order do you hear?", prog("C", "I IV V I"), ["I, IV, V, I", "I, V, IV, I"], 0, "The second chord is the gentler step away; the tension comes third."),
        ear("And now?", prog("C", "I V IV I"), ["I, IV, V, I", "I, V, IV, I"], 1, "The tension comes second, then relaxes through IV."),
        choice("Between them, the I, IV and V chords contain…", ["Every note of the scale", "Only three notes", "Notes from outside the key"], 0, "Three triads, seven different notes."),
      ] },
    ],
  },
  {
    ...base,
    slug: "four-chord-songs",
    title: "The four-chord progressions",
    order: 2,
    concepts: ["four-chord-progressions"],
    needs: ["one-four-five"],
    steps: [
      { kind: "understand", blocks: [text(`Add the vi chord to I, IV and V and you have the four chords behind a huge number of pop songs.

**I–V–vi–IV** in C is C, G, Am, F.

Start the same loop from the minor chord and it becomes **vi–IV–I–V**: Am, F, C, G. The chords are identical, but beginning on vi makes the loop feel darker.

Because the chords are the same, the two progressions slide into each other easily.`)] },
      { kind: "listen", blocks: [
        audio("I–V–vi–IV in C: C, G, Am, F", prog("C", "I V vi IV")),
        audio("vi–IV–I–V in C: Am, F, C, G", prog("C", "vi IV I V")),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "I V vi IV"), "I–V–vi–IV: C, G, Am, F."),
        show(progression("C", "vi IV I V"), "vi–IV–I–V: the same chords, starting from Am."),
      ] },
      { kind: "practice", blocks: [
        choice("What is I–V–vi–IV in G major?", ["G, D, Em, C", "G, C, Em, D", "G, D, Am, C"], 0, "I is G, V is D, vi is Em, IV is C."),
        choice("What is vi–IV–I–V in C major?", ["Am, F, C, G", "Am, G, C, F", "Em, F, C, G"], 0, "vi is Am, IV is F, I is C, V is G."),
        ear("Which progression is this?", prog("C", "I V vi IV"), ["I–V–vi–IV", "vi–IV–I–V"], 0, "It starts on the major home chord."),
        ear("And this?", prog("C", "vi IV I V"), ["I–V–vi–IV", "vi–IV–I–V"], 1, "It starts on the minor chord."),
        choice("What do the two progressions have in common?", ["They use the same four chords", "They start on the same chord", "Nothing"], 0, "Only the starting point differs."),
        choice("What is I–V–vi–IV in D major?", ["D, A, Bm, G", "D, G, Bm, A", "D, A, F♯m, G"], 0, "I is D, V is A, vi is Bm, IV is G."),
      ] },
    ],
  },
  {
    ...base,
    slug: "two-five-one",
    title: "ii–V–I",
    order: 3,
    concepts: ["two-five-one"],
    needs: ["four-chord-songs"],
    steps: [
      { kind: "understand", blocks: [text(`**ii–V–I** is the journey of chord functions in its neatest form: subdominant, dominant, tonic.

In C major it is Dm, G, C.

Its roots fall by a fifth each time: D down to G, G down to C. Motion by falling fifths is the strongest there is in harmony, which is why this progression is the backbone of jazz and turns up everywhere else as well.`)] },
      { kind: "listen", blocks: [
        audio("ii–V–I in C: Dm, G, C", prog("C", "ii V I", 72)),
        audio("ii–V–I in G: Am, D, G", prog("G", "ii V I", 72)),
      ] },
      { kind: "learn", blocks: [show(progression("C", "ii V I"), "Dm, G, C. Watch the roots: D, then G, then C.")] },
      { kind: "practice", blocks: [
        choice("What is ii–V–I in C major?", ["Dm, G, C", "Em, G, C", "Dm, F, C"], 0, "ii is Dm, V is G, I is C."),
        choice("And in G major?", ["Am, D, G", "Am, C, G", "Bm, D, G"], 0, "ii is Am, V is D, I is G."),
        choice("And in F major?", ["Gm, C, F", "Gm, B♭, F", "Am, C, F"], 0, "ii is Gm, V is C, I is F."),
        choice("How do the roots move in ii–V–I?", ["Down a fifth each time", "Up a step each time", "Down a third each time"], 0, "D to G to C."),
        choice("Which functions does ii–V–I pass through?", ["Subdominant, dominant, tonic", "Tonic, dominant, subdominant", "Dominant, tonic, subdominant"], 0, "ii stands in for IV."),
        ear("Does this ii–V–I reach home?", prog("C", "ii V", 72), ["No: it stops on V", "Yes: it ends on I"], 0, "Dm, then G, and the I chord never arrives."),
      ] },
    ],
  },
  {
    ...base,
    slug: "twelve-bar-blues",
    title: "The 12-bar blues",
    order: 4,
    concepts: ["twelve-bar-blues"],
    needs: ["one-four-five"],
    steps: [
      { kind: "understand", blocks: [text(`The **12-bar blues** is a fixed plan of I, IV and V that lasts twelve bars and then repeats. In its basic form:

- Bars 1 to 4: **I I I I**
- Bars 5 to 8: **IV IV I I**
- Bars 9 to 12: **V IV I I**

In A that is four bars of A, two of D, two of A, then E, D, A, A.

Players very often change the last bar to V, to lead back to the top. Blues chords are also usually played as seventh chords, which a later level covers.`)] },
      { kind: "listen", blocks: [audio("Twelve bars in A, two beats to a bar here", prog("A", BLUES, 100))] },
      { kind: "learn", blocks: [show(progression("A", BLUES), "Press play and follow the twelve bars: A, A, A, A, D, D, A, A, E, D, A, A.")] },
      { kind: "practice", blocks: [
        choice("How many bars are in the basic blues form?", ["12", "8", "16"], 0, "Three lines of four bars."),
        choice("Which chord arrives in bar 5?", ["IV", "V", "I"], 0, "Four bars of I, then IV."),
        choice("Which chord arrives in bar 9?", ["V", "IV", "I"], 0, "The last line starts on V."),
        choice("A blues in A uses which three chords?", ["A, D, E", "A, C, E", "A, D, G"], 0, "I, IV and V of A major."),
        choice("And a blues in E?", ["E, A, B", "E, G, B", "E, A, C"], 0, "I, IV and V of E major."),
        ear("After four bars the chord changes for the first time. Which chord is it?", prog("A", "I I I I IV IV", 100), ["IV", "V"], 0, "Bar 5 of a blues is the IV chord."),
      ] },
    ],
  },
  {
    ...base,
    slug: "cadences",
    title: "Cadences: how phrases end",
    order: 5,
    concepts: ["cadences"],
    needs: ["why-chords-want-to-move"],
    steps: [
      { kind: "understand", blocks: [text(`A **cadence** is the pair of chords that ends a phrase. It works like punctuation.

- **Authentic: V to I.** A full stop. Tension resolves home.
- **Plagal: IV to I.** A softer ending, the "Amen" at the close of a hymn.
- **Half: ending on V.** A comma or a question. The phrase stops, but the music cannot end there.
- **Deceptive: V to vi.** You expect I and get vi instead: a surprise that keeps things going.`)] },
      { kind: "listen", blocks: [
        audio("Authentic: IV, V, I", prog("C", "IV V I", 66)),
        audio("Plagal: I, IV, I", prog("C", "I IV I", 66)),
        audio("Half: I, IV, V", prog("C", "I IV V", 66)),
        audio("Deceptive: IV, V, vi", prog("C", "IV V vi", 66)),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "V I"), "Authentic: G to C."),
        show(progression("C", "V vi"), "Deceptive: G to Am. Two of the three notes of Am are the ones you expected from C."),
      ] },
      { kind: "practice", blocks: [
        ear("Which cadence ends this phrase?", prog("C", "IV V I", 66), ["Authentic: V to I", "Half: ending on V", "Deceptive: V to vi"], 0, "V resolves to I: a full stop."),
        ear("And this?", prog("C", "I IV V", 66), ["Authentic: V to I", "Half: ending on V", "Deceptive: V to vi"], 1, "It stops on V and waits."),
        ear("And this?", prog("C", "IV V vi", 66), ["Authentic: V to I", "Half: ending on V", "Deceptive: V to vi"], 2, "V goes to the minor vi instead of home."),
        ear("And this?", prog("C", "I IV I", 66), ["Plagal: IV to I", "Authentic: V to I", "Half: ending on V"], 0, "IV settles back to I: the Amen ending."),
        choice("A half cadence ends on which chord?", ["V", "I", "vi"], 0, "It leaves the tension unresolved."),
      ] },
    ],
  },
  {
    ...base,
    slug: "transposing",
    title: "Moving a progression to another key",
    order: 6,
    concepts: ["transposing"],
    needs: ["four-chord-songs"],
    steps: [
      { kind: "understand", blocks: [text(`**Transposing** means moving music to a different key, to suit a singer or an instrument. There are two ways to do it.

**By numerals.** Work out the numerals, then read them off in the new key. C, G, Am, F is I–V–vi–IV; in G that is G, D, Em, C.

**By interval.** Move every chord by the same distance. To go from C major to D major, everything rises a whole step: C, G, Am, F becomes D, A, Bm, G.

Either way, major chords stay major and minor chords stay minor.`)] },
      { kind: "listen", blocks: [
        audio("I–V–vi–IV in C", prog("C", "I V vi IV")),
        audio("The same progression in D, a whole step higher", prog("D", "I V vi IV")),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "I V vi IV"), "In C: C, G, Am, F."),
        show(progression("D", "I V vi IV"), "In D: D, A, Bm, G. Every chord is a whole step higher."),
      ] },
      { kind: "practice", blocks: [
        choice("C, F, G is I–IV–V in C. What is it in G?", ["G, C, D", "G, B, D", "G, C, E"], 0, "I, IV and V of G major."),
        choice("Move C, G, Am, F up a whole step. What do you get?", ["D, A, Bm, G", "D, A, B, G", "D, G, Bm, A"], 0, "Each root rises two half steps; the minor chord stays minor."),
        choice("G, Em, C, D moved to the key of C becomes…", ["C, Am, F, G", "C, Em, F, G", "C, Am, G, F"], 0, "It is I–vi–IV–V; in C that is C, Am, F, G."),
        choice("When you transpose, what happens to a minor chord?", ["It stays minor", "It becomes major", "It depends on the key"], 0, "The numerals, and so the chord types, do not change."),
        find("Tap the root of the IV chord in E major.", "A", "E F♯ G♯ A: the fourth degree is A."),
      ] },
    ],
  },
  {
    ...base,
    slug: "using-a-capo",
    title: "Using a capo",
    order: 7,
    strand: "guitar",
    concepts: ["capo"],
    needs: ["transposing"],
    steps: [
      { kind: "understand", blocks: [text(`A **capo** clamps across all six strings at one fret and acts as a new nut. Every string is raised by one half step for each fret the capo sits at.

Your chord shapes stay the same, but the chords that sound are higher. With a capo at fret 2, a G shape sounds as A, a C shape as D and a D shape as E.

That makes a capo a transposing tool. To play in B♭ with easy shapes, put the capo at fret 3 and play as if in G: three half steps above G is B♭.`)] },
      { kind: "listen", blocks: [
        audio("The open strings", { kind: "sequence", notes: ["E2", "A2", "D3", "G3", "B3", "E4"], bpm: 90 }),
        audio("The same strings with a capo at fret 2", { kind: "sequence", notes: ["F#2", "B2", "E3", "A3", "C#4", "F#4"], bpm: 90 }),
      ] },
      { kind: "learn", blocks: [show(pitches("F#2 B2 E3 A3 C#4 F#4", { within: [2, 2] }), "With a capo at fret 2, the open strings become F♯ B E A C♯ F♯: everything a whole step higher.", "guitar")] },
      { kind: "practice", blocks: [
        choice("How much does a capo raise each string?", ["One half step for each fret", "One whole step for each fret", "One octave"], 0, "The capo is a movable nut."),
        choice("Capo at fret 2, and you play a G shape. Which chord sounds?", ["A", "B", "G♯"], 0, "Two half steps above G is A."),
        choice("Capo at fret 3, and you play a C shape. Which chord sounds?", ["E♭", "D", "E"], 0, "Three half steps above C is E♭."),
        choice("A song is in B♭. With a capo at fret 3, which shapes do you play?", ["Shapes from the key of G", "Shapes from the key of A", "Shapes from the key of C"], 0, "G plus three half steps is B♭."),
        choice("Capo at fret 2, and you play a D shape. Which chord sounds?", ["E", "F", "E♭"], 0, "Two half steps above D is E."),
      ] },
    ],
  },
];
