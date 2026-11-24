import { expect, test } from "vitest";
import { isPhoneNumber, normalisePhoneNumber } from "./api";

test("mobile numbers: international form only, typed spaces and dashes tidied", () => {
  expect(normalisePhoneNumber(" +91 98765-43210 ")).toBe("+919876543210");
  expect(normalisePhoneNumber("+1 (415) 555-0100")).toBe("+14155550100");
  expect(isPhoneNumber("+919876543210")).toBe(true);
  expect(isPhoneNumber("+447700900123")).toBe(true);
  expect(isPhoneNumber("9876543210")).toBe(false); // no country code
  expect(isPhoneNumber("+0123456789")).toBe(false); // country codes never start with 0
  expect(isPhoneNumber("+12345")).toBe(false); // too short
});
