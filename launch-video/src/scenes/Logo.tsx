import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, Mark, OUT, rise, serif, Stage, useTall } from "../theme";

/** The name lands on the downbeat where the band comes in. */
export const Logo = () => {
  const frame = useCurrentFrame();
  const tall = useTall();
  return (
    <Stage glow="50% 48%">
      <div style={{ position: "absolute", inset: 0, paddingBottom: tall ? 120 : 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: tall ? "column" : "row", alignItems: "center", gap: tall ? 30 : 56 }}>
          <Mark height={tall ? 300 : 270} at={2} />
          <div
            style={{
              fontFamily: serif,
              fontSize: tall ? 250 : 290,
              fontWeight: 600,
              letterSpacing: -6,
              lineHeight: 1.05,
              opacity: interpolate(frame, [14, 24], [0, 1], LINEAR),
              translate: `${interpolate(frame, [14, 40], [tall ? 0 : 90, 0], { ...LINEAR, easing: Easing.spring({ damping: 14 }) })}px 0px`,
            }}
          >
            Fret<span style={{ color: C.gold }}>key</span>
          </div>
        </div>
        <div style={{ height: 5, borderRadius: 3, backgroundColor: C.gold, width: interpolate(frame, [34, 62], [0, tall ? 620 : 760], OUT) }} />
        <div style={{ ...rise(frame, 48), fontSize: tall ? 80 : 78, marginTop: 48, color: C.text, textAlign: "center", width: tall ? 800 : undefined, lineHeight: 1.2 }}>Music theory, on your instrument.</div>
        <div style={{ display: "flex", gap: 28, marginTop: 56 }}>
          {["Guitar", "Piano"].map((name, i) => (
            <div key={name} style={{ ...rise(frame, 72 + i * 8, 30), fontSize: 50, fontWeight: 500, padding: "18px 54px", borderRadius: 60, border: `3px solid ${C.gold}`, color: C.gold }}>{name}</div>
          ))}
        </div>
      </div>
    </Stage>
  );
};
