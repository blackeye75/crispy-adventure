import { ImageResponse } from "next/og";

export const alt = "Fretkey: music theory on your instrument";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The preview shown when a Fretkey link is shared. */
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 96, background: "#17140f", color: "#f3efe6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* the mark, drawn with boxes: a strip of piano keys for the stem, two strings for the arms, a note on the string */}
          <div style={{ position: "relative", width: 88, height: 96, display: "flex" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 33, height: 96, borderRadius: 5, background: "#f3efe6" }} />
            <div style={{ position: "absolute", left: 20, top: 0, width: 65, height: 11, borderRadius: 6, background: "#f3efe6" }} />
            <div style={{ position: "absolute", left: 20, top: 34, width: 50, height: 11, borderRadius: 6, background: "#f3efe6" }} />
            {[1, 2, 3, 4].map((k) => (
              <div key={`line${k}`} style={{ position: "absolute", left: 0, top: k * 19.2 - 1, width: 33, height: 2, background: "#17140f" }} />
            ))}
            {[1, 2, 4].map((k) => (
              <div key={`black${k}`} style={{ position: "absolute", left: 0, top: k * 19.2 - 5.5, width: 20, height: 11, borderRadius: 2, background: "#17140f" }} />
            ))}
            <div style={{ position: "absolute", left: 60, top: 26, width: 27, height: 27, borderRadius: 14, background: "#eeb443" }} />
          </div>
          <div style={{ fontSize: 44, color: "#eeb443", letterSpacing: 6 }}>FRETKEY</div>
        </div>
        <div style={{ fontSize: 92, marginTop: 56, lineHeight: 1.1 }}>Music theory, on your instrument.</div>
        <div style={{ fontSize: 38, marginTop: 36, color: "#b9b3a6" }}>Hear it. See it on the fretboard or keyboard. Play it.</div>
      </div>
    ),
    size,
  );
}
