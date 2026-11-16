import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas } from "../scenes/Canvas";
import { Habit } from "../scenes/Habit";
import { Lesson } from "../scenes/Lesson";
import { Logo } from "../scenes/Logo";
import { Numbers } from "../scenes/Numbers";
import { C, LINEAR } from "../theme";
import { ComingSoon } from "./ComingSoon";
import { PromoHook } from "./PromoHook";
import { Showcase } from "./Showcase";
import { Why } from "./Why";

// One bar of the focus track (80 bpm) is 90 frames. Scene lengths in bars; every cut falls on a bar line.
const BAR = 90;
export const PROMO_SCENES = [
  { name: "Hook", bars: 2, Scene: PromoHook },
  { name: "Why theory", bars: 3, Scene: Why },
  { name: "Logo", bars: 1, Scene: Logo },
  { name: "How a lesson works", bars: 4, Scene: Lesson },
  { name: "Eight lessons", bars: 8, Scene: Showcase },
  { name: "Theory Canvas", bars: 3, Scene: Canvas },
  { name: "The whole course", bars: 2, Scene: Numbers },
  { name: "Built to stick", bars: 2, Scene: Habit },
  { name: "Coming soon", bars: 3, Scene: ComingSoon },
];
export const PROMO_FRAMES = PROMO_SCENES.reduce((sum, s) => sum + s.bars, 0) * BAR;
const CUTS = PROMO_SCENES.slice(0, -1).reduce<number[]>((cuts, s) => [...cuts, (cuts[cuts.length - 1] ?? 0) + s.bars * BAR], []);

const Wipe = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
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
        left: interpolate(frame, [cut - 9, cut + 9], [-60, width + 60], LINEAR),
        opacity: interpolate(frame, [cut - 9, cut - 5, cut + 5, cut + 9], [0, 1, 1, 0], LINEAR),
      }}
    />
  );
};

/** The longer promo: why theory matters, how a lesson works, eight lessons, what is different, and an honest "coming soon". */
export const PromoVideo = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Audio src={staticFile("focus.wav")} />
    <Series>
      {PROMO_SCENES.map(({ name, bars, Scene }) => (
        <Series.Sequence key={name} name={name} durationInFrames={bars * BAR}>
          <Scene />
        </Series.Sequence>
      ))}
    </Series>
    <Wipe />
  </AbsoluteFill>
);
