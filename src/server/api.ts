// The one response shape for /api/v1: { data } on success, { error: { code, message } } on failure.
import { connection } from "next/server";
import { ZodError } from "zod";
import { getViewer, type Viewer } from "./auth/session";

export const ok = <T>(data: T) => Response.json({ data });
export const fail = (status: number, code: string, message: string) => Response.json({ error: { code, message } }, { status });

/** A failure a service wants the client to see, with its HTTP status. */
export class ServiceError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) {
    super(message);
  }
}

function failure(err: unknown) {
  if (err instanceof ServiceError) return fail(err.status, err.code, err.message);
  if (err instanceof ZodError) return fail(400, "bad_request", err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  console.error(err);
  return fail(500, "internal", "Something went wrong.");
}

/** Read and parse a JSON body; malformed JSON is a 400, not a 500. */
export async function body(request: Request): Promise<unknown> {
  return request.json().catch(() => {
    throw new ServiceError(400, "bad_request", "The request body must be JSON.");
  });
}

type Handler<C> = (viewer: Viewer, request: Request, ctx: C) => Promise<unknown>;

/** A route for signed-in users: resolves the session, runs the handler, shapes the response. */
export const authed = <C>(handler: Handler<C>) => async (request: Request, ctx: C) => {
  await connection(); // per-request data: never prerender, and keep the build from running the handler
  try {
    const viewer = await getViewer();
    if (!viewer) return fail(401, "unauthenticated", "Sign in to continue.");
    return ok(await handler(viewer, request, ctx));
  } catch (err) {
    return failure(err);
  }
};

/** A public route that still knows who is asking, if anyone. */
export const open = <C>(handler: (viewer: Viewer | null, request: Request, ctx: C) => Promise<unknown>) => async (request: Request, ctx: C) => {
  await connection();
  try {
    return ok(await handler(await getViewer().catch(() => null), request, ctx));
  } catch (err) {
    return failure(err);
  }
};

/** A route with no session at all (webhooks from a payment provider). */
export const anonymous = (handler: (request: Request) => Promise<unknown>) => async (request: Request) => {
  await connection();
  try {
    return ok(await handler(request));
  } catch (err) {
    if (err instanceof SyntaxError) return fail(400, "bad_request", "The request body must be JSON.");
    return failure(err);
  }
};
