"use client";

import dynamic from "next/dynamic";

function SelectWorkplaceFallback() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
    </div>
  );
}

const SelectWorkplaceClient = dynamic(
  () => import("./select-workplace-client"),
  { ssr: false, loading: SelectWorkplaceFallback }
);

export default function SelectWorkplacePage() {
  return <SelectWorkplaceClient />;
}
