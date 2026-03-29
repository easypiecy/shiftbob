"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
  createCountryHoliday,
  deleteCountryHoliday,
  type CountryHolidayRow,
  type EuCountryRow,
  listCountryHolidays,
  refreshCountryHolidayDefaults,
  updateCountryHoliday,
} from "@/src/app/super-admin/holidays-actions";
import { useTranslations } from "@/src/contexts/translations-context";

type Draft = {
  display_name: string;
  holiday_rule: "fixed" | "easter_offset";
  month: string;
  day: string;
  easter_offset_days: string;
  sort_order: string;
};

function rowToDraft(r: CountryHolidayRow): Draft {
  return {
    display_name: r.display_name,
    holiday_rule: r.holiday_rule,
    month: r.month != null ? String(r.month) : "",
    day: r.day != null ? String(r.day) : "",
    easter_offset_days:
      r.easter_offset_days != null ? String(r.easter_offset_days) : "",
    sort_order: String(r.sort_order),
  };
}

type Props = {
  initialCountries: EuCountryRow[];
};

export default function HolidaysAdminClient({ initialCountries }: Props) {
  const { t } = useTranslations();
  const [countries] = useState(initialCountries);
  const [countryCode, setCountryCode] = useState(
    () => initialCountries[0]?.country_code ?? ""
  );
  const [rows, setRows] = useState<CountryHolidayRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [newRow, setNewRow] = useState({
    stable_code: "",
    display_name: "",
    holiday_rule: "fixed" as "fixed" | "easter_offset",
    month: "",
    day: "",
    easter_offset_days: "",
    sort_order: "100",
  });

  const load = useCallback(async (cc: string) => {
    if (!cc) return;
    setLoading(true);
    setMsg(null);
    const res = await listCountryHolidays(cc);
    setLoading(false);
    if (!res.ok) {
      setMsg(res.error);
      setRows([]);
      setDrafts({});
      return;
    }
    setRows(res.data);
    const d: Record<string, Draft> = {};
    for (const r of res.data) {
      d[r.id] = rowToDraft(r);
    }
    setDrafts(d);
  }, []);

  useEffect(() => {
    void load(countryCode);
  }, [countryCode, load]);

  function setDraft(id: string, patch: Partial<Draft>) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  }

  async function saveRow(id: string) {
    const d = drafts[id];
    if (!d) return;
    setBusyId(id);
    setMsg(null);
    const sort = parseInt(d.sort_order, 10);
    const payload: Parameters<typeof updateCountryHoliday>[1] = {
      display_name: d.display_name,
      holiday_rule: d.holiday_rule,
      sort_order: Number.isNaN(sort) ? 0 : sort,
    };
    if (d.holiday_rule === "fixed") {
      const m = parseInt(d.month, 10);
      const day = parseInt(d.day, 10);
      if (Number.isNaN(m) || Number.isNaN(day) || m < 1 || m > 12 || day < 1 || day > 31) {
        setMsg("Angiv gyldig måned (1–12) og dag (1–31).");
        setBusyId(null);
        return;
      }
      payload.month = m;
      payload.day = day;
      payload.easter_offset_days = null;
    } else {
      const off = parseInt(d.easter_offset_days, 10);
      if (Number.isNaN(off)) {
        setMsg("Angiv offset i dage fra påskesøndag.");
        setBusyId(null);
        return;
      }
      payload.month = null;
      payload.day = null;
      payload.easter_offset_days = off;
    }
    const res = await updateCountryHoliday(id, payload);
    setBusyId(null);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    await load(countryCode);
  }

  async function removeRow(id: string) {
    if (!confirm(t("super_admin.holidays.confirm_delete", "Slet denne helligdag?"))) {
      return;
    }
    setBusyId(id);
    setMsg(null);
    const res = await deleteCountryHoliday(id);
    setBusyId(null);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    await load(countryCode);
  }

  async function addRow() {
    if (!countryCode) return;
    setBusyId("__new__");
    setMsg(null);
    const sort = parseInt(newRow.sort_order, 10);
    const res = await createCountryHoliday({
      country_code: countryCode,
      stable_code: newRow.stable_code.trim() || undefined,
      display_name: newRow.display_name,
      holiday_rule: newRow.holiday_rule,
      month:
        newRow.holiday_rule === "fixed"
          ? parseInt(newRow.month, 10)
          : undefined,
      day:
        newRow.holiday_rule === "fixed"
          ? parseInt(newRow.day, 10)
          : undefined,
      easter_offset_days:
        newRow.holiday_rule === "easter_offset"
          ? parseInt(newRow.easter_offset_days, 10)
          : undefined,
      sort_order: Number.isNaN(sort) ? 100 : sort,
    });
    setBusyId(null);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    setNewRow({
      stable_code: "",
      display_name: "",
      holiday_rule: "fixed",
      month: "",
      day: "",
      easter_offset_days: "",
      sort_order: "100",
    });
    await load(countryCode);
  }

  if (countries.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {t(
          "super_admin.holidays.no_countries",
          "Ingen EU-lande i databasen — kør supabase_i18n_setup.sql først."
        )}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("super_admin.holidays.title", "Helligdage (EU-27)")}
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
          {t(
            "super_admin.holidays.intro",
            "Offentlige helligdage pr. land. Navne og dato-regler kan rettes her. Påske-relaterede dage bruger vestlig påske (kan afvige for lande med ortodoks kalender — ret manuelt)."
          )}
        </p>
      </div>

      {msg ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
          {msg}
        </div>
      ) : null}

      <label className="flex max-w-md flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {t("super_admin.holidays.country_label", "Land")}
        </span>
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
        >
          {countries.map((c) => (
            <option key={c.country_code} value={c.country_code}>
              {c.name} ({c.country_code})
            </option>
          ))}
        </select>
      </label>
      <div>
        <button
          type="button"
          disabled={!countryCode || busyId === "__refresh__"}
          onClick={async () => {
            if (!countryCode) return;
            setBusyId("__refresh__");
            setMsg(null);
            const res = await refreshCountryHolidayDefaults(countryCode);
            setBusyId(null);
            if (!res.ok) {
              setMsg(res.error);
              return;
            }
            setMsg(
              t(
                "super_admin.holidays.refresh_done",
                `Standardhelligdage opdateret (${res.upserted}) for valgt land.`
              )
            );
            await load(countryCode);
          }}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          {busyId === "__refresh__" ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("super_admin.holidays.refreshing", "Opdaterer…")}
            </span>
          ) : (
            t(
              "super_admin.holidays.refresh_defaults",
              "Opdater helligdage for valgt land (på originalsproget)"
            )
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("super_admin.holidays.loading", "Henter…")}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
          <table className="min-w-[720px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left dark:border-zinc-700 dark:bg-zinc-900/80">
                <th className="px-3 py-2 font-semibold text-zinc-800 dark:text-zinc-200">
                  {t("super_admin.holidays.col_stable", "Kode")}
                </th>
                <th className="px-3 py-2 font-semibold text-zinc-800 dark:text-zinc-200">
                  {t("super_admin.holidays.col_name", "Navn")}
                </th>
                <th className="px-3 py-2 font-semibold text-zinc-800 dark:text-zinc-200">
                  {t("super_admin.holidays.col_rule", "Regel")}
                </th>
                <th className="px-3 py-2 font-semibold text-zinc-800 dark:text-zinc-200">
                  {t("super_admin.holidays.col_date", "Dato / offset")}
                </th>
                <th className="px-3 py-2 font-semibold text-zinc-800 dark:text-zinc-200">
                  {t("super_admin.holidays.col_sort", "Sort")}
                </th>
                <th className="px-3 py-2 font-semibold text-zinc-800 dark:text-zinc-200">
                  {t("super_admin.holidays.col_actions", "")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const d = drafts[r.id];
                if (!d) return null;
                return (
                  <tr
                    key={r.id}
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="px-3 py-2 font-mono text-xs text-zinc-500">
                      {r.stable_code}
                    </td>
                    <td className="px-3 py-2">
                      <input
                        translate="no"
                        value={d.display_name}
                        onChange={(e) =>
                          setDraft(r.id, { display_name: e.target.value })
                        }
                        className="notranslate w-full min-w-[140px] rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={d.holiday_rule}
                        onChange={(e) =>
                          setDraft(r.id, {
                            holiday_rule: e.target.value as
                              | "fixed"
                              | "easter_offset",
                          })
                        }
                        className="rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
                      >
                        <option value="fixed">
                          {t("super_admin.holidays.rule_fixed", "Fast dato")}
                        </option>
                        <option value="easter_offset">
                          {t(
                            "super_admin.holidays.rule_easter",
                            "Påske-offset"
                          )}
                        </option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      {d.holiday_rule === "fixed" ? (
                        <div className="flex gap-1">
                          <input
                            type="number"
                            min={1}
                            max={12}
                            placeholder="M"
                            value={d.month}
                            onChange={(e) =>
                              setDraft(r.id, { month: e.target.value })
                            }
                            className="w-14 rounded border border-zinc-300 bg-white px-1 py-1 dark:border-zinc-600 dark:bg-zinc-950"
                          />
                          <input
                            type="number"
                            min={1}
                            max={31}
                            placeholder="D"
                            value={d.day}
                            onChange={(e) =>
                              setDraft(r.id, { day: e.target.value })
                            }
                            className="w-14 rounded border border-zinc-300 bg-white px-1 py-1 dark:border-zinc-600 dark:bg-zinc-950"
                          />
                        </div>
                      ) : (
                        <input
                          type="number"
                          value={d.easter_offset_days}
                          onChange={(e) =>
                            setDraft(r.id, {
                              easter_offset_days: e.target.value,
                            })
                          }
                          title={t(
                            "super_admin.holidays.offset_hint",
                            "Dage fra påskesøndag (fx -2, 1, 39)"
                          )}
                          className="w-20 rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
                        />
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={d.sort_order}
                        onChange={(e) =>
                          setDraft(r.id, { sort_order: e.target.value })
                        }
                        className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={busyId === r.id}
                          onClick={() => void saveRow(r.id)}
                          className="rounded bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                        >
                          {busyId === r.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            t("super_admin.holidays.save", "Gem")
                          )}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === r.id}
                          onClick={() => void removeRow(r.id)}
                          className="rounded border border-red-300 p-1 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/50"
                          aria-label={t("super_admin.holidays.delete", "Slet")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-600">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {t("super_admin.holidays.add_section", "Tilføj helligdag")}
        </h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs">
            <span>{t("super_admin.holidays.new_stable", "Stabil kode (valgfri)")}</span>
            <input
              value={newRow.stable_code}
              onChange={(e) =>
                setNewRow((s) => ({ ...s, stable_code: e.target.value }))
              }
              placeholder="fx sommerferie_start"
              className="rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span>{t("super_admin.holidays.new_name", "Navn")}</span>
            <input
              translate="no"
              value={newRow.display_name}
              onChange={(e) =>
                setNewRow((s) => ({ ...s, display_name: e.target.value }))
              }
              className="notranslate min-w-[160px] rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span>{t("super_admin.holidays.col_rule", "Regel")}</span>
            <select
              value={newRow.holiday_rule}
              onChange={(e) =>
                setNewRow((s) => ({
                  ...s,
                  holiday_rule: e.target.value as "fixed" | "easter_offset",
                }))
              }
              className="rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
            >
              <option value="fixed">
                {t("super_admin.holidays.rule_fixed", "Fast dato")}
              </option>
              <option value="easter_offset">
                {t("super_admin.holidays.rule_easter", "Påske-offset")}
              </option>
            </select>
          </label>
          {newRow.holiday_rule === "fixed" ? (
            <>
              <label className="flex flex-col gap-1 text-xs">
                <span>M</span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={newRow.month}
                  onChange={(e) =>
                    setNewRow((s) => ({ ...s, month: e.target.value }))
                  }
                  className="w-14 rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span>D</span>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={newRow.day}
                  onChange={(e) =>
                    setNewRow((s) => ({ ...s, day: e.target.value }))
                  }
                  className="w-14 rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
                />
              </label>
            </>
          ) : (
            <label className="flex flex-col gap-1 text-xs">
              <span>Offset</span>
              <input
                type="number"
                value={newRow.easter_offset_days}
                onChange={(e) =>
                  setNewRow((s) => ({
                    ...s,
                    easter_offset_days: e.target.value,
                  }))
                }
                className="w-20 rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
              />
            </label>
          )}
          <label className="flex flex-col gap-1 text-xs">
            <span>{t("super_admin.holidays.col_sort", "Sort")}</span>
            <input
              type="number"
              value={newRow.sort_order}
              onChange={(e) =>
                setNewRow((s) => ({ ...s, sort_order: e.target.value }))
              }
              className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>
          <button
            type="button"
            disabled={busyId === "__new__"}
            onClick={() => void addRow()}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {busyId === "__new__" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("super_admin.holidays.add", "Tilføj")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
