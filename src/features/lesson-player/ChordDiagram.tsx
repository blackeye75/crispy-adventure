"use client";

import { shapeFrets, shapeMidis } from "@/core/instruments/fretboard";
import type { PlaybackStep } from "@/core/instruments/resolveCanvas";
import type { BlockOf } from "@/core/schemas/content";
import { getChord } from "@/core/theory/chords";
import { glyphs } from "@/core/theory/notes";
import { PlayButton } from "./PlayButton";

const GAP = 26; // between strings
const ROW = 32; // one fret
const LEFT = 34;
const TOP = 34;
const ROWS = 4;

/** A chord box: the neck standing upright, string 6 on the left. O = open string, X = not played. */
export function ChordDiagram({ block }: { block: BlockOf<"chord-diagram"> }) {
  const frets = shapeFrets(block.shape);
  const pressed = frets.filter((f): f is number => f !== null && f > 0);
  const lowest = Math.min(...pressed);
  const base = Math.max(...pressed) <= ROWS ? 1 : lowest; // open-position chords start at the nut
  // One finger laid across several strings: the lowest fret is held on more than one string and nothing rings open.
  const barred = !frets.includes(0) && frets.filter((f) => f === lowest).length > 1;
  const barFrom = frets.indexOf(lowest);
  const barTo = frets.lastIndexOf(lowest);
  const x = (string: number) => LEFT + string * GAP;
  const y = (fret: number) => TOP + (fret - base + 0.5) * ROW;
  const symbol = glyphs(getChord(block.chord.root, block.chord.id).symbol);

  const midis = shapeMidis(block.shape).filter((m): m is number => m !== null);
  // strummed slowly string by string, then all together
  const steps: PlaybackStep[] = [...midis.map((m) => ({ midis: [m], beats: 0.5 })), { midis, beats: 3 }];
  const spoken = frets.map((f, i) => `string ${6 - i} ${f === null ? "not played" : f === 0 ? "open" : `fret ${f}`}`).join(", ");

  return (
    <figure className="flex flex-col gap-3">
      {block.caption && <figcaption className="text-lg text-foreground/85">{block.caption}</figcaption>}
      <div className="flex flex-wrap items-center gap-6">
        <svg viewBox={`0 0 ${LEFT * 2 + GAP * 5} ${TOP + ROWS * ROW + 14}`} className="w-48 shrink-0 rounded-xl bg-card" role="img" aria-label={`${symbol} chord: ${spoken}`}>
          <text x={LEFT + GAP * 2.5} y={15} textAnchor="middle" fontSize={15} fontWeight={600} className="fill-foreground">{symbol}</text>
          {Array.from({ length: ROWS + 1 }, (_, r) => (
            <line key={r} x1={x(0)} x2={x(5)} y1={TOP + r * ROW} y2={TOP + r * ROW} strokeWidth={r === 0 && base === 1 ? 5 : 1.5} className={r === 0 && base === 1 ? "stroke-foreground" : "stroke-fret/70"} />
          ))}
          {frets.map((_, i) => <line key={i} x1={x(i)} x2={x(i)} y1={TOP} y2={TOP + ROWS * ROW} strokeWidth={1.5} className="stroke-string/80" />)}
          {base > 1 && <text x={LEFT - 12} y={y(base)} textAnchor="end" dominantBaseline="central" fontSize={12} className="fill-muted-foreground">{base}fr</text>}
          {barred && <rect x={x(barFrom) - 9} y={y(lowest) - 9} width={x(barTo) - x(barFrom) + 18} height={18} rx={9} className="fill-primary" />}
          {frets.map((f, i) =>
            f === null ? <text key={i} x={x(i)} y={TOP - 8} textAnchor="middle" fontSize={13} className="fill-muted-foreground">×</text>
            : f === 0 ? <circle key={i} cx={x(i)} cy={TOP - 12} r={5} fill="none" strokeWidth={1.5} className="stroke-foreground" />
            : barred && f === lowest ? null
            : <circle key={i} cx={x(i)} cy={y(f)} r={9} className="fill-primary" />,
          )}
        </svg>
        <PlayButton steps={steps} label={`Play ${symbol}`} bpm={100} />
      </div>
    </figure>
  );
}
