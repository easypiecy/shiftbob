import {
  listEmployeeTypeTemplates,
  listShiftTypeTemplates,
} from "@/src/app/super-admin/workplaces/actions";
import WorkplaceTemplatesClient from "./workplace-templates-client";

export default async function WorkplaceTemplatesPage() {
  const [et, st] = await Promise.all([
    listEmployeeTypeTemplates(),
    listShiftTypeTemplates(),
  ]);

  if (!et.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        Kunne ikke hente medarbejder-typer: {et.error}
      </div>
    );
  }
  if (!st.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        Kunne ikke hente vagttyper: {st.error}
      </div>
    );
  }

  return (
    <WorkplaceTemplatesClient
      initialEmployee={et.data}
      initialShift={st.data}
    />
  );
}
