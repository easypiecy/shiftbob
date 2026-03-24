"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  FileText,
  Link2,
  Loader2,
  Pencil,
  Plus,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import type { WorkplaceRow } from "@/src/app/super-admin/workplaces/actions";
import {
  assignWorkplaceRole,
  getUserCvSignedUrl,
  impersonateUser,
  removeUserCv,
  type UserAdminRow,
  updateUserProfile,
  uploadUserCv,
} from "@/src/app/super-admin/users/actions";

const ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE"] as const;

type TabId = "workplaces" | "users";

function tabFromSearchParams(searchParams: URLSearchParams): TabId {
  return searchParams.get("tab") === "users" ? "users" : "workplaces";
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("da-DK", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

type ProfileFormState = {
  first_name: string;
  last_name: string;
  street_name: string;
  street_number: string;
  postal_code: string;
  city: string;
  mobile_phone: string;
  note: string;
};

function profileToForm(u: UserAdminRow): ProfileFormState {
  const p = u.profile;
  return {
    first_name: p?.first_name ?? "",
    last_name: p?.last_name ?? "",
    street_name: p?.street_name ?? "",
    street_number: p?.street_number ?? "",
    postal_code: p?.postal_code ?? "",
    city: p?.city ?? "",
    mobile_phone: p?.mobile_phone ?? "",
    note: p?.note ?? "",
  };
}

type Props = {
  initialWorkplaces: WorkplaceRow[];
  initialUsers: UserAdminRow[];
};

export default function UsersAdminClient({
  initialWorkplaces,
  initialUsers,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = tabFromSearchParams(searchParams);
  const [tab, setTab] = useState<TabId>(tabFromUrl);

  useEffect(() => {
    setTab(tabFromUrl);
  }, [tabFromUrl]);

  function goToTab(next: TabId) {
    setTab(next);
    if (next === "users") {
      router.replace("/super-admin/users?tab=users", { scroll: false });
    } else {
      router.replace("/super-admin/users", { scroll: false });
    }
  }

  const [workplaces, setWorkplaces] = useState(initialWorkplaces);
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    setWorkplaces(initialWorkplaces);
  }, [initialWorkplaces]);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const [modalUser, setModalUser] = useState<UserAdminRow | null>(null);
  const [wpId, setWpId] = useState("");
  const [role, setRole] = useState<string>("EMPLOYEE");
  const [assigning, setAssigning] = useState(false);
  const [assignMsg, setAssignMsg] = useState<string | null>(null);
  const [impersonatingEmail, setImpersonatingEmail] = useState<string | null>(
    null
  );

  const [editUser, setEditUser] = useState<UserAdminRow | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    first_name: "",
    last_name: "",
    street_name: "",
    street_number: "",
    postal_code: "",
    city: "",
    mobile_phone: "",
    note: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [cvBusy, setCvBusy] = useState(false);

  useEffect(() => {
    if (!editUser) return;
    const next = users.find((u) => u.id === editUser.id);
    if (next) setEditUser(next);
  }, [users, editUser?.id]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  async function handleImpersonate(email: string | null) {
    if (!email) return;
    const ok = window.confirm(
      "Advarsel: Dette vil logge dig ud af din Super Admin konto og ind som denne bruger. Vil du fortsætte?"
    );
    if (!ok) return;

    setImpersonatingEmail(email);
    try {
      const res = await impersonateUser(email);
      if (!res.ok) {
        window.alert(res.error);
        return;
      }
      window.location.href = res.actionLink;
    } finally {
      setImpersonatingEmail(null);
    }
  }

  function openEditUser(u: UserAdminRow) {
    setEditUser(u);
    setProfileForm(profileToForm(u));
    setProfileMsg(null);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const res = await updateUserProfile(editUser.id, {
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        street_name: profileForm.street_name,
        street_number: profileForm.street_number,
        postal_code: profileForm.postal_code,
        city: profileForm.city,
        mobile_phone: profileForm.mobile_phone,
        note: profileForm.note,
      });
      if (!res.ok) {
        setProfileMsg(res.error);
        return;
      }
      setEditUser(null);
      refresh();
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleCvFileChange(file: File | undefined) {
    if (!editUser || !file) return;
    setCvBusy(true);
    setProfileMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadUserCv(editUser.id, fd);
      if (!res.ok) {
        setProfileMsg(res.error);
        return;
      }
      refresh();
    } finally {
      setCvBusy(false);
    }
  }

  async function handleViewCv() {
    if (!editUser) return;
    setCvBusy(true);
    setProfileMsg(null);
    try {
      const res = await getUserCvSignedUrl(editUser.id);
      if (!res.ok) {
        setProfileMsg(res.error);
        return;
      }
      window.open(res.url, "_blank", "noopener,noreferrer");
    } finally {
      setCvBusy(false);
    }
  }

  async function handleRemoveCv() {
    if (!editUser) return;
    if (!window.confirm("Fjerne CV fra denne bruger?")) return;
    setCvBusy(true);
    setProfileMsg(null);
    try {
      const res = await removeUserCv(editUser.id);
      if (!res.ok) {
        setProfileMsg(res.error);
        return;
      }
      refresh();
    } finally {
      setCvBusy(false);
    }
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!modalUser || !wpId) return;
    setAssignMsg(null);
    setAssigning(true);
    try {
      const res = await assignWorkplaceRole(modalUser.id, wpId, role);
      if (!res.ok) {
        setAssignMsg(res.error);
        return;
      }
      setModalUser(null);
      setWpId("");
      setRole("EMPLOYEE");
      refresh();
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Kunder &amp; brugere
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Administrér arbejdspladser og tilknyt brugere med roller.
        </p>
      </div>

      <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-1 dark:border-zinc-700 dark:bg-zinc-800/50">
        <button
          type="button"
          onClick={() => goToTab("workplaces")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
            tab === "workplaces"
              ? "bg-white text-zinc-900 shadow dark:bg-zinc-900 dark:text-zinc-50"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          }`}
        >
          <Building2 className="h-4 w-4" aria-hidden />
          Arbejdspladser
        </button>
        <button
          type="button"
          onClick={() => goToTab("users")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
            tab === "users"
              ? "bg-white text-zinc-900 shadow dark:bg-zinc-900 dark:text-zinc-50"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          }`}
        >
          <Users className="h-4 w-4" aria-hidden />
          Brugere &amp; tilknytning
        </button>
      </div>

      {tab === "workplaces" && (
        <section className="space-y-6">
          <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Opret med firmaoplysninger, antal ansatte og adresse. Typer
              kopieres fra standarder.
            </p>
            <Link
              href="/super-admin/workplaces/new"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Ny arbejdsplads
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    Firma / navn
                  </th>
                  <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    By
                  </th>
                  <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    Oprettet
                  </th>
                  <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    Handling
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {workplaces.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-zinc-500"
                    >
                      Ingen arbejdspladser endnu.
                    </td>
                  </tr>
                ) : (
                  workplaces.map((w) => (
                    <tr key={w.id}>
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                        {w.company_name ?? w.name}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {w.city ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {formatDate(w.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/super-admin/workplaces/${w.id}`}
                          className="text-sm font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Rediger
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "users" && (
        <section>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    E-mail
                  </th>
                  <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    Oprettet
                  </th>
                  <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    Globale roller
                  </th>
                  <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    Handling
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                      {u.email ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400">
                      {u.globalRoles.length ? u.globalRoles.join(", ") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditUser(u)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                          Rediger
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImpersonate(u.email)}
                          disabled={!u.email || impersonatingEmail !== null}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          {impersonatingEmail === u.email ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <UserCircle className="h-3.5 w-3.5" aria-hidden />
                          )}
                          Log ind som
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setModalUser(u);
                            setWpId(workplaces[0]?.id ?? "");
                            setRole("EMPLOYEE");
                            setAssignMsg(null);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                          <Link2 className="h-3.5 w-3.5" aria-hidden />
                          Tilknyt arbejdsplads
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {modalUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Luk"
            onClick={() => setModalUser(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-4">
              <h2 id="modal-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Tilknyt arbejdsplads
              </h2>
              <button
                type="button"
                onClick={() => setModalUser(null)}
                className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {modalUser.email}
            </p>
            <form onSubmit={handleAssign} className="mt-6 space-y-4">
              {workplaces.length === 0 ? (
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Opret mindst én arbejdsplads under fanen{" "}
                  <strong>Arbejdspladser</strong> før du tilknytter brugere.
                </p>
              ) : null}
              <div>
                <label
                  htmlFor="modal-wp"
                  className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  Arbejdsplads
                </label>
                <select
                  id="modal-wp"
                  value={wpId}
                  onChange={(e) => setWpId(e.target.value)}
                  required
                  disabled={workplaces.length === 0}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <option value="" disabled>
                    Vælg …
                  </option>
                  {workplaces.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="modal-role"
                  className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  Rolle
                </label>
                <select
                  id="modal-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              {assignMsg && (
                <p className="text-sm text-red-600 dark:text-red-400">{assignMsg}</p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalUser(null)}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-600"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  disabled={assigning || !wpId}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {assigning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Gem tilknytning"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editUser && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-user-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Luk"
            onClick={() => setEditUser(null)}
          />
          <div className="relative z-10 my-8 w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-4">
              <h2
                id="edit-user-title"
                className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
              >
                Rediger bruger
              </h2>
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {editUser.email}
            </p>

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                    Fornavn
                  </span>
                  <input
                    value={profileForm.first_name}
                    onChange={(e) =>
                      setProfileForm((f) => ({
                        ...f,
                        first_name: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    autoComplete="given-name"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                    Efternavn
                  </span>
                  <input
                    value={profileForm.last_name}
                    onChange={(e) =>
                      setProfileForm((f) => ({
                        ...f,
                        last_name: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    autoComplete="family-name"
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                    Vejnavn
                  </span>
                  <input
                    value={profileForm.street_name}
                    onChange={(e) =>
                      setProfileForm((f) => ({
                        ...f,
                        street_name: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    autoComplete="street-address"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                    Vej nr.
                  </span>
                  <input
                    value={profileForm.street_number}
                    onChange={(e) =>
                      setProfileForm((f) => ({
                        ...f,
                        street_number: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                    Postnummer
                  </span>
                  <input
                    value={profileForm.postal_code}
                    onChange={(e) =>
                      setProfileForm((f) => ({
                        ...f,
                        postal_code: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    autoComplete="postal-code"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                    By
                  </span>
                  <input
                    value={profileForm.city}
                    onChange={(e) =>
                      setProfileForm((f) => ({ ...f, city: e.target.value }))
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    autoComplete="address-level2"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                  Mobilnummer
                </span>
                <input
                  value={profileForm.mobile_phone}
                  onChange={(e) =>
                    setProfileForm((f) => ({
                      ...f,
                      mobile_phone: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                  Note om medarbejderen
                </span>
                <span className="mb-2 block text-xs text-zinc-500 dark:text-zinc-400">
                  Kun synlig for Super Admin. Kort intern bemærkning.
                </span>
                <textarea
                  value={profileForm.note}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, note: e.target.value }))
                  }
                  rows={4}
                  className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                  placeholder="Fx kursus, særlige hensyn, kontaktperson …"
                />
              </label>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
                <p className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  CV
                </p>
                <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
                  PDF eller Word, max 10 MB.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
                    <FileText className="h-4 w-4" aria-hidden />
                    Upload CV
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx,application/pdf"
                      disabled={cvBusy}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        void handleCvFileChange(f);
                      }}
                    />
                  </label>
                  {editUser.profile?.cv_storage_path ? (
                    <>
                      <button
                        type="button"
                        disabled={cvBusy}
                        onClick={() => void handleViewCv()}
                        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        Se CV
                      </button>
                      <button
                        type="button"
                        disabled={cvBusy}
                        onClick={() => void handleRemoveCv()}
                        className="rounded-lg px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/50"
                      >
                        Fjern CV
                      </button>
                    </>
                  ) : null}
                  {cvBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                  ) : null}
                </div>
              </div>

              {profileMsg ? (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {profileMsg}
                </p>
              ) : null}

              <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-600"
                >
                  Luk
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {profileSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Gem profil"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
