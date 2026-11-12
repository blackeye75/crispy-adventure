// npm run seed: validate content/ and make MongoDB match it. `-- --check` validates only.
import mongoose from "mongoose";
import { content } from "../content";
import { validateContent } from "../src/core/schemas/content";
import { connectDb } from "../src/server/db/connect";
import { LessonModel, ModuleModel, TrackModel } from "../src/server/db/models";

async function main() {
  const valid = validateContent(content);
  console.log(`Content is valid: ${valid.tracks.length} tracks, ${valid.modules.length} modules, ${valid.lessons.length} lessons.`);
  if (process.argv.includes("--check")) return;
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set (put it in .env.local), so nothing was written. Use `npm run seed -- --check` to validate only.");

  await connectDb();
  const sync = async (m: typeof LessonModel, docs: { slug: string }[]) => {
    await m.bulkWrite(docs.map((doc) => ({ replaceOne: { filter: { slug: doc.slug }, replacement: doc, upsert: true } })));
    const { deletedCount } = await m.deleteMany({ slug: { $nin: docs.map((d) => d.slug) } }); // content/ is the source of truth
    console.log(`${m.collection.name}: ${docs.length} upserted, ${deletedCount} removed`);
  };
  await sync(TrackModel, valid.tracks);
  await sync(ModuleModel, valid.modules);
  await sync(LessonModel, valid.lessons);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
