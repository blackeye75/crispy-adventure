import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, sans, serif } from "../../theme";
import { Backdrop, Bed, BigText, Caption, ChordBox, Close, fade, gold, Headline, Hit, Lessons, lift, Piano, pulse, timeline, Voices } from "../kit";
import script from "./script.json";
import timing from "./timing.json";

// The bittersweet chord: IV made minor in a major key, borrowed from the parallel minor (Level 5, modal interchange).
const tl = timeline(script, timing, { happy: 20, listen: 30, feel: 40, why: 30, guitar: 30, close: 50 });
export const BITTERSWEET_FRAMES = tl.total;

const CHORD = { C: [55, 60, 64], F: [53, 57, 60], Fm: [53, 56, 60] }; // G3 C4 E4 · F3 A3 C4 · F3 A♭3 C4
const BASS = { C: 48, F: 41, Fm: 41 };
const SOUND = (name: keyof typeof CHORD) => [BASS[name], ...CHORD[name]];
const F_GUITAR = [41, 48, 53, 57, 60, 65]; // 133211
const FM_GUITAR = [41, 48, 53, 56, 60, 65]; // 133111
const NAMES: Record<number, string> = { 53: "F", 55: "G", 56: "A♭", 57: "A", 60: "C", 64: "E" };
const named = (midis: number[]) => Object.fromEntries(midis.map((m) => [m, NAMES[m]]));
const glow = (name: keyof typeof CHORD, f: number, at: number) => ({ lit: Object.fromEntries(CHORD[name].map((m) => [m, Math.max(0.55, pulse(f, at))])), labels: named(CHORD[name]) });
const PIANO_IDS = ["happy", "notes", "lower", "minor", "listen", "feel", "why"];

const HEADLINES: Record<string, React.ReactNode> = {
  happy: <>Happy, in {gold("C")}</>, notes: <>{gold("F")} major</>, lower: <>One key {gold("down")}</>, minor: <>{gold("Borrowed")}</>,
  listen: <>Now {gold("listen")}</>, feel: <>A {gold("sigh")}</>, why: <>{gold("Why")}?</>, guitar: <>On {gold("guitar")}</>,
};

type Keys = { lit?: Record<number, number>; labels?: Record<number, string>; marks?: Record<number, string>; badges?: Record<number, string> };
function piano(id: string, f: number): Keys {
  const cue = (k: number) => tl.cue(id, k);
  const step = (names: (keyof typeof CHORD)[], first: number) => {
    const k = Math.max(0, timing[tl.index(id)].onsets.slice(first).filter((_, n) => f >= cue(n + first)).length - 1);
    return f < cue(first) ? {} : glow(names[k], f, cue(k + first));
  };
  switch (id) {
    case "happy": return step(["C", "F", "C"], 1);
    case "notes": return { lit: Object.fromEntries(CHORD.F.map((m, k) => [m, pulse(f, cue(k))])), labels: Object.fromEntries(CHORD.F.filter((_, k) => f >= cue(k)).map((m) => [m, NAMES[m]])) };
    case "lower": { const moved = f >= cue(1); return { lit: { 53: 0.55, 60: 0.55, [moved ? 56 : 57]: moved ? Math.max(0.55, pulse(f, cue(1))) : 0.55 }, labels: named(moved ? CHORD.Fm : CHORD.F) }; }
    case "minor": return { lit: Object.fromEntries(CHORD.Fm.map((m) => [m, 0.55])), labels: named(CHORD.Fm) };
    case "listen": return step(["C", "F", "Fm", "C"], 1);
    case "feel": return f >= cue(2) + 20 ? glow("C", f, cue(2) + 20) : f >= cue(1) ? glow("Fm", f, cue(1)) : glow("F", f, 0);
    case "why": return f >= cue(2) ? glow("C", f, cue(2)) : { lit: { 53: 0.3, 60: 0.3, 56: f >= cue(1) ? Math.max(0.8, pulse(f, cue(1))) : 0.55, 55: f >= cue(1) + 12 ? 0.8 : 0 }, labels: named([53, 55, 56, 60]), marks: { 55: "↓" } };
    default: return {};
  }
}

/** Reel 10: the bittersweet chord. 9:16. */
export const BittersweetReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const pianoOn = interpolate(frame, [tl.start("happy"), tl.start("happy") + 18, tl.start("guitar") - 8, tl.start("guitar")], [0, 1, 1, 0], LINEAR);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, color: C.text, fontFamily: sans }}>
      <Backdrop frame={frame} />

      {id === "hook" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len, 1) }}>
          <div style={{ fontFamily: serif, fontSize: 160, fontWeight: 600, lineHeight: 1 }}>
            <span style={{ ...lift(f, 4), color: C.muted }}>Bitter</span><span style={{ ...lift(f, 14), color: C.gold }}>sweet</span>
          </div>
          <div style={{ ...lift(f, tl.cue("hook", 2), 60), fontFamily: serif, fontSize: 110, marginTop: 50 }}>= {gold("one note")}</div>
        </AbsoluteFill>
      )}

      {PIANO_IDS.includes(id) && <Piano from={53} to={72} top={760} enter={pianoOn} {...piano(id, f)} />}
      {id === "lower" && f >= tl.cue("lower", 1) && <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontFamily: serif, fontSize: 90, ...lift(f, tl.cue("lower", 1), 30) }}>A {gold("→")} A♭</div>}
      {id === "minor" && f >= tl.cue("minor", 2) && <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontSize: 54, color: C.muted, ...lift(f, tl.cue("minor", 2), 30) }}>from {gold("C minor")}</div>}

      {id === "guitar" && (
        <div style={{ opacity: fade(f, len) }}>
          <ChordBox frets={f >= tl.cue("guitar", 2) ? "133111" : "133211"} name={f >= tl.cue("guitar", 2) ? "F minor" : "F"} x={290} y={560} />
        </div>
      )}

      {id === "fomo" && <BigText f={f} len={len} small="Once you know it, you will hear it">in {gold("ballads everywhere")}.</BigText>}
      {id === "lesson" && <Lessons f={f} len={len} voice={tl.voice("lesson")} note="each about five minutes" to={300} />}
      {id === "close" && <Close f={f} voice={tl.voice("close")} />}

      {HEADLINES[id] && <Headline f={f} len={len}>{HEADLINES[id]}</Headline>}
      <Caption text={script[tl.index(id)].show} f={f} len={len} />

      <Bed total={tl.total} quiet={[[tl.start("happy"), tl.start("fomo")]]} />
      <Voices tl={tl} dir="vertical/bittersweet" />
      <Hit at={tl.cue("hook", 1)} midis={SOUND("Fm")} volume={0.3} />
      {(["C", "F", "C"] as const).map((n, k) => <Hit key={`h${k}`} at={tl.start("happy") + tl.cue("happy", k + 1)} midis={SOUND(n)} volume={0.38} />)}
      {CHORD.F.map((m, k) => <Hit key={`n${k}`} at={tl.start("notes") + tl.cue("notes", k)} midis={[m]} volume={0.38} />)}
      <Hit at={tl.start("lower") + tl.cue("lower", 1)} midis={CHORD.Fm} volume={0.38} />
      <Hit at={tl.start("minor") + 4} midis={SOUND("Fm")} volume={0.36} />
      {(["C", "F", "Fm", "C"] as const).map((n, k) => <Hit key={`l${k}`} at={tl.start("listen") + tl.cue("listen", k + 1)} midis={SOUND(n)} volume={0.4} />)}
      <Hit at={tl.start("feel") + 2} midis={SOUND("F")} volume={0.38} />
      <Hit at={tl.start("feel") + tl.cue("feel", 1)} midis={SOUND("Fm")} volume={0.38} />
      <Hit at={tl.start("feel") + tl.cue("feel", 2)} midis={SOUND("Fm")} volume={0.36} />
      <Hit at={tl.start("feel") + tl.cue("feel", 2) + 20} midis={SOUND("C")} volume={0.38} />
      <Hit at={tl.start("why") + tl.cue("why", 1)} midis={[56]} volume={0.38} />
      <Hit at={tl.start("why") + tl.cue("why", 1) + 12} midis={[55]} volume={0.38} />
      <Hit at={tl.start("why") + tl.cue("why", 2)} midis={SOUND("C")} volume={0.38} />
      <Hit at={tl.start("guitar") + 8} midis={F_GUITAR} volume={0.36} />
      <Hit at={tl.start("guitar") + tl.cue("guitar", 2)} midis={FM_GUITAR} volume={0.36} />
    </AbsoluteFill>
  );
};
