"use client";

import { ArrowDown, ArrowUp, X } from "lucide-react";
import { useState } from "react";
import { STRUM_FEELS, strumSteps, type BlockOf } from "@/core/schemas/content";
import { cn } from "@/lib/utils";
import { PlayButton } from "./PlayButton";

const SAY: Record<string, string> = { "&": "and", e: "e", a: "a" };

/** A bar of strumming: one arrow per swing of the hand. Faint arrows miss the strings, bold ones are accented, a cross is a muted strum. */
export function StrumPattern({ block }: { block: BlockOf<"strum-pattern"> }) {
  const [active, setActive] = useState<number>();
  const slots = block.pattern.split(" ");
  const feel = STRUM_FEELS[block.feel];
  const counts = feel.counts.split(" ");
  // The hand alternates down and up unless the pattern says otherwise; in 6/8 it goes down on every count.
  const isDown = (slot: string, i: number) => (slot[0] === "D" ? true : slot[0] === "U" ? false : block.feel === "6/8" || i % 2 === 0);
  const describe = (slot: string, i: number) =>
    slot === "-" ? "miss" : slot === "x" ? "muted strum" : `${isDown(slot, i) ? "down" : "up"}${slot.endsWith(">") ? ", accented" : slot.endsWith(".") ? ", cut short" : ""}`;
  const spoken = slots.map((slot, i) => `${SAY[counts[i]] ?? counts[i]}: ${describe(slot, i)}`).join(", ");
  const bar = active === undefined ? undefined : Math.floor(active / slots.length);
  const dense = slots.length > 8;
  return (
    <figure className="flex flex-col gap-4">
      {block.caption && <figcaption className="text-lg text-foreground/85">{block.caption}</figcaption>}
      {block.bars && (
        <ol aria-label="Chords, one per bar" className="flex max-w-xl flex-wrap gap-2">
          {block.bars.map((b, i) => (
            <li key={i} aria-current={bar === i ? "true" : undefined} className={cn("min-w-12 rounded-md border px-3 py-2 text-center font-medium transition-colors duration-150", bar === i && "border-primary bg-accent")}>{b.name}</li>
          ))}
        </ol>
      )}
      <div role="img" aria-label={`Strumming pattern. ${spoken}`} className="grid max-w-xl rounded-xl border bg-card p-3" style={{ gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))` }}>
        {slots.map((slot, i) => {
          const Arrow = slot === "x" ? X : isDown(slot, i) ? ArrowDown : ArrowUp;
          const onBeat = /\d/.test(counts[i]);
          return (
            <div key={i} data-active={(active !== undefined && active % slots.length === i) || undefined} className={cn("strum-slot flex flex-col items-center gap-1 rounded-lg py-3 transition-colors duration-150", active !== undefined && active % slots.length === i && "bg-accent", onBeat && i > 0 && "border-l")}>
              <Arrow aria-hidden strokeWidth={slot === "-" ? 1.5 : slot.endsWith(">") ? 4 : 2.5} className={cn(dense ? "size-4 sm:size-6" : "size-8", slot === "-" ? "text-muted-foreground/30" : slot === "x" ? "text-foreground" : "text-primary", slot.endsWith(">") && "scale-125")} />
              {/* accents and short strums are marked below the arrow as well, so colour and weight are not the only signal */}
              <span aria-hidden className="h-4 text-xs leading-4 text-primary">{slot.endsWith(">") ? ">" : slot.endsWith(".") ? "•" : ""}</span>
              <span className={cn("tabular-nums", dense ? "text-xs" : "text-sm", onBeat ? "font-semibold" : "text-muted-foreground")}>{counts[i]}</span>
            </div>
          );
        })}
      </div>
      <div><PlayButton steps={block.bars ? block.bars.flatMap((b) => strumSteps(block.pattern, b.chord, block.feel)) : strumSteps(block.pattern, block.chord, block.feel)} label="Play the pattern (loops)" bpm={block.bpm} loop metronome={feel.click} onStep={setActive} /></div>
    </figure>
  );
}
