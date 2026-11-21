import type { ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LINEAR, Mark, OUT, sans } from "../../theme";
import { Bed, fade, Hit, lift, pulse, timeline, Voices } from "../kit";
import script from "./script.json";
import timing from "./timing.json";

// "This is what harmony looks like": two notes drawn as a Lissajous figure. Its own neon look, apart from the warm brand reels.
export const tl = timeline(script, timing, { hook: 45, octave: 24, fifth: 24, tritone: 24, guitar: 20, close: 50 });
export const HARMONY_FRAMES = tl.total;

const N = { bg: "#05060c", cyan: "#35e6ff", violet: "#7c5cff", magenta: "#ff3dc8", hot: "#ff4d5e", text: "#eef3ff", muted: "#8a90b0", line: "#1d2140" };
const GRAD = `linear-gradient(90deg, ${N.cyan}, ${N.violet} 50%, ${N.magenta})`;
const CY = 860, R = 290;

const CHAPTERS: Record<string, [string, string]> = {
  wave: ["01 · one note", "Vibration"], combine: ["02 · two notes", "Combine"], octave: ["03 · C + C", "Octave"], fifth: ["04 · C + G", "Fifth"],
  tritone: ["05 · C + F♯", "Tritone"], rule: ["06 · the rule", "Ratios"], guitar: ["07 · on guitar", "Power chord"],
};

/** Path of a Lissajous figure: x moves at speed a, y at speed b. Whole-number ratios close into a clean shape; others tangle. */
export function lissajous(a: number, b: number, delta: number, turns: number, r: number, cx: number, cy: number) {
  const pts = Math.round(500 * turns);
  let d = "";
  for (let i = 0; i <= pts; i++) {
    const t = (i / pts) * turns * 2 * Math.PI;
    d += `${i ? "L" : "M"}${(cx + r * Math.sin(a * t + delta)).toFixed(1)} ${(cy + r * Math.sin(b * t)).toFixed(1)}`;
  }
  return d;
}

/** A glowing stroke: a wide blurred copy under a crisp one, drawn up to `progress`. */
const Glow = ({ d, stroke, width = 6, progress = 1, opacity = 1 }: { d: string; stroke: string; width?: number; progress?: number; opacity?: number }) => (
  <g opacity={opacity} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={stroke} strokeWidth={width * 5} opacity={0.22} filter="url(#blur)" pathLength={1} strokeDasharray={`${progress} 1`} />
    <path d={d} stroke={stroke} strokeWidth={width} pathLength={1} strokeDasharray={`${progress} 1`} />
  </g>
);

/** Full-frame SVG with the shared gradients and blur. */
const Layer = ({ children }: { children: ReactNode }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="cool" gradientUnits="userSpaceOnUse" x1={200} y1={0} x2={880} y2={0}><stop offset="0" stopColor={N.cyan} /><stop offset="0.5" stopColor={N.violet} /><stop offset="1" stopColor={N.magenta} /></linearGradient>
      <linearGradient id="hot" gradientUnits="userSpaceOnUse" x1={200} y1={0} x2={880} y2={0}><stop offset="0" stopColor={N.magenta} /><stop offset="1" stopColor={N.hot} /></linearGradient>
      <filter id="blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={14} /></filter>
    </defs>
    {children}
  </svg>
);

const wave = (cy: number, amp: number, y: (x: number) => number, x0 = 70, x1 = 1010) => {
  let d = "";
  for (let x = x0; x <= x1; x += 4) d += `${x === x0 ? "M" : "L"}${x} ${(cy - amp * y(x)).toFixed(1)}`;
  return d;
};

/** Drifting colour orbs over a dot grid; the orbs run hot during the tritone. */
const Backdrop = ({ frame, hot }: { frame: number; hot: number }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${N.line} 2px, transparent 2px)`, backgroundSize: "48px 48px", backgroundPosition: `0px ${-frame * 0.6}px`, opacity: 0.8 }} />
    <div style={{ position: "absolute", width: 1300, height: 1300, left: -460 + 120 * Math.sin(frame / 70), top: 180 + 80 * Math.cos(frame / 90), background: `radial-gradient(closest-side, ${hot > 0.5 ? N.hot : N.cyan}, transparent)`, opacity: 0.2 }} />
    <div style={{ position: "absolute", width: 1300, height: 1300, left: 240 + 110 * Math.cos(frame / 80), top: 700 + 90 * Math.sin(frame / 60), background: `radial-gradient(closest-side, ${N.magenta}, transparent)`, opacity: 0.2 + 0.12 * hot }} />
  </AbsoluteFill>
);

/** Text filled with the neon gradient. */
const Neon = ({ children, size, style }: { children: ReactNode; size: number; style?: React.CSSProperties }) => (
  <span style={{ fontSize: size, fontWeight: 600, letterSpacing: -size * 0.04, backgroundImage: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", ...style }}>{children}</span>
);

/** Chapter title that lands with a red-blue split, like a glitch cut. */
const Chapter = ({ f, len, kicker, title }: { f: number; len: number; kicker: string; title: string }) => {
  const split = interpolate(f, [0, 10], [16, 0], OUT);
  const layer = (color: string, dx: number) => <div style={{ position: "absolute", inset: 0, color, mixBlendMode: "screen", translate: `${dx}px 0px`, opacity: split > 0.5 ? 0.9 : 0 }}>{title}</div>;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 245, textAlign: "center", opacity: fade(f, len, 4, 4) }}>
      <div style={{ ...lift(f, 0, 20), fontSize: 34, fontWeight: 600, letterSpacing: 8, textTransform: "uppercase", color: N.cyan }}>{kicker}</div>
      <div style={{ position: "relative", display: "inline-block", fontSize: 128, fontWeight: 600, letterSpacing: -5, marginTop: 4 }}>
        {layer(N.cyan, -split)}{layer(N.magenta, split)}
        <Neon size={128}>{title}</Neon>
      </div>
    </div>
  );
};

/** A big ratio that punches in. */
const Ratio = ({ f, at, children, color = N.text }: { f: number; at: number; children: ReactNode; color?: string }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 1190, textAlign: "center", fontSize: 120, fontWeight: 600, letterSpacing: -2, color, opacity: interpolate(f, [at, at + 4], [0, 1], LINEAR), scale: String(interpolate(f, [at, at + 10], [1.6, 1], OUT)), textShadow: `0 0 40px ${N.violet}` }}>{children}</div>
);

const Caption = ({ text, f, len }: { text: string; f: number; len: number }) => (
  <div style={{ position: "absolute", left: 70, right: 70, top: 1370, textAlign: "center", fontSize: 46, lineHeight: 1.28, fontWeight: 500, color: N.text, opacity: fade(f, len, 6, 4) }}>
    {text.split("*").map((part, i) => <span key={i} style={{ color: i % 2 ? N.cyan : undefined }}>{part}</span>)}
  </div>
);

/** The fretboard for the power chord: tab view, high E on top. Open E, A string fret 2 (B), D string fret 2 (E). */
const PowerChord = ({ f, at }: { f: number; at: number }) => {
  const sy = (s: number) => 640 + s * 72; // s 0 = high e … 5 = low E
  const fx = (n: number) => 150 + (n - 0.5) * 190;
  const dots: [number, number, string, string][] = [[5, 0, "R", N.magenta], [4, 2, "5", N.cyan], [3, 2, "8", N.cyan]];
  return (
    <Layer>
      <g opacity={interpolate(f, [0, 12], [0, 1], LINEAR)}>
        <rect x={146} y={sy(0) - 6} width={10} height={sy(5) - sy(0) + 12} fill={N.text} rx={4} />
        {[1, 2, 3, 4].map((n) => <line key={n} x1={150 + n * 190} x2={150 + n * 190} y1={sy(0)} y2={sy(5)} stroke={N.line} strokeWidth={5} />)}
        {[0, 1, 2, 3, 4, 5].map((s) => <line key={s} x1={150} x2={1000} y1={sy(s)} y2={sy(s)} stroke={N.muted} strokeWidth={2 + s * 0.6} opacity={0.7} />)}
      </g>
      {dots.map(([s, fret, label, color], k) => {
        const t = at + k * 9, x = fret ? fx(fret) : 95;
        return (
          <g key={k} opacity={interpolate(f, [t, t + 4], [0, 1], LINEAR)} style={{ scale: String(interpolate(f, [t, t + 10], [1.8, 1], OUT)), transformOrigin: `${x}px ${sy(s)}px` }}>
            <circle cx={x} cy={sy(s)} r={52} fill={color} opacity={0.25 + 0.5 * pulse(f, t)} filter="url(#blur)" />
            <circle cx={x} cy={sy(s)} r={32} fill={fret ? color : "none"} stroke={color} strokeWidth={6} />
            <text x={x} y={sy(s) + 1} textAnchor="middle" dominantBaseline="central" fill={fret ? N.bg : color} style={{ fontFamily: sans, fontSize: 30, fontWeight: 600 }}>{label}</text>
          </g>
        );
      })}
    </Layer>
  );
};

/** Reel 8: the maths of harmony, drawn. 9:16. */
export const HarmonyReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const cue = (k: number) => tl.cue(id, k);
  const hot = interpolate(frame, [tl.start("tritone"), tl.start("tritone") + 8, tl.start("rule") - 6, tl.start("rule")], [0, 1, 1, 0], LINEAR);
  const punch = interpolate(f, [0, 12], [1.08, 1], OUT); // every cut lands with a small zoom
  const trace = (from: number, frames: number) => interpolate(f, [from, from + frames], [0, 1], { ...OUT });
  const out = fade(f, len, 1, 6);

  return (
    <AbsoluteFill style={{ backgroundColor: N.bg, color: N.text, fontFamily: sans }}>
      <Backdrop frame={frame} hot={hot} />
      <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: (1080 * frame) / tl.total, backgroundImage: GRAD }} />

      <AbsoluteFill style={{ scale: String(punch) }}>
        {id === "hook" && (
          <>
            <Layer><Glow d={lissajous(2, interpolate(f, [0, 60], [2.55, 3], OUT), f * 0.02, 6, 330, 540, 980)} stroke="url(#cool)" width={5} opacity={out} /></Layer>
            <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", opacity: out }}>
              <div style={{ ...lift(f, 0, 30), fontSize: 64, fontWeight: 500 }}>This is what</div>
              <div style={{ ...lift(f, 14, 60), lineHeight: 1 }}><Neon size={190}>harmony</Neon></div>
              <div style={{ ...lift(f, 30, 30), fontSize: 64, fontWeight: 500 }}>looks like.</div>
            </div>
          </>
        )}

        {id === "wave" && (
          <>
            <Layer><Glow d={wave(CY, 130, (x) => Math.sin(x / 26 - f * 0.35) * (f >= cue(1) ? 1 : 0.35 + 0.1 * Math.sin(f / 5)))} stroke={N.cyan} width={6} progress={trace(0, 24)} /></Layer>
            {f >= cue(1) && (
              <div style={{ position: "absolute", left: 0, right: 0, top: 1080, textAlign: "center", ...lift(f, cue(1), 30) }}>
                <Neon size={200} style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round(interpolate(f, [cue(1), cue(1) + 40], [0, 440], OUT))}</Neon>
                <div style={{ fontSize: 40, color: N.muted, letterSpacing: 6, textTransform: "uppercase", marginTop: -10 }}>vibrations per second</div>
              </div>
            )}
          </>
        )}

        {id === "combine" && (
          <Layer>
            <Glow d={wave(640, 70, (x) => Math.sin(x / 34 - f * 0.2))} stroke={N.cyan} width={5} progress={trace(0, 20)} />
            <Glow d={wave(820, 70, (x) => Math.sin(x / 22.7 - f * 0.3))} stroke={N.magenta} width={5} progress={trace(8, 20)} />
            <text x={540} y={745} textAnchor="middle" fill={N.muted} style={{ fontFamily: sans, fontSize: 60, fontWeight: 500 }}>+</text>
            <g opacity={interpolate(f, [cue(1), cue(1) + 8], [0, 1], LINEAR)}>
              <text x={540} y={945} textAnchor="middle" fill={N.muted} style={{ fontFamily: sans, fontSize: 60, fontWeight: 500 }}>=</text>
              <Glow d={wave(1080, 65, (x) => Math.sin(x / 34 - f * 0.2) + Math.sin(x / 22.7 - f * 0.3))} stroke={N.text} width={6} progress={trace(cue(1), 30)} />
            </g>
          </Layer>
        )}

        {id === "octave" && (
          <>
            <Layer><Glow d={lissajous(1, 2, Math.PI / 2 + f * 0.035, 1, R, 540, CY)} stroke="url(#cool)" progress={trace(4, 40)} /></Layer>
            <Ratio f={f} at={cue(2)}>2 : 1</Ratio>
          </>
        )}

        {id === "fifth" && (
          <>
            <Layer><Glow d={lissajous(2, 3, f * 0.03, 1, R, 540, CY)} stroke="url(#cool)" progress={trace(4, 45)} /></Layer>
            <Ratio f={f} at={cue(1)}>3 : 2</Ratio>
          </>
        )}

        {id === "tritone" && (
          <div style={{ position: "absolute", inset: 0, translate: f >= cue(1) ? `${5 * Math.sin(f * 2.3)}px ${4 * Math.cos(f * 3.1)}px` : undefined }}>
            <Layer><Glow d={lissajous(1, Math.SQRT2, f * 0.06, 9, R, 540, CY)} stroke="url(#hot)" width={4} progress={trace(4, 70)} /></Layer>
            <Ratio f={f} at={cue(1)} color={f % 9 < 2 && f > cue(1) + 10 ? N.hot : N.text}>1 : √2</Ratio>
          </div>
        )}

        {id === "rule" && (
          <>
            <Layer>
              <Glow d={lissajous(2, 3, f * 0.03, 1, 170, 290, 800)} stroke="url(#cool)" width={5} progress={trace(0, 30)} opacity={f >= cue(2) ? 0.15 : 1} />
              <Glow d={lissajous(1, Math.SQRT2, f * 0.06, 9, 170, 790, 800)} stroke="url(#hot)" width={3} progress={trace(cue(1), 40)} opacity={f >= cue(2) ? 0.15 : 1} />
            </Layer>
            <div style={{ position: "absolute", left: 120, width: 340, top: 1000, textAlign: "center", fontSize: 40, fontWeight: 600, letterSpacing: 8, color: N.cyan, ...lift(f, 4, 20) }}>SMOOTH</div>
            <div style={{ position: "absolute", left: 620, width: 340, top: 1000, textAlign: "center", fontSize: 40, fontWeight: 600, letterSpacing: 8, color: N.hot, ...lift(f, cue(1), 20) }}>TENSE</div>
            {f >= cue(2) && (
              <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", lineHeight: 1.02, scale: String(interpolate(f, [cue(2), cue(2) + 12], [1.3, 1], OUT)), opacity: interpolate(f, [cue(2), cue(2) + 5], [0, 1], LINEAR) }}>
                <div style={{ fontSize: 110, fontWeight: 600, letterSpacing: -4 }}>Music is maths</div>
                <Neon size={150}>you can feel.</Neon>
              </div>
            )}
          </>
        )}

        {id === "guitar" && (
          <>
            <PowerChord f={f} at={cue(1)} />
            <Ratio f={f} at={cue(2)}>1 : 1.5 : 2</Ratio>
          </>
        )}

        {id === "close" && (
          <>
            <Layer><Glow d={lissajous(2, 3, f * 0.03, 1, 380, 540, 820)} stroke="url(#cool)" width={4} opacity={0.3} /></Layer>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300 }}>
              <Mark height={170} at={2} />
              <div style={{ ...lift(f, 18), fontSize: 150, fontWeight: 600, letterSpacing: -6, marginTop: 24 }}>Fret<Neon size={150}>key</Neon></div>
              <div style={{ ...lift(f, 30), fontSize: 50, color: N.muted }}>the why behind every sound</div>
              <div style={{ ...lift(f, cue(1)), marginTop: 56, fontSize: 52, fontWeight: 600, color: N.bg, backgroundImage: GRAD, padding: "20px 56px", borderRadius: 60 }}>Follow @fret.key</div>
            </AbsoluteFill>
          </>
        )}

        {CHAPTERS[id] && <Chapter f={f} len={len} kicker={CHAPTERS[id][0]} title={CHAPTERS[id][1]} />}
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: "#ffffff", opacity: interpolate(f, [0, 5], [frame > 2 ? 0.22 : 0, 0], LINEAR), pointerEvents: "none" }} />
      <Caption text={script[tl.index(id)].show} f={f} len={len} />

      <HarmonySound />
    </AbsoluteFill>
  );
};

/** The reel's voice, bed and notes, shared by every visual version. */
export const HarmonySound = () => (
  <>
    <Bed total={tl.total} quiet={[[tl.start("wave"), tl.start("guitar") + tl.lengths[tl.index("guitar")]]]} />
    <Voices tl={tl} dir="vertical/harmony" />
    <Hit at={10} midis={[48, 55, 60]} volume={0.3} />
    <Hit at={tl.start("wave") + tl.cue("wave", 1)} midis={[69]} volume={0.4} />
    <Hit at={tl.start("combine") + tl.cue("combine", 1)} midis={[60, 67]} volume={0.4} />
    <Hit at={tl.start("octave") + tl.cue("octave", 1)} midis={[48, 60]} volume={0.4} />
    <Hit at={tl.start("octave") + tl.cue("octave", 3)} midis={[48, 60]} volume={0.35} />
    <Hit at={tl.start("fifth") + tl.cue("fifth", 1)} midis={[60, 67]} volume={0.4} />
    <Hit at={tl.start("fifth") + tl.cue("fifth", 2)} midis={[60, 67]} volume={0.35} />
    <Hit at={tl.start("tritone") + tl.cue("tritone", 1)} midis={[60, 66]} volume={0.4} />
    <Hit at={tl.start("tritone") + tl.cue("tritone", 3)} midis={[60, 66]} volume={0.35} />
    <Hit at={tl.start("rule") + 4} midis={[60, 67]} volume={0.35} />
    <Hit at={tl.start("rule") + tl.cue("rule", 1)} midis={[60, 66]} volume={0.35} />
    <Hit at={tl.start("guitar") + tl.cue("guitar", 1)} midis={[40, 47, 52]} volume={0.45} />
  </>
);
