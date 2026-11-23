import { z } from "zod";
import { authed, ServiceError } from "@/server/api";
import { getLesson, lessonsBefore } from "@/server/services/content";

const params = z.object({ slug: z.string().regex(/^[a-z0-9-]{1,80}$/) });

export const GET = authed(async (viewer, _request, ctx: RouteContext<"/api/v1/lessons/[slug]">) => {
  const result = await getLesson(params.parse(await ctx.params).slug, viewer);
  if (result.status === "not-found") throw new ServiceError(404, "not_found", "No such lesson.");
  if (result.status === "locked") throw new ServiceError(403, "subscription_required", "This lesson needs a subscription.");
  return { lesson: result.lesson, next: result.next ?? null, before: await lessonsBefore(result.lesson, viewer) };
});
