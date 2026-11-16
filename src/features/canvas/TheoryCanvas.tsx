"use client";

import { Metronome, Pause, Play, Repeat, TrendingUp, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { STANDARD_TUNING } from "@/core/instruments/fretboard";
import { loopSection, SILENT_BAR, trainerBpm } from "@/core/instruments/practice";
import { playbackSteps, resolveCanvas, type Marker } from "@/core/instruments/resolveCanvas";
import { canvasToQuery, type CanvasShow, type CanvasState } from "@/core/schemas/canvas";
import { CHORDS, chordIntervals } from "@/core/theory/chords";
import { INTERVALS } from "@/core/theory/intervals";
import { glyphs, midi, respellRoot, rootChoices, spellMidi } from "@/core/theory/notes";
import { SCALES, scaleIntervals } from "@/core/theory/scales";
import { playNotes, playSteps, preloadAudio, setBpm as setAudioBpm, setMuted as setAudioMuted, stopAudio } from "@/features/audio/engine";
import { Fretboard } from "@/features/fretboard/Fretboard";
import { Keyboard } from "@/features/keyboard/Keyboard";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import { TheoryPanel } from "./TheoryPanel";

const PROGRESSIONS = [
  { name: "I–IV–V", numerals: ["I", "IV", "V"] },
  { name: "I–V–vi–IV", numerals: ["I", "V", "vi", "IV"] },
  { name: "vi–IV–I–V", numerals: ["vi", "IV", "I", "V"] },
  { name: "ii–V–I", numerals: ["ii", "V", "I"] },
  { name: "12-bar blues", numerals: ["I", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "I"] },
];
const DROP_D = ["D2", ...STANDARD_TUNING.slice(1)];
const KINDS = ["scale", "chord", "interval", "progression"] as const;
const DEFAULT_SHOW: { [K in (typeof KINDS)[number]]: Extract<CanvasShow, { kind: K }> } = {
  scale: { kind: "scale", scale: "major" },
  chord: { kind: "chord", chord: "major" },
  interval: { kind: "interval", interval: "5P" },
  progression: { kind: "progression", numerals: PROGRESSIONS[0].numerals, activeIndex: 0 },
};
type PlayMode = "up" | "down" | "chord";

/** Intervals that decide how the root is spelled for a selection. */
const spellingOf = (show: CanvasShow) =>
  show.kind === "scale" ? scaleIntervals(show.scale) : show.kind === "chord" ? chordIntervals(show.chord) : scaleIntervals("major");

const field = "h-11 rounded-md border bg-card px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

/** Owns the one CanvasState. Fretboard, keyboard and panel all render from `resolveCanvas(state)`. */
export function TheoryCanvas({ initial }: { initial: CanvasState }) {
  const [state, setState] = useState(initial);
  const [sounding, setSounding] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [mode, setMode] = useState<PlayMode>("up");
  const [muted, setMuted] = useState(false);
  const [click, setClick] = useState(false); // metronome
  const [trainer, setTrainer] = useState(false); // tempo trainer: implies loop
  const [section, setSection] = useState<[number, number]>([0, Infinity]); // chords of a progression to loop
  const trained = useRef({ start: 80, passes: 0 });
  const pulseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const resolved = useMemo(() => resolveCanvas(state), [state]);
  const { show, guitar } = state;
  const query = canvasToQuery(state);

  useEffect(() => {
    window.history.replaceState(null, "", `?${query}`); // shareable link, no navigation
  }, [query]);
  useEffect(() => {
    preloadAudio();
    return stopAudio;
  }, []);

  const stop = () => {
    stopAudio();
    setPlaying(false);
    setSounding([]);
  };
  /** Any change to what is shown stops playback and clears the hover. */
  const change = (patch: Partial<CanvasState>) => {
    stop();
    setState((s) => ({ ...s, ...patch, focusPitch: undefined }));
    setSection([0, Infinity]);
  };
  const changeShow = (next: CanvasShow, root = state.root) => change({ show: next, root: respellRoot(root, spellingOf(next)) });

  /** Light up and play notes for a moment (a tap on an instrument or the panel). */
  const pulse = (midis: number[]) => {
    clearTimeout(pulseTimer.current);
    setSounding(midis);
    playNotes(midis);
    pulseTimer.current = setTimeout(() => setSounding([]), 500);
  };
  const hover = (marker: Marker | undefined) => setState((s) => (s.focusPitch === marker?.pitch ? s : { ...s, focusPitch: marker?.pitch }));
  const tap = (marker: Marker) => {
    if (playing) stop();
    pulse([marker.midi]);
  };
  const setActiveChord = (index: number) => setState((s) => (s.show.kind === "progression" ? { ...s, show: { ...s.show, activeIndex: index } } : s));

  const chordCount = show.kind === "progression" ? show.numerals.length : 0;
  const from = Math.min(section[0], Math.max(chordCount - 1, 0));
  const to = Math.max(from, Math.min(section[1], chordCount - 1));
  const sectioned = loop || trainer; // a section only makes sense while looping

  /** Start the notes, or with `notes` false the metronome on its own. */
  const start = (notes: boolean, withClick = click) => {
    const all = notes ? playbackSteps(state, mode) : SILENT_BAR;
    const steps = notes && sectioned && chordCount ? loopSection(all, from, to) : all;
    trained.current = { start: bpm, passes: 0 };
    setPlaying(true);
    playSteps(steps, {
      bpm,
      loop: sectioned || !notes,
      metronome: withClick ? { every: 1, accent: 4 } : undefined,
      onStep: (i) => {
        if (i === 0 && notes && trainer) {
          const next = trainerBpm(trained.current.start, trained.current.passes++);
          setBpm(next);
          setAudioBpm(next);
        }
        setSounding(steps[i].midis);
        if (steps[i].index !== undefined) setActiveChord(steps[i].index);
      },
      onEnd: () => {
        setPlaying(false);
        setSounding([]);
      },
    });
  };
  const togglePlay = () => (playing ? stop() : start(true));

  const activeChromas = useMemo(
    () => new Set([...sounding, ...(state.focusPitch ? [midi(state.focusPitch)] : [])].map((m) => m % 12)),
    [sounding, state.focusPitch],
  );
  const events = { sounding, onNoteHover: hover, onNoteTap: tap };
  const progressionId = show.kind === "progression" ? show.numerals.join("-") : "";

  const panel = (
    <TheoryPanel
      resolved={resolved}
      activeChromas={activeChromas}
      activeChord={show.kind === "progression" ? show.activeIndex : undefined}
      onTone={(tone) => pulse([midi(spellMidi(48 + ((tone.chroma - 48 + 120) % 12), tone.pitchClass))])}
      onChord={(index) => {
        if (playing) stop();
        setActiveChord(index);
        pulse(playbackSteps(state, "chord")[index].midis);
      }}
      onRelated={(related) => changeShow(related.show, related.root)}
    />
  );

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 p-4 pb-40 lg:gap-6 lg:p-8">
      <p className="sr-only" aria-live="polite">{resolved.announce}</p>

      {/* Control bar */}
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        <select aria-label="Root note" className={field} value={state.root} onChange={(e) => change({ root: e.target.value })}>
          {rootChoices(spellingOf(show)).map((root) => <option key={root} value={root}>{glyphs(root)}</option>)}
        </select>
        {show.kind === "scale" && (
          <select aria-label="Scale" className={field} value={show.scale} onChange={(e) => changeShow({ kind: "scale", scale: e.target.value as typeof show.scale })}>
            {SCALES.map((s) => <option key={s.id} value={s.id}>{s.name[0].toUpperCase() + s.name.slice(1)}</option>)}
          </select>
        )}
        {show.kind === "chord" && (
          <>
            <select aria-label="Chord" className={field} value={show.chord} onChange={(e) => changeShow({ kind: "chord", chord: e.target.value as typeof show.chord })}>
              {CHORDS.map((c) => <option key={c.id} value={c.id}>{c.name[0].toUpperCase() + c.name.slice(1)}</option>)}
            </select>
            <select aria-label="Inversion" className={field} value={Math.min(show.inversion ?? 0, chordIntervals(show.chord).length - 1)} onChange={(e) => changeShow({ ...show, inversion: Number(e.target.value) as 0 | 1 | 2 | 3 })}>
              {["Root position", "1st inversion", "2nd inversion", "3rd inversion"].slice(0, Math.min(4, chordIntervals(show.chord).length)).map((name, i) => <option key={name} value={i}>{name}</option>)}
            </select>
          </>
        )}
        {show.kind === "interval" && (
          <select aria-label="Interval" className={field} value={show.interval} onChange={(e) => changeShow({ kind: "interval", interval: e.target.value as typeof show.interval })}>
            {INTERVALS.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        )}
        {show.kind === "progression" && (
          <select aria-label="Progression" className={field} value={progressionId} onChange={(e) => changeShow({ kind: "progression", numerals: e.target.value.split("-"), activeIndex: 0 })}>
            {!PROGRESSIONS.some((p) => p.numerals.join("-") === progressionId) && <option value={progressionId}>{show.numerals.join("–")}</option>}
            {PROGRESSIONS.map((p) => <option key={p.name} value={p.numerals.join("-")}>{p.name}</option>)}
          </select>
        )}
        <Segmented label="Show" value={show.kind as (typeof KINDS)[number]} options={KINDS.map((k) => [k, k[0].toUpperCase() + k.slice(1)] as const)} onChange={(kind) => changeShow(DEFAULT_SHOW[kind])} />
        <Segmented label="Labels" value={state.labels} options={[["notes", "Notes"], ["degrees", "Degrees"], ["intervals", "Intervals"], ["solfege", "Do Re Mi"], ["sargam", "Sa Re Ga"]]} onChange={(labels) => setState((s) => ({ ...s, labels }))} />
        <details className="relative shrink-0">
          <summary className={cn(field, "flex cursor-pointer list-none items-center")}>View</summary>
          <div className="absolute right-0 z-20 mt-2 flex w-56 flex-col gap-3 rounded-lg border bg-card p-4 text-sm shadow-lg max-lg:fixed max-lg:right-4">
            <label className="flex min-h-11 items-center gap-3">
              <input type="checkbox" className="size-5 accent-primary" checked={guitar.leftHanded} onChange={(e) => change({ guitar: { ...guitar, leftHanded: e.target.checked } })} />
              Left-handed
            </label>
            <label className="flex flex-col gap-1.5">
              Tuning
              <select className={field} value={guitar.tuning.join("-")} onChange={(e) => change({ guitar: { ...guitar, tuning: e.target.value.split("-") } })}>
                {[...new Map([["Standard", STANDARD_TUNING], ["Drop D", DROP_D], ["Custom", guitar.tuning]].map(([name, t]) => [(t as string[]).join("-"), name as string]))].map(([value, name]) => (
                  <option key={value} value={value}>{name} ({value.replace(/\d/g, "").replace(/-/g, " ")})</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              Frets
              <select className={field} value={guitar.frets} onChange={(e) => change({ guitar: { ...guitar, frets: Number(e.target.value) } })}>
                {[...new Set([12, 15, 24, guitar.frets])].sort((a, b) => a - b).map((n) => <option key={n} value={n}>0–{n}</option>)}
              </select>
            </label>
          </div>
        </details>
      </div>

      {/* Instruments + panel */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-6">
        <div className="flex min-w-0 flex-col gap-4 lg:gap-6">
          <Fretboard markers={resolved.fretboard} strings={guitar.tuning.length} frets={guitar.frets} leftHanded={guitar.leftHanded} position={state.position} {...events} />
          <Keyboard markers={resolved.keyboard} from={state.keyboard.from} to={state.keyboard.to} {...events} />
        </div>
        <aside aria-label="Theory" className="hidden rounded-xl border bg-card p-6 lg:block">{panel}</aside>
      </div>

      {/* Phone: panel as a bottom sheet above the fixed transport. Desktop: transport in the flow. */}
      <div className="max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-10 max-lg:border-t max-lg:bg-background">
        <details className="border-b lg:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 text-sm">
            <span className="truncate"><span className="font-medium">{resolved.title}</span> · {resolved.announce.slice(resolved.title.length + 2)}</span>
            <span aria-hidden className="ml-auto text-muted-foreground">Details</span>
          </summary>
          <div className="max-h-[55vh] overflow-y-auto px-4 pt-2 pb-4">{panel}</div>
        </details>
        <div role="group" aria-label="Playback" className="flex items-center gap-2 overflow-x-auto px-4 py-2 lg:rounded-xl lg:border lg:bg-card lg:px-6 lg:py-3">
          <Button onClick={togglePlay} aria-label={playing ? "Stop" : "Play"} className="shrink-0">
            {playing ? <Pause /> : <Play />}
            <span className="max-sm:hidden">{playing ? "Stop" : "Play"}</span>
          </Button>
          <Button variant={loop ? "secondary" : "ghost"} size="icon" aria-label="Loop" aria-pressed={loop} className="shrink-0" onClick={() => { stop(); setLoop(!loop); }}>
            <Repeat className={loop ? "text-primary" : undefined} />
          </Button>
          <label className="flex shrink-0 items-center gap-2 text-sm tabular-nums">
            <span aria-hidden>♩ {bpm}</span>
            <input type="range" aria-label="Tempo in beats per minute" min={40} max={200} step={5} value={bpm} className="h-11 w-24 accent-primary sm:w-36"
              onChange={(e) => { const next = Number(e.target.value); setBpm(next); setAudioBpm(next); trained.current = { start: next, passes: 0 }; }} />
          </label>
          <Button variant={click ? "secondary" : "ghost"} size="icon" aria-label="Metronome" aria-pressed={click} className="shrink-0"
            onClick={() => { stop(); setClick(!click); if (!click) start(false, true); }}>
            <Metronome className={click ? "text-primary" : undefined} />
          </Button>
          <Button variant={trainer ? "secondary" : "ghost"} size="icon" aria-label="Tempo trainer: loop, 5 faster every second time round" title="Tempo trainer" aria-pressed={trainer} className="shrink-0"
            onClick={() => { stop(); setTrainer(!trainer); }}>
            <TrendingUp className={trainer ? "text-primary" : undefined} />
          </Button>
          {sectioned && chordCount > 1 && (
            <label className="flex shrink-0 items-center gap-1 text-sm">
              <span>Chords</span>
              <select aria-label="Loop from chord" value={from} className={field} onChange={(e) => { stop(); setSection([Number(e.target.value), to]); }}>
                {show.kind === "progression" && show.numerals.map((_, i) => <option key={i} value={i}>{i + 1}</option>)}
              </select>
              <span>to</span>
              <select aria-label="Loop to chord" value={to} className={field} onChange={(e) => { stop(); setSection([from, Number(e.target.value)]); }}>
                {show.kind === "progression" && show.numerals.map((_, i) => i >= from && <option key={i} value={i}>{i + 1}</option>)}
              </select>
            </label>
          )}
          {show.kind !== "progression" && (
            <Segmented label="Playback pattern" value={mode} options={[["up", "Up"], ["down", "Down"], ["chord", "Chord"]]} onChange={(next) => { stop(); setMode(next); }} />
          )}
          <Button variant="ghost" size="icon" aria-label={muted ? "Unmute" : "Mute"} aria-pressed={muted} className="ml-auto shrink-0" onClick={() => { setMuted(!muted); setAudioMuted(!muted); }}>
            {muted ? <VolumeX /> : <Volume2 />}
          </Button>
        </div>
      </div>
    </div>
  );
}
