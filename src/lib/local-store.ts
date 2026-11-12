"use client";

// shortcut: per-device state in localStorage. Phase 3 moves lesson progress to the account
// (POST /api/v1/progress); the instrument choice moves to the profile.
import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function useStored(key: string, fallback: string): [string, (value: string) => void] {
  const read = () => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback; // storage blocked: still works for this page view
    }
  };
  const value = useSyncExternalStore(subscribe, read, () => fallback);
  const set = (next: string) => {
    try {
      localStorage.setItem(key, next);
    } catch {}
    listeners.forEach((l) => l());
  };
  return [value, set];
}

export type Instrument = "guitar" | "piano";

/** The learner's instrument; remembered between lessons. */
export function useInstrument(): [Instrument, (value: Instrument) => void] {
  const [value, set] = useStored("fretkey.instrument", "guitar");
  return [value === "piano" ? "piano" : "guitar", set];
}

/** Slugs of completed lessons. */
export function useCompleted(): [ReadonlySet<string>, (slug: string) => void] {
  const [value, set] = useStored("fretkey.completed", "");
  const done = new Set(value.split(",").filter(Boolean));
  return [done, (slug) => set([...done, slug].join(","))];
}
