import { listEuCountriesForHolidays } from "@/src/app/super-admin/holidays-actions";
import HolidaysAdminClient from "./holidays-admin-client";

export default async function SuperAdminHolidaysPage() {
  const res = await listEuCountriesForHolidays();
  if (!res.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        Kunne ikke hente lande: {res.error}
      </div>
    );
  }

  return <HolidaysAdminClient initialCountries={res.data} />;
}
