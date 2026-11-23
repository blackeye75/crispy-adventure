// Playing track G2, Advanced stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (economy and sweep picking motions, tapping, hybrid picking,
// playing behind or ahead of the beat, practising for speed) is standard teaching written from memory, not
// checked against a player. Scales follow the formulas in src/core/theory; every lick and the study solo are
// original and have not been played by anyone. The app plays straight and cannot show picking direction or
// tapped notes, so those are described in the text. These lessons also still need their demo videos.
import type { LessonInput } from "@/core/schemas/content";
import { audio, backing, choice, ear, position, rhythm, scale, shape, show, tab, tabSound, text } from "../helpers";

const base = { moduleSlug: "lead-advanced", track: "guitar-lead", stage: "advanced", strand: "guitar", isFree: false, version: 1, minutes: 8 } as const;

const AM7 = "A2 E3 G3 C4";
const D = "D3 A3 D4 F#4";
const D7 = "D3 A3 C4 F#4";
const GMAJ7 = "G2 D3 F#3 B3";
const E7 = "E2 B2 D3 G#3 B3 E4"; // 020100
const AM = "A2 E3 A3 C4 E4";
const CM7 = "C3 G3 Bb3 Eb4";
const F7 = "F2 C3 Eb3 A3";
const BBMAJ7 = "Bb2 F3 A3 D4";
const E7_LOW = "E2 B2 D3 G#3";

const DORIAN_LICK = "3:5/8 3:7/8 2:5/8 2:7/8 2:8/q 2:7/q | 2:5/8 3:7/8 3:5/8 4:7/8 4:7/h";
const AEOLIAN_LICK = "3:5/8 3:7/8 2:5/8 2:6/8 2:8/q 2:6/q | 2:5/8 3:7/8 3:5/8 4:7/8 4:7/h";
const CHANGES = "4:7/8 3:5/8 2:5/8 2:8/8 1:5/q 2:8/q | 2:7/8 3:7/8 3:5/8 4:7/8 4:4/h | 4:5/8 3:4/8 3:7/8 2:7/8 2:8/h | r/w";
const PHRYGIAN_DOM = "2:6/8 2:5/8 3:7/8 3:5/8 3:4/8 4:7/8 4:6/q | 4:7/w";
const SUPER_PLAIN = "4:7/8 3:5/8 2:5/8 2:8/8 2:5/8 3:5/8 4:7/q";
const SUPER_CMAJ7 = "3:5/8 2:5/8 2:8/8 1:7/8 2:8/8 2:5/8 3:5/q";
const ALTERED = "1:6/8 1:4/8 1:3/8 1:1/8 2:1/8 3:3/8 3:1/q | 3:2/w";
const DIMINISHED = "3:1/8 3:3/8 2:0/8 2:2/8 2:3/8 1:0/8 1:1/8 1:3/8 | 2:1/w";
const MIXO_E = "3:1/8 2:0/8 2:2/8 2:3/8 1:0/8 1:2/8 1:4/q | 2:1/w";
const ECONOMY = "3:5/8 3:7/8 2:5/8 2:6/8 2:8/8 1:5/8 1:7/8 1:8/8";
const SWEEP = "3:5/8t 2:5/8t 1:5/8t 1:8/8t 1:5/8t 2:5/8t 3:5/h";
const TAPPING = "1:12/8t 1:5/8t^p 1:8/8t^h 1:12/8t 1:5/8t^p 1:8/8t^h 1:12/8t 1:5/8t^p 1:8/8t^h 1:12/8t 1:5/8t^p 1:8/8t^h";
const SKIPPING = "4:7/8 2:5/8 3:5/8 1:5/8 4:7/8 2:5/8 3:5/8 1:5/8";
const OUTSIDE = "1:8/8 1:5/8 2:8/8 2:5/8 3:7/8 3:5/8 4:7/8 4:5/8 | 1:9/8 1:6/8 2:9/8 2:6/8 3:8/8 3:6/8 4:8/8 4:6/8 | 1:8/8 1:5/8 2:8/8 2:5/8 3:7/8 3:5/8 4:7/q";
const ON_BEAT = rhythm("A3/q C4/q D4/q E4/q | G4/q E4/q A4/h", 84);
const BEHIND = rhythm("r/16 A3/8. r/16 C4/8. r/16 D4/8. r/16 E4/8. | r/16 G4/8. r/16 E4/8. r/16 A4/q.~ A4/16", 84);
// The study: a ii–V–I in G, then the same in B♭, then E7 back to the top.
const STUDY_CHORDS: [string, string][] = [["Am7", AM7], ["D7", D7], ["Gmaj7", GMAJ7], ["Gmaj7", GMAJ7], ["Cm7", CM7], ["F7", F7], ["Bbmaj7", BBMAJ7], ["E7", E7_LOW]];
const STUDY = [
  "4:7/8 3:5/8 2:5/8 2:8/8 1:5/q 2:8/q", "2:7/8 3:7/8 3:5/8 4:7/8 4:4/h", "4:5/8 3:4/8 3:7/8 2:7/8 2:8/h", "2:7/8 2:5/8 3:7/8 3:4/8 4:5/h",
  "3:5/8 2:4/8 2:8/8 1:6/8 1:8/q 1:6/q", "2:6/8 1:5/8 1:8/8 1:11/8 1:8/h", "1:6/8 1:5/8 2:6/8 3:7/8 3:3/h", "3:1/8 2:0/8 3:7/8 2:5/8 2:6/q 1:4/q",
].join(" | ");

export const leadAdvanced: LessonInput[] = [
  {
    ...base,
    slug: "modal-soloing-on-guitar",
    title: "Modal soloing: the characteristic note",
    order: 1,
    concepts: ["modal-soloing"],
    needs: ["melodic-solo-study-piece", "characteristic-notes", "modes-in-shapes-you-know"],
    steps: [
      { kind: "understand", blocks: [text(`A **modal vamp** is a groove on one or two chords that lasts a long time. Over it, the minor pentatonic works, but it sounds the same whatever the mode. To make the mode audible, use its **characteristic note**.

Over **Am7 to D**, the mode is **A Dorian**: A, B, C, D, E, **F♯**, G. It is A natural minor with one change: **F♯ instead of F**. That raised 6th is the Dorian sound, and notice that it is also the 3rd of the D chord, so the vamp itself is built on it.

In fifth position, F♯ sits at **fret 7 on the B string** and **fret 4 on the D string**.

The lick in this lesson climbs C, D, E, **F♯**, lands on **G**, and falls back through **F♯**. Play the same lick with **F** (fret 6) instead and it becomes A Aeolian: darker, sadder. One fret changes the mood.

How to use a characteristic note:

- **Lean on it**: strong beats, long notes, bends into it.
- **Resolve it**: F♯ to G, or F♯ to E.
- **Do not overdo it.** Once or twice per phrase is enough for the ear to know where it is.`)] },
      { kind: "listen", blocks: [
        audio("A Dorian: the lick with F♯", tabSound(DORIAN_LICK, 84)),
        audio("A Aeolian: the same lick with F", tabSound(AEOLIAN_LICK, 84)),
      ] },
      { kind: "learn", blocks: [
        show(position("A", "dorian", 4, 8), "A Dorian in fifth position. F♯ is the characteristic note.", "guitar"),
        tab(DORIAN_LICK, "F♯ (B string, fret 7) leads to G and back.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("What is the characteristic note of A Dorian?", ["F♯, the raised 6th", "C, the minor 3rd", "G, the 7th"], 0, "It is what separates Dorian from natural minor."),
        choice("Why does A Dorian fit Am7 to D?", ["F♯ is the 3rd of D", "D is the root of the mode", "It fits any chord"], 0, "The vamp is built on the characteristic note."),
        choice("Where is F♯ on the B string in fifth position?", ["Fret 7", "Fret 6", "Fret 5"], 0, "B, C, C♯, D, D♯, E, F, F♯: seven frets up."),
        ear("Dorian (F♯) or Aeolian (F)?", tabSound(DORIAN_LICK, 84), ["Dorian", "Aeolian"], 0, "Brighter: the raised 6th."),
        ear("Dorian (F♯) or Aeolian (F)?", tabSound(AEOLIAN_LICK, 84), ["Dorian", "Aeolian"], 1, "Darker: F natural."),
        backing("Solo in A Dorian over Am7 and D. Lean on F♯.", [["Am7", AM7], ["Am7", AM7], ["D", D], ["D", D]], 84, position("A", "dorian", 4, 8)),
      ] },
    ],
  },
  {
    ...base,
    slug: "playing-the-changes-on-guitar",
    title: "Playing the changes",
    order: 2,
    concepts: ["guitar-playing-the-changes"],
    needs: ["modal-soloing-on-guitar", "chord-scale-thinking", "arpeggios-in-solos"],
    steps: [
      { kind: "understand", blocks: [text(`Over a modal vamp, one scale works for minutes. Over moving chords, a solo that ignores the changes sounds lost. **Playing the changes** means following each chord with its own notes.

Over a ii–V–I in G, all in fifth position:

| Chord | Arpeggio | Where the line starts |
|---|---|---|
| Am7 | A C E G | A (D string, fret 7) |
| D7 | D F♯ A C | F♯ (B string, fret 7), the 3rd |
| Gmaj7 | G B D F♯ | G (D string, fret 5) |

The line in this lesson:

- **Am7:** up the arpeggio, A, C, E, G, to A, and back to G.
- **D7:** from **F♯** down through D, C, A to **F♯** an octave lower.
- **Gmaj7:** up its arpeggio, G, B, D, F♯, to **G**.

Notice how bar 2 ends on F♯ and bar 3 begins on G: a half step, the 3rd of D7 resolving to the root of G. Those half-step connections between chords are what make a line sound as if it knows where it is going.

Practise slowly: **arpeggio of each chord alone**, then join them, always starting each bar on a chord tone.`)] },
      { kind: "listen", blocks: [
        audio("A line through Am7, D7, Gmaj7", tabSound(CHANGES, 92)),
      ] },
      { kind: "learn", blocks: [
        tab(CHANGES, "Each bar outlines its own chord. Bar 2 ends on F♯; bar 3 starts on G.", 72),
      ] },
      { kind: "practice", blocks: [
        choice("What does playing the changes mean?", ["Following each chord with its own notes", "Changing guitars", "Playing one scale throughout"], 0, "The line moves with the harmony."),
        choice("Which notes make D7?", ["D, F♯, A, C", "D, F, A, C", "D, F♯, A, C♯"], 0, "Major triad plus ♭7."),
        choice("Bar 2 ends on F♯ and bar 3 starts on G. Why does that work?", ["The 3rd of D7 resolves up a half step to G", "They are the same note", "G is outside the key"], 0, "Half-step connections."),
        choice("Where should each bar start?", ["On a chord tone", "On a random note", "On a rest"], 0, "It names the chord."),
        ear("Does this line follow changing chords?", tabSound(CHANGES, 92), ["Yes", "No, one chord"], 0, "Each bar outlines a new chord."),
        backing("Play the changes: Am7, D7, Gmaj7.", [["Am7", AM7], ["D7", D7], ["Gmaj7", GMAJ7], ["Gmaj7", GMAJ7]], 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "harmonic-minor-and-phrygian-dominant",
    title: "Harmonic minor and Phrygian dominant lines",
    order: 3,
    concepts: ["phrygian-dominant-lines"],
    needs: ["playing-the-changes-on-guitar", "harmonic-minor", "phrygian-dominant"],
    steps: [
      { kind: "understand", blocks: [text(`In a minor key, the V chord is usually made **major** (E7 in A minor) so that it pulls strongly home. Its notes come from **A harmonic minor**: A, B, C, D, E, F, **G♯**.

Start that scale on E and you get **E Phrygian dominant**: E, **F**, **G♯**, A, B, C, D. It is the sound of flamenco and of countless metal and Middle-Eastern-flavoured solos, because of two features:

- **F**, a half step above the root: dark and exotic.
- **G♯ to F**, an augmented second (three frets): the gap that gives the scale its unmistakable flavour.

Over E7, play E Phrygian dominant; when the chord moves to Am, land on an A minor chord tone. The strongest resolution is **G♯ up to A**: the leading tone going home.

The line in this lesson runs down from F: **F, E, D, C, B, A, G♯**, and resolves on **A** as the chord changes. Every note of A harmonic minor is used, and the line ends exactly where the harmony does.

Fingering: in fifth position, G♯ is on the D string at fret 6, and F is on the B string at fret 6.`)] },
      { kind: "listen", blocks: [
        audio("E7 to Am", rhythm(`${E7.split(" ").join("+")}/w | ${AM.split(" ").join("+")}/w`, 84)),
        audio("The line: F down to G♯, resolving to A", tabSound(PHRYGIAN_DOM, 84)),
      ] },
      { kind: "learn", blocks: [
        show(scale("E", "phrygian-dominant", "degrees"), "E Phrygian dominant: ♭2 and a major 3rd.", "guitar"),
        tab(PHRYGIAN_DOM, "Down E Phrygian dominant over E7; G♯ resolves to A over Am.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("Which scale is E Phrygian dominant the fifth mode of?", ["A harmonic minor", "A natural minor", "E major"], 0, "Start A harmonic minor on its 5th."),
        choice("What gives Phrygian dominant its exotic sound?", ["The ♭2 and the gap from ♭2 to 3", "The major 7th", "No 5th"], 0, "F and G♯: three frets apart."),
        choice("Over E7 to Am, what is the strongest resolution?", ["G♯ up to A", "F up to G", "D down to C"], 0, "The leading tone goes home."),
        ear("Does the line resolve when the chord changes?", tabSound(PHRYGIAN_DOM, 84), ["Yes, to A", "No"], 0, "G♯ moves up to A."),
        choice("Which notes make E7?", ["E, G♯, B, D", "E, G, B, D", "E, G♯, B, D♯"], 0, "In A minor, the V chord is made major."),
        backing("Solo over E7 and Am using E Phrygian dominant, then A minor.", [["E7", E7], ["E7", E7], ["Am", AM], ["Am", AM]], 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "arpeggio-superimposition",
    title: "Arpeggio superimposition",
    order: 4,
    concepts: ["superimposition"],
    needs: ["harmonic-minor-and-phrygian-dominant", "ninths-elevenths-and-thirteenths"],
    steps: [
      { kind: "understand", blocks: [text(`An arpeggio of the chord you are on is safe. An arpeggio of a **different chord**, played over it, can be much more colourful. This is **superimposition**: one chord's notes over another chord.

The classic example: over **Am7**, play a **Cmaj7 arpeggio**: C, E, G, B.

| Note | In Cmaj7 | Over Am7 it is the… |
|---|---|---|
| C | root | ♭3 |
| E | 3rd | 5th |
| G | 5th | ♭7 |
| B | 7th | **9th** |

Over an A bass, those four notes spell **Am9** without the root. You get the 9th, a colour note, automatically, while every note is still safe. Players think "play the chord a minor third up" and the extension appears by itself.

The same trick works elsewhere:

- Over **D7**, play **F♯m7♭5** (F♯ A C E): you get the 3rd, 5th, ♭7 and **9th** of D9.
- Over **Cmaj7**, play **Em7** (E G B D): 3rd, 5th, 7th and **9th** of Cmaj9.

The rule: **build an arpeggio from the 3rd of the chord.** It drops the root and adds the 9th. Compare the plain Am7 arpeggio with the Cmaj7 one below: same shape family, a step more sophisticated.`)] },
      { kind: "listen", blocks: [
        audio("Am7 arpeggio over Am7", tabSound(SUPER_PLAIN, 84)),
        audio("Cmaj7 arpeggio over Am7: the 9th appears", tabSound(SUPER_CMAJ7, 84)),
      ] },
      { kind: "learn", blocks: [
        show(shape("3:5 2:5 2:8 1:7"), "Cmaj7 arpeggio at the 5th fret: C, E, G, B. Over Am7, B is the 9th.", "guitar"),
        tab(SUPER_CMAJ7, "Up the Cmaj7 arpeggio and back down, over an A minor chord.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("Over Am7, what is B?", ["The 9th", "The root", "The ♭7"], 0, "A, B: a whole step up, an octave higher."),
        choice("Which arpeggio gives Am9 colours over Am7?", ["Cmaj7", "Am7", "E7"], 0, "Built from the 3rd of Am7."),
        choice("The rule of thumb for superimposition here is…", ["Build an arpeggio from the chord's 3rd", "Always play the root arpeggio", "Play any arpeggio"], 0, "It adds the 9th and drops the root."),
        choice("Over D7, which arpeggio gives D9 colours?", ["F♯m7♭5", "Dmaj7", "Gm7"], 0, "F♯ A C E: 3, 5, ♭7, 9."),
        ear("Plain Am7 arpeggio, or Cmaj7 over it?", tabSound(SUPER_CMAJ7, 84), ["Plain Am7", "Cmaj7 superimposed"], 1, "The B adds a 9th colour."),
        backing("Play the Cmaj7 arpeggio over Am7, then make your own phrases from it.", [["Am7", AM7], ["Am7", AM7]], 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "altered-and-diminished-on-guitar",
    title: "Altered and diminished sounds over dominants",
    order: 5,
    concepts: ["guitar-altered-lines"],
    needs: ["arpeggio-superimposition", "the-altered-scale", "the-diminished-scales"],
    steps: [
      { kind: "understand", blocks: [text(`A dominant chord is tension waiting to resolve. Two scales add even more tension, so the resolution feels stronger.

**E altered**: E, F, G, G♯, A♯, C, D. It keeps the root, 3rd (G♯) and ♭7 (D) of E7, and replaces the 5th and 9th with **♭9 (F), ♯9 (G), ♯11 (A♯) and ♭13 (C)**. Every tension at once.

**E half-whole diminished**: E, F, G, G♯, A♯, B, C♯, D. Half step, whole step, repeating. It has the ♭9 and ♯9, but keeps the natural 5th (B) and 13th (C♯). On guitar its symmetry is a gift: any shape moved **three frets** up or down is still in the scale.

Compare both with plain **E Mixolydian** (E F♯ G♯ A B C♯ D): inside, smooth, no surprises.

All three lines in this lesson resolve to **Am**. The altered line ends **G♯ to A**; the diminished and Mixolydian lines end on **C**, the 3rd of Am.

The rule is the same as on piano: **tension is only good if it resolves.** Play the outside notes with confidence, then land cleanly on a chord tone on beat 1.`)] },
      { kind: "listen", blocks: [
        audio("E Mixolydian over E7, then Am", tabSound(MIXO_E, 84)),
        audio("E altered, then Am", tabSound(ALTERED, 84)),
        audio("E half-whole diminished, then Am", tabSound(DIMINISHED, 84)),
      ] },
      { kind: "learn", blocks: [
        show(scale("E", "altered", "degrees"), "E altered: 1, ♭9, ♯9, 3, ♯11, ♭13, ♭7.", "guitar"),
        tab(ALTERED, "Down the altered scale; G♯ resolves to A.", 70),
        tab(DIMINISHED, "Up the half-whole diminished scale, landing on C.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes of E7 does the altered scale keep?", ["E, G♯ and D", "E, B and F♯", "All of them"], 0, "Root, 3rd and ♭7."),
        choice("Move a diminished-scale shape three frets. Is it still in the scale?", ["Yes, the scale repeats every three frets", "No", "Only on the top string"], 0, "It is symmetrical."),
        choice("What should an altered line do at the end?", ["Resolve to a chord tone of the next chord", "Stay outside", "Stop on the ♭9"], 0, "Tension, then release."),
        ear("Inside (Mixolydian) or altered?", tabSound(ALTERED, 84), ["Inside", "Altered"], 1, "A♯, G and F: restless."),
        choice("Which tensions does the altered scale contain?", ["♭9, ♯9, ♯11, ♭13", "9, 11, 13", "Only ♭9"], 0, "Every altered tension."),
        backing("Over E7, try altered or diminished lines; land on A, C or E when Am arrives.", [["E7", E7], ["Am", AM]], 72),
      ] },
    ],
  },
  {
    ...base,
    slug: "economy-and-sweep-picking",
    title: "Economy and sweep picking",
    order: 6,
    concepts: ["economy-picking", "sweep-picking"],
    needs: ["altered-and-diminished-on-guitar", "sequences-for-speed"],
    steps: [
      // OWNER REVIEW: pick directions and the sweep motion.
      { kind: "understand", blocks: [text(`Strict alternate picking (down, up, down, up) is the foundation. Two refinements save motion when you cross strings.

**Economy picking.** When you move to a new string, keep going **in the same direction** instead of reversing. Moving down towards the floor (low to high strings): if the last note on a string was a downstroke, the first note on the next string is also a downstroke, in one continuous push.

For the scale run in this lesson (two or three notes per string, going up):

\`\`\`
string 3:  5  7          D U
string 2:  5  6  8       D D U
string 1:  5  7  8       D D U
\`\`\`

The pick never makes a wasted trip over a string.

**Sweep picking.** The same idea taken to its limit: **one note per string**, all in one motion. Down through C (string 3), E (string 2), A (string 1), like a slow, controlled strum where each note sounds separately, then back up. It is how fast arpeggios are played.

The secret of sweeping is the **fretting hand**: each finger must lift just after its note, or the notes ring together like a chord. Slow and clean first; speed comes later.`)] },
      { kind: "listen", blocks: [
        audio("An economy-picked A minor run", tabSound(ECONOMY, 84)),
        audio("A small sweep through A minor", tabSound(SWEEP, 72)),
      ] },
      { kind: "learn", blocks: [
        tab(ECONOMY, "Economy picking: D U, D D U, D D U.", 66),
        tab(SWEEP, "Sweep: one note per string in one motion, down then up.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What is economy picking?", ["Keeping the same pick direction when changing strings", "Picking only downstrokes", "Picking very softly"], 0, "No wasted trips."),
        choice("In a sweep, how many notes per string?", ["One", "Three", "As many as possible"], 0, "Like a slow, separated strum."),
        choice("What stops a sweep from sounding like a chord?", ["Lifting each fretting finger after its note", "Picking harder", "Using the pedal"], 0, "Only one note rings at a time."),
        choice("Which notes does the sweep use?", ["C, E, A", "A, B, C", "E, G, B"], 0, "An A minor triad."),
        ear("Scale run, or arpeggio sweep?", tabSound(SWEEP, 72), ["Scale run", "Arpeggio sweep"], 1, "Triad notes, one per string."),
        tab(SWEEP, "Play the sweep along at 60, cleanly.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "tapping-and-string-skipping",
    title: "Tapping, hybrid picking and string skipping",
    order: 7,
    concepts: ["tapping", "hybrid-picking"],
    needs: ["economy-and-sweep-picking"],
    steps: [
      // OWNER REVIEW: which finger taps, muting the other strings, and pick-plus-fingers technique.
      { kind: "understand", blocks: [text(`**Tapping.** The picking hand frets a note by **hammering a finger onto the string**, then pulls off to a note held by the fretting hand. On the top string:

1. **Tap fret 12** (E) with a finger of the picking hand.
2. **Pull off** to fret 5 (A), held by the index finger.
3. **Hammer on** to fret 8 (C) with the fretting hand.

E, A, C: an A minor arpeggio, three notes per beat, with no picking at all. Repeated, it becomes a cascade. **Mute the other strings** with the fretting hand's spare fingers or the palm, or they will ring.

In the tab, the tapped note is the 12; the pull-off and hammer-on are marked p and h.

**Hybrid picking and string skipping.** Hold the pick as usual and pluck the higher strings with the **middle and ring fingers**. Then wide jumps across strings become easy, because nothing has to travel. The pattern here plays the four notes of A minor on strings 4, 2, 3 and 1: pick on strings 4 and 3, fingers on 2 and 1. The skips give a wide, open sound that a scale run cannot.

These are colours, not the main course. One tapped run in a solo is exciting; ten in a row is a trick.`)] },
      { kind: "listen", blocks: [
        audio("Tapping: 12, pull to 5, hammer to 8, repeated", tabSound(TAPPING, 72)),
        audio("String skipping with hybrid picking", tabSound(SKIPPING, 84)),
      ] },
      { kind: "learn", blocks: [
        tab(TAPPING, "Tap 12 with the picking hand, pull off to 5, hammer to 8.", 56),
        tab(SKIPPING, "Strings 4, 2, 3, 1: pick on 4 and 3, middle and ring fingers on 2 and 1.", 66),
      ] },
      { kind: "practice", blocks: [
        choice("In tapping, which hand frets the highest note?", ["The picking hand", "The fretting hand", "Neither"], 0, "It hammers the string onto the fret."),
        choice("Which notes does the tapping pattern play?", ["E, A, C", "E, G, B", "A, B, C"], 0, "An A minor arpeggio."),
        choice("What must you do with the other strings while tapping?", ["Mute them", "Let them ring", "Retune them"], 0, "Or they sound by sympathy."),
        choice("What is hybrid picking?", ["Pick plus the middle and ring fingers", "Two picks at once", "Picking with the thumb only"], 0, "Pick and fingers together."),
        ear("Tapping, or string skipping?", tabSound(TAPPING, 72), ["Tapping", "String skipping"], 0, "A fast three-note cascade on one string."),
        tab(SKIPPING, "Play the skipping pattern along at 66.", 66),
      ] },
    ],
  },
  {
    ...base,
    slug: "outside-playing-on-guitar",
    title: "Outside playing and resolving back in",
    order: 8,
    concepts: ["guitar-side-slipping"],
    needs: ["tapping-and-string-skipping", "playing-outside"],
    steps: [
      { kind: "understand", blocks: [text(`Guitar has a built-in shortcut for playing outside: **move the whole shape one fret**.

The **side-slip**:

1. **Inside:** a phrase from the A minor pentatonic box at fret 5.
2. **Outside:** the **same fingering one fret higher**, at fret 6. That is B♭ minor pentatonic (B♭ D♭ E♭ F A♭), and almost every note clashes with Am.
3. **Back in:** the box at fret 5 again, ending on **A**.

The listener hears the same shape and understands it as a deliberate move. The return to the home box resolves the tension.

Because the fingering does not change, all your attention can go to the **timing**. Rules:

- **Commit.** Hesitating on the outside notes makes them sound like mistakes.
- **Keep it short** at first: one bar out, then back.
- **Land on a strong note**: the root or a chord tone, on a beat.

You can slip down a fret as well as up, and over any static chord or vamp.`)] },
      { kind: "listen", blocks: [
        audio("In at fret 5, out at fret 6, back in at fret 5", tabSound(OUTSIDE, 92)),
      ] },
      { kind: "learn", blocks: [
        show(position("A", "minor-pentatonic", 5, 8), "The home box: A minor pentatonic at fret 5. The outside box is the same shape at fret 6.", "guitar"),
        tab(OUTSIDE, "Same fingering, one fret up, then home.", 72),
      ] },
      { kind: "practice", blocks: [
        choice("How do you side-slip on guitar?", ["Play the same shape one fret away", "Change strings", "Retune"], 0, "Fingering stays the same."),
        choice("The A minor pentatonic box moved up one fret becomes…", ["B♭ minor pentatonic", "A major pentatonic", "B minor pentatonic"], 0, "Every note a half step higher."),
        choice("Why does a side-slip sound deliberate?", ["The ear recognises the same shape", "It stays in the key", "It is quieter"], 0, "Same idea, new place."),
        choice("Where should an outside phrase end?", ["Back inside, on a strong note", "Outside", "On a rest"], 0, "Resolve the tension."),
        ear("Which bar is outside: 1, 2 or 3?", tabSound(OUTSIDE, 92), ["Bar 1", "Bar 2", "Bar 3"], 1, "It clashes, then comes home."),
        backing("Over a static Am7, play a phrase, slip it up a fret, and come home.", [["Am7", AM7], ["Am7", AM7], ["Am7", AM7], ["Am7", AM7]], 84),
      ] },
    ],
  },
  {
    ...base,
    slug: "time-feel-and-speed-building",
    title: "Time feel, and building speed with a method",
    order: 9,
    concepts: ["time-feel", "speed-building"],
    needs: ["outside-playing-on-guitar"],
    steps: [
      // OWNER REVIEW: practice method for speed (bursts, tempo steps, relaxation).
      { kind: "understand", blocks: [text(`**Time feel.** Two players can play the same notes at the same tempo and sound completely different, because of **where** they place the notes against the beat.

- **On the beat:** exactly with the click. Neutral and precise.
- **Behind the beat** (laid back): a hair late, consistently. Relaxed, heavy, bluesy.
- **Ahead of the beat** (pushing): a hair early. Urgent, exciting.

The difference is tiny, far less than a sixteenth note. The examples below exaggerate it so you can hear the idea. Practise with a click and deliberately place your notes behind it, then ahead of it. Control, not accident, is the goal.

**Building speed.** Speed comes from **relaxation and accuracy**, not effort. A method:

1. **Find your clean tempo**: the fastest speed at which a phrase is perfect and relaxed.
2. **Play bursts**: the first few notes at a higher tempo, then stop. Short bursts teach the hands the motion without tension.
3. **Raise the tempo in small steps**, five beats per minute, only when the phrase is clean three times in a row. The tempo trainer in the practice room does this for you.
4. **Watch for tension**: shoulders, jaw, a death grip on the pick. If it appears, slow down.
5. **Stop before you are tired.** Ten focused minutes beat an hour of sloppy repetition.`)] },
      { kind: "listen", blocks: [
        audio("On the beat", ON_BEAT),
        audio("Behind the beat (exaggerated)", BEHIND),
      ] },
      { kind: "learn", blocks: [
        tab("5:0/q 3:5/q 3:7/q 2:5/q | 2:8/q 2:5/q 1:5/h", "Play this on the click, then deliberately behind it, then ahead of it.", 72),
      ] },
      { kind: "practice", blocks: [
        choice("What does playing behind the beat sound like?", ["Relaxed and laid back", "Rushed", "Out of tune"], 0, "Consistently a hair late."),
        choice("How big is the difference in real time feel?", ["Tiny, much less than a sixteenth note", "A whole beat", "A bar"], 0, "Felt more than heard."),
        choice("Where does speed come from?", ["Relaxation and accuracy", "Pressing harder", "Practising only at top speed"], 0, "Tension is the enemy of speed."),
        choice("When should you raise the tempo?", ["When the phrase is clean three times in a row", "Every minute", "When you are tired"], 0, "Small steps, earned."),
        ear("On the beat, or behind it?", BEHIND, ["On the beat", "Behind the beat"], 1, "Every note arrives a little late."),
        choice("You notice your shoulders tensing. What do you do?", ["Slow down", "Speed up", "Ignore it"], 0, "Tension means the tempo is too high."),
      ] },
    ],
  },
  {
    ...base,
    slug: "solo-over-changing-keys-study",
    title: "Study: a solo over changing keys",
    order: 10,
    minutes: 9,
    concepts: ["key-change-solo-study"],
    needs: ["time-feel-and-speed-building", "direct-modulation"],
    steps: [
      { kind: "understand", blocks: [text(`The study is an eight-bar solo that **changes key** halfway through.

\`\`\`
| Am7 | D7 | Gmaj7  | Gmaj7 |     ii–V–I in G
| Cm7 | F7 | B♭maj7 | E7    |     ii–V–I in B♭, then E7 back to Am7
\`\`\`

The second half is the same progression a **minor third higher**. Scales that worked in bars 1–4 are wrong in bars 5–7: you must hear the move and **change with it**.

Bar by bar:

- **1–3:** the line from the "playing the changes" lesson: Am7 arpeggio, D7 down to F♯, Gmaj7 up to G.
- **4:** back down Gmaj7: F♯, E, D, B, G.
- **5, Cm7:** C, E♭, G, B♭: its arpeggio. **E♭ and B♭** are the notes that say "new key".
- **6, F7:** F, A, C, E♭: its arpeggio, peaking on E♭.
- **7, B♭maj7:** down from B♭ to the low B♭.
- **8, E7:** G♯, B, D, E, then **F** (the ♭9) and G♯, pulling back to A for the top.

How to learn it: arpeggios of all eight chords first, slowly, in this position. Then the solo, two bars at a time. Then improvise your own, marking the key change with a clear arrival on **E♭** or **B♭** in bar 5.`)] },
      { kind: "listen", blocks: [
        audio("The whole solo", tabSound(STUDY, 96)),
      ] },
      { kind: "learn", blocks: [
        tab(STUDY, "Eight bars: ii–V–I in G, then in B♭, and E7 back to the top.", 72),
        backing("The backing alone: improvise your own solo, and mark the key change in bar 5.", STUDY_CHORDS, 84),
      ] },
      { kind: "practice", blocks: [
        choice("How far does the progression move in bar 5?", ["Up a minor third, from G to B♭", "Up a fifth", "It does not move"], 0, "G, A♭, A, B♭."),
        choice("Which notes signal the new key in bar 5?", ["E♭ and B♭", "E and B", "F♯ and C♯"], 0, "They are not in G major."),
        choice("Which notes make Cm7?", ["C, E♭, G, B♭", "C, E, G, B♭", "C, E♭, G♭, B♭"], 0, "Minor triad plus ♭7."),
        choice("In bar 8, F over E7 is the…", ["♭9", "root", "5th"], 0, "An altered tension pulling to A minor."),
        ear("Does the key change in the middle?", tabSound(STUDY, 96), ["Yes", "No"], 0, "Bars 5–7 move up a minor third."),
        backing("Play the study, or your own solo, over the full backing.", STUDY_CHORDS, 84),
      ] },
    ],
  },
];

