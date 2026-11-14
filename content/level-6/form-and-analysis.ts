import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, ear, prog, progression, rhythm, show, staff, text } from "../helpers";

const base = { moduleSlug: "form-and-analysis", isFree: false, version: 1, minutes: 7 } as const;
const A_PHRASE = "E4/q G4/q A4/q G4/q | E4/q D4/q C4/h";
const B_PHRASE = "A4/q C5/q B4/q A4/q | G4/q A4/q B4/h";
const STUDY = prog("C", "I III7 vi I7 IV iv I V7", 84);
const OWN_MELODY = "E4/q G4/q C5/h | C4/q E4/q A4/h | C5/q Ab4/q F4/q Ab4/q | G4/w";

export const formAndAnalysis: LessonInput[] = [
  {
    ...base,
    slug: "song-forms",
    title: "Song forms",
    order: 1,
    concepts: ["song-form"],
    needs: ["twelve-bar-blues", "rhythm-changes"],
    steps: [
      { kind: "understand", blocks: [text(`**Form** is the plan of a piece: which sections it has and in what order. Sections are labelled with letters. A new letter means new music; a repeated letter means the same music again.

Three forms cover most of the songs you will meet.

**Verse–chorus.** The **verse** tells the story: same music each time, new words. The **chorus** carries the main idea: same music and same words each time, usually higher and fuller. Many songs add a **bridge**, a contrasting section heard once, late in the song, and a **pre-chorus** that builds from verse into chorus.

**AABA.** Thirty-two bars in four eight-bar sections. The A section is stated, repeated, left for a contrasting B section, the bridge, and then brought back. Rhythm changes has this form, and so do a great many jazz standards.

**Twelve-bar blues.** One twelve-bar section repeated for the whole song. The words often follow an AAB pattern: a line, the same line again, then an answer.

Knowing the form tells you where you are. When you learn a song, map its sections first. You will find you have far less to memorise than you thought.`)] },
      { kind: "listen", blocks: [
        audio("An A phrase", rhythm(A_PHRASE, 100)),
        audio("A contrasting B phrase: higher, and it ends unfinished", rhythm(B_PHRASE, 100)),
        audio("AABA in miniature", rhythm(`${A_PHRASE} | ${A_PHRASE} | ${B_PHRASE} | ${A_PHRASE}`, 120)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", A_PHRASE, "A: it starts and ends on notes of the home chord.", { time: true, names: true, bpm: 100 }),
        staff("treble", B_PHRASE, "B: it sits higher and stops on B, which wants to move on. That pull is what brings A back.", { time: true, names: true, bpm: 100 }),
      ] },
      { kind: "practice", blocks: [
        choice("In a verse–chorus song, which section keeps the same words every time?", ["The chorus", "The verse", "The bridge"], 0, "The chorus carries the main idea and returns unchanged."),
        choice("How long is a standard AABA form?", ["32 bars", "12 bars", "16 bars"], 0, "Four sections of eight bars."),
        choice("In AABA, what is the B section called?", ["The bridge", "The chorus", "The turnaround"], 0, "A contrasting section that leads back to A."),
        choice("Which form repeats one twelve-bar section throughout?", ["The blues", "AABA", "Verse–chorus"], 0, "Twelve bars, again and again."),
        ear("Two phrases. Is the second the same section or a new one?", rhythm(`${A_PHRASE} | ${B_PHRASE}`, 110), ["The same: A A", "A new one: A B"], 1, "The second phrase is higher and has a different shape."),
        ear("And here?", rhythm(`${A_PHRASE} | ${A_PHRASE}`, 110), ["The same: A A", "A new one: A B"], 0, "The phrase is repeated exactly."),
      ] },
    ],
  },
  {
    ...base,
    slug: "analysing-harmony",
    title: "Analysing the harmony of a song",
    order: 2,
    concepts: ["harmonic-analysis"],
    needs: ["other-secondary-dominants", "modal-interchange", "tritone-substitution", "song-forms"],
    steps: [
      { kind: "understand", blocks: [text(`To analyse a song's harmony is to explain what each chord is doing. It turns a list of chord names into a few ideas you can remember, transpose and reuse.

Work in this order:

1. **Find the key.** Look at the last chord, the key signature, and where the V7 – I movements point.
2. **Label the chords that belong to the key** with Roman numerals.
3. **Explain each outsider.** Nearly always it is one of these:
   - a **secondary dominant**: a dominant seventh that resolves down a fifth to a chord of the key;
   - a **borrowed chord** from the parallel minor;
   - a **tritone substitute**: a dominant seventh that resolves down a half step;
   - a **passing diminished** chord between two neighbours;
   - a **change of key**.

Here is a study progression in C, one chord per bar:

**C – E7 – Am – C7 – F – Fm – C – G7**

- C, Am, F and G7 belong to C major: I, vi, IV, V7.
- **E7** resolves down a fifth to Am: V7 of vi.
- **C7** resolves down a fifth to F: V7 of IV.
- **Fm** is IV turned minor: borrowed from C minor.

Eight chords, three ideas. Use the same steps on songs you already play.`)] },
      { kind: "listen", blocks: [
        audio("The study progression: C, E7, Am, C7, F, Fm, C, G7", STUDY),
        audio("Only the chords of the key: C, Am, F, C, G7", prog("C", "I vi IV I V7", 84)),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "I III7 vi I7 IV iv I V7"), "Step through it. Stop on E7, C7 and Fm and find the notes that are not in C major: G♯, B♭ and A♭."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the first step in analysing a song?", ["Find the key", "Label every chord as I", "Count the bars"], 0, "Numerals only mean something once you know where home is."),
        choice("In C major, E7 goes to Am. What is E7?", ["V7 of vi", "A borrowed chord", "A tritone substitute"], 0, "A dominant seventh resolving down a fifth to a chord of the key."),
        choice("In C major, what is Fm?", ["Borrowed from C minor", "V7 of IV", "The ii chord"], 0, "The iv chord of the parallel minor."),
        choice("A dominant seventh resolves down a half step to the I chord. What is it most likely to be?", ["A tritone substitute", "A secondary dominant", "A borrowed iv chord"], 0, "♭II7 to I, for example D♭7 to C."),
        choice("In G major, a song goes G – B7 – Em. What is B7?", ["V7 of vi", "V7 of IV", "Borrowed from G minor"], 0, "B7 is the dominant of Em, the vi chord of G."),
        ear("Listen to the study progression. Which chord follows F?", STUDY, ["F minor", "G7", "A minor"], 0, "IV turns minor before returning to C."),
      ] },
    ],
  },
  {
    ...base,
    slug: "writing-your-own",
    title: "Writing your own progression and melody",
    order: 3,
    concepts: ["songwriting"],
    needs: ["analysing-harmony", "building-a-melody", "motifs-and-phrasing"],
    steps: [
      { kind: "understand", blocks: [text(`Everything in this course describes choices other musicians have made. Now make your own. Here is a way to begin that works.

**1. Choose a key and a form.** Keep it small: four or eight bars, to be repeated.

**2. Write a progression.** Start from the chords of the key. A dependable shape is: begin at home, move away, pass through a ii or IV chord, reach V, and return. Then add **one** surprise from Levels 5 and 6: a secondary dominant, a borrowed chord, or a substitute. One is enough.

**3. Find a motif.** Two to five notes with a rhythm you can clap. Sing it before you play it.

**4. Build the melody from the motif.** Repeat it, sequence it, change its ending. Put chord tones on the strong beats. Let the last phrase come to rest on a note of the home chord.

**5. Make a contrast.** If you add a second section, change something obvious: start higher, use longer notes, or open on a chord other than I.

**6. Play it, record it, and listen the next day.** Keep what you still like.

Theory explains why something sounds the way it does. It does not tell you what to write. If your ear and a rule disagree, your ear wins. Then use the theory to find out what your ear chose.`)] },
      { kind: "listen", blocks: [
        audio("A four-bar progression in C: C, Am, Fm, G7", prog("C", "I I vi vi iv iv V7 V7", 96)),
        audio("A melody for it, built from one motif", rhythm(OWN_MELODY, 96)),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "I vi iv V7"), "The progression. Three chords from the key and one surprise: F minor, borrowed from C minor."),
        staff("treble", OWN_MELODY, "The melody. Bar 1 states the motif on the notes of C. Bar 2 repeats its shape lower, on the notes of A minor. Bar 3 breaks the pattern and brings in A♭, the borrowed note. Bar 4 rests on G, ready to repeat.", { time: true, names: true, bpm: 96 }),
      ] },
      { kind: "practice", blocks: [
        choice("How many surprise chords does a short progression need?", ["One is enough", "At least four", "None are allowed"], 0, "A single outside chord stands out because the rest is plain."),
        choice("Where should chord tones go in a melody?", ["On the strong beats", "Only at the very end", "Nowhere"], 0, "That is what ties the melody to its harmony."),
        choice("In the example, which chord is the surprise?", ["F minor", "A minor", "G7"], 0, "Fm is borrowed from C minor; the others belong to C major."),
        choice("Bar 4 of the example melody holds G over a G7 chord. Which part of the chord is that?", ["The root", "The third", "The seventh"], 0, "G B D F."),
        choice("What is a simple way to make a second section contrast with the first?", ["Start it higher or on a different chord", "Play the first section again", "Use exactly the same rhythm and notes"], 0, "Contrast needs an obvious change in range, rhythm or harmony."),
        choice("Your ear likes something that a rule says is wrong. What should you do?", ["Keep it, then work out why it works", "Delete it", "Change key"], 0, "Theory describes music. It does not outrank your ear."),
      ] },
    ],
  },
];
