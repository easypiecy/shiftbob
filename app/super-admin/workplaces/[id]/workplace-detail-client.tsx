"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarClock,
  CreditCard,
  KeyRound,
  Layers3,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  copyWorkplaceTemplatesFromStandards,
  createWorkplaceDepartment,
  createWorkplaceEmployeeType,
  createWorkplaceShiftType,
  deleteWorkplaceDepartment,
  generateWorkplaceApiKey,
  listWorkplaceApiKeys,
  revokeWorkplaceApiKey,
  saveWorkplaceDepartmentMemberships,
  importWorkplaceMembersFromCsv,
  updateWorkplace,
  type WorkplaceMemberImportRowResult,
  type TypeTemplateRow,
  type WorkplaceApiKeyMeta,
  type WorkplaceDepartmentRow,
  type WorkplaceDetail,
  type EuCountryOptionRow,
  type WorkplaceEmployeeTypeRow,
  type WorkplaceMemberDepartmentsRow,
  type WorkplaceShiftTypeRow,
} from "@/src/app/super-admin/workplaces/actions";
import { useTranslations } from "@/src/contexts/translations-context";
import { EMPLOYEE_COUNT_BANDS } from "@/src/types/workplace";
import {
  localizeStandardEmployeeTypeLabel,
  localizeStandardShiftTypeLabel,
} from "@/src/lib/type-label-i18n";

/** Tom liste = ingen filter = alle typer på aksen. Fuld liste = samme som ingen filter → normalisér til []. */
function normalizePushIncludeFilter(ids: string[], allIds: string[]): string[] {
  if (allIds.length === 0) return [];
  const picked = [...new Set(ids)].filter((id) => allIds.includes(id));
  if (picked.length === 0) return [];
  if (
    picked.length === allIds.length &&
    allIds.every((id) => picked.includes(id))
  ) {
    return [];
  }
  return picked;
}

type Props = {
  initial: WorkplaceDetail;
  employeeTypes: WorkplaceEmployeeTypeRow[];
  shiftTypes: WorkplaceShiftTypeRow[];
  initialKeys: WorkplaceApiKeyMeta[];
  departments: WorkplaceDepartmentRow[];
  membersWithDepartments: WorkplaceMemberDepartmentsRow[];
  standardEmployeeTemplates: TypeTemplateRow[];
  standardShiftTemplates: TypeTemplateRow[];
  countryOptions?: EuCountryOptionRow[];
  catalogError?: string | null;
  /** Super Admin: tilbage til brugere; arbejdsplads-admin: typisk Kalender */
  navUi?: {
    backHref: string;
    backLabel: string;
    showStandardCatalogEditLink: boolean;
  };
  /** Nederst under «Gem ændringer» (fx Side-layout på dashboard/indstillinger) — brug children, ikke prop, for korrekt RSC-hydrering */
  children?: ReactNode;
};

/** Ekstra props uden `children` (fx dashboard Indstillinger uden Side-layout-blok). */
export type WorkplaceDetailClientProps = Omit<Props, "children">;

export default function WorkplaceDetailClient({
  initial,
  employeeTypes,
  shiftTypes,
  initialKeys,
  departments,
  membersWithDepartments,
  standardEmployeeTemplates,
  standardShiftTemplates,
  countryOptions = [],
  catalogError,
  navUi,
  children,
}: Props) {
  const { t: tr } = useTranslations();
  const backHref = navUi?.backHref ?? "/super-admin/users";
  const backLabel = navUi?.backLabel ?? "← Arbejdspladser";
  const showStandardCatalogEditLink =
    navUi?.showStandardCatalogEditLink ?? true;
  const router = useRouter();
  const [d, setD] = useState(initial);
  const [keys, setKeys] = useState(initialKeys);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [secretOnce, setSecretOnce] = useState<string | null>(null);
  const [newKeyLabel, setNewKeyLabel] = useState("API");
  const [keyBusy, setKeyBusy] = useState(false);
  const [bootstrapNotice, setBootstrapNotice] = useState<string | null>(null);
  const dashboardTabsEnabled = navUi?.showStandardCatalogEditLink === false;
  const [activeSettingsTab, setActiveSettingsTab] = useState<
    "company" | "planning" | "types" | "api" | "billing"
  >("company");
  const [empList, setEmpList] = useState(employeeTypes);
  const [shiftList, setShiftList] = useState(shiftTypes);
  const [newEmpLabel, setNewEmpLabel] = useState("");
  const [newShiftLabel, setNewShiftLabel] = useState("");
  const [typeBusy, setTypeBusy] = useState(false);
  const [deptList, setDeptList] = useState(departments);
  const [newDeptName, setNewDeptName] = useState("");
  const [deptBusy, setDeptBusy] = useState(false);
  const [importCsv, setImportCsv] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [importResults, setImportResults] = useState<WorkplaceMemberImportRowResult[]>([]);
  const [importSummary, setImportSummary] = useState<{
    createdInvited: number;
    addedExisting: number;
    alreadyMember: number;
    errors: number;
  } | null>(null);
  const [membershipMap, setMembershipMap] = useState<Record<string, string[]>>(
    () =>
      Object.fromEntries(
        membersWithDepartments.map((m) => [m.user_id, [...m.department_ids]])
      )
  );
  const countryOptionsWithCurrent = useMemo(() => {
    const existing = [...countryOptions];
    const current = (d.country_code ?? "").trim().toUpperCase();
    if (current && !existing.some((c) => c.country_code === current)) {
      return [{ country_code: current, name: current }, ...existing];
    }
    return existing;
  }, [countryOptions, d.country_code]);

  useEffect(() => {
    setDeptList(departments);
  }, [departments]);

  useEffect(() => {
    setMembershipMap(
      Object.fromEntries(
        membersWithDepartments.map((m) => [m.user_id, [...m.department_ids]])
      )
    );
  }, [membersWithDepartments]);

  useEffect(() => {
    setEmpList(employeeTypes);
  }, [employeeTypes]);

  useEffect(() => {
    setShiftList(shiftTypes);
  }, [shiftTypes]);

  useEffect(() => {
    try {
      const t = sessionStorage.getItem("shiftbob_workplace_notice");
      if (t) {
        setBootstrapNotice(t);
        sessionStorage.removeItem("shiftbob_workplace_notice");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const shiftAllIds = useMemo(() => shiftList.map((t) => t.id), [shiftList]);
  const empAllIds = useMemo(() => empList.map((t) => t.id), [empList]);

  const shiftModeAll = d.push_include_shift_type_ids.length === 0;
  const empModeAll = d.push_include_employee_type_ids.length === 0;

  const pushShift = new Set(d.push_include_shift_type_ids);
  const pushEmp = new Set(d.push_include_employee_type_ids);

  const toggleShift = (id: string) => {
    setD((x) => {
      let next = new Set(x.push_include_shift_type_ids);
      if (next.size === 0) {
        next = new Set(shiftAllIds);
      }
      if (next.has(id)) next.delete(id);
      else next.add(id);
      const arr = [...next];
      if (arr.length === 0) {
        return { ...x, push_include_shift_type_ids: [] };
      }
      return { ...x, push_include_shift_type_ids: arr };
    });
  };

  const toggleEmp = (id: string) => {
    setD((x) => {
      let next = new Set(x.push_include_employee_type_ids);
      if (next.size === 0) {
        next = new Set(empAllIds);
      }
      if (next.has(id)) next.delete(id);
      else next.add(id);
      const arr = [...next];
      if (arr.length === 0) {
        return { ...x, push_include_employee_type_ids: [] };
      }
      return { ...x, push_include_employee_type_ids: arr };
    });
  };

  const save = useCallback(async () => {
    setMsg(null);
    setSaving(true);
    try {
      const res = await updateWorkplace(d.id, {
        name: d.name,
        company_name: d.company_name ?? "",
        vat_number: d.vat_number,
        street_name: d.street_name,
        street_number: d.street_number,
        address_extra: d.address_extra,
        postal_code: d.postal_code,
        city: d.city,
        country_code: d.country_code,
        contact_email: d.contact_email,
        phone: d.phone,
        employee_count_band: d.employee_count_band,
        stripe_customer_id: d.stripe_customer_id,
        push_include_shift_type_ids: normalizePushIncludeFilter(
          d.push_include_shift_type_ids,
          shiftAllIds
        ),
        push_include_employee_type_ids: normalizePushIncludeFilter(
          d.push_include_employee_type_ids,
          empAllIds
        ),
        future_planning_weeks: d.future_planning_weeks,
      });
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      const nextShift = normalizePushIncludeFilter(
        d.push_include_shift_type_ids,
        shiftAllIds
      );
      const nextEmp = normalizePushIncludeFilter(
        d.push_include_employee_type_ids,
        empAllIds
      );
      setD((prev) => ({
        ...prev,
        push_include_shift_type_ids: nextShift,
        push_include_employee_type_ids: nextEmp,
      }));
      setMsg("Gemt.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }, [d, router, shiftAllIds, empAllIds]);

  async function refreshKeys() {
    const res = await listWorkplaceApiKeys(d.id);
    if (res.ok) setKeys(res.data);
  }

  async function genKey() {
    setKeyBusy(true);
    setSecretOnce(null);
    try {
      const res = await generateWorkplaceApiKey(d.id, newKeyLabel);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setSecretOnce(res.secret);
      await refreshKeys();
    } finally {
      setKeyBusy(false);
    }
  }

  async function revokeKey(id: string) {
    if (!window.confirm("Tilbagekald denne API-nøgle?")) return;
    setKeyBusy(true);
    try {
      const res = await revokeWorkplaceApiKey(id, d.id);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      await refreshKeys();
    } finally {
      setKeyBusy(false);
    }
  }

  async function handleAddShiftType() {
    const label = newShiftLabel.trim();
    if (!label) return;
    setTypeBusy(true);
    setMsg(null);
    try {
      const res = await createWorkplaceShiftType(d.id, { label });
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setShiftList((prev) =>
        [...prev, res.data].sort((a, b) => a.sort_order - b.sort_order)
      );
      setNewShiftLabel("");
      router.refresh();
    } finally {
      setTypeBusy(false);
    }
  }

  async function handleAddEmployeeType() {
    const label = newEmpLabel.trim();
    if (!label) return;
    setTypeBusy(true);
    setMsg(null);
    try {
      const res = await createWorkplaceEmployeeType(d.id, { label });
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setEmpList((prev) =>
        [...prev, res.data].sort((a, b) => a.sort_order - b.sort_order)
      );
      setNewEmpLabel("");
      router.refresh();
    } finally {
      setTypeBusy(false);
    }
  }

  const canCopyMissingStandardTypes =
    (shiftList.length === 0 && standardShiftTemplates.length > 0) ||
    (empList.length === 0 && standardEmployeeTemplates.length > 0);

  async function handleCopyTemplatesFromStandards() {
    setTypeBusy(true);
    setMsg(null);
    try {
      const res = await copyWorkplaceTemplatesFromStandards(d.id);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      router.refresh();
    } finally {
      setTypeBusy(false);
    }
  }

  async function handleCreateDepartment() {
    const name = newDeptName.trim();
    if (!name) return;
    setDeptBusy(true);
    setMsg(null);
    try {
      const res = await createWorkplaceDepartment(d.id, { name });
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setDeptList((prev) =>
        [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name, "da"))
      );
      setNewDeptName("");
      router.refresh();
    } finally {
      setDeptBusy(false);
    }
  }

  async function handleDeleteDepartment(departmentId: string) {
    if (!window.confirm("Slet denne afdeling? Tilknytninger fjernes.")) return;
    setDeptBusy(true);
    setMsg(null);
    try {
      const res = await deleteWorkplaceDepartment(d.id, departmentId);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setDeptList((prev) => prev.filter((x) => x.id !== departmentId));
      setMembershipMap((prev) => {
        const next: Record<string, string[]> = { ...prev };
        for (const k of Object.keys(next)) {
          next[k] = next[k].filter((id) => id !== departmentId);
        }
        return next;
      });
      router.refresh();
    } finally {
      setDeptBusy(false);
    }
  }

  async function handleImportMembers() {
    const raw = importCsv.trim();
    if (!raw) return;
    setImportBusy(true);
    setMsg(null);
    setImportSummary(null);
    setImportResults([]);
    try {
      const res = await importWorkplaceMembersFromCsv(d.id, raw);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setImportResults(res.results);
      setImportSummary(res.summary);
      setMsg(tr("settings.members_import.done_msg", "Import gennemført."));
      router.refresh();
    } finally {
      setImportBusy(false);
    }
  }

  function toggleDeptMembership(userId: string, departmentId: string) {
    setMembershipMap((prev) => {
      const cur = new Set(prev[userId] ?? []);
      if (cur.has(departmentId)) cur.delete(departmentId);
      else cur.add(departmentId);
      return { ...prev, [userId]: [...cur] };
    });
  }

  async function handleSaveDepartmentMemberships() {
    setDeptBusy(true);
    setMsg(null);
    try {
      const assignments = membersWithDepartments.map((m) => ({
        userId: m.user_id,
        departmentIds: membershipMap[m.user_id] ?? [],
      }));
      const res = await saveWorkplaceDepartmentMemberships(d.id, assignments);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setMsg("Afdelingstilknytninger gemt.");
      router.refresh();
    } finally {
      setDeptBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div>
        <Link
          href={backHref}
          className="text-sm font-medium text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {backLabel}
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {d.company_name ?? d.name}
        </h1>
        <p className="mt-1 font-mono text-xs text-zinc-500">{d.id}</p>
      </div>

      {bootstrapNotice && (
        <div
          role="status"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
        >
          {bootstrapNotice}
        </div>
      )}

      {msg && (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {msg}
        </div>
      )}

      {dashboardTabsEnabled ? (
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex min-w-full gap-2 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
            {[
              { id: "company", label: "Firma", icon: Building2 },
              { id: "planning", label: "Planlægning", icon: CalendarClock },
              { id: "types", label: "Typer", icon: Layers3 },
              { id: "api", label: "API", icon: KeyRound },
              { id: "billing", label: "Billing", icon: CreditCard },
            ].map((tab) => {
              const active = activeSettingsTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveSettingsTab(
                      tab.id as
                        | "company"
                        | "planning"
                        | "types"
                        | "api"
                        | "billing"
                    )
                  }
                  className={
                    active
                      ? "inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {!dashboardTabsEnabled || activeSettingsTab === "company" ? (
      <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Firma &amp; adresse
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">Visningsnavn</span>
            <input
              value={d.name}
              onChange={(e) => setD((x) => ({ ...x, name: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">Firmanavn</span>
            <input
              value={d.company_name ?? ""}
              onChange={(e) =>
                setD((x) => ({ ...x, company_name: e.target.value || null }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">CVR / VAT</span>
            <input
              value={d.vat_number ?? ""}
              onChange={(e) =>
                setD((x) => ({ ...x, vat_number: e.target.value || null }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Antal ansatte</span>
            <select
              value={d.employee_count_band}
              onChange={(e) =>
                setD((x) => ({
                  ...x,
                  employee_count_band: e.target.value as WorkplaceDetail["employee_count_band"],
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            >
              {EMPLOYEE_COUNT_BANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">Vejnavn</span>
            <input
              value={d.street_name ?? ""}
              onChange={(e) =>
                setD((x) => ({ ...x, street_name: e.target.value || null }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Nr.</span>
            <input
              value={d.street_number ?? ""}
              onChange={(e) =>
                setD((x) => ({ ...x, street_number: e.target.value || null }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Postnr.</span>
            <input
              value={d.postal_code ?? ""}
              onChange={(e) =>
                setD((x) => ({ ...x, postal_code: e.target.value || null }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">By</span>
            <input
              value={d.city ?? ""}
              onChange={(e) =>
                setD((x) => ({ ...x, city: e.target.value || null }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Land (ISO-2)</span>
            <select
              value={d.country_code ?? ""}
              onChange={(e) =>
                setD((x) => ({
                  ...x,
                  country_code: e.target.value.toUpperCase() || null,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="">Vælg land…</option>
              {countryOptionsWithCurrent.map((country) => (
                <option key={country.country_code} value={country.country_code}>
                  {country.name} ({country.country_code})
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">Yderligere</span>
            <input
              value={d.address_extra ?? ""}
              onChange={(e) =>
                setD((x) => ({ ...x, address_extra: e.target.value || null }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">E-mail</span>
            <input
              type="email"
              value={d.contact_email ?? ""}
              onChange={(e) =>
                setD((x) => ({ ...x, contact_email: e.target.value || null }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Telefon</span>
            <input
              type="tel"
              value={d.phone ?? ""}
              onChange={(e) =>
                setD((x) => ({ ...x, phone: e.target.value || null }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
        </div>
      </section>
      ) : null}

      {!dashboardTabsEnabled || activeSettingsTab === "company" ? (
      <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Indstillinger
        </h2>
        <label className="block max-w-md">
          <span className="mb-1 block text-sm font-medium">
            Stripe Customer ID
          </span>
          <input
            value={d.stripe_customer_id ?? ""}
            onChange={(e) =>
              setD((x) => ({
                ...x,
                stripe_customer_id: e.target.value || null,
              }))
            }
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            placeholder="cus_…"
          />
          <span className="mt-1 block text-xs text-zinc-500">
            Kort gemmes i Stripe; indsæt customer-id efter oprettelse i Stripe
            Dashboard.
          </span>
        </label>
      </section>
      ) : null}

      {!dashboardTabsEnabled || activeSettingsTab === "planning" ? (
      <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {tr("settings.calendar_future.title")}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {tr("settings.calendar_future.intro_prefix")}{" "}
          <Link
            href="/dashboard/fremtiden"
            className="font-medium text-zinc-800 underline dark:text-zinc-200"
          >
            {tr("admin.nav.future")}
          </Link>
          {tr("settings.calendar_future.intro_suffix")}
        </p>
        <label className="block max-w-xs">
          <span className="mb-1 block text-sm font-medium">
            {tr("settings.calendar_future.weeks_label")}
          </span>
          <input
            type="number"
            min={1}
            max={104}
            value={d.future_planning_weeks}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              setD((x) => ({
                ...x,
                future_planning_weeks: Number.isFinite(v)
                  ? Math.min(104, Math.max(1, v))
                  : x.future_planning_weeks,
              }));
            }}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>
      </section>
      ) : null}

      {!dashboardTabsEnabled || activeSettingsTab === "planning" ? (
      <section className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Afdelinger
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Opret afdelinger (fx Køkken, Bar) og tilknyt medarbejdere. Kun brugere
            der allerede er medlem af arbejdspladsen kan tilføjes — validering sker
            også på serveren.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-[12rem] flex-1">
            <span className="mb-1 block text-xs font-medium text-zinc-500">
              Ny afdeling
            </span>
            <input
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="Fx Køkken"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <button
            type="button"
            disabled={deptBusy || !newDeptName.trim()}
            onClick={() => void handleCreateDepartment()}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {deptBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Opret
          </button>
        </div>

        {deptList.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Ingen afdelinger endnu — opret mindst én for at tilknytte medarbejdere.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {deptList.map((dep) => (
              <li
                key={dep.id}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700"
              >
                <span className="font-medium">{dep.name}</span>
                <button
                  type="button"
                  disabled={deptBusy}
                  onClick={() => void handleDeleteDepartment(dep.id)}
                  className="text-red-600 hover:underline disabled:opacity-50"
                  aria-label={`Slet ${dep.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {membersWithDepartments.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Ingen medarbejdere på arbejdspladsen endnu — tilknyt brugere under
            Super Admin-brugere først.
          </p>
        ) : deptList.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Medarbejdere og afdelinger
            </p>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                    <th className="sticky left-0 z-10 bg-zinc-50 px-3 py-2 font-medium dark:bg-zinc-800/80">
                      Medarbejder
                    </th>
                    <th className="px-3 py-2 font-medium">Rolle</th>
                    {deptList.map((dep) => (
                      <th
                        key={dep.id}
                        className="whitespace-nowrap px-2 py-2 text-center font-medium"
                      >
                        {dep.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {membersWithDepartments.map((m) => {
                    const picked = new Set(membershipMap[m.user_id] ?? []);
                    return (
                      <tr key={m.user_id}>
                        <td className="sticky left-0 z-10 bg-white px-3 py-2 dark:bg-zinc-900">
                          <div className="font-medium">{m.display_name}</div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            {m.email ?? "—"}
                          </div>
                          <div className="font-mono text-xs text-zinc-500">
                            {m.user_id}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                          {m.role}
                        </td>
                        {deptList.map((dep) => (
                          <td key={dep.id} className="px-2 py-2 text-center">
                            <input
                              type="checkbox"
                              className="rounded border-zinc-300"
                              checked={picked.has(dep.id)}
                              onChange={() =>
                                toggleDeptMembership(m.user_id, dep.id)
                              }
                              disabled={deptBusy}
                              aria-label={`${m.display_name} — ${dep.name}`}
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              disabled={deptBusy}
              onClick={() => void handleSaveDepartmentMemberships()}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {deptBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Gem afdelingstilknytninger
            </button>
          </div>
        ) : null}

        <div className="space-y-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/70 p-4 dark:border-zinc-700 dark:bg-zinc-950/40">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {tr("settings.members_import.title", "Importér medarbejdere")}
            </p>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              {tr(
                "settings.members_import.intro",
                "Brug formatet nedenfor. Nye medarbejdere oprettes og får aktiveringslink; eksisterende brugere tilknyttes arbejdspladsen."
              )}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-700 dark:bg-zinc-900">
            <p className="mb-2 font-medium text-zinc-700 dark:text-zinc-300">
              {tr("settings.members_import.format_title", "Prædefineret format (semicolon-separeret)")}
            </p>
            <code className="block overflow-x-auto whitespace-nowrap font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
              {tr(
                "settings.members_import.header_example",
                "first_name;last_name;email;mobile_phone;street_name;street_number;postal_code;city;country;employee_type;note"
              )}
            </code>
            <code className="mt-1 block overflow-x-auto whitespace-nowrap font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
              {tr(
                "settings.members_import.row_example",
                "Anna;Jensen;anna@firma.dk;+4522334455;Nørregade;12;8000;Aarhus;DK;Kok;Kan kun arbejde eftermiddag"
              )}
            </code>
          </div>
          <textarea
            value={importCsv}
            onChange={(e) => setImportCsv(e.target.value)}
            rows={8}
            placeholder={tr(
              "settings.members_import.placeholder",
              "Indsæt rækker i formatet ovenfor…"
            )}
            className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-mono dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={importBusy || !importCsv.trim()}
              onClick={() => void handleImportMembers()}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {importBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {tr("settings.members_import.cta", "Start import")}
            </button>
            {importSummary ? (
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {tr("settings.members_import.summary_new", "Nye+inviteret")}:{" "}
                {importSummary.createdInvited} ·{" "}
                {tr("settings.members_import.summary_linked", "Tilknyttet eksisterende")}:{" "}
                {importSummary.addedExisting} ·{" "}
                {tr("settings.members_import.summary_member", "Allerede medlem")}:{" "}
                {importSummary.alreadyMember} ·{" "}
                {tr("settings.members_import.summary_errors", "Fejl")}: {importSummary.errors}
              </p>
            ) : null}
          </div>
          {importResults.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="min-w-full text-left text-xs">
                <thead className="border-b border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60">
                  <tr>
                    <th className="px-2 py-2 font-medium">
                      {tr("settings.members_import.col_line", "Linje")}
                    </th>
                    <th className="px-2 py-2 font-medium">
                      {tr("settings.members_import.col_email", "E-mail")}
                    </th>
                    <th className="px-2 py-2 font-medium">
                      {tr("settings.members_import.col_status", "Status")}
                    </th>
                    <th className="px-2 py-2 font-medium">
                      {tr("settings.members_import.col_message", "Besked")}
                    </th>
                    <th className="px-2 py-2 font-medium">
                      {tr("settings.members_import.col_link", "Aktiveringslink")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {importResults.map((row) => (
                    <tr key={`${row.line}-${row.email}`}>
                      <td className="px-2 py-1.5">{row.line}</td>
                      <td className="px-2 py-1.5">{row.email || "—"}</td>
                      <td className="px-2 py-1.5">
                        {tr(
                          `settings.members_import.status.${row.status}`,
                          row.status
                        )}
                      </td>
                      <td className="px-2 py-1.5">{row.message}</td>
                      <td className="px-2 py-1.5">
                        {row.activationLink ? (
                          <a
                            href={row.activationLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {tr("settings.members_import.link_open", "Åbn link")}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>
      ) : null}

      {!dashboardTabsEnabled || activeSettingsTab === "types" ? (
      <section className="space-y-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Vagt- og medarbejdertyper
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              <strong className="font-medium text-zinc-800 dark:text-zinc-200">
                Standardkataloget
              </strong>{" "}
              er de globale typer under Super Admin. Ved oprettelse kopieres de
              til arbejdspladsen som{" "}
              <span className="whitespace-nowrap rounded bg-sky-100 px-1.5 py-0.5 text-xs font-medium text-sky-900 dark:bg-sky-950/50 dark:text-sky-100">
                Fra standard
              </span>
              . Typer du tilføjer her selv er{" "}
              <span className="whitespace-nowrap rounded bg-violet-100 px-1.5 py-0.5 text-xs font-medium text-violet-900 dark:bg-violet-950/50 dark:text-violet-100">
                Egen
              </span>
              .
            </p>
          </div>
          {showStandardCatalogEditLink ? (
            <Link
              href="/super-admin/workplace-templates"
              className="text-sm font-medium text-zinc-700 underline hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              Redigér standardkatalog
            </Link>
          ) : null}
        </div>

        {catalogError ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
            Kunne ikke hente standardkatalog: {catalogError}
          </div>
        ) : null}

        <div className="space-y-6">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Vagttyper
          </h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Standardkatalog (Super Admin)
              </p>
              {standardShiftTemplates.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Ingen vagttyper i standardkataloget.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <tr>
                        <th className="px-3 py-2 font-medium">Navn</th>
                        <th className="px-3 py-2 font-medium">Slug</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {standardShiftTemplates.map((r) => (
                        <tr key={r.id}>
                          <td className="px-3 py-2">
                            {localizeStandardShiftTypeLabel(r.name, tr, r.slug)}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs text-zinc-600">
                            {r.slug}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                På denne arbejdsplads
              </p>
              {shiftList.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Ingen vagttyper endnu — tilføj egne nedenfor eller kopier fra
                  standard ved ny arbejdsplads.
                </p>
              ) : (
                <ul className="space-y-2">
                  {shiftList.map((t) => {
                    const stdName = t.template_id
                      ? standardShiftTemplates.find((s) => s.id === t.template_id)
                          ?.name
                      : null;
                    return (
                      <li
                        key={t.id}
                        className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-100 px-3 py-2 text-sm dark:border-zinc-800"
                      >
                        <span className="font-medium">
                          {localizeStandardShiftTypeLabel(t.label, tr)}
                        </span>
                        {t.template_id ? (
                          <span className="inline-flex rounded-md bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-900 dark:bg-sky-950/50 dark:text-sky-100">
                            Fra standard
                          </span>
                        ) : (
                          <span className="inline-flex rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-900 dark:bg-violet-950/50 dark:text-violet-100">
                            Egen
                          </span>
                        )}
                        {stdName ? (
                          <span className="text-xs text-zinc-500">
                            ({localizeStandardShiftTypeLabel(stdName, tr)})
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="flex flex-wrap items-end gap-2 pt-1">
                <label className="min-w-[12rem] flex-1">
                  <span className="mb-1 block text-xs font-medium text-zinc-500">
                    Tilføj egen vagttype
                  </span>
                  <input
                    value={newShiftLabel}
                    onChange={(e) => setNewShiftLabel(e.target.value)}
                    placeholder="Fx Særskilt vagt"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
                <button
                  type="button"
                  disabled={typeBusy || !newShiftLabel.trim()}
                  onClick={() => void handleAddShiftType()}
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  {typeBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Tilføj
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-zinc-100 pt-8 dark:border-zinc-800">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Medarbejdertyper
          </h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Standardkatalog (Super Admin)
              </p>
              {standardEmployeeTemplates.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Ingen medarbejdertyper i standardkataloget.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <tr>
                        <th className="px-3 py-2 font-medium">Navn</th>
                        <th className="px-3 py-2 font-medium">Slug</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {standardEmployeeTemplates.map((r) => (
                        <tr key={r.id}>
                          <td className="px-3 py-2">
                            {localizeStandardEmployeeTypeLabel(r.name, tr, r.slug)}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs text-zinc-600">
                            {r.slug}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                På denne arbejdsplads
              </p>
              {empList.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Ingen medarbejdertyper endnu — tilføj egne nedenfor eller kopier
                  fra standard ved ny arbejdsplads.
                </p>
              ) : (
                <ul className="space-y-2">
                  {empList.map((t) => {
                    const stdName = t.template_id
                      ? standardEmployeeTemplates.find((s) => s.id === t.template_id)
                          ?.name
                      : null;
                    return (
                      <li
                        key={t.id}
                        className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-100 px-3 py-2 text-sm dark:border-zinc-800"
                      >
                        <span className="font-medium">
                          {localizeStandardEmployeeTypeLabel(t.label, tr)}
                        </span>
                        {t.template_id ? (
                          <span className="inline-flex rounded-md bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-900 dark:bg-sky-950/50 dark:text-sky-100">
                            Fra standard
                          </span>
                        ) : (
                          <span className="inline-flex rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-900 dark:bg-violet-950/50 dark:text-violet-100">
                            Egen
                          </span>
                        )}
                        {stdName ? (
                          <span className="text-xs text-zinc-500">
                            ({localizeStandardEmployeeTypeLabel(stdName, tr)})
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="flex flex-wrap items-end gap-2 pt-1">
                <label className="min-w-[12rem] flex-1">
                  <span className="mb-1 block text-xs font-medium text-zinc-500">
                    Tilføj egen medarbejdertype
                  </span>
                  <input
                    value={newEmpLabel}
                    onChange={(e) => setNewEmpLabel(e.target.value)}
                    placeholder="Fx Sæson"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
                <button
                  type="button"
                  disabled={typeBusy || !newEmpLabel.trim()}
                  onClick={() => void handleAddEmployeeType()}
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  {typeBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Tilføj
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {!dashboardTabsEnabled ? (
      <section className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Notifikationer (Push / SMS)
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Styr kun hvem der kan modtage push eller SMS — ikke kalender eller
            vagtplan. Ingen filtrering på en akse betyder alle typer på den akse;
            du kan også begrænse til udvalgte typer.
          </p>
        </div>

        {canCopyMissingStandardTypes ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/50">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Der mangler typer på arbejdspladsen. Kopier fra standardkataloget for
              at kunne vælge målgruppe her.
            </p>
            <button
              type="button"
              disabled={typeBusy}
              onClick={() => void handleCopyTemplatesFromStandards()}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {typeBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Kopier standardtyper
            </button>
          </div>
        ) : null}

        <div className="space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Vagttyper (Push / SMS)
          </p>
          {shiftList.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Ingen vagttyper på arbejdspladsen endnu — tilføj egne under
              &quot;Vagt- og medarbejdertyper&quot; ovenfor eller brug
              &quot;Kopier standardtyper&quot;.
            </p>
          ) : (
            <>
              <div
                className="flex flex-wrap gap-4 text-sm"
                role="radiogroup"
                aria-label="Filtrér Push/SMS efter vagttype"
              >
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="push-shift-mode"
                    checked={shiftModeAll}
                    onChange={() =>
                      setD((x) => ({ ...x, push_include_shift_type_ids: [] }))
                    }
                    className="border-zinc-300"
                  />
                  <span>Alle vagttyper</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="push-shift-mode"
                    checked={!shiftModeAll}
                    onChange={() =>
                      setD((x) => ({
                        ...x,
                        push_include_shift_type_ids: [...shiftAllIds],
                      }))
                    }
                    className="border-zinc-300"
                  />
                  <span>Kun udvalgte vagttyper</span>
                </label>
              </div>

              {shiftModeAll ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Push og SMS kan ramme alle {shiftList.length}{" "}
                  {shiftList.length === 1 ? "vagttype" : "vagttyper"}.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setD((x) => ({
                          ...x,
                          push_include_shift_type_ids: [],
                        }))
                      }
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                    >
                      Alle typer (ingen filter)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setD((x) => ({
                          ...x,
                          push_include_shift_type_ids: [...shiftAllIds],
                        }))
                      }
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                    >
                      Markér alle
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {shiftList.map((t) => (
                      <li key={t.id}>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={pushShift.has(t.id)}
                            onChange={() => toggleShift(t.id)}
                            className="rounded border-zinc-300"
                          />
                          {localizeStandardShiftTypeLabel(t.label, tr)}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Medarbejdertyper (Push / SMS)
          </p>
          {empList.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Ingen medarbejdertyper på arbejdspladsen endnu — tilføj egne under
              &quot;Vagt- og medarbejdertyper&quot; eller brug &quot;Kopier
              standardtyper&quot;.
            </p>
          ) : (
            <>
              <div
                className="flex flex-wrap gap-4 text-sm"
                role="radiogroup"
                aria-label="Filtrér Push/SMS efter medarbejdertype"
              >
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="push-emp-mode"
                    checked={empModeAll}
                    onChange={() =>
                      setD((x) => ({ ...x, push_include_employee_type_ids: [] }))
                    }
                    className="border-zinc-300"
                  />
                  <span>Alle medarbejdertyper</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="push-emp-mode"
                    checked={!empModeAll}
                    onChange={() =>
                      setD((x) => ({
                        ...x,
                        push_include_employee_type_ids: [...empAllIds],
                      }))
                    }
                    className="border-zinc-300"
                  />
                  <span>Kun udvalgte medarbejdertyper</span>
                </label>
              </div>

              {empModeAll ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Push og SMS kan ramme alle {empList.length}{" "}
                  {empList.length === 1 ? "type" : "typer"}.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setD((x) => ({
                          ...x,
                          push_include_employee_type_ids: [],
                        }))
                      }
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                    >
                      Alle typer (ingen filter)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setD((x) => ({
                          ...x,
                          push_include_employee_type_ids: [...empAllIds],
                        }))
                      }
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                    >
                      Markér alle
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {empList.map((t) => (
                      <li key={t.id}>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={pushEmp.has(t.id)}
                            onChange={() => toggleEmp(t.id)}
                            className="rounded border-zinc-300"
                          />
                          {localizeStandardEmployeeTypeLabel(t.label, tr)}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      ) : null}

      {!dashboardTabsEnabled || activeSettingsTab === "api" ? (
      <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          API-nøgler
        </h2>
        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-[8rem]">
            <span className="mb-1 block text-xs font-medium text-zinc-500">
              Label
            </span>
            <input
              value={newKeyLabel}
              onChange={(e) => setNewKeyLabel(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <button
            type="button"
            onClick={() => void genKey()}
            disabled={keyBusy}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            <KeyRound className="h-4 w-4" />
            Generér nøgle
          </button>
        </div>
        {secretOnce && (
          <div
            role="status"
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
          >
            <p className="font-semibold">Kopiér nu — vises kun én gang:</p>
            <code className="mt-2 block break-all font-mono text-xs">
              {secretOnce}
            </code>
          </div>
        )}
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {keys.map((k) => (
            <li
              key={k.id}
              className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
            >
              <span>
                <span className="font-medium">{k.label}</span>{" "}
                <span className="font-mono text-zinc-500">{k.key_prefix}…</span>
                {k.revoked_at ? (
                  <span className="ml-2 text-red-600">Tilbagekaldt</span>
                ) : null}
              </span>
              {!k.revoked_at ? (
                <button
                  type="button"
                  onClick={() => void revokeKey(k.id)}
                  disabled={keyBusy}
                  className="inline-flex items-center gap-1 text-red-600 hover:underline disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Tilbagekald
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
      ) : null}

      {!dashboardTabsEnabled || activeSettingsTab === "billing" ? (
      <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Billing
        </h2>
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/80 px-4 py-6 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-300">
          Her placerer vi fremtidige fakturaer til download.
        </div>
      </section>
      ) : null}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Gem ændringer
        </button>
      </div>

      <div
        className={
          children
            ? "mt-12 border-t border-zinc-200 pb-8 pt-12 dark:border-zinc-800 sm:mt-14 sm:pt-14"
            : "pb-8"
        }
        aria-hidden={!children}
      >
        {children}
      </div>
    </div>
  );
}
