# jamesmoran — personal site (v3)

Story-first personal site + printable CV for James Moran. Vanilla HTML/CSS/JS on the untouched [scroll-craft](https://github.com/nateherkai/scroll-craft) engine, no build step. Live at **[jmoranii.github.io/JMwebsite](https://jmoranii.github.io/JMwebsite/)**.

## The idea

A printed feature about one person, read by scrolling. Six chapters on their own paper grounds: a title page, the arc (metal, the leap, the startup), the AI era, the proof, beyond work, and a last page.

The title reads **Engineer. Analyst. Builder. Human.** and the four periods are the four juggling balls. As each chapter opens, its ball lifts out of the sentence and arcs to the bottom of the screen, where the landed balls juggle real siteswaps (1 bounces, 2 run a 31 shower, 3 cascade, 4 run 5551) and never stop. At the colophon the pattern holds beside the one line that matters.

## Chapters and devices

- **Title page**: type on paper, no media above the fold, one line of running text as the call to action.
- **The arc**: three tinted chapters, wipes at each boundary, real figures counting in, a captioned photo column (real photos from the plant and from Iowa).
- **The AI era**: the frame holds while the analytics-workspace diagram draws itself stroke by stroke under the wheel (`pathLength="1"` per stroke, offset driven from the engine's `--sc-p`).
- **Proof** (the peak): an iris opens on Rolfe Legends 2, playable in the page on request, then the book club game and the second brain, drawn in the same three-plane language as the workspace.
- **Beyond work**: the one scrubbed clip, real juggling footage, in a captioned column.
- **Contact me** (the last page): small type, the email line, the print-CV line, a slow-motion clubs loop, the balls settle and hold.

## Development

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Serve it; `file://` blocks the Blob fetch the engine uses for the scrub clip.

`v1` and `v2` are preserved at their git tags. The v2 games (`keep-it-up.html`, `game.html`) remain in the repo, unlinked.

Designed and built collaboratively with [Claude Code](https://claude.com/claude-code), following the scroll-craft procedure: brief, journey, grammar, feeling curve, one signature move, verified by scrolling.
