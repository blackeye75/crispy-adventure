import { placementAnswersSchema } from "@/core/schemas/api";
import { authed, body } from "@/server/api";
import { getPlacement, submitPlacement } from "@/server/services/placement";

export const GET = authed((viewer) => getPlacement(viewer));
export const POST = authed(async (viewer, request) => submitPlacement(viewer, placementAnswersSchema.parse(await body(request))));
