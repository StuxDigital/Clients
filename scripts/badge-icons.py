"""Builds the badge-style card icons: a brand's mark on a round avatar with a badge in the bottom-right corner saying what
the site or service is (the style projects.stuxie.dev uses; copied from StuxGroup/Services, originally TheRidgwells/Projects'
scripts/badge-icons.py, and set to Stux.Digital's colours).
Usage: python -I scripts/badge-icons.py <brand> <brand icon.png> <out dir> [--size=256] [icon ...]
  <brand> is stux-digital (picks the colours); <brand icon.png> is the brand's icon-light.png, e.g.
  assets/img/icon-light.png. With no icons named, it builds every icon for that brand."""
import sys
from PIL import Image, ImageDraw, ImageFilter

args = [a for a in sys.argv[1:] if not a.startswith("--size=")]
SIZE = next((int(a.split("=", 1)[1]) for a in sys.argv[1:] if a.startswith("--size=")), 256)
brand, src, out = args[0], args[1], args[2]
S = 4                      # supersampling
N = 512 * S
WHITE = (255, 255, 255, 255)

# Each brand: its dark background and a three-stop gradient for the rings, then the icons it has.
BRANDS = {
    "stux-digital": {"bg": (11, 18, 24), "grad": [(125, 211, 252), (56, 189, 248), (3, 105, 161)],  # #0b1218; #7dd3fc, #38bdf8, #0369a1
                     "icons": {"status": "stux-digital-status.png", "service": "stux-digital-clientpage.png"}},
}
B = BRANDS[brand]
BG = B["bg"] + (255,)
emblem = Image.open(src).convert("RGBA")
emblem = emblem.crop(emblem.getbbox())


def gradient(size):
    """A diagonal gradient square through the brand's three colours."""
    a, b, c = B["grad"]
    g = Image.new("RGBA", (size, size))
    px = g.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            p, q, u = (a, b, t / 0.5) if t < 0.5 else (b, c, (t - 0.5) / 0.5)
            px[x, y] = tuple(round(p[i] + (q[i] - p[i]) * u) for i in range(3)) + (255,)
    return g


def round_base():
    """The brand's mark on a round dark avatar inside a gradient ring."""
    base = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    m = Image.new("L", (N, N), 0)
    ImageDraw.Draw(m).ellipse((0, 0, N - 1, N - 1), fill=255)
    base.paste(gradient(N), (0, 0), m)
    ring = int(N * 0.04)
    ImageDraw.Draw(base).ellipse((ring, ring, N - 1 - ring, N - 1 - ring), fill=BG)
    w, h = emblem.size
    k = (N * 0.56) / max(w, h)
    e = emblem.resize((round(w * k), round(h * k)), Image.LANCZOS)
    base.alpha_composite(e, ((N - e.width) // 2 - int(N * 0.035), (N - e.height) // 2 - int(N * 0.04)))
    return base


R = int(N * 0.205)          # badge radius
CX = CY = N - R - int(N * 0.01)
RING = int(N * 0.022)


def badge_base():
    layer = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    sh = Image.new("RGBA", (N, N), (0, 0, 0, 0))    # soft shadow so the badge lifts off the avatar
    ImageDraw.Draw(sh).ellipse((CX - R, CY - R + 6 * S, CX + R, CY + R + 6 * S), fill=(0, 0, 0, 120))
    layer = Image.alpha_composite(layer, sh.filter(ImageFilter.GaussianBlur(8 * S)))
    mask = Image.new("L", (2 * R, 2 * R), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, 2 * R - 1, 2 * R - 1), fill=255)
    layer.paste(gradient(2 * R), (CX - R, CY - R), mask)
    ImageDraw.Draw(layer).ellipse((CX - R + RING, CY - R + RING, CX + R - RING, CY + R - RING), fill=BG)
    return layer


def glyph(layer, parts):
    """Draws white strokes given in a 64-unit space (the glyphs span about 40 units), scaled into the badge."""
    k = (2 * R * 0.62) / 40
    ox, oy = CX - 32 * k, CY - 32 * k
    d = ImageDraw.Draw(layer)
    w = int(4.5 * k)
    def P(x, y): return (ox + x * k, oy + y * k)
    def cap(p): d.ellipse((p[0] - w / 2, p[1] - w / 2, p[0] + w / 2, p[1] + w / 2), fill=WHITE)
    for kind, a in parts:
        if kind == "poly":
            pts = [P(*p) for p in a]
            d.line(pts, fill=WHITE, width=w, joint="curve")
            cap(pts[0]); cap(pts[-1])
        elif kind == "dot":
            x, y, r = a; c = P(x, y)
            d.ellipse((c[0] - r * k, c[1] - r * k, c[0] + r * k, c[1] + r * k), fill=WHITE)
        elif kind == "rrect":
            x0, y0, x1, y1, rad = a
            d.rounded_rectangle((*P(x0, y0), *P(x1, y1)), radius=rad * k, outline=WHITE, width=w)
        elif kind == "arc":          # centre, radius, start and end angles (clockwise from 3 o'clock)
            x, y, r, start, end = a
            d.arc((*P(x - r, y - r), *P(x + r, y + r)), start, end, fill=WHITE, width=w)
        elif kind == "moon":         # a filled crescent
            x, y, r = a
            d.ellipse((*P(x - r, y - r), *P(x + r, y + r)), fill=WHITE)
            d.ellipse((*P(x - r + 8, y - r - 5), *P(x + r + 8, y + r - 5)), fill=BG)


GLYPHS = {
    "status": [("poly", [(12, 34), (22, 34), (27, 22), (35, 46), (41, 30), (44, 34), (52, 34)])],            # a heartbeat line
    "soon": [("poly", [(21, 15), (43, 15), (21, 49), (43, 49), (21, 15)])],                                    # an hourglass
    "maintenance": [("arc", (40, 24, 9, 0, 270)), ("poly", [(34, 30), (17, 47)])],                             # a spanner
    "service": [("rrect", (13, 17, 51, 47, 4)), ("poly", [(13, 26), (51, 26)]), ("dot", (19, 21.5, 1.6)), ("dot", (24.5, 21.5, 1.6))],  # a browser window
    "redirect": [("poly", [(16, 46), (16, 32), (22, 24), (46, 24)]), ("poly", [(38, 16), (46, 24), (38, 32)])],  # a turning arrow
    "chart": [("poly", [(14, 48), (50, 48)]), ("poly", [(20, 41), (20, 33)]), ("poly", [(32, 41), (32, 18)]), ("poly", [(44, 41), (44, 26)])],  # a bar chart
    "moon": [("moon", (30, 34, 15))],                                                                          # a crescent moon
}

avatar = round_base()
wanted = args[3:] or list(B["icons"])
for key in wanted:
    layer = badge_base()
    glyph(layer, GLYPHS[key])
    icon = Image.alpha_composite(avatar, layer).resize((SIZE, SIZE), Image.LANCZOS)
    icon.save(f"{out}/{B['icons'][key]}", optimize=True)
    print(B["icons"][key])
