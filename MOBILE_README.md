# DEVOTION — Mobile / Tablet Edition

This branch is a complete independent copy of DEVOTION, including all original story pages and soundtrack assets. The desktop edition remains on the `main` branch.

## Updated pages
- `index.html`: intro
- `purge.html`: hidden-text puzzle and report
- `stage2.html`: next puzzle
- `admin.html`: administrator log and choice
- `end_A.html` / `end_B.html` / `end_C.html` / `end_D.html`: all endings

## Touch/audio enhancements
- `mobile.css`: responsive viewport, touch-sized targets, safe-area layout, narrow screens, readable inputs, scrollable stage content.
- `mobile-compat.js`: long-press hidden-text reveal and a music-enable prompt if a browser blocks scripted audio playback.
- Original story content, music files and ending destinations are retained.

## Publishing the mobile edition
This branch is **not** automatically live at the original GitHub Pages URL. For a separate mobile website, deploy this `mobile` branch as the root of a new static-hosting site (e.g. a separate GitHub Pages repository, Cloudflare Pages project or Netlify site). Do **not** switch the existing GitHub Pages source away from `main`, since that would replace the desktop site.

If deploying to a new repository, copy the entire branch including media assets and preserve all relative paths and filename capitalization.

## Test checklist
- iOS Safari and Android Chrome: intro audio starts when user taps, or a recoverable audio permission prompt appears.
- Report: press and hold suspicious blank text for ~0.55 s. Hidden text becomes visible.
- Puzzle input and continuation buttons are reachable without horizontal scrolling.
- Verify audio in intro, report, puzzle, admin log and every ending.
- Verify transitions back to the log and archival credits.
- iOS browsers may ignore element.volume changes, so audio fades can sound different from desktop.
- The embedded Google spreadsheet may have its own touch/viewport limitations.

## Known limitations
This source edition has not been physically tested on all devices. Audio playback policies vary with browser, iOS version and media encoding. Background music may require a fresh tap on each navigated page, since each HTML page is a new document.
