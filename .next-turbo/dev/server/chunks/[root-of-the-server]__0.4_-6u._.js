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
        "når",
        "også",
        "at",
        "er",
        "kan",
        "jeg",
        "mit",
        "min",
        "mine",
        "eller",
        "hvad",
        "det",
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
            "subscription"
        ],
        abonnementet: [
            "subscription",
            "abonnement"
        ],
        aboennement: [
            "abonnement",
            "subscription"
        ],
        abonnenement: [
            "abonnement",
            "subscription"
        ],
        abonement: [
            "abonnement",
            "subscription"
        ],
        subscription: [
            "abonnement"
        ],
        betale: [
            "pris",
            "koster",
            "pause",
            "sæsonpause"
        ],
        betaling: [
            "pris",
            "koster",
            "pause",
            "sæsonpause"
        ],
        lukket: [
            "lavsæsonen",
            "pause",
            "sæsonpause",
            "offseason",
            "off-season"
        ],
        lavsæsonen: [
            "pause",
            "sæsonpause",
            "offseason",
            "off-season"
        ],
        regneark: [
            "excel",
            "spreadsheet",
            "google",
            "sheets"
        ],
        excel: [
            "regneark",
            "spreadsheet",
            "google",
            "sheets"
        ],
        spreadsheet: [
            "regneark",
            "excel",
            "google",
            "sheets"
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
function intentBoost(question, row) {
    const q = question.toLowerCase();
    let boost = 0;
    const asksSpreadsheet = q.includes("regneark") || q.includes("excel") || q.includes("google sheets") || q.includes("spreadsheet");
    if (asksSpreadsheet) {
        const tags = row.tags.map((t)=>t.toLowerCase());
        if (tags.includes("excel") || tags.includes("onboarding")) boost += 3;
        const hay = `${row.title} ${row.question} ${row.answer}`.toLowerCase();
        if (hay.includes("excel") || hay.includes("google sheets") || hay.includes("regneark")) {
            boost += 3;
        }
    }
    const asksBenefits = q.includes("fordel") || q.includes("superkræft") || q.includes("hvorfor shiftbob") || q.includes("why shiftbob") || q.includes("benefit");
    if (asksBenefits) {
        const tags = row.tags.map((t)=>t.toLowerCase());
        const hay = `${row.title} ${row.question} ${row.answer}`.toLowerCase();
        if (tags.includes("hybrid_app") || tags.includes("autopilot") || tags.includes("compliance") || tags.includes("template") || hay.includes("app") || hay.includes("compliance") || hay.includes("template")) {
            boost += 5;
        }
    }
    const asksTemplatePolicy = (q.includes("eget") || q.includes("mit")) && (q.includes("jeres") || q.includes("template")) && (q.includes("regneark") || q.includes("excel") || q.includes("google sheets"));
    if (asksTemplatePolicy) {
        const tags = row.tags.map((t)=>t.toLowerCase());
        const hay = `${row.title} ${row.question} ${row.answer}`.toLowerCase();
        if (tags.includes("template") || hay.includes("template-regnearket")) {
            boost += 8;
        }
    }
    const asksSeasonalPayment = (q.includes("vinter") || q.includes("lavsæson") || q.includes("lukket")) && (q.includes("betal") || q.includes("pris") || q.includes("abonnement"));
    if (asksSeasonalPayment) {
        const tags = row.tags.map((t)=>t.toLowerCase());
        if (tags.includes("sæsonpause") || tags.includes("seasonal") || tags.includes("pause") || tags.includes("hybrid_app")) {
            boost += 7;
        }
    }
    const asksSpreadsheetControl = isSpreadsheetControlQuestion(question);
    if (asksSpreadsheetControl) {
        const tags = row.tags.map((t)=>t.toLowerCase());
        const hay = `${row.title} ${row.question} ${row.answer}`.toLowerCase();
        if (tags.includes("template") || tags.includes("excel") || tags.includes("hybrid_app")) {
            boost += 8;
        }
        if (hay.includes("fortsætte") || hay.includes("frit") || hay.includes("egen takt") || hay.includes("continue") || hay.includes("your pace")) {
            boost += 6;
        }
    }
    return boost;
}
function asksProductSalesPitch(message) {
    const q = message.toLowerCase();
    return q.includes("shiftbob") || q.includes("produkt") || q.includes("løsning") || q.includes("superkræft") || q.includes("fordel") || q.includes("hvorfor");
}
function buildSalesPitchFallback(languageBase, message) {
    const q = message.toLowerCase();
    const asksSpreadsheet = q.includes("regneark") || q.includes("excel") || q.includes("spreadsheet");
    const asksCompliance = q.includes("eu") || q.includes("compliance") || q.includes("regler");
    const asksApp = q.includes("app") || q.includes("medarbejder");
    if (languageBase === "da") {
        if (asksSpreadsheet) {
            return "Godt spørgsmål. Med ShiftBob får jeres regneark reelle superkræfter: I kan starte i vores gratis template-regneark (EU-kompatibelt), få bedre struktur i vagter og senere udvide med app-flow, vagtbytte og godkendelser, uden at starte forfra.";
        }
        if (asksCompliance) {
            return "Godt spørgsmål. En af de største fordele ved ShiftBob er, at compliance bliver en aktiv del af planlægningen i stedet for en manuel bagefter-kontrol. Det sparer tid og reducerer fejl, før vagterne går i drift.";
        }
        if (asksApp) {
            return "Godt spørgsmål. ShiftBob gør hverdagen lettere for både ledelse og medarbejdere: teamet håndterer ændringer i appen, og ledelsen bevarer overblikket med central godkendelse og færre manuelle loops.";
        }
        return "Godt spørgsmål. ShiftBob er stærk, fordi I kan starte enkelt og skalere op uden systemskifte: gratis template-regneark, bedre planflow, compliance-støtte og medarbejderapp i samme retning.";
    }
    if (asksSpreadsheet) {
        return "Great question. ShiftBob gives your spreadsheet real superpowers: start with our free EU-compatible template, run cleaner schedules, and scale into app workflows, shift swaps, and approvals without restarting your setup.";
    }
    if (asksCompliance) {
        return "Great question. A key ShiftBob benefit is making compliance part of daily planning rather than a late manual check, which saves time and reduces avoidable mistakes before shifts go live.";
    }
    if (asksApp) {
        return "Great question. ShiftBob helps both managers and staff: teams handle changes in-app while managers keep control with centralized approvals and fewer manual coordination loops.";
    }
    return "Great question. ShiftBob works well because you can start simple and scale without replacing your workflow: free template spreadsheet, stronger planning flow, compliance support, and staff app capabilities.";
}
function simplifyTechnicalLanguage(text, languageBase) {
    let out = text;
    const replacementsDa = [
        [
            "eu-compliance checks",
            "EU-regeltjek"
        ],
        [
            "eu-compliance check",
            "EU-regeltjek"
        ],
        [
            "eu-compliance tjek",
            "EU-regeltjek"
        ],
        [
            "app-flow",
            "apps til medarbejderne"
        ],
        [
            "app flow",
            "apps til medarbejderne"
        ],
        [
            "workflow",
            "arbejdsgang"
        ],
        [
            "workflows",
            "arbejdsgange"
        ],
        [
            "compliance",
            "regeltjek"
        ],
        [
            "godkendelsesdashboard",
            "godkendelsesoverblik"
        ],
        [
            "dashboard",
            "overblik"
        ],
        [
            "setup",
            "opsætning"
        ],
        [
            "onboarding",
            "opstart"
        ],
        [
            "automatiseret planbygning",
            "hjælp til at lave planer automatisk"
        ],
        [
            "koordineringsloops",
            "frem og tilbage-koordinering"
        ]
    ];
    const replacementsEn = [
        [
            "workflow",
            "work process"
        ],
        [
            "workflows",
            "work processes"
        ],
        [
            "compliance",
            "rule checks"
        ],
        [
            "dashboard",
            "overview"
        ],
        [
            "onboarding",
            "getting started"
        ]
    ];
    const replacements = languageBase === "da" ? replacementsDa : replacementsEn;
    for (const [from, to] of replacements){
        out = out.replace(new RegExp(from, "gi"), to);
    }
    out = out.replace(/regeltjek\s+tjek/gi, "regeltjek");
    return out;
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
    score += intentBoost(question, row);
    return score;
}
function detectPlanFromQuestion(question) {
    const q = question.toLowerCase();
    if (q.includes("pro planner") || q.includes("pro-plan")) return "pro_planner";
    if (q.includes("hybrid app") || q.includes("hybrid-plan") || q.includes("hybrid planen") || q.includes("hybrid plan") || q.includes("hybrip app") || q.includes("hybri app")) {
        return "hybrid_app";
    }
    if (q.includes("autopilot")) return "autopilot";
    if (q.includes("basic")) return "basic";
    return null;
}
function detectMentionedPlans(question) {
    const q = question.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
    const plans = [];
    const hasBasic = /\bbasic\b|\bgratis\b|\bfree\b/.test(q);
    const hasPro = /\bpro\s*planner\b|\bproplan\b|\bpro\s*plan\b/.test(q);
    const hasHybrid = /\bhybrid\s*app\b|\bhybridapp\b|\bhybrid\s*plan\b/.test(q) || /\bhybri\w*\s*app\b/.test(q);
    const hasAutopilot = /\bautopilot\b/.test(q);
    if (hasBasic) plans.push("basic");
    if (hasPro) plans.push("pro_planner");
    if (hasHybrid) plans.push("hybrid_app");
    if (hasAutopilot) plans.push("autopilot");
    return plans;
}
function isSpreadsheetControlQuestion(question) {
    const q = question.toLowerCase();
    const asksSpreadsheet = q.includes("regneark") || q.includes("excel") || q.includes("spreadsheet");
    const asksControlOrContinuity = q.includes("fortsat") || q.includes("stadig") || q.includes("blive") || q.includes("bare") || q.includes("fortsætte") || q.includes("continue") || q.includes("keep") || q.includes("kontrol") || q.includes("online");
    const asksHybrid = q.includes("hybrid");
    return asksSpreadsheet && (asksHybrid || asksControlOrContinuity);
}
function detectPlanFromEntry(row) {
    if (!row) return null;
    const tags = row.tags.map((t)=>t.toLowerCase());
    if (tags.includes("pro_planner")) return "pro_planner";
    if (tags.includes("hybrid_app")) return "hybrid_app";
    if (tags.includes("autopilot")) return "autopilot";
    if (tags.includes("basic")) return "basic";
    return null;
}
function isPlanComparisonQuestion(question) {
    const q = question.toLowerCase();
    return q.includes("forskel") || q.includes("sammenlign") || q.includes("vs") || q.includes("versus") || q.includes("difference") || q.includes("compare");
}
function detectComparisonTarget(question) {
    const mentioned = detectMentionedPlans(question);
    return mentioned.length > 0 ? mentioned[0] : null;
}
function hasPlanQuestionSignals(question) {
    const q = question.toLowerCase();
    return q.includes("plan") || q.includes("abonnement") || q.includes("inkluder") || q.includes("indhold") || q.includes("hvad får") || q.includes("hvad er med") || q.includes("hvad koster") || q.includes("price") || q.includes("included");
}
function asksIncluded(question) {
    const q = question.toLowerCase();
    return q.includes("inkluder") || q.includes("indhold") || q.includes("hvad får") || q.includes("hvad er med") || q.includes("included") || q.includes("what do we get");
}
function asksExcluded(question) {
    const q = question.toLowerCase();
    return q.includes("ikke inkluder") || q.includes("ikke med") || q.includes("hvad får vi ikke") || q.includes("hvad er ikke med") || q.includes("uden") || q.includes("not included") || q.includes("what is not included");
}
function findPlanEntry(knowledge, plan, kind) {
    const kindTags = kind === "features" ? [
        "features",
        "funktioner"
    ] : [
        "pricing",
        "pris"
    ];
    return knowledge.find((row)=>{
        const tags = row.tags.map((t)=>t.toLowerCase());
        return tags.includes(plan) && kindTags.some((tag)=>tags.includes(tag));
    }) ?? null;
}
function buildPlanExclusions(languageBase, plan) {
    if (languageBase === "da") {
        if (plan === "basic") {
            return [
                "ubegrænsede regeltjek",
                "prioriteret support",
                "medarbejder-appfunktioner og vagtbytte i app"
            ];
        }
        if (plan === "pro_planner") {
            return [
                "fuld medarbejder-app med vagtbytte og overtagelser",
                "push-påmindelser i appen",
                "sæsonpause-funktion"
            ];
        }
        if (plan === "hybrid_app") {
            return [
                "automatisk vagtgenerering",
                "match af vagter mod medarbejderpræferencer",
                "API-adgang og avancerede autopilot-funktioner"
            ];
        }
        return [];
    }
    if (plan === "basic") {
        return [
            "unlimited rule checks",
            "priority support",
            "employee app swap tools"
        ];
    }
    if (plan === "pro_planner") {
        return [
            "full employee app swap/takeover flow",
            "push reminders",
            "seasonal pause feature"
        ];
    }
    if (plan === "hybrid_app") {
        return [
            "automatic shift generation",
            "preference-based assignment matching",
            "API access and advanced autopilot features"
        ];
    }
    return [];
}
function planLabel(languageBase, plan) {
    if (languageBase === "da") {
        if (plan === "basic") return "Basic (gratis)";
        if (plan === "pro_planner") return "Pro Planner";
        if (plan === "hybrid_app") return "Hybrid App";
        return "Autopilot";
    }
    if (plan === "basic") return "Basic (free)";
    if (plan === "pro_planner") return "Pro Planner";
    if (plan === "hybrid_app") return "Hybrid App";
    return "Autopilot";
}
function planQuickFacts(languageBase, plan) {
    if (languageBase === "da") {
        if (plan === "basic") {
            return {
                price: "Basic er gratis (0 EUR/md.)",
                key: "I får template-regneark med Excel/Google Sheets-kompatibilitet",
                limitOrExtra: "EU-regeltjek er inkluderet 1 gang dagligt"
            };
        }
        if (plan === "pro_planner") {
            return {
                price: "Pro Planner koster 49 EUR/md.",
                key: "I får alt fra Basic + cloud-lagring og prioriteret e-mail support",
                limitOrExtra: "EU-regeltjek er ubegrænsede"
            };
        }
        if (plan === "hybrid_app") {
            return {
                price: "Hybrid App koster 29 EUR/md. + 1 EUR pr. bruger",
                key: "I får alt fra Pro + apps til medarbejdere, vagtbytte og godkendelsesoverblik",
                limitOrExtra: "Sæsonpause er muligt i lavsæsonen"
            };
        }
        return {
            price: "Autopilot koster 59 EUR/md. + 1 EUR pr. bruger",
            key: "I får alt fra tidligere planer + automatisk vagtgenerering og avancerede indstillinger",
            limitOrExtra: "API-adgang er inkluderet"
        };
    }
    if (plan === "basic") {
        return {
            price: "Basic is free (0 EUR/month)",
            key: "You get the template spreadsheet with Excel/Google Sheets compatibility",
            limitOrExtra: "EU rule checks are included once per day"
        };
    }
    if (plan === "pro_planner") {
        return {
            price: "Pro Planner is 49 EUR/month",
            key: "You get everything in Basic plus cloud storage and priority email support",
            limitOrExtra: "EU rule checks are unlimited"
        };
    }
    if (plan === "hybrid_app") {
        return {
            price: "Hybrid App is 29 EUR/month + 1 EUR per user",
            key: "You get everything in Pro plus employee apps, shift swaps, and approval overview",
            limitOrExtra: "Seasonal pause is available during off-season"
        };
    }
    return {
        price: "Autopilot is 59 EUR/month + 1 EUR per user",
        key: "You get everything in previous plans plus automatic shift generation and advanced options",
        limitOrExtra: "API access is included"
    };
}
function planRank(plan) {
    if (plan === "basic") return 1;
    if (plan === "pro_planner") return 2;
    if (plan === "hybrid_app") return 3;
    return 4;
}
function planCorePositioning(languageBase, plan) {
    if (languageBase === "da") {
        if (plan === "basic") return "til jer der vil have et gratis template-regneark med dagligt regeltjek";
        if (plan === "pro_planner") return "til jer der vil blive i regneark og have stærkere compliance + bedre overblik";
        if (plan === "hybrid_app") return "til jer der vil give medarbejderne app-adgang med vagtbytte, overtagelser og godkendelser";
        return "til jer der vil automatisere planlægningen mest muligt";
    }
    if (plan === "basic") return "for teams that want a free template spreadsheet with daily rule checks";
    if (plan === "pro_planner") return "for teams that want to stay in spreadsheets with stronger compliance and visibility";
    if (plan === "hybrid_app") return "for teams that want employee app access with swaps, takeovers, and approvals";
    return "for teams that want the highest level of automation";
}
function buildComparisonHighlights(languageBase, sourcePlan, targetPlan) {
    const sourceFacts = planQuickFacts(languageBase, sourcePlan);
    const targetFacts = planQuickFacts(languageBase, targetPlan);
    const sourceLabel = planLabel(languageBase, sourcePlan);
    const targetLabel = planLabel(languageBase, targetPlan);
    if (languageBase === "da") {
        const lines = [
            `• Pris: ${sourceFacts.price}; ${targetFacts.price}.`,
            `• Brug den når: ${sourceLabel} er ${planCorePositioning(languageBase, sourcePlan)}, mens ${targetLabel} er ${planCorePositioning(languageBase, targetPlan)}.`
        ];
        if (sourcePlan === "pro_planner" && targetPlan === "hybrid_app" || sourcePlan === "hybrid_app" && targetPlan === "pro_planner") {
            lines.push("• Nøgleforskel: Med Hybrid App får medarbejderne fuld app-funktionalitet (vagtbytte/overtagelser), mens Pro Planner primært er til dig, der vil holde regnearket compliant og få bedre plan-overblik.");
            return lines;
        }
        const higher = planRank(sourcePlan) > planRank(targetPlan) ? sourcePlan : targetPlan;
        const lower = higher === sourcePlan ? targetPlan : sourcePlan;
        const higherLabel = planLabel(languageBase, higher);
        const lowerLabel = planLabel(languageBase, lower);
        const higherFacts = planQuickFacts(languageBase, higher);
        const lowerFacts = planQuickFacts(languageBase, lower);
        lines.push(`• Nøgleforskel: ${higherLabel} giver jer ${higherFacts.limitOrExtra.toLowerCase()}, mens ${lowerLabel} kun giver ${lowerFacts.limitOrExtra.toLowerCase()}.`);
        return lines;
    }
    const lines = [
        `• Price: ${sourceFacts.price}; ${targetFacts.price}.`,
        `• Best fit: ${sourceLabel} is ${planCorePositioning(languageBase, sourcePlan)}, while ${targetLabel} is ${planCorePositioning(languageBase, targetPlan)}.`
    ];
    const higher = planRank(sourcePlan) > planRank(targetPlan) ? sourcePlan : targetPlan;
    const lower = higher === sourcePlan ? targetPlan : sourcePlan;
    const higherLabel = planLabel(languageBase, higher);
    const lowerLabel = planLabel(languageBase, lower);
    const higherFacts = planQuickFacts(languageBase, higher);
    const lowerFacts = planQuickFacts(languageBase, lower);
    lines.push(`• Key difference: ${higherLabel} gives ${higherFacts.limitOrExtra.toLowerCase()}, while ${lowerLabel} only gives ${lowerFacts.limitOrExtra.toLowerCase()}.`);
    return lines;
}
function buildPlanComparisonAnswer(input) {
    if (!isPlanComparisonQuestion(input.question)) return null;
    const mentionedPlans = detectMentionedPlans(input.question);
    const sourcePlan = mentionedPlans[0] ?? detectPlanFromQuestion(input.question) ?? detectPlanFromEntry(input.contextEntry);
    const targetPlan = mentionedPlans[1] ?? detectComparisonTarget(input.question);
    if (!sourcePlan || !targetPlan || sourcePlan === targetPlan) return null;
    const sourceFeatures = findPlanEntry(input.knowledge, sourcePlan, "features");
    const targetFeatures = findPlanEntry(input.knowledge, targetPlan, "features");
    if (!sourceFeatures && !targetFeatures) return null;
    if (input.languageBase === "da") {
        const lines = [
            `Godt spørgsmål. Den korte forskel mellem ${planLabel(input.languageBase, sourcePlan)} og ${planLabel(input.languageBase, targetPlan)}:`,
            ...buildComparisonHighlights(input.languageBase, sourcePlan, targetPlan)
        ];
        return {
            reply: lines.join("\n"),
            matchedKnowledgeId: sourceFeatures?.id ?? targetFeatures?.id ?? null
        };
    }
    const lines = [
        `Great question. Short difference between ${planLabel(input.languageBase, sourcePlan)} and ${planLabel(input.languageBase, targetPlan)}:`,
        ...buildComparisonHighlights(input.languageBase, sourcePlan, targetPlan)
    ];
    return {
        reply: lines.join("\n"),
        matchedKnowledgeId: sourceFeatures?.id ?? targetFeatures?.id ?? null
    };
}
function buildPlanAnswer(input) {
    const plan = detectPlanFromQuestion(input.question);
    if (!plan) return null;
    if (!hasPlanQuestionSignals(input.question)) return null;
    const featuresEntry = findPlanEntry(input.knowledge, plan, "features");
    const pricingEntry = findPlanEntry(input.knowledge, plan, "pricing");
    if (!featuresEntry && !pricingEntry) return null;
    const includeAsked = asksIncluded(input.question) || !asksExcluded(input.question);
    const excludeAsked = asksExcluded(input.question);
    const exclusions = buildPlanExclusions(input.languageBase, plan);
    if (input.languageBase === "da") {
        const parts = [
            "Godt spørgsmål."
        ];
        if (includeAsked && featuresEntry) {
            parts.push(featuresEntry.answer.trim());
        } else if (includeAsked) {
            parts.push("Jeg kan gennemgå planens vigtigste funktioner kort og konkret.");
        }
        if (pricingEntry && (input.question.toLowerCase().includes("pris") || input.question.toLowerCase().includes("koster"))) {
            parts.push(pricingEntry.answer.trim());
        }
        if (excludeAsked && exclusions.length > 0) {
            parts.push(`Det er typisk ikke inkluderet i denne plan: ${exclusions.join(", ")}.`);
        }
        return parts.join(" ");
    }
    const parts = [
        "Great question."
    ];
    if (includeAsked && featuresEntry) {
        parts.push(featuresEntry.answer.trim());
    } else if (includeAsked) {
        parts.push("I can walk you through the plan's key included features in plain terms.");
    }
    if (pricingEntry && (input.question.toLowerCase().includes("price") || input.question.toLowerCase().includes("cost"))) {
        parts.push(pricingEntry.answer.trim());
    }
    if (excludeAsked && exclusions.length > 0) {
        parts.push(`Typically not included in this plan: ${exclusions.join(", ")}.`);
    }
    return parts.join(" ");
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
function isExplainIntent(question) {
    const q = question.toLowerCase().trim();
    if (detectPlanFromQuestion(q) || hasPlanQuestionSignals(q)) return false;
    const explainHints = [
        "hvad betyder",
        "hvad menes",
        "forklar",
        "uddyb",
        "hvordan skal",
        "how does",
        "what does it mean",
        "explain",
        "elaborate"
    ];
    return explainHints.some((hint)=>q.includes(hint));
}
function rephraseForExplainIntent(question, answer, languageBase) {
    if (!isExplainIntent(question)) return answer;
    const a = answer.trim();
    const lower = a.toLowerCase();
    if (languageBase === "da") {
        const points = [];
        if (lower.includes("ios") || lower.includes("android") || lower.includes("app")) {
            points.push("medarbejderne får en mobil app til den daglige vagtkommunikation");
        }
        if (lower.includes("vagtbytte")) {
            points.push("de kan håndtere vagtbytte direkte i appen");
        }
        if (lower.includes("push")) {
            points.push("de får push-notifikationer ved ændringer");
        }
        if (lower.includes("godkendelsesdashboard")) {
            points.push("ledelsen kan godkende og styre ændringer i et dashboard");
        }
        if (points.length > 0) {
            return `Godt spørgsmål. Det betyder i praksis, at ${points.join(", ")}.\n\nKort sagt: ${a}`;
        }
        return `Godt spørgsmål. Det betyder i praksis: ${a}`;
    }
    return `Great question. In practice, this means: ${a}`;
}
function isAffirmativeFollowup(message) {
    const normalized = message.trim().toLowerCase().replace(/[!?.,]/g, "").trim();
    const affirmative = new Set([
        "ja",
        "ja tak",
        "meget gerne",
        "gerne",
        "yes",
        "yes please",
        "please",
        "ok",
        "okay",
        "fint",
        "super"
    ]);
    return affirmative.has(normalized);
}
function isContextContinuationQuestion(message) {
    const normalized = message.trim().toLowerCase().replace(/[!?.,]/g, " ").replace(/\s+/g, " ").trim();
    const hints = [
        "andet",
        "hvad mere",
        "hvad ellers",
        "mere om",
        "kan den andet",
        "kan planen andet",
        "fortæl mere",
        "what else",
        "anything else",
        "tell me more",
        "more about"
    ];
    return hints.some((hint)=>normalized.includes(hint));
}
function buildContextualDeepDive(row, languageBase) {
    const tags = row.tags.map((t)=>t.toLowerCase());
    const isHybrid = tags.includes("hybrid_app");
    const isAutopilot = tags.includes("autopilot");
    const isPricing = tags.includes("pricing") || tags.includes("pris");
    const isTemplate = tags.includes("template") || tags.includes("excel");
    const isCompliance = tags.includes("compliance");
    if (languageBase === "da") {
        if (isHybrid) {
            return "Selvfølgelig. Hybrid App-planen er lavet til jer, der vil beholde den praktiske drift tæt på hverdagen, men stadig give medarbejderne en moderne app-oplevelse. Teamet kan tage vagtbytter i appen, ledelsen kan godkende ændringer centralt, og hvis I er sæsonbaserede, kan abonnementet sættes på pause i lavsæsonen.";
        }
        if (isAutopilot) {
            return "Selvfølgelig. Autopilot er til jer, der vil have mere af planlægningen løftet automatisk. Den hjælper med at bygge planer hurtigere og reducere manuel koordinering, så du og teamet kan bruge tiden på drift frem for planpudsning.";
        }
        if (isPricing) {
            return "Selvfølgelig. Prisen afhænger af hvilken plan I vælger og hvor mange brugere der skal med. Tanken er, at I betaler for det niveau af funktioner, der matcher jeres måde at planlægge på.";
        }
        if (isTemplate) {
            return "Selvfølgelig. ShiftBob template-regnearket er jeres stabile udgangspunkt: det er gratis, kompatibelt med EU-tjek og kan bruges alene til vagtplanlægning, også uden vores service.";
        }
        if (isCompliance) {
            return "Selvfølgelig. Compliance-funktionen hjælper jer med at opdage mulige regelbrud tidligt, så planen kan justeres i god tid, før vagterne går i drift.";
        }
        return null;
    }
    if (isHybrid) {
        return "Absolutely. The Hybrid App plan is for teams that want practical day-to-day flexibility with a modern app layer. Staff can handle shift swaps in the app, managers approve changes centrally, and seasonal businesses can pause during off-season when needed.";
    }
    if (isAutopilot) {
        return "Absolutely. Autopilot goes further by automating more of the scheduling flow, helping you build plans faster and spend less time on manual coordination.";
    }
    if (isPricing) {
        return "Absolutely. Pricing depends on your selected plan and user count, so you can choose the level that fits how your team works.";
    }
    if (isTemplate) {
        return "Absolutely. The ShiftBob template spreadsheet is your reliable starting point: it is free, EU-compatible, and can run scheduling on its own, even without our service.";
    }
    if (isCompliance) {
        return "Absolutely. Compliance checks surface potential issues early, so schedules can be adjusted before shifts go live.";
    }
    return null;
}
function buildConcreteFollowup(languageBase, row) {
    if (!row) return null;
    const tags = row.tags.map((t)=>t.toLowerCase());
    const isHybrid = tags.includes("hybrid_app");
    const isAutopilot = tags.includes("autopilot");
    const isPricing = tags.includes("pricing") || tags.includes("pris");
    const isTemplate = tags.includes("template") || tags.includes("excel");
    const isCompliance = tags.includes("compliance");
    if (languageBase === "da") {
        if (isHybrid) return "Måske du vil vide mere om, hvad Hybrid App-planen konkret inkluderer?";
        if (isAutopilot) return "Måske du vil se, hvad der adskiller Autopilot-planen fra Hybrid App?";
        if (isPricing) return "Måske du vil have et kort overblik over prisforskellen mellem planerne?";
        if (isTemplate) return "Måske du vil vide, hvordan template-regnearket bruges trin for trin?";
        if (isCompliance) return "Måske du vil se et konkret eksempel på, hvordan compliance-tjekket virker?";
        return null;
    }
    if (isHybrid) return "You might want a quick overview of what the Hybrid App plan includes.";
    if (isAutopilot) return "You might want to compare what Autopilot adds beyond Hybrid App.";
    if (isPricing) return "You might want a short side-by-side pricing overview.";
    if (isTemplate) return "You might want a step-by-step on how to use the template spreadsheet.";
    if (isCompliance) return "You might want a concrete example of how compliance checks work.";
    return null;
}
function applyWarmTone(question, answer, languageBase, row, options) {
    const a = answer.trim();
    if (!a) return a;
    const includeConcreteFollowup = options?.includeConcreteFollowup ?? true;
    if (languageBase === "da") {
        const alreadyWarm = /godt spørgsmål|helt fair|selvfølgelig|klart|tak for spørgsmålet/i.test(a);
        const intro = alreadyWarm ? "" : "Godt spørgsmål.";
        const hasOutro = /måske du vil|you might want|sig til|sig endelig/i.test(a);
        const concreteFollowup = includeConcreteFollowup && !hasOutro ? buildConcreteFollowup(languageBase, row) : null;
        return [
            intro,
            a,
            concreteFollowup
        ].filter(Boolean).join(" ");
    }
    const alreadyWarm = /great question|totally fair|happy to explain|gladly explain|thanks for asking/i.test(a);
    const intro = alreadyWarm ? "" : "Great question.";
    const hasOutro = /you might want|let me know|happy to|gladly/i.test(a);
    const concreteFollowup = includeConcreteFollowup && !hasOutro ? buildConcreteFollowup(languageBase, row) : null;
    return [
        intro,
        a,
        concreteFollowup
    ].filter(Boolean).join(" ");
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
    const baseTokens = tokenize(message);
    const messageTokens = expandTokens(baseTokens);
    const suggestions = input.knowledge.slice(0, 3).map((entry)=>entry.question);
    const ctaLabel = input.manifest.cta_label.trim();
    const ctaHref = input.manifest.cta_href.trim();
    const showCta = ctaLabel.length > 0 && ctaHref.length > 0;
    const langBase = (input.languageCode?.trim().split("-")[0] || "en").toLowerCase();
    const makeReply = (text)=>simplifyTechnicalLanguage(text, langBase);
    const localizedFallback = langBase === "da" ? "Tak for spørgsmålet. Jeg har ikke et præcist svar på det endnu. Prøv gerne at omformulere spørgsmålet lidt mere konkret, fx:\n• \"Kan vi sætte abonnementet på pause i lavsæsonen?\"\n• \"Hvad indeholder Hybrid App-planen?\"\n• \"Hvad er prisen pr. bruger?\"" : "Thanks for asking. I do not have a precise answer yet. Please try rephrasing your question with a bit more detail, for example:\n• \"Can we pause the subscription during off-season?\"\n• \"What is included in the Hybrid App plan?\"\n• \"What is the price per user?\"";
    const contextEntry = input.contextKnowledgeId?.trim() && input.contextKnowledgeId.trim().length > 0 ? input.knowledge.find((row)=>row.id === input.contextKnowledgeId?.trim()) ?? null : null;
    function localizedConfirmationPrefix() {
        if (langBase === "da") return "Ja, præcis.";
        return "Yes, exactly.";
    }
    if (!message) {
        return {
            reply: makeReply(input.manifest.welcome_message),
            suggestions,
            ctaLabel: showCta ? ctaLabel : null,
            ctaHref: showCta ? ctaHref : null,
            matchedKnowledgeId: null
        };
    }
    const followupHints = [
        "så",
        "altså",
        "det betyder",
        "så man kan",
        "kan man så",
        "forstået",
        "got it",
        "so ",
        "so that",
        "meaning"
    ];
    const lowerMessage = message.toLowerCase();
    const looksLikeFollowup = messageTokens.length <= 8 && followupHints.some((hint)=>lowerMessage.startsWith(hint) || lowerMessage.includes(` ${hint}`));
    const affirmativeFollowup = messageTokens.length <= 5 && isAffirmativeFollowup(message);
    const continuationFollowup = messageTokens.length <= 8 && contextEntry && isContextContinuationQuestion(message);
    if (isSpreadsheetControlQuestion(message)) {
        const spreadsheetControlEntry = input.knowledge.filter((row)=>{
            const tags = row.tags.map((t)=>t.toLowerCase());
            const hasSpreadsheet = tags.includes("excel") || tags.includes("template");
            const hasControlAngle = tags.includes("hybrid_app") || tags.includes("online") || tags.includes("control") || tags.includes("kontrol");
            return hasSpreadsheet && hasControlAngle;
        }).map((row)=>({
                row,
                score: scoreKnowledgeMatch(message, row)
            })).sort((a, b)=>b.score - a.score)[0]?.row ?? null;
        if (spreadsheetControlEntry) {
            return {
                reply: makeReply(applyWarmTone(message, spreadsheetControlEntry.answer, langBase, spreadsheetControlEntry)),
                suggestions,
                ctaLabel: showCta ? ctaLabel : null,
                ctaHref: showCta ? ctaHref : null,
                matchedKnowledgeId: spreadsheetControlEntry.id
            };
        }
    }
    const comparisonAnswer = buildPlanComparisonAnswer({
        question: message,
        knowledge: input.knowledge,
        languageBase: langBase,
        contextEntry
    });
    if (comparisonAnswer) {
        return {
            reply: makeReply(comparisonAnswer.reply),
            suggestions,
            ctaLabel: showCta ? ctaLabel : null,
            ctaHref: showCta ? ctaHref : null,
            matchedKnowledgeId: comparisonAnswer.matchedKnowledgeId
        };
    }
    const planAnswer = buildPlanAnswer({
        question: message,
        knowledge: input.knowledge,
        languageBase: langBase
    });
    if (planAnswer) {
        const plan = detectPlanFromQuestion(message);
        const matchedPlanEntry = plan ? findPlanEntry(input.knowledge, plan, "features") ?? findPlanEntry(input.knowledge, plan, "pricing") : null;
        return {
            reply: makeReply(planAnswer),
            suggestions,
            ctaLabel: showCta ? ctaLabel : null,
            ctaHref: showCta ? ctaHref : null,
            matchedKnowledgeId: matchedPlanEntry?.id ?? null
        };
    }
    if (contextEntry && looksLikeFollowup) {
        return {
            reply: makeReply(applyWarmTone(message, `${localizedConfirmationPrefix()} ${contextEntry.answer}`, langBase, contextEntry, {
                includeConcreteFollowup: false
            })),
            suggestions,
            ctaLabel: showCta ? ctaLabel : null,
            ctaHref: showCta ? ctaHref : null,
            matchedKnowledgeId: contextEntry.id
        };
    }
    if (continuationFollowup && contextEntry) {
        const deepDive = buildContextualDeepDive(contextEntry, langBase);
        return {
            reply: makeReply(applyWarmTone(message, deepDive ?? contextEntry.answer, langBase, contextEntry, {
                includeConcreteFollowup: false
            })),
            suggestions,
            ctaLabel: showCta ? ctaLabel : null,
            ctaHref: showCta ? ctaHref : null,
            matchedKnowledgeId: contextEntry.id
        };
    }
    if (contextEntry && affirmativeFollowup) {
        const deepDive = buildContextualDeepDive(contextEntry, langBase);
        return {
            reply: makeReply(applyWarmTone(message, deepDive ?? `${localizedConfirmationPrefix()} ${contextEntry.answer}`, langBase, contextEntry, {
                includeConcreteFollowup: false
            })),
            suggestions,
            ctaLabel: showCta ? ctaLabel : null,
            ctaHref: showCta ? ctaHref : null,
            matchedKnowledgeId: contextEntry.id
        };
    }
    const ranked = input.knowledge.map((entry)=>({
            entry,
            score: scoreKnowledgeMatch(message, entry)
        })).sort((a, b)=>b.score - a.score);
    const best = ranked[0];
    const second = ranked[1];
    const tokenMatches = best ? countMatchedTokens(messageTokens, best.entry) : 0;
    const baseTokenMatches = best ? countMatchedTokens(baseTokens, best.entry) : 0;
    const coverage = messageTokens.length > 0 ? tokenMatches / messageTokens.length : 0;
    const baseCoverage = baseTokens.length > 0 ? baseTokenMatches / baseTokens.length : 0;
    // Conservative confidence guardrails: prefer fallback over wrong answers.
    const tooWeak = !best || best.score < 3.6;
    const tooAmbiguous = !!best && !!second && best.score - second.score < 1.2 && // If original (non-expanded) tokens already match well, trust the best hit.
    !(baseCoverage >= 0.5 && best.score >= 4.2);
    const tooLowCoverage = messageTokens.length >= 3 && coverage < 0.24;
    if (tooWeak || tooAmbiguous || tooLowCoverage) {
        const salesPitchFallback = asksProductSalesPitch(message) ? buildSalesPitchFallback(langBase, message) : null;
        return {
            reply: makeReply(salesPitchFallback ?? localizedFallback),
            suggestions,
            ctaLabel: showCta ? ctaLabel : null,
            ctaHref: showCta ? ctaHref : null,
            matchedKnowledgeId: null
        };
    }
    return {
        reply: makeReply(applyWarmTone(message, rephraseForExplainIntent(message, best.entry.answer, langBase), langBase, best.entry)),
        suggestions,
        ctaLabel: showCta ? ctaLabel : null,
        ctaHref: showCta ? ctaHref : null,
        matchedKnowledgeId: best.entry.id
    };
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/admin.ts [app-route] (ecmascript)");
;
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
async function POST(req) {
    try {
        const body = await req.json();
        const languageCode = body.languageCode?.trim() || "en-US";
        const message = body.message?.trim() || "";
        const contextKnowledgeId = body.contextKnowledgeId?.trim() || "";
        const runtime = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$salesbot$2d$runtime$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSalesBotRuntime"])(languageCode);
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$salesbot$2d$runtime$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildSalesBotReply"])({
            question: message,
            manifest: runtime.manifest,
            knowledge: runtime.knowledge,
            languageCode,
            contextKnowledgeId
        });
        if (message) {
            try {
                const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminClient"])();
                const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerSupabase"])();
                const { data: { user } } = await supabase.auth.getUser();
                await admin.from("salesbot_chat_logs").insert({
                    language_code: languageCode,
                    user_message: message,
                    bot_reply: result.reply,
                    matched_knowledge_id: result.matchedKnowledgeId,
                    context_knowledge_id: contextKnowledgeId || null,
                    cta_label: result.ctaLabel,
                    cta_href: result.ctaHref,
                    user_id: user?.id ?? null
                });
            } catch  {
            // Non-blocking logging.
            }
        }
        return Response.json({
            ok: true,
            reply: result.reply,
            suggestions: result.suggestions,
            ctaLabel: result.ctaLabel,
            ctaHref: result.ctaHref,
            matchedKnowledgeId: result.matchedKnowledgeId
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0.4_-6u._.js.map