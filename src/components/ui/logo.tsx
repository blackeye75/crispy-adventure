import { cn } from "@/lib/utils";

const WHITE = 288 / 5; // height of one white key in the stem

/**
 * The Fretkey mark: an F whose stem is a strip of piano keys and whose arms are strings, with a note on the string.
 * Decorative next to the name. Keep the shapes in step with brand/render.mjs.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="100 80 312 352" aria-hidden className={cn("h-[1.15em] w-auto shrink-0", className)}>
      <g fill="currentColor">
        <rect x="125" y="112" width="100" height="288" rx="14" />
        <rect x="185" y="112" width="196" height="34" rx="17" />
        <rect x="185" y="214" width="150" height="34" rx="17" />
      </g>
      {/* the gaps between white keys, and the black keys, are cut out in the page colour */}
      <g className="fill-background">
        {[1, 2, 3, 4].map((k) => <rect key={k} x="125" y={112 + k * WHITE - 2.5} width="100" height="5" />)}
        {[1, 2, 4].map((k) => <rect key={k} x="124" y={112 + k * WHITE - 16} width="60" height="32" rx="5" />)}
      </g>
      <circle cx="345" cy="231" r="40" className="fill-primary" />
    </svg>
  );
}
