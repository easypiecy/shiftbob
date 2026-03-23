"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { completeProfileOnboardingAction } from "@/app/profile-actions";
import { createClient } from "@/src/utils/supabase/client";

type Dept = { id: string; name: string };
type EmpType = { id: string; name: string };

export function CompleteProfileClient({
  workplaceId,
}: {
  workplaceId: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [empTypes, setEmpTypes] = useState<EmpType[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [employeeTypeId, setEmployeeTypeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: depts, error: e1 } = await supabase
        .from("workplace_departments")
        .select("id, name")
        .eq("workplace_id", workplaceId)
        .order("name");
      const { data: types, error: e2 } = await supabase
        .from("workplace_employee_types")
        .select("id, name")
        .eq("workplace_id", workplaceId)
        .order("name");
      if (cancelled) return;
      if (e1 || e2) {
        setErr(e1?.message ?? e2?.message ?? "Kunne ikke hente data.");
        setLoading(false);
        return;
      }
      setDepartments((depts ?? []) as Dept[]);
      setEmpTypes((types ?? []) as EmpType[]);
      if ((depts ?? []).length > 0) {
        setDepartmentId((depts as Dept[])[0]!.id);
      }
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [supabase, workplaceId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!departmentId) {
      setErr("Vælg en afdeling.");
      return;
    }
    setErr(null);
    setSaving(true);
    const r = await completeProfileOnboardingAction({
      workplaceId,
      departmentId,
      employeeTypeId: employeeTypeId || null,
    });
    setSaving(false);
    if (!r.ok) {
      setErr(r.error);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Færdiggør din profil
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Vælg afdeling og medarbejdertype (kan ændres senere af administrator).
      </p>

      {err ? (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100"
        >
          {err}
        </div>
      ) : null}

      <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="dept"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Afdeling
          </label>
          <select
            id="dept"
            required
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="empt"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Medarbejdertype (valgfri)
          </label>
          <select
            id="empt"
            value={employeeTypeId ?? ""}
            onChange={(e) =>
              setEmployeeTypeId(e.target.value ? e.target.value : null)
            }
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
          >
            <option value="">—</option>
            {empTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving || departments.length === 0}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {saving ? "Gemmer…" : "Gem og fortsæt"}
        </button>
      </form>
    </div>
  );
}
