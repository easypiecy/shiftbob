"use server";

import { revalidatePath } from "next/cache";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
import { getAdminClient } from "@/src/utils/supabase/admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

async function requireSuperAdmin() {
  const supabase = await createServerSupabase();
  await assertSuperAdminAccess(supabase);
}

export type EuCountryRow = {
  country_code: string;
  name: string;
};

export type CountryHolidayRow = {
  id: string;
  country_code: string;
  stable_code: string;
  holiday_rule: "fixed" | "easter_offset";
  month: number | null;
  day: number | null;
  easter_offset_days: number | null;
  display_name: string;
  sort_order: number;
};

function slugifyStableCode(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 64);
}

function isValidStableCode(s: string): boolean {
  return /^[a-z][a-z0-9_]{0,62}$/.test(s);
}

export async function listEuCountriesForHolidays(): Promise<
  { ok: true; data: EuCountryRow[] } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("eu_countries")
      .select("country_code, name")
      .order("name", { ascending: true });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, data: (data ?? []) as EuCountryRow[] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function listCountryHolidays(
  countryCode: string
): Promise<
  { ok: true; data: CountryHolidayRow[] } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const cc = countryCode.trim().toUpperCase();
    if (cc.length !== 2) {
      return { ok: false, error: "Ugyldig landekode." };
    }
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("country_public_holidays")
      .select(
        "id, country_code, stable_code, holiday_rule, month, day, easter_offset_days, display_name, sort_order"
      )
      .eq("country_code", cc)
      .order("sort_order", { ascending: true })
      .order("display_name", { ascending: true });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, data: (data ?? []) as CountryHolidayRow[] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function createCountryHoliday(input: {
  country_code: string;
  stable_code?: string;
  display_name: string;
  holiday_rule: "fixed" | "easter_offset";
  month?: number | null;
  day?: number | null;
  easter_offset_days?: number | null;
  sort_order?: number;
}): Promise<
  { ok: true; data: CountryHolidayRow } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const country_code = input.country_code.trim().toUpperCase();
    if (country_code.length !== 2) {
      return { ok: false, error: "Ugyldig landekode." };
    }
    const display_name = input.display_name.trim();
    if (!display_name) {
      return { ok: false, error: "Navn skal udfyldes." };
    }
    const stable_code = slugifyStableCode(
      input.stable_code?.trim() || display_name
    );
    if (!stable_code || !isValidStableCode(stable_code)) {
      return {
        ok: false,
        error:
          "Stabil kode skal starte med bogstav og kun indeholde a-z, 0-9 og _.",
      };
    }
    let month: number | null = null;
    let day: number | null = null;
    let easter_offset_days: number | null = null;
    if (input.holiday_rule === "fixed") {
      const m = input.month;
      const d = input.day;
      if (m == null || d == null || m < 1 || m > 12 || d < 1 || d > 31) {
        return { ok: false, error: "Angiv gyldig måned (1–12) og dag (1–31)." };
      }
      month = m;
      day = d;
    } else {
      const off = input.easter_offset_days;
      if (off == null || !Number.isFinite(off)) {
        return { ok: false, error: "Angiv offset i dage fra påskesøndag." };
      }
      easter_offset_days = Math.trunc(off);
    }
    const sort_order =
      input.sort_order !== undefined && Number.isFinite(input.sort_order)
        ? Math.trunc(input.sort_order)
        : 100;
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("country_public_holidays")
      .insert({
        country_code,
        stable_code,
        display_name,
        holiday_rule: input.holiday_rule,
        month,
        day,
        easter_offset_days,
        sort_order,
      })
      .select(
        "id, country_code, stable_code, holiday_rule, month, day, easter_offset_days, display_name, sort_order"
      )
      .single();
    if (error) {
      if (error.code === "23505") {
        return {
          ok: false,
          error: "Den stabile kode findes allerede for dette land.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/helligdage");
    return { ok: true, data: data as CountryHolidayRow };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function updateCountryHoliday(
  id: string,
  patch: {
    display_name?: string;
    holiday_rule?: "fixed" | "easter_offset";
    month?: number | null;
    day?: number | null;
    easter_offset_days?: number | null;
    sort_order?: number;
  }
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.display_name !== undefined) {
      const n = patch.display_name.trim();
      if (!n) {
        return { ok: false, error: "Navn kan ikke være tomt." };
      }
      row.display_name = n;
    }
    if (patch.holiday_rule !== undefined) {
      row.holiday_rule = patch.holiday_rule;
    }
    if (patch.month !== undefined) row.month = patch.month;
    if (patch.day !== undefined) row.day = patch.day;
    if (patch.easter_offset_days !== undefined) {
      row.easter_offset_days = patch.easter_offset_days;
    }
    if (patch.sort_order !== undefined) {
      row.sort_order = Math.trunc(patch.sort_order);
    }
    const admin = getAdminClient();
    const { error } = await admin
      .from("country_public_holidays")
      .update(row)
      .eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/helligdage");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function deleteCountryHoliday(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const { error } = await admin.from("country_public_holidays").delete().eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/helligdage");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}
