import { model, models, Schema, type Model } from "mongoose";

// Content collections are written only by `npm run seed`, which validates every document with Zod
// first, so Mongoose just stores what it is given.
const contentModel = (name: string, collection: string): Model<Record<string, unknown>> =>
  models[name] ?? model(name, new Schema({ slug: { type: String, required: true, unique: true } }, { strict: false, versionKey: false, collection }));

export const TrackModel = contentModel("Track", "tracks");
export const ModuleModel = contentModel("Module", "modules");
export const LessonModel = contentModel("Lesson", "lessons");

// Per-user collections. `userId` is the Better Auth user id.
const userDoc = { versionKey: false, timestamps: true } as const;
const appModel = <T>(name: string, collection: string, schema: Schema<T>): Model<T> => (models[name] as Model<T>) ?? model<T>(name, schema, collection);

export type Profile = {
  userId: string;
  displayName: string;
  instrument: "guitar" | "piano";
  leftHanded: boolean;
  noteNaming: "letters" | "solfege";
  level: "beginner" | "intermediate" | "advanced";
  dailyGoalMinutes: number;
  streak: { current: number; longest: number; lastActiveDate?: string };
  timezone: string;
};
export const ProfileModel = appModel<Profile>("Profile", "profiles", new Schema<Profile>({
  userId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  instrument: { type: String, enum: ["guitar", "piano"], required: true },
  leftHanded: { type: Boolean, default: false },
  noteNaming: { type: String, enum: ["letters", "solfege"], default: "letters" },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
  dailyGoalMinutes: { type: Number, required: true },
  streak: { current: { type: Number, default: 0 }, longest: { type: Number, default: 0 }, lastActiveDate: String },
  timezone: { type: String, required: true },
}, userDoc));

export type LessonProgress = {
  userId: string;
  lessonSlug: string;
  status: "started" | "completed";
  stepIndex: number;
  score?: number; // share of drills right first time, 0–1
  attempts: number; // times completed
  completedAt?: Date;
};
const lessonProgressSchema = new Schema<LessonProgress>({
  userId: { type: String, required: true },
  lessonSlug: { type: String, required: true },
  status: { type: String, enum: ["started", "completed"], required: true },
  stepIndex: { type: Number, default: 0 },
  score: Number,
  attempts: { type: Number, default: 0 },
  completedAt: Date,
}, userDoc);
lessonProgressSchema.index({ userId: 1, lessonSlug: 1 }, { unique: true });
export const LessonProgressModel = appModel("LessonProgress", "lessonProgress", lessonProgressSchema);

export type ReviewItem = { userId: string; conceptId: string; ease: number; intervalDays: number; dueAt: Date; lapses: number; lastResult?: "correct" | "wrong" };
const reviewItemSchema = new Schema<ReviewItem>({
  userId: { type: String, required: true },
  conceptId: { type: String, required: true },
  ease: { type: Number, required: true },
  intervalDays: { type: Number, required: true },
  dueAt: { type: Date, required: true },
  lapses: { type: Number, default: 0 },
  lastResult: { type: String, enum: ["correct", "wrong"] },
}, userDoc);
reviewItemSchema.index({ userId: 1, dueAt: 1 });
reviewItemSchema.index({ userId: 1, conceptId: 1 }, { unique: true });
export const ReviewItemModel = appModel("ReviewItem", "reviewItems", reviewItemSchema);

// One per user per local calendar day. Accuracy is drillsCorrect / drillsAnswered.
export type PracticeSession = { userId: string; date: string; minutes: number; lessonsCompleted: number; drillsAnswered: number; drillsCorrect: number };
const practiceSessionSchema = new Schema<PracticeSession>({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  minutes: { type: Number, default: 0 },
  lessonsCompleted: { type: Number, default: 0 },
  drillsAnswered: { type: Number, default: 0 },
  drillsCorrect: { type: Number, default: 0 },
}, userDoc);
practiceSessionSchema.index({ userId: 1, date: 1 }, { unique: true });
export const PracticeSessionModel = appModel("PracticeSession", "practiceSessions", practiceSessionSchema);

// One per user. `status` and `currentPeriodEnd` change only from verified Razorpay webhooks.
export type SubscriptionStatus = "none" | "trialing" | "active" | "past_due" | "cancelled" | "expired";
export type Subscription = {
  userId: string;
  provider: "razorpay";
  providerSubscriptionId: string;
  providerCustomerId?: string;
  plan: "monthly" | "yearly";
  status: SubscriptionStatus;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  lastEventAt?: Date; // provider time of the newest webhook applied, to ignore late arrivals
};
const subscriptionSchema = new Schema<Subscription>({
  userId: { type: String, required: true, unique: true },
  provider: { type: String, enum: ["razorpay"], default: "razorpay" },
  providerSubscriptionId: { type: String, required: true, index: true },
  providerCustomerId: String,
  plan: { type: String, enum: ["monthly", "yearly"], required: true },
  status: { type: String, enum: ["none", "trialing", "active", "past_due", "cancelled", "expired"], default: "none" },
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: { type: Boolean, default: false },
  lastEventAt: Date,
}, userDoc);
export const SubscriptionModel = appModel("Subscription", "subscriptions", subscriptionSchema);

// Webhook log, used for idempotency. Never holds payment details: only what we act on.
export type PaymentEvent = { providerEventId: string; type: string; payload: Record<string, unknown>; processedAt?: Date };
export const PaymentEventModel = appModel<PaymentEvent>("PaymentEvent", "paymentEvents", new Schema<PaymentEvent>({
  providerEventId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, default: {} },
  processedAt: Date,
}, userDoc));
