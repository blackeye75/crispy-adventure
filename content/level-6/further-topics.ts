import type { LessonInput } from "@/core/schemas/content";
import { audio, build, chordOf, chords, choice, ear, find, pitches, scale, seq, shape, show, text, together } from "../helpers";

const base = { moduleSlug: "further-topics", isFree: false, version: 1, minutes: 7 } as const;
const QUARTAL = together("D3 G3 C4");
const SO_WHAT = "E3 A3 D4 G4 B4";
const C7_SHELL = "C3 E3 Bb3";
const C13_SHARP11 = together(`${C7_SHELL} D4 F#4 A4`);
const C_LYDIAN = "C4 D4 E4 F#4 G4 A4 B4 C5";
const C_PHRYGIAN = "C4 Db4 Eb4 F4 G4 Ab4 Bb4 C5";

export const furtherTopics: LessonInput[] = [
  {
    ...base,
    slug: "quartal-harmony",
    title: "Quartal harmony",
    order: 1,
    concepts: ["quartal-harmony"],
    needs: ["fourths-fifths-and-the-tritone", "modal-progressions", "sus-and-power-chords"],
    steps: [
      { kind: "understand", blocks: [text(`Every chord so far has been built by stacking **thirds**. Stack **fourths** instead and you get **quartal harmony**.

Three notes a fourth apart: **D G C**. Listen to what is missing. There is no third above the bottom note, so the chord is neither major nor minor. It sounds open, modern and a little undecided. You already know a relative of this sound: the sus4 chord.

That openness is why quartal chords suit **modal** music. A mode wants to hover around its home note without the strong pull of V – I. Quartal chords have no leading tone and no tritone to resolve, so they can slide up and down the scale freely. Build one on each note of D Dorian and you have a full set of chords for a D Dorian vamp.

A famous five-note version stacks three fourths and puts a major third on top: **E A D G B**. It is known as the **So What chord**, after the 1959 Miles Davis tune where it answers the bass melody.

On the guitar, fourths are close to hand. Strings 6, 5, 4 and 3 are tuned a fourth apart, so the notes at one fret across those four strings are already a stack of fourths.`)] },
      { kind: "listen", blocks: [
        audio("Stacked thirds: D minor", together("D3 F3 A3")),
        audio("Stacked fourths: D G C", QUARTAL),
        audio("Quartal chords moving through D Dorian", chords("D3 G3 C4", "E3 A3 D4", "G3 C4 F4", "E3 A3 D4", "D3 G3 C4")),
        audio("The So What chord: E A D G B", together(SO_WHAT)),
      ] },
      { kind: "learn", blocks: [
        show(pitches("D3 G3 C4"), "D G C: each note a perfect fourth above the last."),
        show(shape("6:5 5:5 4:5 3:5"), "One fret across strings 6 to 3 gives stacked fourths. At fret 5: A D G C.", "guitar"),
        show(shape("5:7 4:7 3:7 2:8 1:7"), "The So What chord: E A D G B. Three fourths, then a major third on top."),
      ] },
      { kind: "practice", blocks: [
        choice("Quartal chords are built by stacking which interval?", ["Fourths", "Thirds", "Fifths"], 0, "Quartal, from the word for four."),
        build("Build a quartal chord of three notes, starting on D.", "D G C", "A fourth above D is G; a fourth above G is C."),
        choice("Why does D G C sound neither major nor minor?", ["It has no third above the bottom note", "It has too many notes", "It has a tritone"], 0, "The third is what decides major or minor."),
        find("Tap the note a perfect fourth above G.", "C", "Five half steps above G."),
        choice("The So What chord stacks three fourths. What is the top interval?", ["A major third", "Another fourth", "A minor second"], 0, "E A D G, then B, a major third above G."),
        ear("Stacked thirds or stacked fourths?", QUARTAL, ["Thirds", "Fourths"], 1, "Open and unsettled, with no major or minor colour."),
      ] },
    ],
  },
  {
    ...base,
    slug: "upper-structure-triads",
    title: "Upper-structure triads and polychords",
    order: 2,
    concepts: ["upper-structures", "polychords"],
    needs: ["altered-dominants", "ninths-elevenths-and-thirteenths", "shell-voicings"],
    steps: [
      { kind: "understand", blocks: [text(`A chord like C13♯11 looks frightening. Here is a way to play and hear it that needs nothing harder than a major triad.

Split the chord in two:

- **Below:** the core of the chord. For C7 that is the root with the third and seventh, **C, E, B♭**.
- **Above:** an ordinary **triad** from a different root. This is the **upper structure**.

Put a **D major triad** on top of C7. Its notes, D, F♯ and A, are the 9th, ♯11th and 13th of C. The result is **C13♯11**, and you thought of it as two simple things.

Change the triad and the colour changes:

- **D major over C7:** 9, ♯11, 13. Bright. C13♯11.
- **A major over C7:** 13, ♭9, 3. C13♭9.
- **A♭ major over C7:** ♭13, root, ♯9. Dark and tense. C7♯9♭13.

One chord sitting on another is called a **polychord**. It is written like a fraction, upper chord over lower chord. Do not confuse it with a slash chord such as C/E, where the lower part is a single bass note.

You have met a gentle version already. An E minor triad over a C bass is Cmaj7.

Pianists play the two parts in two hands. Guitarists usually take the upper triad and leave the root to the bass player.`)] },
      { kind: "listen", blocks: [
        audio("The core of C7: C, E, B♭", together(C7_SHELL)),
        audio("With a D major triad on top: C13♯11", C13_SHARP11),
        audio("With an A major triad on top: C13♭9", together(`${C7_SHELL} E4 A4 C#5`)),
        audio("With an A♭ major triad on top: C7♯9♭13", together(`${C7_SHELL} Eb4 Ab4 C5`)),
      ] },
      { kind: "learn", blocks: [
        show(pitches(C7_SHELL), "Below: C, E and B♭. The root, third and seventh of C7."),
        show(chordOf("D", "major"), "Above: a D major triad, D F♯ A."),
        show(pitches(`${C7_SHELL} D4 F#4 A4`), "Together: C13♯11.", "piano"),
      ] },
      { kind: "practice", blocks: [
        choice("What is an upper-structure triad?", ["A triad played above the core of another chord", "A triad in root position", "The lowest three notes of a chord"], 0, "The lower part names the chord; the triad on top adds the extensions."),
        choice("Over C7, a D major triad adds which notes?", ["9, ♯11 and 13", "♭9, 3 and 13", "Root, ♯9 and ♭13"], 0, "D is the 9th, F♯ the ♯11th, A the 13th."),
        build("Build the D major triad.", "D F# A", "Root, major third, fifth."),
        choice("Which triad over C7 gives the ♯9 and the ♭13?", ["A♭ major", "D major", "G major"], 0, "A♭ is the ♭13, C the root, E♭ the ♯9."),
        choice("An E minor triad over a C bass makes which chord?", ["Cmaj7", "C7", "Cm7"], 0, "C with E, G and B above it."),
        ear("Plain C7 core, or with a triad on top?", C13_SHARP11, ["Plain", "With an upper structure"], 1, "You can hear a bright major triad ringing above the chord."),
      ] },
    ],
  },
  {
    ...base,
    slug: "a-bridge-to-indian-music",
    title: "A bridge to Indian music",
    order: 3,
    concepts: ["swar", "thaat"],
    needs: ["parallel-modes", "the-seven-modes"],
    steps: [
      { kind: "understand", blocks: [text(`If you grew up hearing Hindustani music, much of this course has a second set of names. This lesson links the two.

**The seven swar** are **Sa Re Ga Ma Pa Dha Ni**. They are scale degrees, like 1 to 7, not fixed pitches. Sa is wherever the performer puts it, and a drone holds it throughout.

The twelve notes divide like this:

- **Sa and Pa never change.** They are the 1 and the 5.
- **Re, Ga, Dha and Ni** each have a natural form, **shuddha**, and a lowered form, **komal**. Komal Ga is the ♭3.
- **Ma** has a natural form and a raised form, **tivra**. Tivra Ma is the ♯4.

A **thaat** is a seven-note parent scale. Six of the ten thaats of Hindustani music have the same notes as modes you know:

- **Bilawal** = Ionian (the major scale)
- **Kalyan** = Lydian (tivra Ma)
- **Khamaj** = Mixolydian (komal Ni)
- **Kafi** = Dorian (komal Ga and Ni)
- **Asavari** = Aeolian (komal Ga, Dha and Ni)
- **Bhairavi** = Phrygian (komal Re, Ga, Dha and Ni)

There is no thaat for Locrian, because Pa cannot be lowered.

One caution. **A raga is far more than a scale.** A raga has its own way up and down, phrases that identify it, notes it leans on, and ornaments and slides between notes. Many different ragas share one thaat. And the music is melody over a drone, with no chord changes. So the table is a map between two note systems. It does not tell you how to play a raga.`)] },
      { kind: "listen", blocks: [
        audio("A drone on Sa and Pa", together("C3 G3 C4")),
        audio("Bilawal, with Sa on C: the major scale", seq("C4 D4 E4 F4 G4 A4 B4 C5", 110)),
        audio("Kalyan: Ma is tivra, F♯", seq(C_LYDIAN, 110)),
        audio("Bhairavi: Re, Ga, Dha and Ni are komal", seq(C_PHRYGIAN, 110)),
      ] },
      { kind: "learn", blocks: [
        show(scale("C", "major", "degrees"), "Bilawal with Sa on C. Read 1 2 3 4 5 6 7 as Sa Re Ga Ma Pa Dha Ni."),
        show(scale("C", "lydian", "degrees"), "Kalyan: the ♯4 is tivra Ma."),
        show(scale("C", "dorian", "degrees"), "Kafi: the ♭3 and ♭7 are komal Ga and komal Ni."),
      ] },
      { kind: "practice", blocks: [
        choice("Which two swar never change?", ["Sa and Pa", "Re and Dha", "Ma and Ni"], 0, "The 1 and the 5 have only one form."),
        choice("Which swar can be tivra, raised?", ["Ma", "Ga", "Ni"], 0, "Tivra Ma is the ♯4. The other movable notes are lowered instead."),
        find("With Sa on C, tap komal Ga.", "Eb", "Ga is the third; komal Ga is the ♭3."),
        find("With Sa on C, tap tivra Ma.", "F#", "Ma is the fourth; tivra Ma is the ♯4."),
        choice("Which thaat has the notes of the Dorian mode?", ["Kafi", "Kalyan", "Bhairavi"], 0, "Komal Ga and komal Ni: 1 2 ♭3 4 5 6 ♭7."),
        ear("With Sa on C, which thaat is this?", seq(C_LYDIAN, 110), ["Bilawal", "Kalyan", "Khamaj"], 1, "The fourth note is raised: tivra Ma."),
      ] },
    ],
  },
];
