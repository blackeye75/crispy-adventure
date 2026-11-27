import { expect, test } from "vitest";
import { landingOnlyAllows } from "./site";

test("landing-only mode keeps the landing page and the policies, nothing that needs the database", () => {
  for (const path of ["/", "/privacy", "/terms/", "/refunds"]) expect(landingOnlyAllows(path), path).toBe(true);
  for (const path of ["/sign-up", "/learn/barre-chords", "/practice", "/dashboard", "/api/v1/tracks", "/privacy/x"]) expect(landingOnlyAllows(path), path).toBe(false);
});
