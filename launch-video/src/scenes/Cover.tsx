import { AbsoluteFill } from "remotion";
import { C, Mark, sans, serif } from "../theme";

const CELL = { w: 96, h: 112 };
// The open C chord from the opening of the video, with its fingers turned into question marks.
const DOTS = [
  { string: 1, fret: 3 },
  { string: 2, fret: 2 },
  { string: 4, fret: 1 },
];

/**
 * The cover image for the launch post. Everything sits in the middle of the frame, inside the square
 * Instagram crops to on the profile grid, so it works as a reel cover (9:16) and as a feed post (4:5).
 */
export const Cover = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: sans, color: C.text, alignItems: "center", justifyContent: "center" }}>
    <AbsoluteFill style={{ background: "radial-gradient(760px 760px at 50% 50%, rgba(236,178,63,0.2), transparent 72%)" }} />
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 940 }}>
      <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: 8, textTransform: "uppercase", color: C.bg, backgroundColor: C.gold, padding: "12px 34px", borderRadius: 40 }}>Now live</div>

      <div style={{ position: "relative", width: CELL.w * 5, height: CELL.h * 4, marginTop: 64 }}>
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <div key={`s${s}`} style={{ position: "absolute", left: s * CELL.w - 1, top: 0, width: 3, height: CELL.h * 4, backgroundColor: "rgba(244,240,231,0.5)" }} />
        ))}
        {[0, 1, 2, 3, 4].map((f) => (
          <div key={`f${f}`} style={{ position: "absolute", top: f * CELL.h - (f === 0 ? 5 : 1), left: 0, width: CELL.w * 5, height: f === 0 ? 10 : 3, backgroundColor: f === 0 ? C.text : "rgba(244,240,231,0.5)" }} />
        ))}
        {DOTS.map((dot) => (
          <div
            key={dot.string}
            style={{
              position: "absolute",
              left: dot.string * CELL.w - 38,
              top: (dot.fret - 0.5) * CELL.h - 38,
              width: 76,
              height: 76,
              borderRadius: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: C.bg,
              border: `5px solid ${C.gold}`,
              color: C.gold,
              fontFamily: serif,
              fontSize: 52,
              fontWeight: 600,
              boxShadow: "0 0 60px rgba(236,178,63,0.65)",
            }}
          >
            ?
          </div>
        ))}
      </div>

      <div style={{ fontFamily: serif, fontSize: 124, lineHeight: 1.06, textAlign: "center", marginTop: 70 }}>
        Do you know
        <br />
        <span style={{ color: C.gold, fontStyle: "italic" }}>why</span> it works?
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 64 }}>
        <Mark height={104} />
        <div style={{ fontFamily: serif, fontSize: 100, fontWeight: 600, letterSpacing: -2 }}>
          Fret<span style={{ color: C.gold }}>key</span>
        </div>
      </div>
      <div style={{ fontSize: 40, color: C.muted, marginTop: 14 }}>Music theory, on your instrument.</div>
    </div>
  </AbsoluteFill>
);
