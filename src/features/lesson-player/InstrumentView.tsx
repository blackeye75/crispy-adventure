"use client";

import { createContext, useContext } from "react";
import { STANDARD_TUNING, fretMidi } from "@/core/instruments/fretboard";
import type { ResolvedCanvas } from "@/core/instruments/resolveCanvas";
import type { CanvasState } from "@/core/schemas/canvas";
import { midi } from "@/core/theory/notes";
import type { NoteEvents } from "@/features/canvas/NoteMarker";
import { Fretboard } from "@/features/fretboard/Fretboard";
import { Keyboard } from "@/features/keyboard/Keyboard";
import type { Instrument } from "@/core/schemas/api";
import type { NoteNaming } from "@/core/theory/syllables";

// Lessons show twelve frets: one full octave per string, and less to scroll on a phone.
const GUITAR = { tuning: STANDARD_TUNING, frets: 12, leftHanded: false };

/** The learner's left-handed preference, set once by the lesson or review screen. Mirrors the fretboard only. */
export const LeftHanded = createContext(false);
/** The learner's note-name system. Lessons that label markers with letters use it instead. */
export const Naming = createContext<NoteNaming>("letters");
const KEYS = { from: "E2", to: "E6" };
const NO_EVENTS: NoteEvents = { sounding: [], onNoteHover: () => {}, onNoteTap: () => {} };

/** A lesson's musical selection on the lesson instruments. */
export const lessonState = ({ frets, ...canvas }: Pick<CanvasState, "root" | "show" | "labels" | "position"> & { frets?: number }): CanvasState => ({ ...canvas, guitar: { ...GUITAR, frets: frets ?? GUITAR.frets }, keyboard: KEYS });

export type Tap = { midi: number; string?: number; fret?: number };
type Markers = Pick<ResolvedCanvas, "fretboard" | "keyboard">;

/** Guitar string number the way players count: 1 = thinnest. */
export const stringNumber = (tap: Tap) => (tap.string === undefined ? undefined : GUITAR.tuning.length - tap.string);

/** Drill markers for tapped positions, on whichever instrument is showing. */
export function tapMarkers(taps: (Tap & { label: string; pitch: string; state?: "correct" | "wrong" })[]): Markers {
  const base = (t: (typeof taps)[number]) => ({ midi: t.midi, pitch: t.pitch, pitchClass: t.pitch.replace(/\d+$/, ""), role: "chord" as const, label: t.label, focus: false, echo: false, dimmed: false, state: t.state });
  return {
    fretboard: taps.flatMap((t) => (t.string === undefined || t.fret === undefined ? [] : [{ ...base(t), string: t.string, fret: t.fret }])),
    keyboard: taps.flatMap((t) => (t.string === undefined ? [{ ...base(t), keyIndex: t.midi - midi(KEYS.from) }] : [])),
  };
}

type Props = Partial<NoteEvents> & {
  instrument: Instrument;
  markers: Markers;
  position?: CanvasState["position"];
  /** Frets to draw; lessons default to twelve. */
  frets?: number;
  /** Drills: taps on any position, marked or not. */
  onTap?: (tap: Tap) => void;
};

/** The fretboard or the keyboard, whichever the learner plays. */
export function InstrumentView({ instrument, markers, position, frets = GUITAR.frets, onTap, ...events }: Props) {
  const all = { ...NO_EVENTS, ...events };
  const leftHanded = useContext(LeftHanded);
  return instrument === "guitar" ? (
    <Fretboard markers={markers.fretboard} strings={GUITAR.tuning.length} frets={frets} leftHanded={leftHanded} position={position}
      onCellTap={onTap && ((string, fret) => onTap({ midi: fretMidi(GUITAR.tuning, string, fret), string, fret }))} {...all} />
  ) : (
    <Keyboard markers={markers.keyboard} from={KEYS.from} to={KEYS.to} onKeyTap={onTap && ((m) => onTap({ midi: m }))} {...all} />
  );
}
