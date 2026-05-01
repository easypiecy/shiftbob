import { readFile } from "node:fs/promises";
import path from "node:path";

const CANDIDATE_PATHS = [
  path.join(process.cwd(), "public", "landing-logo.png"),
  "/Users/philipschonbaum/.cursor/projects/Users-philipschonbaum-Desktop-ShiftBob-shiftbob-app/assets/ShiftBob-circle-logo-light-300x-fd4719b0-7222-4c6e-8536-1e347c347757.png",
];

async function getLogoBuffer() {
  for (const candidate of CANDIDATE_PATHS) {
    try {
      const buffer = await readFile(candidate);
      return buffer;
    } catch {
      // Try next path until we find an available image.
    }
  }
  return null;
}

export async function GET() {
  const image = await getLogoBuffer();
  if (!image) {
    return new Response("Logo not found", { status: 404 });
  }

  return new Response(image, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
