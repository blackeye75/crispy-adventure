// Playing track G1, Advanced stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (ghost strums, muting, how to pick an arpeggiated part, the
// thumb-and-fingers bossa pattern, how to feel 3 over 4) is standard teaching written from memory, not checked
// against a player. Each such passage is marked "OWNER REVIEW". Chord shapes are checked by the content tests;
// the parts and the study piece are original. The app plays muted strums as short chords and plays jazz
// comping straight. These lessons also still need their demo videos.
import type { LessonInput, Sound } from "@/core/schemas/content";
import { audio, choice, diagram, ear, picking, rhythm, shape, show, strum, strumBars, strumSound, tab, tabSound, text } from "../helpers";

const base = { moduleSlug: "strumming-advanced", track: "guitar-strumming", stage: "advanced", strand: "guitar", isFree: false, version: 1, minutes: 8 } as const;

const E9 = "E3 G#3 D4 F#4 B4"; // x76777
const E9_TOP = "D4 F#4 B4"; // strings 3–1 of the same shape
const A = "A2 E3 A3 C#4 E4"; // x02220
const ASUS4 = "A2 E3 A3 D4 E4"; // x02230
const ASUS2 = "A2 E3 A3 B3 E4"; // x02200

const FUNK_PLAIN = "D U D U D U D U D U D U D U D U";
const FUNK = "D> x x U x U D x x U D x D> U x U";
const FUNK_B = "D> x D U x U x U D> x D U x U x U";
const EMBELLISH = "4:0+3:2+2:3/q 1:0/8 1:2/8^h 1:3/8^h 1:2/8^p 1:0/8^p 4:0+3:2+2:3+1:2/8";
const WALK_UP = "6:3+5:2+4:0+3:0+2:0+1:3/h 6:3/q 5:0/8 5:2/8 | 5:3+4:2+3:0+2:1+1:0/w";
const SIXTHS_FILL = "5:0+4:2+3:2+2:2+1:0/q 5:0+4:2+3:2+2:2+1:0/q 3:6+1:5/8 3:7+1:7/8 3:9+1:9/q";
const ARP_PART = "5:3/8 4:2/8 3:0/8 2:1/8 1:0/8 2:1/8 3:0/8 4:2/8 | 5:0/8 4:2/8 3:2/8 2:1/8 1:0/8 2:1/8 3:2/8 4:2/8 | 4:3/8 3:2/8 2:1/8 1:1/8 2:1/8 3:2/8 4:3/8 3:2/8 | 6:3/8 5:2/8 4:0/8 3:0/8 2:0/8 1:3/8 2:0/8 3:0/8";
// ii–V–I in C: three-note shells, then drop-2 voicings.
const SHELLS_TAB = "5:5+3:5+2:6/q 5:5+3:5+2:6/q 5:5+3:5+2:6/q 5:5+3:5+2:6/q | 6:3+4:3+3:4/q 6:3+4:3+3:4/q 6:3+4:3+3:4/q 6:3+4:3+3:4/q | 5:3+3:4+2:5/q 5:3+3:4+2:5/q 5:3+3:4+2:5/q 5:3+3:4+2:5/q";
const DROP2_TAB = "r/q 5:5+4:7+3:5+2:6/q r/q 5:5+4:7+3:5+2:6/q | r/q 4:5+3:7+2:6+1:7/q r/q 4:5+3:7+2:6+1:7/q | r/q 5:3+4:5+3:4+2:5/q r/q 5:3+4:5+3:4+2:5/q";
// Bossa nova: thumb on the bass (root on 1, fifth on 3), fingers on the chord, anticipating beats 3 and 1.
const BOSSA = "5:5+4:7+3:5+2:6/q. 4:7+3:5+2:6/8 6:5/q. 4:7+3:5+2:6/8 | 6:3+4:3+3:4+2:3/q. 4:3+3:4+2:3/8 5:5/q. 4:3+3:4+2:3/8 | 5:3+4:5+3:4+2:5/q. 4:5+3:4+2:5/8 6:3/q. 4:5+3:4+2:5/8 | 5:3+4:5+3:4+2:5/q. 4:5+3:4+2:5/8 6:3/q. 4:5+3:4+2:5/8";
const BOSSA_FINGERS = "pima ima p ima pima ima p ima pima ima p ima pima ima p ima";
// Odd meters on Em: bass on the start of each group.
const TOP = "3:0+2:0+1:0";
const FIVE = `6:0/q ${TOP}/q ${TOP}/q 5:2/q ${TOP}/q | 6:0/q ${TOP}/q ${TOP}/q 5:2/q ${TOP}/q`;
const SEVEN = `6:0/8 ${TOP}/8 5:2/8 ${TOP}/8 6:0/8 ${TOP}/8 ${TOP}/8 | 6:0/8 ${TOP}/8 5:2/8 ${TOP}/8 6:0/8 ${TOP}/8 ${TOP}/8`;
/** Three against two: a bass note on every beat, a chord every three eighth notes, over three bars of 4/4. */
const THREE_OVER_FOUR = rhythm(Array.from({ length: 24 }, (_, i) => {
  const notes = [...(i % 2 === 0 ? ["E2"] : []), ...(i % 3 === 0 ? ["G4", "B4", "E5"] : [])];
  return `${notes.length ? notes.join("+") : "r"}/8${i % 8 === 7 && i < 23 ? " |" : ""}`;
}).join(" "), 80);
// Study: A section funk on E9; B section arpeggiated A, Asus4, G, D.
const STUDY_B = "5:0/8 4:2/8 3:2/8 2:2/8 1:0/8 2:2/8 3:2/8 2:3/8 | 6:3/8 5:2/8 4:0/8 3:0/8 2:0/8 1:3/8 2:0/8 3:0/8 | 4:0/8 3:2/8 2:3/8 1:2/8 2:3/8 3:2/8 1:3/8 1:2/8 | 4:0/8 3:2/8 2:3/8 1:0/8 1:2/8^h 1:2/q.";

const tabBlock = (notes: string, caption: string, bpm: number, beatsPerBar: number, pulse = 1) => ({ type: "tab" as const, notes, caption, bpm, beatsPerBar, pulse });
const tabIn = (notes: string, bpm: number, beatsPerBar: number, click = 1): Sound => tabSound(notes, bpm, beatsPerBar, undefined, click);

export const strummingAdvanced: LessonInput[] = [
  {
    ...base,
    slug: "funk-sixteenth-strumming",
    title: "Funk sixteenths, ghost strums and fragments",
    order: 1,
    concepts: ["funk-strumming"],
    needs: ["strumming-song-form-study", "syncopation"],
    steps: [
      // OWNER REVIEW: how ghost strums are made (fretting hand relaxing), and the size of the strumming motion.
      { kind: "understand", blocks: [text(`Funk guitar is a drum part played on strings. Three ideas make it work.

**1. The hand never stops.** It swings down and up on every sixteenth note, sixteen times a bar, like the sixteenths in the Intermediate stage. That constant motion is the engine of the groove.

**2. Most of the swings are ghost strums.** The fretting hand **relaxes its pressure** without letting go of the strings, so the strum makes a dry, percussive "chk" instead of a chord. Only a few strums in each bar let the chord sound. The groove comes from the contrast between ringing chords and muted chks, and from *where* the chords fall.

**3. Small chords.** Funk players rarely strum six strings. They use **fragments**: three or four notes on the top strings, bright and tight. The classic funk chord is **E9**, played at the 7th fret (x76777), and often only its top three strings (frets 7, 7, 7 on strings 3 to 1).

The pattern in this lesson, counting sixteenths:

\`\`\`
1 e & a 2 e & a 3 e & a 4 e & a
D x x U x U D x x U D x D U x U
\`\`\`

D and U ring; x is a ghost strum. The accents are on beats 1 and 4.

Keep the motion **small and loose**, from the wrist. A tight arm cannot play sixteenths for a whole song.`)] },
      { kind: "listen", blocks: [
        audio("All sixteen strums ringing: busy and flat", strumSound(FUNK_PLAIN, E9, 84, "16ths")),
        audio("The funk pattern: chords between ghost strums", strumSound(FUNK, E9, 84, "16ths")),
        audio("The same pattern on a three-string fragment", strumSound(FUNK, E9_TOP, 84, "16ths")),
      ] },
      { kind: "learn", blocks: [
        diagram("x76777", "E", "9", "E9 at the 7th fret: the funk chord."),
        strum(FUNK, E9, "Ghost strums (x) keep the hand moving; only the D and U strums ring.", 72, "16ths"),
      ] },
      { kind: "practice", blocks: [
        choice("What is a ghost strum?", ["A strum with the fretting hand relaxed, so it sounds muted", "A missed strum", "A very loud strum"], 0, "The hand still swings; the strings are damped."),
        choice("Does the strumming hand stop during a funk pattern?", ["No, it swings on every sixteenth", "Yes, between chords", "Only on beat 1"], 0, "Constant motion keeps the time."),
        choice("Why use chord fragments?", ["They are bright, tight and leave room", "Full chords are too quiet", "They are easier to read"], 0, "Fewer strings, cleaner groove."),
        ear("Plain sixteenths, or the funk pattern?", strumSound(FUNK, E9, 84, "16ths"), ["Plain", "Funk"], 1, "Chords pop out between muted chks."),
        choice("Which notes make E9?", ["E, G♯, B, D, F♯", "E, G, B, D", "E, G♯, B, D♯"], 0, "Dominant seventh plus the 9th."),
        strum(FUNK_B, E9, "A second pattern. Strum along at 72.", 72, "16ths"),
      ] },
    ],
  },
  {
    ...base,
    slug: "chord-embellishments",
    title: "Chord embellishments and fills",
    order: 2,
    concepts: ["chord-embellishments"],
    needs: ["funk-sixteenth-strumming", "sus-and-power-chords"],
    steps: [
      // OWNER REVIEW: which fingers hammer and pull off inside the D shape.
      { kind: "understand", blocks: [text(`A chord held for a whole bar can sound static. Players decorate it by **moving one note** while the rest of the chord keeps ringing.

**Sus and add9 decorations.** You learned sus chords in Level 3. On guitar they sit right next to the open shapes:

- **D** (xx0232) → **Dsus4** (xx0233): add the little finger on the 3rd fret of the top string.
- **D** → **Dsus2** (xx0230): lift the finger off the top string.
- **A** → **Asus4** → **A** → **Asus2**: the same idea on the B string.
- **C** → **Cadd9** (x32033): two fingers move up to the 3rd fret.

**Hammer-ons and pull-offs inside the chord.** Strum the D shape without the top string, then play on the top string alone: open, **hammer** to fret 2, hammer to fret 3, **pull off** to 2, pull off to open. The chord rings underneath while a little melody happens on top: sus2, major, sus4 and back.

**Bass walks between chords.** In the last beats before a change, walk the bass up or down to the next root: **G, A, B → C**. It joins the two chords like a bass player would.

Use decorations at the **end of a bar or phrase**, where they lead into what comes next. One per bar is plenty.`)] },
      { kind: "listen", blocks: [
        audio("D, then the hammer-on and pull-off melody on top", tabSound(EMBELLISH, 76)),
        audio("A, Asus4, A, Asus2", strumSound("D - D U - U D U", A, 84)),
        audio("A bass walk from G up to C", tabSound(WALK_UP, 76)),
      ] },
      { kind: "learn", blocks: [
        diagram("xx0233", "D", "sus4", "Dsus4"),
        diagram("xx0230", "D", "sus2", "Dsus2"),
        diagram("x32033", "C", "add9", "Cadd9"),
        tab(EMBELLISH, "Strum the bottom three strings of D, then the top string: 0, h2, h3, p2, p0, and the full chord.", 66),
        strumBars("D - D U - U D U", [["A", A], ["Asus4", ASUS4], ["A", A], ["Asus2", ASUS2]], "A, Asus4, A, Asus2: one finger moves on the B string.", 80),
      ] },
      { kind: "practice", blocks: [
        choice("How do you get from D to Dsus4?", ["Add the little finger on fret 3 of the top string", "Lift every finger", "Move to a barre chord"], 0, "F♯ becomes G."),
        choice("Which notes make Cadd9?", ["C, E, G, D", "C, E, G, B", "C, D, G"], 0, "A major triad with the 9th added."),
        choice("What joins G to C in the bass walk?", ["A and B", "F and E", "D and E"], 0, "G, A, B, C."),
        choice("Where do embellishments work best?", ["At the end of a bar or phrase", "On every beat", "Only at the start of a song"], 0, "They lead into what comes next."),
        ear("Plain A, or decorated with sus chords?", strumSound("D - D U - U D U", ASUS4, 84), ["Plain A", "Asus4"], 1, "The C♯ has moved up to D."),
        tab(WALK_UP, "Play the walk into C along at 66.", 66),
      ] },
    ],
  },
  {
    ...base,
    slug: "double-stop-fills-in-rhythm",
    title: "Mixing rhythm and lead: double-stop fills",
    order: 3,
    concepts: ["rhythm-lead-fills"],
    needs: ["chord-embellishments", "double-stops"],
    steps: [
      // OWNER REVIEW: how to pluck strings 3 and 1 together (pick and middle finger, or mute string 2).
      { kind: "understand", blocks: [text(`The best rhythm players never sound like they are only strumming. Between the chords they slip in little **fills**, two-note melodies that answer the singer. This is how one guitarist can sound like two.

The tool is the **double stop**: two notes at once. Here, **sixths** on strings 3 and 1, skipping string 2:

| Fret (string 3 + string 1) | Notes |
|---|---|
| 6 + 5 | C♯ + A |
| 7 + 7 | D + B |
| 9 + 9 | E + C♯ |

All of them are in A major, and the last pair is the A chord's own 3rd and 5th, so the fill **lands home**. Sixths sound sweet and soulful, the sound of classic soul and R&B guitar.

How to play two strings with one string in between:

- **Pick and finger:** pick string 3 and pluck string 1 with the middle finger, together.
- **Or mute string 2** with the underside of the finger fretting string 3, and strum all three.

The pattern in this lesson: strum A for two beats, then the fill for two beats. Rhythm, lead, rhythm, lead.

The rule: **fill the gaps, not the vocal.** When the singer is singing, strum; when they breathe, fill.`)] },
      { kind: "listen", blocks: [
        audio("Two beats of A, then a sixths fill", tabSound(SIXTHS_FILL, 80)),
        audio("The fill alone", tabSound("3:6+1:5/8 3:7+1:7/8 3:9+1:9/h.", 80)),
      ] },
      { kind: "learn", blocks: [
        show(shape("3:6 1:5 3:7 1:7 3:9 1:9"), "Sixths on strings 3 and 1, all from A major.", "guitar"),
        tab(SIXTHS_FILL, "Strum A on beats 1 and 2, then the fill on 3 and 4.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("What is a double stop?", ["Two notes played at once", "Stopping twice", "A chord with six notes"], 0, "A two-note melody."),
        choice("Which strings carry these sixths?", ["3 and 1, skipping 2", "6 and 5", "2 and 1"], 0, "String 2 is skipped or muted."),
        choice("Why does the fill end on frets 9 and 9?", ["E and C♯ are in the A chord", "It is the highest fret", "It is a different key"], 0, "It lands home."),
        choice("When should a fill happen in a song?", ["In the gaps between vocal lines", "While the singer sings", "Never"], 0, "Fill the gaps, not the vocal."),
        ear("Strumming, or a double-stop fill?", tabSound("3:6+1:5/8 3:7+1:7/8 3:9+1:9/h.", 80), ["Strumming", "Double-stop fill"], 1, "Two notes at a time, moving."),
        tab(SIXTHS_FILL, "Play the bar along at 70, then loop it.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "arpeggiated-rhythm-with-a-pick",
    title: "Arpeggiated rhythm parts with a pick",
    order: 4,
    concepts: ["picked-arpeggios"],
    needs: ["double-stop-fills-in-rhythm", "block-and-broken-chords"],
    steps: [
      // OWNER REVIEW: picking direction for arpeggios (down through the strings, up on the way back).
      { kind: "understand", blocks: [text(`Strumming hits every string at once. An **arpeggiated** part picks the strings of the chord **one at a time**, so each note is heard. It is the sound of countless ballads and rock intros, and it turns four ordinary chords into something that shimmers.

The method:

1. **Hold the whole chord shape**, exactly as if you were strumming.
2. **Pick the strings in order**, bass first: root, then up across the strings, then back down.
3. **Let every note ring** into the next. Do not lift fingers until the chord changes.

For C, Am, F, G in eighth notes:

| Chord | Shape | Strings picked |
|---|---|---|
| C | x32010 | 5 4 3 2 1 2 3 4 |
| Am | x02210 | 5 4 3 2 1 2 3 4 |
| F | xx3211 | 4 3 2 1 2 3 4 3 |
| G | 320003 | 6 5 4 3 2 1 2 3 |

**Start each chord on its root** (string 5 for C and Am, string 4 for the small F, string 6 for G). The bass note tells the ear the chord has changed.

Pick with **small, even strokes**, mostly down as you go towards the floor and up on the way back. Evenness matters more than speed: every note the same volume.`)] },
      { kind: "listen", blocks: [
        audio("C, Am, F, G, picked one string at a time", tabSound(ARP_PART, 84)),
        audio("The same chords strummed", strumSound("D - D U - U D U", "C3 E3 G3 C4 E4", 84)),
      ] },
      { kind: "learn", blocks: [
        tab(ARP_PART, "Hold each shape and pick the strings in order, letting them ring.", 66),
      ] },
      { kind: "practice", blocks: [
        choice("What do you hold while picking an arpeggio?", ["The whole chord shape", "One note at a time", "Nothing: open strings only"], 0, "Then every picked note belongs to the chord."),
        choice("Which string does the G arpeggio start on?", ["String 6, its root", "String 1", "String 4"], 0, "Start on the root."),
        choice("When do the fretting fingers move?", ["Only when the chord changes", "After every note", "Every beat"], 0, "Let the notes ring."),
        choice("What matters most in a picked arpeggio?", ["Even notes", "Speed", "Playing loudly"], 0, "Each note the same volume."),
        ear("Arpeggiated or strummed?", tabSound(ARP_PART, 84), ["Arpeggiated", "Strummed"], 0, "One note at a time."),
        tab(ARP_PART, "Play along at 66.", 66),
      ] },
    ],
  },
  {
    ...base,
    slug: "jazz-comping-on-guitar",
    title: "Jazz comping with shells and drop-2 voicings",
    order: 5,
    concepts: ["guitar-jazz-comping"],
    needs: ["arpeggiated-rhythm-with-a-pick", "shell-voicings", "drop-2-voicings"],
    steps: [
      { kind: "understand", blocks: [text(`Jazz guitar accompaniment uses small, precise chords, not open-position strums.

**Shells: three notes.** Root, 3rd and 7th: the notes that define the chord. Over a ii–V–I in C:

| Chord | Shape | Notes |
|---|---|---|
| Dm7 | x5x56x | D, C, F |
| G7 | 3x34xx | G, F, B |
| Cmaj7 | x3x45x | C, B, E |

They move with hardly any hand motion, and they leave room for a bass player and a soloist. The classic way to play them is **four to the bar**: a short, even chord on every beat, the swing-era rhythm guitar sound.

**Drop-2 voicings: four notes.** Take a close chord, drop its second-highest note an octave. On guitar that gives shapes that fit four adjacent strings:

| Chord | Shape | Notes, low to high |
|---|---|---|
| Dm7 | x5756x | D A C F |
| G7 | xx5767 | G D F B |
| Cmaj7 | x3545x | C G B E |

Fuller than shells, and the top notes make a melody: F, B, E.

With drop-2s, comp more sparsely: **beats 2 and 4**, short, like a snare drum. Jazz is swung; the app plays it straight.`)] },
      { kind: "listen", blocks: [
        audio("Shells, four to the bar", tabSound(SHELLS_TAB, 120)),
        audio("Drop-2 voicings on 2 and 4", tabSound(DROP2_TAB, 120)),
      ] },
      { kind: "learn", blocks: [
        show(shape("5:5 3:5 2:6"), "Dm7 shell: root, 7th, 3rd.", "guitar"),
        diagram("x5756x", "D", "m7", "Dm7 drop-2"),
        diagram("xx5767", "G", "7", "G7 drop-2"),
        diagram("x3545x", "C", "maj7", "Cmaj7 drop-2"),
        tab(SHELLS_TAB, "Shells, one short chord per beat.", 100),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes make a shell voicing?", ["Root, 3rd and 7th", "Root, 5th and octave", "3rd, 5th and 9th"], 0, "The notes that define the chord."),
        choice("How is a drop-2 voicing made?", ["Drop the second-highest note of a close chord an octave", "Remove the root", "Add a 9th"], 0, "It spreads the chord to fit the strings."),
        choice("What are the top notes of the three drop-2 voicings here?", ["F, B, E", "D, G, C", "A, D, G"], 0, "A melody across the changes."),
        choice("What is \"four to the bar\"?", ["A short chord on every beat", "Four bars of rest", "Four strings strummed"], 0, "The swing-era rhythm guitar sound."),
        ear("Shells on every beat, or drop-2s on 2 and 4?", tabSound(DROP2_TAB, 120), ["Shells, every beat", "Drop-2s, 2 and 4"], 1, "Fuller chords, with space between."),
        tab(DROP2_TAB, "Comp on 2 and 4 along at 100.", 100),
      ] },
    ],
  },
  {
    ...base,
    slug: "bossa-nova-on-guitar",
    title: "Bossa nova and Latin patterns",
    order: 6,
    concepts: ["guitar-bossa-nova"],
    needs: ["jazz-comping-on-guitar"],
    steps: [
      // OWNER REVIEW: this is one common bossa nova pattern among several; thumb and finger assignment.
      { kind: "understand", blocks: [text(`**Bossa nova** guitar is played with the fingers, and it splits the hand in two:

- **The thumb** plays the bass: the root on beat 1, the 5th on beat 3, like a steady heartbeat.
- **The fingers** (i, m, a) pluck the upper notes of the chord, in a syncopated rhythm against the thumb.

The pattern in this lesson, one bar:

\`\`\`
count:   1  &  2  &  3  &  4  &
thumb:   R              5
fingers: X        X           X
\`\`\`

The fingers play with the thumb on beat 1, then on the "and" of 2 and the "and" of 4: just before beats 3 and 1. Those **anticipations** give bossa nova its lilt.

The chords are the jazz shapes you know, ii–V–I in C:

| Chord | Shape | Thumb | Fingers |
|---|---|---|---|
| Dm7 | x5756x | D (string 5), then A (string 6, fret 5) | strings 4–2 |
| G7 | 353433 | G (string 6), then D (string 5, fret 5) | strings 4–2 |
| Cmaj7 | x3545x | C (string 5), then G (string 6, fret 3) | strings 4–2 |

The feel is **straight eighths**, quiet and relaxed. Play the fingers softer than the thumb.`)] },
      { kind: "listen", blocks: [
        audio("Bossa nova through ii–V–I", tabSound(BOSSA, 120)),
      ] },
      { kind: "learn", blocks: [
        diagram("353433", "G", "7", "G7 barre at the 3rd fret"),
        picking(BOSSA, BOSSA_FINGERS, "Thumb on the bass, fingers on the chord: with the thumb on 1, then on the and of 2 and the and of 4.", 96),
      ] },
      { kind: "practice", blocks: [
        choice("What does the thumb play in bossa nova?", ["Root on 1, fifth on 3", "The melody", "Every string"], 0, "A steady bass."),
        choice("When do the fingers play, besides beat 1?", ["On the and of 2 and the and of 4", "On every beat", "Only on beat 3"], 0, "Anticipating beats 3 and 1."),
        choice("Over Dm7, which note is the thumb's fifth?", ["A", "F", "C"], 0, "D, E, F, G, A: the fifth is A."),
        choice("Are bossa nova eighths swung?", ["No, straight", "Yes", "Only on G7"], 0, "Straight and relaxed."),
        ear("Bossa nova, or four to the bar?", tabSound(BOSSA, 120), ["Bossa nova", "Four to the bar"], 0, "Thumb on 1 and 3, chords between."),
        picking(BOSSA, BOSSA_FINGERS, "Play along at 96.", 96),
      ] },
    ],
  },
  {
    ...base,
    slug: "odd-meters-and-polyrhythm-on-guitar",
    title: "Odd meters and polyrhythm basics",
    order: 7,
    concepts: ["odd-meter-strumming", "polyrhythm"],
    needs: ["bossa-nova-on-guitar", "odd-meters"],
    steps: [
      // OWNER REVIEW: how to count and feel 3 over 4 while playing.
      { kind: "understand", blocks: [text(`**Odd meters: group the beats.** As in Level 4, a bar of five or seven is felt as twos and threes. On guitar, put a **bass note on the start of each group** and fill the rest with the top of the chord.

**5/4 as 3 + 2**, on Em: bass E on beat 1, bass B on beat 4, the top three strings on the other beats.

\`\`\`
beat:  1   2   3   4   5
       E   -   -   B   -
\`\`\`

**7/8 as 2 + 2 + 3**: bass notes on eighths 1, 3 and 5. Short, short, long.

**Polyrhythm: two pulses at once.** A **three-against-two** feel puts a chord every **three** eighth notes while the bass keeps every **two**:

\`\`\`
eighth:  1 2 3 4 5 6 7 8 | 1 2 3 4 5 6 7 8 | 1 2 3 4 5 6 7 8
bass:    E . E . E . E . | E . E . E . E . | E . E . E . E .
chord:   X . . X . . X . | . X . . X . . X | . . X . . X . .
\`\`\`

The chords drift across the bar lines and line up with beat 1 again only every **three bars**. It sounds like the music is tilting, and then it rights itself.

How to learn it: keep counting the bass in four, out loud, and place the chords by counting eighths in threes. Slowly at first: the two counts fight each other until suddenly they do not.`)] },
      { kind: "listen", blocks: [
        audio("5/4 as 3 + 2 on Em", tabIn(FIVE, 96, 5)),
        audio("7/8 as 2 + 2 + 3", tabIn(SEVEN, 96, 7, 0.5)),
        audio("Three against two: chords every three eighths over a steady bass", THREE_OVER_FOUR),
      ] },
      { kind: "learn", blocks: [
        tabBlock(FIVE, "5/4: bass on beats 1 and 4, the top of Em on the others.", 84, 5),
        tabBlock(SEVEN, "7/8: bass on eighths 1, 3 and 5.", 84, 7, 0.5),
      ] },
      { kind: "practice", blocks: [
        choice("How is 5/4 grouped here?", ["3 + 2", "4 + 1", "2 + 2 + 1"], 0, "Bass on beats 1 and 4."),
        choice("In 7/8 as 2 + 2 + 3, where are the bass notes?", ["Eighths 1, 3 and 5", "Every eighth", "Eighths 1 and 7"], 0, "The start of each group."),
        choice("In three against two, how often do the chords line up with beat 1 again?", ["Every three bars", "Every bar", "Never"], 0, "24 eighths: three bars of eight."),
        ear("5/4 or 7/8?", tabIn(SEVEN, 96, 7, 0.5), ["5/4", "7/8"], 1, "Short, short, long, in eighth notes."),
        ear("Do the chords fall on the beat, or drift across it?", THREE_OVER_FOUR, ["On the beat", "Drift across it"], 1, "Every three eighths: a polyrhythm."),
        tabBlock(FIVE, "Play the 5/4 part along at 84.", 84, 5),
      ] },
    ],
  },
  {
    ...base,
    slug: "groove-study-two-sections",
    title: "Study: a groove piece in two sections",
    order: 8,
    minutes: 9,
    concepts: ["groove-study", "writing-rhythm-parts"],
    needs: ["odd-meters-and-polyrhythm-on-guitar"],
    steps: [
      { kind: "understand", blocks: [text(`The study piece has two contrasting sections, and it shows how to **write your own rhythm part** for any progression.

**Section A: funk on E9.** Four bars of sixteenth-note strumming with ghost strums, alternating the two patterns from lesson 1. Tight, percussive, dry.

**Section B: open and ringing.** A, G, D, D, picked as arpeggios, with a hammer-on decoration on the D. Wide and sustained: the opposite of section A.

How to write a rhythm part for any song:

1. **Decide the feel**: straight or swung, eighths or sixteenths, busy or sparse.
2. **Choose the voicing**: full open chords, fragments, shells, power chords.
3. **Make the sections contrast.** If the verse is muted and tight, let the chorus ring. If the verse is picked, strum the chorus.
4. **Leave room** for the singer and the other instruments.
5. **Add one decoration** at the end of each phrase: a sus, a hammer-on, a bass walk, a fill.

Then play A, B, A without stopping. The join between sections is the hardest part: the right hand has to switch from sixteenth-note strumming to picking in a single beat.`)] },
      { kind: "listen", blocks: [
        audio("Section A: funk on E9", strumSound(FUNK, E9, 84, "16ths")),
        audio("Section B: A, G, D, D, picked", tabSound(STUDY_B, 84)),
      ] },
      { kind: "learn", blocks: [
        strumBars(FUNK, [["E9", E9], ["E9", E9], ["E9", E9], ["E9", E9]], "Section A: four bars of funk on E9.", 76, "16ths"),
        tab(STUDY_B, "Section B: A, G, D, D, ending with a hammer-on decoration.", 76),
      ] },
      { kind: "practice", blocks: [
        choice("What makes section B contrast with section A?", ["It rings and is picked, instead of muted strumming", "It is in a different key", "It is louder only"], 0, "Open versus tight."),
        choice("What is the first decision when writing a rhythm part?", ["The feel", "The last chord", "The guitar brand"], 0, "Straight or swung, eighths or sixteenths."),
        choice("Where does a decoration usually go?", ["At the end of a phrase", "On every beat", "Before the song starts"], 0, "It leads into what comes next."),
        choice("What is the hardest part of playing A, B, A?", ["The join between sections", "The first chord", "Tuning"], 0, "The right hand switches technique."),
        ear("Section A or section B?", tabSound(STUDY_B, 84), ["A: funk", "B: picked"], 1, "One note at a time, ringing."),
        strum(FUNK, E9, "Play section A along at 76, then switch to section B.", 76, "16ths"),
      ] },
    ],
  },
];

