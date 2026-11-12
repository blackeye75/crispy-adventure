import { authed } from "@/server/api";
import { cancel } from "@/server/services/billing";

export const POST = authed((viewer) => cancel(viewer));
