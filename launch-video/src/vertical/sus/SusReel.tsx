import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, sans, serif } from "../../theme";
import { Backdrop, Bed, Caption, ChordBox, Close, fade, gold, Headline, Hit, lift, timeline, Voices } from "../kit";
import script from "./script.json";
import timing from "./timing.json";

// Sus chords: the 3rd replaced by the 4th or the 2nd (Level 3, sus and power chords).
const tl = timeline(script, timing, { d: 16, sus4: 20, release: 20, sus2: 20, close: 45 });
export const SUS_FRAMES = tl.total;

const D = { frets: "xx0232", name: "D", midis: [50, 57, 62, 66] };
const DSUS4 = { frets: "xx0233", name: "Dsus4", midis: [50, 57, 62, 67] };
const DSUS2 = { frets: "xx0230", name: "Dsus2", midis: [50, 57, 62, 64] };

const HEADLINES: Record<string, React.ReactNode> = {
  d: <>{gold("D")} major</>, sus4: <>One {gold("finger")}</>, why: <>No {gold("third")}</>, release: <>{gold("Home")}</>, sus2: <>{gold("Sus2")}</>,
};

/** Reel 14: why sus chords sound unfinished. 9:16, about 35 seconds. */
export const SusReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const cue = (k: number) => tl.cue(id, k);
  const box = id === "d" ? D : id === "sus4" ? (f >= cue(1) ? DSUS4 : D) : id === "why" ? DSUS4 : id === "release" ? (f >= cue(1) ? D : DSUS4) : id === "sus2" ? (f >= cue(1) ? DSUS2 : D) : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, color: C.text, fontFamily: sans }}>
      <Backdrop frame={frame} />
      {id === "hook" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len, 1) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 40, fontFamily: serif, fontSize: 170, fontWeight: 600 }}>
            <span style={{ color: C.muted }}>Dsus4</span><span style={{ fontSize: 110, color: C.muted }}>→</span><span style={{ color: C.gold }}>D</span>
          </div>
          <div style={{ ...lift(f, cue(2), 50), fontFamily: serif, fontSize: 110, marginTop: 40 }}>= {gold("one finger")}</div>
        </AbsoluteFill>
      )}
      {box && <div style={{ opacity: fade(f, len, 6, 4) }}><ChordBox frets={box.frets} name={box.name} x={290} y={560} /></div>}
      {id === "why" && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", fontFamily: serif, fontSize: 76, ...lift(f, 4, 30) }}>
          F♯ <span style={{ color: C.muted }}>(3rd)</span> {gold("→")} G <span style={{ color: C.muted }}>(4th)</span>
        </div>
      )}
      {id === "close" && <Close f={f} voice={tl.voice("close")} />}

      {HEADLINES[id] && <Headline f={f} len={len}>{HEADLINES[id]}</Headline>}
      <Caption text={script[tl.index(id)].show} f={f} len={len} />

      <Bed total={tl.total} quiet={[[0, tl.start("close")]]} />
      <Voices tl={tl} dir="vertical/sus" />
      <Hit at={2} midis={DSUS4.midis} volume={0.36} />
      <Hit at={tl.cue("hook", 1) + 8} midis={D.midis} volume={0.36} />
      <Hit at={tl.start("d") + tl.voice("d") + 2} midis={D.midis} volume={0.38} />
      <Hit at={tl.start("sus4") + tl.cue("sus4", 1)} midis={DSUS4.midis} volume={0.38} />
      <Hit at={tl.start("why") + tl.cue("why", 2)} midis={DSUS4.midis} volume={0.34} />
      <Hit at={tl.start("release") + 2} midis={DSUS4.midis} volume={0.36} />
      <Hit at={tl.start("release") + tl.cue("release", 1)} midis={D.midis} volume={0.38} />
      <Hit at={tl.start("sus2") + tl.cue("sus2", 1)} midis={DSUS2.midis} volume={0.38} />
    </AbsoluteFill>
  );
};
