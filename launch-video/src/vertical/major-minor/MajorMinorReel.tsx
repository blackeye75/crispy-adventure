import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, sans, serif } from "../../theme";
import { Backdrop, BigText, Caption, ChordBox, Close, fade, gold, Headline, Hit, Lessons, lift, Piano, pulse, timeline, Voices, Bed } from "../kit";
import script from "./script.json";
import timing from "./timing.json";

// Easy lesson: "Major and minor triads" (Level 3), for complete beginners.
const tl = timeline(script, timing, { bright: 45, listen: 45, close: 50 });
export const MAJOR_MINOR_FRAMES = tl.total;

const MAJOR = [60, 64, 67], MINOR = [60, 63, 67], A_MAJOR = [57, 61, 64], A_MINOR = [57, 60, 64];
const E_MAJOR = [40, 47, 52, 56, 59, 64], E_MINOR = [40, 47, 52, 55, 59, 64]; // open shapes 022100 and 022000
const NAMES: Record<number, string> = { 57: "A", 60: "C", 61: "C♯", 63: "E♭", 64: "E", 67: "G" };
const named = (midis: number[]) => Object.fromEntries(midis.map((m) => [m, NAMES[m]]));
const steady = (midis: number[], amount = 0.55) => Object.fromEntries(midis.map((m) => [m, amount]));
const PIANO_IDS = ["major", "notes", "bright", "move", "listen", "sad", "swap", "rule", "any"];

const HEADLINES: Record<string, React.ReactNode> = {
  major: <>A {gold("C major")} chord</>, notes: <>Three {gold("notes")}</>, bright: <>Major sounds {gold("bright")}</>,
  move: <>One key {gold("down")}</>, listen: <>Now listen</>, sad: <>Minor sounds {gold("sad")}</>,
  rule: <>Count the {gold("keys")}</>, any: <>From {gold("any")} note</>, guitar: <>On {gold("guitar")}</>,
};

/** The keyboard for each moment: which keys glow, and what is written on them. */
function piano(id: string, f: number) {
  const cue = (k: number) => tl.cue(id, k);
  switch (id) {
    case "notes": return { lit: Object.fromEntries(MAJOR.map((m, k) => [m, pulse(f, cue(k))])), labels: Object.fromEntries(MAJOR.filter((_, k) => f >= cue(k)).map((m) => [m, NAMES[m]])) };
    case "bright": return { lit: Object.fromEntries(MAJOR.map((m) => [m, Math.max(0.55, pulse(f, 2))])), labels: named(MAJOR) };
    case "move": {
      const moved = f >= cue(2);
      return { lit: { ...steady([60, 67]), [moved ? 63 : 64]: moved ? Math.max(0.55, pulse(f, cue(2))) : 0.55 }, labels: named(moved ? MINOR : MAJOR) };
    }
    case "listen": case "sad": return { lit: Object.fromEntries(MINOR.map((m) => [m, id === "listen" ? Math.max(0.55, pulse(f, 2)) : 0.55])), labels: named(MINOR) };
    case "swap": {
      const k = Math.max(0, timing[tl.index("swap")].onsets.filter((_, n) => f >= cue(n)).length - 1);
      const chord = k % 2 ? MINOR : MAJOR;
      return { lit: Object.fromEntries(chord.map((m) => [m, Math.max(0.55, pulse(f, cue(k)))])), labels: named(chord) };
    }
    case "rule": {
      const minor = f >= cue(2);
      const steps = minor ? [61, 62, 63] : [61, 62, 63, 64];
      return { lit: steady(minor ? [60, 63] : [60, 64]), labels: named(minor ? [60, 63] : [60, 64]), badges: f >= cue(1) ? Object.fromEntries(steps.map((m, n) => [m, String(n + 1)])) : {} };
    }
    case "any": {
      const chord = f >= cue(2) ? A_MINOR : A_MAJOR;
      return { lit: f >= cue(1) ? Object.fromEntries(chord.map((m) => [m, Math.max(0.55, pulse(f, cue(f >= cue(2) ? 2 : 1)))])) : {}, labels: f >= cue(1) ? named(chord) : {} };
    }
    default: return {};
  }
}

/** Reel 5 (easy): why one note turns a happy chord sad. 9:16. */
export const MajorMinorReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const pianoOn = interpolate(frame, [tl.start("major"), tl.start("major") + 18, tl.start("guitar") - 8, tl.start("guitar")], [0, 1, 1, 0], LINEAR);
  const swapK = id === "swap" ? Math.max(0, timing[tl.index("swap")].onsets.filter((_, n) => f >= tl.cue("swap", n)).length - 1) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, color: C.text, fontFamily: sans }}>
      <Backdrop frame={frame} />

      {id === "hook" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len, 1) }}>
          <div style={{ display: "flex", gap: 60, fontFamily: serif, fontSize: 180, fontWeight: 600 }}>
            <span style={{ ...lift(f, 4), color: C.gold }}>Happy</span>
            <span style={{ ...lift(f, tl.cue("hook", 1)), color: C.muted }}>Sad</span>
          </div>
          <div style={{ ...lift(f, tl.cue("hook", 2), 70), fontFamily: serif, fontSize: 120, marginTop: 50 }}>
            = {gold("one note")}
          </div>
        </AbsoluteFill>
      )}

      {PIANO_IDS.includes(id) && <Piano from={57} to={72} enter={pianoOn} {...piano(id, f)} />}
      {id === "swap" && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: serif, fontSize: 150, fontWeight: 600, color: swapK % 2 ? C.muted : C.gold }}>{swapK % 2 ? "Minor" : "Major"}</div>
      )}
      {id === "move" && f >= tl.cue("move", 2) && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontFamily: serif, fontSize: 90, ...lift(f, tl.cue("move", 2), 30) }}>E {gold("→")} E♭</div>
      )}

      {id === "guitar" && (
        <div style={{ opacity: fade(f, len) }}>
          <ChordBox frets="022100" name={f >= tl.cue("guitar", 3) ? "E minor" : "E major"} x={290} y={560} fading={{ string: 3, amount: interpolate(f, [tl.cue("guitar", 2), tl.cue("guitar", 2) + 14], [0, 1], LINEAR) }} />
        </div>
      )}

      {id === "fomo" && <BigText f={f} len={len} small="Now you will hear major and minor">in {gold("every song")} you know.</BigText>}
      {id === "lesson" && <Lessons f={f} len={len} voice={tl.voice("lesson")} note="each about five minutes" />}
      {id === "close" && <Close f={f} voice={tl.voice("close")} />}

      {HEADLINES[id] && <Headline f={f} len={len}>{HEADLINES[id]}</Headline>}
      <Caption text={script[tl.index(id)].show} f={f} len={len} />

      <Bed total={tl.total} quiet={[[tl.start("notes"), tl.start("fomo")]]} />
      <Voices tl={tl} dir="vertical/major-minor" />
      {MAJOR.map((m, k) => <Hit key={`n${k}`} at={tl.start("notes") + tl.cue("notes", k)} midis={[m]} volume={0.38} />)}
      <Hit at={tl.start("bright") + 2} midis={MAJOR} />
      <Hit at={tl.start("listen") + 2} midis={MINOR} />
      {[0, 1, 2, 3].map((k) => <Hit key={`s${k}`} at={tl.start("swap") + tl.cue("swap", k)} midis={k % 2 ? MINOR : MAJOR} volume={0.4} />)}
      <Hit at={tl.start("any") + tl.cue("any", 1)} midis={A_MAJOR} volume={0.4} />
      <Hit at={tl.start("any") + tl.cue("any", 2)} midis={A_MINOR} volume={0.4} />
      <Hit at={tl.start("guitar") + tl.cue("guitar", 1)} midis={E_MAJOR} volume={0.38} />
      <Hit at={tl.start("guitar") + tl.cue("guitar", 3)} midis={E_MINOR} volume={0.38} />
    </AbsoluteFill>
  );
};
