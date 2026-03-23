"use client";

import { useCallback, useId, useState } from "react";
import { FileUp } from "lucide-react";
import { useTranslations } from "@/src/contexts/translations-context";

type Props = {
  /** f.eks. ".pdf,.doc,.docx" eller "text/csv" */
  accept: string;
  /** Kort label ved filvælger */
  fileInputLabel: string;
  /** Ekstra hjælpetekst under zonen */
  hint?: string;
  /** Sæt til false hvis siden viser én fælles beta-besked (fx flere paneler) */
  showBetaNotice?: boolean;
};

export function AdminDocumentUploadPanel({
  accept,
  fileInputLabel,
  hint,
  showBetaNotice = true,
}: Props) {
  const { t } = useTranslations();
  const inputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const onFile = useCallback((f: File | null) => {
    setFile(f);
  }, []);

  return (
    <div className="mt-6">
      <label
        htmlFor={inputId}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        className={
          dragActive
            ? "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-400 bg-zinc-100 px-6 py-12 transition dark:border-zinc-500 dark:bg-zinc-800/80"
            : "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-300 bg-white px-6 py-12 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900/50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
        }
      >
        <FileUp
          className="h-10 w-10 text-zinc-400 dark:text-zinc-500"
          aria-hidden
        />
        <span className="text-center text-sm font-medium text-zinc-800 dark:text-zinc-100">
          {fileInputLabel}
        </span>
        <span className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          {t("upload.dropzone.cta")}
        </span>
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            onFile(f);
          }}
        />
      </label>
      {file ? (
        <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
          <span className="font-medium">{t("upload.selected_prefix")}</span>{" "}
          {file.name}
        </p>
      ) : null}
      {hint ? (
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      ) : null}
      {showBetaNotice ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
          {t("upload.beta_notice")}
        </p>
      ) : null}
    </div>
  );
}
