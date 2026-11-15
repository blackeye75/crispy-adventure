"use client";

import { useMemo, useState } from "react";
import { resolveCanvas } from "@/core/instruments/resolveCanvas";
import type { BlockOf } from "@/core/schemas/content";
import { itemBeats } from "@/core/schemas/notation";
import { parseTab, tabFretted, tabSteps, TAB_MARKS, type TabItem, type TabMark } from "@/core/schemas/tab";
import { nameMidi } from "@/core/theory/notes";
import { cn } from "@/lib/utils";
import { InstrumentView, lessonState } from "./InstrumentView";
import { PlayButton } from "./PlayButton";

const LINE = 22; // gap between string lines
const TOP = 30;
const LEFT = 34;
const MARK_TEXT: Record<TabMark, string> = { h: "h", p: "p", s: "sl", b: "full", bh: "½", v: "~~", r: "rel", pb: "pre", ub: "full" };
const FINGER_NAMES: Record<string, string> = { p: "thumb", i: "index", m: "middle", a: "ring" };
const STRING_NAMES = ["e", "B", "G", "D", "A", "E"];

/** Where each item sits: its width grows with its length, and the beat count restarts at every bar line. `index` counts notes and rests only. */
function layoutOf(items: TabItem[]) {
  let x = LEFT + 14;
  let beat = 0;
  let index = -1;
  return items.map((item) => {
    if (item.bar) {
      beat = 0;
      x += 10;
      return { x: x - 5, count: undefined, index: -1 };
    }
    const whole = Math.round(beat);
    const at = { x, count: Math.abs(beat - whole) < 0.01 ? whole + 1 : undefined, index: ++index }; // thirds of a beat never sum exactly
    beat += itemBeats(item);
    x += Math.min(120, Math.max(28, itemBeats(item) * 52));
    return at;
  });
}

/** Guitar tablature with rhythm. Wider gaps are longer notes; the beat is counted underneath; the fretboard above follows along. */
export function TabBlock({ block }: { block: BlockOf<"tab"> }) {
  const [active, setActive] = useState<number>(); // index among the notes and rests, bar lines not counted
  const items = useMemo(() => parseTab(block.notes), [block.notes]);
  const sounding = items.filter((item) => !item.bar);

  const layout = useMemo(() => layoutOf(items), [items]);
  const width = Math.max(260, layout.length ? layout[layout.length - 1].x + 60 : 260);
  const fingers = block.fingers?.split(" ");
  const height = TOP + 5 * LINE + (fingers ? 56 : 34);

  const board = useMemo(() => {
    const at = [...new Map(sounding.flatMap((item) => (item.bar ? [] : item.notes)).map((n) => [`${n.string}:${n.fret}`, [n.string, n.fret] as [number, number]])).values()];
    const pitches = [...new Set(sounding.flatMap((item) => tabFretted(item)).map((m) => nameMidi(m)))];
    return resolveCanvas(lessonState({ root: "C", show: { kind: "notes", pitches, at }, labels: "notes" }));
  }, [sounding]);

  const spoken = sounding.map((item) => (item.bar ? "" : item.notes.length ? `${item.notes.map((n) => `string ${n.string} fret ${n.fret}`).join(" and ")}${item.mark ? `, ${TAB_MARKS[item.mark]}` : ""}` : "rest")).map((said, i) => (fingers && fingers[i] !== "-" ? `${said}, ${fingers[i].split("").map((f) => FINGER_NAMES[f]).join(" and ")}` : said)).join("; ");

  return (
    <figure className="flex flex-col gap-4">
      {block.caption && <figcaption className="text-lg text-foreground/85">{block.caption}</figcaption>}
      <InstrumentView instrument="guitar" markers={board} sounding={active === undefined ? [] : tabFretted(sounding[active])} />
      <div className="overflow-x-auto rounded-xl border bg-card p-3">
        <svg role="img" aria-label={`Tab. ${spoken}`} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
          {STRING_NAMES.map((name, s) => (
            <g key={s}>
              <text x={LEFT - 14} y={TOP + s * LINE + 5} textAnchor="middle" className="fill-muted-foreground text-sm">{name}</text>
              <line x1={LEFT} x2={width - 8} y1={TOP + s * LINE} y2={TOP + s * LINE} className="stroke-muted-foreground/50" />
            </g>
          ))}
          <line x1={LEFT} x2={LEFT} y1={TOP} y2={TOP + 5 * LINE} className="stroke-muted-foreground/50" />
          {items.map((item, i) => {
            const { x, count, index } = layout[i];
            if (item.bar) return <line key={i} x1={x} x2={x} y1={TOP} y2={TOP + 5 * LINE} className="stroke-muted-foreground/50" />;
            const on = active === index;
            return (
              <g key={i} data-active={on || undefined} className="tab-note">
                {item.notes.map((n) => (
                  <g key={n.string}>
                    <rect x={x - 10} y={TOP + (n.string - 1) * LINE - 10} width={20} height={20} rx={4} className={on ? "fill-primary" : "fill-card"} />
                    <text x={x} y={TOP + (n.string - 1) * LINE + 5} textAnchor="middle" className={cn("text-[15px] font-semibold tabular-nums", on ? "fill-primary-foreground" : "fill-foreground")}>{n.fret}</text>
                  </g>
                ))}
                {item.mark && item.notes.length > 0 && (
                  <text x={x} y={TOP + (Math.min(...item.notes.map((n) => n.string)) - 1) * LINE - 14} textAnchor="middle" className="fill-primary text-xs font-medium">{MARK_TEXT[item.mark]}</text>
                )}
                {fingers && fingers[index] !== "-" && <text x={x} y={height - 28} textAnchor="middle" className="fill-primary text-sm font-semibold italic">{fingers[index].split("").join("+")}</text>}
                {count && <text x={x} y={height - 6} textAnchor="middle" className="fill-muted-foreground text-xs tabular-nums">{count}</text>}
              </g>
            );
          })}
        </svg>
      </div>
      <div><PlayButton steps={tabSteps(items)} label="Play the tab" bpm={block.bpm} metronome={{ every: 1, accent: block.beatsPerBar }} onStep={setActive} /></div>
    </figure>
  );
}
