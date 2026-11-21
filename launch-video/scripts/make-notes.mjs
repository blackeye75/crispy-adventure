// Writes public/notes/<midi>.wav: one soft piano-like note for every key from E2 (40) to G5 (79).
// Run: node scripts/make-notes.mjs
import { writeFileSync } from "node:fs";

const RATE = 44100, SECONDS = 1.6;
for (let midi = 40; midi <= 79; midi++) {
  const f = 440 * 2 ** ((midi - 69) / 12);
  const out = new Float32Array(RATE * SECONDS);
  // a few harmonics, each slightly stretched and dying away faster than the one below: a struck string
  [1, 0.5, 0.28, 0.14, 0.07].forEach((amp, h) => {
    const freq = f * (h + 1) * (1 + 0.0004 * h * h);
    for (let k = 0; k < out.length; k++) {
      const t = k / RATE;
      out[k] += Math.sin(2 * Math.PI * freq * t) * amp * Math.exp(-t * (2.2 + h * 1.6)) * Math.min(1, t / 0.004);
    }
  });
  const peak = out.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const pcm = Buffer.alloc(44 + out.length * 2);
  pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + out.length * 2, 4); pcm.write("WAVEfmt ", 8);
  pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22); pcm.writeUInt32LE(RATE, 24);
  pcm.writeUInt32LE(RATE * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(out.length * 2, 40);
  out.forEach((v, i) => pcm.writeInt16LE(Math.round((v / peak) * 0.6 * Math.min(1, (out.length - i) / 2000) * 32767), 44 + i * 2));
  writeFileSync(new URL(`../public/notes/${midi}.wav`, import.meta.url), pcm);
}
console.log("notes 40-79 written");
