// Playing track G1, Basic stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (pick grip, wrist, which strings an upstroke catches, the
// change-early trick, bass and treble strums) is standard teaching written from memory, not checked against
// a player. Each such passage is marked "OWNER REVIEW" below. These lessons also still need their demo videos.
import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, diagram, ear, rhythm, shape, show, strum, strumBars, text, together } from "../helpers";

const base = { moduleSlug: "strumming-basic", track: "guitar-strumming", strand: "guitar", isFree: false, version: 1, minutes: 6 } as const;
const G = "G2 B2 D3 G3 B3 G4"; // 320003
const C = "C3 E3 G3 C4 E4"; // x32010
const D = "D3 A3 D4 F#4"; // xx0232
const EM = "E2 B2 E3 G3 B3 E4"; // 022000
const hit = (chordNotes: string) => chordNotes.split(" ").join("+");
/** A strumming pattern as sound: strummed("D - D U - U D U", G). */
const strummed = (pattern: string, chordNotes: string, bpm = 80) => rhythm(pattern.split(" ").map((slot) => (slot === "-" ? "r/8" : `${hit(chordNotes)}/8`)).join(" "), bpm);
const DOWNS = "D - D - D - D -";
const EIGHTHS = "D U D U D U D U";
const PATTERN_2 = "D - D U D - D U";
const PATTERN_3 = "D - D U - U D U";
const G_BASS = "G2 B2 D3";
const G_TREBLE = "G3 B3 G4";
const BOOM_CHICK = rhythm(`${hit(G_BASS)}/q ${hit(G_TREBLE)}/q ${hit(G_BASS)}/q ${hit(G_TREBLE)}/q`, 80);

export const strummingBasic: LessonInput[] = [
  {
    ...base,
    slug: "holding-the-pick",
    title: "Holding the pick and where to strum",
    order: 1,
    concepts: ["pick-grip"],
    needs: ["tab-and-chord-diagrams"],
    steps: [
      // OWNER REVIEW: grip, wrist and strumming position.
      { kind: "understand", blocks: [text(`Strumming is rhythm first. Your strumming hand is the drummer; the chord hand only chooses the colour. So this track starts with that hand.

**Holding the pick.** Rest the pick on the side of your index finger, near the tip, and put the pad of your thumb on top. Only a small point of the pick should show past your thumb. Hold it firmly enough that it does not turn, and loosely enough that it gives a little as it crosses the strings. A grip that is too tight makes a harsh sound and a tired hand.

**The swing.** The movement comes from the forearm, with the wrist loose. Shoulders stay down and still. Aim to brush across the strings, not dig into them.

**Where to strum.** On an acoustic guitar, strum over the sound hole. On an electric, strum between the end of the neck and the bridge. Nearer the neck the sound is warmer and softer; nearer the bridge it is brighter and thinner.

No pick? The same swing works with the side of your thumb or the nail of your index finger.`)] },
      { kind: "listen", blocks: [
        audio("One strum of a G chord", together(G)),
        audio("Two slow strums in each bar, on beats 1 and 3", strummed("D - - - D - - -", G, 70)),
      ] },
      { kind: "learn", blocks: [
        diagram("320003", "G", "major", "G major. All six strings ring, so it is a forgiving chord to strum."),
        strum("D - - - D - - -", G, "Strum down on beats 1 and 3. Let the chord ring in between, and keep counting.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("Which hand is in charge of the rhythm?", ["The strumming hand", "The chord hand", "Neither"], 0, "The strumming hand keeps time; the chord hand chooses the notes."),
        choice("How much of the pick should show past your thumb?", ["A small point", "About half of it", "Nearly all of it"], 0, "A small tip is easier to control and less likely to catch."),
        choice("What does a grip that is too tight do?", ["Makes a harsh sound and tires the hand", "Makes the guitar quieter", "Nothing"], 0, "The pick needs to give a little as it crosses the strings."),
        choice("Where does strumming sound brighter and thinner?", ["Near the bridge", "Over the sound hole", "Over the fretboard"], 0, "Nearer the neck is warmer; nearer the bridge is brighter."),
        strum("D - - - D - - -", G, "Strum along with the loop: down on 1 and 3. Listen for all six strings.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "downstrokes-on-the-beat",
    title: "Downstrokes on the beat",
    order: 2,
    concepts: ["downstrokes"],
    needs: ["holding-the-pick", "counting-out-loud"],
    steps: [
      { kind: "understand", blocks: [text(`The first rhythm is the simplest one: a **downstroke on every beat**. Four strums in a bar of 4/4, each lasting a quarter note.

Count out loud as you play: **1, 2, 3, 4**. Each number is one strum.

Three things to aim for:

- **Even time.** The gap between strums never changes. Play with the click, and try to make the click disappear under your strum.
- **Even volume.** No strum louder than the others, for now.
- **One motion.** Each strum crosses the strings in a single smooth movement from the thickest string to the thinnest, so the notes sound together as a chord and not one after another.

Tap your foot on every beat. Your foot and your strumming hand go down together.

This lesson uses E minor. It needs only two fingers and all six strings are played, so you can give your attention to the strumming hand.`)] },
      { kind: "listen", blocks: [
        audio("E minor, a downstroke on every beat", strummed(DOWNS, EM)),
        audio("The same, slower", strummed(DOWNS, EM, 60)),
      ] },
      { kind: "learn", blocks: [
        diagram("022000", "E", "minor", "E minor. Two fingers, six strings."),
        strum(DOWNS, EM, "Down on 1, 2, 3 and 4. The faint arrows are your hand coming back up without touching the strings.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("In this rhythm, how many strums are in one bar of 4/4?", ["Four", "Two", "Eight"], 0, "One downstroke on each beat."),
        choice("How long does each strum last?", ["A quarter note", "A half note", "An eighth note"], 0, "One beat each."),
        ear("How many strums do you hear in each bar?", strummed("D - - - D - - -", EM), ["Two", "Four", "Eight"], 0, "Strums on beats 1 and 3 only."),
        ear("And here?", strummed(DOWNS, EM), ["Two", "Four", "Eight"], 1, "One on every click."),
        strum(DOWNS, EM, "Strum along at 60. Count out loud.", 60),
        strum(DOWNS, EM, "Now at 80. Same relaxed swing, just closer together.", 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "down-up-eighths",
    title: "Down-up eighth notes",
    order: 3,
    concepts: ["constant-motion"],
    needs: ["downstrokes-on-the-beat"],
    steps: [
      // OWNER REVIEW: "an upstroke catches only the thinnest three or four strings".
      { kind: "understand", blocks: [text(`When you strum down on every beat, your hand has to come back up between strums. So far it has come up without touching the strings. Let it touch them, and you have **eighth notes**: two strums per beat.

Count **1 & 2 & 3 & 4 &**.

- **Down** on the numbers.
- **Up** on the "ands".

This never changes. It is the **constant-motion rule**: your hand swings down and up like a pendulum, in steady eighth notes, for the whole song. A strumming pattern is only a choice of which swings hit the strings and which miss. Because the hand never stops, it always knows where the beat is.

Upstrokes are lighter than downstrokes. An upstroke usually catches only the thinnest three or four strings, and that is fine. Do not try to reach all six.

Keep the swing the same size whether it hits or misses.`)] },
      { kind: "listen", blocks: [
        audio("Downstrokes only: 1, 2, 3, 4", strummed(DOWNS, EM)),
        audio("Down-up eighth notes: 1 & 2 & 3 & 4 &", strummed(EIGHTHS, EM)),
      ] },
      { kind: "learn", blocks: [
        strum(DOWNS, EM, "Where you have been: down on the beats, the upswing missing.", 70),
        strum(EIGHTHS, EM, "Now every swing hits. Down on the numbers, up on the ands.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("Where do upstrokes fall?", ["On the ands", "On the numbers", "Anywhere"], 0, "Down on the numbers, up on the ands, always."),
        choice("What is the constant-motion rule?", ["The hand keeps swinging down and up; some swings miss", "The hand stops after every strum", "Every swing must hit all six strings"], 0, "The steady swing is what keeps your time."),
        choice("How many strums are in a bar of down-up eighth notes?", ["Eight", "Four", "Sixteen"], 0, "Two per beat."),
        ear("Downstrokes only, or down-up eighth notes?", strummed(EIGHTHS, EM), ["Downstrokes only", "Down-up eighth notes"], 1, "Two strums for every click."),
        strum(EIGHTHS, EM, "Strum along at 60. Say 1 and 2 and 3 and 4 and.", 60),
        strum(EIGHTHS, EM, "Now at 80.", 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "first-strumming-patterns",
    title: "Your first strumming patterns",
    order: 4,
    concepts: ["strumming-patterns"],
    needs: ["down-up-eighths"],
    steps: [
      { kind: "understand", blocks: [text(`A strumming pattern is the constant swing with some of the swings left out. Here are three, each one a small step from the last.

**1. Down, down, down, down.** The pattern you know. Every upswing misses.

**2. Down, down-up, down, down-up.** Add the upstroke after beats 2 and 4. Count: 1, 2 &, 3, 4 &.

**3. Down, down-up, up-down-up.** The one you will hear in thousands of songs. Count: 1, 2 &, & 4 &. On **beat 3 the hand goes down and misses on purpose**, then catches the strings on the way up.

That missed downstroke is the hard part. The hand wants to stop and wait. Do not let it: keep the swing going and move the hand a little away from the strings as it passes.

A way to learn any pattern:

1. **Say it** in time: "down, down-up, up-down-up".
2. **Mute it.** Rest your chord hand lightly across the strings and strum the pattern as a dry click.
3. **Play it** on one chord, slowly.
4. Only then speed up.`)] },
      { kind: "listen", blocks: [
        audio("Pattern 1: down, down, down, down", strummed(DOWNS, G)),
        audio("Pattern 2: down, down-up, down, down-up", strummed(PATTERN_2, G)),
        audio("Pattern 3: down, down-up, up-down-up", strummed(PATTERN_3, G)),
      ] },
      { kind: "learn", blocks: [
        strum(PATTERN_2, G, "Pattern 2. Upstrokes after beats 2 and 4.", 70),
        strum(PATTERN_3, G, "Pattern 3. Look at beat 3: the arrow is faint. The hand still goes down there.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("In pattern 3, what does the hand do on beat 3?", ["Swings down and misses the strings", "Stops and waits", "Strums up"], 0, "The swing never stops; it only misses."),
        ear("Which pattern is this?", strummed(PATTERN_2, G), ["Down, down, down, down", "Down, down-up, down, down-up", "Down, down-up, up-down-up"], 1, "Beats 1 and 3 have one strum; beats 2 and 4 have two."),
        ear("And this?", strummed(PATTERN_3, G), ["Down, down, down, down", "Down, down-up, down, down-up", "Down, down-up, up-down-up"], 2, "There is no strum on beat 3 itself."),
        choice("What is the first step in learning a new pattern?", ["Say it in time", "Play it as fast as you can", "Change chords with it"], 0, "If you can say it, your hand has something to follow."),
        strum(PATTERN_2, G, "Play pattern 2 with the loop.", 70),
        strum(PATTERN_3, G, "Play pattern 3. If beat 3 trips you, mute the strings and try again.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "changing-chords-in-time",
    title: "Changing chords in time",
    order: 5,
    concepts: ["chord-changes"],
    needs: ["first-strumming-patterns"],
    steps: [
      // OWNER REVIEW: the change-early trick as described here.
      { kind: "understand", blocks: [text(`Most beginners can strum a chord and can change a chord. The trouble starts when they do both: the strumming hand stops and waits for the chord hand. The music stops with it.

The rule that fixes this: **the strumming hand never waits.** The beat goes on, and the chord hand has to fit around it.

**The change-early trick.** Do not wait for the bar to end before you move. Let go of the old chord on the **last "and" of the bar** and move while the hand makes its final upstroke. That upstroke will catch some open strings. It sounds fine, it is over in a moment, and it buys the time you need to land the new chord **on beat 1**.

A late beat 1 is what listeners notice. A slightly messy last upstroke is something they never hear.

Build it up in stages:

1. **One strum per bar.** Strum on beat 1, then use the rest of the bar to change.
2. **Four downstrokes per bar.** Now there is one beat to change in.
3. **A full pattern.** Change on the last upstroke.

If a change keeps failing, slow down until it works. Speed comes from changes that are right, repeated.`)] },
      { kind: "listen", blocks: [
        audio("G to E minor, one strum in each bar", rhythm(`${hit(G)}/w | ${hit(EM)}/w | ${hit(G)}/w | ${hit(EM)}/w`, 80)),
        audio("G to C with four downstrokes per bar", rhythm([G, C, G, C].map((ch) => Array(4).fill(`${hit(ch)}/q`).join(" ")).join(" | "), 80)),
      ] },
      { kind: "learn", blocks: [
        diagram("x32010", "C", "major", "C major. Strum from string 5."),
        diagram("xx0232", "D", "major", "D major. Strum from string 4."),
        strumBars("D - - - - - - -", [["G", G], ["Em", EM], ["G", G], ["Em", EM]], "Stage 1: one strum per bar. Change during the rest of the bar.", 70),
        strumBars(DOWNS, [["G", G], ["C", C], ["G", G], ["D", D]], "Stage 2: four downstrokes per bar. Start moving after beat 4.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("When chords change, which hand must never wait?", ["The strumming hand", "The chord hand", "Both may wait"], 0, "The beat goes on; the chord hand fits around it."),
        choice("With the change-early trick, when do you let go of the old chord?", ["On the last and of the bar", "On beat 1 of the next bar", "On beat 2"], 0, "You move during the final upstroke, so the new chord lands on beat 1."),
        choice("Which matters more to a listener?", ["Beat 1 arriving on time", "A perfectly clean last upstroke", "Neither"], 0, "A late beat 1 breaks the rhythm. Open strings on the last upstroke pass unnoticed."),
        choice("A chord change keeps failing. What should you do?", ["Slow down until it works", "Speed up", "Skip the chord"], 0, "Correct and slow, repeated, becomes correct and fast."),
        strumBars(DOWNS, [["G", G], ["Em", EM], ["C", C], ["D", D]], "Four downstrokes per bar through G, Em, C and D.", 60),
        strumBars(PATTERN_3, [["G", G], ["Em", EM], ["C", C], ["D", D]], "The full pattern. Change on the last upstroke of each bar.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "bass-and-treble-strums",
    title: "Bass strums and treble strums",
    order: 6,
    concepts: ["strum-texture"],
    needs: ["changing-chords-in-time"],
    steps: [
      // OWNER REVIEW: which strings a bass strum and a treble strum cover.
      { kind: "understand", blocks: [text(`You do not have to hit all the strings every time. Choosing **which strings** you strum changes the texture, and it is the easiest way to make one chord and one pattern sound like more.

- A **bass strum** catches only the thickest two or three strings. It is low and solid.
- A **treble strum** catches only the thinnest three. It is light and bright.

Put them in turn and you have a pattern called **boom-chick**: bass strum on beats 1 and 3, treble strum on beats 2 and 4. The bass strum does the job of a bass player and the treble strum the job of a snare drum.

You do this by aiming, not by changing the swing. For a bass strum the hand starts its downstroke as usual and pulls away early. For a treble strum it passes over the thick strings and lands on the thin ones.

The same idea shapes a whole song. Strum mostly the thin strings in a quiet verse, then all six in the chorus, and the chorus lifts without you playing any harder.`)] },
      { kind: "listen", blocks: [
        audio("A bass strum of G: the three thickest strings", together(G_BASS)),
        audio("A treble strum of G: the three thinnest strings", together(G_TREBLE)),
        audio("Boom-chick: bass, treble, bass, treble", BOOM_CHICK),
      ] },
      { kind: "learn", blocks: [
        show(shape("6:3 5:2 4:0"), "The bass strum of G: strings 6, 5 and 4.", "guitar"),
        show(shape("3:0 2:0 1:3"), "The treble strum of G: strings 3, 2 and 1.", "guitar"),
        strum(DOWNS, G, "Four downstrokes. Aim beats 1 and 3 at the thick strings, beats 2 and 4 at the thin ones.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("Which strings does a bass strum catch?", ["The thickest two or three", "The thinnest three", "All six"], 0, "The low strings, for a solid sound."),
        choice("In boom-chick, which beats get the bass strum?", ["1 and 3", "2 and 4", "All four"], 0, "Bass on 1 and 3, treble on 2 and 4."),
        ear("Bass strum or treble strum?", together(G_TREBLE), ["Bass strum", "Treble strum"], 1, "High and bright: the thin strings."),
        ear("And this?", together(G_BASS), ["Bass strum", "Treble strum"], 0, "Low and solid: the thick strings."),
        choice("How can a chorus sound bigger without strumming harder?", ["Strum all six strings after a verse on the thin strings", "Play it faster", "Change key"], 0, "More strings means a fuller sound."),
        strum(DOWNS, G, "Play boom-chick on G with the loop: thick, thin, thick, thin.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "strumming-study-piece",
    title: "Study piece: four chords in G",
    order: 7,
    minutes: 8,
    concepts: ["strumming-study"],
    needs: ["bass-and-treble-strums"],
    steps: [
      { kind: "understand", blocks: [text(`This piece uses everything in the stage: one pattern, four chords, and changes that land on beat 1.

It is eight bars long, one chord per bar:

**G – Em – C – D – G – C – D – G**

All four chords belong to the key of G major. You will learn why in the theory path; for now, notice that the piece starts on G, ends on G, and that the D chord always sounds as if it wants to move on.

Work through it in three passes:

1. **Downstrokes only**, four per bar, slowly. Get every change onto beat 1.
2. **Pattern 3**: down, down-up, up-down-up.
3. **Add shape.** Play the first four bars more quietly, aiming at the thinner strings, and open up to all six strings for the last four.

When you can play it through twice without stopping, the stage is done. Stopping to fix a chord is the one mistake that counts. A buzzing string does not.`)] },
      { kind: "listen", blocks: [
        audio("The study piece with downstrokes", rhythm([G, EM, C, D, G, C, D, G].map((ch) => Array(4).fill(`${hit(ch)}/q`).join(" ")).join(" | "), 80)),
        audio("The first four bars with pattern 3", rhythm([G, EM, C, D].map((ch) => PATTERN_3.split(" ").map((slot) => (slot === "-" ? "r/8" : `${hit(ch)}/8`)).join(" ")).join(" | "), 80)),
      ] },
      { kind: "learn", blocks: [
        strumBars(DOWNS, [["G", G], ["Em", EM], ["C", C], ["D", D], ["G", G], ["C", C], ["D", D], ["G", G]], "Pass 1: downstrokes. Follow the chord names as they light up.", 60),
        strumBars(PATTERN_3, [["G", G], ["Em", EM], ["C", C], ["D", D], ["G", G], ["C", C], ["D", D], ["G", G]], "Pass 2: pattern 3 all the way through.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("How many bars long is the study piece?", ["Eight", "Four", "Twelve"], 0, "One chord per bar, eight chords."),
        choice("Which chord does the piece start and end on?", ["G", "D", "Em"], 0, "G is home in the key of G major."),
        choice("While you play it through, which mistake matters most?", ["Stopping the strumming hand", "A buzzing string", "A quiet upstroke"], 0, "Keep the rhythm going; clean up the notes later."),
        strumBars(PATTERN_3, [["G", G], ["Em", EM], ["C", C], ["D", D], ["G", G], ["C", C], ["D", D], ["G", G]], "Play along at 70.", 70),
        strumBars(PATTERN_3, [["G", G], ["Em", EM], ["C", C], ["D", D], ["G", G], ["C", C], ["D", D], ["G", G]], "And at 90. Quieter for four bars, then all six strings.", 90),
      ] },
    ],
  },
];
