import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, sans, serif } from "../../theme";
import { Backdrop, Bed, Caption, Close, fade, gold, Hit, lift, pulse, timeline, Voices } from "../kit";
import script from "./script.json";
import timing from "./timing.json";

// A comment quiz: three chords, happy or sad, answers revealed at the end (Level 2, major or minor by ear).
const GAP = 66; // frames of listening after each "Chord n"
const tl = timeline(script, timing, { r1: GAP, r2: GAP, r3: GAP, reveal: 20, close: 45 });
export const CHORD_QUIZ_FRAMES = tl.total;

const CHORDS = [
  { name: "C major", answer: "H", midis: [48, 55, 60, 64, 67] },
  { name: "E minor", answer: "S", midis: [40, 47, 52, 55, 59, 64] },
  { name: "D major", answer: "H", midis: [50, 57, 62, 66] },
];
const ROUNDS = ["r1", "r2", "r3"];

/** Bars that jump when the chord sounds: the screen shows that something plays, never what. */
const Sound = ({ f, at }: { f: number; at: number }) => {
  const env = Math.max(0.08, f < at ? 0 : Math.exp(-(f - at) / 30));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 820, height: 260, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
      {Array.from({ length: 11 }, (_, k) => <div key={k} style={{ width: 32, height: 24 + 230 * env * (0.55 + 0.45 * Math.abs(Math.sin(f * 0.4 + k * 1.7))) * (1 - Math.abs(k - 5) / 7), borderRadius: 16, backgroundColor: C.gold, opacity: 0.4 + 0.6 * env }} />)}
    </div>
  );
};

/** Reel 15: happy or sad? A comment quiz. 9:16, about 35 seconds. */
export const ChordQuizReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const cue = (k: number) => tl.cue(id, k);
  const round = ROUNDS.indexOf(id);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, color: C.text, fontFamily: sans }}>
      <Backdrop frame={frame} />

      {id === "hook" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len, 1) }}>
          <div style={{ fontFamily: serif, fontSize: 180, fontWeight: 600, lineHeight: 1 }}><span style={{ color: C.gold }}>Happy</span> <span style={{ color: C.muted }}>or</span></div>
          <div style={{ fontFamily: serif, fontSize: 180, fontWeight: 600, lineHeight: 1.1, color: C.muted }}>sad?</div>
          <div style={{ ...lift(f, cue(2), 40), marginTop: 50, backgroundColor: C.text, color: C.bg, borderRadius: 40, padding: "24px 50px", fontSize: 52, fontWeight: 700 }}>Comment H or S</div>
        </AbsoluteFill>
      )}

      {round >= 0 && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 20 }}>
            {ROUNDS.map((r, k) => <div key={r} style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: k <= round ? C.gold : C.line }} />)}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: serif, fontSize: 150, fontWeight: 600, ...lift(f, 0, 40) }}>Chord {gold(String(round + 1))}</div>
          <Sound f={f} at={tl.voice(id) + 4} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 1140, display: "flex", justifyContent: "center", gap: 40, opacity: interpolate(f, [6, 16], [0, 1], LINEAR) }}>
            {["H · happy", "S · sad"].map((label) => <div key={label} style={{ width: 380, height: 130, borderRadius: 70, border: `4px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, fontWeight: 700 }}>{label}</div>)}
          </div>
        </>
      )}

      {id === "comment" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len) }}>
          <div style={{ fontFamily: serif, fontSize: 120, fontWeight: 600, ...lift(f, 2, 40) }}>Comment {gold("now")}</div>
          <div style={{ fontSize: 56, color: C.muted, marginTop: 20, ...lift(f, cue(1), 30) }}>e.g. “H S H”</div>
          <div style={{ fontFamily: serif, fontSize: 300, fontWeight: 600, color: C.gold, marginTop: 40, lineHeight: 1, scale: String(1 + 0.15 * pulse(f, f >= cue(4) ? cue(4) : f >= cue(3) ? cue(3) : cue(2))) }}>
            {f >= cue(4) ? "1" : f >= cue(3) ? "2" : f >= cue(2) ? "3" : ""}
          </div>
        </AbsoluteFill>
      )}

      {id === "reveal" && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 420, display: "flex", flexDirection: "column", gap: 34, opacity: fade(f, len) }}>
          {CHORDS.map((c, k) => {
            const at = cue(k * 2), on = f >= at;
            return (
              <div key={c.name} style={{ ...lift(f, at, 40), opacity: on ? 1 : 0, height: 190, borderRadius: 36, backgroundColor: c.answer === "H" ? C.gold : C.card, color: c.answer === "H" ? C.bg : C.text, border: `3px solid ${c.answer === "H" ? C.gold : C.line}`, display: "flex", alignItems: "center", gap: 40, padding: "0 50px" }}>
                <div style={{ fontFamily: serif, fontSize: 120, fontWeight: 600, width: 100 }}>{c.answer}</div>
                <div style={{ fontSize: 60, fontWeight: 700 }}>{c.name}</div>
                <div style={{ marginLeft: "auto", fontSize: 44, opacity: 0.8 }}>{c.answer === "H" ? "happy" : "sad"}</div>
              </div>
            );
          })}
        </div>
      )}
      {id === "close" && <Close f={f} voice={tl.voice("close")} />}

      <Caption text={script[tl.index(id)].show} f={f} len={len} />
      <Bed total={tl.total} quiet={[[tl.start("r1"), tl.start("close")]]} />
      <Voices tl={tl} dir="vertical/chord-quiz" />
      {ROUNDS.map((r, k) => <Hit key={r} at={tl.start(r) + tl.voice(r) + 4} midis={CHORDS[k].midis} volume={0.42} />)}
      {CHORDS.map((c, k) => <Hit key={`v${k}`} at={tl.start("reveal") + tl.cue("reveal", k * 2 + 1)} midis={c.midis} volume={0.34} />)}
    </AbsoluteFill>
  );
};
