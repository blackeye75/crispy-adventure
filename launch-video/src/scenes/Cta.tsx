import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, OUT, rise, serif, Stage, useTall } from "../theme";

/** The close, on the final chord. */
export const Cta = () => {
  const frame = useCurrentFrame();
  const tall = useTall();
  return (
    <Stage glow="50% 50%">
      <div style={{ position: "absolute", inset: 0, paddingBottom: tall ? 180 : 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...rise(frame, 2, 50), fontFamily: serif, fontSize: tall ? 104 : 124, textAlign: "center", lineHeight: 1.1 }}>
          Stop memorising.
          <br />
          <span style={{ color: C.gold }}>Start understanding.</span>
        </div>
        <div
          style={{
            marginTop: 70,
            padding: "30px 84px",
            borderRadius: 80,
            backgroundColor: C.gold,
            color: C.bg,
            fontSize: 64,
            fontWeight: 600,
            opacity: interpolate(frame, [40, 50], [0, 1], LINEAR),
            scale: interpolate(frame, [40, 66], [0.8, 1], { ...LINEAR, easing: Easing.spring({ damping: 12 }), output: "perceptual-scale" }),
          }}
        >
          Level 1 is free
        </div>
        <div style={{ display: "flex", flexDirection: tall ? "column" : "row", alignItems: "center", gap: tall ? 16 : 30, marginTop: tall ? 110 : 64, opacity: interpolate(frame, [72, 88], [0, 1], LINEAR) }}>
          <div style={{ fontFamily: serif, fontSize: tall ? 120 : 92, fontWeight: 600 }}>
            Fret<span style={{ color: C.gold }}>key</span>
          </div>
          {!tall && <div style={{ width: interpolate(frame, [76, 100], [0, 3], OUT), height: 70, backgroundColor: C.line }} />}
          <div style={{ fontSize: 44, color: C.muted }}>Music theory, on your instrument.</div>
        </div>
      </div>
    </Stage>
  );
};
