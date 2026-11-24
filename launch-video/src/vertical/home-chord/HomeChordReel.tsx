import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, sans, serif } from "../../theme";
import { Backdrop, Bed, BigText, Caption, ChordBox, Close, fade, gold, Headline, Hit, Lessons, lift, Piano, pulse, timeline, Voices } from "../kit";
import script from "./script.json";
import timing from "./timing.json";

// Why the last chord feels like home: G7 to C, the two notes that pull (Level 4, the dominant seventh).
const tl = timeline(script, timing, { tension: 30, home: 40, again: 40, guitar: 40, close: 50 });
export const HOME_CHORD_FRAMES = tl.total;

const G7 = [55, 59, 62, 65]; // G3 B3 D4 F4
const HOME = [55, 60, 64]; // G3 C4 E4: G stays, B rises to C, F falls to E
const G7_SOUND = [43, ...G7];
const C_SOUND = [48, ...HOME];
const G7_GUITAR = [43, 47, 50, 55, 59, 65]; // 320001
const C_GUITAR = [48, 52, 55, 60, 64]; // x32010
const NAMES: Record<number, string> = { 55: "G", 59: "B", 60: "C", 62: "D", 64: "E", 65: "F" };
const named = (midis: number[]) => Object.fromEntries(midis.map((m) => [m, NAMES[m]]));
const steady = (midis: number[], amount = 0.55) => Object.fromEntries(midis.map((m) => [m, amount]));
const PIANO_IDS = ["tension", "wait", "home", "look", "magnets", "pull", "again", "tritone"];

const HEADLINES: Record<string, React.ReactNode> = {
  tension: <>{gold("G7")}</>, wait: <>Un{gold("finished")}</>, home: <>{gold("Home")}</>, look: <>Look {gold("inside")}</>,
  magnets: <>One key {gold("away")}</>, pull: <>The {gold("pull")}</>, again: <>Question, {gold("answer")}</>, tritone: <>The {gold("tritone")}</>, guitar: <>On {gold("guitar")}</>,
};

type Keys = { lit?: Record<number, number>; labels?: Record<number, string>; marks?: Record<number, string>; badges?: Record<number, string> };
function piano(id: string, f: number): Keys {
  const cue = (k: number) => tl.cue(id, k);
  switch (id) {
    case "tension": return f < cue(1) ? {} : { lit: Object.fromEntries(G7.map((m) => [m, Math.max(0.55, pulse(f, cue(1)))])), labels: named(G7) };
    case "wait": return { lit: steady(G7), labels: named(G7) };
    case "home": return { lit: Object.fromEntries(HOME.map((m) => [m, Math.max(0.55, pulse(f, 2))])), labels: named(HOME) };
    case "look": return { lit: Object.fromEntries(G7.map((m) => [m, m === 59 && f >= cue(1) ? Math.max(0.8, pulse(f, cue(1))) : m === 65 && f >= cue(2) ? Math.max(0.8, pulse(f, cue(2))) : 0.2])), labels: named(G7) };
    case "magnets": return f >= cue(1)
      ? { lit: { 59: 0.85, 60: 0.3, 65: 0.85, 64: 0.3 }, labels: named([59, 60, 64, 65]), marks: { 60: "↑", 64: "↓" } }
      : { lit: { 59: 0.85, 60: 0.3 }, labels: named([59, 60]), marks: { 60: "↑" } };
    case "pull": {
      const up = f >= cue(0) + 12, down = f >= cue(1) + 12;
      const lit: Record<number, number> = { [up ? 60 : 59]: 0.85 };
      if (f >= cue(1)) lit[down ? 64 : 65] = 0.85;
      return { lit, labels: named([59, 60, 64, 65]), marks: { 60: "↑", 64: "↓" } };
    }
    case "again": return f >= cue(2) ? { lit: Object.fromEntries(HOME.map((m) => [m, Math.max(0.55, pulse(f, cue(2)))])), labels: named(HOME) } : f >= cue(1) ? { lit: Object.fromEntries(G7.map((m) => [m, Math.max(0.55, pulse(f, cue(1)))])), labels: named(G7) } : { labels: named(G7) };
    case "tritone": return f >= cue(2) ? { lit: { 60: Math.max(0.8, pulse(f, cue(2))), 64: Math.max(0.8, pulse(f, cue(2))) }, labels: named([59, 60, 64, 65]) } : { lit: { 59: 0.85, 65: 0.85 }, labels: named([59, 65]), badges: { 59: "B", 65: "F" } };
    default: return {};
  }
}

/** Reel 9: why the last chord feels like home. 9:16. */
export const HomeChordReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const pianoOn = interpolate(frame, [tl.start("tension"), tl.start("tension") + 18, tl.start("guitar") - 8, tl.start("guitar")], [0, 1, 1, 0], LINEAR);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, color: C.text, fontFamily: sans }}>
      <Backdrop frame={frame} />

      {id === "hook" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len, 1) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 50, fontFamily: serif, fontSize: 230, fontWeight: 600 }}>
            <span style={{ ...lift(f, 4), color: C.muted }}>G7</span>
            <span style={{ ...lift(f, 16), fontSize: 140, color: C.muted }}>→</span>
            <span style={{ ...lift(f, 26), color: C.gold, textShadow: "0 0 100px rgba(236,178,63,0.45)" }}>C</span>
          </div>
          <div style={{ ...lift(f, tl.cue("hook", 1), 60), fontFamily: serif, fontSize: 120, marginTop: 40 }}>= {gold("two notes")}</div>
        </AbsoluteFill>
      )}

      {PIANO_IDS.includes(id) && <Piano from={53} to={72} top={760} enter={pianoOn} {...piano(id, f)} />}
      {id === "wait" && f >= tl.cue("wait", 1) && <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: serif, fontSize: 200, fontWeight: 600, color: C.gold, ...lift(f, tl.cue("wait", 1), 30) }}>?</div>}
      {id === "tritone" && <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: serif, fontSize: 110, ...lift(f, 4, 30) }}>B {gold("↔")} F</div>}

      {id === "guitar" && (
        <div style={{ opacity: fade(f, len) }}>
          <ChordBox frets={f >= tl.cue("guitar", 1) ? "x32010" : "320001"} name={f >= tl.cue("guitar", 1) ? "C" : "G7"} x={290} y={560} />
        </div>
      )}

      {id === "fomo" && <BigText f={f} len={len} small="Now you will hear this pull">at the end of {gold("almost every song")}.</BigText>}
      {id === "lesson" && <Lessons f={f} len={len} voice={tl.voice("lesson")} note="each about five minutes" to={300} />}
      {id === "close" && <Close f={f} voice={tl.voice("close")} />}

      {HEADLINES[id] && <Headline f={f} len={len}>{HEADLINES[id]}</Headline>}
      <Caption text={script[tl.index(id)].show} f={f} len={len} />

      <Bed total={tl.total} quiet={[[tl.start("tension"), tl.start("fomo")]]} />
      <Voices tl={tl} dir="vertical/home-chord" />
      <Hit at={10} midis={G7_SOUND} volume={0.26} />
      <Hit at={tl.cue("hook", 1) + 4} midis={C_SOUND} volume={0.26} />
      <Hit at={tl.start("tension") + tl.cue("tension", 1)} midis={G7_SOUND} volume={0.25} />
      <Hit at={tl.start("home") + 2} midis={C_SOUND} volume={0.25} />
      <Hit at={tl.start("look") + tl.cue("look", 1)} midis={[59]} volume={0.28} />
      <Hit at={tl.start("look") + tl.cue("look", 2)} midis={[65]} volume={0.28} />
      <Hit at={tl.start("pull") + tl.cue("pull", 0)} midis={[59]} volume={0.28} />
      <Hit at={tl.start("pull") + tl.cue("pull", 0) + 12} midis={[60]} volume={0.28} />
      <Hit at={tl.start("pull") + tl.cue("pull", 1)} midis={[65]} volume={0.28} />
      <Hit at={tl.start("pull") + tl.cue("pull", 1) + 12} midis={[64]} volume={0.28} />
      <Hit at={tl.start("again") + tl.cue("again", 1)} midis={G7_SOUND} volume={0.25} />
      <Hit at={tl.start("again") + tl.cue("again", 2)} midis={C_SOUND} volume={0.25} />
      <Hit at={tl.start("tritone") + 4} midis={[59, 65]} volume={0.28} />
      <Hit at={tl.start("tritone") + tl.cue("tritone", 2)} midis={[60, 64]} volume={0.28} />
      <Hit at={tl.start("guitar") + 8} midis={G7_GUITAR} volume={0.28} />
      <Hit at={tl.start("guitar") + tl.cue("guitar", 1) + 4} midis={C_GUITAR} volume={0.28} />
    </AbsoluteFill>
  );
};
