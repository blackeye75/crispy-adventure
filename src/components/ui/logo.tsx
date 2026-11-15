import { cn } from "@/lib/utils";

/** The Fretkey mark: an F made of a piano key (the stem) and two strings (the arms), with a note on the string. Decorative next to the name. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="100 80 312 352" aria-hidden className={cn("h-[1.15em] w-auto shrink-0", className)}>
      <g fill="currentColor">
        <rect x="133" y="112" width="84" height="288" rx="18" />
        <rect x="175" y="112" width="198" height="34" rx="17" />
        <rect x="175" y="214" width="150" height="34" rx="17" />
      </g>
      <circle cx="339" cy="231" r="40" className="fill-primary" />
    </svg>
  );
}
