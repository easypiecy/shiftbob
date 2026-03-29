import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import WorkplaceDetailClient from "@/app/super-admin/workplaces/[id]/workplace-detail-client";
import {
  getWorkplaceById,
  getWorkplaceDepartmentsOverview,
  getWorkplaceTypes,
  listEmployeeTypeTemplates,
  listEuCountriesForWorkplace,
  listShiftTypeTemplates,
  listWorkplaceApiKeys,
} from "@/src/app/super-admin/workplaces/actions";
import { ACTIVE_WORKPLACE_COOKIE } from "@/src/lib/workplaces";

export default async function WorkplaceSettingsPage() {
  const jar = await cookies();
  const raw = jar.get(ACTIVE_WORKPLACE_COOKIE)?.value?.trim();
  if (!raw) {
    redirect("/select-workplace");
  }

  const workplaceId = raw;
  const [wp, types, keys, et, st, dept, countries] = await Promise.all([
    getWorkplaceById(workplaceId),
    getWorkplaceTypes(workplaceId),
    listWorkplaceApiKeys(workplaceId),
    listEmployeeTypeTemplates(workplaceId),
    listShiftTypeTemplates(workplaceId),
    getWorkplaceDepartmentsOverview(workplaceId),
    listEuCountriesForWorkplace(workplaceId),
  ]);

  if (!wp.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        {wp.error}
      </div>
    );
  }
  if (!types.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        {types.error}
      </div>
    );
  }
  if (!keys.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        {keys.error}
      </div>
    );
  }
  if (!dept.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        {dept.error}
      </div>
    );
  }

  const catalogError =
    !et.ok || !st.ok
      ? [et.ok ? "" : et.error, st.ok ? "" : st.error].filter(Boolean).join(" · ")
      : null;

  return (
    <div className="mx-auto w-full max-w-[1600px] px-3 pb-2 pt-4 sm:px-4 sm:pt-6">
      <WorkplaceDetailClient
        initial={wp.data}
        employeeTypes={types.employeeTypes}
        shiftTypes={types.shiftTypes}
        initialKeys={keys.data}
        departments={dept.departments}
        membersWithDepartments={dept.members}
        standardEmployeeTemplates={et.ok ? et.data : []}
        standardShiftTemplates={st.ok ? st.data : []}
        countryOptions={countries.ok ? countries.data : []}
        catalogError={catalogError}
        navUi={{
          backHref: "/dashboard",
          backLabel: "← Kalender",
          showStandardCatalogEditLink: false,
        }}
      />
    </div>
  );
}
