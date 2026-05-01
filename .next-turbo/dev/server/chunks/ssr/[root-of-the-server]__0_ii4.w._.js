module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/landing/product-choices.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductChoices",
    ()=>ProductChoices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-rsc] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-rsc] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sheet$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Sheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sheet.js [app-rsc] (ecmascript) <export default as Sheet>");
;
;
;
const plans = [
    {
        id: "foundation",
        title: "The free Basic",
        subtitle: "Free Spreadsheet & Checker",
        modeLabel: "Spreadsheet",
        modeTone: "green",
        price: "0 EUR",
        period: "Forever.",
        description: "The ultimate Excel template to keep your schedule organized and legal.",
        features: [
            "Free professional scheduling spreadsheet",
            "Fully compatible with Excel and Google Sheets",
            "Clear shift-type overview",
            "Built-in hour calculations and monthly overview",
            "Free compliance check on the ShiftBob platform (max once daily)"
        ],
        ctas: [
            {
                label: "Download free Excel",
                href: "/login",
                style: "secondary"
            },
            {
                label: "Free compliance check",
                href: "/login",
                style: "primary"
            }
        ]
    },
    {
        id: "pro-planner",
        title: "The Pro Planner",
        subtitle: "Secure EU compliance",
        modeLabel: "Spreadsheet",
        modeTone: "green",
        price: "49 EUR",
        period: "/ month",
        description: "For managers who iterate. Build your schedule in Excel and verify it infinitely.",
        features: [
            "Everything in the free Basic plan",
            "Unlimited EU-compliance checks",
            "3 employees get free access to your schedule in the ShiftBob app",
            "Secure cloud storage of all past schedules",
            "Priority email support"
        ],
        ctas: [
            {
                label: "Subscribe Now",
                href: "/login",
                style: "primary"
            }
        ]
    },
    {
        id: "hybrid-app",
        title: "The Hybrid App",
        subtitle: "Spreadsheet to Smartphone",
        modeLabel: "Spreadsheet",
        modeTone: "green",
        price: "29 EUR",
        period: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                "/ month + ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    children: "1 EUR"
                }, void 0, false, {
                    fileName: "[project]/app/landing/product-choices.tsx",
                    lineNumber: 88,
                    columnNumber: 19
                }, ("TURBOPACK compile-time value", void 0)),
                " per user"
            ]
        }, void 0, true),
        description: "You keep the spreadsheet. Your staff gets the app. Bridge the gap completely.",
        features: [
            "Everything in The free Basic and The Pro Planner",
            "iOS & Android app for all employees",
            "In-app shift swapping & more",
            "Manager Approval Dashboard for web & mobile",
            "Automated shift reminders & push notifications"
        ],
        ctas: [
            {
                label: "Upgrade to next level!",
                href: "/login",
                style: "contrast"
            }
        ],
        badge: "Most Popular"
    },
    {
        id: "autopilot",
        title: "The Autopilot",
        subtitle: "Full Online Management",
        modeLabel: "Online & automatic",
        modeTone: "yellow",
        price: "59 EUR",
        period: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                "/ month + ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    children: "1 EUR"
                }, void 0, false, {
                    fileName: "[project]/app/landing/product-choices.tsx",
                    lineNumber: 118,
                    columnNumber: 19
                }, ("TURBOPACK compile-time value", void 0)),
                " per user"
            ]
        }, void 0, true),
        description: "Ditch the spreadsheet entirely. Let our engine build and manage your schedule.",
        features: [
            "Everything in all previous plans",
            "Auto-generate shifts based on EU laws",
            "Match shifts with employee preferences automatically",
            "Advanced settings with full employee options control",
            "Publish shifts for pickup in the employee app",
            "Time-calculation export",
            "Create custom shift types",
            "API access"
        ],
        ctas: [
            {
                label: "Go Autopilot",
                href: "/login",
                style: "primary"
            }
        ]
    }
];
function CtaButton({ label, href, style }) {
    const styles = style === "secondary" ? "border border-zinc-300 bg-white text-zinc-900 hover:border-zinc-500" : style === "contrast" ? "bg-[#111827] text-white hover:bg-black" : "bg-[#4A90E2] text-white hover:bg-[#3A7FD1]";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: `inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition ${styles}`,
        children: label
    }, void 0, false, {
        fileName: "[project]/app/landing/product-choices.tsx",
        lineNumber: 160,
        columnNumber: 5
    }, this);
}
function PlanCard({ plan }) {
    const modeStyles = plan.modeTone === "yellow" ? "bg-amber-100 text-amber-900 border-amber-200" : "bg-emerald-100 text-emerald-900 border-emerald-200";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm",
        children: [
            plan.badge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute -top-3 right-4 rounded-full bg-[#4A90E2] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white",
                children: plan.badge
            }, void 0, false, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 178,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "-mx-6 -mt-6 mb-2 flex min-h-[96px] items-start justify-between gap-3 rounded-t-2xl bg-black px-6 py-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-2xl font-bold tracking-tight text-white",
                            children: plan.title
                        }, void 0, false, {
                            fileName: "[project]/app/landing/product-choices.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-sm font-semibold text-white/85",
                            children: plan.subtitle
                        }, void 0, false, {
                            fileName: "[project]/app/landing/product-choices.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/landing/product-choices.tsx",
                    lineNumber: 183,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${modeStyles}`,
                    children: plan.modeLabel
                }, void 0, false, {
                    fileName: "[project]/app/landing/product-choices.tsx",
                    lineNumber: 191,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-[78px] flex-col justify-end",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-3xl font-black text-zinc-900",
                        children: plan.price
                    }, void 0, false, {
                        fileName: "[project]/app/landing/product-choices.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-zinc-600",
                        children: plan.period
                    }, void 0, false, {
                        fileName: "[project]/app/landing/product-choices.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 198,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 min-h-[84px] text-sm leading-6 text-zinc-700",
                children: plan.description
            }, void 0, false, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "mt-5 flex-1 space-y-2 text-sm text-zinc-800",
                children: plan.features.map((feature)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                className: "mt-0.5 h-5 w-5 shrink-0 text-[#4A90E2]",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/app/landing/product-choices.tsx",
                                lineNumber: 209,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: feature
                            }, void 0, false, {
                                fileName: "[project]/app/landing/product-choices.tsx",
                                lineNumber: 213,
                                columnNumber: 13
                            }, this)
                        ]
                    }, feature, true, {
                        fileName: "[project]/app/landing/product-choices.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 flex min-h-[96px] flex-col gap-2",
                children: plan.ctas.map((cta)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(CtaButton, {
                        ...cta
                    }, cta.label, false, {
                        fileName: "[project]/app/landing/product-choices.tsx",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/landing/product-choices.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this);
}
function ProductChoices() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "border-y border-zinc-200 bg-zinc-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-4xl text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center gap-2 rounded-full border border-[#4A90E2]/30 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#1d6f42] shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                            className: "h-4 w-4",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/app/landing/product-choices.tsx",
                                            lineNumber: 234,
                                            columnNumber: 15
                                        }, this),
                                        "Excel"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/landing/product-choices.tsx",
                                    lineNumber: 233,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center gap-2 rounded-full border border-[#4A90E2]/30 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#188038] shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sheet$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Sheet$3e$__["Sheet"], {
                                            className: "h-4 w-4",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/app/landing/product-choices.tsx",
                                            lineNumber: 238,
                                            columnNumber: 15
                                        }, this),
                                        "Google Sheets"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/landing/product-choices.tsx",
                                    lineNumber: 237,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/landing/product-choices.tsx",
                            lineNumber: 232,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl",
                            children: "Your spreadsheet is still the boss—we just give it superpowers"
                        }, void 0, false, {
                            fileName: "[project]/app/landing/product-choices.tsx",
                            lineNumber: 242,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/landing/product-choices.tsx",
                    lineNumber: 231,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4",
                    children: plans.map((plan)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(PlanCard, {
                            plan: plan
                        }, plan.id, false, {
                            fileName: "[project]/app/landing/product-choices.tsx",
                            lineNumber: 249,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/landing/product-choices.tsx",
                    lineNumber: 247,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/landing/product-choices.tsx",
            lineNumber: 230,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/landing/product-choices.tsx",
        lineNumber: 229,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/landing/scroll-fade-in-image.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollFadeInImage",
    ()=>ScrollFadeInImage
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ScrollFadeInImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ScrollFadeInImage() from the server but ScrollFadeInImage is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/landing/scroll-fade-in-image.tsx <module evaluation>", "ScrollFadeInImage");
}),
"[project]/app/landing/scroll-fade-in-image.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollFadeInImage",
    ()=>ScrollFadeInImage
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ScrollFadeInImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ScrollFadeInImage() from the server but ScrollFadeInImage is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/landing/scroll-fade-in-image.tsx", "ScrollFadeInImage");
}),
"[project]/app/landing/scroll-fade-in-image.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$landing$2f$scroll$2d$fade$2d$in$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/landing/scroll-fade-in-image.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$landing$2f$scroll$2d$fade$2d$in$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/landing/scroll-fade-in-image.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$landing$2f$scroll$2d$fade$2d$in$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/config/website-assets.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WEBSITE_ASSETS",
    ()=>WEBSITE_ASSETS
]);
const SUPABASE_WEBSITE_ASSETS_BASE_URL = "https://pwooqmqdershicxpnfuo.supabase.co/storage/v1/object/public/website_assets";
const WEBSITE_ASSETS = {
    landingLogo: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/ShiftBob-circle-logo-light-300x.png`,
    landingHero: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/landing-hero-power.png`,
    landingEmployeePhoto: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/landing-employee-photo.png`,
    landingEuCompliance: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/landing-eu-compliance.png`
};
}),
"[project]/app/landing/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LandingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$apple$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Apple$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/apple.js [app-rsc] (ecmascript) <export default as Apple>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-rsc] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$landing$2f$product$2d$choices$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/landing/product-choices.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$landing$2f$scroll$2d$fade$2d$in$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/landing/scroll-fade-in-image.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$website$2d$assets$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/website-assets.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const europeanLanguages = [
    {
        code: "bg",
        label: "🇧🇬 Български"
    },
    {
        code: "hr",
        label: "🇭🇷 Hrvatski"
    },
    {
        code: "cs",
        label: "🇨🇿 Čeština"
    },
    {
        code: "da",
        label: "🇩🇰 Dansk"
    },
    {
        code: "nl",
        label: "🇳🇱 Nederlands"
    },
    {
        code: "en",
        label: "🇬🇧 English"
    },
    {
        code: "et",
        label: "🇪🇪 Eesti"
    },
    {
        code: "fi",
        label: "🇫🇮 Suomi"
    },
    {
        code: "fr",
        label: "🇫🇷 Français"
    },
    {
        code: "de",
        label: "🇩🇪 Deutsch"
    },
    {
        code: "el",
        label: "🇬🇷 Ελληνικά"
    },
    {
        code: "hu",
        label: "🇭🇺 Magyar"
    },
    {
        code: "ga",
        label: "🇮🇪 Gaeilge"
    },
    {
        code: "it",
        label: "🇮🇹 Italiano"
    },
    {
        code: "lv",
        label: "🇱🇻 Latviešu"
    },
    {
        code: "lt",
        label: "🇱🇹 Lietuvių"
    },
    {
        code: "mt",
        label: "🇲🇹 Malti"
    },
    {
        code: "pl",
        label: "🇵🇱 Polski"
    },
    {
        code: "pt",
        label: "🇵🇹 Português"
    },
    {
        code: "ro",
        label: "🇷🇴 Română"
    },
    {
        code: "sk",
        label: "🇸🇰 Slovenčina"
    },
    {
        code: "sl",
        label: "🇸🇮 Slovenščina"
    },
    {
        code: "es",
        label: "🇪🇸 Español"
    },
    {
        code: "sv",
        label: "🇸🇪 Svenska"
    }
];
function LandingPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-full bg-white text-zinc-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                "data-version": "landing-v2",
                className: "sticky top-0 z-50 border-b border-zinc-200/70 bg-white/95 backdrop-blur",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$website$2d$assets$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WEBSITE_ASSETS"].landingLogo,
                                    alt: "ShiftBob logo",
                                    width: 300,
                                    height: 300,
                                    className: "h-16 w-16 object-contain sm:h-20 sm:w-20",
                                    priority: true,
                                    unoptimized: true
                                }, void 0, false, {
                                    fileName: "[project]/app/landing/page.tsx",
                                    lineNumber: 44,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl font-bold tracking-tight sm:text-3xl",
                                    children: "shiftBOB.io"
                                }, void 0, false, {
                                    fileName: "[project]/app/landing/page.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/landing/page.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center justify-end gap-2 sm:gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/login",
                                    className: "rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900",
                                    children: "Login"
                                }, void 0, false, {
                                    fileName: "[project]/app/landing/page.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "sr-only",
                                    htmlFor: "landing-language",
                                    children: "Choose language"
                                }, void 0, false, {
                                    fileName: "[project]/app/landing/page.tsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "landing-language",
                                    defaultValue: "en",
                                    className: "max-w-44 rounded-full border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 outline-none transition focus:border-[#4A90E2] sm:max-w-52 sm:text-sm",
                                    children: europeanLanguages.map((language)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: language.code,
                                            children: language.label
                                        }, language.code, false, {
                                            fileName: "[project]/app/landing/page.tsx",
                                            lineNumber: 73,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/landing/page.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/login",
                                    className: "rounded-full bg-[#4A90E2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3A7FD1]",
                                    children: "Try for free"
                                }, void 0, false, {
                                    fileName: "[project]/app/landing/page.tsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/landing/page.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/landing/page.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/landing/page.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "relative isolate overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat",
                                style: {
                                    backgroundImage: `url('${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$website$2d$assets$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WEBSITE_ASSETS"].landingHero}')`
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/landing/page.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_20%,rgba(255,255,255,0)_80%,rgba(255,255,255,0.95)_100%)]"
                            }, void 0, false, {
                                fileName: "[project]/app/landing/page.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                        fileName: "[project]/app/landing/page.tsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        "data-hero-version": "v3",
                                        className: "justify-self-end rounded-3xl border border-white/70 bg-white/80 p-8 text-center shadow-xl backdrop-blur-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90E2]",
                                                children: "Shift Scheduling"
                                            }, void 0, false, {
                                                fileName: "[project]/app/landing/page.tsx",
                                                lineNumber: 103,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "mt-3 max-w-xl text-3xl font-black uppercase leading-[1.05] text-zinc-900 sm:text-4xl lg:text-5xl",
                                                children: "Give Your Excel Shift Plan Extra Power 💥"
                                            }, void 0, false, {
                                                fileName: "[project]/app/landing/page.tsx",
                                                lineNumber: 106,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/landing/page.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/page.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/landing/page.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-18 sm:px-6 sm:py-24 md:grid-cols-5 md:gap-14",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center md:col-span-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-5 flex items-center justify-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm sm:text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$apple$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Apple$3e$__["Apple"], {
                                                        className: "h-4 w-4",
                                                        "aria-hidden": "true"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/landing/page.tsx",
                                                        lineNumber: 117,
                                                        columnNumber: 17
                                                    }, this),
                                                    "App Store"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/landing/page.tsx",
                                                lineNumber: 116,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm sm:text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                        className: "h-4 w-4",
                                                        "aria-hidden": "true"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/landing/page.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Google Play"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/landing/page.tsx",
                                                lineNumber: 120,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/landing/page.tsx",
                                        lineNumber: 115,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl",
                                        children: [
                                            "You keep the spreadsheet.",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/app/landing/page.tsx",
                                                lineNumber: 127,
                                                columnNumber: 15
                                            }, this),
                                            "Your team get the app."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/landing/page.tsx",
                                        lineNumber: 125,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-4 text-base leading-relaxed text-zinc-800 sm:text-lg",
                                        children: "Give your team the modern, lightning-fast mobile experience they expect. Instead of zooming in on static PDFs or navigating messy WhatsApp groups, your employees get a sleek, native app with a crystal-clear overview of their shifts right in their pockets. It empowers them to seamlessly request shift swaps, pick up open hours, and manage their work life on the go. With instant push notifications for every update, communication chaos is completely eliminated, ensuring everyone is always connected and on the exact same page."
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/page.tsx",
                                        lineNumber: 130,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/page.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center gap-4 md:col-span-2 md:items-end md:justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$landing$2f$scroll$2d$fade$2d$in$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ScrollFadeInImage"], {}, void 0, false, {
                                    fileName: "[project]/app/landing/page.tsx",
                                    lineNumber: 142,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/landing/page.tsx",
                                lineNumber: 141,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/landing/page.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-18 sm:px-6 sm:pb-24 md:grid-cols-5 md:gap-14",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center md:col-span-2 md:justify-start",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$landing$2f$scroll$2d$fade$2d$in$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ScrollFadeInImage"], {
                                    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$website$2d$assets$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WEBSITE_ASSETS"].landingEuCompliance,
                                    alt: "Team compliance and schedule overview"
                                }, void 0, false, {
                                    fileName: "[project]/app/landing/page.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/landing/page.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center md:col-span-3 md:text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl",
                                        children: "Bulletproof EU Compliance. Zero Effort."
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-4 text-base leading-relaxed text-zinc-800 sm:text-lg",
                                        children: "Start by uploading your Excel schedule, and ShiftBob instantly scans the data to flag any violations, like the mandatory 11-hour daily rest rule. When you roll out the mobile app to your team, the platform acts as a strict gatekeeper, actively blocking staff from swapping or picking up shifts if the change breaks labor laws. Finally, with our full online Autopilot, compliance becomes completely hands-off. The engine automatically generates a 100% compliant schedule from scratch, perfectly balancing legal requirements with your team's personal preferences before you even review it."
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/page.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/page.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/landing/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$landing$2f$product$2d$choices$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ProductChoices"], {}, void 0, false, {
                        fileName: "[project]/app/landing/page.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/landing/page.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "border-t border-zinc-200 bg-zinc-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto w-full max-w-7xl px-4 py-6 text-center text-sm text-zinc-700 sm:px-6",
                    children: "P.S. Creations - Vlněna 5 - 602 00 Brno-střed - Czech Republic - support@shiftbob.io"
                }, void 0, false, {
                    fileName: "[project]/app/landing/page.tsx",
                    lineNumber: 176,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/landing/page.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/landing/page.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/landing/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/landing/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0_ii4.w._.js.map