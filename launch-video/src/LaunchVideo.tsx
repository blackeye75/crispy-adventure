import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Series, staticFile, useCurrentFrame } from "remotion";
import { Canvas } from "./scenes/Canvas";
import { Cta } from "./scenes/Cta";
import { Habit } from "./scenes/Habit";
import { Hook } from "./scenes/Hook";
import { Lesson } from "./scenes/Lesson";
import { Logo } from "./scenes/Logo";
import { Numbers } from "./scenes/Numbers";
import { Play } from "./scenes/Play";
import { C, LINEAR } from "./theme";

// Where one scene hands over to the next.
const CUTS = [144, 288, 576, 936, 1224, 1440, 1656];

/** A gold line that sweeps across at every cut, like a plucked string. */
const Wipe = () => {
  const frame = useCurrentFrame();
  const cut = CUTS.find((c) => Math.abs(frame - c) <= 9);
  if (cut === undefined) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 10,
        backgroundColor: C.gold,
        boxShadow: "0 0 80px 24px rgba(236,178,63,0.55)",
        left: interpolate(frame, [cut - 9, cut + 9], [-60, 1980], LINEAR),
        opacity: interpolate(frame, [cut - 9, cut - 5, cut + 5, cut + 9], [0, 1, 1, 0], LINEAR),
      }}
    />
  );
};

/** Sixty seconds, 25 bars. Every cut falls on a bar line of the soundtrack (one bar = 72 frames). */
export const LaunchVideo = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Audio src={staticFile("music.wav")} />
    <Series>
      <Series.Sequence name="Hook" durationInFrames={144}>
        <Hook />
      </Series.Sequence>
      <Series.Sequence name="Logo" durationInFrames={144}>
        <Logo />
      </Series.Sequence>
      <Series.Sequence name="Theory Canvas" durationInFrames={288}>
        <Canvas />
      </Series.Sequence>
      <Series.Sequence name="Four steps" durationInFrames={360}>
        <Lesson />
      </Series.Sequence>
      <Series.Sequence name="Playing tracks" durationInFrames={288}>
        <Play />
      </Series.Sequence>
      <Series.Sequence name="Numbers" durationInFrames={216}>
        <Numbers />
      </Series.Sequence>
      <Series.Sequence name="Habit" durationInFrames={216}>
        <Habit />
      </Series.Sequence>
      <Series.Sequence name="Call to action" durationInFrames={144}>
        <Cta />
      </Series.Sequence>
    </Series>
    <Wipe />
  </AbsoluteFill>
);
