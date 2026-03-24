import "./edge-node-globals-polyfill";
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/update-session";

/**
 * Polyfill først (sideeffekt), derefter session. Filen ligger under `src/`, så
 * imports er rene relative stier — Turbopack fejler undertiden på `@/` fra rod-`proxy.ts`.
 */
export async function proxy(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch {
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
