import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { C, Mark, sans, serif } from "../theme";
import { gold, Piano } from "./kit";

/** The frame all three lesson-reel covers share. Content sits between y 300 and 1600, inside the profile-grid crop. */
const Cover = ({ tag, children, line }: { tag: string; children: ReactNode; line: ReactNode }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg, color: C.text, fontFamily: sans, alignItems: "center" }}>
    <AbsoluteFill style={{ background: "radial-gradient(820px 900px at 50% 45%, rgba(236,178,63,0.2), transparent 72%)" }} />
    <div style={{ marginTop: 320, fontSize: 34, fontWeight: 600, letterSpacing: 8, textTransform: "uppercase", color: C.bg, backgroundColor: C.gold, padding: "12px 34px", borderRadius: 40 }}>{tag}</div>
    <div style={{ position: "relative", width: 1080, height: 860, marginTop: 30 }}>{children}</div>
    <div style={{ fontSize: 50, fontWeight: 500, textAlign: "center", width: 900, lineHeight: 1.25 }}>{line}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 50 }}>
      <Mark height={88} />
      <div style={{ fontFamily: serif, fontSize: 84, fontWeight: 600, letterSpacing: -2 }}>Fret<span style={{ color: C.gold }}>key</span></div>
    </div>
  </AbsoluteFill>
);

/** A keyboard shrunk into the cover. */
const SmallPiano = (props: Parameters<typeof Piano>[0]) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 860, scale: "0.62", transformOrigin: "50% 100%" }}>
    <Piano {...props} top={300} />
  </div>
);

const big = { fontFamily: serif, fontWeight: 600, lineHeight: 1, textAlign: "center" as const, position: "absolute" as const, left: 0, right: 0 };

/** Reel 4: All twelve notes. */
export const CoverTwelve = () => (
  <Cover tag="Beginner lesson" line={<>Almost every song you know is built from {gold("just 12 notes.")}</>}>
    <div style={{ ...big, top: 0, fontSize: 400, color: C.gold, textShadow: "0 0 120px rgba(236,178,63,0.45)" }}>12</div>
    <div style={{ ...big, top: 370, fontSize: 96 }}>notes</div>
    <SmallPiano from={57} to={69} lit={{ 58: 0.9, 61: 0.9, 63: 0.9, 66: 0.9, 68: 0.9 }} labels={{ 57: "A", 59: "B", 60: "C", 62: "D", 64: "E", 65: "F", 67: "G", 69: "A" }} />
  </Cover>
);

/** Reel 5: major and minor. */
export const CoverMajorMinor = () => (
  <Cover tag="Easy lesson" line={<>Move {gold("one note")}, and happy turns sad.</>}>
    <div style={{ ...big, top: 20, fontSize: 200 }}>
      <span style={{ color: C.gold }}>Happy</span> <span style={{ color: C.muted }}>Sad</span>
    </div>
    <div style={{ ...big, top: 250, fontSize: 110 }}>= {gold("one note")}</div>
    <SmallPiano from={57} to={72} lit={{ 60: 0.8, 63: 1, 64: 0.25, 67: 0.8 }} labels={{ 60: "C", 63: "E♭", 64: "E", 67: "G" }} />
  </Cover>
);

/** Reel 6: the four chords. */
export const CoverFourChords = () => (
  <Cover tag="Moderate lesson" line={<>Why thousands of songs use {gold("the same four chords.")}</>}>
    <div style={{ ...big, top: 0, fontSize: 470, color: C.gold, textShadow: "0 0 120px rgba(236,178,63,0.45)" }}>4</div>
    <div style={{ ...big, top: 440, fontSize: 96 }}>chords</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 610, display: "flex", justifyContent: "center", gap: 22 }}>
      {[["I", "C"], ["V", "G"], ["vi", "Am"], ["IV", "F"]].map(([numeral, name]) => (
        <div key={numeral} style={{ width: 200, height: 210, borderRadius: 28, backgroundColor: C.gold, color: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: serif, fontSize: 90, fontWeight: 600, lineHeight: 1 }}>{numeral}</div>
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 6 }}>{name}</div>
        </div>
      ))}
    </div>
  </Cover>
);

/** Reel 7: the ear test. */
export const CoverEarTest = () => (
  <Cover tag="Ear test · 3 rounds" line={<>3 sounds. 3 seconds each. {gold("Comment your score.")}</>}>
    <div style={{ ...big, top: 20, fontSize: 210 }}>Can you</div>
    <div style={{ ...big, top: 230, fontSize: 250, color: C.gold, textShadow: "0 0 120px rgba(236,178,63,0.45)" }}>pass?</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 530, height: 160, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
      {[40, 80, 120, 70, 150, 100, 150, 70, 120, 80, 40].map((h, k) => <div key={k} style={{ width: 34, height: h, borderRadius: 17, backgroundColor: C.gold }} />)}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 730, display: "flex", justifyContent: "center", gap: 40 }}>
      {["Happy", "Sad"].map((label) => <div key={label} style={{ width: 340, height: 120, borderRadius: 70, border: `4px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, fontWeight: 700 }}>{label}</div>)}
    </div>
  </Cover>
);

/** Reel 9: why the last chord feels like home. */
export const CoverHomeChord = () => (
  <Cover tag="Easy lesson" line={<>Why the last chord of a song feels like {gold("home.")}</>}>
    <div style={{ ...big, top: 30, fontSize: 250 }}><span style={{ color: C.muted }}>G7</span> <span style={{ fontSize: 150, color: C.muted }}>→</span> <span style={{ color: C.gold, textShadow: "0 0 120px rgba(236,178,63,0.45)" }}>C</span></div>
    <div style={{ ...big, top: 300, fontSize: 100 }}>= {gold("two notes")}</div>
    <SmallPiano from={53} to={72} lit={{ 59: 0.9, 65: 0.9, 60: 0.3, 64: 0.3 }} labels={{ 59: "B", 60: "C", 64: "E", 65: "F" }} marks={{ 60: "↑", 64: "↓" }} />
  </Cover>
);

/** Reel 10: the bittersweet chord. */
export const CoverBittersweet = () => (
  <Cover tag="Easy lesson" line={<>One borrowed note makes a song {gold("ache.")}</>}>
    <div style={{ ...big, top: 40, fontSize: 170 }}><span style={{ color: C.muted }}>Bitter</span><span style={{ color: C.gold }}>sweet</span></div>
    <div style={{ ...big, top: 270, fontSize: 110 }}>= {gold("one note")}</div>
    <SmallPiano from={53} to={72} lit={{ 53: 0.8, 56: 1, 57: 0.25, 60: 0.8 }} labels={{ 53: "F", 56: "A♭", 57: "A", 60: "C" }} />
  </Cover>
);

/** Reel 11: why rock sounds heavy. */
export const CoverPowerChord = () => (
  <Cover tag="Guitar lesson" line={<>Why rock sounds so {gold("heavy.")}</>}>
    <div style={{ ...big, top: 0, fontSize: 360, color: C.gold, textShadow: "0 0 120px rgba(236,178,63,0.45)" }}>−1</div>
    <div style={{ ...big, top: 330, fontSize: 96 }}>note</div>
    <SmallPiano from={52} to={64} lit={{ 52: 0.9, 59: 0.9, 64: 0.9 }} labels={{ 52: "E", 56: "✕", 59: "B", 64: "E" }} />
  </Cover>
);
