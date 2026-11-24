import { subscribeSchema } from "@/core/schemas/api";
import { authed, body } from "@/server/api";
import { subscribe } from "@/server/services/billing";

export const POST = authed(async (viewer, request) => {
  const { plan, provider } = subscribeSchema.parse(await body(request));
  return subscribe(viewer, plan, provider);
});
