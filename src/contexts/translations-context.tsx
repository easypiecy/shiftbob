"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

const TranslationsContext = createContext<Record<string, string>>({});

export function AppTranslationsProvider({
  children,
  initialMap,
}: {
  children: ReactNode;
  initialMap: Record<string, string>;
}) {
  return (
    <TranslationsContext.Provider value={initialMap}>
      {children}
    </TranslationsContext.Provider>
  );
}

export function useTranslations() {
  const map = useContext(TranslationsContext);
  const t = useCallback(
    (key: string, fallback?: string) => map[key] ?? fallback ?? key,
    [map]
  );
  return useMemo(() => ({ t, map }), [t, map]);
}
