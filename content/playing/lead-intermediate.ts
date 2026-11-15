// Playing track G2, Intermediate stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (how to shift position, play double stops, pre-bend, hold a
// unison bend, and practise for speed) is standard teaching written from memory, not checked against a
// player. Each such passage is marked "OWNER REVIEW" below. The licks and the study solo are original and
// have not been played by anyone. These lessons also still need their demo videos.
import type { LessonInput } from "@/core/schemas/content";
import { audio, backing, choice, ear, find, position, scale, shape, show, tab, tabSound, text } from "../helpers";

const base = { moduleSlug: "lead-intermediate", track: "guitar-lead", strand: "guitar", isFree: false, version: 1, minutes: 7 } as const;
const G = { only: "guitar" } as const;
const BOX = position("A", "minor-pentatonic", 5, 8);

const POS2_UP = "6:8/8 6:10/8 5:7/8 5:10/8 4:7/8 4:10/8 3:7/8 3:9/8 | 2:8/8 2:10/8 1:8/8 1:10/8 1:10/h";
const CLIMB = "3:5/8 3:7/8 3:9/8^s 2:8/8 2:10/8 1:8/8 1:10/8 1:12/8^s | 1:12/w";
const DROP = "3:5/8 3:2/8^s 4:5/8 4:2/8 5:5/8 5:3/8 6:5/q";
const BLUES_UP = "6:5/8 6:8/8 5:5/8 5:6/8 5:7/8 4:5/8 4:7/8 3:5/8 | 3:7/8 3:8/8 2:5/8 2:8/8 1:5/q 1:8/q";
const BLUE_LICK = "3:7/8 3:8/8^h 3:7/8^p 3:5/8^p 4:7/h";
const BLUE_BEND = "3:7/q^bh 3:7/q^r 3:5/q 4:7/q";
const MAJOR_UP = "6:5/8 5:2/8 5:4/8 4:2/8 4:4/8 3:2/8 3:4/8 2:2/8 | 2:5/8 1:2/8 1:5/8 2:5/8 3:2/h";
const MAJOR_LICK = "3:2/8 3:4/8^h 2:2/8 2:5/8 1:2/q 2:5/8 2:2/8 | 3:2/w";
const MINOR_LICK = "3:5/8 3:7/8^h 2:5/8 2:8/8 1:5/q 2:8/8 2:5/8 | 3:7/8 3:5/8^p 4:7/h.";
const MINOR_SCALE_UP = "6:5/8 6:7/8 6:8/8 5:5/8 5:7/8 5:8/8 4:5/8 4:7/8 | 3:4/8 3:5/8 3:7/8 2:5/8 2:6/8 2:8/8 1:5/q";
const HALF_STEPS = "2:6/8 2:5/8 3:7/8 3:5/8 3:4/q 3:5/q";
const TARGET_AM = "3:5/8 3:7/8 2:5/q 2:5/h";
const TARGET_DM = "2:6/8 2:5/8 3:7/q 3:7/h";
const DOUBLE_STOPS = "3:5+2:5/q 3:7+2:8/q 3:5+2:5/h | 2:5+1:5/q 2:8+1:8/q 2:5+1:5/h";
const DOUBLE_LICK = "3:5+2:5/8 3:7+2:8/8 3:5+2:5/q 4:7/h";
const BEND_RELEASE = "3:7/q^b 3:7/q^r 3:5/q 4:7/q";
const PRE_BEND = "3:7/h^pb 3:7/q^r 3:5/q";
const UNISON = "3:7+2:5/h^ub 2:5/h";
const LEGATO_1 = "3:5/8 3:7/8^h 3:5/8^p 3:7/8^h 3:5/8^p 4:7/8 4:5/8^p 4:7/8^h";
const LEGATO_2 = "2:5/8 2:6/8^h 2:8/8^h 2:6/8^p 2:5/8^p 3:7/8 3:5/8^p 3:4/8^p";
const AM_ARPEGGIO = "4:7/8 3:5/8 2:5/8 1:5/8 2:5/8 3:5/8 4:7/q";
const AM7_ARPEGGIO = "4:7/8 3:5/8 2:5/8 2:8/8 1:5/8 2:8/8 2:5/8 3:5/8";
const F_ARPEGGIO = "2:6/8 1:5/8 1:8/8 1:5/8 2:6/h";
const C_ARPEGGIO = "3:5/8 2:5/8 2:8/8 1:8/8 2:8/8 2:5/8 3:5/q";
const THREES = "1:8/8t 1:5/8t 2:8/8t 1:5/8t 2:8/8t 2:5/8t 2:8/8t 2:5/8t 3:7/8t 2:5/8t 3:7/8t 3:5/8t";
const FOURS = "1:8/16 1:5/16 2:8/16 2:5/16 1:5/16 2:8/16 2:5/16 3:7/16 2:8/16 2:5/16 3:7/16 3:5/16 2:5/16 3:7/16 3:5/16 4:7/16";
const MOTIF = "r/8 3:5/8 3:7/8^h 2:5/8 2:5/h";
const BUILD = "r/8 2:5/8 2:8/8^h 1:5/8 1:5/h";
const PEAK = "1:8/q^b 1:8/q^r 1:5/q 2:8/q";
const RESOLVE = "2:5/8 3:7/8 3:5/8^p 4:7/8 4:7/h^v";
const EAR_PHRASE = "3:5/8 3:7/8 2:5/q 3:7/8 3:5/8 4:7/q";
// Study piece over C, G, Am, F, C, G, F, C.
const STUDY_1 = "r/8 3:5/8 3:7/8^h 2:5/8 2:5/h | 2:8/8 2:5/8 3:7/q 3:7/h^v | r/8 3:5/8 3:7/8^h 2:5/8 1:5/h | 1:8/8 1:5/8 2:8/8 2:6/8 2:6/h";
const STUDY_2 = "2:5/8 2:8/8 1:5/8 1:8/8 1:8/h | 1:8/q^b 1:8/q^r 1:7/h | 1:5/8 2:8/8 2:6/8 2:5/8 2:6/h | 2:5/8 3:7/8 3:5/8^p 4:7/8 3:5/h^v";
const C_CHORD = "C3 E3 G3 C4";
const G_CHORD = "G2 D3 G3 B3";
const AM_CHORD = "A2 E3 A3 C4";
const F_CHORD = "F2 C3 F3 A3";
const DM_CHORD = "D3 A3 D4 F4";
const STUDY_BARS: [string, string][] = [["C", C_CHORD], ["G", G_CHORD], ["Am", AM_CHORD], ["F", F_CHORD], ["C", C_CHORD], ["G", G_CHORD], ["F", F_CHORD], ["C", C_CHORD]];

export const leadIntermediate: LessonInput[] = [
  {
    ...base,
    slug: "moving-between-positions",
    title: "Moving between the five positions",
    order: 1,
    concepts: ["position-shifts"],
    needs: ["blues-solo-study-piece", "five-pentatonic-positions"],
    steps: [
      // OWNER REVIEW: shifting by slide.
      { kind: "understand", blocks: [text(`The box is one of **five positions** of the minor pentatonic. Together they cover the whole neck: each one starts where the last one ends, and after the fifth the pattern begins again an octave higher.

In A minor pentatonic:

- **Position 1:** frets 5 to 8. The box.
- **Position 2:** frets 7 to 10.
- **Position 3:** frets 9 to 13.
- **Position 4:** frets 12 to 15.
- **Position 5:** frets 2 to 5, just below the box. The same shape appears again at frets 14 to 17.

Neighbours **share notes**. The higher fret of each string in position 1 is the lower fret of that string in position 2. So you never jump into the unknown; you step across on a note you already have.

Knowing five shapes is not the goal. **Moving** between them is. The smoothest way is a **slide**: play a note at the top of one position and slide it up to the next note of the scale. Your hand arrives in the new position without a gap in the sound.

Two slides out of the box are worth learning first: string 3 from fret 7 to fret 9, and string 2 from fret 8 to fret 10. Both carry you into position 2. Going down, slide string 3 from fret 5 to fret 2 and you are in position 5.`)] },
      { kind: "listen", blocks: [
        audio("Position 2, low to high", tabSound(POS2_UP, 90)),
        audio("Climbing from position 1 through 2 into 3", tabSound(CLIMB, 90)),
        audio("Dropping from position 1 into position 5", tabSound(DROP, 90)),
      ] },
      { kind: "learn", blocks: [
        show(BOX, "Position 1, frets 5 to 8.", "guitar"),
        show(position("A", "minor-pentatonic", 7, 10), "Position 2, frets 7 to 10. Its lower notes are the upper notes of position 1.", "guitar"),
        tab(POS2_UP, "Position 2 with alternate picking.", 60),
        tab(CLIMB, "A climb: slide from 7 to 9 on string 3 into position 2, and from 10 to 12 on string 1 into position 3.", 60),
        tab(DROP, "Going down: slide from 5 to 2 on string 3 into position 5, and walk down to the root.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("How many positions does the pentatonic scale have?", ["Five", "Three", "Seven"], 0, "Then the pattern repeats an octave higher."),
        choice("What do neighbouring positions share?", ["One note on every string", "Nothing", "Only the root"], 0, "The top of one is the bottom of the next."),
        choice("Which frets does position 2 of A minor pentatonic cover?", ["7 to 10", "5 to 8", "9 to 13"], 0, "It starts where the box's upper notes are."),
        find("You slide from fret 7 to fret 9 on string 3. Tap the note you arrive on.", "E4", "String 3, fret 9 is E.", { strings: [3], ...G }),
        tab(POS2_UP, "Play position 2 at 70.", 70),
        tab(CLIMB, "Play the climb at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-blue-note",
    title: "The blues scale and the blue note",
    order: 2,
    concepts: ["blue-note"],
    needs: ["moving-between-positions", "the-blues-scale"],
    steps: [
      { kind: "understand", blocks: [text(`Add one note to the minor pentatonic and you have the **blues scale**. In A, the extra note is **E♭**, sitting between D and E. It is the **♭5**, known as the **blue note**.

A blues scale: **A C D E♭ E G**.

In the box it appears twice:

- **String 5, fret 6.**
- **String 3, fret 8.**

The blue note is the most tense note you have used so far. It clashes with the chord underneath, and that is its purpose. It works because it **moves on**. Treat it as a note to pass through, never one to stop on:

- **On the way up:** D, E♭, E.
- **On the way down:** E, E♭, D.
- **As a hammer-on and pull-off** from D and back.
- **As a bend:** a half-step bend from D reaches it. Many players bend only part of the way and let the pitch hover.

If you land on it and stay there, it sounds like a mistake. If you brush past it, it sounds like the blues.`)] },
      { kind: "listen", blocks: [
        audio("The A blues scale in the box", tabSound(BLUES_UP, 90)),
        audio("A lick that touches the blue note and moves on", tabSound(BLUE_LICK, 80)),
        audio("The blue note as a half-step bend", tabSound(BLUE_BEND, 70)),
      ] },
      { kind: "learn", blocks: [
        show(scale("A", "blues", "degrees"), "The A blues scale by degree. The ♭5 is the blue note.", "guitar"),
        tab(BLUES_UP, "The box with the blue note added: string 5 fret 6, and string 3 fret 8.", 60),
        tab(BLUE_LICK, "Hammer on from D to E♭, pull off back to D, then C and the root.", 60),
        tab(BLUE_BEND, "Bend D up a half step to the blue note, release, and walk down to the root.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("Which note does the blues scale add to A minor pentatonic?", ["E♭", "B", "F"], 0, "The ♭5, between D and E."),
        find("Tap the blue note on string 3.", "Eb4", "String 3, fret 8.", { strings: [3], ...G }),
        choice("How should you use the blue note?", ["Pass through it", "Hold it at the end of a phrase", "Avoid it completely"], 0, "It needs to move on to D or E."),
        choice("Which bend from D reaches the blue note?", ["A half-step bend", "A whole-step bend", "No bend can"], 0, "D up one fret's worth is E♭."),
        tab(BLUE_LICK, "Play the lick at 70.", 70),
        backing("Improvise over A7 with the blues scale. Touch the blue note and keep moving.", [["A7", "A2 E3 G3 C#4"], ["A7", "A2 E3 G3 C#4"], ["D7", "D3 A3 C4 F#4"], ["A7", "A2 E3 G3 C#4"]], 70, scale("A", "blues")),
      ] },
    ],
  },
  {
    ...base,
    slug: "major-pentatonic-lead",
    title: "Major pentatonic, and switching sounds",
    order: 3,
    concepts: ["major-pentatonic-lead"],
    needs: ["the-blue-note", "the-major-pentatonic-scale"],
    steps: [
      { kind: "understand", blocks: [text(`The minor pentatonic sounds tough and bluesy. Its sister, the **major pentatonic**, sounds sweet and open. It is the sound of country, of a great deal of pop, and of the gentler side of the blues.

A major pentatonic is **A B C♯ E F♯**: degrees 1, 2, 3, 5, 6.

You do not need a new shape. **Take the box and move it down three frets**, to fret 2, and keep A as your home note. The fingers play the same pattern; the notes are now A major pentatonic.

What changes is where home is. In the minor box the root was under your first finger on string 6. In this major shape the root, A, is under your **little finger** on string 6, at fret 5. Find it before you start, and end phrases there.

Over a major or dominant chord, both scales work, and good players **switch**:

- **Major pentatonic** when they want a bright, settled sound.
- **Minor pentatonic** when they want grit.

The note that tells them apart is the third. The major scale has **C♯**; the minor has **C**. Moving from one to the other inside a phrase is one of the most recognisable sounds in blues playing.`)] },
      { kind: "listen", blocks: [
        audio("A major pentatonic, starting from the root", tabSound(MAJOR_UP, 90)),
        audio("A lick from A major pentatonic", tabSound(MAJOR_LICK, 80)),
        audio("The same idea in A minor pentatonic", tabSound(MINOR_LICK, 80)),
      ] },
      { kind: "learn", blocks: [
        show(position("A", "major-pentatonic", 2, 5), "A major pentatonic at frets 2 to 5: the box shape, three frets lower. The gold markers are A.", "guitar"),
        tab(MAJOR_UP, "From the root on string 6, fret 5, up through the shape.", 60),
        tab(MAJOR_LICK, "A major lick. It ends on the root, string 3 fret 2.", 60),
        tab(MINOR_LICK, "The minor answer, back in the box at fret 5.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("How do you turn the A minor box into A major pentatonic?", ["Move it down three frets and keep A as home", "Move it up three frets", "Play it backwards"], 0, "Same shape at fret 2, with A as the root."),
        choice("Which notes are in A major pentatonic?", ["A B C♯ E F♯", "A C D E G", "A B C D E"], 0, "Degrees 1, 2, 3, 5 and 6."),
        find("In the major shape, tap the root A on string 6.", "A2", "String 6, fret 5, under the little finger.", { strings: [6], ...G }),
        choice("Which note separates the major from the minor sound?", ["The third: C♯ or C", "The root", "The fifth"], 0, "A major third or a minor third above A."),
        ear("Major or minor pentatonic?", tabSound(MAJOR_LICK, 80), ["Major", "Minor"], 0, "Bright and settled, with C♯ in it."),
        tab(MAJOR_LICK, "Play the major lick at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "soloing-with-full-scales",
    title: "Soloing with the full scale",
    order: 4,
    concepts: ["full-scale-lead"],
    needs: ["major-pentatonic-lead", "the-natural-minor-scale"],
    steps: [
      { kind: "understand", blocks: [text(`The pentatonic has five notes. The full **natural minor scale** has seven. In A, the two extra notes are **B** and **F**.

Those two notes change the character of your lines, because each one sits a **half step** from a pentatonic note:

- **B** is a half step below C.
- **F** is a half step above E.

The pentatonic has no half steps at all, which is why it never sounds wrong and never sounds very tender either. Half steps are what make a line **sing**: F falling to E, or B rising to C, has a pull that no pentatonic move has.

You do not need a new position. Around the box, add:

- **B:** string 6 fret 7, string 3 fret 4, string 1 fret 7.
- **F:** string 5 fret 8, string 2 fret 6.

The same seven notes are the **C major scale**. Over a song in C major, play exactly this pattern and treat C as home.

A warning: with seven notes it is easy to run up and down the scale. Keep the pentatonic as the skeleton of your phrases and use B and F as the notes that lead into it.`)] },
      { kind: "listen", blocks: [
        audio("A natural minor around the box", tabSound(MINOR_SCALE_UP, 90)),
        audio("The two half steps: F to E, and B to C", tabSound(HALF_STEPS, 80)),
      ] },
      { kind: "learn", blocks: [
        show(position("A", "natural-minor", 4, 8), "A natural minor at frets 4 to 8. Compare it with the box: B and F are the new notes.", "guitar"),
        tab(MINOR_SCALE_UP, "The full scale from the root on string 6.", 60),
        tab(HALF_STEPS, "F falls to E; later B rises to C. Listen to the pull of each half step.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("Which two notes does A natural minor add to A minor pentatonic?", ["B and F", "C♯ and F♯", "E♭ and B♭"], 0, "The 2nd and the ♭6th."),
        choice("What do those two notes bring?", ["Half steps", "Louder notes", "A new key"], 0, "Each sits a half step from a pentatonic note."),
        find("Tap F on string 2.", "F4", "String 2, fret 6, a half step above E.", { strings: [2], ...G }),
        choice("A natural minor has the same notes as which major scale?", ["C major", "A major", "G major"], 0, "Its relative major."),
        tab(MINOR_SCALE_UP, "Play the scale at 70.", 70),
        backing("Improvise over Am and Dm. Lean on F falling to E.", [["Am", AM_CHORD], ["Am", AM_CHORD], ["Dm", DM_CHORD], ["Am", AM_CHORD]], 70, position("A", "natural-minor", 4, 8)),
      ] },
    ],
  },
  {
    ...base,
    slug: "following-the-chords",
    title: "Targeting chord tones as the chords change",
    order: 5,
    concepts: ["chord-tone-targeting"],
    needs: ["soloing-with-full-scales", "targeting-chord-tones"],
    steps: [
      { kind: "understand", blocks: [text(`One scale can fit a whole progression, and still a solo can sound as if it is ignoring the band. The cure is to **land on a note of the chord that is playing**.

Each chord has three notes. When the chord changes, the strong notes change with it.

Take two chords in A minor:

- **Am** is A, C, E.
- **Dm** is D, F, A.

Over Am, a phrase that ends on A, C or E sounds settled. Play the same ending over Dm and E no longer belongs; D, F or A does.

You do not have to think about this on every note. Think about it at **two moments**:

- **The first beat of a new chord.** This is where the ear checks.
- **The last note of a phrase**, the one you hold.

Everything in between can run through the scale freely.

The most telling note to aim for is usually the **third** of the chord, because it is the note that says major or minor. The third of Dm is **F**, which is not in the A minor pentatonic at all. Reaching for it is what makes a line sound as if it knows the chords.`)] },
      { kind: "listen", blocks: [
        audio("Over Am: a phrase that lands on E, the fifth", tabSound(TARGET_AM, 80)),
        audio("Over Dm: a phrase that starts on F, the third, and lands on D, the root", tabSound(TARGET_DM, 80)),
        audio("One after the other", tabSound(`${TARGET_AM} | ${TARGET_DM}`, 80)),
      ] },
      { kind: "learn", blocks: [
        show(shape("4:7 3:5 2:5"), "The notes of Am in the box: A, C, E.", "guitar"),
        show(shape("3:7 2:6 1:5"), "The notes of Dm nearby: D, F, A.", "guitar"),
        tab(`${TARGET_AM} | ${TARGET_DM}`, "Bar 1 is over Am and rests on E. Bar 2 is over Dm: it starts on F and rests on D.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("When do chord tones matter most?", ["On the first beat of a chord and the last note of a phrase", "On every single note", "Never"], 0, "Those are the moments the ear checks."),
        choice("Which notes make a D minor chord?", ["D, F, A", "D, F♯, A", "D, E, G"], 0, "Root, minor third, fifth."),
        find("The chord changes to Dm. Tap its third on string 2.", "F4", "String 2, fret 6.", { strings: [2], ...G }),
        choice("Why is the third of a chord a strong target?", ["It says whether the chord is major or minor", "It is the lowest note", "It is always in the pentatonic"], 0, "It carries the chord's character."),
        tab(`${TARGET_AM} | ${TARGET_DM}`, "Play both bars at 70.", 70),
        backing("Two bars of Am, two of Dm. End each phrase on a note of the chord.", [["Am", AM_CHORD], ["Am", AM_CHORD], ["Dm", DM_CHORD], ["Dm", DM_CHORD]], 70, position("A", "natural-minor", 4, 8)),
      ] },
    ],
  },
  {
    ...base,
    slug: "double-stops",
    title: "Double stops",
    order: 6,
    concepts: ["double-stops"],
    needs: ["following-the-chords"],
    steps: [
      // OWNER REVIEW: fretting two strings with one finger.
      { kind: "understand", blocks: [text(`A **double stop** is two notes played together, on neighbouring strings. It sits between a single note and a chord, and it makes a lead line sound thicker without turning it into rhythm guitar.

The box is full of them, because so many of its notes line up at the same fret:

- **Strings 2 and 1 at fret 5:** E and A.
- **Strings 2 and 1 at fret 8:** G and C.
- **Strings 3 and 2 at fret 5:** C and E.

When both notes are at the same fret, lay **one finger flat across the two strings**. When they are at different frets, such as string 3 at fret 7 with string 2 at fret 8, use two fingers.

Pick both strings in one small stroke, and only those two. Mute the strings on either side with the spare fingers of the fretting hand, or with the edge of the picking hand, so stray strings do not ring.

Ways to use them:

- **Slide** a double stop into place from a fret or two below.
- **Answer** a single-note phrase with a double stop.
- Play a short run of them as a riff between vocal lines.`)] },
      { kind: "listen", blocks: [
        audio("Double stops in the box", tabSound(DOUBLE_STOPS, 80)),
        audio("A lick that starts with two and ends on the root", tabSound(DOUBLE_LICK, 80)),
      ] },
      { kind: "learn", blocks: [
        tab(DOUBLE_STOPS, "Bar 1 on strings 3 and 2; bar 2 on strings 2 and 1.", 60),
        tab(DOUBLE_LICK, "Two double stops, then a single note home to the root.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What is a double stop?", ["Two notes played together", "A note played twice", "A very short note"], 0, "Usually on neighbouring strings."),
        choice("Both notes are at fret 5 on strings 2 and 1. How do you fret them?", ["One finger flat across both", "Two fingers stacked", "With the thumb"], 0, "A small barre over two strings."),
        choice("Which two notes sound on strings 2 and 1 at fret 5?", ["E and A", "C and E", "G and C"], 0, "String 2 fret 5 is E; string 1 fret 5 is A."),
        ear("Single notes or double stops?", tabSound(DOUBLE_STOPS, 80), ["Single notes", "Double stops"], 1, "Two notes sound on every strum."),
        tab(DOUBLE_STOPS, "Play along at 70.", 70),
        tab(DOUBLE_LICK, "Play the lick at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "bend-types",
    title: "More bends: release, pre-bend and unison",
    order: 7,
    concepts: ["bend-types"],
    needs: ["double-stops", "first-bends"],
    steps: [
      // OWNER REVIEW: how each bend is executed.
      { kind: "understand", blocks: [text(`You can bend a note up to pitch. Three more kinds of bend turn that one move into a vocabulary.

**Bend and release.** Bend up, then let the string back down **while it is still ringing**. You hear two notes from one pick stroke: up, and back. Keep the pressure on as you release, or the note dies.

**Pre-bend.** Bend the string **before** you pick it. The listener hears the high note first, and then you release it down to the fretted note. It sounds like a sigh. The difficulty is that you cannot hear the bend while you make it; your hand has to know how far a whole step is. Practise by bending normally, memorising the feel, and then doing it silently.

**Unison bend.** Two strings at once. Hold a note on string 2 and, at the same time, bend a note on string 3 **up to the same pitch**. In the box: string 2 at fret 5 is E; string 3 at fret 7 is D, bent a whole step to E. As the bend arrives the two notes beat against each other and then lock. It is a big, shouting sound.

All three depend on the thing the first bends lesson taught: knowing the target and reaching it in tune.

In the tab, a release is marked **rel** and a pre-bend **pre**.`)] },
      { kind: "listen", blocks: [
        audio("Bend and release: D up to E and back to D", tabSound(BEND_RELEASE, 70)),
        audio("Pre-bend: the high note first, then released", tabSound(PRE_BEND, 70)),
        audio("Unison bend, then the plain note for comparison", tabSound(UNISON, 70)),
      ] },
      { kind: "learn", blocks: [
        tab(BEND_RELEASE, "Bend fret 7 up a whole step, release it, then C and the root. One pick stroke covers the first two notes.", 60),
        tab(PRE_BEND, "Bend first, then pick. You hear E, and it falls back to D.", 60),
        tab(UNISON, "Hold string 2 at fret 5 and bend string 3 at fret 7 up to meet it.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("In a bend and release, how many times do you pick?", ["Once", "Twice", "Three times"], 0, "The string keeps ringing as it comes back down."),
        choice("In a pre-bend, when do you bend?", ["Before picking the note", "After the note has rung", "While sliding"], 0, "The listener hears the bent pitch first."),
        choice("In a unison bend, what must the bent note reach?", ["The pitch of the note on the other string", "One fret higher", "An octave higher"], 0, "Two strings, one pitch."),
        find("For the unison bend in the box, tap the note held on string 2.", "E4", "String 2, fret 5. String 3 at fret 7 is bent up to match it.", { strings: [2], ...G }),
        ear("Which do you hear first, the low note or the high note?", tabSound(PRE_BEND, 70), ["The low note", "The high note"], 1, "A pre-bend starts on the bent pitch and falls."),
        tab(BEND_RELEASE, "Play along at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "legato-phrases",
    title: "Legato phrases",
    order: 8,
    concepts: ["legato-phrases"],
    needs: ["bend-types", "hammer-ons-and-pull-offs-in-the-box"],
    steps: [
      { kind: "understand", blocks: [text(`**Legato** means smooth and connected. On the guitar it means playing a run of notes with as few pick strokes as possible, letting hammer-ons and pull-offs do the work.

In the Basic stage you joined two notes. Now join **several**: pick once, then hammer on, pull off, hammer on again, all on one string, before crossing to the next.

The rule of thumb is **one pick stroke per string**. Pick the first note on a string, play the rest of that string's notes with the fretting hand, then pick again when you change string.

With the full scale there are **three notes on a string** in places, which gives longer chains: pick, hammer, hammer going up; pick, pull, pull coming down.

What to listen for:

- **Even volume.** A legato line fails when the hammered and pulled notes are quieter than the picked ones. Hammer firmly; pull off with a sideways flick.
- **Even time.** It is tempting to rush the easy notes. Use the click.
- **Quiet strings.** With the pick doing less, stray noise shows more. Keep unused strings damped.

Legato is also the first step towards speed. The fretting hand can move faster than the two hands can stay in step.`)] },
      { kind: "listen", blocks: [
        audio("One pick stroke per string, in the box", tabSound(LEGATO_1, 90)),
        audio("Three notes on a string, with the full scale", tabSound(LEGATO_2, 90)),
      ] },
      { kind: "learn", blocks: [
        tab(LEGATO_1, "Pick only the first note on each string. Everything marked h or p is the fretting hand.", 60),
        tab(LEGATO_2, "String 2: pick, hammer, hammer, pull, pull. Then string 3: pick, pull, pull.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What does legato mean?", ["Smooth and connected", "Short and detached", "Very loud"], 0, "Notes that run into each other."),
        choice("What is the rule of thumb for picking a legato line?", ["One pick stroke per string", "Pick every note", "Never pick"], 0, "The fretting hand plays the rest."),
        choice("What most often spoils a legato line?", ["Hammered and pulled notes that are too quiet", "Too many pick strokes", "Playing too slowly"], 0, "Every note should be the same volume."),
        choice("In the second example, how many notes does string 2 carry before the pick is needed again?", ["Five", "Two", "Eight"], 0, "Pick, hammer, hammer, pull, pull."),
        tab(LEGATO_1, "Play along at 70.", 70),
        tab(LEGATO_2, "Play along at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "arpeggios-in-solos",
    title: "Arpeggios in solos",
    order: 9,
    concepts: ["arpeggios-lead"],
    needs: ["legato-phrases", "following-the-chords"],
    steps: [
      { kind: "understand", blocks: [text(`An **arpeggio** is a chord played one note at a time. In a solo it is the most direct way there is to follow the harmony: you play the chord itself, as a melody.

Scales move by step. Arpeggios move by **leap**, in thirds and fourths. Mixing the two is what keeps a solo from sounding like an exercise.

In the box, the arpeggios of the nearby chords are already under your fingers:

- **A minor (A C E):** string 4 fret 7, string 3 fret 5, string 2 fret 5, string 1 fret 5.
- **Am7 (A C E G):** the same, with G on string 2 at fret 8.
- **C major (C E G):** string 3 fret 5, string 2 fret 5, string 2 fret 8, string 1 fret 8.
- **F major (F A C):** string 2 fret 6, string 1 fret 5, string 1 fret 8.

How to use them:

- **At a chord change**, play the new chord's arpeggio for a beat or two, then go back to the scale.
- **To start a phrase:** leap up an arpeggio, then come down by step.
- **To end one:** an arpeggio always lands on a chord tone.

Notice that Am7 and C major share three notes: C, E and G. That is why a C major arpeggio over an A minor chord sounds rich, not wrong.`)] },
      { kind: "listen", blocks: [
        audio("A minor arpeggio, up and down", tabSound(AM_ARPEGGIO, 90)),
        audio("Am7", tabSound(AM7_ARPEGGIO, 90)),
        audio("C major, then F major", tabSound(`${C_ARPEGGIO} | ${F_ARPEGGIO}`, 90)),
      ] },
      { kind: "learn", blocks: [
        tab(AM_ARPEGGIO, "A minor: A, C, E, A and back.", 60),
        tab(AM7_ARPEGGIO, "Am7: the same with G added on string 2.", 60),
        tab(C_ARPEGGIO, "C major: C, E, G, C.", 60),
        tab(F_ARPEGGIO, "F major: F, A, C.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What is an arpeggio?", ["A chord played one note at a time", "A scale played quickly", "Two notes together"], 0, "The chord, as a melody."),
        choice("How do arpeggios move, compared with scales?", ["By leap", "By step", "They do not move"], 0, "In thirds and fourths."),
        choice("Which notes make an Am7 arpeggio?", ["A C E G", "A C E", "A B C D"], 0, "The A minor triad with its seventh."),
        find("Tap the note that turns the A minor arpeggio into Am7, on string 2.", "G4", "String 2, fret 8.", { strings: [2], ...G }),
        ear("Scale or arpeggio?", tabSound(AM_ARPEGGIO, 90), ["Scale: it moves by step", "Arpeggio: it moves by leap"], 1, "Each note skips over a scale note."),
        tab(`${AM_ARPEGGIO} | ${F_ARPEGGIO}`, "A minor, then F major, at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "sequences-for-speed",
    title: "Sequences, and building speed",
    order: 10,
    concepts: ["sequences"],
    needs: ["arpeggios-in-solos", "triplets"],
    steps: [
      // OWNER REVIEW: the practice method for speed.
      { kind: "understand", blocks: [text(`A **sequence** is a short pattern repeated from each note of the scale in turn. Sequences are the classic way to build fluency: they take your fingers through every corner of a position, and they sound like music, not like a scale.

Two to learn in the box, both going down:

**Threes.** Play three notes down the scale, go back one, play three more. In triplets it runs: 1-2-3, 2-3-4, 3-4-5.

**Fours.** The same with groups of four, in sixteenth notes: 1-2-3-4, 2-3-4-5, 3-4-5-6.

**Building speed** is a method, not an effort:

1. **Find the tempo where it is perfect.** Every note clean, even, in time. That may be very slow.
2. **Raise the click a little**, five beats per minute, and play it again.
3. **When it breaks, go back down** two steps and stay there.
4. **Stop when you feel tension.** A tight hand is slow and gets injured. Shake it out.

Speed is a side effect of accuracy repeated many times. Ten minutes a day works better than an hour once a week.

The practice room has a tempo trainer that raises the click for you as you loop.`)] },
      { kind: "listen", blocks: [
        audio("Threes, in triplets", tabSound(THREES, 70)),
        audio("Fours, in sixteenth notes", tabSound(FOURS, 60)),
      ] },
      { kind: "learn", blocks: [
        tab(THREES, "Threes, coming down the box. Each group starts one note lower than the last.", 50),
        tab(FOURS, "Fours, in sixteenth notes.", 50),
      ] },
      { kind: "practice", blocks: [
        choice("What is a sequence?", ["A short pattern repeated from each note in turn", "A scale played once", "A kind of bend"], 0, "The same shape, moved step by step."),
        choice("How should you choose your starting tempo?", ["The speed at which it is perfect", "As fast as you can manage", "The speed of the recording"], 0, "Accuracy first; speed follows."),
        choice("The pattern falls apart at a new tempo. What do you do?", ["Go back down and stay there", "Push on faster", "Play it louder"], 0, "Repeat what is clean."),
        choice("What should you do when your hand feels tense?", ["Stop and shake it out", "Grip harder", "Ignore it"], 0, "Tension slows you and risks injury."),
        tab(THREES, "Threes at 60.", 60),
        tab(FOURS, "Fours at 55.", 55),
      ] },
    ],
  },
  {
    ...base,
    slug: "shaping-a-solo",
    title: "Shaping a solo",
    order: 11,
    concepts: ["solo-shape"],
    needs: ["sequences-for-speed", "call-and-response"],
    steps: [
      { kind: "understand", blocks: [text(`You now have plenty to play. The question is what order to play it in. A solo that starts at full intensity has nowhere to go. A good one has a **shape**, like a short story.

A dependable plan in five parts:

1. **Motif.** Open with one short, clear idea, low on the neck and not too busy. Leave space after it.
2. **Repetition.** Play it again, or nearly. Now the listener knows it.
3. **Build.** Move the idea **higher**, make the phrases a little longer, play a little harder.
4. **Peak.** One high point: the highest note, the biggest bend, held. Place it about two thirds of the way through. There should be only one.
5. **Resolve.** Come back down, calm the rhythm, and land on the root.

The tools for building are the ones you have collected:

- **Register:** low to high.
- **Density:** few notes to many.
- **Volume and attack:** gentle to strong.
- **Technique:** plain notes first; bends, double stops and fast runs later.

Hold something back at the start. The peak only sounds high if what came before was lower.`)] },
      { kind: "listen", blocks: [
        audio("Motif", tabSound(MOTIF, 80)),
        audio("Build: the same idea, higher", tabSound(BUILD, 80)),
        audio("Peak: a bend at the top of the box", tabSound(PEAK, 80)),
        audio("Resolve: down to the root", tabSound(RESOLVE, 80)),
        audio("All four in a row", tabSound(`${MOTIF} | ${BUILD} | ${PEAK} | ${RESOLVE}`, 80)),
      ] },
      { kind: "learn", blocks: [
        tab(`${MOTIF} | ${BUILD}`, "Bar 1 is the motif. Bar 2 keeps its rhythm and shape, one string higher.", 60),
        tab(`${PEAK} | ${RESOLVE}`, "Bar 3 is the peak: the highest note of the solo, bent. Bar 4 comes home.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("How should a solo usually begin?", ["With a short, clear idea and some space", "With the fastest run you know", "On the highest note"], 0, "Leave yourself somewhere to go."),
        choice("How many peaks should a short solo have?", ["One", "Three", "As many as possible"], 0, "One high point, placed late."),
        choice("Which of these builds intensity?", ["Moving higher and playing more notes", "Repeating the same low note", "Stopping"], 0, "Register and density are the main levers."),
        ear("Is the second phrase higher or lower than the first?", tabSound(`${MOTIF} | ${BUILD}`, 80), ["Higher", "Lower"], 0, "The same shape, moved up."),
        tab(`${MOTIF} | ${BUILD} | ${PEAK} | ${RESOLVE}`, "Play the whole shape at 70.", 70),
        backing("Now shape your own solo over A7 and D7: motif, repeat, build, peak, resolve.", [["A7", "A2 E3 G3 C#4"], ["A7", "A2 E3 G3 C#4"], ["D7", "D3 A3 C4 F#4"], ["A7", "A2 E3 G3 C#4"]], 70, BOX),
      ] },
    ],
  },
  {
    ...base,
    slug: "working-out-solos-by-ear",
    title: "Working out solos by ear",
    order: 12,
    concepts: ["transcribing"],
    needs: ["shaping-a-solo"],
    steps: [
      { kind: "understand", blocks: [text(`Every guitarist you admire learned by copying solos from recordings. Tab is quicker, and it teaches you much less. Working a solo out by ear trains the link between what you hear and what your hands do, and that link is what improvising is.

A method that works:

1. **Find the home note.** Listen to the song and hum the note it comes to rest on. Find that note on string 6. It tells you the key.
2. **Lay the box over it.** Put position 1 of the minor pentatonic on that root. Most rock and blues solos live in or near it.
3. **Take one short phrase.** Three to six notes. Loop it.
4. **Sing it.** If you cannot sing it, you have not heard it yet.
5. **Find the first note.** Then ask of each next note: higher, lower or the same? By a little or a lot?
6. **Get the rhythm right** as well as the notes. Clap it if you need to.
7. **Listen for how each note is reached:** picked, bent, slid or hammered. A bend to a pitch sounds different from the fretted note.
8. **Move on** to the next phrase, and join them.

Slow the recording down if you can. Most players and apps will do it without changing the pitch.

Start with slow, melodic solos. The first one takes days. The tenth takes an evening.`)] },
      { kind: "listen", blocks: [
        audio("A short phrase to work out. It starts on C in the box.", tabSound(EAR_PHRASE, 70)),
        audio("The same phrase, slower", tabSound(EAR_PHRASE, 50)),
      ] },
      { kind: "learn", blocks: [
        show(BOX, "Lay the box over the root. Tap notes here to test what you hear.", "guitar"),
        tab(EAR_PHRASE, "The answer. Try to find the phrase on your guitar before you play this.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What is the first step in working out a solo?", ["Find the home note of the song", "Look for the tab", "Play every scale you know"], 0, "The home note gives you the key and the position."),
        choice("Why sing a phrase before playing it?", ["If you cannot sing it, you have not really heard it", "To warm up your voice", "It is not useful"], 0, "Singing proves the phrase is in your ear."),
        ear("Listen to the phrase. Does its second note go up or down from the first?", tabSound(EAR_PHRASE, 70), ["Up", "Down"], 0, "C up to D."),
        ear("On which note does it end?", tabSound(EAR_PHRASE, 70), ["The root, A", "The fifth, E"], 0, "It comes to rest on A."),
        choice("How long should the piece you loop be?", ["A few notes", "The whole solo", "A whole verse"], 0, "Short enough to hold in your head."),
        tab(EAR_PHRASE, "Check yourself: play along at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "melodic-solo-study-piece",
    title: "Study piece: a melodic solo over four chords",
    order: 13,
    minutes: 10,
    concepts: ["melodic-solo-study"],
    needs: ["working-out-solos-by-ear"],
    steps: [
      { kind: "understand", blocks: [text(`This solo is about melody, not speed. It runs over eight bars in **C major**, one chord per bar:

**C – G – Am – F – C – G – F – C**

Every note comes from the pattern you learned around the box at fret 5. Over these chords it is the C major scale, and its five-note core is C major pentatonic, the same notes as A minor pentatonic.

What to notice as you learn it:

- **Each bar ends on a note of its chord.** Bar 1 rests on E over C. Bar 2 rests on D over G. Bar 3 rests on A over Am. Bar 4 rests on F over F.
- **Bars 1 and 3 are the same motif** with a different ending, so the solo has something to remember.
- **The second half starts higher.** Bar 5 climbs to the top of the box.
- **Bar 6 is the peak:** a bend from C up to D over the G chord, released, then B, the third of G.
- **Bars 7 and 8 come home**, ending on C.

There are no fast notes. What will make it sound good is tone: clean bends, vibrato on the long notes, and time that sits with the backing.

Learn it four bars at a time, then play it over the backing track.`)] },
      { kind: "listen", blocks: [
        audio("Bars 1 to 4: C, G, Am, F", tabSound(STUDY_1, 80)),
        audio("Bars 5 to 8: C, G, F, C", tabSound(STUDY_2, 80)),
      ] },
      { kind: "learn", blocks: [
        tab(STUDY_1, "Bars 1 to 4.", 60),
        tab(STUDY_2, "Bars 5 to 8.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("In which key is the solo?", ["C major", "A major", "G major"], 0, "It starts and ends on C."),
        choice("Bar 4 is over an F chord. On which note does it rest?", ["F", "E", "G"], 0, "The root of the chord."),
        choice("Where is the peak of the solo?", ["Bar 6: the bend from C up to D", "Bar 1", "The last note"], 0, "The highest and most intense moment, placed late."),
        tab(STUDY_1, "Bars 1 to 4 at 70.", 70),
        tab(STUDY_2, "Bars 5 to 8 at 70.", 70),
        backing("The backing track. Play the solo over it, then make up your own.", STUDY_BARS, 70, position("C", "major", 4, 8)),
      ] },
    ],
  },
];
