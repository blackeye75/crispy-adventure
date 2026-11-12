import { authed } from "@/server/api";
import { getDueReview } from "@/server/services/review";

export const GET = authed((viewer) => getDueReview(viewer));
