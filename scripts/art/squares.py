"""What prepare.py and prepare_video.py share: the square colours, read
from styles/tokens.css and never typed here, the 8x8 ordered (Bayer)
threshold the browser uses too, and the fallback still drawn as the same
squares the browser draws.
"""
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]


def token(name):
    """A colour token as (hex, (r, g, b))."""
    tokens = (ROOT / "styles" / "tokens.css").read_text()
    hex_ = re.search(re.escape(name) + r":\s*(#[0-9A-Fa-f]{6})", tokens).group(1)
    return hex_, tuple(int(hex_[i:i + 2], 16) for i in (1, 3, 5))


def bayer(n=8):
    m = np.array([[0]])
    while m.shape[0] < n:
        m = np.block([[4 * m, 4 * m + 2], [4 * m + 3, 4 * m + 1]])
    return (m + 0.5) / (n * n)


def draw_still(ink, alpha, still_height, cell, ink_rgb, mid_rgb):
    """The image already in squares, at 2x for sharp screens. `ink` and
    `alpha` are 0..1 arrays of one size: three levels, none, light, dark."""
    h, w = ink.shape
    rows = still_height // cell
    cols = round(rows * w / h)
    small_ink = np.asarray(Image.fromarray((ink * 255).astype(np.uint8)).resize((cols, rows), Image.BOX)).astype(np.float64) / 255
    small_mask = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).resize((cols, rows), Image.BOX)) > 127
    th = np.tile(bayer(), (rows // 8 + 1, cols // 8 + 1))[:rows, :cols]
    level = np.clip(np.floor(small_ink * 2 + th), 0, 2) * small_mask
    c = cell * 2
    # Squares under 4 pixels touch, as the browser draws them.
    gap = max(1, round(c * 0.16)) if c >= 4 else 0
    still = Image.new("RGBA", (cols * c, rows * c), (0, 0, 0, 0))
    d = ImageDraw.Draw(still)
    for y, x in zip(*np.nonzero(level)):
        fill = ink_rgb if level[y, x] == 2 else mid_rgb
        d.rectangle([x * c + gap, y * c + gap, (x + 1) * c - gap - 1, (y + 1) * c - gap - 1], fill=fill + (255,))
    return still


def draw_one_tone_still(ink, alpha, still_height, cell, rgb):
    """The image at 2x in one colour of square, a square wherever the ink
    beats the ordered threshold, as DitherArt draws a one-tone piece."""
    h, w = ink.shape
    rows = still_height // cell
    cols = round(rows * w / h)
    small_ink = np.asarray(Image.fromarray((ink * 255).round().astype(np.uint8)).resize((cols, rows), Image.BOX)).astype(np.float64) / 255
    small_mask = np.asarray(Image.fromarray((alpha * 255).round().astype(np.uint8)).resize((cols, rows), Image.BOX)) > 127
    th = np.tile(bayer(), (rows // 8 + 1, cols // 8 + 1))[:rows, :cols]
    c = cell * 2
    # Squares under 4 pixels touch, as the browser draws them.
    gap = max(1, round(c * 0.16)) if c >= 4 else 0
    still = Image.new("RGBA", (cols * c, rows * c), (0, 0, 0, 0))
    d = ImageDraw.Draw(still)
    for y, x in zip(*np.nonzero(small_mask & (small_ink >= 0.03) & (small_ink > th))):
        d.rectangle([x * c + gap, y * c + gap, (x + 1) * c - gap - 1, (y + 1) * c - gap - 1], fill=rgb + (255,))
    return still
