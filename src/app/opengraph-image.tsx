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
          <div style={{ width: 96, height: 96, borderRadius: 48, background: "#eeb443", color: "#17140f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, fontWeight: 700 }}>F</div>
          <div style={{ fontSize: 44, color: "#eeb443", letterSpacing: 6 }}>FRETKEY</div>
        </div>
        <div style={{ fontSize: 92, marginTop: 56, lineHeight: 1.1 }}>Music theory, on your instrument.</div>
        <div style={{ fontSize: 38, marginTop: 36, color: "#b9b3a6" }}>Hear it. See it on the fretboard or keyboard. Play it.</div>
      </div>
    ),
    size,
  );
}
