import { model, models, Schema, type Model } from "mongoose";

// Content collections are written only by `npm run seed`, which validates every document with Zod
// first, so Mongoose just stores what it is given.
const contentModel = (name: string, collection: string): Model<Record<string, unknown>> =>
  models[name] ?? model(name, new Schema({ slug: { type: String, required: true, unique: true } }, { strict: false, versionKey: false, collection }));

export const TrackModel = contentModel("Track", "tracks");
export const ModuleModel = contentModel("Module", "modules");
export const LessonModel = contentModel("Lesson", "lessons");
