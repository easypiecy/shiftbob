import Cookies from "js-cookie";
import type { Role } from "@/src/types/roles";

export const ACTIVE_ROLE_COOKIE = "active_role";

export const ROLE_LABELS: Record<
  Role,
  { title: string; description: string }
> = {
  SUPER_ADMIN: {
    title: "Superadmin",
    description: "Fuld adgang til system og konfiguration.",
  },
  ADMIN: {
    title: "Administrator",
    description: "Administrer brugere og overordnede indstillinger.",
  },
  MANAGER: {
    title: "Manager",
    description: "Led vagtplaner og team.",
  },
  EMPLOYEE: {
    title: "Medarbejder",
    description: "Standard adgang til egne vagter og opgaver.",
  },
};

export function setActiveRoleCookie(role: Role) {
  Cookies.set(ACTIVE_ROLE_COOKIE, role, {
    path: "/",
    sameSite: "lax",
    expires: 30,
  });
}

export type PostLoginRoleResult = "routed" | "no_roles" | "fetch_error";
