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

**Single-page structure:**
- `index.html` - All content and semantic structure
- `styles.css` - CSS with custom properties in `:root` for theming (colors, fonts, spacing)
- `app.js` - JavaScript for theme toggling, scroll animations, and image cycling

**CSS Custom Properties (styles.css):** All design tokens are centralized in `:root`, with dark mode overrides in `[data-theme="dark"]`. Typography uses Outfit (display), Source Serif 4 (body), and Caveat (handwritten hint).

## Key Features

**Dark Mode (styles.css + app.js):** Toggle button fixed in top-right corner. Theme preference saved to localStorage, falls back to system `prefers-color-scheme`, then defaults to light.

**Hero Image Cycling (app.js):** Clicking the profile photo cycles through `assets/James1.jpg` to `James18.jpg`. Uses `touch-action: manipulation` CSS to fix Android Chrome tap issues.

**"Click me" Hint:** Handwritten-style text with arrow pointing at the photo. Positioned left of image on desktop, below on mobile. Uses Caveat font and subtle wiggle animation.

## Deployment

The site is designed for GitHub Pages deployment directly from the `main` branch.
