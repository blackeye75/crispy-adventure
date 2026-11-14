import type { LessonInput } from "@/core/schemas/content";
import { along, audio, choice, dynamic, ear, find, pitches, rhythm, seq, shape, show, staff, text } from "../helpers";

const base = { moduleSlug: "expression", isFree: false, version: 1, minutes: 6 } as const;
const guitar = { ...base, strand: "guitar" } as const;
const piano = { ...base, strand: "piano" } as const;
const G = { only: "guitar" } as const;

export const expression: LessonInput[] = [
  {
    ...guitar,
    slug: "hammer-ons-and-pull-offs",
    title: "Hammer-ons and pull-offs",
    order: 1,
    concepts: ["hammer-ons-and-pull-offs"],
    needs: ["five-pentatonic-positions", "tab-and-chord-diagrams"],
    steps: [
      { kind: "understand", blocks: [text(`Not every note has to be picked. Two techniques let the fretting hand sound a note by itself.

A **hammer-on** goes up: pick a note, then bring another finger down firmly on a higher fret of the same string. The second note sounds without being picked.

A **pull-off** goes down: with both fingers in place, pick the higher note, then pull that finger off sideways so that it plucks the string and the lower note sounds.

Notes joined this way run smoothly into each other. That connected sound is called **legato**.

In TAB a hammer-on is marked **h** and a pull-off **p**: 5h7 means pick fret 5 and hammer on to fret 7; 7p5 is the reverse.`)] },
      { kind: "listen", blocks: [
        audio("The two notes of a hammer-on: fret 5 to fret 7 on string 3", seq("C4 D4", 100)),
        audio("The two notes of a pull-off: fret 7 to fret 5", seq("D4 C4", 100)),
      ] },
      { kind: "learn", blocks: [
        text(`\`\`\`
G|--5h7--7p5--5h7p5--|
\`\`\``),
        show(shape("3:5 3:7"), "String 3, frets 5 and 7: C and D. Hammer on from 5 to 7, pull off from 7 to 5.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("In a hammer-on, which note is picked?", ["Only the first, lower note", "Only the second note", "Both notes"], 0, "The second note is sounded by the fretting finger."),
        choice("What does 7p5 mean in TAB?", ["Pick fret 7, then pull off to fret 5", "Pick fret 5, then hammer on to fret 7", "Play frets 7 and 5 together"], 0, "p is a pull-off, from the higher note to the lower."),
        choice("A hammer-on moves in which direction?", ["To a higher note", "To a lower note", "To another string"], 0, "Hammer-ons go up, pull-offs go down."),
        find("TAB says 5h7 on string 3. Tap the note you arrive on.", "D4", "Fret 7 of string 3 is D.", { strings: [3], ...G }),
        choice("What is the smooth, connected sound of these techniques called?", ["Legato", "Staccato", "Vibrato"], 0, "Legato means joined together."),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "slides",
    title: "Slides",
    order: 2,
    concepts: ["slides"],
    needs: ["hammer-ons-and-pull-offs"],
    steps: [
      { kind: "understand", blocks: [text(`A **slide** joins two notes by gliding along the string. Pick a note and, keeping the finger pressed down, move it up or down to another fret. You hear the pitch travel between them.

In TAB a slide up is written with a forward slash and a slide down with a backslash: 5/7 slides from fret 5 up to fret 7; 7\\5 slides back down.

Slides do two jobs. They add a vocal, swooping quality to a note. And they move your hand: a slide is one of the smoothest ways to get from one position on the neck to the next.`)] },
      { kind: "listen", blocks: [
        audio("The two ends of a slide up: fret 5 to fret 7 on string 3", seq("C4 D4", 100)),
        audio("And of a slide down: fret 9 to fret 7", seq("E4 D4", 100)),
      ] },
      { kind: "learn", blocks: [
        text(`\`\`\`
G|--5/7-----9\\7--|
\`\`\``),
        show(shape("3:5 3:7 3:9"), "String 3, frets 5, 7 and 9: C, D and E. Slide between them without lifting the finger.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("During a slide, what does the fretting finger do?", ["Stays pressed down while it moves", "Lifts off between the notes", "Plucks the string"], 0, "Keeping the pressure on is what makes the pitch glide."),
        choice("What does 5/7 mean in TAB?", ["Slide from fret 5 up to fret 7", "Slide from fret 7 down to fret 5", "Play fret 5, then rest"], 0, "A forward slash slides up."),
        find("TAB says 9\\7 on string 3. Tap the note you arrive on.", "D4", "Fret 7 of string 3 is D.", { strings: [3], ...G }),
        choice("Besides its sound, what is a slide useful for?", ["Moving the hand to a new position", "Tuning the guitar", "Muting the strings"], 0, "You arrive in the next position without a break."),
      ] },
    ],
  },
  {
    ...guitar,
    slug: "bends-and-vibrato",
    title: "Bends and vibrato",
    order: 3,
    concepts: ["bends-and-vibrato"],
    needs: ["slides"],
    steps: [
      { kind: "understand", blocks: [text(`A **bend** raises a note by pushing the string sideways across the fretboard, stretching it tighter.

Bends are measured against real notes. A **half-step bend** must reach the pitch of the next fret up. A **whole-step bend** must reach the pitch two frets up. The way to practise is to play the target fret first, listen, and then bend up until the two match.

**Vibrato** is a small, repeated bend and release on a held note. It makes the pitch waver slightly and the note sing.

In TAB a bend is marked **b**, a release **r**, and vibrato with a wavy line: 7b9 means fret 7 bent up to the pitch of fret 9.

A bend that stops short of its target sounds out of tune. Pitch matters more than speed.`)] },
      { kind: "listen", blocks: [
        audio("The start and the target of a whole-step bend: D up to E", seq("D4 E4", 70)),
        audio("The start and the target of a half-step bend: D up to E♭", seq("D4 Eb4", 70)),
      ] },
      { kind: "learn", blocks: [
        text(`\`\`\`
G|--7b9--9r7--7~~~--|
\`\`\``),
        show(shape("3:7 3:8 3:9"), "String 3. Bending at fret 7 by a half step must sound like fret 8; by a whole step, like fret 9.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("A whole-step bend should reach the pitch of…", ["The note two frets higher", "The note one fret higher", "The note an octave higher"], 0, "A whole step is two frets."),
        choice("What does 7b9 mean in TAB?", ["Bend fret 7 up to the pitch of fret 9", "Slide from fret 7 to fret 9", "Play frets 7 and 9 together"], 0, "b is a bend; the second number is the pitch to reach."),
        find("You bend string 3 at fret 7 by a half step. Tap the fret whose pitch you should reach.", "Eb4", "A half step above D, at fret 8.", { strings: [3], ...G }),
        choice("How do you check that a bend is in tune?", ["Play the target fret first and match it", "Bend as far as the string will go", "Bend as fast as possible"], 0, "The target note is the reference."),
        choice("What is vibrato?", ["A small repeated bend and release on a held note", "A very fast slide", "Picking a note many times"], 0, "It makes a sustained note waver and sing."),
        ear("This is the start and target of a bend. Half step or whole step?", seq("A4 B4", 70), ["Whole step", "Half step"], 0, "A to B is two frets."),
      ] },
    ],
  },
  {
    ...piano,
    slug: "dynamics",
    title: "Dynamics: loud and soft",
    order: 4,
    concepts: ["dynamics"],
    needs: ["hands-together"],
    steps: [
      { kind: "understand", blocks: [text(`**Dynamics** are how loudly or softly music is played. On the piano they come from how fast the key goes down, not from how hard you press once it is there.

The markings are Italian:

- **p**, piano: soft. **pp** is very soft.
- **mp** and **mf**, mezzo piano and mezzo forte: medium soft and medium loud.
- **f**, forte: loud. **ff** is very loud.

A **crescendo** gets gradually louder; a **diminuendo** gets gradually softer. Both are drawn as long hairpin shapes under the notes.

Dynamics shape a phrase the way a voice rises and falls in speech. A melody played all at one level sounds flat, however right the notes are.`)] },
      { kind: "listen", blocks: [
        audio("Soft: piano", dynamic("C4 E4 G4 C5", 0.2)),
        audio("Loud: forte", dynamic("C4 E4 G4 C5", 1)),
      ] },
      { kind: "learn", blocks: [show(pitches("C4 E4 G4 C5"), "Play these four notes softly, then loudly. Only the speed of the key changes.", "piano")] },
      { kind: "practice", blocks: [
        choice("What does the marking p mean?", ["Soft", "Loud", "Pedal"], 0, "p is short for piano, Italian for soft."),
        choice("What does f mean?", ["Loud", "Fast", "Soft"], 0, "f is short for forte."),
        choice("What is a crescendo?", ["Getting gradually louder", "Getting gradually softer", "Getting gradually faster"], 0, "Its opposite is a diminuendo."),
        choice("On the piano, what makes a note louder?", ["The key going down faster", "Holding the key longer", "Pressing harder after the note has sounded"], 0, "The hammer's speed decides the volume."),
        ear("Soft or loud?", dynamic("G4 E4 C4", 0.2), ["Soft: piano", "Loud: forte"], 0, "The notes are played gently."),
        ear("And this?", dynamic("G4 E4 C4", 1), ["Soft: piano", "Loud: forte"], 1, "The same notes, played strongly."),
      ] },
    ],
  },
  {
    ...piano,
    slug: "articulation",
    title: "Articulation: legato and staccato",
    order: 5,
    concepts: ["articulation"],
    needs: ["dynamics"],
    steps: [
      { kind: "understand", blocks: [text(`**Articulation** is how notes begin, end and join up.

- **Legato** means smoothly connected. Each note is held until the next begins, with no gap. It is shown by a curved line, a slur, over the notes.
- **Staccato** means short and detached. Each note is released early, leaving a little silence before the next. It is shown by a dot above or below the note.
- An **accent**, a small sideways arrowhead, asks for one note to be played more strongly than those around it.

The same notes at the same volume can sound gentle or crisp depending on articulation alone.`)] },
      { kind: "listen", blocks: [
        audio("Legato: each note runs into the next", rhythm("C4/q D4/q E4/q F4/q", 90)),
        audio("Staccato: the same notes, short and detached", rhythm("C4/8 r/8 D4/8 r/8 E4/8 r/8 F4/8 r/8", 90)),
      ] },
      { kind: "learn", blocks: [staff("treble", "C4/q D4/q E4/q F4/q | C4/8 r/8 D4/8 r/8 E4/8 r/8 F4/8 r/8", "Bar 1 as legato playing sounds: full-length notes. Bar 2 as staccato playing sounds: short notes with gaps.", { time: true, bpm: 90 })] },
      { kind: "practice", blocks: [
        choice("What does legato mean?", ["Smoothly connected", "Short and detached", "Very loud"], 0, "No gaps between the notes."),
        choice("How is staccato marked?", ["A dot above or below the note", "A curved line over the notes", "The letter s"], 0, "The dot shortens the note."),
        choice("What does a slur, a curved line over several notes, ask for?", ["Legato", "Staccato", "A pause"], 0, "Join the notes smoothly."),
        ear("Legato or staccato?", rhythm("G4/8 r/8 E4/8 r/8 C4/8 r/8 E4/8 r/8", 90), ["Staccato", "Legato"], 0, "Each note is cut short."),
        ear("And this?", rhythm("G4/q E4/q C4/q E4/q", 90), ["Staccato", "Legato"], 1, "Each note lasts until the next one starts."),
        along("Play C D E F legato, then staccato, along with the track.", rhythm("C4/q D4/q E4/q F4/q | C4/8 r/8 D4/8 r/8 E4/8 r/8 F4/8 r/8", 70), 70),
      ] },
    ],
  },
  {
    ...piano,
    slug: "the-sustain-pedal",
    title: "The sustain pedal",
    order: 6,
    concepts: ["sustain-pedal"],
    needs: ["articulation", "accompaniment-patterns"],
    steps: [
      { kind: "understand", blocks: [text(`The **sustain pedal** is the one on the right. Inside the piano, each string has a damper that stops it ringing when you let go of the key. Pressing the pedal lifts all the dampers at once, so every note you play keeps sounding after your fingers leave.

It is marked **Ped.** under the staff, with a star or the end of a bracket where it is released.

The pedal joins notes the hands cannot hold and gives the instrument a warm, ringing tone. Its danger is blur: hold it through a change of chord and the two harmonies smear together.

So the rule is to **change the pedal when the harmony changes**: lift and press again as the new chord sounds.`)] },
      { kind: "listen", blocks: [
        audio("Without pedal: each note stops when the next begins", rhythm("C3/q G3/q E4/q G3/q", 80)),
        audio("With pedal: the notes ring on and build a chord", { kind: "progression", chords: [["C3", "G3", "E4", "C5"], ["C3", "G3", "E4", "C5"]] }),
      ] },
      { kind: "learn", blocks: [show(pitches("C3 G3 E4 C5"), "A wide C major chord. With the pedal down you can play these one at a time and they all keep ringing.", "piano")] },
      { kind: "practice", blocks: [
        choice("Which pedal is the sustain pedal?", ["The right one", "The left one", "The middle one"], 0, "It is under the right foot."),
        choice("What does the sustain pedal do?", ["Lifts the dampers so notes keep ringing", "Makes the piano quieter", "Raises the pitch"], 0, "Notes sound on after the keys are released."),
        choice("How is the pedal marked in written music?", ["Ped.", "sus.", "P"], 0, "With a star or bracket end where it is released."),
        choice("When should the pedal be changed?", ["When the harmony changes", "On every single note", "Only at the end of the piece"], 0, "Otherwise the old chord blurs into the new one."),
        choice("What happens if the pedal is held through several different chords?", ["They blur together", "They get louder", "Nothing"], 0, "All the strings keep ringing at once."),
      ] },
    ],
  },
];
