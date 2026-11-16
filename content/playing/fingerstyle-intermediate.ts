// Playing track G3, Intermediate stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (how Travis picking is built up, free and rest strokes, how
// a harmonic is touched, retuning) is standard teaching written from memory, not checked against a player.
// Each such passage is marked "OWNER REVIEW" below. The study piece is original and unplayed. No demo videos.
import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, ear, find, picking, shape, show, tab, tabSound, text, tuned } from "../helpers";

const base = { moduleSlug: "fingerstyle-intermediate", track: "guitar-fingerstyle", strand: "guitar", isFree: false, version: 1, minutes: 7 } as const;
const G = { only: "guitar" } as const;

// Each chord as the strings its patterns use: two bass strings for the thumb (root, then the alternate), and strings 3, 2 and 1.
type Shape = { p: string; q: string; i: string; m: string; a: string };
const C: Shape = { p: "5:3", q: "4:2", i: "3:0", m: "2:1", a: "1:0" }; // x32010
const AM: Shape = { p: "5:0", q: "4:2", i: "3:2", m: "2:1", a: "1:0" }; // x02210
const GM: Shape = { p: "6:3", q: "4:0", i: "3:0", m: "2:0", a: "1:3" }; // 320003
const EM: Shape = { p: "6:0", q: "4:2", i: "3:0", m: "2:0", a: "1:0" }; // 022000
const repeat = (pattern: string, times: number) => Array(times).fill(pattern).join(" ");

// Travis picking: the thumb plays every beat, swapping between two bass strings; fingers fall between the beats.
const thumbOnly = (ch: Shape) => `${ch.p}/q ${ch.q}/q ${ch.p}/q ${ch.q}/q`;
const travis = (ch: Shape) => `${ch.p}/q ${ch.q}/8 ${ch.i}/8 ${ch.p}/8 ${ch.m}/8 ${ch.q}/8 ${ch.i}/8`;
const TRAVIS_FINGERS = "p p i p m p i";
const travisPinch = (ch: Shape) => `${ch.p}+${ch.m}/q ${ch.q}/8 ${ch.i}/8 ${ch.p}/8 ${ch.m}/8 ${ch.q}/8 ${ch.i}/8`;
const PINCH_FINGERS = "pm p i p m p i";
// A melody note pinched with the thumb on beats 1 and 3, over the alternating bass.
const tune = (ch: Shape, first: string, second: string) => `${ch.p}+${first}/q ${ch.q}/q ${ch.p}+${second}/q ${ch.q}/q`;
const fingerFor = (note: string) => (note.startsWith("1:") ? "pa" : "pm");
const tuneFingers = (first: string, second: string) => `${fingerFor(first)} p ${fingerFor(second)} p`;
const MELODY_1 = `${tune(C, "1:0", "1:3")} | ${tune(GM, "2:3", "2:0")}`;
const MELODY_1_FINGERS = `${tuneFingers("1:0", "1:3")} ${tuneFingers("2:3", "2:0")}`;
const six = (ch: Shape) => `${ch.p}/8 ${ch.i}/8 ${ch.m}/8 ${ch.a}/8 ${ch.m}/8 ${ch.i}/8`;
const SIX_FINGERS = "p i m a m i";
const pami = (ch: Shape) => repeat(`${ch.p}/8 ${ch.a}/8 ${ch.m}/8 ${ch.i}/8`, 2);
const PAMI_FINGERS = repeat("p a m i", 2);
const pima = (ch: Shape) => repeat(`${ch.p}/8 ${ch.i}/8 ${ch.m}/8 ${ch.a}/8`, 2);
const PIMA_FINGERS = repeat("p i m a", 2);
// Walking bass: the thumb steps from one root to the next while the fingers keep the chord.
const WALK_C_AM = "5:3/q 3:0+2:1/q 5:2/q 3:0+2:1/q | 5:0/q 3:2+2:1/q 5:0/q 3:2+2:1/q";
const WALK_G_C = "6:3/q 3:0+2:0/q 5:0/8 5:2/8 3:0+2:0/q | 5:3/q 3:0+2:1/q 5:3/q 3:0+2:1/q";
const WALK_FINGERS_1 = "p im p im p im p im";
const WALK_FINGERS_2 = "p im p p im p im p im";
const HAMMER_AM = "5:0/q 4:0/8 4:2/8^h 3:2/8 2:1/8 3:2/q";
const HAMMER_C = "5:3/q 4:0/8 4:2/8^h 3:0/8 2:1/8 3:0/q";
const HAMMER_FINGERS = "p p - i m i";
const HARMONICS_12 = "6:12/q^n 5:12/q^n 4:12/q^n 3:12/q^n | 2:12/q^n 1:12/q^n r/h";
const HARMONICS_ALL = "3:12/h^n 3:7/h^n | 3:5/w^n";
const HARMONIC_CHORD = "4:12+3:12+2:12/w^n";
const DROP_D = "D2 A2 D3 G3 B3 E4";
const DADGAD = "D2 A2 D3 G3 A3 D4";
const OPEN_G = "D2 G2 D3 G3 B3 D4";
const ALL_OPEN = "6:0+5:0+4:0+3:0+2:0+1:0/w";
const barre = (fret: number) => `6:${fret}+5:${fret}+4:${fret}+3:${fret}+2:${fret}+1:${fret}/h`;
// Study piece: melody on strings 1 and 2 over an alternating bass. C, C, G, G, Am, Am, G, C.
const STUDY: [Shape, string, string][] = [[C, "1:0", "1:3"], [C, "1:0", "2:1"], [GM, "2:3", "2:0"], [GM, "2:3", "1:3"], [AM, "1:0", "2:1"], [AM, "2:1", "1:0"], [GM, "2:3", "2:0"]];
const studyTab = (from: number, to: number) => STUDY.slice(from, to).map(([ch, a, b]) => tune(ch, a, b)).join(" | ");
const studyFingers = (from: number, to: number) => STUDY.slice(from, to).map(([, a, b]) => tuneFingers(a, b)).join(" ");
const STUDY_1 = studyTab(0, 4);
const STUDY_2 = `${studyTab(4, 7)} | 5:3+2:1/w`;

export const fingerstyleIntermediate: LessonInput[] = [
  {
    ...base,
    slug: "travis-picking",
    title: "Travis picking",
    order: 1,
    concepts: ["travis-picking"],
    needs: ["fingerstyle-study-piece", "alternating-thumb"],
    steps: [
      // OWNER REVIEW: how the pattern is built up and which fingers fall where.
      { kind: "understand", blocks: [text(`**Travis picking** is the sound of a guitarist who seems to be two players at once. It is named after Merle Travis, and it has one rule at its centre:

**The thumb plays on every beat and never stops.**

It swaps between two bass strings, low, high, low, high, like a bass player on a steady walk. The fingers then drop notes **between** the thumb's beats. Those in-between notes are off the beat, so the pattern has a built-in bounce.

Build it in three stages.

**1. Thumb alone.** On a C chord: string 5, string 4, string 5, string 4. One per beat. Practise this until it runs without thought. Everything else rests on it.

**2. Add the fingers between the beats.** The pattern for this lesson:

- Beat 1: thumb.
- Beat 2: thumb, then **index** on the "and".
- Beat 3: thumb, then **middle** on the "and".
- Beat 4: thumb, then **index** on the "and".

**3. Add a pinch on beat 1**: thumb and middle finger together. This gives the bar a clear start.

When it goes wrong, the thumb is almost always the cause. It hesitates while the fingers think. Go back to the thumb alone, then add one finger at a time.`)] },
      { kind: "listen", blocks: [
        audio("Stage 1: the thumb alone on C", tabSound(thumbOnly(C), 80)),
        audio("Stage 2: fingers between the beats", tabSound(travis(C), 80)),
        audio("Stage 3: with a pinch on beat 1, through C and A minor", tabSound(`${travisPinch(C)} | ${travisPinch(AM)}`, 80)),
      ] },
      { kind: "learn", blocks: [
        picking(thumbOnly(C), "p p p p", "The thumb alone: strings 5, 4, 5, 4, one per beat."),
        picking(travis(C), TRAVIS_FINGERS, "The fingers fall on the ands of beats 2, 3 and 4."),
        picking(travisPinch(C), PINCH_FINGERS, "With a pinch on beat 1."),
      ] },
      { kind: "practice", blocks: [
        choice("In Travis picking, what does the thumb do?", ["Plays every beat, swapping between two bass strings", "Plays only beat 1", "Plays the melody"], 0, "It is the steady bass under everything."),
        choice("Where do the fingers play?", ["Between the thumb's beats", "Exactly with the thumb, always", "Only on beat 4"], 0, "Off the beat, which gives the bounce."),
        choice("The pattern keeps breaking down. What should you practise?", ["The thumb alone", "The whole thing faster", "Only the fingers"], 0, "The thumb must run without thought."),
        ear("Is the thumb alone, or are the fingers playing too?", tabSound(travis(C), 80), ["Thumb alone", "Thumb and fingers"], 1, "Higher notes fall between the bass notes."),
        picking(travis(C), TRAVIS_FINGERS, "Play along on C at 60."),
        picking(`${travisPinch(C)} | ${travisPinch(AM)}`, repeat(PINCH_FINGERS, 2), "C, then A minor, with the pinch.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "melody-over-an-alternating-bass",
    title: "A melody over an alternating bass",
    order: 2,
    concepts: ["melody-and-bass"],
    needs: ["travis-picking", "pinches"],
    steps: [
      // OWNER REVIEW: which finger takes the melody, and how to bring it out.
      { kind: "understand", blocks: [text(`The thumb is now steady enough to be left alone. So give the fingers a new job. Instead of filling in the chord, let them play a **tune**.

This is the heart of fingerstyle: **bass and melody at once, from one pair of hands.**

The set-up:

- **The thumb** alternates between two bass strings, one note per beat, as before.
- **The melody** goes on strings 1 and 2. The ring finger takes string 1 and the middle finger takes string 2.
- **Each melody note is pinched** with the thumb's bass note under it.

In this lesson the melody moves in half notes, so there is a melody note on beats 1 and 3, and the thumb plays alone on beats 2 and 4.

The melody notes are not always part of the plain chord shape. Over C, the tune goes from E, the open string 1, up to G at fret 3. Your little finger reaches for that G while the rest of the chord stays down.

Two things make it sound like music and not an exercise:

- **Play the melody louder than the bass.** Pluck the top string a little more firmly; let the thumb be gentle.
- **Let melody notes ring** until the next one. Do not lift early.`)] },
      { kind: "listen", blocks: [
        audio("The bass alone, on C then G", tabSound(`${thumbOnly(C)} | ${thumbOnly(GM)}`, 80)),
        audio("The melody alone: E, G, D, B", tabSound("1:0/h 1:3/h | 2:3/h 2:0/h", 80)),
        audio("Together", tabSound(MELODY_1, 80)),
      ] },
      { kind: "learn", blocks: [
        picking(MELODY_1, MELODY_1_FINGERS, "Pinch on beats 1 and 3: thumb with the melody note. The thumb is alone on 2 and 4."),
        show(shape("1:0 1:3 2:3 2:0"), "The four melody notes: E and G on string 1, D and B on string 2.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("Which strings carry the melody here?", ["Strings 1 and 2", "Strings 5 and 6", "Strings 3 and 4"], 0, "The top strings, above the bass."),
        choice("How is each melody note played?", ["Pinched with a bass note", "With the thumb alone", "As a strum"], 0, "Thumb and finger together."),
        choice("Which part should be louder?", ["The melody", "The bass", "Neither"], 0, "The tune sings; the bass supports."),
        find("Over the C chord the melody rises from the open string 1 to which note? Tap it.", "G4", "String 1, fret 3.", { strings: [1], ...G }),
        ear("Bass alone, or bass with melody?", tabSound(MELODY_1, 80), ["Bass alone", "Bass with melody"], 1, "A higher line moves over the steady bass."),
        picking(MELODY_1, MELODY_1_FINGERS, "Play along at 60."),
      ] },
    ],
  },
  {
    ...base,
    slug: "arpeggios-in-six-eight",
    title: "Arpeggio patterns in 6/8",
    order: 3,
    concepts: ["six-eight-arpeggios"],
    needs: ["melody-over-an-alternating-bass", "three-four-and-six-eight"],
    steps: [
      { kind: "understand", blocks: [text(`**6/8** has six eighth notes in a bar, felt as **two big beats of three**: **1** 2 3, **4** 5 6. It rocks gently, like a lullaby or a slow ballad, and it suits fingerstyle very well.

The pattern is one you have met: **p – i – m – a – m – i**. Up through the strings and back.

What changes in 6/8 is the **feel**. In the Basic stage you played this shape in 3/4, with three beats. Now the same six notes are grouped in two:

- The **thumb** lands on count 1, the first big beat.
- The **ring finger** lands on count 4, the second big beat.

Lean very slightly on those two notes and the bar starts to sway.

Because the top note of the pattern falls on a strong beat, it is heard as a melody. Change which string the ring finger plays, or which fret is held there, and the pattern starts to sing.

Count out loud as "**one** and a, **two** and a". It gets the two-beat feel into your body faster than counting to six.`)] },
      { kind: "listen", blocks: [
        audio("p-i-m-a-m-i in 6/8 on A minor, then C", tabSound(`${six(AM)} | ${six(C)}`, 70, 3, undefined, 0.5)),
        audio("Through Am, C, G, Em", tabSound([AM, C, GM, EM].map(six).join(" | "), 70, 3, undefined, 0.5)),
      ] },
      { kind: "learn", blocks: [
        picking(six(AM), SIX_FINGERS, "One bar on A minor. The thumb is on 1 and the ring finger on 4: the two big beats.", 50, 6, 0.5),
        picking(`${six(AM)} | ${six(C)}`, repeat(SIX_FINGERS, 2), "A minor to C.", 50, 6, 0.5),
      ] },
      { kind: "practice", blocks: [
        choice("How is a bar of 6/8 felt?", ["Two big beats of three", "Three beats of two", "Six equal beats"], 0, "1 2 3, 4 5 6."),
        choice("In p-i-m-a-m-i, which finger lands on count 4?", ["a, the ring finger", "p, the thumb", "i, the index finger"], 0, "The top of the pattern falls on the second big beat."),
        choice("Which two notes get a slight lean?", ["Counts 1 and 4", "Counts 2 and 5", "Every note"], 0, "The start of each group of three."),
        choice("How does this differ from the same pattern in 3/4?", ["The six notes are grouped in two, not three", "The notes are different", "It uses a pick"], 0, "Same fingers, different feel."),
        picking(`${six(AM)} | ${six(C)}`, repeat(SIX_FINGERS, 2), "Play along at 50.", 50, 6, 0.5),
        picking([AM, C, GM, EM].map(six).join(" | "), repeat(SIX_FINGERS, 4), "Through four chords.", 55, 6, 0.5),
      ] },
    ],
  },
  {
    ...base,
    slug: "free-strokes-and-rest-strokes",
    title: "Classical arpeggios: free strokes and rest strokes",
    order: 4,
    concepts: ["free-and-rest-strokes"],
    needs: ["arpeggios-in-six-eight"],
    steps: [
      // OWNER REVIEW: the description of both strokes.
      { kind: "understand", blocks: [text(`Classical guitarists have two ways to pluck a string. Knowing both gives you control over tone.

**Free stroke.** The finger plucks and swings **clear** of the next string, into the air towards the palm. The neighbouring strings are left free to ring. This is the stroke for **arpeggios and chords**, where several strings must sound together. It is what you have used so far.

**Rest stroke.** The finger plucks **through** the string and comes to **rest on the next string**. This drives the string more deeply and gives a fuller, rounder, louder note. It is the stroke for **melodies** that need to stand out. The cost is that the finger stops the next string, so it does not work when that string has to ring.

So the choice follows the music: free strokes when strings ring together, rest strokes for a single line you want to sing.

Two classical arpeggio patterns to add to your set, both with free strokes:

- **p – a – m – i:** thumb, then down through the strings from the top.
- **p – i – m – a:** thumb, then up. You know this one.

The first sounds like falling; the second like rising. Composers choose between them for exactly that reason.`)] },
      { kind: "listen", blocks: [
        audio("p-i-m-a: rising", tabSound(pima(AM), 80)),
        audio("p-a-m-i: falling", tabSound(pami(AM), 80)),
        audio("A melody on one string, the kind you would play with rest strokes", tabSound("1:0/q 1:1/q 1:3/q 1:1/q | 1:0/w", 80)),
      ] },
      { kind: "learn", blocks: [
        picking(pami(AM), PAMI_FINGERS, "p-a-m-i on A minor: after the thumb, the fingers come down from string 1. Free strokes."),
        picking(`${pima(AM)} | ${pami(AM)}`, `${PIMA_FINGERS} ${PAMI_FINGERS}`, "Rising for a bar, then falling."),
        tab("1:0/q 1:1/q 1:3/q 1:1/q | 1:0/w", "A melody on string 1. Try it with rest strokes: each finger comes to rest on string 2."),
      ] },
      { kind: "practice", blocks: [
        choice("After a free stroke, where does the finger go?", ["Clear of the next string, towards the palm", "To rest on the next string", "Back to the same string"], 0, "The other strings stay free to ring."),
        choice("After a rest stroke, where does the finger go?", ["To rest on the next string", "Into the air", "Under the string"], 0, "That is what gives the fuller tone."),
        choice("Which stroke suits an arpeggio?", ["Free stroke", "Rest stroke"], 0, "The strings must ring together."),
        choice("Which stroke makes a melody stand out?", ["Rest stroke", "Free stroke"], 0, "It gives a louder, rounder note."),
        ear("Rising or falling?", tabSound(pami(AM), 80), ["Rising: p-i-m-a", "Falling: p-a-m-i"], 1, "After the bass note the pattern comes down from the top string."),
        picking(`${pima(AM)} | ${pami(AM)}`, `${PIMA_FINGERS} ${PAMI_FINGERS}`, "Play along at 60."),
      ] },
    ],
  },
  {
    ...base,
    slug: "walking-bass-lines",
    title: "Walking bass lines between chords",
    order: 5,
    concepts: ["walking-bass"],
    needs: ["free-strokes-and-rest-strokes", "slash-chords"],
    steps: [
      { kind: "understand", blocks: [text(`When a chord changes, the bass usually jumps from one root to the next. A **walking bass line** fills that jump with steps, so the bass **walks** to the new chord.

It works because the roots of common chords are close together in the scale. In the key of C:

- **C down to A minor:** C, **B**, A. One note in between.
- **G up to C:** G, **A**, **B**, C. Two notes in between.

The in-between notes come from the scale of the key. They are passing notes: they belong to neither chord fully, and they pull the ear forward to the next one.

How to play it:

- **The thumb plays the walk.** All these notes are on strings 5 and 6.
- **The fingers keep plucking the chord** on the upper strings, between the bass notes.
- **Time the walk to arrive on beat 1** of the new chord. For one passing note, play it on beat 3 of the bar before. For two, play them on beats 3 and 4, or as two eighth notes on beat 3.

While the bass walks, the upper strings can simply stay as they are. C with a B in the bass is a real chord, written **C/B**. You met these slash chords in the theory path.

A walking bass makes even two plain chords sound arranged.`)] },
      { kind: "listen", blocks: [
        audio("C to A minor, with B walking between them", tabSound(WALK_C_AM, 80)),
        audio("G to C, walking up through A and B", tabSound(WALK_G_C, 80)),
      ] },
      { kind: "learn", blocks: [
        show(shape("5:3 5:2 5:0"), "C, B, A on string 5: frets 3, 2 and open.", "guitar"),
        picking(WALK_C_AM, WALK_FINGERS_1, "C to A minor. On beat 3 of bar 1 the thumb plays B, on its way down to A."),
        picking(WALK_G_C, WALK_FINGERS_2, "G to C. On beat 3 the thumb plays A then B as two quick notes, and lands on C."),
      ] },
      { kind: "practice", blocks: [
        choice("What does a walking bass line do?", ["Fills the gap between two roots with steps", "Plays the melody", "Repeats one note"], 0, "The bass walks to the next chord."),
        choice("Which note walks between C and A?", ["B", "D", "F"], 0, "C, B, A."),
        find("Tap the passing note between C and A minor, on string 5.", "B2", "String 5, fret 2.", { strings: [5], ...G }),
        choice("When should the walk arrive on the new root?", ["On beat 1 of the new chord", "On beat 2", "Whenever it gets there"], 0, "The passing notes come just before."),
        choice("A C chord with B in the bass is written how?", ["C/B", "B/C", "Cb"], 0, "Chord, slash, bass note."),
        picking(WALK_C_AM, WALK_FINGERS_1, "Play along at 60."),
      ] },
    ],
  },
  {
    ...base,
    slug: "hammer-ons-inside-patterns",
    title: "Hammer-ons and pull-offs inside patterns",
    order: 6,
    concepts: ["fingerstyle-ornaments"],
    needs: ["walking-bass-lines"],
    steps: [
      { kind: "understand", blocks: [text(`A picking pattern repeats, and repetition can go flat. One small move brings it back to life: a **hammer-on** or **pull-off** in the middle of the pattern, played by the chord hand while the picking hand carries on.

The idea is simple. Pluck an **open string**, then **hammer a chord finger onto it**. The note jumps up without a second pluck. The picking hand gets a free note, and the pattern gains a little flick.

Two places where it falls easily under the hand:

- **A minor:** string 4. Pluck it open, then hammer on to fret 2. That finger was going there anyway.
- **C:** string 4 again. Open, then hammer to fret 2.

In both, the hammered note is a note of the chord, so the chord ends up exactly as it should be. You have only delayed one finger and made its arrival audible.

The **pull-off** is the reverse: with the finger down, pluck, then flick it off sideways to sound the open string.

Keep the rhythm exact. A hammer-on is not a free decoration; it is a note with a place in the bar. Here the open string and the hammered note are two eighth notes on beat 2.

Use it sparingly. Once every bar or two is plenty.`)] },
      { kind: "listen", blocks: [
        audio("A minor with a hammer-on on string 4", tabSound(HAMMER_AM, 80)),
        audio("C with the same move", tabSound(HAMMER_C, 80)),
      ] },
      { kind: "learn", blocks: [
        picking(HAMMER_AM, HAMMER_FINGERS, "On beat 2 the thumb plucks string 4 open, and the chord finger hammers on to fret 2. No second pluck."),
        picking(HAMMER_C, HAMMER_FINGERS, "The same on C."),
      ] },
      { kind: "practice", blocks: [
        choice("In this move, which hand sounds the second note?", ["The chord hand, by hammering on", "The picking hand", "Both"], 0, "The picking hand plucks only the open string."),
        choice("On A minor, which string takes the hammer-on?", ["String 4", "String 1", "String 6"], 0, "Open, then fret 2."),
        find("Tap the note you arrive on when you hammer string 4 from open to fret 2.", "E3", "String 4, fret 2 is E.", { strings: [4], ...G }),
        choice("How often should you use this in a pattern?", ["Sparingly: once every bar or two", "On every note", "Never"], 0, "It is seasoning."),
        picking(HAMMER_AM, HAMMER_FINGERS, "Play along on A minor at 60."),
        picking(`${HAMMER_AM} | ${HAMMER_C}`, repeat(HAMMER_FINGERS, 2), "A minor, then C.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "natural-harmonics",
    title: "Natural harmonics",
    order: 7,
    concepts: ["natural-harmonics"],
    needs: ["hammer-ons-inside-patterns", "the-octave"],
    steps: [
      // OWNER REVIEW: how a harmonic is touched and released.
      { kind: "understand", blocks: [text(`A **natural harmonic** is a clear, bell-like note you get from a string without pressing it down.

How to play one:

1. **Touch** the string lightly with a fingertip, **directly above the metal fret**, not behind it as you would to press.
2. **Do not push the string down.** Just rest on it.
3. **Pluck** the string.
4. **Lift the finger straight away** so the note can ring.

Too much pressure, or the wrong spot, gives a dull thud. When it is right, the note rings long and pure.

Harmonics only sound at certain points on the string. The three strongest:

- **Fret 12:** exactly halfway along the string. The harmonic sounds **one octave** above the open string. It is the same pitch as the fretted note there, with a different colour.
- **Fret 7:** a third of the way along. It sounds an **octave and a fifth** above the open string.
- **Fret 5:** a quarter of the way along. It sounds **two octaves** above the open string.

So the harmonic at fret 5 is **higher** than the one at fret 7, which surprises everyone at first.

Uses: a chiming ending to a piece, a way to check your tuning, or a few bell notes in the middle of an arrangement. In the tab they are marked **harm**.`)] },
      { kind: "listen", blocks: [
        audio("Harmonics at fret 12 on all six strings", tabSound(HARMONICS_12, 70)),
        audio("String 3: the harmonics at frets 12, 7 and 5", tabSound(HARMONICS_ALL, 70)),
        audio("Three harmonics together at fret 12: a G chord of bells", tabSound(HARMONIC_CHORD, 70)),
      ] },
      { kind: "learn", blocks: [
        tab(HARMONICS_12, "Fret 12, string by string. Touch above the fret wire, pluck, lift.", 60),
        tab(HARMONICS_ALL, "String 3 at frets 12, 7 and 5. Each one sounds higher than the last.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("Where does the finger touch for a harmonic?", ["Directly above the fret wire", "Behind the fret, as for a normal note", "Over the sound hole"], 0, "And it only rests on the string."),
        choice("How hard do you press?", ["Not at all: just touch", "As hard as a normal note", "Harder than normal"], 0, "Pressing kills the harmonic."),
        choice("How high does the harmonic at fret 12 sound?", ["One octave above the open string", "Two octaves above", "The same as the open string"], 0, "Fret 12 is halfway along the string."),
        choice("Which harmonic is higher?", ["Fret 5", "Fret 7", "They are the same"], 0, "Fret 5 gives two octaves; fret 7 gives an octave and a fifth."),
        ear("The string 3 harmonics at frets 12, 7 and 5. Do they rise or fall?", tabSound(HARMONICS_ALL, 70), ["Rise", "Fall"], 0, "Each is higher than the last."),
        tab(HARMONICS_12, "Play along at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "alternate-tunings",
    title: "Alternate tunings",
    order: 8,
    concepts: ["alternate-tunings"],
    needs: ["natural-harmonics", "sus-and-power-chords"],
    steps: [
      // OWNER REVIEW: retuning advice.
      { kind: "understand", blocks: [text(`Standard tuning is a compromise that makes most things possible. Change it, and some things become easy and beautiful that were awkward before. Fingerstyle players do this all the time.

**The theory does not change.** A C is still a C, and a major chord is still 1, 3, 5. What changes is **where the notes are**, so every shape you know has to be found again. That is the cost. The gain is ringing open strings and new sounds.

Three tunings, each written from string 6 to string 1.

**Drop D: D A D G B E.** Only string 6 changes, down a whole step from E to D. The three bass strings now form a D power chord when played open, and one finger across them plays a power chord anywhere. Everything on strings 5 to 1 is unchanged, so it is the easiest tuning to start with.

**Open G: D G D G B D.** Strings 6, 5 and 1 each come down a whole step. The open strings are now a **G major chord**. Lay one finger flat across fret 5 and you have C; across fret 7, D. Three chords with one finger.

**DADGAD: D A D G A D.** Strings 6, 2 and 1 come down a whole step. The open strings form a **Dsus4**: neither major nor minor, open and ringing. It is closely tied to Celtic-style fingerstyle.

Two cautions. **Always tune down, not up**, to reach these, so you do not snap a string. And retune by ear against a neighbouring string or with a tuner each time; strings drift when their tension changes.`)] },
      { kind: "listen", blocks: [
        audio("Drop D: the three open bass strings make a D power chord", tabSound("6:0+5:0+4:0/w", 70, 4, DROP_D)),
        audio("Open G: the open strings, then one finger across fret 5 and fret 7", tabSound(`${ALL_OPEN} | ${barre(5)} ${barre(7)} | ${ALL_OPEN}`, 70, 4, OPEN_G)),
        audio("DADGAD: the open strings", tabSound(ALL_OPEN, 70, 4, DADGAD)),
      ] },
      { kind: "learn", blocks: [
        tuned("6:0+5:0+4:0/h 6:5+5:5+4:5/h | 6:7+5:7+4:7/h 6:0+5:0+4:0/h", DROP_D, "Drop D. One finger across the three bass strings: D5 open, G5 at fret 5, A5 at fret 7."),
        tuned(`${ALL_OPEN} | ${barre(5)} ${barre(7)} | ${ALL_OPEN}`, OPEN_G, "Open G. The open strings are G; fret 5 is C; fret 7 is D."),
        tuned(`${ALL_OPEN} | 6:0/q 5:0/q 4:0/q 3:0/q | 2:0/q 1:0/q r/h`, DADGAD, "DADGAD: the open strings together, then one by one."),
      ] },
      { kind: "practice", blocks: [
        choice("What does an alternate tuning change?", ["Where the notes are", "Which notes make a chord", "The number of strings"], 0, "The theory is the same; the map is new."),
        choice("In Drop D, which string changes?", ["Only string 6", "Strings 1 and 6", "All of them"], 0, "Down a whole step, from E to D."),
        choice("In open G, what do the open strings sound?", ["A G major chord", "A D minor chord", "A scale"], 0, "D G D G B D: only the notes G, B and D."),
        choice("In open G, one finger across fret 5 gives which chord?", ["C", "A", "D"], 0, "Five frets above G is C."),
        choice("Which chord do the open strings of DADGAD form?", ["Dsus4", "D major", "D minor"], 0, "D, G and A: no third."),
        choice("To reach a new tuning, which way should you turn the strings?", ["Down, to loosen them", "Up, to tighten them", "It does not matter"], 0, "Tuning down does not risk snapping a string."),
      ] },
    ],
  },
  {
    ...base,
    slug: "two-part-study-piece",
    title: "Study piece: bass and melody",
    order: 9,
    minutes: 10,
    concepts: ["fingerstyle-study"],
    needs: ["alternate-tunings", "melody-over-an-alternating-bass"],
    steps: [
      { kind: "understand", blocks: [text(`This piece is in two parts, played by one pair of hands: a steady bass from the thumb, and a melody on top.

It is in standard tuning, eight bars long, one chord per bar:

**C – C – G – G – Am – Am – G – C**

**The bass.** The thumb plays every beat, alternating between two strings: strings 5 and 4 for C, strings 6 and 4 for G, strings 5 and 4 for A minor.

**The melody.** Half notes on strings 1 and 2, pinched with the thumb on beats 1 and 3:

- Over C: E, G, then E, C.
- Over G: D, B, then D, G.
- Over A minor: E, C, then C, E.
- Over G again: D, B.
- The last bar is one held pinch on C.

How to learn it:

1. **Thumb alone, all eight bars**, changing chords. It must not hesitate at the changes.
2. **Melody alone**, saying the note names.
3. **Together, four bars at a time**, slowly.
4. **Bring out the melody.** Top strings firmly, thumb gently.

Listen for the melody as one singing line from start to finish. If it sounds like eight separate bars, slow down and let each melody note ring into the next.`)] },
      { kind: "listen", blocks: [
        audio("Bars 1 to 4: C, C, G, G", tabSound(STUDY_1, 80)),
        audio("Bars 5 to 8: Am, Am, G, C", tabSound(STUDY_2, 80)),
      ] },
      { kind: "learn", blocks: [
        picking(STUDY_1, studyFingers(0, 4), "Bars 1 to 4."),
        picking(STUDY_2, `${studyFingers(4, 7)} pm`, "Bars 5 to 8. The last bar is one pinch, held."),
      ] },
      { kind: "practice", blocks: [
        choice("What does the thumb play in this piece?", ["An alternating bass on every beat", "The melody", "Only the first beat of each bar"], 0, "Two bass strings, in turn."),
        choice("On which beats does the melody move?", ["1 and 3", "2 and 4", "Every beat"], 0, "Half notes, pinched with the thumb."),
        choice("Which part should the listener hear most clearly?", ["The melody", "The bass", "Both exactly the same"], 0, "Top strings firmly, thumb gently."),
        picking(STUDY_1, studyFingers(0, 4), "Play along: bars 1 to 4 at 60."),
        picking(STUDY_2, `${studyFingers(4, 7)} pm`, "Bars 5 to 8 at 60."),
      ] },
    ],
  },
];
