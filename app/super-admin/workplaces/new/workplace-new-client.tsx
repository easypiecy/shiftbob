"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  createWorkplace,
  type CreateWorkplaceInput,
} from "@/src/app/super-admin/workplaces/actions";
import {
  EMPLOYEE_COUNT_BANDS,
  NOTIFICATION_CHANNELS,
} from "@/src/types/workplace";

const empty: CreateWorkplaceInput = {
  name: "",
  company_name: "",
  employee_count_band: "5-20",
  notification_channel: "push",
};

export default function WorkplaceNewClient() {
  const router = useRouter();
  const [form, setForm] = useState<CreateWorkplaceInput>(empty);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await createWorkplace(form);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      if (res.warning) {
        try {
          sessionStorage.setItem("shiftbob_workplace_notice", res.warning);
        } catch {
          /* ignore */
        }
      }
      router.replace(`/super-admin/workplaces/${res.data.id}`);
    } finally {
      setLoading(false);
    }
  }

  function field<K extends keyof CreateWorkplaceInput>(
    key: K,
    value: CreateWorkplaceInput[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link
          href="/super-admin/users"
          className="text-sm font-medium text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Tilbage til arbejdspladser
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Ny arbejdsplads
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Udfyld firmaoplysninger og antal ansatte. Medarbejder- og vagttyper
          kopieres fra standardtyper.
        </p>
      </div>

      <form
        onSubmit={(e) => void onSubmit(e)}
        className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Firma
          </h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Visningsnavn <span className="text-red-600">*</span>
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => field("name", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="Fx Butik Nord"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Firmanavn <span className="text-red-600">*</span>
            </label>
            <input
              required
              value={form.company_name}
              onChange={(e) => field("company_name", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              CVR / VAT
            </label>
            <input
              value={form.vat_number ?? ""}
              onChange={(e) => field("vat_number", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Antal ansatte <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={form.employee_count_band}
              onChange={(e) =>
                field(
                  "employee_count_band",
                  e.target.value as CreateWorkplaceInput["employee_count_band"]
                )
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            >
              {EMPLOYEE_COUNT_BANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Adresse
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Vejnavn
              </label>
              <input
                value={form.street_name ?? ""}
                onChange={(e) => field("street_name", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nr.
              </label>
              <input
                value={form.street_number ?? ""}
                onChange={(e) => field("street_number", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Postnr.
              </label>
              <input
                value={form.postal_code ?? ""}
                onChange={(e) => field("postal_code", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                By
              </label>
              <input
                value={form.city ?? ""}
                onChange={(e) => field("city", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Land (ISO-2)
              </label>
              <input
                maxLength={2}
                value={form.country_code ?? ""}
                onChange={(e) =>
                  field("country_code", e.target.value.toUpperCase())
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm uppercase dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                placeholder="DK"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Yderligere (etage, dør m.m.)
            </label>
            <input
              value={form.address_extra ?? ""}
              onChange={(e) => field("address_extra", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Kontakt
          </h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              E-mail
            </label>
            <input
              type="email"
              value={form.contact_email ?? ""}
              onChange={(e) => field("contact_email", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Telefon
            </label>
            <input
              type="tel"
              value={form.phone ?? ""}
              onChange={(e) => field("phone", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Notifikationer (standard)
            </label>
            <select
              value={form.notification_channel}
              onChange={(e) =>
                field(
                  "notification_channel",
                  e.target.value as CreateWorkplaceInput["notification_channel"]
                )
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            >
              {NOTIFICATION_CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c === "push" ? "Push" : "SMS"}
                </option>
              ))}
            </select>
          </div>
        </section>

        {msg && (
          <p className="text-sm text-red-600 dark:text-red-400">{msg}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Opret arbejdsplads
          </button>
          <Link
            href="/super-admin/users"
            className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium dark:border-zinc-600"
          >
            Annuller
          </Link>
        </div>
      </form>
    </div>
  );
}
