"""Turns a cut-out photo (transparent background) into the two files a
DitherArt component needs:

  public/art/<name>-tone.png   the ink map: how dense the squares should
                               be at each point (darker = denser), with
                               the subject's outline in the alpha channel.
                               The browser dithers it live.
  public/art/<name>.png        the same image already in squares, for
                               browsers without JavaScript or WebGL.

Squares come in two shades, so mid-tones read as mid-tones: ordered
dithering to three levels (none, light, dark) instead of two.

  python3 scripts/art/prepare.py <cutout.png> <name> [--height 600 --still-height 420]

The cut-out is any PNG with a transparent background; the site's were
lifted on device with macOS Vision (ai-empathy-lab-motion/tools/lift).
Register the result in content/art.ts with the ratio this prints. The
square colours are read from styles/tokens.css, never typed here.
Needs Pillow and NumPy.
"""
import argparse
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
p = argparse.ArgumentParser()
p.add_argument("src")
p.add_argument("name")
p.add_argument("--height", type=int, default=640, help="tone map height in px")
p.add_argument("--crop", type=float, default=1.0, help="keep this top fraction of the subject")
p.add_argument("--detail", type=float, default=0.7, help="local contrast boost")
p.add_argument("--gamma", type=float, default=0.85)
p.add_argument("--still-height", type=int, default=600, help="fallback display height, CSS px")
p.add_argument("--cell", type=int, default=3, help="square size, CSS px")
p.add_argument("--contrast", type=float, default=1.6, help="midtone S-curve strength")
p.add_argument("--mid", default="--ael-indigo-400", help="token for the light squares")
a = p.parse_args()

tokens = (ROOT / "styles" / "tokens.css").read_text()
def token(name):
    hex_ = re.search(re.escape(name) + r":\s*(#[0-9A-Fa-f]{6})", tokens).group(1)
    return hex_, tuple(int(hex_[i:i + 2], 16) for i in (1, 3, 5))
ink_hex, INK = token("--ael-indigo-700")
mid_hex, MID = token(a.mid)

im = Image.open(a.src).convert("RGBA")
bbox = im.getchannel("A").point(lambda v: 255 if v > 127 else 0).getbbox()
im = im.crop(bbox)
if a.crop < 1:
    im = im.crop((0, 0, im.width, round(im.height * a.crop)))
w = round(im.width * a.height / im.height)
im = im.resize((w, a.height), Image.LANCZOS)

rgb = np.asarray(im.convert("RGB")).astype(np.float64) / 255
alpha = np.asarray(im.getchannel("A")).astype(np.float64) / 255
lum = rgb @ np.array([0.2126, 0.7152, 0.0722])
mask = alpha > 0.5

# Studio photos are lit evenly: lift the local detail (edges, folds, the
# features of a hand) out of the overall brightness before mapping to ink.
lo, hi = np.percentile(lum[mask], [1, 99.5])
lum = np.clip((lum - lo) / (hi - lo), 0, 1)
blur = np.asarray(Image.fromarray((lum * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(a.height * 0.01))).astype(np.float64) / 255
lum = np.clip(lum + a.detail * (lum - blur), 0, 1)
# An S-curve around the subject's own middle grey separates lit from shaded.
mid = np.median(lum[mask])
lum = 1 / (1 + np.exp(-a.contrast * 4 * (lum - mid)))
lum = (lum - lum[mask].min()) / (lum[mask].max() - lum[mask].min())
ink = np.clip(1 - lum, 0, 1) ** a.gamma
ink = 0.05 + 0.95 * ink  # a faint field even in the highlights keeps the outline
ink[~mask] = 0

out = ROOT / "public" / "art"
out.mkdir(parents=True, exist_ok=True)
# Grey plus alpha, in 64 steps: the squares cannot show finer steps anyway.
la = np.dstack([np.round(ink * 63) / 63 * 255, alpha * 255]).astype(np.uint8)
Image.fromarray(la).save(out / f"{a.name}-tone.png", optimize=True)

# The fallback: the same squares the browser draws, at 2x for sharp screens.
def bayer(n=8):
    m = np.array([[0]])
    while m.shape[0] < n:
        m = np.block([[4 * m, 4 * m + 2], [4 * m + 3, 4 * m + 1]])
    return (m + 0.5) / (n * n)

rows = a.still_height // a.cell
cols = round(rows * w / a.height)
small_ink = np.asarray(Image.fromarray((ink * 255).astype(np.uint8)).resize((cols, rows), Image.BOX)).astype(np.float64) / 255
small_mask = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).resize((cols, rows), Image.BOX)) > 127
th = np.tile(bayer(), (rows // 8 + 1, cols // 8 + 1))[:rows, :cols]
level = np.clip(np.floor(small_ink * 2 + th), 0, 2) * small_mask
scale = 2
c = a.cell * scale
gap = max(1, round(c * 0.16))
still = Image.new("RGBA", (cols * c, rows * c), (0, 0, 0, 0))
d = ImageDraw.Draw(still)
for y, x in zip(*np.nonzero(level)):
    fill = INK if level[y, x] == 2 else MID
    d.rectangle([x * c + gap, y * c + gap, (x + 1) * c - gap - 1, (y + 1) * c - gap - 1], fill=fill + (255,))
still.save(out / f"{a.name}.png", optimize=True)
print(f"{a.name}: tone {w}x{a.height}, still {still.width}x{still.height}, ratio {w / a.height:.4f}, ink {ink_hex} + {mid_hex}")
