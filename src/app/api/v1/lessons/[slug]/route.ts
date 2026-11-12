import { z } from "zod";
import { fail, ok } from "@/server/api";
import { getLesson } from "@/server/services/content";

const params = z.object({ slug: z.string().regex(/^[a-z0-9-]{1,80}$/) });

export async function GET(_request: Request, ctx: RouteContext<"/api/v1/lessons/[slug]">) {
  const parsed = params.safeParse(await ctx.params);
  if (!parsed.success) return fail(400, "bad_request", "Invalid lesson slug.");
  const result = await getLesson(parsed.data.slug);
  if (result.status === "not-found") return fail(404, "not_found", "No such lesson.");
  if (result.status === "locked") return fail(403, "subscription_required", "This lesson needs a subscription.");
  return ok({ lesson: result.lesson, next: result.next ?? null });
}
