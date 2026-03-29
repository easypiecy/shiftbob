import {
  getWorkplaceById,
  getWorkplaceDepartmentsOverview,
  getWorkplaceTypes,
  listEmployeeTypeTemplates,
  listEuCountriesForWorkplace,
  listShiftTypeTemplates,
  listWorkplaceApiKeys,
} from "@/src/app/super-admin/workplaces/actions";
import WorkplaceDetailClient from "./workplace-detail-client";

export default async function WorkplaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [wp, types, keys, et, st, dept, countries] = await Promise.all([
    getWorkplaceById(id),
    getWorkplaceTypes(id),
    listWorkplaceApiKeys(id),
    listEmployeeTypeTemplates(id),
    listShiftTypeTemplates(id),
    getWorkplaceDepartmentsOverview(id),
    listEuCountriesForWorkplace(id),
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
    />
  );
}
