// Playing track G3, Basic stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (hand position, which finger owns which string, how to pluck,
// planting, pinches) is standard teaching written from memory, not checked against a player. Each such
// passage is marked "OWNER REVIEW" below. These lessons also still need their demo videos.
import type { LessonInput } from "@/core/schemas/content";
import { audio, choice, diagram, ear, find, picking, shape, show, tabSound, text } from "../helpers";

const base = { moduleSlug: "fingerstyle-basic", track: "guitar-fingerstyle", strand: "guitar", isFree: false, version: 1, minutes: 6 } as const;
const G = { only: "guitar" } as const;

// Each chord as the four strings a basic pattern uses: the bass string for the thumb, then strings 3, 2 and 1.
type Shape = { p: string; i: string; m: string; a: string };
const AM: Shape = { p: "5:0", i: "3:2", m: "2:1", a: "1:0" }; // x02210
const C: Shape = { p: "5:3", i: "3:0", m: "2:1", a: "1:0" }; // x32010
const GM: Shape = { p: "6:3", i: "3:0", m: "2:0", a: "1:3" }; // 320003
const EM: Shape = { p: "6:0", i: "3:0", m: "2:0", a: "1:0" }; // 022000
/** One bar of a pattern on a chord: bar(AM, "p i m a p i m a") in eighth notes. A joined token ("pa") is a pinch. */
const bar = (chord: Shape, pattern: string, length = "8") =>
  pattern.split(" ").map((token) => `${token.split("").map((f) => chord[f as keyof Shape]).join("+")}/${length}`).join(" ");
const PIMA = "p i m a p i m a";
const PIMI = "p i m i p i m i";
const WALTZ = "p i m a m i";
const PINCH = "pa i pm i";
const repeat = (pattern: string, times: number) => Array(times).fill(pattern).join(" ");
const over = (chords: Shape[], pattern: string, length = "8") => chords.map((ch) => bar(ch, pattern, length)).join(" | ");

const OPEN_STRINGS = "6:0/q 5:0/q 4:0/q 3:0/q | 2:0/q 1:0/q r/h";
const ROOTS = "5:0/h 5:0/h | 5:3/h 5:3/h | 6:3/h 6:3/h | 6:0/h 6:0/h";
// Alternating thumb on A minor: root on string 5, fifth on string 4, with i and m together in between.
const ALTERNATING_AM = "5:0/q 3:2+2:1/q 4:2/q 3:2+2:1/q";
const ALTERNATING_EM = "6:0/q 3:0+2:0/q 5:2/q 3:0+2:0/q";
const ALTERNATING_FINGERS = "p im p im";
const STUDY_1 = over([AM, C, GM, EM], PIMA);
const STUDY_2 = `${over([AM, C, EM], PIMA)} | ${bar(AM, "pa", "w")}`;

export const fingerstyleBasic: LessonInput[] = [
  {
    ...base,
    slug: "finger-names-and-strings",
    title: "Finger names, and which finger owns which string",
    order: 1,
    concepts: ["pima"],
    needs: ["tab-and-chord-diagrams"],
    steps: [
      // OWNER REVIEW: hand position and string assignment.
      { kind: "understand", blocks: [text(`In fingerstyle you put the pick down and pluck the strings with your thumb and fingers. Each one can play a different string, so one guitar can sound a bass line and a chord at once.

The plucking fingers have names, taken from Spanish, and you will see them under every pattern in this track:

- **p**: thumb
- **i**: index finger
- **m**: middle finger
- **a**: ring finger

The little finger is not used in the basic patterns.

To begin with, give each finger a home:

- **p** plays the three bass strings: **6, 5 and 4**.
- **i** plays **string 3**.
- **m** plays **string 2**.
- **a** plays **string 1**.

With that, your hand never has to search. The thumb chooses the bass note; the fingers stay on their strings.

Hand position: let the hand hang over the strings near the sound hole with the wrist relaxed. The thumb reaches forward, towards the neck, and the fingers curl under it, so the thumb and index finger do not collide. Fingers pluck by closing towards the palm. The thumb plucks downwards, towards the floor.`)] },
      { kind: "listen", blocks: [
        audio("The six open strings, low to high", tabSound(OPEN_STRINGS, 70)),
        audio("An A minor chord, one string at a time: p, i, m, a", tabSound(bar(AM, "p i m a", "q"), 70)),
      ] },
      { kind: "learn", blocks: [
        picking(OPEN_STRINGS, "p p p i m a -", "The open strings. The thumb plays strings 6, 5 and 4; then i, m and a take strings 3, 2 and 1."),
        diagram("x02210", "A", "minor", "A minor. The thumb's bass note is the open string 5."),
        picking(bar(AM, "p i m a", "q"), "p i m a", "A minor, one finger at a time."),
      ] },
      { kind: "practice", blocks: [
        choice("Which finger is p?", ["The thumb", "The index finger", "The little finger"], 0, "p is the thumb; i, m and a are index, middle and ring."),
        choice("Which finger is a?", ["The ring finger", "The index finger", "The thumb"], 0, "p, i, m, a: thumb, index, middle, ring."),
        choice("Which strings does the thumb look after?", ["6, 5 and 4", "3, 2 and 1", "Only string 6"], 0, "The three bass strings."),
        choice("Which finger plays string 2?", ["m", "i", "a"], 0, "i on string 3, m on string 2, a on string 1."),
        find("Tap the note the a finger plays in the A minor pattern: string 1, open.", "E4", "The open string 1 is E.", { strings: [1], ...G }),
        picking(bar(AM, "p i m a", "q"), "p i m a", "Play along slowly. Say the finger names as you go."),
      ] },
    ],
  },
  {
    ...base,
    slug: "thumb-on-the-bass",
    title: "The thumb plays the root",
    order: 2,
    concepts: ["thumb-bass"],
    needs: ["finger-names-and-strings"],
    steps: [
      { kind: "understand", blocks: [text(`The thumb is the bass player of fingerstyle. Its first job is simple: play the **root** of each chord, steadily.

The root is the note the chord is named after, and in the usual open shapes it is the lowest note you play. Where it sits decides which string the thumb goes to:

- **A minor:** string 5, open.
- **C:** string 5, fret 3.
- **G:** string 6, fret 3.
- **E minor:** string 6, open.
- **D:** string 4, open.

So when the chord changes, the thumb may have to change string. The fingers do not; they stay on strings 3, 2 and 1.

Practise the thumb alone first. Hold each chord, and play its root twice per bar, on beats 1 and 3, in time. If the thumb is steady, everything you add on top will sit in place. If it wanders, nothing will.`)] },
      { kind: "listen", blocks: [
        audio("Roots only: A, C, G, E", tabSound(ROOTS, 80)),
        audio("The same roots with the chord above them", tabSound(over([AM, C, GM, EM], "pima pima", "h"), 80)),
      ] },
      { kind: "learn", blocks: [
        show(shape("5:0 5:3 6:3 6:0"), "The four roots: A and C on string 5, G and E on string 6.", "guitar"),
        picking(ROOTS, repeat("p", 8), "Thumb only. Hold each chord shape and play its root on beats 1 and 3: Am, C, G, Em."),
        diagram("x32010", "C", "major", "C. The root is on string 5 at fret 3."),
        diagram("320003", "G", "major", "G. The root is on string 6 at fret 3."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the thumb's first job?", ["Playing the root of each chord", "Playing the melody", "Muting the strings"], 0, "The thumb is the bass player."),
        choice("On which string is the root of a C chord?", ["String 5", "String 6", "String 4"], 0, "String 5, fret 3."),
        find("Tap the root of the G chord on string 6.", "G2", "String 6, fret 3.", { strings: [6], ...G }),
        find("Tap the root of the A minor chord on string 5.", "A2", "The open string 5.", { strings: [5], ...G }),
        choice("When the chord changes, which part of the hand may change string?", ["The thumb", "The index finger", "All the fingers"], 0, "i, m and a keep their strings; the thumb follows the root."),
        picking(ROOTS, repeat("p", 8), "Play the roots along with the click at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "first-arpeggio-patterns",
    title: "First arpeggio patterns: p-i-m-a and p-i-m-i",
    order: 3,
    concepts: ["arpeggio-patterns"],
    needs: ["thumb-on-the-bass"],
    steps: [
      // OWNER REVIEW: planting the fingers on their strings before a pattern.
      { kind: "understand", blocks: [text(`An **arpeggio** is a chord played one note at a time. In fingerstyle you hold a chord shape and let the plucking hand repeat a short pattern over it.

The first pattern is the one the finger names spell: **p – i – m – a**. Thumb on the root, then strings 3, 2 and 1 in order. Played as eighth notes, it fits twice in a bar of 4/4:

**p i m a p i m a**, counted 1 & 2 & 3 & 4 &.

The second pattern turns back instead of going to the top: **p – i – m – i**. It leaves out the ring finger, so it is a little easier, and it has a gentler, rocking sound.

Things to listen for:

- **Even volume.** The ring finger is the weakest and tends to play quietly. Give it a little more.
- **Even time.** Eight notes, equally spaced.
- **Let it ring.** Do not lift the chord hand between notes. The notes should overlap into a chord.

A habit that helps: before you start, rest p, i, m and a on their four strings. Each finger is then already touching the string it is about to play.`)] },
      { kind: "listen", blocks: [
        audio("p-i-m-a on A minor", tabSound(bar(AM, PIMA), 80)),
        audio("p-i-m-i on A minor", tabSound(bar(AM, PIMI), 80)),
        audio("p-i-m-a on C", tabSound(bar(C, PIMA), 80)),
      ] },
      { kind: "learn", blocks: [
        picking(bar(AM, PIMA), PIMA, "p-i-m-a on A minor, twice in the bar."),
        picking(bar(AM, PIMI), PIMI, "p-i-m-i on A minor. The ring finger rests."),
        picking(bar(C, PIMA), PIMA, "p-i-m-a on C. Only the thumb's note and one finger of the chord hand changed."),
      ] },
      { kind: "practice", blocks: [
        choice("What is an arpeggio?", ["A chord played one note at a time", "A fast scale", "Two strings played together"], 0, "The notes of the chord, in turn."),
        choice("In p-i-m-a, which string does the last finger play?", ["String 1", "String 3", "String 5"], 0, "a owns string 1."),
        ear("Which pattern is this?", tabSound(bar(AM, PIMI), 80), ["p-i-m-a: up to the top string", "p-i-m-i: it turns back"], 1, "After the middle finger it returns to string 3."),
        ear("And this?", tabSound(bar(AM, PIMA), 80), ["p-i-m-a: up to the top string", "p-i-m-i: it turns back"], 0, "Each group climbs through all four strings."),
        choice("Which finger most often plays too quietly?", ["a, the ring finger", "p, the thumb", "i, the index finger"], 0, "It is the weakest of the four, so listen for it."),
        picking(bar(AM, PIMA), PIMA, "Play along at 60. Keep the chord held down throughout."),
      ] },
    ],
  },
  {
    ...base,
    slug: "picking-through-chords",
    title: "Picking through chords in 4/4 and 3/4",
    order: 4,
    concepts: ["arpeggios-through-chords"],
    needs: ["first-arpeggio-patterns"],
    steps: [
      { kind: "understand", blocks: [text(`A pattern on one chord is an exercise. The same pattern carried through a chord progression is music.

The plucking hand does not change at all from chord to chord. Only two things move:

- the **chord hand** changes shape, and
- the **thumb** moves to the string that holds the new root.

That gives you a useful moment of grace. The first note of each bar is the thumb's bass note. In A minor and E minor that note is an open string, so you can play it while the chord hand is still landing. Change chords on the thumb's note, and the fingers that follow will find the new shape ready.

**In 3/4** a bar holds six eighth notes, not eight. The usual pattern goes up and comes back: **p – i – m – a – m – i**. Count 1 & 2 & 3 &. It gives the rolling feel of a waltz or a slow ballad.`)] },
      { kind: "listen", blocks: [
        audio("p-i-m-a through Am, C, G, Em in 4/4", tabSound(over([AM, C, GM, EM], PIMA), 80)),
        audio("p-i-m-a-m-i through Am, C, Em, Am in 3/4", tabSound(over([AM, C, EM, AM], WALTZ), 90, 3)),
      ] },
      { kind: "learn", blocks: [
        picking(over([AM, C], PIMA), repeat(PIMA, 2), "A minor to C in 4/4. Watch the bass note at each bar line."),
        picking(over([GM, EM], PIMA), repeat(PIMA, 2), "G to E minor. The thumb is on string 6 for both."),
        picking(over([AM, C], WALTZ), repeat(WALTZ, 2), "A minor to C in 3/4: up and back, six notes in a bar.", 60, 3),
        diagram("022000", "E", "minor", "E minor. Its root is the open string 6."),
      ] },
      { kind: "practice", blocks: [
        choice("When the chord changes, what does the plucking pattern do?", ["It stays the same", "It reverses", "It stops for a beat"], 0, "Only the chord hand and the thumb's string change."),
        choice("How many eighth notes fill a bar of 3/4?", ["Six", "Eight", "Three"], 0, "Three beats, two eighth notes each."),
        choice("Which pattern suits 3/4?", ["p-i-m-a-m-i", "p-i-m-a-p-i-m-a", "p-p-p-p"], 0, "Up and back: six notes."),
        ear("Is this in 4/4 or in 3/4?", tabSound(over([AM, C], WALTZ), 90, 3), ["4/4", "3/4"], 1, "The pattern rolls in groups of six: three beats to the bar."),
        picking(over([AM, C, GM, EM], PIMA), repeat(PIMA, 4), "Play along in 4/4: Am, C, G, Em."),
        picking(over([AM, C, EM, AM], WALTZ), repeat(WALTZ, 4), "Play along in 3/4: Am, C, Em, Am.", 60, 3),
      ] },
    ],
  },
  {
    ...base,
    slug: "pinches",
    title: "Pinches",
    order: 5,
    concepts: ["pinches"],
    needs: ["picking-through-chords"],
    steps: [
      // OWNER REVIEW: how a pinch is plucked.
      { kind: "understand", blocks: [text(`So far only one note has sounded at a time. A **pinch** plays two strings at the same instant: the **thumb** on a bass string and a **finger** on a treble string.

The name describes the motion. The thumb moves down and the finger moves up, towards each other, as if pinching something between them.

A pinch gives you a bass note and a top note together, which is the first step towards playing a melody over a bass line. It also adds weight: a pinch on beat 1 marks the start of the bar the way a strummed chord would.

Under the tab a pinch is written with both letters: **p+a** is thumb and ring finger together, **p+m** is thumb and middle finger.

The pattern in this lesson is **pinch, i, pinch, i** in quarter notes:

**p+a – i – p+m – i**

Aim for the two notes of a pinch to sound at exactly the same moment, and at about the same volume. If the bass note comes early, slow down.`)] },
      { kind: "listen", blocks: [
        audio("A pinch on A minor: strings 5 and 1 together", tabSound(bar(AM, "pa", "h"), 70)),
        audio("The pattern on A minor, then C", tabSound(over([AM, C], PINCH, "q"), 80)),
      ] },
      { kind: "learn", blocks: [
        picking(`${bar(AM, "pa", "h")} ${bar(AM, "pm", "h")}`, "pa pm", "Two pinches: thumb with ring finger, then thumb with middle finger."),
        picking(over([AM, C], PINCH, "q"), repeat(PINCH, 2), "Pinch, i, pinch, i. A minor, then C."),
      ] },
      { kind: "practice", blocks: [
        choice("What is a pinch?", ["Thumb and a finger plucking two strings together", "Two fingers on one string", "A very quiet note"], 0, "A bass string and a treble string at the same instant."),
        choice("In a pinch written p+a, which strings sound on an A minor chord?", ["Strings 5 and 1", "Strings 6 and 2", "Strings 3 and 2"], 0, "The thumb's root on string 5 and the ring finger's string 1."),
        choice("What should the two notes of a pinch do?", ["Sound at exactly the same moment", "Sound one after the other", "Alternate"], 0, "Together, and at about the same volume."),
        ear("Is the first sound here one note or a pinch?", tabSound(over([AM], PINCH, "q"), 80), ["One note", "A pinch"], 1, "A low note and a high note start together."),
        picking(over([AM, C], PINCH, "q"), repeat(PINCH, 2), "Play along at 60."),
        picking(over([AM, C, GM, EM], PINCH, "q"), repeat(PINCH, 4), "Through four chords at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "alternating-thumb",
    title: "The alternating thumb: root and fifth",
    order: 6,
    concepts: ["alternating-bass"],
    needs: ["pinches"],
    steps: [
      { kind: "understand", blocks: [text(`Until now the thumb has repeated one note. Let it swap between **two** bass notes and the part starts to sound like a bass player and a guitarist together. This is the **alternating thumb**.

The two notes are the chord's **root** and its **fifth**. Both belong to the chord, and together they give the bass line the steady "one, two" of a march.

On two chords you know, both notes are already under your fingers:

- **A minor:** root on string 5 (open), fifth on string 4 (fret 2, the note E).
- **E minor:** root on string 6 (open), fifth on string 5 (fret 2, the note B).

The thumb plays on **beats 1 and 3**: the root, then the fifth. On beats 2 and 4 the index and middle fingers pluck strings 3 and 2 together, in the gaps.

**p – i+m – p – i+m**

Bass, chord, bass, chord.

The thumb must become automatic. Practise it alone until you can hold a conversation while it keeps going. Then add the fingers.`)] },
      { kind: "listen", blocks: [
        audio("The thumb alone on A minor: root, then fifth", tabSound("5:0/h 4:2/h | 5:0/h 4:2/h", 80)),
        audio("With the fingers: A minor", tabSound(ALTERNATING_AM, 80)),
        audio("A minor, then E minor", tabSound(`${ALTERNATING_AM} | ${ALTERNATING_EM}`, 80)),
      ] },
      { kind: "learn", blocks: [
        show(shape("5:0 4:2"), "A minor: the root A on string 5 and the fifth E on string 4.", "guitar"),
        picking("5:0/h 4:2/h | 5:0/h 4:2/h", "p p p p", "The thumb alone, on beats 1 and 3: string 5, then string 4."),
        picking(ALTERNATING_AM, ALTERNATING_FINGERS, "Thumb on beats 1 and 3; i and m together on beats 2 and 4."),
        picking(`${ALTERNATING_AM} | ${ALTERNATING_EM}`, repeat(ALTERNATING_FINGERS, 2), "A minor, then E minor. For E minor the thumb moves to strings 6 and 5."),
      ] },
      { kind: "practice", blocks: [
        choice("Which two notes does the alternating thumb play?", ["The root and the fifth", "The root and the octave", "The third and the seventh"], 0, "Both are notes of the chord."),
        find("Tap the fifth of A minor on string 4.", "E3", "String 4, fret 2: E.", { strings: [4], ...G }),
        find("Tap the fifth of E minor on string 5.", "B2", "String 5, fret 2: B.", { strings: [5], ...G }),
        choice("In this pattern, on which beats do the fingers play?", ["2 and 4", "1 and 3", "Every beat"], 0, "The thumb takes 1 and 3; the fingers answer on 2 and 4."),
        picking(ALTERNATING_AM, ALTERNATING_FINGERS, "Play along on A minor at 60."),
        picking(`${ALTERNATING_AM} | ${ALTERNATING_EM}`, repeat(ALTERNATING_FINGERS, 2), "A minor to E minor at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "fingerstyle-study-piece",
    title: "Study piece: an arpeggiated progression",
    order: 7,
    minutes: 8,
    concepts: ["fingerstyle-study"],
    needs: ["alternating-thumb"],
    steps: [
      { kind: "understand", blocks: [text(`This piece puts the stage together: four chords, the thumb on each root, the p-i-m-a pattern, and a pinch to finish.

It is eight bars long, one chord per bar:

**Am – C – G – Em – Am – C – Em – Am**

Bars 1 to 7 use **p – i – m – a** twice per bar. Bar 8 is a single pinch on A minor, thumb and ring finger together, held for the whole bar.

Where the thumb goes:

- **Am:** string 5, open.
- **C:** string 5, fret 3.
- **G:** string 6, fret 3.
- **Em:** string 6, open.

Learn it in two halves. In each half, first play only the thumb's notes, one per bar, while changing chords. Then add the fingers.

Keep the tempo slow enough that no chord change makes you hesitate. A slow, even performance sounds like music. A fast one with gaps does not.`)] },
      { kind: "listen", blocks: [
        audio("Bars 1 to 4: Am, C, G, Em", tabSound(STUDY_1, 80)),
        audio("Bars 5 to 8: Am, C, Em, and the final Am", tabSound(STUDY_2, 80)),
      ] },
      { kind: "learn", blocks: [
        picking(STUDY_1, repeat(PIMA, 4), "Bars 1 to 4."),
        picking(STUDY_2, `${repeat(PIMA, 3)} pa`, "Bars 5 to 8. The last bar is one pinch, held."),
      ] },
      { kind: "practice", blocks: [
        choice("Which pattern does the piece use in bars 1 to 7?", ["p-i-m-a", "p-i-m-i", "Pinches only"], 0, "Twice in every bar."),
        choice("On which string is the thumb for the G chord?", ["String 6", "String 5", "String 4"], 0, "The root G is at fret 3 of string 6."),
        choice("How does the piece end?", ["With a held pinch on A minor", "With a strum", "On a G chord"], 0, "Thumb and ring finger together, for a whole bar."),
        picking(STUDY_1, repeat(PIMA, 4), "Play along: bars 1 to 4 at 60."),
        picking(STUDY_2, `${repeat(PIMA, 3)} pa`, "Bars 5 to 8 at 60."),
      ] },
    ],
  },
];
