# Fretkey logo

One mark, used everywhere: an **F** made of a piano key (the stem) and two strings (the arms), with a gold note on the string.

| File | Use |
|---|---|
| `instagram-profile-1080.png` | Instagram and other profile pictures. Square, full bleed; the mark sits inside the circle crop. |
| `logo-icon-1024.png`, `logo-icon.svg` | App icon with rounded corners, on the dark background. |
| `logo-mark-on-dark.svg`, `logo-mark-on-light.svg` | The mark alone, no background. |
| `logo-horizontal-on-dark.png`, `logo-horizontal-on-light.png` | Mark and name side by side, transparent background. |

Colours: background `#17140f`, cream `#f3efe6`, gold `#eeb443`. The name is set in Fraunces 600.

The website uses the same mark: `src/app/icon.svg` (favicon), `src/app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png`, the header (`src/components/ui/logo.tsx`) and the link preview (`src/app/opengraph-image.tsx`).

To change the mark, edit the shapes in `render.mjs`, `src/app/icon.svg` and `src/components/ui/logo.tsx`, then run `node brand/render.mjs` from the repo root to rebuild every PNG.
