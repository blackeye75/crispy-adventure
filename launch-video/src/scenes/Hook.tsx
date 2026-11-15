import { interpolate, useCurrentFrame } from "remotion";
import { C, LINEAR, OUT, rise, serif, Stage, useTall } from "../theme";

const BEAT = 18; // frames; the intro of the soundtrack plucks one note per beat
const CELL = { w: 92, h: 118 };
// An open C chord, the shape nearly every guitarist learns first: [string from the left, fret], and the beat each finger lands on.
const DOTS = [
  { string: 1, fret: 3, at: BEAT },
  { string: 2, fret: 2, at: BEAT * 2 },
  { string: 4, fret: 1, at: BEAT * 3 },
];
const TURN = BEAT * 4; // bar 2: the familiar shape becomes a question
const ASK = BEAT * 6;

/**
 * The opening. Out of the dark, a chord the viewer has played a thousand times appears one finger at a time.
 * Then it turns into a question, and the viewer is asked for sixty seconds to get the answer.
 */
export const Hook = () => {
  const frame = useCurrentFrame();
  const tall = useTall();
  const pulse = interpolate(frame % BEAT, [0, 5, BEAT], [1.16, 1, 1], LINEAR); // everything breathes on the beat
  const grid = { left: tall ? 310 : 1240, top: tall ? 330 : 250 };
  return (
    <Stage glow={tall ? "50% 32%" : "76% 48%"}>
      {/* darkness that opens slowly, and a slow push in */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#000", opacity: interpolate(frame, [0, 60], [0.85, 0], LINEAR) }} />
      <div style={{ position: "absolute", inset: 0, scale: interpolate(frame, [0, 144], [1, 1.07], LINEAR), transformOrigin: tall ? "50% 35%" : "70% 50%" }}>
        <div style={{ position: "absolute", ...grid, width: CELL.w * 5, height: CELL.h * 4, opacity: interpolate(frame, [TURN, TURN + 20], [1, 0.75], LINEAR) }}>
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <div key={`s${s}`} style={{ position: "absolute", left: s * CELL.w - 1, top: 0, width: 3, backgroundColor: "rgba(244,240,231,0.5)", height: interpolate(frame, [s * 2, 22 + s * 2], [0, CELL.h * 4], OUT) }} />
          ))}
          {[0, 1, 2, 3, 4].map((f) => (
            <div key={`f${f}`} style={{ position: "absolute", top: f * CELL.h - (f === 0 ? 5 : 1), left: 0, height: f === 0 ? 10 : 3, backgroundColor: f === 0 ? C.text : "rgba(244,240,231,0.5)", width: interpolate(frame, [4 + f * 2, 26 + f * 2], [0, CELL.w * 5], OUT) }} />
          ))}
          {DOTS.map((dot, i) => {
            const x = dot.string * CELL.w;
            const y = (dot.fret - 0.5) * CELL.h;
            const asked = frame >= TURN + i * 5;
            return (
              <div key={i}>
                {/* a ring ripples out as each finger lands */}
                <div
                  style={{
                    position: "absolute",
                    left: x - 36,
                    top: y - 36,
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    border: `3px solid ${C.gold}`,
                    opacity: frame < dot.at ? 0 : interpolate(frame, [dot.at, dot.at + 24], [0.9, 0], LINEAR),
                    scale: interpolate(frame, [dot.at, dot.at + 24], [1, 3.4], OUT),
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: x - 36,
                    top: y - 36,
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: asked ? C.bg : C.gold,
                    border: `4px solid ${C.gold}`,
                    color: C.gold,
                    fontFamily: serif,
                    fontSize: 50,
                    fontWeight: 600,
                    boxShadow: "0 0 50px rgba(236,178,63,0.6)",
                    // a short flicker as the dot turns into a question mark
                    opacity: frame < dot.at ? 0 : frame >= TURN + i * 5 - 6 && frame < TURN + i * 5 ? (frame % 2 ? 0.25 : 1) : 1,
                    scale: `${frame < dot.at ? 0 : interpolate(frame, [dot.at, dot.at + 10], [1.7, 1], OUT) * pulse}`,
                  }}
                >
                  {asked ? "?" : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: "absolute", left: tall ? 90 : 130, top: tall ? 930 : 250, width: tall ? 900 : 1000 }}>
        <div style={{ fontFamily: serif, fontSize: tall ? 92 : 100, lineHeight: 1.14, opacity: interpolate(frame, [TURN - 6, TURN + 14], [1, 0.38], LINEAR) }}>
          <div style={rise(frame, 10, 50)}>You have played this</div>
          <div style={rise(frame, 30, 50)}>a thousand times.</div>
        </div>
        <div style={{ fontFamily: serif, fontSize: tall ? 128 : 142, lineHeight: 1.08, marginTop: tall ? 40 : 46 }}>
          <div style={rise(frame, TURN + 6, 70)}>Do you know</div>
          <div style={rise(frame, TURN + 20, 70)}>
            <span style={{ color: C.gold, fontStyle: "italic" }}>why</span> it works?
          </div>
        </div>
        <div style={{ ...rise(frame, ASK, 30), marginTop: tall ? 60 : 56, display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ fontSize: tall ? 58 : 60, fontWeight: 500, letterSpacing: 2, color: C.text, whiteSpace: "nowrap" }}>Give it 60 seconds.</div>
          <div style={{ height: 5, borderRadius: 3, backgroundColor: C.gold, width: interpolate(frame, [ASK + 6, 140], [0, tall ? 330 : 420], LINEAR) }} />
        </div>
      </div>
    </Stage>
  );
};
