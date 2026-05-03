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
"[project]/src/lib/salesbot-runtime.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SALESBOT_MANIFEST",
    ()=>DEFAULT_SALESBOT_MANIFEST,
    "buildSalesBotReply",
    ()=>buildSalesBotReply,
    "getSalesBotRuntime",
    ()=>getSalesBotRuntime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/admin.ts [app-route] (ecmascript)");
;
const DEFAULT_SALESBOT_MANIFEST = {
    id: "default",
    bot_name: "SalesBot",
    welcome_message: "Hi! I can quickly explain how ShiftBob helps with planning, compliance, and the employee app.",
    tone_of_voice: "Helpful, concise, sales-oriented",
    cta_label: "Book a free intro",
    cta_href: "/login",
    fallback_reply: "I do not have a precise answer for that yet. Want a quick intro call so we can show your exact setup?",
    updated_at: ""
};
function isMissingSchemaError(message) {
    const m = message.toLowerCase();
    return m.includes("schema cache") || m.includes("does not exist") || m.includes("could not find") || m.includes("42p01");
}
function normalizeLanguageCode(languageCode) {
    const value = languageCode?.trim();
    if (!value) return "en-US";
    return value;
}
function languageBase(languageCode) {
    return languageCode.split("-")[0].toLowerCase();
}
function resolveKnowledgeForLanguage(entries, languageCode) {
    const exact = entries.filter((row)=>row.language_code === languageCode);
    if (exact.length > 0) return exact;
    const base = languageBase(languageCode);
    const sameBase = entries.filter((row)=>languageBase(row.language_code) === base);
    if (sameBase.length > 0) return sameBase;
    const enUs = entries.filter((row)=>row.language_code === "en-US");
    if (enUs.length > 0) return enUs;
    const da = entries.filter((row)=>row.language_code === "da");
    if (da.length > 0) return da;
    return entries;
}
function tokenize(value) {
    const stopwords = new Set([
        "og",
        "i",
        "på",
        "om",
        "for",
        "til",
        "at",
        "er",
        "kan",
        "jeg",
        "vi",
        "de",
        "det",
        "den",
        "der",
        "the",
        "and",
        "for",
        "with",
        "can",
        "you",
        "we",
        "is",
        "are"
    ]);
    return value.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).map((token)=>token.trim()).filter((token)=>token.length > 1 && !stopwords.has(token));
}
function expandTokens(tokens) {
    const synonyms = {
        vinter: [
            "sæsonpause",
            "pause",
            "offseason",
            "off-season",
            "seasonal"
        ],
        vinteren: [
            "sæsonpause",
            "pause",
            "offseason",
            "off-season",
            "seasonal"
        ],
        bero: [
            "pause",
            "sæsonpause"
        ],
        pause: [
            "sæsonpause",
            "bero"
        ],
        sæsonpause: [
            "pause",
            "offseason",
            "off-season",
            "seasonal"
        ],
        seasonal: [
            "offseason",
            "off-season",
            "pause",
            "sæsonpause"
        ],
        offseason: [
            "seasonal",
            "pause",
            "sæsonpause"
        ],
        "off-season": [
            "seasonal",
            "pause",
            "sæsonpause"
        ],
        abonnement: [
            "plan",
            "subscription"
        ],
        subscription: [
            "plan",
            "abonnement"
        ]
    };
    const out = new Set(tokens);
    for (const token of tokens){
        for (const alt of synonyms[token] ?? []){
            out.add(alt);
        }
    }
    return [
        ...out
    ];
}
function scoreKnowledgeMatch(question, row) {
    const tokens = expandTokens(tokenize(question));
    if (tokens.length === 0) return 0;
    const normalizedQuestion = question.trim().toLowerCase();
    const hayPrimary = `${row.title} ${row.question} ${row.tags.join(" ")}`.toLowerCase();
    const hayFull = `${row.title} ${row.question} ${row.answer} ${row.tags.join(" ")}`.toLowerCase();
    let score = 0;
    let matchedCount = 0;
    for (const token of tokens){
        if (hayPrimary.includes(token)) {
            score += 3;
            matchedCount += 1;
            continue;
        }
        if (hayFull.includes(token)) {
            score += 2;
            matchedCount += 1;
        }
    }
    if (hayFull.includes(normalizedQuestion)) score += 5;
    if (row.question.trim().toLowerCase() === normalizedQuestion) score += 8;
    if (matchedCount > 0) {
        score += matchedCount / tokens.length * 4;
    }
    return score;
}
function countMatchedTokens(tokens, row) {
    if (tokens.length === 0) return 0;
    const hayPrimary = `${row.title} ${row.question} ${row.tags.join(" ")}`.toLowerCase();
    const hayFull = `${row.title} ${row.question} ${row.answer} ${row.tags.join(" ")}`.toLowerCase();
    let matchedCount = 0;
    for (const token of tokens){
        if (hayPrimary.includes(token) || hayFull.includes(token)) {
            matchedCount += 1;
        }
    }
    return matchedCount;
}
async function getSalesBotRuntime(languageCode) {
    const preferredLanguage = normalizeLanguageCode(languageCode);
    try {
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const [manifestRes, knowledgeRes] = await Promise.all([
            admin.from("salesbot_manifests").select("id, bot_name, welcome_message, tone_of_voice, cta_label, cta_href, fallback_reply, updated_at").order("updated_at", {
                ascending: false
            }).limit(1).maybeSingle(),
            admin.from("salesbot_knowledge_entries").select("id, language_code, title, question, answer, tags, sort_order").eq("active", true).order("sort_order", {
                ascending: true
            }).order("created_at", {
                ascending: true
            })
        ]);
        if (manifestRes.error && !isMissingSchemaError(manifestRes.error.message)) {
            throw new Error(manifestRes.error.message);
        }
        if (knowledgeRes.error && !isMissingSchemaError(knowledgeRes.error.message)) {
            throw new Error(knowledgeRes.error.message);
        }
        const manifestRow = manifestRes.data ? {
            id: String(manifestRes.data.id),
            bot_name: String(manifestRes.data.bot_name ?? DEFAULT_SALESBOT_MANIFEST.bot_name),
            welcome_message: String(manifestRes.data.welcome_message ?? DEFAULT_SALESBOT_MANIFEST.welcome_message),
            tone_of_voice: String(manifestRes.data.tone_of_voice ?? DEFAULT_SALESBOT_MANIFEST.tone_of_voice),
            cta_label: String(manifestRes.data.cta_label ?? DEFAULT_SALESBOT_MANIFEST.cta_label),
            cta_href: String(manifestRes.data.cta_href ?? DEFAULT_SALESBOT_MANIFEST.cta_href),
            fallback_reply: String(manifestRes.data.fallback_reply ?? DEFAULT_SALESBOT_MANIFEST.fallback_reply),
            updated_at: String(manifestRes.data.updated_at ?? "")
        } : DEFAULT_SALESBOT_MANIFEST;
        const knowledgeRows = (knowledgeRes.data ?? []).map((row)=>({
                id: String(row.id),
                language_code: String(row.language_code ?? "en-US"),
                title: String(row.title ?? ""),
                question: String(row.question ?? ""),
                answer: String(row.answer ?? ""),
                tags: row.tags ?? [],
                sort_order: Number(row.sort_order ?? 100)
            }));
        return {
            manifest: manifestRow,
            knowledge: resolveKnowledgeForLanguage(knowledgeRows, preferredLanguage)
        };
    } catch  {
        return {
            manifest: DEFAULT_SALESBOT_MANIFEST,
            knowledge: []
        };
    }
}
function buildSalesBotReply(input) {
    const message = input.question.trim();
    const messageTokens = expandTokens(tokenize(message));
    const suggestions = input.knowledge.slice(0, 3).map((entry)=>entry.question);
    const ctaLabel = input.manifest.cta_label.trim();
    const ctaHref = input.manifest.cta_href.trim();
    const showCta = ctaLabel.length > 0 && ctaHref.length > 0;
    if (!message) {
        return {
            reply: input.manifest.welcome_message,
            suggestions,
            ctaLabel: showCta ? ctaLabel : null,
            ctaHref: showCta ? ctaHref : null
        };
    }
    const ranked = input.knowledge.map((entry)=>({
            entry,
            score: scoreKnowledgeMatch(message, entry)
        })).sort((a, b)=>b.score - a.score);
    const best = ranked[0];
    const second = ranked[1];
    const tokenMatches = best ? countMatchedTokens(messageTokens, best.entry) : 0;
    const coverage = messageTokens.length > 0 ? tokenMatches / messageTokens.length : 0;
    // Conservative confidence guardrails: prefer fallback over wrong answers.
    const tooWeak = !best || best.score < 5;
    const tooAmbiguous = !!best && !!second && best.score - second.score < 2;
    const tooLowCoverage = messageTokens.length > 0 && coverage < 0.34;
    if (tooWeak || tooAmbiguous || tooLowCoverage) {
        return {
            reply: input.manifest.fallback_reply,
            suggestions,
            ctaLabel: showCta ? ctaLabel : null,
            ctaHref: showCta ? ctaHref : null
        };
    }
    return {
        reply: best.entry.answer,
        suggestions,
        ctaLabel: showCta ? ctaLabel : null,
        ctaHref: showCta ? ctaHref : null
    };
}
}),
"[project]/app/api/salesbot/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$salesbot$2d$runtime$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/salesbot-runtime.ts [app-route] (ecmascript)");
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
async function POST(req) {
    try {
        const body = await req.json();
        const languageCode = body.languageCode?.trim() || "en-US";
        const message = body.message?.trim() || "";
        const runtime = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$salesbot$2d$runtime$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSalesBotRuntime"])(languageCode);
        const { reply, suggestions, ctaLabel, ctaHref } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$salesbot$2d$runtime$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildSalesBotReply"])({
            question: message,
            manifest: runtime.manifest,
            knowledge: runtime.knowledge
        });
        return Response.json({
            ok: true,
            reply,
            suggestions,
            ctaLabel,
            ctaHref
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0qobaur._.js.map