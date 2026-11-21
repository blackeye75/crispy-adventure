import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, sans, serif } from "../../theme";
import { Backdrop, Bed, BigText, Caption, Close, fade, gold, Headline, Hit, Lessons, lift, Piano, pulse, timeline, Voices } from "../kit";
import script from "./script.json";
import timing from "./timing.json";

// Moderate lesson: "Harmonising the major scale" and "The four-chord progressions" (Level 3).
const STEP = 26; // frames per chord when a progression plays on its own
const tl = timeline(script, timing, { play: 4 * STEP + 24, keys: 4 * STEP + 20, close: 50 });
export const FOUR_CHORDS_FRAMES = tl.total;

const SCALE = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71]; // C major from C3, two octaves
const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const NAMES = ["C major", "D minor", "E minor", "F major", "G major", "A minor", "B diminished"];
const NUMERALS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const triad = (k: number) => [SCALE[k], SCALE[k + 2], SCALE[k + 4]];
// a bass note and the chord above it, for the progressions
const IN_C: [string, number[]][] = [["C", [48, 60, 64, 67]], ["G", [43, 55, 59, 62]], ["Am", [45, 57, 60, 64]], ["F", [41, 53, 57, 60]]];
const IN_G: [string, number[]][] = [["G", [43, 55, 59, 62]], ["D", [50, 62, 66, 69]], ["Em", [40, 52, 55, 59]], ["C", [48, 60, 64, 67]]];
const FEEL = ["Home", "Lift", "Sadness", "Toward home"];
const PIANO_IDS = ["scale", "scale-notes", "stack", "seven"];

const HEADLINES: Record<string, React.ReactNode> = {
  scale: <>The {gold("C major")} scale</>, "scale-notes": <>Seven {gold("notes")}</>, stack: <>Take one, {gold("skip one")}</>,
  seven: <>Seven {gold("chords")}</>, numbers: <>Number {gold("them")}</>, strong: <>The strong {gold("three")}</>,
  four: <>The {gold("four")} chords</>, play: <>In {gold("C")}</>, feel: <>Why it {gold("works")}</>, keys: <>In {gold("G")}</>,
};

const count = (id: string, f: number) => timing[tl.index(id)].onsets.filter((_, n) => f >= tl.cue(id, n)).length;

function piano(id: string, f: number) {
  const cue = (k: number) => tl.cue(id, k);
  const letters = Object.fromEntries(SCALE.slice(0, 7).map((m, k) => [m, LETTERS[k]]));
  switch (id) {
    case "scale-notes": return { lit: Object.fromEntries(SCALE.slice(0, 7).map((m, k) => [m, pulse(f, cue(k))])), labels: Object.fromEntries(SCALE.slice(0, 7).filter((_, k) => f >= cue(k)).map((m, k) => [m, LETTERS[k]])) };
    case "stack": {
      const taken = [[1, 48], [3, 52], [5, 55]].filter(([c]) => f >= cue(c)).map(([, m]) => m);
      const skipped = [[2, 50], [4, 53]].filter(([c]) => f >= cue(c)).map(([, m]) => m);
      return { lit: Object.fromEntries(taken.map((m) => [m, 0.7])), labels: letters, marks: { ...Object.fromEntries(taken.map((m) => [m, "take"])), ...Object.fromEntries(skipped.map((m) => [m, "✕"])) } };
    }
    case "seven": {
      const k = Math.max(0, count("seven", f) - 1);
      return { lit: Object.fromEntries(triad(k).map((m) => [m, Math.max(0.55, pulse(f, cue(k)))])), labels: letters };
    }
    default: return { labels: letters };
  }
}

/** A chord card: its numeral and name. */
const Card = ({ numeral, name, lit, word }: { numeral?: string; name: string; lit: number; word?: string }) => (
  <div style={{ width: 210, height: 250, borderRadius: 30, backgroundColor: lit ? C.gold : C.card, border: `3px solid ${lit ? C.gold : C.line}`, color: lit ? C.bg : C.text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", scale: lit ? "1.04" : "1" }}>
    {numeral && <div style={{ fontFamily: serif, fontSize: 92, fontWeight: 600, lineHeight: 1 }}>{numeral}</div>}
    <div style={{ fontFamily: sans, fontSize: numeral ? 34 : 80, fontWeight: 600, marginTop: numeral ? 10 : 0 }}>{name}</div>
    {word && <div style={{ fontFamily: sans, fontSize: 30, marginTop: 10, opacity: 0.8 }}>{word}</div>}
  </div>
);

/** Reel 6 (moderate): why so many songs use the same four chords. 9:16. */
export const FourChordsReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const pianoOn = interpolate(frame, [tl.start("scale"), tl.start("scale") + 18, tl.start("numbers") - 8, tl.start("numbers")], [0, 1, 1, 0], LINEAR);
  const cue = (k: number) => tl.cue(id, k);
  const playing = (start: number) => (f < start ? -1 : Math.min(3, Math.floor((f - start) / STEP)));

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, color: C.text, fontFamily: sans }}>
      <Backdrop frame={frame} />

      {id === "hook" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len, 1) }}>
          <div style={{ fontFamily: serif, fontSize: 560, fontWeight: 600, lineHeight: 1, color: C.gold, textShadow: "0 0 120px rgba(236,178,63,0.45)", scale: `${interpolate(f, [0, 36], [1.3, 1], LINEAR)}` }}>4</div>
          <div style={{ ...lift(f, 14), fontFamily: serif, fontSize: 110 }}>chords</div>
          <div style={{ ...lift(f, tl.cue("hook", 1)), fontSize: 50, color: C.muted, marginTop: 30 }}>behind thousands of songs</div>
        </AbsoluteFill>
      )}

      {PIANO_IDS.includes(id) && <Piano from={48} to={72} top={760} enter={pianoOn} {...piano(id, f)} />}
      {id === "seven" && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontFamily: serif, fontSize: 110, fontWeight: 600, color: C.gold }}>{NAMES[Math.max(0, count("seven", f) - 1)]}</div>
      )}

      {["numbers", "strong", "four"].includes(id) && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 520, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24, opacity: fade(f, len) }}>
          {NUMERALS.map((numeral, k) => {
            const big = k === 0 || k === 3 || k === 4;
            const lit =
              id === "numbers" ? (f >= cue(2) ? !big && k !== 6 : f >= cue(1) && big) :
              id === "strong" ? big && f >= cue(1) :
              (big || (k === 5 && f >= cue(0)));
            return <div key={numeral} style={lift(f, k * 3, 30)}><Card numeral={numeral} name={NAMES[k].replace(" major", "").replace(" minor", "m").replace(" diminished", "°")} lit={lit ? 1 : 0} /></div>;
          })}
          {id === "strong" && f >= cue(2) && <div style={{ ...lift(f, cue(2), 30), width: "100%", textAlign: "center", fontSize: 44, marginTop: 30 }}>C E G + F A C + G B D = {gold("all 7 notes")}</div>}
          {id === "four" && f >= cue(2) && <div style={{ ...lift(f, cue(2), 30), width: "100%", textAlign: "center", fontFamily: serif, fontSize: 120, marginTop: 20, color: C.gold }}>I – V – vi – IV</div>}
        </div>
      )}

      {["play", "feel", "keys"].includes(id) && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 600, display: "flex", justifyContent: "center", gap: 24, opacity: fade(f, len) }}>
          {(id === "keys" && f >= cue(1) ? IN_G : IN_C).map(([name], k) => {
            const now =
              id === "play" ? playing(tl.voice("play") + 6) :
              id === "keys" ? playing(tl.voice("keys") + 6) :
              Math.min(count("feel", f), 5) - 1;
            const lit = id === "feel" ? (now === 4 ? k === 0 : now === k) : now === k;
            return <div key={name + k} style={lift(f, k * 4, 40)}><Card name={name} lit={lit ? 1 : 0} word={id === "feel" && f >= cue(k) ? FEEL[k] : undefined} /></div>;
          })}
        </div>
      )}

      {id === "fomo" && <BigText f={f} len={len} small="Learn the numbers once.">Play {gold("thousands")} of songs.</BigText>}
      {id === "lesson" && <Lessons f={f} len={len} voice={tl.voice("lesson")} note="from your first note to jazz" />}
      {id === "close" && <Close f={f} voice={tl.voice("close")} />}

      {HEADLINES[id] && <Headline f={f} len={len}>{HEADLINES[id]}</Headline>}
      <Caption text={script[tl.index(id)].show} f={f} len={len} />

      <Bed total={tl.total} quiet={[[tl.start("scale-notes"), tl.start("fomo")]]} />
      <Voices tl={tl} dir="vertical/four-chords" />
      {SCALE.slice(0, 7).map((m, k) => <Hit key={`n${k}`} at={tl.start("scale-notes") + tl.cue("scale-notes", k)} midis={[m]} volume={0.38} />)}
      <Hit at={tl.start("stack") + tl.cue("stack", 5) + 14} midis={triad(0)} volume={0.38} />
      {NAMES.map((_, k) => <Hit key={`c${k}`} at={tl.start("seven") + tl.cue("seven", k)} midis={triad(k)} volume={0.38} />)}
      {IN_C.map(([, midis], k) => <Hit key={`p${k}`} at={tl.start("play") + tl.voice("play") + 6 + k * STEP} midis={midis} volume={0.38} />)}
      {[0, 1, 2, 3, 4].map((k) => <Hit key={`f${k}`} at={tl.start("feel") + tl.cue("feel", k)} midis={IN_C[k % 4][1]} volume={0.4} />)}
      {IN_G.map(([, midis], k) => <Hit key={`g${k}`} at={tl.start("keys") + tl.voice("keys") + 6 + k * STEP} midis={midis} volume={0.38} />)}
    </AbsoluteFill>
  );
};
