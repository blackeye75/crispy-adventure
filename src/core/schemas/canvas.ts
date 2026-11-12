import { z } from "zod";
import { STANDARD_TUNING } from "../instruments/fretboard";
import { CHORD_IDS } from "../theory/chords";
import { INTERVAL_IDS } from "../theory/intervals";
import { NUMERAL_PATTERN } from "../theory/keys";
import { SCALE_IDS } from "../theory/scales";

const pitch = z.string().regex(/^[A-G](#|b)?\d$/);

export const canvasStateSchema = z.object({
  root: z.string().regex(/^[A-G](#|b)?$/),
  show: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("scale"), scale: z.enum(SCALE_IDS) }),
    z.object({
      kind: z.literal("chord"),
      chord: z.enum(CHORD_IDS),
      inversion: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(),
    }),
    z.object({ kind: z.literal("interval"), interval: z.enum(INTERVAL_IDS) }),
    z.object({
      kind: z.literal("progression"),
      numerals: z.array(z.string().regex(NUMERAL_PATTERN)).min(1).max(16),
      activeIndex: z.number().int().min(0),
    }),
  ]),
  labels: z.enum(["notes", "degrees", "intervals"]),
  focusPitch: pitch.optional(), // hovered or tapped
  position: z.object({ fromFret: z.number().int().min(0), toFret: z.number().int().max(24) }).optional(),
  guitar: z.object({
    tuning: z.array(pitch).min(4).max(8),
    frets: z.number().int().min(12).max(24),
    leftHanded: z.boolean(),
  }),
  keyboard: z.object({ from: pitch, to: pitch }),
});

export type CanvasState = z.infer<typeof canvasStateSchema>;
export type CanvasShow = CanvasState["show"];

export const DEFAULT_CANVAS: CanvasState = {
  root: "C",
  show: { kind: "scale", scale: "major" },
  labels: "notes",
  guitar: { tuning: STANDARD_TUNING, frets: 15, leftHanded: false },
  keyboard: { from: "E2", to: "E6" },
};

/** Shareable URL form: `root=C&scale=major`. Defaults are left out to keep links short. */
export function canvasToQuery(state: CanvasState): string {
  const q = new URLSearchParams({ root: state.root });
  const { show } = state;
  if (show.kind === "scale") q.set("scale", show.scale);
  if (show.kind === "chord") {
    q.set("chord", show.chord);
    if (show.inversion) q.set("inv", String(show.inversion));
  }
  if (show.kind === "interval") q.set("interval", show.interval);
  if (show.kind === "progression") q.set("prog", show.numerals.join("-"));
  if (state.labels !== "notes") q.set("labels", state.labels);
  if (state.guitar.leftHanded) q.set("lh", "1");
  if (state.guitar.frets !== DEFAULT_CANVAS.guitar.frets) q.set("frets", String(state.guitar.frets));
  if (state.guitar.tuning.join() !== STANDARD_TUNING.join()) q.set("tuning", state.guitar.tuning.join("-"));
  return q.toString();
}

type Query = Record<string, string | string[] | undefined>;

/** Parse a URL query. Anything missing or invalid falls back to the default canvas. */
export function canvasFromQuery(query: Query): CanvasState {
  const get = (key: string) => (typeof query[key] === "string" ? (query[key] as string) : undefined);
  const show =
    (get("chord") && { kind: "chord", chord: get("chord"), inversion: get("inv") ? Number(get("inv")) : undefined }) ||
    (get("interval") && { kind: "interval", interval: get("interval") }) ||
    (get("prog") && { kind: "progression", numerals: get("prog")!.split("-"), activeIndex: 0 }) ||
    (get("scale") && { kind: "scale", scale: get("scale") }) ||
    DEFAULT_CANVAS.show;
  const parsed = canvasStateSchema.safeParse({
    ...DEFAULT_CANVAS,
    root: get("root") ?? DEFAULT_CANVAS.root,
    show,
    labels: get("labels") ?? DEFAULT_CANVAS.labels,
    guitar: {
      tuning: get("tuning")?.split("-") ?? STANDARD_TUNING,
      frets: get("frets") ? Number(get("frets")) : DEFAULT_CANVAS.guitar.frets,
      leftHanded: get("lh") === "1",
    },
  });
  return parsed.success ? parsed.data : DEFAULT_CANVAS;
}
