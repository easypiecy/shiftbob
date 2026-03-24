import Image from "next/image";
import { redirect } from "next/navigation";
import { HomeTopBar } from "./home-top-bar";
import { createTranslator } from "@/src/lib/translations-server";
import {
  getUiTranslations,
  resolveRequestUiLanguage,
} from "@/src/lib/ui-language-server";

/**
 * Supabase kan sende PKCE `code` til Site URL (`/`) hvis `redirectTo` ikke matcher
 * allowlist (fx apex vs `www`). Send brugeren til route handler der udveksler code.
 */
function redirectRootOAuthToCallback(
  searchParams: Record<string, string | string[] | undefined>
) {
  const code = searchParams.code;
  if (typeof code !== "string" || !code) return;

  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => qs.append(key, v));
    } else {
      qs.set(key, value);
    }
  }
  redirect(`/auth/callback?${qs.toString()}`);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  redirectRootOAuthToCallback(sp);

  const [map, lang] = await Promise.all([
    getUiTranslations(),
    resolveRequestUiLanguage(),
  ]);
  const t = createTranslator(map);

  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center bg-white px-6 py-24 text-black dark:bg-white dark:text-black">
      <HomeTopBar
        currentLanguage={lang}
        loginLabel={t("home.nav.login", "Log ind")}
        languageAriaLabel={t("login.language_picker.label", "Language")}
      />
      <main className="flex max-w-lg flex-col items-center text-center">
        <Image
          src="/ShiftBob-circle-logo-light-1024.png"
          alt="ShiftBob"
          width={1024}
          height={1024}
          priority
          className="h-auto w-[min(280px,80vw)] sm:w-[min(320px,70vw)]"
        />
        <p className="mt-8 text-lg font-medium tracking-tight text-black dark:text-black sm:text-xl">
          We&apos;re working on a tight schedule!
        </p>
      </main>
    </div>
  );
}
