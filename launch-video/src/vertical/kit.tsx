// Building blocks for the narrated 9:16 lesson reels. Each reel has a script.json (its words) and a timing.json
// (written by scripts/make-reel-voice.py), and decides what to show for each line, found by the line's id.
import { Audio } from "@remotion/media";
import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile } from "remotion";
import { C, FPS, LINEAR, Mark, OUT, sans, serif } from "../theme";

export type Line = { id: string; show: string };
export type Timing = { seconds: number; onsets: number[] };

const PAD = 6; // frames of breath between lines

/** When every line starts and how long it lasts, in frames. `after` holds extra frames after some lines, by id. */
export function timeline(script: Line[], timing: Timing[], after: Record<string, number> = {}) {
  const lengths = timing.map((t, i) => Math.ceil(t.seconds * FPS) + PAD + (after[script[i].id] ?? 0));
  const starts = lengths.reduce<number[]>((all, _, i) => [...all, i ? all[i - 1] + lengths[i - 1] : 0], []);
  const index = (id: string) => {
    const i = script.findIndex((l) => l.id === id);
    if (i < 0) throw new Error(`No line with id "${id}"`);
    return i;
  };
  return {
    starts, lengths, total: starts[starts.length - 1] + lengths[lengths.length - 1], index,
    /** The line playing at a frame: its id, the frame inside it, and its length. */
    at(frame: number) {
      const i = Math.max(0, starts.filter((s) => s <= frame).length - 1);
      return { i, id: script[i].id, f: frame - starts[i], len: lengths[i] };
    },
    /** Frames from the start of a line to the start of its k-th spoken part. */
    cue: (id: string, k: number) => Math.round(timing[index(id)].onsets[k] * FPS),
    /** Frames the voice of a line lasts. */
    voice: (id: string) => Math.ceil(timing[index(id)].seconds * FPS),
    /** Frame, from the start of the reel, when a line starts. */
    start: (id: string) => starts[index(id)],
  };
}
export type Timeline = ReturnType<typeof timeline>;

export const fade = (f: number, len: number, inFrames = 10, outFrames = 6) => interpolate(f, [0, inFrames, len - outFrames, len], [0, 1, 1, 0], LINEAR);
export const lift = (f: number, at = 0, distance = 50) => ({ opacity: interpolate(f, [at, at + 12], [0, 1], LINEAR), translate: `0px ${interpolate(f, [at, at + 22], [distance, 0], OUT)}px` });
/** A flash when something happens at `start`, settling to a light tint. */
export const pulse = (f: number, start: number) => (f < start ? 0 : interpolate(f - start, [0, 3, 16], [0, 1, 0.22], LINEAR));
/** A colour between two, by amount 0 to 1: solid paint, never see-through, so a lit key cannot turn muddy. */
export const mix = (from: number[], to: number[], amount: number) => `rgb(${from.map((c, i) => Math.round(c + (to[i] - c) * amount)).join(",")})`;
export const gold = (text: ReactNode) => <span style={{ color: C.gold }}>{text}</span>;

/** The dark stage with a slow, drifting warm light, opening from black. */
export const Backdrop = ({ frame }: { frame: number }) => (
  <>
    <AbsoluteFill style={{ background: `radial-gradient(900px 1100px at ${50 + Math.sin(frame / 90) * 12}% ${45 + Math.cos(frame / 120) * 8}%, rgba(236,178,63,0.17), transparent 70%)` }} />
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(frame, [0, 24], [1, 0], LINEAR) }} />
  </>
);

/** The headline of the moment, at the top. */
export const Headline = ({ children, f, len }: { children: ReactNode; f: number; len: number }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 270, textAlign: "center", fontFamily: serif, fontSize: 104, lineHeight: 1.05, opacity: fade(f, len, 10, 4), translate: `0px ${interpolate(f, [0, 18], [30, 0], OUT)}px` }}>{children}</div>
);

/** The spoken line as a caption, for viewers with the sound off; *starred* words turn gold. Clear of Instagram's own buttons. */
export const Caption = ({ text, f, len }: { text: string; f: number; len: number }) => (
  <div style={{ position: "absolute", left: 70, right: 70, top: 1370, textAlign: "center", fontFamily: sans, fontSize: 48, lineHeight: 1.28, fontWeight: 500, opacity: fade(f, len, 6, 4) }}>
    {text.split("*").map((part, i) => <span key={i} style={{ color: i % 2 ? C.gold : undefined }}>{part}</span>)}
  </div>
);

/** Every line's recording, each at its start. */
export const Voices = ({ tl, dir }: { tl: Timeline; dir: string }) => (
  <>
    {tl.starts.map((s, i) => (
      <Sequence key={i} from={s} durationInFrames={tl.lengths[i]} layout="none">
        <Audio src={staticFile(`${dir}/vo-${i + 1}.wav`)} volume={0.8} /> {/* headroom for chords struck under the voice */}
      </Sequence>
    ))}
  </>
);

/** Notes struck together at a frame (public/notes holds E2 to G5, MIDI 40 to 79). */
export const Hit = ({ at, midis, volume = 0.4 }: { at: number; midis: number[]; volume?: number }) => (
  <Sequence from={at} durationInFrames={48} layout="none">
    {midis.map((m) => <Audio key={m} src={staticFile(`notes/${m}.wav`)} volume={volume / Math.sqrt(midis.length)} />)}
  </Sequence>
);

/** A quiet bed of music under the voice, dropping away during `quiet` frame ranges where the notes need the space. */
export const Bed = ({ total, quiet }: { total: number; quiet: [number, number][] }) => (
  <Audio
    src={staticFile("focus.wav")}
    trimBefore={6 * FPS}
    volume={(v) => {
      const duck = Math.min(1, ...quiet.map(([a, b]) => interpolate(v, [a - 12, a, b, b + 12], [1, 0.15, 0.15, 1], LINEAR)));
      return 0.1 * interpolate(v, [0, 30, total - 45, total], [0, 1, 1, 0], LINEAR) * duck;
    }}
  />
);

// ---- the piano ----------------------------------------------------------------------------------------------------------
const isBlack = (m: number) => [1, 3, 6, 8, 10].includes(m % 12);
type PianoProps = { from: number; to: number; lit?: Record<number, number>; labels?: Record<number, string>; badges?: Record<number, string>; marks?: Record<number, string>; top?: number; enter?: number };

/** A keyboard from MIDI `from` to `to` (both white keys), fitted to the width of the frame. */
export const Piano = ({ from, to, lit = {}, labels = {}, badges = {}, marks = {}, top = 700, enter = 1 }: PianoProps) => {
  const whites = Array.from({ length: to - from + 1 }, (_, i) => from + i).filter((m) => !isBlack(m));
  const W = 960 / whites.length, H = 560, BW = W * 0.6, BH = 340;
  const xOf = (m: number) => (isBlack(m) ? whites.indexOf(m - 1) * W + W - BW / 2 : whites.indexOf(m) * W);
  const blacks = Array.from({ length: to - from + 1 }, (_, i) => from + i).filter(isBlack);
  const label = (m: number, y: number, dark: boolean, size: number) => labels[m] && <text x={xOf(m) + (isBlack(m) ? BW : W) / 2} y={y} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={size} fill={dark ? C.bg : C.text}>{labels[m]}</text>;
  return (
    <svg width={960} height={H} style={{ position: "absolute", left: 60, top, overflow: "visible", opacity: enter, translate: `0px ${(1 - enter) * 120}px` }}>
      {whites.map((m) => (
        <g key={m}>
          <rect x={xOf(m) + 3} y={0} width={W - 6} height={H} rx={14} fill={mix([243, 239, 230], [236, 178, 63], lit[m] ?? 0)} style={{ filter: (lit[m] ?? 0) > 0.5 ? "drop-shadow(0 0 30px rgba(236,178,63,0.8))" : undefined }} />
          {label(m, H - 40, true, Math.min(54, W * 0.5))}
        </g>
      ))}
      {blacks.map((m) => (
        <g key={m}>
          <rect x={xOf(m)} y={0} width={BW} height={BH} rx={8} fill={mix([23, 20, 15], [236, 178, 63], lit[m] ?? 0)} stroke="#3a372f" strokeWidth={2} />
          {label(m, BH - 30, (lit[m] ?? 0) > 0.5, Math.min(38, BW * 0.66))}
        </g>
      ))}
      {Object.entries(badges).map(([m, text]) => (
        <g key={`b${m}`}>
          <circle cx={xOf(+m) + (isBlack(+m) ? BW : W) / 2} cy={-50} r={30} fill={C.gold} />
          <text x={xOf(+m) + (isBlack(+m) ? BW : W) / 2} y={-39} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={32} fill={C.bg}>{text}</text>
        </g>
      ))}
      {Object.entries(marks).map(([m, text]) => (
        <text key={`m${m}`} x={xOf(+m) + W / 2} y={-34} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={36} fill={C.gold}>{text}</text>
      ))}
    </svg>
  );
};

// ---- a guitar chord box -----------------------------------------------------------------------------------------------------
/**
 * A chord box: six strings, four frets. `frets` runs from string 6 to string 1, "x" for not played, and uses
 * "-" between values above fret 9 ("7-9-9-8-7-7"). `fading` is a fret that is lifting off. `base` is the fret the box
 * starts at, labelled beside it (no nut is drawn above fret 1).
 */
export const ChordBox = ({ frets, name, x, y, fading, base = 1 }: { frets: string; name: string; x: number; y: number; fading?: { string: number; amount: number }; base?: number }) => {
  const S = 100, F = 120;
  const values = frets.includes("-") ? frets.split("-") : [...frets];
  return (
    <svg width={S * 5 + 120} height={F * 4 + 200} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      <text x={S * 2.5} y={4} textAnchor="middle" fontFamily={serif} fontSize={72} fontWeight={600} fill={C.text}>{name}</text>
      <rect x={0} y={90} width={S * 5} height={base > 1 ? 4 : 12} fill={C.text} />
      {base > 1 && <text x={-56} y={90 + F * 0.5 + 14} textAnchor="end" fontFamily={sans} fontSize={40} fontWeight={600} fill={C.muted}>{base}fr</text>}
      {Array.from({ length: 6 }, (_, s) => <rect key={`s${s}`} x={s * S - 2} y={90} width={4} height={F * 4} fill="#a99f8d" />)}
      {Array.from({ length: 4 }, (_, f) => <rect key={`f${f}`} x={0} y={90 + (f + 1) * F - 2} width={S * 5} height={4} fill="#6b6455" />)}
      {values.map((fret, s) => {
        if (fret === "x") return <text key={s} x={s * S} y={70} textAnchor="middle" fontFamily={sans} fontSize={40} fill={C.muted}>×</text>;
        if (fret === "0") return <circle key={s} cx={s * S} cy={58} r={16} fill="none" stroke={C.text} strokeWidth={4} />;
        const gone = fading?.string === s ? fading.amount : 0;
        return (
          <g key={s}>
            <circle cx={s * S} cy={90 + (+fret - base + 0.5) * F} r={36} fill={C.gold} opacity={1 - gone} style={{ translate: `0px ${-gone * 40}px` }} />
            {gone > 0 && <circle cx={s * S} cy={58} r={16} fill="none" stroke={C.gold} strokeWidth={4} opacity={gone} />}
          </g>
        );
      })}
    </svg>
  );
};

// ---- shared closing cards ---------------------------------------------------------------------------------------------------
export const BigText = ({ f, len, children, small }: { f: number; len: number; children: ReactNode; small?: ReactNode }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len) }}>
    {small && <div style={{ ...lift(f, 0), fontFamily: sans, fontSize: 50, color: C.muted, textAlign: "center", width: 860, lineHeight: 1.3 }}>{small}</div>}
    <div style={{ ...lift(f, 6, 70), fontFamily: serif, fontSize: 150, fontWeight: 600, lineHeight: 1.05, textAlign: "center", width: 960, marginTop: small ? 40 : 0 }}>{children}</div>
  </AbsoluteFill>
);

export const Lessons = ({ f, len, voice, note, to = 250 }: { f: number; len: number; voice: number; note: ReactNode; to?: number }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len) }}>
    <div style={{ fontFamily: serif, fontSize: 330, fontWeight: 600, color: C.gold, lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: "0 0 100px rgba(236,178,63,0.35)" }}>
      {Math.round(interpolate(f, [0, 0.55 * voice], [0, to], { ...LINEAR, easing: Easing.out(Easing.cubic) }))}+
    </div>
    <div style={{ ...lift(f, 10), fontFamily: serif, fontSize: 96 }}>lessons</div>
    <div style={{ ...lift(f, 0.5 * voice), fontFamily: sans, fontSize: 44, color: C.muted, marginTop: 30 }}>{note}</div>
  </AbsoluteFill>
);

export const Close = ({ f, voice }: { f: number; voice: number }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 320, opacity: interpolate(f, [0, 10], [0, 1], LINEAR) }}>
    <Mark height={200} at={2} />
    <div style={{ ...lift(f, 22), fontFamily: serif, fontSize: 150, fontWeight: 600, marginTop: 30, letterSpacing: -3 }}>
      Fret<span style={{ color: C.gold }}>key</span>
    </div>
    <div style={{ ...lift(f, 34), fontFamily: sans, fontSize: 56, color: C.muted, marginTop: 8 }}>is almost here.</div>
    <div style={{ ...lift(f, 0.45 * voice), fontFamily: sans, marginTop: 56, fontSize: 52, fontWeight: 600, color: C.bg, backgroundColor: C.gold, padding: "20px 56px", borderRadius: 60 }}>Follow @fret.key</div>
    <div style={{ ...lift(f, 0.7 * voice), fontFamily: sans, fontSize: 40, color: C.text, marginTop: 26 }}>Be among the first to play.</div>
  </AbsoluteFill>
);
