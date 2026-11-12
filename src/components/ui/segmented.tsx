import { cn } from "@/lib/utils";

/** A small set of exclusive choices shown side by side. */
export function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly (readonly [T, string])[]; onChange: (value: T) => void }) {
  return (
    <div role="group" aria-label={label} className="flex shrink-0 rounded-md border bg-card p-0.5">
      {options.map(([id, text]) => (
        <button key={id} type="button" aria-pressed={id === value} onClick={() => onChange(id)}
          className={cn("h-10 rounded-[calc(var(--radius-md)-2px)] px-3 text-sm outline-none transition-colors duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/50", id === value ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}>
          {text}
        </button>
      ))}
    </div>
  );
}
