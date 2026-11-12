// Audio engine. Tone.js is loaded lazily and the audio context starts on the first user gesture;
// nothing here runs during first paint.
import type { PlaybackStep } from "@/core/instruments/resolveCanvas";

type Tone = typeof import("tone");
type Voice = { triggerAttackRelease(notes: number[], duration: number, time?: number): unknown };
type Engine = { Tone: Tone; voice: Voice; click: Voice };

let loading: Promise<Engine> | undefined;
let engine: Engine | undefined;
let muted = false;
let endCurrent: (() => void) | undefined; // onEnd of whatever is playing
let run = 0; // bumped on every play/stop so a slow load cannot start stale playback

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12); // A4 = 440 Hz

// Sample set layout: one file every minor third, named A2.mp3, C3.mp3, Ds3.mp3, Fs3.mp3 ...
const SAMPLES = Object.fromEntries(
  [1, 2, 3, 4, 5, 6].flatMap((o) => [[`A${o}`, `A${o}.mp3`], [`C${o + 1}`, `C${o + 1}.mp3`], [`D#${o + 1}`, `Ds${o + 1}.mp3`], [`F#${o + 1}`, `Fs${o + 1}.mp3`]]),
);

/** Fetch the Tone.js chunk ahead of the first tap, so the tap itself can start audio at once. */
export function preloadAudio() {
  void import("tone");
}

function load(): Promise<Engine> {
  return (loading ??= (async () => {
    const Tone = await import("tone");
    await Tone.start();
    const synth = () =>
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0.2, release: 0.8 },
        volume: -8,
      }).toDestination();
    // shortcut: with no sample set configured this is a plain synth, not a real instrument.
    // Set NEXT_PUBLIC_SAMPLES_URL to a hosted sample folder (see SAMPLES) before sharing publicly.
    const baseUrl = process.env.NEXT_PUBLIC_SAMPLES_URL;
    const voice: Voice = baseUrl
      ? await new Promise<Voice>((resolve) => {
          const sampler = new Tone.Sampler({
            urls: SAMPLES,
            baseUrl,
            release: 1,
            onload: () => resolve(sampler),
            onerror: () => resolve(synth()),
          }).toDestination();
        })
      : synth();
    const click = new Tone.Synth({ envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 }, volume: -10 }).toDestination();
    Tone.getDestination().mute = muted;
    engine = { Tone, voice, click: { triggerAttackRelease: (n, d, t) => click.triggerAttackRelease(n[0], d, t) } };
    return engine;
  })().catch((err) => {
    loading = undefined; // retry on the next tap
    throw err;
  }));
}

const report = (err: unknown) => console.error("Audio unavailable", err);

/** Play one note or a chord now. */
export function playNotes(midis: number[], seconds = 0.8) {
  load().then(({ voice }) => voice.triggerAttackRelease(midis.map(hz), seconds), report);
}

export type PlayOptions = {
  bpm: number;
  loop?: boolean;
  metronome?: boolean;
  /** Called in time with the audio as each step sounds. */
  onStep: (index: number) => void;
  /** Called once when the sequence finishes or is stopped or replaced. */
  onEnd: () => void;
};

/** Play a sequence on the transport. Replaces whatever was playing. */
export function playSteps(steps: PlaybackStep[], { bpm, loop = false, metronome = false, onStep, onEnd }: PlayOptions) {
  stopAudio(); // ends whatever else was playing, and tells it so
  const id = ++run;
  endCurrent = onEnd;
  load().then(({ Tone, voice, click }) => {
    if (id !== run) return;
    const transport = Tone.getTransport();
    const draw = Tone.getDraw();
    transport.stop();
    transport.cancel();
    transport.bpm.value = bpm;
    const beat = 60 / bpm;
    let at = 0;
    steps.forEach((step, i) => {
      transport.schedule((time) => {
        if (step.midis.length) voice.triggerAttackRelease(step.midis.map(hz), step.beats * beat * 0.95, time);
        draw.schedule(() => id === run && onStep(i), time);
      }, at);
      at += step.beats * beat;
    });
    if (metronome) transport.scheduleRepeat((time) => click.triggerAttackRelease([hz(84)], 0.03, time), beat, 0);
    transport.loop = loop;
    transport.loopStart = 0;
    transport.loopEnd = at;
    if (!loop) {
      transport.schedule((time) => draw.schedule(() => id === run && stopAudio(), time), at);
    }
    transport.start("+0.05");
  }, report);
}

/** Stop playback. The sequence that was playing gets its onEnd call. */
export function stopAudio() {
  run++;
  const end = endCurrent;
  endCurrent = undefined;
  end?.();
  if (!engine) return;
  const transport = engine.Tone.getTransport();
  transport.stop();
  transport.cancel();
}

/** Change tempo while playing. */
export function setBpm(bpm: number) {
  if (engine) engine.Tone.getTransport().bpm.value = bpm;
}

export function setMuted(value: boolean) {
  muted = value;
  if (engine) engine.Tone.getDestination().mute = value;
}
