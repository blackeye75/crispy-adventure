import { NextResponse, type NextRequest } from "next/server";
import { LANDING_ONLY, landingOnlyAllows } from "@/lib/site";

// In landing-only mode, every page but the landing page and the policies goes back to the landing page,
// and the API answers 404: there is no database behind it yet. Otherwise this does nothing.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!LANDING_ONLY || landingOnlyAllows(pathname)) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: { code: "not_launched", message: "Fretkey is not open yet." } }, { status: 404 });
  return NextResponse.redirect(new URL("/", request.url));
}

// Static files, images and Next's own assets pass straight through.
export const config = { matcher: ["/((?!_next/|media/|.*\\..*).*)"] };
