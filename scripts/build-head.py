#!/usr/bin/env python3
"""Write the shared <head> block into every page of this static site.

Run from anywhere: python scripts/build-head.py   (add --check to only report stale pages)
The block sits between the BEGIN/END markers and holds:
  * the favicon set (favicon.ico, the 512px PNG, apple-touch-icon.png, site.webmanifest), the same
    four tags on every page, then the brand's theme-aware icons from its media host
  * Discord's custom link preview, a <script id="discord:component-embed"> (omitted on 404 and on
    redirect stubs, and left out as an HTML comment if it would be over 3,000 bytes). The Open Graph
    tags, where a page has them, stay as its fallback.
Each page's title and description come from its own <title> and meta description; the home page has
a hand-written preview (HOME below). Re-run this whenever a page's title or description changes.

Copyright (c) 2026 Stux.Group. All Rights Reserved.
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://" + (ROOT / "CNAME").read_text(encoding="utf-8").strip()
SITE_NAME = "Stux.Digital Clients"
ACCENT = "#38bdf8"
ICON_URL = BASE_URL + "/assets/img/icon-512.png"
MAX_BYTES = 3000
BEGIN, END = "<!-- build-head:begin (scripts/build-head.py) -->", "<!-- build-head:end -->"

NO_EMBED = {"404.html", "changelog/index.html"}  # error page; redirect stub

HOME = {
    "title": SITE_NAME,
    "lead": "**From idea to online, site by site.**",
    "desc": "Every site Stux.Digital has taken from a first idea to a finished home online, with live status where we check it.",
    "facts": "Idea · Design · Build · Host · Online. Status checked every 5 minutes.",
    "buttons": {"Browse clients": BASE_URL + "/#clients", "How it works": BASE_URL + "/#journey", "Status": "https://status.stux.digital"},
}

FAVICONS = (
    '<link rel="icon" href="/favicon.ico" sizes="48x48">\n'
    '<link rel="icon" type="image/png" sizes="512x512" href="/assets/img/icon-512.png">\n'
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
    '<link rel="manifest" href="/site.webmanifest">\n'
    '<link rel="icon" type="image/png" href="https://global.media.stux.digital/icon-dark.png" media="(prefers-color-scheme: light)">\n'
    '<link rel="icon" type="image/png" href="https://global.media.stux.digital/icon-light.png" media="(prefers-color-scheme: dark)">\n'
)


def discord_md(s):
    """Escapes Discord markdown so data (names, descriptions) shows as plain text."""
    # Inline formatting, link brackets and backslashes anywhere; headings, quotes and lists only at a line start.
    s = re.sub(r"([\\*_~`|\[\]])", r"\\\1", s)
    return re.sub(r"^([#>-])", r"\\\1", s, flags=re.M)


def text(md):
    return {"type": 10, "content": md}


def buttons(links):
    return {"type": 1, "components": [
        {"type": 2, "style": 5, "label": label[:80], "url": url} for label, url in links.items()]}


def section(md):
    return {"type": 9, "components": [text(md)], "accessory": {"type": 11, "media": {"url": ICON_URL}}}


def payload(components, accent=ACCENT):
    data = {"component": {"type": 17, "accent_color": int(accent.lstrip("#"), 16), "components": components}}
    js = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    js = js.replace("</", "<\\/")  # can't close the <script> early
    return None if len(js.encode("utf-8")) > MAX_BYTES else js


def embed(components, accent=ACCENT):
    js = payload(components, accent)
    if js is None:
        return "<!-- discord:component-embed left out: over %d bytes -->" % MAX_BYTES
    return '<script id="discord:component-embed" type="application/json">' + js + "</script>"


def label():
    return "-# [%s](%s/)\n" % (SITE_NAME, BASE_URL)


def home_embed():
    h = HOME
    return embed([
        section("# [%s](%s/)\n%s\n%s\n-# %s" % (discord_md(h["title"]), BASE_URL, h["lead"], discord_md(h["desc"]), discord_md(h["facts"]))),
        buttons(h["buttons"]),
    ])


def page_embed(title, desc, url):
    return embed([
        section(label() + "## [%s](%s)\n%s" % (discord_md(title), url, discord_md(desc))),
        buttons({"Open": url, "All clients": BASE_URL + "/"}),
    ])


def url_for(rel):
    if rel == "index.html":
        return BASE_URL + "/"
    return BASE_URL + "/" + rel[: -len("index.html")]


def meta(src, rel):
    t = re.search(r"<title>(.*?)</title>", src, re.S)
    d = re.search(r'<meta name="description" content="([^"]*)"', src)
    title = html.unescape(t.group(1)).strip() if t else SITE_NAME
    title = re.sub(r"\s+[\u2014|-]\s+" + re.escape(SITE_NAME) + r"$", "", title)
    return title, html.unescape(d.group(1)) if d else ""


def block(src, rel):
    out = [BEGIN, FAVICONS.rstrip("\n")]
    if rel not in NO_EMBED:
        if rel == "index.html":
            out.append(home_embed())
        else:
            title, desc = meta(src, rel)
            out.append(page_embed(title, desc, url_for(rel)))
    out.append(END)
    return "\n".join(out) + "\n"


ICON_RE = re.compile(r'[ \t]*<link rel="icon"[^>]*>\n')


def rebuild(src, rel):
    if BEGIN in src:
        return re.sub(re.escape(BEGIN) + r".*?" + re.escape(END) + r"\n", lambda m: block(src, rel), src, count=1, flags=re.S)
    icons = list(ICON_RE.finditer(src))
    if icons:
        pos = icons[0].start()
        src = ICON_RE.sub("", src)
    else:  # no icons yet (the redirect stub): before its theme-color
        pos = src.index('<meta name="theme-color"')
    return src[:pos] + block(src, rel) + src[pos:]


def pages():
    return sorted(p for p in ROOT.rglob("index.html") if ".git" not in p.parts) + [ROOT / "404.html"]


def main():
    check = "--check" in sys.argv
    stale = 0
    for p in pages():
        rel = p.relative_to(ROOT).as_posix()
        src = p.read_text(encoding="utf-8")
        new = rebuild(src, rel)
        if new != src:
            stale += 1
            if not check:
                p.write_text(new, encoding="utf-8", newline="\n")
            print(("stale " if check else "wrote ") + rel)
    sys.exit(1 if check and stale else 0)


if __name__ == "__main__":
    main()
