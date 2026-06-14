import {
  EMPLOYEE_LIMIT_EXCEEDED_MESSAGE,
  STANDARD_PLAN_MAX_EMPLOYEES,
  subscriptionTierHasEmployeeLimit,
} from "@/src/config/employee-limits";
import { resolveWorkplaceSubscriptionTier } from "@/src/lib/workplace-subscription-server";
import { getAdminClient } from "@/src/utils/supabase/admin";

export type EmployeeLimitFailure = {
  ok: false;
  error: string;
  employeeLimitExceeded: true;
};

export type SpreadsheetEmployeeRef = {
  employee_id: number;
  email: string;
};

function buildPlaceholderEmail(companyId: string, localEmployeeId: number): string {
  const c = companyId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 20);
  return `import+${c}.${localEmployeeId}@shiftbob.local`;
}

async function countWorkplaceEmployees(workplaceId: string): Promise<number> {
  const admin = getAdminClient();
  const { count, error } = await admin
    .from("workplace_members")
    .select("*", { count: "exact", head: true })
    .eq("workplace_id", workplaceId)
    .eq("role", "EMPLOYEE");

  if (error) {
    console.error("workplace employee count failed:", error.message);
    return 0;
  }

  return count ?? 0;
}

async function listAuthUsersByEmail(admin: ReturnType<typeof getAdminClient>) {
  const userIdByEmail = new Map<string, string>();
  const metadataByUserId = new Map<string, Record<string, unknown> | null>();
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) break;
    const users = data.users ?? [];
    for (const user of users) {
      metadataByUserId.set(user.id, (user.user_metadata as Record<string, unknown>) ?? null);
      const email = user.email?.trim().toLowerCase();
      if (email) userIdByEmail.set(email, user.id);
    }
    if (users.length < perPage) break;
    page += 1;
  }

  return { userIdByEmail, metadataByUserId };
}

export async function countNewSpreadsheetImportEmployees(
  workplaceId: string,
  extractedEmployees: SpreadsheetEmployeeRef[]
): Promise<number> {
  const admin = getAdminClient();
  const { data: members, error: memberError } = await admin
    .from("workplace_members")
    .select("user_id")
    .eq("workplace_id", workplaceId);

  if (memberError) {
    console.error("workplace members lookup failed:", memberError.message);
    return extractedEmployees.length;
  }

  const membershipUserIds = new Set((members ?? []).map((row) => String(row.user_id)));
  const { userIdByEmail, metadataByUserId } = await listAuthUsersByEmail(admin);

  const memberUserIdByLocalEmployeeId = new Map<number, string>();
  for (const userId of membershipUserIds) {
    const metadata = metadataByUserId.get(userId);
    if (!metadata) continue;
    const importedCompanyId = String(metadata.import_company_id ?? "").trim();
    const importedLocalId = Number(metadata.import_local_employee_id);
    if (importedCompanyId !== workplaceId || !Number.isInteger(importedLocalId)) continue;
    memberUserIdByLocalEmployeeId.set(importedLocalId, userId);
  }

  let newEmployees = 0;
  for (const employee of extractedEmployees) {
    const localId = Number(employee.employee_id);
    if (!Number.isInteger(localId)) continue;
    const hasImportedEmail = Boolean(employee.email) && employee.email.includes("@");
    const preferredEmail = hasImportedEmail
      ? employee.email.toLowerCase()
      : buildPlaceholderEmail(workplaceId, localId);

    const existingUserId =
      memberUserIdByLocalEmployeeId.get(localId) ?? userIdByEmail.get(preferredEmail) ?? null;

    if (!existingUserId) {
      newEmployees += 1;
    }
  }

  return newEmployees;
}

export async function assertStandardPlanEmployeeCapacity(
  workplaceId: string,
  additionalEmployees: number
): Promise<{ ok: true } | EmployeeLimitFailure> {
  const tier = await resolveWorkplaceSubscriptionTier(workplaceId);
  if (!subscriptionTierHasEmployeeLimit(tier)) {
    return { ok: true };
  }

  const currentCount = await countWorkplaceEmployees(workplaceId);
  if (currentCount + additionalEmployees > STANDARD_PLAN_MAX_EMPLOYEES) {
    return {
      ok: false,
      error: EMPLOYEE_LIMIT_EXCEEDED_MESSAGE,
      employeeLimitExceeded: true,
    };
  }

  return { ok: true };
}

export async function assertSpreadsheetImportEmployeeCapacity(
  workplaceId: string,
  extractedEmployees: SpreadsheetEmployeeRef[]
): Promise<{ ok: true } | EmployeeLimitFailure> {
  const newEmployees = await countNewSpreadsheetImportEmployees(
    workplaceId,
    extractedEmployees
  );
  return assertStandardPlanEmployeeCapacity(workplaceId, newEmployees);
}
