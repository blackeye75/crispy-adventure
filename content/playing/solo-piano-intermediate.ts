// Playing track P3, Intermediate stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (voicing a melody over inner notes, balance, pedalling) is
// standard teaching written from memory, not checked against a pianist. The tune is "Ode to Joy" (Beethoven,
// public domain); the harmonisations and the ballad arrangement are original and unreviewed. The app cannot
// press the sustain pedal, so pedalled examples sound dry. These lessons also still need their demo videos.
import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, ear, hands, handsSound, rhythm, text } from "../helpers";

const base = { moduleSlug: "solo-piano-intermediate", track: "piano-solo", stage: "intermediate", strand: "piano", isFree: false, version: 1, minutes: 7 } as const;

// "Ode to Joy", an octave higher than in the Basic stage, so the left hand has room. Bars 1–8.
const ODE_A = "E5/q E5/q F5/q G5/q | G5/q F5/q E5/q D5/q | C5/q C5/q D5/q E5/q | E5/q. D5/8 D5/h";
const ODE_A2 = "E5/q E5/q F5/q G5/q | G5/q F5/q E5/q D5/q | C5/q C5/q D5/q E5/q | D5/q. C5/8 C5/h";
const BASS_A = "C3/w | G2/w | C3/w | G2/w";
// Melody with one chord tone beneath it in the same hand, on the strong beats.
const TWO_VOICE = "E5+C5/q E5/q F5/q G5/q | G5+D5/q F5/q E5/q D5/q | C5+G4/q C5/q D5/q E5/q | E5/q. D5/8 D5+B4/h";
// Left-hand arpeggios: root, fifth, octave, fifth.
const arp = (root: string, fifth: string, octave: string) => `${root}/8 ${fifth}/8 ${octave}/8 ${fifth}/8 `.repeat(2).trim();
const ARP = { C: arp("C3", "G3", "C4"), G: arp("G2", "D3", "G3") };
const ARP_A = [ARP.C, ARP.G, ARP.C, ARP.G].join(" | ");
// Inner voices: a full triad under each strong melody note, and a G7 whose F falls to E in the last bar.
const INNER = "E5+C5+G4/q E5/q F5/q G5/q | G5+D5+B4/q F5/q E5/q D5/q | C5+G4+E4/q C5/q D5/q E5/q | E5/q. D5/8 D5+B4+F4/h | C5+G4+E4/w";
const INNER_BASS = `${BASS_A} | C3/w`;
// Pedalled tenths, eight bars; bar 8 changes chord halfway (G, then C).
const tenths = (root: string, fifth: string, tenth: string) => `${root}/8 ${fifth}/8 ${tenth}/8 ${fifth}/8`;
const T = { C: tenths("C3", "G3", "E4"), G: tenths("G2", "D3", "B3"), Am: tenths("A2", "E3", "C4"), F: tenths("F2", "C3", "A3") };
const PEDAL_LEFT = [`${T.C} ${T.C}`, `${T.G} ${T.G}`, `${T.C} ${T.C}`, `${T.G} ${T.G}`, `${T.C} ${T.C}`, `${T.G} ${T.G}`, `${T.C} ${T.C}`, `${T.G} ${T.C}`].join(" | ");
const ODE_8 = `${ODE_A} | ${ODE_A2}`;
// The ballad study: C G Am G | C G F–G G–C, melody with inner notes on the strong beats.
const BALLAD_RIGHT = "E5+C5/q E5/q F5/q G5/q | G5+D5/q F5/q E5/q D5/q | C5+A4/q C5/q D5/q E5/q | E5/q. D5/8 D5+B4/h | E5+G4+C5/q E5/q F5/q G5/q | G5+B4+D5/q F5/q E5/q D5/q | C5+A4/q C5/q D5+B4/q E5/q | D5+B4+F4/q. C5/8 C5+G4+E4/h";
const BALLAD_LEFT = [`${T.C} ${T.C}`, `${T.G} ${T.G}`, `${T.Am} ${T.Am}`, `${T.G} ${T.G}`, `${T.C} ${T.C}`, `${T.G} ${T.G}`, `${T.F} ${T.G}`, `${T.G} ${T.C}`].join(" | ");

export const soloPianoIntermediate: LessonInput[] = [
  {
    ...base,
    slug: "melody-over-chord-tones-in-one-hand",
    title: "Melody on top, chord tones beneath",
    order: 1,
    concepts: ["voicing-the-melody"],
    needs: ["left-hand-chords-under-a-melody", "smooth-chord-changes"],
    steps: [
      // OWNER REVIEW: balance inside one hand (weight towards the little finger).
      { kind: "understand", blocks: [text(`So far the right hand has played only the tune. Now it takes on a second job: **adding harmony underneath the melody**, in the same hand.

The idea: on the strong beats, play the melody note together with **a note of the chord below it**.

For "Ode to Joy" (moved up an octave, so the left hand has room):

| Bar | Chord | Melody on beat 1 | Added below |
|---|---|---|---|
| 1 | C | E | C |
| 2 | G | G | D |
| 3 | C | C | G |
| 4 | G | D (beat 3) | B |

The added note must come **from the chord of that bar**. Then it supports the melody instead of fighting it.

The hard part is **balance**. The melody is on top, under the little finger and the fourth finger, the weakest fingers. Yet it has to be the loudest note. Lean the weight of the hand towards the outside, and let the thumb side play lightly.

Test yourself: play a bar and ask someone (or a recording) whether the tune is still the first thing they hear. If the added notes stick out, the arrangement has turned upside down.

The left hand stays on single bass notes for now.`)] },
      { kind: "listen", blocks: [
        audio("Melody alone over the bass", handsSound(ODE_A, BASS_A, 90)),
        audio("With chord tones beneath on the strong beats", handsSound(TWO_VOICE, BASS_A, 90)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: TWO_VOICE, left: BASS_A, leftFingers: "5 5 5 5" }, "Two notes in the right hand on the strong beats. Keep the top note singing.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("Where does the added note come from?", ["The chord of that bar", "Any white key", "The next bar's chord"], 0, "Then it supports the melody."),
        choice("Over G, which note can go under a melody G?", ["D", "C", "F♯"], 0, "D is in the G chord."),
        choice("Which note should be loudest in the right hand?", ["The melody on top", "The added note", "Both equally"], 0, "Weight towards the little finger."),
        choice("Why move the tune up an octave here?", ["To give the left hand room", "Because the tune changed", "To make it quieter"], 0, "The hands no longer crowd each other."),
        ear("Melody alone, or with notes beneath?", handsSound(TWO_VOICE, BASS_A, 90), ["Melody alone", "With chord tones beneath"], 1, "Two notes sound together on the strong beats."),
        hands({ right: TWO_VOICE, left: BASS_A }, "Play along at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "left-hand-arpeggios-under-a-melody",
    title: "Left-hand arpeggios under a melody",
    order: 2,
    concepts: ["arpeggiated-accompaniment"],
    needs: ["melody-over-chord-tones-in-one-hand", "left-hand-patterns-at-the-piano"],
    steps: [
      { kind: "understand", blocks: [text(`Single bass notes leave a lot of silence under a melody. Fill it by **breaking the chord** in the left hand: root, fifth, octave, fifth, in steady eighth notes.

| Chord | Left hand |
|---|---|
| C | C3, G3, C4, G3 |
| G | G2, D3, G3, D3 |

Two rhythms are now running at once: quarter notes in the tune, eighth notes in the bass. The eighth notes keep the music moving even when the melody holds a long note, as in bar 4.

How to put the hands together:

1. **Left hand alone** until it runs without thought. Say the chord names.
2. **Line up beat 1.** Both hands play together on every beat; the left hand adds a note between.
3. **Slowly.** At half speed you can hear whether every left-hand note is even.

Keep the left hand **softer than the right**, and play the first note of each group very slightly heavier, so the beat stays clear.`)] },
      { kind: "listen", blocks: [
        audio("Single bass notes", handsSound(ODE_A, BASS_A, 90)),
        audio("Arpeggios in the left hand", handsSound(ODE_A, ARP_A, 90)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: ODE_A, left: ARP_A }, "Root, fifth, octave, fifth under each bar.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes does the left hand break for G?", ["G, D, G", "G, B, D", "G, A, B"], 0, "Root, fifth and octave."),
        choice("Why do the eighth notes help in bar 4?", ["They keep the music moving under the held note", "They play the tune", "They change the key"], 0, "The bass fills the gap."),
        choice("Which hand should be softer?", ["The left", "The right", "Neither"], 0, "The melody must lead."),
        ear("Single bass notes, or arpeggios?", handsSound(ODE_A, ARP_A, 90), ["Single bass notes", "Arpeggios"], 1, "Eighth notes moving under the tune."),
        choice("What is the first step in putting the hands together?", ["Each hand alone until it is automatic", "Both hands at full speed", "Right hand only, forever"], 0, "Independence first."),
        hands({ right: ODE_A, left: ARP_A }, "Play along at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "adding-inner-voices",
    title: "Adding inner voices",
    order: 3,
    concepts: ["inner-voices"],
    needs: ["left-hand-arpeggios-under-a-melody", "seventh-chords-of-the-major-key"],
    steps: [
      { kind: "understand", blocks: [text(`An arrangement has three layers: the **melody** on top, the **bass** at the bottom, and **inner voices** in between. The inner voices fill out the harmony, and when they move, they add a quiet second line of their own.

Under each strong melody note, the right hand now plays **two** chord tones, making a full triad:

| Bar | Chord | Right hand, top down |
|---|---|---|
| 1 | C | E, C, G |
| 2 | G | G, D, B |
| 3 | C | C, G, E |
| 4 | G7 | D, B, **F** |
| 5 | C | C, G, **E** |

Look at bar 4. Instead of plain G, it is **G7**, with an **F** inside. In bar 5 that F falls a half step to **E**. You learned in Level 4 that the 7th of a dominant chord wants to fall like this. Here you hear it as a little inner line, F to E, right under the melody's final C.

That is what inner voices are for: not just filling space, but making small, smooth movements that pull the harmony forward.

The balance rule gets harder with three notes in one hand: **top note loudest, inner notes soft.**`)] },
      { kind: "listen", blocks: [
        audio("Melody with full triads beneath, and the G7 resolving", handsSound(INNER, INNER_BASS, 84)),
        audio("Just the inner line in bars 4 and 5: F falls to E", rhythm("F4/h. r/q | E4/w", 84)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: INNER, left: INNER_BASS }, "Triads under the strong beats. Listen for F falling to E inside the last two chords.", 56),
      ] },
      { kind: "practice", blocks: [
        choice("What are inner voices?", ["The notes between melody and bass", "The melody played twice", "The lowest notes"], 0, "The middle layer of an arrangement."),
        choice("Which notes make G7?", ["G, B, D, F", "G, B, D, F♯", "G, C, E"], 0, "The dominant seventh of C major."),
        choice("Where does the F of G7 move here?", ["Down a half step to E", "Up to G", "It stays"], 0, "The 7th of a dominant falls."),
        choice("With three notes in the right hand, which is loudest?", ["The top note, the melody", "The middle note", "The lowest note"], 0, "Inner voices stay soft."),
        ear("Does the inner voice move from F to E?", rhythm("F4/h. r/q | E4/w", 84), ["Yes, down a half step", "No, it goes up"], 0, "The tension of G7 resolves."),
        hands({ right: INNER, left: INNER_BASS }, "Play along at 56.", 56),
      ] },
    ],
  },
  {
    ...base,
    slug: "pedal-to-connect-harmony",
    title: "Using the pedal to connect the harmony",
    order: 4,
    concepts: ["harmonic-pedalling"],
    needs: ["adding-inner-voices", "ballad-arpeggios-with-pedal"],
    steps: [
      // OWNER REVIEW: pedal timing, half-bar changes.
      { kind: "understand", blocks: [text(`A left hand that spreads a chord over a tenth can only sound connected with the **sustain pedal**. In solo piano, the pedal is what turns separate notes into one sound.

The rule from the accompaniment track still holds: **change the pedal when the harmony changes**. Play the new bass note, then lift and press again straight away.

What is new in solo piano is that the melody is on top. Two things to listen for:

1. **Melody notes that are not in the chord** get caught in the pedal too. A passing note held under the pedal blurs. If a passing note sounds muddy, change the pedal more often, or lighten it.
2. **Chords that change in the middle of a bar.** In bar 8, the harmony moves from G to C on beat 3. So the pedal changes on beat 3 as well. **Follow the harmony, not the bar lines.**

The left hand here is the tenths pattern: root, fifth, tenth, fifth.

| Chord | Left hand |
|---|---|
| C | C3, G3, E4, G3 |
| G | G2, D3, B3, D3 |

The app cannot pedal, so what you hear below is dry. On a real piano, the notes of each bar should blend into one ringing chord.`)] },
      { kind: "listen", blocks: [
        audio("Eight bars with the tenths pattern", handsSound(ODE_8, PEDAL_LEFT, 84)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: ODE_8, left: PEDAL_LEFT }, "Change the pedal with every chord: once a bar, and on beat 3 of bar 8.", 56),
      ] },
      { kind: "practice", blocks: [
        choice("When do you change the pedal in solo piano?", ["When the harmony changes", "At every bar line, whatever happens", "Only at the end"], 0, "Follow the harmony, not the bar lines."),
        choice("In bar 8 the harmony changes on beat 3. What does the pedal do?", ["Changes on beat 3 too", "Waits for the next bar", "Stays down"], 0, "Two chords, two pedals."),
        choice("A passing note blurs under the pedal. What can help?", ["Changing the pedal more often or lightening it", "Playing louder", "Removing the melody"], 0, "Less sustain, less blur."),
        choice("Which notes are in the tenths pattern for G?", ["G, D, B", "G, B, D, F", "G, A, B"], 0, "Root, fifth, tenth."),
        ear("Tenths, or single bass notes?", handsSound(ODE_8, PEDAL_LEFT, 84), ["Tenths", "Single bass notes"], 0, "The left hand rolls through each chord."),
        hands({ right: ODE_8, left: PEDAL_LEFT }, "Play along at 56, pedalling with the harmony.", 56),
      ] },
    ],
  },
  {
    ...base,
    slug: "ballad-arrangement-study",
    title: "Study: a ballad arrangement",
    order: 5,
    minutes: 8,
    concepts: ["ballad-arrangement"],
    needs: ["pedal-to-connect-harmony"],
    steps: [
      { kind: "understand", blocks: [text(`The study piece is the first eight bars of "Ode to Joy" as a ballad, with a few new chords to give it colour.

\`\`\`
| C  | G  | Am | G     |
| C  | G  | F G | G  C  |
\`\`\`

What is different from the plain version:

- **Bar 3 is A minor, not C.** The melody (C, C, D, E) fits both, since C and E are in A minor too. The minor chord gives the phrase a moment of shadow.
- **Bar 7 splits: F, then G.** The melody's C sits in F; its D sits in G.
- **Bar 8 is G7 to C.** The F inside G7 falls to E as the C arrives: the inner-voice move from the last lesson.

Everything else is what you have practised: melody on top, chord tones beneath on the strong beats, the tenths pattern in the left hand, and the pedal changing with each chord, twice in bars 7 and 8.

Play it slowly, and let it breathe. A ballad is not a race; most of its beauty is in the balance between the hands.`)] },
      { kind: "listen", blocks: [
        audio("The ballad arrangement", handsSound(BALLAD_RIGHT, BALLAD_LEFT, 76)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: BALLAD_RIGHT, left: BALLAD_LEFT }, "Eight bars. Pedal changes with every chord: twice in bars 7 and 8.", 52),
      ] },
      { kind: "practice", blocks: [
        choice("Why can bar 3 use A minor instead of C?", ["The melody notes C and E are in both chords", "A minor is always better", "The melody changed"], 0, "Shared notes make a substitute possible."),
        choice("Which notes make A minor?", ["A, C, E", "A, C♯, E", "A, D, F"], 0, "Root, minor 3rd, 5th."),
        choice("In bar 7, which chord holds the melody's D?", ["G", "F", "C"], 0, "D is in G, not in F."),
        choice("How many pedal changes are in bar 8?", ["Two", "One", "None"], 0, "G7, then C."),
        ear("Does bar 3 sound major or minor?", handsSound("C5+A4/q C5/q D5/q E5/q", "A2/8 E3/8 C4/8 E3/8 A2/8 E3/8 C4/8 E3/8", 76), ["Major", "Minor"], 1, "A minor: the moment of shadow."),
        hands({ right: BALLAD_RIGHT, left: BALLAD_LEFT }, "Play the ballad along at 52.", 52),
      ] },
    ],
  },
];
