import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FPS, Label, LINEAR, OUT, rise, serif, Stage } from "../theme";
import { CanvasWindow, Closing, Opening, Split } from "./parts";
import { Reel, reelFrames, voiceFrames, type Segment } from "./Reel";

const FORM = ["A", "A", "A", "A", "D", "D", "A", "A", "E", "D", "A", "A"];
const NUMERAL: Record<string, string> = { A: "I", D: "IV", E: "V" };
const BAR = 2 * FPS; // public/blues.wav: 120 bpm, so a bar of four beats lasts two seconds
const MUSIC = 12 * BAR + Math.round(2.5 * FPS);

/** The three chords as cards: first as numerals, then with their names in A. */
const Chords = ({ named }: { named: boolean }) => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="50% 45%">
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}>
        <Label style={rise(frame, 2)}>{named ? "In the key of A" : "Three chords"}</Label>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", gap: 70 }}>
        {["A", "D", "E"].map((chord, i) => (
          <div key={chord} style={{ ...rise(frame, 8 + i * 12, 70), width: 420, height: 520, borderRadius: 40, backgroundColor: C.card, border: `3px solid ${C.gold}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: serif, fontSize: named ? 110 : 260, fontWeight: 600, color: named ? C.muted : C.gold, lineHeight: 1 }}>{NUMERAL[chord]}</div>
            {named && <div style={{ ...rise(frame, 16 + i * 12, 40), fontFamily: serif, fontSize: 260, fontWeight: 600, color: C.gold, lineHeight: 1.05 }}>{chord}</div>}
            <div style={{ fontSize: 40, color: C.muted, marginTop: 14 }}>{["the one", "the four", "the five"][i]}</div>
          </div>
        ))}
      </div>
    </Stage>
  );
};

/** The twelve bars as a grid. `rows` are shown so far; `row` is the one being talked about; `bar` is the one sounding. */
const Grid = ({ rows, row, bar, title }: { rows: number; row?: number; bar?: number; title: string }) => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="50% 50%">
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: serif, fontSize: 84 }}>{title}</div>
      <div style={{ position: "absolute", left: 250, top: 200, display: "grid", gridTemplateColumns: "repeat(4, 330px)", gap: 24 }}>
        {FORM.map((chord, i) => {
          const r = Math.floor(i / 4);
          if (r >= rows) return <div key={i} style={{ height: 200, borderRadius: 28, border: `3px dashed ${C.line}` }} />;
          const fresh = r === row; // the row this line of the voice-over introduces
          const sounding = bar === i;
          const lit = sounding || (bar === undefined && fresh);
          return (
            <div
              key={i}
              style={{
                height: 200,
                borderRadius: 28,
                backgroundColor: lit ? C.gold : C.card,
                border: `3px solid ${lit || fresh ? C.gold : C.line}`,
                color: lit ? C.bg : C.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 22,
                opacity: fresh ? interpolate(frame, [4 + (i % 4) * 6, 14 + (i % 4) * 6], [0, 1], LINEAR) : bar !== undefined && !sounding ? 0.55 : 1,
                scale: fresh ? interpolate(frame, [4 + (i % 4) * 6, 22 + (i % 4) * 6], [0.8, 1], { ...OUT, output: "perceptual-scale" }) : sounding ? "1.05" : "1",
              }}
            >
              <span style={{ fontFamily: serif, fontSize: 130, fontWeight: 600, lineHeight: 1 }}>{chord}</span>
              <span style={{ fontSize: 44, fontWeight: 600, opacity: 0.7 }}>{NUMERAL[chord]}</span>
              <span style={{ position: "absolute", fontSize: 30, translate: "-125px -72px", opacity: 0.6 }}>{i + 1}</span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

/** The whole form played once, each bar lighting as it sounds. The music starts when the voice has finished. */
const Listen = () => {
  const frame = useCurrentFrame();
  const start = voiceFrames("blues", 6) + 8;
  const bar = frame < start ? undefined : Math.min(11, Math.floor((frame - start) / BAR));
  return (
    <>
      <Grid rows={3} bar={bar} title="Twelve bars in A" />
      <Sequence from={start} layout="none">
        <Audio src={staticFile("blues.wav")} volume={0.75} />
      </Sequence>
    </>
  );
};

const Pentatonic = () => (
  <Split label="Solo over it" headline={<>One scale fits <span style={{ color: C.gold }}>all twelve bars.</span></>} note="A minor pentatonic: A C D E G">
    <CanvasWindow />
  </Split>
);

const SEGMENTS: Segment[] = [
  { Visual: () => <Opening label="One lesson, start to finish" headline={<>The <span style={{ color: C.gold }}>12-bar</span> blues</>} /> },
  { Visual: () => <Chords named={false} /> },
  { Visual: () => <Chords named /> },
  { Visual: () => <Grid rows={1} row={0} title="Bars 1 to 4" /> },
  { Visual: () => <Grid rows={2} row={1} title="Bars 5 to 8" /> },
  { Visual: () => <Grid rows={3} row={2} title="Bars 9 to 12" /> },
  { Visual: Listen, after: MUSIC },
  { Visual: Pentatonic },
  { Visual: () => <Closing line="One of more than 250 lessons." />, after: 40 },
];
export const BLUES_SEGMENTS = SEGMENTS;
// The background track drops out while the blues plays.
const before = reelFrames("blues", SEGMENTS.slice(0, 6));
/** Reel 3: one lesson explained completely, with the music it describes. */
export const BluesReel = () => <Reel id="blues" segments={SEGMENTS} quiet={[before + voiceFrames("blues", 6), before + voiceFrames("blues", 6) + 14 + MUSIC]} />;
