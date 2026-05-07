"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange, CheckCircle2, FileSpreadsheet, Loader2, ShieldCheck } from "lucide-react";
import { getActiveWorkplaceIdFromCookie } from "@/src/lib/workplaces";
import {
  approveSpreadsheetPlanAction,
  runSpreadsheetImportAction,
  type ApproveSpreadsheetPlanResult,
  type SpreadsheetExtractResult,
} from "./actions";

type ImportRun = {
  id: string;
  createdAt: string;
  fileName: string;
  selectedMonth: number;
  selectedYear: number;
  approvedAt?: string | null;
  result: Extract<SpreadsheetExtractResult, { ok: true }>;
};

export function ImportSpreadsheetClient() {
  const router = useRouter();
  const activeWorkplaceId = getActiveWorkplaceIdFromCookie();
  const storageKey = activeWorkplaceId
    ? `shiftbob.importHistory.${activeWorkplaceId}`
    : "shiftbob.importHistory.unknown";
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [importMissingEmployees, setImportMissingEmployees] = useState(true);
  const [insertShifts, setInsertShifts] = useState(true);
  const [runEuComplianceCheck, setRunEuComplianceCheck] = useState(true);
  const [importRuns, setImportRuns] = useState<ImportRun[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as { runs?: ImportRun[] } | null;
      return Array.isArray(parsed?.runs) ? parsed.runs : [];
    } catch {
      return [];
    }
  });
  const [violationsModalRun, setViolationsModalRun] = useState<ImportRun | null>(null);
  const [approveSummary, setApproveSummary] = useState<ApproveSpreadsheetPlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [approving, startApproveTransition] = useTransition();
  const latestResult = importRuns[0]?.result ?? null;

  const canStart = useMemo(
    () =>
      file !== null &&
      (importMissingEmployees || insertShifts || runEuComplianceCheck),
    [file, importMissingEmployees, insertShifts, runEuComplianceCheck]
  );

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, idx) => ({
        value: idx + 1,
        label: new Date(2000, idx, 1).toLocaleString("da-DK", { month: "long" }),
      })),
    []
  );

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return [current - 1, current, current + 1, current + 2];
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ runs: importRuns }));
    } catch {
      // Ignore storage quota / private mode errors.
    }
  }, [storageKey, importRuns]);

  function handleStartImport() {
    if (!file) return;
    const companyId = activeWorkplaceId;
    if (!companyId) {
      setError("Ingen aktiv arbejdsplads valgt.");
      return;
    }

    setError(null);
    setApproveSummary(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("companyId", companyId);
      fd.set("selectedMonth", String(selectedMonth));
      fd.set("selectedYear", String(selectedYear));
      fd.set("runEuComplianceCheck", String(runEuComplianceCheck));

      const result = await runSpreadsheetImportAction(fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      const run: ImportRun = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        fileName: file.name,
        selectedMonth,
        selectedYear,
        result,
      };
      setImportRuns((prev) => [run, ...prev]);
      if (runEuComplianceCheck && result.euViolations.length > 0) {
        setViolationsModalRun(run);
      }
    });
  }

  function undoRun(runId: string) {
    const next = importRuns.filter((run) => run.id !== runId);
    setImportRuns(next);
    if (violationsModalRun?.id === runId) {
      setViolationsModalRun(null);
    }
  }

  function openViolationsForRun(runId: string) {
    const run = importRuns.find((item) => item.id === runId);
    if (!run || run.result.euViolations.length === 0) return;
    setViolationsModalRun(run);
  }

  function handleApproveSchedule() {
    const run = violationsModalRun;
    if (!run) return;
    if (run.approvedAt) return;
    const companyId = activeWorkplaceId;
    if (!companyId) {
      setError("Ingen aktiv arbejdsplads valgt.");
      return;
    }
    setError(null);
    setApproveSummary(null);
    startApproveTransition(async () => {
      const res = await approveSpreadsheetPlanAction({
        companyId,
        selectedMonth: run.selectedMonth,
        selectedYear: run.selectedYear,
        extractedEmployees: run.result.extractedEmployees,
        extractedShiftTypes: run.result.extractedShiftTypes,
        extractedShifts: run.result.extractedShifts,
      });
      setApproveSummary(res);
      if (res.ok) {
        setImportRuns((prev) =>
          prev.map((item) =>
            item.id === run.id
              ? { ...item, approvedAt: new Date().toISOString() }
              : item
          )
        );
        setViolationsModalRun((prev) =>
          prev && prev.id === run.id
            ? { ...prev, approvedAt: new Date().toISOString() }
            : prev
        );
        setViolationsModalRun(null);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 px-3 py-6 dark:bg-zinc-950 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Hent regneark
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Vælg fil med knappen herunder, vælg måned/år, og kør importmotoren. Importhistorik vises nederst
            med fortryd.
          </p>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          {file ? (
            <p className="text-base font-semibold text-zinc-800 dark:text-zinc-100 sm:text-lg">
              Valgt fil: {file.name}
              {" · "}
              <button
                type="button"
                onClick={() => setFile(null)}
                className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Fortryd
              </button>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <FileSpreadsheet className="h-4 w-4 shrink-0" aria-hidden />
              Hent Shiftbob Excel fil
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="sr-only"
          />
          {!file ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Ingen fil valgt endnu.</p>
          ) : null}
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            <CalendarRange className="h-4 w-4" aria-hidden />
            Måned og år
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-300">
                Måned
              </span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-300">
                År
              </span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Importhandlinger
          </h2>
          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={importMissingEmployees}
                onChange={(e) => setImportMissingEmployees(e.target.checked)}
                className="mt-0.5 rounded border-zinc-300"
              />
              <span>Importer medarbejdere, som ikke allerede findes</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={insertShifts}
                onChange={(e) => setInsertShifts(e.target.checked)}
                className="mt-0.5 rounded border-zinc-300"
              />
              <span>Indsæt vagter i kalenderen for den valgte periode</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={runEuComplianceCheck}
                onChange={(e) => setRunEuComplianceCheck(e.target.checked)}
                className="mt-0.5 rounded border-zinc-300"
              />
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Kør EU-regelcheck (fx hviletid / overlap)
              </span>
            </label>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!canStart || pending}
            onClick={handleStartImport}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Kører import…
              </span>
            ) : (
              "Start import"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Til kalender
          </button>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100">
            {error}
          </div>
        ) : null}

        {latestResult ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100">
            <p className="inline-flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Import gennemført fra fanen: {latestResult.matchedSheet}
            </p>
            <ul className="mt-2 list-inside list-disc space-y-0.5 text-sm">
              <li>Medarbejdere: {latestResult.extractedEmployees.length}</li>
              <li>Vagttyper: {latestResult.extractedShiftTypes.length}</li>
              <li>Vagter: {latestResult.extractedShifts.length}</li>
              <li>EU-overskridelser: {latestResult.euViolations.length}</li>
              <li>Advarsler: {latestResult.warnings.length}</li>
            </ul>
          </div>
        ) : null}

        {approveSummary?.ok ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100">
            <p className="font-semibold">Vagtplan godkendt og indsat i systemet.</p>
            <ul className="mt-2 list-inside list-disc space-y-0.5">
              <li>Oprettede afdelinger: {approveSummary.createdDepartments}</li>
              <li>Oprettede medarbejdere: {approveSummary.createdEmployees}</li>
              <li>Indsatte vagter: {approveSummary.insertedShifts}</li>
            </ul>
          </div>
        ) : null}

        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Importhistorik
          </h2>
          {importRuns.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Ingen importer endnu.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {importRuns.map((run) => (
                <li
                  key={run.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950/50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-800 dark:text-zinc-100">
                      {run.fileName}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {run.selectedMonth}/{run.selectedYear} · ansatte {run.result.extractedEmployees.length} ·
                      vagter {run.result.extractedShifts.length} · EU-fejl{" "}
                      {run.result.euViolations.length}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(run.createdAt).toLocaleString("da-DK")}
                      {run.approvedAt ? (
                        <>{" · "}Godkendt {new Date(run.approvedAt).toLocaleString("da-DK")}</>
                      ) : null}
                      {run.result.euViolations.length > 0 ? (
                        <>
                          {" · "}
                          <button
                            type="button"
                            onClick={() => openViolationsForRun(run.id)}
                            className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            Se EU-overtrædelser igen
                          </button>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => undoRun(run.id)}
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    Fortryd
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      {violationsModalRun && violationsModalRun.result.euViolations.length > 0 ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-4xl rounded-xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              EU-regeloverskridelser fundet
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Følgende vagter overskrider regler:
            </p>
            <div className="mt-4 max-h-[50vh] overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Navn</th>
                    <th className="px-3 py-2 font-semibold">Dato</th>
                    <th className="px-3 py-2 font-semibold">Tidspunkt</th>
                    <th className="px-3 py-2 font-semibold">Regel overskredet</th>
                  </tr>
                </thead>
                <tbody>
                  {violationsModalRun.result.euViolations.map((v, idx) => (
                    <tr key={`${v.employee_name}-${v.date}-${idx}`} className="border-t border-zinc-200 dark:border-zinc-700">
                      <td className="px-3 py-2">{v.employee_name}</td>
                      <td className="px-3 py-2">{v.date}</td>
                      <td className="px-3 py-2">{v.time_range}</td>
                      <td className="px-3 py-2">{v.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={handleApproveSchedule}
                disabled={approving || Boolean(violationsModalRun.approvedAt)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {violationsModalRun.approvedAt ? (
                  "Allerede godkendt"
                ) : approving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Godkender…
                  </span>
                ) : (
                  "Godkend vagtplan"
                )}
              </button>
              <button
                type="button"
                disabled
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-400 dark:border-zinc-700 dark:text-zinc-500"
              >
                Ret automatisk
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Gå til vagtplan kalenderen
              </button>
              <button
                type="button"
                onClick={() => setViolationsModalRun(null)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Luk
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
