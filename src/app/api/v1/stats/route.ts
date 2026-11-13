import { authed } from "@/server/api";
import { getStats } from "@/server/services/stats";

export const GET = authed((viewer) => getStats(viewer));
