import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getWorkplaceById,
  getWorkplaceTypes,
} from "@/src/app/super-admin/workplaces/actions";
import { getFuturePlanningSnapshot } from "@/src/app/dashboard/future-workplace-actions";
import { ACTIVE_WORKPLACE_COOKIE } from "@/src/lib/workplaces";
import FremtidenClient from "./fremtiden-client";

export default async function FremtidenPage() {
  const jar = await cookies();
  const raw = jar.get(ACTIVE_WORKPLACE_COOKIE)?.value?.trim();
  if (!raw) {
    redirect("/select-workplace");
  }

  const [wp, types, snap] = await Promise.all([
    getWorkplaceById(raw),
    getWorkplaceTypes(raw),
    getFuturePlanningSnapshot(raw),
  ]);

  if (!wp.ok) {
    return (
      <div className="p-6 text-sm text-red-700 dark:text-red-300">{wp.error}</div>
    );
  }
  if (!types.ok) {
    return (
      <div className="p-6 text-sm text-red-700 dark:text-red-300">
        {types.error}
      </div>
    );
  }
  if (!snap.ok) {
    return (
      <div className="p-6 text-sm text-red-700 dark:text-red-300">
        {snap.error}
      </div>
    );
  }

  return (
    <div className="min-h-full flex-1 bg-zinc-50 dark:bg-zinc-950">
      <FremtidenClient
        workplaceId={raw}
        workplaceName={wp.data.company_name?.trim() || wp.data.name}
        initialSnapshot={snap.data}
        employeeTypes={types.employeeTypes}
        shiftTypes={types.shiftTypes}
        seasonTemplate={wp.data.season_template_json}
      />
    </div>
  );
}
