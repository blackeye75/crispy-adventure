"use client";

import { useEffect, useMemo, useRef } from "react";
import { keyboardKeys } from "@/core/instruments/keyboard";
import type { ResolvedCanvas } from "@/core/instruments/resolveCanvas";
import { NoteMarker, type NoteEvents } from "@/features/canvas/NoteMarker";

const WHITE = 44; // ≥ 44px touch target at natural size
const HEIGHT = 156;
const BLACK_W = 30;
const BLACK_H = 96;
const MIDDLE_C = 60;

type Props = NoteEvents & { markers: ResolvedCanvas["keyboard"]; from: string; to: string };

/** Dumb renderer: draws the markers it is given, with the same marker as the fretboard. */
export function Keyboard({ markers, from, to, ...events }: Props) {
  const keys = useMemo(() => keyboardKeys(from, to), [from, to]);
  const width = keys.filter((k) => !k.black).length * WHITE;
  const scroller = useRef<HTMLDivElement>(null);

  // On a phone the keyboard scrolls: start centred on middle C.
  useEffect(() => {
    const el = scroller.current;
    const c4 = keys.find((k) => k.midi === MIDDLE_C);
    if (el && c4) el.scrollLeft = ((c4.x + 0.5) * WHITE * el.scrollWidth) / width - el.clientWidth / 2;
  }, [keys, width]);

  return (
    <div ref={scroller} className="overflow-x-auto overscroll-x-contain rounded-xl" style={{ ["--board" as string]: `${width}px` }}>
      <svg viewBox={`0 0 ${width} ${HEIGHT}`} className="block w-full max-lg:w-(--board)" role="group" aria-label="Piano keyboard">
        {keys.filter((k) => !k.black).map((k) => (
          <g key={k.midi}>
            <rect x={k.x * WHITE + 1} width={WHITE - 2} height={HEIGHT} rx={5} className="fill-key-white" />
            {k.midi % 12 === 0 && (
              <text x={k.x * WHITE + WHITE / 2} y={HEIGHT - 9} textAnchor="middle" fontSize={11} fontWeight={k.midi === MIDDLE_C ? 700 : 400} className="fill-key-black/70">
                C{k.midi / 12 - 1}
              </text>
            )}
            {k.midi === MIDDLE_C && <circle cx={k.x * WHITE + WHITE / 2} cy={HEIGHT - 26} r={2} className="fill-key-black/60" />}
          </g>
        ))}
        {keys.filter((k) => k.black).map((k) => (
          <rect key={k.midi} x={k.x * WHITE - BLACK_W / 2} width={BLACK_W} height={BLACK_H} rx={4} className="fill-key-black" />
        ))}
        {markers.map((m) => {
          const key = keys[m.keyIndex];
          return <NoteMarker key={m.midi} marker={m} cx={key.black ? key.x * WHITE : key.x * WHITE + WHITE / 2} cy={key.black ? BLACK_H - 24 : HEIGHT - 48} {...events} />;
        })}
      </svg>
    </div>
  );
}
