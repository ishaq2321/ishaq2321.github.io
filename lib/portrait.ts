import { existsSync } from "node:fs";
import path from "node:path";

import { config } from "@/lib/config";
import type { Portrait } from "@/app/types";

/**
 * Resolve the hero portrait against what is actually in `public/`.
 *
 * The photograph is deliberately not in this repository — it is generated locally by
 * `scripts/prepare-portrait.py` and injected into the deploy from repository secrets
 * (see README, "Your photograph"). So `config.photo` is a *requested* path, and on a
 * fork, in a pull request, or on any machine without the file, it does not exist.
 *
 * Handing a missing path to `<Image>` would ship a broken image and a 404 in every
 * visitor's console, so the path is dropped here instead and the hero falls back to
 * the monogram it already renders when there is no photo. Resolving at build time
 * (not in the browser) is what makes this work in a static export.
 */
export function resolvePortrait(): Portrait {
  const inPublic = (file?: string) =>
    file ? path.join(process.cwd(), "public", file.replace(/^\//, "")) : undefined;

  const present = (file?: string) => {
    const target = inPublic(file);
    return target && existsSync(target) ? file : undefined;
  };

  return {
    photo: present(config.photo),
    // The cutout is a near layer for depth motion; without the plate it is pointless.
    photoHead: present(config.photo) ? present(config.photoHead) : undefined,
  };
}
