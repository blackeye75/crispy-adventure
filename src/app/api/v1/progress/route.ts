import { progressInputSchema } from "@/core/schemas/api";
import { authed, body } from "@/server/api";
import { saveProgress } from "@/server/services/progress";

export const POST = authed(async (viewer, request) => saveProgress(viewer, progressInputSchema.parse(await body(request))));
