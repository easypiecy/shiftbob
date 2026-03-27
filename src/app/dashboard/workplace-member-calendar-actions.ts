"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
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

const CV_BUCKET = "user-cvs";
const CV_MAX_BYTES = 10 * 1024 * 1024;
const CV_MIME = new Set(["application/pdf"]);

export type WorkplaceMemberProfileInput = {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  country: string;
  employeeTypeId: string;
  note: string | null;
};

export type WorkplaceMemberProfileDetails = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  mobilePhone: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  country: string;
  employeeTypeId: string | null;
  note: string | null;
  hasCv: boolean;
};

export type WorkplaceMemberPreferenceInput = {
  priority: number;
  preferenceText: string;
};

export type WorkplaceMemberPreferenceRow = {
  id: string;
  priority: number;
  preferenceText: string;
};

function sanitizeFilename(name: string): string {
  const base = name.replace(/^.*[/\\]/, "").trim() || "cv.pdf";
  return base.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120);
}

function inferCvContentType(file: File): string | null {
  const t = file.type;
  if (t && CV_MIME.has(t)) return t;
  const n = file.name.toLowerCase();
  if (n.endsWith(".pdf")) return "application/pdf";
  return null;
}

function normalizeRequired(value: string, label: string): { ok: true; value: string } | { ok: false; error: string } {
  const v = value.trim();
  if (!v) {
    return { ok: false, error: `${label} er obligatorisk.` };
  }
  return { ok: true, value: v };
}

async function assertEmployeeTypeBelongsToWorkplace(workplaceId: string, employeeTypeId: string): Promise<null | string> {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from("workplace_employee_types")
    .select("id")
    .eq("workplace_id", workplaceId)
    .eq("id", employeeTypeId)
    .maybeSingle();
  if (error) return error.message;
  if (!data) return "Ugyldig medarbejdertype for arbejdspladsen.";
  return null;
}

async function assertMemberInWorkplace(workplaceId: string, userId: string): Promise<null | string> {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from("workplace_members")
    .select("user_id")
    .eq("workplace_id", workplaceId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return error.message;
  if (!data) return "Medarbejderen findes ikke på arbejdspladsen.";
  return null;
}

function validateProfileInput(input: WorkplaceMemberProfileInput): { ok: true; value: WorkplaceMemberProfileInput } | { ok: false; error: string } {
  const firstName = normalizeRequired(input.firstName, "Fornavn");
  if (!firstName.ok) return firstName;
  const lastName = normalizeRequired(input.lastName, "Efternavn");
  if (!lastName.ok) return lastName;
  const email = normalizeRequired(input.email, "E-mail");
  if (!email.ok) return email;
  const mobilePhone = normalizeRequired(input.mobilePhone, "Mobilnummer");
  if (!mobilePhone.ok) return mobilePhone;
  const streetName = normalizeRequired(input.streetName, "Vejnavn");
  if (!streetName.ok) return streetName;
  const streetNumber = normalizeRequired(input.streetNumber, "Vej nr.");
  if (!streetNumber.ok) return streetNumber;
  const postalCode = normalizeRequired(input.postalCode, "Postnummer");
  if (!postalCode.ok) return postalCode;
  const city = normalizeRequired(input.city, "By");
  if (!city.ok) return city;
  const country = normalizeRequired(input.country, "Land");
  if (!country.ok) return country;
  const employeeTypeId = normalizeRequired(input.employeeTypeId, "Medarbejdertype");
  if (!employeeTypeId.ok) return employeeTypeId;

  return {
    ok: true,
    value: {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value.toLowerCase(),
      mobilePhone: mobilePhone.value,
      streetName: streetName.value,
      streetNumber: streetNumber.value,
      postalCode: postalCode.value,
      city: city.value,
      country: country.value,
      employeeTypeId: employeeTypeId.value,
      note: input.note?.trim() ? input.note.trim() : null,
    },
  };
}

async function upsertUserProfileAndMembership(
  workplaceId: string,
  userId: string,
  profile: WorkplaceMemberProfileInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = getAdminClient();
  const employeeTypeErr = await assertEmployeeTypeBelongsToWorkplace(workplaceId, profile.employeeTypeId);
  if (employeeTypeErr) return { ok: false, error: employeeTypeErr };

  const { error: profileErr } = await admin.from("user_profiles").upsert(
    {
      user_id: userId,
      first_name: profile.firstName,
      last_name: profile.lastName,
      street_name: profile.streetName,
      street_number: profile.streetNumber,
      postal_code: profile.postalCode,
      city: profile.city,
      country: profile.country,
      mobile_phone: profile.mobilePhone,
      note: profile.note,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (profileErr) {
    if (isMissingSchemaError(profileErr.message)) {
      return {
        ok: false,
        error: "Tabellen user_profiles findes ikke. Kør supabase_user_profiles.sql i Supabase.",
      };
    }
    return { ok: false, error: profileErr.message };
  }

  const { error: memberErr } = await admin
    .from("workplace_members")
    .update({ employee_type_id: profile.employeeTypeId })
    .eq("workplace_id", workplaceId)
    .eq("user_id", userId);
  if (memberErr) return { ok: false, error: memberErr.message };

  return { ok: true };
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

export async function getWorkplaceMemberProfileDetails(
  workplaceId: string,
  userId: string
): Promise<{ ok: true; data: WorkplaceMemberProfileDetails } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const memberErr = await assertMemberInWorkplace(workplaceId, userId);
    if (memberErr) return { ok: false, error: memberErr };

    const admin = getAdminClient();
    const { data: authRes, error: authErr } = await admin.auth.admin.getUserById(userId);
    if (authErr || !authRes?.user) {
      return { ok: false, error: authErr?.message ?? "Bruger ikke fundet." };
    }

    const { data: member, error: memberQueryErr } = await admin
      .from("workplace_members")
      .select("employee_type_id")
      .eq("workplace_id", workplaceId)
      .eq("user_id", userId)
      .maybeSingle();
    if (memberQueryErr) return { ok: false, error: memberQueryErr.message };

    const { data: profile, error: profileErr } = await admin
      .from("user_profiles")
      .select(
        "first_name,last_name,mobile_phone,street_name,street_number,postal_code,city,country,note,cv_storage_path"
      )
      .eq("user_id", userId)
      .maybeSingle();
    if (profileErr && !isMissingSchemaError(profileErr.message)) {
      return { ok: false, error: profileErr.message };
    }

    const meta = (authRes.user.user_metadata ?? {}) as Record<string, unknown>;
    const data: WorkplaceMemberProfileDetails = {
      userId,
      email: authRes.user.email ?? "",
      firstName: typeof profile?.first_name === "string" ? profile.first_name : "",
      lastName: typeof profile?.last_name === "string" ? profile.last_name : "",
      mobilePhone: typeof profile?.mobile_phone === "string" ? profile.mobile_phone : "",
      streetName: typeof profile?.street_name === "string" ? profile.street_name : "",
      streetNumber: typeof profile?.street_number === "string" ? profile.street_number : "",
      postalCode: typeof profile?.postal_code === "string" ? profile.postal_code : "",
      city: typeof profile?.city === "string" ? profile.city : "",
      country:
        typeof profile?.country === "string"
          ? profile.country
          : typeof meta.country === "string"
            ? meta.country
            : "",
      employeeTypeId: (member?.employee_type_id as string | null) ?? null,
      note: typeof profile?.note === "string" ? profile.note : null,
      hasCv: typeof profile?.cv_storage_path === "string" && profile.cv_storage_path.length > 0,
    };
    return { ok: true, data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function createWorkplaceMemberWithProfile(
  workplaceId: string,
  input: WorkplaceMemberProfileInput
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const parsed = validateProfileInput(input);
    if (!parsed.ok) return parsed;

    const admin = getAdminClient();
    const profile = parsed.value;
    const createRes = await admin.auth.admin.createUser({
      email: profile.email,
      password: randomUUID(),
      email_confirm: true,
      user_metadata: {
        first_name: profile.firstName,
        last_name: profile.lastName,
        full_name: `${profile.firstName} ${profile.lastName}`.trim(),
        country: profile.country,
      },
    });
    if (createRes.error || !createRes.data.user) {
      return { ok: false, error: createRes.error?.message ?? "Kunne ikke oprette bruger." };
    }

    const userId = createRes.data.user.id;
    const { error: memberErr } = await admin.from("workplace_members").upsert(
      {
        user_id: userId,
        workplace_id: workplaceId,
        role: "EMPLOYEE",
        employee_type_id: profile.employeeTypeId,
      },
      { onConflict: "user_id,workplace_id" }
    );
    if (memberErr) {
      await admin.auth.admin.deleteUser(userId);
      return { ok: false, error: memberErr.message };
    }

    const profileRes = await upsertUserProfileAndMembership(workplaceId, userId, profile);
    if (!profileRes.ok) {
      await admin.from("workplace_members").delete().eq("user_id", userId).eq("workplace_id", workplaceId);
      await admin.auth.admin.deleteUser(userId);
      return profileRes;
    }

    revalidatePath("/dashboard");
    revalidatePath(`/super-admin/workplaces/${workplaceId}`);
    return { ok: true, userId };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function updateWorkplaceMemberWithProfile(
  workplaceId: string,
  userId: string,
  input: WorkplaceMemberProfileInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const memberErr = await assertMemberInWorkplace(workplaceId, userId);
    if (memberErr) return { ok: false, error: memberErr };

    const parsed = validateProfileInput(input);
    if (!parsed.ok) return parsed;
    const profile = parsed.value;

    const admin = getAdminClient();
    const { error: authErr } = await admin.auth.admin.updateUserById(userId, {
      email: profile.email,
      user_metadata: {
        first_name: profile.firstName,
        last_name: profile.lastName,
        full_name: `${profile.firstName} ${profile.lastName}`.trim(),
        country: profile.country,
      },
    });
    if (authErr) return { ok: false, error: authErr.message };

    const upsertRes = await upsertUserProfileAndMembership(workplaceId, userId, profile);
    if (!upsertRes.ok) return upsertRes;

    revalidatePath("/dashboard");
    revalidatePath(`/super-admin/workplaces/${workplaceId}`);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function uploadWorkplaceMemberCv(
  workplaceId: string,
  userId: string,
  formData: FormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const memberErr = await assertMemberInWorkplace(workplaceId, userId);
    if (memberErr) return { ok: false, error: memberErr };

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return { ok: false, error: "Vælg en PDF-fil." };
    }
    if (file.size > CV_MAX_BYTES) {
      return { ok: false, error: "Filen må højst være 10 MB." };
    }
    const contentType = inferCvContentType(file);
    if (!contentType) {
      return { ok: false, error: "Kun PDF er tilladt." };
    }

    const admin = getAdminClient();
    const { data: prev } = await admin
      .from("user_profiles")
      .select("cv_storage_path")
      .eq("user_id", userId)
      .maybeSingle();
    const oldPath = typeof prev?.cv_storage_path === "string" ? prev.cv_storage_path : null;

    const safe = sanitizeFilename(file.name);
    const objectPath = `${userId}/${Date.now()}-${safe}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await admin.storage.from(CV_BUCKET).upload(objectPath, buf, {
      contentType,
      upsert: false,
    });
    if (upErr) return { ok: false, error: upErr.message };

    if (oldPath) {
      await admin.storage.from(CV_BUCKET).remove([oldPath]);
    }

    const { error: profileErr } = await admin
      .from("user_profiles")
      .upsert({ user_id: userId, cv_storage_path: objectPath, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    if (profileErr) {
      await admin.storage.from(CV_BUCKET).remove([objectPath]);
      return { ok: false, error: profileErr.message };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/super-admin/workplaces/${workplaceId}`);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function getWorkplaceMemberCvSignedUrl(
  workplaceId: string,
  userId: string
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const memberErr = await assertMemberInWorkplace(workplaceId, userId);
    if (memberErr) return { ok: false, error: memberErr };

    const admin = getAdminClient();
    const { data: row, error: qErr } = await admin
      .from("user_profiles")
      .select("cv_storage_path")
      .eq("user_id", userId)
      .maybeSingle();
    if (qErr) return { ok: false, error: qErr.message };
    const path = typeof row?.cv_storage_path === "string" ? row.cv_storage_path : null;
    if (!path) return { ok: false, error: "Ingen CV uploadet." };

    const { data, error } = await admin.storage.from(CV_BUCKET).createSignedUrl(path, 3600);
    if (error || !data?.signedUrl) {
      return { ok: false, error: error?.message ?? "Kunne ikke oprette CV-link." };
    }
    return { ok: true, url: data.signedUrl };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function getWorkplaceMemberPreferences(
  workplaceId: string,
  userId: string
): Promise<{ ok: true; rows: WorkplaceMemberPreferenceRow[] } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const memberErr = await assertMemberInWorkplace(workplaceId, userId);
    if (memberErr) return { ok: false, error: memberErr };

    const admin = getAdminClient();
    const { data, error } = await admin
      .from("workplace_member_preferences")
      .select("id, priority, preference_text")
      .eq("workplace_id", workplaceId)
      .eq("user_id", userId)
      .order("priority", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error: "Tabellen workplace_member_preferences findes ikke endnu. Kør SQL-patchen i Supabase.",
        };
      }
      return { ok: false, error: error.message };
    }
    const rows: WorkplaceMemberPreferenceRow[] = (data ?? []).map((row) => ({
      id: String(row.id),
      priority: Number(row.priority) || 0,
      preferenceText: String(row.preference_text ?? ""),
    }));
    return { ok: true, rows };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function saveWorkplaceMemberPreferences(
  workplaceId: string,
  userId: string,
  items: WorkplaceMemberPreferenceInput[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const memberErr = await assertMemberInWorkplace(workplaceId, userId);
    if (memberErr) return { ok: false, error: memberErr };

    const normalized = items
      .map((item, idx) => ({
        priority: Number.isFinite(item.priority) ? Math.max(1, Math.floor(item.priority)) : idx + 1,
        preferenceText: item.preferenceText.trim(),
      }))
      .filter((item) => item.preferenceText.length > 0)
      .sort((a, b) => a.priority - b.priority);

    const admin = getAdminClient();
    const { error: delErr } = await admin
      .from("workplace_member_preferences")
      .delete()
      .eq("workplace_id", workplaceId)
      .eq("user_id", userId);
    if (delErr && !isMissingSchemaError(delErr.message)) {
      return { ok: false, error: delErr.message };
    }

    if (normalized.length > 0) {
      const rows = normalized.map((item, idx) => ({
        workplace_id: workplaceId,
        user_id: userId,
        priority: idx + 1,
        preference_text: item.preferenceText,
      }));
      const { error: insErr } = await admin.from("workplace_member_preferences").insert(rows);
      if (insErr) {
        return { ok: false, error: insErr.message };
      }
    }

    revalidatePath("/dashboard");
    revalidatePath(`/super-admin/workplaces/${workplaceId}`);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}
