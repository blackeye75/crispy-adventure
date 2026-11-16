// Writes public/focus.wav: an original 84-second focus track, 80 bpm, 28 bars of Fmaj7 – Em7 – Dm7 – Cmaj7.
// Soft electric piano, a quiet bass, brushed drums and a sparse plucked melody. Run: node scripts/make-focus-music.mjs
import { writeFileSync } from "node:fs";

const RATE = 44100, BPM = 80, BEAT = 60 / BPM, BAR = 4 * BEAT, BARS = 28, SECONDS = BARS * BAR;
const out = new Float32Array(Math.round(RATE * SECONDS));
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

/** An electric-piano note: a sine with a little bell on top, a soft attack and a long decay. */
function keys(at, midi, gain, seconds) {
  const start = Math.round(at * RATE), f = hz(midi);
  for (let k = 0; k < seconds * RATE && start + k < out.length; k++) {
    const t = k / RATE;
    const env = Math.min(1, t / 0.012) * Math.exp(-t * 1.5) * Math.min(1, (seconds - t) / 0.2);
    const tremolo = 1 + 0.08 * Math.sin(2 * Math.PI * 4.5 * t);
    out[start + k] += (Math.sin(2 * Math.PI * f * t) + 0.28 * Math.sin(2 * Math.PI * 2 * f * t) * Math.exp(-t * 4) + 0.1 * Math.sin(2 * Math.PI * 4 * f * t) * Math.exp(-t * 9)) * env * tremolo * gain;
  }
}
function pluck(at, midi, gain, seconds = 1.8) {
  const n = Math.round(RATE / hz(midi));
  const line = Float32Array.from({ length: n }, rand);
  let i = 0, prev = 0;
  const start = Math.round(at * RATE);
  for (let k = 0; k < seconds * RATE && start + k < out.length; k++) {
    const next = (i + 1) % n;
    line[i] = (line[i] + line[next]) * 0.5 * 0.995;
    prev += (line[i] - prev) * 0.35; // take the edge off: this melody should sit behind the picture
    out[start + k] += prev * gain;
    i = next;
  }
}
function bass(at, midi, gain, seconds) {
  const start = Math.round(at * RATE), f = hz(midi);
  for (let k = 0; k < seconds * RATE && start + k < out.length; k++) {
    const t = k / RATE;
    out[start + k] += Math.sin(2 * Math.PI * f * t) * gain * Math.min(1, t / 0.02) * Math.min(1, (seconds - t) / 0.15);
  }
}
function kick(at, gain) {
  const start = Math.round(at * RATE);
  let phase = 0;
  for (let k = 0; k < 0.2 * RATE && start + k < out.length; k++) {
    const t = k / RATE;
    phase += (2 * Math.PI * (48 + 60 * Math.exp(-t * 30))) / RATE;
    out[start + k] += Math.sin(phase) * gain * Math.exp(-t * 18);
  }
}
/** A brush of filtered noise: short for a hat, longer and lower for the backbeat. */
function brush(at, gain, decay, colour) {
  const start = Math.round(at * RATE);
  let low = 0;
  for (let k = 0; k < 0.25 * RATE && start + k < out.length; k++) {
    const noise = rand();
    low += (noise - low) * colour;
    out[start + k] += (colour > 0.5 ? noise - low : low) * gain * Math.exp((-k / RATE) * decay);
  }
}

// bass note, then the chord voicing (sevenths in close position around middle C)
const CHORDS = [
  [41, [57, 60, 64, 65]], // Fmaj7
  [40, [55, 59, 62, 64]], // Em7
  [38, [57, 60, 62, 65]], // Dm7
  [36, [55, 59, 60, 64]], // Cmaj7
];
// A melody that only uses C major pentatonic, so it never argues with the chords. [beat in the 4-bar phrase, note]
const MELODY = [[0, 76], [1.5, 79], [3, 76], [4.5, 74], [6, 72], [8, 69], [9.5, 72], [11, 74], [12.5, 72], [14, 67]];

for (let bar = 0; bar < BARS; bar++) {
  const [root, voicing] = CHORDS[bar % 4];
  const t0 = bar * BAR;
  if (bar === BARS - 1) { // the last bar: one chord, rolled, left to ring
    [36, 55, 59, 62, 64, 67].forEach((n, i) => keys(t0 + i * 0.05, n, 0.2, BAR));
    bass(t0, 36, 0.3, BAR);
    continue;
  }
  const intro = bar < 2; // the hook: keys alone
  voicing.forEach((n, i) => keys(t0 + i * 0.012, n, 0.16, BAR * 0.98));
  if (!intro) voicing.slice(1).forEach((n) => keys(t0 + 2.5 * BEAT, n, 0.07, BEAT * 1.5)); // a soft push before each change
  if (intro) continue;
  bass(t0, root, 0.3, BEAT * 1.8);
  bass(t0 + 2.5 * BEAT, root, 0.2, BEAT * 1.2);
  kick(t0, 0.5);
  kick(t0 + 2.5 * BEAT, 0.32);
  [1, 3].forEach((b) => brush(t0 + b * BEAT, 0.16, 22, 0.25));
  for (let e = 0; e < 8; e++) brush(t0 + e * BEAT / 2 + (e % 2 ? 0.04 : 0), e % 2 ? 0.035 : 0.05, 70, 0.9); // lightly swung hats
}
// the melody comes in with the lessons and rests every other phrase, so it stays in the background
for (let phrase = 1; phrase * 4 < BARS - 2; phrase++) {
  if (phrase % 2 === 0 && phrase > 2) continue;
  MELODY.forEach(([beat, note]) => pluck(phrase * 4 * BAR + beat * BEAT, note, 0.2));
}

const peak = out.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const pcm = Buffer.alloc(44 + out.length * 2);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + out.length * 2, 4); pcm.write("WAVEfmt ", 8);
pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22); pcm.writeUInt32LE(RATE, 24);
pcm.writeUInt32LE(RATE * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(out.length * 2, 40);
out.forEach((v, i) => {
  const fade = Math.min(1, (out.length - i) / (RATE * 1.5));
  pcm.writeInt16LE(Math.round((Math.tanh((v / peak) * 1.3) / Math.tanh(1.3)) * 0.62 * fade * 32767), 44 + i * 2);
});
writeFileSync(new URL("../public/focus.wav", import.meta.url), pcm);
console.log("focus.wav", SECONDS, "s");
