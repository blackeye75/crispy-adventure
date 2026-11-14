"use client";

import { useState } from "react";
import type { BlockOf } from "@/core/schemas/content";
import { circleOfFifths } from "@/core/theory/keys";
import { glyphs } from "@/core/theory/notes";

const KEYS = circleOfFifths();
const SIZE = 340;
const point = (i: number, radius: number) => {
  const angle = (i / 12) * 2 * Math.PI - Math.PI / 2; // C at the top, clockwise
  return { x: SIZE / 2 + radius * Math.cos(angle), y: SIZE / 2 + radius * Math.sin(angle) };
};
const count = (n: number) => (n === 0 ? "no sharps or flats" : `${Math.abs(n)} ${n > 0 ? "sharp" : "flat"}${Math.abs(n) === 1 ? "" : "s"}`);

/** The twelve keys in fifths: major outside, relative minor inside. Tap a key to read its signature. */
export function CircleOfFifths({ block }: { block: BlockOf<"circle-of-fifths"> }) {
  const [selected, setSelected] = useState(() => Math.max(0, KEYS.findIndex((k) => k.major === block.highlight)));
  const key = KEYS[selected];
  return (
    <figure className="flex flex-col gap-4">
      {block.caption && <figcaption className="text-lg text-foreground/85">{block.caption}</figcaption>}
      <div className="flex flex-wrap items-center gap-6">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[340px] shrink-0" role="group" aria-label="Circle of fifths">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={150} className="fill-card stroke-border" />
          <circle cx={SIZE / 2} cy={SIZE / 2} r={92} className="fill-background stroke-border" />
          {KEYS.map((k, i) => {
            const outer = point(i, 122);
            const inner = point(i, 66);
            const on = i === selected;
            return (
              <g key={k.major} role="button" tabIndex={0} aria-pressed={on} aria-label={`${glyphs(k.major)} major, ${count(k.accidentals)}`} className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-ring"
                onClick={() => setSelected(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(i); } }}>
                <circle cx={outer.x} cy={outer.y} r={22} strokeWidth={2} className={on ? "fill-primary stroke-primary" : "fill-transparent stroke-transparent"} />
                <text x={outer.x} y={outer.y} textAnchor="middle" dominantBaseline="central" fontSize={17} fontWeight={600} className={on ? "fill-primary-foreground" : "fill-foreground"}>{glyphs(k.major)}</text>
                <text x={inner.x} y={inner.y} textAnchor="middle" dominantBaseline="central" fontSize={13} className={on ? "fill-foreground font-semibold" : "fill-muted-foreground"}>{glyphs(k.minor)}m</text>
              </g>
            );
          })}
        </svg>
        <div className="flex min-w-48 flex-1 flex-col gap-1 text-lg" role="status">
          <p className="font-display text-2xl">{glyphs(key.major)} major</p>
          <p>{count(key.accidentals)}{key.signature.length > 0 && `: ${key.signature.map(glyphs).join(" ")}`}</p>
          <p className="text-muted-foreground">Relative minor: {glyphs(key.minor)} minor</p>
        </div>
      </div>
    </figure>
  );
}
