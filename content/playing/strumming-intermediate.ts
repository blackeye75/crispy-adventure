// Playing track G1, Intermediate stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (which strokes are down or up, how to accent, mute, palm-mute,
// hold a barre, and play off-beats) is standard teaching written from memory, not checked against a player.
// Each such passage is marked "OWNER REVIEW" below. These lessons also still need their demo videos.
// The app cannot make a real muted or palm-muted sound: it plays the chord cut short instead.
import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, diagram, ear, strum, strumBars, strumSound, text } from "../helpers";

const base = { moduleSlug: "strumming-intermediate", track: "guitar-strumming", strand: "guitar", isFree: false, version: 1, minutes: 7 } as const;
const G = "G2 B2 D3 G3 B3 G4"; // 320003
const C = "C3 E3 G3 C4 E4"; // x32010
const D = "D3 A3 D4 F#4"; // xx0232
const EM = "E2 B2 E3 G3 B3 E4"; // 022000
const AM = "A2 E3 A3 C4 E4"; // x02210
const E5 = "E2 B2 E3"; // 022xxx
const A5 = "A2 E3 A3"; // x022xx
const G5 = "G2 D3 G3"; // 355xxx
const F_BARRE = "F2 C3 F3 A3 C4 F4"; // 133211
const G_BARRE = "G2 D3 G3 B3 D4 G4"; // 355433
const A_BARRE = "A2 E3 A3 C#4 E4 A4"; // 577655

const EIGHTHS = "D U D U D U D U";
const MAIN = "D - D U - U D U";
const S16_ALL = "D U D U D U D U D U D U D U D U";
const S16_GALLOP = "D - D U D - D U D - D U D - D U";
const S16_MIXED = "D - D - D U D U D - D - D U D U";
const BACKBEAT = "D U D> U D U D> U";
const PULSE_16 = "D> U D U D> U D U D> U D U D> U D U";
const SYNC_2 = "D - - U - U D -";
const SYNC_3 = "D - D U - U - U";
const ALL_MUTED = "x x x x x x x x";
const CHUCK = "D U x U D U x U";
const CHUCK_2 = "D - x U - U x U";
const PALM = "D. D. D. D. D. D. D. D.";
const PALM_ACCENTS = "D> D. D. D> D. D. D> D.";
const WALTZ_1 = "D - D - D -";
const WALTZ_2 = "D - D U D U";
const SIX_EIGHT = "D> D D D> D D";
const ALL_DOWN = "D D D D D D D D";
const STACCATO = "D. - D. - D. - D. -";
const SHUFFLE_2 = "D - D U D - D U";
const SKA = "- U. - U. - U. - U.";
const REGGAE = "- - D. - - - D. -";
const CHORUS_16 = "D> - D U - U D U D> - D U - U D U";
const VERSE: [string, string][] = [["Em", EM], ["C", C], ["G", G], ["D", D], ["Em", EM], ["C", C], ["G", G], ["D", D]];
const CHORUS: [string, string][] = [["G", G], ["D", D], ["Em", EM], ["C", C], ["G", G], ["D", D], ["Em", EM], ["C", C]];

export const strummingIntermediate: LessonInput[] = [
  {
    ...base,
    slug: "sixteenth-note-strumming",
    title: "Sixteenth-note strumming",
    order: 1,
    concepts: ["sixteenth-strumming"],
    needs: ["strumming-study-piece", "sixteenth-notes"],
    steps: [
      { kind: "understand", blocks: [text(`So far your hand has swung in eighth notes: down on the beat, up on the "and". **Sixteenth-note strumming** doubles the swing. The hand now goes down and up **twice** in every beat.

Count **1 e & a, 2 e & a, 3 e & a, 4 e & a**.

- **Down** on the number and on the "&".
- **Up** on the "e" and on the "a".

The constant-motion rule still holds. The hand never stops; patterns are made by missing. What changes is the size of the movement: at this speed the swing has to be small and loose, mostly from the wrist.

Sixteenth strumming does not mean playing fast. The tempo of the song usually drops. A ballad at 70 beats per minute with sixteenth strumming has the same hand speed as a pop song at 140 with eighths.

Three patterns to start with:

1. **All sixteen.** Every swing hits.
2. **The gallop:** 1 & a, 2 & a. Down, down-up.
3. **Two eighths, four sixteenths:** 1 &, 2 e & a.`)] },
      { kind: "listen", blocks: [
        audio("Eighth notes, for comparison", strumSound(EIGHTHS, G, 70)),
        audio("Sixteenth notes at the same tempo", strumSound(S16_ALL, G, 70, "16ths")),
        audio("The gallop: 1 & a, 2 & a", strumSound(S16_GALLOP, G, 70, "16ths")),
      ] },
      { kind: "learn", blocks: [
        strum(S16_ALL, G, "All sixteen. Down on the numbers and the ands; up on the e and the a.", 60, "16ths"),
        strum(S16_GALLOP, G, "The gallop. The e of every beat is missed.", 60, "16ths"),
        strum(S16_MIXED, G, "Two eighth notes, then four sixteenths.", 60, "16ths"),
      ] },
      { kind: "practice", blocks: [
        choice("How do you count sixteenth notes?", ["1 e & a", "1 & 2 &", "1 2 3 4"], 0, "Four parts to every beat."),
        choice("In sixteenth strumming, which counts get a downstroke?", ["The number and the &", "The e and the a", "Only the number"], 0, "Down on 1 and &, up on e and a."),
        ear("Eighth notes or sixteenth notes?", strumSound(S16_ALL, G, 70, "16ths"), ["Eighth notes", "Sixteenth notes"], 1, "Four strums for every click."),
        ear("Which pattern is this?", strumSound(S16_GALLOP, G, 70, "16ths"), ["All sixteen", "The gallop: 1 & a"], 1, "Long, short-short on every beat."),
        strum(S16_ALL, G, "Strum along at 60. Keep the swing small.", 60, "16ths"),
        strum(S16_GALLOP, G, "The gallop at 60.", 60, "16ths"),
      ] },
    ],
  },
  {
    ...base,
    slug: "accents-and-dynamics",
    title: "Accents and dynamics",
    order: 2,
    concepts: ["strum-accents"],
    needs: ["sixteenth-note-strumming"],
    steps: [
      // OWNER REVIEW: how an accent is made.
      { kind: "understand", blocks: [text(`If every strum is the same volume, a pattern sounds like a machine. What gives a strumming part its groove is that some strums are **louder** than others. A louder strum is an **accent**.

Make an accent by swinging a little harder and catching more strings. Just as important: make the strums around it **softer**. An accent only stands out against something quieter.

The accent you will use most is the **backbeat**: beats **2 and 4**. This is where a drummer plays the snare. Accent those two strums in an eighth-note pattern and it starts to sound like a band.

In sixteenth strumming, accent the **first sixteenth of each beat**. The beat stays clear and the notes in between become a soft shimmer.

**Dynamics** is the same idea across a whole song. Play the verse softly, on fewer strings, and the chorus stronger, on all of them. The pattern can stay the same; the song still lifts.

In the diagrams, an accented strum has a heavier arrow with a **>** under it.`)] },
      { kind: "listen", blocks: [
        audio("No accents", strumSound(EIGHTHS, G, 80)),
        audio("Accents on beats 2 and 4", strumSound(BACKBEAT, G, 80)),
        audio("Sixteenths with an accent on every beat", strumSound(PULSE_16, G, 70, "16ths")),
      ] },
      { kind: "learn", blocks: [
        strum(BACKBEAT, G, "The backbeat: lean on beats 2 and 4, and keep the rest light."),
        strum(PULSE_16, G, "Sixteenths. Accent each number; let the e, & and a be soft.", 60, "16ths"),
      ] },
      { kind: "practice", blocks: [
        choice("What is an accent?", ["A strum played louder than those around it", "A strum that misses", "A faster strum"], 0, "Louder, against a softer background."),
        choice("Which beats are the backbeat?", ["2 and 4", "1 and 3", "Only 1"], 0, "Where the snare drum usually falls."),
        choice("What makes an accent stand out?", ["The other strums being softer", "Playing everything loudly", "Stopping before it"], 0, "Contrast is what the ear hears."),
        ear("Is there an accent on beats 2 and 4?", strumSound(BACKBEAT, G, 80), ["No", "Yes"], 1, "Two strums in each bar jump out."),
        strum(BACKBEAT, G, "Strum along with the backbeat at 70.", 70),
        strum(PULSE_16, G, "Accented sixteenths at 60.", 60, "16ths"),
      ] },
    ],
  },
  {
    ...base,
    slug: "syncopated-strumming",
    title: "Syncopation and tied strums",
    order: 3,
    concepts: ["syncopated-strumming"],
    needs: ["accents-and-dynamics", "syncopation"],
    steps: [
      { kind: "understand", blocks: [text(`**Syncopation** means putting weight where the ear does not expect it: on the "ands", and away from the beats.

In strumming you get it by **missing a downstroke on a beat**. The upstroke before it rings on through the beat. On paper that upstroke is **tied** to the next note; in your hand, it is one strum and then a swing that misses.

You already play one syncopated pattern, the one from the Basic stage:

**Down, down-up, up-down-up.** The downstroke on beat 3 is missed, so the "and" of 2 carries across it.

Two more, each missing more beats:

- **1, & of 2, & of 3, 4.** Beats 2 and 3 are both missed. The pattern floats.
- **1, 2 &, & of 3, & of 4.** The last upstroke is on the "and" of 4, so it leans into the next bar. Players call that a push.

The rule for learning them is the one you know: the hand keeps swinging on every eighth note. On the missed beats it goes down past the strings without touching them. If the hand stops to wait, the rhythm falls apart.`)] },
      { kind: "listen", blocks: [
        audio("Straight: a strum on every beat", strumSound("D - D U D - D U", G, 80)),
        audio("Beat 3 missed", strumSound(MAIN, G, 80)),
        audio("Beats 2 and 3 missed", strumSound(SYNC_2, G, 80)),
        audio("With a push on the and of 4", strumSound(SYNC_3, G, 80)),
      ] },
      { kind: "learn", blocks: [
        strum(MAIN, G, "The pattern you know. The faint arrow on beat 3 is the missed downstroke."),
        strum(SYNC_2, G, "Beats 2 and 3 are missed. The upstrokes carry the rhythm."),
        strum(SYNC_3, G, "Beats 3 and 4 are missed; the last upstroke pushes into the next bar."),
      ] },
      { kind: "practice", blocks: [
        choice("How do you syncopate a strumming pattern?", ["Miss a downstroke on a beat", "Strum harder", "Stop the hand"], 0, "The upstroke before it rings across the beat."),
        choice("On a missed beat, what does the hand do?", ["Swings down past the strings", "Waits above the strings", "Strums up twice"], 0, "The motion never stops."),
        ear("Is there a strum on beat 3?", strumSound(MAIN, G, 80), ["Yes", "No"], 1, "The and of 2 rings through it."),
        ear("Straight or syncopated?", strumSound(SYNC_2, G, 80), ["Straight", "Syncopated"], 1, "Most of the strums fall between the clicks."),
        strum(SYNC_2, G, "Strum along at 70. Count out loud and keep the hand moving.", 70),
        strum(SYNC_3, G, "The push, at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "muting-and-the-chuck",
    title: "Muting and the percussive strum",
    order: 4,
    concepts: ["strum-muting"],
    needs: ["syncopated-strumming"],
    steps: [
      // OWNER REVIEW: both ways of muting.
      { kind: "understand", blocks: [text(`A strum does not have to sound a chord. Strum strings that are stopped from ringing and you get a dry, drum-like click. Mixed into a pattern it works like a snare drum.

There are two ways to get it.

**Fretting-hand mute.** Keep your fingers on the chord and relax them, so they still touch the strings and no longer press them down. Strum, and you hear a click. Press again and the chord is back. With open chords some strings will still ring; lay a spare finger across them, or use barre chords, where one squeeze controls everything.

**Strumming-hand mute**, often called the **chuck**. As the pick comes down, the side of the palm lands on the strings at the same moment. The result is a short, sharp slap. It takes practice to land the two together.

The classic use is a chuck on beats **2 and 4**, in place of the accented backbeat:

**Down-up, chuck-up, down-up, chuck-up.**

In the diagrams a muted strum is a **cross**. The app cannot make a true muted sound, so you will hear the chord cut very short there.`)] },
      { kind: "listen", blocks: [
        audio("Muted strums on every swing", strumSound(ALL_MUTED, EM, 80)),
        audio("A chuck on beats 2 and 4", strumSound(CHUCK, EM, 80)),
        audio("With some swings missed", strumSound(CHUCK_2, EM, 80)),
      ] },
      { kind: "learn", blocks: [
        strum(ALL_MUTED, EM, "Mute with the fretting hand and strum down-up. Aim for an even, dry click."),
        strum(CHUCK, EM, "Chord on 1 and 3, muted strum on 2 and 4."),
        strum(CHUCK_2, EM, "The same idea on the pattern you know."),
      ] },
      { kind: "practice", blocks: [
        choice("How does the fretting hand mute a chord?", ["It relaxes, touching the strings without pressing", "It lifts right off the neck", "It presses harder"], 0, "Touching stops the strings ringing."),
        choice("In the chuck, what lands on the strings as the pick strikes?", ["The side of the palm", "The thumb of the fretting hand", "Nothing"], 0, "Pick and palm arrive together."),
        choice("On which beats does the classic chuck fall?", ["2 and 4", "1 and 3", "Every and"], 0, "It takes the place of the snare drum."),
        ear("On which beats do you hear the muted strum?", strumSound(CHUCK, EM, 80), ["1 and 3", "2 and 4"], 1, "The chord rings on 1 and 3; the click is on 2 and 4."),
        strum(CHUCK, EM, "Strum along at 70.", 70),
        strum(CHUCK_2, EM, "And this one at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "palm-muting",
    title: "Palm muting",
    order: 5,
    concepts: ["palm-muting"],
    needs: ["muting-and-the-chuck"],
    steps: [
      // OWNER REVIEW: where the palm rests and how hard.
      { kind: "understand", blocks: [text(`**Palm muting** is different from the chuck. The notes still sound; they are only damped, so each one is short, dark and tight. It is the chugging sound of rock rhythm guitar.

Rest the **side of your strumming hand** lightly on the strings **right where they leave the bridge**. Then strum or pick as usual.

Where the hand sits decides everything:

- **On the bridge itself:** no effect. The strings ring freely.
- **Just in front of the bridge:** the palm-muted sound.
- **Further towards the neck:** the notes die completely.

The difference between those is a few millimetres, so find it by ear. Move the hand until the note is short and still has a clear pitch.

Palm muting is nearly always used on the **bass strings**, with **downstrokes**. A common rhythm is eight downstrokes in a bar.

Its real power is contrast. Lift the palm for one strum and that strum leaps out, with no extra force. Muted, muted, **open**, muted is a riff already.

In the diagrams a palm-muted strum has a **dot** under it. The app plays it as a short note.`)] },
      { kind: "listen", blocks: [
        audio("Open: eight downstrokes on the three bass strings of E minor", strumSound(ALL_DOWN, E5, 90)),
        audio("Palm-muted", strumSound(PALM, E5, 90)),
        audio("Palm-muted, with open accents", strumSound(PALM_ACCENTS, E5, 90)),
      ] },
      { kind: "learn", blocks: [
        strum(PALM, E5, "Eight palm-muted downstrokes on strings 6, 5 and 4 of E minor.", 70),
        strum(PALM_ACCENTS, E5, "Lift the palm on the accented strums: 1, the and of 2, and 4.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("Where does the palm rest for palm muting?", ["On the strings just in front of the bridge", "Over the sound hole", "On the fretboard"], 0, "Where the strings leave the bridge."),
        choice("How does a palm-muted note differ from a muted strum?", ["It still has a pitch", "It is louder", "It is an upstroke"], 0, "Damped, not dead."),
        choice("The note dies completely. What should you do?", ["Move the hand back towards the bridge", "Press harder", "Strum harder"], 0, "Too far forward kills the note."),
        ear("Open or palm-muted?", strumSound(PALM, E5, 90), ["Open", "Palm-muted"], 1, "Each note is short and tight."),
        strum(PALM, E5, "Play along at 80.", 80),
        strum(PALM_ACCENTS, E5, "With the open accents, at 80.", 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "strumming-in-three-four-and-six-eight",
    title: "Strumming in 3/4 and 6/8",
    order: 6,
    concepts: ["triple-metre-strumming"],
    needs: ["palm-muting", "three-four-and-six-eight"],
    steps: [
      // OWNER REVIEW: the strokes chosen for 6/8.
      { kind: "understand", blocks: [text(`Not every song counts in four.

**3/4** has three beats in a bar: **1, 2, 3**. It is the feel of a waltz. The hand swings in eighth notes exactly as before; there are simply six swings in a bar where there were eight.

- The simplest pattern is a downstroke on each beat: **down, down, down.**
- The standard one adds upstrokes after beats 2 and 3: **down, down-up, down-up.**

Lean on beat 1 and keep beats 2 and 3 lighter. That gives the "ONE, two, three" sway.

**6/8** also has six eighth notes in a bar, but they are grouped differently: **two groups of three**. Count **1 2 3, 4 5 6**, and feel two big beats, on 1 and on 4.

A simple way to strum it is a **downstroke on every count**, with **accents on 1 and 4**. The accents are what make it 6/8. Play the same six strums with accents on 1, 3 and 5 and you are back in 3/4.

That is the whole difference between the two: where the weight falls.`)] },
      { kind: "listen", blocks: [
        audio("3/4: down, down-up, down-up", strumSound(WALTZ_2, AM, 100, "3/4")),
        audio("6/8: six downstrokes, accents on 1 and 4", strumSound(SIX_EIGHT, AM, 70, "6/8")),
      ] },
      { kind: "learn", blocks: [
        strum(WALTZ_1, AM, "3/4: a downstroke on each beat.", 90, "3/4"),
        strum(WALTZ_2, AM, "3/4: down, down-up, down-up.", 90, "3/4"),
        strum(SIX_EIGHT, AM, "6/8: down on every count, with accents on 1 and 4.", 60, "6/8"),
        diagram("x02210", "A", "minor", "A minor. Strum from string 5."),
      ] },
      { kind: "practice", blocks: [
        choice("How many beats are in a bar of 3/4?", ["Three", "Four", "Six"], 0, "1, 2, 3."),
        choice("How are the six eighth notes of 6/8 grouped?", ["Two groups of three", "Three groups of two", "One group of six"], 0, "1 2 3, 4 5 6: two big beats."),
        choice("In 6/8, which counts are accented?", ["1 and 4", "1, 3 and 5", "2 and 5"], 0, "The start of each group of three."),
        ear("3/4 or 6/8?", strumSound(SIX_EIGHT, AM, 70, "6/8"), ["3/4", "6/8"], 1, "Two strong pulses in the bar, each followed by two lighter strums."),
        strum(WALTZ_2, AM, "Strum along in 3/4.", 90, "3/4"),
        strum(SIX_EIGHT, AM, "Strum along in 6/8.", 60, "6/8"),
      ] },
    ],
  },
  {
    ...base,
    slug: "power-chord-rhythm",
    title: "Power-chord rhythm",
    order: 7,
    concepts: ["power-chord-rhythm"],
    needs: ["strumming-in-three-four-and-six-eight", "sus-and-power-chords"],
    steps: [
      // OWNER REVIEW: all-downstroke eighth notes, and the fingering of the movable shape.
      { kind: "understand", blocks: [text(`A **power chord** has only two different notes: the **root** and the **fifth**, usually with the root repeated an octave higher. It has no third, so it is neither major nor minor. On the page it is written with a 5: **E5, A5, G5**.

Because it is so plain, it stays clear when played loudly or with distortion, and it is the chord of rock rhythm guitar.

Three shapes to know:

- **E5:** string 6 open, strings 5 and 4 at fret 2.
- **A5:** string 5 open, strings 4 and 3 at fret 2.
- **The movable shape:** index finger on the root on string 6, and two frets higher on strings 5 and 4. At fret 3 this is **G5**. Slide it anywhere and the note under the index finger names the chord.

Strum **only the three strings of the chord**.

The typical rhythm is **eight downstrokes in a bar**. This breaks the down-up rule on purpose: all downstrokes sound heavier and more even than down-up, and at rock tempos the hand can manage it. Add palm muting and you have the classic sound.`)] },
      { kind: "listen", blocks: [
        audio("E5, eight downstrokes", strumSound(ALL_DOWN, E5, 100)),
        audio("The same, palm-muted with accents", strumSound(PALM_ACCENTS, E5, 100)),
        audio("G5, eight downstrokes", strumSound(ALL_DOWN, G5, 100)),
      ] },
      { kind: "learn", blocks: [
        diagram("022xxx", "E", "5", "E5: the three bass strings only."),
        diagram("x022xx", "A", "5", "A5: strings 5, 4 and 3."),
        diagram("355xxx", "G", "5", "G5: the movable shape at fret 3."),
        strumBars(ALL_DOWN, [["E5", E5], ["E5", E5], ["G5", G5], ["A5", A5]], "A four-bar riff: E5, E5, G5, A5. All downstrokes.", 90),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes are in a power chord?", ["Root and fifth", "Root, third and fifth", "Root and third"], 0, "No third, so neither major nor minor."),
        choice("How is a power chord on A written?", ["A5", "Am", "A7"], 0, "The 5 stands for root and fifth."),
        choice("You slide the movable shape so the index finger is at fret 5 of string 6. Which chord is it?", ["A5", "G5", "C5"], 0, "String 6, fret 5 is A."),
        choice("Why use all downstrokes?", ["They sound heavier and more even", "Upstrokes are not allowed", "They are easier at any tempo"], 0, "It is a choice of sound."),
        strumBars(ALL_DOWN, [["E5", E5], ["E5", E5], ["G5", G5], ["A5", A5]], "Play the riff at 80.", 80),
        strumBars(PALM_ACCENTS, [["E5", E5], ["E5", E5], ["G5", G5], ["A5", A5]], "Now palm-muted with open accents.", 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "barre-chord-rhythm",
    title: "Barre-chord rhythm",
    order: 8,
    concepts: ["barre-rhythm"],
    needs: ["power-chord-rhythm", "barre-chords"],
    steps: [
      // OWNER REVIEW: releasing the barre to mute.
      { kind: "understand", blocks: [text(`A barre chord is one shape you can slide to any fret. That makes a whole progression a matter of **moving one hand shape**, with no new fingering to find.

Take the major barre shape with its root on string 6. At fret 1 it is **F**. At fret 3 it is **G**. At fret 5 it is **A**. The note under the index finger on string 6 names the chord, exactly as with power chords.

Barre chords also give the fretting hand full control of the sound, because every string is held by a finger:

- **Squeeze** and the chord rings.
- **Relax**, keeping the fingers on the strings, and it stops at once.

So you can make a chord as long or as short as you like without changing the strumming at all. Squeezing and letting go on each strum gives short, clipped chords, called **staccato**. Letting go only on certain strums gives you the muted click from two lessons ago, on any chord, anywhere on the neck.

Moving between barre chords, keep the fingers lightly on the strings as you slide. Release the pressure, slide, squeeze. The shape should arrive already formed.`)] },
      { kind: "listen", blocks: [
        audio("F, G, A, G: one shape moved along the neck", { kind: "progression", chords: [F_BARRE, G_BARRE, A_BARRE, G_BARRE].map((ch) => ch.split(" ")), bpm: 80 }),
        audio("G, ringing", strumSound(MAIN, G_BARRE, 80)),
        audio("G, staccato: squeezed and released on every strum", strumSound(STACCATO, G_BARRE, 80)),
      ] },
      { kind: "learn", blocks: [
        diagram("133211", "F", "major", "The shape at fret 1: F."),
        diagram("355433", "G", "major", "The same shape at fret 3: G."),
        diagram("577655", "A", "major", "And at fret 5: A."),
        strumBars(MAIN, [["F", F_BARRE], ["G", G_BARRE], ["A", A_BARRE], ["G", G_BARRE]], "One shape through four bars: F, G, A, G.", 70),
        strum(STACCATO, G_BARRE, "Staccato on G. Squeeze as you strum, then relax at once.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("The major barre shape with its root on string 6 is at fret 3. Which chord is it?", ["G", "F", "A"], 0, "String 6, fret 3 is G."),
        choice("And at fret 5?", ["A", "G", "B"], 0, "String 6, fret 5 is A."),
        choice("How does the fretting hand stop a barre chord ringing?", ["It relaxes without leaving the strings", "It lifts off completely", "It presses harder"], 0, "Fingers that touch without pressing damp every string."),
        ear("Ringing or staccato?", strumSound(STACCATO, G_BARRE, 80), ["Ringing", "Staccato"], 1, "Each chord is cut off straight away."),
        strumBars(MAIN, [["F", F_BARRE], ["G", G_BARRE], ["A", A_BARRE], ["G", G_BARRE]], "Play along at 70.", 70),
        strumBars(STACCATO, [["F", F_BARRE], ["G", G_BARRE], ["A", A_BARRE], ["G", G_BARRE]], "The same chords, staccato.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "shuffle-strumming",
    title: "Shuffle and swing feel",
    order: 9,
    concepts: ["shuffle-strumming"],
    needs: ["barre-chord-rhythm", "swing-and-shuffle"],
    steps: [
      { kind: "understand", blocks: [text(`Every pattern so far has used **straight** eighth notes: the "and" falls exactly halfway between two beats. In a **shuffle**, or swing feel, it does not. The "and" arrives late, so each beat is split **long–short**.

The exact proportion comes from triplets. Divide the beat into three; the downstroke takes the first two parts and the upstroke takes the last one. Say "**doo**-ba, **doo**-ba" and you have the feel.

Nothing changes on paper. The same patterns, the same arrows, the same down on the beat and up on the "and". Only the timing of the upstroke moves.

In your hand, that means the swing is no longer even. The hand drops on the beat, **waits**, then flicks up late and comes straight back down. Down, pause, up-down, pause, up-down.

The shuffle is the feel of the blues, and of a great deal of rock and roll, country and jazz. If a twelve-bar blues sounds stiff when you strum it, this is usually what is missing.

Try it first with all eight strums, then with the pattern down, down-up, down, down-up.`)] },
      { kind: "listen", blocks: [
        audio("Straight eighth notes", strumSound(EIGHTHS, AM, 90)),
        audio("The same strums, shuffled", strumSound(EIGHTHS, AM, 90, "swing")),
        audio("Down, down-up, down, down-up, shuffled", strumSound(SHUFFLE_2, AM, 90, "swing")),
      ] },
      { kind: "learn", blocks: [
        strum(EIGHTHS, AM, "Every swing hits, with a shuffle feel. The upstrokes come late.", 80, "swing"),
        strum(SHUFFLE_2, AM, "Down, down-up, down, down-up, shuffled.", 80, "swing"),
      ] },
      { kind: "practice", blocks: [
        choice("In a shuffle, how is each beat divided?", ["Long, then short", "Into two equal halves", "Short, then long"], 0, "The and arrives late."),
        choice("What changes on the page between straight and shuffled strumming?", ["Nothing: only the timing of the upstroke", "Every arrow turns round", "The chords"], 0, "It is a feel, played from the same pattern."),
        ear("Straight or shuffled?", strumSound(EIGHTHS, AM, 90, "swing"), ["Straight", "Shuffled"], 1, "Long–short, long–short."),
        ear("And this?", strumSound(EIGHTHS, AM, 90), ["Straight", "Shuffled"], 0, "The strums are evenly spaced."),
        strum(EIGHTHS, AM, "Strum along with the shuffle at 80.", 80, "swing"),
        strum(SHUFFLE_2, AM, "And this pattern.", 80, "swing"),
      ] },
    ],
  },
  {
    ...base,
    slug: "off-beat-strumming",
    title: "Off-beat strumming",
    order: 10,
    concepts: ["off-beat-strumming"],
    needs: ["shuffle-strumming"],
    steps: [
      // OWNER REVIEW: stroke directions for the two styles, and that the hand keeps swinging silently.
      { kind: "understand", blocks: [text(`Most strumming puts its weight on the beat. Some styles do the opposite: the guitar plays **only in the gaps** and leaves the beats to the bass and drums. This is **off-beat** strumming.

Two versions to know:

**On every "and".** The guitar plays a short chord on the "and" of each beat and nothing on the beats themselves. This is the bright, bouncing rhythm of ska. Since the "and" is where the upstroke falls, every strum is an **upstroke**.

**On beats 2 and 4.** The guitar plays a short chord on 2 and on 4 and leaves 1 and 3 empty. This is the laid-back chop of reggae.

In both, the chords are **short**. Strum, then relax the fretting hand at once to cut the chord off. Barre chords make that easy, and so do open chords with a finger laid across to damp them.

The hard part is the silence. With nothing to play on beat 1, the hand wants to stop, and then it loses the beat. Keep the swing going over the strings on every eighth note, as always, and let it connect only where the pattern says.

Tap your foot on the beat. Your strum should land exactly between taps.`)] },
      { kind: "listen", blocks: [
        audio("On every and", strumSound(SKA, AM, 100)),
        audio("On beats 2 and 4", strumSound(REGGAE, AM, 80)),
      ] },
      { kind: "learn", blocks: [
        strum(SKA, AM, "Short upstrokes on every and. Nothing on the beats.", 80),
        strum(REGGAE, AM, "Short chords on beats 2 and 4 only.", 80),
      ] },
      { kind: "practice", blocks: [
        choice("In off-beat strumming, where does the guitar play?", ["In the gaps between the main beats", "On beat 1 only", "On every swing"], 0, "The beats are left to the bass and drums."),
        choice("A strum on the and of a beat is which stroke?", ["An upstroke", "A downstroke", "Either"], 0, "Down on the beat, up on the and."),
        choice("How long should the chords be?", ["Short", "As long as possible", "A whole bar"], 0, "Strum, then relax the fretting hand to cut it off."),
        ear("Where are the strums?", strumSound(SKA, AM, 100), ["On every and", "On beats 2 and 4"], 0, "One between every pair of clicks."),
        strum(SKA, AM, "Strum along at 80. Tap your foot on the click.", 80),
        strum(REGGAE, AM, "Beats 2 and 4, at 80.", 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "strumming-song-form-study",
    title: "Study piece: a verse and a chorus",
    order: 11,
    minutes: 9,
    concepts: ["strumming-study"],
    needs: ["off-beat-strumming"],
    steps: [
      { kind: "understand", blocks: [text(`A real rhythm part changes with the song. This piece has two sections with two different patterns, and your job is to make the second one lift.

**Verse**, eight bars: **Em – C – G – D**, twice.
Pattern: down, chuck-up, up-chuck-up. Eighth notes with a muted strum on beats 2 and 4. Keep it light and aim at the thinner strings.

**Chorus**, eight bars: **G – D – Em – C**, twice.
Pattern: down, down-up, up-down-up from the Basic stage, now in sixteenth notes, so it fits twice in each bar. Accent the start of each half: beats 1 and 3. Strum all the strings.

The form is **verse, chorus, verse, chorus**.

What makes the chorus bigger:

- twice as many strums in the bar,
- accents,
- more strings,
- and starting on G, the home chord, after a verse that started on E minor.

None of that needs you to strum harder.

The hardest moment is the join. The last bar of the verse is in eighth notes and the first bar of the chorus is in sixteenths. The tempo does not change; only the hand doubles its speed. Practise the last bar of the verse into the first bar of the chorus on its own.`)] },
      { kind: "listen", blocks: [
        audio("The verse pattern on E minor", strumSound(CHUCK_2, EM, 80)),
        audio("The chorus pattern on G", strumSound(CHORUS_16, G, 80, "16ths")),
      ] },
      { kind: "learn", blocks: [
        strumBars(CHUCK_2, VERSE, "The verse: Em, C, G, D, twice.", 70),
        strumBars(CHORUS_16, CHORUS, "The chorus: G, D, Em, C, twice.", 70, "16ths"),
      ] },
      { kind: "practice", blocks: [
        choice("What is the form of the piece?", ["Verse, chorus, verse, chorus", "Chorus only", "Twelve-bar blues"], 0, "Two sections, each played twice."),
        choice("Which pattern uses sixteenth notes?", ["The chorus", "The verse", "Both"], 0, "The verse stays in eighth notes."),
        choice("At the join from verse to chorus, what changes?", ["The hand doubles its speed; the tempo stays", "The tempo doubles", "The key changes"], 0, "Same beat, twice as many swings."),
        strumBars(CHUCK_2, VERSE, "Play the verse at 70.", 70),
        strumBars(CHORUS_16, CHORUS, "Play the chorus at 70.", 70, "16ths"),
      ] },
    ],
  },
];
