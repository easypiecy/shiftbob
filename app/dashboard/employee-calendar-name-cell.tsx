"use client";

import { useCallback, useRef } from "react";
import type { WorkplaceMemberDepartmentsRow } from "@/src/app/super-admin/workplaces/actions";
import { useTranslations } from "@/src/contexts/translations-context";

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

function firstNameFromDisplay(displayName: string): string {
  const t = displayName.trim();
  if (!t) return "";
  return t.split(/\s+/)[0] ?? t;
}

function shortWorkplaceMemberId(id: string): string {
  return id.replace(/-/g, "").slice(0, 8);
}

function calendarNameLabel(
  emp: WorkplaceMemberDepartmentsRow,
  viewerUserId: string | null,
  nameMode: "full" | "privacy"
): string {
  if (nameMode === "full") return emp.display_name;
  if (viewerUserId && emp.user_id === viewerUserId) return emp.display_name;
  return `${firstNameFromDisplay(emp.display_name)} · ${shortWorkplaceMemberId(emp.workplace_member_id)}`;
}

type Props = {
  emp: WorkplaceMemberDepartmentsRow;
  viewerUserId: string | null;
  nameMode: "full" | "privacy";
  employeeTypeLabel?: string;
  canEdit: boolean;
  onOpenEdit?: () => void;
};

export default function EmployeeCalendarNameCell({
  emp,
  viewerUserId,
  nameMode,
  employeeTypeLabel,
  canEdit,
  onOpenEdit,
}: Props) {
  const { t } = useTranslations();
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
    if (!canEdit) return;
    if (Date.now() < suppressClickUntil.current) return;
    onOpenEdit?.();
  }, [canEdit, onOpenEdit]);

  const label = calendarNameLabel(emp, viewerUserId, nameMode);
  const hoverTitle = employeeTypeLabel?.trim()
    ? `${label}\n${t("calendar.shift_hover.employee_type", "Medarbejdertype")}: ${employeeTypeLabel}`
    : label;

  return (
    <>
      <div className="flex min-w-0 max-w-[220px] items-center">
        <button
          type="button"
          disabled={!canEdit}
          className={
            canEdit
              ? "min-w-0 flex-1 cursor-pointer rounded px-0 py-0 text-left text-sm font-medium focus-visible:outline focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500"
              : "min-w-0 flex-1 cursor-default rounded px-0 py-0 text-left text-sm font-medium"
          }
          onPointerDown={canEdit ? onPointerDown : undefined}
          onPointerUp={canEdit ? onPointerUp : undefined}
          onPointerCancel={canEdit ? onPointerUp : undefined}
          onPointerLeave={canEdit ? onPointerUp : undefined}
          onClick={onClickOpen}
          title={hoverTitle}
          aria-label={
            canEdit
              ? t("calendar.name_cell.aria_edit", "Medarbejder {name}, rediger").replace(
                  "{name}",
                  emp.display_name
                )
              : t("calendar.name_cell.aria_view", "Medarbejder {name}").replace(
                  "{name}",
                  label
                )
          }
        >
          <div
            ref={scrollRef}
            className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <span className="employee-calendar-name inline-block whitespace-nowrap">
              {label}
            </span>
          </div>
        </button>
      </div>
    </>
  );
}
