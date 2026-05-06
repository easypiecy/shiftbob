module.exports = [
"[project]/src/lib/auth-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signOutAndRedirectToLogin",
    ()=>signOutAndRedirectToLogin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-ssr] (ecmascript)");
;
async function signOutAndRedirectToLogin() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
    try {
        await supabase.auth.signOut({
            scope: "global"
        });
    } catch  {
    /* stadig redirect */ }
    window.location.href = "/login";
}
}),
"[project]/src/types/roles.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ROLES",
    ()=>ROLES,
    "isRole",
    ()=>isRole
]);
const ROLES = [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "EMPLOYEE"
];
function isRole(value) {
    return ROLES.includes(value);
}
}),
"[project]/src/lib/roles.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTIVE_ROLE_COOKIE",
    ()=>ACTIVE_ROLE_COOKIE,
    "ROLE_LABELS",
    ()=>ROLE_LABELS,
    "setActiveRoleCookie",
    ()=>setActiveRoleCookie
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)");
;
const ACTIVE_ROLE_COOKIE = "active_role";
const ROLE_LABELS = {
    SUPER_ADMIN: {
        title: "Superadmin",
        description: "Fuld adgang til system og konfiguration."
    },
    ADMIN: {
        title: "Administrator",
        description: "Administrer brugere og overordnede indstillinger."
    },
    MANAGER: {
        title: "Manager",
        description: "Led vagtplaner og team."
    },
    EMPLOYEE: {
        title: "Medarbejder",
        description: "Standard adgang til egne vagter og opgaver."
    }
};
function setActiveRoleCookie(role) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set(ACTIVE_ROLE_COOKIE, role, {
        path: "/",
        sameSite: "lax",
        expires: 30
    });
}
}),
"[project]/src/lib/super-admin.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertSuperAdminAccess",
    ()=>assertSuperAdminAccess,
    "hasSuperAdminAccess",
    ()=>hasSuperAdminAccess
]);
async function hasSuperAdminAccess(supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: siteSa, error: rpcErr } = await supabase.rpc("has_super_admin_membership");
    if (!rpcErr && siteSa === true) return true;
    const { data: wm } = await supabase.from("workplace_members").select("user_id").eq("user_id", user.id).eq("role", "SUPER_ADMIN").limit(1).maybeSingle();
    if (wm) return true;
    const { data: ur, error: urErr } = await supabase.from("user_roles").select("id").eq("user_id", user.id).eq("role", "SUPER_ADMIN").limit(1).maybeSingle();
    return !urErr && !!ur;
}
async function assertSuperAdminAccess(supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Ikke logget ind.");
    }
    if (!await hasSuperAdminAccess(supabase)) {
        throw new Error("Ingen adgang til Super Admin.");
    }
}
}),
"[project]/src/lib/workplaces.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTIVE_WORKPLACE_COOKIE",
    ()=>ACTIVE_WORKPLACE_COOKIE,
    "fetchUserRolesForWorkplace",
    ()=>fetchUserRolesForWorkplace,
    "fetchUserWorkplaces",
    ()=>fetchUserWorkplaces,
    "getActiveWorkplaceIdFromCookie",
    ()=>getActiveWorkplaceIdFromCookie,
    "routeAfterLogin",
    ()=>routeAfterLogin,
    "routeRolesForActiveWorkplace",
    ()=>routeRolesForActiveWorkplace,
    "setActiveWorkplaceCookie",
    ()=>setActiveWorkplaceCookie
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/roles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/roles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/super-admin.ts [app-ssr] (ecmascript)");
;
;
;
;
const ACTIVE_WORKPLACE_COOKIE = "active_workplace";
function setActiveWorkplaceCookie(workplaceId) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set(ACTIVE_WORKPLACE_COOKIE, workplaceId, {
        path: "/",
        sameSite: "lax",
        expires: 30
    });
}
function getActiveWorkplaceIdFromCookie() {
    if (typeof document === "undefined") return null;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(ACTIVE_WORKPLACE_COOKIE) ?? null;
}
async function fetchUserWorkplaces(supabase) {
    const { data: rpcRows, error: rpcErr } = await supabase.rpc("get_my_workplaces");
    if (!rpcErr && rpcRows != null && Array.isArray(rpcRows)) {
        return rpcRows.sort((a, b)=>a.name.localeCompare(b.name, "da"));
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: mids, error: e1 } = await supabase.from("workplace_members").select("workplace_id").eq("user_id", user.id);
    if (e1) throw e1;
    const ids = [
        ...new Set((mids ?? []).map((m)=>m.workplace_id))
    ];
    if (ids.length === 0) return [];
    const { data: places, error: e2 } = await supabase.from("workplaces").select("id, name, created_at").in("id", ids);
    if (e2) throw e2;
    return (places ?? []).sort((a, b)=>a.name.localeCompare(b.name, "da"));
}
async function fetchUserRolesForWorkplace(supabase, workplaceId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: rpcRoles, error: rpcErr } = await supabase.rpc("get_my_roles_for_workplace", {
        p_workplace_id: workplaceId
    });
    if (!rpcErr && rpcRoles != null) {
        const raw = Array.isArray(rpcRoles) ? rpcRoles : [];
        const list = raw.map((r)=>String(r)).filter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRole"]);
        return [
            ...new Set(list)
        ].sort((a, b)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLES"].indexOf(a) - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLES"].indexOf(b));
    }
    const { data, error } = await supabase.from("workplace_members").select("role").eq("user_id", user.id).eq("workplace_id", workplaceId);
    if (error) throw error;
    const list = (data ?? []).map((row)=>row.role).filter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRole"]);
    return [
        ...new Set(list)
    ].sort((a, b)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLES"].indexOf(a) - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLES"].indexOf(b));
}
async function routeRolesForActiveWorkplace(supabase, router, workplaceId) {
    let roles;
    try {
        roles = await fetchUserRolesForWorkplace(supabase, workplaceId);
    } catch  {
        return "fetch_error";
    }
    if (roles.length === 0) return "no_roles";
    if (roles.length === 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setActiveRoleCookie"])(roles[0]);
        router.push("/dashboard");
        return "routed";
    }
    router.push("/select-role");
    return "routed";
}
async function routeAfterLogin(supabase, router) {
    if (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasSuperAdminAccess"])(supabase)) {
        router.push("/select-workplace");
        return "routed";
    }
    let workplaces;
    try {
        workplaces = await fetchUserWorkplaces(supabase);
    } catch  {
        return "fetch_error";
    }
    if (workplaces.length === 0) return "no_workplaces";
    if (workplaces.length === 1) {
        const only = workplaces[0];
        setActiveWorkplaceCookie(only.id);
        return routeRolesForActiveWorkplace(supabase, router, only.id);
    }
    router.push("/select-workplace");
    return "routed";
}
}),
"[project]/src/lib/spreadsheet-import-draft.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "setPendingSpreadsheetFile",
    ()=>setPendingSpreadsheetFile,
    "takePendingSpreadsheetFile",
    ()=>takePendingSpreadsheetFile
]);
"use client";
let pendingSpreadsheetFile = null;
function setPendingSpreadsheetFile(file) {
    pendingSpreadsheetFile = file;
}
function takePendingSpreadsheetFile() {
    const file = pendingSpreadsheetFile;
    pendingSpreadsheetFile = null;
    return file;
}
}),
"[project]/src/components/admin-workspace-shell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminWorkspaceShell",
    ()=>AdminWorkspaceShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeftRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left-right.js [app-ssr] (ecmascript) <export default as ArrowLeftRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-clock.js [app-ssr] (ecmascript) <export default as CalendarClock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-ssr] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/workplaces.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$translations$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/translations-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$spreadsheet$2d$import$2d$draft$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/spreadsheet-import-draft.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
const ADMIN_NAV_LINKS = [
    {
        href: "/dashboard",
        navKey: "admin.nav.calendar",
        labelDa: "Kalender",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        href: "/dashboard/fremtiden",
        navKey: "admin.nav.future",
        labelDa: "Automatisk udrulning",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__["CalendarClock"]
    },
    {
        href: "/dashboard/indstillinger",
        navKey: "admin.nav.settings",
        labelDa: "Indstillinger",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    }
];
/** Klient-fallback hvis layout ikke når at få navn (cookie/session timing). */ function SidebarWorkplaceTitle({ serverName, fallback }) {
    const [label, setLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(serverName);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setLabel(serverName);
    }, [
        serverName
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (serverName?.trim()) return;
        const wpId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getActiveWorkplaceIdFromCookie"])();
        if (!wpId) return;
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
        let cancelled = false;
        void (async ()=>{
            const direct = await supabase.from("workplaces").select("name, company_name").eq("id", wpId).maybeSingle();
            if (cancelled) return;
            if (direct.data) {
                const row = direct.data;
                const c = typeof row.company_name === "string" ? row.company_name.trim() : "";
                const n = typeof row.name === "string" ? row.name.trim() : "";
                const d = c.length > 0 ? c : n;
                if (d.length > 0) setLabel(d);
                return;
            }
            const { data: rpcRows } = await supabase.rpc("get_my_workplaces");
            if (cancelled || !Array.isArray(rpcRows)) return;
            const row = rpcRows.find((r)=>r.id === wpId);
            const n = row?.name?.trim();
            if (n) setLabel(n);
        })();
        return ()=>{
            cancelled = true;
        };
    }, [
        serverName
    ]);
    const text = label?.trim() ? label.trim() : fallback;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "min-w-0 flex-1 break-words text-center text-xs font-semibold leading-snug text-zinc-600 dark:text-zinc-400",
        title: text !== fallback ? text : undefined,
        children: text
    }, void 0, false, {
        fileName: "[project]/src/components/admin-workspace-shell.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
function AdminWorkspaceShell({ showAdminNav, children, initialLayoutTheme, activeWorkplaceName = null }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$translations$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslations"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : true);
    const [signingOut, setSigningOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const importInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    if (!showAdminNav) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    const isActive = (href)=>{
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname === href || pathname.startsWith(`${href}/`);
    };
    /** Dark: mørkt cirkel-logo. Light + unicorn: lyst cirkel-logo (unicorn bruger også `dark` på `<html>`). */ const showDarkCircleLogo = initialLayoutTheme === "dark";
    function openSpreadsheetImportPicker() {
        importInputRef.current?.click();
    }
    function handleSpreadsheetPicked(file) {
        if (!file) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$spreadsheet$2d$import$2d$draft$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setPendingSpreadsheetFile"])(file);
        router.push("/dashboard/import-regneark");
        setSidebarOpen(false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex min-h-screen flex-1 bg-zinc-100 dark:bg-zinc-950",
        children: [
            sidebarOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": t("common.menu.close_overlay", "Luk menu"),
                className: "fixed inset-0 z-[90] bg-black/40 md:hidden",
                onClick: ()=>setSidebarOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                lineNumber: 167,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: sidebarOpen ? "fixed inset-y-0 left-0 z-[100] flex h-screen max-h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 md:relative md:inset-auto md:z-10 md:shadow-none" : "hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative shrink-0 border-b border-zinc-200 px-3 pb-3 pt-1 dark:border-zinc-800",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setSidebarOpen(false),
                                className: "absolute right-0 top-0 z-10 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                                "aria-label": t("common.menu.hide_sidebar", "Skjul menu"),
                                title: t("common.menu.hide_sidebar", "Skjul menu"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    className: "h-5 w-5",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center px-1 pr-7",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/dashboard",
                                        className: "outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sidebar-logo-wrap inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: "/ShiftBob-circle-logo-light-1024.png",
                                                    alt: t("common.brand_name", "ShiftBob"),
                                                    width: 1024,
                                                    height: 1024,
                                                    className: `h-[5.5rem] w-[5.5rem] object-contain object-center sm:h-[6.5rem] sm:w-[6.5rem] ${showDarkCircleLogo ? "hidden" : "block"}`,
                                                    priority: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                    lineNumber: 198,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: "/ShiftBob-circle-logo-dark-1024.png",
                                                    alt: t("common.brand_name", "ShiftBob"),
                                                    width: 1024,
                                                    height: 1024,
                                                    className: `h-[5.5rem] w-[5.5rem] object-contain object-center sm:h-[6.5rem] sm:w-[6.5rem] ${showDarkCircleLogo ? "block" : "hidden"}`,
                                                    priority: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                            lineNumber: 197,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                        lineNumber: 193,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2.5 flex w-full max-w-[15rem] items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarWorkplaceTitle, {
                                                serverName: activeWorkplaceName,
                                                fallback: t("admin.sidebar.workplace_name_missing", "—")
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                lineNumber: 221,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/select-workplace",
                                                className: "-m-1 shrink-0 rounded-lg p-1.5 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                                                title: t("admin.sidebar.switch_workplace", "Skift arbejdsplads"),
                                                "aria-label": t("admin.sidebar.switch_workplace", "Skift arbejdsplads"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeftRight$3e$__["ArrowLeftRight"], {
                                                    className: "h-4 w-4",
                                                    strokeWidth: 2,
                                                    "aria-hidden": true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                lineNumber: 225,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                        lineNumber: 220,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex min-h-0 flex-1 flex-col px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-0.5",
                                    children: ADMIN_NAV_LINKS.map(({ href, navKey, labelDa, icon: Icon })=>{
                                        const active = isActive(href);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: href,
                                            className: active ? "flex items-center gap-2 rounded-lg bg-zinc-200 px-3 py-2.5 text-sm font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50" : "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    className: "h-4 w-4 shrink-0 text-zinc-500",
                                                    "aria-hidden": true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                    lineNumber: 251,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "inline-flex items-center",
                                                    children: t(navKey, labelDa)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                    lineNumber: 252,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, href, true, {
                                            fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                            lineNumber: 242,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                    lineNumber: 238,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 px-2 pb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: openSpreadsheetImportPicker,
                                        className: "flex w-full items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                className: "h-4 w-4 shrink-0",
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                lineNumber: 264,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: t("admin.nav.import_spreadsheet", "Hent regneark")
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                lineNumber: 265,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                        lineNumber: 259,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: importInputRef,
                                        type: "file",
                                        accept: ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                        className: "sr-only",
                                        onChange: (e)=>{
                                            const file = e.target.files?.[0] ?? null;
                                            handleSpreadsheetPicked(file);
                                            e.currentTarget.value = "";
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                        lineNumber: 267,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sidebar-menu-footer shrink-0 border-t border-zinc-200 pt-2 dark:border-zinc-800",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 px-2 pb-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: (e)=>{
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSigningOut(true);
                                            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOutAndRedirectToLogin"])();
                                        },
                                        disabled: signingOut,
                                        className: "relative z-[100] flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-zinc-800",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                className: "h-4 w-4 shrink-0 text-zinc-500",
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                lineNumber: 292,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate",
                                                children: signingOut ? t("common.logout.loading", "Logger ud…") : t("common.logout", "Log ud")
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                lineNumber: 293,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                        lineNumber: 281,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            !sidebarOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setSidebarOpen(true),
                className: "fixed left-3 top-3 z-[100] flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-md transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800",
                "aria-label": t("common.menu.show_sidebar", "Vis menu"),
                title: t("common.menu.show_sidebar", "Vis menu"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                    className: "h-5 w-5",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                    lineNumber: 312,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                lineNumber: 305,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: sidebarOpen ? "min-w-0 flex-1 overflow-auto" : "min-w-0 flex-1 overflow-auto pt-14 md:pt-0",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                lineNumber: 316,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin-workspace-shell.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/dashboard-onboarding-guard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardOnboardingGuard",
    ()=>DashboardOnboardingGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/workplaces.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function DashboardOnboardingGuard({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (pathname?.startsWith("/dashboard/complete-profile")) {
            setReady(true);
            return;
        }
        const wp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getActiveWorkplaceIdFromCookie"])();
        if (!wp) {
            setReady(true);
            return;
        }
        let cancelled = false;
        async function run() {
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || cancelled) {
                if (!cancelled) setReady(true);
                return;
            }
            const { data: wm, error } = await supabase.from("workplace_members").select("profile_onboarding_completed").eq("user_id", user.id).eq("workplace_id", wp).maybeSingle();
            if (cancelled) return;
            if (error) {
                setReady(true);
                return;
            }
            if (wm?.profile_onboarding_completed === false) {
                router.replace("/dashboard/complete-profile");
                return;
            }
            setReady(true);
        }
        void run();
        return ()=>{
            cancelled = true;
        };
    }, [
        pathname,
        router
    ]);
    if (!ready) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[40vh] flex-1 items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard-onboarding-guard.tsx",
                lineNumber: 68,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard-onboarding-guard.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
];

//# sourceMappingURL=src_0rbku44._.js.map