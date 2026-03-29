"use client";

import type { ReactNode } from "react";
import { AppTranslationsProvider } from "@/src/contexts/translations-context";
import { SupabaseSessionRefresh } from "@/src/components/supabase-session-refresh";

export function AppRootProviders({
  children,
  translations,
  uiLanguage,
}: {
  children: ReactNode;
  translations: Record<string, string>;
  uiLanguage: string;
}) {
  return (
    <AppTranslationsProvider initialMap={translations} uiLanguage={uiLanguage}>
      <SupabaseSessionRefresh />
      {children}
    </AppTranslationsProvider>
  );
}
