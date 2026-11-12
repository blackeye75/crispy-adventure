import { expect, test } from "vitest";
import { cn } from "@/lib/utils";

test("cn merges conflicting Tailwind classes, last wins", () => {
  expect(cn("px-2", false && "hidden", "px-4")).toBe("px-4");
});
