"use client";

import { useEffect, useState } from "react";
import { Bot, Lock, ShieldCheck } from "lucide-react";

type PermissionLevel = 1 | 2 | 3;

type TranslateFn = (key: string, fallback?: string) => string;

type Option = {
  value: PermissionLevel;
  title: string;
  description: string;
  Icon: typeof Bot;
};

type Props = {
  value?: PermissionLevel;
  onChange?: (value: PermissionLevel) => void;
  t: TranslateFn;
};

export function EmployeePermissions({ value, onChange, t }: Props) {
  const [swapPermissionLevel, setSwapPermissionLevel] = useState<PermissionLevel>(
    value ?? 2
  );

  useEffect(() => {
    if (!value) return;
    setSwapPermissionLevel(value);
  }, [value]);

  const options: Option[] = [
    {
      value: 1,
      title: t(
        "settings.employee_permissions.level1.title",
        "Niveau 1: Fuld Autopilot (Maksimal tidsbesparelse)"
      ),
      description: t(
        "settings.employee_permissions.level1.description",
        "Medarbejdere kan frit bytte og tage ledige vagter. Systemet godkender automatisk, så længe EU-reglerne (f.eks. 11-timers reglen) overholdes."
      ),
      Icon: Bot,
    },
    {
      value: 2,
      title: t(
        "settings.employee_permissions.level2.title",
        "Niveau 2: Manuel Kontrol (Anbefalet)"
      ),
      description: t(
        "settings.employee_permissions.level2.description",
        "Medarbejdere kan anmode om at bytte vagter. Ændringer træder først i kraft, når en manager har godkendt dem her på portalen."
      ),
      Icon: ShieldCheck,
    },
    {
      value: 3,
      title: t(
        "settings.employee_permissions.level3.title",
        "Niveau 3: Skrivebeskyttet (Ingen indflydelse)"
      ),
      description: t(
        "settings.employee_permissions.level3.description",
        "Appen fungerer udelukkende som en læse-kalender. Medarbejdere kan ikke bytte vagter eller sætte vagter til salg."
      ),
      Icon: Lock,
    },
  ];

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const selected = swapPermissionLevel === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setSwapPermissionLevel(option.value);
              onChange?.(option.value);
            }}
            className={[
              "w-full rounded-xl border p-4 text-left transition",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
              selected
                ? "border-blue-500 bg-blue-50/80 dark:border-blue-400 dark:bg-blue-950/30"
                : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600",
            ].join(" ")}
            aria-pressed={selected}
          >
            <div className="flex items-start gap-3">
              <div
                className={[
                  "mt-0.5 rounded-lg p-2",
                  selected
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
                ].join(" ")}
              >
                <option.Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {option.title}
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {option.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
