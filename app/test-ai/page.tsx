"use client";

import { useCallback, useState } from "react";
import Link from "next/link";

const DEFAULT_PAYLOAD = {
  employees: ["Alice", "Bob", "Carol"],
  num_shifts: 5,
  max_shifts_per_employee: 2,
};

export default function TestAiPage() {
  const [loading, setLoading] = useState(false);
  const [solverJson, setSolverJson] = useState<string | null>(null);
  const [geminiText, setGeminiText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runPipeline = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSolverJson(null);
    setGeminiText(null);

    try {
      const solverRes = await fetch("/api/solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_PAYLOAD),
      });
      const solverData = (await solverRes.json()) as Record<string, unknown>;
      setSolverJson(JSON.stringify(solverData, null, 2));

      if (!solverRes.ok) {
        setError(
          typeof solverData.error === "string"
            ? solverData.error
            : "OR-Tools-kald fejlede."
        );
        return;
      }

      const explainRes = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleData: solverData }),
      });
      const explainData = (await explainRes.json()) as {
        ok?: boolean;
        text?: string;
        error?: string;
      };

      if (!explainRes.ok || !explainData.ok) {
        setError(explainData.error ?? "Gemini-kald fejlede.");
        return;
      }
      setGeminiText(explainData.text ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Netværksfejl.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-full flex-1 bg-zinc-50 px-4 py-10 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Hybrid AI — proof of concept
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            1) OR-Tools (Python) finder et lovligt skema. 2) Gemini formidler
            resultatet til en kort leder-tekst. Kræver{" "}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
              GEMINI_API_KEY
            </code>{" "}
            i miljøet og Python med{" "}
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
              ortools
            </code>{" "}
            installeret for solver-endpoint.
          </p>
        </div>

        <button
          type="button"
          onClick={runPipeline}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Kører pipeline…" : "Kør OR-Tools + Gemini"}
        </button>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100"
          >
            {error}
          </div>
        )}

        {solverJson && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Rå JSON (OR-Tools)
            </h2>
            <pre className="mt-2 max-h-80 overflow-auto rounded-lg border border-zinc-200 bg-white p-4 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
              {solverJson}
            </pre>
          </section>
        )}

        {geminiText && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Gemini — leder-rapport
            </h2>
            <div className="mt-2 whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
              {geminiText}
            </div>
          </section>
        )}

        <p className="text-sm text-zinc-500">
          <Link href="/" className="underline">
            Tilbage til forsiden
          </Link>
        </p>
      </div>
    </div>
  );
}
