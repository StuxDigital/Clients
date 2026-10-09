<p align="center">
  <img src="https://global.media.stux.digital/logo.png" height="100" alt="Stux.Digital Logo">
</p>

# Stux.Digital Clients

### *From idea to online, site by site.*

[Stux.Digital Clients](https://clients.stux.digital) is a small, static, no-build-step website that
lists every site Stux.Digital has taken from a first idea to a finished home online, and links out
to each one. It's built the same way as the other Stux.Group listing sites, in Stux.Digital's
two-tone sky blue, with its own twist: the hero's stats sit in a browser window like the one in the
logo, and an "idea to online" path walks through the five steps every client site takes (Idea,
Design by Stux.Design, Build by Stux.Dev, Host by Stuxedo, Online).

- Plain HTML, CSS and JavaScript: no framework, no bundler, no dependencies to install
- Dark and light themes, following your system preference
- **Live status** on each card, read from [status.stux.digital](https://status.stux.digital)
  (`StuxDigital/Status`, powered by [GitHup](https://githup.stux.group))
- **Seasonal overlays** from [SeasonalOverlaysLibrary](https://seasonaloverlayslibrary.stuxapis.net)
  (StuxAPIs): today's preset plays once per visit (never with reduced motion), and the hero button replays it
- Deployed to [GitHub Pages](https://pages.github.com/) by `.github/workflows/pages.yml`
- No accounts, no ads, no cookies, no tracking scripts

---

## Listed here

| Entry | What it is | Site | Repo |
|---|---|---|---|
| Stux.Digital Status | Live status and uptime history of Stux.Digital and its client sites | [status.stux.digital](https://status.stux.digital) | [StuxDigital/Status](https://github.com/StuxDigital/Status) |
| Stux.Digital | The studio itself, and the front door for a new site | [stux.digital](https://stux.digital) | private |
| Stux.Group | The parent company's website, and the first client site ([from idea to online](https://clients.stux.digital/stuxgroup/)) | [stux.group](https://stux.group) | private |
| Clientpage | The placeholder a client's address shows while their site is on its way (Template) | [clientpage.stux.digital](https://clientpage.stux.digital) | [StuxDigital/clientpage](https://github.com/StuxDigital/clientpage) |

This table (and the matching cards on the site) is the source of
truth for what's listed: update both together when a client site is added, retired or renamed.
Each card shows one badge above its description: Discontinued, Template, Maintenance or Coming
soon (from `data-state`, in that order of precedence), otherwise a live Online / Degraded / Offline
badge when it has a `data-monitor` (`stux-digital:<slug>`) matching a monitor slug in
`StuxDigital/Status`'s `.githup.yml`.

## Local development

```
./dev-server.sh          # http://127.0.0.1:8080, DEV_MODE forced on
./dev-server.sh 3000 --no-dev-mode
```

On Windows, use `dev-server.bat` instead. No `npm install` needed: the dev server is a single
dependency-free Node script (`dev-server.js`); Node just needs to be installed. See
[CONTRIBUTING.md](CONTRIBUTING.md) for more.

## Releasing

1. Update `CHANGELOG.md`
2. Bump `VERSION.md`
3. Update this README if relevant
4. Run `./commit.sh` (or `commit.bat`): it reads `VERSION.md`, commits, and tags `vX.Y.Z`
5. `git push origin main --tags`; the release workflow then publishes a GitHub Release from the
   matching `CHANGELOG.md` section

## License

&copy; 2026 Stux.Group. All rights reserved. This repository is not licensed for reuse or
redistribution. Lato and Poppins (`assets/fonts/`) are under the SIL Open Font License.

---

Made by [Stux.Digital](https://github.com/StuxDigital)

*Stux.Digital is part of the [Stux.Group](https://github.com/StuxGroup) Brand of Companies.*

Stux.Digital is operated by Stux Group Ltd, a company registered in England and Wales (company no. 13160574), registered office 82a James Carter Road, Mildenhall, England, IP28 7DE.
