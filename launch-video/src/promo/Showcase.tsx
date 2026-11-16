import { interpolate, useCurrentFrame } from "remotion";
import { C, Label, LINEAR, OUT, Phone, rise, serif, Stage, useTall } from "../theme";

export const EACH = 90; // one bar per lesson
// Eight real lessons, one from each level of theory and two from the playing tracks. Titles are the lessons' own.
export const LESSONS = [
  { tag: "Level 1 · Foundations", title: "Reading TAB and chord diagrams", gain: "Read any tab or chord chart on sight.", shot: "l1" },
  { tag: "Level 2 · Building blocks", title: "The circle of fifths", gain: "Every key and its sharps and flats, on one wheel.", shot: "l2" },
  { tag: "Level 3 · Harmony basics", title: "The 12-bar blues", gain: "The twelve bars behind thousands of songs.", shot: "l3" },
  { tag: "Level 4 · Fluency", title: "The five pentatonic positions", gain: "Break out of the box and use the whole neck.", shot: "l4" },
  { tag: "Level 5 · Colour and movement", title: "The seven modes", gain: "Seven moods from the same seven notes.", shot: "step-learn" },
  { tag: "Level 6 · Advanced", title: "Tritone substitution", gain: "The jazz move that makes a bass line glide.", shot: "l6" },
  { tag: "Playing · Lead guitar", title: "First licks, and landing on the root", gain: "Tab that plays, and lights up the fretboard.", shot: "tab" },
  { tag: "Playing · Piano", title: "A first pop pattern", gain: "Both hands, with fingering, in time.", shot: "hands" },
];

/** The heart of the video: eight lessons from across the course, one per bar. */
export const Showcase = () => {
  const frame = useCurrentFrame();
  const current = Math.min(LESSONS.length - 1, Math.floor(frame / EACH));
  const tall = useTall();
  // Tall: the words on top, the phone under them. Wide: the phone on the left, the words beside it.
  const text = tall ? { left: 80, top: 345, width: 920 } : { left: 760, top: 210, width: 1040 };
  return (
    <Stage glow="30% 55%">
      <Label style={{ ...rise(frame, 4), position: "absolute", left: text.left, top: tall ? 240 : 120 }}>Inside the course</Label>
      <div style={{ position: "absolute", left: text.left, top: tall ? 296 : 936, display: "flex", gap: tall ? 10 : 14, alignItems: "center" }}>
        {LESSONS.map((lesson, i) => (
          <div key={lesson.shot} style={{ height: 10, borderRadius: 5, width: i === current ? (tall ? 50 : 70) : tall ? 16 : 22, backgroundColor: i <= current ? C.gold : C.line }} />
        ))}
        <div style={{ fontSize: tall ? 30 : 34, color: C.muted, marginLeft: 16, fontVariantNumeric: "tabular-nums" }}>
          {current + 1} of 236 lessons shown
        </div>
      </div>
      {LESSONS.map((lesson, i) => {
        const at = i * EACH;
        if (frame < at - 2 || frame > at + EACH + 12) return null;
        const last = i === LESSONS.length - 1;
        const leave = last ? 1 : interpolate(frame, [at + EACH - 4, at + EACH + 8], [1, 0], LINEAR);
        return (
          <div key={lesson.shot} style={{ position: "absolute", inset: 0, opacity: leave }}>
            {/* the lesson's number, huge and faint behind everything */}
            <div style={{ position: "absolute", right: tall ? 50 : 90, top: tall ? 700 : 60, fontFamily: serif, fontSize: tall ? 460 : 520, fontWeight: 600, lineHeight: 1, color: "rgba(236,178,63,0.07)", translate: `${interpolate(frame, [at, at + EACH], [60, -20], LINEAR)}px 0px` }}>{i + 1}</div>
            <div
              style={{
                position: "absolute",
                left: tall ? 120 : 210,
                top: tall ? 800 : 120,
                opacity: interpolate(frame, [at, at + 10], [0, 1], LINEAR),
                translate: `${interpolate(frame, [at, at + 22], [260, 0], OUT)}px ${interpolate(frame, [at, at + EACH], [16, -16], LINEAR)}px`,
                rotate: `${interpolate(frame, [at, at + 22], [7, -3], OUT)}deg`,
              }}
            >
              <Phone shot={lesson.shot} width={tall ? 370 : 420} active />
            </div>
            <div style={{ position: "absolute", ...text }}>
              <div style={{ ...rise(frame, at + 6, 30), display: "inline-block", fontSize: tall ? 34 : 38, fontWeight: 600, padding: "12px 30px", borderRadius: 40, border: `2px solid ${C.gold}`, color: C.gold }}>{lesson.tag}</div>
              <div style={{ ...rise(frame, at + 12, 50), fontFamily: serif, fontSize: tall ? 84 : 104, lineHeight: 1.06, marginTop: tall ? 26 : 34 }}>{lesson.title}</div>
              <div style={{ ...rise(frame, at + 24, 40), fontSize: tall ? 42 : 50, lineHeight: 1.25, color: C.muted, marginTop: tall ? 22 : 34 }}>{lesson.gain}</div>
            </div>
          </div>
        );
      })}
    </Stage>
  );
};
