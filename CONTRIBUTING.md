<p align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://global.media.stux.digital/logo-light.png"><source media="(prefers-color-scheme: light)" srcset="https://global.media.stux.digital/logo-dark.png"><img src="https://global.media.stux.digital/logo-dark.png" height="80" alt="Stux.Digital Logo"></picture>
</p>

# Contributing to Stux.Digital Clients

Stux.Digital Clients is a Stux.Digital project, part of the Stux.Group Brand of Companies. The repository isn't open to public pull requests,
and per the [License](README.md#license) section it isn't licensed for redistribution or reuse.
This document exists for anyone with write access working on it consistently.

Questions: [hello@stux.digital](mailto:hello@stux.digital).

## Local setup

```
git clone https://github.com/StuxDigital/Clients.git
cd Clients
./dev-server.sh
```

No install step: there's no `package.json`, no dependencies, nothing to build. `dev-server.js` is
a single dependency-free Node script; the only requirement is having Node itself installed. Pass
`--no-dev-mode` to test the site as it behaves in production (no dev banner).

## Project conventions

- **Plain HTML/CSS/JS, no framework, no build step.** Every page is a real `.html` file: no
  templating engine, no client-side router. The layout follows
  the other Stux.Group listing sites, recoloured in Stux.Digital's two-tone sky blue. Colours are
  CSS custom properties in `assets/css/style.css`: dark (`--bg #0b1218`, `--bg-card #121d27`,
  `--accent #38bdf8`) by default, and light (`--bg #f3f8fc`, `--bg-card #fff`, `--accent #0369a1`)
  from the system preference or `<html data-theme="light">`.
- The sitemap (`sitemap.xml`, `sitemap/index.html`, `robots.txt`) is generated: after adding or removing a page, edit the `PAGES` list in `scripts/build-sitemap.py` and run `python scripts/build-sitemap.py`, then commit the result. Add new root files to the copy step in `.github/workflows/pages.yml`.
- Clean URLs use a folder-per-page layout (`legal/privacy/index.html` → `/legal/privacy/`).
- Shared styles live in `assets/css/style.css`; shared behaviour in `assets/js/main.js`. Copy the
  existing header/footer block when adding a page rather than introducing a templating system.
- `assets/js/dev-mode.js` is the production default (`DEV_MODE = false`), committed as-is.
  `dev-server.js` intercepts that one path locally and serves a generated version instead.
- **Client icons** go in `assets/img/clients/` (resized to 128 × 128), or use the client's own
  hosted icon when their site has one.
- **The Stux.Digital twist** lives at the end of `style.css`: the browser-window frame
  (`.browser`, used by the hero stats and the 404 page), the dashed idea-to-online path
  (`.journey`), the empty first-client card (`.client-empty`), and the `.only-dark` /
  `.only-light` image swap (bright logo/icon variants on dark, the deep ones on light).
- **Only a few things load from elsewhere**, all Stux.Digital's own: live status from
  `raw.githubusercontent.com/StuxDigital/Status`, and the logo and icons from
  `global.media.stux.digital`. SeasonalOverlaysLibrary loads from
  `https://seasonaloverlayslibrary.stuxapis.net` (StuxAPIs), and the hero credits it. If you add another external
  load, update the Privacy Policy.

## Adding or retiring a client card

The list has two sections, in this order: **Featured** and **Client sites**; add a **Discontinued**
section after them when a client site is retired. Until the first client site is live, the
"Your site could be first" card (`.client-empty`) holds the slot: remove it when the first real
card goes in. The Clientpage template card sits under Client sites with `data-state="template"`.

1. Add/update the entry in the README's clients table
2. Add/update the matching `<article class="project-card">` block in `index.html`. For a client
   that belongs to another brand, add `<div class="owner">Brand</div>` above the name
3. **One badge per card**, above the description (`<span class="badge-status ...">` before
   `<p class="desc">`). Declare the state on the `<article>` with `data-state="discontinued"`,
   `"template"`, `"maintenance"` or `"soon"` and render the matching badge in the HTML (e.g.
   `<span class="badge-status soon"><i class="badge-ico" aria-hidden="true"></i>Coming soon</span>`;
   Maintenance uses the `maintenance` class and the same icon element). If several states are
   listed, the first that applies wins: Discontinued, Template, Maintenance, Coming soon
4. **Live status:** with no `data-state`, a card with `data-monitor="<slug>"` (`stux-digital:<slug>`, a slug monitored by
   `StuxDigital/Status`; the bare form defaults to the `stux-digital` source) gets one live badge from `main.js`: Online, Degraded or Offline. Add
   `<span class="badge-status live" hidden></span>` above the description; don't hard-code a
   "Live" badge, because it can't be kept accurate. No monitor, or status unavailable: no badge
5. When a client site is discontinued, move its card into "Discontinued", add the `discontinued`
   class and `data-state="discontinued"`, drop any dead Website link, and add a one-line `<p class="discontinued-note">` saying why
6. Update the hero's client count (in the browser window) if it changed

## Seasonal overlays

`main.js` asks SeasonalOverlaysLibrary for today's preset from its calendar. It plays once per
browser session (a `sessionStorage` flag), never on its own for people with
`prefers-reduced-motion`, and the hero button (labelled with today's preset) replays it. If the
library can't load, the button stays hidden and nothing else changes.

## Legal pages

All six live under `legal/` (`privacy`, `terms`, `cookies`, `imprint`, `disclaimer`, `opt-out`),
each its own folder with an `index.html`, linked from the **Boring Legal Stuff** hub at
`legal/index.html`. Keep them in sync with what the site actually does.

## Versioning and changelog

- The version lives in `VERSION.md` (a bare version string); bump it on every release
- Every release gets a `CHANGELOG.md` entry using `###` subsections in this order: Added,
  Changed, Fixed, Removed, Security, Deprecated. Never a bare bullet list under a version
- `commit.sh` (bash) and `commit.bat` (Windows) read `VERSION.md` and handle the commit and
  `git tag`; the release workflow publishes a GitHub Release when the tag is pushed

## Before committing

- Open changed pages via `./dev-server.sh` and click through: CI checks files and local links,
  but a live look is the only real check of how it renders
- Check both the dev-mode banner (default) and `--no-dev-mode` if you touched `dev-server.js` or
  `assets/js/dev-mode.js`
- Only link a repository if it is public: no "Repository" link on a card for a private or missing repo. Run `scripts/check-repo-links.sh` (needs `gh`) to list linked repos that are not public
