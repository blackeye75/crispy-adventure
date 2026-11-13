import { expect, test } from "./test";

test("landing shell renders without horizontal scroll", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test("landing: playable demo, live prices, policy pages, and a helpful 404", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "A minor pentatonic" }).click();
  await expect(page.getByRole("group", { name: "Guitar fretboard" }).locator('.note-marker[data-role="root"] text').first()).toHaveText("A");
  await expect(page.getByText("₹500")).toBeVisible();
  for (const [link, heading] of [["Privacy", "Privacy policy"], ["Terms", "Terms of use"], ["Refunds", "Cancellation and refunds"]]) {
    await page.getByRole("navigation", { name: "Footer" }).getByRole("link", { name: link }).click();
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  }
  const missing = await page.goto("/no-such-page");
  expect(missing!.status()).toBe(404);
  await page.getByRole("link", { name: "See the path" }).click();
  await expect(page).toHaveURL(/\/learn$/);
});
