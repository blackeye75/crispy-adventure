// Renders the PNG versions of the logo from the SVG mark. Run from the repo root: node brand/render.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const BG = "#17140f", CREAM = "#f3efe6", GOLD = "#eeb443";
// The stem of the F is a strip of piano keyboard: five white keys with black keys in the 2 + 1 grouping of C to G.
const STEM = { x: 125, y: 112, w: 100, h: 288 };
const WHITE = STEM.h / 5;
const BLACK_AT = [1, 2, 4]; // black keys sit on these boundaries between white keys
/** `key` is the colour of the white keys and the strings, `gap` the colour of the black keys and the lines between keys. */
const mark = (key, gap, outline = false) =>
  `<rect x="${STEM.x}" y="${STEM.y}" width="${STEM.w}" height="${STEM.h}" rx="14" fill="${key}"${outline ? ` stroke="${gap}" stroke-width="7"` : ""}/>` +
  `<rect x="185" y="112" width="196" height="34" rx="17" fill="${outline ? gap : key}"/><rect x="185" y="214" width="150" height="34" rx="17" fill="${outline ? gap : key}"/>` +
  (outline ? `<rect x="${STEM.x}" y="${STEM.y}" width="${STEM.w}" height="${STEM.h}" rx="14" fill="${key}" stroke="${gap}" stroke-width="7"/>` : "") +
  [1, 2, 3, 4].map((k) => `<rect x="${STEM.x}" y="${(STEM.y + k * WHITE - 2.5).toFixed(1)}" width="${STEM.w}" height="5" fill="${gap}"/>`).join("") +
  BLACK_AT.map((k) => `<rect x="${STEM.x - (outline ? 0 : 1)}" y="${(STEM.y + k * WHITE - 16).toFixed(1)}" width="60" height="32" rx="5" fill="${gap}"/>`).join("") +
  `<circle cx="345" cy="231" r="40" fill="${GOLD}"/>`;
const font = readFileSync("launch-video/public/fonts/fraunces-latin-600-normal.woff2").toString("base64");
const face = `@font-face{font-family:Fraunces;font-weight:600;src:url(data:font/woff2;base64,${font})}`;
/** A square icon. `inset` shrinks the mark towards the centre: profile pictures are cropped to a circle, maskable icons to a smaller shape still. */
const square = (inset, rounded) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%"><rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="${BG}"/><g transform="translate(256 256) scale(${inset}) translate(-256 -256)">${mark(CREAM, BG)}</g></svg>`;
const lockup = (key, gap, text, outline = false) => `<div style="display:flex;align-items:center;gap:36px;padding:60px 70px;font-family:Fraunces;font-weight:600;font-size:200px;letter-spacing:-4px;color:${text};line-height:1"><svg viewBox="100 80 312 352" height="230">${mark(key, gap, outline)}</svg><span>Fret<span style="color:${GOLD}">key</span></span></div>`;

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
await shot("brand/logo-horizontal-on-dark.png", 1400, 400, lockup(CREAM, BG, CREAM), true);
await shot("brand/logo-horizontal-on-light.png", 1400, 400, lockup("#ffffff", BG, BG, true), true); // true piano colours: white keys outlined in black
// the vector versions, written from the same shapes so nothing drifts apart
const svg = (viewBox, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n  <!-- The Fretkey mark: an F whose stem is a strip of piano keys and whose arms are strings, with a note on the string. -->\n  ${body}\n</svg>\n`;
const icon = svg("0 0 512 512", `<rect width="512" height="512" rx="112" fill="${BG}"/>${mark(CREAM, BG)}`);
writeFileSync("src/app/icon.svg", icon);
writeFileSync("brand/logo-icon.svg", icon);
writeFileSync("brand/logo-mark-on-dark.svg", svg("100 80 312 352", mark(CREAM, BG)));
writeFileSync("brand/logo-mark-on-light.svg", svg("100 80 312 352", mark("#ffffff", BG, true)));
await browser.close();
console.log("logo files written");
