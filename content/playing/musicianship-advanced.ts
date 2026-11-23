// Track M1, Advanced stage (docs/PLAYING.md): playing music, for both instruments.
// OWNER REVIEW: the advice here (band roles, arranging guitar with piano, songwriting, performing, finding a
// style) is common teaching written from memory, not checked against working musicians. The example parts
// and the example song are original.
import type { LessonInput } from "@/core/schemas/content";
import { audio, backing, choice, chords, ear, rhythm, strumSound, text } from "../helpers";

const base = { moduleSlug: "musicianship-advanced", track: "musicianship", stage: "advanced", isFree: false, version: 1, minutes: 7 } as const;
const C = "C3 G3 C4 E4";
const AM = "A2 E3 A3 C4";
const F = "F2 C3 F3 A3";
const G = "G2 D3 G3 B3";
const hit = (notes: string) => notes.split(" ").join("+");

// Two players on C Am F G: both in the same register and rhythm, then split by register and rhythm.
const CROWDED = rhythm(`${"C3+E3+G3+C4+E4/q ".repeat(4).trim()} | ${"A2+C3+E3+A3+C4/q ".repeat(4).trim()}`, 84);
const SPLIT = rhythm("C3+G3+C4+E4+E5+G5/8 C3+G3+C4+E4/8 C3+G3+C4+E4/8 C3+G3+C4+E4/8 C3+G3+C4+E4/8 C3+G3+C4+E4/8 C3+G3+C4+E4/8 C3+G3+C4+E4/8 | A2+E3+A3+C4+C5+E5/8 A2+E3+A3+C4/8 A2+E3+A3+C4/8 A2+E3+A3+C4/8 A2+E3+A3+C4/8 A2+E3+A3+C4/8 A2+E3+A3+C4/8 A2+E3+A3+C4/8", 84);
const GUITAR_ONLY = strumSound("D - D U - U D U", C, 84);
const PIANO_PAD = rhythm("C5+E5+G5/w | C5+E5+A5/w | C5+F5+A5/w | B4+D5+G5/w", 84);
// An original song sketch: chorus melody over C Am F G.
const SONG_CHORDS: [string, string][] = [["C", C], ["Am", AM], ["F", F], ["G", G]];
const HOOK = rhythm("E4/q G4/q G4/h | A4/q G4/q E4/h | F4/q A4/q C5/q A4/q | G4/w", 92);
const HOOK_WITH_CHORDS = rhythm(`${hit(C)}+E4/q G4/q G4/h | ${hit(AM)}+A4/q G4/q E4/h | ${hit(F)}+F4/q A4/q C5/q A4/q | ${hit(G)}+G4/w`, 92);
const STRAIGHT = strumSound("D - D U - U D U", C, 84);
const ARPEGGIO = rhythm("C3/8 G3/8 C4/8 E4/8 G4/8 E4/8 C4/8 G3/8", 84);
const OFFBEAT = strumSound("- U. - U. - U. - U.", C, 84);

export const musicianshipAdvanced: LessonInput[] = [
  {
    ...base,
    slug: "playing-with-other-musicians",
    title: "Playing with other musicians",
    order: 1,
    concepts: ["band-roles"],
    needs: ["recording-yourself"],
    steps: [
      { kind: "understand", blocks: [text(`Playing alone, you are the whole band. Playing with others, you are **one part of it**, and the best thing you can do is often to play less.

**Roles.** In a typical band:

- **Drums** keep time.
- **Bass** plays the roots and locks with the drums.
- **Guitar and piano** fill in the harmony and the rhythm in the middle.
- **Voice or a lead instrument** carries the melody.

**Leave room.** If there is a bass player, the piano's left hand does not need to play low roots, and the guitar does not need its bottom strings. Two players in the same register, playing the same rhythm, **fight**: the sound turns to mush, and neither part is heard.

**Separate by register and by rhythm.** If the guitar strums in the middle, the piano can hold chords **higher up**, or play a different, sparser rhythm. Each part becomes clearer, and together they sound bigger.

**Listen more than you play.** Keep half your attention on the others: when the singer is singing, stay simple; when there is a gap, that is where a fill goes.

**Agree on the map.** Before you start: the key, the tempo, the form, who counts in, and how it ends.`)] },
      { kind: "listen", blocks: [
        audio("Two players in the same register and rhythm: crowded", CROWDED),
        audio("The same chords split by register and rhythm: clear", SPLIT),
      ] },
      { kind: "learn", blocks: [
        backing("Imagine a bass player on the roots. Play these chords using only the middle and top of your instrument.", SONG_CHORDS, 80),
      ] },
      { kind: "practice", blocks: [
        choice("Who usually plays the roots in a band?", ["The bass", "The singer", "The drummer"], 0, "Bass and drums form the foundation."),
        choice("With a bass player present, what should a pianist's left hand avoid?", ["Doubling the low roots", "Playing at all", "Playing chords"], 0, "Leave the low register to the bass."),
        choice("Two players clash in the same register and rhythm. What helps most?", ["One moves higher or changes rhythm", "Both play louder", "Both play faster"], 0, "Separate by register and rhythm."),
        choice("When is the best moment for a fill?", ["In a gap in the melody", "While the singer sings", "On every beat"], 0, "Listen for space."),
        ear("Crowded or clear?", SPLIT, ["Crowded", "Clear"], 1, "Different registers, different rhythms."),
        choice("What should a band agree on before starting?", ["Key, tempo, form, count-in and ending", "Only the key", "Nothing: just start"], 0, "The map of the song."),
      ] },
    ],
  },
  {
    ...base,
    slug: "arranging-guitar-and-piano-together",
    title: "Arranging guitar and piano together",
    order: 2,
    concepts: ["guitar-piano-arranging"],
    needs: ["playing-with-other-musicians", "spread-voicings"],
    steps: [
      { kind: "understand", blocks: [text(`Guitar and piano can both play every chord, which is exactly the problem: put them together without a plan and they cover the same ground. Arranging is deciding **who does what**.

Three ways to divide the work:

**1. By register.** The guitar's open chords sit roughly between the C below middle C and the C above it. So the piano plays **higher**: chords in the octave above middle C or higher, right hand only. Or **lower**, if there is no bass player.

**2. By rhythm.** One instrument moves, the other holds. Guitar strums eighth notes; piano holds a chord for the whole bar, like a string section (a "pad"). Or piano plays a busy pattern while guitar plays one stab per bar.

**3. By voicing.** Avoid both playing the same notes in the same octave. If the guitar has the root at the bottom, the piano can play the 3rd, 5th and the top note, or add a colour note like a 9th that the guitar is not playing.

A good test: **mute one instrument.** Each part should make sense on its own, and the two together should sound like more than either.

In this lesson, the guitar strums in the middle, and the piano holds high chords above it, with smooth top notes: G, A, A, G.`)] },
      { kind: "listen", blocks: [
        audio("Guitar strumming C", GUITAR_ONLY),
        audio("Piano pad: high, held chords over C, Am, F, G", PIANO_PAD),
      ] },
      { kind: "learn", blocks: [
        backing("If you play guitar: strum this. If you play piano: hold high chords, one per bar.", SONG_CHORDS, 80),
      ] },
      { kind: "practice", blocks: [
        choice("Guitar is strumming open chords. Where should the piano usually go?", ["Higher, above the guitar", "Exactly the same notes", "Nowhere: it should stop"], 0, "Divide by register."),
        choice("What is a pad?", ["A chord held for a long time underneath", "A drum sound", "A fast run"], 0, "Like a string section."),
        choice("If guitar strums eighth notes, what rhythm suits the piano?", ["Held chords or sparse stabs", "The same eighth notes", "Sixteenth notes"], 0, "One moves, the other holds."),
        choice("What is a good test of an arrangement?", ["Each part makes sense when the other is muted", "It is as loud as possible", "Both play the same thing"], 0, "Parts that stand alone fit together."),
        ear("Is this a held pad or a strummed part?", PIANO_PAD, ["Held pad", "Strummed"], 0, "One long chord per bar, high up."),
        choice("The guitar plays the root at the bottom. What could the piano add?", ["The 3rd, 5th or a 9th, higher up", "The same root in the same octave", "Nothing"], 0, "Different notes, different place."),
      ] },
    ],
  },
  {
    ...base,
    slug: "writing-a-song",
    title: "Writing a song: progression, melody, form",
    order: 3,
    concepts: ["songwriting"],
    needs: ["arranging-guitar-and-piano-together", "writing-your-own"],
    steps: [
      { kind: "understand", blocks: [text(`You already know everything a simple song is made of. Writing one is putting it together in a sensible order.

**1. A progression.** Four chords from one key are plenty. **C, Am, F, G** (I–vi–IV–V) is a classic. Loop it until it feels like a groove.

**2. A melody over it.** Hum over the loop. Some guidelines:

- **Land on chord tones** on strong beats: E or G over C, A or C over Am.
- **Mostly steps, a few leaps.** A leap is an event; save it for the important word.
- **Repeat, then change.** A short idea, the same idea again, then something new. Listeners need to recognise something to hold on to.
- **Leave space** for breath.

The hook in this lesson: **E, G, G; A, G, E; F, A, C, A; G**. Every strong beat lands on a chord tone.

**3. Form.** Write a second section that contrasts with the first: a different chord to start on, a higher melody, a busier rhythm. Then arrange them: **verse, chorus, verse, chorus**, maybe a bridge.

**4. Words**, if you write them, fit the rhythm of the tune; stressed syllables go on strong beats.

Record every idea, however rough. Most songs start as a phone recording of something hummed on the way home.`)] },
      { kind: "listen", blocks: [
        audio("The loop: C, Am, F, G", chords(C, AM, F, G)),
        audio("The hook alone", HOOK),
        audio("The hook over the chords", HOOK_WITH_CHORDS),
      ] },
      { kind: "learn", blocks: [
        backing("Loop C, Am, F, G and hum your own melody over it. Record it.", SONG_CHORDS, 84),
      ] },
      { kind: "practice", blocks: [
        choice("Over C, which melody notes are safest on a strong beat?", ["C, E or G", "D, F or B", "Any black key"], 0, "Chord tones."),
        choice("What makes a melody memorable?", ["Repeating an idea, then changing it", "Never repeating anything", "Only leaps"], 0, "Recognition, then surprise."),
        choice("How should a chorus contrast with a verse?", ["A different first chord, higher melody or busier rhythm", "Exactly the same in every way", "Different key every time"], 0, "Contrast gives the song its shape."),
        choice("Where do stressed syllables go?", ["On strong beats", "On rests", "Anywhere"], 0, "Words follow the rhythm of the tune."),
        ear("Does this melody land on chord tones?", HOOK_WITH_CHORDS, ["Yes", "No, it clashes"], 0, "E over C, A over Am, F over F, G over G."),
        backing("Write a second four-bar section over Am, F, C, G. Play it after the first.", [["Am", AM], ["F", F], ["C", C], ["G", G]], 84),
      ] },
    ],
  },
  {
    ...base,
    slug: "performing",
    title: "Performing: memorising and recovering",
    order: 4,
    concepts: ["performance"],
    needs: ["writing-a-song"],
    steps: [
      { kind: "understand", blocks: [text(`Playing for people is a skill of its own, separate from playing well. Two parts of it can be practised.

**Memorising: remember the map, not every note.**

- **The form first:** intro, verse, chorus, verse, chorus, bridge, chorus, end.
- **The chords as numbers:** "the verse is I–IV–I–V, the chorus starts on vi". Numbers are fewer to remember than chord names, and they survive a key change.
- **Landmarks:** where the tricky bar is, what the last chord is.

If you know the map, your hands can find their way. If you only know the notes as a chain, one broken link and the whole thing stops.

**Recovering: never stop.** Everyone makes mistakes on stage. Listeners rarely notice a wrong note; they always notice when the music stops.

- **Keep the beat going**, whatever your hands are doing.
- **If you are lost, jump to the next beat 1**, or the next section, and come in there.
- **Simplify.** Play just the root, or one chord a bar, until you are back.
- **Do not show it.** No face, no apology. Nobody knows what the song was supposed to be except you.

Practise recovering on purpose: play along with a backing track, and every so often stop for a beat and rejoin at the next bar.`)] },
      { kind: "listen", blocks: [
        audio("The progression to memorise: I – vi – IV – V in C", chords(C, AM, F, G)),
      ] },
      { kind: "learn", blocks: [
        backing("Practise recovering: play along, drop out for a beat whenever you like, and come back in on the next beat 1.", SONG_CHORDS, 84),
      ] },
      { kind: "practice", blocks: [
        choice("What should you memorise first?", ["The form of the song", "Every note in order", "The last bar"], 0, "The map first."),
        choice("Why memorise chords as numbers?", ["Fewer to remember, and they work in any key", "Numbers sound better", "Because chord names are wrong"], 0, "I–IV–V in any key."),
        choice("You get lost on stage. What do you do?", ["Keep the beat and come back in on the next beat 1", "Stop and start again", "Apologise to the audience"], 0, "Never stop the music."),
        choice("What do listeners notice most?", ["The music stopping", "A wrong note", "A wrong chord voicing"], 0, "Keep going."),
        choice("How can you practise recovering?", ["Drop out on purpose and rejoin", "Never make mistakes", "Only play alone"], 0, "Make recovery a habit."),
        ear("Which numerals is this: I–vi–IV–V or I–IV–V–I?", chords(C, AM, F, G), ["I – vi – IV – V", "I – IV – V – I"], 0, "The second chord is minor: A minor."),
      ] },
    ],
  },
  {
    ...base,
    slug: "finding-your-own-style",
    title: "Finding your own style",
    order: 5,
    concepts: ["personal-style"],
    needs: ["performing"],
    steps: [
      { kind: "understand", blocks: [text(`Style is not something you invent from nothing. It is what is left when you have absorbed many influences and combined them in your own way.

**1. Copy carefully.** Pick players you love and learn their parts exactly: the notes, the rhythm, the touch, the tone. Not just "what" but "how". Every great player started by imitating.

**2. Ask why.** Once you can play it, work out *why* it sounds like them. A favourite rhythm? A way of voicing chords? Lots of space? The theory you know now lets you name it.

**3. Combine.** Take a rhythm from one player and a harmony from another. A folk strumming hand with jazz chords; a gospel left hand under a pop song. New combinations are where style comes from.

**4. Limit yourself.** Constraints force choices: play a song using only three chords, only the top four strings, only one octave of the piano. Choices are style.

**5. Keep what is yours.** Notice the things you do naturally, even your "mistakes", and lean into the ones you like.

Here is one chord, C major, played three ways: strummed straight, broken into a rolling arpeggio, and on the off-beats like reggae. Same harmony; three completely different identities.`)] },
      { kind: "listen", blocks: [
        audio("Strummed straight", STRAIGHT),
        audio("Broken into an arpeggio", ARPEGGIO),
        audio("On the off-beats", OFFBEAT),
      ] },
      { kind: "learn", blocks: [
        backing("Play C, Am, F, G three ways in turn: strummed, broken, and on the off-beats. Which feels like you?", SONG_CHORDS, 84),
      ] },
      { kind: "practice", blocks: [
        choice("Where does a personal style come from?", ["Absorbing and combining influences", "Never listening to anyone", "Only theory"], 0, "Copy, understand, combine."),
        choice("When copying a player, what should you learn?", ["How they play, not just what", "Only the chords", "Only the fastest parts"], 0, "Touch, rhythm and tone matter."),
        choice("Why use constraints?", ["They force choices, and choices are style", "They make playing easier", "They are a beginner exercise only"], 0, "Fewer options, clearer identity."),
        ear("Which version is this?", OFFBEAT, ["Straight strum", "Arpeggio", "Off-beats"], 2, "The chord falls between the beats."),
        ear("And this?", ARPEGGIO, ["Straight strum", "Arpeggio", "Off-beats"], 1, "One note at a time, rolling."),
        choice("What should you do with things you do naturally?", ["Notice them and keep the ones you like", "Always remove them", "Ignore them"], 0, "That is where your style already is."),
      ] },
    ],
  },
];
