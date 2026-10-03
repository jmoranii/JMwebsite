# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

James Moran's personal site, v3 (chaptered editorial on the scroll-craft engine; juggling brand carried from v2). Static vanilla HTML/CSS/JS, no build step, deployed to GitHub Pages from `main`. v1 and v2 are preserved at git tags `v1` and `v2`.

## Architecture

- `index.html` — one page, six chapters: title page → the arc (metal, the leap, the startup; `data-sc-act="flow"`) → the AI era (`pin`, span 3.2: the inlined workspace SVG draws from `--sc-p` over the first ~60% and then holds finished; `v3.js` sets `data-sc-verify-hold` during the hold so the harness reads it as authored silence) → intertitle → proof (`flow`, iris reveal onto a phone plate that loads the Rolfe Legends 2 iframe on request, then the book club game and the second brain with a static vault diagram drawn in the same language as the workspace one) → beyond work (`scrub`, the one clip, in a column) → contact me, the last page (`pin`, span 1.15, greet-and-hold cue, a slow-motion clubs loop that plays only while on screen, footer inside the stage). A hidden `#cv-print` block (direct child of `<body>`) is the ONLY thing visible in print: a short card pointing to the résumé PDF. The résumé itself is `assets/James_Moran_Resume.pdf`, linked from the last page; it is exported from James's Google Doc, which is the single source, so update it by replacing the file, never by hand-editing copy here.
- The startup photo's parallax sits on a `.media__layer` wrapper, not on the `<img>`, so the image and the "me" pointer (an inline SVG, pulsed by `.is-seen` from `v3.js`) move together. Both diagrams label the agent generically ("AI AGENT"); keep product names out of them.
- `scrollcraft.css` / `scrollcraft.js` — the engine, **never edited**. Bespoke behaviour goes in `v3.js` off `data-sc-*` attributes of our own naming and `--sc-p`.
- `v3.css` — tokens (six colors, two fonts: Outfit + Source Serif 4), chapter grounds (hard cuts, no drift), layout, the props. Light-canvas inversions from scroll-craft's worlds.md are applied (warm halved shadows, white edge light).
- `v3.js` — the folio (chapter title in the margin), the props (the title's periods lift off one per chapter, fall into a tray in the bottom-right corner, and are juggled by a small siteswap simulation: one gravity, parabolic flights, a scooping carry in the hand, a cascade that fills up to three balls and then a four-ball fountain, each new ball caught on a free beat; `data-sc-verify-state` on the tray for the harness). The ball colours are the three pastel clubs from the juggling footage plus the sage of the wall. The last page repeats the title's four words as a sign-off (`.sign`); when it is fully on screen each ball is thrown home into its own period there, and when the reader scrolls back up the periods empty and the balls rejoin the juggle. Back at the very top (the title fully on screen) the balls are thrown home into the title's own periods and the page resets: scrolling down drops them one per chapter again, the playable embed, the footer year.
- `print.css` — loaded with `media="print"`; hides everything except `#cv-print` (the print card).
- `assets/` — `hotmill.jpg`, `leap-iowa.jpg` (real photos), `startup-team.jpg` (real photo, the 2023 summit), `juggle.mp4` / `juggle-m.mp4` (scrub-encoded, dense GOP) + `juggle-poster.jpg`, `clubs-loop.mp4` + `clubs-poster.jpg` (4 s of the clubs clip at half speed, muted, `preload="none"`, played by `v3.js` on the last page), `rl2-phone.jpg`, `ccc-phone.jpg`, `og-card.jpg`, `qr-site.svg`, `favicon.svg`. Legacy `James1–16.jpg`, `human-v2.jpg`, `keep-it-up-theme.mp3`, `projects/`, `diagrams/` serve the v2 games and history; leave them.
- `keep-it-up.html`, `game.html`, `css/`, `js/` — the v2 games and their styles/scripts, unlinked from the page but kept reachable by URL. Do not rename their localStorage keys.
- `scrollcraft/POLISH.md` (gitignored) — the working polish checklist. `scrollcraft/lab-polish/recipes/render.sh` re-renders the two juggling videos (the balls clip has its ceiling painted out to match the wall, not cropped, because the throws pass above the ceiling line; the clubs loop is a plain crop).
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
