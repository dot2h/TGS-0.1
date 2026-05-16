# The Great Site

Personal library site for music, photo, and technology resources.

## Stack

No build step. Vanilla HTML + React 18 (CDN) + Babel standalone for JSX. Open `index.html` directly in a browser.

## Files

- `index.html` — entry point, loads all scripts
- `styles.css` — all styles, CSS custom properties for theming
- `data.js` — content data exposed as `window.GS_DATA`
- `app.jsx` — all React components (Landing, Nav, MusicPage, TechPage, ContactPage, SearchPage)

## Design system

- **Fonts**: Helvetica Neue (display/headings) + Geist (body/UI) + Geist Mono (codes/labels) — loaded from Google Fonts
- **Palette**: `#0a0a0a` bg, `#fafaf7` fg, `#6a6a6a` muted, `#ff00e4` accent (hover)
- **Day/night**: toggled via `data-theme="day"` on the screen div; CSS vars override in `[data-theme="day"]`

## Screens & routing

Client-side routing via `useState('landing')`. Routes: `landing → nav → music | tech | contact | search`. `Esc` goes back one level.

## Signature interaction

Clicking a nav item triggers a FLIP typographic transition: the label word flies from its nav position to the content page header (~620ms, cubic-bezier). The `fly` div is appended directly to `body` during animation.

## To replace

- **Video**: swap `#landing .video-fallback` div for `<video autoplay muted loop playsinline>` pointing to your file
- **Content**: edit `data.js` to add/remove music entries, tech documents, or photo tiles
