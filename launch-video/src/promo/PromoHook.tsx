import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, LINEAR, OUT, rise, serif, Stage } from "../theme";

const PLUCKS = [0, 90]; // one on each bar line

/** A guitar string across the frame that is plucked on each bar and rings down. */
const String = ({ y }: { y: number }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const since = Math.min(...PLUCKS.filter((p) => p <= frame).map((p) => frame - p));
  const amp = 46 * Math.exp(-since / 22);
  const points = Array.from({ length: 81 }, (_, i) => {
    const x = (i / 80) * width;
    const wave = Math.sin((i / 80) * Math.PI) * Math.sin((i / 80) * Math.PI * 3 + frame * 0.9) * amp;
    return `${x.toFixed(1)},${(y + wave).toFixed(1)}`;
  });
  return (
    <svg width={width} height={y + 80} style={{ position: "absolute", left: 0, top: 0 }}>
      <polyline points={points.join(" ")} fill="none" stroke={C.gold} strokeWidth={4} opacity={0.85} />
    </svg>
  );
};

/** The hook: what tabs gave every self-taught player, and what they left out. */
export const PromoHook = () => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="50% 60%">
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#000", opacity: interpolate(frame, [0, 40], [0.8, 0], LINEAR) }} />
      <String y={150} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 270, fontFamily: serif }}>
        <div style={{ fontSize: 104, lineHeight: 1.12, opacity: interpolate(frame, [84, 104], [1, 0.4], LINEAR) }}>
          <div style={rise(frame, 8, 50)}>
            Tabs showed you <span style={{ color: C.gold }}>where</span>
          </div>
          <div style={rise(frame, 26, 50)}>to put your fingers.</div>
        </div>
        <div style={{ fontSize: 168, lineHeight: 1.05, marginTop: 50 }}>
          <div style={rise(frame, 92, 80)}>
            Nobody told you <span style={{ color: C.gold, fontStyle: "italic" }}>why.</span>
          </div>
        </div>
        <div style={{ height: 8, borderRadius: 4, marginTop: 30, backgroundColor: C.gold, width: interpolate(frame, [120, 160], [0, 1500], OUT) }} />
      </div>
    </Stage>
  );
};
