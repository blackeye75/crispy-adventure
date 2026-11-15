import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, LINEAR, OUT, rise, serif, Stage, useTall } from "../theme";

// Counted from content/ on the day this was made.
const FACTS = [
  { value: 236, unit: "lessons" },
  { value: 6, unit: "levels of theory" },
  { value: 4, unit: "playing tracks" },
];

/** The size of the course, counted up over the path screen. */
export const Numbers = () => {
  const frame = useCurrentFrame();
  const tall = useTall();
  return (
    <Stage glow="50% 45%">
      {/* the path screen drifting past on both sides, soft enough not to compete with the figures */}
      <Img src={staticFile("shots/path.png")} style={{ position: "absolute", left: tall ? 760 : 1500, width: 460, top: interpolate(frame, [0, 216], [140, -200], LINEAR), opacity: 0.13, borderRadius: 40, rotate: "7deg", filter: "blur(2px)" }} />
      <Img src={staticFile("shots/path.png")} style={{ position: "absolute", left: tall ? -140 : -40, width: 460, top: interpolate(frame, [0, 216], [-160, 120], LINEAR), opacity: 0.13, borderRadius: 40, rotate: "-7deg", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", left: tall ? 80 : 0, right: tall ? 80 : 0, top: tall ? 250 : 110, textAlign: "center", ...rise(frame, 4), fontFamily: serif, fontSize: 96, lineHeight: 1.12 }}>
        From your first note to <span style={{ color: C.gold }}>jazz harmony.</span>
      </div>
      <div style={{ position: "absolute", left: tall ? 0 : 120, right: tall ? 0 : 120, top: tall ? 540 : 360, display: "flex", flexDirection: tall ? "column" : "row", alignItems: "center", gap: tall ? 22 : 0, justifyContent: "space-between" }}>
        {FACTS.map((fact, i) => (
          <div key={fact.unit} style={{ ...rise(frame, 26 + i * 16, 60), width: 520, textAlign: "center" }}>
            <div style={{ fontFamily: serif, fontSize: tall ? 172 : 260, fontWeight: 600, color: C.gold, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {Math.round(interpolate(frame, [26 + i * 16, 80 + i * 16], [0, fact.value], OUT))}
            </div>
            <div style={{ fontSize: tall ? 50 : 56, fontWeight: 500, marginTop: tall ? 0 : 18 }}>{fact.unit}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: tall ? 110 : 0, right: tall ? 110 : 0, bottom: tall ? 400 : 110, textAlign: "center", ...rise(frame, 110), fontSize: 50, lineHeight: 1.25, color: C.muted }}>
        Taught once. Shown on the instrument <span style={{ color: C.text }}>you</span> play.
      </div>
    </Stage>
  );
};
