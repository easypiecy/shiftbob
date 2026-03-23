"use client";

import type { ReactNode } from "react";
import { AppTranslationsProvider } from "@/src/contexts/translations-context";

export function AppRootProviders({
  children,
  translations,
}: {
  children: ReactNode;
  translations: Record<string, string>;
}) {
  return (
    <AppTranslationsProvider initialMap={translations}>
      {children}
    </AppTranslationsProvider>
  );
}
