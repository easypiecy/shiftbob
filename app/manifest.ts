import type { MetadataRoute } from "next";
import { SHIFTBOB_SITE_ICON } from "@/src/lib/brand-assets";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShiftBob",
    short_name: "ShiftBob",
    description: "ShiftBob app",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#18181b",
    icons: [
      {
        src: SHIFTBOB_SITE_ICON,
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: SHIFTBOB_SITE_ICON,
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };
}
