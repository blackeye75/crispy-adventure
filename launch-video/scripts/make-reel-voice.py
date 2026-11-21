"""Speaks a narrated reel's script with Kokoro, a local text-to-speech model (Apache-2.0), voice "af_heart".

    python3 scripts/make-reel-voice.py src/beginner public/beginner /folder/with/kokoro-v1.0.onnx-and-voices-v1.0.bin

Reads <script folder>/script.json and writes <audio folder>/vo-<n>.wav, plus <script folder>/timing.json with each
line's length in seconds and "onsets": when each part of the line starts, so the picture can move with the words.
A line's words go in one of three forms:
- "say": "One sentence."        spoken in one go.
- "say": ["One.", "Two, then"]  spoken part by part and joined with a pause that suits each part's last mark,
                                so the timing of every part is known exactly.
- "items": ["C.", "E."], "beat"  a list, one item per beat; the beat stretches if a word would run into the next.
"""
import json, sys, wave
from pathlib import Path
import numpy as np
from kokoro_onnx import Kokoro

VOICE, SPEED = "af_heart", 1.0
PAUSE = {",": 0.14, ":": 0.2, ";": 0.2, ".": 0.3, "!": 0.3, "?": 0.34}  # seconds after a part, by its last mark
here = Path(__file__).resolve().parent.parent
script_dir, audio_dir, models = here / sys.argv[1], here / sys.argv[2], Path(sys.argv[3])
audio_dir.mkdir(parents=True, exist_ok=True)
kokoro = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))
lines = json.loads((script_dir / "script.json").read_text())

def trim(samples, rate, keep=0.05):
    """Cut the silence the model leaves at both ends, keeping a short tail so the last word is not clipped."""
    loud = np.flatnonzero(np.abs(samples) > 0.01)
    if not len(loud): return samples
    return samples[max(0, loud[0] - int(keep * rate)): min(len(samples), loud[-1] + int(keep * 2 * rate))]

def speak(text):
    samples, rate = kokoro.create(text, voice=VOICE, speed=SPEED, lang="en-us")
    return trim(np.asarray(samples, dtype=np.float32), rate), rate

def place(clips, starts, rate):
    """Lay the clips out at the given start times (seconds) in one track."""
    out = np.zeros(int(starts[-1] * rate) + len(clips[-1]), dtype=np.float32)
    for clip, start in zip(clips, starts):
        at = int(start * rate); out[at:at + len(clip)] += clip[: len(out) - at]
    return out

timing = []
for n, line in enumerate(lines, 1):
    parts = line["items"] if "items" in line else line["say"] if isinstance(line["say"], list) else [line["say"]]
    spoken = [speak(p) for p in parts]
    rate = spoken[0][1]
    clips = [c for c, _ in spoken]
    if "items" in line:
        # never let one word run into the next: the beat is at least the longest word plus a breath
        beat = max(line["beat"], max(len(c) for c in clips) / rate + 0.08)
        starts = [round(k * beat, 3) for k in range(len(clips))]
    else:
        starts, t = [], 0.0
        for part, clip in zip(parts, clips):
            starts.append(round(t, 3)); t += len(clip) / rate + PAUSE.get(part.strip()[-1], 0.12)
    samples = place(clips, starts, rate)
    samples = samples / (np.abs(samples).max() or 1) * 0.89  # the same level for every line, with headroom
    with wave.open(str(audio_dir / f"vo-{n}.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
        w.writeframes((samples * 32767).astype(np.int16).tobytes())
    timing.append({"seconds": round(len(samples) / rate, 2), "onsets": starts})
    print(n, timing[-1]["seconds"], starts)
(script_dir / "timing.json").write_text(json.dumps(timing, indent=2) + "\n")
print("total", round(sum(t["seconds"] for t in timing), 1), "s")
