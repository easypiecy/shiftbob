"use client";

import Link from "next/link";
import { UiLanguageSelect } from "./login/login-language-picker";

export function HomeTopBar({
  currentLanguage,
  loginLabel,
  languageAriaLabel,
}: {
  currentLanguage: string;
  loginLabel: string;
  languageAriaLabel: string;
}) {
  return (
    <header className="fixed right-4 top-4 z-50 flex flex-wrap items-center justify-end gap-x-4 gap-y-2 sm:right-6 sm:top-6">
      <Link
        href="/login"
        className="text-sm font-semibold text-black underline-offset-4 hover:underline"
      >
        {loginLabel}
      </Link>
      <UiLanguageSelect
        currentLanguage={currentLanguage}
        ariaLabel={languageAriaLabel}
        id="home-ui-language"
        variant="light"
      />
    </header>
  );
}
