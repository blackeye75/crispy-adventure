import type { LessonInput, Sound } from "@/core/schemas/content";
import { audio, choice, chordOf, chords, ear, find, prog, progression, show, text } from "../helpers";

const base = { moduleSlug: "modulation", isFree: false, version: 1, minutes: 6 } as const;
/** One progression after another, as a single sound. */
const then = (...parts: Sound[]): Sound => ({ kind: "progression", chords: parts.flatMap((p) => (p.kind === "progression" ? p.chords : [])), bpm: 84 });
const STAYS = ["It changes key", "It stays in one key"];

export const modulation: LessonInput[] = [
  {
    ...base,
    slug: "pivot-chord-modulation",
    title: "Changing key through a pivot chord",
    order: 1,
    concepts: ["pivot-chord"],
    needs: ["five-of-five", "the-circle-of-fifths"],
    steps: [
      { kind: "understand", blocks: [text(`**Modulation** is a change of key inside a piece: the music settles on a new home.

The smoothest way is through a **pivot chord**, a chord that belongs to both the old key and the new one. The ear hears it in the old key; what follows reinterprets it in the new.

From C major to G major, **Am** is a good pivot. In C it is vi. In G it is ii. Follow it with D7, the V of G, and then G itself:

C, Am, D7, G.

The D7 brings F♯, the one note G major has that C major lacks. Once the music stays with it, G is home.

Neighbouring keys on the circle of fifths share most of their chords, so pivots between them are easy to find.`)] },
      { kind: "listen", blocks: [
        audio("C, Am, D7, G: arriving in G major", prog("C", "I vi II7 V", 76)),
        audio("And staying there: G, C, D, G", prog("G", "I IV V I", 76)),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "I vi II7 V"), "C, Am, D7, G. Am is the pivot: vi in C, ii in G."),
        show(chordOf("A", "minor"), "Am belongs to both C major and G major."),
      ] },
      { kind: "practice", blocks: [
        choice("What is a pivot chord?", ["A chord that belongs to both the old key and the new one", "The last chord of a piece", "A chord outside both keys"], 0, "It is heard one way, then reinterpreted."),
        choice("Am is vi in C major. What is it in G major?", ["ii", "iii", "vi"], 0, "A is the second note of G major."),
        choice("Which note signals that C major has moved to G major?", ["F♯", "B♭", "C♯"], 0, "G major has F♯ where C major has F."),
        choice("Which chord confirms the new key of G?", ["D7, its dominant", "F, the old subdominant", "C, the old tonic"], 0, "V7 to I in the new key."),
        choice("Which keys share the most chords?", ["Neighbours on the circle of fifths", "Keys a tritone apart", "Keys a half step apart"], 0, "They differ by a single note."),
        ear("Does this progression change key?", then(prog("C", "I vi II7 V"), prog("G", "I IV V I")), STAYS, 0, "It leaves C through Am and D7 and settles in G."),
      ] },
    ],
  },
  {
    ...base,
    slug: "direct-modulation",
    title: "Direct modulation",
    order: 2,
    concepts: ["direct-modulation"],
    needs: ["pivot-chord-modulation"],
    steps: [
      { kind: "understand", blocks: [text(`A **direct modulation** has no pivot and no preparation. The music simply restarts in a new key.

The most familiar kind lifts a song up by a half step or a whole step for its final chorus. Everything repeats, the same melody and the same progression, only higher. The sudden lift adds energy just when the song has nothing new left to say.

Because nothing connects the two keys, the change is obvious, and that is the point. It works best at a clear boundary: the start of a new section, after a pause or a drum fill.

A small refinement is to put the **V of the new key** on the last beat before the change. It is still abrupt, but the ear is told where it is going.`)] },
      { kind: "listen", blocks: [
        audio("I, IV, V, I in C, then the same in D, a whole step higher", then(prog("C", "I IV V I"), prog("D", "I IV V I"))),
        audio("The same lift, announced by A7, the V of D", then(prog("C", "I IV V I"), prog("D", "V7 I IV V I"))),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "I IV V I"), "The progression in C."),
        show(progression("D", "I IV V I"), "The same progression in D. Nothing links the two; the music just moves up."),
      ] },
      { kind: "practice", blocks: [
        choice("What makes a modulation direct?", ["There is no pivot chord or preparation", "It uses three pivot chords", "It returns to the old key"], 0, "The new key simply begins."),
        choice("Where does a direct modulation usually happen in a song?", ["At the start of the final chorus", "In the middle of a word", "Only in the introduction"], 0, "A clear boundary makes the lift feel deliberate."),
        choice("A song in C lifts a whole step. What is the new key?", ["D", "C♯", "E♭"], 0, "A whole step above C."),
        choice("Which chord can announce a move to D major?", ["A7", "G7", "C7"], 0, "A7 is the V of D."),
        ear("Does this change key?", then(prog("C", "I IV V I"), prog("D", "I IV V I")), STAYS, 0, "The whole progression repeats a whole step higher."),
        ear("And this?", then(prog("C", "I IV V I"), prog("C", "I IV V I")), STAYS, 1, "The same four chords, twice, in C."),
      ] },
    ],
  },
  {
    ...base,
    slug: "common-tone-modulation",
    title: "Common-tone modulation",
    order: 3,
    concepts: ["common-tone-modulation"],
    needs: ["direct-modulation", "common-tones-and-stepwise-motion"],
    steps: [
      { kind: "understand", blocks: [text(`Some keys share no useful chords at all. They can still be joined by a single note.

In a **common-tone modulation**, one note is held, or repeated, while the harmony changes underneath it. The note stays; what it means changes.

Take C major, C E G. Hold the C and change the chord to A♭ major, A♭ C E♭. C was the root; now it is the third. The key has jumped to somewhere distant, yet the join is smooth, because your ear had something to hold on to.

Or hold the E: C major to E major, E G♯ B. E was the third; now it is the root.

The effect is like a door opening onto an unexpected room: surprising, but not jarring.`)] },
      { kind: "listen", blocks: [
        audio("C major to A♭ major, with C held on top", chords("E3 G3 C4", "Eb3 Ab3 C4")),
        audio("C major to E major, with E held on top", chords("C3 G3 E4", "B2 G#3 E4")),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("C", "major"), "C major: C E G."),
        show(chordOf("Ab", "major"), "A♭ major: A♭ C E♭. C is in both chords."),
      ] },
      { kind: "practice", blocks: [
        choice("In a common-tone modulation, what connects the two keys?", ["One note that is held while the chord changes", "A shared chord", "Nothing at all"], 0, "A single note belongs to both harmonies."),
        choice("Which note do C major and A♭ major share?", ["C", "E", "G"], 0, "C E G and A♭ C E♭."),
        choice("In C major, C is the root. What is it in A♭ major?", ["The third", "The fifth", "The root"], 0, "A♭ C E♭."),
        find("C major moves to E major by a common tone. Tap the note they share.", "E", "C E G and E G♯ B."),
        choice("When is a common-tone modulation most useful?", ["Between distant keys with no chords in common", "Between a key and itself", "Only between neighbouring keys"], 0, "One note is enough of a bridge."),
        ear("The top note is held. Does the chord underneath change to a nearby or a distant harmony?", chords("E3 G3 C4", "Eb3 Ab3 C4"), ["A distant one", "A nearby one"], 0, "From C major straight to A♭ major."),
      ] },
    ],
  },
];
