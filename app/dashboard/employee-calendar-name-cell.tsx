"use client";

import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import {
  updateWorkplaceMemberCalendarProfile,
} from "@/src/app/dashboard/workplace-member-calendar-actions";
import type { WorkplaceMemberDepartmentsRow } from "@/src/app/super-admin/workplaces/actions";

const LONG_PRESS_MS = 520;
const MARQUEE_MS = 2400;

function runMarqueeScroll(container: HTMLDivElement) {
  const max = container.scrollWidth - container.clientWidth;
  if (max <= 0) return;
  container.scrollLeft = 0;
  const start = performance.now();
  function tick(now: number) {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / MARQUEE_MS);
    const phase = Math.sin(t * Math.PI);
    container.scrollLeft = phase * max;
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      container.scrollLeft = 0;
    }
  }
  requestAnimationFrame(tick);
}

type Props = {
  workplaceId: string;
  emp: WorkplaceMemberDepartmentsRow;
  onSaved: () => void;
};

export default function EmployeeCalendarNameCell({
  workplaceId,
  emp,
  onSaved,
}: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [overrideDraft, setOverrideDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClickUntil = useRef(0);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const onPointerDown = useCallback(() => {
    clearLongPress();
    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null;
      suppressClickUntil.current = Date.now() + 650;
      const el = scrollRef.current;
      if (!el) return;
      if (el.scrollWidth <= el.clientWidth) return;
      runMarqueeScroll(el);
    }, LONG_PRESS_MS);
  }, [clearLongPress]);

  const onPointerUp = useCallback(() => {
    clearLongPress();
  }, [clearLongPress]);

  const onClickOpen = useCallback(() => {
    if (Date.now() < suppressClickUntil.current) return;
    setOverrideDraft(emp.display_name_override ?? "");
    setSaveError(null);
    setEditOpen(true);
  }, [emp.display_name_override]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    const trimmed = overrideDraft.trim();
    const res = await updateWorkplaceMemberCalendarProfile(workplaceId, emp.user_id, {
      displayNameOverride: trimmed === "" ? null : trimmed,
    });
    setSaving(false);
    if (!res.ok) {
      setSaveError(res.error);
      return;
    }
    setEditOpen(false);
    onSaved();
  }, [overrideDraft, workplaceId, emp.user_id, onSaved]);

  const modal =
    editOpen && typeof document !== "undefined" ? (
      <div className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4">
        <button
          type="button"
          className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
          aria-label="Luk dialog"
          onClick={() => setEditOpen(false)}
        />
        <div
          className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 sm:rounded-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="emp-edit-title"
        >
          <div className="flex items-start justify-between gap-3">
            <h2
              id="emp-edit-title"
              className="text-lg font-semibold text-violet-700 dark:text-violet-200"
            >
              Medarbejder
            </h2>
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label="Luk"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-1 text-sm">
            <p className="text-zinc-500 dark:text-zinc-400">E-mail (fra login)</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {emp.email ?? "—"}
            </p>
          </div>

          {emp.oauth_display_name ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Navn fra login (Google/Facebook m.m.):{" "}
              <span className="font-medium text-violet-700 dark:text-violet-300">
                {emp.oauth_display_name}
              </span>
            </p>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Intet navn fra login endnu — bruges e-mail som fallback.
            </p>
          )}

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Vist navn i kalenderen
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Tilsidesætter navn fra login for denne arbejdsplads. Lad feltet være tomt for at bruge
              login-navn / e-mail.
            </span>
            <input
              type="text"
              value={overrideDraft}
              onChange={(e) => setOverrideDraft(e.target.value)}
              placeholder={emp.oauth_display_name ?? emp.email ?? ""}
              className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-violet-800 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 dark:border-violet-500/40 dark:bg-zinc-950 dark:text-violet-100 dark:placeholder:text-zinc-500"
              autoComplete="off"
            />
          </label>

          {saveError ? (
            <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSave()}
              className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              {saving ? "Gemmer…" : "Gem"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => setEditOpen(false)}
              className="rounded-lg border border-violet-200 bg-violet-100 px-4 py-2.5 text-sm font-medium text-violet-900 shadow-sm hover:bg-violet-200 disabled:opacity-50 dark:border-violet-700/80 dark:bg-violet-900/80 dark:text-violet-50 dark:hover:bg-violet-800"
            >
              Annuller
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <div className="flex min-w-0 max-w-[220px] items-center">
        <button
          type="button"
          className="min-w-0 flex-1 cursor-pointer rounded px-0 py-0 text-left text-sm font-medium focus-visible:outline focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          onClick={onClickOpen}
          aria-label={`Medarbejder ${emp.display_name}, rediger`}
        >
          <div
            ref={scrollRef}
            className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <span className="employee-calendar-name inline-block whitespace-nowrap">
              {emp.display_name}
            </span>
          </div>
        </button>
      </div>

      {modal && createPortal(modal, document.body)}
    </>
  );
}
