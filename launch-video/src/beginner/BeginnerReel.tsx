import { Audio } from "@remotion/media";
import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FPS, LINEAR, Mark, OUT, Phone, sans, serif } from "../theme";
import script from "./script.json";
import timing from "./timing.json";

// ---- timing: every line of narration is one segment, as long as its recording plus a breath --------------------------
// Segments are found by the line ids in script.json, so lines can be added or reordered without breaking the picture.
const S = Object.fromEntries(script.map((line, i) => [line.id, i])) as Record<string, number>;
const PAD = 6;
const RUN_STEP = 6; // frames between the notes of the guitar run
const AFTER: Record<number, number> = { [S.guitar]: 13 * RUN_STEP + 20, [S.close]: 50 }; // music after the guitar line; a held close
const lengths = timing.map((t, i) => Math.ceil(t.seconds * FPS) + PAD + (AFTER[i] ?? 0));
const starts = lengths.reduce<number[]>((all, _, i) => [...all, i ? all[i - 1] + lengths[i - 1] : 0], []);
export const BEGINNER_FRAMES = starts[starts.length - 1] + lengths[lengths.length - 1];
const voiceFrames = (i: number) => Math.ceil(timing[i].seconds * FPS);
const onsetFrames = (i: number) => ((timing[i] as { onsets?: number[] }).onsets ?? []).map((s) => Math.round(s * FPS));

// ---- the keyboard: one octave from A to A, as in the lesson -------------------------------------------------------------
const WHITE = ["A", "B", "C", "D", "E", "F", "G", "A"];
const BLACK_AFTER = [0, 2, 3, 5, 6]; // a black key follows these white keys; none after B (1) or E (4)
const SHARP = ["A♯", "C♯", "D♯", "F♯", "G♯"];
// the chromatic scale from A: [white index, or black index as -1 - n]
const CHROMATIC = [0, -1, 1, 2, -2, 3, -3, 4, 5, -4, 6, -5];
const KW = 120, KH = 560, BW = 74, BH = 340, KX = 60, KY = 700;

type Keys = { label: number[]; lit: number[]; black: number; blackLit: number[]; blackLabel: (string | null)[]; gaps: [number, number]; arc: number; counter: number | null };

/** What the keyboard shows at a given moment of a given segment. */
function keysAt(seg: number, f: number): Keys {
  const len = voiceFrames(seg);
  const at = (fraction: number) => fraction * len;
  const pulse = (start: number) => (f < start ? 0 : interpolate(f - start, [0, 3, 16], [0, 1, 0.22], LINEAR)); // flash, then a light tint
  const k: Keys = { label: Array(8).fill(0), lit: Array(8).fill(0), black: 0, blackLit: Array(5).fill(0), blackLabel: Array(5).fill(null), gaps: [0, 0], arc: 0, counter: null };
  const labelAll = (to = 7) => { for (let i = 0; i < to; i++) k.label[i] = 1; };
  if (seg === S.abc) onsetFrames(S.abc).forEach((o, i) => { k.label[i] = f >= o ? 1 : 0; k.lit[i] = pulse(o); });
  if (seg === S.white) { labelAll(); k.label[7] = f >= at(0.72) ? 1 : 0; k.lit[7] = pulse(at(0.72)); k.lit[0] = pulse(at(0.72)) * 0.7; }
  if (seg >= S.black) { labelAll(8); k.black = 1; }
  if (seg === S.black) { k.black = interpolate(f, [at(0.2), at(0.45)], [0, 1], OUT); k.blackLit = k.blackLit.map(() => pulse(at(0.5)) * 0.8); }
  if (seg === S.sharp) {
    // measured from the recording: "C sharp" is said at about 26% of the line, "D flat" at about 56%
    k.blackLit[1] = f >= at(0.26) ? 1 : 0;
    k.lit[2] = f >= at(0.1) && f < at(0.4) ? 0.6 : 0;
    k.lit[3] = f >= at(0.4) && f < at(0.7) ? 0.6 : 0;
    k.blackLabel[1] = f >= at(0.56) ? "C♯ D♭" : f >= at(0.26) ? "C♯" : null;
  }
  if (seg === S.gaps) k.gaps = [interpolate(f, [at(0.12), at(0.12) + 8], [0, 1], LINEAR), interpolate(f, [at(0.3), at(0.3) + 8], [0, 1], LINEAR)];
  if (seg === S.count) {
    const onsets = onsetFrames(S.count);
    onsets.forEach((o, n) => {
      const key = CHROMATIC[n];
      if (key >= 0) k.lit[key] = pulse(o);
      else { k.blackLit[-1 - key] = pulse(o); if (f >= o) k.blackLabel[-1 - key] = SHARP[-1 - key]; }
    });
    const done = onsets.filter((o) => f >= o).length;
    k.counter = done || null;
  }
  if (seg === S.octave) { k.blackLabel = [...SHARP]; k.lit[0] = pulse(0); k.lit[7] = pulse(at(0.42)); k.arc = interpolate(f, [at(0.42), at(0.42) + 16], [0, 1], OUT); } // "It is A again" starts at about 42%
  return k;
}

/** A colour between two, by amount 0 to 1: solid paint, never see-through, so a lit key cannot turn muddy. */
const mix = (from: number[], to: number[], amount: number) => `rgb(${from.map((c, i) => Math.round(c + (to[i] - c) * amount)).join(",")})`;

const Keyboard = ({ k, enter }: { k: Keys; enter: number }) => (
  <svg width={KW * 8} height={KH + 40} style={{ position: "absolute", left: KX, top: KY, overflow: "visible", opacity: enter, translate: `0px ${(1 - enter) * 120}px` }}>
    {WHITE.map((name, i) => (
      <g key={i}>
        <rect x={i * KW + 3} y={0} width={KW - 6} height={KH} rx={16} fill={mix([243, 239, 230], [236, 178, 63], k.lit[i])} style={{ filter: k.lit[i] > 0.5 ? "drop-shadow(0 0 30px rgba(236,178,63,0.8))" : undefined }} />
        <text x={i * KW + KW / 2} y={KH - 40} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={54} fill={C.bg} opacity={k.label[i]}>{name}</text>
      </g>
    ))}
    {BLACK_AFTER.map((after, j) => {
      const h = BH * k.black;
      return (
        <g key={j}>
          <rect x={(after + 1) * KW - BW / 2} y={0} width={BW} height={h} rx={10} fill={mix([23, 20, 15], [236, 178, 63], k.blackLit[j])} stroke="#3a372f" strokeWidth={2} />
          {k.blackLabel[j] && k.black > 0.9 && k.blackLabel[j]!.split(" ").map((line, n, all) => (
            <text key={line} x={(after + 1) * KW} y={BH - 34 - (all.length - 1 - n) * 40} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={32} fill={k.blackLit[j] > 0.5 ? C.bg : C.text}>{line}</text>
          ))}
        </g>
      );
    })}
    {/* B–C and E–F: the two places with no key between */}
    {[2, 5].map((boundary, n) => (
      <g key={boundary} opacity={k.gaps[n]}>
        <circle cx={boundary * KW} cy={BH / 2} r={44} fill="none" stroke={C.gold} strokeWidth={6} />
        <text x={boundary * KW} y={BH / 2 + 12} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={34} fill={C.gold}>✕</text>
        <text x={boundary * KW} y={-36} textAnchor="middle" fontFamily={sans} fontWeight={600} fontSize={34} fill={C.gold}>{n ? "E–F" : "B–C"}</text>
      </g>
    ))}
    {/* the octave: A to A */}
    <g opacity={k.arc}>
      <path d={`M ${KW / 2} -30 C ${KW * 2} -${190 * k.arc}, ${KW * 6} -${190 * k.arc}, ${KW * 7.5} -30`} fill="none" stroke={C.gold} strokeWidth={7} strokeLinecap="round" />
      <text x={KW * 4} y={-178} textAnchor="middle" fontFamily={serif} fontSize={58} fill={C.gold}>octave</text>
    </g>
  </svg>
);

// ---- the guitar neck: one string, open to fret 12 -----------------------------------------------------------------------
const NOTE_NAMES = ["A", "A♯", "B", "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A"];
const FRET = 62, NUT = 470, NECK_X = 540;
const Neck = ({ f }: { f: number }) => {
  const len = voiceFrames(S.guitar);
  const runStart = len + PAD;
  return (
    <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <rect x={NECK_X - 110} y={NUT} width={220} height={FRET * 12 + 30} rx={10} fill="#3a2a1c" />
      <rect x={NECK_X - 114} y={NUT - 10} width={228} height={12} rx={4} fill="#e9e1cf" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={NECK_X - 110} y={NUT + (i + 1) * FRET - 2} width={220} height={4} fill="#a99f8d" />)}
      {[3, 5, 7, 9].map((d) => <circle key={d} cx={NECK_X - 62} cy={NUT + (d - 0.5) * FRET} r={9} fill="#6b5a45" />)}
      <circle cx={NECK_X - 75} cy={NUT + 11.5 * FRET} r={9} fill="#6b5a45" />
      <circle cx={NECK_X - 49} cy={NUT + 11.5 * FRET} r={9} fill="#6b5a45" />
      <rect x={NECK_X - 2} y={NUT - 40} width={4} height={FRET * 12 + 70} fill="#d9d2c3" />
      {NOTE_NAMES.map((name, i) => {
        const y = i === 0 ? NUT - 34 : NUT + (i - 0.5) * FRET;
        const shown = interpolate(f, [(i / 13) * len * 0.85, (i / 13) * len * 0.85 + 8], [0, 1], LINEAR);
        const lit = f >= runStart + i * RUN_STEP;
        const last = i === 12;
        return (
          <g key={i} opacity={shown}>
            <circle cx={NECK_X} cy={y} r={27} fill={lit ? C.gold : C.bg} stroke={C.gold} strokeWidth={3} style={{ filter: lit ? "drop-shadow(0 0 18px rgba(236,178,63,0.8))" : undefined }} />
            <text x={NECK_X + 70} y={y + 13} fontFamily={sans} fontWeight={700} fontSize={36} fill={lit ? C.gold : C.muted}>{name}</text>
            <text x={NECK_X - 160} y={y + 12} textAnchor="end" fontFamily={sans} fontSize={30} fill={C.muted}>{i === 0 ? "open" : i}</text>
            {last && lit && <text x={NECK_X + 150} y={y + 13} fontFamily={serif} fontSize={40} fill={C.gold}>A again</text>}
          </g>
        );
      })}
    </svg>
  );
};

// ---- small pieces ---------------------------------------------------------------------------------------------------------
const fade = (f: number, len: number, inFrames = 10, outFrames = 6) => interpolate(f, [0, inFrames, len - outFrames, len], [0, 1, 1, 0], LINEAR);
const lift = (f: number, at = 0, distance = 50) => ({ opacity: interpolate(f, [at, at + 12], [0, 1], LINEAR), translate: `0px ${interpolate(f, [at, at + 22], [distance, 0], OUT)}px` });

/** Caption text with *starred* words in gold. */
const Rich = ({ text }: { text: string }) => <>{text.split("*").map((part, i) => <span key={i} style={{ color: i % 2 ? C.gold : undefined }}>{part}</span>)}</>;

const HEADLINES: Record<number, ReactNode> = {
  [S.letters]: <>Seven <span style={{ color: C.gold }}>letters</span></>,
  [S.abc]: <>A <span style={{ color: C.gold }}>to</span> G</>,
  [S.white]: <>The <span style={{ color: C.gold }}>white</span> keys</>,
  [S.black]: <>The <span style={{ color: C.gold }}>black</span> keys</>,
  [S.sharp]: <>One note, <span style={{ color: C.gold }}>two names</span></>,
  [S.gaps]: <>No note <span style={{ color: C.gold }}>between</span></>,
  [S["count-intro"]]: <>Count them <span style={{ color: C.gold }}>all</span></>,
  [S.count]: <>Count them <span style={{ color: C.gold }}>all</span></>,
  [S.octave]: <>The <span style={{ color: C.gold }}>octave</span></>,
  [S.guitar]: <>On <span style={{ color: C.gold }}>guitar</span></>,
  [S.lesson]: <>That was <span style={{ color: C.gold }}>one lesson</span></>,
};

const STEP_SHOTS: [string, string, number][] = [["Understand", "b-understand", 0.3], ["Hear", "b-listen", 0.48], ["See", "b-learn", 0.62], ["Practise", "b-practice", 0.84]];

/** Reel: one beginner lesson, "All twelve notes", taught completely in about 80 seconds, 9:16. */
export const BeginnerReel = () => {
  const frame = useCurrentFrame();
  const seg = Math.max(0, starts.filter((s) => s <= frame).length - 1);
  const f = frame - starts[seg];
  const len = lengths[seg];
  const keyboardOn = interpolate(frame, [starts[S.letters], starts[S.letters] + 18, starts[S.guitar] - 8, starts[S.guitar]], [0, 1, 1, 0], LINEAR);
  const k = keysAt(seg, f);
  const bedQuiet: [number, number] = [starts[S.count] - 10, starts[S.fomo]];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: sans, color: C.text }}>
      {/* a slow, warm light that drifts while the lesson plays */}
      <AbsoluteFill style={{ background: `radial-gradient(900px 1100px at ${50 + Math.sin(frame / 90) * 12}% ${45 + Math.cos(frame / 120) * 8}%, rgba(236,178,63,0.17), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(frame, [0, 24], [1, 0], LINEAR) }} />

      {/* the hook: twelve notes */}
      {seg === S.hook && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len, 1) }}>
          <div style={{ fontFamily: serif, fontSize: 620, fontWeight: 600, lineHeight: 1, color: C.gold, textShadow: "0 0 120px rgba(236,178,63,0.45)", scale: `${interpolate(f, [0, 40], [1.35, 1], { ...LINEAR, easing: Easing.out(Easing.cubic) })}` }}>12</div>
          <div style={{ ...lift(f, 18), fontFamily: serif, fontSize: 110, marginTop: -10 }}>notes</div>
        </AbsoluteFill>
      )}
      {seg === S.twelve && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40, paddingBottom: 300, opacity: fade(f, len) }}>
          {["hundreds", "thousands"].map((word, i) => {
            const at = i * 0.2 * voiceFrames(S.twelve);
            return (
              <div key={word} style={{ ...lift(f, at), position: "relative", fontFamily: serif, fontSize: 130, color: C.muted }}>
                {word}
                <div style={{ position: "absolute", left: -10, top: "55%", height: 10, borderRadius: 5, backgroundColor: C.gold, width: `${interpolate(f, [at + 10, at + 22], [0, 105], OUT)}%` }} />
              </div>
            );
          })}
          <div style={{ ...lift(f, 0.42 * voiceFrames(S.twelve), 80), fontFamily: serif, fontSize: 300, fontWeight: 600, color: C.gold, lineHeight: 1 }}>12</div>
        </AbsoluteFill>
      )}

      {/* the keyboard stays on screen from "seven letters" to the octave */}
      {keyboardOn > 0 && <Keyboard k={k} enter={keyboardOn} />}
      {k.counter !== null && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: serif, fontSize: 190, fontWeight: 600, color: C.gold, lineHeight: 1 }}>{k.counter}</div>
      )}

      {seg === S.guitar && <div style={{ opacity: fade(f, len) }}><Neck f={f} /></div>}

      {seg === S.fomo && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 260, opacity: fade(f, len) }}>
          <div style={{ ...lift(f, 0), fontSize: 50, color: C.muted, textAlign: "center", width: 860, lineHeight: 1.3 }}>Most self-taught players never learn this.</div>
          <div style={{ ...lift(f, 0.55 * voiceFrames(S.fomo), 70), fontFamily: serif, fontSize: 190, fontWeight: 600, lineHeight: 1.05, textAlign: "center", marginTop: 40 }}>
            You just <span style={{ color: C.gold, fontStyle: "italic" }}>did.</span>
          </div>
        </AbsoluteFill>
      )}

      {seg === S.lesson && (
        <div style={{ position: "absolute", left: 50, top: 560, display: "flex", gap: 20, opacity: fade(f, len) }}>
          {STEP_SHOTS.map(([name, shot, at], i) => {
            const on = f >= at * voiceFrames(S.lesson);
            return (
              <div key={shot} style={{ ...lift(f, 4 + i * 5, 80), width: 230, textAlign: "center" }}>
                <div style={{ scale: on ? "1.06" : "1", opacity: on ? 1 : 0.45 }}>
                  <Phone shot={shot} width={230} active={on} />
                </div>
                <div style={{ marginTop: 24, fontSize: 38, fontWeight: 600, color: on ? C.gold : C.muted }}>{name}</div>
              </div>
            );
          })}
        </div>
      )}

      {seg === S.more && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len) }}>
          <div style={{ fontFamily: serif, fontSize: 330, fontWeight: 600, color: C.gold, lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: "0 0 100px rgba(236,178,63,0.35)" }}>
            {Math.round(interpolate(f, [0, 0.55 * voiceFrames(S.more)], [0, 250], { ...LINEAR, easing: Easing.out(Easing.cubic) }))}+
          </div>
          <div style={{ ...lift(f, 10), fontFamily: serif, fontSize: 96 }}>lessons</div>
          <div style={{ ...lift(f, 0.6 * voiceFrames(S.more)), display: "flex", gap: 22, marginTop: 50, fontSize: 40, fontWeight: 600 }}>
            <span style={{ padding: "14px 32px", borderRadius: 40, border: `3px solid ${C.line}` }}>first note</span>
            <span style={{ color: C.gold, alignSelf: "center" }}>→</span>
            <span style={{ padding: "14px 32px", borderRadius: 40, border: `3px solid ${C.gold}`, color: C.gold }}>jazz</span>
          </div>
        </AbsoluteFill>
      )}

      {seg === S.close && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 320, opacity: interpolate(f, [0, 10], [0, 1], LINEAR) }}>
          <Mark height={200} at={2} />
          <div style={{ ...lift(f, 22), fontFamily: serif, fontSize: 150, fontWeight: 600, marginTop: 30, letterSpacing: -3 }}>
            Fret<span style={{ color: C.gold }}>key</span>
          </div>
          <div style={{ ...lift(f, 34), fontSize: 56, color: C.muted, marginTop: 8 }}>is almost here.</div>
          <div style={{ ...lift(f, 0.55 * voiceFrames(S.close)), marginTop: 56, fontSize: 52, fontWeight: 600, color: C.bg, backgroundColor: C.gold, padding: "20px 56px", borderRadius: 60 }}>Follow @fret.key</div>
          <div style={{ ...lift(f, 0.75 * voiceFrames(S.close)), fontSize: 40, color: C.text, marginTop: 26 }}>Be among the first to play.</div>
        </AbsoluteFill>
      )}

      {/* the headline of the moment, at the top */}
      {HEADLINES[seg] && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 270, textAlign: "center", fontFamily: serif, fontSize: 104, lineHeight: 1.05, opacity: seg === S.count || seg === S.abc ? 1 : fade(f, len, 10, 4), translate: `0px ${seg === S.count || seg === S.abc ? 0 : interpolate(f, [0, 18], [30, 0], OUT)}px` }}>
          {HEADLINES[seg]}
        </div>
      )}

      {/* the spoken line as a caption, for viewers with the sound off; clear of Instagram's own buttons */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 1370, textAlign: "center", fontSize: 48, lineHeight: 1.28, fontWeight: 500, opacity: fade(f, len, 6, 4) }}>
        <Rich text={script[seg].show} />
      </div>

      {/* sound: a quiet bed, the voice, and the notes the picture shows */}
      <Audio
        src={staticFile("focus.wav")}
        trimBefore={6 * FPS}
        volume={(v) => 0.11 * interpolate(v, [0, 30, BEGINNER_FRAMES - 45, BEGINNER_FRAMES], [0, 1, 1, 0], LINEAR) * interpolate(v, [bedQuiet[0] - 15, bedQuiet[0], bedQuiet[1], bedQuiet[1] + 15], [1, 0.25, 0.25, 1], LINEAR)}
      />
      {starts.map((s, i) => (
        <Sequence key={i} from={s} durationInFrames={lengths[i]} layout="none">
          <Audio src={staticFile(`beginner/vo-${i + 1}.wav`)} volume={0.9} />
        </Sequence>
      ))}
      {onsetFrames(S.count).map((o, n) => (
        <Sequence key={`c${n}`} from={starts[S.count] + o} durationInFrames={45} layout="none">
          <Audio src={staticFile(`notes/${45 + n}.wav`)} volume={0.42} />
        </Sequence>
      ))}
      {[0, Math.round(0.42 * voiceFrames(S.octave))].map((o, n) => (
        <Sequence key={`o${n}`} from={starts[S.octave] + o} durationInFrames={45} layout="none">
          <Audio src={staticFile(`notes/${n ? 57 : 45}.wav`)} volume={0.5} />
        </Sequence>
      ))}
      {NOTE_NAMES.map((_, n) => (
        <Sequence key={`g${n}`} from={starts[S.guitar] + voiceFrames(S.guitar) + PAD + n * RUN_STEP} durationInFrames={40} layout="none">
          <Audio src={staticFile(`notes/${45 + n}.wav`)} volume={0.55} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
