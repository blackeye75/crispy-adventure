"use client";

import { useState, useSyncExternalStore } from "react";
import { DAILY_GOALS, type Instrument } from "@/core/schemas/api";
import type { NoteNaming } from "@/core/theory/syllables";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { api } from "@/lib/api";
import { Choice } from "./OnboardingFlow";

type Prefs = { instrument: Instrument; dailyGoalMinutes: number; leftHanded: boolean; noteNaming: NoteNaming };

/** Instrument, daily goal, note names and left-handed fretboard: saved to the account. */
export function PreferencesForm({ initial }: { initial: Prefs }) {
  const [prefs, setPrefs] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | string>("idle");
  const change = (patch: Partial<Prefs>) => {
    setPrefs({ ...prefs, ...patch });
    setState("idle");
  };
  const save = async () => {
    setState("saving");
    try {
      await api("/me", { method: "PATCH", body: prefs });
      setState("saved");
    } catch (err) {
      setState((err as Error).message);
    }
  };
  return (
    <section aria-label="Preferences" className="flex flex-col gap-6 rounded-2xl border bg-card p-6">
      <h2 className="text-2xl">Preferences</h2>
      <Choice legend="Instrument" value={prefs.instrument} options={[["guitar", "Guitar"], ["piano", "Piano"]]} onChange={(instrument) => change({ instrument })} />
      <Choice legend="Daily goal" value={prefs.dailyGoalMinutes} options={DAILY_GOALS.map((n) => [n, `${n} min`] as [number, string])} onChange={(dailyGoalMinutes) => change({ dailyGoalMinutes })} />
      <div className="flex flex-col gap-2">
        <Choice legend="Note names on the instruments" value={prefs.noteNaming} options={[["letters", "C D E"], ["solfege", "Do Re Mi"], ["sargam", "Sa Re Ga"]]} onChange={(noteNaming) => change({ noteNaming })} />
        <p className="text-sm text-muted-foreground">Do Re Mi and Sa Re Ga name each note from the home note of the scale or chord. Lesson text still uses letters.</p>
      </div>
      <label className="flex min-h-11 items-center gap-3 text-lg">
        <input type="checkbox" className="size-5 accent-primary" checked={prefs.leftHanded} onChange={(e) => change({ leftHanded: e.target.checked })} />
        Left-handed fretboard in lessons
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={save} disabled={state === "saving"}>Save preferences</Button>
        <p role="status" className={state === "saved" ? "text-success" : "text-destructive"}>{state === "saved" ? "Saved." : state === "idle" || state === "saving" ? "" : state}</p>
      </div>
    </section>
  );
}

// The theme lives on <html data-theme> and in this browser's storage; it is a device choice, not an account one.
const watchTheme = (changed: () => void) => {
  const observer = new MutationObserver(changed);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};

export function ThemeSwitch() {
  const theme = useSyncExternalStore(watchTheme, () => (document.documentElement.dataset.theme === "light" ? "light" : "dark"), () => "dark" as const);
  const set = (next: "dark" | "light") => {
    if (next === "light") document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.theme = next;
    } catch {} // storage blocked: the choice lasts for this visit
  };
  return (
    <section aria-label="Appearance" className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-6">
      <h2 className="text-2xl">Appearance</h2>
      <Segmented label="Theme" value={theme} options={[["dark", "Dark"], ["light", "Light"]]} onChange={set} />
    </section>
  );
}
