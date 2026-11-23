// Playing track P2, Advanced stage (docs/PLAYING.md).
// OWNER REVIEW: everything about the hands (fingering for fast lines, how to play locked hands) and about
// style (swing, how far "outside" to go) is standard teaching written from memory, not checked against a
// pianist. Scales follow the formulas in src/core/theory; the lines and the study solo are original and have
// not been played by anyone. The app plays everything straight. These lessons also still need demo videos.
import type { LessonInput } from "@/core/schemas/content";
import { audio, build, choice, ear, hands, handsSound, rhythm, scale, show, text } from "../helpers";

const base = { moduleSlug: "melody-advanced", track: "piano-melody", stage: "advanced", strand: "piano", isFree: false, version: 1, minutes: 8 } as const;

// Left-hand shells (root and 7th, or root, 7th and 3rd).
const SHELL = { Dm7: "D3+C4", G7: "G2+F3", G7b: "G2+F3+B3", Cmaj7: "C3+B3", A7: "A2+G3", Dm: "D3+A3+C4" };
type Chord = keyof typeof SHELL;
const lh = (names: Chord[]) => names.map((n) => `${SHELL[n]}/w`).join(" | ");

const DORIAN = "D5/8 E5/8 F5/8 A5/8 B5/q A5/q | G5/8 F5/8 E5/8 C5/8 D5/h";
const AEOLIAN = "D5/8 E5/8 F5/8 A5/8 Bb5/q A5/q | G5/8 F5/8 E5/8 C5/8 D5/h";
const CHANGES = "D4/8 F4/8 A4/8 C5/8 E5/q C5/q | B4/8 D5/8 F5/8 E5/8 D5/8 B4/8 G4/q | E4/8 G4/8 B4/8 D5/8 C5/h | r/w";
const BEBOP = "D5/8 E5/8 F5/8 G5/8 A5/8 C6/8 B5/8 A5/8 | G5/8 F#5/8 F5/8 E5/8 D5/8 C5/8 B4/8 A4/8 | F5/8 D#5/8 E5/h. | r/w";
const ENCLOSURE = rhythm("F4/8 D#4/8 E4/h.", 80);
const ALTERED_LINE = "Ab5/8 F5/8 Eb5/8 C#5/8 B4/8 A#4/8 Ab4/8 F4/8 | E4/w";
const DIMINISHED_LINE = "G4/8 Ab4/8 Bb4/8 B4/8 C#5/8 D5/8 E5/8 F5/8 | E5/w";
const MIXO_LINE = "G4/8 A4/8 B4/8 C5/8 D5/8 E5/8 F5/8 D5/8 | E5/w";
const OUTSIDE = "D5/8 F5/8 G5/8 A5/8 C6/8 A5/8 G5/8 F5/8 | Eb5/8 Gb5/8 Ab5/8 Bb5/8 Db6/8 Bb5/8 Ab5/8 Gb5/8 | F5/8 D5/8 C5/8 A4/8 D5/h | r/w";
// Locked hands on C6 (C E G A): a close four-note chord under each melody note, the left hand doubling the melody an octave down.
const LOCKED_RIGHT = "G4+A4+C5+E5/q A4+C5+E5+G5/q C5+E5+G5+A5/q A4+C5+E5+G5/q | G4+A4+C5+E5/w";
const LOCKED_LEFT = "E4/q G4/q A4/q G4/q | E4/w";
const TRADE_RIGHT = "G4/8 Bb4/8 C5/q r/h | r/w | Eb5/8 C5/8 Bb4/q r/h | r/w";
const TRADE_LEFT = "r/w | G2/8 Bb2/8 C3/q r/h | r/w | Eb3/8 C3/8 G2/q r/h";
// The study: Dm7 G7 Cmaj7 A7 | Dm7 G7 Cmaj7 Cmaj7.
const STUDY_CHORDS: Chord[] = ["Dm7", "G7", "Cmaj7", "A7", "Dm7", "G7b", "Cmaj7", "Cmaj7"];
const STUDY = [
  "D5/8 E5/8 F5/8 A5/8 C6/q A5/q", "G5/8 F#5/8 F5/8 E5/8 D5/8 C5/8 B4/8 A4/8", "F4/8 D#4/8 E4/q G4/q B4/q", "C#5/8 E5/8 G5/8 Bb5/8 A5/h",
  "F5/q E5/q D5/q C5/q", "Ab4/8 B4/8 C#5/8 Eb5/8 F5/8 Eb5/8 C#5/8 B4/8", "C5/q E5/q G5/q B5/q", "A5/8 G5/8 E5/8 D5/8 C5/h",
].join(" | ");

export const melodyAdvanced: LessonInput[] = [
  {
    ...base,
    slug: "modal-improvising-at-the-piano",
    title: "Modal improvising",
    order: 1,
    concepts: ["modal-improvising"],
    needs: ["piano-blues-solo-study", "characteristic-notes"],
    steps: [
      { kind: "understand", blocks: [text(`In **modal** music, one chord can last for many bars. There is no chord change to follow, so the colour has to come from the melody itself. The way to get it is the **characteristic note** of the mode, from Level 5.

Over **Dm7**, the usual choice is **D Dorian**: D, E, F, G, A, **B**, C. It is D natural minor with one note changed: **B natural instead of B♭**. That raised 6th is the note that makes Dorian sound like Dorian: minor, but brighter and more hopeful.

So when improvising on D Dorian:

- **Use the B often, and put it on strong beats** or hold it. Play around it and it is just another D minor scale; lean on it and the mode appears.
- **Keep coming back to D**, so the ear stays anchored to the home note.
- **Leave space.** With only one chord, phrases need room to breathe.

Hear the difference: the same line twice, once with **B**, once with **B♭**. Only one note changes, and the mood of the whole phrase moves with it.

The left hand holds D, A and C: the root, fifth and seventh of Dm7, open and still.`)] },
      { kind: "listen", blocks: [
        audio("D Dorian: the line leans on B", handsSound(DORIAN, lh(["Dm", "Dm"]), 84)),
        audio("D Aeolian: the same line with B♭", handsSound(AEOLIAN, lh(["Dm", "Dm"]), 84)),
      ] },
      { kind: "learn", blocks: [
        show(scale("D", "dorian", "degrees"), "D Dorian. The 6 (B) is its characteristic note.", "piano"),
        hands({ right: DORIAN, left: lh(["Dm", "Dm"]) }, "The B lands on beat 3 and is held.", 70),
      ] },
      { kind: "practice", blocks: [
        build("Build D Dorian.", "D E F G A B C", "Natural minor with a raised 6th.", "piano"),
        choice("What is the characteristic note of D Dorian?", ["B, the raised 6th", "F, the minor 3rd", "C, the 7th"], 0, "It is what separates Dorian from natural minor."),
        choice("How do you bring out a mode's colour?", ["Put its characteristic note on strong beats", "Avoid that note", "Play only the root"], 0, "Lean on it."),
        ear("Dorian (B) or Aeolian (B♭)?", handsSound(DORIAN, lh(["Dm", "Dm"]), 84), ["Dorian", "Aeolian"], 0, "Brighter: the raised 6th."),
        ear("Dorian (B) or Aeolian (B♭)?", handsSound(AEOLIAN, lh(["Dm", "Dm"]), 84), ["Dorian", "Aeolian"], 1, "Darker: B♭."),
        hands({ right: DORIAN, left: lh(["Dm", "Dm"]) }, "Play along at 70, then improvise your own Dorian phrases over the same left hand.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "playing-the-changes-at-the-piano",
    title: "Playing the changes",
    order: 2,
    concepts: ["playing-the-changes"],
    needs: ["modal-improvising-at-the-piano", "chord-scale-thinking"],
    steps: [
      { kind: "understand", blocks: [text(`Modal music holds still. Most jazz does the opposite: the chords change every bar or two, and a good solo **changes with them**. That is called **playing the changes**.

The method from Level 6: for each chord, use **its own arpeggio or scale**.

Over a ii–V–I in C:

| Chord | Arpeggio | Scale |
|---|---|---|
| Dm7 | D F A C | D Dorian |
| G7 | G B D F | G Mixolydian |
| Cmaj7 | C E G B | C major (Ionian) |

All three scales contain the same seven notes, so what actually changes is **which notes you emphasise**. Starting each bar on a chord tone does most of the work.

The line in this lesson:

- **Dm7:** straight up the arpeggio, D F A C, and on to E (the 9th).
- **G7:** starts on **B**, the 3rd, and moves through G Mixolydian.
- **Cmaj7:** up its arpeggio and lands on **C**.

Every bar begins on a note of its chord, so the line spells out the harmony even with no left hand at all. Try it: play the right hand alone and you can still hear the changes.`)] },
      { kind: "listen", blocks: [
        audio("A line that follows Dm7, G7, Cmaj7", handsSound(CHANGES, lh(["Dm7", "G7", "Cmaj7", "Cmaj7"]), 92)),
        audio("The same line, no left hand: you can still hear the chords", rhythm(CHANGES, 92)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: CHANGES, left: lh(["Dm7", "G7", "Cmaj7", "Cmaj7"]) }, "Each bar starts on a chord tone: D, B, E.", 72),
      ] },
      { kind: "practice", blocks: [
        build("Build the G7 arpeggio.", "G B D F", "Root, 3rd, 5th, ♭7.", "piano"),
        choice("What does playing the changes mean?", ["Following each chord with its own notes", "Changing key every bar", "Playing only the root"], 0, "The line moves with the harmony."),
        choice("The G7 bar starts on B. What is B in G7?", ["The 3rd", "The root", "The 7th"], 0, "A guide tone, the strongest place to start."),
        choice("Which scale fits G7 in a ii–V–I in C?", ["G Mixolydian", "G major", "G minor"], 0, "Major with a ♭7, the same notes as C major."),
        ear("Is there a chord change in this line?", rhythm(CHANGES, 92), ["Yes: the line follows changing chords", "No: one chord throughout"], 0, "Each bar outlines a different chord."),
        hands({ right: CHANGES, left: lh(["Dm7", "G7", "Cmaj7", "Cmaj7"]) }, "Play along at 72.", 72),
      ] },
    ],
  },
  {
    ...base,
    slug: "bebop-lines-and-enclosures",
    title: "Approach notes, enclosures and bebop lines",
    order: 3,
    concepts: ["bebop-language"],
    needs: ["playing-the-changes-at-the-piano", "approach-notes-and-enclosures"],
    steps: [
      { kind: "understand", blocks: [text(`Two tools give a jazz line its forward motion.

**1. The enclosure.** Before a target note, play the note **above** it, then the note **below** it, then the target. To land on **E** (the 3rd of Cmaj7): **F, D♯, E**. The ear hears the target "surrounded" a moment before it arrives, and the arrival feels inevitable. The note below is usually a half step away; the note above is the scale note.

**2. The bebop scale.** G Mixolydian has seven notes. Add **F♯** between F and G and you get eight:

**G, F♯, F, E, D, C, B, A** (coming down)

Why add a note? Play it in eighth notes starting on beat 1 and the **chord tones of G7 (G, F, D, B) all land on the beats.** With seven notes they would drift off the beat after one bar; the extra passing note keeps them lined up. That is the trick behind thousands of bebop lines.

The line in this lesson:

- **Dm7:** up D Dorian, from D to C and back down to A.
- **G7:** down the bebop scale from G, chord tones on every beat.
- **Cmaj7:** an enclosure, **F, D♯, E**, landing on the 3rd.

Jazz eighth notes are swung; the app plays them straight.`)] },
      { kind: "listen", blocks: [
        audio("An enclosure: F, D♯, E", ENCLOSURE),
        audio("The whole line over ii–V–I", handsSound(BEBOP, lh(["Dm7", "G7", "Cmaj7", "Cmaj7"]), 100)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: BEBOP, left: lh(["Dm7", "G7", "Cmaj7", "Cmaj7"]) }, "Bar 2: G, B, D and F fall on the beats. Bar 3: F, D♯, E.", 76),
      ] },
      { kind: "practice", blocks: [
        choice("What is an enclosure?", ["Notes above and below a target, then the target", "A run of chromatic notes", "A held note"], 0, "The target is surrounded before it lands."),
        choice("Which enclosure lands on E here?", ["F, D♯, E", "D, F, E", "E, E, E"], 0, "Scale note above, half step below."),
        choice("Which note does the G bebop scale add to Mixolydian?", ["F♯", "G♯", "B♭"], 0, "Between F and G."),
        choice("Why add that note?", ["It keeps the chord tones on the beats", "It makes the scale minor", "It is easier to finger"], 0, "Eight notes fit evenly in a bar of eighths."),
        ear("Does the line resolve to C major at the end?", handsSound(BEBOP, lh(["Dm7", "G7", "Cmaj7", "Cmaj7"]), 100), ["Yes, onto E, its 3rd", "No, it stays on G7"], 0, "The enclosure lands on E over Cmaj7."),
        hands({ right: BEBOP, left: lh(["Dm7", "G7", "Cmaj7", "Cmaj7"]) }, "Play along at 76, then try 100.", 76),
      ] },
    ],
  },
  {
    ...base,
    slug: "altered-and-diminished-lines",
    title: "Altered and diminished sounds over dominants",
    order: 4,
    concepts: ["altered-dominant-lines"],
    needs: ["bebop-lines-and-enclosures", "the-altered-scale", "the-diminished-scales"],
    steps: [
      { kind: "understand", blocks: [text(`A dominant chord is the most tense chord in a key, and jazz players like to **add to the tension** just before it resolves. Two scales do it.

**The altered scale** on G: **G, A♭, A♯, B, C♯, E♭, F**. It keeps the parts of G7 that matter (G, B and F) and replaces everything else with **altered tensions**: ♭9 (A♭), ♯9 (A♯), ♯11 (C♯) and ♭13 (E♭). Over G7 it sounds sharp and restless, and that makes the arrival on C sound even sweeter.

**The half-whole diminished scale** on G: **G, A♭, B♭, B, C♯, D, E, F**. Half step, whole step, repeating. It has the ♭9 and ♯9 too, but keeps the natural 5th (D) and 13th (E). Its symmetry gives patterns that repeat every minor third.

Both lines in this lesson end the same way: **F falls to E** as the chord resolves to C. Whatever you do over the dominant, **resolve it cleanly**. Tension only works if it is released.

Compare with plain G Mixolydian, the inside sound. Same chord, three levels of tension.`)] },
      { kind: "listen", blocks: [
        audio("G Mixolydian: inside", handsSound(MIXO_LINE, lh(["G7b", "Cmaj7"]), 88)),
        audio("G altered: maximum tension, then C", handsSound(ALTERED_LINE, lh(["G7b", "Cmaj7"]), 88)),
        audio("G half-whole diminished, then C", handsSound(DIMINISHED_LINE, lh(["G7b", "Cmaj7"]), 88)),
      ] },
      { kind: "learn", blocks: [
        show(scale("G", "altered", "degrees"), "G altered: root, ♭9, ♯9, 3, ♯11, ♭13, ♭7.", "piano"),
        show(scale("G", "diminished-half-whole", "degrees"), "G half-whole diminished: half step, whole step, repeating.", "piano"),
        hands({ right: ALTERED_LINE, left: lh(["G7b", "Cmaj7"]) }, "Down the altered scale, then F falls to E over C.", 70),
      ] },
      { kind: "practice", blocks: [
        build("Build G altered.", "G Ab A# B C# Eb F", "1, ♭9, ♯9, 3, ♯11, ♭13, ♭7.", "piano"),
        choice("Which notes of G7 does the altered scale keep?", ["G, B and F", "G, D and A", "All of them"], 0, "Root, 3rd and 7th; the rest is altered."),
        choice("How is the half-whole diminished scale built?", ["Half step, whole step, repeating", "All whole steps", "The major scale with ♭7"], 0, "Eight notes, symmetrical."),
        choice("What must happen after an altered line?", ["A clean resolution to the next chord", "More tension", "Silence for a bar"], 0, "Tension is only good if it is released."),
        ear("Inside (Mixolydian) or altered?", handsSound(ALTERED_LINE, lh(["G7b", "Cmaj7"]), 88), ["Inside", "Altered"], 1, "A♭, A♯, C♯, E♭: restless."),
        hands({ right: DIMINISHED_LINE, left: lh(["G7b", "Cmaj7"]) }, "Play the diminished line along at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "outside-and-back-at-the-piano",
    title: "Outside playing and resolving",
    order: 5,
    concepts: ["side-slipping"],
    needs: ["altered-and-diminished-lines", "playing-outside"],
    steps: [
      { kind: "understand", blocks: [text(`**Playing outside** means deliberately using notes that do not fit the chord, for a moment, and then coming back. Done well, it sounds bold. Done badly, it sounds like wrong notes. The difference is almost entirely in **how you leave and how you return**.

The simplest outside device is the **side-slip**: play a phrase, then the **same phrase a half step higher**, then come back.

Over Dm7:

1. **Inside:** D minor pentatonic, D F G A C.
2. **Outside:** the same shape a half step up, **E♭ minor pentatonic**: E♭, G♭, A♭, B♭, D♭. Almost every note clashes with Dm7.
3. **Back in:** D minor pentatonic again, ending on **D**.

Why it works: the ear recognises the **shape** as the same idea, so it hears a deliberate move rather than a mistake. And the return to the home key releases the tension.

Rules:

- **Commit.** Play the outside part with the same confidence as the inside part.
- **Keep it short.** A bar is plenty to start with.
- **Land home on a strong beat**, on a chord tone.`)] },
      { kind: "listen", blocks: [
        audio("In, out a half step, and back in", handsSound(OUTSIDE, lh(["Dm", "Dm", "Dm", "Dm"]), 96)),
      ] },
      { kind: "learn", blocks: [
        show(scale("Eb", "minor-pentatonic"), "E♭ minor pentatonic: the outside shape, a half step above D minor pentatonic.", "piano"),
        hands({ right: OUTSIDE, left: lh(["Dm", "Dm", "Dm", "Dm"]) }, "Bar 2 is the same shape a half step up. Bar 3 comes home to D.", 76),
      ] },
      { kind: "practice", blocks: [
        build("Build E♭ minor pentatonic.", "Eb Gb Ab Bb Db", "D minor pentatonic, moved up a half step.", "piano"),
        choice("What is a side-slip?", ["The same phrase a half step away, then back", "Playing very quietly", "Changing the left hand"], 0, "Out by a half step, and back in."),
        choice("Why does a side-slip sound deliberate?", ["The ear recognises the repeated shape", "It is in the key", "It is played loudly"], 0, "Same idea, new place."),
        choice("How should you end an outside passage?", ["Back inside, on a chord tone, on a strong beat", "Still outside", "On a rest"], 0, "The return releases the tension."),
        ear("Which bar is outside: 1, 2 or 3?", handsSound(OUTSIDE, lh(["Dm", "Dm", "Dm", "Dm"]), 96), ["Bar 1", "Bar 2", "Bar 3"], 1, "Everything clashes, then it returns."),
        hands({ right: OUTSIDE, left: lh(["Dm", "Dm", "Dm", "Dm"]) }, "Play along at 76.", 76),
      ] },
    ],
  },
  {
    ...base,
    slug: "locked-hands-and-trading",
    title: "Locked hands and trading between the hands",
    order: 6,
    concepts: ["locked-hands"],
    needs: ["outside-and-back-at-the-piano", "sixths-and-added-notes"],
    steps: [
      // OWNER REVIEW: how locked hands are fingered and balanced.
      { kind: "understand", blocks: [text(`Two ways to use both hands as one melodic instrument.

**1. Locked hands.** Every melody note gets a full chord under it, and the two hands move together like one block. The classic version:

- **Right hand:** the melody on top, with three more notes of the chord close beneath it.
- **Left hand:** the melody again, **an octave lower**.

Over C6 (C, E, G, A), the melody E–G–A–G gets:

| Melody | Right hand (top down) | Left hand |
|---|---|---|
| E | E C A G | E |
| G | G E C A | G |
| A | A G E C | A |

The sound is rich and brassy, like a horn section. Keep the melody notes (top and bottom) slightly stronger than the inner ones, so the tune stays clear.

**2. Trading between the hands.** The right hand plays a phrase; the left hand **answers** it, low on the keyboard. Call and response, but with one player taking both parts. It makes a solo sound like a conversation and gives each hand a rest.

Locked hands are for a phrase or a climax, not a whole solo: they are heavy, and they are hard work.`)] },
      { kind: "listen", blocks: [
        audio("Locked hands on C6", handsSound(LOCKED_RIGHT, LOCKED_LEFT, 80)),
        audio("Right hand calls, left hand answers", handsSound(TRADE_RIGHT, TRADE_LEFT, 88)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: LOCKED_RIGHT, left: LOCKED_LEFT }, "Four-note chords under each melody note; the left hand doubles the melody below.", 60),
        hands({ right: TRADE_RIGHT, left: TRADE_LEFT }, "Trading: the left hand answers each right-hand phrase.", 76),
      ] },
      { kind: "practice", blocks: [
        build("Build C6.", "C E G A", "A major triad plus the 6th.", "piano"),
        choice("In locked hands, what does the left hand play?", ["The melody an octave lower", "The bass line", "Nothing"], 0, "It doubles the tune below the chord."),
        choice("With melody G over C6, which notes does the right hand play?", ["G, E, C, A", "G, B, D, F", "G only"], 0, "Close chord tones under the melody."),
        choice("Where are locked hands best used?", ["For a phrase or a climax", "For every note of a solo", "Only in the bass"], 0, "Heavy and hard work: use them for impact."),
        ear("Locked hands, or a single line?", handsSound(LOCKED_RIGHT, LOCKED_LEFT, 80), ["Locked hands", "Single line"], 0, "Full chords moving with the melody."),
        hands({ right: LOCKED_RIGHT, left: LOCKED_LEFT }, "Play the locked-hands phrase along at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "jazz-solo-study-at-the-piano",
    title: "Study: a solo over a jazz progression",
    order: 7,
    concepts: ["jazz-solo-study"],
    needs: ["locked-hands-and-trading", "turnarounds"],
    steps: [
      { kind: "understand", blocks: [text(`The study piece is an eight-bar solo over a common jazz progression:

\`\`\`
| Dm7 | G7  | Cmaj7 | A7    |
| Dm7 | G7  | Cmaj7 | Cmaj7 |
\`\`\`

Bar 4's **A7** is a secondary dominant (V of ii): it pulls back to Dm7 and starts the cycle again.

It uses the tools from this stage, one per bar:

- **Bar 1, Dm7:** up the arpeggio to C.
- **Bar 2, G7:** down the **bebop scale**, chord tones on the beats.
- **Bar 3, Cmaj7:** an **enclosure**, F, D♯, E.
- **Bar 4, A7:** its arpeggio, C♯ E G, with a **B♭**, the ♭9, before landing on A.
- **Bar 5, Dm7:** a simple stepwise line: space after the busy bars.
- **Bar 6, G7:** the **altered scale**: A♭, B, C♯, E♭, F.
- **Bars 7–8, Cmaj7:** home, up the arpeggio to B, then down to C.

The left hand plays shells: root and 7th, or root, 7th and 3rd for the altered G7.

Learn it in two-bar pieces. Then swing it. Then **replace one bar at a time with your own idea** using the same tool. That is how a vocabulary becomes yours.`)] },
      { kind: "listen", blocks: [
        audio("The whole solo", handsSound(STUDY, lh(STUDY_CHORDS), 100)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: STUDY, left: lh(STUDY_CHORDS) }, "Eight bars: arpeggio, bebop, enclosure, ♭9, space, altered, home.", 72),
      ] },
      { kind: "practice", blocks: [
        choice("What is A7 doing in bar 4?", ["It is V of ii, pulling to Dm7", "It is the tonic", "It ends the piece"], 0, "A secondary dominant."),
        choice("Which tool is used in bar 6 over G7?", ["The altered scale", "D Dorian", "The blues scale"], 0, "A♭, B, C♯, E♭, F."),
        choice("Why is bar 5 so simple?", ["Space after busy bars shapes the solo", "It is a mistake", "Dm7 cannot take fast lines"], 0, "Contrast keeps the listener with you."),
        choice("What is B♭ over A7?", ["The ♭9", "The root", "The 3rd"], 0, "An altered tension."),
        ear("Is bar 3 an enclosure landing on E?", handsSound("F4/8 D#4/8 E4/q G4/q B4/q", `${SHELL.Cmaj7}/w`, 100), ["Yes", "No"], 0, "F, D♯, then E."),
        hands({ right: STUDY, left: lh(STUDY_CHORDS) }, "Play the study along at 72.", 72),
      ] },
    ],
  },
];
