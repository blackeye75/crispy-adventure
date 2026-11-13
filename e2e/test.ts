import { test as base } from "@playwright/test";

export { expect } from "@playwright/test";

/** Playwright's test, except that page.goto also waits until the page is interactive (hydrated). */
export const test = base.extend({
  page: async ({ page }, run) => {
    const goto = page.goto.bind(page);
    page.goto = async (url, options) => {
      const response = await goto(url, options);
      await page.locator("html[data-hydrated]").waitFor({ state: "attached" });
      return response;
    };
    await run(page);
  },
});
