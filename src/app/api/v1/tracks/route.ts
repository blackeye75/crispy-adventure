import { ok } from "@/server/api";
import { getPath } from "@/server/services/content";

export async function GET() {
  return ok(await getPath());
}
