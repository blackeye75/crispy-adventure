import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, sans, serif } from "../../theme";
import { Backdrop, Bed, Caption, ChordBox, Close, fade, gold, Headline, Hit, lift, timeline, Voices } from "../kit";
import script from "./script.json";
import timing from "./timing.json";

// One shape, twelve chords: the E-shape barre chord moved up the neck (Level 3, chords on your instrument).
const tl = timeline(script, timing, { hook: 16, f: 16, move: 14, minor: 24, close: 45 });
export const BARRE_FRAMES = tl.total;

type Shape = { frets: string; name: string; base?: number; midis: number[] };
const E: Shape = { frets: "022100", name: "E", midis: [40, 47, 52, 56, 59, 64] };
const F: Shape = { frets: "133211", name: "F", midis: [41, 48, 53, 57, 60, 65] };
const FM: Shape = { frets: "133111", name: "F minor", midis: [41, 48, 53, 56, 60, 65] };
const G: Shape = { frets: "355433", name: "G", base: 3, midis: [43, 50, 55, 59, 62, 67] };
const A: Shape = { frets: "577655", name: "A", base: 5, midis: [45, 52, 57, 61, 64, 69] };
const B: Shape = { frets: "799877", name: "B", base: 7, midis: [47, 54, 59, 63, 66, 71] };

const HEADLINES: Record<string, React.ReactNode> = {
  shape: <>Slide it {gold("up")}</>, f: <>{gold("F")} major</>, move: <>Same {gold("shape")}</>, why: <>{gold("Why")} it works</>, minor: <>Lift {gold("one finger")}</>,
};

function shapeAt(id: string, f: number): Shape | undefined {
  const cue = (k: number) => tl.cue(id, k);
  switch (id) {
    case "shape": return f >= cue(1) + 10 ? F : E;
    case "f": return F;
    case "move": return f >= cue(5) ? B : f >= cue(3) ? A : G;
    case "why": return A;
    case "minor": return f >= cue(1) ? FM : F;
    default: return undefined;
  }
}

/** Reel 12: one shape, twelve chords. 9:16, about 35 seconds. */
export const BarreReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const shape = shapeAt(id, f);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, color: C.text, fontFamily: sans }}>
      <Backdrop frame={frame} />

      {id === "hook" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len, 1) }}>
          <div style={{ fontFamily: serif, fontSize: 200, fontWeight: 600, lineHeight: 1 }}><span style={{ color: C.gold }}>1</span> shape</div>
          <div style={{ ...lift(f, tl.cue("hook", 1), 60), fontFamily: serif, fontSize: 130, marginTop: 30 }}>= {gold("12 chords")}</div>
        </AbsoluteFill>
      )}

      {shape && (
        <div style={{ opacity: fade(f, len, 6, 4) }}>
          <ChordBox frets={shape.frets} name={shape.name} base={shape.base} x={290} y={560} />
        </div>
      )}
      {id === "why" && f >= tl.cue("why", 2) && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", fontSize: 52, fontWeight: 600, ...lift(f, tl.cue("why", 2), 30) }}>
          Root on string 6 = {gold("the chord's name")}
        </div>
      )}
      {id === "close" && <Close f={f} voice={tl.voice("close")} />}

      {HEADLINES[id] && <Headline f={f} len={len}>{HEADLINES[id]}</Headline>}
      <Caption text={script[tl.index(id)].show} f={f} len={len} />

      <Bed total={tl.total} quiet={[[tl.start("shape"), tl.start("close")]]} />
      <Voices tl={tl} dir="vertical/barre" />
      <Hit at={2} midis={F.midis} volume={0.34} />
      <Hit at={tl.cue("hook", 1)} midis={A.midis} volume={0.3} />
      <Hit at={tl.start("shape") + 4} midis={E.midis} volume={0.34} />
      <Hit at={tl.start("shape") + tl.cue("shape", 1) + 10} midis={F.midis} volume={0.34} />
      <Hit at={tl.start("f") + tl.voice("f") + 2} midis={F.midis} volume={0.34} />
      {[[1, G], [3, A], [5, B]].map(([k, s]) => <Hit key={String(k)} at={tl.start("move") + tl.cue("move", k as number)} midis={(s as Shape).midis} volume={0.34} />)}
      <Hit at={tl.start("minor") + 4} midis={F.midis} volume={0.32} />
      <Hit at={tl.start("minor") + tl.cue("minor", 1)} midis={FM.midis} volume={0.34} />
    </AbsoluteFill>
  );
};

