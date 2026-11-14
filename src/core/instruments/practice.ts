// Practice-room tools: pure helpers, shared with the mobile apps.
import type { PlaybackStep } from "./resolveCanvas";

/** Tempo trainer: the tempo after `passes` full times round a loop. It rises by `step` every `every` passes, up to `max`. */
export const trainerBpm = (start: number, passes: number, max = 200, step = 5, every = 2) => Math.min(max, start + Math.floor(passes / every) * step);

/** Section looping: only the steps of chords `from` to `to` (counted from 0, inclusive) of a progression. */
export const loopSection = (steps: PlaybackStep[], from: number, to: number) => steps.filter((s) => s.index === undefined || (s.index >= from && s.index <= to));

/** Four silent beats: what plays when the metronome runs on its own. */
export const SILENT_BAR: PlaybackStep[] = Array.from({ length: 4 }, () => ({ midis: [], beats: 1 }));
