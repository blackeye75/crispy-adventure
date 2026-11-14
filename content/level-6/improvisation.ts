import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, ear, find, prog, rhythm, scale, seq, show, staff, text } from "../helpers";

const base = { moduleSlug: "improvisation", isFree: false, version: 1, minutes: 7 } as const;
const MOTIF = "E4/8 G4/8 A4/q G4/h";
const SEQUENCE = "E4/8 G4/8 A4/q G4/h | D4/8 F4/8 G4/q F4/h";
const DISPLACED = "E4/8 G4/8 A4/q G4/h | r/q E4/8 G4/8 A4/q G4/q";
const ENCLOSURE = "F4 D#4 E4";
const OUTSIDE = "D4 F4 G4 A4 Eb4 Gb4 Ab4 Bb4 D4 F4 G4 A4";

export const improvisation: LessonInput[] = [
  {
    ...base,
    slug: "chord-scale-thinking",
    title: "Chord-scale thinking",
    order: 1,
    concepts: ["chord-scales"],
    needs: ["parallel-modes", "targeting-chord-tones", "lydian-dominant"],
    steps: [
      { kind: "understand", blocks: [text(`**Chord-scale thinking** pairs every chord with a scale. The chord supplies four notes; the scale fills the gaps between them with notes that suit that chord.

The basic pairs:

- **maj7:** Ionian, or Lydian for a brighter sound.
- **m7:** Dorian.
- **7:** Mixolydian. Lydian dominant, altered or half–whole diminished when you want more tension.
- **m7♭5:** Locrian, or Locrian natural 2.
- **°7:** whole–half diminished.

In a ii–V–I in C this gives D Dorian, G Mixolydian and C Ionian. Those are all the same seven notes. So inside one key, chord-scale thinking does not change **which** notes you play. It changes which ones you treat as strong: the chord tones of the moment.

The method earns its keep when a chord leaves the key. See D♭7 in a tune in C and you know at once what to play: D♭ Lydian dominant.

Two cautions. Some scale notes clash if you sit on them: over Cmaj7, the F is a half step above the chord's third. Use such notes in passing. And a scale is only a pool of notes. Melodies still come from aiming at chord tones.`)] },
      { kind: "listen", blocks: [
        audio("Dm7, G7, Cmaj7", prog("C", "ii7 V7 Imaj7", 76)),
        audio("One line through it: D Dorian, G Mixolydian, C Ionian", seq("D4 E4 F4 A4 G4 F4 D4 B3 C4 E4 G4 B4", 132)),
        audio("F held over Cmaj7: a note to pass through, not rest on", { kind: "chord", notes: ["C3", "E3", "G3", "B3", "F4"] }),
        audio("F♯ instead: the Lydian choice", { kind: "chord", notes: ["C3", "E3", "G3", "B3", "F#4"] }),
      ] },
      { kind: "learn", blocks: [
        show(scale("D", "dorian", "degrees"), "D Dorian for Dm7. The chord tones are 1, ♭3, 5 and ♭7."),
        show(scale("G", "mixolydian", "degrees"), "G Mixolydian for G7. Same notes, new chord tones: 1, 3, 5 and ♭7."),
        show(scale("Db", "lydian-dominant", "degrees"), "D♭ Lydian dominant for D♭7, a chord from outside the key of C."),
      ] },
      { kind: "practice", blocks: [
        choice("Which scale is the basic choice for a minor seventh chord?", ["Dorian", "Lydian", "Locrian"], 0, "1 2 ♭3 4 5 6 ♭7 contains the whole m7 chord."),
        choice("Which scale is the basic choice for a dominant seventh chord?", ["Mixolydian", "Ionian", "Dorian"], 0, "The major scale with a lowered 7th."),
        choice("D Dorian, G Mixolydian and C Ionian have what in common?", ["The same seven notes", "The same home note", "Nothing"], 0, "All three are the C major scale."),
        choice("Which scale fits a half-diminished chord?", ["Locrian or Locrian natural 2", "Mixolydian", "Lydian"], 0, "Both contain 1, ♭3, ♭5 and ♭7."),
        find("Over Cmaj7, tap the note of C major you should not rest on.", "F", "F is a half step above E, the third of the chord."),
        choice("A tune in C has a D♭7 chord. Which scale fits it?", ["D♭ Lydian dominant", "C major", "D Dorian"], 0, "D♭7 is the tritone substitute of G7, and Lydian dominant suits it."),
      ] },
    ],
  },
  {
    ...base,
    slug: "motifs-and-phrasing",
    title: "Motifs and phrasing",
    order: 2,
    concepts: ["motif-development", "phrasing"],
    needs: ["building-a-melody", "syncopation"],
    steps: [
      { kind: "understand", blocks: [text(`Knowing the right notes does not make a solo. A stream of correct notes with no shape is hard to listen to. What listeners follow is an **idea that develops**.

A **motif** is a short idea: three to five notes with a clear rhythm. State it, then do something with it:

- **Repeat it.** The second time, the listener recognises it.
- **Sequence it.** Play the same shape starting on another note of the scale.
- **Change its ending.** Keep the start and alter the last note or two.
- **Displace it.** Start it on a different beat.
- **Shorten it.** Use only its first or last few notes.

**Phrasing** is how ideas are spaced. Good phrases behave like sentences:

- They end. Leave a rest before the next one.
- They vary in length.
- They answer each other. One phrase asks, the next replies. This is **call and response**.

Silence is part of the solo. A rest gives the listener time to take in what you played.`)] },
      { kind: "listen", blocks: [
        audio("A motif", rhythm(MOTIF, 96)),
        audio("In sequence: the same shape one step lower", rhythm(SEQUENCE, 96)),
        audio("Displaced: the second time it starts a beat late", rhythm(DISPLACED, 96)),
        audio("Call and response", rhythm("E4/8 G4/8 A4/q G4/q r/q | A4/8 G4/8 E4/q C4/q r/q", 96)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", MOTIF, "The motif: two short notes up, one long note at the top, then a step back.", { time: true, names: true, bpm: 96 }),
        staff("treble", SEQUENCE, "A sequence. Bar 2 has the same shape and rhythm, one scale step lower.", { time: true, names: true, bpm: 96 }),
        staff("treble", DISPLACED, "Displacement. In bar 2 the same notes begin on beat 2.", { time: true, names: true, bpm: 96 }),
      ] },
      { kind: "practice", blocks: [
        choice("What is a motif?", ["A short musical idea", "A scale played quickly", "The chords of a song"], 0, "A few notes with a clear rhythm, small enough to remember."),
        choice("What is a sequence?", ["The same shape started on a different note", "The same notes played backwards", "A long rest"], 0, "The contour and rhythm stay; the pitch level moves."),
        choice("What does displacing a motif change?", ["The beat it starts on", "Its notes", "Its key"], 0, "The notes are the same; they arrive at a different place in the bar."),
        ear("The motif is played twice. What happened the second time?", rhythm(SEQUENCE, 96), ["It moved one step lower", "It started on a later beat", "Nothing changed"], 0, "Same rhythm and shape, from D instead of E."),
        ear("And here?", rhythm(DISPLACED, 96), ["It moved one step lower", "It started on a later beat", "Nothing changed"], 1, "Same notes, entering after a one-beat rest."),
        choice("Why leave rests between phrases?", ["So ideas can be heard as separate sentences", "Because fast playing is wrong", "To keep the solo short"], 0, "Space lets the listener take in each idea, and lets you plan the next."),
      ] },
    ],
  },
  {
    ...base,
    slug: "approach-notes-and-enclosures",
    title: "Approach notes and enclosures",
    order: 3,
    concepts: ["approach-notes", "enclosures"],
    needs: ["passing-and-neighbour-tones", "chord-scale-thinking"],
    steps: [
      { kind: "understand", blocks: [text(`You know that strong lines land on chord tones. Jazz lines add one more thing: they **decorate the landing**, often with notes from outside the scale.

A **chromatic approach note** sits a half step below or above a chord tone and moves straight into it. Over a C chord, D♯ to E, or F♯ to G. It does not matter that D♯ and F♯ are not in C major. They are short, they fall on a weak part of the beat, and they resolve at once.

An **enclosure** surrounds the target from both sides before landing on it. The usual form: the scale note **above**, the half step **below**, then the **target**. To land on E over a C chord: **F, D♯, E**.

Two things make these work:

- **The target is a chord tone.**
- **The target falls on the beat.** The decoration comes just before it, on the weak part of the beat.

Reverse that, with the outside note on the beat and held, and the same notes sound like mistakes.`)] },
      { kind: "listen", blocks: [
        audio("Plain: the C major triad, C E G", seq("C4 E4 G4", 100)),
        audio("Each note approached from a half step below", rhythm("r/8 B3/8 C4/8 D#4/8 E4/8 F#4/8 G4/q", 100)),
        audio("An enclosure of E: F, D♯, E", seq(ENCLOSURE, 120)),
        audio("Enclosing C, E and G in turn", rhythm("D4/8 B3/8 C4/q F4/8 D#4/8 E4/q | A4/8 F#4/8 G4/h r/q", 100)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", "r/8 D#4/8 E4/q r/8 F#4/8 G4/q", "Approach notes: D♯ into E, F♯ into G. Each target is a note of the C chord.", { time: true, names: true }),
        staff("treble", "F4/8 D#4/8 E4/h r/q", "An enclosure: the note above, the half step below, then the target, E.", { time: true, names: true }),
      ] },
      { kind: "practice", blocks: [
        choice("What is a chromatic approach note?", ["A note a half step from a chord tone that moves into it", "Any note of the scale", "The root of the next chord"], 0, "It is brief and resolves straight away."),
        choice("What is the usual order of an enclosure?", ["Note above, half step below, target", "Target, note above, note below", "Half step below, target, note above"], 0, "The target comes last, surrounded from both sides."),
        find("Over a C chord, tap the note a half step below the third.", "D#", "The third is E. A half step below is D♯."),
        choice("Where should the target note fall?", ["On the beat", "Just before the beat", "It makes no difference"], 0, "The chord tone on the beat is what makes the outside notes sound intended."),
        choice("Which enclosure targets G over a C chord?", ["A, F♯, G", "F, D♯, E", "D, B, C"], 0, "The scale note above G is A; the half step below is F♯."),
        ear("Which note of the C chord is being enclosed?", seq(ENCLOSURE, 120), ["C", "E", "G"], 1, "F above, D♯ below, landing on E."),
      ] },
    ],
  },
  {
    ...base,
    slug: "playing-outside",
    title: "Playing outside and coming back",
    order: 4,
    concepts: ["playing-outside"],
    needs: ["approach-notes-and-enclosures", "motifs-and-phrasing", "the-diminished-scales"],
    steps: [
      { kind: "understand", blocks: [text(`**Playing outside** means deliberately using notes that do not belong to the chord or key, for longer than a passing note. Done well it sounds daring. Done badly it sounds lost. The notes are the same in both cases. The difference is **structure** and **return**.

Three ways to go outside:

- **Side-slipping.** Play a phrase, play the same phrase a half step higher or lower, then play it again where it started. The shape tells the listener it is on purpose.
- **Borrowing a substitute.** Over G7, play from D♭7, its tritone substitute. You know that sound as the altered scale.
- **Symmetric scales.** Whole-tone and diminished patterns have no key of their own, so they pull away from any key.

And the rules that make it work:

- **Start inside.** The listener needs to know where home is before you leave.
- **Keep the rhythm and the shape strong.** A clear motif carries wrong notes. A vague one does not.
- **Come back.** Land on a chord tone, on a strong beat. The return is what turns tension into meaning.

Outside playing is tension and release at the largest scale. Use it rarely and it will count.`)] },
      { kind: "listen", blocks: [
        audio("Inside: a phrase from D Dorian", seq("D4 F4 G4 A4", 132)),
        audio("Side-slipping: the phrase, a half step up, then home again", seq(OUTSIDE, 132)),
        audio("Without the return: it never settles", seq("D4 F4 G4 A4 Eb4 Gb4 Ab4 Bb4", 132)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", "D4/8 F4/8 G4/8 A4/8 Eb4/8 Gb4/8 Ab4/8 Bb4/8 | D4/8 F4/8 G4/8 A4/8 D5/h", "Side-slipping over Dm7. Beats 3 and 4 of bar 1 repeat the shape a half step higher; bar 2 returns.", { time: true, names: true, bpm: 100 }),
        show(scale("D", "dorian"), "Inside: D Dorian."),
        show(scale("Eb", "dorian"), "Outside: E♭ Dorian, a half step up. Five of its seven notes are not in D Dorian."),
      ] },
      { kind: "practice", blocks: [
        choice("What is side-slipping?", ["Moving a phrase a half step away and back", "Playing behind the beat", "Changing to the relative minor"], 0, "The repeated shape makes the outside notes sound planned."),
        choice("What makes outside playing sound intended?", ["A clear shape and a return to a chord tone", "Playing as fast as possible", "Avoiding the root"], 0, "Structure on the way out, resolution on the way back."),
        choice("Over G7, which chord can you borrow notes from to go outside?", ["D♭7", "Cmaj7", "Dm7"], 0, "The tritone substitute. Its notes are the altered sound over G7."),
        choice("Why do symmetric scales sound outside?", ["They have no key of their own", "They have too many notes", "They are always played loudly"], 0, "An even pattern has no home note, so it pulls away from the key."),
        ear("Does this phrase come back inside?", seq(OUTSIDE, 132), ["Yes", "No"], 0, "The last four notes are the opening phrase again, in D Dorian."),
        choice("Where should you land when you come back?", ["On a chord tone, on a strong beat", "On any outside note", "On a rest"], 0, "A firm landing is what resolves the tension."),
      ] },
    ],
  },
];
