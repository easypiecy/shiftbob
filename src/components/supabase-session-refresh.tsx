"use client";

import { useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";

/**
 * Erstatter session-opfriskning i Edge-proxy (undgår __dirname i middleware).
 * Browser-klienten opdaterer cookies efter hydration.
 */
export function SupabaseSessionRefresh() {
  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getSession();
  }, []);

  return null;
}
