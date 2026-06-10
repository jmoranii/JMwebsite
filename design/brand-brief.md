# Brand Brief — jamesmoran v2

*The canonical design document for James Moran's personal site v2. Public file — content here ships in a public repo.*

## Positioning

**An engineer's rigor applied to delightful things.**
James Moran: engineer → analyst → builder. Four balls in the air, none dropped — a person who commits to practices for years and ships things that work.

Tagline — **locked at prototype review (2026-06-09):**

> **Engineer. Analyst. Builder. Human.**

*(Runner-up, may be reused as page copy elsewhere: "Analytics leader. AI builder. Actual juggler.")*

## Audience & voice

Recruiters and employers (data / analytics / AI-forward roles), collaborators, and James himself. Voice: plainspoken, warm, quietly confident. **Specific numbers over adjectives.** Playful in the margins; never goofy in the headline layer.

## The juggling system

The core brand device. Four facets of James, each a juggling ball with its own color:

| Ball | Facet | Carries |
|---|---|---|
| 1 | **Engineer** | ~8 years of materials engineering; quantified manufacturing wins |
| 2 | **Analyst** | pharma media measurement; data platforms; one source of truth |
| 3 | **Builder** | AI-era systems and games people actually use |
| 4 | **Human** | juggling, BJJ, 168 books, languages, mentoring |

Brand behaviors:

- **Hero facet carousel** — the four cards cycle through the front with toss-arc transitions; the page background goes full-bleed in the active facet's color.
- **The toss** — major transitions follow a parabolic juggling arc, never a flat slide.
- **The ball cascade** — as the visitor scrolls, a new ball arcs in from a screen edge at each section (alternating sides, crossing the full screen) and lands in a bottom-center cluster — **which never stops moving**: landed balls keep a gentle phase-staggered mini-juggle going for the life of the page ("I don't drop balls"). By the footer all four are in the pattern, sitting next to the 🤹.
- The 🤹 footer easter egg (Memory Match game) carries over from v1 — the juggler has been the brand all along.

## Palette — "Daylight Studio"

Warm paper base, near-black ink, four saturated ball colors. The hero is the one full-bleed color moment; everything after returns to calm paper. Dark mode: deep warm charcoal, brightened balls.

**Locked at prototype review (2026-06-09): Set A — warm.**

| Facet | Ball (bright — cards, cascade) | Hero bg light (deepened, ≥3:1 vs white) | Hero bg dark |
|---|---|---|---|
| Engineer | `#6EB5FF` | `#3F7ABF` | `#2F4A63` |
| Analyst | `#6BBF7A` | `#3C8A4D` | `#2C4F36` |
| Builder | `#F4845F` | `#C94F2B` | `#66351F` |
| Human | `#E882B4` | `#C2548C` | `#5C2F47` |

Base tokens: paper `#FAF7F2` · ink `#1C1B1A` · dark base `#171411` · dark text `#EDE7DD`

*(Rejected: Set B teal/silver — preserved in `prototypes/proto-b.html` for reference.)*

## Type

- **Display** (ghost text, section headings): **Outfit 800 — locked at prototype review (2026-06-09)**. Ghost text must be sized to fit the viewport with side padding (it clipped at 14.5vw; ~12.6vw + 2vw padding fits).
- **Body:** Source Serif 4 (carried from v1 — a serif body is distinctive for a tech-adjacent site).
- **Handwritten asides:** Caveat (carried from v1 — "Click me" is already brand).

## Portrait

Floating **magnetic badge, top-right of the hero** — locked at prototype review. Mouse-follow magnet within ~140px; click cycles **photos 1–7 only** (photos 8–16 contain text too small to read at badge size). Caveat aside underneath.

## Motion principles

1. House easing `cubic-bezier(0.4, 0, 0.2, 1)`, ~650ms for major transitions.
2. **Arcs over slides** — motion quotes juggling: parabolas, orbits, controlled flight.
3. **One wow per viewport, max.** Tasteful with moments of delight.
4. `prefers-reduced-motion` fully respected — the site works completely with zero motion.
5. Print sees none of it — the print stylesheet emits a clean one-page CV with a QR code back to the site.

## Tech stance

Vanilla HTML/CSS/JS, no build step, GitHub Pages. The effects above are all achievable with modern CSS + small JS; a framework would be developer convenience, not user-visible capability — and "no framework needed" is itself on-brand.
