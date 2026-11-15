// Writes public/music.wav: an original 60-second track, 100 bpm, 25 bars of Am – F – C – G.
// Run: node scripts/make-music.mjs
import { writeFileSync } from "node:fs";

const RATE = 44100, BPM = 100, BEAT = 60 / BPM, BAR = 4 * BEAT, SECONDS = 60;
const out = new Float32Array(RATE * SECONDS);
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

/** A plucked string (Karplus–Strong): a burst of noise fed round a delay line that slowly smooths it. */
function pluck(at, midi, gain, seconds = 1.6, damp = 0.996) {
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
function sine(at, midi, gain, seconds, attack = 0.4) {
  const start = Math.round(at * RATE), f = hz(midi);
  for (let k = 0; k < seconds * RATE && start + k < out.length; k++) {
    const t = k / RATE;
    out[start + k] += Math.sin(2 * Math.PI * f * t) * gain * Math.min(1, t / attack) * Math.min(1, (seconds - t) / 0.5);
  }
}
function kick(at, gain) {
  const start = Math.round(at * RATE);
  let phase = 0;
  for (let k = 0; k < 0.22 * RATE && start + k < out.length; k++) {
    const t = k / RATE;
    phase += (2 * Math.PI * (45 + 80 * Math.exp(-t * 28))) / RATE;
    out[start + k] += Math.sin(phase) * gain * Math.exp(-t * 16);
  }
}
function hat(at, gain) {
  const start = Math.round(at * RATE);
  let last = 0;
  for (let k = 0; k < 0.05 * RATE && start + k < out.length; k++) {
    const noise = rand();
    out[start + k] += (noise - last) * gain * Math.exp((-k / RATE) * 90); // crude high-pass
    last = noise;
  }
}

// bass note, then the four arpeggio notes low to high
const CHORDS = [[45, 57, 60, 64, 69], [41, 53, 57, 60, 65], [48, 55, 60, 64, 67], [43, 55, 59, 62, 67]];
const ORDER = [0, 1, 2, 3, 2, 1, 2, 3];
for (let bar = 0; bar < 25; bar++) {
  const [bass, ...notes] = CHORDS[bar % 4];
  const t0 = bar * BAR;
  const last = bar === 24;
  if (last) { // the final bar: one rolled chord, left to ring
    notes.forEach((n, i) => pluck(t0 + i * 0.04, n, 0.5, 2.4, 0.998));
    pluck(t0, bass, 0.6, 2.4, 0.998);
    sine(t0, bass - 12, 0.16, 2.4, 0.05);
    kick(t0, 0.7);
    continue;
  }
  const intro = bar < 2; // two sparse bars, then the band comes in with the logo
  ORDER.forEach((n, i) => (!intro || i % 2 === 0) && pluck(t0 + i * BEAT / 2, notes[n], intro ? 0.34 : 0.3 + (i === 0 ? 0.1 : 0)));
  if (!intro) {
    pluck(t0, bass, 0.55, 2.2);
    pluck(t0 + 2.5 * BEAT, bass, 0.35, 1.2);
    sine(t0, bass - 12, 0.14, BAR, 0.02);
    [0, 2].forEach((b) => kick(t0 + b * BEAT, 0.6));
    for (let e = 1; e < 8; e += 2) hat(t0 + e * BEAT / 2, 0.12);
  }
  if (bar >= 4) notes.slice(1).forEach((n) => sine(t0, n + 12, 0.022, BAR)); // a soft pad from the first feature scene on
  if (bar >= 8 && bar % 4 === 3) [5, 6, 7].forEach((e) => hat(t0 + e * BEAT / 2 + BEAT / 4, 0.09)); // a small fill before each turn
}

const peak = out.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const pcm = Buffer.alloc(44 + out.length * 2);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + out.length * 2, 4); pcm.write("WAVEfmt ", 8);
pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22); pcm.writeUInt32LE(RATE, 24);
pcm.writeUInt32LE(RATE * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(out.length * 2, 40);
out.forEach((v, i) => {
  const fade = Math.min(1, (out.length - i) / (RATE * 1.2));
  pcm.writeInt16LE(Math.round(Math.tanh((v / peak) * 1.4) / Math.tanh(1.4) * 0.85 * fade * 32767), 44 + i * 2);
});
writeFileSync(new URL("../public/music.wav", import.meta.url), pcm);
console.log("music.wav", SECONDS, "s, peak before limiting", peak.toFixed(2));
