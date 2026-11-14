"use client";

import { useEffect, useMemo, useRef } from "react";
import type { BlockOf } from "@/core/schemas/content";
import { notationSteps, parseNotation, togetherSteps, type NotationItem } from "@/core/schemas/notation";
import { glyphs } from "@/core/theory/notes";
import { PlayButton } from "@/features/lesson-player/PlayButton";

const STAFF_HEIGHT = 130;
const NOTE_WIDTH = 40;
const REST_KEY = { treble: "b/4", bass: "d/3" };

/** "C#4" → VexFlow's "c#/4". */
const vexKey = (pitch: string) => `${pitch.slice(0, -1).toLowerCase()}/${pitch.slice(-1)}`;

/** Draw the staves with VexFlow, which is only downloaded on lessons that show written music. */
async function draw(host: HTMLDivElement, block: BlockOf<"notation">, parsed: NotationItem[][], width: number) {
  const { Renderer, Stave, StaveNote, StaveTie, BarNote, Voice, Formatter, Accidental, Annotation, Beam, Dot, Fraction, StaveConnector, Tuplet } = await import("vexflow/bravura");
  host.replaceChildren();
  const renderer = new Renderer(host, Renderer.Backends.SVG);
  renderer.resize(width, parsed.length * STAFF_HEIGHT + 20);
  const context = renderer.getContext();
  const parts = parsed.map((items, i) => {
    const { clef } = block.staves[i];
    const stave = new Stave(parsed.length > 1 ? 24 : 4, i * STAFF_HEIGHT + 10, width - (parsed.length > 1 ? 30 : 10));
    stave.addClef(clef);
    if (block.key) stave.addKeySignature(block.key);
    if (block.time) stave.addTimeSignature(block.time);
    stave.setContext(context).draw();
    const notes = items.map((item) => {
      if (item.bar) return new BarNote();
      const note = new StaveNote({ clef, keys: item.pitches.length ? item.pitches.map(vexKey) : [REST_KEY[clef]], duration: item.duration.replace("t", "") + (item.dotted ? "d" : "") + (item.pitches.length ? "" : "r") });
      if (item.dotted) Dot.buildAndAttach([note], { all: true });
      if (block.names && item.pitches.length === 1) {
        note.addModifier(new Annotation(glyphs(item.pitches[0].slice(0, -1))).setVerticalJustification(Annotation.VerticalJustify.BOTTOM), 0);
      }
      return note;
    });
    // Triplets: gather triplet notes until they fill whole beats, then bracket each group with a 3.
    const sounding = items.filter((item) => !item.bar);
    const stemmed = notes.filter((n): n is InstanceType<typeof StaveNote> => n instanceof StaveNote);
    const tripletGroups: InstanceType<typeof StaveNote>[][] = [];
    let run: InstanceType<typeof StaveNote>[] = [];
    let thirds = 0;
    sounding.forEach((item, k) => {
      if (item.bar || !item.duration.endsWith("t")) return;
      run.push(stemmed[k]);
      thirds += item.duration === "qt" ? 2 : 1;
      if (thirds % 3 === 0) {
        tripletGroups.push(run);
        run = [];
      }
    });
    const inTriplet = new Set(tripletGroups.flat());
    const tuplets = tripletGroups.map((group) => new Tuplet(group, { numNotes: 3, notesOccupied: 2 }));
    // 6/8 beams its eighth notes in threes and 7/8 in 2 + 2 + 3; the others beam by the quarter-note beat.
    const groups = block.time === "6/8" ? [new Fraction(3, 8)] : block.time === "7/8" ? [new Fraction(2, 8), new Fraction(2, 8), new Fraction(3, 8)] : undefined;
    const beams = [
      ...Beam.generateBeams(stemmed.filter((n) => !n.isRest() && !inTriplet.has(n)), groups ? { groups } : undefined),
      ...tripletGroups.filter((group) => group.length === 3 && group.every((n) => !n.isRest())).map((group) => new Beam(group)),
    ];
    const ties = items.filter((item) => !item.bar).flatMap((item, k, sounding) => {
      const stems = notes.filter((n) => n instanceof StaveNote);
      return !item.bar && item.tie && sounding[k + 1] ? [new StaveTie({ firstNote: stems[k], lastNote: stems[k + 1], firstIndexes: [0], lastIndexes: [0] })] : [];
    });
    const voice = new Voice().setMode(Voice.Mode.SOFT).addTickables(notes); // SOFT: bars need not add up, lessons show fragments
    Accidental.applyAccidentals([voice], block.key ?? "C"); // sharps and flats the key signature does not already cover
    return { stave, voice, beams, ties, tuplets };
  });
  // Formatted together, so notes that sound together line up across the staves.
  const formatter = new Formatter();
  parts.forEach((p) => formatter.joinVoices([p.voice]));
  formatter.format(parts.map((p) => p.voice), width - 130);
  parts.forEach((p) => {
    p.voice.draw(context, p.stave);
    p.beams.forEach((beam) => beam.setContext(context).draw());
    p.ties.forEach((tie) => tie.setContext(context).draw());
    p.tuplets.forEach((tuplet) => tuplet.setContext(context).draw());
  });
  const staves = parts.map((p) => p.stave);
  if (staves.length > 1) {
    for (const type of ["brace", "singleLeft", "singleRight"] as const) new StaveConnector(staves[0], staves[1]).setType(type).setContext(context).draw();
  }
}

/** Staff notation, drawn like a page of sheet music, with a button to hear it. */
export function NotationBlock({ block }: { block: BlockOf<"notation"> }) {
  const host = useRef<HTMLDivElement>(null);
  const parsed = useMemo(() => block.staves.map((s) => parseNotation(s.notes)), [block]);
  const width = Math.max(260, Math.max(...parsed.map((items) => items.length)) * NOTE_WIDTH + (block.key ? 170 : 110));
  const height = parsed.length * STAFF_HEIGHT + 20;
  useEffect(() => {
    if (host.current) draw(host.current, block, parsed, width).catch((err) => console.error("Notation failed to draw", err));
  }, [block, parsed, width]);

  // What a screen reader gets instead of the drawing.
  const spoken = block.staves.map((s, i) => `${s.clef} staff: ${parsed[i].map((item) => (item.bar ? "bar line" : item.pitches.length ? item.pitches.map(glyphs).join(" and ") : "rest")).join(", ")}`).join(". ");

  return (
    <figure className="flex flex-col gap-4">
      {block.caption && <figcaption className="text-lg text-foreground/85">{block.caption}</figcaption>}
      <div className="overflow-x-auto rounded-xl bg-key-white p-3">
        {/* fixed size from the start, so nothing shifts when the drawing arrives */}
        <div ref={host} role="img" aria-label={spoken} style={{ width, height }} />
      </div>
      <div><PlayButton steps={togetherSteps(parsed.map(notationSteps))} label="Play what is written" bpm={block.bpm} /></div>
    </figure>
  );
}
