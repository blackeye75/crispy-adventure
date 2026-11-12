import { expect, test } from "@playwright/test";
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

  await page.goto("/review");
  await expect(page.getByRole("heading", { name: "Nothing to review right now." })).toBeVisible();
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
