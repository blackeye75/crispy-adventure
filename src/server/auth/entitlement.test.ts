import { expect, test } from "vitest";
import { isEntitled } from "./entitlement";

const now = new Date("2026-03-09T10:00:00Z");
const tomorrow = new Date("2026-03-10T10:00:00Z");
const yesterday = new Date("2026-03-08T10:00:00Z");

test("who can open paid content", () => {
  expect(isEntitled(null, now)).toBe(false);
  expect(isEntitled({ status: "none" }, now)).toBe(false);
  expect(isEntitled({ status: "active", currentPeriodEnd: tomorrow }, now)).toBe(true);
  expect(isEntitled({ status: "trialing" }, now)).toBe(true);
  expect(isEntitled({ status: "expired", currentPeriodEnd: tomorrow }, now)).toBe(false);
});

test("a cancelled or failed plan keeps access only until the paid period ends", () => {
  for (const status of ["cancelled", "past_due"] as const) {
    expect(isEntitled({ status, currentPeriodEnd: tomorrow }, now)).toBe(true);
    expect(isEntitled({ status, currentPeriodEnd: yesterday }, now)).toBe(false);
    expect(isEntitled({ status }, now)).toBe(false);
  }
});
