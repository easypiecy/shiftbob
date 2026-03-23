"use client";

import type { ReactNode } from "react";
import { AppTranslationsProvider } from "@/src/contexts/translations-context";
import { SupabaseSessionRefresh } from "@/src/components/supabase-session-refresh";

export function AppRootProviders({
  children,
  translations,
}: {
  children: ReactNode;
  translations: Record<string, string>;
}) {
  return (
    <AppTranslationsProvider initialMap={translations}>
      <SupabaseSessionRefresh />
      {children}
    </AppTranslationsProvider>
  );
}
