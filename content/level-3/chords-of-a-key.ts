import type { LessonInput } from "@/core/schemas/content";
import { audio, build, choice, ear, prog, progression, seq, show, text, together } from "../helpers";

const base = { moduleSlug: "chords-of-a-key", isFree: false, version: 1, minutes: 6 } as const;
const REST = ["At rest", "With tension: it wants to continue"];

export const chordsOfAKey: LessonInput[] = [
  {
    ...base,
    slug: "harmonising-the-major-scale",
    title: "The seven chords of a key",
    order: 1,
    concepts: ["diatonic-triads"],
    needs: ["reading-chord-symbols", "major-scales-in-any-key"],
    steps: [
      { kind: "understand", blocks: [text(`Build a triad on every note of a major scale, using only notes from that scale, and you get the seven chords that belong to the key.

In C major: **C, Dm, Em, F, G, Am, B°**.

The pattern is major, minor, minor, major, major, minor, diminished, and it is the same in every major key. That is why songs in a key keep returning to the same handful of chords.`)] },
      { kind: "listen", blocks: [audio("The seven chords of C major, then C again", prog("C", "I ii iii IV V vi vii° I", 100))] },
      { kind: "learn", blocks: [show(progression("C", "I ii iii IV V vi vii°"), "Press play and watch each chord of the key appear in turn. Every note comes from C major.")] },
      { kind: "practice", blocks: [
        choice("What is the pattern of chords in a major key?", ["Major, minor, minor, major, major, minor, diminished", "Major, major, minor, minor, major, minor, diminished", "Major, minor, major, minor, major, minor, diminished"], 0, "Major on degrees 1, 4 and 5; minor on 2, 3 and 6; diminished on 7."),
        choice("In C major, the chord on degree 2 is…", ["Dm", "D", "D°"], 0, "D, F and A: a minor triad."),
        choice("In G major, the chord on degree 6 is…", ["Em", "E", "Am"], 0, "Degree 6 of G major is E, and the sixth chord is minor."),
        choice("Which degree carries the diminished triad?", ["The 7th", "The 2nd", "The 5th"], 0, "In C major that is B°: B, D, F."),
        build("Build the chord on degree 4 of C major.", "F A C", "F, skip G, A, skip B, C: F major."),
        ear("This is the chord on degree 2 of C major. Major or minor?", together("D4 F4 A4"), ["Major", "Minor"], 1, "D, F, A is D minor."),
      ] },
    ],
  },
  {
    ...base,
    slug: "roman-numerals",
    title: "Roman numerals and Nashville numbers",
    order: 2,
    concepts: ["roman-numerals"],
    needs: ["harmonising-the-major-scale"],
    steps: [
      { kind: "understand", blocks: [text(`Musicians number the chords of a key so that a progression can be described once and played in any key.

**Roman numerals** show the degree and the chord type together. Capitals are major, lower case is minor, and a small circle is diminished:

**I ii iii IV V vi vii°**

In C major, I is C, IV is F, V is G and vi is Am. In G major the same numerals mean G, C, D and Em.

**Nashville numbers** do the same with ordinary digits: 1, 4, 5, and 6m or 6- for the minor chord.`)] },
      { kind: "listen", blocks: [
        audio("I, IV, V, I in C", prog("C", "I IV V I")),
        audio("The same numerals in G", prog("G", "I IV V I")),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "I IV V vi"), "I, IV, V and vi in C major: C, F, G, Am."),
        show(progression("G", "I IV V vi"), "The same numerals in G major: G, C, D, Em."),
      ] },
      { kind: "practice", blocks: [
        choice("In C major, what is the V chord?", ["G", "F", "Am"], 0, "The fifth degree of C major is G, and V is major."),
        choice("In G major, what is the IV chord?", ["C", "D", "Em"], 0, "G A B C: the fourth degree is C."),
        choice("What does a lower-case numeral mean?", ["A minor chord", "A major chord", "A chord played quietly"], 0, "Capitals for major, lower case for minor."),
        choice("In D major, what is vi?", ["Bm", "B", "F♯m"], 0, "Degree 6 of D major is B, and vi is minor."),
        choice("Nashville numbers 1 4 5 in the key of A are…", ["A, D, E", "A, C, D", "A, D, F"], 0, "Degrees 1, 4 and 5 of A major."),
        choice("In F major, what is ii?", ["Gm", "G", "Am"], 0, "Degree 2 of F major is G, and ii is minor."),
      ] },
    ],
  },
  {
    ...base,
    slug: "chord-function",
    title: "Tonic, subdominant, dominant",
    order: 3,
    concepts: ["chord-function"],
    needs: ["roman-numerals"],
    steps: [
      { kind: "understand", blocks: [text(`Chords in a key do three jobs.

- **Tonic:** home, the place of rest. That is the I chord. The vi and iii chords share two notes with it and can stand in for it.
- **Subdominant:** moving away from home. That is the IV chord; ii does the same job.
- **Dominant:** tension that wants to return home. That is the V chord; vii° does the same job.

A great deal of music is one journey repeated: tonic, subdominant, dominant, and back to tonic.`)] },
      { kind: "listen", blocks: [audio("Home, away, tension, home: I, IV, V, I", prog("C", "I IV V I", 72))] },
      { kind: "learn", blocks: [show(progression("C", "I IV V I"), "C is home, F moves away, G builds tension, C resolves it.")] },
      { kind: "practice", blocks: [
        choice("Which chord is the tonic?", ["I", "IV", "V"], 0, "The I chord is home."),
        choice("What is the function of the V chord?", ["Dominant: tension that wants to go home", "Tonic: rest", "Subdominant: moving away"], 0, "V pulls back to I."),
        choice("The ii chord most often does the same job as…", ["IV, the subdominant", "I, the tonic", "V, the dominant"], 0, "ii and IV share two notes."),
        ear("Does this progression end at rest or with tension?", prog("C", "I IV V", 72), REST, 1, "It stops on V, the dominant, and waits for I."),
        ear("And this one?", prog("C", "I IV V I", 72), REST, 0, "V resolves to I: home."),
        choice("Which is the common journey of chord functions?", ["Tonic, subdominant, dominant, tonic", "Dominant, tonic, subdominant, dominant", "Subdominant, tonic, tonic, dominant"], 0, "Away from home, build tension, return."),
      ] },
    ],
  },
  {
    ...base,
    slug: "why-chords-want-to-move",
    title: "Why some chords want to move",
    order: 4,
    concepts: ["tendency-tones"],
    needs: ["chord-function", "scale-degrees"],
    steps: [
      { kind: "understand", blocks: [text(`The pull of one chord towards another comes from single notes inside it.

Degrees 1, 3 and 5 of the scale are stable: they are the tonic chord. The others lean towards them:

- **7 rises to 1.** The leading tone is a half step below home.
- **4 falls to 3.** Also only a half step.
- **2 falls to 1**, and **6 falls to 5**.

The V chord contains degree 7, which is why it pulls so strongly to I. In C major, G's middle note is B, and B wants to rise to C.`)] },
      { kind: "listen", blocks: [
        audio("The leading tone rising home: B to C", seq("B4 C5", 50)),
        audio("Degree 4 falling to 3: F to E", seq("F4 E4", 50)),
        audio("V to I: G major resolving to C major", prog("C", "V I", 60)),
      ] },
      { kind: "learn", blocks: [show(progression("C", "V I"), "In the G chord, B is the leading tone. When the chord changes to C, B has risen to C.")] },
      { kind: "practice", blocks: [
        choice("Which note in the V chord pulls most strongly to the tonic?", ["The leading tone, degree 7", "The root of V", "Degree 2"], 0, "It is a half step below home."),
        choice("In C major, where does B want to go?", ["Up to C", "Down to A", "Up to D"], 0, "The leading tone rises a half step to the tonic."),
        choice("Degree 4 tends to fall to…", ["Degree 3", "Degree 2", "Degree 1"], 0, "A half step down, to a note of the tonic chord."),
        choice("Which note of G major (G B D) is the leading tone in the key of C?", ["B", "G", "D"], 0, "B is degree 7 of C major."),
        ear("Does this end at rest or with tension?", prog("C", "I V", 60), REST, 1, "The V chord holds the leading tone, still waiting to rise."),
      ] },
    ],
  },
];
