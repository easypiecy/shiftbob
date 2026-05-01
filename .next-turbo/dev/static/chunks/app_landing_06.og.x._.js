(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/landing/product-choices.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductChoices",
    ()=>ProductChoices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sheet.js [app-client] (ecmascript) <export default as Sheet>");
"use client";
;
;
;
const plans = [
    {
        id: "foundation",
        title: "The Foundation",
        subtitle: "Free Spreadsheet & Checker",
        price: "0 EUR",
        period: "Forever.",
        description: "The ultimate Excel template to keep your schedule organized and legal.",
        features: [
            "Professional, human-readable ShiftBob Excel template",
            "Built-in data validation & error prevention",
            "1 Free EU-compliance check per day",
            "Instant highlight of 11-hour rule violations"
        ],
        ctas: [
            {
                label: "Download Template",
                href: "/login",
                style: "secondary"
            },
            {
                label: "Upload & Check Free",
                href: "/login",
                style: "primary"
            }
        ]
    },
    {
        id: "pro-planner",
        title: "The Pro Planner",
        subtitle: "Unlimited Checker",
        price: "49 EUR",
        period: "/ month",
        description: "For managers who iterate. Build your schedule in Excel and verify it infinitely.",
        features: [
            "Everything in the Free plan",
            "Unlimited EU-compliance checks",
            "Secure cloud storage of all past schedules",
            "Priority email support",
            "Export compliance reports"
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
        price: "29 EUR",
        period: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                "/ month + ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    children: "1 EUR"
                }, void 0, false, {
                    fileName: "[project]/app/landing/product-choices.tsx",
                    lineNumber: 81,
                    columnNumber: 19
                }, ("TURBOPACK compile-time value", void 0)),
                " per user"
            ]
        }, void 0, true),
        description: "You keep the spreadsheet. Your staff gets the app. Bridge the gap completely.",
        features: [
            "Import shifts directly from your Excel file",
            "Native iOS & Android app for all employees",
            "In-app shift swapping & open shift market",
            "Manager Approval Dashboard for web & mobile",
            "Automated shift reminders & push notifications"
        ],
        ctas: [
            {
                label: "Start 3 Employees Free",
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
        price: "59 EUR",
        period: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                "/ month + ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    children: "1 EUR"
                }, void 0, false, {
                    fileName: "[project]/app/landing/product-choices.tsx",
                    lineNumber: 109,
                    columnNumber: 19
                }, ("TURBOPACK compile-time value", void 0)),
                " per user"
            ]
        }, void 0, true),
        description: "Ditch the spreadsheet entirely. Let our engine build and manage your schedule.",
        features: [
            "100% online Drag & Drop Schedule Builder",
            "Auto-generate shifts based on EU laws",
            "Match shifts with employee preferences automatically",
            "Self-driving shift swaps (No manager approval needed)",
            "Advanced payroll & overtime exports"
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: `inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition ${styles}`,
        children: label
    }, void 0, false, {
        fileName: "[project]/app/landing/product-choices.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
_c = CtaButton;
function PlanCard({ plan }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm",
        children: [
            plan.badge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute -top-3 right-4 rounded-full bg-[#4A90E2] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white",
                children: plan.badge
            }, void 0, false, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 161,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "-mx-6 -mt-6 mb-2 flex min-h-[96px] items-start justify-between gap-3 rounded-t-2xl bg-black px-6 py-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-2xl font-bold tracking-tight text-white",
                            children: plan.title
                        }, void 0, false, {
                            fileName: "[project]/app/landing/product-choices.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-sm font-semibold text-white/85",
                            children: plan.subtitle
                        }, void 0, false, {
                            fileName: "[project]/app/landing/product-choices.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/landing/product-choices.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-[78px] flex-col justify-end",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-3xl font-black text-zinc-900",
                        children: plan.price
                    }, void 0, false, {
                        fileName: "[project]/app/landing/product-choices.tsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-zinc-600",
                        children: plan.period
                    }, void 0, false, {
                        fileName: "[project]/app/landing/product-choices.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 174,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 min-h-[84px] text-sm leading-6 text-zinc-700",
                children: plan.description
            }, void 0, false, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "mt-5 flex-1 space-y-2 text-sm text-zinc-800",
                children: plan.features.map((feature)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-0.5 text-[#4A90E2]",
                                children: "✅"
                            }, void 0, false, {
                                fileName: "[project]/app/landing/product-choices.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: feature
                            }, void 0, false, {
                                fileName: "[project]/app/landing/product-choices.tsx",
                                lineNumber: 186,
                                columnNumber: 13
                            }, this)
                        ]
                    }, feature, true, {
                        fileName: "[project]/app/landing/product-choices.tsx",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 flex min-h-[96px] flex-col gap-2",
                children: plan.ctas.map((cta)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CtaButton, {
                        ...cta
                    }, cta.label, false, {
                        fileName: "[project]/app/landing/product-choices.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/landing/product-choices.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/landing/product-choices.tsx",
        lineNumber: 159,
        columnNumber: 5
    }, this);
}
_c1 = PlanCard;
function ProductChoices() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "border-y border-zinc-200 bg-zinc-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-4xl text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center gap-2 rounded-full border border-[#4A90E2]/30 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#1d6f42] shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                            className: "h-4 w-4",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/app/landing/product-choices.tsx",
                                            lineNumber: 207,
                                            columnNumber: 15
                                        }, this),
                                        "Excel"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/landing/product-choices.tsx",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center gap-2 rounded-full border border-[#4A90E2]/30 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#188038] shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sheet$3e$__["Sheet"], {
                                            className: "h-4 w-4",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/app/landing/product-choices.tsx",
                                            lineNumber: 211,
                                            columnNumber: 15
                                        }, this),
                                        "Google Sheets / Docs"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/landing/product-choices.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/landing/product-choices.tsx",
                            lineNumber: 205,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl",
                            children: "Your spreadsheet is still the boss—we just give it superpowers"
                        }, void 0, false, {
                            fileName: "[project]/app/landing/product-choices.tsx",
                            lineNumber: 215,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/landing/product-choices.tsx",
                    lineNumber: 204,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4",
                    children: plans.map((plan)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlanCard, {
                            plan: plan
                        }, plan.id, false, {
                            fileName: "[project]/app/landing/product-choices.tsx",
                            lineNumber: 222,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/landing/product-choices.tsx",
                    lineNumber: 220,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/landing/product-choices.tsx",
            lineNumber: 203,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/landing/product-choices.tsx",
        lineNumber: 202,
        columnNumber: 5
    }, this);
}
_c2 = ProductChoices;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "CtaButton");
__turbopack_context__.k.register(_c1, "PlanCard");
__turbopack_context__.k.register(_c2, "ProductChoices");
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
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ScrollFadeInImage() {
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
        className: `mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 shadow-lg transition-all duration-700 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: "/landing-employee-photo",
            alt: "Employee checking shifts on mobile app",
            width: 800,
            height: 800,
            className: "h-full w-full object-cover",
            unoptimized: true
        }, void 0, false, {
            fileName: "[project]/app/landing/scroll-fade-in-image.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/landing/scroll-fade-in-image.tsx",
        lineNumber: 32,
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

//# sourceMappingURL=app_landing_06.og.x._.js.map