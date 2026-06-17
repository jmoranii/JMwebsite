# jamesmoran — personal site (v2)

Story-first personal site + printable CV for James Moran. Vanilla HTML/CSS/JS, no frameworks, no build step. Live at **[jmoranii.github.io/JMwebsite](https://jmoranii.github.io/JMwebsite/)**.

## The idea

Four facets — **Engineer · Analyst · Builder · Human** — each a juggling ball with its own color. The hero juggles them in a toss-arc carousel; as you scroll the story, each ball arcs into a bottom-center cluster that **never stops moving**. The 🤹 in the footer has been the brand all along (it still hides the Memory Match game).

## Features

- **Facet carousel** — four polaroid cards (one photo per facet), toss-arc transitions, full-bleed background crossfade, idle auto-toss with a pause control, touch-swipe on mobile, full keyboard + screen-reader support (APG carousel pattern)
- **Ball cascade** — a ball arcs in as each story beat reaches mid-screen (with catch-up logic for jump-scrolls); landed balls juggle real patterns that never stop: 1 bounces, 2 run a 31 shower, 3 cascade, 4 run a **5551 siteswap**
- **Deck-stacked project cards** — all cards pin in one container and bury their predecessors, leaving color-coded top edges peeking (rAF, no scroll-jank)
- **Printable CV** — `@media print` shows a dedicated one-page CV block with a QR code back to this site
- **Dark mode** — system-aware + persisted (`localStorage`), shared with the games
- **Magnetic portrait** — click-cycles a curated photo set (the one real photo first, the stylized poster last)
- **Fully reduced-motion safe** — every animation disabled, all content reachable
- **Keep It Up** — find the pulsing juggling photo in the footer for the juggling game, scored to its own theme song ("Four In The Air", made with Suno, lazy-loaded + mutable); the original Memory Match lives on behind it
- **404** — the zero is an empty seat; the dropped ball rolls to a stop

## Development

No build step — serve statically and open:

```bash
python3 -m http.server 8000
```

(Plain `file://` works too; the inlined architecture diagram falls back to an `<img>` without `fetch`.)

## Design docs

`design/brand-brief.md` (palette, type, motion principles) · `design/build-spec.md` (implementation spec) · `design/copy.md` (every public string). v1 of the site is preserved at git tag `v1`.

Designed and built collaboratively with [Claude Code](https://claude.com/claude-code).
