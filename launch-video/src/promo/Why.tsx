import { interpolate, useCurrentFrame } from "remotion";
import { C, Label, LINEAR, OUT, rise, serif, Stage } from "../theme";

const GAINS = [
  ["Learn songs faster", "You see one pattern, not forty separate chords."],
  ["Improvise without guessing", "You know which notes will work before you play them."],
  ["Write your own music", "You choose a sound on purpose, not by accident."],
  ["Play with anyone", "You speak the language other musicians use."],
];

/** Why theory is worth learning: four things it changes for a player. */
export const Why = () => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="50% 35%">
      <div style={{ position: "absolute", left: 120, right: 120, top: 100 }}>
        <Label style={rise(frame, 4)}>Why music theory</Label>
        <div style={{ ...rise(frame, 12), fontFamily: serif, fontSize: 112, lineHeight: 1.06, marginTop: 22 }}>
          It is not a rulebook. It is <span style={{ color: C.gold }}>the shortcut.</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 470, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 34 }}>
        {GAINS.map(([head, body], i) => {
          const at = 50 + i * 34;
          return (
            <div
              key={head}
              style={{
                ...rise(frame, at, 60),
                padding: "34px 40px",
                borderRadius: 28,
                backgroundColor: C.card,
                border: `2px solid ${C.line}`,
                display: "flex",
                gap: 30,
                alignItems: "center",
              }}
            >
              <div style={{ fontFamily: serif, fontSize: 96, fontWeight: 600, color: C.gold, lineHeight: 1, width: 90, scale: interpolate(frame, [at, at + 18], [0.5, 1], { ...OUT, output: "perceptual-scale" }), opacity: interpolate(frame, [at, at + 10], [0, 1], LINEAR) }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 52, fontWeight: 600 }}>{head}</div>
                <div style={{ fontSize: 36, color: C.muted, marginTop: 8, lineHeight: 1.25 }}>{body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};
