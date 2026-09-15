import type { CSSProperties } from "react";
import Image from "next/image";
import type { Figure } from "@/app/types";

/**
 * A numbered plate: a real capture of the shipped product, mounted in a frame,
 * with a caption underneath. Numbering continues the "Fig. 01" convention the
 * hero portrait already uses, so the page reads as one illustrated monograph
 * rather than a page that happens to contain a screenshot.
 *
 * `aspect` comes from config and must match the file, so `object-cover` never
 * crops product UI.
 */
export function Plate({
  figure,
  fig,
  priority = false,
}: {
  figure: Figure;
  fig: string;
  priority?: boolean;
}) {
  // `native` caps the frame at the width the product actually renders at: a
  // plate is evidence, and a magnified capture stops being evidence.
  const frameStyle = figure.native
    ? ({ "--plate-native": `${figure.native}px` } as CSSProperties)
    : undefined;

  return (
    <figure className="plate">
      <div
        className="plate__frame"
        data-layout={figure.layout ?? "bleed"}
        data-scroll={figure.scroll ? "true" : undefined}
        style={frameStyle}
      >
        <div className="plate__media" style={{ aspectRatio: figure.aspect }}>
          <Image
            src={figure.src}
            alt={figure.alt}
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover"
            loading={priority ? undefined : "lazy"}
            priority={priority}
          />
        </div>
      </div>
      <figcaption className="plate__caption">
        <span className="plate__fig">Fig. {fig}</span>
        <span className="plate__text">{figure.caption}</span>
      </figcaption>
    </figure>
  );
}
