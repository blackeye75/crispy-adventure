// Playing track P2, Basic stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (finger numbers, hand shape, how the thumb passes under) is
// standard teaching written from memory, not checked against a pianist. Each such passage is marked
// "OWNER REVIEW" below. "Ode to Joy" is by Beethoven and in the public domain. No demo videos yet.
import type { LessonInput } from "@/core/schemas/content";
import { audio, backing, choice, ear, find, hands, rhythm, scale, seq, show, staff, text } from "../helpers";

const base = { moduleSlug: "melody-basic", track: "piano-melody", strand: "piano", isFree: false, version: 1, minutes: 6 } as const;
const P = { only: "piano" } as const;

const FIVE_UP_DOWN = "C4/q D4/q E4/q F4/q | G4/q F4/q E4/q D4/q | C4/w";
const FIVE_FINGERS = "1 2 3 4 5 4 3 2 1";
const LEFT_FIVE = "C3/q D3/q E3/q F3/q | G3/q F3/q E3/q D3/q | C3/w";
const LEFT_FINGERS = "5 4 3 2 1 2 3 4 5";
const SKIPS = "C4/q E4/q G4/q E4/q | C4/q E4/q G4/h";
// The opening of "Ode to Joy" (Beethoven, public domain). It stays inside the five-finger position.
export const ODE = "E4/q E4/q F4/q G4/q | G4/q F4/q E4/q D4/q | C4/q C4/q D4/q E4/q | E4/q. D4/8 D4/h";
export const ODE_FINGERS = "3 3 4 5 5 4 3 2 1 1 2 3 3 2 2";
const SCALE_UP = "C4/8 D4/8 E4/8 F4/8 G4/8 A4/8 B4/8 C5/8";
const SCALE_UP_FINGERS = "1 2 3 1 2 3 4 5";
const SCALE_DOWN = "C5/8 B4/8 A4/8 G4/8 F4/8 E4/8 D4/8 C4/8";
const SCALE_DOWN_FINGERS = "5 4 3 2 1 3 2 1";
const STEP_PHRASE = "C4/q D4/q E4/q D4/q";
const SKIP_PHRASE = "C4/q E4/q G4/q E4/q";
const MYSTERY = "E4/q D4/q C4/q D4/q | E4/q E4/q E4/h";
const BLACK_KEYS = "Gb4 Ab4 Bb4 Db5 Eb5";
const DRONE = "Gb2 Db3 Gb3";
const BLACK_PHRASE = "Bb4/q Ab4/q Gb4/h | Bb4/q Db5/q Eb5/h | Db5/q Bb4/q Ab4/q Bb4/q | Gb4/w";
const CALL = "E4/q G4/q A4/h";
const RESPONSE = "G4/q E4/q C4/h";

export const melodyBasic: LessonInput[] = [
  {
    ...base,
    slug: "five-finger-position",
    title: "Five fingers on five keys",
    order: 1,
    concepts: ["five-finger-position"],
    needs: ["piano-layout", "counting-out-loud"],
    steps: [
      // OWNER REVIEW: hand shape and finger numbers.
      { kind: "understand", blocks: [text(`A melody is one note at a time, and at the piano it usually lives in the right hand. The first skill is the simplest one: **five fingers on five neighbouring white keys**, one finger per key, and the hand does not move.

Pianists number the fingers the same way on both hands: **thumb is 1, little finger is 5.**

**C position, right hand:** thumb on **middle C**, then D, E, F and G under fingers 2, 3, 4 and 5.

**C position, left hand:** the little finger takes the C below middle C, so the numbers run the other way: 5 on C, then 4, 3, 2, and the thumb on G.

How it should feel:

- **A rounded hand**, as if holding a ball. Fingers curved, playing on their tips; the thumb plays on its side.
- **One finger at a time.** As one key goes down, the last one comes up, so the notes join without overlapping.
- **Even sound.** The thumb is heavy and the fourth and fifth fingers are weak. Listen, and make all five the same.

Because the hand stays still, you can play without looking down. That frees your eyes for the page, and your ears for the sound.`)] },
      { kind: "listen", blocks: [
        audio("Five notes up and back, right hand", rhythm(FIVE_UP_DOWN, 90)),
        audio("The same in the left hand, an octave lower", rhythm(LEFT_FIVE, 90)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: FIVE_UP_DOWN, rightFingers: FIVE_FINGERS }, "Right hand in C position: fingers 1 to 5 and back."),
        hands({ right: "r/w | r/w | r/w", left: LEFT_FIVE, leftFingers: LEFT_FINGERS }, "Left hand: the little finger starts, the thumb reaches G."),
        hands({ right: SKIPS, rightFingers: "1 3 5 3 1 3 5" }, "Skipping a key: fingers 1, 3 and 5 play C, E and G."),
      ] },
      { kind: "practice", blocks: [
        choice("Which finger is number 1?", ["The thumb", "The index finger", "The little finger"], 0, "On both hands, the thumb is 1 and the little finger is 5."),
        choice("In C position, which note is under the right hand's fifth finger?", ["G", "E", "A"], 0, "C D E F G: the fifth note."),
        choice("In C position, which left-hand finger plays C?", ["5, the little finger", "1, the thumb", "3, the middle finger"], 0, "The numbers run the other way in the left hand."),
        find("Tap the note under the right hand's third finger in C position.", "E4", "Thumb on middle C, then D, then E.", P),
        choice("Which fingers tend to sound weaker?", ["4 and 5", "1 and 2", "They are all the same"], 0, "Listen for them and even out the sound."),
        hands({ right: FIVE_UP_DOWN, rightFingers: FIVE_FINGERS }, "Play along at 70. Do not look at your hand.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "first-melodies",
    title: "Your first melody",
    order: 2,
    concepts: ["first-melodies"],
    needs: ["five-finger-position", "note-lengths"],
    steps: [
      { kind: "understand", blocks: [text(`Five keys are enough for a real tune. The opening of **"Ode to Joy"** by Beethoven uses only C, D, E, F and G, so your hand can stay in C position from start to finish.

Start with the **third finger on E**. The whole phrase moves by step, one key at a time, except where a note repeats.

How to learn any melody:

1. **Say the rhythm** before you play. Here it is nearly all quarter notes, one per beat. Only the last bar changes: a long note, a short one, then a held one.
2. **Play it slowly, with the finger numbers.** Trust the position. If finger 3 is on E, finger 5 is already on G.
3. **Repeated notes get a new press, not a new finger.** E, E at the start is finger 3 twice.
4. **Shape it.** A melody is a sentence. Let it grow a little towards its highest note and relax at the end.

Sing it as you play. If you can sing a tune, your hand has something to follow.`)] },
      { kind: "listen", blocks: [
        audio("Ode to Joy, the first four bars", rhythm(ODE, 96)),
        audio("The same, slowly", rhythm(ODE, 66)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", ODE, "As written. It starts on E and never leaves the five keys.", { time: true, names: true, bpm: 80 }),
        hands({ right: ODE, rightFingers: ODE_FINGERS }, "With finger numbers. Start on finger 3.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("On which note does the tune start?", ["E", "C", "G"], 0, "Finger 3, in C position."),
        choice("Which finger plays that first note?", ["3", "1", "5"], 0, "Thumb on C puts finger 3 on E."),
        choice("The first two notes are the same. What do you do?", ["Press the same finger twice", "Change fingers", "Hold the first one"], 0, "A repeated note is a new press with the same finger."),
        choice("What is the highest note of the phrase?", ["G", "A", "F"], 0, "Finger 5: the top of C position."),
        hands({ right: ODE, rightFingers: ODE_FINGERS }, "Play along at 60.", 60),
        hands({ right: ODE, rightFingers: ODE_FINGERS }, "And at 84.", 84),
      ] },
    ],
  },
  {
    ...base,
    slug: "passing-the-thumb-under",
    title: "Passing the thumb under",
    order: 3,
    concepts: ["thumb-under"],
    needs: ["first-melodies", "the-major-scale-formula"],
    steps: [
      // OWNER REVIEW: the scale fingering and how the thumb travels.
      { kind: "understand", blocks: [text(`Five fingers cover five keys. A scale has eight notes. To play all eight smoothly with one hand, the **thumb passes under** the fingers on the way up, and a **finger crosses over** the thumb on the way down.

**C major, right hand, going up:** 1 2 3, then **1** 2 3 4 5.

After finger 3 plays E, the thumb slides underneath it and plays F. The hand has moved to a new position without a break in the sound.

**Coming down:** 5 4 3 2 1, then **3** 2 1.

After the thumb plays F, finger 3 crosses over it and plays E.

How to make it smooth:

- **Start the thumb early.** As finger 2 plays, the thumb is already travelling under the hand. If it waits until it is needed, the scale bumps.
- **Keep the wrist level.** Do not twist the elbow out or let the wrist dip to help the thumb. The thumb moves; the arm follows quietly.
- **Listen for the join.** F should sound exactly like the notes around it, with no accent and no gap.

This one movement is the key to every scale and every melody wider than five notes.`)] },
      { kind: "listen", blocks: [
        audio("C major up one octave", rhythm(SCALE_UP, 80)),
        audio("And down", rhythm(SCALE_DOWN, 80)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: SCALE_UP, rightFingers: SCALE_UP_FINGERS }, "Up: 1 2 3, then the thumb passes under to F.", 60),
        hands({ right: SCALE_DOWN, rightFingers: SCALE_DOWN_FINGERS }, "Down: 5 4 3 2 1, then finger 3 crosses over to E.", 60),
        show(scale("C", "major"), "The C major scale: eight white keys from C to C.", "piano"),
      ] },
      { kind: "practice", blocks: [
        choice("Going up the C major scale, which finger plays F?", ["1, the thumb", "4", "5"], 0, "1 2 3, then the thumb passes under."),
        choice("Coming down, which finger crosses over the thumb?", ["3", "2", "5"], 0, "5 4 3 2 1, then 3 2 1."),
        choice("When should the thumb start moving under?", ["Early, while finger 2 is playing", "After finger 3 has let go", "It does not matter"], 0, "An early thumb arrives without a bump."),
        find("Tap the note the thumb plays after it passes under.", "F4", "C D E, then the thumb on F.", P),
        hands({ right: SCALE_UP, rightFingers: SCALE_UP_FINGERS }, "Play the scale up at 60.", 60),
        hands({ right: SCALE_DOWN, rightFingers: SCALE_DOWN_FINGERS }, "And down at 60.", 60),
      ] },
    ],
  },
  {
    ...base,
    slug: "picking-out-a-melody-by-ear",
    title: "Picking out a melody by ear",
    order: 4,
    concepts: ["playing-by-ear"],
    needs: ["passing-the-thumb-under"],
    steps: [
      { kind: "understand", blocks: [text(`Before you could read, you could sing tunes you had heard. Finding those tunes on the keyboard is a skill of its own, and it is the fastest way to connect your ear to your hands.

A method:

1. **Sing the tune.** Out loud. If you cannot sing it, you do not know it well enough yet.
2. **Find the first note.** Sing it, hold it, and try keys until one matches.
3. **For each next note, ask one question: up, down, or the same?**
4. **Then ask: by step or by skip?** A step is the very next key in the scale. A skip jumps over one or more.
5. **Check as you go.** Play what you have so far and sing along. A wrong note will stand out.

Most simple tunes move mostly by step, with a skip now and then, and nearly all of them **end on the home note**. If you are playing in C and the tune feels finished, you are probably on C.

Start with tunes you know deeply: nursery rhymes, folk songs, a phone ringtone. Use only the white keys at first and treat C as home.`)] },
      { kind: "listen", blocks: [
        audio("Moving by step", rhythm(STEP_PHRASE, 90)),
        audio("Moving by skip", rhythm(SKIP_PHRASE, 90)),
        audio("A short tune to find. It starts on E.", rhythm(MYSTERY, 90)),
      ] },
      { kind: "learn", blocks: [
        staff("treble", STEP_PHRASE, "Steps: each note is the next key along.", { time: true, names: true, bpm: 90 }),
        staff("treble", SKIP_PHRASE, "Skips: each note jumps over a key.", { time: true, names: true, bpm: 90 }),
        hands({ right: MYSTERY, rightFingers: "3 2 1 2 3 3 3" }, "The answer to the tune you heard. Try to find it yourself before you play this.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("What is the first thing to do with a tune you want to play by ear?", ["Sing it", "Look for the sheet music", "Play every key"], 0, "Singing proves you really know it."),
        ear("Does this move by step or by skip?", rhythm(SKIP_PHRASE, 90), ["By step", "By skip"], 1, "Each note jumps over a key."),
        ear("And this?", rhythm(STEP_PHRASE, 90), ["By step", "By skip"], 0, "Each note is the next key along."),
        ear("The tune starts on E. Does its second note go up or down?", rhythm(MYSTERY, 90), ["Up", "Down"], 1, "E down to D."),
        choice("On which note do most simple tunes end?", ["The home note", "The highest note", "Any black key"], 0, "It is the note that sounds finished."),
        find("The tune you heard goes E, D, and then one more step down. Tap that note.", "C4", "E, D, C.", P),
      ] },
    ],
  },
  {
    ...base,
    slug: "improvising-on-the-black-keys",
    title: "First improvising: the black keys",
    order: 5,
    concepts: ["pentatonic-improvising"],
    needs: ["picking-out-a-melody-by-ear"],
    steps: [
      { kind: "understand", blocks: [text(`To improvise is to make up music as you play. It sounds like an advanced skill. On the piano there is a way to start today, with no wrong notes.

**Play only the black keys.**

The five black keys form a **pentatonic scale**, a five-note scale with no half steps in it. Without half steps, no two notes clash, so any black key sounds good after any other.

Set it up like this:

- **Left hand:** hold two black keys low down, **G♭ and D♭**. G♭ is the lowest key in a group of three black keys; D♭ is the lower key of the pair above it. This is your home, and it keeps ringing.
- **Right hand:** play any black keys you like, higher up.

Now give it shape, because random notes are not yet music:

- **Use few notes.** Three or four are plenty.
- **Repeat yourself.** Play a small idea, then play it again. Repetition is what makes it sound intended.
- **Use long notes and gaps.** Let a note ring. Leave a rest.
- **End on G♭.** It is home here, and landing on it closes the phrase.

Later you will learn why this works and how to do it in every key. For now, just play.`)] },
      { kind: "listen", blocks: [
        audio("The five black keys", seq(BLACK_KEYS, 100)),
        audio("A phrase made from them, ending on G♭", rhythm(BLACK_PHRASE, 84)),
      ] },
      { kind: "learn", blocks: [
        show(scale("Gb", "major-pentatonic"), "The black keys: G♭, A♭, B♭, D♭, E♭. Together they are the G♭ major pentatonic scale.", "piano"),
        hands({ right: BLACK_PHRASE, left: "Gb2+Db3/w | Gb2+Db3/w | Gb2+Db3/w | Gb2+Db3/w" }, "An example. The left hand holds G♭ and D♭; the right hand wanders and comes home.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("Why do the black keys always sound good together?", ["They form a scale with no half steps", "They are louder", "They are all the same note"], 0, "No half steps means no clashes."),
        choice("How many different notes are in a pentatonic scale?", ["Five", "Seven", "Twelve"], 0, "Penta means five."),
        choice("What makes an improvised phrase sound intended?", ["Repeating a small idea", "Playing as many notes as possible", "Never repeating anything"], 0, "The listener recognises it the second time."),
        find("Tap the home note of the black-key scale.", "Gb", "The lowest of the three black keys in a group.", P),
        choice("Where should a phrase end to sound finished?", ["On G♭, the home note", "On any note", "On the highest note"], 0, "Home closes the phrase."),
        backing("The left hand is played for you. Improvise on the black keys with your right hand.", [["G♭", DRONE], ["G♭", DRONE], ["G♭", DRONE], ["G♭", DRONE]], 70, scale("Gb", "major-pentatonic")),
      ] },
    ],
  },
  {
    ...base,
    slug: "call-and-response-at-the-piano",
    title: "Call and response, and leaving space",
    order: 6,
    concepts: ["call-and-response"],
    needs: ["improvising-on-the-black-keys"],
    steps: [
      { kind: "understand", blocks: [text(`A stream of notes with no gaps is hard to listen to. Music that people remember is built from **phrases**, short musical sentences, with **space** between them.

The oldest way to shape phrases is **call and response**: one phrase asks, the next one answers.

- The **call** ends on a note that is **not** home. It sounds open, as if waiting.
- The **response** ends on the **home note**. It sounds finished.

In C, using the five notes C, D, E, G and A:

- Call: **E, G, A**. It stops on A and hangs.
- Response: **G, E, C**. It comes down to C and rests.

Then **leave a gap** before the next call. Silence is part of the music. It lets the listener take in what you played, and it gives you time to hear your next idea before your hands play it.

Try this exercise: play for one bar, rest for one bar. During the rest, sing or imagine the answer. Then play what you heard.

You can also do it between your hands: the right hand calls, the left hand answers lower down.`)] },
      { kind: "listen", blocks: [
        audio("The call: it stops on A and waits", rhythm(CALL, 90)),
        audio("The response: it comes home to C", rhythm(RESPONSE, 90)),
        audio("Call, a breath, then the response", rhythm(`${CALL} | r/w | ${RESPONSE} | r/w`, 90)),
      ] },
      { kind: "learn", blocks: [
        hands({ right: `${CALL} | r/w | ${RESPONSE} | r/w` }, "Call, rest, response, rest. The gaps are part of it.", 70),
        hands({ right: `${CALL} | r/w`, left: `r/w | G3/q E3/q C3/h` }, "Between the hands: the right hand asks, the left hand answers.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("How does a call usually end?", ["On a note that is not home", "On the home note", "On a rest only"], 0, "It sounds open, and asks for an answer."),
        choice("How does a response usually end?", ["On the home note", "On the highest note", "On a black key"], 0, "Home sounds finished."),
        ear("Call or response?", rhythm(RESPONSE, 90), ["Call: it ends open", "Response: it ends at home"], 1, "It comes down and rests on C."),
        ear("And this?", rhythm(CALL, 90), ["Call: it ends open", "Response: it ends at home"], 0, "It stops on A and waits."),
        choice("Why leave a gap between phrases?", ["So the idea can be heard, and the next one found", "Because fast playing is wrong", "To rest your hands"], 0, "Silence gives a phrase its shape."),
        backing("One bar to play, one bar to rest. Use C, D, E, G and A, and answer yourself.", [["C", "C3 G3 C4"], ["C", "C3 G3 C4"], ["C", "C3 G3 C4"], ["C", "C3 G3 C4"]], 70, scale("C", "major-pentatonic")),
      ] },
    ],
  },
];
