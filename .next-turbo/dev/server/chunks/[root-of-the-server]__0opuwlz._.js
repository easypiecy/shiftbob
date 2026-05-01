module.exports = [
"[externals]/next/dist/build/adapter/setup-node-env.external.js [external] (next/dist/build/adapter/setup-node-env.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/build/adapter/setup-node-env.external.js", () => require("next/dist/build/adapter/setup-node-env.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/memory-cache.external.js [external] (next/dist/server/lib/incremental-cache/memory-cache.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/memory-cache.external.js", () => require("next/dist/server/lib/incremental-cache/memory-cache.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/shared-cache-controls.external.js [external] (next/dist/server/lib/incremental-cache/shared-cache-controls.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js", () => require("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/edge-node-globals-polyfill.ts [middleware] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Edge Runtime har ikke `__dirname` / `__filename`. Next.js’ bundlede `cookie`
 * (via `next/server` → `NextResponse`) kan evaluere `__nccwpck_require__.ab = __dirname + "/"`,
 * hvilket giver `ReferenceError: __dirname is not defined` på Vercel.
 * Denne fil skal importeres som første sideeffekt i `src/proxy.ts` (før `next/server`).
 */ const g = globalThis;
if (typeof g.__dirname === "undefined") {
    g.__dirname = "/";
}
if (typeof g.__filename === "undefined") {
    g.__filename = "/proxy.js";
}
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/utils/supabase/update-session.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateSession",
    ()=>updateSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$utils$2f$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/utils/helpers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
;
;
function mergeCookieRequestHeader(existingHeader, updates) {
    const map = new Map((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$utils$2f$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseCookieHeader"])(existingHeader ?? "").map((c)=>[
            c.name,
            c.value
        ]));
    for (const { name, value } of updates){
        map.set(name, value);
    }
    return Array.from(map.entries()).map(([name, value])=>`${name}=${encodeURIComponent(value ?? "")}`).join("; ");
}
async function updateSession(request) {
    const url = ("TURBOPACK compile-time value", "https://pwooqmqdershicxpnfuo.supabase.co");
    const anonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3b29xbXFkZXJzaGljeHBuZnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODI5MjUsImV4cCI6MjA4OTY1ODkyNX0.GoCzr9bTva2fqF0tbQbHy2F5BB9KRUajB8RzvtECAGE");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    let supabaseResponse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request
    });
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createServerClient"])(url, anonKey, {
        cookies: {
            getAll () {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$utils$2f$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseCookieHeader"])(request.headers.get("cookie") ?? "").map((c)=>({
                        name: c.name,
                        value: c.value ?? ""
                    }));
            },
            setAll (cookiesToSet) {
                const merged = mergeCookieRequestHeader(request.headers.get("cookie"), cookiesToSet.map(({ name, value })=>({
                        name,
                        value
                    })));
                const requestHeaders = new Headers(request.headers);
                if (merged.length === 0) {
                    requestHeaders.delete("cookie");
                } else {
                    requestHeaders.set("cookie", merged);
                }
                supabaseResponse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
                    request: {
                        headers: requestHeaders
                    }
                });
                for (const { name, value, options } of cookiesToSet){
                    supabaseResponse.headers.append("Set-Cookie", (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$utils$2f$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["serializeCookieHeader"])(name, value, options));
                }
            }
        }
    });
    await supabase.auth.getUser();
    return supabaseResponse;
}
}),
"[project]/src/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$edge$2d$node$2d$globals$2d$polyfill$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/edge-node-globals-polyfill.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$update$2d$session$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/update-session.ts [middleware] (ecmascript)");
;
;
;
async function proxy(request) {
    if (request.method === "HEAD" || request.method === "OPTIONS") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
            request
        });
    }
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$update$2d$session$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["updateSession"])(request);
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
            request
        });
    }
}
const config = {
    matcher: [
        "/api/:path*",
        "/dashboard/:path*",
        "/login",
        "/login/:path*",
        "/select-role",
        "/select-role/:path*",
        "/select-workplace",
        "/select-workplace/:path*",
        "/pending-approval",
        "/pending-approval/:path*",
        "/super-admin/:path*",
        "/test-ai",
        "/test-ai/:path*"
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0opuwlz._.js.map