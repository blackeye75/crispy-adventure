import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, Label, LINEAR, OUT, rise, serif, Stage } from "../theme";

// The screenshot is 2880 × 1800; it is shown 1240 wide.
const K = 1240 / 2880;
const REGIONS = [
  { name: "Fretboard", at: 70, x: 100, y: 305, w: 2060, h: 715 },
  { name: "Keyboard", at: 104, x: 100, y: 1125, w: 2060, h: 265 },
  { name: "Theory", at: 138, x: 2195, y: 305, w: 590, h: 1085 },
];
const SWITCH = 196; // the key changes here

/** The signature screen: one musical idea on the fretboard, the keyboard and in words, all linked. */
export const Canvas = () => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="70% 50%">
      <div style={{ position: "absolute", left: 90, top: 190, width: 520 }}>
        <Label style={rise(frame, 4)}>The Theory Canvas</Label>
        <div style={{ ...rise(frame, 14), fontFamily: serif, fontSize: 104, lineHeight: 1.06, marginTop: 30 }}>
          One idea.
          <br />
          <span style={{ color: C.gold }}>Three</span> linked views.
        </div>
        <div style={{ position: "relative", marginTop: 54, fontSize: 46, lineHeight: 1.3, color: C.muted, height: 260 }}>
          <div style={{ position: "absolute", opacity: interpolate(frame, [40, 56, SWITCH - 10, SWITCH], [0, 1, 1, 0], LINEAR) }}>Any scale, chord or progression, on both instruments at once.</div>
          <div style={{ position: "absolute", ...rise(frame, SWITCH + 4) }}>
            Change the key.
            <br />
            <span style={{ color: C.text }}>Everything follows.</span>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 150,
          width: 1240,
          height: 775,
          borderRadius: 26,
          overflow: "hidden",
          border: `3px solid ${C.line}`,
          boxShadow: "0 50px 140px rgba(0,0,0,0.7)",
          opacity: interpolate(frame, [8, 26], [0, 1], LINEAR),
          translate: interpolate(frame, [8, 40], ["120px 40px", "0px 0px"], OUT),
          scale: interpolate(frame, [8, 288], [0.96, 1.03], LINEAR),
        }}
      >
        <Img src={staticFile("shots/canvas.png")} style={{ position: "absolute", width: "100%" }} />
        <Img src={staticFile("shots/canvas-d.png")} style={{ position: "absolute", width: "100%", opacity: interpolate(frame, [SWITCH, SWITCH + 12], [0, 1], LINEAR) }} />
        {REGIONS.map((r) => (
          <div
            key={r.name}
            style={{
              position: "absolute",
              left: r.x * K,
              top: r.y * K,
              width: r.w * K,
              height: r.h * K,
              borderRadius: 16,
              border: `4px solid ${C.gold}`,
              boxShadow: "0 0 40px rgba(236,178,63,0.45)",
              opacity: interpolate(frame, [r.at, r.at + 8, SWITCH - 14, SWITCH - 4], [0, 1, 1, 0], LINEAR),
              scale: interpolate(frame, [r.at, r.at + 16], [1.06, 1], OUT),
            }}
          >
            <div style={{ position: "absolute", left: 14, top: -30, padding: "8px 22px", borderRadius: 30, backgroundColor: C.gold, color: C.bg, fontSize: 30, fontWeight: 600 }}>{r.name}</div>
          </div>
        ))}
      </div>
    </Stage>
  );
};
