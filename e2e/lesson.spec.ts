import { expect, test } from "./test";
import { signUp, signUpSubscribed } from "./helpers";

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
  await expect(page.getByText(/1-day streak\. \d+ of 10 minutes today\./)).toBeVisible(); // minutes are measured now
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
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(8);
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

test("rhythm, notation and TAB lessons render and play", async ({ page }) => {
  await signUp(page);
  const toStep = async (step: string) => {
    await expect(async () => {
      await next(page).click();
      await expect(page.getByRole("listitem").filter({ hasText: step })).toHaveAttribute("aria-current", "step", { timeout: 2000 });
    }).toPass();
  };

  // Rhythm: sounds with a click, and written note values
  await page.goto("/learn/note-lengths");
  await toStep("Listen");
  const play = page.getByRole("button", { name: "Four quarter notes: one on every beat" });
  await play.click();
  await expect(play).toHaveAttribute("aria-pressed", "true");
  await expect(play).toHaveAttribute("aria-pressed", "false", { timeout: 15_000 }); // four beats at 80 BPM, then it ends by itself
  await toStep("Learn");
  const score = page.getByRole("img", { name: /^treble staff: B4, bar line, B4, B4/ });
  await expect(score.locator("svg path").first()).toBeAttached(); // VexFlow drew something
  await expect(score.locator("svg")).toHaveCount(1);

  // Reading: a drill about a written note
  await page.goto("/learn/the-staff-and-treble-clef");
  for (const step of ["Listen", "Learn", "Practice"]) await toStep(step);
  await page.getByRole("button", { name: "E", exact: true }).click();
  await next(page).click();
  await page.getByRole("button", { name: "F A C E" }).click();
  await next(page).click();
  await expect(page.getByText("Which note is this?")).toBeVisible();
  await expect(page.getByRole("img", { name: "treble staff: B4" }).locator("svg path").first()).toBeAttached();
  await page.getByRole("button", { name: "B", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("It sits on the middle line");

  // Guitar TAB keeps its spacing
  await page.goto("/learn/tab-and-chord-diagrams");
  await expect(page.locator("pre")).toContainText("D|---0-2-3-----------------|");
});

test("Level 2 lessons: circle of fifths, key signatures, 6/8 and strumming patterns", async ({ page }) => {
  await signUpSubscribed(page);
  const toStep = async (step: string) => {
    await expect(async () => {
      await next(page).click();
      await expect(page.getByRole("listitem").filter({ hasText: step })).toHaveAttribute("aria-current", "step", { timeout: 2000 });
    }).toPass();
  };
  const drawn = (name: RegExp) => expect(page.getByRole("img", { name }).locator("svg path").first()).toBeAttached();

  await page.goto("/learn/the-circle-of-fifths");
  for (const step of ["Listen", "Learn"]) await toStep(step);
  const circle = page.getByRole("group", { name: "Circle of fifths" });
  await expect(page.getByRole("status")).toContainText("no sharps or flats");
  await circle.getByRole("button", { name: "A major, 3 sharps" }).click();
  await expect(page.getByRole("status")).toContainText("3 sharps: F♯ C♯ G♯");
  await expect(page.getByRole("status")).toContainText("Relative minor: F♯ minor");
  await circle.getByRole("button", { name: "E♭ major, 3 flats" }).click();
  await expect(page.getByRole("status")).toContainText("3 flats: B♭ E♭ A♭");

  await page.goto("/learn/key-signatures");
  for (const step of ["Listen", "Learn"]) await toStep(step);
  await drawn(/^treble staff: G4, A4, B4, C5, D5, E5, F♯5, G5/);

  await page.goto("/learn/three-four-and-six-eight");
  for (const step of ["Listen", "Learn"]) await toStep(step);
  await drawn(/^treble staff: B4, B4, B4, B4, B4, B4, bar line, B4, B4$/);

  await page.goto("/learn/down-up-strumming");
  for (const step of ["Listen", "Learn"]) await toStep(step);
  await expect(page.getByRole("img", { name: "Strumming pattern. 1: down, and: miss, 2: down, and: up, 3: miss, and: up, 4: down, and: up" })).toBeVisible();
  const play = page.getByRole("button", { name: "Play the pattern (loops)" }).first();
  await play.click();
  await expect(play).toHaveAttribute("aria-pressed", "true");
  await play.click();
  await expect(play).toHaveAttribute("aria-pressed", "false");
});

test("Level 3 lessons: chord diagrams, and progressions that step through their chords", async ({ page }) => {
  await signUpSubscribed(page);
  const toStep = async (step: string) => {
    await expect(async () => {
      await next(page).click();
      await expect(page.getByRole("listitem").filter({ hasText: step })).toHaveAttribute("aria-current", "step", { timeout: 2000 });
    }).toPass();
  };

  await page.goto("/learn/open-major-chords");
  for (const step of ["Listen", "Learn"]) await toStep(step);
  await expect(page.getByRole("img", { name: "C chord: string 6 not played, string 5 fret 3, string 4 fret 2, string 3 open, string 2 fret 1, string 1 open" })).toBeVisible();
  await expect(page.getByRole("img", { name: /^D chord: string 6 not played, string 5 not played, string 4 open/ })).toBeVisible();

  await page.goto("/learn/barre-chords");
  for (const step of ["Listen", "Learn"]) await toStep(step);
  const f = page.getByRole("img", { name: /^F chord: string 6 fret 1/ });
  await expect(f.locator("rect")).toHaveCount(1); // the barre, drawn as one bar across the strings
  await expect(page.getByRole("img", { name: /^B chord: string 6 not played, string 5 fret 2/ }).getByText("2fr")).toHaveCount(0); // still within four frets of the nut

  await page.goto("/learn/harmonising-the-major-scale");
  for (const step of ["Listen", "Learn"]) await toStep(step);
  const current = page.locator("p span.text-primary");
  await expect(current).toHaveText("C");
  await page.getByRole("button", { name: "Play the chords" }).click();
  await expect(current).toHaveText("Dm", { timeout: 10_000 });
  await expect(page.getByRole("group", { name: "Guitar fretboard" }).locator('.note-marker[data-role="root"] text').first()).toHaveText("D");
  await expect(current).toHaveText("Em", { timeout: 10_000 });
});

test("Level 4 lessons: scale positions on fifteen frets, CAGED shapes up the neck, triplets", async ({ page }) => {
  await signUpSubscribed(page);
  const toStep = async (step: string) => {
    await expect(async () => {
      await next(page).click();
      await expect(page.getByRole("listitem").filter({ hasText: step })).toHaveAttribute("aria-current", "step", { timeout: 2000 });
    }).toPass();
  };

  await page.goto("/learn/five-pentatonic-positions");
  for (const step of ["Listen", "Learn"]) await toStep(step);
  const first = page.getByRole("group", { name: "Guitar fretboard" }).first();
  await expect(first.locator(".note-marker:not([data-dimmed])")).toHaveCount(12); // position 1: two notes on each of six strings
  await expect(first.getByRole("button", { name: "A2, root, string 6, fret 5" })).toBeVisible();
  await expect(first.getByText("15", { exact: true })).toBeVisible(); // this lesson shows fifteen frets

  await page.goto("/learn/the-caged-system");
  for (const step of ["Listen", "Learn"]) await toStep(step);
  const eShape = page.getByRole("img", { name: "C chord: string 6 fret 8, string 5 fret 10, string 4 fret 10, string 3 fret 9, string 2 fret 8, string 1 fret 8" });
  await expect(eShape.getByText("8fr")).toBeVisible();
  await expect(eShape.locator("rect")).toHaveCount(1);

  await page.goto("/learn/three-notes-per-string");
  for (const step of ["Listen", "Learn"]) await toStep(step);
  await expect(page.getByRole("group", { name: "Guitar fretboard" }).locator(".note-marker")).toHaveCount(18); // exactly three on each string

  await page.goto("/learn/triplets");
  for (const step of ["Listen", "Learn"]) await toStep(step);
  const score = page.getByRole("img", { name: /^treble staff: B4, B4, B4, B4, B4, B4, B4$/ });
  await expect(score.locator("svg path").first()).toBeAttached();
});

test("playing track: the path lists it by name, and a strum pattern follows the chords bar by bar", async ({ page }) => {
  await signUpSubscribed(page);
  await page.goto("/learn");
  await expect(page.getByRole("heading", { level: 2, name: /Playing · Rhythm guitar and strumming/ })).toBeVisible();
  await page.getByRole("link", { name: /Changing chords in time/ }).click();
  await next(page).click();
  await next(page).click();
  const bars = page.getByRole("list", { name: "Chords, one per bar" }).first();
  await expect(bars.getByRole("listitem")).toHaveText(["G", "Em", "G", "Em"]);
  await page.getByRole("button", { name: "Play the pattern (loops)" }).first().click();
  await expect(bars.locator('li[aria-current="true"]')).toHaveText("Em", { timeout: 15_000 }); // the second bar
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test("lead guitar: a tab plays, its notes light up on the tab and on the fretboard", async ({ page }, info) => {
  await signUpSubscribed(page);
  await page.goto("/learn");
  await expect(page.getByRole("heading", { level: 2, name: /Playing · Lead guitar and solos/ })).toBeVisible();
  await page.goto("/learn/first-licks");
  await next(page).click();
  await next(page).click();
  const tab = page.getByRole("img", { name: /^Tab\. string 2 fret 8; string 2 fret 5; string 3 fret 7; string 3 fret 5; string 4 fret 7$/ });
  await expect(tab).toBeVisible();
  const board = page.getByRole("group", { name: /Guitar fretboard/ }).first();
  await expect(board.locator(".note-marker")).toHaveCount(5);
  await page.getByRole("button", { name: "Play the tab" }).first().click();
  await expect(tab.locator(".tab-note[data-active]")).toHaveCount(1, { timeout: 15_000 });
  await expect(board.locator(".note-marker[data-active]")).toHaveCount(1);
  await page.screenshot({ path: `test-results/tab-${info.project.name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test("backing track: twelve bars of blues loop under the box, and the chord of the bar lights up", async ({ page }) => {
  test.setTimeout(90_000);
  await signUpSubscribed(page);
  await page.goto("/learn/blues-solo-study-piece");
  for (let i = 0; i < 3; i++) await next(page).click(); // to Practice
  for (const answer of ["Twelve", "A minor pentatonic", "E"]) {
    await page.getByRole("button", { name: answer, exact: true }).click();
    await next(page).click();
  }
  for (let i = 0; i < 3; i++) await next(page).click(); // past the three tabs
  const bars = page.getByRole("list", { name: "Chords, one per bar" });
  await expect(bars.getByRole("listitem")).toHaveCount(12);
  await page.getByLabel("Tempo in beats per minute").fill("160");
  await page.getByRole("button", { name: "Play along (loops)" }).click();
  await expect(bars.locator('li[aria-current="true"]')).toHaveText("A7", { timeout: 15_000 });
  await expect(bars.getByRole("listitem").nth(4)).toHaveAttribute("aria-current", "true", { timeout: 20_000 }); // bar 5: D7
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});
