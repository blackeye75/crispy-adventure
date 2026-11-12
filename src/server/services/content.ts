import { content as files } from "../../../content";
import { validateContent, type Content, type Lesson } from "@/core/schemas/content";
import { connectDb } from "../db/connect";
import { LessonModel, LessonProgressModel, ModuleModel, TrackModel } from "../db/models";

let fromFiles: Content | undefined;

async function load(): Promise<Content> {
  // shortcut: without a database (local dev, CI) serve the validated files directly.
  // Production sets MONGODB_URI and reads what `npm run seed` wrote.
  if (!process.env.MONGODB_URI) return (fromFiles ??= validateContent(files));
  await connectDb();
  const all = <T>(m: typeof LessonModel) => m.find({}, { _id: 0 }).lean<T[]>();
  const [tracks, modules, lessons] = await Promise.all([all<Content["tracks"][number]>(TrackModel), all<Content["modules"][number]>(ModuleModel), all<Lesson>(LessonModel)]);
  return { tracks, modules, lessons };
}

const byOrder = <T extends { order: number }>(items: T[]) => [...items].sort((a, b) => a.order - b.order);

/** Who is asking. Signed-out visitors see the map but no progress. */
export type Viewer = { subscriber: boolean; userId?: string };
export const ANONYMOUS: Viewer = { subscriber: false };

const canOpen = (lesson: { isFree: boolean }, viewer: Viewer) => lesson.isFree || viewer.subscriber;

export type LessonSummary = Pick<Lesson, "slug" | "title" | "minutes" | "strand"> & { locked: boolean; completed: boolean };
export type Path = {
  slug: string;
  title: string;
  levels: { level: number; isFree: boolean; modules: { slug: string; title: string; summary: string; lessons: LessonSummary[] }[] }[];
}[];

/** Every lesson this viewer may open, in path order. */
export async function accessibleLessons(viewer: Viewer): Promise<Lesson[]> {
  const { modules, lessons } = await load();
  const moduleOrder = new Map(modules.map((m) => [m.slug, m.order]));
  return lessons.filter((l) => canOpen(l, viewer)).sort((a, b) => moduleOrder.get(a.moduleSlug)! - moduleOrder.get(b.moduleSlug)! || a.order - b.order);
}

/** The whole curriculum as a map, with the viewer's progress: titles only, never lesson content. */
export async function getPath(viewer: Viewer = ANONYMOUS): Promise<Path> {
  const { tracks, modules, lessons } = await load();
  const completed = new Set(viewer.userId ? await LessonProgressModel.distinct("lessonSlug", { userId: viewer.userId, status: "completed" }) : []);
  return byOrder(tracks).map((track) => {
    const mine = byOrder(modules.filter((m) => m.trackSlug === track.slug));
    return {
      slug: track.slug,
      title: track.title,
      levels: [...new Set(mine.map((m) => m.level))].sort().map((level) => ({
        level,
        isFree: mine.filter((m) => m.level === level).every((m) => m.isFree),
        modules: mine.filter((m) => m.level === level).map((m) => ({
          slug: m.slug,
          title: m.title,
          summary: m.summary,
          lessons: byOrder(lessons.filter((l) => l.moduleSlug === m.slug)).map((l) => ({
            slug: l.slug, title: l.title, minutes: l.minutes, strand: l.strand, locked: !canOpen(l, viewer), completed: completed.has(l.slug),
          })),
        })),
      })),
    };
  });
}

export type LessonResult =
  | { status: "ok"; lesson: Lesson; next?: { slug: string; title: string } }
  | { status: "not-found" }
  | { status: "locked"; title: string };

/** One lesson with its content. Paid content is only returned to subscribers. */
export async function getLesson(slug: string, viewer: Viewer = ANONYMOUS): Promise<LessonResult> {
  const { modules, lessons } = await load();
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) return { status: "not-found" };
  if (!canOpen(lesson, viewer)) return { status: "locked", title: lesson.title };
  const moduleOrder = new Map(modules.map((m) => [m.slug, m.order]));
  const ordered = [...lessons].sort((a, b) => moduleOrder.get(a.moduleSlug)! - moduleOrder.get(b.moduleSlug)! || a.order - b.order);
  const next = ordered[ordered.indexOf(lesson) + 1];
  return { status: "ok", lesson, next: next && { slug: next.slug, title: next.title } };
}
