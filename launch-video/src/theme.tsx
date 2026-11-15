import { loadFont } from "@remotion/fonts";
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// The app's own type and colours (src/app/globals.css), so the video looks like the product.
export const serif = "Fraunces";
export const sans = "Inter";
// Bundled from @fontsource (both SIL Open Font License), so rendering needs no network.
const font = (family: string, file: string, weight: string, style = "normal") => loadFont({ family, url: staticFile(`fonts/${file}.woff2`), weight, style });
void Promise.all([
  font(serif, "fraunces-latin-400-normal", "400"),
  font(serif, "fraunces-latin-600-normal", "600"),
  font(serif, "fraunces-latin-400-italic", "400", "italic"),
  font(sans, "inter-latin-400-normal", "400"),
  font(sans, "inter-latin-500-normal", "500"),
  font(sans, "inter-latin-600-normal", "600"),
]);
export const C = { bg: "#12110e", card: "#1c1b17", line: "#2e2c26", gold: "#ecb23f", text: "#f4f0e7", muted: "#a8a399", green: "#4cc38a" };
export const FPS = 30;
/** One bar of the soundtrack (100 bpm, 4/4). Every scene is a whole number of bars long. */
export const BAR = 72;

export const OUT = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) } as const;
export const LINEAR = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Fade and rise into place, starting at `at`. */
export const rise = (frame: number, at: number, distance = 40, length = 22): CSSProperties => ({
  opacity: interpolate(frame, [at, at + length * 0.7], [0, 1], LINEAR),
  translate: `0px ${interpolate(frame, [at, at + length], [distance, 0], OUT)}px`,
});

/** The dark stage every scene sits on: a slow warm glow and faint string lines, fading out at the end of the scene. */
export const Stage = ({ children, glow = "50% 40%" }: { children: ReactNode; glow?: string }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: sans, color: C.text }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 620px at ${glow}, rgba(236,178,63,0.16), transparent 70%)`,
          scale: interpolate(frame, [0, durationInFrames], [1, 1.25], LINEAR),
        }}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (height / 7) * (i + 1), height: 1, backgroundColor: "rgba(244,240,231,0.045)" }} />
      ))}
      <AbsoluteFill style={{ opacity: interpolate(frame, [durationInFrames - 9, durationInFrames - 1], [1, 0], LINEAR) }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** A phone showing one captured screen of the app. */
export const Phone = ({ shot, width = 300, style, active = false }: { shot: string; width?: number; style?: CSSProperties; active?: boolean }) => (
  <div
    style={{
      width,
      height: width * 2,
      borderRadius: width * 0.13,
      overflow: "hidden",
      border: `${Math.max(3, width * 0.012)}px solid ${active ? C.gold : "#3a372f"}`,
      boxShadow: active ? "0 40px 120px rgba(236,178,63,0.28), 0 30px 80px rgba(0,0,0,0.6)" : "0 30px 80px rgba(0,0,0,0.6)",
      backgroundColor: C.bg,
      ...style,
    }}
  >
    <Img src={staticFile(`shots/${shot}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
  </div>
);

/**
 * True in the 9:16 cut. Scenes then stack their content and keep it between about y 230 and y 1500:
 * Instagram covers the top and bottom of a reel with its own buttons and caption.
 */
export const useTall = () => {
  const { width, height } = useVideoConfig();
  return height > width;
};

const KEY = 288 / 5; // height of one white key in the stem of the mark

/**
 * The Fretkey mark (brand/render.mjs): an F whose stem is a strip of piano keys and whose arms are strings, with a note on the string.
 * From frame `at` it builds itself: the keyboard rises, the strings draw out, the note lands. Leave `at` out for a still mark.
 */
export const Mark = ({ height, at = -1000, style }: { height: number; at?: number; style?: CSSProperties }) => {
  const frame = useCurrentFrame();
  const stem = interpolate(frame, [at, at + 16], [0, 288], OUT);
  return (
    <svg viewBox="100 80 312 352" height={height} width={(height * 312) / 352} style={{ flexShrink: 0, overflow: "visible", ...style }}>
      <rect x={125} y={400 - stem} width={100} height={stem} rx={14} fill={C.text} />
      <rect x={185} y={112} width={interpolate(frame, [at + 12, at + 26], [0, 196], OUT)} height={34} rx={17} fill={C.text} />
      <rect x={185} y={214} width={interpolate(frame, [at + 16, at + 28], [0, 150], OUT)} height={34} rx={17} fill={C.text} />
      <g opacity={interpolate(frame, [at + 12, at + 20], [0, 1], LINEAR)} fill={C.bg}>
        {[1, 2, 3, 4].map((k) => (
          <rect key={`line${k}`} x={125} y={112 + k * KEY - 2.5} width={100} height={5} />
        ))}
        {[1, 2, 4].map((k) => (
          <rect key={`black${k}`} x={124} y={112 + k * KEY - 16} width={interpolate(frame, [at + 14 + k * 2, at + 24 + k * 2], [0, 60], OUT)} height={32} rx={5} />
        ))}
      </g>
      <circle cx={345} cy={231} r={interpolate(frame, [at + 26, at + 40], [0, 40], { ...LINEAR, easing: Easing.spring({ damping: 9 }) })} fill={C.gold} />
    </svg>
  );
};

export const Label = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: 7, textTransform: "uppercase", color: C.gold, ...style }}>{children}</div>
);
