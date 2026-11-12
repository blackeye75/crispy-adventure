import type { Marker } from "@/core/instruments/resolveCanvas";
import { glyphs } from "@/core/theory/notes";

const ROLE_NAME = { root: "root", chord: "chord tone", scale: "scale note" } as const;

export type NoteEvents = {
  /** Sounding right now (playback or a tap). */
  sounding: readonly number[];
  onNoteHover: (marker: Marker | undefined) => void;
  onNoteTap: (marker: Marker) => void;
};

/** One note marker, shared by the fretboard and the keyboard so the eye links them. */
export function NoteMarker({ marker, cx, cy, where, sounding, onNoteHover, onNoteTap }: NoteEvents & { marker: Marker; cx: number; cy: number; where?: string }) {
  const r = marker.role === "root" ? 15 : 13; // the root is also bigger, so colour is never the only signal
  const active = marker.focus || sounding.includes(marker.midi);
  return (
    <g
      className="note-marker"
      role="button"
      tabIndex={0}
      aria-label={`${glyphs(marker.pitch)}, ${marker.state ?? ROLE_NAME[marker.role]}${where ? `, ${where}` : ""}`}
      data-midi={marker.midi}
      data-role={marker.role}
      data-active={active || undefined}
      data-echo={marker.echo || undefined}
      data-dimmed={marker.dimmed || undefined}
      data-state={marker.state}
      onPointerEnter={() => onNoteHover(marker)}
      onPointerLeave={() => onNoteHover(undefined)}
      onFocus={() => onNoteHover(marker)}
      onBlur={() => onNoteHover(undefined)}
      onClick={() => onNoteTap(marker)}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        onNoteTap(marker);
      }}
    >
      <circle className="hit" cx={cx} cy={cy} r={22} />
      <g>
        <circle className="halo" cx={cx} cy={cy} r={r + 7} />
        <circle className="plate" cx={cx} cy={cy} r={r + 2} />
        <circle className="dot" cx={cx} cy={cy} r={r} />
        <text x={cx} y={cy}>{marker.label}</text>
      </g>
    </g>
  );
}
