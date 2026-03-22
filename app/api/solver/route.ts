import { spawnSync } from "child_process";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolvePython(): string {
  if (process.env.PYTHON_PATH) return process.env.PYTHON_PATH;
  return process.platform === "win32" ? "python" : "python3";
}

/**
 * Kalder api/solver.py (OR-Tools) via subprocess. Kræver Python 3 + pip install -r api/requirements.txt lokalt.
 * På Vercel Node-serverless findes Python/ortools typisk ikke — brug ekstern Python-tjeneste eller self-hosted.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const script = join(
    /* turbopackIgnore: true */ process.cwd(),
    "api",
    "solver.py"
  );
  const python = resolvePython();

  const result = spawnSync(python, [script, "--stdin"], {
    input: body,
    encoding: "utf-8",
    maxBuffer: 10 * 1024 * 1024,
    env: { ...process.env },
  });

  if (result.error) {
    return Response.json(
      {
        ok: false,
        error: `Kunne ikke starte Python: ${result.error.message}. Sæt PYTHON_PATH eller installer Python 3 og kør: pip install -r api/requirements.txt`,
      },
      { status: 500 }
    );
  }

  if (result.status !== 0) {
    return Response.json(
      {
        ok: false,
        error: result.stderr || "solver.py afsluttede med fejl",
        stderr: result.stderr,
        stdout: result.stdout,
      },
      { status: 500 }
    );
  }

  try {
    const json = JSON.parse(result.stdout) as unknown;
    return Response.json(json);
  } catch {
    return Response.json(
      {
        ok: false,
        error: "Ugyldigt JSON fra solver",
        stdout: result.stdout,
      },
      { status: 500 }
    );
  }
}
