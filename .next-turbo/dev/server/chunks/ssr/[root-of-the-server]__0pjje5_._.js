module.exports = [
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:stream/promises [external] (node:stream/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream/promises", () => require("node:stream/promises"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/src/utils/ai/gemini.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GEMINI_TEXT_MODEL",
    ()=>GEMINI_TEXT_MODEL,
    "generateScheduleExplanation",
    ()=>generateScheduleExplanation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/genai/dist/node/index.mjs [app-rsc] (ecmascript)");
;
const GEMINI_TEXT_MODEL = "gemini-2.5-flash";
let cached = null;
function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY mangler i miljøvariabler.");
    }
    if (!cached) {
        cached = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GoogleGenAI"]({
            apiKey
        });
    }
    return cached;
}
async function generateScheduleExplanation(scheduleData) {
    const ai = getGeminiClient();
    const systemInstruction = "Du er en assistent for vagtplanlægning. Du skriver kort, professionelt og på dansk til en leder. " + "Ingen markdown-overskrifter med # hvis ikke nødvendigt; brug korte afsnit og punktopstillinger hvor det hjælper.";
    const userPayload = "Her er resultatet af en matematisk vagtplan (JSON). Lav en kort rapport (max ca. 200 ord) der forklarer " + "hvem der har hvilke vagter, evt. belastning pr. medarbejder, og eventuelle bemærkninger. " + "Hvis data ser ufuldstændige ud, sig det kort.\n\n" + JSON.stringify(scheduleData, null, 2);
    const response = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        config: {
            systemInstruction
        },
        contents: userPayload
    });
    const text = response.text;
    if (!text?.trim()) {
        throw new Error("Tomt svar fra Gemini.");
    }
    return text.trim();
}
}),
"[project]/src/app/super-admin/translations/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"403981b1130b89a00001d463918258c47f84d7d486":{"name":"loadTargetTexts"},"406b02e0ef2a53fa4bb42186b8a21d999f58436e1a":{"name":"saveTranslation"},"70dc37775ff8d030a3b5d1b55cb12ca6425e7762af":{"name":"translateWithAI"}},"src/app/super-admin/translations/actions.ts",""] */ __turbopack_context__.s([
    "loadTargetTexts",
    ()=>loadTargetTexts,
    "saveTranslation",
    ()=>saveTranslation,
    "translateWithAI",
    ()=>translateWithAI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/genai/dist/node/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/super-admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$ai$2f$gemini$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/ai/gemini.ts [app-rsc] (ecmascript)");
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
async function translateWithAI(text, context, targetLanguage) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertSuperAdminAccess"])(supabase);
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return {
                ok: false,
                error: "GEMINI_API_KEY mangler på serveren."
            };
        }
        const ai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GoogleGenAI"]({
            apiKey
        });
        const systemPrompt = "Du er en professionel UX-oversætter. " + `Oversæt følgende tekst til ${targetLanguage}. ` + `Brug denne kontekst for at sikre korrekt terminologi: ${context}. ` + "Returner KUN den oversatte tekst, intet andet.";
        const response = await ai.models.generateContent({
            model: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$ai$2f$gemini$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GEMINI_TEXT_MODEL"],
            config: {
                systemInstruction: systemPrompt
            },
            contents: text
        });
        const out = response.text?.trim();
        if (!out) {
            return {
                ok: false,
                error: "Tomt svar fra Gemini."
            };
        }
        return {
            ok: true,
            text: out
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ukendt fejl";
        return {
            ok: false,
            error: msg
        };
    }
}
async function saveTranslation(input) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertSuperAdminAccess"])(supabase);
        // RLS kræver is_workplace_admin() (kun workplace_members). Global SUPER_ADMIN i user_roles
        // får ikke skrivning — service role efter Super Admin-check matcher øvrige admin-actions.
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const { error } = await admin.from("ui_translations").upsert({
            translation_key: input.translationKey,
            language_code: input.languageCode,
            text_value: input.textValue,
            context_description: input.contextDescription
        }, {
            onConflict: "translation_key,language_code"
        });
        if (error) {
            return {
                ok: false,
                error: error.message
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/super-admin/translations");
        return {
            ok: true
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Kunne ikke gemme.";
        return {
            ok: false,
            error: msg
        };
    }
}
async function loadTargetTexts(languageCode) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertSuperAdminAccess"])(supabase);
        const map = {};
        const pageSize = 1000;
        let from = 0;
        while(true){
            const { data, error } = await supabase.from("ui_translations").select("translation_key, text_value").eq("language_code", languageCode).order("translation_key").range(from, from + pageSize - 1);
            if (error) {
                return {
                    ok: false,
                    error: error.message
                };
            }
            const chunk = data ?? [];
            for (const row of chunk){
                map[row.translation_key] = row.text_value;
            }
            if (chunk.length < pageSize) break;
            from += pageSize;
        }
        return {
            ok: true,
            map
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Kunne ikke hente oversættelser.";
        return {
            ok: false,
            error: msg
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    translateWithAI,
    saveTranslation,
    loadTargetTexts
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(translateWithAI, "70dc37775ff8d030a3b5d1b55cb12ca6425e7762af", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveTranslation, "406b02e0ef2a53fa4bb42186b8a21d999f58436e1a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loadTargetTexts, "403981b1130b89a00001d463918258c47f84d7d486", null);
}),
"[project]/.next-internal/server/app/super-admin/translations/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/super-admin/translations/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$super$2d$admin$2f$translations$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/super-admin/translations/actions.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/.next-internal/server/app/super-admin/translations/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/super-admin/translations/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "403981b1130b89a00001d463918258c47f84d7d486",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$super$2d$admin$2f$translations$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loadTargetTexts"],
    "406b02e0ef2a53fa4bb42186b8a21d999f58436e1a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$super$2d$admin$2f$translations$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveTranslation"],
    "70dc37775ff8d030a3b5d1b55cb12ca6425e7762af",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$super$2d$admin$2f$translations$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["translateWithAI"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$super$2d$admin$2f$translations$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$super$2d$admin$2f$translations$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/super-admin/translations/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/super-admin/translations/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$super$2d$admin$2f$translations$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/super-admin/translations/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0pjje5_._.js.map