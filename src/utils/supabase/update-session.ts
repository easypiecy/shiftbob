import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Bygger `Cookie`-headerstreng uden Next.js `RequestCookies` (undgår Edge-crash:
 * `ReferenceError: __dirname is not defined` fra `next/dist/compiled/cookie`).
 */
function mergeCookieRequestHeader(
  existingHeader: string | null,
  updates: { name: string; value: string }[],
): string {
  const map = new Map(
    parseCookieHeader(existingHeader ?? "").map((c) => [c.name, c.value]),
  );
  for (const { name, value } of updates) {
    map.set(name, value);
  }
  return Array.from(map.entries())
    .map(([name, value]) => `${name}=${encodeURIComponent(value ?? "")}`)
    .join("; ");
}

/**
 * Opfrisker auth-session til cookies før App Router renderer.
 * Bruges fra `proxy.ts`. Cookie-håndtering bruger kun `Headers` + `cookie`-pakken
 * via `@supabase/ssr` — ikke `request.cookies` / `response.cookies` fra Next.js,
 * så Edge/Vercel ikke loader Nexts `compiled/cookie` med `__dirname`.
 *
 * OAuth PKCE: `/auth/*` skal være udeladt i proxy-matcher.
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
        return parseCookieHeader(request.headers.get("cookie") ?? "").map(
          (c) => ({ name: c.name, value: c.value ?? "" }),
        );
      },
      setAll(cookiesToSet) {
        const merged = mergeCookieRequestHeader(
          request.headers.get("cookie"),
          cookiesToSet.map(({ name, value }) => ({ name, value })),
        );
        const requestHeaders = new Headers(request.headers);
        if (merged.length === 0) {
          requestHeaders.delete("cookie");
        } else {
          requestHeaders.set("cookie", merged);
        }

        supabaseResponse = NextResponse.next({
          request: { headers: requestHeaders },
        });

        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.headers.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options),
          );
        }
      },
    },
  });

  await supabase.auth.getUser();

  return supabaseResponse;
}
