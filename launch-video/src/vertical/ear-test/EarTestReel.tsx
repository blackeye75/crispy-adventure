import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, sans, serif } from "../../theme";
import { Backdrop, Bed, Caption, Close, fade, gold, Hit, lift, Piano, pulse, timeline, Voices } from "../kit";
import script from "./script.json";
import timing from "./timing.json";

// Challenge reel: three ear-test rounds with a 3-2-1 countdown, then the answer and the theory behind it.
const COUNT = 90; // frames of countdown: three seconds
const SOUND_TO_COUNT = { q1: 34, q2: 60, q3: 84 }; // frames from the end of the question to the countdown
const tl = timeline(script, timing, { q1: 34 + COUNT, q2: 60 + COUNT, q3: 84 + COUNT, a3: 45, close: 50 });
export const EAR_TEST_FRAMES = tl.total;

const A_MINOR = [57, 60, 64], C_MAJOR = [60, 64, 67], F_MAJOR = [60, 65, 69], G7 = [55, 59, 62, 65];
type Q = "q1" | "q2" | "q3";
const ROUNDS: Record<Q, { options: [string, string]; right: 0 | 1; answer: string }> = {
  q1: { options: ["Happy", "Sad"], right: 1, answer: "a1" },
  q2: { options: ["Same", "Different"], right: 0, answer: "a2" },
  q3: { options: ["Finished", "Not yet"], right: 1, answer: "a3" },
};
/** The sounds of each question, in frames after its voice ends. */
const SOUNDS: Record<Q, [number, number[]][]> = {
  q1: [[4, A_MINOR]],
  q2: [[4, [48]], [30, [60]]],
  q3: [[4, C_MAJOR], [24, F_MAJOR], [44, G7]],
};
const roundOf = (id: string): Q | undefined => (Object.keys(ROUNDS) as Q[]).find((q) => q === id || ROUNDS[q].answer === id);

/** Equaliser bars that jump when a sound is struck: the question shows that something plays, never which notes. */
const Sound = ({ f, hits }: { f: number; hits: number[] }) => {
  const env = Math.max(0.06, ...hits.map((h) => (f < h ? 0 : Math.exp(-(f - h) / 28))));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 300, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
      {Array.from({ length: 11 }, (_, k) => {
        const wobble = 0.55 + 0.45 * Math.abs(Math.sin(f * 0.37 + k * 1.9));
        const shape = 1 - Math.abs(k - 5) / 7;
        return <div key={k} style={{ width: 34, height: 26 + 270 * env * wobble * shape, borderRadius: 17, backgroundColor: C.gold, opacity: 0.4 + 0.6 * env }} />;
      })}
    </div>
  );
};

/** Ring that empties over three seconds with the seconds left in the middle. */
const Countdown = ({ t }: { t: number }) => {
  const left = Math.max(1, 3 - Math.floor(t / 30));
  const r = 92, around = 2 * Math.PI * r;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 650, display: "flex", justifyContent: "center", opacity: interpolate(t, [0, 6, COUNT - 4, COUNT], [0, 1, 1, 0], LINEAR) }}>
      <svg width={240} height={240} viewBox="0 0 240 240">
        <circle cx={120} cy={120} r={r} fill="none" stroke={C.line} strokeWidth={14} />
        <circle cx={120} cy={120} r={r} fill="none" stroke={C.gold} strokeWidth={14} strokeLinecap="round" strokeDasharray={around} strokeDashoffset={around * Math.min(1, t / COUNT)} transform="rotate(-90 120 120)" />
        <text x={120} y={120} textAnchor="middle" dominantBaseline="central" fill={C.text} style={{ fontFamily: serif, fontSize: 110, fontWeight: 600, scale: String(1 + 0.25 * pulse(t % 30, 0)), transformOrigin: "120px 120px" }}>{left}</text>
      </svg>
    </div>
  );
};

const Options = ({ round, revealed, f }: { round: Q; revealed: boolean; f: number }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", gap: 40 }}>
    {ROUNDS[round].options.map((label, k) => {
      const right = revealed && k === ROUNDS[round].right, wrong = revealed && !right;
      return (
        <div key={label} style={{ ...lift(f, revealed ? 0 : 8 + k * 5, 30), width: 400, height: 150, borderRadius: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: sans, fontSize: 58, fontWeight: 700, border: `4px solid ${right ? C.gold : C.line}`, backgroundColor: right ? C.gold : "transparent", color: right ? C.bg : C.text, opacity: wrong ? 0.3 : 1, scale: right ? String(1 + 0.08 * pulse(f, 0)) : "1", textDecoration: wrong ? "line-through" : "none" }}>
          {right && <span>✓</span>}{label}
        </div>
      );
    })}
  </div>
);

const Rounds = ({ round }: { round: Q }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, fontFamily: sans, fontSize: 34, fontWeight: 600, letterSpacing: 6, color: C.muted }}>
    ROUND {round.slice(1)} / 3
    {(["q1", "q2", "q3"] as Q[]).map((q) => <div key={q} style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: q <= round ? C.gold : C.line }} />)}
  </div>
);

const QUESTIONS: Record<Q, React.ReactNode> = {
  q1: <>Happy or {gold("sad?")}</>, q2: <>Same note, or {gold("different?")}</>, q3: <>Does it sound {gold("finished?")}</>,
};

/** The answer on the keyboard: which keys glow, written on them. */
function answerKeys(id: string, f: number) {
  const named = (midis: number[], names: string[]) => ({ lit: Object.fromEntries(midis.map((m) => [m, Math.max(0.55, pulse(f, 0))])), labels: Object.fromEntries(midis.map((m, k) => [m, names[k]])) });
  if (id === "a1") return named(A_MINOR, ["A", "C", "E"]);
  if (id === "a2") return named([48, 60], ["C", "C"]);
  const home = f >= tl.cue("a3", 3) + 26;
  return home ? { ...named(C_MAJOR, ["C", "E", "G"]), lit: Object.fromEntries(C_MAJOR.map((m) => [m, Math.max(0.55, pulse(f, tl.cue("a3", 3) + 26))])) } : named(G7, ["G", "B", "D", "F"]);
}

/** Reel 7: the ear test. 9:16. */
export const EarTestReel = () => {
  const frame = useCurrentFrame();
  const { id, f, len } = tl.at(frame);
  const round = roundOf(id);
  const isQ = id.startsWith("q");
  const end = isQ ? tl.voice(id) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, color: C.text, fontFamily: sans }}>
      <Backdrop frame={frame} />

      {id === "hook" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len, 1) }}>
          <div style={{ ...lift(f, 2), fontSize: 54, color: C.muted }}>Your ears already know</div>
          <div style={{ ...lift(f, 10, 70), fontFamily: serif, fontSize: 150, fontWeight: 600, lineHeight: 1.05 }}>music theory.</div>
          <div style={{ ...lift(f, tl.cue("hook", 1), 40), marginTop: 60, fontFamily: serif, fontSize: 110, fontWeight: 600, color: C.bg, backgroundColor: C.gold, padding: "8px 60px", borderRadius: 30, scale: String(1 + 0.1 * pulse(f, tl.cue("hook", 1))) }}>Prove it.</div>
          <div style={{ ...lift(f, tl.cue("hook", 2), 30), marginTop: 60, fontSize: 50, letterSpacing: 2 }}>3 sounds · 3 seconds each</div>
        </AbsoluteFill>
      )}

      {round && <Rounds round={round} />}
      {isQ && (
        <>
          <div style={{ position: "absolute", left: 60, right: 60, top: 340, textAlign: "center", fontFamily: serif, fontSize: 104, lineHeight: 1.05, ...lift(f, 0, 30) }}>{QUESTIONS[id as Q]}</div>
          {f < end + SOUND_TO_COUNT[id as Q] ? <Sound f={f - end} hits={SOUNDS[id as Q].map(([at]) => at)} /> : <Countdown t={f - end - SOUND_TO_COUNT[id as Q]} />}
          {f >= end + SOUND_TO_COUNT[id as Q] && <div style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center", fontSize: 44, color: C.muted }}>Lock in your answer</div>}
        </>
      )}
      {round && !isQ && (
        <>
          <div style={{ position: "absolute", left: 60, right: 60, top: 315, textAlign: "center", fontFamily: serif, fontSize: 96, ...lift(f, 0, 30), opacity: fade(f, len, 6, 4) }}>{gold(ROUNDS[round].options[ROUNDS[round].right] + ".")}</div>
          <Piano from={48} to={72} top={500} enter={interpolate(f, [0, 14, len - 6, len], [0, 1, 1, 0], LINEAR)} {...answerKeys(id, f)} />
        </>
      )}
      {round && <div style={{ opacity: fade(f, len, 6, 4) }}><Options round={round} revealed={!isQ} f={f} /></div>}

      {id === "score" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300, opacity: fade(f, len) }}>
          <div style={{ ...lift(f, 2, 70), fontFamily: serif, fontSize: 300, fontWeight: 600, color: C.gold, lineHeight: 1, textShadow: "0 0 100px rgba(236,178,63,0.4)" }}>3/3?</div>
          <div style={{ ...lift(f, tl.cue("score", 1)), fontFamily: serif, fontSize: 90, marginTop: 20 }}>Your ears are ready.</div>
          <div style={{ ...lift(f, tl.cue("score", 2), 40), marginTop: 70, position: "relative", backgroundColor: C.text, color: C.bg, borderRadius: 40, padding: "26px 54px", fontSize: 54, fontWeight: 700 }}>
            Comment your score: 0 · 1 · 2 · 3
            <div style={{ position: "absolute", left: 80, bottom: -26, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `30px solid ${C.text}` }} />
          </div>
        </AbsoluteFill>
      )}
      {id === "close" && <Close f={f} voice={tl.voice("close")} />}

      <Caption text={script[tl.index(id)].show} f={f} len={len} />

      <Bed total={tl.total} quiet={[[tl.start("q1"), tl.start("score")]]} />
      <Voices tl={tl} dir="vertical/ear-test" />
      {(Object.keys(SOUNDS) as Q[]).flatMap((q) => [
        ...SOUNDS[q].map(([at, midis], k) => <Hit key={`${q}s${k}`} at={tl.start(q) + tl.voice(q) + at} midis={midis} volume={0.45} />),
        ...[0, 1, 2].map((k) => <Hit key={`${q}t${k}`} at={tl.start(q) + tl.voice(q) + SOUND_TO_COUNT[q] + k * 30} midis={[79]} volume={0.08} />), // soft clock tick
      ])}
      <Hit at={tl.start("a1") + tl.cue("a1", 1)} midis={A_MINOR} volume={0.35} />
      <Hit at={tl.start("a2") + tl.cue("a2", 1) + 10} midis={[48]} volume={0.35} />
      <Hit at={tl.start("a2") + tl.cue("a2", 2) + 10} midis={[60]} volume={0.35} />
      <Hit at={tl.start("a3") + tl.cue("a3", 1)} midis={G7} volume={0.35} />
      <Hit at={tl.start("a3") + tl.cue("a3", 3) + 26} midis={[48, ...C_MAJOR]} volume={0.45} />
    </AbsoluteFill>
  );
};
