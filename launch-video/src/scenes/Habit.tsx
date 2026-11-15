import { interpolate, useCurrentFrame } from "remotion";
import { C, Label, LINEAR, OUT, Phone, rise, serif, Stage } from "../theme";

const POINTS = [
  ["Daily review", "brings back what you are about to forget"],
  ["Streaks and a goal", "you set yourself"],
  ["Practice room", "metronome and tempo trainer"],
  ["On any phone", "installable, left-handed option"],
];

/** What keeps a learner coming back. */
export const Habit = () => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="28% 50%">
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 110,
          opacity: interpolate(frame, [4, 18], [0, 1], LINEAR),
          translate: `0px ${interpolate(frame, [4, 40], [200, 0], OUT)}px`,
          rotate: `${interpolate(frame, [4, 40], [-10, -4], OUT)}deg`,
        }}
      >
        <Phone shot="home" width={430} active />
      </div>
      <div style={{ position: "absolute", left: 800, top: 130, width: 1020 }}>
        <Label style={rise(frame, 8)}>Built to stick</Label>
        <div style={{ ...rise(frame, 16), fontFamily: serif, fontSize: 112, lineHeight: 1.05, marginTop: 24 }}>
          A few minutes, <span style={{ color: C.gold }}>every day.</span>
        </div>
        <div style={{ marginTop: 54, display: "flex", flexDirection: "column", gap: 30 }}>
          {POINTS.map(([head, tail], i) => (
            <div key={head} style={{ ...rise(frame, 52 + i * 22, 36), display: "flex", alignItems: "baseline", gap: 26 }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.gold, flexShrink: 0, translate: "0px -6px" }} />
              <div style={{ fontSize: 50, lineHeight: 1.2 }}>
                <span style={{ fontWeight: 600 }}>{head}</span> <span style={{ color: C.muted }}>{tail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};
