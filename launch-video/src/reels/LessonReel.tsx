import { useCurrentFrame } from "remotion";
import { Canvas } from "../scenes/Canvas";
import { C, Label, rise, serif, Stage } from "../theme";
import { Closing, Opening, SidePhone } from "./parts";
import { Reel, type Segment } from "./Reel";

/** One step of the lesson: its number and name, what it gives you, and its real screen. */
const Step = ({ n, name, shot, points }: { n: number; name: string; shot: string; points: string[] }) => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="68% 45%">
      <div style={{ position: "absolute", left: 130, top: 130, width: 1000 }}>
        <Label style={rise(frame, 2)}>Step {n} of 4</Label>
        <div style={{ ...rise(frame, 8, 60), fontFamily: serif, fontSize: 200, fontWeight: 600, lineHeight: 1.04, marginTop: 10, color: C.gold }}>{name}</div>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 22 }}>
          {points.map((point, i) => (
            <div key={point} style={{ ...rise(frame, 34 + i * 18, 36), display: "flex", alignItems: "baseline", gap: 24, fontSize: 54, lineHeight: 1.2 }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: C.gold, flexShrink: 0, translate: "0px -8px" }} />
              {point}
            </div>
          ))}
        </div>
      </div>
      <SidePhone shot={shot} left={1290} width={410} top={50} />
      <div style={{ position: "absolute", left: 130, top: 60, display: "flex", gap: 12 }}>
        {[1, 2, 3, 4].map((k) => (
          <div key={k} style={{ width: k === n ? 90 : 40, height: 10, borderRadius: 5, backgroundColor: k <= n ? C.gold : C.line }} />
        ))}
      </div>
    </Stage>
  );
};

const SEGMENTS: Segment[] = [
  { Visual: () => <Opening label="Inside one lesson" headline={<>How a Fretkey lesson works, in <span style={{ color: C.gold }}>four steps</span></>} note={<>Example lesson: <span style={{ color: C.text, fontWeight: 600 }}>“The seven modes”</span></>} /> },
  { Visual: () => <Step n={1} name="Understand" shot="step-understand" points={["Short and plain", "No jargon before it is taught"]} /> },
  { Visual: () => <Step n={2} name="Listen" shot="step-listen" points={["Hear it first", "Tap to play each example"]} /> },
  { Visual: () => <Step n={3} name="Learn" shot="step-learn" points={["On your own instrument", "Tap any note to hear it"]} /> },
  { Visual: () => <Step n={4} name="Practice" shot="step-practice" points={["Quick drills", "The answer and the reason, at once"]} /> },
  { Visual: Canvas },
  { Visual: () => <Closing line="5 to 8 minutes. One idea." />, after: 40 },
];
export const LESSON_SEGMENTS = SEGMENTS;
/** Reel 2: how to follow a lesson, walked through on a real one. */
export const LessonReel = () => <Reel id="lesson" segments={SEGMENTS} />;
