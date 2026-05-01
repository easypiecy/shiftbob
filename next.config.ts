import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Brug separat buildmappe for at undgå korrupt/låst `.next` cache
   * som tidligere gav Turbopack panics og stale output.
   */
  distDir: ".next-turbo",
  experimental: {
    /**
     * Deaktiver persistent FS-cache i dev for at sikre frisk rebuild
     * ved hver Turbopack-session.
     */
    turbopackFileSystemCacheForDev: false,
  },
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
