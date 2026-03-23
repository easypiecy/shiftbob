import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
        <h1 className="text-lg font-semibold text-amber-950 dark:text-amber-100">
          Afventer godkendelse
        </h1>
        <p className="mt-3 text-sm text-amber-900/90 dark:text-amber-200/90">
          Din anmodning om adgang til arbejdspladsen er sendt til en administrator.
          Du får adgang, når den er godkendt. Kom tilbage senere, eller kontakt din
          administrator.
        </p>
        <p className="mt-6 text-sm text-amber-900/80 dark:text-amber-200/80">
          Du kan logge ud og prøve igen senere.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-amber-800 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600"
        >
          Til login
        </Link>
      </div>
    </div>
  );
}
