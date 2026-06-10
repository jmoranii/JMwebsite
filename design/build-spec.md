# Build Spec — jamesmoran v2

*Canonical implementation spec. Decisions locked at the 2026-06-09 prototype review; visual/behavioral reference implementations live in `prototypes/` (deleted before merge to main, preserved in branch history). Copy source of truth: [`copy.md`](copy.md). Brand rationale: [`brand-brief.md`](brand-brief.md).*

## Tokens

| Token | Light | Dark |
|---|---|---|
| paper | `#FAF7F2` | `#171411` |
| ink | `#1C1B1A` | `#EDE7DD` |
| Engineer ball / hero bg | `#6EB5FF` / `#3F7ABF` | — / `#2F4A63` |
| Analyst ball / hero bg | `#6BBF7A` / `#3C8A4D` | — / `#2C4F36` |
| Builder ball / hero bg | `#F4845F` / `#C94F2B` | — / `#66351F` |
| Human ball / hero bg | `#E882B4` / `#C2548C` | — / `#5C2F47` |

Balls always use the bright values (they sit on paper-colored cards); full-bleed hero backgrounds use the deepened values (≥3:1 with white text). Motion: house easing `cubic-bezier(0.4,0,0.2,1)`, 650ms majors. Type: **Outfit 800** display · Source Serif 4 body · Caveat asides. All tokens live in `:root` custom properties; JS reads them via `getComputedStyle` — one source of truth.

## File layout

```
index.html   game.html (UNTOUCHED)   css/main.css   css/print.css
js/theme.js js/carousel.js js/cascade.js js/stack.js js/reveal.js js/portrait.js js/main.js
assets/ (photos, projects/, diagrams/, qr-site.svg, favicon.svg)   design/
```

Scripts: classic `<script defer>`, one IIFE per file exposing init on `window.JM`; `main.js` last. **No ES modules** (keeps `file://` open-in-browser working). Keep the v1 `'theme'` localStorage key — game.html syncs for free.

## Sections & behaviors

1. **Hero** — facet carousel per `prototypes/proto-a.html` (the locked reference): 4 slots with role classes (`is-center/left/right/back`), toss-arc keyframe on the incoming center card, full-bleed background crossfade per facet, ghost text `JAMES MORAN` sized to fit (~12.6vw + 2vw padding — it clips above that), 6s idle auto-toss with visible pause/play control, paused on hover/focus-within/hidden, auto-advances silent for screen readers. Magnetic portrait badge top-right, click-cycles **photos 1–7 only**. Contact: email · LinkedIn · GitHub.
2. **Story** — 4 beats from copy.md, word-by-word reveal (base opacity 0.35, skip DOM split under reduced motion). One cascade ball lands per beat.
3. **Things I've Built** — sticky-stack cards per `prototypes/proto-c.html`: `position: sticky` + rAF accumulated-progress scale-down (no CSS `animation-timeline` — Safari). Flagship card inlines `assets/diagrams/bi-platform.svg` (**inline, not `<img>`** — currentColor/var() theming only works inlined). Play-tier cards use `assets/projects/*.jpg` with live links.
4. **Experience / Human / CV** — per copy.md. CV = dedicated hidden `#cv-print` block; `@media print` shows ONLY it (`body > *:not(#cv-print) { display: none }`), includes inlined `qr-site.svg`. Button = `window.print()`.
5. **Footer** — "Built with curiosity" + 🤹 → game.html.

**Ball cascade (site-wide):** per proto-c — fixed bottom-center landing zone; a ball arcs in from alternating screen edges per story beat (nested X/Y animation rig, `animationName` guard on `animationend`); **catch-up logic** (a section trigger lands all earlier balls; footer is a `data-ball="3"` backstop); index-positioned slots; landed balls run a **perpetual phase-staggered mini-juggle** (3.2s loop, 800ms offsets) — they never stop.

## Accessibility (carry from prototypes — all already implemented there)

sr-only `h1` · carousel container `role=region` + `aria-roledescription=carousel` · non-center slots `role=button` + `tabindex=0` + Enter/Space · arrow keys scoped (hero on-screen, not in form fields, preventDefault) · `aria-live=polite` announces manual navigation only · pause control with `aria-pressed` · portrait wrapped in a real `<button>` · `:focus-visible` rings with dark halo · hover styles gated `@media (hover:hover) and (pointer:fine)` · `prefers-reduced-motion`: zero animation, balls statically present, mql `change` listener · cascade tray `aria-hidden` and copy never load-bearing on it.

## Performance

transform/opacity-only animation · IO class-toggles over scroll handlers (cascade triggers) · passive rAF for stack scale · `will-change` only on the 4 balls + active card · fonts preconnect + `display=swap` · reserve the ghost-text box (CLS) · first portrait eager + `fetchpriority=high`, preload-next-on-click for the cycle · `color-mix()` always preceded by a plain fallback declaration · page-weight budget ≤ ~1.2MB initial.

## Build order (each step runnable)

skeleton+copy → tokens/base/theme → carousel → portrait → reveals → stack+cards+diagram → experience+human → cascade (spans sections — last) → print+QR → meta/favicon (fix stale `og:url` → `https://jmoranii.github.io/JMwebsite/`, `og:image` → real asset) → add `.gitignore` (.DS_Store) → README/CLAUDE.md rewrite.

## Gates

- **Privacy gate before any push** (see project plan — applies to copy, alt text, meta, SVG labels, commit messages).
- Playwright matrix: 375/768/1440 × light/dark, interactions, print PDF (1 page + QR), reduced-motion, zero console errors. Physical QR scan at final checkpoint.
- v1 preserved at tag `v1`; main untouched until James's final approval; rollback = revert the merge commit.
