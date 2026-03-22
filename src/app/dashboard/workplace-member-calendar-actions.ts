"use server";

import { revalidatePath } from "next/cache";
import { assertWorkplaceAdminOrSuperAdmin } from "@/src/lib/workplace-admin-server";
import { getAdminClient } from "@/src/utils/supabase/admin";

function isMissingSchemaError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("schema cache") ||
    m.includes("could not find") ||
    m.includes("does not exist") ||
    m.includes("42p01") ||
    m.includes("undefined table") ||
    (m.includes("relation") && m.includes("does not exist"))
  );
}

/**
 * Gemmer eller fjerner vist navn for en medarbejder i kalenderen (pr. arbejdsplads).
 * Tom streng = fjern override (brug OAuth-navn / e-mail).
 */
export async function updateWorkplaceMemberCalendarProfile(
  workplaceId: string,
  userId: string,
  input: { displayNameOverride: string | null }
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const admin = getAdminClient();
    const raw = input.displayNameOverride?.trim() ?? "";

    if (raw === "") {
      const { error } = await admin
        .from("workplace_member_calendar_profiles")
        .delete()
        .eq("workplace_id", workplaceId)
        .eq("user_id", userId);
      if (error && !isMissingSchemaError(error.message)) {
        return { ok: false, error: error.message };
      }
      revalidatePath("/dashboard");
      revalidatePath(`/super-admin/workplaces/${workplaceId}`);
      return { ok: true };
    }

    const { error } = await admin.from("workplace_member_calendar_profiles").upsert(
      {
        workplace_id: workplaceId,
        user_id: userId,
        display_name_override: raw,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "workplace_id,user_id" }
    );
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error:
            "Tabellen findes ikke endnu. Kør supabase_workplace_member_calendar_profiles.sql i Supabase.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidatePath("/dashboard");
    revalidatePath(`/super-admin/workplaces/${workplaceId}`);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}
