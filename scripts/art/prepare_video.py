"""Turns a short clip into the three files a DitherArt piece needs to play
it in squares:

  public/art/<name>.mp4        the ink map frame by frame, as a grey video:
                               how dense the squares are at each point,
                               black where there is no subject. The browser
                               dithers every frame live.
  public/art/<name>-tone.png   one frame of it, with the subject's outline in
                               alpha: shown before the video plays, and
                               instead of it under reduced motion
  public/art/<name>.png        that frame already in squares, for browsers
                               without JavaScript or WebGL

The subject is each frame's Vision mask, joined with whatever differs from
the background, which catches the props Vision keeps in some frames and
drops in others. That needs a still camera and an opening second before
the props come into view. Where the subject itself stands in that second
the wall behind is unknown, so nothing there is compared with it: it would
find the wall wherever the subject has moved since, and draw a ghost of
the opening pose.

Everything is graded with one set of numbers for the whole clip, so
nothing flickers: each channel stretched to the subject's own range (which
also lifts a film's colour cast), and large shading lifted while fine
detail is kept. Neutral shadows low in the frame are lifted most: on a
light page the shaded side of a white shirt otherwise reads as a stain,
while hair, higher up, stays dark. The frame is trimmed to where anything
ever happens, so the picture fills its box. The loop's seam needs nothing
here: the player lets the squares dissolve at the end and resolve again
on the first frame.

  ffmpeg -ss <start> -i clip.mp4 -vf fps=25 frames/f%04d.png
  ../ai-empathy-lab-motion/tools/masks frames/ masks/
  python3 scripts/art/prepare_video.py frames/ masks/ <name> --still <frame> [--one-tone]

Register the result in content/art.ts with the ratio this prints. Needs
Pillow, NumPy, SciPy and ffmpeg.
"""
import argparse
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

from squares import ROOT, draw_one_tone_still, draw_still, token

p = argparse.ArgumentParser()
p.add_argument("frames")
p.add_argument("masks")
p.add_argument("name")
p.add_argument("--width", type=int, default=360, help="video width in px, before the trim")
p.add_argument("--fps", type=int, default=25)
p.add_argument("--empty", type=int, default=25, help="opening frames before the props come into view")
p.add_argument("--still", type=int, default=0, help="frame used for the still, the video starts there")
p.add_argument("--still-height", type=int, default=600, help="fallback display height, CSS px")
p.add_argument("--cell", type=int, default=3, help="square size, CSS px")
p.add_argument("--crf", type=int, default=24, help="video quality, lower is better and larger")
p.add_argument("--one-tone", action="store_true", help="the still in the dark indigo only, for a oneTone piece")
a = p.parse_args()

names = sorted(f.name for f in Path(a.frames).glob("*.png"))
first = Image.open(Path(a.frames) / names[0])
W = a.width
H = round(first.height * W / first.width)


def frame(name):
    return np.asarray(Image.open(Path(a.frames) / name).convert("RGB").resize((W, H), Image.LANCZOS)).astype(np.float32) / 255


def vision(name):
    return np.asarray(Image.open(Path(a.masks) / name).convert("L").resize((W, H), Image.BILINEAR)).astype(np.float32) / 255


def lum_of(rgb):
    return rgb @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)


# The wall, from the opening frames, and where in them the subject stood.
background = np.median(np.stack([frame(n) for n in names[: a.empty]]), axis=0)
stood = np.max(np.stack([vision(n) for n in names[: a.empty]]), axis=0) > 0.3
unknown = ndimage.binary_dilation(stood, iterations=round(0.02 * W) + 1)

# The subject in every frame: Vision's mask, plus everything that is not
# the wall, cleaned of noise specks and softened by a pixel at the edge.
masks = []
for n in names:
    diff = ndimage.gaussian_filter(np.abs(frame(n) - background).max(axis=2), 1.0)
    diff[unknown] = 0
    moved = ndimage.binary_closing(ndimage.binary_opening(diff > 0.06), iterations=2)
    labels, count = ndimage.label(moved)
    if count:
        sizes = ndimage.sum(moved, labels, range(1, count + 1))
        moved = np.isin(labels, 1 + np.flatnonzero(sizes >= 12))
    masks.append(np.maximum(vision(n), ndimage.gaussian_filter(moved.astype(np.float32), 0.8)))
# A frame's mask leans on its neighbours, so an edge cannot flicker.
masks = [(masks[max(i - 1, 0)] + 2 * m + masks[min(i + 1, len(masks) - 1)]) / 4 for i, m in enumerate(masks)]

# The part of the frame any frame's subject reaches, with a small margin,
# in even sizes as the video encoder needs.
seen = np.zeros((H, W), bool)
for m in masks:
    seen |= m > 0.3
ys, xs = np.flatnonzero(seen.any(axis=1)), np.flatnonzero(seen.any(axis=0))
pad = round(0.02 * H)
top, left = max(0, ys[0] - pad), max(0, xs[0] - pad)
bottom, right = min(H, ys[-1] + 1 + pad), min(W, xs[-1] + 1 + pad)
bottom -= (bottom - top) % 2
right -= (right - left) % 2
crop = (slice(top, bottom), slice(left, right))

# One grade for the whole clip, measured on the subject in every fifth frame.
sampled = range(0, len(names), 5)
rgb_samples = np.concatenate([frame(names[i])[masks[i] > 0.5] for i in sampled])
c_lo, c_hi = np.percentile(rgb_samples, 0.5, axis=0), np.percentile(rgb_samples, 99.5, axis=0)
# How hard a neutral shadow is lifted: not at all above 45% of the frame's
# height, fully below 75%.
low = np.clip((np.linspace(0, 1, H, dtype=np.float32)[:, None] - 0.45) / 0.3, 0, 1)


def stretched(i):
    return np.clip((frame(names[i]) - c_lo) / (c_hi - c_lo), 0, 1)


def shading(c):
    """A frame's luminance, and its shading graded for a light page."""
    lum = lum_of(c)
    neutral = 1 - np.clip(np.linalg.norm(c - lum[..., None], axis=2) / 0.08, 0, 1)
    base = ndimage.gaussian_filter(lum, 0.05 * H)
    return lum, np.clip(base ** (0.75 - 0.38 * low * neutral) + 1.3 * (lum - base), 0, 1)


def ink_of(i):
    # Edges sharpened at the scale of a square, so features stay crisp, and
    # a faint field even in the highlights keeps the outline.
    _, shade = shading(stretched(i))
    shade = np.clip(shade + 0.9 * (shade - ndimage.gaussian_filter(shade, 1.2)), 0, 1)
    return ((0.04 + 0.96 * (1 - shade)) * masks[i])[crop]


out = ROOT / "public" / "art"
with tempfile.TemporaryDirectory() as tmp:
    for j in range(len(names)):
        Image.fromarray((ink_of(j) * 255).round().astype(np.uint8)).save(f"{tmp}/{j:04d}.png")
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-framerate", str(a.fps), "-i", f"{tmp}/%04d.png",
         "-c:v", "libx264", "-preset", "slow", "-crf", str(a.crf), "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", "-an", str(out / f"{a.name}.mp4")],
        check=True,
    )

ink, alpha = ink_of(a.still), masks[a.still][crop]
la = np.dstack([ink * 255, np.clip(alpha, 0, 1) * 255]).round().astype(np.uint8)
Image.fromarray(la).save(out / f"{a.name}-tone.png", optimize=True)
_, INK = token("--ael-indigo-700")
_, MID = token("--ael-indigo-400")
still = draw_one_tone_still(ink, alpha, a.still_height, a.cell, INK) if a.one_tone else draw_still(ink, alpha, a.still_height, a.cell, INK, MID)
still.save(out / f"{a.name}.png", optimize=True)
size = (out / f"{a.name}.mp4").stat().st_size
w, h = right - left, bottom - top
print(f"{a.name}: {len(names)} frames at {w}x{h}, {size // 1024} KB, ratio {w / h:.4f}, still at {a.still / a.fps:.2f} s")
