// Track M1, Intermediate stage (docs/PLAYING.md): playing music, for both instruments.
// OWNER REVIEW: the practice and performance advice here (how to learn a song, how to work out chords by ear,
// how to use dynamics, how to record yourself) is common teaching written from memory. It is general
// guidance rather than instrument technique, but it is still unreviewed. The example song is original.
import type { LessonInput } from "@/core/schemas/content";
import { audio, backing, choice, dynamic, ear, prog, rhythm, text } from "../helpers";

const base = { moduleSlug: "musicianship-intermediate", track: "musicianship", stage: "intermediate", isFree: false, version: 1, minutes: 7 } as const;
const G = "G2 D3 G3 B3";
const C = "C3 G3 C4 E4";
const D = "D3 A3 D4 F#4";
const EM = "E2 B2 E3 G3";
const E = "E2 B2 E3 G#3";
const A = "A2 E3 A3 C#4";
const B = "B2 F#3 B3 D#4";
const CSM = "C#3 G#3 C#4 E4";
const hit = (notes: string) => notes.split(" ").join("+");
const bars = (chords: string[], perBar: string) => chords.map((ch) => perBar.replaceAll("X", hit(ch))).join(" | ");

// The original example song: verse G C G D, chorus Em C G D.
const VERSE: [string, string][] = [["G", G], ["C", C], ["G", G], ["D", D]];
const CHORUS: [string, string][] = [["Em", EM], ["C", C], ["G", G], ["D", D]];
const VERSE_SOUND = rhythm(bars(VERSE.map(([, n]) => n), "X/h X/h"), 88);
const CHORUS_SOUND = rhythm(bars(CHORUS.map(([, n]) => n), "X/q X/q X/q X/q"), 88);
const MELODY = rhythm("B4/q B4/q A4/q G4/q | E4/q G4/q G4/h | B4/q D5/q B4/q G4/q | A4/w", 88);
const SPARSE_VERSE = rhythm(bars(VERSE.map(([, n]) => n), "X/h X/h"), 88);
const BUSY_CHORUS = rhythm(bars(CHORUS.map(([, n]) => n), "X/8 X/8 X/8 X/8 X/8 X/8 X/8 X/8"), 88);
const IN_G = rhythm(bars([G, C, D, EM], "X/h X/h"), 88);
const IN_E = rhythm(bars([E, A, B, CSM], "X/h X/h"), 88);
const STEADY = rhythm(bars([G, C, G, D], "X/q X/q X/q X/q"), 90);
const GAP = rhythm(`${bars([G, C], "X/q X/q X/q X/q")} | ${hit(G)}/q ${hit(G)}/q r/q ${hit(G)}/q | ${bars([D], "X/q X/q X/q X/q")}`, 90);

export const musicianshipIntermediate: LessonInput[] = [
  {
    ...base,
    slug: "learning-a-song-start-to-finish",
    title: "Learning a song from start to finish",
    order: 1,
    concepts: ["learning-songs"],
    needs: ["a-daily-practice-routine", "song-forms"],
    steps: [
      { kind: "understand", blocks: [text(`Most players learn songs by starting at the beginning and stopping at the first hard bit. A better method works in **layers**, from the big picture down.

**1. The form.** Listen through once without your instrument and map the sections: intro, verse, chorus, bridge, outro. Write them down. Most songs repeat a lot, so the "whole song" is often just two or three parts.

**2. The chords.** Write a chord chart for each section, four bars to a line. If a section repeats, write it once.

**3. The rhythm.** How the chords are played: strummed on every beat, held, pushed, broken up. Often the verse and chorus differ only here.

**4. The melody or hook.** Last, and only if you need it: the tune, an intro riff, a fill.

Then **put it back together**, section by section, and play the whole song with the recording, even if some parts are rough. Finishing badly teaches you more than perfecting bar 1.

The example in this lesson is an original song:

\`\`\`
Verse:   | G  | C  | G  | D  |
Chorus:  | Em | C  | G  | D  |
\`\`\`

Same chords, mostly. What makes the chorus a chorus is the **E minor at the start** and the **busier rhythm**.`)] },
      { kind: "listen", blocks: [
        audio("Verse: G, C, G, D, two strums a bar", VERSE_SOUND),
        audio("Chorus: Em, C, G, D, four strums a bar", CHORUS_SOUND),
        audio("The melody of the chorus", MELODY),
      ] },
      { kind: "learn", blocks: [
        backing("Play the verse: G, C, G, D.", VERSE, 80),
        backing("Now the chorus: Em, C, G, D.", CHORUS, 80),
      ] },
      { kind: "practice", blocks: [
        choice("What do you work out first?", ["The form: the sections and their order", "The guitar solo", "The last chord"], 0, "The big picture comes first."),
        choice("Which layer usually comes last?", ["The melody or hook", "The form", "The chords"], 0, "Only if the part needs it."),
        choice("A section repeats four times. How often do you write its chart?", ["Once", "Four times", "Never"], 0, "Write it once and mark the repeats."),
        choice("What makes this chorus different from the verse?", ["It starts on Em and the rhythm is busier", "It is in another key", "It has no chords"], 0, "One chord and the rhythm."),
        ear("Verse or chorus?", CHORUS_SOUND, ["Verse", "Chorus"], 1, "It starts on E minor, with four strums a bar."),
        backing("Play the whole song: verse, then chorus, without stopping.", [...VERSE, ...CHORUS], 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "working-out-chords-by-ear",
    title: "Working out chords by ear",
    order: 2,
    concepts: ["chords-by-ear"],
    needs: ["learning-a-song-start-to-finish", "finding-the-key-of-a-song", "hearing-one-four-and-five"],
    steps: [
      { kind: "understand", blocks: [text(`You do not need a chord chart if you can hear the chords. The secret is that **you do not have to guess from all possible chords**, only from the handful that belong to the song's key.

The method:

**1. Find the key.** Hum the note that sounds like home, usually the last note of the song or the chorus. Find it on your instrument. That is the key note (Level 2).

**2. List the chords of that key** (Level 3). In G major:

| I | ii | iii | IV | V | vi |
|---|---|---|---|---|---|
| G | Am | Bm | C | D | Em |

Most pop songs use **I, IV, V and vi** almost exclusively.

**3. Test the bass.** For each chord change, hum the lowest note. It is usually the root. Find it, and pick the chord from your list that starts on it.

**4. Check major or minor.** If the chord on E sounds dark, it is Em, as the list predicts. If it sounds bright, the song has borrowed a chord from outside the key. That happens, and now you can name it.

**5. Play along and listen.** A wrong chord sounds wrong immediately, which tells you where to look again.

With practice, step 3 turns into simply hearing "that is the IV chord", without humming.`)] },
      { kind: "listen", blocks: [
        audio("I – IV – I – V in G", prog("G", "I IV I V", 84)),
        audio("I – V – vi – IV in G", prog("G", "I V vi IV", 84)),
      ] },
      { kind: "learn", blocks: [
        backing("Play along with I, V, vi, IV in G: G, D, Em, C.", [["G", G], ["D", D], ["Em", EM], ["C", C]], 80),
      ] },
      { kind: "practice", blocks: [
        choice("Why does knowing the key help?", ["It narrows the chords down to a few", "It tells you the tempo", "It tells you the lyrics"], 0, "Most chords come from the key's list."),
        choice("In G major, which chord is IV?", ["C", "D", "Em"], 0, "G A B C: the fourth is C."),
        choice("You hum a bass note of E in a song in G. Which chord is most likely?", ["Em", "E major", "E7"], 0, "vi in G is E minor."),
        ear("The second chord: IV or V?", prog("G", "I IV I IV", 84), ["IV", "V"], 0, "It moves up to C: calm, open."),
        ear("The second chord: IV or V?", prog("G", "I V I V", 84), ["IV", "V"], 1, "It moves to D: it wants to go home."),
        ear("Is the third chord vi (minor) or IV (major)?", prog("G", "I V vi IV", 84), ["vi, minor", "IV, major"], 0, "Em: the dark one."),
      ] },
    ],
  },
  {
    ...base,
    slug: "dynamics-and-making-a-chorus-lift",
    title: "Dynamics: making a chorus lift",
    order: 3,
    concepts: ["arranging-dynamics"],
    needs: ["working-out-chords-by-ear", "dynamics"],
    steps: [
      { kind: "understand", blocks: [text(`If every part of a song is played the same way, the chorus has nowhere to go. A good accompanist **plans the energy** of a song, so the chorus arrives like an event.

Ways to make a chorus lift, on either instrument:

- **Volume.** The simplest: verse softer, chorus louder. Leave yourself somewhere to go: if the verse is already loud, the chorus cannot grow.
- **Rhythm density.** More notes per bar in the chorus. Two strums a bar in the verse, eighth notes in the chorus; or held piano chords in the verse, pulsing chords in the chorus.
- **Range.** Spread wider in the chorus: lower bass notes, higher chords.
- **Space before it.** Drop out, or play a single chord, for the last beat before the chorus. The silence makes the arrival louder than any volume could.

And the reverse matters too: **bring the verse back down** after the chorus, so the next chorus can lift again.

Think of a song as a line on a graph: low in the verse, high in the chorus, highest in the last chorus, and down again at the end. Then use the four tools above to draw that line with your playing.`)] },
      { kind: "listen", blocks: [
        audio("Verse: two chords a bar", SPARSE_VERSE),
        audio("Chorus: the same chords in eighth notes", BUSY_CHORUS),
        audio("Soft and loud on one chord", dynamic("G3 B3 D4 G4", 0.25)),
        audio("…and loud", dynamic("G3 B3 D4 G4", 1)),
      ] },
      { kind: "learn", blocks: [
        backing("Play the verse quietly, two strums or chords a bar…", VERSE, 80),
        backing("…then the chorus loud and busy.", CHORUS, 80),
      ] },
      { kind: "practice", blocks: [
        choice("Why keep the verse softer?", ["So the chorus has somewhere to go", "Verses are less important", "To save energy"], 0, "Contrast makes the lift."),
        choice("Which of these makes a chorus lift without getting louder?", ["More notes per bar", "Playing the same pattern", "Stopping completely"], 0, "Rhythm density raises the energy."),
        choice("What does a short silence before the chorus do?", ["It makes the arrival stronger", "It confuses the band", "It ends the song"], 0, "Space is a dynamic too."),
        choice("What should happen after the chorus?", ["Bring the energy back down", "Keep getting louder", "Stop"], 0, "So the next chorus can lift again."),
        ear("Sparse verse or busy chorus?", BUSY_CHORUS, ["Sparse verse", "Busy chorus"], 1, "Eight chords a bar."),
        backing("Play the whole song, soft verse into loud chorus.", [...VERSE, ...CHORUS], 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "transposing-for-a-singer",
    title: "Transposing a song for a singer",
    order: 4,
    concepts: ["transposing-in-practice"],
    needs: ["dynamics-and-making-a-chorus-lift", "transposing", "using-a-capo"],
    steps: [
      { kind: "understand", blocks: [text(`A song in the wrong key for a singer is a song they cannot sing. Moving it to a better key, **transposing**, is one of the most useful things an accompanist can do.

**Step 1: find the right key.** Ask the singer to sing the highest and lowest notes of the song. If the top is a strain, move the song down; if the bottom disappears, move it up. A **minor third** (three half steps) is a common amount.

**Step 2: convert the chords with numbers.** Write the chords as Roman numerals in the old key, then read them back in the new key.

| Numeral | In G | In E |
|---|---|---|
| I | G | E |
| IV | C | A |
| V | D | B |
| vi | Em | C♯m |

Every chord moves by the same distance, so the song is unchanged except for its height.

**Step 3, on guitar: consider a capo.** If the new key has awkward chords, a capo lets you keep easy shapes. To play in **A** with **G** shapes, put the capo on fret 2. (A capo can only raise the pitch. For E, play E shapes with no capo, or D shapes with the capo on fret 2.)

**On piano**, there is no capo. Think in numerals and in the shapes of the new key; a good practice is to play every song you know in at least two keys.`)] },
      { kind: "listen", blocks: [
        audio("G, C, D, Em in G", IN_G),
        audio("The same song in E: E, A, B, C♯m", IN_E),
      ] },
      { kind: "learn", blocks: [
        backing("The song in E: E, A, B, C♯m.", [["E", E], ["A", A], ["B", B], ["C#m", CSM]], 80),
      ] },
      { kind: "practice", blocks: [
        choice("What stays the same when you transpose?", ["The Roman numerals of the chords", "The chord names", "The key"], 0, "Every chord moves the same distance."),
        choice("A song in G goes down a minor third. What is the new key?", ["E", "F", "B♭"], 0, "G, F♯, F, E: three half steps."),
        choice("In E major, what is vi?", ["C♯m", "Cm", "D♯m"], 0, "E F♯ G♯ A B C♯: the sixth is C♯, minor."),
        choice("To play in A using G shapes, where does the capo go?", ["Fret 2", "Fret 5", "Fret 3"], 0, "G up two half steps is A."),
        ear("Same song, different key: higher or lower?", IN_E, ["Higher than in G", "Lower than in G"], 1, "E is a minor third below G."),
        choice("The singer strains on the high notes. Which way should you move the key?", ["Down", "Up", "It does not matter"], 0, "Lower key, lower top notes."),
      ] },
    ],
  },
  {
    ...base,
    slug: "recording-yourself",
    title: "Recording yourself and listening back",
    order: 5,
    concepts: ["self-review"],
    needs: ["transposing-for-a-singer"],
    steps: [
      { kind: "understand", blocks: [text(`While you play, your attention is on your hands. You genuinely cannot hear yourself the way a listener does. A recording can.

A phone is enough. How to use it:

1. **Record a complete take**, start to finish, as if someone were listening. Do not stop for mistakes.
2. **Wait a while**, at least an hour, before listening. Fresh ears hear more.
3. **Listen for one thing at a time:**
   - **Time.** Are you steady? Rushing the easy parts, dragging the hard ones?
   - **Gaps.** Does the music stop at the chord changes?
   - **Balance and dynamics.** Is the melody clear? Does the chorus lift?
   - **Tone.** Buzzing strings, uneven notes, a muddy pedal?
4. **Pick the one problem that matters most**, and practise only that.
5. **Record again** next week and compare.

Most players discover the same surprise the first time: things they thought were fine are not, and things they worried about nobody would notice. Both are useful.

The commonest problem by far is a **gap at the chord change**: the hands are still moving, so a beat goes missing. In the examples below, one take has exactly that.`)] },
      { kind: "listen", blocks: [
        audio("A steady take", STEADY),
        audio("A take with a gap: a beat is lost in bar 3", GAP),
      ] },
      { kind: "learn", blocks: [
        backing("Record yourself playing this, then listen back for gaps at the changes.", [["G", G], ["C", C], ["G", G], ["D", D]], 80),
      ] },
      { kind: "practice", blocks: [
        choice("Why record yourself?", ["You cannot hear yourself clearly while playing", "To post every take online", "To avoid practising"], 0, "Your attention is on your hands."),
        choice("What should you do when you make a mistake during a take?", ["Keep going to the end", "Stop and start again", "Delete the recording"], 0, "A complete take shows the whole picture."),
        choice("How should you listen back?", ["For one thing at a time", "For everything at once", "Only for wrong notes"], 0, "Time, gaps, balance, tone: one at a time."),
        ear("Steady, or a gap?", GAP, ["Steady", "There is a gap"], 1, "Bar 3 loses a beat."),
        ear("And this one?", STEADY, ["Steady", "There is a gap"], 0, "A chord on every beat."),
        choice("After listening, what do you practise?", ["The one problem that matters most", "Everything again from the start", "Nothing"], 0, "Fix one thing, then record again."),
      ] },
    ],
  },
];
