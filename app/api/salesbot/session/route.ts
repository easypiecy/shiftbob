import { createServerSupabase } from "@/src/utils/supabase/server";

function resolveDisplayName(user: {
  user_metadata?: Record<string, unknown> | null;
  email?: string | null;
}): string {
  const meta = user.user_metadata ?? {};
  const fromMeta =
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    "";
  if (fromMeta) return fromMeta;
  return "";
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ ok: true, loggedIn: false, name: "", email: "" });
    }

    return Response.json({
      ok: true,
      loggedIn: true,
      name: resolveDisplayName(user),
      email: user.email?.trim() ?? "",
    });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Ukendt fejl";
    return Response.json({ ok: false, error }, { status: 500 });
  }
}
