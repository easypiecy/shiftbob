import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Opfrisker auth-session til cookies før App Router renderer.
 * Bruges fra `proxy.ts` (Node.js runtime — anbefalet i Next.js 16 frem for Edge-middleware).
 * OAuth PKCE: `/auth/*` skal være udeladt i proxy-matcher så `exchangeCodeForSession` i
 * `app/auth/callback/route.ts` ikke kolliderer med session-skrivning her.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // RequestCookies understøtter kun (name, value); options sendes videre på responsen.
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Opfrisker session via Auth (skriver opdaterede cookies via setAll ved behov).
  await supabase.auth.getUser();

  return supabaseResponse;
}
