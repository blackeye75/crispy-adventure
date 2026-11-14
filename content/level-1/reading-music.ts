import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, find, pitches, read, seq, show, staff, text, together } from "../helpers";

const base = { moduleSlug: "reading-music", isFree: true, version: 1, minutes: 6 } as const;
const TAB_NOTES = "D3 E3 F3 G3 A3 B3 C4 D4 E4 F4 G4";

export const readingMusic: LessonInput[] = [
  {
    ...base,
    slug: "the-staff-and-treble-clef",
    title: "The staff and the treble clef",
    order: 1,
    concepts: ["treble-clef"],
    needs: ["natural-notes"],
    steps: [
      { kind: "understand", blocks: [text(`Written music sits on a **staff**: five lines and the four spaces between them. The higher a note is on the staff, the higher it sounds. Notes go on lines and in spaces in turn, one letter after another.

A **clef** at the start says which notes the lines stand for. The **treble clef** curls around the second line from the bottom and makes that line G, the G above middle C.

From the bottom up, the lines are **E G B D F** and the spaces are **F A C E**.

Guitar music uses the treble clef, written one octave higher than it sounds so that it fits on the staff.`)] },
      { kind: "listen", blocks: [audio("The notes of the treble staff, from the bottom line to the top line", seq("E4 F4 G4 A4 B4 C5 D5 E5 F5", 90))] },
      { kind: "learn", blocks: [
        staff("treble", "E4/q G4/q B4/q D5/q F5/q", "The five lines, bottom to top: E G B D F.", { names: true }),
        staff("treble", "F4/q A4/q C5/q E5/q", "The four spaces, bottom to top: F A C E.", { names: true }),
      ] },
      { kind: "practice", blocks: [
        choice("Which note is on the bottom line of the treble staff?", ["E", "F", "G"], 0, "The lines are E G B D F, starting from the bottom."),
        choice("From the bottom up, the spaces of the treble staff spell…", ["F A C E", "E G B D", "A C E G"], 0, "The spaces spell FACE."),
        read("treble", "B4/w", ["B", "A", "C"], 0, "It sits on the middle line: E G B."),
        read("treble", "A4/w", ["A", "G", "F"], 0, "It sits in the second space: F A."),
        choice("A note moves from a line to the space just above it. It goes…", ["Up one letter", "Up two letters", "Down one letter"], 0, "Lines and spaces take the letters in turn."),
        choice("Which line does the treble clef curl around?", ["The G line, second from the bottom", "The bottom line, E", "The middle line, B"], 0, "That is why it is also called the G clef."),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-bass-clef",
    title: "The bass clef",
    order: 2,
    concepts: ["bass-clef"],
    needs: ["the-staff-and-treble-clef"],
    steps: [
      { kind: "understand", blocks: [text(`Low notes are written with the **bass clef**. Its two dots sit either side of the second line from the top and make that line F, the F below middle C.

The staff works the same way, but the letters land in different places. From the bottom up, the lines are **G B D F A** and the spaces are **A C E G**.`)] },
      { kind: "listen", blocks: [audio("The notes of the bass staff, from the bottom line to the top line", seq("G2 A2 B2 C3 D3 E3 F3 G3 A3", 90))] },
      { kind: "learn", blocks: [
        staff("bass", "G2/q B2/q D3/q F3/q A3/q", "The five lines, bottom to top: G B D F A.", { names: true }),
        staff("bass", "A2/q C3/q E3/q G3/q", "The four spaces, bottom to top: A C E G.", { names: true }),
      ] },
      { kind: "practice", blocks: [
        read("bass", "D3/w", ["D", "B", "F"], 0, "It sits on the middle line: G B D."),
        read("bass", "C3/w", ["C", "E", "A"], 0, "It sits in the second space: A C."),
        choice("Which note is on the top line of the bass staff?", ["A", "G", "F"], 0, "The lines are G B D F A; A is at the top."),
        choice("Which line do the bass clef's two dots mark?", ["F", "G", "C"], 0, "That is why it is also called the F clef."),
        choice("Which clef is used for low notes?", ["The bass clef", "The treble clef"], 0, "Bass for low, treble for high."),
      ] },
    ],
  },
  {
    ...base,
    slug: "ledger-lines-and-the-grand-staff",
    title: "Ledger lines and the grand staff",
    order: 3,
    concepts: ["ledger-lines"],
    needs: ["the-bass-clef"],
    steps: [
      { kind: "understand", blocks: [text(`Notes that are too high or too low for the staff sit on short extra lines called **ledger lines**.

Middle C is the famous one. It sits on one ledger line below the treble staff, and on one ledger line above the bass staff: the same note, written two ways.

Put a treble staff above a bass staff, join them with a brace, and you have the **grand staff**, which piano music uses. Middle C sits right between the two.`)] },
      { kind: "listen", blocks: [audio("Climbing through middle C, out of the bass staff and into the treble staff", seq("A3 B3 C4 D4 E4", 70))] },
      { kind: "learn", blocks: [{
        type: "notation",
        staves: [{ clef: "treble", notes: "C4/q D4/q E4/q" }, { clef: "bass", notes: "A3/q B3/q C4/q" }],
        names: true,
        caption: "The grand staff. Middle C is on a ledger line in both clefs: first note above, last note below.",
      }] },
      { kind: "practice", blocks: [
        read("treble", "C4/w", ["Middle C", "E", "A"], 0, "One ledger line below the treble staff is middle C."),
        read("bass", "C4/w", ["Middle C", "E", "A"], 0, "One ledger line above the bass staff is middle C too."),
        read("treble", "A5/w", ["A", "G", "C"], 0, "Above the top line F comes G in the space, then A on the first ledger line."),
        choice("What is a ledger line?", ["A short extra line for a note above or below the staff", "The line between two bars", "The top line of the staff"], 0, "Ledger lines extend the staff one note at a time."),
        choice("What is the grand staff made of?", ["A treble staff above a bass staff", "Two treble staves", "One staff with ten lines"], 0, "Treble on top, bass below, joined by a brace."),
      ] },
    ],
  },
  {
    ...base,
    slug: "tab-and-chord-diagrams",
    title: "Reading TAB and chord diagrams",
    order: 4,
    strand: "guitar",
    concepts: ["tab-and-chord-diagrams"],
    needs: ["guitar-layout"],
    steps: [
      { kind: "understand", blocks: [text(`**TAB** shows where to put your fingers, rather than which notes sound. Six lines stand for the six strings. The top line is string 1, the thinnest; the bottom line is string 6.

A number is the fret to press, and 0 means play the string open. Read from left to right. Numbers stacked above one another are played together.

\`\`\`
e|-------------------0-1-3-|
B|-------------0-1-3-------|
G|---------0-2-------------|
D|---0-2-3-----------------|
A|-------------------------|
E|-------------------------|
\`\`\`

A **chord diagram** is a picture of the neck standing upright. Six vertical lines are the strings, with string 6 on the left; the horizontal lines are frets. A dot shows where to press. Above the diagram, O means play that string open and X means do not play it.

The same information is often written as six characters, from string 6 to string 1. A C chord is **x 3 2 0 1 0**.`)] },
      { kind: "listen", blocks: [
        audio("The TAB above, played", seq(TAB_NOTES, 100)),
        audio("The C chord, x 3 2 0 1 0, one string at a time", seq("C3 E3 G3 C4 E4", 80)),
      ] },
      { kind: "learn", blocks: [
        show(pitches(TAB_NOTES, { within: [0, 3] }), "The notes from the TAB, on the neck: strings 4, 3, 2 and 1, frets 0 to 3.", "guitar"),
        show(pitches("C3 E3 G3 C4 E4", { within: [0, 3] }), "The C chord: x 3 2 0 1 0. String 6 is not played; strings 3 and 1 are open.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("In TAB, which string is the top line?", ["String 1, the thinnest", "String 6, the thickest"], 0, "TAB is drawn with the highest string on top."),
        choice("In TAB, what does 0 mean?", ["Play the string open", "Do not play the string", "Press fret 10"], 0, "0 is the open string."),
        find("TAB shows a 3 on the bottom line. Tap that note.", "G2", "The bottom line is string 6, and fret 3 there is G.", { strings: [6], only: "guitar" }),
        find("TAB shows a 2 on the third line from the top. Tap that note.", "A3", "The third line from the top is string 3, and fret 2 there is A.", { strings: [3], only: "guitar" }),
        choice("Above a chord diagram, what does X mean?", ["Do not play that string", "Play that string open", "Press the first fret"], 0, "X is a string left out; O is a string played open."),
      ] },
    ],
  },
  {
    ...base,
    slug: "which-hand-reads-which-clef",
    title: "Which hand reads which clef",
    order: 5,
    strand: "piano",
    concepts: ["hands-and-clefs"],
    needs: ["ledger-lines-and-the-grand-staff"],
    steps: [
      { kind: "understand", blocks: [text(`On the grand staff, the top staff is usually played by the **right hand** and the bottom staff by the **left hand**.

Treble clef on top for the higher notes, bass clef below for the lower ones. Around middle C, either hand may play.

Notes written exactly above one another are played at the same moment.`)] },
      { kind: "listen", blocks: [audio("Left hand low C, right hand E, together", together("C3 E4"))] },
      { kind: "learn", blocks: [{
        type: "notation",
        staves: [{ clef: "treble", notes: "E4/h G4/h | C5/w" }, { clef: "bass", notes: "C3/h C3/h | C3/w" }],
        time: "4/4",
        caption: "The right hand reads the top staff, the left hand the bottom. Notes lined up above each other sound together.",
      }] },
      { kind: "practice", blocks: [
        choice("Which hand usually reads the bass staff?", ["The left hand", "The right hand"], 0, "Bass staff below, left hand; treble staff above, right hand."),
        choice("Two notes are written exactly above one another on the grand staff. You play them…", ["At the same time", "One after the other"], 0, "Left to right is time; up and down is together."),
        { type: "quiz-choice", prompt: "Which hand would usually play this note?", staff: { clef: "bass", notes: "E3/w" }, options: ["The left hand", "The right hand"], answer: 0, why: "It is written in the bass clef." },
        find("Tap the C written in the second space of the bass staff.", "C3", "The bass spaces are A C E G; the second is C3, one octave below middle C.", { only: "piano" }),
      ] },
    ],
  },
];
