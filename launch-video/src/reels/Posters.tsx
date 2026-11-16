import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { C, Mark, Phone, sans, serif } from "../theme";

/** The frame every story poster shares: tag, headline, content, and the logo with "Coming soon". Content stays clear of the top and bottom that Instagram covers. */
const Poster = ({ tag, headline, children }: { tag: string; headline: ReactNode; children: ReactNode }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: sans, color: C.text }}>
    <AbsoluteFill style={{ background: "radial-gradient(820px 900px at 50% 38%, rgba(236,178,63,0.17), transparent 72%)" }} />
    <div style={{ position: "absolute", left: 80, right: 80, top: 250 }}>
      <div style={{ display: "inline-block", fontSize: 30, fontWeight: 600, letterSpacing: 7, textTransform: "uppercase", color: C.bg, backgroundColor: C.gold, padding: "10px 28px", borderRadius: 40 }}>{tag}</div>
      <div style={{ fontFamily: serif, fontSize: 104, lineHeight: 1.05, marginTop: 30 }}>{headline}</div>
    </div>
    {children}
    <div style={{ position: "absolute", left: 80, right: 80, top: 1500, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Mark height={84} />
        <div style={{ fontFamily: serif, fontSize: 80, fontWeight: 600 }}>
          Fret<span style={{ color: C.gold }}>key</span>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 40, fontWeight: 600, color: C.gold }}>Coming soon</div>
        <div style={{ fontSize: 32, color: C.muted }}>@fret.key</div>
      </div>
    </div>
  </AbsoluteFill>
);

const USPS = [
  ["One idea, three views", "Fretboard, keyboard and theory, linked on one screen."],
  ["Taught once, shown on your instrument", "The same lesson for guitarists and pianists."],
  ["Hear it first", "Every lesson plays you the idea before it explains it."],
  ["Short lessons", "5 to 8 minutes, one idea, the same four steps."],
  ["It sticks", "A daily review brings back what you are about to forget."],
];

/** Poster 1: what makes the product different. */
export const PosterUsp = () => (
  <Poster tag="Why Fretkey" headline={<>Stop memorising shapes. <span style={{ color: C.gold }}>Understand them.</span></>}>
    <div style={{ position: "absolute", left: 80, right: 80, top: 700, display: "flex", flexDirection: "column", gap: 22 }}>
      {USPS.map(([head, body], i) => (
        <div key={head} style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
          <div style={{ fontFamily: serif, fontSize: 76, fontWeight: 600, color: C.gold, lineHeight: 1, width: 64, flexShrink: 0 }}>{i + 1}</div>
          <div>
            <div style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.15 }}>{head}</div>
            <div style={{ fontSize: 32, color: C.muted, lineHeight: 1.22, marginTop: 4 }}>{body}</div>
          </div>
        </div>
      ))}
    </div>
  </Poster>
);

const STEPS = [
  ["Understand", "A short, plain explanation.", "step-understand"],
  ["Listen", "Hear it before you read on.", "step-listen"],
  ["Learn", "See it on your instrument.", "step-learn"],
  ["Practice", "Drills with instant feedback.", "step-practice"],
];

/** Poster 2: how a lesson works. */
export const PosterLesson = () => (
  <Poster tag="How a lesson works" headline={<>Four steps. <span style={{ color: C.gold }}>Five to eight minutes.</span></>}>
    <div style={{ position: "absolute", left: 80, right: 80, top: 690, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 36, rowGap: 40 }}>
      {STEPS.map(([name, line, shot], i) => (
        <div key={name} style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Phone shot={shot} width={176} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: serif, fontSize: 72, fontWeight: 600, color: C.gold, lineHeight: 1 }}>{i + 1}</div>
            <div style={{ fontSize: 42, fontWeight: 600, marginTop: 6 }}>{name}</div>
            <div style={{ fontSize: 30, color: C.muted, lineHeight: 1.25, marginTop: 6 }}>{line}</div>
          </div>
        </div>
      ))}
    </div>
  </Poster>
);

const JOURNEY = [
  ["Foundations", "Name any note on your instrument."],
  ["Building blocks", "Build any major scale. Read a key signature."],
  ["Harmony basics", "Know why the chords of a song fit together."],
  ["Fluency", "Improvise with pentatonic and blues scales."],
  ["Colour and movement", "Use modes, borrowed chords and key changes."],
  ["Advanced", "Play and understand jazz harmony."],
];

/** Poster 3: the learning journey, and what each level lets you do. */
export const PosterJourney = () => (
  <Poster tag="Your journey" headline={<>Six levels. <span style={{ color: C.gold }}>Here is what each one gives you.</span></>}>
    <div style={{ position: "absolute", left: 80, right: 80, top: 760 }}>
      <div style={{ position: "absolute", left: 35, top: 30, bottom: 30, width: 4, backgroundColor: C.line }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {JOURNEY.map(([name, gain], i) => (
          <div key={name} style={{ display: "flex", gap: 28, alignItems: "center", position: "relative" }}>
            <div style={{ width: 74, height: 74, borderRadius: 37, backgroundColor: C.gold, color: C.bg, fontFamily: serif, fontSize: 48, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.1 }}>{name}</div>
              <div style={{ fontSize: 31, color: C.muted, lineHeight: 1.2, marginTop: 2 }}>{gain}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Poster>
);
