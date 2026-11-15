// A tiny text form for guitar tablature with rhythm, used by lesson content:
//   "6:5/8 6:8/8 | 3:5/8 3:7/8^h 3:7/q^b r/q 2:5+1:5/h"
// string:fret (string 1 = thinnest), a slash, then the length as in ./notation.ts (w h q 8 16 qt 8t, "." dots it).
// "+" stacks notes played together; "r" is a rest; "|" is a bar line.
// "^" adds how the note is played: h = hammer-on, p = pull-off, s = slide into it (all from the note before),
// b = bend up a whole step, bh = bend up a half step, v = vibrato,
// r = release the bend just played, pb = pre-bend (bend a whole step before picking),
// ub = unison bend (two strings together; the lower string is bent a whole step to match the higher).
import { fretMidi, STANDARD_TUNING } from "../instruments/fretboard";
import type { PlaybackStep } from "../instruments/resolveCanvas";
import { itemBeats, type NoteValue } from "./notation";

export const TAB_MARKS = { h: "hammer-on", p: "pull-off", s: "slide", b: "whole-step bend", bh: "half-step bend", v: "vibrato", r: "release", pb: "pre-bend", ub: "unison bend" } as const;
export type TabMark = keyof typeof TAB_MARKS;
export type TabItem =
  | { bar: true }
  | { bar: false; notes: { string: number; fret: number }[]; duration: NoteValue; dotted: boolean; mark?: TabMark };

const TOKEN = /^(r|[1-6]:\d{1,2}(?:\+[1-6]:\d{1,2})*)\/(w|h|qt|q|8t|8|16)(\.)?(?:\^(bh|pb|ub|h|p|s|b|r|v))?$/;

/** Parse the text form. Throws on anything it does not understand. A rest has no notes. */
export function parseTab(source: string): TabItem[] {
  return source.trim().split(/\s+/).map((token) => {
    if (token === "|") return { bar: true };
    const m = TOKEN.exec(token);
    if (!m) throw new Error(`Not a tab note: "${token}"`);
    const notes = m[1] === "r" ? [] : m[1].split("+").map((n) => { const [string, fret] = n.split(":").map(Number); return { string, fret }; });
    if (notes.some((n) => n.fret > 24)) throw new Error(`No such fret: "${token}"`);
    if (new Set(notes.map((n) => n.string)).size !== notes.length) throw new Error(`Two notes on one string: "${token}"`);
    return { bar: false, notes, duration: m[2] as NoteValue, dotted: Boolean(m[3]), mark: m[4] as TabMark | undefined };
  });
}

/** The pitches under the fingers, before any bend. */
export const tabFretted = (item: TabItem, tuning: readonly string[] = STANDARD_TUNING) => (item.bar ? [] : item.notes.map((n) => fretMidi(tuning, tuning.length - n.string, n.fret)));

/** What the transport plays: one step per note or rest; bar lines take no time. */
export function tabSteps(items: TabItem[], tuning: readonly string[] = STANDARD_TUNING): PlaybackStep[] {
  return items.flatMap((item) => {
    if (item.bar) return [];
    // shortcut: a bend sounds as its target pitch and hammer-ons, slides and vibrato as plain notes; upgrade when the audio engine can glide.
    const bend = item.mark === "b" || item.mark === "pb" ? 2 : item.mark === "bh" ? 1 : 0;
    const fretted = tabFretted(item, tuning);
    // in a unison bend only the lower of the two notes is bent
    const midis = item.mark === "ub" ? fretted.map((m) => (m === Math.min(...fretted) ? m + 2 : m)) : fretted.map((m) => m + bend);
    return [{ midis, beats: itemBeats(item) }];
  });
}
