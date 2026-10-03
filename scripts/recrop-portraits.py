#!/usr/bin/env python3
"""
Recrop the team portraits so every face reads at about the same size.

    python3 scripts/recrop-portraits.py

Edit CROPS below, re-run, refresh the page. Sources are read fresh each time,
so re-running never compounds — a crop is always taken from the original, not
from the last crop.

    frac   how much of the photo's short side to keep.
           SMALLER = CLOSER.  0.95 is nearly the whole frame, 0.45 is tight.

    cy     where the crop sits vertically, as a fraction of the photo's height.
           BIGGER = the crop sits LOWER, so the person rides HIGHER in the card.
           SMALLER = the crop sits HIGHER, so they sit LOWER with more headroom.

    cx     where it sits horizontally. 0.50 is centred.
           BIGGER = the crop sits further RIGHT, so the person moves LEFT.

Nothing is ever enlarged. A crop smaller than SIZE is written at its own
resolution, because scaling 432px up to 800px adds bytes and blur, never
detail. The run prints the true pixel size of each, so a portrait that is
too small for a sharp card is visible rather than disguised.
"""
from PIL import Image
import pathlib, shutil, subprocess, sys, tempfile, zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "team"

# Six portraits came embedded in the lab's content document, which is not in
# this repo. They are extracted to a temp folder on demand, so nothing binary
# has to be committed to make a recrop reproducible.
DOCX = pathlib.Path.home() / "My/Projects/Researches/AI Empathy Lab - Website Content (1).docx"

#  photo   source            frac   cy    cx     who
CROPS = {
    1:  ("image1.jpeg",      0.40, 0.415, 0.505),# Alex Mari
    2:  ("image2.jpeg",      0.80, 0.40, 0.50),  # Ertugrul Uysal
    3:  ("image3.png",       0.92, 0.45, 0.50),  # Amani Alabed
    4:  ("image4.png",       0.66, 0.30, 0.50),  # Fotis Efthymiou
    5:  ("image5.jpeg",      0.58, 0.35, 0.50),  # Maqbool Khan
    6:  ("image6.png",       0.95, 0.46, 0.50),  # Jeff Brooks
    # 7 Danylo and 8 Illia were supplied already cropped and are left alone.
    10: ("yasmeen.jpg",      0.70, 0.49, 0.50),  # Yasmeen Masalmeh
}

SIZE = 800        # px square ceiling, about 2x the card. Never enlarged past
                  # the source: a crop smaller than this is written as it is.
QUALITY = 90      # high, because several of these are re-encodes of re-encodes


LOCAL = pathlib.Path(__file__).resolve().parent / "sources"


def sources() -> pathlib.Path:
    """Unpack the content document's images once per run."""
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="ael-portraits-"))
    if not DOCX.exists():
        sys.exit(f"Content document not found at {DOCX}\n"
                 f"Point DOCX at it, or set every entry's source to 'self'.")
    with zipfile.ZipFile(DOCX) as z:
        for name in z.namelist():
            if name.startswith("word/media/"):
                (tmp / pathlib.Path(name).name).write_bytes(z.read(name))
    return tmp


def main() -> None:
    need_docx = any(not (LOCAL / src).exists() for src, *_ in CROPS.values())
    media = sources() if need_docx else None
    try:
        for n, (src, frac, cy, cx) in sorted(CROPS.items()):
            path = LOCAL / src if (LOCAL / src).exists() else media / src
            if not path.exists():
                print(f"  photo-{n}: SKIPPED, no {path.name}")
                continue
            im = Image.open(path).convert("RGB")
            w, h = im.size
            side = int(min(w, h) * frac)
            x = max(0, min(int(w * cx - side / 2), w - side))
            y = max(0, min(int(h * cy - side / 2), h - side))
            out_px = min(side, SIZE)          # never enlarge
            crop = im.crop((x, y, x + side, y + side))
            if out_px != side:
                crop = crop.resize((out_px, out_px), Image.LANCZOS)
            crop.save(OUT / f"photo-{n}.jpg", "JPEG",
                      quality=QUALITY, optimize=True, progressive=True)
            kb = (OUT / f"photo-{n}.jpg").stat().st_size // 1024
            soft = "  <- under 816px, soft on a retina card" if out_px < 816 else ""
            print(f"  photo-{n}: {path.name:14} frac {frac}  cy {cy}  cx {cx}"
                  f"  -> {out_px}px {kb}kB{soft}")
    finally:
        if media:
            shutil.rmtree(media, ignore_errors=True)


if __name__ == "__main__":
    main()
