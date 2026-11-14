import type { LessonInput } from "@/core/schemas/content";
import { audio, ear, prog, progression, scale, seq, show, text } from "../helpers";

const base = { moduleSlug: "ear-5", isFree: false, version: 1, minutes: 5, strand: "ear" } as const;
const MAJOR_MODES = ["Ionian: plain major", "Lydian: raised 4th", "Mixolydian: lowered 7th"];
const MINOR_MODES = ["Aeolian: natural minor", "Dorian: raised 6th", "Phrygian: lowered 2nd"];
const BORROWED = ["All chords from the key", "A borrowed chord", "A secondary dominant"];

export const ear5: LessonInput[] = [
  {
    ...base,
    slug: "recognising-modes",
    title: "Recognising modes by ear",
    order: 1,
    concepts: ["ear-modes"],
    needs: ["characteristic-notes", "seventh-chord-quality-by-ear"],
    steps: [
      { kind: "understand", blocks: [text(`To name a mode by ear, ask two questions in order.

**Is it major or minor?** Listen to the third. That halves the choices.

**Which note is unusual?** Compare what you hear with plain major or plain natural minor.

Among the major-sounding modes: a 4th that sounds too bright is Lydian; a 7th that sags is Mixolydian; nothing unusual is Ionian.

Among the minor-sounding modes: a 6th that sounds brighter than expected is Dorian; a 2nd pressed right up against home is Phrygian; nothing unusual is Aeolian.

Sing up the scale you expect, and notice where the music disagrees with you.`)] },
      { kind: "listen", blocks: [
        audio("C Ionian", seq("C4 D4 E4 F4 G4 A4 B4 C5", 120)),
        audio("C Lydian: listen to the 4th note", seq("C4 D4 E4 F#4 G4 A4 B4 C5", 120)),
        audio("C Mixolydian: listen to the 7th note", seq("C4 D4 E4 F4 G4 A4 Bb4 C5", 120)),
        audio("C Dorian: minor, with a bright 6th", seq("C4 D4 Eb4 F4 G4 A4 Bb4 C5", 120)),
      ] },
      { kind: "learn", blocks: [
        show(scale("C", "lydian", "degrees"), "C Lydian. The ♯4 is the note to listen for."),
        show(scale("C", "phrygian", "degrees"), "C Phrygian. The ♭2 is a half step above home."),
      ] },
      { kind: "practice", blocks: [
        ear("Which major-sounding mode is this?", seq("D4 E4 F#4 G#4 A4 B4 C#5 D5", 120), MAJOR_MODES, 1, "The 4th note, G♯, is raised: D Lydian."),
        ear("And this?", seq("D4 E4 F#4 G4 A4 B4 C5 D5", 120), MAJOR_MODES, 2, "The 7th note, C, is lowered: D Mixolydian."),
        ear("And this?", seq("D4 E4 F#4 G4 A4 B4 C#5 D5", 120), MAJOR_MODES, 0, "Nothing unusual: D major."),
        ear("Which minor-sounding mode is this?", seq("A3 B3 C4 D4 E4 F#4 G4 A4", 120), MINOR_MODES, 1, "The 6th note, F♯, is raised: A Dorian."),
        ear("And this?", seq("A3 Bb3 C4 D4 E4 F4 G4 A4", 120), MINOR_MODES, 2, "The 2nd note, B♭, is lowered: A Phrygian."),
        ear("And this?", seq("A3 B3 C4 D4 E4 F4 G4 A4", 120), MINOR_MODES, 0, "Nothing unusual: A natural minor."),
      ] },
    ],
  },
  {
    ...base,
    slug: "hearing-borrowed-chords",
    title: "Hearing borrowed chords",
    order: 2,
    concepts: ["ear-borrowed-chords"],
    needs: ["recognising-modes", "modal-interchange"],
    steps: [
      { kind: "understand", blocks: [text(`A borrowed chord announces itself: for a moment the major key turns darker, as if a cloud had crossed the sun, and then home returns unchanged.

Clues for the common ones:

- **iv:** you expect the bright IV and get its minor twin. Often IV comes first, then iv, with one note sinking.
- **♭VII:** a major chord a whole step below home. It sounds like rock, and it tends to move on to IV.
- **♭VI:** a major chord from far away, heavy and grand. It often climbs through ♭VII back to I.

In every case the home chord stays major. That is how you know the song has borrowed, not moved to a minor key.`)] },
      { kind: "listen", blocks: [
        audio("All in the key: I, IV, I", prog("C", "I IV I", 72)),
        audio("With a borrowed iv: I, IV, iv, I", prog("C", "I IV iv I", 72)),
        audio("With ♭VII: I, ♭VII, IV, I", prog("C", "I bVII IV I", 80)),
      ] },
      { kind: "learn", blocks: [show(progression("C", "I IV iv I"), "C, F, Fm, C. Listen for the moment F darkens into Fm.")] },
      { kind: "practice", blocks: [
        ear("Is every chord from the key, or is one borrowed?", prog("G", "I IV iv I", 72), ["One is borrowed", "All from the key"], 0, "C darkens into Cm before returning to G."),
        ear("And here?", prog("G", "I IV V I", 72), ["One is borrowed", "All from the key"], 1, "G, C, D, G: plain I, IV, V."),
        ear("Which borrowed chord is the second one?", prog("G", "I bVII IV I", 80), ["♭VII: a whole step below home", "iv: the minor subdominant"], 0, "G drops to F, a major chord a whole step down."),
        ear("And the second chord here?", prog("G", "I iv I", 72), ["♭VII: a whole step below home", "iv: the minor subdominant"], 1, "Cm in the key of G."),
        ear("How does this return home?", prog("C", "I bVI bVII I", 72), ["Climbing through ♭VI and ♭VII", "Through the ordinary V chord"], 0, "A♭, B♭, then C: two borrowed major chords rising by whole steps."),
      ] },
    ],
  },
  {
    ...base,
    slug: "hearing-secondary-dominants",
    title: "Hearing secondary dominants",
    order: 3,
    concepts: ["ear-secondary-dominants"],
    needs: ["hearing-borrowed-chords", "other-secondary-dominants"],
    steps: [
      { kind: "understand", blocks: [text(`A secondary dominant has the opposite effect to a borrowed chord. Instead of darkening the key, it **brightens and pushes**: a chord you expected to be minor turns major, and it leans hard into the chord that follows.

Two clues:

- **A minor chord has become major.** In C, hearing D major or D7 where Dm belongs, or E7 where Em belongs.
- **It resolves down a fifth.** D7 goes to G; E7 goes to Am; A7 goes to Dm. The push is always towards the next chord, not towards home.

So when a chord sounds brighter than the key allows and the next chord feels like an arrival, you have heard a secondary dominant.`)] },
      { kind: "listen", blocks: [
        audio("All in the key: C, Am, Dm, G7, C", prog("C", "I vi ii V7 I", 76)),
        audio("With V of ii: C, A7, Dm, G7, C", prog("C", "I VI7 ii V7 I", 76)),
        audio("With V of V: C, Am, D7, G7, C", prog("C", "I vi II7 V7 I", 76)),
      ] },
      { kind: "learn", blocks: [show(progression("C", "I VI7 ii V7 I"), "C, A7, Dm, G7, C. Listen for A7, brighter than the Am it replaces, pushing into Dm.")] },
      { kind: "practice", blocks: [
        ear("What do you hear in this progression?", prog("G", "I vi ii V7 I", 76), BORROWED, 0, "G, Em, Am, D7, G: every chord belongs to G major."),
        ear("And in this one?", prog("G", "I VI7 ii V7 I", 76), BORROWED, 2, "E7 replaces Em and pushes into Am."),
        ear("And in this one?", prog("G", "I IV iv I", 76), BORROWED, 1, "The minor iv is borrowed from G minor."),
        ear("And in this one?", prog("G", "I III7 vi IV", 76), BORROWED, 2, "B7 pushes into Em: V of vi."),
        ear("Does the bright chord here darken the key or push forward?", prog("C", "I II7 V7 I", 76), ["It pushes forward, into the next chord", "It darkens the key"], 0, "D7 drives into G7."),
      ] },
    ],
  },
];
