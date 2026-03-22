"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { setUserLayoutTheme } from "@/src/app/user-ui-actions";
import type { UiThemeId } from "@/src/lib/ui-theme";

type Item = { id: UiThemeId; label: string };

const ITEMS: Item[] = [
  { id: "dark", label: "Mørkt layout" },
  { id: "light", label: "Lyst layout" },
  { id: "unicorn", label: "Unicorn-layout" },
];

export function LayoutThemeSidebar({ initialTheme }: { initialTheme: UiThemeId }) {
  const router = useRouter();
  const [theme, setTheme] = useState<UiThemeId>(initialTheme);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  function select(next: UiThemeId) {
    if (next === theme) return;
    setTheme(next);
    startTransition(async () => {
      const res = await setUserLayoutTheme(next);
      if (res.ok) {
        router.refresh();
      } else {
        setTheme(initialTheme);
      }
    });
  }

  return (
    <div
      className="flex shrink-0 items-center justify-end gap-1.5"
      role="group"
      aria-label="Side-layout"
    >
      {ITEMS.map(({ id, label }) => {
        const active = theme === id;

        return (
          <button
            key={id}
            type="button"
            disabled={pending}
            onClick={() => select(id)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={
              active
                ? "rounded-full p-0.5 ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-100 transition hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-50 dark:ring-offset-zinc-900"
                : "rounded-full p-0.5 transition hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-50"
            }
          >
            {id === "dark" ? (
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-[0.25px] border-zinc-400 bg-white shadow-sm dark:border-zinc-500">
                <span className="h-5 w-5 rounded-full bg-black" />
              </span>
            ) : id === "light" ? (
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-[0.25px] border-zinc-600 bg-black shadow-sm">
                <span className="h-5 w-5 rounded-full bg-white" />
              </span>
            ) : (
              <span
                className="block h-7 w-7 rounded-full shadow-sm ring-[0.25px] ring-white/50"
                style={{
                  background:
                    "conic-gradient(from 0deg, #e11d48, #f59e0b, #eab308, #22c55e, #06b6d4, #6366f1, #a855f7, #e11d48)",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
