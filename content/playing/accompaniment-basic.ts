// Playing track P1, Basic stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (finger numbers, hand shape, how to move between chords) is
// standard teaching written from memory, not checked against a pianist. Each such passage is marked
// "OWNER REVIEW" below. These lessons also still need their demo videos.
import type { LessonInput } from "@/core/schemas/content";
import { audio, chordOf, choice, ear, find, hands, handsSound, rhythm, show, text, together } from "../helpers";

const base = { moduleSlug: "accompaniment-basic", track: "piano-accompaniment", strand: "piano", isFree: false, version: 1, minutes: 6 } as const;
const P = { only: "piano" } as const;

// Right-hand triads in root position, and the left hand's root and fifth for each.
const C = "C4+E4+G4";
const F = "F4+A4+C5";
const G = "G4+B4+D5";
const ROOT = { C: "C3", F: "F2", G: "G2" };
const FIFTH = { C: "G3", F: "C3", G: "D3" };
const times = (token: string, n: number) => Array(n).fill(token).join(" ");
const fingers = (token: string, n: number) => Array(n).fill(token).join(" ");

const C_PULSE = times(`${C}/q`, 4);
const THREE_CHORDS = `${times(`${C}/q`, 4)} | ${times(`${F}/q`, 4)} | ${times(`${G}/q`, 4)} | ${C}/w`;
const THREE_ROOTS = `${ROOT.C}/w | ${ROOT.F}/w | ${ROOT.G}/w | ${ROOT.C}/w`;
const ROOT_FIFTH = `${ROOT.C}/h ${FIFTH.C}/h | ${ROOT.F}/h ${FIFTH.F}/h | ${ROOT.G}/h ${FIFTH.G}/h | ${ROOT.C}/w`;
const WHOLE_CHANGES = `${C}/w | ${F}/w | ${C}/w | ${G}/w`;
const HALF_CHANGES = `${C}/h ${C}/h | ${F}/h ${F}/h | ${C}/h ${C}/h | ${G}/h ${G}/h`;
const broken = (low: string, mid: string, high: string) => `${low}/8 ${mid}/8 ${high}/8 ${mid}/8 ${low}/8 ${mid}/8 ${high}/8 ${mid}/8`;
const BROKEN_C = broken("C4", "E4", "G4");
const BROKEN_F = broken("F4", "A4", "C5");
const BROKEN_G = broken("G4", "B4", "D5");
const BROKEN_FINGERS = "1 3 5 3 1 3 5 3";
// The pop pattern: left hand root on beat 1 and fifth on beat 3; right hand pulses the chord on every beat.
const POP_RIGHT = `${times(`${C}/q`, 4)} | ${times(`${F}/q`, 4)} | ${times(`${G}/q`, 4)} | ${times(`${C}/q`, 4)}`;
const POP_LEFT = `${ROOT.C}/h ${FIFTH.C}/h | ${ROOT.F}/h ${FIFTH.F}/h | ${ROOT.G}/h ${FIFTH.G}/h | ${ROOT.C}/h ${FIFTH.C}/h`;
// Study piece: an original eight-bar melody over C, C, F, C, F, C, G, C.
const MELODY = "E4/q G4/q G4/h | E4/q G4/q C5/h | A4/q A4/q C5/q A4/q | G4/w | F4/q A4/q A4/h | E4/q G4/q G4/h | D4/q F4/q E4/q D4/q | C4/w";
const STUDY_BARS = ["C", "C", "F", "C", "F", "C", "G", "C"];
const studyRight = (bars: string[]) => bars.map((name) => times(`${{ C, F, G }[name]}/q`, 4)).join(" | ");
const studyLeft = (bars: string[]) => bars.map((name) => `${ROOT[name as "C"]}/h ${FIFTH[name as "C"]}/h`).join(" | ");

export const accompanimentBasic: LessonInput[] = [
  {
    ...base,
    slug: "block-chords-on-the-beat",
    title: "Block chords on the beat",
    order: 1,
    concepts: ["block-chords"],
    needs: ["piano-layout", "counting-out-loud"],
    steps: [
      // OWNER REVIEW: finger numbers and hand shape.
      { kind: "understand", blocks: [text(`To accompany is to play the chords while someone, or something, carries the tune. It is the piano's version of strumming, and it is how most people play songs.

Start with the right hand and one chord. A **block chord** is all the notes of a chord played together.

**C major** is three white keys: **C, E and G**. Play one, skip one, play one, skip one, play one.

Pianists number their fingers the same way on both hands: **the thumb is 1 and the little finger is 5.** For C major in the right hand, use **1, 3 and 5**: thumb on C, middle finger on E, little finger on G.

Keep the hand rounded, as if holding a ball, and press all three keys in one movement so that they sound at exactly the same moment.

Now play that chord **on every beat**: four times in a bar, counting 1, 2, 3, 4. This is the piano's "downstrokes on the beat".

Two more chords use the same hand shape, moved to a new place: **F major** is F, A, C and **G major** is G, B, D. With C, F and G you can accompany a great many songs.`)] },
      { kind: "listen", blocks: [
        audio("The C major chord", together("C4 E4 G4")),
        audio("C major on every beat", rhythm(C_PULSE, 80)),
        audio("C, F and G, four beats each, ending on C", rhythm(THREE_CHORDS, 80)),
      ] },
      { kind: "learn", blocks: [
        show(chordOf("C", "major"), "C major: C, E, G. Play one, skip one.", "piano"),
        hands({ right: C_PULSE, rightFingers: fingers("135", 4) }, "C major on every beat, with fingers 1, 3 and 5."),
        hands({ right: THREE_CHORDS, rightFingers: fingers("135", 13) }, "C, F, G and back to C. The hand keeps its shape and moves as one piece."),
      ] },
      { kind: "practice", blocks: [
        choice("What is a block chord?", ["All the notes of a chord played together", "The notes played one at a time", "A chord in the left hand only"], 0, "Together, at the same moment."),
        choice("Which finger is number 1?", ["The thumb", "The index finger", "The little finger"], 0, "On both hands the thumb is 1 and the little finger is 5."),
        choice("Which fingers play C major in the right hand?", ["1, 3 and 5", "1, 2 and 3", "2, 3 and 4"], 0, "Thumb, middle finger, little finger."),
        find("Tap the middle note of the C major chord.", "E", "C, E, G.", P),
        choice("Which notes make F major?", ["F, A, C", "F, G, A", "F, B, D"], 0, "Play one, skip one, starting on F."),
        hands({ right: THREE_CHORDS, rightFingers: fingers("135", 13) }, "Play along at 60. Count out loud.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "left-hand-roots",
    title: "The left hand: root, then root and fifth",
    order: 2,
    concepts: ["left-hand-bass"],
    needs: ["block-chords-on-the-beat"],
    steps: [
      // OWNER REVIEW: left-hand finger numbers.
      { kind: "understand", blocks: [text(`The right hand has the chord. The left hand's job is the **bass**: a low note that tells the ear which chord it is hearing.

**Step 1: the root.** Under each chord, the left hand plays one note, the note the chord is named after. C under C major, F under F major, G under G major. Play it low, an octave or more below the right hand, and hold it for the whole bar.

That alone turns a thin sound into a full one.

**Step 2: root and fifth.** The **fifth** is the top note of the chord: G for C major, C for F major, D for G major. Play the root on beat 1 and the fifth on beat 3. The bass now moves, and the bar has a gentle "one, two" inside it.

For root and fifth, a common left-hand fingering is the little finger, **5**, on the root and the thumb, **1**, on the fifth. The hand stays open over both notes, so neither has to be searched for.

Practise the left hand alone before adding the right. When the hands come together, the right hand's four chords line up with the left hand's two notes: left hand plays on beats 1 and 3, right hand on every beat.`)] },
      { kind: "listen", blocks: [
        audio("Right hand alone: C, F, G, C", rhythm(THREE_CHORDS, 80)),
        audio("With the root in the left hand", handsSound(THREE_CHORDS, THREE_ROOTS, 80)),
        audio("With root and fifth", handsSound(THREE_CHORDS, ROOT_FIFTH, 80)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: THREE_CHORDS, left: THREE_ROOTS, leftFingers: "5 5 5 5" }, "The root under each chord, held for the bar."),
        hands({ right: THREE_CHORDS, left: ROOT_FIFTH, leftFingers: "5 1 5 1 5 1 5" }, "Root on beat 1, fifth on beat 3."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the left hand's job in accompaniment?", ["The bass", "The melody", "Nothing"], 0, "A low note that names the chord."),
        choice("Which note is the root of F major?", ["F", "A", "C"], 0, "The note the chord is named after."),
        choice("Which note is the fifth of C major?", ["G", "E", "F"], 0, "C, E, G: the top note of the chord."),
        find("Tap the fifth of G major.", "D", "G, B, D.", P),
        choice("In root-and-fifth, on which beats does the left hand play?", ["1 and 3", "2 and 4", "Every beat"], 0, "Root on 1, fifth on 3."),
        hands({ right: THREE_CHORDS, left: ROOT_FIFTH, leftFingers: "5 1 5 1 5 1 5" }, "Play along at 60. Try the left hand alone first.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "changing-chords-at-the-piano",
    title: "Changing chords in time at the piano",
    order: 3,
    concepts: ["chord-changes"],
    needs: ["left-hand-roots"],
    steps: [
      // OWNER REVIEW: how the hand travels between chords.
      { kind: "understand", blocks: [text(`Playing one chord is easy. The skill is getting to the **next** one without the beat stopping.

The rule is the same as on any instrument: **beat 1 of the new bar must arrive on time.** Everything else is arranged around that.

How to make it happen:

- **Keep the shape.** C, F and G major all use the same hand shape. Do not rebuild the chord finger by finger. Lift the hand as one piece and set it down as one piece.
- **Look ahead.** Before the change, look at the key your thumb is going to. The hand follows the eyes.
- **Leave early.** If you are late, shorten the last chord of the bar. Let go a little before the bar ends and use that moment to travel. Nobody hears a slightly short last beat. Everybody hears a late first beat.

Build up in stages:

1. **One chord per bar, held.** A whole bar to prepare each change.
2. **Two chords per bar.** Half as long to prepare.
3. **A chord on every beat.** One beat to move.

If a change makes you hesitate, the tempo is too fast. Slow down until it does not.`)] },
      { kind: "listen", blocks: [
        audio("Stage 1: one held chord per bar", rhythm(WHOLE_CHANGES, 80)),
        audio("Stage 2: two per bar", rhythm(HALF_CHANGES, 80)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: WHOLE_CHANGES, rightFingers: "135 135 135 135" }, "Stage 1. C, F, C, G: hold each chord and look at where the thumb goes next."),
        hands({ right: HALF_CHANGES, rightFingers: fingers("135", 8) }, "Stage 2. Twice in each bar."),
      ] },
      { kind: "practice", blocks: [
        choice("When chords change, what must arrive on time?", ["Beat 1 of the new bar", "The last beat of the old bar", "Nothing in particular"], 0, "A late first beat is what listeners notice."),
        choice("How should the hand move from C major to F major?", ["As one piece, keeping its shape", "One finger at a time", "By sliding along the keys"], 0, "The shape is the same; only the place changes."),
        choice("You keep arriving late. What can you do?", ["Shorten the last chord of the bar and leave early", "Play the new chord late", "Stop and start again"], 0, "Use the end of the bar to travel."),
        choice("A change still makes you hesitate. What does that tell you?", ["The tempo is too fast", "The chord is wrong", "You need a different finger"], 0, "Slow down until it is steady, then speed up."),
        hands({ right: HALF_CHANGES, rightFingers: fingers("135", 8) }, "Play along at 60.", 60),
        hands({ right: THREE_CHORDS, left: THREE_ROOTS, rightFingers: fingers("135", 13), leftFingers: "5 5 5 5" }, "Both hands, a chord on every beat, at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "broken-chord-accompaniment",
    title: "Broken chords",
    order: 4,
    concepts: ["broken-chords"],
    needs: ["changing-chords-at-the-piano"],
    steps: [
      { kind: "understand", blocks: [text(`A block chord sounds all its notes at once. A **broken chord** plays the same notes **one at a time**. The harmony is identical, and the effect is completely different: flowing where the block chord is solid.

The hand does not move. It holds the chord shape, and the fingers take turns.

The first pattern to learn goes **bottom, middle, top, middle**. For C major that is **C, E, G, E**, with fingers **1, 3, 5, 3**. As eighth notes it fits twice in a bar:

**C E G E C E G E**, counted 1 & 2 & 3 & 4 &.

Things to listen for:

- **Even notes.** The thumb is heavy and the little finger is light. Aim for all three to sound the same.
- **Smoothness.** Each note should connect to the next with no gap.
- **A still hand.** Only the fingers move.

Underneath, the left hand does what it already knows: the root, held for the bar.

Block chords suit songs with drive. Broken chords suit ballads and anything gentle. Often a song uses broken chords in the verse and block chords in the chorus.`)] },
      { kind: "listen", blocks: [
        audio("C major as a block chord, then broken", rhythm(`${C}/h r/h | ${BROKEN_C}`, 80)),
        audio("Broken chords through C, F, G, C with the root below", handsSound(`${BROKEN_C} | ${BROKEN_F} | ${BROKEN_G} | ${BROKEN_C}`, `${ROOT.C}/w | ${ROOT.F}/w | ${ROOT.G}/w | ${ROOT.C}/w`, 80)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: BROKEN_C, rightFingers: BROKEN_FINGERS }, "C major, broken: bottom, middle, top, middle.", 60),
        hands({ right: `${BROKEN_C} | ${BROKEN_F}`, rightFingers: `${BROKEN_FINGERS} ${BROKEN_FINGERS}`, left: `${ROOT.C}/w | ${ROOT.F}/w`, leftFingers: "5 5" }, "C then F, with the root in the left hand.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What is a broken chord?", ["The notes of a chord played one at a time", "A chord with a wrong note", "Two chords at once"], 0, "Same notes as the block chord, in turn."),
        choice("In the pattern bottom, middle, top, middle, which notes does C major give?", ["C, E, G, E", "C, G, E, G", "C, D, E, F"], 0, "Bottom C, middle E, top G, middle E."),
        choice("Which fingers play it in the right hand?", ["1, 3, 5, 3", "1, 2, 3, 2", "5, 3, 1, 3"], 0, "The same fingers as the block chord, taking turns."),
        ear("Block chords or broken chords?", rhythm(BROKEN_F, 80), ["Block chords", "Broken chords"], 1, "You hear one note at a time."),
        ear("And here?", rhythm(times(`${F}/q`, 4), 80), ["Block chords", "Broken chords"], 0, "All three notes sound together on each beat."),
        hands({ right: `${BROKEN_C} | ${BROKEN_F} | ${BROKEN_G} | ${BROKEN_C}`, rightFingers: fingers(BROKEN_FINGERS, 4), left: `${ROOT.C}/w | ${ROOT.F}/w | ${ROOT.G}/w | ${ROOT.C}/w`, leftFingers: "5 5 5 5" }, "Play along: C, F, G, C at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "first-pop-pattern",
    title: "A first pop pattern",
    order: 5,
    concepts: ["pop-accompaniment"],
    needs: ["broken-chord-accompaniment"],
    steps: [
      { kind: "understand", blocks: [text(`Put the two hands together and you have the accompaniment behind a great many pop songs:

- **Left hand:** root on beat 1, fifth on beat 3.
- **Right hand:** the chord, pulsed on every beat.

The left hand is the bass player. The right hand is the rhythm guitar. Together they make a complete backing.

Count a bar: on **1** both hands play; on **2** the right hand alone; on **3** both again; on **4** the right hand alone.

Getting it to feel good:

- **Bass a little stronger than chords.** The left hand leads; the right hand fills in.
- **Beat 1 strongest.** Lean on it slightly and let beats 2 and 4 be lighter.
- **Steady, not hurried.** Repeated chords tempt the hand to rush. Stay with the click.

Once this is comfortable, it bends easily. Hold the chord for two beats and it becomes a slow ballad. Swap the right hand to broken chords and it becomes gentler still. The left hand does not change.`)] },
      { kind: "listen", blocks: [
        audio("The pattern on C", handsSound(times(`${C}/q`, 4), `${ROOT.C}/h ${FIFTH.C}/h`, 84)),
        audio("Through C, F, G, C", handsSound(POP_RIGHT, POP_LEFT, 84)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: times(`${C}/q`, 4), rightFingers: fingers("135", 4), left: `${ROOT.C}/h ${FIFTH.C}/h`, leftFingers: "5 1" }, "One bar on C. Both hands on beats 1 and 3; right hand alone on 2 and 4.", 60),
        hands({ right: POP_RIGHT, rightFingers: fingers("135", 16), left: POP_LEFT, leftFingers: fingers("5 1", 4) }, "C, F, G, C.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("In this pattern, what does the left hand play?", ["Root on beat 1, fifth on beat 3", "The chord on every beat", "The melody"], 0, "The left hand is the bass player."),
        choice("On which beats do both hands play together?", ["1 and 3", "2 and 4", "Only beat 1"], 0, "The right hand also plays alone on 2 and 4."),
        choice("Which should be a little stronger?", ["The bass", "The chords"], 0, "The left hand leads; the right hand fills in."),
        ear("Is the left hand playing only the root, or root and fifth?", handsSound(times(`${C}/q`, 4), `${ROOT.C}/h ${FIFTH.C}/h`, 80), ["Only the root", "Root and fifth"], 1, "The low note changes on beat 3."),
        hands({ right: POP_RIGHT, rightFingers: fingers("135", 16), left: POP_LEFT, leftFingers: fingers("5 1", 4) }, "Play along at 60.", 60),
        hands({ right: POP_RIGHT, rightFingers: fingers("135", 16), left: POP_LEFT, leftFingers: fingers("5 1", 4) }, "And at 80.", 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "accompaniment-study-piece",
    title: "Study piece: accompany a melody with three chords",
    order: 6,
    minutes: 8,
    concepts: ["accompaniment-study"],
    needs: ["first-pop-pattern"],
    steps: [
      { kind: "understand", blocks: [text(`Now do the real job: play the accompaniment while a melody is played over it.

The piece is eight bars long, one chord per bar:

**C – C – F – C – F – C – G – C**

Three chords, the pop pattern from the last lesson, and nothing new for your hands. What is new is **listening**. An accompanist plays in time with someone else, and a little under them.

Work through it in three passes:

1. **Left hand alone**: root and fifth through all eight bars.
2. **Both hands**: add the right-hand chords.
3. **With the melody**: the app plays the tune. You play the accompaniment under it.

In the third pass, keep your part quieter than the melody, and keep going whatever happens. If you lose your place, drop the right hand, find the next root with the left, and come back in. A missing chord goes unnoticed. A stop does not.`)] },
      { kind: "listen", blocks: [
        audio("The melody alone", rhythm(MELODY, 90)),
        audio("The accompaniment alone: bars 1 to 4", handsSound(studyRight(STUDY_BARS.slice(0, 4)), studyLeft(STUDY_BARS.slice(0, 4)), 90)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: studyRight(STUDY_BARS.slice(0, 4)), rightFingers: fingers("135", 16), left: studyLeft(STUDY_BARS.slice(0, 4)), leftFingers: fingers("5 1", 4) }, "Bars 1 to 4: C, C, F, C.", 60),
        hands({ right: studyRight(STUDY_BARS.slice(4)), rightFingers: fingers("135", 16), left: studyLeft(STUDY_BARS.slice(4)), leftFingers: fingers("5 1", 4) }, "Bars 5 to 8: F, C, G, C.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("How many different chords does the piece use?", ["Three", "Four", "Eight"], 0, "C, F and G."),
        choice("While accompanying, how loud should your part be?", ["A little quieter than the melody", "Louder than the melody", "As loud as possible"], 0, "The tune leads; you support it."),
        choice("You lose your place. What should you do?", ["Keep the left hand going and rejoin", "Stop and start from the beginning", "Play faster to catch up"], 0, "The beat must not stop."),
        { type: "play-along", prompt: "The melody plays. Accompany it with the pop pattern: C, C, F, C, F, C, G, C.", sound: rhythm(MELODY, 70), bpm: 70, bars: STUDY_BARS },
      ] },
    ],
  },
];
