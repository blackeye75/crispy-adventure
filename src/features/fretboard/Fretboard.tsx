"use client";

import { useEffect, useRef } from "react";
import { fretColumn } from "@/core/instruments/fretboard";
import type { ResolvedCanvas } from "@/core/instruments/resolveCanvas";
import { NoteMarker, type NoteEvents } from "@/features/canvas/NoteMarker";

const COL = 48; // one fret; ≥ 44px touch target at natural size
const ROW = 44; // one string
const NUMBERS = 26; // strip under the board for fret numbers
const SINGLE_INLAYS = [3, 5, 7, 9, 15, 17, 19, 21];
const DOUBLE_INLAYS = [12, 24];

type Props = NoteEvents & {
  markers: ResolvedCanvas["fretboard"];
  strings: number;
  frets: number;
  leftHanded: boolean;
  position?: { fromFret: number; toFret: number };
  /** Drills: make every string/fret position tappable, not only the markers. */
  onCellTap?: (string: number, fret: number) => void;
};

/** Dumb renderer: draws the markers it is given. Low string at the bottom, nut on the left. */
export function Fretboard({ markers, strings, frets, leftHanded, position, onCellTap, ...events }: Props) {
  const cols = frets + 1; // column 0 is the open strings, before the nut
  const width = cols * COL;
  const height = strings * ROW;
  const colX = (fret: number) => fretColumn(fret, frets, leftHanded) * COL;
  const stringY = (string: number) => (strings - 1 - string) * ROW + ROW / 2;
  const wireX = (fret: number) => (leftHanded ? colX(fret) : colX(fret) + COL); // the fret wire you press behind
  const fretNumbers = Array.from({ length: frets }, (_, i) => i + 1);
  const scroller = useRef<HTMLDivElement>(null);

  // On a phone the board scrolls: always start at the nut, which is on the right when left-handed.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = leftHanded ? scroller.current.scrollWidth : 0;
  }, [leftHanded, frets]);

  return (
    // max-lg: keep touch-sized frets and scroll; on desktop the board scales to fit
    <div ref={scroller} className="relative overflow-x-auto overscroll-x-contain rounded-xl snap-x snap-proximity" style={{ ["--board" as string]: `${width}px` }}>
      <div className="relative max-lg:w-(--board)">
        <div aria-hidden className="pointer-events-none absolute inset-0 flex">
          {Array.from({ length: cols }, (_, i) => <div key={i} className="flex-1 snap-start" />)}
        </div>
        <svg viewBox={`0 0 ${width} ${height + NUMBERS}`} className="block w-full" role="group" aria-label={`Guitar fretboard${leftHanded ? ", left-handed" : ""}`}>
          <rect width={width} height={height} rx={10} className="fill-wood" />
          {position && (
            <rect
              x={Math.min(colX(position.fromFret), colX(position.toFret))}
              width={(position.toFret - position.fromFret + 1) * COL}
              height={height}
              className="fill-primary/10"
            />
          )}
          {SINGLE_INLAYS.filter((f) => f <= frets).map((f) => <circle key={f} cx={colX(f) + COL / 2} cy={height / 2} r={7} className="fill-inlay" />)}
          {DOUBLE_INLAYS.filter((f) => f <= frets).flatMap((f) => [1, 2].map((k) => <circle key={`${f}-${k}`} cx={colX(f) + COL / 2} cy={(height * k) / 3} r={7} className="fill-inlay" />))}
          {fretNumbers.map((f) => <line key={f} x1={wireX(f)} x2={wireX(f)} y1={0} y2={height} strokeWidth={2} className="stroke-fret/50" />)}
          <line x1={wireX(0)} x2={wireX(0)} y1={0} y2={height} strokeWidth={6} className="stroke-fret" />
          {Array.from({ length: strings }, (_, s) => (
            <line key={s} x1={0} x2={width} y1={stringY(s)} y2={stringY(s)} strokeWidth={1 + (strings - 1 - s) * 0.35} className="stroke-string/70" />
          ))}
          {[...SINGLE_INLAYS, ...DOUBLE_INLAYS].filter((f) => f <= frets).map((f) => (
            <text key={f} x={colX(f) + COL / 2} y={height + 18} textAnchor="middle" fontSize={12} className="fill-muted-foreground">{f}</text>
          ))}
          {onCellTap && Array.from({ length: strings * cols }, (_, i) => {
            const string = Math.floor(i / cols);
            const fret = i % cols;
            return (
              <rect key={i} className="tap-cell" x={colX(fret)} y={stringY(string) - ROW / 2} width={COL} height={ROW} role="button" tabIndex={0}
                aria-label={fret === 0 ? `String ${strings - string}, open` : `String ${strings - string}, fret ${fret}`}
                onClick={() => onCellTap(string, fret)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCellTap(string, fret); } }} />
            );
          })}
          {markers.map((m) => (
            <NoteMarker key={`${m.string}-${m.fret}`} marker={m} cx={colX(m.fret) + COL / 2} cy={stringY(m.string)} where={m.fret === 0 ? `string ${strings - m.string}, open` : `string ${strings - m.string}, fret ${m.fret}`} {...events} />
          ))}
        </svg>
      </div>
    </div>
  );
}
