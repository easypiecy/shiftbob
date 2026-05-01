import { readFile } from "node:fs/promises";
import path from "node:path";

const CANDIDATE_PATHS = [
  path.join(process.cwd(), "public", "landing-employee-photo.png"),
  "/Users/philipschonbaum/.cursor/projects/Users-philipschonbaum-Desktop-ShiftBob-shiftbob-app/assets/employee_on-mob-a241a872-0615-4137-bf07-f20fd545a790.png",
];

async function getEmployeePhotoBuffer() {
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
  const image = await getEmployeePhotoBuffer();
  if (!image) {
    return new Response("Employee photo not found", { status: 404 });
  }

  return new Response(image, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
