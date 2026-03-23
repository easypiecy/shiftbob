import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACTIVE_WORKPLACE_COOKIE } from "@/src/lib/workplaces";
import { CompleteProfileClient } from "./complete-profile-client";

export default async function CompleteProfilePage() {
  const jar = await cookies();
  const wpId = jar.get(ACTIVE_WORKPLACE_COOKIE)?.value?.trim();
  if (!wpId) {
    redirect("/select-workplace");
  }
  return <CompleteProfileClient workplaceId={wpId} />;
}
