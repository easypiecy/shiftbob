"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  isSupportedUiLanguage,
  UI_LANGUAGE_COOKIE,
} from "@/src/lib/ui-language";

export async function setUiLanguageAction(
  languageCode: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupportedUiLanguage(languageCode)) {
    return { ok: false, error: "Unsupported language" };
  }
  const jar = await cookies();
  jar.set(UI_LANGUAGE_COOKIE, languageCode, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === "production",
  });
  revalidatePath("/", "layout");
  return { ok: true };
}
