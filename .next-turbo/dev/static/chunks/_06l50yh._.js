(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/ui-language.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Cookie-navn — delt mellem server actions, RSC og klient (OAuth m.m.). */ __turbopack_context__.s([
    "SUPPORTED_UI_LANGUAGE_CODES",
    ()=>SUPPORTED_UI_LANGUAGE_CODES,
    "UI_LANGUAGE_COOKIE",
    ()=>UI_LANGUAGE_COOKIE,
    "UI_LANGUAGE_LABELS",
    ()=>UI_LANGUAGE_LABELS,
    "isSupportedUiLanguage",
    ()=>isSupportedUiLanguage,
    "resolveLanguageFromAcceptLanguage",
    ()=>resolveLanguageFromAcceptLanguage
]);
const UI_LANGUAGE_COOKIE = "ui_language";
const SUPPORTED_UI_LANGUAGE_CODES = [
    "en-US",
    "en-IE",
    "de",
    "de-AT",
    "nl",
    "nl-BE",
    "bg",
    "hr",
    "cs",
    "da",
    "et",
    "fi",
    "fr",
    "el",
    "hu",
    "it",
    "lv",
    "lt",
    "lb",
    "mt",
    "pl",
    "pt",
    "ro",
    "sk",
    "sl",
    "es",
    "sv"
];
const SUPPORTED = new Set(SUPPORTED_UI_LANGUAGE_CODES);
function isSupportedUiLanguage(code) {
    return SUPPORTED.has(code);
}
const UI_LANGUAGE_LABELS = {
    "en-US": "English (United States)",
    "en-IE": "English (Ireland)",
    de: "German",
    "de-AT": "German (Austria)",
    nl: "Dutch",
    "nl-BE": "Dutch (Belgium)",
    bg: "Bulgarian",
    hr: "Croatian",
    cs: "Czech",
    da: "Danish",
    et: "Estonian",
    fi: "Finnish",
    fr: "French",
    el: "Greek",
    hu: "Hungarian",
    it: "Italian",
    lv: "Latvian",
    lt: "Lithuanian",
    lb: "Luxembourgish",
    mt: "Maltese",
    pl: "Polish",
    pt: "Portuguese",
    ro: "Romanian",
    sk: "Slovak",
    sl: "Slovenian",
    es: "Spanish",
    sv: "Swedish"
};
function resolveLanguageFromAcceptLanguage(header) {
    if (!header?.trim()) return "en-US";
    const parts = header.split(",").map((part)=>{
        const [tag, ...params] = part.trim().split(";");
        let q = 1;
        for (const p of params){
            const s = p.trim();
            if (s.startsWith("q=")) {
                const n = parseFloat(s.slice(2));
                if (!Number.isNaN(n)) q = n;
            }
        }
        return {
            tag: tag.trim().replace(/_/g, "-"),
            q
        };
    });
    parts.sort((a, b)=>b.q - a.q);
    for (const { tag } of parts){
        for (const code of SUPPORTED_UI_LANGUAGE_CODES){
            if (code.toLowerCase() === tag.toLowerCase()) return code;
        }
        const primary = tag.split("-")[0]?.toLowerCase();
        if (!primary) continue;
        if (primary === "en") return "en-US";
        for (const code of SUPPORTED_UI_LANGUAGE_CODES){
            if (code.toLowerCase() === primary) return code;
        }
    }
    return "en-US";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/ui-language-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "persistUiLanguageCookieClient",
    ()=>persistUiLanguageCookieClient,
    "syncLoginUiLanguageFromPicker",
    ()=>syncLoginUiLanguageFromPicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ui-language.ts [app-client] (ecmascript)");
;
function persistUiLanguageCookieClient(languageCode) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSupportedUiLanguage"])(languageCode)) return;
    if (typeof document === "undefined") return;
    const maxAge = 60 * 60 * 24 * 365;
    const parts = [
        `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UI_LANGUAGE_COOKIE"]}=${encodeURIComponent(languageCode)}`,
        "path=/",
        `max-age=${maxAge}`,
        "samesite=lax"
    ];
    if (("TURBOPACK compile-time value", "object") !== "undefined" && window.location.protocol === "https:") {
        parts.push("secure");
    }
    document.cookie = parts.join("; ");
}
function syncLoginUiLanguageFromPicker() {
    if (typeof document === "undefined") return;
    const el = document.getElementById("login-ui-language");
    const v = el?.value?.trim();
    if (v && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSupportedUiLanguage"])(v)) persistUiLanguageCookieClient(v);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/types/roles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/roles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTIVE_ROLE_COOKIE",
    ()=>ACTIVE_ROLE_COOKIE,
    "ROLE_LABELS",
    ()=>ROLE_LABELS,
    "setActiveRoleCookie",
    ()=>setActiveRoleCookie
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-client] (ecmascript)");
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
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set(ACTIVE_ROLE_COOKIE, role, {
        path: "/",
        sameSite: "lax",
        expires: 30
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/super-admin.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/workplaces.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/roles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/roles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/super-admin.ts [app-client] (ecmascript)");
;
;
;
;
const ACTIVE_WORKPLACE_COOKIE = "active_workplace";
function setActiveWorkplaceCookie(workplaceId) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set(ACTIVE_WORKPLACE_COOKIE, workplaceId, {
        path: "/",
        sameSite: "lax",
        expires: 30
    });
}
function getActiveWorkplaceIdFromCookie() {
    if (typeof document === "undefined") return null;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(ACTIVE_WORKPLACE_COOKIE) ?? null;
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
        const list = raw.map((r)=>String(r)).filter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRole"]);
        return [
            ...new Set(list)
        ].sort((a, b)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].indexOf(a) - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].indexOf(b));
    }
    const { data, error } = await supabase.from("workplace_members").select("role").eq("user_id", user.id).eq("workplace_id", workplaceId);
    if (error) throw error;
    const list = (data ?? []).map((row)=>row.role).filter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRole"]);
    return [
        ...new Set(list)
    ].sort((a, b)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].indexOf(a) - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].indexOf(b));
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setActiveRoleCookie"])(roles[0]);
        router.push("/dashboard");
        return "routed";
    }
    router.push("/select-role");
    return "routed";
}
async function routeAfterLogin(supabase, router) {
    if (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasSuperAdminAccess"])(supabase)) {
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
    router.push("/select-workplace");
    return "routed";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/login/login-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginForm",
    ()=>LoginForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ui-language-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/workplaces.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$translations$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/translations-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function LoginForm({ emailPlaceholder, passwordPlaceholder }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$translations$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [signingIn, setSigningIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [oauthLoading, setOauthLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LoginForm.useMemo[supabase]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])()
    }["LoginForm.useMemo[supabase]"], []);
    const busy = signingIn || oauthLoading !== null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LoginForm.useEffect": ()=>{
            const params = new URLSearchParams(window.location.search);
            if (params.get("error") === "auth") {
                setMessage({
                    kind: "error",
                    text: t("login.error.oauth_failed", "Could not sign in with the selected account. Try again.")
                });
            }
        // Mount-only: `?error=` is read once. Empty deps keep the dependency array size stable for React.
        // eslint-disable-next-line react-hooks/exhaustive-deps -- t reflects initial locale from layout
        }
    }["LoginForm.useEffect"], []);
    async function handleOAuth(provider) {
        setMessage(null);
        setOauthLoading(provider);
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    /* Kun path — ingen `?next=` (OAuth kan give tom `next=` → redirect til `/`). Destination styres i `app/auth/callback/route.ts`. */ redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            if (error) {
                setMessage({
                    kind: "error",
                    text: error.message
                });
                setOauthLoading(null);
                return;
            }
            if (data?.url) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncLoginUiLanguageFromPicker"])();
                window.location.assign(data.url);
            } else {
                setOauthLoading(null);
            }
        } catch (e) {
            const text = e instanceof Error ? e.message : t("login.error.network", "Could not start sign-in. Check your network and try again.");
            setMessage({
                kind: "error",
                text
            });
            setOauthLoading(null);
        }
    }
    async function handleSignIn(e) {
        e.preventDefault();
        setMessage(null);
        setSigningIn(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password
        });
        if (error) {
            setSigningIn(false);
            setMessage({
                kind: "error",
                text: error.message
            });
            return;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncLoginUiLanguageFromPicker"])();
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routeAfterLogin"])(supabase, router);
        setSigningIn(false);
        if (result === "no_workplaces") {
            setMessage({
                kind: "error",
                text: t("login.error.no_workplace", "You are not assigned to any workplace. Contact an administrator.")
            });
            await supabase.auth.signOut();
            return;
        }
        if (result === "no_roles") {
            setMessage({
                kind: "error",
                text: t("login.error.no_roles", "No roles for the selected workplace. Contact an administrator.")
            });
            await supabase.auth.signOut();
            return;
        }
        if (result === "fetch_error") {
            setMessage({
                kind: "error",
                text: t("login.error.fetch", "Could not load your workplaces or roles. Try again.")
            });
            return;
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-white/25 bg-transparent p-6 shadow-none sm:p-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleOAuth("google"),
                                disabled: busy,
                                className: "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/40 bg-transparent px-4 py-2.5 text-sm font-semibold text-white shadow-none transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-60",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-5 w-5",
                                        viewBox: "0 0 24 24",
                                        "aria-hidden": true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                fill: "#4285F4",
                                                d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/login-form.tsx",
                                                lineNumber: 152,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                fill: "#34A853",
                                                d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/login-form.tsx",
                                                lineNumber: 156,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                fill: "#FBBC05",
                                                d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/login-form.tsx",
                                                lineNumber: 160,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                fill: "#EA4335",
                                                d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/login-form.tsx",
                                                lineNumber: 164,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/login/login-form.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, this),
                                    oauthLoading === "google" ? t("login.oauth.redirecting", "Redirecting…") : t("login.oauth.google", "Continue with Google")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/login/login-form.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleOAuth("facebook"),
                                disabled: busy,
                                className: "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166fe5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1877F2] disabled:cursor-not-allowed disabled:opacity-60",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-5 w-5 fill-current",
                                        viewBox: "0 0 24 24",
                                        "aria-hidden": true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/login/login-form.tsx",
                                            lineNumber: 184,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/login-form.tsx",
                                        lineNumber: 179,
                                        columnNumber: 13
                                    }, this),
                                    oauthLoading === "facebook" ? t("login.oauth.redirecting", "Redirecting…") : t("login.oauth.facebook", "Continue with Facebook")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/login/login-form.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/login/login-form.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative my-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 flex items-center",
                                "aria-hidden": true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "w-full border-t border-white/25"
                                }, void 0, false, {
                                    fileName: "[project]/app/login/login-form.tsx",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/login/login-form.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex justify-center text-xs uppercase tracking-wide",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "bg-transparent px-2 text-white/80",
                                    children: t("login.divider.email", "or with email")
                                }, void 0, false, {
                                    fileName: "[project]/app/login/login-form.tsx",
                                    lineNumber: 197,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/login/login-form.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/login/login-form.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSignIn,
                        className: "space-y-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "email",
                                        className: "mb-1.5 block text-sm font-medium text-white",
                                        children: t("login.email.label", "Email")
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/login-form.tsx",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "email",
                                        name: "email",
                                        type: "email",
                                        autoComplete: "email",
                                        required: true,
                                        value: email,
                                        onChange: (e)=>setEmail(e.target.value),
                                        className: "login-form-input w-full rounded-lg border border-[#5c5c5c] px-3 py-2.5 shadow-sm outline-none transition placeholder:text-zinc-600 focus:border-[#8f8f8f] focus:ring-2 focus:ring-zinc-500/35",
                                        placeholder: emailPlaceholder
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/login-form.tsx",
                                        lineNumber: 211,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/login/login-form.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "password",
                                        className: "mb-1.5 block text-sm font-medium text-white",
                                        children: t("login.password.label", "Password")
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/login-form.tsx",
                                        lineNumber: 224,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                id: "password",
                                                name: "password",
                                                type: showPassword ? "text" : "password",
                                                autoComplete: "current-password",
                                                required: true,
                                                minLength: 6,
                                                value: password,
                                                onChange: (e)=>setPassword(e.target.value),
                                                className: "login-form-input w-full rounded-lg border border-[#5c5c5c] py-2.5 pl-3 pr-11 shadow-sm outline-none transition placeholder:text-zinc-600 focus:border-[#8f8f8f] focus:ring-2 focus:ring-zinc-500/35",
                                                placeholder: passwordPlaceholder
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/login-form.tsx",
                                                lineNumber: 231,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "absolute right-0 top-0 flex h-full min-w-11 items-center justify-center rounded-r-lg px-2 text-zinc-700 transition hover:text-zinc-900 focus:z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-500/50",
                                                "aria-pressed": showPassword,
                                                "aria-label": showPassword ? t("login.password.hide", "Hide password") : t("login.password.show", "Show password"),
                                                onClick: ()=>setShowPassword((v)=>!v),
                                                children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                    className: "h-5 w-5 shrink-0",
                                                    strokeWidth: 1.75
                                                }, void 0, false, {
                                                    fileName: "[project]/app/login/login-form.tsx",
                                                    lineNumber: 255,
                                                    columnNumber: 19
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                    className: "h-5 w-5 shrink-0",
                                                    strokeWidth: 1.75
                                                }, void 0, false, {
                                                    fileName: "[project]/app/login/login-form.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/login/login-form.tsx",
                                                lineNumber: 243,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/login/login-form.tsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/login/login-form.tsx",
                                lineNumber: 223,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8 flex flex-col gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: busy,
                                        className: "inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-sm transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-60",
                                        children: signingIn ? t("login.button.submit.loading", "Logging in…") : t("login.button.submit", "Log in")
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/login-form.tsx",
                                        lineNumber: 264,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-center text-sm text-white",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/super-admin/workplaces/new",
                                            className: "font-medium text-white underline underline-offset-4 transition hover:text-white/80",
                                            children: t("login.link.create_workplace", "Create workplace")
                                        }, void 0, false, {
                                            fileName: "[project]/app/login/login-form.tsx",
                                            lineNumber: 274,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/login-form.tsx",
                                        lineNumber: 273,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/login/login-form.tsx",
                                lineNumber: 263,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/login/login-form.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/login/login-form.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "alert",
                className: `mt-4 rounded-lg border px-4 py-3 text-sm ${message.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`,
                children: message.text
            }, void 0, false, {
                fileName: "[project]/app/login/login-form.tsx",
                lineNumber: 286,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true);
}
_s(LoginForm, "x6VOPdnP65MdkrV8gHoD/5r5gYk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$translations$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LoginForm;
var _c;
__turbopack_context__.k.register(_c, "LoginForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/login/login-install-prompt.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginInstallPrompt",
    ()=>LoginInstallPrompt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$translations$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/translations-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const STORAGE_KEY = "shiftbob_login_install_prompt_dismissed";
function isStandalonePwa() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (window.matchMedia("(display-mode: standalone)").matches) return true;
    const nav = window.navigator;
    return nav.standalone === true;
}
function LoginInstallPrompt() {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$translations$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])();
    const [show, setShow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [installEvent, setInstallEvent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LoginInstallPrompt.useEffect": ()=>{
            if (isStandalonePwa()) return;
            try {
                if (localStorage.getItem(STORAGE_KEY) === "1") return;
            } catch  {
            /* private mode */ }
            const onBeforeInstall = {
                "LoginInstallPrompt.useEffect.onBeforeInstall": (e)=>{
                    e.preventDefault();
                    setInstallEvent(e);
                }
            }["LoginInstallPrompt.useEffect.onBeforeInstall"];
            window.addEventListener("beforeinstallprompt", onBeforeInstall);
            setShow(true);
            return ({
                "LoginInstallPrompt.useEffect": ()=>window.removeEventListener("beforeinstallprompt", onBeforeInstall)
            })["LoginInstallPrompt.useEffect"];
        }
    }["LoginInstallPrompt.useEffect"], []);
    const dismiss = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LoginInstallPrompt.useCallback[dismiss]": ()=>{
            try {
                localStorage.setItem(STORAGE_KEY, "1");
            } catch  {
            /* ignore */ }
            setShow(false);
        }
    }["LoginInstallPrompt.useCallback[dismiss]"], []);
    const install = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LoginInstallPrompt.useCallback[install]": async ()=>{
            if (!installEvent) return;
            await installEvent.prompt();
            try {
                const choice = await installEvent.userChoice;
                if (choice.outcome === "accepted") {
                    try {
                        localStorage.setItem(STORAGE_KEY, "1");
                    } catch  {
                    /* ignore */ }
                    setShow(false);
                }
            } catch  {
            /* ignore */ }
            setInstallEvent(null);
        }
    }["LoginInstallPrompt.useCallback[install]"], [
        installEvent
    ]);
    if (!show) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none h-[5.5rem] shrink-0 sm:h-24",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/app/login/login-install-prompt.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-x-0 bottom-0 z-40 border-t border-zinc-600/80 bg-zinc-950/95 px-4 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))]",
                role: "region",
                "aria-label": t("login.install.region_label", "Install the app"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-md flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold text-white",
                                    children: t("login.install.title", "Gem ShiftBob som app")
                                }, void 0, false, {
                                    fileName: "[project]/app/login/login-install-prompt.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-0.5 text-xs leading-snug text-zinc-400",
                                    children: installEvent ? t("login.install.hint_chrome", "Tryk Installer for at tilføje til din startskærm.") : t("login.install.hint_generic", "Brug browsermenuen: Tilføj til hjemmeskærm eller Installer app.")
                                }, void 0, false, {
                                    fileName: "[project]/app/login/login-install-prompt.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/login/login-install-prompt.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex shrink-0 items-center justify-end gap-2 sm:justify-end",
                            children: [
                                installEvent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>void install(),
                                    className: "rounded-lg bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                                    children: t("login.install.action_install", "Installer")
                                }, void 0, false, {
                                    fileName: "[project]/app/login/login-install-prompt.tsx",
                                    lineNumber: 109,
                                    columnNumber: 15
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: dismiss,
                                    className: "inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-zinc-600 text-zinc-300 transition hover:bg-zinc-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400",
                                    "aria-label": t("login.install.dismiss", "Vis ikke igen"),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "h-5 w-5",
                                        strokeWidth: 2,
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/app/login/login-install-prompt.tsx",
                                        lineNumber: 123,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/login/login-install-prompt.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/login/login-install-prompt.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/login/login-install-prompt.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/login/login-install-prompt.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(LoginInstallPrompt, "F5IqoJ1bo6ry3/sTdOnjpX/1P38=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$translations$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"]
    ];
});
_c = LoginInstallPrompt;
var _c;
__turbopack_context__.k.register(_c, "LoginInstallPrompt");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/data:c09bcc [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "setUiLanguageAction",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"4060c1b5d6843d5ed8308820011f0b2317f03d3595":{"name":"setUiLanguageAction"}},"src/app/ui-language-actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4060c1b5d6843d5ed8308820011f0b2317f03d3595", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "setUiLanguageAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/login/login-language-picker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginLanguagePicker",
    ()=>LoginLanguagePicker,
    "UiLanguageSelect",
    ()=>UiLanguageSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/languages.js [app-client] (ecmascript) <export default as Languages>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$3a$c09bcc__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/data:c09bcc [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ui-language-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ui-language.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function UiLanguageSelect({ currentLanguage, ariaLabel, id = "ui-language", variant = "default" }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [pending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    function onChange(e) {
        const next = e.target.value;
        if (next === currentLanguage) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistUiLanguageCookieClient"])(next);
        startTransition(async ()=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$3a$c09bcc__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["setUiLanguageAction"])(next);
            router.refresh();
        });
    }
    const selectClass = variant === "light" ? "max-w-[min(18rem,calc(100vw-6rem))] rounded-md border border-black/20 bg-white py-1.5 pl-2 pr-8 text-sm text-black shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:opacity-60" : "max-w-[min(18rem,calc(100vw-6rem))] rounded-md border border-zinc-200 bg-white py-1.5 pl-2 pr-8 text-sm text-zinc-800 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-60";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-w-0 items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__["Languages"], {
                className: variant === "light" ? "h-5 w-5 shrink-0 text-black/60" : "h-5 w-5 shrink-0 text-zinc-400",
                "aria-hidden": true,
                strokeWidth: 1.75
            }, void 0, false, {
                fileName: "[project]/app/login/login-language-picker.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                className: "sr-only",
                children: ariaLabel
            }, void 0, false, {
                fileName: "[project]/app/login/login-language-picker.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                id: id,
                value: currentLanguage,
                onChange: onChange,
                disabled: pending,
                "aria-label": ariaLabel,
                className: selectClass,
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORTED_UI_LANGUAGE_CODES"].map((code)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: code,
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UI_LANGUAGE_LABELS"][code] ?? code
                    }, code, false, {
                        fileName: "[project]/app/login/login-language-picker.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/login/login-language-picker.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/login/login-language-picker.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_s(UiLanguageSelect, "bS6iYTA6A+xoIWTYyEHZ+6tNDOQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
_c = UiLanguageSelect;
function LoginLanguagePicker({ currentLanguage, ariaLabel }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed right-4 top-4 z-50 flex items-center gap-2 sm:right-6 sm:top-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UiLanguageSelect, {
            currentLanguage: currentLanguage,
            ariaLabel: ariaLabel,
            id: "login-ui-language"
        }, void 0, false, {
            fileName: "[project]/app/login/login-language-picker.tsx",
            lineNumber: 85,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/login/login-language-picker.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_c1 = LoginLanguagePicker;
var _c, _c1;
__turbopack_context__.k.register(_c, "UiLanguageSelect");
__turbopack_context__.k.register(_c1, "LoginLanguagePicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_06l50yh._.js.map