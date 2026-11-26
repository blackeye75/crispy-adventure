import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, LINEAR, Mark, sans, serif } from "../../theme";
import { fade, Hit, timeline, Voices, Bed } from "../kit";
import script from "./script.json";
import timing from "./timing.json";

// Why frets get closer together: equal temperament on a string. A printed-plate look in a night palette:
// midnight blue, ivory ink, one coral signal colour. Fret positions are computed, not drawn by hand.
const tl = timeline(script, timing, { hook: 20, octave: 20, twelve: 46, close: 45 });
export const FRETS_FRAMES = tl.total;

const P = { bg: "#0f1722", ink: "#ece6d8", mid: "#8b97a6", rule: "#2b3a4c", faint: "#1b2735", signal: "#f0864f" };
const M = 72;
const EXPO = { ...LINEAR, easing: Easing.bezier(0.16, 1, 0.3, 1) };
const SCALE_MM = 648; // a 25.5-inch scale length
/** Distance from the nut to fret n, as a fraction of the string: 1 − 2^(−n/12). */
const at = (n: number) => 1 - 2 ** (-n / 12);
const mm = (n: number) => SCALE_MM * at(n);
const gap = (n: number) => mm(n + 1) - mm(n);
const BOX = { x: M, y: 600, w: 1080 - 2 * M, h: 420 };
const NUT = BOX.x + 40, BRIDGE = BOX.x + BOX.w - 40, LEN = BRIDGE - NUT;
const fx = (n: number) => NUT + LEN * at(n);
const STRING_Y = [690, 730, 770, 810, 850, 890];

const label: CSSProperties = { fontFamily: sans, fontSize: 24, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: P.mid };

const Reveal = ({ f, at: start, children, style }: { f: number; at: number; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ overflow: "hidden", paddingBottom: "0.16em", paddingRight: "0.1em", ...style }}>
    <div style={{ translate: `0px ${interpolate(f, [start, start + 18], [105, 0], EXPO)}%` }}>{children}</div>
  </div>
);

type Plate = { fig: string; kicker: string; title: string; sub: string; readouts?: [string, string][] };
const PLATES: Record<string, Plate> = {
  hook: { fig: "00", kicker: "On the fretboard", title: "Fret spacing", sub: "Why the gaps shrink." },
  octave: { fig: "01", kicker: "The octave", title: "Half the string", sub: "Twice the frequency.", readouts: [["Open A", "110 Hz"], ["Fret 12", "220 Hz"], ["Length", `${mm(12).toFixed(0)} of ${SCALE_MM} mm`]] },
  twelve: { fig: "02", kicker: "Equal steps", title: "Twelve frets", sub: "The same fraction every time.", readouts: [["Each fret keeps", (2 ** (-1 / 12)).toFixed(4)], ["So it takes off", `${(100 * (1 - 2 ** (-1 / 12))).toFixed(1)} %`], ["Twelve of them", "× 0.5"]] },
  closer: { fig: "03", kicker: "The result", title: "Closer together", sub: "Same percentage, shorter string.", readouts: [["Nut → fret 1", `${gap(0).toFixed(1)} mm`], ["Fret 11 → 12", `${gap(11).toFixed(1)} mm`], ["Fret 19 → 20", `${gap(19).toFixed(1)} mm`]] },
  rule: { fig: "04", kicker: "Luthiers' shortcut", title: "Rule of 18", sub: "Remaining length ÷ 17.817.", readouts: [["Rule of thumb", "÷ 18"], ["Exact divisor", "÷ 17.817"], ["Scale length", `${SCALE_MM} mm`]] },
};

/** The neck as a measured drawing: nut, frets 1–20 placed by the formula, the bridge, six strings. */
const Neck = ({ f, frets, highlight, dims }: { f: number; frets: number; highlight?: number; dims?: number[] }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
    <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} fill="none" stroke={P.rule} strokeWidth={2} />
    {Array.from({ length: 17 }, (_, k) => <line key={`g${k}`} x1={BOX.x + (k + 1) * 52} x2={BOX.x + (k + 1) * 52} y1={BOX.y} y2={BOX.y + BOX.h} stroke={P.faint} strokeWidth={1.5} />)}
    <text x={BOX.x + 18} y={BOX.y + 38} fill={P.mid} style={{ fontFamily: sans, fontSize: 22, fontWeight: 600, letterSpacing: 3 }}>FIG. — A {SCALE_MM} MM STRING, NUT TO BRIDGE</text>
    <rect x={NUT - 6} y={STRING_Y[0] - 14} width={12} height={STRING_Y[5] - STRING_Y[0] + 28} fill={P.ink} />
    <rect x={BRIDGE - 4} y={STRING_Y[0] - 14} width={8} height={STRING_Y[5] - STRING_Y[0] + 28} fill={P.mid} />
    <text x={NUT} y={STRING_Y[5] + 60} textAnchor="middle" fill={P.mid} style={{ fontFamily: sans, fontSize: 20, fontWeight: 600, letterSpacing: 2 }}>NUT</text>
    <text x={BRIDGE} y={STRING_Y[5] + 60} textAnchor="middle" fill={P.mid} style={{ fontFamily: sans, fontSize: 20, fontWeight: 600, letterSpacing: 2 }}>BRIDGE</text>
    {Array.from({ length: frets }, (_, k) => {
      const n = k + 1, x = fx(n), lit = highlight === n;
      return (
        <g key={n} opacity={interpolate(f, [k * 1.5, k * 1.5 + 6], [0, 1], LINEAR)}>
          <line x1={x} x2={x} y1={STRING_Y[0] - 14} y2={STRING_Y[5] + 14} stroke={lit ? P.signal : P.ink} strokeWidth={lit ? 5 : 2.5} opacity={lit ? 1 : 0.75} />
          {(n <= 12 || n % 2 === 0) && <text x={x} y={STRING_Y[0] - 28} textAnchor="middle" fill={lit ? P.signal : P.mid} style={{ fontFamily: sans, fontSize: n > 12 ? 16 : 20, fontWeight: 600 }}>{n}</text>}
        </g>
      );
    })}
    {STRING_Y.map((y, s) => <line key={s} x1={NUT} x2={BRIDGE} y1={y} y2={y} stroke={P.ink} strokeWidth={1.2 + (5 - s) * 0.35} opacity={0.55} />)}
    {highlight === 12 && (
      <g opacity={interpolate(f, [tl.cue("octave", 1), tl.cue("octave", 1) + 10], [0, 1], LINEAR)}>
        <line x1={NUT} x2={fx(12)} y1={940} y2={940} stroke={P.signal} strokeWidth={2} />
        <line x1={fx(12)} x2={BRIDGE} y1={940} y2={940} stroke={P.signal} strokeWidth={2} strokeDasharray="8 8" />
        <text x={(NUT + fx(12)) / 2} y={975} textAnchor="middle" fill={P.signal} style={{ fontFamily: serif, fontStyle: "italic", fontSize: 36 }}>½</text>
        <text x={(fx(12) + BRIDGE) / 2} y={975} textAnchor="middle" fill={P.signal} style={{ fontFamily: serif, fontStyle: "italic", fontSize: 36 }}>½</text>
      </g>
    )}
    {dims?.map((n) => (
      <g key={`d${n}`}>
        <line x1={fx(n)} x2={fx(n + 1)} y1={930} y2={930} stroke={P.signal} strokeWidth={3} />
        <line x1={fx(n)} x2={fx(n)} y1={918} y2={942} stroke={P.signal} strokeWidth={2} />
        <line x1={fx(n + 1)} x2={fx(n + 1)} y1={918} y2={942} stroke={P.signal} strokeWidth={2} />
        <text x={(fx(n) + fx(n + 1)) / 2} y={972} textAnchor="middle" fill={P.signal} style={{ fontFamily: sans, fontSize: 22, fontWeight: 600 }}>{gap(n).toFixed(1)}</text>
      </g>
    ))}
  </svg>
);

/** Reel 16: why frets get closer together. Night palette, 9:16, about 40 seconds. */
export const FretsReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const plate = PLATES[id];
  const text = script[tl.index(id)].show;
  const neck =
    id === "hook" ? <Neck f={f} frets={20} /> :
    id === "octave" ? <Neck f={99} frets={20} highlight={12} /> :
    id === "twelve" ? <Neck f={99} frets={20} highlight={Math.min(12, Math.max(1, Math.floor((f - tl.voice("twelve")) / 3) + 1))} /> :
    id === "closer" ? <Neck f={99} frets={20} dims={f >= tl.cue("closer", 1) ? [0, 11, 19] : [0]} /> :
    id === "rule" ? <Neck f={99} frets={20} dims={[0]} /> : null;

  return (
    <AbsoluteFill style={{ backgroundColor: P.bg, color: P.ink, fontFamily: sans }}>
      {/* running header and footer */}
      <div style={{ ...label, position: "absolute", left: M, top: 192 }}>Fretkey — On the fretboard</div>
      <div style={{ ...label, position: "absolute", right: M, top: 192, color: P.ink }}>{plate ? `Fig. ${plate.fig} / 04` : "End"}</div>
      <div style={{ position: "absolute", left: M, right: M, top: 234, height: 2, backgroundColor: P.rule }} />
      <div style={{ position: "absolute", left: M, right: M, top: 234, height: 2, backgroundColor: P.ink, scale: `${interpolate(f, [0, 26], [0, 1], EXPO)} 1`, transformOrigin: "0 0" }} />
      <div style={{ position: "absolute", left: M, right: M, top: 1500, height: 2, backgroundColor: P.rule }} />
      <div style={{ position: "absolute", left: M, top: 1499, height: 4, width: ((1080 - 2 * M) * frame) / tl.total, backgroundColor: P.signal }} />
      <div style={{ ...label, position: "absolute", right: M, top: 1516 }}>{`0:${String(Math.floor(frame / FPS)).padStart(2, "0")} / 0:${Math.round(tl.total / FPS)}`}</div>

      <AbsoluteFill style={{ opacity: fade(f, len, 1, 6) }}>
        {plate && (
          <>
            <Reveal f={f} at={2} style={{ ...label, position: "absolute", left: M, top: 276 }}>{`${plate.fig} — ${plate.kicker}`}</Reveal>
            <Reveal f={f} at={6} style={{ position: "absolute", left: M, top: 312, fontSize: 124, fontWeight: 600, letterSpacing: -6, lineHeight: 1.04 }}>{plate.title}</Reveal>
            <Reveal f={f} at={12} style={{ position: "absolute", left: M, top: 452, fontFamily: serif, fontStyle: "italic", fontSize: 52, color: P.mid }}>{plate.sub}</Reveal>
          </>
        )}
        {neck}
        {plate?.readouts && (
          <div style={{ position: "absolute", left: M, right: M, top: BOX.y + BOX.h + 22, display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {plate.readouts.map(([k, v], i) => (
              <div key={k} style={{ borderLeft: i ? `2px solid ${P.rule}` : undefined, paddingLeft: i ? 20 : 0 }}>
                <Reveal f={f} at={14 + i * 4} style={{ ...label, fontSize: 20 }}>{k}</Reveal>
                <Reveal f={f} at={17 + i * 4} style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>{v}</Reveal>
              </div>
            ))}
          </div>
        )}
        {id === "close" && (
          <>
            <div style={{ position: "absolute", left: M, top: 420, width: 190, height: 190, borderRadius: 44, backgroundColor: "#1c2836", display: "flex", alignItems: "center", justifyContent: "center", opacity: interpolate(f, [0, 8], [0, 1], LINEAR) }}>
              <Mark height={120} at={4} />
            </div>
            <Reveal f={f} at={14} style={{ position: "absolute", left: M - 4, top: 650, fontSize: 170, fontWeight: 600, letterSpacing: -8, lineHeight: 1.04 }}>Fretkey</Reveal>
            <Reveal f={f} at={22} style={{ position: "absolute", left: M, top: 840, fontFamily: serif, fontStyle: "italic", fontSize: 60, color: P.mid }}>Music is maths you can feel.</Reveal>
            <Reveal f={f} at={tl.cue("close", 1)} style={{ position: "absolute", left: M, top: 1000 }}>
              <div style={{ display: "inline-block", backgroundColor: P.signal, color: P.bg, fontSize: 48, fontWeight: 600, padding: "22px 46px", borderRadius: 999 }}>Follow @fret.key →</div>
            </Reveal>
          </>
        )}
      </AbsoluteFill>

      <div style={{ position: "absolute", left: M, right: M, top: 1336, fontSize: 44, lineHeight: 1.3, fontWeight: 500, opacity: fade(f, len, 6, 4) }}>
        {text.split("*").map((part, i) => <span key={i} style={i % 2 ? { color: P.signal } : undefined}>{part}</span>)}
      </div>

      <Bed total={tl.total} quiet={[[0, tl.start("close")]]} />
      <Voices tl={tl} dir="vertical/frets" />
      <Hit at={2} midis={[45]} volume={0.4} />
      <Hit at={22} midis={[57]} volume={0.4} />
      <Hit at={tl.start("octave") + tl.cue("octave", 1)} midis={[45]} volume={0.42} />
      <Hit at={tl.start("octave") + tl.cue("octave", 2)} midis={[57]} volume={0.42} />
      {Array.from({ length: 13 }, (_, k) => <Hit key={`c${k}`} at={tl.start("twelve") + tl.voice("twelve") + k * 3 - 3} midis={[45 + k]} volume={0.34} />)}
    </AbsoluteFill>
  );
};

/** Cover in the night palette: the question, and the measured neck. Content stays inside the profile-grid crop. */
export const FretsCover = () => (
  <AbsoluteFill style={{ backgroundColor: P.bg, color: P.ink, fontFamily: sans }}>
    <div style={{ ...label, position: "absolute", left: M, top: 300 }}>Fretkey — On the fretboard</div>
    <div style={{ ...label, position: "absolute", right: M, top: 300, color: P.ink }}>Fig. 00 – 04</div>
    <div style={{ position: "absolute", left: M, right: M, top: 342, height: 2, backgroundColor: P.ink }} />
    <div style={{ position: "absolute", left: M, top: 380, fontSize: 96, fontWeight: 600, letterSpacing: -4, lineHeight: 1.05 }}>Why do frets get</div>
    <div style={{ position: "absolute", left: M - 4, top: 480, fontFamily: serif, fontStyle: "italic", fontSize: 110, lineHeight: 1.1, color: P.signal, whiteSpace: "nowrap" }}>closer together?</div>
    <div style={{ position: "absolute", left: 0, top: 160, width: 1080, height: 1920 }}><Neck f={99} frets={20} dims={[0, 11, 19]} /></div>
    <div style={{ ...label, position: "absolute", left: M, top: 1220 }}>Every fret takes 5.6% off the string</div>
  </AbsoluteFill>
);
