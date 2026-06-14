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
  const preferFallbackInDev =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_SHIFTBOB_DEV_TRANSLATIONS_FROM_DB !== "1";
  const t = useCallback(
    (key: string, fallback?: string) => {
      const fromMap = map[key];
      if (fromMap != null && fromMap !== "") {
        return fromMap;
      }
      if (preferFallbackInDev && typeof fallback === "string") {
        return fallback;
      }
      return fallback ?? key;
    },
    [map, preferFallbackInDev]
  );
  return useMemo(() => ({ t, map }), [t, map]);
}
