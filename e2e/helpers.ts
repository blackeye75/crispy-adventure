import { expect, type Page } from "@playwright/test";

export const newUser = () => ({ name: "Asha", email: `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`, password: "correct-horse-battery" });

/** Create an account through the UI. Ends on the onboarding screen. */
export async function createAccount(page: Page, user = newUser()) {
  await page.goto("/sign-up");
  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Set up your path" })).toBeVisible();
  return user;
}

/** A new beginner on guitar with the default goal. Ends on Home. */
export async function signUp(page: Page) {
  const user = await createAccount(page);
  await expect(async () => { // on a slow machine the first click can land before the page is interactive
    await page.getByRole("button", { name: "Continue" }).click({ timeout: 2000 }).catch(() => {});
    await expect(page.getByRole("link", { name: "Start the first lesson" })).toBeVisible({ timeout: 6000 });
  }).toPass();
  return user;
}
