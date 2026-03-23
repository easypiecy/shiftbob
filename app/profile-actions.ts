"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/src/utils/supabase/server";
import { getAdminClient } from "@/src/utils/supabase/admin";

export async function completeProfileOnboardingAction(input: {
  workplaceId: string;
  departmentId: string;
  employeeTypeId: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Ikke logget ind." };

  const admin = getAdminClient();

  const { data: wm, error: wmErr } = await admin
    .from("workplace_members")
    .select("id, role, profile_onboarding_completed")
    .eq("user_id", user.id)
    .eq("workplace_id", input.workplaceId)
    .maybeSingle();

  if (wmErr || !wm) {
    return { ok: false, error: "Medlemskab ikke fundet." };
  }
  if (wm.profile_onboarding_completed !== false) {
    return { ok: false, error: "Profil kræver ikke udfyldelse." };
  }

  const { error: upErr } = await admin
    .from("workplace_members")
    .update({
      employee_type_id: input.employeeTypeId,
      profile_onboarding_completed: true,
    })
    .eq("user_id", user.id)
    .eq("workplace_id", input.workplaceId);

  if (upErr) {
    return { ok: false, error: upErr.message };
  }

  const { error: deptErr } = await admin.from("workplace_department_members").upsert(
    {
      department_id: input.departmentId,
      user_id: user.id,
      workplace_id: input.workplaceId,
    },
    { onConflict: "user_id,department_id" }
  );

  if (deptErr) {
    return { ok: false, error: deptErr.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/complete-profile");
  return { ok: true };
}
