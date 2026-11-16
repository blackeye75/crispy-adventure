// Writes public/blues.wav: one original chorus of a twelve-bar blues in A, 120 bpm with a shuffle, for the blues reel.
// Twelve bars of two seconds, then the last chord rings. Run: node scripts/make-blues.mjs
import { writeFileSync } from "node:fs";

const RATE = 44100, BEAT = 0.5, BAR = 4 * BEAT, SECONDS = 12 * BAR + 2.5;
const out = new Float32Array(Math.round(RATE * SECONDS));
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
let seed = 5;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

function pluck(at, midi, gain, seconds = 1.2, damp = 0.994) {
  const n = Math.round(RATE / hz(midi));
  const line = Float32Array.from({ length: n }, rand);
  let i = 0;
  const start = Math.round(at * RATE);
  for (let k = 0; k < seconds * RATE && start + k < out.length; k++) {
    const next = (i + 1) % n;
    line[i] = (line[i] + line[next]) * 0.5 * damp;
    out[start + k] += line[i] * gain;
    i = next;
  }
}
function kick(at, gain) {
  const start = Math.round(at * RATE);
  let phase = 0;
  for (let k = 0; k < 0.2 * RATE && start + k < out.length; k++) {
    const t = k / RATE;
    phase += (2 * Math.PI * (48 + 70 * Math.exp(-t * 30))) / RATE;
    out[start + k] += Math.sin(phase) * gain * Math.exp(-t * 17);
  }
}
function snare(at, gain) {
  const start = Math.round(at * RATE);
  let last = 0;
  for (let k = 0; k < 0.12 * RATE && start + k < out.length; k++) {
    const noise = rand();
    out[start + k] += (noise - last * 0.5) * gain * Math.exp((-k / RATE) * 32);
    last = noise;
  }
}

// root in the bass, then the dominant seventh above it
const A7 = [45, [57, 61, 64, 67]], D7 = [50, [57, 60, 62, 66]], E7 = [40, [56, 59, 62, 64]];
const FORM = [A7, A7, A7, A7, D7, D7, A7, A7, E7, D7, A7, A7];
const LONG = (BEAT * 2) / 3; // shuffle: each beat is split long, then short
FORM.forEach(([root, chord], bar) => {
  const t0 = bar * BAR;
  for (let beat = 0; beat < 4; beat++) {
    const t = t0 + beat * BEAT;
    // the classic boogie bass: root with the fifth, then root with the sixth
    pluck(t, root, 0.5, 0.5);
    pluck(t, root + (beat % 2 ? 9 : 7), 0.3, 0.5);
    pluck(t + LONG, root, 0.3, 0.3);
    if (beat % 2 === 0) kick(t, 0.55); else snare(t, 0.2);
    if (beat === 0 || beat === 2) chord.forEach((n, i) => pluck(t + i * 0.012, n, 0.16, 0.9));
    else chord.forEach((n, i) => pluck(t + LONG + i * 0.012, n, 0.1, 0.35));
  }
});
[45, 52, 57, 61, 64, 67].forEach((n, i) => pluck(12 * BAR + i * 0.04, n, 0.4, 2.4, 0.998)); // the final A7, rolled
kick(12 * BAR, 0.6);

const peak = out.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const pcm = Buffer.alloc(44 + out.length * 2);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + out.length * 2, 4); pcm.write("WAVEfmt ", 8);
pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22); pcm.writeUInt32LE(RATE, 24);
pcm.writeUInt32LE(RATE * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(out.length * 2, 40);
out.forEach((v, i) => {
  const fade = Math.min(1, (out.length - i) / (RATE * 1.0));
  pcm.writeInt16LE(Math.round((Math.tanh((v / peak) * 1.4) / Math.tanh(1.4)) * 0.7 * fade * 32767), 44 + i * 2);
});
writeFileSync(new URL("../public/blues.wav", import.meta.url), pcm);
console.log("blues.wav", SECONDS, "s");
