import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muhammad Ishaq Khan Portfolio",
    short_name: "ishaq2321",
    description:
      "Portfolio of Muhammad Ishaq Khan (ishaq2321) — software engineer and ELTE Budapest Computer Science graduate.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0c0b",
    theme_color: "#0d0c0b",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
