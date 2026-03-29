"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

const TranslationsContext = createContext<Record<string, string>>({});

const UiLanguageContext = createContext<string>("en-US");

export function AppTranslationsProvider({
  children,
  initialMap,
  uiLanguage = "en-US",
}: {
  children: ReactNode;
  initialMap: Record<string, string>;
  /** BCP 47 sprogkode — matcher cookie / html lang; bruges til Intl i klientkomponenter. */
  uiLanguage?: string;
}) {
  return (
    <UiLanguageContext.Provider value={uiLanguage}>
      <TranslationsContext.Provider value={initialMap}>
        {children}
      </TranslationsContext.Provider>
    </UiLanguageContext.Provider>
  );
}

export function useUiLanguage(): string {
  return useContext(UiLanguageContext);
}

export function useTranslations() {
  const map = useContext(TranslationsContext);
  const t = useCallback(
    (key: string, fallback?: string) => map[key] ?? fallback ?? key,
    [map]
  );
  return useMemo(() => ({ t, map }), [t, map]);
}
