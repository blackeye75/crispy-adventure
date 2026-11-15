import { interpolate, useCurrentFrame } from "remotion";
import { C, OUT, rise, serif, Stage } from "../theme";

const LINE_1 = ["You", "know", "the", "shapes."];
const LINE_2 = ["Not", "why", "they", "work."];

/** The problem, in the player's own words. */
export const Hook = () => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="30% 55%">
      <div style={{ position: "absolute", left: 150, top: 300, fontFamily: serif, fontSize: 168, lineHeight: 1.12 }}>
        <div style={{ display: "flex", gap: 44 }}>
          {LINE_1.map((word, i) => (
            <span key={word} style={rise(frame, 6 + i * 7, 70)}>{word}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 44 }}>
          {LINE_2.map((word, i) => (
            <span key={word} style={{ ...rise(frame, 66 + i * 8, 70), color: word === "why" ? C.gold : C.muted, fontStyle: word === "why" ? "italic" : "normal" }}>{word}</span>
          ))}
        </div>
        <div style={{ height: 8, borderRadius: 4, marginTop: 34, backgroundColor: C.gold, width: interpolate(frame, [96, 128], [0, 1180], OUT) }} />
      </div>
    </Stage>
  );
};
