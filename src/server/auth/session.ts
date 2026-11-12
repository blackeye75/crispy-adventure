import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getProfile } from "../services/profile";
import { getAuth } from "./auth";

export type Viewer = { userId: string; name: string; subscriber: boolean };

/** The signed-in user for this request, or null. */
export async function getViewer(): Promise<Viewer | null> {
  // Read the request first: during `next build` this is where prerendering stops, before any database is needed.
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  // Everyone is a non-subscriber until billing exists (Phase 4).
  return session && { userId: session.user.id, name: session.user.name, subscriber: false };
}

/** Only same-site paths may be used as a post-sign-in destination. */
export const safeNext = (next: unknown): string => (typeof next === "string" && /^\/(?![/\\])/.test(next) ? next : "/dashboard");

/** For pages that need a signed-in, onboarded learner: sends everyone else to the right place. */
export async function requireLearner(path: string) {
  const viewer = await getViewer();
  if (!viewer) redirect(`/sign-in?next=${encodeURIComponent(path)}`);
  const profile = await getProfile(viewer.userId);
  if (!profile) redirect("/onboarding");
  return { viewer, profile };
}
