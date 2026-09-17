#!/usr/bin/env python3
"""Frame a photograph as the hero portrait.

The hero shows a square card (112px on mobile, 144px at `sm`, 224px at `lg`) filled
edge to edge, so the portrait has to be 1:1 with the head placed for that frame.
This script crops, frames and grades your photo. It does not redraw the face: the
likeness stays exact because the output *is* the photograph.

    python3 scripts/prepare-portrait.py --photo me.jpg --face 1231,877,1077

`--face` takes three numbers measured in source pixels: the x of the head centre,
the y of the eye line, and the height from the crown of the head to the chin.

    python3 scripts/prepare-portrait.py --photo me.jpg --face 1231,877,1077 --guide temp/guide.png

`--guide` writes the source photo back out with a coordinate grid and the chosen
crop drawn on it, which is the easiest way to find those three numbers.

Requires Pillow only:  pip install pillow
Your photo is read in place and never copied into the repository.
"""

import argparse
import os
import statistics
import sys

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageOps

# --- the palette the portrait has to sit on (app/globals.css) ------------------
# The site is dark-only, so the grade is judged against ink alone. It used to be
# checked on a paper-white background too; that theme was removed.
INK = (13, 12, 11)        # --bg
BONE = (244, 239, 233)    # --text

# Warm grade. Measured against the palette rather than eyeballed: the page's large
# areas are close to neutral (--bg ink is only +2 warm, paper +7) while its type is
# warm (bone #c2b9ae is +20, muted +26). So the portrait wants near-neutral shadows
# and bone-warm midtones -- an allover sepia is too much, plain greyscale too cold.
# Duotone onto ink -> bone, then amplify the chroma so the face lands on the warmth
# of the type (measured: face +21.6, shadowed sky +7.0, against bone +20 / paper +7).
WARM_BLACK = (13, 12, 11)       # --bg, the page's own ink
WARM_WHITE = (203, 193, 180)    # bone, a shade warm of the type
GRADE_CONTRAST = 1.10
GRADE_CHROMA = 1.7
GRADE_VIGNETTE = 0.18           # corners to 82%: a plate set into the page, not a slab


def parse_triple(text, name):
    parts = [p.strip() for p in text.split(",")]
    if len(parts) != 3:
        sys.exit(f"--{name} needs three comma-separated numbers, got {text!r}")
    try:
        return tuple(int(float(p)) for p in parts)
    except ValueError:
        sys.exit(f"--{name} needs three numbers, got {text!r}")


def crop_box(args, w, h):
    """Resolve the square crop, preferring --face and falling back to --box."""
    if args.box:
        l, t, side = parse_triple(args.box, "box")
        if l < 0 or t < 0 or l + side > w or t + side > h:
            sys.exit(
                f"--box {l},{t},{side} runs outside the {w}x{h} photo. "
                f"Largest usable side at that corner is {min(w - l, h - t)}."
            )
        return l, t, side

    cx, eye_y, head_h = parse_triple(args.face, "face")
    side = int(round(head_h / args.head_frac))
    l = int(round(cx - side / 2 + args.dx))
    t = int(round(eye_y - args.eye_line * side))

    # keep the square inside the photo rather than cropping empty pixels
    clamped = min(side, w - l, h - t)
    if clamped < side:
        print(
            f"note: crop clamped from {side}px to {clamped}px to stay inside the photo. "
            f"Adjust --head-frac ({args.head_frac}) or --dx ({args.dx}) for a deliberate framing.",
            file=sys.stderr,
        )
        side = clamped
    l, t = max(0, l), max(0, t)
    return l, t, side


def vignette_mask(size, strength):
    """Radial falloff: 1.0 in the middle, (1 - strength) in the corners."""
    side = 64
    m = Image.new("L", (side, side), 255)
    px = m.load()
    mid = (side - 1) / 2
    for y in range(side):
        for x in range(side):
            nx, ny = (x - mid) / mid, (y - mid) / mid
            r = min(1.0, (nx * nx + ny * ny) ** 0.5 / 2 ** 0.5)
            px[x, y] = int(255 * (1 - strength * r ** 1.7))
    return m.resize(size, Image.LANCZOS)


def grade(im, tone):
    if tone == "color":
        return ImageEnhance.Contrast(im).enhance(1.04)

    g = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=1)
    g = ImageEnhance.Contrast(g).enhance(GRADE_CONTRAST)
    if GRADE_VIGNETTE:
        mask = vignette_mask(g.size, GRADE_VIGNETTE)
        g = Image.frombytes(
            "L", g.size, bytes((v * m) // 255 for v, m in zip(g.tobytes(), mask.tobytes()))
        )
    if tone == "neutral":
        return g.convert("RGB")
    warm = ImageOps.colorize(g, black=WARM_BLACK, white=WARM_WHITE).convert("RGB")
    return ImageEnhance.Color(warm).enhance(GRADE_CHROMA)


def parse_polygon(text):
    pts = []
    for pair in text.replace(";", " ").split():
        xy = pair.split(",")
        if len(xy) != 2:
            sys.exit(f"--subject-polygon wants 'x,y x,y ...' pairs, got {pair!r}")
        pts.append((int(float(xy[0])), int(float(xy[1]))))
    if len(pts) < 3:
        sys.exit("--subject-polygon needs at least three points")
    return pts


def auto_mask(crop, tol):
    """Cut the subject out of a plain background: estimate the background from the
    border ring, keep everything far enough from it, and fill any enclosed holes
    (a face is a hole inside a silhouette, not part of the background)."""
    w, h = crop.size
    step = max(1, min(w, h) // 40)
    ring = []
    for x in range(0, w, step):
        ring += [crop.getpixel((x, 0)), crop.getpixel((x, h - 1))]
    for y in range(0, h, step):
        ring += [crop.getpixel((0, y)), crop.getpixel((w - 1, y))]
    bg = tuple(int(statistics.median([p[i] for p in ring])) for i in range(3))

    diff = ImageChops.difference(crop, Image.new("RGB", crop.size, bg)).convert("L")
    mask = diff.point(lambda v: 255 if v > tol else 0)

    outside = ImageOps.invert(mask)
    ImageDraw.floodfill(outside, (0, 0), 128)
    holes = outside.point(lambda v: 255 if v > 200 else 0)
    filled = ImageChops.lighter(mask, holes)
    print(f"       background estimated as rgb{bg}, {100 - (sum(filled.histogram()[255:]) * 100 // (w * h)):.0f}% kept as subject")
    return filled


def write_subject(src, box, args):
    """Cut the subject out of the same crop, so the layer aligns with the plate exactly."""
    l, t, side = box
    crop = src.crop((l, t, l + side, t + side))
    if args.subject_polygon:
        pts = parse_polygon(args.subject_polygon)
        mask = Image.new("L", crop.size, 0)
        ImageDraw.Draw(mask).polygon([(x - l, y - t) for x, y in pts], fill=255)
    else:
        mask = auto_mask(crop, args.subject_tolerance)

    layer = grade(crop, args.tone).convert("RGBA")
    layer.putalpha(mask)
    layer = layer.resize((args.width, args.width), Image.LANCZOS)

    # Feather at OUTPUT resolution, where the number means what it says. Feathering in
    # crop pixels first looked the same in the script and did nothing in the hero: the
    # 1857px crop then shrinks to 512, so the old default of 1.2 was 0.14px once shown
    # at 224px. That left a hard alpha edge, and where the outline cuts through the
    # beard the near layer lands 1-3px off the plate, so the step showed as a seam.
    if args.subject_feather:
        layer.putalpha(layer.getchannel("A").filter(ImageFilter.GaussianBlur(args.subject_feather)))
    os.makedirs(os.path.dirname(args.subject) or ".", exist_ok=True)
    layer.save(args.subject)
    kb = os.path.getsize(args.subject) / 1024
    print(f"subject  -> {args.subject}  {args.width}x{args.width} with alpha, {kb:.0f} KB")
    return layer


def write_cutout_check(subject, out, bg=(255, 0, 200)):
    """The cutout on a loud background: any hole, halo or missing edge is obvious."""
    w = subject.width
    plate = Image.new("RGBA", (w, w), bg + (255,))
    Image.alpha_composite(plate, subject).convert("RGB").save(out, quality=92)
    print(f"cutout   -> {out}  (subject over magenta; edges and holes show up here)")


def write_guide(src, box, side, out):
    """Source photo with a pixel grid and the chosen crop drawn on it."""
    im = src.copy()
    d = ImageDraw.Draw(im)
    step = max(100, (max(im.size) // 10) // 50 * 50)
    label = (255, 90, 60)
    for x in range(0, im.width, step):
        d.line([(x, 0), (x, im.height)], fill=(255, 255, 255), width=2)
        d.text((x + 6, 8), str(x), fill=label)
    for y in range(0, im.height, step):
        d.line([(0, y), (im.width, y)], fill=(255, 255, 255), width=2)
        d.text((8, y + 6), str(y), fill=label)
    l, t, _ = box
    d.rectangle([l, t, l + side, t + side], outline=(90, 220, 120), width=max(3, side // 200))
    im.save(out)
    print(f"guide  -> {out}  (grid step {step}px, green box = the crop)")


def write_preview(portrait, out):
    """The portrait as the hero actually renders it: 224px on desktop above 112px on
    mobile, on the page's ink, so framing and tone can be judged before shipping."""
    big = portrait.resize((224, 224), Image.LANCZOS)
    small = big.resize((112, 112), Image.LANCZOS)
    pad, gap = 18, 26
    w = pad * 2 + 224
    h = 24 + pad + 224 + gap + 112 + pad
    sheet = Image.new("RGB", (w, h), (60, 58, 55))
    d = ImageDraw.Draw(sheet)
    d.rectangle([0, 0, w, 24], fill=(20, 19, 17))
    d.text((pad, 8), "portrait at hero size, on the page's ink", fill=(240, 236, 230))
    x, y = pad, 24 + pad
    d.rectangle([x - 12, y - 12, x + 224 + 12, y + 224 + 12], fill=INK)
    sheet.paste(big, (x, y))
    y += 224 + gap
    x += 56
    d.rectangle([x - 10, y - 10, x + 112 + 10, y + 112 + 10], fill=INK)
    sheet.paste(small, (x, y))
    d.text((pad, h - pad + 4), "bottom: 112px as on mobile", fill=(230, 226, 220))
    sheet.save(out, quality=92)
    print(f"preview -> {out}")


def main():
    ap = argparse.ArgumentParser(description="Frame a photo as the hero portrait.")
    ap.add_argument("--photo", required=True, help="source photograph (read in place, never copied)")
    ap.add_argument("--face", metavar="CX,EYE_Y,HEAD_H", help="head centre x, eye-line y, crown-to-chin height (px)")
    ap.add_argument("--box", metavar="L,T,SIDE", help="explicit square crop, instead of --face")
    ap.add_argument("--head-frac", type=float, default=0.58, help="head height as a fraction of the frame (default 0.58)")
    ap.add_argument("--eye-line", type=float, default=0.40, help="where the eyes sit from the top (default 0.40)")
    ap.add_argument("--dx", type=int, default=0, help="nudge the crop left/right in px")
    ap.add_argument("--tone", choices=("warm", "neutral", "color"), default="warm", help="tonal grade (default warm)")
    ap.add_argument("--width", type=int, default=512, help="output width; 448 covers the 224px card at 2x (default 512)")
    ap.add_argument("--out", default="public/portrait.webp", help="output path (default public/portrait.webp)")
    ap.add_argument("--subject", help="also write the subject layer for depth motion (alpha cutout of the same crop)")
    ap.add_argument("--subject-polygon", metavar="\"X,Y X,Y ...\"", help="outline in SOURCE pixels for the subject layer (use --guide to read it off)")
    ap.add_argument("--subject-tolerance", type=int, default=42, help="how far from the border colour counts as subject, for a plain background (default 42)")
    ap.add_argument("--subject-feather", type=float, default=6.0, help="alpha edge softening, in output px (default 6, which is 2.6px once shown at 224)")
    ap.add_argument("--cutout-check", help="write the cutout over a loud background so a bad edge is obvious")
    ap.add_argument("--guide", help="also write the source photo with a grid and the crop drawn on it")
    ap.add_argument("--preview", help="also write a sheet at the hero's real sizes, on the page's ink")
    args = ap.parse_args()

    if not args.face and not args.box:
        sys.exit("give either --face CX,EYE_Y,HEAD_H or --box L,T,SIDE (see --help)")

    src = Image.open(args.photo).convert("RGB")
    box = crop_box(args, src.width, src.height)
    l, t, side = box

    portrait = grade(src.crop((l, t, l + side, t + side)), args.tone)
    portrait = portrait.resize((args.width, args.width), Image.LANCZOS)
    if args.width < 448:
        print(f"note: {args.width}px is under 448, so the 224px card will upscale on retina screens.", file=sys.stderr)

    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    save_kwargs = {"quality": 86, "method": 6} if args.out.endswith(".webp") else {}
    portrait.save(args.out, **save_kwargs)
    kb = os.path.getsize(args.out) / 1024
    print(f"portrait -> {args.out}  {args.width}x{args.width}, {kb:.0f} KB")
    print(f"           crop {side}px square at ({l},{t}) from a {src.width}x{src.height} source, {args.tone} tone")

    if args.subject:
        layer = write_subject(src, box, args)
        if args.cutout_check:
            write_cutout_check(layer, args.cutout_check)
    if args.guide:
        write_guide(src, box, side, args.guide)
    if args.preview:
        write_preview(portrait, args.preview)

    print(f'\nPoint the hero at it in portfolio.config.json:\n  "photo": "/{os.path.basename(args.out)}"')


if __name__ == "__main__":
    main()
