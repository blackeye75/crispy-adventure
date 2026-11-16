import type { Page } from "@playwright/test";
import { expect, test } from "./test";

// Acceptance checklist from docs/CANVAS.md.
const fretboard = (page: Page) => page.getByRole("group", { name: /Guitar fretboard/ });
const keyboard = (page: Page) => page.getByRole("group", { name: "Piano keyboard" });
const labels = async (page: Page, group: ReturnType<typeof fretboard>) => {
  await group.locator(".note-marker").first().waitFor(); // the canvas streams in after the static shell
  return [...new Set(await group.locator(".note-marker text").allTextContents())].sort();
};

test("fretboard, keyboard and panel show the same notes, spelled for the key", async ({ page }) => {
  await page.goto("/practice?root=F%23&scale=major");
  const expected = ["A♯", "B", "C♯", "D♯", "E♯", "F♯", "G♯"];
  expect(await labels(page, fretboard(page))).toEqual(expected);
  expect(await labels(page, keyboard(page))).toEqual(expected);
  await expect(page.getByText("F♯ major scale: F♯ G♯ A♯ B C♯ D♯ E♯")).toBeAttached(); // screen-reader announcement
});

test("focusing C4 on the keyboard lights exactly the C4 positions on the fretboard, and the reverse", async ({ page }) => {
  await page.goto("/practice");
  await keyboard(page).locator('.note-marker[data-midi="60"]').focus();
  await expect(fretboard(page).locator(".note-marker[data-active]")).toHaveCount(4);
  expect(await fretboard(page).locator(".note-marker[data-active]").evaluateAll((els) => els.map((el) => el.getAttribute("data-midi")))).toEqual(["60", "60", "60", "60"]);
  await fretboard(page).locator('.note-marker[data-midi="64"]').first().focus();
  await expect(keyboard(page).locator(".note-marker[data-active]")).toHaveCount(1);
  await expect(keyboard(page).locator(".note-marker[data-active]")).toHaveAttribute("data-midi", "64");
});

test("controls change the whole canvas and the URL; chips work", async ({ page }, info) => {
  await page.goto("/practice");
  if (info.project.name === "phone-360") await page.getByText("Details").click(); // open the bottom sheet
  await page.getByRole("button", { name: "Am", exact: true }).click();
  await expect(page).toHaveURL(/root=A&chord=minor/);
  expect(await labels(page, keyboard(page))).toEqual(["A", "C", "E"]);
  await page.getByRole("group", { name: "Labels" }).getByRole("button", { name: "Degrees" }).click();
  expect(await labels(page, fretboard(page))).toEqual(["1", "5", "♭3"]);
  await page.getByRole("group", { name: "Show" }).getByRole("button", { name: "Progression" }).click();
  await expect(page).toHaveURL(/prog=I-IV-V/);
});

test("left-handed mirrors the fretboard only", async ({ page }) => {
  await page.goto("/practice");
  const openLowE = fretboard(page).getByRole("button", { name: "E2, chord tone, string 6, open" });
  // position within the keyboard itself, so its scroll offset does not matter
  const keyX = () => keyboard(page).locator('.note-marker[data-midi="60"]').evaluate((el) => Math.round(el.getBoundingClientRect().x - el.closest("svg")!.getBoundingClientRect().x));
  const before = { fret: (await openLowE.boundingBox())!.x, key: await keyX() };
  await page.goto("/practice?root=C&scale=major&lh=1");
  await expect(page.getByRole("group", { name: "Guitar fretboard, left-handed" })).toBeVisible();
  expect((await openLowE.boundingBox())!.x).toBeGreaterThan(before.fret + 200);
  expect(await keyX()).toBe(before.key);
});

test("playback pulses markers on both instruments, then stops", async ({ page }) => {
  await page.goto("/practice");
  await expect(async () => { // the first click can land before the canvas is interactive
    await page.getByRole("button", { name: "Play" }).click({ timeout: 1000 }).catch(() => {});
    await expect(page.getByRole("button", { name: "Stop" })).toBeVisible({ timeout: 1500 });
  }).toPass();
  await expect(fretboard(page).locator('.note-marker[data-active][data-midi="50"]').first()).toBeVisible({ timeout: 10_000 });
  await expect(keyboard(page).locator('.note-marker[data-active][data-midi="50"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible({ timeout: 15_000 }); // back from "Stop" at the end
  await expect(page.locator(".note-marker[data-active]")).toHaveCount(0);
});

test("phone: no page overflow, touch targets of 44px, transport stays reachable", async ({ page }, info) => {
  test.skip(info.project.name !== "phone-360");
  await page.goto("/practice");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  for (const group of [fretboard(page), keyboard(page)]) {
    const box = (await group.locator(".note-marker .hit").first().boundingBox())!;
    expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
  }
  await expect(page.getByRole("button", { name: "Play" })).toBeInViewport();
  await expect(page.getByText("Details")).toBeInViewport();
});

test("practice tools: metronome on its own, tempo trainer speeds up the loop, a section of a progression loops", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/practice?root=C&prog=I-IV-V");
  const transport = page.getByRole("group", { name: "Playback" });
  const tempo = transport.getByLabel("Tempo in beats per minute");

  // Metronome alone: it runs, lights no notes, and Stop ends it.
  await transport.getByRole("button", { name: "Metronome" }).click();
  await expect(transport.getByRole("button", { name: "Stop" })).toBeVisible();
  await expect(page.locator(".note-marker[data-active]")).toHaveCount(0);
  await transport.getByRole("button", { name: "Stop" }).click();
  await transport.getByRole("button", { name: "Metronome" }).click(); // off again

  // Section: with the trainer on (it loops), choose chords 2 to 3 only.
  await expect(transport.getByLabel("Loop from chord")).toHaveCount(0);
  await transport.getByRole("button", { name: /Tempo trainer/ }).click();
  await transport.getByLabel("Loop from chord").selectOption({ index: 1 });
  await expect(transport.getByLabel("Loop to chord").locator("option")).toHaveCount(2);
  await tempo.fill("200");
  await transport.getByRole("button", { name: "Play" }).click();
  // Two chords of two beats at 200 bpm: a pass takes just over a second. The loop never stops by itself and never plays chord 1.
  const chordCells = page.locator('aside[aria-label="Theory"] button[aria-pressed]');
  await expect(chordCells.nth(2)).toHaveAttribute("aria-pressed", "true", { timeout: 10_000 }); // reached chord 3
  await expect(chordCells.nth(1)).toHaveAttribute("aria-pressed", "true", { timeout: 10_000 }); // wrapped to chord 2, not 1
  await expect(chordCells.nth(0)).toHaveAttribute("aria-pressed", "false");
  await transport.getByRole("button", { name: "Stop" }).click();

  // Trainer: from 60, the tempo has risen after two passes.
  await tempo.fill("60");
  await transport.getByLabel("Loop to chord").selectOption({ index: 0 }); // one chord: a pass is two beats
  await transport.getByRole("button", { name: "Play" }).click();
  await expect(tempo).toHaveValue("65", { timeout: 20_000 });
  await transport.getByRole("button", { name: "Stop" }).click();
  await expect(tempo).toHaveValue("65"); // stays where you got to
});

test("note names: the canvas can label a scale in Do Re Mi and in Sa Re Ga", async ({ page }) => {
  await page.goto("/practice?root=D&scale=dorian");
  await page.getByRole("group", { name: "Labels" }).getByText("Sa Re Ga").click();
  expect(await labels(page, fretboard(page))).toEqual(["Dha", "Ma", "Pa", "Re", "Sa", "ga", "ni"]); // Kafi: komal Ga and Ni
  expect(await labels(page, keyboard(page))).toEqual(["Dha", "Ma", "Pa", "Re", "Sa", "ga", "ni"]);
  await expect(page).toHaveURL(/labels=sargam/);
  await page.getByRole("group", { name: "Labels" }).getByText("Do Re Mi").click();
  expect(await labels(page, fretboard(page))).toEqual(["Do", "Fa", "La", "Me", "Re", "Sol", "Te"]);
});

test("ear trainer: a question plays, a wrong answer can be retried, the right one explains itself and the score counts first tries", async ({ page }) => {
  await page.goto("/practice");
  await page.getByRole("link", { name: /Ear trainer/ }).click();
  await expect(page.getByRole("heading", { name: "Ear trainer" })).toBeVisible();
  await page.getByRole("group", { name: "What to listen for" }).getByText("Chords").click();
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByText("Which chord is this?")).toBeVisible();
  const options = page.locator("button[aria-disabled]");
  await expect(options).toHaveCount(4);
  // try the options in turn until one is right; wrong ones are marked and stay wrong
  for (let i = 0; i < 4; i++) {
    await options.nth(i).click();
    if (await page.getByRole("status").filter({ hasText: "Correct." }).count()) break;
    await expect(page.getByRole("status").filter({ hasText: "Not quite." })).toBeVisible();
  }
  await expect(page.getByRole("status").filter({ hasText: /Correct\. .+\. Its formula is 1 / })).toBeVisible();
  await expect(page.getByText(/^[01] of 1 right first time · streak [01]$/)).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Correct." })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});
