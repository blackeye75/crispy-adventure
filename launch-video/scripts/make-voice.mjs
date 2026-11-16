// Speaks every line of src/reels/voice.json with Piper (a local text-to-speech engine) and writes
// public/vo/<reel>-<n>.wav plus src/reels/voice-timing.json (the length of each line in seconds).
// Needs `pip install piper-tts` and a voice model:  PIPER_MODEL=/path/to/en_GB-cori-medium.onnx node scripts/make-voice.mjs
// The reels are narrated with "cori" (en_GB, medium): a female voice trained on public-domain LibriVox recordings.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const model = process.env.PIPER_MODEL;
if (!model) throw new Error("Set PIPER_MODEL to the .onnx voice file.");
const here = (path) => new URL(`../${path}`, import.meta.url).pathname;
const lines = JSON.parse(readFileSync(here("src/reels/voice.json"), "utf8"));
const timing = {};
for (const [reel, texts] of Object.entries(lines)) {
  timing[reel] = texts.map((text, i) => {
    const file = here(`public/vo/${reel}-${i + 1}.wav`);
    // a slightly slower, steadier delivery than the default
    execFileSync("piper", ["-m", model, "-f", file, "--length-scale", "1.08", "--sentence-silence", "0.28"], { input: text });
    const seconds = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());
    return Math.round(seconds * 100) / 100;
  });
  console.log(reel, timing[reel].join(" "), "=", timing[reel].reduce((a, b) => a + b, 0).toFixed(1), "s");
}
writeFileSync(here("src/reels/voice-timing.json"), `${JSON.stringify(timing, null, 2)}\n`);
