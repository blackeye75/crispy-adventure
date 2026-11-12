import { expect, test } from "@playwright/test";
import { signUp } from "./helpers";

const next = (page: import("@playwright/test").Page) => page.getByRole("button", { name: /^(Continue|Finish)$/ });

test("a whole lesson: four steps, every drill type, completion shows on the path", async ({ page }) => {
  await signUp(page);
  await page.goto("/learn/sharps-and-flats");
  await expect(page.getByRole("heading", { name: "Sharps and flats" })).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "Understand" })).toHaveAttribute("aria-current", "step");
  await next(page).click();

  // Listen: something to hear within the first screens
  await page.getByRole("button", { name: "C, then C♯, then D" }).click();
  await next(page).click();

  // Learn: the lesson's notes on the learner's instrument (guitar by default)
  await expect(page.getByRole("group", { name: "Guitar fretboard" }).locator(".note-marker")).toHaveCount(3);
  await next(page).click();

  // Practice: Continue is blocked until the drill is solved
  await expect(next(page)).toBeDisabled();
  await page.getByRole("button", { name: "Raises it by one key or fret" }).click();
  await expect(page.getByRole("status")).toContainText("Correct. Sharp means the very next note up.");
  await next(page).click();

  await page.getByRole("button", { name: "B♯" }).click(); // wrong first
  await expect(page.getByRole("status")).toContainText("Not quite");
  await expect(next(page)).toBeDisabled();
  await page.getByRole("button", { name: "B♭" }).click();
  await next(page).click();

  await page.getByRole("button", { name: "String 5, fret 9" }).click(); // F♯
  await expect(page.locator('.note-marker[data-state="correct"]')).toHaveText("F♯");
  await next(page).click();

  await page.getByRole("button", { name: "String 5, fret 7" }).click(); // E, not E♭
  await expect(page.locator('.note-marker[data-state="wrong"]')).toHaveCount(1);
  await page.getByRole("button", { name: "String 5, fret 6" }).click();
  await next(page).click();

  for (const fret of [3, 4, 6]) await page.getByRole("button", { name: `String 6, fret ${fret}` }).click(); // G, G♯, A♯
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByRole("status")).toContainText("2 of 3 found, and 1 that does not belong");
  await page.locator('.note-marker[data-state="wrong"]').click(); // remove A♯
  await page.getByRole("button", { name: "String 6, fret 5" }).click();
  await page.getByRole("button", { name: "Check" }).click();
  await next(page).click();

  await expect(page.getByText("Lesson complete")).toBeVisible();
  await expect(page.getByText("2 of 5 drills right first time.")).toBeVisible();
  await expect(page.getByText("1-day streak. 5 of 10 minutes today.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Next: One sound, two names" })).toBeVisible();
  await page.getByRole("link", { name: "Back to the path" }).click();
  await expect(page.getByRole("link", { name: /Sharps and flats\s*, Completed/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /The octave\s*, Not started/ })).toBeVisible();
});

test("the instrument toggle switches lessons to the keyboard and is remembered", async ({ page }) => {
  await signUp(page);
  await page.goto("/learn/natural-notes");
  await page.getByRole("group", { name: "Instrument" }).getByRole("button", { name: "Piano" }).click();
  for (let i = 0; i < 2; i++) await next(page).click();
  await expect(page.getByRole("group", { name: "Piano keyboard" }).locator(".note-marker")).toHaveCount(8);
  for (let i = 0; i < 3; i++) {
    if (i) await page.getByRole("button", { name: i === 1 ? "A" : "7", exact: true }).click();
    await next(page).click();
  }
  await page.getByRole("button", { name: "Key 11" }).click(); // D3
  await expect(page.locator('.note-marker[data-state="correct"]')).toHaveText("D");
  await page.goto("/learn/the-octave"); // a different lesson, a fresh page load: the choice came from the profile
  await expect(page.getByRole("group", { name: "Instrument" }).getByRole("button", { name: "Piano" })).toHaveAttribute("aria-pressed", "true");
});

test("home points at the next lesson; the path shows all six levels", async ({ page }) => {
  await signUp(page);
  await page.getByRole("link", { name: "Start the first lesson" }).click();
  await expect(page).toHaveURL(/\/learn\/what-is-a-note/);
  await page.goto("/learn");
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(6);
  await expect(page.getByText("Coming soon").first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test("API: one response shape; lessons and profile need a session, the map does not", async ({ page, request }) => {
  const tracks = await (await request.get("/api/v1/tracks")).json();
  expect(tracks.data[0].levels).toHaveLength(6);
  for (const path of ["/api/v1/lessons/the-octave", "/api/v1/me", "/api/v1/review/due"]) {
    const anonymous = await request.get(path);
    expect(anonymous.status(), path).toBe(401);
    expect((await anonymous.json()).error.code).toBe("unauthenticated");
  }
  expect((await request.post("/api/v1/progress", { data: { lessonSlug: "the-octave", stepIndex: 1 } })).status()).toBe(401);

  await signUp(page);
  const lesson = await (await page.request.get("/api/v1/lessons/the-octave")).json();
  expect(lesson.data.lesson.steps.map((s: { kind: string }) => s.kind)).toEqual(["understand", "listen", "learn", "practice"]);
  expect(lesson.data.next.slug).toBe("guitar-layout");
  const missing = await page.request.get("/api/v1/lessons/nope");
  expect(missing.status()).toBe(404);
  expect((await missing.json()).error.code).toBe("not_found");
  const bad = await page.request.post("/api/v1/progress", { data: { lessonSlug: "the-octave", stepIndex: -1 } });
  expect(bad.status()).toBe(400);
  expect((await page.request.patch("/api/v1/me", { data: { dailyGoalMinutes: 7 } })).status()).toBe(400);
});
