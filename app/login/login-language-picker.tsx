"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setUiLanguageAction } from "@/src/app/ui-language-actions";
import {
  SUPPORTED_UI_LANGUAGE_CODES,
  UI_LANGUAGE_LABELS,
} from "@/src/lib/ui-language";

export function LoginLanguagePicker({
  currentLanguage,
  ariaLabel,
}: {
  currentLanguage: string;
  ariaLabel: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    if (next === currentLanguage) return;
    startTransition(async () => {
      await setUiLanguageAction(next);
      router.refresh();
    });
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 sm:right-6 sm:top-6">
      <Languages
        className="h-5 w-5 shrink-0 text-zinc-400"
        aria-hidden
        strokeWidth={1.75}
      />
      <label htmlFor="login-ui-language" className="sr-only">
        {ariaLabel}
      </label>
      <select
        id="login-ui-language"
        value={currentLanguage}
        onChange={onChange}
        disabled={pending}
        aria-label={ariaLabel}
        className="max-w-[min(18rem,calc(100vw-6rem))] rounded-md border border-zinc-200 bg-white py-1.5 pl-2 pr-8 text-sm text-zinc-800 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-60"
      >
        {SUPPORTED_UI_LANGUAGE_CODES.map((code) => (
          <option key={code} value={code}>
            {UI_LANGUAGE_LABELS[code] ?? code}
          </option>
        ))}
      </select>
    </div>
  );
}
