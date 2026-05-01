(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/config/website-assets.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WEBSITE_ASSETS",
    ()=>WEBSITE_ASSETS
]);
const SUPABASE_WEBSITE_ASSETS_BASE_URL = "https://pwooqmqdershicxpnfuo.supabase.co/storage/v1/object/public/website_assets";
const WEBSITE_ASSETS = {
    landingLogo: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/ShiftBob-circle-logo-light-300x.png`,
    landingHero: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/hero-power-top.jpg`,
    landingEmployeePhoto: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/employee_on-mob.jpg`,
    landingEuCompliance: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/eu.jpg`
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/landing/scroll-fade-in-image.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollFadeInImage",
    ()=>ScrollFadeInImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$website$2d$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/website-assets.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ScrollFadeInImage({ src = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$website$2d$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WEBSITE_ASSETS"].landingEmployeePhoto, alt = "Employee checking shifts on mobile app" }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScrollFadeInImage.useEffect": ()=>{
            const node = ref.current;
            if (!node) return;
            const observer = new IntersectionObserver({
                "ScrollFadeInImage.useEffect": (entries)=>{
                    for (const entry of entries){
                        if (entry.isIntersecting) {
                            setIsVisible(true);
                            observer.disconnect();
                            break;
                        }
                    }
                }
            }["ScrollFadeInImage.useEffect"], {
                threshold: 0.25
            });
            observer.observe(node);
            return ({
                "ScrollFadeInImage.useEffect": ()=>observer.disconnect()
            })["ScrollFadeInImage.useEffect"];
        }
    }["ScrollFadeInImage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-full border-[10px] border-zinc-200/80 bg-zinc-100 shadow-lg transition-all duration-700 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: src,
            alt: alt,
            width: 800,
            height: 800,
            className: "h-full w-full object-cover",
            unoptimized: true
        }, void 0, false, {
            fileName: "[project]/app/landing/scroll-fade-in-image.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/landing/scroll-fade-in-image.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(ScrollFadeInImage, "Wk8baY7uc+CWSrD2kMBp+I8qtIg=");
_c = ScrollFadeInImage;
var _c;
__turbopack_context__.k.register(_c, "ScrollFadeInImage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0jw0o7a._.js.map