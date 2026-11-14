"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { strumSteps, type BlockOf } from "@/core/schemas/content";
import { cn } from "@/lib/utils";
import { PlayButton } from "./PlayButton";

const COUNTS = ["1", "&", "2", "&", "3", "&", "4", "&"];

/** A bar of strumming: the hand swings down on the beats and up on the "ands"; faint arrows are swings that miss the strings. */
export function StrumPattern({ block }: { block: BlockOf<"strum-pattern"> }) {
  const [active, setActive] = useState<number>();
  const slots = block.pattern.split(" ");
  const spoken = slots.map((slot, i) => `${COUNTS[i] === "&" ? "and" : COUNTS[i]}: ${slot === "D" ? "down" : slot === "U" ? "up" : "miss"}`).join(", ");
  return (
    <figure className="flex flex-col gap-4">
      {block.caption && <figcaption className="text-lg text-foreground/85">{block.caption}</figcaption>}
      <div role="img" aria-label={`Strumming pattern. ${spoken}`} className="grid max-w-xl grid-cols-8 rounded-xl border bg-card p-3">
        {slots.map((slot, i) => {
          const Arrow = i % 2 === 0 ? ArrowDown : ArrowUp; // the hand's direction never changes; only whether it hits
          return (
            <div key={i} className={cn("flex flex-col items-center gap-2 rounded-lg py-3 transition-colors duration-150", active === i && "bg-accent", i % 2 === 0 && i > 0 && "border-l")}>
              <Arrow aria-hidden strokeWidth={slot === "-" ? 1.5 : 3} className={cn("size-8", slot === "-" ? "text-muted-foreground/30" : "text-primary")} />
              <span className={cn("text-sm tabular-nums", i % 2 === 0 ? "font-semibold" : "text-muted-foreground")}>{COUNTS[i]}</span>
            </div>
          );
        })}
      </div>
      <div><PlayButton steps={strumSteps(block.pattern, block.chord)} label="Play the pattern (loops)" bpm={block.bpm} loop metronome={{ every: 1, accent: 4 }} onStep={setActive} /></div>
    </figure>
  );
}
