import Link from "next/link";
import {
  Building2,
  CalendarRange,
  ChevronRight,
  Languages,
  LayoutDashboard,
  Tags,
} from "lucide-react";

const cards = [
  {
    href: "/super-admin/users",
    title: "Brugere & arbejdspladser",
    description:
      "Arbejdspladsliste, brugere, tilknytning og redigering af hver arbejdsplads (inkl. ny arbejdsplads og afdelinger).",
    icon: Building2,
  },
  {
    href: "/super-admin/workplace-templates",
    title: "Standard vagt- og medarbejdertyper",
    description: "Globalt katalog der kopieres til nye arbejdspladser.",
    icon: Tags,
  },
  {
    href: "/super-admin/helligdage",
    title: "Helligdage (EU-27)",
    description:
      "Offentlige helligdage pr. land — redigerbare navne og dato-regler.",
    icon: CalendarRange,
  },
  {
    href: "/super-admin/translations",
    title: "Sprog og oversættelser",
    description: "Sprog, EU-lande og UI-strenge.",
    icon: Languages,
  },
] as const;

export default function SuperAdminOverviewPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <LayoutDashboard className="h-4 w-4" aria-hidden />
          <span>Oversigt</span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Super Admin
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Vælg et område nedenfor. Samme punkter findes i sidemenuen til venstre.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ href, title, description, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
              </div>
              <span className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50">
                {title}
              </span>
              <span className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
