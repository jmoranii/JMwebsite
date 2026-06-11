# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

James Moran's personal site, v2 ("Daylight Studio" / juggling brand system). Static vanilla HTML/CSS/JS, zero dependencies, no build step, deployed to GitHub Pages from `main`. v1 is preserved at git tag `v1`.

## Architecture

- `index.html` — single page: hero carousel → story beats → sticky-stack builds → experience → beyond work → CV section. A hidden `#cv-print` block (direct child of `<body>`) is the ONLY thing visible in print.
- `css/main.css` — all design tokens in `:root` (`[data-theme="dark"]` overrides). **Tokens are the single source of truth** — JS reads them via `JM.cssVar()`; never duplicate color values in scripts.
- `css/print.css` — loaded with `media="print"`; hides everything except `#cv-print`.
- `js/*.js` — classic `<script defer>` IIFEs on a shared `window.JM` namespace (NOT ES modules — keeps `file://` viewing working). Load order matters: `theme.js` first (defines helpers), `main.js` last (orchestrates init).
- `keep-it-up.html` — self-contained juggling game (the footer easter-egg target); plays `assets/keep-it-up-theme.mp3` (lazy-loaded on Play, mute remembered at `'jm-keepitup-muted'`); links onward to `game.html` (the original self-contained Memory Match). All pages share the `'theme'` localStorage key. **Do not rename these keys.**
- `assets/` — generated facet portraits (`engineer-v2/analyst-v2/builder-v2/human-v2.jpg` on the carousel cards), legacy photos James1–16.jpg (badge cycle uses a curated subset in `js/portrait.js`; 8–16 belong to Memory Match), `bjj-v2.jpg` + `stylized-poster.jpg` (badge cycle), `og-card.jpg` (1200×630 social card), `keep-it-up-theme.mp3`, `projects/` screenshots, `diagrams/bi-platform.svg` (inlined at runtime for theming), `qr-site.svg`, `favicon.svg`.
- `design/` — brand brief, build spec, copy doc. Copy changes should go through `design/copy.md` first.

## Hard rules

1. **Privacy:** no client names, drug/brand names, exact budget figures, colleague names, or internal system identifiers anywhere — including alt text, comments, and commit messages. "Eight-figure annual media programs" is the approved budget phrasing.
2. **Reduced motion:** every animation must be gated; the site must fully work with zero motion (CSS override + `JM.reducedMotion()` checks).
3. **Accessibility:** keep the APG carousel semantics, the pause control, focus-visible styles, and the scoped arrow-key handler.
4. **The print CV must stay one page.** Test with print emulation after any content change.
5. Animate only `transform`/`opacity`; IntersectionObserver class-toggles over scroll handlers.

## Post-launch evolution

`design/build-spec.md` describes the launch build; the carousel has since become polaroid photo cards, the cascade runs real siteswaps (see `js/cascade.js` header), the builds section is a single-container deck, and a 404 page + game music shipped. Treat the live code as the source of truth for behavior; the design docs for intent. **Voice rule: no em-dashes in any user-facing copy** (see `design/copy.md`).

## Development

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Playwright (python) is the test harness pattern — see git history for the verification scripts (viewports 375/768/1440, light/dark, print PDF, reduced-motion, zero console errors).
