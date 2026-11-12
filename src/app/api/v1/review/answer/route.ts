import { reviewAnswerSchema } from "@/core/schemas/api";
import { authed, body } from "@/server/api";
import { answerReview } from "@/server/services/review";

export const POST = authed(async (viewer, request) => answerReview(viewer, reviewAnswerSchema.parse(await body(request))));
