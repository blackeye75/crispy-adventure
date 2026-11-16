// Track M1, Basic stage (docs/PLAYING.md): playing music, for both instruments.
// OWNER REVIEW: the practice advice here (how long, in what order, how to use a click) is common teaching
// written from memory. It is general guidance, not instrument technique, but it is still unreviewed.
import type { LessonInput } from "@/core/schemas/content";
import { audio, backing, choice, ear, rhythm, seq, text } from "../helpers";

const base = { moduleSlug: "musicianship-basic", track: "musicianship", isFree: false, version: 1, minutes: 6 } as const;
const G = "G2 D3 G3 B3";
const C = "C3 G3 C4 E4";
const D = "D3 A3 D4 F#4";
const EM = "E2 B2 E3 G3";
const hit = (notes: string) => notes.split(" ").join("+");
const bars = (chords: string[], perBar: string) => chords.map((ch) => perBar.replaceAll("X", hit(ch))).join(" | ");
const CHART: [string, string][] = [["G", G], ["G", G], ["C", C], ["G", G], ["Em", EM], ["C", C], ["D", D], ["G", G]];
const ON_BEAT = rhythm(bars([G, G], "X/q X/q X/q X/q"), 80);
const OFF_BEAT = rhythm(bars([G, G], "r/8 X/8 r/8 X/8 r/8 X/8 r/8 X/8"), 80);
const COUNT_IN = rhythm(`r/w | ${bars([G, C, D], "X/h X/h")} | ${hit(G)}/w`, 80);
/** A play-along whose first bar is only clicks, and whose last chord is struck once and held. */
const withCountIn = (prompt: string, bpm: number): LessonInput["steps"][number]["blocks"][number] => ({ type: "play-along", prompt, bpm, sound: rhythm(`r/w | ${bars([G, C, D], "X/h X/h")} | ${hit(G)}/w`, bpm), bars: ["(count)", "G", "C", "D", "G"] });

export const musicianshipBasic: LessonInput[] = [
  {
    ...base,
    slug: "reading-a-chord-chart",
    title: "Reading a chord chart",
    order: 1,
    concepts: ["chord-charts"],
    needs: ["bars-and-four-four"],
    steps: [
      { kind: "understand", blocks: [text(`Most songs are passed around as a **chord chart**: the chords, laid out in bars, with nothing else. If you can read one, you can play along with almost anything.

A chart is read left to right, like text. **Vertical lines separate the bars.**

\`\`\`
| G    | G    | C    | G    |
| Em   | C    | D    | G    |
\`\`\`

What it means:

- **One chord in a bar** lasts the whole bar. In 4/4, that is four beats.
- **Two chords in a bar** share it, usually two beats each: \`| G  D |\`.
- **A slash** stands for a beat when the split is uneven: \`| G / / D |\` is three beats of G and one of D.
- **A repeat sign** \`%\` means "the same as the last bar".
- **Dots at a double bar line**, \`|:\` and \`:|\`, mean "play everything between them again".

The skill is **counting bars** while you play. Count "**1**, 2, 3, 4, **2**, 2, 3, 4, **3**, 2, 3, 4", replacing the first beat of each bar with the bar number. It feels clumsy for a week and then becomes automatic.

Charts are usually written **four bars to a line**, because music is mostly built in fours. That makes it easy to find your place again if you get lost: jump to the start of the next line.`)] },
      { kind: "listen", blocks: [
        audio("The chart above, two strums a bar: G, G, C, G, Em, C, D, G", rhythm(bars(CHART.map(([, notes]) => notes), "X/h X/h"), 90)),
      ] },
      { kind: "learn", blocks: [
        backing("Follow the chart as it plays. The chord of each bar lights up.", CHART, 80),
      ] },
      { kind: "practice", blocks: [
        choice("In a chord chart, what do the vertical lines separate?", ["Bars", "Beats", "Songs"], 0, "Each space between two lines is one bar."),
        choice("A bar in 4/4 has one chord written in it. How long does the chord last?", ["Four beats", "One beat", "Two bars"], 0, "The whole bar."),
        choice("What does | G / / D | mean?", ["Three beats of G, then one of D", "G and D together", "Two bars"], 0, "Each slash is a beat of the chord before it."),
        choice("What does % mean?", ["Repeat the last bar", "Stop", "Play louder"], 0, "The same bar again."),
        choice("You lose your place in a chart. What is the quickest way back in?", ["Jump to the start of the next line", "Start the song again", "Stop playing"], 0, "Charts are written four bars to a line."),
        backing("Play along. Count the bars: 1 2 3 4, 2 2 3 4, 3 2 3 4…", CHART, 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "playing-with-a-metronome",
    title: "Playing with a metronome, then a backing track",
    order: 2,
    concepts: ["playing-in-time"],
    needs: ["reading-a-chord-chart", "pulse-and-tempo"],
    steps: [
      { kind: "understand", blocks: [text(`Playing alone, your time bends without you noticing. You slow down for the hard parts and speed up through the easy ones. A **metronome** does not bend. It is the most honest teacher you will have.

How to use it:

1. **Set it slower than you think you need.** Slow enough to play the whole thing without a mistake.
2. **Listen to it for a bar before you start.** Feel the pulse, then join it.
3. **Aim to make the click disappear.** When your note lands exactly on the click, the click seems to vanish underneath it. That is the target.
4. **When it is steady, raise the tempo a little.** Five beats per minute at a time.
5. **If you fall off, do not chase it.** Stop, listen, and come back in on a beat 1.

If you always rush ahead of the click, the cure is to listen more and play less. If you always drag behind it, the passage is too hard at this speed.

A **backing track** is the next step. It keeps time like a metronome and adds the chords, so it feels like playing with a band. The band will not wait for you, which is exactly why it is good practice.

The practice room has a metronome, a tempo trainer that raises the speed for you, and looping.`)] },
      { kind: "listen", blocks: [
        audio("Chords that land on the click", ON_BEAT),
        audio("Chords that land between the clicks", OFF_BEAT),
      ] },
      { kind: "learn", blocks: [
        backing("A slow click with two chords. Play each chord exactly with the click.", [["G", G], ["C", C], ["G", G], ["D", D]], 60),
      ] },
      { kind: "practice", blocks: [
        choice("What tempo should you start at?", ["Slow enough to play without a mistake", "The speed of the recording", "As fast as you can"], 0, "Correct and slow comes first."),
        choice("What happens when your note lands exactly on the click?", ["The click seems to disappear", "The click gets louder", "Nothing"], 0, "Your sound covers it."),
        choice("You fall out of time. What should you do?", ["Stop, listen, and rejoin on a beat 1", "Speed up to catch it", "Turn the metronome off"], 0, "Chasing the click only makes it worse."),
        ear("Are the chords on the click or between the clicks?", OFF_BEAT, ["On the click", "Between the clicks"], 1, "Each chord falls halfway between two clicks."),
        ear("And here?", ON_BEAT, ["On the click", "Between the clicks"], 0, "Chord and click arrive together."),
        backing("Now with the band keeping time. Stay with it for all four bars.", [["G", G], ["C", C], ["G", G], ["D", D]], 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "starting-and-ending-together",
    title: "Starting and ending together",
    order: 3,
    concepts: ["count-ins-and-endings"],
    needs: ["playing-with-a-metronome"],
    steps: [
      { kind: "understand", blocks: [text(`The two moments that make a performance sound together, or not, are the first note and the last one.

**Starting: the count-in.** Before the music begins, someone counts one bar out loud at the tempo of the song: "**one, two, three, four**". Everyone comes in on the next beat 1.

The count-in does two jobs. It sets the tempo, and it says exactly where beat 1 is.

- Count at the speed you will actually play. A rushed count-in gives a rushed song.
- Think of the first bar of the music while you count, so you know the tempo is right for it.
- With a backing track or a recording, the count is usually a bar of clicks. Count along with it silently.

**Ending.** A song has to stop on purpose. The usual ending is simple: on the **first beat of the last bar**, play the home chord **once** and let it ring.

- **Know the last bar is coming.** Count bars, or follow the chart.
- **Do not add an extra strum.** One chord, on beat 1, held.
- **Hold still until the sound has gone.** Moving early cuts the ending short.

When you play with other people, look up at each other for the last bar. A nod on the final beat 1 does more than any amount of counting.`)] },
      { kind: "listen", blocks: [
        audio("A bar of clicks as the count-in, three bars of music, and a held last chord", COUNT_IN),
      ] },
      { kind: "learn", blocks: [
        withCountIn("Bar 1 is the count-in: do not play. Come in on bar 2, and play the last G once and let it ring.", 70),
      ] },
      { kind: "practice", blocks: [
        choice("What does a count-in tell the players?", ["The tempo and where beat 1 is", "The key of the song", "How long the song is"], 0, "One bar, counted at the speed of the song."),
        choice("After a count of one, two, three, four, when do you come in?", ["On the next beat 1", "On four", "Whenever you are ready"], 0, "The count is one whole bar before the music."),
        choice("What is the usual way to end a song?", ["The home chord once, on beat 1 of the last bar, left to ring", "Stopping in the middle of a bar", "Strumming faster and faster"], 0, "One chord, held."),
        ear("How many bars of music follow the count-in before the final held chord?", COUNT_IN, ["Three", "One", "Five"], 0, "G, C and D, then the last G rings."),
        choice("Playing with others, what helps most on the last bar?", ["Looking at each other", "Closing your eyes", "Playing louder"], 0, "A nod on the final beat 1 keeps everyone together."),
        withCountIn("Once more. Count the first bar silently, then play.", 80),
      ] },
    ],
  },
  {
    ...base,
    slug: "a-daily-practice-routine",
    title: "A daily practice routine",
    order: 4,
    concepts: ["practice-routine"],
    needs: ["starting-and-ending-together"],
    steps: [
      { kind: "understand", blocks: [text(`How you practise matters more than how long. **Twenty focused minutes every day beat two hours once a week**, because skill is built while you sleep on what you repeated.

A routine that works, in four parts. Here it is for twenty minutes:

1. **Warm up: 3 minutes.** Something easy and slow that you already know: a scale, a chord change, a pattern. The aim is to wake up your hands and ears, not to improve anything.
2. **New material: 8 minutes.** The one thing you are learning this week. This is the hard part, so it gets your freshest attention. Work on a small piece of it, slowly, with a click.
3. **Review: 5 minutes.** Something from last week or last month. Skills fade unless you return to them. The daily review in this app is built for exactly this.
4. **Play for fun: 4 minutes.** A song you love, an improvisation, anything. No goal. This is why you picked up the instrument, and it should happen every day.

A few rules that make practice count:

- **Slow is fast.** Speed comes from accuracy repeated, never from pushing.
- **Practise the hard bar, not the whole song.** Find the two bars that trip you and loop them.
- **Stop while it is still going well.** End on a good repetition, not a tired one.
- **Same time, same place.** A habit needs less willpower than a decision.

Set a daily goal in the app that you can keep on your worst day. A five-minute goal you always meet builds more than a thirty-minute goal you skip.`)] },
      { kind: "listen", blocks: [
        audio("A warm-up: the C major scale, slowly", seq("C4 D4 E4 F4 G4 A4 B4 C5", 70)),
      ] },
      { kind: "learn", blocks: [
        text(`A twenty-minute session:

\`\`\`
 3 min   Warm up        something easy and slow
 8 min   New material   this week's one thing
 5 min   Review         something from before
 4 min   Play for fun   anything you love
\`\`\`

For ten minutes, halve each part. For forty, double them.`),
      ] },
      { kind: "practice", blocks: [
        choice("Which builds more skill?", ["Twenty minutes every day", "Two hours once a week", "They are the same"], 0, "Little and often wins."),
        choice("Which part of the session gets the most time?", ["New material", "Warm-up", "Play for fun"], 0, "It is the hard part, so it gets your freshest attention."),
        choice("Why review old material?", ["Skills fade unless you return to them", "To fill time", "Because new material is too hard"], 0, "Coming back to it is what makes it last."),
        choice("A song has two bars you keep getting wrong. What should you practise?", ["Those two bars, slowly, on a loop", "The whole song from the top each time", "A different song"], 0, "Fix the hard part directly."),
        choice("When is the best time to stop a practice session?", ["While it is still going well", "When your hands hurt", "After the first mistake"], 0, "End on a good repetition."),
        choice("Which daily goal should you set?", ["One you can keep on your worst day", "The longest you have ever managed", "No goal at all"], 0, "A small goal you always meet beats a big one you skip."),
      ] },
    ],
  },
];
