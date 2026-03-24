"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import {
  createEmployeeTypeTemplate,
  createShiftTypeTemplate,
  deleteEmployeeTypeTemplate,
  deleteShiftTypeTemplate,
  type TypeTemplateRow,
  updateEmployeeTypeTemplate,
  updateShiftTypeTemplate,
} from "@/src/app/super-admin/workplaces/actions";
import { EMPLOYEE_TYPE_PATTERNS } from "@/src/lib/calendar-shift-style";

type NewTemplateForm = {
  name: string;
  slug: string;
  sort_order: string;
  calendar_pattern?: string;
  calendar_color?: string;
};

type Props = {
  initialEmployee: TypeTemplateRow[];
  initialShift: TypeTemplateRow[];
};

export default function WorkplaceTemplatesClient({
  initialEmployee,
  initialShift,
}: Props) {
  const router = useRouter();
  const [employee, setEmployee] = useState(initialEmployee);
  const [shift, setShift] = useState(initialShift);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    setEmployee(initialEmployee);
  }, [initialEmployee]);
  useEffect(() => {
    setShift(initialShift);
  }, [initialShift]);

  const [newEmp, setNewEmp] = useState<NewTemplateForm>({
    name: "",
    slug: "",
    sort_order: "",
    calendar_pattern: "none",
  });
  const [newShift, setNewShift] = useState<NewTemplateForm>({
    name: "",
    slug: "",
    sort_order: "",
    calendar_color: "#94a3b8",
  });

  async function run<T>(key: string, fn: () => Promise<T>): Promise<T | undefined> {
    setMsg(null);
    setBusy(key);
    try {
      return await fn();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Standard vagt- og medarbejdertyper
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Nye arbejdspladser får disse typer kopieret ind som udgangspunkt. Ændringer
          påvirker kun fremtidige kopier — eksisterende arbejdspladser ændres ikke
          automatisk.
        </p>
      </div>

      {msg && (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {msg}
        </div>
      )}

      <TemplateSection
        variant="employee"
        title="Medarbejdertyper"
        description="Bruges til filtre og push-målgruppe. Mønster vises oven på vagtfarve i kalenderen (én medarbejdertype pr. person)."
        rows={employee}
        newForm={newEmp}
        setNewForm={setNewEmp}
        busy={busy}
        busyPrefix="emp"
        onAdd={async () => {
          const sortRaw = newEmp.sort_order.trim();
          const sort =
            sortRaw === "" ? undefined : Number(sortRaw);
          if (sortRaw !== "" && (typeof sort !== "number" || Number.isNaN(sort))) {
            setMsg("Rækkefølge skal være et tal.");
            return;
          }
          const res = await run("emp-add", () =>
            createEmployeeTypeTemplate({
              name: newEmp.name,
              slug: newEmp.slug.trim() || undefined,
              sort_order: sort,
              calendar_pattern: newEmp.calendar_pattern || "none",
            })
          );
          if (!res) return;
          if (!res.ok) {
            setMsg(res.error);
            return;
          }
          setEmployee((list) =>
            [...list, res.data].sort((a, b) => a.sort_order - b.sort_order)
          );
          setNewEmp({
            name: "",
            slug: "",
            sort_order: "",
            calendar_pattern: "none",
          });
          router.refresh();
        }}
        onUpdate={async (id, patch) => {
          const res = await run(`emp-${id}`, () =>
            updateEmployeeTypeTemplate(id, patch)
          );
          if (!res?.ok) {
            setMsg(res ? res.error : "Fejl");
            return;
          }
          setEmployee((list) =>
            list
              .map((r) =>
                r.id === id
                  ? {
                      ...r,
                      name: patch.name ?? r.name,
                      slug: patch.slug ?? r.slug,
                      sort_order: patch.sort_order ?? r.sort_order,
                      calendar_pattern:
                        patch.calendar_pattern ?? r.calendar_pattern,
                    }
                  : r
              )
              .sort((a, b) => a.sort_order - b.sort_order)
          );
          router.refresh();
        }}
        onDelete={async (id) => {
          if (!window.confirm("Slette denne medarbejder-type?")) return;
          const res = await run(`emp-del-${id}`, () =>
            deleteEmployeeTypeTemplate(id)
          );
          if (!res?.ok) {
            setMsg(res ? res.error : "Fejl");
            return;
          }
          setEmployee((list) => list.filter((r) => r.id !== id));
          router.refresh();
        }}
      />

      <TemplateSection
        variant="shift"
        title="Vagttyper"
        description="Bruges til filtre og push-målgruppe. Farve bruges som baggrund for vagten i kalenderen."
        rows={shift}
        newForm={newShift}
        setNewForm={setNewShift}
        busy={busy}
        busyPrefix="shift"
        onAdd={async () => {
          const sortRaw = newShift.sort_order.trim();
          const sort =
            sortRaw === "" ? undefined : Number(sortRaw);
          if (sortRaw !== "" && (typeof sort !== "number" || Number.isNaN(sort))) {
            setMsg("Rækkefølge skal være et tal.");
            return;
          }
          const res = await run("shift-add", () =>
            createShiftTypeTemplate({
              name: newShift.name,
              slug: newShift.slug.trim() || undefined,
              sort_order: sort,
              calendar_color: newShift.calendar_color || "#94a3b8",
            })
          );
          if (!res) return;
          if (!res.ok) {
            setMsg(res.error);
            return;
          }
          setShift((list) =>
            [...list, res.data].sort((a, b) => a.sort_order - b.sort_order)
          );
          setNewShift({ name: "", slug: "", sort_order: "", calendar_color: "#94a3b8" });
          router.refresh();
        }}
        onUpdate={async (id, patch) => {
          const res = await run(`shift-${id}`, () =>
            updateShiftTypeTemplate(id, patch)
          );
          if (!res?.ok) {
            setMsg(res ? res.error : "Fejl");
            return;
          }
          setShift((list) =>
            list
              .map((r) =>
                r.id === id
                  ? {
                      ...r,
                      name: patch.name ?? r.name,
                      slug: patch.slug ?? r.slug,
                      sort_order: patch.sort_order ?? r.sort_order,
                      calendar_color: patch.calendar_color ?? r.calendar_color,
                    }
                  : r
              )
              .sort((a, b) => a.sort_order - b.sort_order)
          );
          router.refresh();
        }}
        onDelete={async (id) => {
          if (!window.confirm("Slette denne vagttype?")) return;
          const res = await run(`shift-del-${id}`, () =>
            deleteShiftTypeTemplate(id)
          );
          if (!res?.ok) {
            setMsg(res ? res.error : "Fejl");
            return;
          }
          setShift((list) => list.filter((r) => r.id !== id));
          router.refresh();
        }}
      />
    </div>
  );
}

function TemplateSection({
  variant,
  title,
  description,
  rows,
  newForm,
  setNewForm,
  busy,
  busyPrefix,
  onAdd,
  onUpdate,
  onDelete,
}: {
  variant: "employee" | "shift";
  title: string;
  description: string;
  rows: TypeTemplateRow[];
  newForm: NewTemplateForm;
  setNewForm: React.Dispatch<React.SetStateAction<NewTemplateForm>>;
  busy: string | null;
  busyPrefix: string;
  onAdd: () => Promise<void>;
  onUpdate: (
    id: string,
    patch: {
      name?: string;
      slug?: string;
      sort_order?: number;
      calendar_color?: string;
      calendar_pattern?: string;
    }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const visualLabel =
    variant === "shift" ? "Kalenderfarve" : "Kalendermønster";

  return (
    <section>
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h2>
      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Navn</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="w-24 px-4 py-3 font-semibold">Rækkefølge</th>
              <th className="min-w-[10rem] px-4 py-3 font-semibold">
                {visualLabel}
              </th>
              <th className="w-32 px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map((r) => (
              <TemplateRow
                key={r.id}
                variant={variant}
                row={r}
                busy={busy === `${busyPrefix}-${r.id}`}
                onSave={(patch) => onUpdate(r.id, patch)}
                onDelete={() => onDelete(r.id)}
                deleteBusy={busy === `${busyPrefix}-del-${r.id}`}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
        <label className="min-w-[10rem] flex-1">
          <span className="mb-1 block text-xs font-medium text-zinc-500">
            Nyt navn
          </span>
          <input
            value={newForm.name}
            onChange={(e) =>
              setNewForm((f) => ({ ...f, name: e.target.value }))
            }
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            placeholder="Fx Vikar"
          />
        </label>
        <label className="min-w-[8rem]">
          <span className="mb-1 block text-xs font-medium text-zinc-500">
            Slug (valgfri)
          </span>
          <input
            value={newForm.slug}
            onChange={(e) =>
              setNewForm((f) => ({ ...f, slug: e.target.value }))
            }
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            placeholder="auto"
          />
        </label>
        <label className="w-24">
          <span className="mb-1 block text-xs font-medium text-zinc-500">
            Sort
          </span>
          <input
            value={newForm.sort_order}
            onChange={(e) =>
              setNewForm((f) => ({ ...f, sort_order: e.target.value }))
            }
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            placeholder="auto"
          />
        </label>
        {variant === "employee" ? (
          <label className="min-w-[10rem]">
            <span className="mb-1 block text-xs font-medium text-zinc-500">
              Mønster
            </span>
            <select
              value={newForm.calendar_pattern ?? "none"}
              onChange={(e) =>
                setNewForm((f) => ({
                  ...f,
                  calendar_pattern: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            >
              {EMPLOYEE_TYPE_PATTERNS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="min-w-[8rem]">
            <span className="mb-1 block text-xs font-medium text-zinc-500">
              Farve
            </span>
            <input
              type="color"
              value={newForm.calendar_color ?? "#94a3b8"}
              onChange={(e) =>
                setNewForm((f) => ({
                  ...f,
                  calendar_color: e.target.value,
                }))
              }
              className="h-10 w-full min-w-[6rem] cursor-pointer rounded border border-zinc-300 bg-white dark:border-zinc-600"
            />
          </label>
        )}
        <button
          type="button"
          onClick={() => void onAdd()}
          disabled={busy === `${busyPrefix}-add` || !newForm.name.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {busy === `${busyPrefix}-add` ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          Tilføj
        </button>
      </div>
    </section>
  );
}

function TemplateRow({
  variant,
  row,
  busy,
  onSave,
  onDelete,
  deleteBusy,
}: {
  variant: "employee" | "shift";
  row: TypeTemplateRow;
  busy: boolean;
  onSave: (patch: {
    name?: string;
    slug?: string;
    sort_order?: number;
    calendar_color?: string;
    calendar_pattern?: string;
  }) => Promise<void>;
  onDelete: () => Promise<void>;
  deleteBusy: boolean;
}) {
  const [name, setName] = useState(row.name);
  const [slug, setSlug] = useState(row.slug);
  const [sort, setSort] = useState(String(row.sort_order));
  const [color, setColor] = useState(
    row.calendar_color ?? "#94a3b8"
  );
  const [pattern, setPattern] = useState(
    row.calendar_pattern ?? "none"
  );

  useEffect(() => {
    setName(row.name);
    setSlug(row.slug);
    setSort(String(row.sort_order));
    setColor(row.calendar_color ?? "#94a3b8");
    setPattern(row.calendar_pattern ?? "none");
  }, [
    row.name,
    row.slug,
    row.sort_order,
    row.calendar_color,
    row.calendar_pattern,
  ]);

  const dirty =
    name !== row.name ||
    slug !== row.slug ||
    sort !== String(row.sort_order) ||
    (variant === "shift" && color !== (row.calendar_color ?? "#94a3b8")) ||
    (variant === "employee" && pattern !== (row.calendar_pattern ?? "none"));

  async function save() {
    const sortNum = Number(sort);
    if (Number.isNaN(sortNum)) return;
    if (variant === "shift") {
      await onSave({
        name,
        slug,
        sort_order: sortNum,
        calendar_color: color,
      });
    } else {
      await onSave({
        name,
        slug,
        sort_order: sortNum,
        calendar_pattern: pattern,
      });
    }
  }

  return (
    <tr>
      <td className="px-4 py-2 align-middle">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full min-w-[8rem] rounded border border-transparent bg-transparent px-2 py-1 text-sm hover:border-zinc-200 focus:border-zinc-400 focus:outline-none dark:hover:border-zinc-700"
        />
      </td>
      <td className="px-4 py-2 align-middle">
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full min-w-[6rem] rounded border border-transparent bg-transparent px-2 py-1 font-mono text-xs hover:border-zinc-200 focus:border-zinc-400 focus:outline-none dark:hover:border-zinc-700"
        />
      </td>
      <td className="px-4 py-2 align-middle">
        <input
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full max-w-[5rem] rounded border border-transparent bg-transparent px-2 py-1 text-sm hover:border-zinc-200 focus:border-zinc-400 focus:outline-none dark:hover:border-zinc-700"
        />
      </td>
      <td className="px-4 py-2 align-middle">
        {variant === "shift" ? (
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-9 w-full max-w-[5rem] cursor-pointer rounded border border-zinc-200 dark:border-zinc-600"
          />
        ) : (
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-sm hover:border-zinc-200 focus:border-zinc-400 focus:outline-none dark:hover:border-zinc-700"
          >
            {EMPLOYEE_TYPE_PATTERNS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className="px-4 py-2 align-middle">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void save()}
            disabled={!dirty || busy}
            className="rounded-lg border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : "Gem"}
          </button>
          <button
            type="button"
            onClick={() => void onDelete()}
            disabled={deleteBusy}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-300"
            title="Slet"
          >
            {deleteBusy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
