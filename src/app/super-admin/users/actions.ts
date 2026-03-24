"use server";

import { revalidatePath } from "next/cache";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
import { getAdminClient } from "@/src/utils/supabase/admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

const WORKPLACE_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "EMPLOYEE",
] as const;

const CV_BUCKET = "user-cvs";

const CV_MAX_BYTES = 10 * 1024 * 1024;

const CV_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export type UserProfileFields = {
  first_name: string | null;
  last_name: string | null;
  street_name: string | null;
  street_number: string | null;
  postal_code: string | null;
  city: string | null;
  mobile_phone: string | null;
  /** Intern note (Super Admin) */
  note: string | null;
  cv_storage_path: string | null;
};

export type UserAdminRow = {
  id: string;
  email: string | null;
  created_at: string | null;
  globalRoles: string[];
  profile: UserProfileFields | null;
};

function mapProfileRow(row: Record<string, unknown>): UserProfileFields {
  return {
    first_name: (row.first_name as string) ?? null,
    last_name: (row.last_name as string) ?? null,
    street_name: (row.street_name as string) ?? null,
    street_number: (row.street_number as string) ?? null,
    postal_code: (row.postal_code as string) ?? null,
    city: (row.city as string) ?? null,
    mobile_phone: (row.mobile_phone as string) ?? null,
    note: (row.note as string) ?? null,
    cv_storage_path: (row.cv_storage_path as string) ?? null,
  };
}

async function loadProfileFieldsForUser(
  admin: ReturnType<typeof getAdminClient>,
  userId: string
): Promise<UserProfileFields> {
  const { data } = await admin
    .from("user_profiles")
    .select(
      "first_name, last_name, street_name, street_number, postal_code, city, mobile_phone, note, cv_storage_path"
    )
    .eq("user_id", userId)
    .maybeSingle();
  return mapProfileRow((data ?? {}) as Record<string, unknown>);
}

function isMissingSchemaError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("schema cache") ||
    m.includes("could not find") ||
    m.includes("does not exist") ||
    m.includes("42p01") ||
    (m.includes("relation") && m.includes("does not exist"))
  );
}

function sanitizeFilename(name: string): string {
  const base = name.replace(/^.*[/\\]/, "").trim() || "cv";
  return base.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120);
}

function inferCvContentType(file: File): string | null {
  const t = file.type;
  if (t && CV_MIME.has(t)) return t;
  const n = file.name.toLowerCase();
  if (n.endsWith(".pdf")) return "application/pdf";
  if (n.endsWith(".doc")) return "application/msword";
  if (n.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  return null;
}

async function requireSuperAdmin() {
  const supabase = await createServerSupabase();
  await assertSuperAdminAccess(supabase);
}

export async function getUsers(): Promise<
  { ok: true; data: UserAdminRow[] } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();

    const allAuthUsers: {
      id: string;
      email?: string;
      created_at?: string;
    }[] = [];

    let page = 1;
    const perPage = 1000;
    for (;;) {
      const { data, error } = await admin.auth.admin.listUsers({
        page,
        perPage,
      });
      if (error) {
        return { ok: false, error: error.message };
      }
      const batch = data.users ?? [];
      for (const u of batch) {
        allAuthUsers.push({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
        });
      }
      if (batch.length < perPage) break;
      page += 1;
      if (page > 100) break;
    }

    const { data: roleRows, error: roleErr } = await admin
      .from("user_roles")
      .select("user_id, role");

    if (roleErr) {
      return { ok: false, error: roleErr.message };
    }

    const roleMap = new Map<string, string[]>();
    for (const r of roleRows ?? []) {
      const uid = r.user_id as string;
      const role = r.role as string;
      const arr = roleMap.get(uid) ?? [];
      arr.push(role);
      roleMap.set(uid, arr);
    }

    const profileMap = new Map<string, UserProfileFields>();
    const ids = allAuthUsers.map((u) => u.id);
    if (ids.length > 0) {
      const { data: profRows, error: profErr } = await admin
        .from("user_profiles")
        .select(
          "user_id, first_name, last_name, street_name, street_number, postal_code, city, mobile_phone, note, cv_storage_path"
        )
        .in("user_id", ids);
      if (profErr) {
        if (!isMissingSchemaError(profErr.message)) {
          return { ok: false, error: profErr.message };
        }
      } else {
        for (const p of profRows ?? []) {
          profileMap.set(
            p.user_id as string,
            mapProfileRow(p as Record<string, unknown>)
          );
        }
      }
    }

    const rows: UserAdminRow[] = allAuthUsers.map((u) => ({
      id: u.id,
      email: u.email ?? null,
      created_at: u.created_at ?? null,
      globalRoles: (roleMap.get(u.id) ?? []).sort(),
      profile: profileMap.get(u.id) ?? null,
    }));

    rows.sort((a, b) =>
      (a.email ?? "").localeCompare(b.email ?? "", "da", {
        sensitivity: "base",
      })
    );

    return { ok: true, data: rows };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function assignWorkplaceRole(
  userId: string,
  workplaceId: string,
  role: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    if (!WORKPLACE_ROLES.includes(role as (typeof WORKPLACE_ROLES)[number])) {
      return { ok: false, error: "Ugyldig rolle." };
    }

    await requireSuperAdmin();
    const admin = getAdminClient();

    const { error } = await admin.from("workplace_members").upsert(
      {
        user_id: userId,
        workplace_id: workplaceId,
        role,
      },
      { onConflict: "user_id,workplace_id" }
    );

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/super-admin/users");
    revalidatePath("/super-admin/workplaces");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

/**
 * Genererer et magic link (uden e-mail) så Super Admin kan åbne det og logge ind som brugeren.
 */
export async function impersonateUser(
  email: string
): Promise<
  { ok: true; actionLink: string } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      return { ok: false, error: "E-mail mangler." };
    }

    const admin = getAdminClient();
    const { data, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: trimmed,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    const actionLink = data?.properties?.action_link;
    if (!actionLink) {
      return {
        ok: false,
        error: "Supabase returnerede intet magic link (action_link).",
      };
    }

    return { ok: true, actionLink };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export type UpdateUserProfileInput = {
  first_name?: string | null;
  last_name?: string | null;
  street_name?: string | null;
  street_number?: string | null;
  postal_code?: string | null;
  city?: string | null;
  mobile_phone?: string | null;
  note?: string | null;
};

export async function updateUserProfile(
  userId: string,
  input: UpdateUserProfileInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();

    const trim = (v: string | null | undefined) =>
      v === undefined || v === null ? null : v.trim() || null;

    const { data: prev } = await admin
      .from("user_profiles")
      .select(
        "first_name, last_name, street_name, street_number, postal_code, city, mobile_phone, note, cv_storage_path"
      )
      .eq("user_id", userId)
      .maybeSingle();

    const base = mapProfileRow(
      (prev ?? {}) as Record<string, unknown>
    );

    const normalizeNote = (v: string | null | undefined) => {
      if (v === undefined || v === null) return null;
      const t = v.trim();
      return t === "" ? null : t;
    };

    const row: Record<string, unknown> = {
      user_id: userId,
      first_name:
        input.first_name !== undefined ? trim(input.first_name) : base.first_name,
      last_name:
        input.last_name !== undefined ? trim(input.last_name) : base.last_name,
      street_name:
        input.street_name !== undefined
          ? trim(input.street_name)
          : base.street_name,
      street_number:
        input.street_number !== undefined
          ? trim(input.street_number)
          : base.street_number,
      postal_code:
        input.postal_code !== undefined
          ? trim(input.postal_code)
          : base.postal_code,
      city: input.city !== undefined ? trim(input.city) : base.city,
      mobile_phone:
        input.mobile_phone !== undefined
          ? trim(input.mobile_phone)
          : base.mobile_phone,
      note:
        input.note !== undefined ? normalizeNote(input.note) : base.note,
      cv_storage_path: base.cv_storage_path,
      updated_at: new Date().toISOString(),
    };

    const { error } = await admin.from("user_profiles").upsert(row, {
      onConflict: "user_id",
    });
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error:
            "Tabellen user_profiles findes ikke. Kør supabase_user_profiles.sql i Supabase.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/users");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function uploadUserCv(
  userId: string,
  formData: FormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return { ok: false, error: "Vælg en fil." };
    }
    if (file.size > CV_MAX_BYTES) {
      return { ok: false, error: "Filen må højst være 10 MB." };
    }
    const contentType = inferCvContentType(file);
    if (!contentType) {
      return {
        ok: false,
        error: "Kun PDF eller Word (.doc, .docx).",
      };
    }

    const admin = getAdminClient();
    const base = await loadProfileFieldsForUser(admin, userId);

    const oldPath = base.cv_storage_path;

    const safe = sanitizeFilename(file.name);
    const objectPath = `${userId}/${Date.now()}-${safe}`;
    const buf = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await admin.storage
      .from(CV_BUCKET)
      .upload(objectPath, buf, {
        contentType,
        upsert: false,
      });
    if (upErr) {
      return {
        ok: false,
        error: upErr.message,
      };
    }

    if (oldPath) {
      await admin.storage.from(CV_BUCKET).remove([oldPath]);
    }

    const { error: dbErr } = await admin.from("user_profiles").upsert(
      {
        user_id: userId,
        first_name: base.first_name,
        last_name: base.last_name,
        street_name: base.street_name,
        street_number: base.street_number,
        postal_code: base.postal_code,
        city: base.city,
        mobile_phone: base.mobile_phone,
        note: base.note,
        cv_storage_path: objectPath,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (dbErr) {
      await admin.storage.from(CV_BUCKET).remove([objectPath]);
      if (isMissingSchemaError(dbErr.message)) {
        return {
          ok: false,
          error:
            "Tabellen user_profiles findes ikke. Kør supabase_user_profiles.sql i Supabase.",
        };
      }
      return { ok: false, error: dbErr.message };
    }

    revalidatePath("/super-admin/users");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function removeUserCv(
  userId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const base = await loadProfileFieldsForUser(admin, userId);
    const path = base.cv_storage_path;
    if (path) {
      await admin.storage.from(CV_BUCKET).remove([path]);
    }
    const { error } = await admin
      .from("user_profiles")
      .upsert(
        {
          user_id: userId,
          first_name: base.first_name,
          last_name: base.last_name,
          street_name: base.street_name,
          street_number: base.street_number,
          postal_code: base.postal_code,
          city: base.city,
          mobile_phone: base.mobile_phone,
          note: base.note,
          cv_storage_path: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    if (error) {
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/users");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function getUserCvSignedUrl(
  userId: string
): Promise<
  { ok: true; url: string } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const { data: row, error: qErr } = await admin
      .from("user_profiles")
      .select("cv_storage_path")
      .eq("user_id", userId)
      .maybeSingle();
    if (qErr) {
      return { ok: false, error: qErr.message };
    }
    const path =
      row && typeof row.cv_storage_path === "string"
        ? row.cv_storage_path
        : null;
    if (!path) {
      return { ok: false, error: "Ingen CV uploadet." };
    }
    const { data, error } = await admin.storage
      .from(CV_BUCKET)
      .createSignedUrl(path, 3600);
    if (error || !data?.signedUrl) {
      return {
        ok: false,
        error: error?.message ?? "Kunne ikke oprette download-link.",
      };
    }
    return { ok: true, url: data.signedUrl };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}
