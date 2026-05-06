module.exports = [
"[project]/src/app/user-ui-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40da134b10f7b4b87d5a66eca98ca4cf276edacf6e":{"name":"setUserLayoutTheme"}},"src/app/user-ui-actions.ts",""] */ __turbopack_context__.s([
    "setUserLayoutTheme",
    ()=>setUserLayoutTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ui-theme.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function setUserLayoutTheme(theme) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isUiThemeId"])(theme)) {
        return {
            ok: false,
            error: "Ugyldigt tema."
        };
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            ok: false,
            error: "Ikke logget ind."
        };
    }
    const { error } = await supabase.from("user_ui_preferences").upsert({
        user_id: user.id,
        layout_theme: theme,
        updated_at: new Date().toISOString()
    }, {
        onConflict: "user_id"
    });
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const cookieOpts = {
        path: "/",
        maxAge: 60 * 60 * 24 * 400,
        sameSite: "lax",
        httpOnly: false
    };
    if (error) {
        const m = error.message.toLowerCase();
        const missingOrCache = m.includes("does not exist") || m.includes("42p01") || m.includes("schema cache") || m.includes("could not find the table");
        if (missingOrCache) {
            jar.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UI_THEME_COOKIE"], theme, cookieOpts);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/", "layout");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/indstillinger");
            return {
                ok: true
            };
        }
        return {
            ok: false,
            error: error.message
        };
    }
    jar.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UI_THEME_COOKIE"], theme, cookieOpts);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/", "layout");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/indstillinger");
    return {
        ok: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    setUserLayoutTheme
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setUserLayoutTheme, "40da134b10f7b4b87d5a66eca98ca4cf276edacf6e", null);
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/lib/workplace-admin-server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertWorkplaceAdminOrSuperAdmin",
    ()=>assertWorkplaceAdminOrSuperAdmin,
    "assertWorkplaceMember",
    ()=>assertWorkplaceMember,
    "isWorkplaceCalendarAdminView",
    ()=>isWorkplaceCalendarAdminView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/super-admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/server.ts [app-rsc] (ecmascript)");
;
;
async function hasSuperAdminAccessFromServer() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasSuperAdminAccess"])(supabase);
}
async function assertWorkplaceAdminOrSuperAdmin(workplaceId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
    if (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasSuperAdminAccess"])(supabase)) return;
    const { data: roles, error } = await supabase.rpc("get_my_roles_for_workplace", {
        p_workplace_id: workplaceId
    });
    if (error) {
        throw new Error("Kunne ikke verificere adgang.");
    }
    const arr = Array.isArray(roles) ? roles : [];
    if (!arr.includes("ADMIN") && !arr.includes("SUPER_ADMIN")) {
        throw new Error("Ingen administrator-adgang til denne arbejdsplads.");
    }
}
async function assertWorkplaceMember(workplaceId) {
    if (await hasSuperAdminAccessFromServer()) return;
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
    const { data: roles, error } = await supabase.rpc("get_my_roles_for_workplace", {
        p_workplace_id: workplaceId
    });
    if (error) {
        throw new Error("Kunne ikke verificere adgang.");
    }
    const arr = Array.isArray(roles) ? roles : [];
    if (arr.length === 0) {
        throw new Error("Ingen adgang til denne arbejdsplads.");
    }
}
async function isWorkplaceCalendarAdminView(workplaceId) {
    if (await hasSuperAdminAccessFromServer()) return true;
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
    const { data: roles, error } = await supabase.rpc("get_my_roles_for_workplace", {
        p_workplace_id: workplaceId
    });
    if (error) {
        return false;
    }
    const arr = Array.isArray(roles) ? roles : [];
    return arr.includes("ADMIN") || arr.includes("SUPER_ADMIN") || arr.includes("MANAGER");
}
}),
"[project]/src/types/season-template.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** 0 = mandag … 6 = søndag */ __turbopack_context__.s([
    "SEASON_WEEKDAY_KEYS",
    ()=>SEASON_WEEKDAY_KEYS,
    "SEASON_WEEKDAY_LABELS",
    ()=>SEASON_WEEKDAY_LABELS,
    "createEmptySeasonPeriod",
    ()=>createEmptySeasonPeriod,
    "emptySeasonTemplate",
    ()=>emptySeasonTemplate,
    "normalizeSeasonTemplate",
    ()=>normalizeSeasonTemplate
]);
const SEASON_WEEKDAY_LABELS = {
    "0": "Mandag",
    "1": "Tirsdag",
    "2": "Onsdag",
    "3": "Torsdag",
    "4": "Fredag",
    "5": "Lørdag",
    "6": "Søndag"
};
const SEASON_WEEKDAY_KEYS = Object.keys(SEASON_WEEKDAY_LABELS);
function newPeriodId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
function emptySeasonTemplate() {
    return {
        periods: []
    };
}
function createEmptySeasonPeriod(name = "New period") {
    return {
        id: newPeriodId(),
        name,
        dateFrom: "",
        dateTo: "",
        weekdays: {}
    };
}
function normalizeSeasonTemplate(raw) {
    if (!raw || typeof raw !== "object") {
        return emptySeasonTemplate();
    }
    const o = raw;
    if (!Array.isArray(o.periods)) {
        return emptySeasonTemplate();
    }
    const periods = [];
    for (const p of o.periods){
        if (!p || typeof p !== "object") continue;
        const r = p;
        const id = typeof r.id === "string" ? r.id : newPeriodId();
        const name = typeof r.name === "string" ? r.name : "Periode";
        const dateFrom = typeof r.dateFrom === "string" ? r.dateFrom : "";
        const dateTo = typeof r.dateTo === "string" ? r.dateTo : "";
        const weekdays = {};
        if (r.weekdays && typeof r.weekdays === "object") {
            for (const k of Object.keys(r.weekdays)){
                if (!/^([0-6])$/.test(k)) continue;
                const wk = k;
                const slot = r.weekdays[k];
                if (!slot || typeof slot !== "object") continue;
                const s = slot;
                weekdays[wk] = {
                    minEmployees: typeof s.minEmployees === "number" ? s.minEmployees : undefined,
                    employeeTypeCounts: s.employeeTypeCounts && typeof s.employeeTypeCounts === "object" && !Array.isArray(s.employeeTypeCounts) ? s.employeeTypeCounts : undefined,
                    shiftTypeCounts: s.shiftTypeCounts && typeof s.shiftTypeCounts === "object" && !Array.isArray(s.shiftTypeCounts) ? s.shiftTypeCounts : undefined
                };
            }
        }
        periods.push({
            id,
            name,
            dateFrom,
            dateTo,
            weekdays
        });
    }
    return {
        periods
    };
}
}),
"[project]/src/config/subscriptions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SUBSCRIPTION_TIER",
    ()=>DEFAULT_SUBSCRIPTION_TIER,
    "SUBSCRIPTION_PLAN_CONFIG",
    ()=>SUBSCRIPTION_PLAN_CONFIG,
    "SUBSCRIPTION_TIERS",
    ()=>SUBSCRIPTION_TIERS,
    "getSubscriptionPlanConfig",
    ()=>getSubscriptionPlanConfig,
    "isSubscriptionTier",
    ()=>isSubscriptionTier,
    "normalizeSubscriptionTier",
    ()=>normalizeSubscriptionTier,
    "subscriptionHasFeature",
    ()=>subscriptionHasFeature
]);
const SUBSCRIPTION_TIERS = [
    "FOUNDATION",
    "PRO_PLANNER",
    "HYBRID_APP",
    "AUTOPILOT"
];
const SUBSCRIPTION_PLAN_CONFIG = {
    FOUNDATION: {
        tier: "FOUNDATION",
        title: "Foundation",
        priceLabel: "0 EUR",
        hasAppAccess: false,
        hasUnlimitedChecks: false,
        canAccessOnlineSettings: false,
        canUseWebBuilder: false,
        canUseAutoScheduler: false,
        maxChecksPerDay: 1
    },
    PRO_PLANNER: {
        tier: "PRO_PLANNER",
        title: "Pro Planner",
        priceLabel: "49 EUR / month",
        hasAppAccess: false,
        hasUnlimitedChecks: true,
        canAccessOnlineSettings: false,
        canUseWebBuilder: false,
        canUseAutoScheduler: false,
        maxChecksPerDay: null
    },
    HYBRID_APP: {
        tier: "HYBRID_APP",
        title: "Hybrid App",
        priceLabel: "29 EUR / month + 1 EUR per user",
        hasAppAccess: true,
        hasUnlimitedChecks: true,
        canAccessOnlineSettings: false,
        canUseWebBuilder: false,
        canUseAutoScheduler: false,
        maxChecksPerDay: null
    },
    AUTOPILOT: {
        tier: "AUTOPILOT",
        title: "Autopilot",
        priceLabel: "59 EUR / month + 1 EUR per user",
        hasAppAccess: true,
        hasUnlimitedChecks: true,
        canAccessOnlineSettings: true,
        canUseWebBuilder: true,
        canUseAutoScheduler: true,
        maxChecksPerDay: null
    }
};
const DEFAULT_SUBSCRIPTION_TIER = "FOUNDATION";
function isSubscriptionTier(value) {
    return SUBSCRIPTION_TIERS.includes(value);
}
function normalizeSubscriptionTier(value) {
    if (!value) return DEFAULT_SUBSCRIPTION_TIER;
    return isSubscriptionTier(value) ? value : DEFAULT_SUBSCRIPTION_TIER;
}
function getSubscriptionPlanConfig(tier) {
    return SUBSCRIPTION_PLAN_CONFIG[tier];
}
function subscriptionHasFeature(tier, feature) {
    return SUBSCRIPTION_PLAN_CONFIG[tier][feature];
}
}),
"[project]/src/types/workplace.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EMPLOYEE_COUNT_BANDS",
    ()=>EMPLOYEE_COUNT_BANDS,
    "NOTIFICATION_CHANNELS",
    ()=>NOTIFICATION_CHANNELS,
    "isEmployeeCountBand",
    ()=>isEmployeeCountBand,
    "isNotificationChannel",
    ()=>isNotificationChannel
]);
const EMPLOYEE_COUNT_BANDS = [
    "5-20",
    "21-50",
    "51-150",
    "151+"
];
const NOTIFICATION_CHANNELS = [
    "push",
    "sms"
];
function isEmployeeCountBand(s) {
    return EMPLOYEE_COUNT_BANDS.includes(s);
}
function isNotificationChannel(s) {
    return NOTIFICATION_CHANNELS.includes(s);
}
}),
"[project]/src/lib/workplace-lifecycle.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_FULL_PLATFORM_MANUAL_SHIFT_THRESHOLD",
    ()=>DEFAULT_FULL_PLATFORM_MANUAL_SHIFT_THRESHOLD,
    "LIFECYCLE_STAGES",
    ()=>LIFECYCLE_STAGES,
    "incrementWorkplaceActiveEmployeeInvites",
    ()=>incrementWorkplaceActiveEmployeeInvites,
    "incrementWorkplaceImportedFilesCount",
    ()=>incrementWorkplaceImportedFilesCount,
    "incrementWorkplaceManualShiftsCreatedCount",
    ()=>incrementWorkplaceManualShiftsCreatedCount,
    "updateLifecycleStage",
    ()=>updateLifecycleStage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/admin.ts [app-rsc] (ecmascript)");
;
const LIFECYCLE_STAGES = [
    "PROSPECT",
    "REGISTERED",
    "ACTIVE_PLANNER",
    "HYBRID_OPERATOR",
    "FULL_PLATFORM"
];
const DEFAULT_FULL_PLATFORM_MANUAL_SHIFT_THRESHOLD = 25;
function normalizeLanguageCode(value) {
    const raw = String(value ?? "").trim().toLowerCase();
    if (/^[a-z]{2}$/.test(raw)) return raw;
    return "en";
}
function toInt(value) {
    const n = Number(value ?? 0);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.trunc(n));
}
function deriveLifecycleStage(input) {
    const importedFilesCount = toInt(input.importedFilesCount);
    const activeEmployeeInvites = toInt(input.activeEmployeeInvites);
    const manualShiftsCreatedCount = toInt(input.manualShiftsCreatedCount);
    const subscriptionStatus = String(input.subscriptionStatus ?? "").trim().toLowerCase();
    if (importedFilesCount === 0 && manualShiftsCreatedCount > input.fullPlatformManualShiftThreshold) {
        return "FULL_PLATFORM";
    }
    if (activeEmployeeInvites > 0 && subscriptionStatus === "active") {
        return "HYBRID_OPERATOR";
    }
    if (importedFilesCount > 0) {
        return "ACTIVE_PLANNER";
    }
    return "REGISTERED";
}
async function logLifecycleTransition(input) {
    const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
    await admin.from("workplace_lifecycle_events").insert({
        workplace_id: input.companyId,
        previous_stage: input.previousStage,
        next_stage: input.nextStage,
        language: input.language,
        event_source: input.source,
        context_json: input.context ?? {}
    });
}
async function updateLifecycleStage(companyId, opts) {
    try {
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const source = opts?.source?.trim() || "system";
        const fullPlatformThreshold = opts?.fullPlatformManualShiftThreshold ?? DEFAULT_FULL_PLATFORM_MANUAL_SHIFT_THRESHOLD;
        const { data, error } = await admin.from("workplaces").select("lifecycle_stage, language, imported_files_count, active_employee_invites, manual_shifts_created_count, subscription_status").eq("id", companyId).maybeSingle();
        if (error) return {
            ok: false,
            error: error.message
        };
        if (!data) return {
            ok: false,
            error: "Workplace not found."
        };
        const snapshot = data;
        const nextStage = deriveLifecycleStage({
            importedFilesCount: snapshot.imported_files_count ?? 0,
            activeEmployeeInvites: snapshot.active_employee_invites ?? 0,
            manualShiftsCreatedCount: snapshot.manual_shifts_created_count ?? 0,
            subscriptionStatus: snapshot.subscription_status ?? "inactive",
            fullPlatformManualShiftThreshold: fullPlatformThreshold
        });
        const previousStage = snapshot.lifecycle_stage;
        const changed = previousStage !== nextStage;
        if (changed) {
            const { error: updateErr } = await admin.from("workplaces").update({
                lifecycle_stage: nextStage,
                lifecycle_updated_at: new Date().toISOString()
            }).eq("id", companyId);
            if (updateErr) return {
                ok: false,
                error: updateErr.message
            };
            await logLifecycleTransition({
                companyId,
                previousStage,
                nextStage,
                language: normalizeLanguageCode(snapshot.language),
                source,
                context: opts?.context
            });
        }
        return {
            ok: true,
            stage: nextStage,
            changed
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown lifecycle error";
        return {
            ok: false,
            error: msg
        };
    }
}
async function incrementWorkplaceImportedFilesCount(companyId, delta = 1, context) {
    try {
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const amount = Math.max(1, Math.trunc(delta || 1));
        const { data, error } = await admin.from("workplaces").select("imported_files_count").eq("id", companyId).maybeSingle();
        if (error) return {
            ok: false,
            error: error.message
        };
        if (!data) return {
            ok: false,
            error: "Workplace not found."
        };
        const current = toInt(data.imported_files_count);
        const { error: updateErr } = await admin.from("workplaces").update({
            imported_files_count: current + amount
        }).eq("id", companyId);
        if (updateErr) return {
            ok: false,
            error: updateErr.message
        };
        await updateLifecycleStage(companyId, {
            source: "file_uploaded",
            context: {
                amount,
                ...context ?? {}
            }
        });
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown lifecycle error";
        return {
            ok: false,
            error: msg
        };
    }
}
async function incrementWorkplaceActiveEmployeeInvites(companyId, delta = 1, context) {
    try {
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const amount = Math.max(1, Math.trunc(delta || 1));
        const { data, error } = await admin.from("workplaces").select("active_employee_invites").eq("id", companyId).maybeSingle();
        if (error) return {
            ok: false,
            error: error.message
        };
        if (!data) return {
            ok: false,
            error: "Workplace not found."
        };
        const current = toInt(data.active_employee_invites);
        const { error: updateErr } = await admin.from("workplaces").update({
            active_employee_invites: current + amount
        }).eq("id", companyId);
        if (updateErr) return {
            ok: false,
            error: updateErr.message
        };
        await updateLifecycleStage(companyId, {
            source: "employee_invited",
            context: {
                amount,
                ...context ?? {}
            }
        });
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown lifecycle error";
        return {
            ok: false,
            error: msg
        };
    }
}
async function incrementWorkplaceManualShiftsCreatedCount(companyId, delta = 1, context) {
    try {
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const amount = Math.max(1, Math.trunc(delta || 1));
        const { data, error } = await admin.from("workplaces").select("manual_shifts_created_count").eq("id", companyId).maybeSingle();
        if (error) return {
            ok: false,
            error: error.message
        };
        if (!data) return {
            ok: false,
            error: "Workplace not found."
        };
        const current = toInt(data.manual_shifts_created_count);
        const { error: updateErr } = await admin.from("workplaces").update({
            manual_shifts_created_count: current + amount
        }).eq("id", companyId);
        if (updateErr) return {
            ok: false,
            error: updateErr.message
        };
        await updateLifecycleStage(companyId, {
            source: "manual_shift_created",
            context: {
                amount,
                ...context ?? {}
            }
        });
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown lifecycle error";
        return {
            ok: false,
            error: msg
        };
    }
}
}),
"[project]/src/app/super-admin/workplaces/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"001a343955998fab1566a737e9a80dd3f7a04883ac":{"name":"getWorkplaces"},"400a744797871fabd6c8784f613823629e129c71af":{"name":"exportWorkplaceCsv"},"401c7d7dedb936715b4809394f214f715255e98962":{"name":"getWorkplaceTypes"},"403c25bb288df6145565a07ef821a88f917fd8aa37":{"name":"deleteShiftTypeTemplate"},"405584b5b956900dcea57e862bf8c0d1f30748f610":{"name":"createWorkplace"},"406d0f16e62da4fb8cc47dd7c46b3ba8ad86af6195":{"name":"deleteEmployeeTypeTemplate"},"406fbd9aa1d285b94472b18cf4a8fca836fff886aa":{"name":"createEmployeeTypeTemplate"},"4081521e0bfa388bf7a7929f4f2a842eab2dafc240":{"name":"listShiftTypeTemplates"},"408408ad6ff6c256b8db582905f9e1452a1fa028da":{"name":"listEmployeeTypeTemplates"},"4088bec09bfeaab68a8d7d8b96a3ce0bcd05c7234c":{"name":"copyWorkplaceTemplatesFromStandards"},"4097036f0e59aec84357e924d87bd58f69de126491":{"name":"getWorkplaceById"},"409d40d4c9e5171aa8f4cd4b34f29bb76ffbb6d088":{"name":"listEuCountriesForWorkplace"},"40c53e89d9d480416ba6f89b020f40cc7573f76181":{"name":"listWorkplaceApiKeys"},"40ef1c0b01fab1f0416afe02837b7a410958e48107":{"name":"createWorkplaceLegacy"},"40f1c7b8028aa137282da3b9e76520d4d5b7ea6363":{"name":"createShiftTypeTemplate"},"60125dff8ce82f2d68a31a95364d935c9aedccf43e":{"name":"createWorkplaceShiftType"},"602dab343e190bf3f645a3238a81e825b66e2b7d64":{"name":"createWorkplaceEmployeeType"},"60354e8506f41b7d6f61a0a265f5541909b514c912":{"name":"updateWorkplace"},"60370148a97e128bd87fbe4539c141ebeb200f9016":{"name":"importWorkplaceMembersFromCsv"},"603eaf18b83e2c3f89decbaed94cc37f20965ac7db":{"name":"getWorkplaceDepartmentsOverview"},"60505118d199d20c1ace7c160e0ae7d58fea467f9b":{"name":"updateEmployeeTypeTemplate"},"606dff1ed694fdbe20b6d05870630e8ee1e66ab746":{"name":"deleteWorkplaceDepartment"},"60867009d54b73dd5400ed4e2d6b333ac9b15eb9b9":{"name":"updateShiftTypeTemplate"},"608e44b4ed4db0e39782730959fd4e2e9d523abfb8":{"name":"registerWorkplaceImportUpload"},"609c49c12dd94a2cc4c44d8c6b1f57edcb90be1098":{"name":"revokeWorkplaceApiKey"},"60e4e4a6c2350ba5eeabef29cca8fc80773e95725a":{"name":"createWorkplaceDepartment"},"60ee8d875180a268c31e6c884cc538d0c6b03ed7d3":{"name":"generateWorkplaceApiKey"},"60fa005521543123673f61050ebfde5ce49de26a60":{"name":"saveWorkplaceDepartmentMemberships"}},"src/app/super-admin/workplaces/actions.ts",""] */ __turbopack_context__.s([
    "copyWorkplaceTemplatesFromStandards",
    ()=>copyWorkplaceTemplatesFromStandards,
    "createEmployeeTypeTemplate",
    ()=>createEmployeeTypeTemplate,
    "createShiftTypeTemplate",
    ()=>createShiftTypeTemplate,
    "createWorkplace",
    ()=>createWorkplace,
    "createWorkplaceDepartment",
    ()=>createWorkplaceDepartment,
    "createWorkplaceEmployeeType",
    ()=>createWorkplaceEmployeeType,
    "createWorkplaceLegacy",
    ()=>createWorkplaceLegacy,
    "createWorkplaceShiftType",
    ()=>createWorkplaceShiftType,
    "deleteEmployeeTypeTemplate",
    ()=>deleteEmployeeTypeTemplate,
    "deleteShiftTypeTemplate",
    ()=>deleteShiftTypeTemplate,
    "deleteWorkplaceDepartment",
    ()=>deleteWorkplaceDepartment,
    "exportWorkplaceCsv",
    ()=>exportWorkplaceCsv,
    "generateWorkplaceApiKey",
    ()=>generateWorkplaceApiKey,
    "getWorkplaceById",
    ()=>getWorkplaceById,
    "getWorkplaceDepartmentsOverview",
    ()=>getWorkplaceDepartmentsOverview,
    "getWorkplaceTypes",
    ()=>getWorkplaceTypes,
    "getWorkplaces",
    ()=>getWorkplaces,
    "importWorkplaceMembersFromCsv",
    ()=>importWorkplaceMembersFromCsv,
    "listEmployeeTypeTemplates",
    ()=>listEmployeeTypeTemplates,
    "listEuCountriesForWorkplace",
    ()=>listEuCountriesForWorkplace,
    "listShiftTypeTemplates",
    ()=>listShiftTypeTemplates,
    "listWorkplaceApiKeys",
    ()=>listWorkplaceApiKeys,
    "registerWorkplaceImportUpload",
    ()=>registerWorkplaceImportUpload,
    "revokeWorkplaceApiKey",
    ()=>revokeWorkplaceApiKey,
    "saveWorkplaceDepartmentMemberships",
    ()=>saveWorkplaceDepartmentMemberships,
    "updateEmployeeTypeTemplate",
    ()=>updateEmployeeTypeTemplate,
    "updateShiftTypeTemplate",
    ()=>updateShiftTypeTemplate,
    "updateWorkplace",
    ()=>updateWorkplace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/workplace-admin-server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/super-admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$season$2d$template$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/season-template.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$subscriptions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/subscriptions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$workplace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/workplace.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$lifecycle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/workplace-lifecycle.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
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
async function requireSuperAdmin() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertSuperAdminAccess"])(supabase);
}
function revalidateWorkplaceDetailPages(workplaceId) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/super-admin/workplaces/${workplaceId}`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/indstillinger");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/fremtiden");
}
/** PostgREST / Postgres når tabeller ikke findes eller cache er forældet */ function isMissingSchemaError(message) {
    const m = message.toLowerCase();
    return m.includes("schema cache") || m.includes("could not find") || m.includes("does not exist") || m.includes("42p01") || m.includes("undefined table") || m.includes("relation") && m.includes("does not exist");
}
/** Navn fra OAuth-provider (user_metadata), typisk Google/Facebook */ function oauthDisplayNameFromUserMetadata(meta) {
    if (!meta) return null;
    const full = meta.full_name ?? meta.name;
    if (typeof full === "string" && full.trim()) return full.trim();
    const given = meta.given_name;
    const family = meta.family_name;
    if (typeof given === "string" && typeof family === "string") {
        const g = given.trim();
        const f = family.trim();
        if (g && f) return `${g} ${f}`;
        if (g) return g;
        if (f) return f;
    }
    if (typeof given === "string" && given.trim()) return given.trim();
    if (typeof family === "string" && family.trim()) return family.trim();
    const pref = meta.preferred_username;
    if (typeof pref === "string" && pref.trim()) return pref.trim();
    return null;
}
function resolveMemberDisplayName(oauthName, override, email, userId) {
    const ovr = override?.trim() ? override.trim() : null;
    const oauth = oauthName?.trim() ? oauthName.trim() : null;
    const mail = email?.trim() ? email.trim() : null;
    const display = ovr ?? oauth ?? mail ?? `${userId.slice(0, 8)}…`;
    return {
        display_name: display,
        oauth_display_name: oauth,
        display_name_override: ovr
    };
}
function normalizeTemplateMatchKey(value) {
    return (value ?? "").trim().toLocaleLowerCase("da");
}
const LEGACY_SHIFT_LABEL_TO_STANDARD = new Map([
    [
        "dag",
        "Normal"
    ],
    [
        "day",
        "Normal"
    ],
    [
        "aften",
        "Normal"
    ],
    [
        "evening",
        "Normal"
    ],
    [
        "nat",
        "Normal"
    ],
    [
        "night",
        "Normal"
    ],
    [
        "syg",
        "Sygdom"
    ],
    [
        "sygemelding",
        "Sygdom"
    ],
    [
        "sick",
        "Sygdom"
    ],
    [
        "akut vagt",
        "Akut"
    ],
    [
        "vikar vagt",
        "Ledig"
    ],
    [
        "fridag",
        "Ferie"
    ],
    [
        "fri",
        "Ferie"
    ]
]);
const SHIFT_IMPORT_CODE_TO_STANDARD_LABEL = new Map([
    [
        "ST001",
        "Morning"
    ],
    [
        "ST002",
        "Day"
    ],
    [
        "ST003",
        "Midday"
    ],
    [
        "ST004",
        "Afternoon"
    ],
    [
        "ST005",
        "Night"
    ],
    [
        "ST006",
        "Long"
    ],
    [
        "ST007",
        "Short"
    ],
    [
        "ST008",
        "Split 1"
    ],
    [
        "ST009",
        "Split 2"
    ],
    [
        "ST010",
        "On-Call"
    ],
    [
        "ST011",
        "Day Off"
    ],
    [
        "ST012",
        "Vacation"
    ],
    [
        "ST013",
        "Sick"
    ],
    [
        "ST014",
        "Child Sick"
    ],
    [
        "ST015",
        "Training"
    ],
    [
        "ST016",
        "Comp. Off"
    ],
    [
        "ST017",
        "Shift Swap"
    ],
    [
        "ST018",
        "Open Shift"
    ],
    [
        "ST019",
        "Urgent"
    ]
]);
const SHIFT_IDENTIFIER_TO_IMPORT_CODE = new Map([
    [
        "st001",
        "ST001"
    ],
    [
        "morning",
        "ST001"
    ],
    [
        "morgen",
        "ST001"
    ],
    [
        "st002",
        "ST002"
    ],
    [
        "day",
        "ST002"
    ],
    [
        "dag",
        "ST002"
    ],
    [
        "normal",
        "ST002"
    ],
    [
        "st003",
        "ST003"
    ],
    [
        "midday",
        "ST003"
    ],
    [
        "middag",
        "ST003"
    ],
    [
        "st004",
        "ST004"
    ],
    [
        "afternoon",
        "ST004"
    ],
    [
        "aften",
        "ST004"
    ],
    [
        "st005",
        "ST005"
    ],
    [
        "night",
        "ST005"
    ],
    [
        "nat",
        "ST005"
    ],
    [
        "st006",
        "ST006"
    ],
    [
        "long",
        "ST006"
    ],
    [
        "lang",
        "ST006"
    ],
    [
        "st007",
        "ST007"
    ],
    [
        "short",
        "ST007"
    ],
    [
        "kort",
        "ST007"
    ],
    [
        "st008",
        "ST008"
    ],
    [
        "split1",
        "ST008"
    ],
    [
        "split 1",
        "ST008"
    ],
    [
        "split_1",
        "ST008"
    ],
    [
        "st009",
        "ST009"
    ],
    [
        "split2",
        "ST009"
    ],
    [
        "split 2",
        "ST009"
    ],
    [
        "split_2",
        "ST009"
    ],
    [
        "st010",
        "ST010"
    ],
    [
        "on-call",
        "ST010"
    ],
    [
        "on call",
        "ST010"
    ],
    [
        "on_call",
        "ST010"
    ],
    [
        "st011",
        "ST011"
    ],
    [
        "off",
        "ST011"
    ],
    [
        "day off",
        "ST011"
    ],
    [
        "fridag",
        "ST011"
    ],
    [
        "fri",
        "ST011"
    ],
    [
        "st012",
        "ST012"
    ],
    [
        "vacation",
        "ST012"
    ],
    [
        "ferie",
        "ST012"
    ],
    [
        "st013",
        "ST013"
    ],
    [
        "sick",
        "ST013"
    ],
    [
        "syg",
        "ST013"
    ],
    [
        "sygdom",
        "ST013"
    ],
    [
        "st014",
        "ST014"
    ],
    [
        "child-sick",
        "ST014"
    ],
    [
        "child sick",
        "ST014"
    ],
    [
        "child_sick",
        "ST014"
    ],
    [
        "child_sick_day",
        "ST014"
    ],
    [
        "barn 1. sygedag",
        "ST014"
    ],
    [
        "st015",
        "ST015"
    ],
    [
        "training",
        "ST015"
    ],
    [
        "træning",
        "ST015"
    ],
    [
        "st016",
        "ST016"
    ],
    [
        "comp-off",
        "ST016"
    ],
    [
        "comp off",
        "ST016"
    ],
    [
        "comp_off",
        "ST016"
    ],
    [
        "afspadsering",
        "ST016"
    ],
    [
        "st017",
        "ST017"
    ],
    [
        "swap",
        "ST017"
    ],
    [
        "bytte",
        "ST017"
    ],
    [
        "shift swap",
        "ST017"
    ],
    [
        "st018",
        "ST018"
    ],
    [
        "open",
        "ST018"
    ],
    [
        "open shift",
        "ST018"
    ],
    [
        "ledig",
        "ST018"
    ],
    [
        "st019",
        "ST019"
    ],
    [
        "urgent",
        "ST019"
    ],
    [
        "akut",
        "ST019"
    ]
]);
function inferShiftImportCode(value) {
    const key = normalizeTemplateMatchKey(value).replace(/_/g, " ");
    if (!key) return null;
    const compact = key.replace(/\s+/g, "");
    return SHIFT_IDENTIFIER_TO_IMPORT_CODE.get(key) ?? SHIFT_IDENTIFIER_TO_IMPORT_CODE.get(compact) ?? null;
}
const LEGACY_EMPLOYEE_LABEL_TO_STANDARD = new Map([
    [
        "permanent",
        "Fuldtid"
    ],
    [
        "fastansat",
        "Fuldtid"
    ],
    [
        "parttime",
        "Deltid"
    ],
    [
        "deltidsansat",
        "Deltid"
    ],
    [
        "trainee",
        "Elev"
    ],
    [
        "praktikant",
        "Elev"
    ],
    [
        "temporary",
        "Vikar"
    ],
    [
        "ung",
        "Ung (under 18)"
    ],
    [
        "youth",
        "Ung (under 18)"
    ]
]);
function fallbackHolidayDefsForCountry(countryCode) {
    if (countryCode !== "DK") return [];
    return [
        {
            holiday_rule: "fixed",
            month: 1,
            day: 1,
            easter_offset_days: null,
            display_name: "Nytårsdag"
        },
        {
            holiday_rule: "easter_offset",
            month: null,
            day: null,
            easter_offset_days: -3,
            display_name: "Skærtorsdag"
        },
        {
            holiday_rule: "easter_offset",
            month: null,
            day: null,
            easter_offset_days: -2,
            display_name: "Langfredag"
        },
        {
            holiday_rule: "easter_offset",
            month: null,
            day: null,
            easter_offset_days: 0,
            display_name: "Påskedag"
        },
        {
            holiday_rule: "easter_offset",
            month: null,
            day: null,
            easter_offset_days: 1,
            display_name: "2. påskedag"
        },
        {
            holiday_rule: "easter_offset",
            month: null,
            day: null,
            easter_offset_days: 26,
            display_name: "Store bededag"
        },
        {
            holiday_rule: "easter_offset",
            month: null,
            day: null,
            easter_offset_days: 39,
            display_name: "Kristi himmelfartsdag"
        },
        {
            holiday_rule: "easter_offset",
            month: null,
            day: null,
            easter_offset_days: 49,
            display_name: "Pinsedag"
        },
        {
            holiday_rule: "easter_offset",
            month: null,
            day: null,
            easter_offset_days: 50,
            display_name: "2. pinsedag"
        },
        {
            holiday_rule: "fixed",
            month: 6,
            day: 5,
            easter_offset_days: null,
            display_name: "Grundlovsdag"
        },
        {
            holiday_rule: "fixed",
            month: 12,
            day: 24,
            easter_offset_days: null,
            display_name: "Juleaften"
        },
        {
            holiday_rule: "fixed",
            month: 12,
            day: 25,
            easter_offset_days: null,
            display_name: "1. juledag"
        },
        {
            holiday_rule: "fixed",
            month: 12,
            day: 26,
            easter_offset_days: null,
            display_name: "2. juledag"
        },
        {
            holiday_rule: "fixed",
            month: 12,
            day: 31,
            easter_offset_days: null,
            display_name: "Nytårsaften"
        }
    ];
}
function parseSemicolonCsvLine(line) {
    const cells = [];
    let cur = "";
    let inQuotes = false;
    for(let i = 0; i < line.length; i += 1){
        const ch = line[i];
        if (ch === "\"") {
            const next = line[i + 1];
            if (inQuotes && next === "\"") {
                cur += "\"";
                i += 1;
                continue;
            }
            inQuotes = !inQuotes;
            continue;
        }
        if (ch === ";" && !inQuotes) {
            cells.push(cur.trim());
            cur = "";
            continue;
        }
        cur += ch;
    }
    cells.push(cur.trim());
    return cells;
}
async function listAuthUsersByEmailLower(admin) {
    const out = new Map();
    let page = 1;
    const perPage = 1000;
    for(;;){
        const { data, error } = await admin.auth.admin.listUsers({
            page,
            perPage
        });
        if (error) {
            break;
        }
        const users = data.users ?? [];
        for (const user of users){
            const email = (user.email ?? "").trim().toLowerCase();
            if (!email) continue;
            out.set(email, user.id);
        }
        if (users.length < perPage) break;
        page += 1;
        if (page > 100) break;
    }
    return out;
}
async function assertDepartmentIdsBelongToWorkplace(admin, workplaceId, departmentIds) {
    const unique = [
        ...new Set(departmentIds)
    ].filter(Boolean);
    if (unique.length === 0) {
        return {
            ok: true
        };
    }
    const { data, error } = await admin.from("workplace_departments").select("id").eq("workplace_id", workplaceId).in("id", unique);
    if (error) {
        return {
            ok: false,
            error: error.message
        };
    }
    const found = new Set((data ?? []).map((r)=>r.id));
    for (const id of unique){
        if (!found.has(id)) {
            return {
                ok: false,
                error: "Én eller flere afdelinger tilhører ikke denne arbejdsplads (ugyldigt id)."
            };
        }
    }
    return {
        ok: true
    };
}
async function getWorkplaces() {
    try {
        await requireSuperAdmin();
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data, error } = await admin.from("workplaces").select("id, name, company_name, city, created_at").order("name");
        if (error) {
            return {
                ok: false,
                error: error.message
            };
        }
        return {
            ok: true,
            data: data ?? []
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function listEuCountriesForWorkplace(workplaceId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data, error } = await admin.from("eu_countries").select("country_code, name").order("name", {
            ascending: true
        });
        if (error) {
            if (isMissingSchemaError(error.message)) {
                return {
                    ok: true,
                    data: []
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        return {
            ok: true,
            data: data ?? []
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
/**
 * @returns `null` hvis OK, ellers en advarsels-tekst (arbejdspladsen er stadig oprettet).
 */ /**
 * Indsætter manglende rækker fra standardkataloget (idempotent — springer skabeloner over der allerede findes).
 */ async function copyTemplatesToWorkplace(workplaceId) {
    const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
    const { data: existingEmp } = await admin.from("workplace_employee_types").select("template_id").eq("workplace_id", workplaceId);
    const existingEmpTemplateIds = new Set((existingEmp ?? []).map((r)=>r.template_id).filter((id)=>Boolean(id)));
    const { data: existingShift } = await admin.from("workplace_shift_types").select("template_id").eq("workplace_id", workplaceId);
    const existingShiftTemplateIds = new Set((existingShift ?? []).map((r)=>r.template_id).filter((id)=>Boolean(id)));
    const { data: et, error: e1 } = await admin.from("employee_type_templates").select("id, name, sort_order, calendar_pattern").order("sort_order");
    if (e1) {
        if (isMissingSchemaError(e1.message)) {
            return "Kør supabase_workplace_extended.sql i Supabase SQL Editor. Hvis tabellen findes: Project Settings → API → Reload schema.";
        }
        return `Kunne ikke hente medarbejder-skabeloner: ${e1.message}`;
    }
    const { data: st, error: e2 } = await admin.from("shift_type_templates").select("id, name, sort_order, calendar_color").order("sort_order");
    if (e2) {
        if (isMissingSchemaError(e2.message)) {
            return "Kør supabase_workplace_extended.sql i Supabase SQL Editor. Hvis tabellen findes: Project Settings → API → Reload schema.";
        }
        return `Kunne ikke hente vagt-skabeloner: ${e2.message}`;
    }
    for (const row of et ?? []){
        const tid = row.id;
        if (existingEmpTemplateIds.has(tid)) continue;
        const { error } = await admin.from("workplace_employee_types").insert({
            workplace_id: workplaceId,
            template_id: tid,
            label: row.name,
            sort_order: row.sort_order,
            calendar_pattern: row.calendar_pattern ?? "none"
        });
        if (error) {
            if (isMissingSchemaError(error.message)) {
                return "Kør supabase_workplace_extended.sql (workplace_employee_types). Eller Reload schema under API-indstillinger.";
            }
            return `Kunne ikke kopiere medarbejder-typer: ${error.message}`;
        }
    }
    for (const row of st ?? []){
        const tid = row.id;
        if (existingShiftTemplateIds.has(tid)) continue;
        const { error } = await admin.from("workplace_shift_types").insert({
            workplace_id: workplaceId,
            template_id: tid,
            label: row.name,
            sort_order: row.sort_order,
            calendar_color: row.calendar_color ?? "#94a3b8"
        });
        if (error) {
            if (isMissingSchemaError(error.message)) {
                return "Kør supabase_workplace_extended.sql (workplace_shift_types). Eller Reload schema under API-indstillinger.";
            }
            return `Kunne ikke kopiere vagttyper: ${error.message}`;
        }
    }
    return null;
}
async function copyWorkplaceTemplatesFromStandards(workplaceId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const warn = await copyTemplatesToWorkplace(workplaceId);
        if (warn) {
            return {
                ok: false,
                error: warn
            };
        }
        revalidateWorkplaceDetailPages(workplaceId);
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function createWorkplace(input) {
    try {
        await requireSuperAdmin();
        const name = input.name.trim();
        const companyName = input.company_name.trim();
        if (!name || !companyName) {
            return {
                ok: false,
                error: "Navn og firmanavn skal udfyldes."
            };
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$workplace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isEmployeeCountBand"])(input.employee_count_band)) {
            return {
                ok: false,
                error: "Ugyldigt interval for antal ansatte."
            };
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$workplace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNotificationChannel"])(input.notification_channel)) {
            return {
                ok: false,
                error: "Ugyldig notifikationsindstilling."
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const language = input.country_code?.trim().toUpperCase() === "DK" ? "da" : "en";
        const { data, error } = await admin.from("workplaces").insert({
            name,
            company_name: companyName,
            vat_number: input.vat_number?.trim() || null,
            street_name: input.street_name?.trim() || null,
            street_number: input.street_number?.trim() || null,
            address_extra: input.address_extra?.trim() || null,
            postal_code: input.postal_code?.trim() || null,
            city: input.city?.trim() || null,
            country_code: input.country_code?.trim().toUpperCase() || null,
            contact_email: input.contact_email?.trim() || null,
            phone: input.phone?.trim() || null,
            employee_count_band: input.employee_count_band,
            notification_channel: input.notification_channel,
            language
        }).select("id, name, company_name, city, created_at").single();
        if (error) {
            return {
                ok: false,
                error: error.message
            };
        }
        const row = data;
        const copyWarning = await copyTemplatesToWorkplace(row.id);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$lifecycle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateLifecycleStage"])(row.id, {
            source: "workplace_created",
            context: {
                language,
                employee_count_band: input.employee_count_band
            }
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/super-admin/users");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/super-admin/workplaces");
        return {
            ok: true,
            data: row,
            ...copyWarning ? {
                warning: copyWarning
            } : {}
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function createWorkplaceLegacy(name) {
    const trimmed = name.trim();
    if (!trimmed) {
        return {
            ok: false,
            error: "Navn kan ikke være tomt."
        };
    }
    return createWorkplace({
        name: trimmed,
        company_name: trimmed,
        employee_count_band: "5-20",
        notification_channel: "push"
    });
}
function mapDetail(row) {
    const fw = row.future_planning_weeks;
    const importedFilesCountRaw = row.imported_files_count;
    const activeInvitesRaw = row.active_employee_invites;
    const manualShiftsRaw = row.manual_shifts_created_count;
    const swapPermissionRaw = row.employee_swap_permission_level;
    return {
        id: row.id,
        name: row.name,
        company_name: row.company_name ?? null,
        vat_number: row.vat_number ?? null,
        street_name: row.street_name ?? null,
        street_number: row.street_number ?? null,
        address_extra: row.address_extra ?? null,
        postal_code: row.postal_code ?? null,
        city: row.city ?? null,
        country_code: row.country_code ?? null,
        contact_email: row.contact_email ?? null,
        phone: row.phone ?? null,
        employee_count_band: row.employee_count_band,
        stripe_customer_id: row.stripe_customer_id ?? null,
        lifecycle_stage: String(row.lifecycle_stage ?? "PROSPECT"),
        language: String(row.language ?? "en"),
        imported_files_count: typeof importedFilesCountRaw === "number" && Number.isFinite(importedFilesCountRaw) ? importedFilesCountRaw : 0,
        active_employee_invites: typeof activeInvitesRaw === "number" && Number.isFinite(activeInvitesRaw) ? activeInvitesRaw : 0,
        manual_shifts_created_count: typeof manualShiftsRaw === "number" && Number.isFinite(manualShiftsRaw) ? manualShiftsRaw : 0,
        subscription_status: String(row.subscription_status ?? "inactive"),
        subscription_tier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$subscriptions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeSubscriptionTier"])(typeof row.subscription_tier === "string" ? row.subscription_tier : null),
        lifecycle_updated_at: row.lifecycle_updated_at == null ? null : String(row.lifecycle_updated_at),
        employee_swap_permission_level: typeof swapPermissionRaw === "number" && Number.isFinite(swapPermissionRaw) ? Math.min(3, Math.max(1, Math.trunc(swapPermissionRaw))) : 2,
        push_include_shift_type_ids: row.push_include_shift_type_ids ?? [],
        push_include_employee_type_ids: row.push_include_employee_type_ids ?? [],
        created_at: row.created_at,
        future_planning_weeks: typeof fw === "number" && Number.isFinite(fw) ? fw : 8,
        calendar_released_until: row.calendar_released_until == null || row.calendar_released_until === "" ? null : String(row.calendar_released_until).slice(0, 10),
        season_template_json: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$season$2d$template$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeSeasonTemplate"])(row.season_template_json)
    };
}
const WORKPLACE_DETAIL_SELECT_BASE = "id, name, company_name, vat_number, street_name, street_number, address_extra, postal_code, city, country_code, contact_email, phone, employee_count_band, stripe_customer_id, lifecycle_stage, language, imported_files_count, active_employee_invites, manual_shifts_created_count, subscription_status, subscription_tier, lifecycle_updated_at, employee_swap_permission_level, push_include_shift_type_ids, push_include_employee_type_ids, created_at";
const WORKPLACE_DETAIL_SELECT_LEGACY = "id, name, company_name, vat_number, street_name, street_number, address_extra, postal_code, city, country_code, contact_email, phone, employee_count_band, stripe_customer_id, push_include_shift_type_ids, push_include_employee_type_ids, created_at";
const WORKPLACE_DETAIL_SELECT_EXTENDED = `${WORKPLACE_DETAIL_SELECT_BASE}, future_planning_weeks, calendar_released_until, season_template_json`;
async function getWorkplaceById(id) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(id);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data, error } = await admin.from("workplaces").select(WORKPLACE_DETAIL_SELECT_EXTENDED).eq("id", id).maybeSingle();
        if (error) {
            if (/column|does not exist|schema cache/i.test(error.message)) {
                const { data: d2, error: e2 } = await admin.from("workplaces").select(WORKPLACE_DETAIL_SELECT_LEGACY).eq("id", id).maybeSingle();
                if (e2 || !d2) {
                    return {
                        ok: false,
                        error: error.message
                    };
                }
                return {
                    ok: true,
                    data: mapDetail({
                        ...d2,
                        future_planning_weeks: 8,
                        calendar_released_until: null,
                        season_template_json: {}
                    })
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        if (!data) {
            return {
                ok: false,
                error: "Arbejdsplads ikke fundet."
            };
        }
        return {
            ok: true,
            data: mapDetail(data)
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function getWorkplaceTypes(workplaceId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const [eRes, sRes] = await Promise.all([
            admin.from("workplace_employee_types").select("id, template_id, label, sort_order, calendar_pattern").eq("workplace_id", workplaceId).order("sort_order"),
            admin.from("workplace_shift_types").select("id, template_id, label, sort_order, calendar_color").eq("workplace_id", workplaceId).order("sort_order")
        ]);
        if (eRes.error) {
            if (isMissingSchemaError(eRes.error.message)) {
                return {
                    ok: true,
                    employeeTypes: [],
                    shiftTypes: []
                };
            }
            return {
                ok: false,
                error: eRes.error.message
            };
        }
        if (sRes.error) {
            if (isMissingSchemaError(sRes.error.message)) {
                return {
                    ok: true,
                    employeeTypes: eRes.data ?? [],
                    shiftTypes: []
                };
            }
            return {
                ok: false,
                error: sRes.error.message
            };
        }
        const rawEmployeeTypes = eRes.data ?? [];
        const rawShiftTypes = sRes.data ?? [];
        const [employeeTemplateRes, shiftTemplateRes] = await Promise.all([
            admin.from("employee_type_templates").select("id, name, calendar_pattern"),
            admin.from("shift_type_templates").select("id, name, slug, import_code, calendar_color")
        ]);
        const employeeTemplateById = new Map();
        const employeeTemplateByName = new Map();
        if (!employeeTemplateRes.error) {
            for (const row of employeeTemplateRes.data ?? []){
                const id = String(row.id ?? "");
                const name = String(row.name ?? "").trim();
                if (!name) continue;
                const normalized = normalizeTemplateMatchKey(name);
                const template = {
                    name,
                    pattern: row.calendar_pattern ?? "none"
                };
                if (id) employeeTemplateById.set(id, template);
                if (normalized && !employeeTemplateByName.has(normalized)) {
                    employeeTemplateByName.set(normalized, template);
                }
            }
        }
        const shiftTemplateById = new Map();
        const shiftTemplateByName = new Map();
        const shiftTemplateByImportCode = new Map();
        if (!shiftTemplateRes.error) {
            for (const row of shiftTemplateRes.data ?? []){
                const id = String(row.id ?? "");
                const name = String(row.name ?? "").trim();
                if (!name) continue;
                const normalized = normalizeTemplateMatchKey(name);
                const slug = String(row.slug ?? "").trim();
                const import_code = row.import_code ?? inferShiftImportCode(slug) ?? inferShiftImportCode(name);
                const template = {
                    name,
                    color: row.calendar_color ?? "#94a3b8",
                    import_code
                };
                if (id) shiftTemplateById.set(id, template);
                if (normalized && !shiftTemplateByName.has(normalized)) {
                    shiftTemplateByName.set(normalized, template);
                }
                if (import_code && !shiftTemplateByImportCode.has(import_code)) {
                    shiftTemplateByImportCode.set(import_code, template);
                }
            }
        }
        const employeeTypes = rawEmployeeTypes.map((row)=>{
            const key = normalizeTemplateMatchKey(row.label);
            const legacy = LEGACY_EMPLOYEE_LABEL_TO_STANDARD.get(key);
            const byTemplateId = row.template_id ? employeeTemplateById.get(row.template_id) : undefined;
            const byTemplateName = employeeTemplateByName.get(legacy ? normalizeTemplateMatchKey(legacy) : key);
            return {
                ...row,
                label: byTemplateId?.name ?? byTemplateName?.name ?? legacy ?? row.label,
                calendar_pattern: byTemplateId?.pattern ?? byTemplateName?.pattern ?? row.calendar_pattern ?? "none"
            };
        });
        const shiftTypes = rawShiftTypes.map((row)=>{
            const key = normalizeTemplateMatchKey(row.label);
            const legacy = LEGACY_SHIFT_LABEL_TO_STANDARD.get(key);
            const byTemplateId = row.template_id ? shiftTemplateById.get(row.template_id) : undefined;
            const importCode = byTemplateId?.import_code ?? inferShiftImportCode(legacy ?? row.label);
            const byTemplateCode = importCode ? shiftTemplateByImportCode.get(importCode) : undefined;
            const byTemplateName = shiftTemplateByName.get(legacy ? normalizeTemplateMatchKey(legacy) : key);
            const canonicalByCode = importCode ? SHIFT_IMPORT_CODE_TO_STANDARD_LABEL.get(importCode) : undefined;
            return {
                ...row,
                import_code: importCode ?? null,
                label: byTemplateId?.name ?? byTemplateCode?.name ?? byTemplateName?.name ?? canonicalByCode ?? legacy ?? row.label,
                calendar_color: byTemplateId?.color ?? byTemplateCode?.color ?? byTemplateName?.color ?? row.calendar_color ?? "#94a3b8"
            };
        });
        return {
            ok: true,
            employeeTypes,
            shiftTypes
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function nextWorkplaceEmployeeSortOrder(workplaceId) {
    const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
    const { data } = await admin.from("workplace_employee_types").select("sort_order").eq("workplace_id", workplaceId).order("sort_order", {
        ascending: false
    }).limit(1).maybeSingle();
    return (data?.sort_order ?? 0) + 10;
}
async function nextWorkplaceShiftSortOrder(workplaceId) {
    const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
    const { data } = await admin.from("workplace_shift_types").select("sort_order").eq("workplace_id", workplaceId).order("sort_order", {
        ascending: false
    }).limit(1).maybeSingle();
    return (data?.sort_order ?? 0) + 10;
}
async function createWorkplaceEmployeeType(workplaceId, input) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const label = input.label.trim();
        if (!label) {
            return {
                ok: false,
                error: "Navn skal udfyldes."
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const sort_order = await nextWorkplaceEmployeeSortOrder(workplaceId);
        const { data, error } = await admin.from("workplace_employee_types").insert({
            workplace_id: workplaceId,
            template_id: null,
            label,
            sort_order
        }).select("id, template_id, label, sort_order, calendar_pattern").single();
        if (error) {
            if (isMissingSchemaError(error.message)) {
                return {
                    ok: false,
                    error: "Tabellen findes ikke. Kør supabase_workplace_extended.sql og reload schema."
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        revalidateWorkplaceDetailPages(workplaceId);
        return {
            ok: true,
            data: data
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function createWorkplaceShiftType(workplaceId, input) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const label = input.label.trim();
        if (!label) {
            return {
                ok: false,
                error: "Navn skal udfyldes."
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const sort_order = await nextWorkplaceShiftSortOrder(workplaceId);
        const { data, error } = await admin.from("workplace_shift_types").insert({
            workplace_id: workplaceId,
            template_id: null,
            label,
            sort_order
        }).select("id, template_id, label, sort_order, calendar_color").single();
        if (error) {
            if (isMissingSchemaError(error.message)) {
                return {
                    ok: false,
                    error: "Tabellen findes ikke. Kør supabase_workplace_extended.sql og reload schema."
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        revalidateWorkplaceDetailPages(workplaceId);
        return {
            ok: true,
            data: data
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function updateWorkplace(id, patch) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(id);
        if (patch.employee_count_band !== undefined) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$workplace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isEmployeeCountBand"])(patch.employee_count_band)) {
                return {
                    ok: false,
                    error: "Ugyldigt interval for antal ansatte."
                };
            }
        }
        if (patch.future_planning_weeks !== undefined) {
            const w = patch.future_planning_weeks;
            if (!Number.isFinite(w) || w < 1 || w > 104) {
                return {
                    ok: false,
                    error: "Antal uger skal være mellem 1 og 104."
                };
            }
        }
        if (patch.employee_swap_permission_level !== undefined) {
            const v = Number(patch.employee_swap_permission_level);
            if (!Number.isFinite(v) || ![
                1,
                2,
                3
            ].includes(Math.trunc(v))) {
                return {
                    ok: false,
                    error: "Bytte-rettighed skal være 1, 2 eller 3."
                };
            }
        }
        if (patch.subscription_tier !== undefined && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$subscriptions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSubscriptionTier"])(patch.subscription_tier)) {
            return {
                ok: false,
                error: "Ugyldigt abonnement-tier."
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const row = {
            ...patch
        };
        if (patch.country_code !== undefined && patch.country_code !== null) {
            row.country_code = String(patch.country_code).trim().toUpperCase() || null;
        }
        if (patch.language !== undefined) {
            const lang = String(patch.language ?? "").trim().toLowerCase();
            if (!/^[a-z]{2}$/.test(lang)) {
                return {
                    ok: false,
                    error: "Sprog skal være ISO 639-1 (fx da eller en)."
                };
            }
            row.language = lang;
        }
        if (patch.employee_swap_permission_level !== undefined) {
            row.employee_swap_permission_level = Math.trunc(Number(patch.employee_swap_permission_level));
        }
        const { error } = await admin.from("workplaces").update(row).eq("id", id);
        if (error) {
            return {
                ok: false,
                error: error.message
            };
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$lifecycle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateLifecycleStage"])(id, {
            source: "workplace_updated",
            context: {
                updated_fields: Object.keys(row)
            }
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/super-admin/users");
        revalidateWorkplaceDetailPages(id);
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function listEmployeeTypeTemplates(authWorkplaceId) {
    try {
        if (authWorkplaceId != null && authWorkplaceId.length > 0) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(authWorkplaceId);
        } else {
            await requireSuperAdmin();
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data, error } = await admin.from("employee_type_templates").select("id, name, slug, sort_order, calendar_pattern").order("sort_order");
        if (error) {
            return {
                ok: false,
                error: error.message
            };
        }
        const rows = data ?? [];
        return {
            ok: true,
            data: rows.map((r)=>({
                    id: r.id,
                    name: r.name,
                    slug: r.slug,
                    sort_order: r.sort_order,
                    calendar_color: null,
                    calendar_pattern: r.calendar_pattern ?? "none"
                }))
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function listShiftTypeTemplates(authWorkplaceId) {
    try {
        if (authWorkplaceId != null && authWorkplaceId.length > 0) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(authWorkplaceId);
        } else {
            await requireSuperAdmin();
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data, error } = await admin.from("shift_type_templates").select("id, name, slug, import_code, sort_order, calendar_color").order("sort_order");
        if (error) {
            return {
                ok: false,
                error: error.message
            };
        }
        const rows = data ?? [];
        return {
            ok: true,
            data: rows.map((r)=>({
                    id: r.id,
                    name: r.name,
                    slug: r.slug,
                    import_code: r.import_code ?? null,
                    sort_order: r.sort_order,
                    calendar_color: r.calendar_color ?? "#94a3b8",
                    calendar_pattern: null
                }))
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
function slugifyTemplateLabel(name) {
    const s = name.trim().toLowerCase().replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").replace(/_+/g, "_");
    return s || "type";
}
function isValidTemplateSlug(slug) {
    return /^[a-z0-9_]+$/.test(slug) && slug.length >= 1 && slug.length <= 80;
}
async function nextEmployeeTemplateSortOrder(admin) {
    const { data } = await admin.from("employee_type_templates").select("sort_order").order("sort_order", {
        ascending: false
    }).limit(1).maybeSingle();
    return (data?.sort_order ?? 0) + 10;
}
async function nextShiftTemplateSortOrder(admin) {
    const { data } = await admin.from("shift_type_templates").select("sort_order").order("sort_order", {
        ascending: false
    }).limit(1).maybeSingle();
    return (data?.sort_order ?? 0) + 10;
}
async function createEmployeeTypeTemplate(input) {
    try {
        await requireSuperAdmin();
        const name = input.name.trim();
        if (!name) {
            return {
                ok: false,
                error: "Navn skal udfyldes."
            };
        }
        const slug = (input.slug?.trim() || slugifyTemplateLabel(name)).toLowerCase();
        if (!isValidTemplateSlug(slug)) {
            return {
                ok: false,
                error: "Slug må kun indeholde små bogstaver, tal og _ (fx dag_aften)."
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const sort_order = input.sort_order !== undefined ? input.sort_order : await nextEmployeeTemplateSortOrder(admin);
        const calendar_pattern = input.calendar_pattern?.trim() || "none";
        const { data, error } = await admin.from("employee_type_templates").insert({
            name,
            slug,
            sort_order,
            calendar_pattern
        }).select("id, name, slug, sort_order, calendar_pattern").single();
        if (error) {
            if (error.code === "23505") {
                return {
                    ok: false,
                    error: "Slug findes allerede — vælg et andet."
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/super-admin/workplace-templates");
        const row = data;
        return {
            ok: true,
            data: {
                id: row.id,
                name: row.name,
                slug: row.slug,
                sort_order: row.sort_order,
                calendar_color: null,
                calendar_pattern: row.calendar_pattern ?? "none"
            }
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function updateEmployeeTypeTemplate(id, patch) {
    try {
        await requireSuperAdmin();
        const row = {};
        if (patch.name !== undefined) {
            const name = patch.name.trim();
            if (!name) {
                return {
                    ok: false,
                    error: "Navn kan ikke være tomt."
                };
            }
            row.name = name;
        }
        if (patch.slug !== undefined) {
            const slug = patch.slug.trim().toLowerCase();
            if (!isValidTemplateSlug(slug)) {
                return {
                    ok: false,
                    error: "Slug må kun indeholde små bogstaver, tal og _."
                };
            }
            row.slug = slug;
        }
        if (patch.sort_order !== undefined) {
            row.sort_order = patch.sort_order;
        }
        if (patch.calendar_pattern !== undefined) {
            row.calendar_pattern = patch.calendar_pattern.trim() || "none";
        }
        if (Object.keys(row).length === 0) {
            return {
                ok: true
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { error } = await admin.from("employee_type_templates").update(row).eq("id", id);
        if (error) {
            if (error.code === "23505") {
                return {
                    ok: false,
                    error: "Slug findes allerede."
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/super-admin/workplace-templates");
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function deleteEmployeeTypeTemplate(id) {
    try {
        await requireSuperAdmin();
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { error } = await admin.from("employee_type_templates").delete().eq("id", id);
        if (error) {
            return {
                ok: false,
                error: error.message
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/super-admin/workplace-templates");
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function createShiftTypeTemplate(input) {
    try {
        await requireSuperAdmin();
        const name = input.name.trim();
        if (!name) {
            return {
                ok: false,
                error: "Navn skal udfyldes."
            };
        }
        const slug = (input.slug?.trim() || slugifyTemplateLabel(name)).toLowerCase();
        if (!isValidTemplateSlug(slug)) {
            return {
                ok: false,
                error: "Slug må kun indeholde små bogstaver, tal og _ (fx dag_aften)."
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const sort_order = input.sort_order !== undefined ? input.sort_order : await nextShiftTemplateSortOrder(admin);
        const calendar_color = (input.calendar_color?.trim() || "#94a3b8").slice(0, 16);
        const inferredCode = inferShiftImportCode(input.import_code ?? slug ?? name);
        const import_code = inferredCode ? inferredCode.toUpperCase() : null;
        const { data, error } = await admin.from("shift_type_templates").insert({
            name,
            slug,
            import_code,
            sort_order,
            calendar_color
        }).select("id, name, slug, import_code, sort_order, calendar_color").single();
        if (error) {
            if (error.code === "23505") {
                return {
                    ok: false,
                    error: "Slug eller import-kode findes allerede — vælg en anden."
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/super-admin/workplace-templates");
        const row = data;
        return {
            ok: true,
            data: {
                id: row.id,
                name: row.name,
                slug: row.slug,
                import_code: row.import_code ?? null,
                sort_order: row.sort_order,
                calendar_color: row.calendar_color ?? "#94a3b8",
                calendar_pattern: null
            }
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function updateShiftTypeTemplate(id, patch) {
    try {
        await requireSuperAdmin();
        const row = {};
        if (patch.name !== undefined) {
            const name = patch.name.trim();
            if (!name) {
                return {
                    ok: false,
                    error: "Navn kan ikke være tomt."
                };
            }
            row.name = name;
        }
        if (patch.slug !== undefined) {
            const slug = patch.slug.trim().toLowerCase();
            if (!isValidTemplateSlug(slug)) {
                return {
                    ok: false,
                    error: "Slug må kun indeholde små bogstaver, tal og _."
                };
            }
            row.slug = slug;
        }
        if (patch.sort_order !== undefined) {
            row.sort_order = patch.sort_order;
        }
        if (patch.calendar_color !== undefined) {
            row.calendar_color = patch.calendar_color.trim().slice(0, 16) || "#94a3b8";
        }
        if (Object.keys(row).length === 0) {
            return {
                ok: true
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { error } = await admin.from("shift_type_templates").update(row).eq("id", id);
        if (error) {
            if (error.code === "23505") {
                return {
                    ok: false,
                    error: "Slug findes allerede."
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/super-admin/workplace-templates");
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function deleteShiftTypeTemplate(id) {
    try {
        await requireSuperAdmin();
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { error } = await admin.from("shift_type_templates").delete().eq("id", id);
        if (error) {
            return {
                ok: false,
                error: error.message
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/super-admin/workplace-templates");
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function listWorkplaceApiKeys(workplaceId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data, error } = await admin.from("workplace_api_keys").select("id, key_prefix, label, created_at, revoked_at").eq("workplace_id", workplaceId).order("created_at", {
            ascending: false
        });
        if (error) {
            if (isMissingSchemaError(error.message)) {
                return {
                    ok: true,
                    data: []
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        return {
            ok: true,
            data: data ?? []
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function generateWorkplaceApiKey(workplaceId, label) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const trimmed = label.trim() || "API";
        const raw = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString("hex");
        const secret = `sb_live_${raw}`;
        const prefix = secret.slice(0, 16);
        const keyHash = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(secret).digest("hex");
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { error } = await admin.from("workplace_api_keys").insert({
            workplace_id: workplaceId,
            key_prefix: prefix,
            key_hash: keyHash,
            label: trimmed
        });
        if (error) {
            if (isMissingSchemaError(error.message)) {
                return {
                    ok: false,
                    error: "API-nøgle-tabellen findes ikke. Kør supabase_workplace_extended.sql og Reload schema under API-indstillinger."
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        revalidateWorkplaceDetailPages(workplaceId);
        return {
            ok: true,
            secret,
            prefix
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function getWorkplaceDepartmentsOverview(workplaceId, options) {
    const startedAtMs = Date.now();
    try {
        const access = options?.access ?? "admin_console";
        if (access === "admin_console") {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        } else {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceMember"])(workplaceId);
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const [dRes, mRes, dmRes, pRes, eTypesRes, sTypesRes, wpRes] = await Promise.all([
            admin.from("workplace_departments").select("id, workplace_id, name, created_at").eq("workplace_id", workplaceId).order("name"),
            admin.from("workplace_members").select("id, user_id, role, employee_type_id").eq("workplace_id", workplaceId).order("role"),
            admin.from("workplace_department_members").select("user_id, department_id").eq("workplace_id", workplaceId),
            admin.from("workplace_member_calendar_profiles").select("user_id, display_name_override").eq("workplace_id", workplaceId),
            admin.from("workplace_employee_types").select("id, template_id, label, sort_order, calendar_pattern").eq("workplace_id", workplaceId).order("sort_order"),
            admin.from("workplace_shift_types").select("id, template_id, label, sort_order, calendar_color").eq("workplace_id", workplaceId).order("sort_order"),
            admin.from("workplaces").select("country_code").eq("id", workplaceId).maybeSingle()
        ]);
        if (dRes.error) {
            if (isMissingSchemaError(dRes.error.message)) {
                return {
                    ok: true,
                    departments: [],
                    members: [],
                    shiftTypes: [],
                    employeeTypes: [],
                    country_code: null,
                    public_holidays: []
                };
            }
            return {
                ok: false,
                error: dRes.error.message
            };
        }
        let memberRows = mRes.data ?? [];
        if (mRes.error) {
            const retry = await admin.from("workplace_members").select("id, user_id, role").eq("workplace_id", workplaceId).order("role");
            if (retry.error) {
                return {
                    ok: false,
                    error: mRes.error.message
                };
            }
            memberRows = retry.data ?? [];
        }
        if (dmRes.error) {
            if (isMissingSchemaError(dmRes.error.message)) {
                return {
                    ok: true,
                    departments: dRes.data ?? [],
                    members: [],
                    shiftTypes: [],
                    employeeTypes: [],
                    country_code: null,
                    public_holidays: []
                };
            }
            return {
                ok: false,
                error: dmRes.error.message
            };
        }
        let shiftTypes = [];
        let employeeTypes = [];
        if (eTypesRes.error) {
            if (!isMissingSchemaError(eTypesRes.error.message)) {
                return {
                    ok: false,
                    error: eTypesRes.error.message
                };
            }
        } else {
            employeeTypes = eTypesRes.data ?? [];
        }
        if (sTypesRes.error) {
            if (!isMissingSchemaError(sTypesRes.error.message)) {
                return {
                    ok: false,
                    error: sTypesRes.error.message
                };
            }
        } else {
            shiftTypes = sTypesRes.data ?? [];
        }
        const [employeeTemplateRes, shiftTemplateRes] = await Promise.all([
            admin.from("employee_type_templates").select("id, name, calendar_pattern"),
            admin.from("shift_type_templates").select("id, name, slug, import_code, calendar_color")
        ]);
        const employeeTemplateById = new Map();
        const employeeTemplateByName = new Map();
        if (!employeeTemplateRes.error) {
            for (const row of employeeTemplateRes.data ?? []){
                const id = String(row.id ?? "");
                const name = String(row.name ?? "").trim();
                if (!name) continue;
                const normalized = normalizeTemplateMatchKey(name);
                const template = {
                    name,
                    pattern: row.calendar_pattern ?? "none"
                };
                if (id) employeeTemplateById.set(id, template);
                if (normalized && !employeeTemplateByName.has(normalized)) {
                    employeeTemplateByName.set(normalized, template);
                }
            }
        }
        const shiftTemplateById = new Map();
        const shiftTemplateByName = new Map();
        const shiftTemplateByImportCode = new Map();
        if (!shiftTemplateRes.error) {
            for (const row of shiftTemplateRes.data ?? []){
                const id = String(row.id ?? "");
                const name = String(row.name ?? "").trim();
                if (!name) continue;
                const normalized = normalizeTemplateMatchKey(name);
                const slug = String(row.slug ?? "").trim();
                const import_code = row.import_code ?? inferShiftImportCode(slug) ?? inferShiftImportCode(name);
                const template = {
                    name,
                    color: row.calendar_color ?? "#94a3b8",
                    import_code
                };
                if (id) shiftTemplateById.set(id, template);
                if (normalized && !shiftTemplateByName.has(normalized)) {
                    shiftTemplateByName.set(normalized, template);
                }
                if (import_code && !shiftTemplateByImportCode.has(import_code)) {
                    shiftTemplateByImportCode.set(import_code, template);
                }
            }
        }
        employeeTypes = employeeTypes.map((row)=>{
            const key = normalizeTemplateMatchKey(row.label);
            const legacy = LEGACY_EMPLOYEE_LABEL_TO_STANDARD.get(key);
            const byTemplateId = row.template_id ? employeeTemplateById.get(row.template_id) : undefined;
            const byTemplateName = employeeTemplateByName.get(legacy ? normalizeTemplateMatchKey(legacy) : key);
            return {
                ...row,
                label: byTemplateId?.name ?? byTemplateName?.name ?? legacy ?? row.label,
                calendar_pattern: byTemplateId?.pattern ?? byTemplateName?.pattern ?? row.calendar_pattern ?? "none"
            };
        });
        shiftTypes = shiftTypes.map((row)=>{
            const key = normalizeTemplateMatchKey(row.label);
            const legacy = LEGACY_SHIFT_LABEL_TO_STANDARD.get(key);
            const byTemplateId = row.template_id ? shiftTemplateById.get(row.template_id) : undefined;
            const importCode = byTemplateId?.import_code ?? inferShiftImportCode(legacy ?? row.label);
            const byTemplateCode = importCode ? shiftTemplateByImportCode.get(importCode) : undefined;
            const byTemplateName = shiftTemplateByName.get(legacy ? normalizeTemplateMatchKey(legacy) : key);
            const canonicalByCode = importCode ? SHIFT_IMPORT_CODE_TO_STANDARD_LABEL.get(importCode) : undefined;
            return {
                ...row,
                import_code: importCode ?? null,
                label: byTemplateId?.name ?? byTemplateCode?.name ?? byTemplateName?.name ?? canonicalByCode ?? legacy ?? row.label,
                calendar_color: byTemplateId?.color ?? byTemplateCode?.color ?? byTemplateName?.color ?? row.calendar_color ?? "#94a3b8"
            };
        });
        if (pRes.error && !isMissingSchemaError(pRes.error.message)) {
            return {
                ok: false,
                error: pRes.error.message
            };
        }
        if (wpRes.error && !isMissingSchemaError(wpRes.error.message)) {
            return {
                ok: false,
                error: wpRes.error.message
            };
        }
        const overrideByUser = new Map();
        if (!pRes.error) {
            for (const row of pRes.data ?? []){
                overrideByUser.set(row.user_id, row.display_name_override ?? null);
            }
        }
        const deptByUser = new Map();
        for (const row of dmRes.data ?? []){
            const uid = row.user_id;
            const did = row.department_id;
            const arr = deptByUser.get(uid) ?? [];
            arr.push(did);
            deptByUser.set(uid, arr);
        }
        const usersById = new Map();
        await Promise.all(memberRows.map(async (m)=>{
            const uid = m.user_id;
            const { data: u } = await admin.auth.admin.getUserById(uid);
            usersById.set(uid, {
                email: u.user?.email ?? null,
                userMetadata: u.user?.user_metadata
            });
        }));
        let members = [];
        for (const m of memberRows){
            const uid = m.user_id;
            const userData = usersById.get(uid);
            const email = userData?.email ?? null;
            const oauthName = oauthDisplayNameFromUserMetadata(userData?.userMetadata);
            const override = overrideByUser.get(uid);
            const resolved = resolveMemberDisplayName(oauthName, override, email, uid);
            const empTypeRaw = m.employee_type_id;
            members.push({
                workplace_member_id: m.id,
                user_id: uid,
                email,
                role: m.role,
                department_ids: deptByUser.get(uid) ?? [],
                employee_type_id: empTypeRaw === undefined || empTypeRaw === null ? null : String(empTypeRaw),
                display_name: resolved.display_name,
                oauth_display_name: resolved.oauth_display_name,
                display_name_override: resolved.display_name_override
            });
        }
        if (access === "calendar_member") {
            const adminCalendar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isWorkplaceCalendarAdminView"])(workplaceId);
            if (!adminCalendar) {
                members = members.map((row)=>({
                        ...row,
                        email: null
                    }));
            }
        }
        let country_code = null;
        if (!wpRes.error && wpRes.data) {
            const raw = wpRes.data.country_code;
            const cc = typeof raw === "string" ? raw.trim().toUpperCase() : "";
            country_code = cc.length === 2 ? cc : null;
        }
        let public_holidays = [];
        if (country_code) {
            const hRes = await admin.from("country_public_holidays").select("holiday_rule, month, day, easter_offset_days, display_name, sort_order").eq("country_code", country_code).order("sort_order", {
                ascending: true
            });
            if (hRes.error) {
                if (!isMissingSchemaError(hRes.error.message)) {
                    return {
                        ok: false,
                        error: hRes.error.message
                    };
                }
            } else {
                public_holidays = (hRes.data ?? []).map((row)=>({
                        holiday_rule: row.holiday_rule,
                        month: row.month == null ? null : Number(row.month),
                        day: row.day == null ? null : Number(row.day),
                        easter_offset_days: row.easter_offset_days == null ? null : Number(row.easter_offset_days),
                        display_name: String(row.display_name ?? "")
                    }));
            }
        }
        if (public_holidays.length === 0 && country_code) {
            public_holidays = fallbackHolidayDefsForCountry(country_code);
        }
        return {
            ok: true,
            departments: dRes.data ?? [],
            members,
            shiftTypes,
            employeeTypes,
            country_code,
            public_holidays
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    } finally{
        if ("TURBOPACK compile-time truthy", 1) {
            const elapsedMs = Date.now() - startedAtMs;
            console.info(`[calendar-server] getWorkplaceDepartmentsOverview wp=${workplaceId} ms=${elapsedMs}`);
        }
    }
}
async function createWorkplaceDepartment(workplaceId, input) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const name = input.name.trim();
        if (!name) {
            return {
                ok: false,
                error: "Navn skal udfyldes."
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data, error } = await admin.from("workplace_departments").insert({
            workplace_id: workplaceId,
            name
        }).select("id, workplace_id, name, created_at").single();
        if (error) {
            if (isMissingSchemaError(error.message)) {
                return {
                    ok: false,
                    error: "Tabellen findes ikke. Kør supabase_departments_setup.sql og reload schema."
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        revalidateWorkplaceDetailPages(workplaceId);
        return {
            ok: true,
            data: data
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function deleteWorkplaceDepartment(workplaceId, departmentId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { error } = await admin.from("workplace_departments").delete().eq("id", departmentId).eq("workplace_id", workplaceId);
        if (error) {
            if (isMissingSchemaError(error.message)) {
                return {
                    ok: false,
                    error: "Tabellen findes ikke. Kør supabase_departments_setup.sql og reload schema."
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        revalidateWorkplaceDetailPages(workplaceId);
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function saveWorkplaceDepartmentMemberships(workplaceId, assignments) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const allDeptIds = assignments.flatMap((a)=>a.departmentIds);
        const deptCheck = await assertDepartmentIdsBelongToWorkplace(admin, workplaceId, allDeptIds);
        if (!deptCheck.ok) {
            return deptCheck;
        }
        const userIds = [
            ...new Set(assignments.map((a)=>a.userId))
        ];
        const { data: wmRows, error: wmErr } = await admin.from("workplace_members").select("user_id").eq("workplace_id", workplaceId).in("user_id", userIds);
        if (wmErr) {
            return {
                ok: false,
                error: wmErr.message
            };
        }
        const allowedUsers = new Set((wmRows ?? []).map((r)=>r.user_id));
        for (const uid of userIds){
            if (!allowedUsers.has(uid)) {
                return {
                    ok: false,
                    error: "Én eller flere brugere er ikke medlem af denne arbejdsplads."
                };
            }
        }
        for (const { userId, departmentIds } of assignments){
            const desired = new Set(departmentIds);
            const { data: current, error: cErr } = await admin.from("workplace_department_members").select("department_id").eq("workplace_id", workplaceId).eq("user_id", userId);
            if (cErr) {
                if (isMissingSchemaError(cErr.message)) {
                    return {
                        ok: false,
                        error: "Kør supabase_departments_setup.sql (workplace_department_members) og reload schema."
                    };
                }
                return {
                    ok: false,
                    error: cErr.message
                };
            }
            const currentIds = new Set((current ?? []).map((r)=>r.department_id));
            const toRemove = [
                ...currentIds
            ].filter((id)=>!desired.has(id));
            const toAdd = [
                ...desired
            ].filter((id)=>!currentIds.has(id));
            if (toRemove.length > 0) {
                const { error: delErr } = await admin.from("workplace_department_members").delete().eq("workplace_id", workplaceId).eq("user_id", userId).in("department_id", toRemove);
                if (delErr) {
                    return {
                        ok: false,
                        error: delErr.message
                    };
                }
            }
            if (toAdd.length > 0) {
                const rows = toAdd.map((department_id)=>({
                        workplace_id: workplaceId,
                        user_id: userId,
                        department_id
                    }));
                const { error: insErr } = await admin.from("workplace_department_members").insert(rows);
                if (insErr) {
                    return {
                        ok: false,
                        error: insErr.message
                    };
                }
            }
        }
        revalidateWorkplaceDetailPages(workplaceId);
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function revokeWorkplaceApiKey(keyId, workplaceId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { error } = await admin.from("workplace_api_keys").update({
            revoked_at: new Date().toISOString()
        }).eq("id", keyId).eq("workplace_id", workplaceId);
        if (error) {
            return {
                ok: false,
                error: error.message
            };
        }
        revalidateWorkplaceDetailPages(workplaceId);
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function importWorkplaceMembersFromCsv(workplaceId, csvText) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const raw = csvText.trim();
        if (!raw) {
            return {
                ok: false,
                error: "Indsæt CSV-indhold først."
            };
        }
        const lines = raw.split(/\r?\n/).map((line)=>line.trim()).filter(Boolean);
        if (lines.length < 2) {
            return {
                ok: false,
                error: "CSV skal indeholde header + mindst én data-række."
            };
        }
        const header = parseSemicolonCsvLine(lines[0]).map((x)=>x.toLowerCase());
        const expectedHeader = [
            "first_name",
            "last_name",
            "email",
            "mobile_phone",
            "street_name",
            "street_number",
            "postal_code",
            "city",
            "country",
            "employee_type",
            "note"
        ];
        const badHeader = header.length !== expectedHeader.length || expectedHeader.some((h, i)=>header[i] !== h);
        if (badHeader) {
            return {
                ok: false,
                error: `Forkert format. Brug header: ${expectedHeader.join(";")}`
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const [employeeTypeRes, membershipRes, authByEmail] = await Promise.all([
            admin.from("workplace_employee_types").select("id, label").eq("workplace_id", workplaceId),
            admin.from("workplace_members").select("user_id").eq("workplace_id", workplaceId),
            listAuthUsersByEmailLower(admin)
        ]);
        if (employeeTypeRes.error) {
            return {
                ok: false,
                error: employeeTypeRes.error.message
            };
        }
        if (membershipRes.error) {
            return {
                ok: false,
                error: membershipRes.error.message
            };
        }
        const employeeTypeByLabel = new Map();
        for (const row of employeeTypeRes.data ?? []){
            const key = normalizeTemplateMatchKey(row.label);
            employeeTypeByLabel.set(key, row.id);
        }
        const memberUserIds = new Set((membershipRes.data ?? []).map((x)=>x.user_id));
        const seenEmails = new Set();
        const results = [];
        let createdInvited = 0;
        let addedExisting = 0;
        let alreadyMember = 0;
        let errors = 0;
        let successfulInviteCount = 0;
        for(let idx = 1; idx < lines.length; idx += 1){
            const lineNo = idx + 1;
            const cells = parseSemicolonCsvLine(lines[idx]);
            const email = (cells[2] ?? "").trim().toLowerCase();
            if (cells.length !== expectedHeader.length) {
                results.push({
                    line: lineNo,
                    email,
                    status: "error",
                    message: "Forkert antal felter på linjen.",
                    activationLink: null
                });
                errors += 1;
                continue;
            }
            const firstName = cells[0]?.trim() ?? "";
            const lastName = cells[1]?.trim() ?? "";
            const mobilePhone = cells[3]?.trim() ?? "";
            const streetName = cells[4]?.trim() ?? "";
            const streetNumber = cells[5]?.trim() ?? "";
            const postalCode = cells[6]?.trim() ?? "";
            const city = cells[7]?.trim() ?? "";
            const country = cells[8]?.trim() ?? "";
            const employeeTypeLabel = cells[9]?.trim() ?? "";
            const note = cells[10]?.trim() || null;
            if (!firstName || !lastName || !email || !mobilePhone || !streetName || !streetNumber || !postalCode || !city || !country || !employeeTypeLabel) {
                results.push({
                    line: lineNo,
                    email,
                    status: "error",
                    message: "Obligatoriske felter mangler.",
                    activationLink: null
                });
                errors += 1;
                continue;
            }
            if (seenEmails.has(email)) {
                results.push({
                    line: lineNo,
                    email,
                    status: "error",
                    message: "E-mail optræder flere gange i samme import.",
                    activationLink: null
                });
                errors += 1;
                continue;
            }
            seenEmails.add(email);
            const employeeTypeId = employeeTypeByLabel.get(normalizeTemplateMatchKey(employeeTypeLabel));
            if (!employeeTypeId) {
                results.push({
                    line: lineNo,
                    email,
                    status: "error",
                    message: `Ukendt medarbejdertype: ${employeeTypeLabel}`,
                    activationLink: null
                });
                errors += 1;
                continue;
            }
            let userId = authByEmail.get(email) ?? null;
            let isNewUser = false;
            if (!userId) {
                const tempPassword = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(24).toString("base64url");
                const created = await admin.auth.admin.createUser({
                    email,
                    password: tempPassword,
                    email_confirm: false,
                    user_metadata: {
                        first_name: firstName,
                        last_name: lastName,
                        full_name: `${firstName} ${lastName}`.trim()
                    }
                });
                if (created.error || !created.data.user) {
                    results.push({
                        line: lineNo,
                        email,
                        status: "error",
                        message: created.error?.message ?? "Kunne ikke oprette bruger.",
                        activationLink: null
                    });
                    errors += 1;
                    continue;
                }
                userId = created.data.user.id;
                authByEmail.set(email, userId);
                isNewUser = true;
            }
            if (memberUserIds.has(userId)) {
                results.push({
                    line: lineNo,
                    email,
                    status: "already_member",
                    message: "Brugeren er allerede medlem af arbejdspladsen.",
                    activationLink: null
                });
                alreadyMember += 1;
                continue;
            }
            const { error: memberErr } = await admin.from("workplace_members").upsert({
                workplace_id: workplaceId,
                user_id: userId,
                role: "EMPLOYEE",
                employee_type_id: employeeTypeId
            }, {
                onConflict: "user_id,workplace_id"
            });
            if (memberErr) {
                results.push({
                    line: lineNo,
                    email,
                    status: "error",
                    message: memberErr.message,
                    activationLink: null
                });
                errors += 1;
                continue;
            }
            memberUserIds.add(userId);
            const { error: profileErr } = await admin.from("user_profiles").upsert({
                user_id: userId,
                first_name: firstName,
                last_name: lastName,
                mobile_phone: mobilePhone,
                street_name: streetName,
                street_number: streetNumber,
                postal_code: postalCode,
                city,
                country,
                note,
                updated_at: new Date().toISOString()
            }, {
                onConflict: "user_id"
            });
            if (profileErr) {
                results.push({
                    line: lineNo,
                    email,
                    status: "error",
                    message: profileErr.message,
                    activationLink: null
                });
                errors += 1;
                continue;
            }
            if (isNewUser) {
                const invite = await admin.auth.admin.generateLink({
                    type: "magiclink",
                    email
                });
                const activationLink = invite.data?.properties?.action_link ?? null;
                if (invite.error || !activationLink) {
                    results.push({
                        line: lineNo,
                        email,
                        status: "error",
                        message: invite.error?.message ?? "Bruger oprettet, men invitation-link kunne ikke genereres.",
                        activationLink: null
                    });
                    errors += 1;
                    continue;
                }
                results.push({
                    line: lineNo,
                    email,
                    status: "created_invited",
                    message: "Ny medarbejder oprettet og aktiveringslink genereret.",
                    activationLink
                });
                createdInvited += 1;
                successfulInviteCount += 1;
            } else {
                results.push({
                    line: lineNo,
                    email,
                    status: "added_existing",
                    message: "Eksisterende bruger tilknyttet arbejdspladsen.",
                    activationLink: null
                });
                addedExisting += 1;
            }
        }
        if (successfulInviteCount > 0) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$lifecycle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["incrementWorkplaceActiveEmployeeInvites"])(workplaceId, successfulInviteCount, {
                source: "members_csv_import"
            });
        } else {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$lifecycle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateLifecycleStage"])(workplaceId, {
                source: "members_csv_import",
                context: {
                    successfulInviteCount: 0
                }
            });
        }
        revalidateWorkplaceDetailPages(workplaceId);
        return {
            ok: true,
            results,
            summary: {
                createdInvited,
                addedExisting,
                alreadyMember,
                errors
            }
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function registerWorkplaceImportUpload(workplaceId, input) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const fileName = input.fileName.trim();
        if (!fileName) {
            return {
                ok: false,
                error: "Filnavn mangler."
            };
        }
        const source = input.source?.trim() || "shift_schedule_upload";
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$lifecycle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["incrementWorkplaceImportedFilesCount"])(workplaceId, 1, {
            fileName,
            source
        });
        if (!res.ok) return res;
        revalidateWorkplaceDetailPages(workplaceId);
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function exportWorkplaceCsv(workplaceId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data: wp, error: wErr } = await admin.from("workplaces").select("name, company_name").eq("id", workplaceId).maybeSingle();
        if (wErr) {
            return {
                ok: false,
                error: wErr.message
            };
        }
        if (!wp) {
            return {
                ok: false,
                error: "Arbejdsplads ikke fundet."
            };
        }
        const { data: members, error: mErr } = await admin.from("workplace_members").select("user_id, role").eq("workplace_id", workplaceId);
        if (mErr) {
            return {
                ok: false,
                error: mErr.message
            };
        }
        const lines = [
            "user_id,email,role"
        ];
        for (const m of members ?? []){
            const uid = m.user_id;
            const { data: u } = await admin.auth.admin.getUserById(uid);
            const email = u.user?.email ?? "";
            lines.push(`${uid},"${String(email).replace(/"/g, '""')}",${m.role}`);
        }
        const safeName = String(wp.company_name ?? wp.name).replace(/[^\wæøåÆØÅ\- ]+/gi, "_");
        return {
            ok: true,
            csv: lines.join("\n"),
            filename: `shiftbob-${safeName}-medlemmer.csv`
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getWorkplaces,
    listEuCountriesForWorkplace,
    copyWorkplaceTemplatesFromStandards,
    createWorkplace,
    createWorkplaceLegacy,
    getWorkplaceById,
    getWorkplaceTypes,
    createWorkplaceEmployeeType,
    createWorkplaceShiftType,
    updateWorkplace,
    listEmployeeTypeTemplates,
    listShiftTypeTemplates,
    createEmployeeTypeTemplate,
    updateEmployeeTypeTemplate,
    deleteEmployeeTypeTemplate,
    createShiftTypeTemplate,
    updateShiftTypeTemplate,
    deleteShiftTypeTemplate,
    listWorkplaceApiKeys,
    generateWorkplaceApiKey,
    getWorkplaceDepartmentsOverview,
    createWorkplaceDepartment,
    deleteWorkplaceDepartment,
    saveWorkplaceDepartmentMemberships,
    revokeWorkplaceApiKey,
    importWorkplaceMembersFromCsv,
    registerWorkplaceImportUpload,
    exportWorkplaceCsv
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkplaces, "001a343955998fab1566a737e9a80dd3f7a04883ac", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listEuCountriesForWorkplace, "409d40d4c9e5171aa8f4cd4b34f29bb76ffbb6d088", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(copyWorkplaceTemplatesFromStandards, "4088bec09bfeaab68a8d7d8b96a3ce0bcd05c7234c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createWorkplace, "405584b5b956900dcea57e862bf8c0d1f30748f610", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createWorkplaceLegacy, "40ef1c0b01fab1f0416afe02837b7a410958e48107", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkplaceById, "4097036f0e59aec84357e924d87bd58f69de126491", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkplaceTypes, "401c7d7dedb936715b4809394f214f715255e98962", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createWorkplaceEmployeeType, "602dab343e190bf3f645a3238a81e825b66e2b7d64", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createWorkplaceShiftType, "60125dff8ce82f2d68a31a95364d935c9aedccf43e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateWorkplace, "60354e8506f41b7d6f61a0a265f5541909b514c912", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listEmployeeTypeTemplates, "408408ad6ff6c256b8db582905f9e1452a1fa028da", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listShiftTypeTemplates, "4081521e0bfa388bf7a7929f4f2a842eab2dafc240", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createEmployeeTypeTemplate, "406fbd9aa1d285b94472b18cf4a8fca836fff886aa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateEmployeeTypeTemplate, "60505118d199d20c1ace7c160e0ae7d58fea467f9b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteEmployeeTypeTemplate, "406d0f16e62da4fb8cc47dd7c46b3ba8ad86af6195", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createShiftTypeTemplate, "40f1c7b8028aa137282da3b9e76520d4d5b7ea6363", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateShiftTypeTemplate, "60867009d54b73dd5400ed4e2d6b333ac9b15eb9b9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteShiftTypeTemplate, "403c25bb288df6145565a07ef821a88f917fd8aa37", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listWorkplaceApiKeys, "40c53e89d9d480416ba6f89b020f40cc7573f76181", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(generateWorkplaceApiKey, "60ee8d875180a268c31e6c884cc538d0c6b03ed7d3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkplaceDepartmentsOverview, "603eaf18b83e2c3f89decbaed94cc37f20965ac7db", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createWorkplaceDepartment, "60e4e4a6c2350ba5eeabef29cca8fc80773e95725a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteWorkplaceDepartment, "606dff1ed694fdbe20b6d05870630e8ee1e66ab746", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveWorkplaceDepartmentMemberships, "60fa005521543123673f61050ebfde5ce49de26a60", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(revokeWorkplaceApiKey, "609c49c12dd94a2cc4c44d8c6b1f57edcb90be1098", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(importWorkplaceMembersFromCsv, "60370148a97e128bd87fbe4539c141ebeb200f9016", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(registerWorkplaceImportUpload, "608e44b4ed4db0e39782730959fd4e2e9d523abfb8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(exportWorkplaceCsv, "400a744797871fabd6c8784f613823629e129c71af", null);
}),
"[project]/src/app/dashboard/workplace-shifts-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4054131b572c317bcdcaf91e2dbf7085668ba9c7fa":{"name":"getCalendarViewerNameMode"},"60089aac22dcd5516cf72cfe57feb91e14b20c1ae7":{"name":"deleteWorkplaceShift"},"60e64b9a3c08dd75808add0d0cf5abd6c40b79aaff":{"name":"createWorkplaceShift"},"70bad88342a7866ea5ebcdd1c374738608ef02929e":{"name":"swapWorkplaceShifts"},"70bd646879dbd70a4cbf76c51070f6ad255f836681":{"name":"reassignWorkplaceShift"},"7894d3dd170438ab50e4224a896a6dc957129fb9e3":{"name":"updateWorkplaceShiftTiming"},"7c9e716383349ef97703adb1c22b23a486dc885972":{"name":"getWorkplaceShiftsInRange"}},"src/app/dashboard/workplace-shifts-actions.ts",""] */ __turbopack_context__.s([
    "createWorkplaceShift",
    ()=>createWorkplaceShift,
    "deleteWorkplaceShift",
    ()=>deleteWorkplaceShift,
    "getCalendarViewerNameMode",
    ()=>getCalendarViewerNameMode,
    "getWorkplaceShiftsInRange",
    ()=>getWorkplaceShiftsInRange,
    "reassignWorkplaceShift",
    ()=>reassignWorkplaceShift,
    "swapWorkplaceShifts",
    ()=>swapWorkplaceShifts,
    "updateWorkplaceShiftTiming",
    ()=>updateWorkplaceShiftTiming
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/workplace-admin-server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$lifecycle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/workplace-lifecycle.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function getCalendarViewerNameMode(workplaceId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceMember"])(workplaceId);
        const adminView = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isWorkplaceCalendarAdminView"])(workplaceId);
        return {
            ok: true,
            adminView
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
function isMissingSchemaError(message) {
    const m = message.toLowerCase();
    return m.includes("schema cache") || m.includes("could not find") || m.includes("does not exist") || m.includes("42p01") || m.includes("undefined table") || m.includes("relation") && m.includes("does not exist");
}
async function assertCalendarAdminForWorkplace(workplaceId) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceMember"])(workplaceId);
    const adminView = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isWorkplaceCalendarAdminView"])(workplaceId);
    if (!adminView) {
        throw new Error("Kun administrator/leder kan ændre vagter.");
    }
}
async function getWorkplaceShiftsInRange(workplaceId, departmentId, rangeStartIso, rangeEndIso, userId) {
    const startedAtMs = Date.now();
    let status = "ok";
    let rowCount = 0;
    let errorMessage = null;
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceMember"])(workplaceId);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        let q = admin.from("workplace_shifts").select("id, workplace_id, department_id, user_id, shift_type_id, starts_at, ends_at").eq("workplace_id", workplaceId).lt("starts_at", rangeEndIso).gt("ends_at", rangeStartIso);
        if (departmentId) {
            q = q.eq("department_id", departmentId);
        }
        if (userId) {
            q = q.eq("user_id", userId);
        }
        const { data, error } = await q.order("starts_at");
        if (error) {
            if (isMissingSchemaError(error.message)) {
                rowCount = 0;
                return {
                    ok: true,
                    shifts: []
                };
            }
            status = "error";
            errorMessage = error.message;
            return {
                ok: false,
                error: error.message
            };
        }
        rowCount = (data ?? []).length;
        return {
            ok: true,
            shifts: data ?? []
        };
    } catch (e) {
        status = "error";
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        errorMessage = msg;
        return {
            ok: false,
            error: msg
        };
    } finally{
        if ("TURBOPACK compile-time truthy", 1) {
            const elapsedMs = Date.now() - startedAtMs;
            const suffix = status === "error" ? ` error="${errorMessage ?? "unknown"}"` : "";
            console.info(`[calendar-server] getWorkplaceShiftsInRange wp=${workplaceId} dept=${departmentId ?? "all"} user=${userId ?? "all"} rows=${rowCount} status=${status} ms=${elapsedMs}${suffix}`);
        }
    }
}
async function deleteWorkplaceShift(workplaceId, shiftId) {
    try {
        await assertCalendarAdminForWorkplace(workplaceId);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { error } = await admin.from("workplace_shifts").delete().eq("id", shiftId).eq("workplace_id", workplaceId);
        if (error) return {
            ok: false,
            error: error.message
        };
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function reassignWorkplaceShift(workplaceId, shiftId, replacementUserId) {
    try {
        await assertCalendarAdminForWorkplace(workplaceId);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data: shift, error: shiftErr } = await admin.from("workplace_shifts").select("id, workplace_id, department_id").eq("id", shiftId).eq("workplace_id", workplaceId).maybeSingle();
        if (shiftErr) return {
            ok: false,
            error: shiftErr.message
        };
        if (!shift) return {
            ok: false,
            error: "Vagt ikke fundet."
        };
        const { data: member, error: memberErr } = await admin.from("workplace_members").select("user_id").eq("workplace_id", workplaceId).eq("user_id", replacementUserId).maybeSingle();
        if (memberErr) return {
            ok: false,
            error: memberErr.message
        };
        if (!member) {
            return {
                ok: false,
                error: "Erstatningsmedarbejder er ikke medlem af arbejdspladsen."
            };
        }
        const { error } = await admin.from("workplace_shifts").update({
            user_id: replacementUserId
        }).eq("id", shiftId).eq("workplace_id", workplaceId);
        if (error) return {
            ok: false,
            error: error.message
        };
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function swapWorkplaceShifts(workplaceId, sourceShiftId, targetShiftId) {
    try {
        await assertCalendarAdminForWorkplace(workplaceId);
        if (sourceShiftId === targetShiftId) {
            return {
                ok: false,
                error: "Vælg en anden vagt at bytte med."
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data, error } = await admin.from("workplace_shifts").select("id, workplace_id, user_id").eq("workplace_id", workplaceId).in("id", [
            sourceShiftId,
            targetShiftId
        ]);
        if (error) return {
            ok: false,
            error: error.message
        };
        const rows = data ?? [];
        const source = rows.find((r)=>r.id === sourceShiftId);
        const target = rows.find((r)=>r.id === targetShiftId);
        if (!source || !target) return {
            ok: false,
            error: "Kunne ikke finde begge vagter."
        };
        const { error: e1 } = await admin.from("workplace_shifts").update({
            user_id: target.user_id
        }).eq("id", sourceShiftId).eq("workplace_id", workplaceId);
        if (e1) return {
            ok: false,
            error: e1.message
        };
        const { error: e2 } = await admin.from("workplace_shifts").update({
            user_id: source.user_id
        }).eq("id", targetShiftId).eq("workplace_id", workplaceId);
        if (e2) return {
            ok: false,
            error: e2.message
        };
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function updateWorkplaceShiftTiming(workplaceId, shiftId, startsAtIso, endsAtIso) {
    try {
        await assertCalendarAdminForWorkplace(workplaceId);
        const s = new Date(startsAtIso).getTime();
        const e = new Date(endsAtIso).getTime();
        if (!Number.isFinite(s) || !Number.isFinite(e)) {
            return {
                ok: false,
                error: "Ugyldige dato/tid værdier."
            };
        }
        if (e <= s) {
            return {
                ok: false,
                error: "Sluttid skal være efter starttid."
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { error } = await admin.from("workplace_shifts").update({
            starts_at: new Date(s).toISOString(),
            ends_at: new Date(e).toISOString()
        }).eq("id", shiftId).eq("workplace_id", workplaceId);
        if (error) return {
            ok: false,
            error: error.message
        };
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function createWorkplaceShift(workplaceId, input) {
    try {
        await assertCalendarAdminForWorkplace(workplaceId);
        const s = new Date(input.startsAtIso).getTime();
        const e = new Date(input.endsAtIso).getTime();
        if (!Number.isFinite(s) || !Number.isFinite(e)) {
            return {
                ok: false,
                error: "Ugyldige dato/tid værdier."
            };
        }
        if (e <= s) {
            return {
                ok: false,
                error: "Sluttid skal være efter starttid."
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data: member, error: memberErr } = await admin.from("workplace_members").select("user_id").eq("workplace_id", workplaceId).eq("user_id", input.userId).maybeSingle();
        if (memberErr) return {
            ok: false,
            error: memberErr.message
        };
        if (!member) {
            return {
                ok: false,
                error: "Medarbejderen er ikke medlem af arbejdspladsen."
            };
        }
        const { data, error } = await admin.from("workplace_shifts").insert({
            workplace_id: workplaceId,
            department_id: input.departmentId,
            user_id: input.userId,
            shift_type_id: input.shiftTypeId,
            starts_at: new Date(s).toISOString(),
            ends_at: new Date(e).toISOString()
        }).select("id, workplace_id, department_id, user_id, shift_type_id, starts_at, ends_at").single();
        if (error) return {
            ok: false,
            error: error.message
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$lifecycle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["incrementWorkplaceManualShiftsCreatedCount"])(workplaceId, 1, {
            source: "calendar_manual_create",
            shiftTypeId: input.shiftTypeId
        });
        return {
            ok: true,
            shift: data
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getCalendarViewerNameMode,
    getWorkplaceShiftsInRange,
    deleteWorkplaceShift,
    reassignWorkplaceShift,
    swapWorkplaceShifts,
    updateWorkplaceShiftTiming,
    createWorkplaceShift
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCalendarViewerNameMode, "4054131b572c317bcdcaf91e2dbf7085668ba9c7fa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkplaceShiftsInRange, "7c9e716383349ef97703adb1c22b23a486dc885972", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteWorkplaceShift, "60089aac22dcd5516cf72cfe57feb91e14b20c1ae7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(reassignWorkplaceShift, "70bd646879dbd70a4cbf76c51070f6ad255f836681", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(swapWorkplaceShifts, "70bad88342a7866ea5ebcdd1c374738608ef02929e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateWorkplaceShiftTiming, "7894d3dd170438ab50e4224a896a6dc957129fb9e3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createWorkplaceShift, "60e64b9a3c08dd75808add0d0cf5abd6c40b79aaff", null);
}),
"[project]/src/app/dashboard/workplace-member-calendar-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60012e1d9e704a36a229d9d6f0720b8fee7709a2fc":{"name":"createWorkplaceMemberWithProfile"},"6008cd23a5aceac261034fd4dde27ac68cfb4194a2":{"name":"getWorkplaceMemberPreferences"},"6055ad1197a06e0ad44b383394f363e108e1580cd1":{"name":"getWorkplaceMemberProfileDetails"},"60bd57ea04cceb2b3e887a2137f032fba556f7ffd0":{"name":"getWorkplaceMemberCvSignedUrl"},"7079bf300e55699172b61a4d62a1de0c91e12f12da":{"name":"saveWorkplaceMemberPreferences"},"707d56f2e308f0705ec21f11ce49379a1fd73689c7":{"name":"uploadWorkplaceMemberCv"},"7091b172b1bf224c01234b05e8e74bed124443ba15":{"name":"updateWorkplaceMemberCalendarProfile"},"70d77257cf7d1f8d421f779e1fadb8a317262e63a4":{"name":"updateWorkplaceMemberWithProfile"}},"src/app/dashboard/workplace-member-calendar-actions.ts",""] */ __turbopack_context__.s([
    "createWorkplaceMemberWithProfile",
    ()=>createWorkplaceMemberWithProfile,
    "getWorkplaceMemberCvSignedUrl",
    ()=>getWorkplaceMemberCvSignedUrl,
    "getWorkplaceMemberPreferences",
    ()=>getWorkplaceMemberPreferences,
    "getWorkplaceMemberProfileDetails",
    ()=>getWorkplaceMemberProfileDetails,
    "saveWorkplaceMemberPreferences",
    ()=>saveWorkplaceMemberPreferences,
    "updateWorkplaceMemberCalendarProfile",
    ()=>updateWorkplaceMemberCalendarProfile,
    "updateWorkplaceMemberWithProfile",
    ()=>updateWorkplaceMemberWithProfile,
    "uploadWorkplaceMemberCv",
    ()=>uploadWorkplaceMemberCv
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/workplace-admin-server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
function isMissingSchemaError(message) {
    const m = message.toLowerCase();
    return m.includes("schema cache") || m.includes("could not find") || m.includes("does not exist") || m.includes("42p01") || m.includes("undefined table") || m.includes("relation") && m.includes("does not exist");
}
const CV_BUCKET = "user-cvs";
const CV_MAX_BYTES = 10 * 1024 * 1024;
const CV_MIME = new Set([
    "application/pdf"
]);
function sanitizeFilename(name) {
    const base = name.replace(/^.*[/\\]/, "").trim() || "cv.pdf";
    return base.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120);
}
function inferCvContentType(file) {
    const t = file.type;
    if (t && CV_MIME.has(t)) return t;
    const n = file.name.toLowerCase();
    if (n.endsWith(".pdf")) return "application/pdf";
    return null;
}
function normalizeRequired(value, label) {
    const v = value.trim();
    if (!v) {
        return {
            ok: false,
            error: `${label} er obligatorisk.`
        };
    }
    return {
        ok: true,
        value: v
    };
}
async function assertEmployeeTypeBelongsToWorkplace(workplaceId, employeeTypeId) {
    const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
    const { data, error } = await admin.from("workplace_employee_types").select("id").eq("workplace_id", workplaceId).eq("id", employeeTypeId).maybeSingle();
    if (error) return error.message;
    if (!data) return "Ugyldig medarbejdertype for arbejdspladsen.";
    return null;
}
async function assertMemberInWorkplace(workplaceId, userId) {
    const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
    const { data, error } = await admin.from("workplace_members").select("user_id").eq("workplace_id", workplaceId).eq("user_id", userId).maybeSingle();
    if (error) return error.message;
    if (!data) return "Medarbejderen findes ikke på arbejdspladsen.";
    return null;
}
function validateProfileInput(input) {
    const firstName = normalizeRequired(input.firstName, "Fornavn");
    if (!firstName.ok) return firstName;
    const lastName = normalizeRequired(input.lastName, "Efternavn");
    if (!lastName.ok) return lastName;
    const email = normalizeRequired(input.email, "E-mail");
    if (!email.ok) return email;
    const mobilePhone = normalizeRequired(input.mobilePhone, "Mobilnummer");
    if (!mobilePhone.ok) return mobilePhone;
    const streetName = normalizeRequired(input.streetName, "Vejnavn");
    if (!streetName.ok) return streetName;
    const streetNumber = normalizeRequired(input.streetNumber, "Vej nr.");
    if (!streetNumber.ok) return streetNumber;
    const postalCode = normalizeRequired(input.postalCode, "Postnummer");
    if (!postalCode.ok) return postalCode;
    const city = normalizeRequired(input.city, "By");
    if (!city.ok) return city;
    const country = normalizeRequired(input.country, "Land");
    if (!country.ok) return country;
    const employeeTypeId = normalizeRequired(input.employeeTypeId, "Medarbejdertype");
    if (!employeeTypeId.ok) return employeeTypeId;
    return {
        ok: true,
        value: {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value.toLowerCase(),
            mobilePhone: mobilePhone.value,
            streetName: streetName.value,
            streetNumber: streetNumber.value,
            postalCode: postalCode.value,
            city: city.value,
            country: country.value,
            employeeTypeId: employeeTypeId.value,
            note: input.note?.trim() ? input.note.trim() : null
        }
    };
}
async function upsertUserProfileAndMembership(workplaceId, userId, profile) {
    const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
    const employeeTypeErr = await assertEmployeeTypeBelongsToWorkplace(workplaceId, profile.employeeTypeId);
    if (employeeTypeErr) return {
        ok: false,
        error: employeeTypeErr
    };
    const { error: profileErr } = await admin.from("user_profiles").upsert({
        user_id: userId,
        first_name: profile.firstName,
        last_name: profile.lastName,
        street_name: profile.streetName,
        street_number: profile.streetNumber,
        postal_code: profile.postalCode,
        city: profile.city,
        country: profile.country,
        mobile_phone: profile.mobilePhone,
        note: profile.note,
        updated_at: new Date().toISOString()
    }, {
        onConflict: "user_id"
    });
    if (profileErr) {
        if (isMissingSchemaError(profileErr.message)) {
            return {
                ok: false,
                error: "Tabellen user_profiles findes ikke. Kør supabase_user_profiles.sql i Supabase."
            };
        }
        return {
            ok: false,
            error: profileErr.message
        };
    }
    const { error: memberErr } = await admin.from("workplace_members").update({
        employee_type_id: profile.employeeTypeId
    }).eq("workplace_id", workplaceId).eq("user_id", userId);
    if (memberErr) return {
        ok: false,
        error: memberErr.message
    };
    return {
        ok: true
    };
}
async function updateWorkplaceMemberCalendarProfile(workplaceId, userId, input) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const raw = input.displayNameOverride?.trim() ?? "";
        if (raw === "") {
            const { error } = await admin.from("workplace_member_calendar_profiles").delete().eq("workplace_id", workplaceId).eq("user_id", userId);
            if (error && !isMissingSchemaError(error.message)) {
                return {
                    ok: false,
                    error: error.message
                };
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/super-admin/workplaces/${workplaceId}`);
            return {
                ok: true
            };
        }
        const { error } = await admin.from("workplace_member_calendar_profiles").upsert({
            workplace_id: workplaceId,
            user_id: userId,
            display_name_override: raw,
            updated_at: new Date().toISOString()
        }, {
            onConflict: "workplace_id,user_id"
        });
        if (error) {
            if (isMissingSchemaError(error.message)) {
                return {
                    ok: false,
                    error: "Tabellen findes ikke endnu. Kør supabase_workplace_member_calendar_profiles.sql i Supabase."
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/super-admin/workplaces/${workplaceId}`);
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function getWorkplaceMemberProfileDetails(workplaceId, userId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const memberErr = await assertMemberInWorkplace(workplaceId, userId);
        if (memberErr) return {
            ok: false,
            error: memberErr
        };
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data: authRes, error: authErr } = await admin.auth.admin.getUserById(userId);
        if (authErr || !authRes?.user) {
            return {
                ok: false,
                error: authErr?.message ?? "Bruger ikke fundet."
            };
        }
        const { data: member, error: memberQueryErr } = await admin.from("workplace_members").select("employee_type_id").eq("workplace_id", workplaceId).eq("user_id", userId).maybeSingle();
        if (memberQueryErr) return {
            ok: false,
            error: memberQueryErr.message
        };
        const { data: profile, error: profileErr } = await admin.from("user_profiles").select("first_name,last_name,mobile_phone,street_name,street_number,postal_code,city,country,note,cv_storage_path").eq("user_id", userId).maybeSingle();
        if (profileErr && !isMissingSchemaError(profileErr.message)) {
            return {
                ok: false,
                error: profileErr.message
            };
        }
        const meta = authRes.user.user_metadata ?? {};
        const data = {
            userId,
            email: authRes.user.email ?? "",
            firstName: typeof profile?.first_name === "string" ? profile.first_name : "",
            lastName: typeof profile?.last_name === "string" ? profile.last_name : "",
            mobilePhone: typeof profile?.mobile_phone === "string" ? profile.mobile_phone : "",
            streetName: typeof profile?.street_name === "string" ? profile.street_name : "",
            streetNumber: typeof profile?.street_number === "string" ? profile.street_number : "",
            postalCode: typeof profile?.postal_code === "string" ? profile.postal_code : "",
            city: typeof profile?.city === "string" ? profile.city : "",
            country: typeof profile?.country === "string" ? profile.country : typeof meta.country === "string" ? meta.country : "",
            employeeTypeId: member?.employee_type_id ?? null,
            note: typeof profile?.note === "string" ? profile.note : null,
            hasCv: typeof profile?.cv_storage_path === "string" && profile.cv_storage_path.length > 0
        };
        return {
            ok: true,
            data
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function createWorkplaceMemberWithProfile(workplaceId, input) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const parsed = validateProfileInput(input);
        if (!parsed.ok) return parsed;
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const profile = parsed.value;
        const createRes = await admin.auth.admin.createUser({
            email: profile.email,
            password: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
            email_confirm: true,
            user_metadata: {
                first_name: profile.firstName,
                last_name: profile.lastName,
                full_name: `${profile.firstName} ${profile.lastName}`.trim(),
                country: profile.country
            }
        });
        if (createRes.error || !createRes.data.user) {
            return {
                ok: false,
                error: createRes.error?.message ?? "Kunne ikke oprette bruger."
            };
        }
        const userId = createRes.data.user.id;
        const { error: memberErr } = await admin.from("workplace_members").upsert({
            user_id: userId,
            workplace_id: workplaceId,
            role: "EMPLOYEE",
            employee_type_id: profile.employeeTypeId
        }, {
            onConflict: "user_id,workplace_id"
        });
        if (memberErr) {
            await admin.auth.admin.deleteUser(userId);
            return {
                ok: false,
                error: memberErr.message
            };
        }
        const profileRes = await upsertUserProfileAndMembership(workplaceId, userId, profile);
        if (!profileRes.ok) {
            await admin.from("workplace_members").delete().eq("user_id", userId).eq("workplace_id", workplaceId);
            await admin.auth.admin.deleteUser(userId);
            return profileRes;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/super-admin/workplaces/${workplaceId}`);
        return {
            ok: true,
            userId
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function updateWorkplaceMemberWithProfile(workplaceId, userId, input) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const memberErr = await assertMemberInWorkplace(workplaceId, userId);
        if (memberErr) return {
            ok: false,
            error: memberErr
        };
        const parsed = validateProfileInput(input);
        if (!parsed.ok) return parsed;
        const profile = parsed.value;
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { error: authErr } = await admin.auth.admin.updateUserById(userId, {
            email: profile.email,
            user_metadata: {
                first_name: profile.firstName,
                last_name: profile.lastName,
                full_name: `${profile.firstName} ${profile.lastName}`.trim(),
                country: profile.country
            }
        });
        if (authErr) return {
            ok: false,
            error: authErr.message
        };
        const upsertRes = await upsertUserProfileAndMembership(workplaceId, userId, profile);
        if (!upsertRes.ok) return upsertRes;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/super-admin/workplaces/${workplaceId}`);
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function uploadWorkplaceMemberCv(workplaceId, userId, formData) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const memberErr = await assertMemberInWorkplace(workplaceId, userId);
        if (memberErr) return {
            ok: false,
            error: memberErr
        };
        const file = formData.get("file");
        if (!file || !(file instanceof File)) {
            return {
                ok: false,
                error: "Vælg en PDF-fil."
            };
        }
        if (file.size > CV_MAX_BYTES) {
            return {
                ok: false,
                error: "Filen må højst være 10 MB."
            };
        }
        const contentType = inferCvContentType(file);
        if (!contentType) {
            return {
                ok: false,
                error: "Kun PDF er tilladt."
            };
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data: prev } = await admin.from("user_profiles").select("cv_storage_path").eq("user_id", userId).maybeSingle();
        const oldPath = typeof prev?.cv_storage_path === "string" ? prev.cv_storage_path : null;
        const safe = sanitizeFilename(file.name);
        const objectPath = `${userId}/${Date.now()}-${safe}`;
        const buf = Buffer.from(await file.arrayBuffer());
        const { error: upErr } = await admin.storage.from(CV_BUCKET).upload(objectPath, buf, {
            contentType,
            upsert: false
        });
        if (upErr) return {
            ok: false,
            error: upErr.message
        };
        if (oldPath) {
            await admin.storage.from(CV_BUCKET).remove([
                oldPath
            ]);
        }
        const { error: profileErr } = await admin.from("user_profiles").upsert({
            user_id: userId,
            cv_storage_path: objectPath,
            updated_at: new Date().toISOString()
        }, {
            onConflict: "user_id"
        });
        if (profileErr) {
            await admin.storage.from(CV_BUCKET).remove([
                objectPath
            ]);
            return {
                ok: false,
                error: profileErr.message
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/super-admin/workplaces/${workplaceId}`);
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function getWorkplaceMemberCvSignedUrl(workplaceId, userId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const memberErr = await assertMemberInWorkplace(workplaceId, userId);
        if (memberErr) return {
            ok: false,
            error: memberErr
        };
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data: row, error: qErr } = await admin.from("user_profiles").select("cv_storage_path").eq("user_id", userId).maybeSingle();
        if (qErr) return {
            ok: false,
            error: qErr.message
        };
        const path = typeof row?.cv_storage_path === "string" ? row.cv_storage_path : null;
        if (!path) return {
            ok: false,
            error: "Ingen CV uploadet."
        };
        const { data, error } = await admin.storage.from(CV_BUCKET).createSignedUrl(path, 3600);
        if (error || !data?.signedUrl) {
            return {
                ok: false,
                error: error?.message ?? "Kunne ikke oprette CV-link."
            };
        }
        return {
            ok: true,
            url: data.signedUrl
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function getWorkplaceMemberPreferences(workplaceId, userId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const memberErr = await assertMemberInWorkplace(workplaceId, userId);
        if (memberErr) return {
            ok: false,
            error: memberErr
        };
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { data, error } = await admin.from("workplace_member_preferences").select("id, priority, preference_text").eq("workplace_id", workplaceId).eq("user_id", userId).order("priority", {
            ascending: true
        }).order("created_at", {
            ascending: true
        });
        if (error) {
            if (isMissingSchemaError(error.message)) {
                return {
                    ok: false,
                    error: "Tabellen workplace_member_preferences findes ikke endnu. Kør SQL-patchen i Supabase."
                };
            }
            return {
                ok: false,
                error: error.message
            };
        }
        const rows = (data ?? []).map((row)=>({
                id: String(row.id),
                priority: Number(row.priority) || 0,
                preferenceText: String(row.preference_text ?? "")
            }));
        return {
            ok: true,
            rows
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function saveWorkplaceMemberPreferences(workplaceId, userId, items) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(workplaceId);
        const memberErr = await assertMemberInWorkplace(workplaceId, userId);
        if (memberErr) return {
            ok: false,
            error: memberErr
        };
        const normalized = items.map((item, idx)=>({
                priority: Number.isFinite(item.priority) ? Math.max(1, Math.floor(item.priority)) : idx + 1,
                preferenceText: item.preferenceText.trim()
            })).filter((item)=>item.preferenceText.length > 0).sort((a, b)=>a.priority - b.priority);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { error: delErr } = await admin.from("workplace_member_preferences").delete().eq("workplace_id", workplaceId).eq("user_id", userId);
        if (delErr && !isMissingSchemaError(delErr.message)) {
            return {
                ok: false,
                error: delErr.message
            };
        }
        if (normalized.length > 0) {
            const rows = normalized.map((item, idx)=>({
                    workplace_id: workplaceId,
                    user_id: userId,
                    priority: idx + 1,
                    preference_text: item.preferenceText
                }));
            const { error: insErr } = await admin.from("workplace_member_preferences").insert(rows);
            if (insErr) {
                return {
                    ok: false,
                    error: insErr.message
                };
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/super-admin/workplaces/${workplaceId}`);
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateWorkplaceMemberCalendarProfile,
    getWorkplaceMemberProfileDetails,
    createWorkplaceMemberWithProfile,
    updateWorkplaceMemberWithProfile,
    uploadWorkplaceMemberCv,
    getWorkplaceMemberCvSignedUrl,
    getWorkplaceMemberPreferences,
    saveWorkplaceMemberPreferences
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateWorkplaceMemberCalendarProfile, "7091b172b1bf224c01234b05e8e74bed124443ba15", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkplaceMemberProfileDetails, "6055ad1197a06e0ad44b383394f363e108e1580cd1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createWorkplaceMemberWithProfile, "60012e1d9e704a36a229d9d6f0720b8fee7709a2fc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateWorkplaceMemberWithProfile, "70d77257cf7d1f8d421f779e1fadb8a317262e63a4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(uploadWorkplaceMemberCv, "707d56f2e308f0705ec21f11ce49379a1fd73689c7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkplaceMemberCvSignedUrl, "60bd57ea04cceb2b3e887a2137f032fba556f7ffd0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkplaceMemberPreferences, "6008cd23a5aceac261034fd4dde27ac68cfb4194a2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveWorkplaceMemberPreferences, "7079bf300e55699172b61a4d62a1de0c91e12f12da", null);
}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/user-ui-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/super-admin/workplaces/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/app/dashboard/workplace-shifts-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/app/dashboard/workplace-member-calendar-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2d$ui$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/user-ui-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$super$2d$admin$2f$workplaces$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/super-admin/workplaces/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$shifts$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/dashboard/workplace-shifts-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$member$2d$calendar$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/dashboard/workplace-member-calendar-actions.ts [app-rsc] (ecmascript)");
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
;
;
;
;
;
}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/user-ui-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/super-admin/workplaces/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/app/dashboard/workplace-shifts-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/app/dashboard/workplace-member-calendar-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "401c7d7dedb936715b4809394f214f715255e98962",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$super$2d$admin$2f$workplaces$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkplaceTypes"],
    "40da134b10f7b4b87d5a66eca98ca4cf276edacf6e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2d$ui$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setUserLayoutTheme"],
    "60012e1d9e704a36a229d9d6f0720b8fee7709a2fc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$member$2d$calendar$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createWorkplaceMemberWithProfile"],
    "60089aac22dcd5516cf72cfe57feb91e14b20c1ae7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$shifts$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteWorkplaceShift"],
    "6008cd23a5aceac261034fd4dde27ac68cfb4194a2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$member$2d$calendar$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkplaceMemberPreferences"],
    "603eaf18b83e2c3f89decbaed94cc37f20965ac7db",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$super$2d$admin$2f$workplaces$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkplaceDepartmentsOverview"],
    "6055ad1197a06e0ad44b383394f363e108e1580cd1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$member$2d$calendar$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkplaceMemberProfileDetails"],
    "60bd57ea04cceb2b3e887a2137f032fba556f7ffd0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$member$2d$calendar$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkplaceMemberCvSignedUrl"],
    "60e64b9a3c08dd75808add0d0cf5abd6c40b79aaff",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$shifts$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createWorkplaceShift"],
    "7079bf300e55699172b61a4d62a1de0c91e12f12da",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$member$2d$calendar$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveWorkplaceMemberPreferences"],
    "707d56f2e308f0705ec21f11ce49379a1fd73689c7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$member$2d$calendar$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uploadWorkplaceMemberCv"],
    "70bad88342a7866ea5ebcdd1c374738608ef02929e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$shifts$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["swapWorkplaceShifts"],
    "70bd646879dbd70a4cbf76c51070f6ad255f836681",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$shifts$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["reassignWorkplaceShift"],
    "70d77257cf7d1f8d421f779e1fadb8a317262e63a4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$member$2d$calendar$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateWorkplaceMemberWithProfile"],
    "7894d3dd170438ab50e4224a896a6dc957129fb9e3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$shifts$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateWorkplaceShiftTiming"],
    "7c9e716383349ef97703adb1c22b23a486dc885972",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$shifts$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkplaceShiftsInRange"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$user$2d$ui$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$super$2d$admin$2f$workplaces$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$shifts$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$member$2d$calendar$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/user-ui-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/super-admin/workplaces/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/app/dashboard/workplace-shifts-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/app/dashboard/workplace-member-calendar-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$user$2d$ui$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/user-ui-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$super$2d$admin$2f$workplaces$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/super-admin/workplaces/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$shifts$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/dashboard/workplace-shifts-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$workplace$2d$member$2d$calendar$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/dashboard/workplace-member-calendar-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0tmer5q._.js.map