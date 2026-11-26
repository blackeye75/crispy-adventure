import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, sans, serif } from "../../theme";
import { Backdrop, Bed, Caption, Close, fade, gold, Headline, Hit, lift, pulse, timeline, Voices } from "../kit";
import script from "./script.json";
import timing from "./timing.json";

// The A minor pentatonic box at the fifth fret (Level 4, pentatonic and blues; lead guitar Basic).
const tl = timeline(script, timing, { hook: 10, notes: 10, lick: 40, close: 45 });
export const PENTATONIC_FRAMES = tl.total;

// [string 6..1, fret, note, midi]
const BOX: [number, number, string, number][] = [
  [6, 5, "A", 45], [6, 8, "C", 48], [5, 5, "D", 50], [5, 7, "E", 52], [4, 5, "G", 55], [4, 7, "A", 57],
  [3, 5, "C", 60], [3, 7, "D", 62], [2, 5, "E", 64], [2, 8, "G", 67], [1, 5, "A", 69], [1, 8, "C", 72],
];
const LICK = [72, 69, 67, 64, 62, 60, 57]; // down the box from the top
const STEP = 7; // frames between lick notes
const NOTES = ["A", "C", "D", "E", "G"];
const NOTE_MIDIS = [45, 48, 50, 52, 55];

/** Six strings, frets 5 to 8, with the box drawn on it. `glow` lights notes by midi; roots (A) are gold. */
export const ScaleBox = ({ glow, show, mark }: { glow: Record<number, number>; show: number; mark?: { midi: number; text: string } }) => {
  const S = 150, Fh = 170, X = 165, Y = 600;
  return (
    <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <text x={X - 72} y={Y + Fh * 0.5 + 14} textAnchor="end" fontFamily={sans} fontSize={40} fontWeight={600} fill={C.muted}>5fr</text>
      {Array.from({ length: 6 }, (_, s) => <rect key={`s${s}`} x={X + s * S - 2} y={Y} width={4} height={Fh * 4} fill="#a99f8d" />)}
      {Array.from({ length: 5 }, (_, k) => <rect key={`f${k}`} x={X} y={Y + k * Fh - 2} width={S * 5} height={4} fill="#6b6455" />)}
      {BOX.map(([string, fret, name, midi], k) => {
        const cx = X + (6 - string) * S, cy = Y + (fret - 5 + 0.5) * Fh, on = glow[midi] ?? 0, root = name === "A";
        return (
          <g key={k} opacity={k < show ? 1 : 0}>
            <circle cx={cx} cy={cy} r={52} fill={root ? C.gold : C.card} stroke={C.gold} strokeWidth={root ? 0 : 5} style={{ filter: on > 0.3 ? "drop-shadow(0 0 26px rgba(236,178,63,0.9))" : undefined }} />
            {on > 0 && <circle cx={cx} cy={cy} r={52} fill={C.gold} opacity={on} />}
            <text x={cx} y={cy + 15} textAnchor="middle" fontFamily={sans} fontSize={42} fontWeight={700} fill={root || on > 0.5 ? C.bg : C.text}>{name}</text>
            {mark?.midi === midi && <text x={cx} y={cy - 74} textAnchor="middle" fontFamily={sans} fontSize={40} fontWeight={700} fill={C.gold}>{mark.text}</text>}
          </g>
        );
      })}
    </svg>
  );
};

const HEADLINES: Record<string, React.ReactNode> = {
  box: <>Minor {gold("pentatonic")}</>, notes: <>Five {gold("notes")}</>, why: <>Nothing {gold("clashes")}</>, lick: <>Try {gold("this")}</>,
};

/** Reel 13: the box behind countless solos. 9:16, about 30 seconds. */
export const PentatonicReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const cue = (k: number) => tl.cue(id, k);
  const lickGlow = (start: number) => Object.fromEntries(LICK.map((m, k) => [m, pulse(f, start + k * STEP)]));
  const glow: Record<number, number> =
    id === "hook" ? lickGlow(2) :
    id === "notes" ? Object.fromEntries(BOX.map(([, , name, midi]) => [midi, NOTES.findIndex((n) => n === name) >= 0 && f >= cue(NOTES.indexOf(name)) ? pulse(f, cue(NOTES.indexOf(name))) : 0])) :
    id === "lick" ? { 62: f >= cue(1) ? Math.max(0.6, pulse(f, cue(1))) : 0 } : {};
  const show = id === "box" ? Math.floor(interpolate(f, [4, 40], [0, 12], LINEAR)) : 12;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, color: C.text, fontFamily: sans }}>
      <Backdrop frame={frame} />
      {id === "hook" && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 260, textAlign: "center", fontFamily: serif, fontSize: 110, lineHeight: 1.05, opacity: fade(f, len, 1) }}>
          <span style={{ color: C.gold }}>1 box</span>,<br />countless solos
        </div>
      )}
      {["hook", "box", "notes", "why", "lick"].includes(id) && (
        <div style={{ opacity: id === "hook" ? 1 : fade(f, len, 6, 4) }}>
          <ScaleBox glow={glow} show={show} mark={id === "lick" ? { midi: 62, text: "bend ↑ E" } : undefined} />
        </div>
      )}
      {id === "why" && f >= cue(1) && <div style={{ position: "absolute", left: 0, right: 0, top: 1296, textAlign: "center", fontSize: 44, fontWeight: 600, ...lift(f, cue(1), 30) }}>Over a blues in A: {gold("all five fit")}</div>}
      {id === "close" && <Close f={f} voice={tl.voice("close")} />}

      {HEADLINES[id] && <Headline f={f} len={len}>{HEADLINES[id]}</Headline>}
      <Caption text={script[tl.index(id)].show} f={f} len={len} />

      <Bed total={tl.total} quiet={[[0, tl.start("close")]]} />
      <Voices tl={tl} dir="vertical/pentatonic" />
      {LICK.map((m, k) => <Hit key={`h${k}`} at={2 + k * STEP} midis={[m]} volume={0.4} />)}
      {NOTE_MIDIS.map((m, k) => <Hit key={`n${k}`} at={tl.start("notes") + tl.cue("notes", k)} midis={[m]} volume={0.42} />)}
      <Hit at={tl.start("lick") + tl.cue("lick", 1)} midis={[62]} volume={0.42} />
      <Hit at={tl.start("lick") + tl.voice("lick") + 4} midis={[62]} volume={0.4} />
      <Hit at={tl.start("lick") + tl.voice("lick") + 14} midis={[64]} volume={0.42} />
      <Hit at={tl.start("lick") + tl.voice("lick") + 30} midis={[57]} volume={0.4} />
    </AbsoluteFill>
  );
};
