import type { MetadataRoute } from "next";

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
        src: "/ShiftBob-logo-90-light-512-trans.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/ShiftBob-logo-90-light-512-trans.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
