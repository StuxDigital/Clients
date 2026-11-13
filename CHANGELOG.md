# Changelog

All notable changes to Stux.Digital Clients are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Date Versioning](https://datevers.ing) since v26.10.23 (`YY.MM.DD`, the UTC release date, with `-1`, `-2`… for later releases the same day); earlier releases used [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v26.11.13-1

### Fixed

- The registered office address now ends "England, United Kingdom": 124 City Road, London, EC1V 2NX, England, United Kingdom

## v26.11.13

### Changed

- Stux Group Ltd's registered office is now 124 City Road, London, EC1V 2NX, England (was 82a James Carter Road, Mildenhall, England, IP28 7DE), in the Imprint and `README.md`. The company number and "registered in England and Wales" are unchanged

## v26.11.08

### Changed

- Status checks are described as "checked regularly" instead of "every 5 minutes" everywhere on the site: the Status card, the status band and its live text, the Discord embed, and the Stux.Group case study. GitHub runs the status schedule best-effort, often much less often, and status.stux.digital now shows the real check rhythm
- The hero's third stat is "90 days of uptime history" instead of "5 min between status checks"

## v26.11.07-2

### Changed

- GitHub Releases are published only once a release's tag is on `main`. The release workflow now also runs on pushes to `main` and skips any tag that isn't on `main` yet, so pushing the tag from `test` no longer publishes a Release before the pull request is merged. The merge publishes it instead. It can also be run by hand, and it never publishes the same version twice. `README.md` describes the new behaviour

## v26.11.07-1

### Changed

- The hero's live status eyebrow shows only the status once it loads ("All operational", "Degraded", "Partial outage" or "Major outage"), without the "Stux.Digital ·" prefix. The link's accessible name still says it's Stux.Digital's status. If the status can't be loaded, it stays the plain "Stux.Digital" eyebrow

## v26.11.07

### Changed

- **The eyebrow above the hero headline is a live status badge.** It keeps its size and shape, links to status.stux.digital, and shows the overall status after the name ("Stux.Digital · All operational"), in the status badge colours with the pulsing dot. If the status can't be loaded it stays a plain eyebrow. `CONTRIBUTING.md` documents it

## v26.11.06-3

### Changed

- `commit.sh` and `commit.bat` end by telling you to push `test` (with the new tag) and open a pull request from `test` into `main`, instead of pushing `main`

## v26.11.06-2

### Changed

- Work happens on a `test` branch: changes reach `main` only through a pull request from `test`, and release commits and tags are made on `test`. `README.md` and `CONTRIBUTING.md` (a new Branches section) say so
- CI runs on pushes to `test` as well as `main`

## v26.11.06-1

### Changed

- `README.md` describes the light/dark toggle (it follows the system until you pick a theme, then remembers it), the changelogs page and the per-client "from idea to online" pages
- `CONTRIBUTING.md` no longer says the "Your site could be first" card holds the slot (Stux.Group is live and the card is gone; its `.client-empty` styles stay), and no longer says client icons are resized to 128 × 128: they're square PNGs of at least that size, or badge icons from `scripts/badge-icons.py`

## v26.11.06

### Added

- `scripts/badge-icons.py` (copied from StuxGroup/Services, originally TheRidgwells/Projects, in Stux.Digital's colours) builds badge-style icons for cards without a logo of their own: the Stux.Digital mark on a round avatar, with a badge in the corner saying what it is

### Changed

- **Every card uses its full name, with its own icon.** "Status" is now Stux.Digital Status, with a heartbeat badge on the Stux.Digital mark; "Clientpage" is now Stux.Digital Clientpage, with a browser-window badge instead of the plain Stux.Digital icon. The icons' alt text uses the same full names, and `README.md` and `CONTRIBUTING.md` match

### Removed

- `assets/img/clients/status.svg`, replaced by the Stux.Digital Status badge icon

## v26.10.23

### Added

- A custom Discord link preview (a component embed) on every page except the 404 page and the old `/changelog/` redirect, with a hand-written preview for the home page; the pages are written by `scripts/build-head.py`, and `tests/head.py` checks them
- A full favicon set: `favicon.ico`, `apple-touch-icon.png` and a web app manifest (`site.webmanifest`) with 192, 512 and maskable icons, with the same tags in every page's head
- `tests/changelogs.test.js`, which checks that the changelog page reads `## vYY.MM.DD` headings, sorts sections Added to Deprecated and keeps their colours
- `tests/version.sh`, which checks that `VERSION.md` is a valid Date Version, a real calendar date not in the future, and the same as the newest entry in this changelog

### Changed

- Switched from Semantic Versioning to [Date Versioning](https://datevers.ing): releases are numbered by their UTC release date as `YY.MM.DD`, with `-1`, `-2`… for later releases the same day. This release follows v1.2.0
- `commit.sh` and `commit.bat` refuse a `VERSION.md` that isn't a valid Date Version or is dated in the future (UTC), and warn when it's dated before today
- `scripts/build-sitemap.py` writes the sitemap page's own head block
- The CI version check, the release workflow's tag check and the Pages build follow the new version form, favicon files and manifest
- `README.md` and `CONTRIBUTING.md` describe Date Versioning and the release steps

## [1.2.0] - 2026-10-10

### Added

- A light/dark toggle at the end of the header on every page, like the brand pages': it shows the theme it switches to (a sun on dark, a moon on light). Until it's used the site follows the system theme; after that the choice is remembered in this browser

## [1.1.4] - 2026-10-09

### Changed

- The favicon follows the browser's light or dark theme: the deep icon (`icon-dark.png`) on light and the bright one (`icon-light.png`) on dark, straight from the brand's media host instead of a local copy, so a brand colour change is just a new file there
- The logos and icons in the Markdown docs (README and the like) follow GitHub's light or dark theme, using each brand's `logo-light`/`logo-dark` and `icon-light`/`icon-dark` files

### Fixed

- The changelog page's section badges switch to their deeper light-theme colours when the light theme comes from the system preference, not only when it's set explicitly

## [1.1.3] - 2026-10-09

### Changed

- The favicon follows the browser's light or dark theme: the deep icon (`icon-dark.png`) on light and the bright one (`icon-light.png`) on dark, straight from the brand's media host instead of a local copy, so a brand colour change is just a new file there
- The logos and icons in the Markdown docs (README and the like) follow GitHub's light or dark theme, using each brand's `logo-light`/`logo-dark` and `icon-light`/`icon-dark` files

### Fixed

- The changelog page's section badges switch to their deeper light-theme colours when the light theme comes from the system preference, not only when it's set explicitly

## [1.1.2] - 2026-10-09

### Changed

- Stux.Digital comes first in Featured, ahead of Status (in the README's table too)
- The "From idea to online" Host step says a little more ("It goes live on dependable, greener hosting, kept fast and secure."), so it runs to three lines like Design and Build

## [1.1.1] - 2026-10-09

### Fixed

- The Stux.Group page (`/stuxgroup/`) gave a 404: the Pages workflow copies the site's folders by name and didn't include it. It's published now
- The 404 page's message sat to the left of the centre line on wider screens; it's centred under the heading again

## [1.1.0] - 2026-10-09

### Added

- Stux.Group is the first client site listed, in place of the "Your site could be first" slot, with a live status badge from status.stux.group (a second status source alongside status.stux.digital) and links to the site, its status and its own page
- A page for Stux.Group at `/stuxgroup/`, "Stux.Group, from idea to online": the site in a browser window, its five steps on the winding path (Idea, Design by Stux.Design, Build by Stux.Dev, Host by Stuxedo, Online), and what happened at each step. It's in the sitemap

### Changed

- The hero counts 1 client site live so far
- The Privacy Policy says live status is also read from status.stux.group's data on GitHub

## [1.0.2] - 2026-10-09

### Changed

- The "From idea to online" steps sit on one winding dotted path, like the path in the logo, from the Idea lightbulb through every step to Online, instead of a straight dashed line. On narrow screens it waves down the column of steps

## [1.0.1] - 2026-10-09

### Fixed

- The footer's copyright line names Stux.Digital instead of Stux.Group ("© 2026 Stux.Digital. All rights reserved."), matching the brand the site belongs to. The legal pages' statement that the names and logos belong to Stux.Group is unchanged

## [1.0.0] - 2026-10-08

### Added

- Stux.Digital Clients (`clients.stux.digital`): the static directory of the sites Stux.Digital has taken from idea to online, built on the Stux.Group listing-site pattern in Stux.Digital's two-tone sky blue (`#38bdf8` on dark, `#0369a1` on light, straight from the logo)
- The Stux.Digital twist: the hero's stats in a browser window like the one in the logo, an "idea to online" path joining the five steps every client site takes (Idea, Design by Stux.Design, Build by Stux.Dev, Host by Stuxedo, Online), and a 404 page that "took a wrong turn" inside the same browser frame
- Featured cards for Stux.Digital Status and Stux.Digital itself with live badges from `status.stux.digital`, a "Your site could be first" card holding the first client slot, and the Clientpage template card
- Theme-swapped logo and icons: the bright variants on the dark theme, the deep ones on light
- Boring Legal Stuff hub with Privacy Policy, Terms and Ethics, Cookies Policy, Imprint, Disclaimer and Opt-Out Preferences, a `/changelogs/` page rendering this file (sections always in Added, Changed, Fixed, Removed, Security, Deprecated order), a sitemap page, `sitemap.xml`, `robots.txt` and a 404 page
- `dev-server.sh` / `dev-server.bat` (DEV_MODE on by default, `--no-dev-mode` to see production), CI site checks, GitHub Pages deploy and release workflows, and `commit.sh` / `commit.bat` for tagged releases
