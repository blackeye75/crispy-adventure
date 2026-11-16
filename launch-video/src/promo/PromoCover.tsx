import { AbsoluteFill, useVideoConfig } from "remotion";
import { C, Mark, sans, serif } from "../theme";

/**
 * The cover image for the promo reel: its opening line, a plucked string, and "Coming soon".
 * Everything sits in the middle of the frame, inside the crop Instagram shows on the profile grid.
 */
export const PromoCover = () => {
  const { width } = useVideoConfig();
  // the string from the hook, frozen mid-ring
  const points = Array.from({ length: 81 }, (_, i) => `${((i / 80) * width).toFixed(1)},${(70 + Math.sin((i / 80) * Math.PI) * Math.sin((i / 80) * Math.PI * 3 + 0.6) * 44).toFixed(1)}`);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: sans, color: C.text, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: "radial-gradient(760px 760px at 50% 50%, rgba(236,178,63,0.2), transparent 72%)" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: 8, textTransform: "uppercase", color: C.bg, backgroundColor: C.gold, padding: "12px 34px", borderRadius: 40 }}>Coming soon</div>
        <svg width={width} height={140} style={{ marginTop: 50 }}>
          <polyline points={points.join(" ")} fill="none" stroke={C.gold} strokeWidth={5} />
        </svg>
        <div style={{ fontFamily: serif, fontSize: 64, lineHeight: 1.15, textAlign: "center", color: C.muted, marginTop: 44 }}>
          Tabs showed you <span style={{ color: C.gold }}>where</span>
          <br />
          to put your fingers.
        </div>
        <div style={{ fontFamily: serif, fontSize: 150, lineHeight: 1.04, textAlign: "center", marginTop: 36 }}>
          Nobody told
          <br />
          you <span style={{ color: C.gold, fontStyle: "italic" }}>why.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 70 }}>
          <Mark height={104} />
          <div style={{ fontFamily: serif, fontSize: 100, fontWeight: 600, letterSpacing: -2 }}>
            Fret<span style={{ color: C.gold }}>key</span>
          </div>
        </div>
        <div style={{ fontSize: 40, color: C.muted, marginTop: 14 }}>Music theory, on your instrument.</div>
      </div>
    </AbsoluteFill>
  );
};
