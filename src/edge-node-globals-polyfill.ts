/**
 * Edge Runtime har ikke `__dirname` / `__filename`. Next.js’ bundlede `cookie`
 * (via `next/server` → `NextResponse`) kan evaluere `__nccwpck_require__.ab = __dirname + "/"`,
 * hvilket giver `ReferenceError: __dirname is not defined` på Vercel.
 * Denne fil skal importeres som første sideeffekt i `src/proxy.ts` (før `next/server`).
 */
const g = globalThis as typeof globalThis & {
  __dirname?: string;
  __filename?: string;
};

if (typeof g.__dirname === "undefined") {
  g.__dirname = "/";
}
if (typeof g.__filename === "undefined") {
  g.__filename = "/proxy.js";
}
