# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static personal portfolio/resume website for James Moran. It's built with vanilla HTML, CSS, and JavaScript with no build process or dependencies.

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
- `app.js` - Minimal JavaScript for Intersection Observer scroll animations and dynamic copyright year

**CSS Custom Properties (styles.css:20-84):** All design tokens are centralized in `:root`. Colors use a navy/gray palette with blue accent. Typography uses Outfit (display) and Source Serif 4 (body) from Google Fonts.

**Scroll Animations (app.js:29-70):** Sections start with `opacity: 0` and gain the `.visible` class when 15% visible via Intersection Observer. Includes fallback for unsupported browsers.

## Deployment

The site is designed for GitHub Pages deployment directly from the `main` branch.
