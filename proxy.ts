import "./src/edge-node-globals-polyfill";
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./src/utils/supabase/update-session";

/**
 * Skal ligge i projektroden (ikke kun under `src/`), så Vercel/Next altid resolver
 * samme edge-entry som i dokumentationen. Brug relative imports — ikke `@/`.
 */
export async function proxy(request: NextRequest) {
  /* HEAD bruges af curl -I; undgå tung auth/session så healthchecks ikke fejler */
  if (request.method === "HEAD" || request.method === "OPTIONS") {
    return NextResponse.next({ request });
  }
  try {
    return await updateSession(request);
  } catch {
    return NextResponse.next({ request });
  }
}

/**
 * Kør kun session-proxy på relevante ruter — ikke på `/` (forside).
 * En for bred catch-all kan på Vercel give 404 i middleware-laget, selvom `app/page.tsx` findes.
 * OAuth forbliver uden for: brug `/auth/callback` (ikke `/auth/` i listen).
 */
export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/login",
    "/login/:path*",
    "/select-role",
    "/select-role/:path*",
    "/select-workplace",
    "/select-workplace/:path*",
    "/pending-approval",
    "/pending-approval/:path*",
    "/super-admin/:path*",
    "/test-ai",
    "/test-ai/:path*",
  ],
};
