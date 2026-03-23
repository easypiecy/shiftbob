import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/src/utils/supabase/update-session";

/**
 * Next.js 16: `middleware` er omdøbt til `proxy` og kører på Node.js-runtime på Vercel
 * (ikke Edge). Det undgår typiske `MIDDLEWARE_INVOCATION_FAILED`-fejl fra Edge + Supabase.
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
