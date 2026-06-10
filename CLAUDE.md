# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

James Moran's personal site, v2 ("Daylight Studio" / juggling brand system). Static vanilla HTML/CSS/JS, zero dependencies, no build step, deployed to GitHub Pages from `main`. v1 is preserved at git tag `v1`.

## Architecture

- `index.html` — single page: hero carousel → story beats → sticky-stack builds → experience → beyond work → CV section. A hidden `#cv-print` block (direct child of `<body>`) is the ONLY thing visible in print.
- `css/main.css` — all design tokens in `:root` (`[data-theme="dark"]` overrides). **Tokens are the single source of truth** — JS reads them via `JM.cssVar()`; never duplicate color values in scripts.
- `css/print.css` — loaded with `media="print"`; hides everything except `#cv-print`.
- `js/*.js` — classic `<script defer>` IIFEs on a shared `window.JM` namespace (NOT ES modules — keeps `file://` viewing working). Load order matters: `theme.js` first (defines helpers), `main.js` last (orchestrates init).
- `game.html` — self-contained Memory Match easter egg. Shares the `'theme'` localStorage key with the main site. **Do not rename that key.**
- `assets/` — photos James1–16.jpg (cycle uses 1–7 only; 8–16 belong to the game), `projects/` screenshots, `diagrams/bi-platform.svg` (inlined at runtime for theming), `qr-site.svg`, `favicon.svg`.
- `design/` — brand brief, build spec, copy doc. Copy changes should go through `design/copy.md` first.

## Hard rules

1. **Privacy:** no client names, drug/brand names, exact budget figures, colleague names, or internal system identifiers anywhere — including alt text, comments, and commit messages. "Eight-figure annual media programs" is the approved budget phrasing.
2. **Reduced motion:** every animation must be gated; the site must fully work with zero motion (CSS override + `JM.reducedMotion()` checks).
3. **Accessibility:** keep the APG carousel semantics, the pause control, focus-visible styles, and the scoped arrow-key handler.
4. **The print CV must stay one page.** Test with print emulation after any content change.
5. Animate only `transform`/`opacity`; IntersectionObserver class-toggles over scroll handlers.

## Development

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Playwright (python) is the test harness pattern — see git history for the verification scripts (viewports 375/768/1440, light/dark, print PDF, reduced-motion, zero console errors).
