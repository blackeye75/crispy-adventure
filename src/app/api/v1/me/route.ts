import { profilePatchSchema } from "@/core/schemas/api";
import { authed, body } from "@/server/api";
import { getMe, updateProfile } from "@/server/services/profile";

export const GET = authed((viewer) => getMe(viewer));
export const PATCH = authed(async (viewer, request) => updateProfile(viewer, profilePatchSchema.parse(await body(request))));
