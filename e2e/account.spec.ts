import { expect, test } from "./test";
import { createAccount, newUser, signUp } from "./helpers";

test("signed-out visitors are sent to sign in and come back where they were going", async ({ page }) => {
  await page.goto("/review");
  await expect(page).toHaveURL(/\/sign-in\?next=%2Freview/);
  await page.getByRole("link", { name: "Create an account" }).click();
  await expect(page).toHaveURL(/\/sign-up\?next=%2Freview/);
  await expect(page.getByRole("button", { name: "Continue with Google" })).toHaveCount(0); // not configured here
});

test("onboarding with the placement quiz skips the modules you know", async ({ page }) => {
  await createAccount(page);
  const piano = page.getByRole("button", { name: "Piano" });
  await expect(async () => { // the first click can land before the page is interactive
    await piano.click();
    await expect(piano).toHaveAttribute("aria-pressed", "true", { timeout: 500 });
  }).toPass();
  await page.getByRole("button", { name: /I know some/ }).click();
  await page.getByRole("button", { name: "15 min" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  // Module 1 answered correctly, module 2 unknown
  await expect(page.getByText("Question 1 of 6")).toBeVisible();
  for (const right of ["Yes, an octave apart", "The thickest, lowest string", "In twos and threes"]) await page.getByRole("button", { name: right }).click();
  for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "I do not know" }).click();
  await expect(page.getByRole("heading", { name: "You can skip 4 lessons." })).toBeVisible();
  await page.getByRole("button", { name: "Go to your home" }).click();

  await expect(page.getByRole("heading", { name: "The seven natural notes" })).toBeVisible(); // first lesson of module 2
  await expect(page.getByRole("img", { name: "0 of 15 minutes practised today" })).toBeVisible();
  await expect(page.getByLabel("Review")).toContainText("0");
  await page.goto("/learn");
  await expect(page.getByRole("link", { name: /Completed/ })).toHaveCount(4);
  await page.goto("/learn/natural-notes");
  await expect(page.getByRole("group", { name: "Instrument" }).getByRole("button", { name: "Piano" })).toHaveAttribute("aria-pressed", "true");
});

test("progress is saved to the account: resume mid-lesson, sign out, sign back in", async ({ page }) => {
  const user = await signUp(page);
  await page.goto("/learn/what-is-a-note");
  await page.getByRole("button", { name: "Continue" }).click();
  const saved = page.waitForResponse((r) => r.url().endsWith("/api/v1/progress") && r.request().postDataJSON().stepIndex === 2);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("listitem").filter({ hasText: "Learn" })).toHaveAttribute("aria-current", "step");
  expect((await saved).status()).toBe(200);
  await page.reload();
  await expect(page.getByRole("listitem").filter({ hasText: "Learn" })).toHaveAttribute("aria-current", "step");

  await page.goto("/review"); // review is part of the subscription
  await expect(page.getByRole("link", { name: "See plans" })).toBeVisible();
  await page.getByRole("link", { name: "Back to home" }).click();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in/);

  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert").filter({ hasText: /invalid/i })).toBeVisible();
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("link", { name: "Start the first lesson" })).toBeVisible();
});

test("the post-sign-in destination cannot point at another site", async ({ page }) => {
  const user = newUser();
  await page.goto("/sign-up?next=//evil.example/steal");
  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/localhost:3000\/onboarding/);
});

test("settings: preferences reach the lessons, the theme sticks, progress fills in", async ({ page }) => {
  await signUp(page);
  await page.goto("/onboarding"); // already set up
  await expect(page).toHaveURL(/\/settings/);

  const prefs = page.getByLabel("Preferences");
  const lefty = prefs.getByLabel("Left-handed fretboard in lessons");
  await expect(async () => { // the first click can land before the page is interactive
    await lefty.check();
    await expect(lefty).toBeChecked({ timeout: 500 });
  }).toPass();
  await prefs.getByRole("button", { name: "20 min" }).click();
  await prefs.getByRole("button", { name: "Save preferences" }).click();
  await expect(prefs.getByRole("status")).toHaveText("Saved.");

  await page.getByLabel("Appearance").getByRole("button", { name: "Light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByLabel("Appearance").getByRole("button", { name: "Light" })).toHaveAttribute("aria-pressed", "true");

  await page.goto("/progress");
  await expect(page.getByText("Nothing yet.")).toBeVisible();
  const done = await page.request.post("/api/v1/progress", { data: { lessonSlug: "what-is-a-note", stepIndex: 6, completed: true, seconds: 180, drills: { answered: 4, correct: 4 } } });
  expect((await done.json()).data.today).toEqual({ streak: 1, minutes: 3, goalMinutes: 20 });
  await page.reload();
  await expect(page.getByRole("progressbar", { name: "Sound and pitch" })).toHaveAttribute("aria-valuenow", "1");
  await expect(page.getByRole("row").nth(1)).toContainText("100%");
  expect((await (await page.request.get("/api/v1/stats")).json()).data.totals).toMatchObject({ minutes: 3, lessonsCompleted: 1, accuracy: 1 });

  await page.goto("/learn/the-octave");
  for (const step of ["Listen", "Learn"]) {
    await expect(async () => { // wait for each step to really change before clicking on
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page.getByRole("listitem").filter({ hasText: step })).toHaveAttribute("aria-current", "step", { timeout: 2000 });
    }).toPass();
  }
  await expect(page.getByRole("group", { name: "Guitar fretboard, left-handed" })).toBeVisible();
});
