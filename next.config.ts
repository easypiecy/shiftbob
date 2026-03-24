import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Browsere henter stadig `/favicon.ico` — samme som metadata icons (`/ikon.jpg`). */
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/ikon.jpg",
      },
    ];
  },
};

export default nextConfig;
