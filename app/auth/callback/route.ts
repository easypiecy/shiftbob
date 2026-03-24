import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const DEFAULT_POST_AUTH = "/select-workplace";

/** Efter OAuth kan `?next=` være tom streng — `??` erstatter ikke `""`, så `${origin}${""}` blev forsiden. */
function resolvePostAuthPath(raw: string | null): string {
  const t = raw?.trim();
  if (!t || t === "/") return DEFAULT_POST_AUTH;
  if (!t.startsWith("/") || t.startsWith("//")) return DEFAULT_POST_AUTH;
  return t;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = resolvePostAuthPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  return NextResponse.redirect(`${origin}${nextPath}`);
}
