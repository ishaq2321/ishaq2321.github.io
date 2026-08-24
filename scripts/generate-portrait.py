#!/usr/bin/env python3
"""Generate a traced animated-portrait asset from a reference photo.

This is the forker path for the hero's animated portrait: run it on YOUR photo
to produce public/portrait-traced.svg, then point `portrait.asset` in
portfolio.config.json at the output (or keep the default path and overwrite it).

Pipeline:
  1. Crop the photo to a head+neck square, optional white-balance point
  2. Mask to head+neck so the background never enters the art
  3. Quantize to ~20 tones (rich posterization, background-free)
  4. Kill background-pink leaks, warm-grade, vector-trace with vtracer

Usage:
  pip install vtracer pillow numpy
  python3 scripts/generate-portrait.py --photo me.jpg --crop 240,60,740,740 \
      --wb 500,700 --head 112,40,300,288 --neck 189,240,253,310

Photos never leave your machine. Iterate: check the -preview.png output,
adjust --crop/--head/--neck, re-run.
"""

import argparse
import re

import numpy as np
import vtracer
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

SIZE = 512


def hex2rgb(h: str) -> tuple:
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def rect(s: str) -> tuple:
    x0, y0, x1, y1 = (int(v) for v in s.split(","))
    return (x0, y0, x1, y1)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--photo", required=True)
    ap.add_argument("--crop", required=True, help="x,y,w,h square crop around head+neck")
    ap.add_argument("--wb", default=None, help="x,y point that should be neutral white (e.g. shirt)")
    ap.add_argument("--head", default="112,40,300,288", help="head ellipse x0,y0,x1,y1 in the 512 crop")
    ap.add_argument("--neck", default="189,240,253,310", help="neck rect x0,y0,x1,y1")
    ap.add_argument("--tones", type=int, default=20, help="quantization tone count")
    ap.add_argument("--out", default="public/portrait-traced.svg")
    args = ap.parse_args()

    im = Image.open(args.photo).convert("RGB")
    x, y, w, h = (int(v) for v in args.crop.split(","))
    im = im.crop((x, y, x + w, y + h)).resize((SIZE, SIZE), Image.LANCZOS)

    if args.wb:
        wx, wy = (int(v) for v in args.wb.split(","))
        region = np.asarray(im.crop((wx - 6, wy - 6, wx + 6, wy + 6))).reshape(-1, 3).mean(axis=0)
        scale = 205.0 / np.maximum(region, 1)
        im = Image.fromarray(np.clip(np.asarray(im).astype(float) * scale, 0, 255).astype(np.uint8))

    # mask: head + neck only
    mask = Image.new("L", im.size, 0)
    dr = ImageDraw.Draw(mask)
    dr.ellipse(rect(args.head), fill=255)
    dr.rectangle(rect(args.neck), fill=255)
    key = Image.new("RGB", im.size, (255, 0, 255))
    im = Image.composite(im, key, mask)

    # rich quantization, no dither
    q = im.quantize(colors=args.tones, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB")
    q = q.filter(ImageFilter.SMOOTH)
    q.save(args.out.replace(".svg", "-preview.png"))

    svg_tmp = args.out.replace(".svg", "-raw.svg")
    vtracer.convert_image_to_svg_py(
        args.out.replace(".svg", "-preview.png"), svg_tmp,
        colormode="color", hierarchical="cutout", mode="spline",
        filter_speckle=10, color_precision=8, layer_difference=6,
        corner_threshold=60, length_threshold=5.0, splice_threshold=45,
        path_precision=0,
    )

    src = open(svg_tmp).read()
    kept = []
    for tag in re.findall(r"<path[^>]*/>", src):
        fm = re.search(r'fill="(#([0-9a-fA-F]{6}))"', tag)
        if fm:
            c = fm.group(1)
            r, g, b = int(c[1:3], 16), int(c[3:5], 16), int(c[5:7], 16)
            if r > 225 and b > 225 and g < 70:  # mask key color
                continue
        kept.append(tag)

    def grade(m: "re.Match") -> str:
        r, g, b = int(m.group(1), 16), int(m.group(2), 16), int(m.group(3), 16)
        r = min(255, int(r * 1.22))
        b = min(255, int(b * 0.74))
        # kill magenta/pink leaks: red AND blue both well above green
        if r - g > 45 and b > g + 15:
            target = (g + b) // 2
            r = target + (r - target) // 5
            b = target + (b - target) // 5
        return "#%02x%02x%02x" % (min(255, r), g, min(255, b))

    kept = [re.sub(r"#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})", grade, t) for t in kept]
    result = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}">' + "".join(kept) + "</svg>"
    open(args.out, "w").write(result)
    print(f"wrote {args.out}: {len(kept)} paths, {len(result)} bytes")
    print(f"preview: {args.out.replace('.svg', '-preview.png')}")


if __name__ == "__main__":
    main()
