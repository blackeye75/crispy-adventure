// Playing track P1, Intermediate stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (finger numbers, how to pedal, how to place the hand for an
// Alberti bass or a tenth) is standard teaching written from memory, not checked against a pianist. The
// patterns and the study piece are original. The app cannot press the sustain pedal: pedalled examples
// sound dry. These lessons also still need their demo videos.
import type { LessonInput, Sound } from "@/core/schemas/content";
import { audio, choice, ear, hands, handsSound, rhythm, staff, text } from "../helpers";

const base = { moduleSlug: "accompaniment-intermediate", track: "piano-accompaniment", stage: "intermediate", strand: "piano", isFree: false, version: 1, minutes: 7 } as const;

// I–vi–IV–V in C. Root-position right hand (jumpy) against inversions chosen to move as little as possible.
const ROOTS = { C: "C4+E4+G4", Am: "A3+C4+E4", F: "F4+A4+C5", G: "G4+B4+D5" };
const NEAR = { C: "C4+E4+G4", Am: "C4+E4+A4", F: "C4+F4+A4", G: "B3+D4+G4" }; // root, 1st inv., 2nd inv., 1st inv.
const BASS = { C: "C3", Am: "A2", F: "F2", G: "G2" };
const FIFTH = { C: "G3", Am: "E3", F: "C3", G: "D3" };
const THIRD = { C: "E3", Am: "C3", F: "A2", G: "B2" };
const TENTH = { C: "E4", Am: "C4", F: "A3", G: "B3" };
type Name = keyof typeof NEAR;
const LOOP: Name[] = ["C", "Am", "F", "G"];
const bars = (names: Name[], bar: (n: Name) => string) => names.map(bar).join(" | ");

const JUMPY = bars(LOOP, (n) => `${ROOTS[n]}/w`);
const SMOOTH = bars(LOOP, (n) => `${NEAR[n]}/w`);
const ROOT_BASS = bars(LOOP, (n) => `${BASS[n]}/w`);
const HALVES = bars(LOOP, (n) => `${NEAR[n]}/h ${NEAR[n]}/h`);
const ROOT_FIFTH_OCTAVE = bars(LOOP, (n) => `${BASS[n]}/q ${FIFTH[n]}/q ${BASS[n].replace(/\d/, (d) => String(+d + 1))}/q ${FIFTH[n]}/q`);
const ALBERTI = bars(LOOP, (n) => `${BASS[n]}/8 ${FIFTH[n]}/8 ${THIRD[n]}/8 ${FIFTH[n]}/8 `.repeat(2).trim());
const TENTHS = bars(LOOP, (n) => `${BASS[n]}/8 ${FIFTH[n]}/8 ${TENTH[n]}/8 ${FIFTH[n]}/8 `.repeat(2).trim());
const BALLAD_LEFT = bars(LOOP, (n) => `${BASS[n]}/8 ${FIFTH[n]}/8 ${TENTH[n]}/8 ${FIFTH[n]}/8 ${BASS[n]}/8 ${FIFTH[n]}/8 ${TENTH[n]}/8 ${FIFTH[n]}/8`);
const BALLAD_RIGHT = bars(LOOP, (n) => `${NEAR[n]}/w`);
const POP_332 = bars(LOOP, (n) => `${NEAR[n]}/q. ${NEAR[n]}/q. ${NEAR[n]}/q`);
const POP_PUSH = bars(LOOP, (n) => `${NEAR[n]}/q ${NEAR[n]}/8 ${NEAR[n]}/8 r/8 ${NEAR[n]}/8 ${NEAR[n]}/q`);
const WALTZ_RIGHT = bars(LOOP, (n) => `r/q ${NEAR[n]}/q ${NEAR[n]}/q`);
const WALTZ_LEFT = bars(LOOP, (n) => `${BASS[n]}/h.`);
const SIX_EIGHT_LEFT = bars(LOOP, (n) => `${BASS[n]}/8 ${FIFTH[n]}/8 ${TENTH[n]}/8 ${BASS[n].replace(/\d/, (d) => String(+d + 1))}/8 ${TENTH[n]}/8 ${FIFTH[n]}/8`);
const SIX_EIGHT_RIGHT = bars(LOOP, (n) => `${NEAR[n]}/q. ${NEAR[n]}/q.`);
/** Both hands over a click on every eighth note, six to the bar, for 6/8. */
const sixEight = (right: string, left: string, bpm: number): Sound => ({ ...handsSound(right, left, bpm, 6), click: 0.5 } as Sound);

// Study piece: verse (I–vi–IV–V twice, Alberti), chorus (IV–V–I–vi, 3-3-2 with a root-fifth-octave bass), and a fill into the chorus.
const VERSE_RIGHT = bars([...LOOP, "C", "Am", "F"], (n) => `${NEAR[n]}/w`) + ` | ${NEAR.G}/h G4/8 B4/8 D5/8 G5/8`;
const VERSE_LEFT = bars([...LOOP, ...LOOP], (n) => `${BASS[n]}/8 ${FIFTH[n]}/8 ${THIRD[n]}/8 ${FIFTH[n]}/8 `.repeat(2).trim());
const CHORUS: Name[] = ["F", "G", "C", "Am", "F", "G", "C", "C"];
const CHORUS_RIGHT = bars(CHORUS, (n) => `${NEAR[n]}/q. ${NEAR[n]}/q. ${NEAR[n]}/q`);
const CHORUS_LEFT = bars(CHORUS, (n) => `${BASS[n]}/q ${FIFTH[n]}/q ${BASS[n].replace(/\d/, (d) => String(+d + 1))}/q ${FIFTH[n]}/q`);

export const accompanimentIntermediate: LessonInput[] = [
  {
    ...base,
    slug: "inversions-for-smooth-changes",
    title: "Inversions for smooth changes",
    order: 1,
    concepts: ["voice-leading-at-the-piano"],
    needs: ["accompaniment-study-piece", "smooth-chord-changes"],
    steps: [
      { kind: "understand", blocks: [text(`Play C, Am, F and G in root position and your right hand jumps all over the keyboard. It sounds jumpy too: every note leaps, and the chords feel like separate events.

Inversions fix that. You already know that an inversion is the same chord with a different note at the bottom. At the piano, the reason to use one is simple: **pick the version of the next chord that is closest to where your hand already is.**

Two rules do almost all the work:

1. **Keep any note the two chords share.** C major and A minor share C and E. So keep them, and move only G up a step to A.
2. **Move the other notes to the nearest note of the new chord**, by a step if you can.

For C, Am, F, G that gives:

| Chord | Notes | Shape |
|---|---|---|
| C | C E G | root position |
| Am | C E A | first inversion |
| F | C F A | second inversion |
| G | B D G | first inversion |

Your hand barely moves. Each change is one or two fingers stepping, and the **top note** makes a little tune of its own: G, A, A, G. Listeners hear that as smooth, even if they could not say why.

Keep the left hand on the roots, so the bass still says which chord it is.`)] },
      { kind: "listen", blocks: [
        audio("Root position every time: the hand jumps", handsSound(JUMPY, ROOT_BASS, 72)),
        audio("Nearest inversions: the hand barely moves", handsSound(SMOOTH, ROOT_BASS, 72)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: SMOOTH, rightFingers: "135 125 135 125", left: ROOT_BASS, leftFingers: "5 5 5 5" }, "C, Am, F, G with the nearest inversion each time. Watch how little the right hand moves.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes do C major and A minor share?", ["C and E", "G and A", "None"], 0, "C E G and A C E: two notes in common."),
        choice("What is the first rule for a smooth change?", ["Keep the notes the chords share", "Always use root position", "Move every note"], 0, "Shared notes stay where they are."),
        choice("Which inversion of F is closest to C–E–G?", ["C–F–A, second inversion", "F–A–C, root position", "A–C–F, first inversion"], 0, "C stays; E steps up to F, G steps up to A."),
        ear("Jumpy or smooth?", handsSound(SMOOTH, ROOT_BASS, 72), ["Root position, jumpy", "Inversions, smooth"], 1, "The top line moves G, A, A, G: steps, not leaps."),
        choice("Why does the left hand stay on the roots?", ["So the bass still names each chord", "Because inversions are not allowed there", "To play the melody"], 0, "The right hand can invert; the bass keeps the harmony clear."),
        hands({ right: HALVES, left: ROOT_BASS }, "Two chords a bar now, same shapes. Play along at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "left-hand-patterns-at-the-piano",
    title: "Left-hand patterns",
    order: 2,
    concepts: ["left-hand-patterns"],
    needs: ["inversions-for-smooth-changes", "left-hand-patterns"],
    steps: [
      // OWNER REVIEW: hand position and fingering for each pattern.
      { kind: "understand", blocks: [text(`So far the left hand has played one root per bar. Three patterns turn that single note into movement, while the right hand holds the chords.

**1. Root, fifth, octave.** Root, the fifth above it, the root an octave up, the fifth again: **C, G, C, G** for C major. Steady quarter notes. It sounds full without being busy, and it suits pop and rock ballads.

**2. Alberti bass.** Low, high, middle, high: **C, G, E, G**, in even eighth notes. It is all three notes of the triad, broken up. Named after an eighteenth-century composer, it is everywhere in Classical-period music, and it still works under any slow, gentle song.

**3. Arpeggiated tenths.** Root, fifth, and then the **third an octave higher**: **C3, G3, E4**. That top note is a **tenth** above the root: an octave plus a third. Spreading the chord this wide gives a big, open sound, the sound of piano ballads. If your hand is small, you do not stretch: the hand moves across, and the pedal holds the notes together (next lesson).

Each pattern is still the same chord. Only the order and spacing of its notes change.

For every chord in C, Am, F, G:

| Chord | Root | Third | Fifth | Tenth |
|---|---|---|---|---|
| C | C3 | E3 | G3 | E4 |
| Am | A2 | C3 | E3 | C4 |
| F | F2 | A2 | C3 | A3 |
| G | G2 | B2 | D3 | B3 |`)] },
      { kind: "listen", blocks: [
        audio("Root, fifth, octave", handsSound(SMOOTH, ROOT_FIFTH_OCTAVE, 72)),
        audio("Alberti bass", handsSound(SMOOTH, ALBERTI, 72)),
        audio("Arpeggiated tenths", handsSound(SMOOTH, TENTHS, 72)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: SMOOTH, left: ROOT_FIFTH_OCTAVE }, "Root, fifth, octave, fifth: one note per beat.", 60),
        hands({ right: SMOOTH, left: ALBERTI }, "Alberti bass: low, high, middle, high, in eighth notes.", 60),
        hands({ right: SMOOTH, left: TENTHS }, "Tenths: root, fifth, then the third an octave up.", 56),
      ] },
      { kind: "practice", blocks: [
        choice("What order does an Alberti bass play the triad in?", ["Low, high, middle, high", "Low, middle, high, middle", "High, low, high, low"], 0, "C, G, E, G for C major."),
        choice("A tenth above C3 is…", ["E4", "E3", "C4"], 0, "An octave plus a third."),
        choice("Which notes does root–fifth–octave use for A minor?", ["A, E, A", "A, C, E", "A, D, A"], 0, "Root A, fifth E, and A again an octave up."),
        ear("Which pattern is this?", handsSound(SMOOTH, ALBERTI, 72), ["Root, fifth, octave", "Alberti bass", "Arpeggiated tenths"], 1, "Eighth notes, low–high–middle–high."),
        ear("Which pattern is this?", handsSound(SMOOTH, TENTHS, 72), ["Root, fifth, octave", "Alberti bass", "Arpeggiated tenths"], 2, "The top of each group jumps up past the octave."),
        hands({ right: SMOOTH, left: ALBERTI }, "Play the Alberti pattern along at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "ballad-arpeggios-with-pedal",
    title: "Ballad arpeggios with pedal",
    order: 3,
    concepts: ["pedalled-arpeggios"],
    needs: ["left-hand-patterns-at-the-piano", "the-sustain-pedal"],
    steps: [
      // OWNER REVIEW: pedal timing ("legato pedalling") and hand position.
      { kind: "understand", blocks: [text(`The ballad sound is the tenths pattern with the **sustain pedal** down, so every note keeps ringing and the whole chord blooms.

The pedal has one rule that matters more than any other: **change it with the chord.** If you hold it through a change, the old chord and the new one blur into mud.

The usual technique is called **legato pedalling**, and it feels backwards at first:

1. Play the first note of the new chord.
2. **Then** lift the pedal and put it straight back down.

Lifting *after* the new note, not before, means there is no gap in the sound, and the old chord is cleared away just as the new one starts.

Practise it slowly on whole-bar chords: say "play, up-down" out loud. Once it is automatic, add the left-hand pattern.

A few things that help:

- **Keep the left hand soft.** It is filling in the background; the right hand and the melody sit on top.
- **Let the pattern rise and fall** a little: slightly louder towards the tenth, softer on the way back.
- **Your foot stays on the pedal.** Heel on the floor, ball of the foot on the pedal, moving from the ankle.

The app cannot press a pedal, so the examples below sound drier than they will on your piano.`)] },
      { kind: "listen", blocks: [
        audio("The ballad pattern: tenths under held chords", handsSound(BALLAD_RIGHT, BALLAD_LEFT, 66)),
        audio("One bar slowly, to hear each note", rhythm("C3/8 G3/8 E4/8 G3/8 C3/8 G3/8 E4/8 G3/8", 50)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: BALLAD_RIGHT, left: BALLAD_LEFT }, "Change the pedal at the start of every bar: play the new bass note, then up-down.", 56),
      ] },
      { kind: "practice", blocks: [
        choice("When do you change the pedal?", ["With every chord change", "Once per song", "Never during a ballad"], 0, "Holding it through a change mixes two chords."),
        choice("In legato pedalling, what comes first?", ["Playing the new note", "Lifting the pedal", "Releasing every key"], 0, "Play, then up-down: no gap in the sound."),
        choice("What happens if you hold the pedal through C into F?", ["The two chords blur together", "The chords get louder", "Nothing"], 0, "Both chords keep ringing at once."),
        choice("Which hand should be softer in a ballad pattern?", ["The left hand", "The right hand", "Both equally loud"], 0, "The left fills the background."),
        ear("Arpeggiated, or held as a block?", handsSound(BALLAD_RIGHT, BALLAD_LEFT, 66), ["Arpeggiated left hand", "Block chords only"], 0, "The left hand rolls through root, fifth and tenth."),
        hands({ right: BALLAD_RIGHT, left: BALLAD_LEFT }, "Play along at 56, changing the pedal each bar.", 56),
      ] },
    ],
  },
  {
    ...base,
    slug: "syncopated-comping",
    title: "Syncopated pop and rock comping",
    order: 4,
    concepts: ["syncopated-comping"],
    needs: ["ballad-arpeggios-with-pedal", "syncopation"],
    steps: [
      { kind: "understand", blocks: [text(`Chords on every beat are steady but square. Pop and rock players **syncopate**: they play some chords between the beats, and the music starts to move.

**Pattern 1: 3 + 3 + 2.** Split the bar's eight eighth notes into groups of **3, 3 and 2**. Play a chord at the start of each group:

\`\`\`
count:  1 & 2 & 3 & 4 &
chord:  X . . X . . X .
\`\`\`

That is a dotted quarter, a dotted quarter and a quarter. The second chord lands on the "and" of 2, off the beat, and it gives the groove its push. You hear it in a huge amount of pop music.

**Pattern 2: the push.** Beat 1, beat 2, the "and" of 2, a gap, the "and" of 3, beat 4:

\`\`\`
count:  1 & 2 & 3 & 4 &
chord:  X . X X . X X .
\`\`\`

The gap on beat 3 matters as much as the chords. **Rests are part of the rhythm.**

Keep the **left hand simple**: one root per bar, on beat 1. With the right hand busy, the bass is the anchor that keeps the time clear. Count out loud, and play with the click: syncopation only sounds good when the beat underneath is rock solid.`)] },
      { kind: "listen", blocks: [
        audio("Chords on every beat", handsSound(bars(LOOP, (n) => `${NEAR[n]}/q `.repeat(4).trim()), ROOT_BASS, 88)),
        audio("3 + 3 + 2", handsSound(POP_332, ROOT_BASS, 88)),
        audio("The push", handsSound(POP_PUSH, ROOT_BASS, 88)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: POP_332, left: ROOT_BASS }, "3 + 3 + 2: chords on 1, the and of 2, and 4.", 76),
        hands({ right: POP_PUSH, left: ROOT_BASS }, "The push: 1, 2, and-of-2, (rest), and-of-3, 4.", 72),
      ] },
      { kind: "practice", blocks: [
        choice("In 3 + 3 + 2, where does the second chord land?", ["The and of 2", "Beat 2", "Beat 3"], 0, "Three eighth notes after beat 1."),
        choice("What does syncopation mean?", ["Accents or notes between the beats", "Playing faster", "Using only root position"], 0, "Off-beat notes against a steady pulse."),
        choice("Why keep the left hand simple here?", ["It anchors the beat while the right hand syncopates", "Left hands cannot syncopate", "To save effort"], 0, "Someone has to say where beat 1 is."),
        ear("Every beat, or 3 + 3 + 2?", handsSound(POP_332, ROOT_BASS, 88), ["Every beat", "3 + 3 + 2"], 1, "Three chords per bar, the middle one off the beat."),
        choice("In the push pattern, what happens on beat 3?", ["A rest", "The loudest chord", "A bass note only"], 0, "The gap is part of the groove."),
        hands({ right: POP_332, left: ROOT_BASS }, "Play 3 + 3 + 2 along at 76.", 76),
      ] },
    ],
  },
  {
    ...base,
    slug: "accompaniment-in-three-four-and-six-eight",
    title: "Patterns in 3/4 and 6/8",
    order: 5,
    concepts: ["accompaniment-in-three"],
    needs: ["syncopated-comping", "three-four-and-six-eight"],
    steps: [
      { kind: "understand", blocks: [text(`Not every song counts in four.

**3/4: the waltz.** Three beats a bar, the first one strongest. The classic piano pattern is **"oom-pah-pah"**:

- **Beat 1:** the left hand plays the root, low.
- **Beats 2 and 3:** the right hand plays the chord, lighter.

Bass, chord, chord. The weight on beat 1 and the lightness after it are what make it feel like a waltz. Play beats 2 and 3 short and soft.

**6/8: two big beats.** Six eighth notes in a bar, felt as **two groups of three**: ONE two three FOUR five six. It sways rather than marches.

The natural piano pattern rolls through the chord in eighth notes, six to the bar:

\`\`\`
left hand:  C3  G3  E4  C4  E4  G3
count:      1   2   3   4   5   6
\`\`\`

The right hand holds the chord for each big beat: two dotted quarters per bar.

The difference between 3/4 and 6/8 is not the number of eighth notes (both have six). It is the **grouping**: 3/4 is three groups of two; 6/8 is two groups of three. Count each out loud and you will feel it.`)] },
      { kind: "listen", blocks: [
        audio("Waltz in 3/4: bass, chord, chord", handsSound(WALTZ_RIGHT, WALTZ_LEFT, 120, 3)),
        audio("6/8: two big beats, rolling eighth notes", sixEight(SIX_EIGHT_RIGHT, SIX_EIGHT_LEFT, 90)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: WALTZ_RIGHT, left: WALTZ_LEFT }, "Oom-pah-pah: left hand on 1, right hand on 2 and 3.", 100, 3),
        staff("bass", SIX_EIGHT_LEFT, "The 6/8 left hand: six eighth notes a bar, counted in two groups of three.", { time: "6/8", bpm: 90 }),
      ] },
      { kind: "practice", blocks: [
        choice("In an oom-pah-pah waltz, what plays on beat 1?", ["The bass note", "The chord", "Nothing"], 0, "Low and strong, then two light chords."),
        choice("How is a bar of 6/8 felt?", ["Two groups of three", "Three groups of two", "Six equal beats"], 0, "ONE two three FOUR five six."),
        choice("3/4 and 6/8 both have six eighth notes. What is different?", ["How they are grouped", "Nothing at all", "6/8 is always faster"], 0, "Three twos against two threes."),
        ear("3/4 or 6/8?", sixEight(SIX_EIGHT_RIGHT, SIX_EIGHT_LEFT, 90), ["3/4", "6/8"], 1, "Two big swaying beats a bar."),
        ear("3/4 or 6/8?", handsSound(WALTZ_RIGHT, WALTZ_LEFT, 120, 3), ["3/4", "6/8"], 0, "Bass, chord, chord: three beats."),
        hands({ right: WALTZ_RIGHT, left: WALTZ_LEFT }, "Play the waltz along at 100.", 100, 3),
      ] },
    ],
  },
  {
    ...base,
    slug: "fills-and-song-form-study",
    title: "Fills, and a full song-form study",
    order: 6,
    minutes: 8,
    concepts: ["fills", "song-form-accompaniment"],
    needs: ["accompaniment-in-three-four-and-six-eight"],
    steps: [
      { kind: "understand", blocks: [text(`A song is not one pattern played from start to finish. It has sections, and a good accompanist makes each one sound different.

**Change the pattern with the section.**

- **Verse:** quieter and lighter. Here, an Alberti bass under held chords.
- **Chorus:** bigger. Syncopated 3 + 3 + 2 chords and a root–fifth–octave bass.

**Mark the joins with a fill.** A fill is a short flourish in the last beats before a new section, telling everyone something is about to change. The simplest: in the last bar before the chorus, play the chord for two beats, then **run up its notes** in eighth notes: G, B, D, G. The run lifts straight into the first chord of the chorus.

Rules for fills:

- **Short.** One or two beats. A fill points to the next section; it is not a solo.
- **From the chord.** Use the notes of the chord you are on, and you cannot go wrong.
- **Land on beat 1.** The fill ends exactly where the new section begins.

**The study piece** is sixteen bars:

- **Verse, 8 bars:** C, Am, F, G twice, Alberti bass. The fill is in bar 8.
- **Chorus, 8 bars:** F, G, C, Am, F, G, C, C, in 3 + 3 + 2 with root–fifth–octave.

Learn each section alone, then join them. The join is where most of the practice goes.`)] },
      { kind: "listen", blocks: [
        audio("Verse, ending in the fill", handsSound(VERSE_RIGHT, VERSE_LEFT, 80)),
        audio("Chorus", handsSound(CHORUS_RIGHT, CHORUS_LEFT, 80)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: VERSE_RIGHT, left: VERSE_LEFT }, "Verse: Alberti bass. Bar 8 ends with the fill G–B–D–G.", 66),
        hands({ right: CHORUS_RIGHT, left: CHORUS_LEFT }, "Chorus: 3 + 3 + 2 over root, fifth, octave.", 66),
      ] },
      { kind: "practice", blocks: [
        choice("What is a fill for?", ["Pointing to the next section", "Replacing the melody", "Ending the song early"], 0, "A short flourish at the join."),
        choice("Which notes make a safe fill over G major?", ["G, B, D", "G, A, C", "Any black keys"], 0, "The notes of the chord you are on."),
        choice("Where should a fill end?", ["On beat 1 of the new section", "On beat 3", "Anywhere"], 0, "It lands where the new section starts."),
        choice("How should the chorus usually compare to the verse?", ["Bigger and busier", "Quieter", "Exactly the same"], 0, "Changing the pattern makes the chorus lift."),
        ear("Verse or chorus?", handsSound(CHORUS_RIGHT, CHORUS_LEFT, 80), ["Verse (Alberti)", "Chorus (3 + 3 + 2)"], 1, "Syncopated chords over a stepping bass."),
        hands({ right: VERSE_RIGHT, left: VERSE_LEFT }, "Play the verse with its fill, then go straight into the chorus.", 66),
      ] },
    ],
  },
];
