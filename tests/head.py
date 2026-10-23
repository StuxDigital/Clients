#!/usr/bin/env python3
"""Checks every page's <head>: the favicon set and Discord's component embed.
Run with: python tests/head.py"""
import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("build_head", ROOT / "scripts" / "build-head.py")
bh = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bh)

PASS, FAIL = 0, 0


def check(name, ok):
    global PASS, FAIL
    if ok:
        PASS += 1
        print("ok   - " + name)
    else:
        FAIL += 1
        print("FAIL - " + name)


ALLOWED = {1, 2, 9, 10, 11, 12, 14, 17}
BUTTON_KEYS = {"id", "type", "url", "style", "label", "emoji", "disabled"}


def walk(c):
    yield c
    for k in c.get("components", []):
        yield from walk(k)
    if "accessory" in c:
        yield from walk(c["accessory"])


def validate(js):
    root = json.loads(js)["component"]
    nodes = list(walk(root))
    ok = root["type"] == 17 and sum(1 for n in nodes if n["type"] == 17) == 1
    ok = ok and all(n["type"] in ALLOWED for n in nodes) and len(nodes) <= 40
    for n in nodes:
        if n["type"] == 2:
            ok = ok and n.get("style") == 5 and set(n) <= BUTTON_KEYS and re.match(r"https?://", n["url"])
    return bool(ok)


pages = bh.pages()
for p in pages:
    rel = p.relative_to(ROOT).as_posix()
    src = p.read_text(encoding="utf-8")
    head = src.split("</head>")[0]
    check(rel + ": favicon tags", all(t in head for t in (
        '<link rel="icon" href="/favicon.ico" sizes="48x48">',
        '<link rel="icon" type="image/png" sizes="512x512" href="/assets/img/icon-512.png">',
        '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
        '<link rel="manifest" href="/site.webmanifest">')))
    m = re.search(r'<script id="discord:component-embed" type="application/json">(.*?)</script>', head, re.S)
    if rel in bh.NO_EMBED:
        check(rel + ": no Discord embed", m is None)
    else:
        check(rel + ": Discord embed is valid, under 3,000 bytes", bool(m) and len(m.group(1).encode()) <= 3000 and validate(m.group(1)))
        check(rel + ": never prints a literal $1", m is not None and "$1" not in m.group(1))

check("every page is up to date (python scripts/build-head.py)",
      all(bh.rebuild(p.read_text(encoding="utf-8"), p.relative_to(ROOT).as_posix()) == p.read_text(encoding="utf-8") for p in pages))
check("markdown in data is escaped, with the character kept", bh.discord_md("a*b_c [x] #y\n# h\n- l\\") == r"a\*b\_c \[x\] #y" + "\n" + r"\# h" + "\n" + r"\- l\\")
check("a closing script tag can't end the embed early",
      "</script" not in bh.embed([bh.text("</script><b>")]).split('type="application/json">', 1)[1].rsplit("</script>", 1)[0])
check("an over-long embed becomes a comment", bh.embed([bh.text("x" * 3500)]).startswith("<!--"))

man = json.loads((ROOT / "site.webmanifest").read_text(encoding="utf-8"))
check("manifest has name, short_name, start_url, display, colours",
      all(k in man for k in ("name", "short_name", "start_url", "display", "theme_color", "background_color")) and man["start_url"] == "/" and man["display"] == "browser")
check("manifest has 192 and 512 icons and a maskable 512",
      {(i["sizes"], i.get("purpose")) for i in man["icons"]} >= {("192x192", None), ("512x512", None), ("512x512", "maskable")}
      and all((ROOT / i["src"].lstrip("/")).is_file() for i in man["icons"]))
for f in ("favicon.ico", "apple-touch-icon.png"):
    check(f + " exists", (ROOT / f).is_file())

print("%d passed, %d failed" % (PASS, FAIL))
sys.exit(1 if FAIL else 0)
