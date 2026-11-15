import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, OUT, rise, serif, Stage } from "../theme";

/** The name lands on the downbeat where the band comes in. */
export const Logo = () => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="50% 48%">
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: serif,
            fontSize: 300,
            fontWeight: 600,
            letterSpacing: -6,
            opacity: interpolate(frame, [0, 8], [0, 1], LINEAR),
            scale: interpolate(frame, [0, 26], [1.35, 1], { ...LINEAR, easing: Easing.spring({ damping: 14 }), output: "perceptual-scale" }),
          }}
        >
          Fret<span style={{ color: C.gold }}>key</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, backgroundColor: C.gold, width: interpolate(frame, [18, 48], [0, 760], OUT) }} />
        <div style={{ ...rise(frame, 34), fontSize: 78, marginTop: 48, color: C.text }}>Music theory, on your instrument.</div>
        <div style={{ display: "flex", gap: 28, marginTop: 56 }}>
          {["Guitar", "Piano"].map((name, i) => (
            <div key={name} style={{ ...rise(frame, 62 + i * 8, 30), fontSize: 50, fontWeight: 500, padding: "18px 54px", borderRadius: 60, border: `3px solid ${C.gold}`, color: C.gold }}>{name}</div>
          ))}
        </div>
      </div>
    </Stage>
  );
};
