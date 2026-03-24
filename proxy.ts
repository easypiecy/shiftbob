import "./src/edge-node-globals-polyfill";
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./src/utils/supabase/update-session";

/**
 * Skal ligge i projektroden (ikke kun under `src/`), så Vercel/Next altid resolver
 * samme edge-entry som i dokumentationen. Brug relative imports — ikke `@/`.
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
