import type { LessonInput } from "@/core/schemas/content";
import { audio, build, chordOf, chords, choice, circle, ear, prog, progression, show, text } from "../helpers";

const base = { moduleSlug: "jazz-harmony", isFree: false, version: 1, minutes: 7 } as const;
const MAJOR_251 = prog("C", "ii7 V7 Imaj7", 76);
const MINOR_251 = prog("A", "iiø7 V7 i7", 76);
const BASIC_BLUES = prog("F", "I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 I7", 120);
const JAZZ_BLUES = prog("F", "I7 IV7 I7 I7 IV7 #iv°7 I7 VI7 ii7 V7 I7 V7", 120);

export const jazzHarmony: LessonInput[] = [
  {
    ...base,
    slug: "major-and-minor-two-five-one",
    title: "ii–V–I in major and in minor",
    order: 1,
    concepts: ["ii-v-i", "minor-ii-v-i"],
    needs: ["two-five-one", "seventh-chords-of-the-major-key", "harmonic-minor", "guide-tone-lines"],
    steps: [
      { kind: "understand", blocks: [text(`The **ii–V–I** is the most common chord movement in jazz. Its roots fall by a fifth twice, and each chord pulls to the next. You met it with triads. With sevenths it has two forms.

**Major: ii7 – V7 – Imaj7.** In C: Dm7 – G7 – Cmaj7. All three chords come from the C major scale.

**Minor: iiø7 – V7 – i.** In A minor: Bø7 – E7 – Am7.

- The **iiø7** is half-diminished, because the second note of a minor scale carries a diminished fifth: B D **F** A.
- The **V7** is a dominant seventh, not a minor one. Its third, G♯, is the raised 7th of A harmonic minor. That note is what makes the chord pull home.
- The **i** is a minor chord: Am7, or often Am6.

Learn to spot both. A half-diminished chord followed by a dominant a fourth higher almost always announces a minor key.`)] },
      { kind: "listen", blocks: [
        audio("Major ii–V–I: Dm7, G7, Cmaj7", MAJOR_251),
        audio("Minor ii–V–i: Bø7, E7, Am7", MINOR_251),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "ii7 V7 Imaj7"), "Major ii–V–I in C. Watch the third and seventh of each chord: one stays, the other falls a step."),
        show(progression("A", "iiø7 V7 i7"), "Minor ii–V–i in A minor. The same guide-tone movement: A falls to G♯, then D falls to C."),
        show(chordOf("B", "m7b5"), "Bø7, the ii chord of A minor: B D F A."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the major ii–V–I in C?", ["Dm7 – G7 – Cmaj7", "Dm7 – Gm7 – C7", "Dø7 – G7 – Cm7"], 0, "ii is minor seventh, V is dominant seventh, I is major seventh."),
        choice("In a minor ii–V–i, what kind of chord is the ii?", ["Half-diminished (m7♭5)", "Minor seventh", "Dominant seventh"], 0, "The second note of a minor scale carries a diminished fifth."),
        choice("Why is the V chord of A minor E7 and not Em7?", ["Its third is the raised 7th of harmonic minor", "Minor keys have no minor chords", "E7 is easier to play"], 0, "G♯ sits a half step below A and pulls to it."),
        build("Build Bø7, the ii chord of A minor.", "B D F A", "Root, minor third, diminished fifth, minor seventh."),
        ear("Major ii–V–I, or minor ii–V–i?", MINOR_251, ["Major", "Minor"], 1, "It starts on a half-diminished chord and comes to rest on a minor chord."),
        ear("And this one?", MAJOR_251, ["Major", "Minor"], 0, "Minor seventh, dominant seventh, then a major seventh chord as home."),
      ] },
    ],
  },
  {
    ...base,
    slug: "turnarounds",
    title: "Turnarounds: I–vi–ii–V",
    order: 2,
    concepts: ["turnarounds"],
    needs: ["major-and-minor-two-five-one", "other-secondary-dominants"],
    steps: [
      { kind: "understand", blocks: [text(`A **turnaround** is a short run of chords, usually two bars, that leads back to the start of a tune. Instead of sitting on the I chord and waiting, the harmony takes a quick trip and arrives home again exactly when the next chorus begins.

The standard turnaround is **I – vi – ii – V**. In C: Cmaj7 – Am7 – Dm7 – G7. The last three roots fall by fifths: A, D, G, and then C.

Players vary it all the time. Two common changes:

- **Make the vi a dominant:** Cmaj7 – **A7** – Dm7 – G7. A7 is V7 of ii, a secondary dominant. Its C♯ pulls up to D.
- **Start on iii instead of I:** **Em7** – A7 – Dm7 – G7. Em7 shares three notes with Cmaj7, so it can stand in for it. Now every root falls by a fifth.`)] },
      { kind: "listen", blocks: [
        audio("I – vi – ii – V in C, twice", prog("C", "Imaj7 vi7 ii7 V7 Imaj7 vi7 ii7 V7", 96)),
        audio("With A7 in place of Am7", prog("C", "Imaj7 VI7 ii7 V7 Imaj7 VI7 ii7 V7", 96)),
        audio("Starting on iii: Em7, A7, Dm7, G7, then home", prog("C", "iii7 VI7 ii7 V7 Imaj7", 96)),
      ] },
      { kind: "learn", blocks: [
        show(progression("C", "Imaj7 vi7 ii7 V7"), "The standard turnaround in C."),
        show(progression("C", "Imaj7 VI7 ii7 V7"), "The same with A7. One note changed: C became C♯."),
        circle("C", "Read the turnaround on the circle: A, D, G, C. Each step moves one place anticlockwise."),
      ] },
      { kind: "practice", blocks: [
        choice("What is a turnaround for?", ["Leading back to the start of the tune", "Changing key for good", "Ending the tune"], 0, "It fills the last bars so the harmony arrives home as the form begins again."),
        choice("What is the standard turnaround in C?", ["Cmaj7 – Am7 – Dm7 – G7", "Cmaj7 – Fmaj7 – G7 – Cmaj7", "Cmaj7 – Em7 – Fmaj7 – G7"], 0, "I – vi – ii – V."),
        choice("In Cmaj7 – A7 – Dm7 – G7, what is A7?", ["V7 of ii", "A borrowed chord", "The vi chord of the key"], 0, "A7 is the dominant of Dm, the ii chord."),
        choice("Why can Em7 replace Cmaj7?", ["They share three notes: E, G and B", "They have the same root", "Both are dominant chords"], 0, "Cmaj7 is C E G B. Em7 is E G B D."),
        choice("What is I – vi – ii – V in F?", ["Fmaj7 – Dm7 – Gm7 – C7", "Fmaj7 – Am7 – Dm7 – G7", "Fmaj7 – Dm7 – Em7 – C7"], 0, "The vi of F is D, the ii is G, the V is C."),
        ear("Is the second chord minor (Am7) or dominant (A7)?", prog("C", "Imaj7 VI7 ii7 V7", 84), ["Minor: Am7", "Dominant: A7"], 1, "The C♯ makes it brighter and gives it a pull towards Dm7."),
      ] },
    ],
  },
  {
    ...base,
    slug: "the-jazz-blues",
    title: "The jazz blues",
    order: 3,
    concepts: ["jazz-blues"],
    needs: ["twelve-bar-blues", "turnarounds", "secondary-leading-tone-chords"],
    steps: [
      { kind: "understand", blocks: [text(`The twelve-bar blues you know uses three chords: I7, IV7 and V7. Jazz players keep the twelve bars and the same landmarks, and add movement between them.

A common jazz blues in F, one chord per bar:

- **Bars 1–4:** F7, B♭7, F7, F7
- **Bars 5–8:** B♭7, B°7, F7, D7
- **Bars 9–12:** Gm7, C7, F7, C7

What changed, and why:

- **Bar 2 goes to IV7** and comes straight back. This is called the quick change.
- **Bar 6 is ♯iv°7**, B°7. The bass climbs B♭ to B and leads back to F7.
- **Bar 8 is VI7**, D7. It is V7 of ii and pulls to Gm7.
- **Bars 9–10 are a ii–V**, Gm7 – C7, in place of the plain V7 – IV7.
- **Bar 12 is V7**, a one-chord turnaround back to the top.

Bars 1, 5 and 11 still hold I, IV and I. The skeleton of the blues is untouched.

This is one common version. Players swap in more chords than these, and no two recordings agree bar for bar.`)] },
      { kind: "listen", blocks: [
        audio("The basic twelve-bar blues in F", BASIC_BLUES),
        audio("The jazz blues in F", JAZZ_BLUES),
      ] },
      { kind: "learn", blocks: [
        show(progression("F", "I7 IV7 I7 I7 IV7 #iv°7 I7 VI7 ii7 V7 I7 V7"), "The jazz blues in F. Press play and follow all twelve bars."),
        show(chordOf("B", "dim7"), "B°7, the chord in bar 6: B D F A♭. It shares D, F and A♭ with B♭7; only the root moved up."),
      ] },
      { kind: "practice", blocks: [
        choice("How many bars does a jazz blues have?", ["Twelve", "Sixteen", "Thirty-two"], 0, "The length and the landmarks of the blues stay the same."),
        choice("In a jazz blues in F, what replaces V7 – IV7 in bars 9 and 10?", ["Gm7 – C7", "C7 – B♭7", "Dm7 – G7"], 0, "A ii–V that leads back to F7."),
        choice("What does D7 in bar 8 lead to?", ["Gm7, the ii chord", "B♭7, the IV chord", "F7, the I chord"], 0, "D7 is V7 of ii."),
        choice("B°7 in bar 6 shares three notes with which chord?", ["B♭7", "C7", "Gm7"], 0, "B♭7 is B♭ D F A♭. Raise the root to B and you have B°7."),
        choice("Which bars still hold the I, IV and I chords of the basic blues?", ["Bars 1, 5 and 11", "Bars 2, 6 and 10", "Bars 4, 8 and 12"], 0, "The landmarks stay; the bars between them get busier."),
        ear("Basic blues or jazz blues?", JAZZ_BLUES, ["Basic blues", "Jazz blues"], 1, "You can hear the quick move to IV in bar 2 and the ii–V near the end."),
      ] },
    ],
  },
  {
    ...base,
    slug: "rhythm-changes",
    title: "Rhythm changes",
    order: 4,
    concepts: ["rhythm-changes"],
    needs: ["turnarounds", "other-secondary-dominants"],
    steps: [
      { kind: "understand", blocks: [text(`After the blues, the chord pattern jazz musicians use most is called **rhythm changes**. The name comes from the 1930 show tune “I Got Rhythm”, whose chords have been reused for hundreds of other melodies. It is usually played in B♭.

The form is **AABA**, 32 bars: an eight-bar A section, played twice, an eight-bar bridge (B), and the A section again.

**The A section** is built from turnarounds. Its first four bars are I – vi – ii – V twice, two beats per chord: B♭ – Gm7 – Cm7 – F7. Bars 5 and 6 visit the IV chord, E♭, and the last two bars turn around again.

**The bridge** is a chain of dominants, two bars each: **D7 – G7 – C7 – F7**. As numerals: III7 – VI7 – II7 – V7. Every chord is the V7 of the next one, so the roots walk round the circle of fifths until F7 delivers you back to B♭.

The A section stays close to home and moves fast. The bridge starts far from home and moves slowly back. That contrast is the point of the form.`)] },
      { kind: "listen", blocks: [
        audio("The start of the A section: B♭, Gm7, Cm7, F7, twice", prog("Bb", "Imaj7 vi7 ii7 V7 Imaj7 vi7 ii7 V7", 108)),
        audio("The bridge: D7, G7, C7, F7, and home to B♭", chords("D3 F#3 A3 C4", "D3 F#3 A3 C4", "G3 B3 D4 F4", "G3 B3 D4 F4", "C3 E3 G3 Bb3", "C3 E3 G3 Bb3", "F3 A3 C4 Eb4", "F3 A3 C4 Eb4", "Bb2 D3 F3 A3")),
      ] },
      { kind: "learn", blocks: [
        show(progression("Bb", "Imaj7 vi7 ii7 V7"), "The turnaround that opens the A section, in B♭."),
        show(progression("Bb", "III7 VI7 II7 V7"), "The bridge. Four dominant sevenths, each a fifth below the last."),
        circle("Bb", "Find D on the circle and step anticlockwise: D, G, C, F, then B♭."),
      ] },
      { kind: "practice", blocks: [
        choice("What is the form of rhythm changes?", ["AABA, 32 bars", "Twelve-bar blues", "Verse and chorus"], 0, "Three eight-bar A sections with a bridge before the last one."),
        choice("What are the bridge chords in B♭?", ["D7 – G7 – C7 – F7", "B♭ – Gm7 – Cm7 – F7", "E♭7 – B♭7 – F7 – B♭7"], 0, "A chain of dominants, each the V7 of the next."),
        choice("How do the roots of the bridge move?", ["Down a fifth each time", "Up a whole step each time", "Down a half step each time"], 0, "D to G to C to F: round the circle of fifths."),
        choice("The first four bars of the A section repeat which pattern?", ["I – vi – ii – V", "I – IV – V – I", "ii – V – I"], 0, "The standard turnaround, played twice."),
        choice("In the bridge, what is G7 to the chord after it?", ["Its V7", "Its IV", "Its relative minor"], 0, "G7 is the dominant of C."),
        ear("A section or bridge?", prog("Bb", "III7 III7 VI7 VI7 II7 II7 V7 V7", 120), ["A section", "Bridge"], 1, "Slow changes, all dominant sevenths, falling by fifths."),
      ] },
    ],
  },
];
