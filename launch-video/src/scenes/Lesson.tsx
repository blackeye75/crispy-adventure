import { interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, OUT, Phone, rise, serif, Stage } from "../theme";

const STEPS = [
  { name: "Understand", line: "A short, plain explanation", shot: "step-understand" },
  { name: "Listen", line: "Hear it before you read it", shot: "step-listen" },
  { name: "Learn", line: "See it on your instrument", shot: "step-learn" },
  { name: "Practice", line: "Drills with instant feedback", shot: "step-practice" },
];
const FIRST = 40;
const EACH = 62; // frames each step holds the spotlight

/** How every lesson runs. Each step takes the spotlight in turn. */
export const Lesson = () => {
  const frame = useCurrentFrame();
  const current = Math.min(STEPS.length - 1, Math.max(0, Math.floor((frame - FIRST) / EACH)));
  return (
    <Stage glow="50% 60%">
      <div style={{ ...rise(frame, 4), position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: serif, fontSize: 112 }}>
        Every lesson, <span style={{ color: C.gold }}>four steps.</span>
      </div>
      <div style={{ position: "absolute", left: 225, top: 232, display: "flex", gap: 90 }}>
        {STEPS.map((step, i) => {
          const at = FIRST + i * EACH;
          const on = current === i && frame >= FIRST;
          return (
            <div key={step.name} style={{ width: 300, opacity: interpolate(frame, [12 + i * 6, 26 + i * 6], [0, 1], LINEAR), translate: `0px ${interpolate(frame, [12 + i * 6, 40 + i * 6], [90, 0], OUT)}px` }}>
              <div
                style={{
                  opacity: frame < FIRST ? 0.9 : on ? 1 : 0.38,
                  scale: interpolate(frame, [at, at + 14, at + EACH, at + EACH + 14], [1, 1.09, 1.09, i === STEPS.length - 1 ? 1.09 : 1], { ...OUT, output: "perceptual-scale" }),
                  transformOrigin: "50% 40%",
                }}
              >
                <Phone shot={step.shot} active={on} />
              </div>
              <div style={{ marginTop: 46, marginLeft: -45, marginRight: -45, textAlign: "center", whiteSpace: "nowrap", opacity: frame < FIRST ? 0.6 : on ? 1 : 0.45 }}>
                <div style={{ fontSize: 44, fontWeight: 600, color: on ? C.gold : C.text }}>
                  {i + 1}. {step.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 36, textAlign: "center", fontSize: 48, color: C.muted }}>
        {STEPS.map((step, i) => {
          const at = FIRST + i * EACH;
          return (
            <div key={step.name} style={{ position: "absolute", left: 0, right: 0, bottom: 0, opacity: interpolate(frame, [at, at + 10, at + EACH - 4, at + EACH + 6], [0, 1, 1, i === STEPS.length - 1 ? 1 : 0], LINEAR) }}>
              {step.line}
              {i === STEPS.length - 1 && <span style={{ color: C.text, opacity: interpolate(frame, [at + 30, at + 44], [0, 1], LINEAR) }}> · 5 to 8 minutes a lesson</span>}
            </div>
          );
        })}
      </div>
    </Stage>
  );
};
