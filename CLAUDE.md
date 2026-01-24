# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static personal portfolio/resume website for James Moran. It's built with vanilla HTML, CSS, and JavaScript with no build process or dependencies. Also serves as a playground for exploring AI coding tools.

## Development

To view the site locally, simply open `index.html` in a browser. For live reload during development:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (after npm install -g live-server)
live-server
```

## Architecture

**No build process** - This is intentionally a zero-dependency static site. All code runs directly in the browser.

**File structure:**
- `index.html` - Main resume page with all content
- `styles.css` - CSS with custom properties in `:root` for theming
- `app.js` - JavaScript for theme toggling, scroll animations, image cycling, and mobile highlights
- `game.html` - Hidden Memory Match game (Easter egg)
- `assets/` - Images (James1.jpg through James16.jpg, resized to 400px for performance)

**CSS Custom Properties (styles.css):** All design tokens are centralized in `:root`, with dark mode overrides in `[data-theme="dark"]`. Typography uses Outfit (display), Source Serif 4 (body), and Caveat (handwritten hint).

## Key Features

**Dark Mode (styles.css + app.js):** Toggle button fixed in top-right corner. Theme preference saved to localStorage, falls back to system `prefers-color-scheme`, then defaults to light.

**Hero Image Cycling (app.js):** Clicking the profile photo cycles through 18 positions using James1-16.jpg (James16 repeats for positions 16-18). Uses `touch-action: manipulation` CSS to fix Android Chrome tap issues.

**"Click me" Hint:** Handwritten-style text (Caveat font) with arrow pointing at the photo. Positioned left of image on desktop, below on mobile. Subtle wiggle animation.

**Memory Match Game (game.html):** Hidden game using James1-8.jpg. Access via the pulsing juggler emoji (🤹) at the bottom of the main page. Includes dark mode support synced with main site.

**Mobile Experience Highlights (app.js):** On mobile (≤768px), experience timeline items highlight as they scroll into view using Intersection Observer. Slow fade transitions (3s) for smooth effect.

## Deployment

The site is designed for GitHub Pages deployment directly from the `main` branch.

## Git Notes

Large image pushes may timeout. If you get HTTP 408 errors, increase the buffer:
```bash
git config http.postBuffer 524288000
```
