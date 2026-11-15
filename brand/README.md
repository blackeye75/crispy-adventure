# Fretkey logo

One mark, used everywhere: an **F** whose stem is a strip of piano keys (five white keys, three black, in the grouping of C to G) and whose arms are guitar strings, with a gold note on the string.

| File | Use |
|---|---|
| `instagram-profile-1080.png` | Instagram and other profile pictures. Square, full bleed; the mark sits inside the circle crop. |
| `logo-icon-1024.png`, `logo-icon.svg` | App icon with rounded corners, on the dark background. |
| `logo-mark-on-dark.svg`, `logo-mark-on-light.svg` | The mark alone, no background. |
| `logo-horizontal-on-dark.png`, `logo-horizontal-on-light.png` | Mark and name side by side, transparent background. |
| `launch-cover-reel-1080x1920.png` | Cover for the launch reel. The content sits inside the 3:4 crop Instagram shows on the profile grid. |
| `launch-cover-feed-1080x1350.png` | The same cover as a 4:5 feed post. |

Colours: background `#17140f`, cream `#f3efe6`, gold `#eeb443`. The name is set in Fraunces 600.

The website uses the same mark: `src/app/icon.svg` (favicon), `src/app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png`, the header (`src/components/ui/logo.tsx`) and the link preview (`src/app/opengraph-image.tsx`).

To change the mark, edit the shapes in `render.mjs` and run `node brand/render.mjs` from the repo root: it rebuilds every PNG and SVG, including the favicon. The header (`src/components/ui/logo.tsx`) and the link preview (`src/app/opengraph-image.tsx`) draw the same shapes by hand and must be updated to match.

The two launch covers are stills from the video project: `cd launch-video && npx remotion still CoverReel ../brand/launch-cover-reel-1080x1920.png` (and `CoverFeed`). Edit them in `launch-video/src/scenes/Cover.tsx`.
