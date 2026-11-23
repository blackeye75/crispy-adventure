import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, LINEAR, Mark, sans, serif } from "../../theme";
import { fade } from "../kit";
import { HarmonySound, lissajous, tl } from "./HarmonyReel";
import script from "./script.json";

// The harmony reel redrawn as printed scientific plates: paper, ink and one vermilion signal colour. Same words and sound.
const P = { paper: "#ECE7DC", ink: "#161513", mid: "#77736A", rule: "#C9C2B3", faint: "#DDD7CA", signal: "#D9431E" };
const M = 72; // outer margin; everything hangs off this grid
const EXPO = { ...LINEAR, easing: Easing.bezier(0.16, 1, 0.3, 1) };
const BOX = { x: M, y: 560, w: 1080 - 2 * M, h: 640 };
const CX = 540, CY = BOX.y + BOX.h / 2, R = 250;

/** Equal-tempered frequency of a MIDI note, A4 = 440 Hz. */
const hz = (m: number) => 440 * 2 ** ((m - 69) / 12);
const fmt = (m: number) => hz(m).toFixed(1);
const ratio = (lo: number, hi: number) => (hz(hi) / hz(lo)).toFixed(3);

type Plate = { fig: string; kicker: string; title: string; sub: string; ratio?: string; readouts?: [string, string][] };
const PLATES: Record<string, Plate> = {
  wave: { fig: "01", kicker: "Sound", title: "Vibration", sub: "One note, one vibration.", readouts: [["Note", "A4"], ["Frequency", ""], ["Period", `${(1000 / 440).toFixed(2)} ms`]] },
  combine: { fig: "02", kicker: "Sound", title: "Combine", sub: "Two notes, one pattern.", readouts: [["Lower · C4", `${fmt(60)} Hz`], ["Upper · G4", `${fmt(67)} Hz`], ["Ratio", ratio(60, 67)]] },
  octave: { fig: "03", kicker: "Interval", title: "Octave", sub: "Exactly twice as fast.", ratio: "2:1", readouts: [["Lower · C3", `${fmt(48)} Hz`], ["Upper · C4", `${fmt(60)} Hz`], ["Ratio", ratio(48, 60)]] },
  fifth: { fig: "04", kicker: "Interval", title: "Fifth", sub: "Almost exactly three to two.", ratio: "3:2", readouts: [["Lower · C4", `${fmt(60)} Hz`], ["Upper · G4", `${fmt(67)} Hz`], ["Ratio", ratio(60, 67)]] },
  tritone: { fig: "05", kicker: "Interval", title: "Tritone", sub: "No simple ratio at all.", ratio: "1:√2", readouts: [["Lower · C4", `${fmt(60)} Hz`], ["Upper · F♯4", `${fmt(66)} Hz`], ["Ratio", ratio(60, 66)]] },
  rule: { fig: "06", kicker: "Principle", title: "Ratios", sub: "Simple sounds smooth." },
  guitar: { fig: "07", kicker: "On guitar", title: "Power chord", sub: "Root, fifth, octave.", readouts: [["Root · E2", `${fmt(40)} Hz`], ["Fifth · B2", `${fmt(47)} Hz`], ["Octave · E3", `${fmt(52)} Hz`]] },
};

const label: CSSProperties = { fontFamily: sans, fontSize: 24, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: P.mid };

/** Text that rises out of a mask, the editorial way. */
const Reveal = ({ f, at, children, style }: { f: number; at: number; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ overflow: "hidden", paddingBottom: "0.16em", paddingRight: "0.1em", ...style }}> {/* room for italic overhang and descenders */}
    <div style={{ translate: `0px ${interpolate(f, [at, at + 18], [105, 0], EXPO)}%` }}>{children}</div>
  </div>
);

/** Running header and footer: what this is, which figure, how far along. */
const Chrome = ({ frame, f, fig }: { frame: number; f: number; fig: string }) => (
  <>
    <div style={{ ...label, position: "absolute", left: M, top: 192 }}>Fretkey — On harmony</div>
    <div style={{ ...label, position: "absolute", right: M, top: 192, color: P.ink, fontVariantNumeric: "tabular-nums" }}>{fig}</div>
    <div style={{ position: "absolute", left: M, right: M, top: 234, height: 2, backgroundColor: P.rule }} />
    <div style={{ position: "absolute", left: M, right: M, top: 234, height: 2, backgroundColor: P.ink, scale: `${interpolate(f, [0, 26], [0, 1], EXPO)} 1`, transformOrigin: "0 0" }} />
    <div style={{ position: "absolute", left: M, right: M, top: 1500, height: 2, backgroundColor: P.rule }} />
    <div style={{ position: "absolute", left: M, top: 1499, height: 4, width: ((1080 - 2 * M) * frame) / tl.total, backgroundColor: P.signal }} />
    <div style={{ ...label, position: "absolute", right: M, top: 1516, fontVariantNumeric: "tabular-nums" }}>
      {`0:${String(Math.floor(frame / FPS)).padStart(2, "0")}`} / {`0:${Math.round(tl.total / FPS)}`}
    </div>
  </>
);

/** Kicker, title, italic subtitle, and the ratio set against the right margin. */
const Title = ({ f, plate, ratioAt }: { f: number; plate: Plate; ratioAt: number }) => (
  <>
    <Reveal f={f} at={2} style={{ ...label, position: "absolute", left: M, top: 276 }}>{`${plate.fig} — ${plate.kicker}`}</Reveal>
    <Reveal f={f} at={6} style={{ position: "absolute", left: M, top: 312, fontFamily: sans, fontSize: 128, fontWeight: 600, letterSpacing: -6, lineHeight: 1.04, color: P.ink }}>{plate.title}</Reveal>
    <Reveal f={f} at={12} style={{ position: "absolute", left: M, top: 452, fontFamily: serif, fontStyle: "italic", fontSize: 52, color: P.mid }}>{plate.sub}</Reveal>
    {plate.ratio && (
      <Reveal f={f} at={ratioAt} style={{ position: "absolute", right: M, top: 318, fontFamily: serif, fontStyle: "italic", fontSize: plate.ratio.length > 4 ? 84 : 120, lineHeight: 1.1, color: plate.title === "Tritone" ? P.signal : P.ink, textAlign: "right" }}>{plate.ratio}</Reveal>
    )}
  </>
);

/** The figure frame: hairline border, a faint graph-paper grid and corner ticks. */
const Plot = ({ f, x = BOX.x, y = BOX.y, w = BOX.w, h = BOX.h, children, caption }: { f: number; x?: number; y?: number; w?: number; h?: number; children?: ReactNode; caption?: string }) => {
  const draw = interpolate(f, [0, 24], [0, 1], EXPO);
  return (
    <g>
      <g opacity={interpolate(f, [6, 20], [0, 1], LINEAR)} stroke={P.faint} strokeWidth={1.5}>
        {Array.from({ length: Math.floor(w / 52) }, (_, k) => <line key={`v${k}`} x1={x + (k + 1) * 52} x2={x + (k + 1) * 52} y1={y} y2={y + h} />)}
        {Array.from({ length: Math.floor(h / 52) }, (_, k) => <line key={`h${k}`} x1={x} x2={x + w} y1={y + (k + 1) * 52} y2={y + (k + 1) * 52} />)}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={P.ink} strokeWidth={2} pathLength={1} strokeDasharray={`${draw} 1`} />
      {caption && <text x={x + 18} y={y + 38} fill={P.mid} style={{ fontFamily: sans, fontSize: 22, fontWeight: 600, letterSpacing: 3 }}>{caption.toUpperCase()}</text>}
      {children}
    </g>
  );
};

/** Data under the figure, in three columns. */
const Readouts = ({ f, items }: { f: number; items: [string, ReactNode][] }) => (
  <div style={{ position: "absolute", left: M, right: M, top: BOX.y + BOX.h + 22, display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
    {items.map(([k, v], i) => (
      <div key={k} style={{ borderLeft: i ? `2px solid ${P.rule}` : undefined, paddingLeft: i ? 20 : 0 }}>
        <Reveal f={f} at={14 + i * 4} style={{ ...label, fontSize: 20 }}>{k}</Reveal>
        <Reveal f={f} at={17 + i * 4} style={{ fontFamily: sans, fontSize: 40, fontWeight: 600, letterSpacing: -1, color: P.ink, fontVariantNumeric: "tabular-nums" }}>{v}</Reveal>
      </div>
    ))}
  </div>
);

/** A Lissajous figure drawn by a pen tip, with crosshairs running to the frame's edges. */
const Figure = ({ f, a, b, turns, delta, color = P.ink, from = 4, frames = 50, r = R, cx = CX, cy = CY, box = BOX, width = 3.5 }: { f: number; a: number; b: number; turns: number; delta: number; color?: string; from?: number; frames?: number; r?: number; cx?: number; cy?: number; box?: { x: number; y: number; w: number; h: number }; width?: number }) => {
  const p = interpolate(f, [from, from + frames], [0, 1], { ...LINEAR, easing: Easing.inOut(Easing.cubic) });
  const t = p * turns * 2 * Math.PI + Math.max(0, f - from - frames) * 0.05;
  const px = cx + r * Math.sin(a * t + delta), py = cy + r * Math.sin(b * t);
  return (
    <g opacity={f < from ? 0 : 1}>
      <path d={lissajous(a, b, delta, turns, r, cx, cy)} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} />
      <g stroke={P.signal} strokeWidth={1.5} opacity={0.5}>
        <line x1={px} x2={px} y1={box.y} y2={box.y + box.h} />
        <line x1={box.x} x2={box.x + box.w} y1={py} y2={py} />
      </g>
      <circle cx={px} cy={py} r={20} fill="none" stroke={P.signal} strokeWidth={2} />
      <circle cx={px} cy={py} r={8} fill={P.signal} />
    </g>
  );
};

const wavePath = (cy: number, amp: number, y: (x: number) => number, x0 = BOX.x + 30, x1 = BOX.x + BOX.w - 30) => {
  let d = "";
  for (let x = x0; x <= x1; x += 4) d += `${x === x0 ? "M" : "L"}${x} ${(cy - amp * y(x)).toFixed(1)}`;
  return d;
};
const drawn = (f: number, from: number, frames = 26) => `${interpolate(f, [from, from + frames], [0, 1], EXPO)} 1`;

const Svg = ({ children }: { children: ReactNode }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>{children}</svg>
);

/** The power-chord diagram: tab view (high e on top), open E, B and E at the 2nd fret, with labelled leader lines. */
const Fretboard = ({ f, at }: { f: number; at: number }) => {
  const sy = (s: number) => 660 + s * 84; // 0 = high e … 5 = low E
  const nut = 230, fret = (n: number) => nut + n * 135;
  const dots: [number, number, string, string, string][] = [[5, 0, "R", "E2", "Root"], [4, 2, "5", "B2", "Fifth"], [3, 2, "8", "E3", "Octave"]];
  return (
    <g>
      <g opacity={interpolate(f, [8, 22], [0, 1], LINEAR)}>
        {["e", "B", "G", "D", "A", "E"].map((n, s) => <text key={n + s} x={nut - 110} y={sy(s) + 9} fill={P.mid} style={{ fontFamily: sans, fontSize: 26, fontWeight: 600 }}>{n}</text>)}
        {[1, 2, 3, 4].map((n) => <text key={n} x={fret(n) - 67} y={sy(5) + 74} textAnchor="middle" fill={P.mid} style={{ fontFamily: sans, fontSize: 24, fontWeight: 600 }}>{n}</text>)}
      </g>
      {[0, 1, 2, 3, 4, 5].map((s) => <line key={s} x1={nut} x2={fret(4)} y1={sy(s)} y2={sy(s)} stroke={P.ink} strokeWidth={1.5 + s * 0.5} pathLength={1} strokeDasharray={drawn(f, 6 + s * 2)} />)}
      <rect x={nut - 8} y={sy(0) - 4} width={10} height={sy(5) - sy(0) + 8} fill={P.ink} opacity={interpolate(f, [6, 12], [0, 1], LINEAR)} />
      {[1, 2, 3, 4].map((n) => <line key={n} x1={fret(n)} x2={fret(n)} y1={sy(0)} y2={sy(5)} stroke={P.rule} strokeWidth={4} opacity={interpolate(f, [10, 20], [0, 1], LINEAR)} />)}
      {dots.map(([s, n, mark, note, role], k) => {
        const t = at + k * 8, x = n ? fret(n) - 67 : nut - 46, root = k === 0;
        const on = interpolate(f, [t, t + 10], [0, 1], EXPO);
        return (
          <g key={k} opacity={on}>
            <line x1={x + 34} x2={fret(4) + 30} y1={sy(s)} y2={sy(s)} stroke={root ? P.signal : P.ink} strokeWidth={2} strokeDasharray="6 8" pathLength={1} style={{ strokeDasharray: drawn(f, t + 4, 16) }} />
            <circle cx={x} cy={sy(s)} r={30 * (0.6 + 0.4 * on)} fill={root ? P.signal : P.ink} />
            <text x={x} y={sy(s) + 10} textAnchor="middle" fill={P.paper} style={{ fontFamily: sans, fontSize: 28, fontWeight: 600 }}>{mark}</text>
            <text x={fret(4) + 46} y={sy(s) - 2} fill={P.ink} style={{ fontFamily: sans, fontSize: 34, fontWeight: 600 }}>{note}</text>
            <text x={fret(4) + 46} y={sy(s) + 26} fill={P.mid} style={{ fontFamily: sans, fontSize: 20, fontWeight: 600, letterSpacing: 3 }}>{role.toUpperCase()}</text>
          </g>
        );
      })}
    </g>
  );
};

/** Reel 8b: the harmony reel as printed plates. 9:16. */
export const HarmonyPlateReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const cue = (k: number) => tl.cue(id, k);
  const plate = PLATES[id];
  const out = fade(f, len, 1, 6);
  const fig = id === "hook" ? "Fig. 00" : id === "close" ? "End" : `Fig. ${plate.fig} / 07`;
  const text = script[tl.index(id)].show;

  return (
    <AbsoluteFill style={{ backgroundColor: P.paper, color: P.ink, fontFamily: sans }}>
      <Chrome frame={frame} f={f} fig={fig} />

      <AbsoluteFill style={{ opacity: out }}>
        {id === "hook" && (
          <>
            <Reveal f={f} at={0} style={{ position: "absolute", left: M, top: 290, fontSize: 76, fontWeight: 600, letterSpacing: -3 }}>This is what</Reveal>
            <Reveal f={f} at={10} style={{ position: "absolute", left: M - 6, top: 360, fontFamily: serif, fontStyle: "italic", fontSize: 230, lineHeight: 1.12, letterSpacing: -6 }}>harmony</Reveal>
            <Reveal f={f} at={22} style={{ position: "absolute", left: M, top: 610, fontSize: 76, fontWeight: 600, letterSpacing: -3 }}>looks like.</Reveal>
            <Svg>
              <Figure f={f} a={2} b={interpolate(f, [0, 70], [2.6, 3], EXPO)} turns={6} delta={f * 0.015} from={0} frames={40} r={250} cx={540} cy={1060} box={{ x: M, y: 790, w: 1080 - 2 * M, h: 540 }} width={2.5} />
            </Svg>
          </>
        )}

        {plate && <Title f={f} plate={plate} ratioAt={id === "octave" ? cue(2) : id === "guitar" ? cue(2) : cue(1)} />}
        {plate?.readouts && <Readouts f={f} items={plate.readouts.map(([k, v]) => [k, k === "Frequency" ? `${Math.round(interpolate(f, [cue(1), cue(1) + 36], [0, 440], EXPO))} Hz` : v])} />}

        {id === "wave" && (
          <Svg>
            <Plot f={f} caption="Air pressure over time">
              <line x1={BOX.x} x2={BOX.x + BOX.w} y1={CY} y2={CY} stroke={P.rule} strokeWidth={2} />
              <text x={BOX.x + BOX.w - 18} y={BOX.y + BOX.h - 20} textAnchor="end" fill={P.mid} style={{ fontFamily: sans, fontSize: 22, fontWeight: 600, letterSpacing: 3 }}>TIME →</text>
              <path d={wavePath(CY, interpolate(f, [cue(1), cue(1) + 14], [60, 200], EXPO), (x) => Math.sin(x / 24 - f * 0.3))} fill="none" stroke={P.ink} strokeWidth={4} pathLength={1} strokeDasharray={drawn(f, 6, 30)} />
            </Plot>
          </Svg>
        )}

        {id === "combine" && (
          <Svg>
            <Plot f={f}>
              {([[BOX.y + 120, 50, (x: number) => Math.sin(x / 34 - f * 0.2), P.mid, 3, 6, `C4 · ${fmt(60)} Hz`], [BOX.y + 300, 50, (x: number) => Math.sin(x / 22.67 - f * 0.3), P.mid, 3, 12, `G4 · ${fmt(67)} Hz`], [BOX.y + 500, 55, (x: number) => Math.sin(x / 34 - f * 0.2) + Math.sin(x / 22.67 - f * 0.3), P.ink, 4.5, cue(1), "C4 + G4"]] as const).map(([y, amp, fn, color, w, at, name]) => (
                <g key={name} opacity={f >= at ? 1 : 0}>
                  <text x={BOX.x + 18} y={y - 72} fill={color === P.ink ? P.signal : P.mid} style={{ fontFamily: sans, fontSize: 22, fontWeight: 600, letterSpacing: 3 }}>{name.toUpperCase()}</text>
                  <path d={wavePath(y, amp, fn)} fill="none" stroke={color} strokeWidth={w} pathLength={1} strokeDasharray={drawn(f, at, 28)} />
                </g>
              ))}
            </Plot>
          </Svg>
        )}

        {id === "octave" && <Svg><Plot f={f} caption="C3 against C4"><Figure f={f} a={1} b={2} turns={1} delta={Math.PI / 4 + f * 0.02} /></Plot></Svg>}
        {id === "fifth" && <Svg><Plot f={f} caption="C4 against G4"><Figure f={f} a={2} b={3} turns={1} delta={f * 0.02} /></Plot></Svg>}
        {id === "tritone" && <Svg><Plot f={f} caption="C4 against F♯4 · never repeats"><Figure f={f} a={1} b={Math.SQRT2} turns={9} delta={f * 0.03} color={P.signal} frames={80} width={2.5} /></Plot></Svg>}

        {id === "rule" && (
          <>
            <Svg>
              <g opacity={f >= cue(2) ? interpolate(f, [cue(2), cue(2) + 10], [1, 0.25], LINEAR) : 1}>
                <Plot f={f} x={M} y={BOX.y} w={450} h={450} caption="Consonant · 3:2"><Figure f={f} a={2} b={3} turns={1} delta={f * 0.02} r={160} cx={M + 225} cy={BOX.y + 245} box={{ x: M, y: BOX.y, w: 450, h: 450 }} frames={34} width={3} /></Plot>
                <Plot f={Math.max(0, f - cue(1) + 6)} x={558} y={BOX.y} w={450} h={450} caption="Dissonant · 1:√2"><Figure f={f} a={1} b={Math.SQRT2} turns={9} delta={f * 0.03} r={160} cx={783} cy={BOX.y + 245} box={{ x: 558, y: BOX.y, w: 450, h: 450 }} from={cue(1)} frames={50} color={P.signal} width={2} /></Plot>
              </g>
            </Svg>
            <Reveal f={f} at={cue(2)} style={{ position: "absolute", left: M, top: 1040, fontSize: 96, fontWeight: 600, letterSpacing: -4 }}>Music is maths</Reveal>
            <Reveal f={f} at={cue(2) + 6} style={{ position: "absolute", left: M - 4, top: 1140, fontFamily: serif, fontStyle: "italic", fontSize: 120, lineHeight: 1.1, color: P.signal }}>you can feel.</Reveal>
          </>
        )}

        {id === "guitar" && <Svg><Plot f={f} caption="E5 · open position"><Fretboard f={f} at={cue(1)} /></Plot></Svg>}

        {id === "close" && (
          <>
            <Svg><path d={lissajous(2, 3, f * 0.015, 1, 330, 640, 900)} fill="none" stroke={P.rule} strokeWidth={2} pathLength={1} strokeDasharray={drawn(f, 0, 50)} /></Svg>
            <div style={{ position: "absolute", left: M, top: 420, width: 190, height: 190, borderRadius: 44, backgroundColor: P.ink, display: "flex", alignItems: "center", justifyContent: "center", scale: String(interpolate(f, [0, 16], [0.8, 1], EXPO)), opacity: interpolate(f, [0, 8], [0, 1], LINEAR) }}>
              <Mark height={120} at={4} />
            </div>
            <Reveal f={f} at={14} style={{ position: "absolute", left: M - 4, top: 650, fontSize: 170, fontWeight: 600, letterSpacing: -8, lineHeight: 1.04 }}>Fretkey</Reveal>
            <Reveal f={f} at={22} style={{ position: "absolute", left: M, top: 840, fontFamily: serif, fontStyle: "italic", fontSize: 60, color: P.mid }}>The why behind every sound.</Reveal>
            <Reveal f={f} at={cue(1)} style={{ position: "absolute", left: M, top: 1000 }}>
              <div style={{ display: "inline-block", backgroundColor: P.ink, color: P.paper, fontSize: 48, fontWeight: 600, padding: "22px 46px", borderRadius: 999 }}>Follow @fret.key →</div>
            </Reveal>
          </>
        )}
      </AbsoluteFill>

      <div style={{ position: "absolute", left: M, right: M, top: 1336, fontSize: 40, lineHeight: 1.3, fontWeight: 500, color: P.ink, opacity: fade(f, len, 6, 4) }}>
        {text.split("*").map((part, i) => <span key={i} style={i % 2 ? { color: P.signal } : undefined}>{part}</span>)}
      </div>

      <HarmonySound />
    </AbsoluteFill>
  );
};

/** Cover for the plate version: the opening plate, without the caption. Content stays inside the profile-grid crop. */
export const HarmonyPlateCover = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, color: P.ink, fontFamily: sans }}>
    <div style={{ ...label, position: "absolute", left: M, top: 300 }}>Fretkey — On harmony</div>
    <div style={{ ...label, position: "absolute", right: M, top: 300, color: P.ink }}>Fig. 00 – 07</div>
    <div style={{ position: "absolute", left: M, right: M, top: 342, height: 2, backgroundColor: P.ink }} />
    <div style={{ position: "absolute", left: M, top: 390, fontSize: 84, fontWeight: 600, letterSpacing: -3 }}>This is what</div>
    <div style={{ position: "absolute", left: M - 6, top: 470, fontFamily: serif, fontStyle: "italic", fontSize: 250, lineHeight: 1.1, letterSpacing: -7 }}>harmony</div>
    <div style={{ position: "absolute", left: M, top: 740, fontSize: 84, fontWeight: 600, letterSpacing: -3 }}>looks like.</div>
    <Svg>
      <Plot f={60} x={M} y={880} w={1080 - 2 * M} h={560} caption="C4 against G4 · ratio 3:2">
        <Figure f={60} a={2} b={3} turns={1} delta={0} r={220} cx={540} cy={1170} box={{ x: M, y: 880, w: 1080 - 2 * M, h: 560 }} from={0} frames={50} />
      </Plot>
    </Svg>
    <div style={{ ...label, position: "absolute", left: M, top: 1470 }}>Every interval has a shape</div>
  </AbsoluteFill>
);
