import { useCurrentFrame } from "remotion";
import { Habit } from "../scenes/Habit";
import { Play } from "../scenes/Play";
import { C, LINEAR, OUT, Phone, rise, serif, Stage } from "../theme";
import { interpolate } from "remotion";
import { CanvasWindow, Closing, Opening, SidePhone, Split } from "./parts";
import { Reel, type Segment } from "./Reel";

const LEVELS = ["Foundations", "Building blocks", "Harmony basics", "Fluency on the instrument", "Colour and movement", "Advanced"];
const STEPS = [["Understand", "step-understand"], ["Listen", "step-listen"], ["Learn", "step-learn"], ["Practice", "step-practice"]];

const Intro = () => <Opening label="How it works" headline={<>How you learn with <span style={{ color: C.gold }}>Fretkey</span></>} />;

const Instrument = () => {
  const frame = useCurrentFrame();
  return (
    <Split label="Step 1" headline={<>Pick your <span style={{ color: C.gold }}>instrument.</span></>}>
      <div style={{ position: "absolute", left: 110, top: 520, display: "flex", gap: 26 }}>
        {["Guitar", "Piano"].map((name, i) => (
          <div key={name} style={{ ...rise(frame, 30 + i * 10, 30), fontSize: 56, fontWeight: 600, padding: "20px 60px", borderRadius: 60, border: `3px solid ${C.gold}`, color: i === 0 ? C.bg : C.gold, backgroundColor: i === 0 ? C.gold : "transparent" }}>{name}</div>
        ))}
      </div>
      <CanvasWindow />
    </Split>
  );
};

const Path = () => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="35% 45%">
      <div style={{ position: "absolute", left: 110, top: 70, fontFamily: serif, fontSize: 92, ...rise(frame, 2) }}>
        Six levels, <span style={{ color: C.gold }}>one path.</span>
      </div>
      <div style={{ position: "absolute", left: 110, top: 230, display: "flex", flexDirection: "column", gap: 18 }}>
        {LEVELS.map((name, i) => (
          <div key={name} style={{ ...rise(frame, 16 + i * 14, 40), display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ width: 82, height: 82, borderRadius: 41, backgroundColor: C.gold, color: C.bg, fontFamily: serif, fontSize: 54, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ fontSize: 56, fontWeight: 500 }}>{name}</div>
          </div>
        ))}
      </div>
      <SidePhone shot="path" left={1320} width={390} />
    </Stage>
  );
};

const FourSteps = () => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="50% 55%">
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: serif, fontSize: 96, ...rise(frame, 2) }}>
        Every lesson, <span style={{ color: C.gold }}>four steps.</span>
      </div>
      <div style={{ position: "absolute", left: 270, top: 200, display: "flex", gap: 80 }}>
        {STEPS.map(([name, shot], i) => (
          <div key={name} style={{ width: 285, opacity: interpolate(frame, [10 + i * 16, 24 + i * 16], [0, 1], LINEAR), translate: `0px ${interpolate(frame, [10 + i * 16, 40 + i * 16], [90, 0], OUT)}px` }}>
            <Phone shot={shot} width={285} active />
            <div style={{ marginTop: 26, textAlign: "center", fontSize: 42, fontWeight: 600, color: C.gold, whiteSpace: "nowrap" }}>
              {i + 1}. {name}
            </div>
          </div>
        ))}
      </div>
    </Stage>
  );
};

const SEGMENTS: Segment[] = [{ Visual: Intro }, { Visual: Instrument }, { Visual: Path }, { Visual: FourSteps }, { Visual: Play }, { Visual: Habit }, { Visual: () => <Closing line="Still being built." />, after: 40 }];
export const LEARN_SEGMENTS = SEGMENTS;
/** Reel 1: how you learn guitar or piano with Fretkey, start to finish. */
export const LearnReel = () => <Reel id="learn" segments={SEGMENTS} />;
