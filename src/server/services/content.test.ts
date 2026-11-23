import { describe, expect, test } from "vitest";
import { handsPlayback } from "@/core/schemas/hands";
import { parseTab, tabSteps } from "@/core/schemas/tab";
import { content } from "../../../content";
import { STANDARD_TUNING, fretMidi, shapeMidis } from "@/core/instruments/fretboard";
import { getChord } from "@/core/theory/chords";
import { resolveCanvas } from "@/core/instruments/resolveCanvas";
import { DEFAULT_CANVAS, type CanvasState } from "@/core/schemas/canvas";
import { isQuiz, soundSteps, validateContent } from "@/core/schemas/content";
import { chroma, midi } from "@/core/theory/notes";
import { getLesson, getPath, missingNeeds } from "./content";

describe("content/", () => {
  const valid = validateContent(content);
  test("is valid: schemas, unique slugs, links, four steps, audio in Listen", () => {
    expect(valid.lessons.length).toBeGreaterThan(0);
  });
  test("every sound stays inside the E2–E6 range the instruments show", () => {
    for (const lesson of valid.lessons) {
      for (const block of lesson.steps.flatMap((s) => s.blocks)) {
        if (!("sound" in block) || !block.sound) continue;
        // down to D2: a guitar tuned down a whole step on its sixth string still has to be heard
        for (const m of soundSteps(block.sound).flatMap((s) => s.midis)) expect(m >= 38 && m <= 88, `${lesson.slug}: ${m}`).toBe(true);
      }
    }
  });
  test("every note a lesson shows or asks for exists on the lesson instruments (12 frets, E2–E6)", () => {
    const state = ({ frets, ...canvas }: { root: string; show: CanvasState["show"]; frets?: number }): CanvasState => ({ ...DEFAULT_CANVAS, ...canvas, guitar: { ...DEFAULT_CANVAS.guitar, frets: frets ?? 12 } });
    for (const lesson of valid.lessons) {
      for (const block of lesson.steps.flatMap((s) => s.blocks)) {
        const canvas = block.type === "instrument" || block.type === "play-along" ? block.canvas : undefined;
        if (canvas?.show.kind === "notes") {
          const r = resolveCanvas(state(canvas));
          const only = "only" in block ? block.only : undefined;
          for (const pitch of canvas.show.pitches) {
            const m = midi(pitch);
            if (only !== "piano") expect(r.fretboard.some((x) => x.midi === m), `${lesson.slug}: ${pitch} on the fretboard`).toBe(true);
            if (only !== "guitar") expect(r.keyboard.some((x) => x.midi === m), `${lesson.slug}: ${pitch} on the keyboard`).toBe(true);
          }
        }
        if (block.type === "chord-diagram") {
          // the shape must sound exactly the notes of the chord it claims to be
          const sounded = [...new Set(shapeMidis(block.shape).filter((m) => m !== null).map((m) => m % 12))].sort();
          const wanted = getChord(block.chord.root, block.chord.id).notes.map(chroma).sort();
          expect(sounded, `${lesson.slug}: ${block.chord.root} ${block.chord.id} as ${block.shape}`).toEqual(wanted);
        }
        if (block.type === "tab") {
          // a unison bend is two notes on neighbouring strings that end on the same pitch
          for (const item of parseTab(block.notes)) if (!item.bar && item.mark === "ub") expect(new Set(tabSteps([item])[0].midis).size, `${lesson.slug}: unison bend`).toBe(1);
          // lesson fretboards show twelve frets, and a bend must not leave the range either
          for (const item of parseTab(block.notes)) if (!item.bar) for (const n of item.notes) expect(n.fret <= 12, `${lesson.slug}: fret ${n.fret}`).toBe(true);
          // a hammer-on, pull-off or slide continues from the note before it, on the same string
          parseTab(block.notes).filter((item) => !item.bar).forEach((item, k, all) => {
            const before = all[k - 1];
            if (!item.bar && item.mark === "r") {
              // a release needs a bend to release: the same note, bent, just before it
              const bent = before && !before.bar && ["b", "bh", "pb"].includes(before.mark ?? "") && before.notes[0].string === item.notes[0].string && before.notes[0].fret === item.notes[0].fret;
              expect(bent, `${lesson.slug}: ^r at note ${k + 1} of "${block.notes}"`).toBe(true);
            }
            if (item.bar || !item.mark || !["h", "p", "s"].includes(item.mark)) return;
            const ok = before && !before.bar && before.notes.length === 1 && item.notes.length === 1 && before.notes[0].string === item.notes[0].string
              && (item.mark === "h" ? item.notes[0].fret > before.notes[0].fret : item.mark === "p" ? item.notes[0].fret < before.notes[0].fret : item.notes[0].fret !== before.notes[0].fret);
            expect(ok, `${lesson.slug}: ^${item.mark} at note ${k + 1} of "${block.notes}"`).toBe(true);
          });
          // a lowered sixth string may go down to D2; the tab block draws its own fretboard, so the keyboard range does not apply
          for (const step of tabSteps(parseTab(block.notes), block.tuning)) for (const m of step.midis) expect(m >= (block.tuning ? 38 : 40) && m <= 88, `${lesson.slug}: tab pitch`).toBe(true);
        }
        if (block.type === "hands") for (const m of handsPlayback(block.right, block.left).steps.flatMap((s) => s.midis)) expect(m >= 40 && m <= 88, `${lesson.slug}: hands pitch`).toBe(true);
        if (block.type === "strum-pattern") for (const pitch of [...block.chord, ...(block.bars ?? []).flatMap((b) => b.chord)]) expect(midi(pitch) >= 40 && midi(pitch) <= 88, `${lesson.slug}: ${pitch}`).toBe(true);
        if (block.type === "quiz-find" && block.only !== "piano") {
          // somewhere on an allowed string, within 12 frets, the answer can be tapped
          const strings = block.strings ?? [1, 2, 3, 4, 5, 6];
          const reachable = strings.some((n) => Array.from({ length: 13 }, (_, fret) => fretMidi(STANDARD_TUNING, 6 - n, fret))
            .some((m) => (/\d$/.test(block.answer) ? m === midi(block.answer) : m % 12 === chroma(block.answer))));
          expect(reachable, `${lesson.slug}: "${block.prompt}"`).toBe(true);
        }
      }
    }
  });
  test("lessons stay short: at most six drills", () => {
    for (const lesson of valid.lessons) expect(lesson.steps[3].blocks.filter(isQuiz).length, lesson.slug).toBeLessThanOrEqual(6);
  });
  test("validation reports broken links and bad answers by name", () => {
    const lesson = structuredClone(content.lessons[0]);
    const broken = { ...content, lessons: [{ ...lesson, moduleSlug: "nope", needs: ["missing"] }, lesson, lesson] };
    expect(() => validateContent(broken)).toThrow(/unknown module "nope"[\s\S]*needs unknown lesson "missing"/);
    expect(() => validateContent(broken)).toThrow(/duplicate slug/);
    const quiz = { type: "quiz-choice", prompt: "?", options: ["a", "b"], answer: 2, why: "." };
    const badAnswer = { ...lesson, steps: [lesson.steps[0], lesson.steps[1], lesson.steps[2], { kind: "practice", blocks: [quiz] }] };
    expect(() => validateContent({ ...content, lessons: [badAnswer] })).toThrow(/answer must index an option/);
  });
});

describe("content service", () => {
  test("the path lists every level without lesson content", async () => {
    const [theory] = await getPath();
    expect(theory.levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(theory.levels[0].modules[0].lessons[0]).toEqual({ slug: "what-is-a-note", title: "What a note is", minutes: 5, strand: "core", locked: false, completed: false, before: 0 });
    expect(JSON.stringify(theory)).not.toContain("blocks");
  });
  test("a playing stage lists the theory it builds on until it is done, ignoring lessons in its own module", () => {
    const valid = validateContent(content);
    const stage = valid.lessons.find((l) => l.slug === "left-hand-chords-under-a-melody")!; // needs "reading-a-lead-sheet" (same module) and "major-and-minor-triads" (theory)
    expect(missingNeeds(stage, valid.lessons, new Set(), true).map((l) => l.slug)).toEqual(["major-and-minor-triads"]);
    expect(missingNeeds(stage, valid.lessons, new Set(["major-and-minor-triads"]), true)).toEqual([]);
    expect(missingNeeds(stage, valid.lessons, new Set(), false)).toEqual([]); // signed out: no progress to compare
  });
  test("a lesson comes with the next one in path order, across modules", async () => {
    const first = await getLesson("what-is-a-note");
    expect(first).toMatchObject({ status: "ok", next: { slug: "the-octave" } });
    expect(await getLesson("piano-layout")).toMatchObject({ status: "ok", next: { slug: "natural-notes" } });
    expect(await getLesson("nope")).toEqual({ status: "not-found" });
  });
});
