import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Browsere henter stadig `/favicon.ico` — vi bruger eksisterende PNG (samme som metadata icons). */
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/ShiftBob-circle-logo-dark-256.png",
      },
    ];
  },
};

export default nextConfig;
