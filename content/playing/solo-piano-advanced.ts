// Playing track P3, Advanced stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands and about interpretation (balance of three layers, rubato,
// how stride and walking bass sit under a melody) is standard teaching written from memory, not checked
// against a pianist. The tune is "Ode to Joy" (Beethoven, public domain); every harmonisation, the
// reharmonisation and the complete arrangement are original and unreviewed. The app plays in strict time
// and without pedal. These lessons also still need their demo videos.
import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, ear, hands, handsSound, rhythm, text } from "../helpers";

const base = { moduleSlug: "solo-piano-advanced", track: "piano-solo", stage: "advanced", strand: "piano", isFree: false, version: 1, minutes: 8 } as const;

// "Ode to Joy", all sixteen bars (A A' B A'), an octave above middle C.
const A1 = "E5/q E5/q F5/q G5/q | G5/q F5/q E5/q D5/q | C5/q C5/q D5/q E5/q | E5/q. D5/8 D5/h";
const A2 = "E5/q E5/q F5/q G5/q | G5/q F5/q E5/q D5/q | C5/q C5/q D5/q E5/q | D5/q. C5/8 C5/h";
const B = "D5/q D5/q E5/q C5/q | D5/q E5/8 F5/8 E5/q C5/q | D5/q E5/8 F5/8 E5/q D5/q | C5/q D5/q G4/h";

// Three layers: bass on beat 1, melody on top, inner chord tones under the melody on beats 1 and 3.
const LAYERED_RIGHT = "E5+G4+C5/q E5/q F5+A4+C5/q G5/q | G5+B4+D5/q F5/q E5+G4+B4/q D5/q | C5+E4+G4/q C5/q D5+F4+A4/q E5/q | E5+G4+B4/q. D5/8 D5+F4+B4/h";
const LAYERED_LEFT = "C3/h F2/h | G2/h E2/h | C3/h D3/h | E2/h G2/h";
// Reharmonisation of bars 1–4: plain C G C G against Am7 Dm7 Fmaj7 G7.
const PLAIN_LEFT = "C3+G3/w | G2+D3/w | C3+G3/w | G2+D3/w";
const REHARM_LEFT = "A2+G3/w | D3+C4/w | F2+E3/w | G2+F3/w";
const REHARM_END = rhythm("C3+E3+G3+C5/w", 72);
// Textures for the B section.
const B_SPARSE = "G2/w | G2/w | G2/w | C3/q G2/h.";
const B_MOVING = "G2/q D3/q G3/q D3/q | G2/q D3/q G3/q D3/q | G2/q D3/q G3/q D3/q | C3/q G2/h.";
// Rubato: the same bar in time, and with the last note held longer.
const STRICT = rhythm("C5/q C5/q D5/q E5/q | D5/q. C5/8 C5/h", 80);
const HELD = rhythm("C5/q C5/q D5/q E5/q | D5/h C5/q C5/w", 80);
// Stride and walking bass under bars 1–4.
const STRIDE = "C3/q G3+C4+E4/q G2/q G3+C4+E4/q | G2/q B3+D4+F4/q D3/q B3+D4+F4/q | C3/q G3+C4+E4/q G2/q G3+C4+E4/q | G2/q B3+D4+F4/q D3/q B3+D4+F4/q";
const WALKING = "C3/q D3/q E3/q F#3/q | G3/q F3/q D3/q C#3/q | C3/q E3/q G3/q F#3/q | G3/q F3/q D3/q B2/q";

// The complete arrangement: A sparse, A' with arpeggios, B with a stepping bass, A' full with inner voices.
const arp = (root: string, fifth: string, octave: string) => `${root}/8 ${fifth}/8 ${octave}/8 ${fifth}/8`;
const tenths = (root: string, fifth: string, tenth: string) => `${root}/8 ${fifth}/8 ${tenth}/8 ${fifth}/8`;
const FULL_RIGHT = [
  A1, A2, B,
  "E5+G4+C5/q E5/q F5/q G5/q | G5+B4+D5/q F5/q E5/q D5/q | C5+F4+A4/q C5/q D5+G4+B4/q E5/q | D5+B4+F4/q. C5/8 C5+E4+G4/h",
].join(" | ");
const FULL_LEFT = [
  "C3/w | G2/w | C3/w | G2/w",
  [`${arp("C3", "G3", "C4")} ${arp("C3", "G3", "C4")}`, `${arp("G2", "D3", "G3")} ${arp("G2", "D3", "G3")}`, `${arp("C3", "G3", "C4")} ${arp("C3", "G3", "C4")}`, `${arp("G2", "D3", "G3")} ${arp("C3", "G3", "C4")}`].join(" | "),
  B_MOVING,
  [`${tenths("C3", "G3", "E4")} ${tenths("C3", "G3", "E4")}`, `${tenths("G2", "D3", "B3")} ${tenths("G2", "D3", "B3")}`, `${tenths("F2", "C3", "A3")} ${tenths("G2", "D3", "B3")}`, "G2/h C3/h"].join(" | "),
].join(" | ");

export const soloPianoAdvanced: LessonInput[] = [
  {
    ...base,
    slug: "three-layer-arrangement",
    title: "Bass, harmony and melody at once",
    order: 1,
    concepts: ["three-layer-arrangement"],
    needs: ["ballad-arrangement-study", "contrary-motion"],
    steps: [
      { kind: "understand", blocks: [text(`A full solo-piano arrangement has three layers, and each has a job:

1. **Bass**: the lowest notes, saying which chord it is. Left hand.
2. **Harmony**: the inner notes that fill out the chord. Shared between the hands.
3. **Melody**: the top line, always the clearest. Right hand.

So far, the bass mostly sat on the root. In a fuller arrangement, the **bass moves too**. In this lesson it changes every two beats, and it often moves **against** the melody. In bar 1 the tune climbs E, F, G while the bass falls from C down to F. That **contrary motion** from Level 5 makes the outer voices sound independent, the hallmark of good arranging.

The harmony now changes on beats 1 and 3, with a chord tone or two under each of those melody notes:

| Bar | Beat 1 | Beat 3 |
|---|---|---|
| 1 | C | F |
| 2 | G | Em |
| 3 | C | Dm |
| 4 | Em | G7 |

More chords is not automatically better. The aim is a bass line worth listening to and harmony that leans with the tune.

**Balance**, from loudest to softest: melody, bass, inner notes.`)] },
      { kind: "listen", blocks: [
        audio("Melody and a single bass note per bar", handsSound(A1, "C3/w | G2/w | C3/w | G2/w", 84)),
        audio("Three layers: a moving bass and inner chord tones", handsSound(LAYERED_RIGHT, LAYERED_LEFT, 84)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: LAYERED_RIGHT, left: LAYERED_LEFT }, "The bass moves every two beats; inner notes sit under the melody on beats 1 and 3.", 56),
      ] },
      { kind: "practice", blocks: [
        choice("Which layer should be the loudest?", ["The melody", "The bass", "The inner notes"], 0, "Then the bass, then the inner notes."),
        choice("What is contrary motion?", ["Two voices moving in opposite directions", "Two voices moving together", "A voice standing still"], 0, "The tune climbs while the bass falls."),
        choice("In bar 2, beat 3, the chord is Em. Which notes are in it?", ["E, G, B", "E, G♯, B", "E, A, C"], 0, "The iii chord of C major."),
        choice("Is adding more chords always better?", ["No: the aim is good lines, not more chords", "Yes, always", "Only in the bass"], 0, "Choose chords that lean with the melody."),
        ear("Single bass notes, or a moving bass?", handsSound(LAYERED_RIGHT, LAYERED_LEFT, 84), ["Single bass notes", "Moving bass"], 1, "The bass changes every two beats."),
        hands({ right: LAYERED_RIGHT, left: LAYERED_LEFT }, "Play along at 56.", 56),
      ] },
    ],
  },
  {
    ...base,
    slug: "reharmonising-at-the-piano",
    title: "Reharmonising a melody",
    order: 2,
    concepts: ["reharmonisation"],
    needs: ["three-layer-arrangement", "reharmonising-a-melody"],
    steps: [
      { kind: "understand", blocks: [text(`**Reharmonising** means keeping the melody exactly as it is and putting new chords under it. It is how arrangers make a familiar tune sound fresh.

The method from Level 6: for each melody note (or group of notes), find **other chords that contain it**.

"Ode to Joy", bars 1–4, is plainly harmonised as C, G, C, G. A reharmonisation:

| Bar | Melody | Plain | New | Why it fits |
|---|---|---|---|---|
| 1 | E E F G | C | **Am7** | E and G are in Am7 (A C E G) |
| 2 | G F E D | G | **Dm7** | F and D are in Dm7 (D F A C) |
| 3 | C C D E | C | **Fmaj7** | C and E are in Fmaj7 (F A C E) |
| 4 | E D D | G | **G7** | D is its 5th; E is its 13th |

Then the tune resolves to **C**.

The new chords move vi–ii–IV–V–I, a strong progression in its own right, and each one is a **seventh chord**, so the sound is warmer and more grown-up than the triads.

Not every melody note has to be a chord tone. **F over Am7** is a passing note, and it is fine because it is short and between two chord tones. What matters most are the notes on **strong beats** and the **long notes**.

The left hand plays root and 7th for each chord, so you hear the new harmony clearly.`)] },
      { kind: "listen", blocks: [
        audio("Plain: C, G, C, G", handsSound(A1, PLAIN_LEFT, 80)),
        audio("Reharmonised: Am7, Dm7, Fmaj7, G7", handsSound(A1, REHARM_LEFT, 80)),
        audio("…and home to C", REHARM_END),
      ] },
      { kind: "learn", blocks: [
        hands({ right: A1, left: REHARM_LEFT }, "The same melody over vi–ii–IV–V. The left hand plays root and 7th.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What stays the same when you reharmonise?", ["The melody", "The chords", "The bass line"], 0, "New chords, same tune."),
        choice("Why does Am7 fit under E, E, F, G?", ["E and G are in Am7", "A is in the melody", "Am7 fits everything"], 0, "The strong notes are chord tones; F passes."),
        choice("Which notes make Fmaj7?", ["F, A, C, E", "F, A, C, E♭", "F, A♭, C, E♭"], 0, "Major triad plus the major 7th."),
        choice("Which melody notes matter most when choosing a chord?", ["Notes on strong beats and long notes", "The shortest notes", "The last note only"], 0, "Short passing notes can clash briefly."),
        ear("Plain or reharmonised?", handsSound(A1, REHARM_LEFT, 80), ["Plain triads", "Reharmonised sevenths"], 1, "Am7 under the first bar: warmer, darker."),
        hands({ right: A1, left: REHARM_LEFT }, "Play along at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "changing-texture-across-sections",
    title: "Changing texture across sections",
    order: 3,
    concepts: ["texture"],
    needs: ["reharmonising-at-the-piano", "song-forms"],
    steps: [
      { kind: "understand", blocks: [text(`**Texture** is how many notes are sounding and how they are arranged: one line, a melody with chords, a busy rolling accompaniment. Changing it is the simplest way to give a piece a shape.

"Ode to Joy" has four sections: **A, A′, B, A′** (bars 1–4, 5–8, 9–12, 13–16). The B section is the contrast: the melody stays mostly on D and E and climbs with little F's.

Ways to set it apart:

- **Sparse:** just a held bass note. The melody floats; the music holds its breath.
- **Moving:** a stepping bass in quarter notes (G, D, G, D). Energy builds towards the return of the tune.

A common shape for a whole arrangement is to **build up**: start sparse, add movement, and save the fullest texture for the last A, so the familiar tune comes back stronger than it began.

Equally effective is the opposite: a big opening, then the B section suddenly thin and quiet. What matters is that each section **sounds different from its neighbours**. Decide what each section should feel like, and choose the texture that says it.

The B section ends on low G under the melody's G: the dominant, the strongest set-up there is for the return of A.`)] },
      { kind: "listen", blocks: [
        audio("B section, sparse", handsSound(B, B_SPARSE, 84)),
        audio("B section, moving", handsSound(B, B_MOVING, 84)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: B, left: B_MOVING }, "The B section with a stepping bass. Compare it with the held version.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What is texture?", ["How many notes sound and how they are arranged", "How loud the piano is", "The key of the piece"], 0, "One line, chords, rolling patterns…"),
        choice("What form is \"Ode to Joy\"?", ["A A′ B A′", "Verse and chorus", "Twelve-bar blues"], 0, "Four four-bar sections."),
        choice("What is the most important rule for texture across sections?", ["Each section should sound different from its neighbours", "Always keep the same texture", "Always end quietly"], 0, "Contrast gives the piece a shape."),
        choice("The B section ends on G under the melody. Why is that a strong set-up?", ["G is the dominant, which leads back to C", "G is the tonic", "It is the lowest note"], 0, "V before the return of I."),
        ear("Sparse or moving?", handsSound(B, B_MOVING, 84), ["Sparse", "Moving"], 1, "A new bass note on every beat."),
        hands({ right: B, left: B_SPARSE }, "Now the sparse version, along at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "rubato-and-expressive-timing",
    title: "Rubato and expressive timing",
    order: 4,
    concepts: ["rubato"],
    needs: ["changing-texture-across-sections", "dynamics"],
    steps: [
      { kind: "understand", blocks: [text(`Solo piano has a freedom no band has: **nobody else needs the beat**. You can stretch time, and in expressive music you should.

**Rubato** ("stolen time") means bending the tempo for expression: lingering on an important note, pushing forward through a phrase, then easing back. The beat stretches but does not break.

Where it helps:

- **The end of a phrase.** Slow down slightly into the last note (a **ritardando**) and the phrase sounds finished.
- **A high or important note.** Hold it a fraction longer than written. The listener feels its weight.
- **The final chord.** Let it ring as long as it wants: a **fermata**.

Where it does not:

- **Everywhere.** Constant stretching sounds unsteady, not expressive.
- **In groove music.** Stride, walking bass and anything meant for dancing want a steady pulse.

A useful idea: **what you take, give back.** If you linger on one note, move a little faster through the next few, so the phrase as a whole keeps its sense of time.

The app plays in strict time, so the examples below can only fake it: the second one simply writes the important notes longer. On your piano, let the timing come from the phrase, not from counting.`)] },
      { kind: "listen", blocks: [
        audio("Bars 7–8 strictly in time", STRICT),
        audio("The same with the last notes held: a written-out ritardando", HELD),
      ] },
      { kind: "learn", blocks: [
        hands({ right: "C5/q C5/q D5/q E5/q | D5/q. C5/8 C5/h", left: "C3/w | G2/h C3/h" }, "Play it in time first. Then linger on the D and let the final C ring.", 56),
      ] },
      { kind: "practice", blocks: [
        choice("What does rubato mean?", ["Stretching the tempo for expression", "Playing as fast as possible", "Playing without the left hand"], 0, "\"Stolen time\"."),
        choice("Where does rubato usually help?", ["At the end of a phrase", "In every single beat", "In a dance groove"], 0, "A slight slowing into the last note."),
        choice("What does \"what you take, give back\" mean?", ["Linger on one note, move on a little faster after", "Repeat every phrase", "Play louder after a soft note"], 0, "The phrase keeps its overall time."),
        choice("Which style wants a steady pulse, not rubato?", ["Stride", "A slow ballad ending", "A final chord"], 0, "Groove music keeps time."),
        ear("Strict time, or with the ending stretched?", HELD, ["Strict", "Stretched"], 1, "The last notes are held longer."),
        hands({ right: "C5/q C5/q D5/q E5/q | D5/q. C5/8 C5/h", left: "C3/w | G2/h C3/h" }, "Play it with your own timing; the click is only a reference.", 56),
      ] },
    ],
  },
  {
    ...base,
    slug: "stride-and-walking-bass-solo-styles",
    title: "Stride and walking-bass solo styles",
    order: 5,
    concepts: ["solo-piano-styles"],
    needs: ["rubato-and-expressive-timing", "walking-bass-left-hand", "stride-basics"],
    steps: [
      { kind: "understand", blocks: [text(`The left-hand styles from the accompaniment track become solo-piano styles once a melody sits on top. The tune stays the same; the style comes from the left hand.

**Stride under the melody.** Bass on beats 1 and 3, chord on 2 and 4:

\`\`\`
C:   C3   G C E   G2   G C E
G7:  G2   B D F   D3   B D F
\`\`\`

The tune instantly sounds like 1920s piano. Keep the chords **under** the melody: around middle C, with the tune an octave above, so each hand has its own space.

**Walking bass under the melody.** One note per beat, root on beat 1, approach note on beat 4:

\`\`\`
C:  C  D  E  F♯ → G
G:  G  F  D  C♯ → C
C:  C  E  G  F♯ → G
G:  G  F  D  B  → C
\`\`\`

With only a bass line and a melody, the sound is light and conversational. Your ear fills in the harmony from just two voices.

Both styles want **steady time**: this is where rubato stops. And both need the left hand to be automatic, because your attention has to be on the tune.

Try them in turn on the same four bars, and notice how much of a piece's character lives in the left hand.`)] },
      { kind: "listen", blocks: [
        audio("Stride under the melody", handsSound(A1, STRIDE, 96)),
        audio("Walking bass under the melody", handsSound(A1, WALKING, 96)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: A1, left: STRIDE }, "Stride: bass on 1 and 3, chords on 2 and 4.", 72),
        hands({ right: A1, left: WALKING }, "Walking: root on 1, approach note on 4.", 72),
      ] },
      { kind: "practice", blocks: [
        choice("In stride, what plays on beats 2 and 4?", ["Chords", "Single bass notes", "The melody"], 0, "Bass, chord, bass, chord."),
        choice("In the walking line, F♯ leads to…", ["G, a half step up", "F", "C"], 0, "An approach note on beat 4."),
        choice("Where does rubato fit in these styles?", ["Hardly at all: they want steady time", "Everywhere", "Only in the left hand"], 0, "Groove styles keep the pulse."),
        choice("What changes the style here?", ["The left hand", "The melody", "The key"], 0, "Same tune, different character."),
        ear("Stride or walking bass?", handsSound(A1, WALKING, 96), ["Stride", "Walking bass"], 1, "One bass note per beat, no chords."),
        hands({ right: A1, left: STRIDE }, "Play the stride version along at 72.", 72),
      ] },
    ],
  },
  {
    ...base,
    slug: "complete-solo-arrangement-study",
    title: "Study: a complete solo arrangement",
    order: 6,
    minutes: 10,
    concepts: ["solo-arrangement-study"],
    needs: ["stride-and-walking-bass-solo-styles"],
    steps: [
      { kind: "understand", blocks: [text(`The final study is all sixteen bars of "Ode to Joy", arranged for solo piano. Each section has its own texture, and the arrangement **builds** towards the end.

| Bars | Section | Left hand | Right hand |
|---|---|---|---|
| 1–4 | A | one bass note per bar | the melody alone |
| 5–8 | A′ | root–fifth–octave arpeggios | the melody |
| 9–12 | B | stepping quarter notes | the melody |
| 13–16 | A′ | tenths | melody with chord tones beneath |

The last four bars bring back what you learned about harmony:

- **Bar 15** splits into **F** and **G**, with A and B under the melody.
- **Bar 16** is **G7 to C**: the F inside G7 falls to E as the final C arrives.

How to learn it:

1. Learn each section's left hand on its own.
2. Then each section with both hands.
3. Then the **joins**: the last bar of one section into the first bar of the next. That is where arrangements fall apart.
4. Finally, play it as music: pedal with the harmony, slight rubato at the very end, and a final chord that rings.

When you can play this, you can arrange any simple tune the same way: pick a texture for each section, and build.`)] },
      { kind: "listen", blocks: [
        audio("The complete arrangement", handsSound(FULL_RIGHT, FULL_LEFT, 88)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: FULL_RIGHT, left: FULL_LEFT }, "Sixteen bars: sparse, arpeggios, stepping bass, tenths with inner voices.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("How does this arrangement change across the sections?", ["It builds up towards the end", "It gets quieter and thinner", "It stays the same"], 0, "Sparse first, fullest last."),
        choice("Which section is the contrast?", ["B, bars 9–12", "The first A", "The last A′"], 0, "A A′ B A′."),
        choice("What happens inside the last chord change?", ["The F of G7 falls to E", "The melody jumps an octave", "The bass stops"], 0, "The 7th of the dominant resolves."),
        choice("Where do arrangements most often fall apart?", ["At the joins between sections", "In the first bar", "On long notes"], 0, "Practise each join on its own."),
        ear("Is this the A section or the B section?", handsSound(B, B_MOVING, 88), ["A", "B"], 1, "The melody stays around D and E."),
        hands({ right: FULL_RIGHT, left: FULL_LEFT }, "Play the whole arrangement along at 60.", 60),
      ] },
    ],
  },
];
