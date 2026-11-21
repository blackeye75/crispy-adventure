"""Speaks every line of src/beginner/script.json with Kokoro, a local text-to-speech model (Apache-2.0).

Writes public/beginner/vo-<n>.wav and src/beginner/timing.json: each line's length in seconds and, for list lines
("items"), when each item starts, so the picture can move with the words.
Run:  python3 scripts/make-beginner-voice.py /path/to/folder-with-kokoro-v1.0.onnx-and-voices-v1.0.bin
The reel uses the voice "af_heart" (American English, female).
"""
import json, sys, wave
from pathlib import Path
import numpy as np
from kokoro_onnx import Kokoro

VOICE, SPEED = "af_heart", 1.0
here = Path(__file__).resolve().parent.parent
models = Path(sys.argv[1])
kokoro = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))
lines = json.loads((here / "src/beginner/script.json").read_text())

def trim(samples, rate, keep=0.05):
    """Cut the silence the model leaves at both ends, keeping a short tail so the last word is not clipped."""
    loud = np.flatnonzero(np.abs(samples) > 0.01)
    if not len(loud): return samples
    start = max(0, loud[0] - int(keep * rate)); end = min(len(samples), loud[-1] + int(keep * 2 * rate))
    return samples[start:end]

def speak(text):
    samples, rate = kokoro.create(text, voice=VOICE, speed=SPEED, lang="en-us")
    return trim(np.asarray(samples, dtype=np.float32), rate), rate

timing = []
for n, line in enumerate(lines, 1):
    if "items" in line:
        # A list (letters, a count) is spoken one item at a time on a steady beat, so it is never rushed
        # and the picture knows exactly when each item starts.
        clips = [speak(item) for item in line["items"]]
        rate = clips[0][1]
        beat = int(line["beat"] * rate)
        samples = np.zeros(beat * (len(clips) - 1) + len(clips[-1][0]), dtype=np.float32)
        for k, (clip, _) in enumerate(clips):
            samples[k * beat:k * beat + len(clip)] += clip[: len(samples) - k * beat]
        line = {**line, "onsets": [round(k * line["beat"], 3) for k in range(len(clips))]}
    else:
        samples, rate = speak(line["say"])
    peak = np.abs(samples).max() or 1
    samples = samples / peak * 0.89  # the same level for every line, with headroom
    with wave.open(str(here / f"public/beginner/vo-{n}.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
        w.writeframes((samples * 32767).astype(np.int16).tobytes())
    entry = {"seconds": round(len(samples) / rate, 2)}
    if "onsets" in line: entry["onsets"] = line["onsets"]
    timing.append(entry)
    print(n, entry["seconds"], entry.get("onsets", ""))
(here / "src/beginner/timing.json").write_text(json.dumps(timing, indent=2) + "\n")
print("total", round(sum(t["seconds"] for t in timing), 1), "s")
