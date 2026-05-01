import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  /**
   * Brug separat buildmappe lokalt i dev for at undgå korrupt/låst `.next` cache
   * som tidligere gav Turbopack panics og stale output.
   * I production (bl.a. Vercel) skal output være standard `.next`.
   */
  distDir: isDev ? ".next-turbo" : ".next",
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
