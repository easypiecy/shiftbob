import { readFile } from "node:fs/promises";
import path from "node:path";

const CANDIDATE_PATHS = [
  path.join(process.cwd(), "public", "landing-eu-compliance.png"),
  "/Users/philipschonbaum/.cursor/projects/Users-philipschonbaum-Desktop-ShiftBob-shiftbob-app/assets/eu-429e59b6-fb07-4580-a31f-8fec433ee8c8.png",
];

async function getEuComplianceImageBuffer() {
  for (const candidate of CANDIDATE_PATHS) {
    try {
      const buffer = await readFile(candidate);
      return buffer;
    } catch {
      // Try next path.
    }
  }
  return null;
}

export async function GET() {
  const image = await getEuComplianceImageBuffer();
  if (!image) {
    return new Response("EU compliance image not found", { status: 404 });
  }

  return new Response(image, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
