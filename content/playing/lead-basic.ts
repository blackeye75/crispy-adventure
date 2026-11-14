// Playing track G2, Basic stage (docs/PLAYING.md).
// OWNER REVIEW: every sentence about the hands (pick direction, which finger takes which fret, how to hammer,
// pull off, slide, bend and add vibrato) is standard teaching written from memory, not checked against a
// player. Each such passage is marked "OWNER REVIEW" below. These lessons also still need their demo videos.
import type { LessonInput } from "@/core/schemas/content";
import { audio, backing, choice, ear, find, position, seq, shape, show, tab, tabSound, text } from "../helpers";

const base = { moduleSlug: "lead-basic", track: "guitar-lead", strand: "guitar", isFree: false, version: 1, minutes: 7 } as const;
const G = { only: "guitar" } as const;

const ONE_STRING = "3:5/8 3:5/8 3:5/8 3:5/8 3:7/8 3:7/8 3:7/8 3:7/8";
const ACROSS = "6:5/8 6:8/8 5:5/8 5:7/8 4:5/8 4:7/8 3:5/8 3:7/8";
const BOX_UP = "6:5/8 6:8/8 5:5/8 5:7/8 4:5/8 4:7/8 3:5/8 3:7/8 | 2:5/8 2:8/8 1:5/8 1:8/8 1:8/h";
const BOX_DOWN = "1:8/8 1:5/8 2:8/8 2:5/8 3:7/8 3:5/8 4:7/8 4:5/8 | 5:7/8 5:5/8 6:8/8 6:5/8 6:5/h";
const HAMMER = "3:5/8 3:7/8^h 3:5/8 3:7/8^h 3:5/q 3:7/q^h";
const PULL = "3:7/8 3:5/8^p 3:7/8 3:5/8^p 3:7/q 3:5/q^p";
const BOTH = "3:5/8 3:7/8^h 3:5/8^p 4:7/8 4:7/h";
const SLIDE = "3:5/q 3:7/q^s 3:7/q 3:5/q^s";
const SLIDE_OUT = "3:5/8 3:7/8 3:9/q^s 2:8/8 2:10/8^s 2:10/q";
const BEND_CHECK = "3:9/h 3:7/h^b";
const BEND_HALF = "3:8/h 3:7/h^bh";
const BEND_PHRASE = "3:7/q^b 2:5/q 3:7/q^b 2:5/q";
const VIBRATO = "3:7/h 3:7/h^v";
const LICK_1 = "2:8/8 2:5/8 3:7/8 3:5/8 4:7/h";
const LICK_2 = "3:7/q^b 2:5/8 3:7/8 3:5/8^p 4:7/8 4:7/q^v";
const LICK_3 = "1:8/8 1:5/8 2:8/8 2:5/8 3:7/8 3:5/8^p 4:7/q^v";
const CALL = "r/8 3:5/8 3:7/8^h 2:5/8 2:5/h";
const RESPONSE = "2:8/8 2:5/8 3:7/8 3:5/8^p 4:7/h^v";
const A7 = "A2 E3 G3 C#4";
const D7 = "D3 A3 C4 F#4";
const E7 = "E2 B2 D3 G#3";
const BOX = position("A", "minor-pentatonic", 5, 8);
const BLUES: [string, string][] = [["A7", A7], ["A7", A7], ["A7", A7], ["A7", A7], ["D7", D7], ["D7", D7], ["A7", A7], ["A7", A7], ["E7", E7], ["D7", D7], ["A7", A7], ["A7", A7]];
// The study piece: twelve bars over A, A, A, A, D, D, A, A, E, D, A, A.
const SOLO_1 = `${CALL} | ${RESPONSE} | ${CALL} | 2:8/8 2:5/8 3:7/q^b r/h`;
const SOLO_2 = "r/8 3:5/8 3:7/8^h 2:5/8 3:7/h | 3:5/8 3:7/8^h 3:5/8^p 4:7/8 4:7/h^v | r/8 3:5/8 3:7/8^h 2:5/8 2:5/h | 2:8/8 1:5/8 1:5/h^v r/q";
const SOLO_3 = "1:8/8 1:5/8 2:8/8 2:5/8 2:5/h | 2:8/8 2:5/8 3:7/8 3:5/8^p 3:7/h | 3:7/8^b 2:5/8 3:7/8 3:5/8^p 4:7/h^v | r/q 4:5/8 4:7/8^h 4:7/h";

export const leadBasic: LessonInput[] = [
  {
    ...base,
    slug: "alternate-picking",
    title: "Alternate picking",
    order: 1,
    concepts: ["alternate-picking"],
    needs: ["tab-and-chord-diagrams", "counting-out-loud"],
    steps: [
      // OWNER REVIEW: pick direction and hand contact.
      { kind: "understand", blocks: [text(`Lead guitar is one note at a time. Before scales and licks, your picking hand needs one habit: **alternate picking**.

It is the constant-motion rule from strumming, made small. The pick goes **down, up, down, up**, without exception:

- **Down** on the beat.
- **Up** on the "and".

Why not pick every note downwards? Because every downstroke has to come back up anyway. Alternate picking uses that return trip, so it is twice as efficient, and it keeps your hand locked to the beat.

Keep the movement small. The pick only needs to clear the string. Let the side of your hand rest lightly near the bridge so the pick always knows where the strings are.

Start on one string. Then cross strings, and keep the down-up order going even when the next note is on a different string. That is the part that feels strange at first.`)] },
      { kind: "listen", blocks: [
        audio("Eighth notes on one string: frets 5 and 7 of string 3", tabSound(ONE_STRING, 80)),
        audio("Across four strings, two notes on each", tabSound(ACROSS, 80)),
      ] },
      { kind: "learn", blocks: [
        tab(ONE_STRING, "One string. Down on each number, up on each and. Four notes at fret 5, four at fret 7.", 60),
        tab(ACROSS, "Now two notes per string, low to high. Keep down-up going as you cross to the next string.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("In alternate picking, which stroke falls on the beat?", ["Down", "Up", "Either"], 0, "Down on the beat, up on the and."),
        choice("Why alternate and not pick every note down?", ["The upstroke uses the hand's return trip", "Upstrokes are louder", "Downstrokes are not allowed"], 0, "The hand has to come back up anyway."),
        choice("When you cross to another string, what happens to the down-up order?", ["It carries on unchanged", "It starts again with a downstroke", "You pick up twice"], 0, "The order follows the beat, not the string."),
        find("Tap the first note of the tab: string 3, fret 5.", "C4", "String 3 at fret 5 is C.", { strings: [3], ...G }),
        tab(ONE_STRING, "Play along at 70.", 70),
        tab(ACROSS, "Play along at 70. Listen for every note being the same volume.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "minor-pentatonic-position-one",
    title: "The minor pentatonic box",
    order: 2,
    concepts: ["pentatonic-box-1"],
    needs: ["alternate-picking"],
    steps: [
      // OWNER REVIEW: the fingering (index 5, ring 7, little finger 8).
      { kind: "understand", blocks: [text(`Most rock and blues solos are built from one five-note scale, the **minor pentatonic**. In A its notes are **A C D E G**. The theory path explains where it comes from. Here you learn where it lives.

On the guitar it falls into a compact shape that players call **the box**, or position 1. In A it starts at **fret 5**:

- Strings 6, 2 and 1: frets **5 and 8**.
- Strings 5, 4 and 3: frets **5 and 7**.

Two notes on every string, twelve notes in all.

A common fingering is one finger per fret: index finger for fret 5, ring finger for fret 7, little finger for fret 8. Your hand stays in one place.

The note to know first is the **root**, A. It appears three times in the box: string 6 fret 5, string 4 fret 7, and string 1 fret 5. Those are the places a phrase can come to rest.

The shape is movable. Start it at fret 3 and it is G minor pentatonic; at fret 7, B minor pentatonic. The root on string 6 names the key.`)] },
      { kind: "listen", blocks: [
        audio("The box, low to high", tabSound(BOX_UP, 90)),
        audio("High to low", tabSound(BOX_DOWN, 90)),
      ] },
      { kind: "learn", blocks: [
        show(position("A", "minor-pentatonic", 5, 8), "A minor pentatonic. The box is frets 5 to 8; the gold markers are the root, A.", "guitar"),
        tab(BOX_UP, "Up the box with alternate picking.", 60),
        tab(BOX_DOWN, "And back down.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("Which notes make up A minor pentatonic?", ["A C D E G", "A B C D E", "A C♯ E F♯ G"], 0, "Five notes: 1, ♭3, 4, 5, ♭7."),
        choice("In the box at fret 5, which frets are used on string 6?", ["5 and 8", "5 and 7", "5 and 6"], 0, "Strings 6, 2 and 1 use frets 5 and 8."),
        find("Tap the root, A, on string 6.", "A2", "String 6, fret 5.", { strings: [6], ...G }),
        find("Tap the root, A, on string 4.", "A3", "String 4, fret 7.", { strings: [4], ...G }),
        choice("You move the whole box so it starts at fret 3. Which key is it now?", ["G minor pentatonic", "A minor pentatonic", "C minor pentatonic"], 0, "String 6, fret 3 is G, and that note names the key."),
        tab(BOX_UP, "Play it with the click at 80.", 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "hammer-ons-and-pull-offs-in-the-box",
    title: "Hammer-ons and pull-offs in the box",
    order: 3,
    concepts: ["legato"],
    needs: ["minor-pentatonic-position-one"],
    steps: [
      // OWNER REVIEW: how the fingers hammer and pull off.
      { kind: "understand", blocks: [text(`Picking every note gives a clear, even sound. Solos also need notes that run into each other. Two techniques let the fretting hand sound a note without the pick.

**Hammer-on (h).** Pick a note, then bring another finger down hard and fast on a higher fret of the same string. In the box: pick string 3 at fret 5, then hammer your ring finger onto fret 7. Land on the fingertip, close behind the fret.

**Pull-off (p).** The reverse. Have both fingers down, pick the higher note, then flick that finger off the string sideways, towards the floor, so that it plucks the string. The lower finger must already be in place.

The test for both: the second note should be as loud as the first. If it is weak, the hammer was too slow or the pull-off lifted straight up and did not pluck.

Every string in the box has two notes, so every string offers one hammer-on and one pull-off.`)] },
      { kind: "listen", blocks: [
        audio("Hammer-ons: fret 5 to fret 7 on string 3", tabSound(HAMMER, 80)),
        audio("Pull-offs: fret 7 to fret 5", tabSound(PULL, 80)),
        audio("Both in one phrase, ending on the root", tabSound(BOTH, 80)),
      ] },
      { kind: "learn", blocks: [
        tab(HAMMER, "Hammer-ons. Pick only the notes at fret 5; the h notes are sounded by the fretting hand.", 60),
        tab(PULL, "Pull-offs. Pick only the notes at fret 7.", 60),
        tab(BOTH, "Pick once, hammer on, pull off, then pick the root on string 4.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("In 5h7, which note do you pick?", ["Only fret 5", "Only fret 7", "Both"], 0, "The hammer sounds fret 7."),
        choice("Before a pull-off from 7 to 5, where must your fingers be?", ["Both down, on 5 and 7", "Only on 7", "Only on 5"], 0, "The lower finger has to be waiting, or there is no note to pull off to."),
        choice("A pull-off sounds weak. What is the likely cause?", ["The finger lifted straight up without plucking", "The pick was too thin", "The string is too thick"], 0, "The finger has to flick sideways so that it plucks the string."),
        find("Tap the note a hammer-on from fret 5 reaches on string 3.", "D4", "String 3, fret 7 is D.", { strings: [3], ...G }),
        tab(HAMMER, "Play along. Make the hammered note as loud as the picked one.", 70),
        tab(BOTH, "Play along.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "slides-in-the-box",
    title: "Slides",
    order: 4,
    concepts: ["slides"],
    needs: ["hammer-ons-and-pull-offs-in-the-box"],
    steps: [
      // OWNER REVIEW: how to slide.
      { kind: "understand", blocks: [text(`A **slide** joins two notes on one string by gliding between them. Pick the first note and, without letting go of the pressure, move the finger along the string to the second. You hear the pitch travel.

Three things make a slide work:

- **Keep pressing.** If the finger lifts, the note dies on the way.
- **Know the target.** Look at the fret you are going to, not the one you are leaving.
- **Arrive in time.** The slide is decoration; the second note still has to land on its beat.

In this track's tab a slide is marked **sl** above the note you arrive on.

Slides are also how you leave the box. Slide from fret 7 to fret 9 on string 3 and you have reached E, a note of the scale, and your hand is now in the next position up the neck.`)] },
      { kind: "listen", blocks: [
        audio("A slide up and a slide down: frets 5 and 7 on string 3", tabSound(SLIDE, 80)),
        audio("Sliding out of the box to fret 9, then on string 2 to fret 10", tabSound(SLIDE_OUT, 80)),
      ] },
      { kind: "learn", blocks: [
        tab(SLIDE, "Pick fret 5 and slide to 7. Pick fret 7 and slide back to 5.", 60),
        tab(SLIDE_OUT, "Leaving the box: slide from 7 to 9 on string 3, then from 8 to 10 on string 2.", 60),
        show(shape("3:7 3:9 2:8 2:10"), "The four notes of those slides: D to E, and G to A. All belong to A minor pentatonic.", "guitar"),
      ] },
      { kind: "practice", blocks: [
        choice("During a slide, what must the finger do?", ["Keep pressing the string", "Lift slightly", "Bend the string"], 0, "Pressure keeps the note alive while it travels."),
        choice("When must the second note of a slide arrive?", ["On its beat", "Whenever the finger gets there", "Before the first note"], 0, "A slide decorates the rhythm; it does not replace it."),
        find("Tap the note you reach by sliding from fret 7 to fret 9 on string 3.", "E4", "String 3, fret 9 is E, a note of A minor pentatonic.", { strings: [3], ...G }),
        choice("Besides their sound, what are slides useful for?", ["Moving the hand to a new position", "Tuning the guitar", "Playing two strings at once"], 0, "A slide carries the hand up or down the neck."),
        tab(SLIDE, "Play along at 70.", 70),
        tab(SLIDE_OUT, "Play along at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "first-bends",
    title: "Your first bends",
    order: 5,
    concepts: ["bends"],
    needs: ["slides-in-the-box"],
    steps: [
      // OWNER REVIEW: which fingers bend, the direction of the push, and the thumb.
      { kind: "understand", blocks: [text(`A **bend** raises a note by pushing the string sideways across the fretboard. It is the most voice-like sound the guitar has, and the easiest one to play out of tune.

A bend has a **target**. It is not "push until it sounds good".

- A **whole-step bend** must reach the pitch **two frets higher**.
- A **half-step bend** must reach the pitch **one fret higher**.

So practise every bend against its target. Play the target fret, listen, then go back and bend up until the two pitches match.

The first bend to learn is in the box: **string 3, fret 7**, bent a whole step. That is D bent up to E. Check it against fret 9.

How to do it:

- Bend with the **ring finger**, and put the middle and index fingers down on the same string behind it. Three fingers push; one alone is weak and unsteady.
- On strings 1, 2 and 3, push the string **up**, towards the ceiling.
- Hook the thumb over the top of the neck. The push comes from turning the wrist, not from the fingers alone.

Go slowly. A bend that arrives in tune is worth more than a fast one that does not.`)] },
      { kind: "listen", blocks: [
        audio("The target, fret 9, then the bend from fret 7 reaching the same pitch", tabSound(BEND_CHECK, 60)),
        audio("A half-step bend: target fret 8, then fret 7 bent to match", tabSound(BEND_HALF, 60)),
        audio("The bend in a phrase", tabSound(BEND_PHRASE, 70)),
      ] },
      { kind: "learn", blocks: [
        tab(BEND_CHECK, "Play fret 9 and listen. Then play fret 7 and bend until it sounds the same. \"full\" means a whole step.", 50),
        tab(BEND_HALF, "The half-step bend, checked against fret 8.", 50),
        tab(BEND_PHRASE, "Bend, then answer on string 2 at fret 5. Both notes are E.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("How far must a whole-step bend raise the note?", ["To the pitch two frets higher", "To the pitch one fret higher", "As far as the string goes"], 0, "A whole step is two frets."),
        find("You bend string 3, fret 7 up a whole step. Tap the fret whose pitch it must match.", "E4", "Fret 9 of string 3: E.", { strings: [3], ...G }),
        choice("How do you check that a bend is in tune?", ["Play the target fret first and match it", "Bend as fast as possible", "Watch how far the string moves"], 0, "Your ear compares the bend with the real note."),
        choice("Why put extra fingers behind the bending finger?", ["They add strength and control", "They mute the string", "They change the note"], 0, "Three fingers push more steadily than one."),
        ear("Whole-step bend or half-step bend?", seq("D4 Eb4", 60), ["Whole step", "Half step"], 1, "The pitch rises by only one fret's worth."),
        tab(BEND_CHECK, "Play along slowly: target, then bend.", 50),
      ] },
    ],
  },
  {
    ...base,
    slug: "vibrato",
    title: "Vibrato",
    order: 6,
    minutes: 5,
    concepts: ["vibrato"],
    needs: ["first-bends"],
    steps: [
      // OWNER REVIEW: how vibrato is made.
      { kind: "understand", blocks: [text(`Hold a note on a guitar and it sits still, then fades. A singer would not leave it like that. **Vibrato** is how a guitarist keeps a long note alive.

It is a small bend, released, and repeated: the pitch rises a little, comes back, rises, comes back. Each return must come all the way back to the true note, or the vibrato sounds sharp.

Two things you control:

- **Width:** how far the pitch moves. Narrow is gentle; wide is intense.
- **Speed:** how fast it repeats. Even matters more than fast.

It uses the same motion as a bend, a turn of the wrist with the thumb over the neck, only much smaller.

Use it on notes that last: the end of a phrase, or the top of a bend. Short notes do not need it. Vibrato is as personal as handwriting, and it is one of the main ways listeners recognise a player.

In this track's tab, vibrato is marked with a wavy line above the note.`)] },
      { kind: "listen", blocks: [
        audio("A long note twice: plain, then the one you add vibrato to", tabSound(VIBRATO, 70)),
        audio("A phrase that ends on the root, held", tabSound(LICK_3, 80)),
      ] },
      { kind: "learn", blocks: [
        tab(VIBRATO, "String 3, fret 7. Play it plain, then again with vibrato. The app plays both notes straight; the wavy line is your job.", 60),
        tab(LICK_3, "A run down the box. The last note, the root, gets vibrato.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What is vibrato?", ["A small bend and release, repeated", "A fast slide", "Picking a note many times"], 0, "The pitch rises slightly and returns, again and again."),
        choice("Where must the pitch return to each time?", ["The true note", "Slightly above the note", "The next fret"], 0, "Otherwise the note sounds sharp."),
        choice("Which notes suit vibrato best?", ["Long notes at the end of a phrase", "Every short note", "Open strings only"], 0, "A held note has time for it and needs it most."),
        choice("Which matters more?", ["Evenness", "Speed"], 0, "An even vibrato sounds controlled at any speed."),
        tab(VIBRATO, "Play along at 60.", 60),
        tab(LICK_3, "Play along at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "first-licks",
    title: "First licks, and landing on the root",
    order: 7,
    concepts: ["licks"],
    needs: ["vibrato"],
    steps: [
      { kind: "understand", blocks: [text(`A **lick** is a short phrase you know by heart, a word in your vocabulary. Players collect them, change them and join them into solos.

A lick is easier to remember, and to move to other keys, when you know which scale notes it uses. In A minor pentatonic:

- A is the **root** (1)
- C is the **♭3**
- D is the **4**
- E is the **5**
- G is the **♭7**

Here are three licks from the box. All three do the same thing at the end: they **land on the root**.

**Lick 1** walks down: ♭7, 5, 4, ♭3, root.

**Lick 2** starts with a bend: the 4 bent up to the 5, then 5, 4, ♭3, root.

**Lick 3** starts at the top of the box and runs down to the root.

Landing on the root is the simplest way to make a phrase sound finished. It is the full stop at the end of a sentence. Other notes leave the phrase open, which is useful too, as the next lesson shows. For now, learn where the roots are and aim for them.`)] },
      { kind: "listen", blocks: [
        audio("Lick 1", tabSound(LICK_1, 80)),
        audio("Lick 2", tabSound(LICK_2, 80)),
        audio("Lick 3", tabSound(LICK_3, 80)),
      ] },
      { kind: "learn", blocks: [
        tab(LICK_1, "Lick 1: G, E, D, C, A. It ends on the root at string 4, fret 7.", 60),
        tab(LICK_2, "Lick 2: bend D up to E, then E, D, pull off to C, and the root.", 60),
        tab(LICK_3, "Lick 3: from the top of the box down to the root.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("What is a lick?", ["A short phrase you know by heart", "A full solo", "A chord shape"], 0, "A small piece of vocabulary to reuse and vary."),
        choice("In A minor pentatonic, which degree is the note G?", ["♭7", "5", "♭3"], 0, "A is 1, C is ♭3, D is 4, E is 5, G is ♭7."),
        find("All three licks end on the same note on string 4. Tap it.", "A3", "String 4, fret 7: the root, A.", { strings: [4], ...G }),
        choice("Why does landing on the root sound finished?", ["It is the home note of the key", "It is the highest note", "It is the loudest note"], 0, "The ear hears the root as rest."),
        ear("Which lick is this?", tabSound(LICK_2, 80), ["Lick 1: walks straight down", "Lick 2: starts with a bend"], 1, "It opens on a long note that is the 4 bent up to the 5."),
        tab(LICK_1, "Play along with lick 1 at 70.", 70),
      ] },
    ],
  },
  {
    ...base,
    slug: "call-and-response",
    title: "Call and response, and leaving space",
    order: 8,
    concepts: ["call-and-response"],
    needs: ["first-licks"],
    steps: [
      { kind: "understand", blocks: [text(`A beginner's solo is often a stream of notes with no gaps. It is tiring to listen to, for the same reason as a person who never pauses when they speak.

Good solos are made of **phrases** with **space** between them.

The oldest way to shape phrases is **call and response**. One phrase asks a question, the next one answers it.

- The **call** ends on a note that is not the root, so it sounds open. Here it ends on E, the 5.
- The **response** ends on the root, A, so it sounds closed.

Then leave a gap. Silence is part of the phrase: it lets the listener take in what you played, and it gives you time to hear your next idea before you play it.

A useful exercise is to play for one bar and rest for one bar. In the rest, sing or imagine the answer. Then play it.

In a blues, the call is usually played twice and answered once. You will use exactly that in the study piece.`)] },
      { kind: "listen", blocks: [
        audio("The call: it stops on E and hangs", tabSound(CALL, 80)),
        audio("The response: it comes home to A", tabSound(RESPONSE, 80)),
        audio("Call, then response", tabSound(`${CALL} | ${RESPONSE}`, 80)),
      ] },
      { kind: "learn", blocks: [
        tab(CALL, "The call. It starts after a rest and ends on E, the 5.", 60),
        tab(RESPONSE, "The response. It ends on the root with vibrato.", 60),
        tab(`${CALL} | ${RESPONSE}`, "Together: question, then answer.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("In call and response, how does the call usually end?", ["On a note other than the root", "On the root", "On the lowest string"], 0, "An open ending asks for an answer."),
        choice("How does the response end?", ["On the root", "On the 5", "With a rest only"], 0, "The root closes the phrase."),
        ear("Is this a call or a response?", tabSound(RESPONSE, 80), ["Call: it ends open", "Response: it ends on the root"], 1, "It settles on A."),
        ear("And this?", tabSound(CALL, 80), ["Call: it ends open", "Response: it ends on the root"], 0, "It stops on E and waits."),
        choice("Why leave space between phrases?", ["So the listener and the player can both hear the idea", "Because long solos are wrong", "To save energy"], 0, "A gap gives a phrase its shape."),
        tab(`${CALL} | ${RESPONSE}`, "Play along at 70.", 70),
        backing("Now trade with yourself over an A7 chord: play for one bar, rest for one bar. Any notes from the box.", [["A7", A7], ["A7", A7], ["A7", A7], ["A7", A7]], 70, BOX),
      ] },
    ],
  },
  {
    ...base,
    slug: "blues-solo-study-piece",
    title: "Study piece: a twelve-bar blues solo in A",
    order: 9,
    minutes: 10,
    concepts: ["blues-solo-study"],
    needs: ["call-and-response"],
    steps: [
      { kind: "understand", blocks: [text(`This solo uses everything in the stage: alternate picking, the box, hammer-ons, pull-offs, a bend, vibrato, call and response, and space.

It runs over a **twelve-bar blues in A**. The chords, one per bar:

- **Bars 1–4:** A, A, A, A
- **Bars 5–8:** D, D, A, A
- **Bars 9–12:** E, D, A, A

Every note comes from the A minor pentatonic box. One scale works over all three chords, which is why the blues is where most people learn to solo.

How the solo is built:

- **Bars 1–4.** Call, response, the call again, then a bend up to E that leaves the line open.
- **Bars 5–8.** The chord changes to D, so the phrases now end on **D** and then on **A**. The call returns in bar 7, and bar 8 climbs to the high root.
- **Bars 9–12.** Over E the line ends on **E**; over D it ends on **D**; then it comes home to **A**.

Notice the endings. Each phrase lands on the root of the chord of that moment. You do not have to do this, but it is the surest way to sound as if you are following the chords.

Learn four bars at a time. Join them only when each line is steady.`)] },
      { kind: "listen", blocks: [
        audio("Bars 1 to 4", tabSound(SOLO_1, 84)),
        audio("Bars 5 to 8", tabSound(SOLO_2, 84)),
        audio("Bars 9 to 12", tabSound(SOLO_3, 84)),
      ] },
      { kind: "learn", blocks: [
        tab(SOLO_1, "Bars 1 to 4, over A.", 60),
        tab(SOLO_2, "Bars 5 to 8, over D, D, A, A.", 60),
        tab(SOLO_3, "Bars 9 to 12, over E, D, A, A.", 60),
      ] },
      { kind: "practice", blocks: [
        choice("How many bars does the solo last?", ["Twelve", "Eight", "Sixteen"], 0, "One time round the twelve-bar blues."),
        choice("Which scale are all its notes from?", ["A minor pentatonic", "A major", "E minor pentatonic"], 0, "One box, over all three chords."),
        choice("In bar 9 the chord is E. On which note does the phrase end?", ["E", "A", "G"], 0, "The root of the chord of the moment."),
        tab(SOLO_1, "Play along: bars 1 to 4 at 70.", 70),
        tab(SOLO_2, "Bars 5 to 8 at 70.", 70),
        tab(SOLO_3, "Bars 9 to 12 at 70.", 70),
        backing("The backing track: twelve bars of blues in A. Play the solo over it, then make up your own from the box.", BLUES, 70, BOX),
      ] },
    ],
  },
];
