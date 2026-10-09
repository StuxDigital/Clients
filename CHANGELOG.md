# Changelog

All notable changes to Stux.Digital Clients are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
