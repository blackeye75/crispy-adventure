// A piano part for two hands. Each hand is written in the text form of ./notation.ts.
import type { PlaybackStep } from "../instruments/resolveCanvas";
import { itemBeats, notationSteps, parseNotation, togetherSteps, type NotationItem } from "./notation";

type Note = Extract<NotationItem, { bar: false }>;
export const handNotes = (source: string) => parseNotation(source).filter((item): item is Note => !item.bar);

/**
 * Both hands as one sequence of steps, and for every step which written note of each hand is sounding
 * (its index among that hand's notes and rests), so the screen can follow the audio.
 */
export function handsPlayback(right: string, left?: string): { steps: PlaybackStep[]; active: (number | undefined)[][] } {
  const hands = [right, ...(left ? [left] : [])].map(handNotes);
  const steps = togetherSteps(hands.map(notationSteps));
  // when each written note starts, in beats; tied notes are not used in hands parts
  const starts = hands.map((items) => items.reduce<number[]>((all, item, i) => [...all, i ? all[i - 1] + itemBeats(items[i - 1]) : 0], []));
  let at = 0;
  const active = steps.map((step) => {
    const now = at + 0.001;
    at += step.beats;
    return hands.map((items, h) => {
      const i = starts[h].findLastIndex((start) => start <= now);
      return i >= 0 && now < starts[h][i] + itemBeats(items[i]) ? i : undefined;
    });
  });
  return { steps, active };
}

/** Finger numbers must name one finger per note: "135" for a three-note chord, "-" for a rest. */
export function fingersFit(source: string, fingers: string): boolean {
  const items = handNotes(source);
  const tokens = fingers.split(" ");
  return tokens.length === items.length && items.every((item, i) => (item.pitches.length ? /^[1-5]+$/.test(tokens[i]) && tokens[i].length === item.pitches.length : tokens[i] === "-"));
}
