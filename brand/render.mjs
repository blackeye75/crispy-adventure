// Renders the PNG versions of the logo from the SVG mark. Run from the repo root: node brand/render.mjs
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const BG = "#17140f", CREAM = "#f3efe6", GOLD = "#eeb443";
const mark = (key) => `<rect x="133" y="112" width="84" height="288" rx="18" fill="${key}"/><rect x="175" y="112" width="198" height="34" rx="17" fill="${key}"/><rect x="175" y="214" width="150" height="34" rx="17" fill="${key}"/><circle cx="339" cy="231" r="40" fill="${GOLD}"/>`;
const font = readFileSync("launch-video/public/fonts/fraunces-latin-600-normal.woff2").toString("base64");
const face = `@font-face{font-family:Fraunces;font-weight:600;src:url(data:font/woff2;base64,${font})}`;
/** A square icon. `inset` shrinks the mark towards the centre: profile pictures are cropped to a circle, maskable icons to a smaller shape still. */
const square = (inset, rounded) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%"><rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="${BG}"/><g transform="translate(256 256) scale(${inset}) translate(-256 -256)">${mark(CREAM)}</g></svg>`;
const lockup = (key, text) => `<div style="display:flex;align-items:center;gap:36px;padding:60px 70px;font-family:Fraunces;font-weight:600;font-size:200px;letter-spacing:-4px;color:${text};line-height:1"><svg viewBox="100 80 312 352" height="230">${mark(key)}</svg><span>Fret<span style="color:${GOLD}">key</span></span></div>`;

const browser = await chromium.launch();
const shot = async (file, width, height, body, transparent = false) => {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(`<style>${face}html,body{margin:0;background:${transparent ? "transparent" : BG}}</style>${body}`);
  await page.evaluate(() => document.fonts.ready);
  const target = transparent ? page.locator("body > div") : page;
  await target.screenshot({ path: file, omitBackground: transparent });
  await page.close();
};
await shot("brand/instagram-profile-1080.png", 1080, 1080, square(0.82, false)); // full bleed; Instagram crops it to a circle
await shot("public/icon-512.png", 512, 512, square(0.8, false)); // also used as the maskable icon, so the mark stays in the safe zone
await shot("public/icon-192.png", 192, 192, square(0.8, false));
await shot("src/app/apple-icon.png", 180, 180, square(0.9, false)); // iOS rounds the corners itself
await shot("brand/logo-icon-1024.png", 1024, 1024, `<div style="width:1024px;height:1024px">${square(1, true)}</div>`, true);
await shot("brand/logo-horizontal-on-dark.png", 1400, 400, lockup(CREAM, CREAM), true);
await shot("brand/logo-horizontal-on-light.png", 1400, 400, lockup(BG, BG), true);
await browser.close();
console.log("logo files written");
