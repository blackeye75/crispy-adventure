// Playing track G3, Advanced stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (fingering a melody over a bass, percussive slaps and taps,
// artificial and tapped harmonics, tremolo, keeping two voices independent, retuning) is standard teaching
// written from memory, not checked against a player. The tune is "Ode to Joy" (Beethoven, public domain); the
// arrangements, the counterpoint and the study are original and unplayed. The app cannot make percussive or
// harmonic sounds: it plays short muted chords for slaps and the sounding pitches for harmonics. These lessons
// also still need their demo videos.
import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, ear, picking, rhythm, shape, show, strum, strumSound, tab, tabSound, text, tuned } from "../helpers";

const base = { moduleSlug: "fingerstyle-advanced", track: "guitar-fingerstyle", stage: "advanced", strand: "guitar", isFree: false, version: 1, minutes: 8 } as const;

const C = "C3 E3 G3 C4 E4"; // x32010
const DROP_D = "D2 A2 D3 G3 B3 E4";

// "Ode to Joy" in C, bars 1–4: melody on the top strings, a bass note under the first beat of each bar.
const MELODY_ONLY = "1:0/q 1:0/q 1:1/q 1:3/q | 1:3/q 1:1/q 1:0/q 2:3/q | 2:1/q 2:1/q 2:3/q 1:0/q | 1:0/q. 2:3/8 2:3/h";
const BASS_MELODY = "5:3+1:0/q 1:0/q 1:1/q 1:3/q | 6:3+1:3/q 1:1/q 1:0/q 2:3/q | 5:3+2:1/q 2:1/q 2:3/q 1:0/q | 6:3+1:0/q. 2:3/8 6:3+2:3/h";
const THREE_LAYERS = "5:3+3:0+1:0/q 1:0/q 1:1/q 1:3/q | 6:3+3:0+1:3/q 1:1/q 1:0/q 2:3/q | 5:3+3:0+2:1/q 2:1/q 2:3/q 1:0/q | 6:3+3:0+1:0/q. 2:3/8 6:3+4:0+2:3/h";
// Chord melody: every melody note is the top of a chord.
const CHORD_MELODY = "5:3+3:0+2:1+1:0/q 3:0+2:1+1:0/q 3:2+2:1+1:1/q 3:0+2:0+1:3/q | 6:3+3:0+2:0+1:3/q 3:0+2:0+1:1/q 3:0+2:1+1:0/q 4:0+3:0+2:3/q | 5:3+4:2+3:0+2:1/q 4:2+3:0+2:1/q 4:0+3:0+2:3/q 3:0+2:1+1:0/q | 6:3+3:0+1:0/q. 2:3/8 6:3+4:0+3:0+2:3/h";
// Percussive groove: chord on 1 and 3, a slap (here, a muted strum) on 2 and 4.
const SLAP = "D - x - D - x -";
// Harmonics: the open C chord, then the same notes an octave higher, as artificial or tapped harmonics sound.
const CHORD_PLAIN = rhythm("C3/8 E3/8 G3/8 C4/8 E4/h", 72);
const CHORD_HARMONICS = rhythm("C4/8 E4/8 G4/8 C5/8 E5/h", 72);
const NATURAL = "4:12/q^n 3:12/q^n 2:12/q^n 1:12/q^n | 3:7/q^n 2:7/q^n 3:5/q^n 2:5/q^n";
// Tremolo: thumb on the bass, then a, m, i on one treble string.
const TREMOLO = "5:0/16 1:0/16 1:0/16 1:0/16 4:2/16 1:0/16 1:0/16 1:0/16 5:0/16 1:8/16 1:8/16 1:8/16 4:2/16 1:7/16 1:7/16 1:7/16";
const TREMOLO_FINGERS = "p a m i p a m i p a m i p a m i";
// Two voices: the melody climbs while the bass falls, then the reverse.
const COUNTERPOINT = "5:3+1:0/q 5:0+1:1/q 6:3+1:3/q 6:1+1:5/q | 6:0+1:3/q 6:1+1:1/q 6:3+1:0/q 6:3+2:3/q | 5:3+2:1/w";
const COUNTERPOINT_RHYTHM = "5:3+1:0/h 1:1/8 1:3/8 1:5/q | 6:0+1:3/q. 1:1/8 6:3+1:0/h | 5:3+2:1/w";
// Drop D: the low string tuned down to D gives a deep open bass under a melody in D.
const DROP_D_PART = "6:0+2:3/h 6:0+1:2/h | 6:0+3:2/h 6:0+2:3/h";
// The study: Ode to Joy bars 1–8 with an alternating bass, ending on a full C chord.
const STUDY = [
  "5:3+1:0/q 1:0/q 4:2+1:1/q 1:3/q", "6:3+1:3/q 1:1/q 4:0+1:0/q 2:3/q", "5:3+2:1/q 2:1/q 4:2+2:3/q 1:0/q", "6:3+1:0/q. 2:3/8 4:0+2:3/h",
  "5:3+3:0+1:0/q 1:0/q 4:2+1:1/q 1:3/q", "6:3+3:0+1:3/q 1:1/q 4:0+1:0/q 2:3/q", "5:3+3:0+2:1/q 2:1/q 4:2+2:3/q 1:0/q", "6:3+2:3/q. 2:1/8 5:3+4:2+3:0+2:1+1:0/h",
].join(" | ");

export const fingerstyleAdvanced: LessonInput[] = [
  {
    ...base,
    slug: "arranging-for-solo-guitar",
    title: "Arranging for solo guitar: bass, harmony, melody",
    order: 1,
    concepts: ["solo-guitar-arranging"],
    needs: ["two-part-study-piece", "harmonising-the-major-scale"],
    steps: [
      // OWNER REVIEW: fretting-hand fingering for the melody over held bass notes.
      { kind: "understand", blocks: [text(`A solo guitar arrangement does three jobs at once, just as solo piano does:

1. **Melody** on the top strings, plucked by the fingers.
2. **Bass** on the bottom strings, plucked by the thumb.
3. **Harmony** in the middle, filling out the chord.

Build it in that order, on "Ode to Joy" in C.

**Step 1: the melody alone.** Find the tune on the top two strings: E is string 1 open, F is fret 1, G is fret 3; D is string 2, fret 3; C is string 2, fret 1.

**Step 2: add the bass.** On beat 1 of each bar, pinch the melody note together with the root of the chord: **C** (string 5, fret 3) or **G** (string 6, fret 3). Now the harmony is clear from just two notes.

**Step 3: add an inner voice.** On those same beats, add **open G** (string 3), a note shared by both chords. Three notes at once: bass, harmony, melody.

The order matters because **the melody must survive**. Every added note has to fit under the fingers *without* breaking the tune. If a bass note would force an impossible stretch, leave it out or move it. Arranging is choosing what to leave out.

Balance: melody loudest, then bass, then the inner voice.`)] },
      { kind: "listen", blocks: [
        audio("Step 1: the melody alone", tabSound(MELODY_ONLY, 90)),
        audio("Step 2: with the bass", tabSound(BASS_MELODY, 90)),
        audio("Step 3: with an inner voice", tabSound(THREE_LAYERS, 90)),
      ] },
      { kind: "learn", blocks: [
        tab(THREE_LAYERS, "Bass, inner voice and melody together on beat 1; the melody alone after it.", 66),
      ] },
      { kind: "practice", blocks: [
        choice("In what order do you build an arrangement?", ["Melody, then bass, then harmony", "Harmony, then melody", "Bass only"], 0, "The melody must survive."),
        choice("Which hand part plays the bass?", ["The thumb", "The ring finger", "The fretting hand alone"], 0, "Thumb on the low strings."),
        choice("Why is open G a good inner note here?", ["It belongs to both the C and the G chord", "It is the loudest string", "It is the melody"], 0, "A shared chord tone."),
        choice("A bass note would make the melody impossible to play. What do you do?", ["Leave it out or move it", "Stretch anyway", "Drop the melody"], 0, "Arranging is choosing what to leave out."),
        ear("Melody alone, or with bass?", tabSound(BASS_MELODY, 90), ["Melody alone", "With bass"], 1, "A low note under each first beat."),
        tab(THREE_LAYERS, "Play along at 66.", 66),
      ] },
    ],
  },
  {
    ...base,
    slug: "chord-melody-fingerstyle",
    title: "Chord melody",
    order: 2,
    concepts: ["chord-melody"],
    needs: ["arranging-for-solo-guitar", "chord-melody-on-guitar"],
    steps: [
      { kind: "understand", blocks: [text(`In **chord melody**, every melody note becomes the **top note of a chord**. It is fuller than bass-plus-melody, and it is the classic way jazz and pop guitarists play tunes alone.

The method from Level 6, applied:

1. For each melody note, find a chord of the harmony **with that note on top**, usually on strings 1 to 3 or 2 to 4.
2. Pluck the strings together, fingers on the chord, the melody slightly louder.
3. Add a bass note on beat 1 when the hand allows.

For "Ode to Joy", bar 1:

| Melody | Chord under it | Strings 3, 2, 1 |
|---|---|---|
| E | C | G, C, E |
| F | F | A, C, F |
| G | G | G, B, G |

In bar 2, the F becomes the 7th of **G7** (G, B, F): the melody note decides the colour of the chord.

Two cautions:

- **Keep the melody on top.** If an inner note is higher than the tune, the tune disappears.
- **Not every note needs its own chord.** Short passing notes can be played alone; harmonise the strong beats.`)] },
      { kind: "listen", blocks: [
        audio("Bass and melody", tabSound(BASS_MELODY, 84)),
        audio("Chord melody: a chord under every note", tabSound(CHORD_MELODY, 84)),
      ] },
      { kind: "learn", blocks: [
        tab(CHORD_MELODY, "Each melody note is the top of a chord. Pluck the chord together, melody slightly louder.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What is chord melody?", ["Every melody note is the top of a chord", "Strumming while singing", "Playing only bass notes"], 0, "Melody and harmony as one."),
        choice("Under a melody F in bar 2, which chord is used?", ["G7", "C", "Am"], 0, "F is the 7th of G7."),
        choice("Which notes make the chord under the melody G in bar 1?", ["G, B, G", "C, E, G", "A, C, F"], 0, "A G chord with G on top."),
        choice("Which notes need a chord most?", ["The strong beats", "Every short passing note", "Only the last note"], 0, "Passing notes can stand alone."),
        ear("Bass and melody, or chord melody?", tabSound(CHORD_MELODY, 84), ["Bass and melody", "Chord melody"], 1, "Full chords under every note."),
        tab(CHORD_MELODY, "Play along at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "percussive-fingerstyle",
    title: "Percussive techniques: slaps and taps",
    order: 3,
    concepts: ["percussive-guitar"],
    needs: ["chord-melody-fingerstyle"],
    steps: [
      // OWNER REVIEW: how each percussive sound is made, and where on the guitar body to tap.
      { kind: "understand", blocks: [text(`Modern fingerstyle players turn the guitar into a drum kit as well as a band. Three sounds cover most of it:

- **Thumb slap.** The side of the thumb strikes the bass strings **against the frets**, so they slap rather than ring. It sounds like a snare drum. Usually on **beats 2 and 4**.
- **String slap.** The fingers or palm come down flat across the strings near the soundhole, muting and striking them at once: a sharp crack.
- **Body taps.** Fingertips or the heel of the hand tapping the top or side of the guitar. A tap near the bridge sounds deep, like a kick drum; on the upper side, higher and lighter.

The basic groove: **bass and chord on beats 1 and 3, slap on beats 2 and 4.** Boom, crack, boom, crack. Once that is steady, add a melody on top.

Two rules keep percussion musical:

1. **The time must be rock solid.** A slap a little late sounds like a mistake, not a groove.
2. **Balance the percussion under the melody.** It supports; it does not take over.

The app cannot make a slap. Below, the slaps are played as short muted strums so you can hear where they fall.`)] },
      { kind: "listen", blocks: [
        audio("Chord on 1 and 3, slap on 2 and 4 (slaps shown as muted strums)", strumSound(SLAP, C, 84)),
      ] },
      { kind: "learn", blocks: [
        strum(SLAP, C, "D = pluck the chord with the bass; x = thumb slap on 2 and 4.", 72),
      ] },
      { kind: "practice", blocks: [
        choice("Where does the thumb slap usually fall?", ["Beats 2 and 4", "Beats 1 and 3", "Every eighth note"], 0, "Like a snare drum."),
        choice("A tap near the bridge sounds like…", ["A kick drum", "A cymbal", "A high bell"], 0, "Deep and low."),
        choice("What matters most in a percussive groove?", ["Rock-solid time", "Playing as loudly as possible", "Using every technique at once"], 0, "A late slap sounds like a mistake."),
        choice("How should percussion balance against a melody?", ["Underneath it, supporting", "Louder than the melody", "Instead of the melody"], 0, "It supports."),
        ear("Where do the percussive hits fall?", strumSound(SLAP, C, 84), ["Beats 2 and 4", "Beats 1 and 3"], 0, "Between the chords."),
        strum(SLAP, C, "Play the groove along at 72.", 72),
      ] },
    ],
  },
  {
    ...base,
    slug: "artificial-and-tapped-harmonics",
    title: "Artificial and tapped harmonics",
    order: 4,
    concepts: ["artificial-harmonics"],
    needs: ["percussive-fingerstyle", "natural-harmonics"],
    steps: [
      // OWNER REVIEW: the hand positions for artificial and tapped harmonics.
      { kind: "understand", blocks: [text(`**Natural harmonics** (Intermediate stage) work only on open strings, at frets 12, 7 and 5. **Artificial harmonics** move that bell-like sound to **any fretted note**.

**Artificial harmonics.** Fret a note normally. With the picking hand, lightly touch the same string **twelve frets higher** with the index finger, directly over the fret wire, and pluck behind it with the thumb or ring finger. The note sounds **one octave higher**, as a chime.

Fret C on string 2 at fret 1: touch over fret 13, pluck, and you hear the C an octave up.

**Tapped harmonics.** Hold a chord. With a finger of the picking hand, **tap sharply on the fret wire twelve frets above** each note, and lift straight away. Each string chimes an octave higher: fret 12 for an open string, fret 13 for a note held at fret 1, and so on. In effect you tap the chord's own shape, moved up twelve frets. A whole chord, shimmering.

Uses:

- **A melody in harmonics** over a fingerpicked bass.
- **A chiming ending**, on the last chord.
- **Mixing** plucked notes and harmonics in one arpeggio for a harp-like sound.

The app cannot make a harmonic sound: below it plays the **pitches** the harmonics produce, an octave above the chord.`)] },
      { kind: "listen", blocks: [
        audio("The C chord, plucked", CHORD_PLAIN),
        audio("The same notes an octave up: the pitches artificial or tapped harmonics give", CHORD_HARMONICS),
        audio("Natural harmonics, for comparison", tabSound(NATURAL, 72)),
      ] },
      { kind: "learn", blocks: [
        show(shape("5:3 4:2 3:0 2:1 1:0"), "Hold C. For tapped harmonics, tap twelve frets above each note: fret 12 for the open strings, 13, 14 and 15 for the fretted ones.", "guitar"),
        tab(NATURAL, "Natural harmonics at frets 12, 7 and 5: the starting point.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("Where do you touch for an artificial harmonic?", ["Twelve frets above the fretted note", "At fret 5 always", "On the bridge"], 0, "Directly over the fret wire."),
        choice("How high does an artificial harmonic sound?", ["One octave above the fretted note", "The same pitch", "Two octaves lower"], 0, "Halving the string doubles the pitch."),
        choice("How is a tapped harmonic made?", ["Tap the fret wire twelve frets above and lift at once", "Press the string to the fret", "Bend the string"], 0, "A quick tap, then away."),
        choice("Natural harmonics work on…", ["Open strings only", "Any fretted note", "Only string 1"], 0, "Artificial harmonics remove that limit."),
        ear("Plucked chord, or an octave up in harmonics?", CHORD_HARMONICS, ["Plucked", "Harmonics, an octave up"], 1, "The same chord, higher and brighter."),
        tab(NATURAL, "Play the natural harmonics, then try artificial ones on a fretted C.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "tremolo-picking-fingerstyle",
    title: "Tremolo",
    order: 5,
    concepts: ["classical-tremolo"],
    needs: ["artificial-and-tapped-harmonics", "free-strokes-and-rest-strokes"],
    steps: [
      // OWNER REVIEW: the p-a-m-i order and how to practise evenness.
      { kind: "understand", blocks: [text(`**Tremolo** makes a plucked string sound like a sustained, singing note. It is the classical guitar's way of imitating a violin.

The pattern is four notes per beat:

\`\`\`
finger:  p  a  m  i
string:  bass, then the same treble note three times
\`\`\`

The thumb plays a bass note; then **ring, middle and index** pluck the **same** treble string in quick succession. Repeated beat after beat, the three fast notes blur into one trembling, sustained melody, while the thumb moves through the harmony underneath.

In this lesson, over A minor: the melody holds **E** for two beats, then moves to **C** and **B**, while the thumb alternates **A** and **E**.

How to practise:

1. **Slowly, with a click,** one note per click: p, a, m, i. Every note the same volume.
2. **Evenness first.** The a finger is usually weaker; listen for it.
3. **Then speed it up**, but only while it stays even. An uneven tremolo sounds like galloping, not singing.

The melody notes should be clearly **louder than the bass**, so the tune floats on top.`)] },
      { kind: "listen", blocks: [
        audio("Tremolo over A minor", tabSound(TREMOLO, 60)),
      ] },
      { kind: "learn", blocks: [
        picking(TREMOLO, TREMOLO_FINGERS, "Thumb on the bass, then a, m, i on one treble note, every beat.", 44),
      ] },
      { kind: "practice", blocks: [
        choice("What is the tremolo finger order?", ["p a m i", "p i m a", "i m i m"], 0, "Thumb, then ring, middle, index."),
        choice("What do a, m and i play?", ["The same treble note three times", "Three different strings", "The bass"], 0, "Repeated fast, it sounds sustained."),
        choice("What must you practise first?", ["Evenness", "Speed", "Volume only"], 0, "Uneven tremolo gallops."),
        choice("Which should be louder: melody or bass?", ["The melody", "The bass", "Equal"], 0, "The tune floats on top."),
        ear("Is this a tremolo?", tabSound(TREMOLO, 60), ["Yes", "No, single notes"], 0, "Fast repeated treble notes over a bass."),
        picking(TREMOLO, TREMOLO_FINGERS, "Play along at 44, then raise the tempo slowly.", 44),
      ] },
    ],
  },
  {
    ...base,
    slug: "two-independent-voices",
    title: "Two independent voices",
    order: 6,
    concepts: ["guitar-counterpoint"],
    needs: ["tremolo-picking-fingerstyle", "contrary-motion"],
    steps: [
      { kind: "understand", blocks: [text(`An alternating bass repeats a pattern. In **counterpoint**, the bass becomes a **second melody**, with its own direction and rhythm. Two voices, played by one guitarist.

**Independent direction.** When the melody climbs, the bass falls; when the melody falls, the bass climbs. That is **contrary motion** from Level 5:

\`\`\`
melody:  E  F  G  A  |  G  F  E  D  |  C
bass:    C  A  G  F  |  E  F  G  G  |  C
\`\`\`

Every pair of notes makes a consonant interval (a 3rd, 6th, octave or 5th, plus octaves), so the voices sound sweet together even while moving apart.

**Independent rhythm.** In the second version, the voices also move at **different times**: a long bass note under quick melody notes, then the other way round. That is when two voices really sound like two players.

How to practise:

1. **Each voice alone**, singing or humming it. If you cannot sing the bass, you are not yet hearing it as a melody.
2. **Together, very slowly.**
3. **Balance:** the melody a little louder, but the bass clearly audible as a line, not a background.`)] },
      { kind: "listen", blocks: [
        audio("Two voices in contrary motion", tabSound(COUNTERPOINT, 72)),
        audio("Two voices with independent rhythms", tabSound(COUNTERPOINT_RHYTHM, 72)),
      ] },
      { kind: "learn", blocks: [
        tab(COUNTERPOINT, "The melody climbs while the bass falls, then the reverse.", 56),
        tab(COUNTERPOINT_RHYTHM, "Now the voices move at different times too.", 56),
      ] },
      { kind: "practice", blocks: [
        choice("What is contrary motion?", ["Two voices moving in opposite directions", "Two voices moving together", "One voice standing still"], 0, "The melody climbs, the bass falls."),
        choice("What makes two voices sound independent?", ["Different direction and different rhythm", "Playing them louder", "Using the same notes"], 0, "Two lines, not one."),
        choice("How can you check that you hear the bass as a melody?", ["Sing it on its own", "Play it faster", "Ignore it"], 0, "If you can sing it, you hear it."),
        choice("In bar 1, the melody is A when the bass is F. What interval is that?", ["A 3rd (plus two octaves)", "A 2nd", "A tritone"], 0, "F to A: a major 3rd."),
        ear("Same rhythm in both voices, or independent rhythms?", tabSound(COUNTERPOINT_RHYTHM, 72), ["Same rhythm", "Independent"], 1, "Long notes against short ones."),
        tab(COUNTERPOINT_RHYTHM, "Play along at 56.", 56),
      ] },
    ],
  },
  {
    ...base,
    slug: "arranging-any-song-key-and-tuning",
    title: "Arranging any song: choosing the key and tuning",
    order: 7,
    concepts: ["arrangement-key-choice"],
    needs: ["two-independent-voices", "alternate-tunings"],
    steps: [
      { kind: "understand", blocks: [text(`Before you arrange a song for solo guitar, two choices decide how hard it will be: the **key** and the **tuning**.

**Choose a key with open bass strings.** The guitar's open strings are E, A, D, G, B, E. In keys whose main chords have those roots, the bass is free: the thumb plays open strings and the fretting hand is free for the melody.

| Good fingerstyle keys | Why |
|---|---|
| E, A, D | Open roots for I, IV and V (E: E, A, B; A: A, D, E; D: D, G, A) |
| G, C | Familiar open chords, with open strings throughout |

**Check the melody's range.** Write down the song's highest and lowest melody notes. The melody should sit mostly on strings 1 to 3, above the bass, without needing very high frets.

**Consider an alternate tuning.** **Drop D** (string 6 down to D) gives a deep open D bass for songs in D, and makes D-based chords ring. **DADGAD** and open tunings go further. The Intermediate stage showed how they are notated.

**Use a capo** if the best key for the guitar is not the singer's key: arrange in an easy key, then capo up to theirs.

The example: in drop D, a melody in D over the open low D, two notes at a time.`)] },
      { kind: "listen", blocks: [
        audio("Drop D: melody over the open low D", tabSound(DROP_D_PART, 72, 4, DROP_D)),
      ] },
      { kind: "learn", blocks: [
        tuned(DROP_D_PART, DROP_D, "Drop D: string 6 tuned down to D, played open under the melody.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("Why are E, A and D good fingerstyle keys?", ["Their main chords have open-string roots", "They are the easiest to sing", "They have no sharps"], 0, "The thumb plays open bass strings."),
        choice("What does drop D change?", ["String 6 is tuned down to D", "Every string goes down", "String 1 goes up"], 0, "A deep open D bass."),
        choice("The best guitar key is not the singer's key. What helps?", ["A capo", "Restringing", "Playing faster"], 0, "Arrange in an easy key, capo up."),
        choice("Where should the melody mostly sit?", ["On strings 1 to 3, above the bass", "On string 6", "Above fret 15"], 0, "Room for the thumb below."),
        ear("Is the bass an open low D?", tabSound(DROP_D_PART, 72, 4, DROP_D), ["Yes", "No"], 0, "A deep D under the melody."),
        tuned(DROP_D_PART, DROP_D, "Play along at 60 in drop D.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "complete-solo-guitar-arrangement",
    title: "Study: a complete solo arrangement",
    order: 8,
    minutes: 9,
    concepts: ["solo-guitar-study"],
    needs: ["arranging-any-song-key-and-tuning"],
    steps: [
      { kind: "understand", blocks: [text(`The study piece is "Ode to Joy", bars 1–8, as a complete solo guitar arrangement in C.

**Bars 1–4:** melody on top, an **alternating bass** under it: the root on beat 1, another chord tone on beat 3 (E under C, D under G).

**Bars 5–8:** the same melody, now with an **inner voice** (open G) on each first beat, so the second half is fuller than the first. The final bar ends on a **full C chord**, all five strings ringing.

The techniques you can add once it is solid:

- **Harmonics** on the last chord: tap across fret 12 for a chiming ending.
- **A thumb slap** on beats 2 and 4 in bars 5–8 for a percussive groove.
- **Rubato** at the very end.

How to learn it:

1. Melody alone, then bass alone.
2. Bars 1–4 with both, slowly. Then 5–8.
3. Join them, and make the change in texture at bar 5 audible.
4. Then make it yours: different bass notes, a harmonic, a slap, a slower ending.`)] },
      { kind: "listen", blocks: [
        audio("The complete arrangement", tabSound(STUDY, 88)),
      ] },
      { kind: "learn", blocks: [
        tab(STUDY, "Eight bars: alternating bass first, then an inner voice, ending on a full C.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What changes at bar 5?", ["An inner voice is added on the first beats", "The key changes", "The melody stops"], 0, "The second half is fuller."),
        choice("What does the bass play on beat 3 of a C bar?", ["E, another chord tone", "C again", "F"], 0, "An alternating bass."),
        choice("Which technique gives a chiming ending?", ["Harmonics on the last chord", "Palm muting", "A slide"], 0, "Tap across fret 12."),
        choice("What is the best first step?", ["Melody alone, then bass alone", "Both at full speed", "Only the last bar"], 0, "Each layer first."),
        ear("First half (alternating bass) or second half (inner voice)?", tabSound(STUDY.split(" | ").slice(4).join(" | "), 88), ["First half", "Second half"], 1, "Three notes on each first beat."),
        tab(STUDY, "Play the whole arrangement along at 60.", 60),
      ] },
    ],
  },
];
