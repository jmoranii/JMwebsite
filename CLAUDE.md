# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

James Moran's personal site, v3 (chaptered editorial on the scroll-craft engine; juggling brand carried from v2). Static vanilla HTML/CSS/JS, no build step, deployed to GitHub Pages from `main`. v1 and v2 are preserved at git tags `v1` and `v2`.

## Architecture

- `index.html` — one page, six chapters: title page → the arc (metal, the leap, the startup; `data-sc-act="flow"`) → the AI era (`pin`, the inlined workspace SVG draws from `--sc-p`) → intertitle → proof (`flow`, iris reveal onto a phone plate that loads the Rolfe Legends 2 iframe on request) → beyond work (`scrub`, the one clip, in a column) → colophon (`pin`, greet-and-hold cue, footer inside the stage). A hidden `#cv-print` block (direct child of `<body>`) is the ONLY thing visible in print.
- `scrollcraft.css` / `scrollcraft.js` — the engine, **never edited**. Bespoke behaviour goes in `v3.js` off `data-sc-*` attributes of our own naming and `--sc-p`.
- `v3.css` — tokens (six colors, two fonts: Outfit + Source Serif 4), chapter grounds (hard cuts, no drift), layout, the props. Light-canvas inversions from scroll-craft's worlds.md are applied (warm halved shadows, white edge light).
- `v3.js` — the folio (chapter title in the margin), the props (the title's periods lift off one per chapter and juggle real siteswaps in a fixed tray; `data-sc-verify-state` on the tray for the harness), the playable embed, the print line.
- `print.css` — loaded with `media="print"`; hides everything except `#cv-print`. **The print CV must stay one page.**
- `assets/` — `metal-coils.jpg`, `leap-iowa.jpg` (real photos), `startup-team.jpg` (real photo, the 2023 summit), `juggle.mp4` / `juggle-m.mp4` (scrub-encoded, dense GOP) + `juggle-poster.jpg`, `portrait-clubs.jpg`, `rl2-phone.jpg`, `ccc-phone.jpg`, `og-card.jpg`, `qr-site.svg`, `favicon.svg`. Legacy `James1–16.jpg`, `human-v2.jpg`, `keep-it-up-theme.mp3`, `projects/`, `diagrams/` serve the v2 games and history; leave them.
- `keep-it-up.html`, `game.html`, `css/`, `js/` — the v2 games and their styles/scripts, unlinked from the page but kept reachable by URL. Do not rename their localStorage keys.
- `scrollcraft/` (gitignored) — the scroll-craft lab: `builds/v3/BRIEF.md` (the interview, journey, feeling curve, score table, verification record), contact sheets, source clips.

## Hard rules

1. **Privacy:** no client names, drug/brand names, exact budget figures, colleague names, or internal system identifiers anywhere, including alt text, comments, and commit messages. "Eight-figure annual media programs" is the approved budget phrasing. Real numbers only; no invented statistics.
2. **Voice:** no em dashes in any user-facing copy. Period, comma, colon, or parentheses.
3. **Reduced motion:** every animation is gated; the site must fully work with zero motion (the engine handles its devices; the props stay as periods and the tray draws a static row).
4. **Taste floor (scroll-craft `references/taste.md`):** two type families, one accent, `transform`/`opacity`/`clip-path` only, no scroll cues, no section counters, no emoji as icons, no cards-as-structure.
5. **Verify by scrolling before shipping:** `node <scroll-craft>/scripts/shoot.mjs` at desktop, 390×844, and `--reduced-motion`, then read the contact sheets. Two known harness interactions: never inline an SVG that carries its own `<style>` (the harness pops the last `<style>` to restore hidden text), and inject attributes before a self-closing `/>`.

## Development

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
