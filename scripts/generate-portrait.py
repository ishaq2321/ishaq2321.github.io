#!/usr/bin/env python3
"""Generate a traced animated-portrait asset from a reference photo.

This is the forker path for the hero's animated portrait: run it on YOUR photo
to produce public/portrait-traced.svg (or a custom path), then point the
`portrait.asset` value in portfolio.config.json at the output.

The pipeline:
  1. Crop + white-balance the photo
  2. Map pixels onto a small semantic palette (hair / beard / skin tones)
  3. Mask to head + neck so background never enters the art
  4. Vector-trace with vtracer and regroup into color layers

Usage:
  pip install vtracer pillow numpy
  python3 scripts/generate-portrait.py --photo me.jpg --crop 240,60,740,740

Then tune PALETTE below until the preview matches your tones, and re-run.
Photos never leave your machine; the traced SVG is fully hand-editable.
"""

import argparse
import re

import numpy as np
import vtracer
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

# ---------------------------------------------------------------------------
# EDIT ME — semantic palette for YOUR photo (RGB). Measure with any picker.
# Keep entries far apart so layers never merge. Roles:
#   hair / hair_hi (merged into hair) / beard / skin_shadow / skin /
#   skin_light / kurta (clothing) / curtain1+2 (background, dropped)
# ---------------------------------------------------------------------------
PALETTE = [
    ("hair",        (85, 85, 110)),
    ("hair_hi",     (118, 118, 142)),
    ("beard",       (108, 84, 112)),
    ("skin_shadow", (138, 102, 124)),
    ("skin",        (150, 132, 148)),
    ("skin_light",  (185, 165, 172)),
    ("kurta",       (207, 204, 213)),
    ("curtain1",    (254, 187, 184)),
    ("curtain2",    (255, 145, 228)),
]

# Final SVG colors per layer (site palette; adjust to your liking)
FINAL = {
    "hair":        "#17110c",
    "hair_hi":     "#17110c",
    "beard":       "#1d150e",
    "skin_shadow": "#a26843",
    "skin":        "#c78c60",
    "skin_light":  "#d6a173",
    "kurta":       None,  # clothing is drawn by the component (outfit config)
}

# Head + neck mask in the cropped square (x0, y0, x1, y1) — tune to your crop
HEAD_ELLIPSE = (112, 40, 300, 288)
NECK_RECT = (183, 240, 258, 340)
NECK_POLY = [(178, 268), (190, 340), (252, 340), (264, 266)]

SIZE = 512


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--photo", required=True, help="reference photo path")
    ap.add_argument("--crop", required=True, help="x,y,w,h square crop around head+neck")
    ap.add_argument("--wb", default=None, help="white-balance reference: x,y point that should be neutral (e.g. a white shirt)")
    ap.add_argument("--out", default="public/portrait-traced.svg", help="output SVG path")
    args = ap.parse_args()

    im = Image.open(args.photo).convert("RGB")
    x, y, w, h = (int(v) for v in args.crop.split(","))
    im = im.crop((x, y, x + w, y + h)).resize((SIZE, SIZE), Image.LANCZOS)

    if args.wb:
        wx, wy = (int(v) for v in args.wb.split(","))
        region = np.asarray(im.crop((wx - 6, wy - 6, wx + 6, wy + 6))).reshape(-1, 3).mean(axis=0)
        scale = 205.0 / np.maximum(region, 1)
        arr = np.clip(np.asarray(im).astype(float) * scale, 0, 255)
        im = Image.fromarray(arr.astype(np.uint8))

    im = im.filter(ImageFilter.SMOOTH)
    im = ImageEnhance.Color(im).enhance(1.25)

    arr = np.asarray(im).astype(int)
    dists = np.stack([np.sum((arr - np.array(c)) ** 2, axis=2) for _, c in PALETTE])
    idx = np.argmin(dists, axis=0)
    mapped = np.zeros_like(arr)
    for i, (name, c) in enumerate(PALETTE):
        mapped[idx == i] = c
        print(f"{name:12s} {int((idx == i).sum()) * 100 // (SIZE * SIZE)}%")

    flat = Image.fromarray(mapped.astype(np.uint8))

    mask = Image.new("L", flat.size, 0)
    dr = ImageDraw.Draw(mask)
    dr.ellipse(HEAD_ELLIPSE, fill=255)
    dr.rectangle(NECK_RECT, fill=255)
    dr.polygon(NECK_POLY, fill=255)
    key = Image.new("RGB", flat.size, (255, 0, 255))
    flat = Image.composite(flat.filter(ImageFilter.SMOOTH), key, mask).filter(ImageFilter.SMOOTH_MORE)
    flat.save(args.out.replace(".svg", "-preview.png"))

    svg_tmp = args.out.replace(".svg", "-raw.svg")
    vtracer.convert_image_to_svg_py(
        args.out.replace(".svg", "-preview.png"), svg_tmp,
        colormode="color", hierarchical="cutout", mode="spline",
        filter_speckle=18, color_precision=8, layer_difference=12,
        corner_threshold=60, length_threshold=6.0, splice_threshold=45,
        path_precision=0,
    )

    src = open(svg_tmp).read()
    drop = {(255, 0, 255), tuple(PALETTE[[n for n, _ in PALETTE].index("kurta")][1])}

    def parse_fill(f: str) -> tuple:
        m = re.match(r"rgb\((\d+),(\d+),(\d+)\)", f)
        if m:
            return tuple(int(v) for v in m.groups())
        return tuple(int(v, 16) for v in re.match(r"#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})", f).groups())

    layers: dict = {}
    for tag in re.findall(r"<path[^>]*/>", src):
        dm, fm = re.search(r'd="([^"]+)"', tag), re.search(r'fill="([^"]+)"', tag)
        tm = re.search(r'transform="([^"]+)"', tag)
        if not (dm and fm):
            continue
        c = parse_fill(fm.group(1))
        if c in drop:
            continue
        best, bd = None, 1e9
        for name, pc in PALETTE:
            d = sum((a - b) ** 2 for a, b in zip(c, pc))
            if d < bd:
                best, bd = name, d
        if best in ("hair_hi",):
            best = "hair"
        layers.setdefault(best, []).append((dm.group(1), tm.group(1) if tm else None))

    order = ["skin_light", "skin", "skin_shadow", "beard", "hair"]
    parts = []
    kept = 0
    for name in order:
        if name not in layers or FINAL.get(name) is None:
            continue
        parts.append(f'<g id="{name}" fill="{FINAL[name]}">')
        for d_attr, transform in layers[name]:
            t = f' transform="{transform}"' if transform else ""
            parts.append(f'<path d="{d_attr}"{t}/>')
            kept += 1
        parts.append("</g>")

    result = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}">' + "".join(parts) + "</svg>"
    open(args.out, "w").write(result)
    print(f"wrote {args.out}: {kept} paths, {len(result)} bytes")
    print(f"preview: {args.out.replace('.svg', '-preview.png')}")


if __name__ == "__main__":
    main()
