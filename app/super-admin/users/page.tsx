import { Suspense } from "react";
import { getWorkplaces } from "@/src/app/super-admin/workplaces/actions";
import { getUsers } from "@/src/app/super-admin/users/actions";
import UsersAdminClient from "./users-admin-client";

async function SuperAdminUsersContent() {
  const [wpRes, uRes] = await Promise.all([getWorkplaces(), getUsers()]);

  if (!wpRes.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        Kunne ikke hente arbejdspladser: {wpRes.error}
      </div>
    );
  }

  if (!uRes.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        Kunne ikke hente brugere: {uRes.error}
      </div>
    );
  }

  return (
    <UsersAdminClient
      initialWorkplaces={wpRes.data}
      initialUsers={uRes.data}
    />
  );
}

function UsersAdminFallback() {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
    </div>
  );
}

export default function SuperAdminUsersPage() {
  return (
    <Suspense fallback={<UsersAdminFallback />}>
      <SuperAdminUsersContent />
    </Suspense>
  );
}
