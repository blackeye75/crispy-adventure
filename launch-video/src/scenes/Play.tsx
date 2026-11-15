import { interpolate, useCurrentFrame } from "remotion";
import { C, Label, LINEAR, OUT, Phone, rise, serif, Stage } from "../theme";

const PHONES = [
  { shot: "strum", rotate: -7, x: 0, y: 46, tag: "Strum patterns" },
  { shot: "tab", rotate: 0, x: 330, y: 0, tag: "Playable tab" },
  { shot: "hands", rotate: 7, x: 660, y: 46, tag: "Both hands" },
];
const TRACKS = ["Strumming", "Lead guitar", "Fingerstyle", "Piano accompaniment"];

/** Theory is half of it: the playing tracks. */
export const Play = () => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="68% 55%">
      <div style={{ position: "absolute", left: 100, top: 130, width: 780 }}>
        <Label style={rise(frame, 4)}>Playing tracks</Label>
        <div style={{ ...rise(frame, 12), fontFamily: serif, fontSize: 128, lineHeight: 1.04, marginTop: 28, whiteSpace: "nowrap" }}>
          Then <span style={{ color: C.gold }}>play it.</span>
        </div>
        <div style={{ marginTop: 50, display: "flex", flexWrap: "wrap", gap: 20 }}>
          {TRACKS.map((name, i) => (
            <div key={name} style={{ ...rise(frame, 50 + i * 12, 30), fontSize: 44, fontWeight: 500, padding: "16px 36px", borderRadius: 50, backgroundColor: C.card, border: `2px solid ${C.line}` }}>{name}</div>
          ))}
        </div>
        <div style={{ ...rise(frame, 150), marginTop: 50, fontSize: 46, lineHeight: 1.3, color: C.muted }}>
          Every pattern plays with a click.
          <br />
          <span style={{ color: C.text }}>Backing tracks to solo over.</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 150 }}>
        {PHONES.map((p, i) => (
          <div
            key={p.shot}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              zIndex: i === 1 ? 2 : 1,
              opacity: interpolate(frame, [16 + i * 10, 30 + i * 10], [0, 1], LINEAR),
              translate: `0px ${interpolate(frame, [16 + i * 10, 50 + i * 10], [260, 0], OUT)}px`,
              rotate: `${interpolate(frame, [16 + i * 10, 50 + i * 10], [p.rotate * 2.4, p.rotate], OUT)}deg`,
            }}
          >
            <Phone shot={p.shot} width={340} active={i === 1} />
            <div style={{ ...rise(frame, 96 + i * 14, 24), marginTop: 26, textAlign: "center", fontSize: 38, fontWeight: 600, color: C.gold }}>{p.tag}</div>
          </div>
        ))}
      </div>
    </Stage>
  );
};
