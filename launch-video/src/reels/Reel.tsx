import { Audio } from "@remotion/media";
import type { FC } from "react";
import { AbsoluteFill, interpolate, Series, staticFile, useCurrentFrame } from "remotion";
import { C, FPS, LINEAR, sans } from "../theme";
import lines from "./voice.json";
import timing from "./voice-timing.json";

export type ReelId = keyof typeof lines;
/** One spoken line and what is on screen while it is said. `after` holds the picture for extra frames once the voice stops. */
export type Segment = { Visual: FC; after?: number };

const PAD = 14; // a breath between lines
const length = (id: ReelId, i: number, segment: Segment) => Math.ceil(timing[id][i] * FPS) + PAD + (segment.after ?? 0);
export const reelFrames = (id: ReelId, segments: Segment[]) => segments.reduce((sum, s, i) => sum + length(id, i, s), 0);
/** How long line `i` of a reel takes to say, in frames. */
export const voiceFrames = (id: ReelId, i: number) => Math.ceil(timing[id][i] * FPS);

/** The spoken line as a caption, for viewers with the sound off. */
const Caption = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "70px 180px 34px", background: "linear-gradient(transparent, rgba(10,9,7,0.94) 45%)", opacity: interpolate(frame, [0, 8], [0, 1], LINEAR) }}>
      <div style={{ fontFamily: sans, fontSize: 40, lineHeight: 1.3, fontWeight: 500, color: C.text, textAlign: "center" }}>{text}</div>
    </div>
  );
};

/**
 * A narrated reel: each line of voice.json is one segment, as long as its recording.
 * The focus track plays quietly underneath, and drops out over `quiet` (a frame range) when a segment has music of its own.
 */
export const Reel = ({ id, segments, quiet }: { id: ReelId; segments: Segment[]; quiet?: [number, number] }) => {
  const total = reelFrames(id, segments);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Audio
        src={staticFile("focus.wav")}
        trimBefore={6 * FPS} // start where the band is already in
        volume={(f) => {
          const bed = 0.16 * interpolate(f, [0, 20, total - 40, total], [0, 1, 1, 0], LINEAR);
          return quiet ? bed * interpolate(f, [quiet[0] - 20, quiet[0], quiet[1], quiet[1] + 20], [1, 0, 0, 1], LINEAR) : bed;
        }}
      />
      <Series>
        {segments.map((segment, i) => (
          <Series.Sequence key={i} name={lines[id][i].slice(0, 40)} durationInFrames={length(id, i, segment)}>
            <segment.Visual />
            <Audio src={staticFile(`vo/${id}-${i + 1}.wav`)} volume={0.78} /> {/* headroom: the recordings peak at full scale */}
            <Caption text={lines[id][i]} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
