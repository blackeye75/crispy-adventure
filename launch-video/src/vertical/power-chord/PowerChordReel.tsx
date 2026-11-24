import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, sans, serif } from "../../theme";
import { Backdrop, Bed, BigText, Caption, ChordBox, Close, fade, gold, Headline, Hit, Lessons, lift, Piano, pulse, timeline, Voices } from "../kit";
import script from "./script.json";
import timing from "./timing.json";

// Why rock sounds heavy: the power chord leaves out the third (Level 3, sus and power chords).
const tl = timeline(script, timing, { major: 30, neither: 30, move: 20, close: 50 });
export const POWER_CHORD_FRAMES = tl.total;

const E_MAJOR = [52, 56, 59], E_MINOR = [52, 55, 59], E5 = [52, 59, 64]; // E3 G♯3 B3 · E3 G3 B3 · E3 B3 E4
const GUITAR: [string, number[]][] = [["E5", [40, 47, 52]], ["G5", [43, 50, 55]], ["A5", [45, 52, 57]]]; // 022xxx · 355xxx · 577xxx
const NAMES: Record<number, string> = { 52: "E", 55: "G", 56: "G♯", 59: "B", 64: "E" };
const named = (midis: number[]) => Object.fromEntries(midis.map((m) => [m, NAMES[m]]));
const glow = (midis: number[], f: number, at: number) => ({ lit: Object.fromEntries(midis.map((m) => [m, Math.max(0.55, pulse(f, at))])), labels: named(midis) });
const PIANO_IDS = ["major", "notes", "third", "swap", "delete", "neither"];

const HEADLINES: Record<string, React.ReactNode> = {
  major: <>{gold("E")} major</>, notes: <>Three {gold("notes")}</>, third: <>The {gold("third")}</>, delete: <>{gold("Delete")} it</>,
  neither: <>Just {gold("strong")}</>, distortion: <>The {gold("trick")}</>, guitar: <>On {gold("guitar")}</>, move: <>Move it {gold("anywhere")}</>,
};

type Keys = { lit?: Record<number, number>; labels?: Record<number, string>; marks?: Record<number, string>; badges?: Record<number, string> };
function piano(id: string, f: number): Keys {
  const cue = (k: number) => tl.cue(id, k);
  switch (id) {
    case "major": return glow(E_MAJOR, f, tl.voice("major") + 4);
    case "notes": return { lit: Object.fromEntries(E_MAJOR.map((m, k) => [m, pulse(f, cue(k))])), labels: Object.fromEntries(E_MAJOR.filter((_, k) => f >= cue(k)).map((m) => [m, NAMES[m]])) };
    case "third": return { lit: { 52: 0.3, 59: 0.3, 56: Math.max(0.85, pulse(f, 2)) }, labels: named(E_MAJOR), marks: { 56: "3rd" } };
    case "swap": return f >= cue(2) ? glow(E_MINOR, f, cue(2)) : glow(E_MAJOR, f, cue(0));
    case "delete": return { lit: { 52: f >= cue(1) ? 0.85 : 0.55, 59: f >= cue(1) ? 0.85 : 0.55, 56: interpolate(f, [8, 22], [0.55, 0], LINEAR) }, labels: named([52, 59, ...(f < 22 ? [56] : [])]), marks: { 56: "✕" }, badges: f >= cue(2) ? { 52: "1", 59: "5" } : ({} as Record<number, string>) };
    case "neither": return glow(E5, f, 4);
    default: return {};
  }
}

/** Reel 11: why rock sounds heavy. 9:16. */
export const PowerChordReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const pianoOn = interpolate(frame, [tl.start("major"), tl.start("major") + 18, tl.start("distortion") - 8, tl.start("distortion")], [0, 1, 1, 0], LINEAR);
  const moving = id === "move" ? Math.max(-1, timing[tl.index("move")].onsets.slice(1).filter((_, n) => f >= tl.cue("move", n + 1)).length - 1) : -1;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, color: C.text, fontFamily: sans }}>
      <Backdrop frame={frame} />

      {id === "hook" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len, 1) }}>
          <div style={{ fontFamily: serif, fontSize: 200, fontWeight: 600, ...lift(f, 4) }}>Heavy</div>
          <div style={{ fontFamily: serif, fontSize: 400, fontWeight: 600, lineHeight: 1, color: C.gold, textShadow: "0 0 120px rgba(236,178,63,0.45)", ...lift(f, tl.cue("hook", 1), 60) }}>−1</div>
          <div style={{ fontFamily: serif, fontSize: 110, ...lift(f, tl.cue("hook", 1) + 8) }}>note</div>
        </AbsoluteFill>
      )}

      {PIANO_IDS.includes(id) && <Piano from={52} to={64} top={760} enter={pianoOn} {...piano(id, f)} />}
      {id === "swap" && <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: serif, fontSize: 150, fontWeight: 600, color: f >= tl.cue("swap", 2) ? C.muted : C.gold }}>{f >= tl.cue("swap", 2) ? "Sad" : "Happy"}</div>}

      {id === "distortion" && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 560, display: "flex", gap: 40, justifyContent: "center", opacity: fade(f, len) }}>
          {[["The 3rd", "harsh, muddy", false, tl.cue("distortion", 1)], ["The 5th", "clean, powerful", true, tl.cue("distortion", 2)]].map(([title, word, good, at]) => (
            <div key={String(title)} style={{ ...lift(f, Number(at), 40), width: 420, height: 520, borderRadius: 36, backgroundColor: good ? C.gold : C.card, border: `3px solid ${good ? C.gold : C.line}`, color: good ? C.bg : C.text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
              <div style={{ fontFamily: serif, fontSize: 96, fontWeight: 600 }}>{title}</div>
              <div style={{ fontSize: 44, fontWeight: 600, opacity: 0.85 }}>{word}</div>
              <div style={{ fontSize: 110 }}>{good ? "✓" : "✕"}</div>
            </div>
          ))}
        </div>
      )}

      {id === "guitar" && <div style={{ opacity: fade(f, len) }}><ChordBox frets="022xxx" name="E5" x={290} y={560} /></div>}

      {id === "move" && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 620, display: "flex", justifyContent: "center", gap: 30, opacity: fade(f, len) }}>
          {GUITAR.map(([name], k) => (
            <div key={name} style={{ ...lift(f, k * 4, 40), width: 260, height: 300, borderRadius: 32, backgroundColor: moving === k ? C.gold : C.card, border: `3px solid ${moving === k ? C.gold : C.line}`, color: moving === k ? C.bg : C.text, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 110, fontWeight: 600 }}>{name}</div>
          ))}
        </div>
      )}

      {id === "fomo" && <BigText f={f} len={len} small="One shape.">A {gold("thousand")} rock riffs.</BigText>}
      {id === "lesson" && <Lessons f={f} len={len} voice={tl.voice("lesson")} note="each about five minutes" to={300} />}
      {id === "close" && <Close f={f} voice={tl.voice("close")} />}

      {HEADLINES[id] && <Headline f={f} len={len}>{HEADLINES[id]}</Headline>}
      <Caption text={script[tl.index(id)].show} f={f} len={len} />

      <Bed total={tl.total} quiet={[[tl.start("major"), tl.start("fomo")]]} />
      <Voices tl={tl} dir="vertical/power-chord" />
      <Hit at={tl.cue("hook", 1)} midis={GUITAR[0][1]} volume={0.36} />
      <Hit at={tl.start("major") + tl.voice("major") + 4} midis={E_MAJOR} volume={0.38} />
      {E_MAJOR.map((m, k) => <Hit key={`n${k}`} at={tl.start("notes") + tl.cue("notes", k)} midis={[m]} volume={0.38} />)}
      <Hit at={tl.start("third") + 2} midis={[56]} volume={0.38} />
      <Hit at={tl.start("swap") + tl.cue("swap", 0)} midis={E_MAJOR} volume={0.38} />
      <Hit at={tl.start("swap") + tl.cue("swap", 2)} midis={E_MINOR} volume={0.38} />
      <Hit at={tl.start("delete") + tl.cue("delete", 1)} midis={[52, 59]} volume={0.38} />
      <Hit at={tl.start("neither") + 4} midis={[40, ...E5]} volume={0.4} />
      <Hit at={tl.start("distortion") + tl.cue("distortion", 1)} midis={E_MAJOR} volume={0.34} />
      <Hit at={tl.start("distortion") + tl.cue("distortion", 2)} midis={E5} volume={0.36} />
      <Hit at={tl.start("guitar") + tl.cue("guitar", 1)} midis={GUITAR[0][1]} volume={0.4} />
      {GUITAR.map(([, midis], k) => <Hit key={`g${k}`} at={tl.start("move") + tl.cue("move", k + 1)} midis={midis} volume={0.4} />)}
    </AbsoluteFill>
  );
};
