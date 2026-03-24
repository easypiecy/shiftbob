import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
 * Opfrisker auth-session (cookies). Bruges fra `src/proxy.ts`.
 * Undgår `request.cookies` / `response.cookies` fra Next — brug Headers + serializeCookieHeader.
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
