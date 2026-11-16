import type { ReactNode } from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, Label, LINEAR, Mark, OUT, Phone, rise, serif, Stage } from "../theme";

/** A label and a headline on the left, anything on the right. The bottom 170px are left to the caption. */
export const Split = ({ label, headline, children, note, glow = "70% 45%" }: { label: string; headline: ReactNode; children: ReactNode; note?: ReactNode; glow?: string }) => {
  const frame = useCurrentFrame();
  return (
    <Stage glow={glow}>
      <div style={{ position: "absolute", left: 110, top: 150, width: 800 }}>
        <Label style={rise(frame, 2)}>{label}</Label>
        <div style={{ ...rise(frame, 8), fontFamily: serif, fontSize: 108, lineHeight: 1.06, marginTop: 26 }}>{headline}</div>
        {note && <div style={{ ...rise(frame, 30), fontSize: 46, lineHeight: 1.3, color: C.muted, marginTop: 40 }}>{note}</div>}
      </div>
      {children}
    </Stage>
  );
};

/** A phone that rises in on the right. */
export const SidePhone = ({ shot, left = 1250, width = 400, top = 70 }: { shot: string; left?: number; width?: number; top?: number }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left, top, opacity: interpolate(frame, [4, 16], [0, 1], LINEAR), translate: `0px ${interpolate(frame, [4, 34], [180, 0], OUT)}px`, rotate: `${interpolate(frame, [4, 34], [8, 3], OUT)}deg` }}>
      <Phone shot={shot} width={width} active />
    </div>
  );
};

/** The Theory Canvas screenshot in a window on the right. */
export const CanvasWindow = ({ shot = "canvas", left = 960, top = 150, width = 900 }: { shot?: string; left?: number; top?: number; width?: number }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left, top, width, height: width * 0.625, borderRadius: 22, overflow: "hidden", border: `3px solid ${C.line}`, boxShadow: "0 50px 140px rgba(0,0,0,0.7)", opacity: interpolate(frame, [4, 18], [0, 1], LINEAR), translate: `${interpolate(frame, [4, 34], [120, 0], OUT)}px 0px` }}>
      <Img src={staticFile(`shots/${shot}.png`)} style={{ width: "100%" }} />
    </div>
  );
};

/** The opening card of a reel. */
export const Opening = ({ label, headline }: { label: string; headline: ReactNode }) => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="50% 42%">
      <div style={{ position: "absolute", inset: 0, paddingBottom: 150, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Mark height={150} at={2} />
        <Label style={{ ...rise(frame, 18), marginTop: 44 }}>{label}</Label>
        <div style={{ ...rise(frame, 26, 50), fontFamily: serif, fontSize: 132, lineHeight: 1.08, textAlign: "center", marginTop: 22, width: 1500 }}>{headline}</div>
      </div>
    </Stage>
  );
};

/** The closing card: still being built, and where to follow. */
export const Closing = ({ line }: { line: ReactNode }) => {
  const frame = useCurrentFrame();
  return (
    <Stage glow="50% 45%">
      <div style={{ position: "absolute", inset: 0, paddingBottom: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...rise(frame, 2, 40), fontSize: 50, color: C.muted }}>{line}</div>
        <div style={{ ...rise(frame, 12, 60), fontFamily: serif, fontSize: 190, fontWeight: 600, lineHeight: 1.05, letterSpacing: -4 }}>
          Coming <span style={{ color: C.gold }}>soon.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 44 }}>
          <Mark height={104} at={30} />
          <div style={{ ...rise(frame, 44, 30), fontFamily: serif, fontSize: 100, fontWeight: 600 }}>
            Fret<span style={{ color: C.gold }}>key</span>
          </div>
        </div>
        <div style={{ ...rise(frame, 58, 30), fontSize: 44, color: C.muted, marginTop: 20 }}>
          Follow <span style={{ color: C.text, fontWeight: 600 }}>@fret.key</span> to be first in.
        </div>
      </div>
    </Stage>
  );
};
