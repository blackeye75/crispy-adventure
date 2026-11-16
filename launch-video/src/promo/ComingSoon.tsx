import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, Label, LINEAR, Mark, OUT, rise, serif, Stage, useTall } from "../theme";

const DONE = ["236 lessons written", "Guitar and piano, side by side", "Practice room and daily review"];
const DOING = ["Real instrument sounds", "Demo videos for every technique", "Android and iOS apps"];
const TURN = 140; // the status board gives way to the close

/** An honest status, then the close: this is still being built. */
export const ComingSoon = () => {
  const frame = useCurrentFrame();
  const tall = useTall();
  return (
    <Stage glow="50% 50%">
      <div style={{ position: "absolute", inset: 0, opacity: interpolate(frame, [TURN - 14, TURN], [1, 0], LINEAR) }}>
        <div style={{ position: "absolute", left: tall ? 80 : 140, right: tall ? 80 : undefined, top: tall ? 250 : 110 }}>
          <Label style={rise(frame, 4)}>Where we are</Label>
          <div style={{ ...rise(frame, 12), fontFamily: serif, fontSize: tall ? 108 : 120, lineHeight: 1.05, marginTop: 20 }}>
            We are still <span style={{ color: C.gold }}>building.</span>
          </div>
        </div>
        {[DONE, DOING].map((list, column) => (
          <div key={column} style={{ position: "absolute", left: tall ? 80 : 140 + column * 860, top: tall ? 590 + column * 440 : 470, width: tall ? 920 : 800 }}>
            <div style={{ ...rise(frame, 30 + column * 30, 30), fontSize: 36, fontWeight: 600, letterSpacing: 5, textTransform: "uppercase", color: C.muted }}>{column === 0 ? "Built" : "In progress"}</div>
            {list.map((item, i) => {
              const at = 40 + column * 30 + i * 12;
              return (
                <div key={item} style={{ ...rise(frame, at, 36), display: "flex", alignItems: "center", gap: 26, marginTop: tall ? 28 : 34, fontSize: tall ? 46 : 52 }}>
                  {column === 0 ? (
                    <div style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: C.green, color: C.bg, fontSize: 34, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, scale: interpolate(frame, [at + 6, at + 18], [0, 1], { ...LINEAR, easing: Easing.spring({ damping: 10 }) }) }}>✓</div>
                  ) : (
                    // a ring that keeps turning: work in progress
                    <div style={{ width: 50, height: 50, borderRadius: 25, border: `6px solid ${C.line}`, borderTopColor: C.gold, flexShrink: 0, rotate: `${frame * 9}deg` }} />
                  )}
                  {item}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", inset: 0, paddingBottom: tall ? 160 : 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: interpolate(frame, [TURN, TURN + 10], [0, 1], LINEAR) }}>
        <div style={{ fontFamily: serif, fontSize: tall ? 220 : 210, fontWeight: 600, lineHeight: 1, letterSpacing: -4, textAlign: "center", scale: interpolate(frame, [TURN, TURN + 30], [1.25, 1], { ...LINEAR, easing: Easing.spring({ damping: 14 }), output: "perceptual-scale" }) }}>
          Coming{tall ? <br /> : " "}<span style={{ color: C.gold }}>soon.</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, backgroundColor: C.gold, marginTop: 30, width: interpolate(frame, [TURN + 20, TURN + 50], [0, tall ? 620 : 900], OUT) }} />
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 64 }}>
          <Mark height={120} at={TURN + 30} />
          <div style={{ ...rise(frame, TURN + 44, 30), fontFamily: serif, fontSize: 116, fontWeight: 600 }}>
            Fret<span style={{ color: C.gold }}>key</span>
          </div>
        </div>
        <div style={{ ...rise(frame, TURN + 62, 30), fontSize: tall ? 44 : 50, color: C.muted, marginTop: 26 }}>
          Follow <span style={{ color: C.text, fontWeight: 600 }}>@fret.key</span> to be first in.
        </div>
      </div>
    </Stage>
  );
};
