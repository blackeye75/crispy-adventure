// Playing track P1, Advanced stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands and about style (how a stride left hand moves, the bossa nova
// bass and comping rhythm, gospel pedal and slides, how swing is felt) is standard teaching written from
// memory, not checked against a pianist. The voicings follow the standard rootless "A/B" shapes and guide
// tones taught in Level 5; the walking lines and the study piece are original. The app plays everything
// straight (no swing) and without pedal. These lessons also still need their demo videos.
import type { LessonInput, Sound } from "@/core/schemas/content";
import { audio, choice, ear, hands, handsSound, rhythm, text } from "../helpers";

const base = { moduleSlug: "accompaniment-advanced", track: "piano-accompaniment", stage: "advanced", strand: "piano", isFree: false, version: 1, minutes: 8 } as const;

// ii–V–I in C. Guide tones (3 and 7), and rootless voicings (3-5-7-9 and 7-9-3-13), below and around middle C.
const SHELL = { Dm7: "F3+C4", G7: "F3+B3", Cmaj7: "E3+B3" };
const ROOTLESS = { Dm7: "F3+A3+C4+E4", G7: "F3+A3+B3+E4", Cmaj7: "E3+G3+B3+D4" };
// The same voicings an octave up, out of the way of a walking bass.
const HIGH = { Dm7: "F4+A4+C5+E5", G7: "F4+A4+B4+E5", Cmaj7: "E4+G4+B4+D5", Em7: "G4+B4+D5+F#5", A7: "G4+B4+C#5+F#5" };
const ROOT = { Dm7: "D3", G7: "G2", Cmaj7: "C3" };
const II_V_I = ["Dm7", "G7", "Cmaj7", "Cmaj7"] as const;
const bars = <T extends string>(names: readonly T[], bar: (n: T) => string) => names.map(bar).join(" | ");

const SHELLS_RIGHT = bars(II_V_I, (n) => `${SHELL[n]}/w`);
const ROOTLESS_RIGHT = bars(II_V_I, (n) => `${ROOTLESS[n]}/w`);
const ROOTS = bars(II_V_I, (n) => `${ROOT[n]}/w`);
const COMP_2_4 = (voicing: Record<string, string>, names: readonly string[]) => bars(names, (n) => `r/q ${voicing[n]}/q r/q ${voicing[n]}/q`);

// Walking bass: chord tones on the strong beats, a half step into the next root on beat 4.
const WALK = "D3/q F3/q A3/q Ab3/q | G3/q F3/q D3/q Db3/q | C3/q E3/q G3/q B3/q | C3/q D3/q E3/q Eb3/q";
// Stride in F: low bass on 1 and 3 (root, then fifth), chord on 2 and 4.
const STRIDE_LEFT = "F2/q A3+C4+F4/q C3/q A3+C4+F4/q | C3/q Bb3+C4+E4/q G2/q Bb3+C4+E4/q | C3/q Bb3+C4+E4/q G2/q Bb3+C4+E4/q | F2/q A3+C4+F4/q C3/q A3+C4+F4/q";
const STRIDE_RIGHT = "A4/w | G4/w | E4/w | F4/w";
// Bossa nova: bass root and fifth with an eighth-note pickup into each; syncopated chords above.
const BOSSA_LEFT = "D3/q. A2/8 A2/q. D3/8 | G2/q. D3/8 D3/q. G2/8 | C3/q. G2/8 G2/q. C3/8 | C3/q. G2/8 G2/q. C3/8";
const BOSSA_RIGHT = bars(II_V_I, (n) => `${ROOTLESS[n]}/q ${ROOTLESS[n]}/8 ${ROOTLESS[n]}/q ${ROOTLESS[n]}/8 ${ROOTLESS[n]}/q`);
// Gospel: IV – #iv°7 – I/5 – I, the bass climbing by half steps.
const GOSPEL_RIGHT = "A3+C4+F4/w | A3+C4+Eb4/w | G3+C4+E4/w | G3+C4+E4/w";
const GOSPEL_LEFT = "F2/w | F#2/w | G2/w | C3/w";
const SLIDE = rhythm("C3+G3+C4+D#4/16 C3+G3+C4+E4/8. r/q C3+G3+C4+E4/h", 72);
const PLAIN = rhythm("C3+G3+C4+E4/q r/q C3+G3+C4+E4/h", 72);
// Odd meters on Dm7: 5/4 as 3 + 2, and 7/8 as 2 + 2 + 3.
const FIVE_LEFT = "D3/h. A2/h | D3/h. A2/h";
const FIVE_RIGHT = `r/q ${ROOTLESS.Dm7}/h r/q ${ROOTLESS.Dm7}/q | r/q ${ROOTLESS.Dm7}/h r/q ${ROOTLESS.Dm7}/q`;
const D7_CHORD = "D3+F3+A3+C4";
const SEVEN_EIGHT: Sound = { ...rhythm(`${D7_CHORD}/q ${D7_CHORD}/q ${D7_CHORD}/q. | ${D7_CHORD}/q ${D7_CHORD}/q ${D7_CHORD}/q.`, 84, 7), click: 0.5 } as Sound;

// Study piece: a ii–V–I in C, then a ii–V into D minor; walking bass under comping on 2 and 4.
const TUNE = ["Dm7", "G7", "Cmaj7", "Cmaj7", "Em7", "A7", "Dm7", "G7"] as const;
const TUNE_WALK = "D3/q F3/q A3/q Ab3/q | G3/q F3/q D3/q Db3/q | C3/q E3/q G3/q B3/q | A3/q G3/q F#3/q F3/q | E3/q G3/q B3/q Bb3/q | A3/q G3/q E3/q Eb3/q | D3/q F3/q A3/q Ab3/q | G3/q F3/q D3/q Db3/q";
const TUNE_COMP = COMP_2_4(HIGH, TUNE);

export const accompanimentAdvanced: LessonInput[] = [
  {
    ...base,
    slug: "shell-and-rootless-comping",
    title: "Comping with shells and rootless voicings",
    order: 1,
    concepts: ["jazz-comping"],
    needs: ["fills-and-song-form-study", "shell-voicings", "rootless-voicings"],
    steps: [
      { kind: "understand", blocks: [text(`In jazz, the pianist's accompaniment is called **comping**: short, rhythmic chords that support the soloist and leave room. You already know the two kinds of voicing it uses, from Levels 4 and 5. Now you use them in time.

**Shells: the guide tones.** The **3rd** and **7th** of each chord say whether it is major, minor or dominant. Over a ii–V–I in C, with the left hand on the roots, the right hand plays:

| Chord | Guide tones |
|---|---|
| Dm7 | F, C |
| G7 | F, B |
| Cmaj7 | E, B |

Look at how they move: F stays, C falls to B; then F falls to E and B stays. One note moves at each change, by a half step. That tiny motion is the sound of a ii–V–I.

**Rootless voicings: four notes, no root.** Add the 5th or 13th and the 9th:

| Chord | Rootless voicing | Degrees |
|---|---|---|
| Dm7 | F A C E | 3 5 7 9 |
| G7 | F A B E | 7 9 3 13 |
| Cmaj7 | E G B D | 3 5 7 9 |

The root is left to the bass, so the piano can spend its notes on colour.

**Rhythm:** comping is not playing on every beat. A good place to start is **beats 2 and 4**, short, like a drummer's snare. Then vary it: anticipate a chord on the "and" of 4, leave a whole bar empty. Jazz is swung; the app plays it straight, so swing the eighths in your head.`)] },
      { kind: "listen", blocks: [
        audio("Shells over the roots", handsSound(SHELLS_RIGHT, ROOTS, 80)),
        audio("Rootless voicings over the roots", handsSound(ROOTLESS_RIGHT, ROOTS, 80)),
        audio("Comping on 2 and 4", handsSound(COMP_2_4(ROOTLESS, II_V_I), ROOTS, 100)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: SHELLS_RIGHT, left: ROOTS }, "Guide tones: one note moves at each change.", 60),
        hands({ right: COMP_2_4(ROOTLESS, II_V_I), left: ROOTS }, "Rootless voicings, short, on beats 2 and 4.", 90),
      ] },
      { kind: "practice", blocks: [
        choice("Which two notes are the guide tones of a chord?", ["The 3rd and the 7th", "The root and the 5th", "The 9th and the 13th"], 0, "They define the chord's quality."),
        choice("Which are the guide tones of G7?", ["B and F", "G and D", "A and E"], 0, "The 3rd is B, the 7th is F."),
        choice("Why can a rootless voicing leave out the root?", ["The bass plays it", "Roots sound wrong in jazz", "It is the same as a shell"], 0, "The piano spends its notes on colour instead."),
        choice("From Dm7 to G7, how do the guide tones move?", ["F stays, C falls to B", "Both jump an octave", "Both stay"], 0, "One half step: that is the sound of ii–V."),
        ear("Shells, or four-note rootless voicings?", handsSound(ROOTLESS_RIGHT, ROOTS, 80), ["Shells (two notes)", "Rootless (four notes)"], 1, "A fuller, more colourful sound above the bass."),
        hands({ right: COMP_2_4(ROOTLESS, II_V_I), left: ROOTS }, "Comp on 2 and 4 along at 90.", 90),
      ] },
    ],
  },
  {
    ...base,
    slug: "walking-bass-left-hand",
    title: "Walking bass in the left hand",
    order: 2,
    concepts: ["walking-bass"],
    needs: ["shell-and-rootless-comping", "approach-notes-and-enclosures"],
    steps: [
      { kind: "understand", blocks: [text(`A **walking bass** moves one note per beat, never stopping, and it outlines the chords as it goes. Played in the left hand, it turns the piano into a whole rhythm section.

A simple recipe for each bar of a four-beat chord:

1. **Beat 1: the root.** Always. It tells the ear which chord has arrived.
2. **Beats 2 and 3: other chord tones**, or scale notes, moving smoothly.
3. **Beat 4: an approach note**, a half step above or below the next root.

Over the ii–V–I in C:

\`\`\`
Dm7:    D  F  A  Ab   → (G)
G7:     G  F  D  Db   → (C)
Cmaj7:  C  E  G  B
Cmaj7:  C  D  E  Eb   → (D, back to the top)
\`\`\`

Every beat 4 leans into the next root by a half step: **Ab to G, Db to C, Eb to D.** That pull is what makes the line feel as if it is going somewhere.

The right hand comps above it, on 2 and 4, an octave higher than before so the hands do not collide.

**Play the bass evenly and a little detached.** Every note the same length and weight, like footsteps. A walking line that speeds up or stumbles brings the whole band down with it.`)] },
      { kind: "listen", blocks: [
        audio("The walking line alone", rhythm(WALK, 100)),
        audio("With comping above", handsSound(COMP_2_4(HIGH, II_V_I), WALK, 100)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: COMP_2_4(HIGH, II_V_I), left: WALK }, "Root on beat 1, approach note on beat 4. Comp on 2 and 4.", 80),
      ] },
      { kind: "practice", blocks: [
        choice("What does a walking bass usually play on beat 1?", ["The root of the chord", "The 7th", "A rest"], 0, "It names the chord as it arrives."),
        choice("The next chord is G7. Which is a half-step approach from above?", ["Ab", "A", "F"], 0, "Ab falls a half step to G."),
        choice("How many notes per beat does a walking bass play?", ["One", "Two", "It changes every bar"], 0, "Steady quarter notes, like footsteps."),
        choice("Why move the comping up an octave here?", ["So the hands do not collide", "Jazz chords must be high", "To play the melody"], 0, "The bass now uses the octave below middle C."),
        ear("Walking bass, or roots held for the bar?", handsSound(COMP_2_4(HIGH, II_V_I), WALK, 100), ["Walking", "Held roots"], 0, "A new bass note on every beat."),
        hands({ right: COMP_2_4(HIGH, II_V_I), left: WALK }, "Play along at 80, then try 100.", 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "stride-basics",
    title: "Stride basics",
    order: 3,
    concepts: ["stride-piano"],
    needs: ["walking-bass-left-hand"],
    steps: [
      // OWNER REVIEW: how the left hand travels; practising the jump.
      { kind: "understand", blocks: [text(`**Stride** is the left hand doing the work of a whole band: a low bass note, then a chord in the middle of the keyboard, back and forth. It came out of ragtime and early jazz, and it still sounds like nothing else.

The pattern, four beats:

\`\`\`
beat:   1        2        3        4
plays:  bass     chord    bass     chord
F:      F2       A C F    C3       A C F
C7:     C3       Bb C E   G2       Bb C E
\`\`\`

- **Beats 1 and 3: a single low note.** Usually the root, then the 5th, so the bass moves.
- **Beats 2 and 4: a chord** around middle C.

The left hand **leaps** an octave or more on every beat. That is the whole challenge. Ways to learn it:

1. **Practise the jump alone**, eyes on the keyboard, slowly. Look at where you are going *before* you leave.
2. **Keep the leap low and close to the keys.** No big arcs in the air.
3. **Bass slightly louder, chord lighter.** The bass carries the time.

The right hand plays the tune on top. Here it is just one long note per bar, so all your attention can go to the left hand.`)] },
      { kind: "listen", blocks: [
        audio("Stride in F: F, C7, C7, F", handsSound(STRIDE_RIGHT, STRIDE_LEFT, 92)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: STRIDE_RIGHT, left: STRIDE_LEFT }, "Bass on 1 and 3, chord on 2 and 4. Look before you leap.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("In stride, what does the left hand play on beats 2 and 4?", ["A chord in the middle of the keyboard", "A low bass note", "Nothing"], 0, "Bass, chord, bass, chord."),
        choice("Over F, the bass alternates F and…", ["C, the 5th", "G, the 2nd", "E, the 7th"], 0, "Root, then fifth."),
        choice("Which notes make the C7 chord used here?", ["Bb, C, E", "C, D, G", "A, C, F"], 0, "The 7th, root and 3rd of C7."),
        choice("What is the hard part of stride?", ["The left-hand leaps", "Reading the chords", "The right-hand chords"], 0, "An octave or more on every beat."),
        ear("Stride, or a walking bass?", handsSound(STRIDE_RIGHT, STRIDE_LEFT, 92), ["Stride", "Walking bass"], 0, "Low note, chord, low note, chord."),
        hands({ right: STRIDE_RIGHT, left: STRIDE_LEFT }, "Play along at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "bossa-nova-patterns",
    title: "Bossa nova and Latin patterns",
    order: 4,
    concepts: ["bossa-nova-comping"],
    needs: ["stride-basics"],
    steps: [
      // OWNER REVIEW: the bossa nova bass and comping rhythms are one common version among several.
      { kind: "understand", blocks: [text(`**Bossa nova** came from Brazil in the late 1950s: samba slowed down, softened, and given jazz harmony. On the piano it rests on two things.

**The bass: root and fifth, with a pickup.** The bass plays the root on beat 1 and the fifth on beat 3, and each one is **anticipated by an eighth note** just before it:

\`\`\`
count:  1  &  2  &  3  &  4  &
bass:   D  .  .  A  A  .  .  D
\`\`\`

So the root lasts a dotted quarter, the fifth sneaks in on the "and" of 2 and carries through beat 3, and the root comes back on the "and" of 4, leading into the next bar. It rocks gently between two notes.

**The chords: syncopated and light.** Over that, the right hand plays the rootless voicings you know, in a syncopated pattern:

\`\`\`
count:  1  &  2  &  3  &  4  &
chord:  X  .  X  X  .  X  X  .
\`\`\`

Play the chords **short and soft**. Bossa nova is quiet music; nothing should feel pushed.

The feel is **straight eighths**, not swung. That makes it one of the few jazz styles the app plays exactly as it should sound.`)] },
      { kind: "listen", blocks: [
        audio("The bass alone", rhythm(BOSSA_LEFT, 120)),
        audio("Bass and chords", handsSound(BOSSA_RIGHT, BOSSA_LEFT, 120)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: BOSSA_RIGHT, left: BOSSA_LEFT }, "Root and fifth with eighth-note pickups; light syncopated chords.", 96),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes does a basic bossa bass rock between?", ["Root and fifth", "Root and third", "Third and seventh"], 0, "Root on 1, fifth on 3, each anticipated."),
        choice("Are bossa nova eighths swung?", ["No, they are straight", "Yes, heavily", "Only in the bass"], 0, "Straight and even."),
        choice("How should the chords be played?", ["Short and soft", "Long and loud", "Only on beat 1"], 0, "Light, never pushed."),
        ear("Bossa nova, or stride?", handsSound(BOSSA_RIGHT, BOSSA_LEFT, 120), ["Bossa nova", "Stride"], 0, "A gentle rocking bass and syncopated chords."),
        choice("Over G7, the bass alternates G and…", ["D", "B", "F"], 0, "The fifth of G."),
        hands({ right: BOSSA_RIGHT, left: BOSSA_LEFT }, "Play along at 96.", 96),
      ] },
    ],
  },
  {
    ...base,
    slug: "gospel-passing-chords-and-slides",
    title: "Gospel and R&B: passing chords and slides",
    order: 5,
    concepts: ["gospel-passing-chords"],
    needs: ["bossa-nova-patterns", "diminished-passing-chords"],
    steps: [
      // OWNER REVIEW: the slide technique (a finger rolling off a black key onto the white key).
      { kind: "understand", blocks: [text(`Gospel and R&B piano is full of **movement between the chords**. Two of its most-used tools:

**1. The climbing bass with a diminished chord.** Going from IV back to I, insert a diminished seventh chord on the sharp 4 and let the bass climb by half steps:

\`\`\`
chord:  F       F#°7        C/G      C
bass:   F       F#          G        C
\`\`\`

**F#°7** is F#, A, C, E♭. In the right hand, A and C stay put while F moves down to E♭; then E♭ rises to E for C/G. The bass rises F, F#, G, as smooth as a staircase. This is the **diminished passing chord** from Level 6, and in church music it is everywhere.

**2. The slide (a grace note).** Before a chord tone, quickly play the note **a half step below** it, then roll onto the real note. Over C major, slide **D♯ to E**: the D♯ is so short that you hear it as a little scoop into the E.

On the piano this is often done with one finger: start on the black key and **slide off it** onto the white key next to it. It makes a plain chord sound sung rather than struck.

Use both sparingly. A slide on every chord stops being a decoration and becomes a habit.`)] },
      { kind: "listen", blocks: [
        audio("IV – ♯iv°7 – I/5 – I: the climbing bass", handsSound(GOSPEL_RIGHT, GOSPEL_LEFT, 66)),
        audio("A plain C chord", PLAIN),
        audio("The same with a slide, D♯ into E", SLIDE),
      ] },
      { kind: "learn", blocks: [
        hands({ right: GOSPEL_RIGHT, left: GOSPEL_LEFT }, "The bass climbs F, F♯, G. In the right hand, A and C stay.", 56),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes make F♯°7?", ["F♯, A, C, E♭", "F♯, A♯, C♯, E", "F, A, C, E"], 0, "Stacked minor thirds from F♯."),
        choice("What does the bass do from F to C/G here?", ["Climbs by half steps: F, F♯, G", "Jumps an octave", "Stays on F"], 0, "Smooth chromatic motion."),
        choice("A slide into E starts on…", ["D♯, a half step below", "F, a half step above", "C, the root"], 0, "A quick scoop up into the chord tone."),
        ear("Plain, or with a slide?", SLIDE, ["Plain", "With a slide"], 1, "A tiny note just before the E."),
        choice("How often should you use slides?", ["Sparingly, as decoration", "On every chord", "Never in R&B"], 0, "Too many, and it becomes a habit, not a colour."),
        hands({ right: GOSPEL_RIGHT, left: GOSPEL_LEFT }, "Play along at 56.", 56),
      ] },
    ],
  },
  {
    ...base,
    slug: "comping-in-odd-meters",
    title: "Comping in odd meters",
    order: 6,
    concepts: ["odd-meter-comping"],
    needs: ["gospel-passing-chords-and-slides", "odd-meters"],
    steps: [
      { kind: "understand", blocks: [text(`Some music counts in five or seven. The trick to comping in an odd meter is the one you learned in Level 4: **break the bar into groups of twos and threes**, and let the groups shape the pattern.

**5/4 as 3 + 2.** Five beats: ONE two three FOUR five. Put the bass on the start of each group, **beats 1 and 4**, and the chords in between:

\`\`\`
beat:   1    2    3    4    5
bass:   D              A
chord:       X              X
\`\`\`

The long-short shape (three beats, then two) is what makes 5/4 sound like 5/4 and not like a bar of four with a mistake.

**7/8 as 2 + 2 + 3.** Seven eighth notes: ONE two THREE four FIVE six seven. Play a chord at the start of each group: two short, one long.

\`\`\`
eighths:  1 2 | 3 4 | 5 6 7
chord:    X   | X   | X
\`\`\`

The same seven eighths can also be grouped 3 + 2 + 2 or 2 + 3 + 2. The chart or the drummer decides. **Count the groups out loud** ("one-two, one-two, one-two-three") until the pattern sits in your body. Then stop counting and listen.`)] },
      { kind: "listen", blocks: [
        audio("5/4 as 3 + 2 on Dm7", handsSound(FIVE_RIGHT, FIVE_LEFT, 110, 5)),
        audio("7/8 as 2 + 2 + 3", SEVEN_EIGHT),
      ] },
      { kind: "learn", blocks: [
        hands({ right: FIVE_RIGHT, left: FIVE_LEFT }, "5/4: bass on 1 and 4, chords on 2 and 5.", 96, 5),
      ] },
      { kind: "practice", blocks: [
        choice("How is 5/4 grouped here?", ["3 + 2", "2 + 2 + 1", "Five equal beats"], 0, "ONE two three FOUR five."),
        choice("In this 5/4 pattern, where does the bass play?", ["Beats 1 and 4", "Every beat", "Beats 2 and 5"], 0, "The start of each group."),
        choice("Which grouping is used for the 7/8 example?", ["2 + 2 + 3", "3 + 3 + 1", "4 + 3"], 0, "Two short groups, then a long one."),
        ear("5/4 or 7/8?", SEVEN_EIGHT, ["5/4", "7/8"], 1, "Short, short, long, with eighth-note clicks."),
        choice("What decides how 7/8 is grouped?", ["The music itself: the chart, the melody, the drummer", "It is always 2 + 2 + 3", "The key"], 0, "3 + 2 + 2 and 2 + 3 + 2 are common too."),
        hands({ right: FIVE_RIGHT, left: FIVE_LEFT }, "Play the 5/4 pattern along at 96.", 96, 5),
      ] },
    ],
  },
  {
    ...base,
    slug: "two-five-one-comping-study",
    title: "Study: comping through a ii–V–I tune",
    order: 7,
    concepts: ["comping-study"],
    needs: ["comping-in-odd-meters", "major-and-minor-two-five-one"],
    steps: [
      { kind: "understand", blocks: [text(`The study piece puts the stage together: a walking bass in the left hand and rootless comping in the right, through eight bars built from ii–V–I.

\`\`\`
| Dm7  | G7   | Cmaj7 | Cmaj7 |
| Em7  | A7   | Dm7   | G7    |
\`\`\`

Bars 1–4 are a ii–V–I in C. Bars 5–7 are a ii–V **into D minor**: Em7–A7–Dm7. That is a **secondary ii–V**: the same move, aimed at a different chord. Bar 8's G7 turns everything back to the top.

The new voicings:

| Chord | Rootless voicing | Degrees |
|---|---|---|
| Em7 | G B D F♯ | 3 5 7 9 |
| A7 | G B C♯ F♯ | 7 9 3 13 |

Notice they are the same *shapes* as Dm7 and G7, one step higher.

**The walking line** follows the recipe: root on beat 1, approach note on beat 4. Bar 4 walks **A, G, F♯, F** down into E for bar 5; bar 6 ends on E♭ to lean into D.

How to learn it:

1. Bass alone, until it walks without a stumble.
2. Comping alone, on 2 and 4.
3. Together, very slowly. Then vary the comping rhythm once the hands feel independent.`)] },
      { kind: "listen", blocks: [
        audio("The whole study", handsSound(TUNE_COMP, TUNE_WALK, 100)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: TUNE_COMP, left: TUNE_WALK }, "Walking bass and comping on 2 and 4, eight bars.", 76),
      ] },
      { kind: "practice", blocks: [
        choice("Bars 5–7 are Em7–A7–Dm7. What is that?", ["A ii–V–i aimed at D minor", "A 12-bar blues", "A plagal cadence"], 0, "The same move, aimed at a new chord."),
        choice("Which is the rootless voicing for A7 used here?", ["G, B, C♯, F♯", "A, C♯, E, G", "G, B, D, F♯"], 0, "7, 9, 3 and 13 of A7."),
        choice("Bar 4 walks A, G, F♯, F. Where is it going?", ["To E, the root of Em7", "To C", "To A"], 0, "F falls a half step to E."),
        choice("What is the best order to learn this piece?", ["Each hand alone, then together slowly", "Both hands at full speed at once", "Right hand only"], 0, "Independence first, tempo last."),
        ear("Which chord change do you hear: ii–V or IV–I?", handsSound(COMP_2_4(HIGH, ["Dm7", "G7", "Cmaj7", "Cmaj7"]), WALK, 100), ["ii–V–I", "IV–I"], 0, "Dm7 to G7 to Cmaj7."),
        hands({ right: TUNE_COMP, left: TUNE_WALK }, "Play the study along at 76.", 76),
      ] },
    ],
  },
];

