import { readFile } from "node:fs/promises";
import path from "node:path";

const CANDIDATE_PATHS = [
  path.join(process.cwd(), "public", "landing-hero-power.png"),
  "/Users/philipschonbaum/.cursor/projects/Users-philipschonbaum-Desktop-ShiftBob-shiftbob-app/assets/hero-power-top-b4afe554-0656-4314-8751-fd67e159c45c.png",
];

async function getHeroImageBuffer() {
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
  const image = await getHeroImageBuffer();
  if (!image) {
    return new Response("Hero image not found", { status: 404 });
  }

  return new Response(image, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
