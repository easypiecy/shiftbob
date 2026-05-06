(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/join-requests.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchMyJoinRequests",
    ()=>fetchMyJoinRequests,
    "hasPendingJoinRequest",
    ()=>hasPendingJoinRequest,
    "listWorkplacesOpenForJoin",
    ()=>listWorkplacesOpenForJoin,
    "requestWorkplaceJoin",
    ()=>requestWorkplaceJoin
]);
async function listWorkplacesOpenForJoin(supabase) {
    const { data, error } = await supabase.rpc("list_workplaces_open_for_join");
    if (error) throw error;
    const rows = data ?? [];
    return rows.map((r)=>({
            id: r.id,
            name: r.name,
            created_at: r.created_at ?? ""
        }));
}
async function requestWorkplaceJoin(supabase, workplaceId) {
    const { data, error } = await supabase.rpc("request_workplace_join", {
        p_workplace_id: workplaceId
    });
    if (error) {
        return {
            ok: false,
            error: error.message
        };
    }
    const j = data;
    if (!j?.ok) {
        return {
            ok: false,
            error: j?.error ?? "unknown"
        };
    }
    return {
        ok: true,
        request_id: j.request_id,
        note: j.note
    };
}
async function fetchMyJoinRequests(supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase.from("workplace_join_requests").select("id, user_id, workplace_id, status, created_at, reviewed_at, reviewed_by").eq("user_id", user.id).order("created_at", {
        ascending: false
    });
    if (error) throw error;
    return data ?? [];
}
function hasPendingJoinRequest(rows) {
    return rows.some((r)=>r.status === "pending");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/select-workplace/select-workplace-client.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SelectWorkplaceClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$join$2d$requests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/join-requests.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/workplaces.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/super-admin.ts [app-client] (ecmascript)");
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
function SelectWorkplaceClient() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SelectWorkplaceClient.useMemo[supabase]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])()
    }["SelectWorkplaceClient.useMemo[supabase]"], []);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [places, setPlaces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSuperAdmin, setIsSuperAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fatal, setFatal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pickError, setPickError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [noMembership, setNoMembership] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [joinBusy, setJoinBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [joinMsg, setJoinMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SelectWorkplaceClient.useEffect": ()=>{
            let cancelled = false;
            async function run() {
                const { data: { user }, error: userErr } = await supabase.auth.getUser();
                if (userErr || !user) {
                    if (!cancelled) {
                        setFatal("auth");
                        setLoading(false);
                    }
                    return;
                }
                let superAdmin = false;
                try {
                    superAdmin = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasSuperAdminAccess"])(supabase);
                } catch  {
                    if (!cancelled) setFatal("fetch");
                    if (!cancelled) setLoading(false);
                    return;
                }
                if (!cancelled) setIsSuperAdmin(superAdmin);
                let list;
                try {
                    list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchUserWorkplaces"])(supabase);
                } catch  {
                    if (!cancelled) setFatal("fetch");
                    if (!cancelled) setLoading(false);
                    return;
                }
                if (cancelled) return;
                setPlaces(list);
                if (!superAdmin && list.length === 0) {
                    try {
                        const reqs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$join$2d$requests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchMyJoinRequests"])(supabase);
                        const joinable = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$join$2d$requests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listWorkplacesOpenForJoin"])(supabase);
                        if (cancelled) return;
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$join$2d$requests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasPendingJoinRequest"])(reqs)) {
                            setNoMembership({
                                kind: "pending"
                            });
                        } else {
                            setNoMembership({
                                kind: "join",
                                list: joinable
                            });
                        }
                    } catch  {
                        if (!cancelled) setFatal("fetch");
                        if (!cancelled) setLoading(false);
                        return;
                    }
                    if (!cancelled) setLoading(false);
                    return;
                }
                if (!cancelled) setNoMembership(null);
                if (!superAdmin && list.length === 1) {
                    const only = list[0];
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setActiveWorkplaceCookie"])(only.id);
                    const pickResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routeRolesForActiveWorkplace"])(supabase, router, only.id);
                    if (cancelled) return;
                    if (pickResult === "no_roles") {
                        setPickError("Ingen roller for denne arbejdsplads. Kontakt administrator.");
                        setLoading(false);
                        return;
                    }
                    if (pickResult === "fetch_error") {
                        setPickError("Kunne ikke hente roller. Prøv igen.");
                        setLoading(false);
                        return;
                    }
                    return;
                }
                setLoading(false);
            }
            run();
            return ({
                "SelectWorkplaceClient.useEffect": ()=>{
                    cancelled = true;
                }
            })["SelectWorkplaceClient.useEffect"];
        }
    }["SelectWorkplaceClient.useEffect"], [
        router,
        supabase
    ]);
    async function handlePick(wp) {
        setPickError(null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setActiveWorkplaceCookie"])(wp.id);
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routeRolesForActiveWorkplace"])(supabase, router, wp.id);
        if (r === "no_roles") {
            setPickError("Ingen roller for denne arbejdsplads. Kontakt administrator.");
        } else if (r === "fetch_error") {
            setPickError("Kunne ikke hente roller. Prøv igen.");
        }
    }
    function handleSuperAdmin() {
        router.push("/super-admin");
    }
    async function handleSignOut() {
        await supabase.auth.signOut();
        router.replace("/login");
    }
    async function handleRequestJoin(wp) {
        setJoinMsg(null);
        setJoinBusy(wp.id);
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$join$2d$requests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["requestWorkplaceJoin"])(supabase, wp.id);
        setJoinBusy(null);
        if (!r.ok) {
            setJoinMsg(r.error === "already_member" ? "Du er allerede medlem — opdatér siden." : r.error ?? "Kunne ikke sende anmodning.");
            return;
        }
        router.push("/pending-approval");
    }
    if (loading && fatal === null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100"
                }, void 0, false, {
                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-4 text-sm text-zinc-500 dark:text-zinc-400",
                    children: "Henter dine data…"
                }, void 0, false, {
                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                    lineNumber: 171,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
            lineNumber: 169,
            columnNumber: 7
        }, this);
    }
    if (fatal === "auth") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center text-zinc-700 dark:text-zinc-300",
                    children: "Du skal være logget ind."
                }, void 0, false, {
                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                    lineNumber: 181,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/login",
                    className: "mt-4 text-sm font-medium text-blue-600 underline dark:text-blue-400",
                    children: "Gå til login"
                }, void 0, false, {
                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
            lineNumber: 180,
            columnNumber: 7
        }, this);
    }
    if (fatal === "fetch") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center dark:border-red-900/60 dark:bg-red-950/40",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-red-900 dark:text-red-100",
                        children: "Kunne ikke hente arbejdspladser eller anmodningsdata."
                    }, void 0, false, {
                        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                        lineNumber: 198,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleSignOut,
                        className: "mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
                        children: "Log ud"
                    }, void 0, false, {
                        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                        lineNumber: 201,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                lineNumber: 197,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
            lineNumber: 196,
            columnNumber: 7
        }, this);
    }
    if (noMembership?.kind === "pending") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center dark:border-amber-900/50 dark:bg-amber-950/30",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-amber-950 dark:text-amber-100",
                        children: "Du har en afventende adgangsanmodning. Vent på at en administrator godkender den."
                    }, void 0, false, {
                        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>router.push("/pending-approval"),
                        className: "mt-4 w-full rounded-lg bg-amber-800 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-900",
                        children: "Se statusside"
                    }, void 0, false, {
                        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                        lineNumber: 221,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleSignOut,
                        className: "mt-3 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 dark:border-zinc-600 dark:text-zinc-200",
                        children: "Log ud"
                    }, void 0, false, {
                        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                lineNumber: 216,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
            lineNumber: 215,
            columnNumber: 7
        }, this);
    }
    if (noMembership?.kind === "join") {
        const joinList = noMembership.list;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-full flex-1 bg-gradient-to-b from-zinc-100 to-zinc-50 px-4 py-12 dark:from-zinc-950 dark:to-zinc-900",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto max-w-3xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-10 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50",
                                children: "Vælg arbejdsplads"
                            }, void 0, false, {
                                fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                lineNumber: 246,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-sm text-zinc-600 dark:text-zinc-400",
                                children: "Du er endnu ikke tilknyttet en arbejdsplads. Vælg den du vil anmode om adgang til — en administrator modtager en notifikation og kan godkende eller afvise."
                            }, void 0, false, {
                                fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                lineNumber: 249,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                        lineNumber: 245,
                        columnNumber: 11
                    }, this),
                    joinMsg ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "alert",
                        className: "mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100",
                        children: joinMsg
                    }, void 0, false, {
                        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                        lineNumber: 256,
                        columnNumber: 13
                    }, this) : null,
                    joinList.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400",
                        children: "Ingen arbejdspladser accepterer lige nu åbne anmodninger. Kontakt en administrator."
                    }, void 0, false, {
                        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                        lineNumber: 264,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "grid gap-4 sm:grid-cols-2",
                        children: joinList.map((wp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    disabled: joinBusy === wp.id,
                                    onClick: ()=>void handleRequestJoin(wp),
                                    className: "group flex h-full min-h-[140px] w-full flex-col rounded-2xl border border-zinc-200/90 bg-white p-6 text-left shadow-md ring-1 ring-zinc-200/50 transition hover:border-blue-300 hover:shadow-lg disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-700 dark:hover:border-blue-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400",
                                            children: "Anmod om adgang"
                                        }, void 0, false, {
                                            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                            lineNumber: 278,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mt-2 line-clamp-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50",
                                            children: wp.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                            lineNumber: 281,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mt-auto pt-4 text-sm font-medium text-blue-700 group-hover:underline dark:text-blue-300",
                                            children: joinBusy === wp.id ? "Sender…" : "Send anmodning →"
                                        }, void 0, false, {
                                            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                            lineNumber: 284,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                    lineNumber: 272,
                                    columnNumber: 19
                                }, this)
                            }, wp.id, false, {
                                fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                lineNumber: 271,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                        lineNumber: 269,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-10 text-center text-sm text-zinc-500",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleSignOut,
                            className: "font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100",
                            children: "Log ud"
                        }, void 0, false, {
                            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                            lineNumber: 293,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                        lineNumber: 292,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                lineNumber: 244,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
            lineNumber: 243,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-full flex-1 bg-gradient-to-b from-zinc-100 to-zinc-50 px-4 py-12 dark:from-zinc-950 dark:to-zinc-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-3xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-10 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50",
                            children: isSuperAdmin ? "Hvad vil du åbne?" : "Vælg arbejdsplads"
                        }, void 0, false, {
                            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                            lineNumber: 310,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-zinc-600 dark:text-zinc-400",
                            children: isSuperAdmin ? "Du har Super Admin-adgang. Vælg systemportalen eller en arbejdsplads med dine roller (fx administrator)." : "Du har adgang til flere steder. Vælg hvor du vil arbejde nu."
                        }, void 0, false, {
                            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                            lineNumber: 313,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                    lineNumber: 309,
                    columnNumber: 9
                }, this),
                isSuperAdmin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500",
                            children: "System"
                        }, void 0, false, {
                            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                            lineNumber: 322,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleSuperAdmin,
                            className: "group flex w-full flex-col rounded-2xl border border-violet-200/90 bg-violet-50/90 p-6 text-left shadow-md ring-1 ring-violet-200/60 transition hover:border-violet-400 hover:shadow-lg hover:ring-violet-300/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:border-violet-900/50 dark:bg-violet-950/40 dark:ring-violet-900/40 dark:hover:border-violet-600 dark:hover:ring-violet-800/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                            className: "h-4 w-4",
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                            lineNumber: 331,
                                            columnNumber: 17
                                        }, this),
                                        "Super Admin"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                    lineNumber: 330,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50",
                                    children: "System- og tenant-administration"
                                }, void 0, false, {
                                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                    lineNumber: 334,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mt-2 text-sm text-zinc-600 dark:text-zinc-400",
                                    children: "Brugere, arbejdspladser, oversættelser, standardtyper m.m."
                                }, void 0, false, {
                                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                    lineNumber: 337,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mt-4 text-sm font-medium text-violet-800 group-hover:underline dark:text-violet-200",
                                    children: "Åbn Super Admin →"
                                }, void 0, false, {
                                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                    lineNumber: 340,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                            lineNumber: 325,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                    lineNumber: 321,
                    columnNumber: 11
                }, this) : null,
                places.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500",
                            children: isSuperAdmin ? "Arbejdsplads (dine roller)" : "Arbejdspladser"
                        }, void 0, false, {
                            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                            lineNumber: 349,
                            columnNumber: 13
                        }, this),
                        pickError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            role: "alert",
                            className: "mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100",
                            children: pickError
                        }, void 0, false, {
                            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                            lineNumber: 353,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "grid gap-4 sm:grid-cols-2",
                            children: places.map((wp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>handlePick(wp),
                                        className: "group flex h-full min-h-[140px] w-full flex-col rounded-2xl border border-zinc-200/90 bg-white p-6 text-left shadow-md ring-1 ring-zinc-200/50 transition hover:border-blue-300 hover:shadow-lg hover:ring-blue-200/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-700 dark:hover:border-blue-500 dark:hover:ring-blue-900/40",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400",
                                                children: "Arbejdsplads"
                                            }, void 0, false, {
                                                fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                                lineNumber: 368,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-2 line-clamp-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50",
                                                children: wp.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                                lineNumber: 371,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-auto pt-4 text-sm font-medium text-blue-700 group-hover:underline dark:text-blue-300",
                                                children: "Vælg og fortsæt →"
                                            }, void 0, false, {
                                                fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                                lineNumber: 374,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                        lineNumber: 363,
                                        columnNumber: 19
                                    }, this)
                                }, wp.id, false, {
                                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                                    lineNumber: 362,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                            lineNumber: 360,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true) : isSuperAdmin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400",
                    children: "Ingen arbejdspladser fundet for din konto. Brug Super Admin ovenfor, eller opdatér siden / log ud og ind igen, hvis du lige er blevet tilknyttet."
                }, void 0, false, {
                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                    lineNumber: 383,
                    columnNumber: 11
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-10 text-center text-sm text-zinc-500",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleSignOut,
                        className: "font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100",
                        children: "Log ud"
                    }, void 0, false, {
                        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                        lineNumber: 390,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
                    lineNumber: 389,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
            lineNumber: 308,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/select-workplace/select-workplace-client.tsx",
        lineNumber: 307,
        columnNumber: 5
    }, this);
}
_s(SelectWorkplaceClient, "HYv+xI5E/IM52FDNY+E9nyCj+e0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SelectWorkplaceClient;
var _c;
__turbopack_context__.k.register(_c, "SelectWorkplaceClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/select-workplace/select-workplace-client.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/select-workplace/select-workplace-client.tsx [app-client] (ecmascript)"));
}),
"[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Shield
]);
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
        }
    ]
];
const Shield = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("shield", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Shield",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_0rknvw2._.js.map