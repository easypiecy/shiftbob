import "./edge-node-globals-polyfill";
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/update-session";

/**
 * Node-proxy (Next 16). Med både `app/` i roden og `src/`-kode forventer Turbopack
 * dev denne fil her — ikke `proxy.ts` kun i projektroden (ellers: «file not found»).
 * Brug relative imports — ikke `@/` (bundler krav).
 *
 * Én default-export — undgår «adapterFn is not a function» ved forkert CJS-interop.
 */
export default async function proxy(request: NextRequest) {
  if (request.method === "HEAD" || request.method === "OPTIONS") {
    return NextResponse.next({ request });
  }
  try {
    return await updateSession(request);
  } catch {
    return NextResponse.next({ request });
  }
}

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
