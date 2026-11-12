import { open } from "@/server/api";
import { ANONYMOUS, getPath } from "@/server/services/content";

export const GET = open((viewer) => getPath(viewer ?? ANONYMOUS));
