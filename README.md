# jamesmoran — personal site (v2)

Story-first personal site + printable CV for James Moran. Vanilla HTML/CSS/JS, no frameworks, no build step. Live at **[jmoranii.github.io/JMwebsite](https://jmoranii.github.io/JMwebsite/)**.

## The idea

Four facets — **Engineer · Analyst · Builder · Human** — each a juggling ball with its own color. The hero juggles them in a toss-arc carousel; as you scroll the story, each ball arcs into a bottom-center cluster that **never stops moving**. The 🤹 in the footer has been the brand all along (it still hides the Memory Match game).

## Features

- **Facet carousel** — toss-arc transitions, full-bleed background crossfade, idle auto-toss with a pause control, full keyboard + screen-reader support (APG carousel pattern)
- **Ball cascade** — IntersectionObserver-triggered flights with catch-up logic; landed balls run a perpetual phase-staggered mini-juggle
- **Sticky-stack project cards** — earlier cards settle backward as new ones arrive (rAF, no scroll-jank)
- **Printable CV** — `@media print` shows a dedicated one-page CV block with a QR code back to this site
- **Dark mode** — system-aware + persisted (`localStorage`), shared with the game
- **Magnetic portrait** — click to cycle photos
- **Fully reduced-motion safe** — every animation disabled, all content reachable
- **Memory Match** — find the pulsing juggler 🤹

## Development

No build step — serve statically and open:

```bash
python3 -m http.server 8000
```

(Plain `file://` works too; the inlined architecture diagram falls back to an `<img>` without `fetch`.)

## Design docs

`design/brand-brief.md` (palette, type, motion principles) · `design/build-spec.md` (implementation spec) · `design/copy.md` (every public string). v1 of the site is preserved at git tag `v1`.

Designed and built collaboratively with [Claude Code](https://claude.com/claude-code).
