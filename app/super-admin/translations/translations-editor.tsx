"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  loadTargetTexts,
  saveTranslation,
  translateEmptyBatch,
  translateWithAI,
} from "@/src/app/super-admin/translations/actions";

export type LanguageOption = {
  language_code: string;
  name: string;
};

export type SourceRow = {
  translation_key: string;
  context_description: string;
  text_value: string;
};

type Props = {
  languages: LanguageOption[];
  sourceRows: SourceRow[];
};

const SOURCE_LANG = "en-US";

export default function TranslationsEditor({ languages, sourceRows }: Props) {
  const targetOptions = useMemo(
    () => languages.filter((l) => l.language_code !== SOURCE_LANG),
    [languages]
  );

  const [targetLang, setTargetLang] = useState<string>(() => {
    const first = targetOptions[0]?.language_code;
    return first ?? "";
  });

  /** Sikrer målsprog når props først er klar (undgår tom tabel ved edge case). */
  useEffect(() => {
    if (targetLang) return;
    const first = targetOptions[0]?.language_code;
    if (first) setTargetLang(first);
  }, [targetLang, targetOptions]);

  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [batchRunning, setBatchRunning] = useState(false);
  const [keyPrefix, setKeyPrefix] = useState("");
  const [batchProgress, setBatchProgress] = useState<{
    langIndex: number;
    langTotal: number;
    langCode: string;
    rowCurrent: number;
    rowTotal: number;
  } | null>(null);

  const targetLabel =
    targetOptions.find((l) => l.language_code === targetLang)?.name ??
    targetLang;

  useEffect(() => {
    if (!targetLang) return;
    let cancelled = false;
    setLoadError(null);
    (async () => {
      const res = await loadTargetTexts(targetLang);
      if (cancelled) return;
      if (!res.ok) {
        setLoadError(res.error);
        return;
      }
      setInputs(res.map);
    })();
    return () => {
      cancelled = true;
    };
  }, [targetLang]);

  const setInput = useCallback((key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const runAi = useCallback(
    async (row: SourceRow) => {
      setMessage(null);
      setLoadingMap((m) => ({ ...m, [row.translation_key]: true }));
      try {
        const res = await translateWithAI(
          row.text_value,
          row.context_description,
          targetLabel
        );
        if (!res.ok) {
          setMessage(res.error);
          return;
        }
        setInput(row.translation_key, res.text);
      } finally {
        setLoadingMap((m) => ({ ...m, [row.translation_key]: false }));
      }
    },
    [setInput, targetLabel]
  );

  const filteredSourceRows = useMemo(() => {
    const prefix = keyPrefix.trim();
    if (!prefix) return sourceRows;
    return sourceRows.filter((row) => row.translation_key.startsWith(prefix));
  }, [keyPrefix, sourceRows]);

  const emptyCountForTarget = useMemo(() => {
    return filteredSourceRows.filter((row) => {
      const v = String(inputs[row.translation_key] ?? "").trim();
      return row.text_value.trim() && !v;
    }).length;
  }, [filteredSourceRows, inputs]);

  const runBatchForLanguage = useCallback(
    async (
      langCode: string,
      langLabel: string,
      langIndex: number,
      langTotal: number
    ) => {
      let offset = 0;
      let langFilled = 0;
      let langProcessed = 0;
      let totalEmpty = 0;
      const langErrors: string[] = [];

      while (true) {
        const batch = await translateEmptyBatch({
          languageCode: langCode,
          languageLabel: langLabel,
          offset,
          keyPrefix: keyPrefix.trim() || undefined,
        });

        if (!batch.ok) {
          langErrors.push(`${langCode}: ${batch.error}`);
          break;
        }

        totalEmpty = batch.totalEmpty;
        langFilled += batch.filled;
        langProcessed += batch.processed;
        offset = batch.nextOffset;
        langErrors.push(...batch.errors);

        setBatchProgress({
          langIndex,
          langTotal,
          langCode,
          rowCurrent: Math.min(offset, batch.totalEmpty),
          rowTotal: batch.totalEmpty,
        });

        if (!batch.hasMore) break;
      }

      return {
        langFilled,
        langProcessed,
        totalEmpty,
        langErrors,
      };
    },
    [keyPrefix, targetLang]
  );

  const handleFillAllEmptyAllLanguages = useCallback(async () => {
    if (targetOptions.length === 0) return;
    setMessage(null);
    setBatchRunning(true);
    let filled = 0;
    let processedRows = 0;
    const errors: string[] = [];

    for (let li = 0; li < targetOptions.length; li++) {
      const opt = targetOptions[li];
      const langCode = opt.language_code;
      const langLabel = opt.name;

      const result = await runBatchForLanguage(
        langCode,
        langLabel,
        li + 1,
        targetOptions.length
      );

      if (result.totalEmpty === 0) {
        setBatchProgress({
          langIndex: li + 1,
          langTotal: targetOptions.length,
          langCode,
          rowCurrent: 0,
          rowTotal: 0,
        });
        continue;
      }

      filled += result.langFilled;
      processedRows += result.langProcessed;
      errors.push(...result.langErrors);
    }

    setBatchRunning(false);
    setBatchProgress(null);

    if (targetLang) {
      const reload = await loadTargetTexts(targetLang);
      if (reload.ok) {
        setInputs(reload.map);
      }
    }

    if (processedRows === 0) {
      setMessage(
        keyPrefix.trim()
          ? `Ingen tomme oversættelser for prefix "${keyPrefix.trim()}" på noget målsprog.`
          : "Ingen tomme oversættelser på noget målsprog."
      );
      return;
    }
    if (errors.length === 0) {
      setMessage(
        `Færdig: ${filled} oversættelser gemt på tværs af ${targetOptions.length} målsprog.`
      );
    } else {
      const preview = errors.slice(0, 5).join(" · ");
      setMessage(
        `Gemt ${filled} af ${processedRows} forsøg. ${errors.length} fejl: ${preview}${
          errors.length > 5 ? " …" : ""
        }`
      );
    }
  }, [keyPrefix, runBatchForLanguage, targetLang, targetOptions]);

  const handleFillEmptyForSelectedLanguage = useCallback(async () => {
    if (!targetLang) return;
    const opt = targetOptions.find((l) => l.language_code === targetLang);
    if (!opt) return;

    setMessage(null);
    setBatchRunning(true);
    let filled = 0;
    let processedRows = 0;
    const errors: string[] = [];

    const result = await runBatchForLanguage(
      opt.language_code,
      opt.name,
      1,
      1
    );

    filled += result.langFilled;
    processedRows += result.langProcessed;
    errors.push(...result.langErrors);

    setBatchRunning(false);
    setBatchProgress(null);

    const reload = await loadTargetTexts(targetLang);
    if (reload.ok) {
      setInputs(reload.map);
    }

    if (result.totalEmpty === 0) {
      setMessage(
        keyPrefix.trim()
          ? `Ingen tomme felter for "${keyPrefix.trim()}" på ${targetLang}.`
          : `Ingen tomme felter på ${targetLang}.`
      );
      return;
    }
    if (errors.length === 0) {
      setMessage(`Færdig: ${filled} oversættelser gemt for ${targetLang}.`);
      return;
    }
    const preview = errors.slice(0, 5).join(" · ");
    setMessage(
      `Gemt ${filled} af ${processedRows} forsøg for ${targetLang}. ${errors.length} fejl: ${preview}${
        errors.length > 5 ? " …" : ""
      }`
    );
  }, [keyPrefix, runBatchForLanguage, targetLang, targetOptions]);

  const runSave = useCallback(
    async (row: SourceRow) => {
      setMessage(null);
      setSavingKey(row.translation_key);
      try {
        const textValue = inputs[row.translation_key] ?? "";
        const res = await saveTranslation({
          translationKey: row.translation_key,
          languageCode: targetLang,
          textValue,
          contextDescription: row.context_description,
        });
        if (!res.ok) {
          setMessage(res.error);
          return;
        }
        setMessage("Gemt.");
      } finally {
        setSavingKey(null);
      }
    },
    [inputs, targetLang]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sprog &amp; oversættelser
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Kildesprog er altid{" "}
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              {SOURCE_LANG}
            </span>
            . Vælg målsprog og rediger eller brug AI. Batch udfylder kun tomme felter
            (4 ad gangen med pause mod Gemini rate limits).
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="key-prefix"
              className="text-xs font-medium uppercase tracking-wide text-zinc-500"
            >
              Nøgle-filter
            </label>
            <input
              id="key-prefix"
              type="text"
              value={keyPrefix}
              onChange={(e) => setKeyPrefix(e.target.value)}
              disabled={batchRunning}
              placeholder="fx landing4."
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="target-lang"
              className="text-xs font-medium uppercase tracking-wide text-zinc-500"
            >
              Målsprog
            </label>
            <select
              id="target-lang"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              disabled={batchRunning}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {targetOptions.map((l) => (
                <option key={l.language_code} value={l.language_code}>
                  {l.name} ({l.language_code})
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => void handleFillEmptyForSelectedLanguage()}
            disabled={
              !targetLang ||
              batchRunning ||
              savingKey !== null ||
              emptyCountForTarget === 0
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-300 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-900 shadow-sm transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-100 dark:hover:bg-violet-900/30"
          >
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
            {batchRunning && batchProgress
              ? batchProgress.rowTotal === 0
                ? `${batchProgress.langCode} · ingen tomme`
                : `${batchProgress.langCode} ${batchProgress.rowCurrent}/${batchProgress.rowTotal}`
              : `AI tomme (${emptyCountForTarget})`}
          </button>
          <button
            type="button"
            onClick={() => void handleFillAllEmptyAllLanguages()}
            disabled={
              targetOptions.length === 0 ||
              batchRunning ||
              savingKey !== null
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-300 bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-800 dark:bg-violet-700 dark:hover:bg-violet-600"
          >
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
            {batchRunning && batchProgress
              ? batchProgress.rowTotal === 0
                ? `${batchProgress.langCode} · ingen tomme · sprog ${batchProgress.langIndex}/${batchProgress.langTotal}`
                : `${batchProgress.langCode} ${batchProgress.rowCurrent}/${batchProgress.rowTotal} · sprog ${batchProgress.langIndex}/${batchProgress.langTotal}`
              : "AI for alle tomme (alle sprog)"}
          </button>
        </div>
      </div>

      {loadError && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
        >
          {loadError}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          {message}
        </div>
      )}

      {sourceRows.length === 0 && (
        <div
          role="status"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
        >
          <p className="font-medium">Ingen en-US kilderækker</p>
          <p className="mt-1 text-amber-900/90 dark:text-amber-200/90">
            Super Admin henter kun nøgler med{" "}
            <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/50">
              language_code = &apos;en-US&apos;
            </code>
            . Kør oversættelses-SQL mod <strong>samme</strong> Supabase-projekt som
            produktion, og tjek i SQL Editor:{" "}
            <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/50">
              select count(*) from ui_translations where language_code =
              &apos;en-US&apos;;
            </code>
          </p>
        </div>
      )}

      {!targetLang && targetOptions.length === 0 && languages.length === 0 && (
        <p className="text-sm text-zinc-500">
          Ingen rækker i <span className="font-mono">languages</span> — kør
          i18n-setup (sprog + <span className="font-mono">eu_countries</span>).
        </p>
      )}

      {!targetLang && targetOptions.length === 0 && languages.length > 0 && (
        <p className="text-sm text-zinc-500">
          Kun <span className="font-mono">en-US</span> (eller intet målsprog) i{" "}
          <span className="font-mono">languages</span> — tilføj mindst ét andet
          sprog (fx <span className="font-mono">da</span>) via seed / SQL.
        </p>
      )}

      {targetLang && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Viser {filteredSourceRows.length} nøgler
          {keyPrefix.trim() ? ` med prefix "${keyPrefix.trim()}"` : ""}.{" "}
          {emptyCountForTarget} tomme på {targetLabel}.
        </p>
      )}

      {targetLang && (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  Nøgle
                </th>
                <th className="min-w-[12rem] px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  Kontekst
                </th>
                <th className="min-w-[10rem] px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  {SOURCE_LANG}
                </th>
                <th className="min-w-[14rem] px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  Målsprog ({targetLang})
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  Handlinger
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredSourceRows.map((row) => {
                const val = inputs[row.translation_key] ?? "";
                const busy = loadingMap[row.translation_key];
                const saving = savingKey === row.translation_key;
                return (
                  <tr key={row.translation_key}>
                    <td className="align-top px-4 py-3 font-mono text-xs text-zinc-800 dark:text-zinc-200">
                      {row.translation_key}
                    </td>
                    <td className="align-top px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {row.context_description}
                    </td>
                    <td className="align-top px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200">
                      {row.text_value}
                    </td>
                    <td className="align-top px-4 py-3">
                      <textarea
                        value={val}
                        onChange={(e) =>
                          setInput(row.translation_key, e.target.value)
                        }
                        rows={3}
                        className="w-full min-w-[12rem] rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                        placeholder="Oversættelse…"
                      />
                    </td>
                    <td className="align-top px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => runAi(row)}
                          disabled={busy || saving || batchRunning}
                          className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-xs font-medium text-violet-900 hover:bg-violet-100 disabled:opacity-50 dark:border-violet-900/60 dark:bg-violet-950/50 dark:text-violet-100 dark:hover:bg-violet-900/40"
                        >
                          <Sparkles className="h-3.5 w-3.5" aria-hidden />
                          {busy ? "…" : "AI"}
                        </button>
                        <button
                          type="button"
                          onClick={() => runSave(row)}
                          disabled={saving || busy || batchRunning}
                          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                          {saving ? "Gemmer…" : "Gem"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
