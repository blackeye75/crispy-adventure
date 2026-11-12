import type { Related, ResolvedCanvas, Tone } from "@/core/instruments/resolveCanvas";
import { glyphs } from "@/core/theory/notes";
import { cn } from "@/lib/utils";

type Props = {
  resolved: ResolvedCanvas;
  /** Chroma of the hovered or sounding note, to underline its entry. */
  activeChromas: ReadonlySet<number>;
  activeChord?: number;
  onTone: (tone: Tone) => void;
  onChord: (index: number) => void;
  onRelated: (related: Related) => void;
};

const cell = "flex min-h-11 min-w-8 flex-col items-center justify-center rounded-md px-1 transition-colors duration-150 hover:bg-accent";

/** Always the same order: name, notes, degrees, pattern, one sentence, related chips. */
export function TheoryPanel({ resolved, activeChromas, activeChord, onTone, onChord, onRelated }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl leading-tight">{resolved.title}</h2>
      {resolved.chords ? (
        <div className="-mx-1 flex flex-wrap">
          {resolved.chords.map((chord, i) => (
            <button key={i} type="button" className={cn(cell, i === activeChord && "bg-accent")} aria-pressed={i === activeChord} onClick={() => onChord(i)}>
              <span className={cn("font-medium", i === activeChord && "underline decoration-primary decoration-2 underline-offset-4")}>{chord.symbol}</span>
              <span className="text-sm text-muted-foreground">{chord.numeral}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="-mx-1 flex flex-wrap">
          {resolved.tones.map((tone) => (
            <button key={tone.interval} type="button" className={cell} aria-label={`${glyphs(tone.pitchClass)}, degree ${glyphs(tone.degree)}`} onClick={() => onTone(tone)}>
              <span className={cn("font-medium", activeChromas.has(tone.chroma) && "underline decoration-primary decoration-2 underline-offset-4")}>{glyphs(tone.pitchClass)}</span>
              <span className="text-sm text-muted-foreground">{glyphs(tone.degree)}</span>
            </button>
          ))}
        </div>
      )}
      <p className="font-medium tracking-wide">{resolved.pattern}</p>
      <p className="text-muted-foreground">{resolved.sentence}</p>
      {resolved.related.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {resolved.related.map((related) => (
            <button key={related.label} type="button" className="min-h-11 rounded-full border px-3.5 text-sm transition-colors duration-150 hover:bg-accent" onClick={() => onRelated(related)}>
              {related.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
