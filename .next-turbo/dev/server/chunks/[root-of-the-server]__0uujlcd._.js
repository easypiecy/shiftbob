module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/utils/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createServerSupabase",
    ()=>createServerSupabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
async function createServerSupabase() {
    const url = ("TURBOPACK compile-time value", "https://pwooqmqdershicxpnfuo.supabase.co");
    const anonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3b29xbXFkZXJzaGljeHBuZnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODI5MjUsImV4cCI6MjA4OTY1ODkyNX0.GoCzr9bTva2fqF0tbQbHy2F5BB9KRUajB8RzvtECAGE");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(url, anonKey, {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // Server Actions kan køre uden mulighed for at sætte cookies
                }
            }
        }
    });
}
}),
"[project]/src/utils/supabase/admin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAdminClient",
    ()=>getAdminClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
let cached = null;
function getAdminClient() {
    const url = ("TURBOPACK compile-time value", "https://pwooqmqdershicxpnfuo.supabase.co");
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
        throw new Error("Mangler NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY.");
    }
    if (!cached) {
        cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, serviceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
    }
    return cached;
}
}),
"[project]/app/api/salesbot/support-ticket/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/admin.ts [app-route] (ecmascript)");
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
function normalizeLanguageCode(languageCode) {
    return languageCode?.trim() || "en-US";
}
function isValidEmail(email) {
    return email.includes("@") && email.includes(".");
}
async function POST(req) {
    try {
        const payload = await req.json();
        const subject = payload.subject?.trim() || "";
        const message = payload.message?.trim() || "";
        const languageCode = normalizeLanguageCode(payload.languageCode);
        if (!subject || !message) {
            return Response.json({
                ok: false,
                error: "Subject and message are required."
            }, {
                status: 400
            });
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerSupabase"])();
        const { data: { user } } = await supabase.auth.getUser();
        const senderEmail = user?.email?.trim() || payload.email?.trim() || "";
        const senderName = payload.name?.trim() || "" || (user?.user_metadata?.full_name?.trim() ?? "") || (user?.user_metadata?.name?.trim() ?? "") || null;
        if (!senderEmail || !user && !senderName) {
            return Response.json({
                ok: false,
                error: "Name and email are required when not logged in.",
                requiresIdentity: true
            }, {
                status: 400
            });
        }
        if (!isValidEmail(senderEmail)) {
            return Response.json({
                ok: false,
                error: "Invalid email address."
            }, {
                status: 400
            });
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const inserted = await admin.from("support_tickets").insert({
            channel: "web",
            status: "open",
            priority: "normal",
            sender_email: senderEmail.toLowerCase(),
            sender_name: senderName,
            language_original: languageCode,
            subject_original: subject,
            body_original: message,
            subject_translated: subject,
            body_translated: message,
            labels: [
                "SalesBot"
            ]
        }).select("id").single();
        if (inserted.error) {
            return Response.json({
                ok: false,
                error: inserted.error.message
            }, {
                status: 500
            });
        }
        const ticketId = String(inserted.data.id);
        const messageInsert = await admin.from("support_ticket_messages").insert({
            ticket_id: ticketId,
            direction: "incoming",
            sender_email: senderEmail.toLowerCase(),
            language_original: languageCode,
            language_target: null,
            body_original: message,
            body_translated: message
        });
        if (messageInsert.error) {
            return Response.json({
                ok: false,
                error: messageInsert.error.message
            }, {
                status: 500
            });
        }
        return Response.json({
            ok: true,
            ticketId
        });
    } catch (e) {
        const error = e instanceof Error ? e.message : "Ukendt fejl";
        return Response.json({
            ok: false,
            error
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0uujlcd._.js.map