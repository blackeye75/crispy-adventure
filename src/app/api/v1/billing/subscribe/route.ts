import { subscribeSchema } from "@/core/schemas/api";
import { authed, body } from "@/server/api";
import { subscribe } from "@/server/services/billing";

export const POST = authed(async (viewer, request) => subscribe(viewer, subscribeSchema.parse(await body(request)).plan));
