(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/landing/sales-bot-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SalesBotWidget",
    ()=>SalesBotWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function SalesBotWidget({ languageCode, iconUrl, logoUrl, buttonLabel, panelTitle, initialAssistantMessage, inputPlaceholder, sendLabel, closeLabel, supportButtonLabel, supportPanelTitle, supportSubjectLabel, supportMessageLabel, supportNameLabel, supportEmailLabel, supportSubmitLabel, supportSuccessTemplate, supportNeedIdentityMessage, resetLabel }) {
    _s();
    const headerLogoSrc = logoUrl?.trim() || "/ShiftBob-circle-logo-dark-1024.png";
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [supportOpen, setSupportOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [supportLoading, setSupportLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [supportSubject, setSupportSubject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [supportMessage, setSupportMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [supportName, setSupportName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [supportEmail, setSupportEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const hasMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SalesBotWidget.useMemo[hasMessages]": ()=>messages.length > 0
    }["SalesBotWidget.useMemo[hasMessages]"], [
        messages.length
    ]);
    function resetChat() {
        setMessages([]);
        setInput("");
        setSupportOpen(false);
        setSupportSubject("");
        setSupportMessage("");
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SalesBotWidget.useEffect": ()=>{
            // Language switch means a fresh conversation context.
            resetChat();
        }
    }["SalesBotWidget.useEffect"], [
        languageCode
    ]);
    function addAssistantMessage(text) {
        setMessages((prev)=>[
                ...prev,
                {
                    id: `assistant-${Date.now()}`,
                    role: "assistant",
                    text,
                    ctaLabel: null,
                    ctaHref: null
                }
            ]);
    }
    async function initializeChat(force = false) {
        if (!force && (hasMessages || loading)) return;
        setMessages([
            {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                text: initialAssistantMessage
            }
        ]);
        try {
            const res = await fetch("/api/salesbot/session", {
                method: "GET"
            });
            const data = await res.json();
            if (!data.ok) return;
            const nextSession = {
                loggedIn: Boolean(data.loggedIn),
                name: data.name?.trim() || "",
                email: data.email?.trim() || ""
            };
            setSession(nextSession);
            if (!nextSession.loggedIn) {
                addAssistantMessage(supportNeedIdentityMessage);
            }
            setSupportName(nextSession.name);
            setSupportEmail(nextSession.email);
        } catch  {
        // Ignore session fetch errors and allow normal chat usage.
        }
    }
    async function sendMessage(message) {
        const trimmed = message.trim();
        if (!trimmed || loading) return;
        const userMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            text: trimmed
        };
        setMessages((prev)=>[
                ...prev,
                userMessage
            ]);
        setInput("");
        setLoading(true);
        const latestAssistantMatch = [
            ...messages
        ].reverse().find((m)=>m.role === "assistant" && m.matchedKnowledgeId)?.matchedKnowledgeId || null;
        try {
            const res = await fetch("/api/salesbot/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    languageCode,
                    message: trimmed,
                    contextKnowledgeId: latestAssistantMatch
                })
            });
            const data = await res.json();
            const reply = data.ok && data.reply ? data.reply : "Sorry, I could not answer right now. Please try again.";
            setMessages((prev)=>[
                    ...prev,
                    {
                        id: `assistant-${Date.now() + 1}`,
                        role: "assistant",
                        text: reply,
                        ctaLabel: data.ctaLabel?.trim() || null,
                        ctaHref: data.ctaHref?.trim() || null,
                        matchedKnowledgeId: data.matchedKnowledgeId?.trim() || null
                    }
                ]);
        } finally{
            setLoading(false);
        }
    }
    async function onSubmit(e) {
        e.preventDefault();
        await sendMessage(input);
    }
    async function submitSupportTicket(e) {
        e.preventDefault();
        if (!supportSubject.trim() || !supportMessage.trim() || supportLoading) return;
        setSupportLoading(true);
        try {
            const res = await fetch("/api/salesbot/support-ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    languageCode,
                    subject: supportSubject.trim(),
                    message: supportMessage.trim(),
                    name: supportName.trim(),
                    email: supportEmail.trim()
                })
            });
            const data = await res.json();
            if (!data.ok) {
                addAssistantMessage(data.error || "Could not submit support ticket.");
                if (data.requiresIdentity) {
                    setSupportOpen(true);
                }
                return;
            }
            addAssistantMessage(supportSuccessTemplate.replace("{ticketId}", data.ticketId || "created"));
            setSupportOpen(false);
            setSupportSubject("");
            setSupportMessage("");
        } finally{
            setSupportLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: async ()=>{
                    setOpen((value)=>!value);
                    if (!open) {
                        await initializeChat();
                    }
                },
                className: "fixed bottom-5 right-5 z-[70] inline-flex items-center justify-center p-0 transition hover:scale-105",
                "aria-label": buttonLabel,
                title: buttonLabel,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: iconUrl,
                    alt: "",
                    width: 84,
                    height: 84,
                    className: "h-20 w-20 object-contain [filter:drop-shadow(0_0_12px_rgba(255,255,255,0.98))]"
                }, void 0, false, {
                    fileName: "[project]/app/landing/sales-bot-widget.tsx",
                    lineNumber: 240,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                lineNumber: 228,
                columnNumber: 7
            }, this),
            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "fixed bottom-24 right-6 z-[70] flex h-[540px] w-[min(92vw,390px)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "flex items-center justify-between border-b border-[#3A7FD1] bg-[#4A90E2] px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "flex items-center gap-2 text-base font-semibold text-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center justify-center rounded-md bg-black p-0.5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: headerLogoSrc,
                                            alt: "",
                                            width: 24,
                                            height: 24,
                                            className: "h-6 w-6 object-contain"
                                        }, void 0, false, {
                                            fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                            lineNumber: 254,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 253,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: panelTitle
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 262,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                lineNumber: 252,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            resetChat();
                                            void initializeChat(true);
                                        },
                                        className: "rounded-md p-1 text-white/85 hover:bg-white/15 hover:text-white",
                                        "aria-label": resetLabel,
                                        title: resetLabel,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                            lineNumber: 275,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 265,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setOpen(false),
                                        className: "rounded-md p-1 text-white/90 hover:bg-white/15 hover:text-white",
                                        "aria-label": closeLabel,
                                        title: closeLabel,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                            lineNumber: 284,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 277,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                lineNumber: 264,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                        lineNumber: 251,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 space-y-3 overflow-y-auto bg-zinc-50 px-3 py-3",
                        children: [
                            messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: message.role === "assistant" ? "max-w-[92%] rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800" : "ml-auto max-w-[92%] rounded-xl bg-[#4A90E2] px-3 py-2 text-sm text-white",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "whitespace-pre-wrap",
                                            children: message.text
                                        }, void 0, false, {
                                            fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                            lineNumber: 299,
                                            columnNumber: 17
                                        }, this),
                                        message.role === "assistant" && message.ctaLabel && message.ctaHref ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: message.ctaHref,
                                            className: "mt-2 inline-flex text-sm font-semibold text-[#3A7FD1] underline underline-offset-2 hover:text-[#2b69af]",
                                            children: message.ctaLabel
                                        }, void 0, false, {
                                            fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                            lineNumber: 301,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, message.id, true, {
                                    fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                    lineNumber: 291,
                                    columnNumber: 15
                                }, this)),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "h-3.5 w-3.5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 312,
                                        columnNumber: 17
                                    }, this),
                                    "Thinking..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                lineNumber: 311,
                                columnNumber: 15
                            }, this) : null,
                            supportOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                onSubmit: submitSupportTicket,
                                className: "space-y-2 rounded-xl border border-zinc-200 bg-white p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold uppercase tracking-wide text-zinc-500",
                                        children: supportPanelTitle
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 322,
                                        columnNumber: 17
                                    }, this),
                                    !session?.loggedIn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-2 sm:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: supportName,
                                                onChange: (e)=>setSupportName(e.target.value),
                                                placeholder: supportNameLabel,
                                                className: "h-9 rounded-md border border-zinc-300 px-2 text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                                lineNumber: 327,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: supportEmail,
                                                onChange: (e)=>setSupportEmail(e.target.value),
                                                placeholder: supportEmailLabel,
                                                className: "h-9 rounded-md border border-zinc-300 px-2 text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                                lineNumber: 333,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 326,
                                        columnNumber: 19
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: supportSubject,
                                        onChange: (e)=>setSupportSubject(e.target.value),
                                        placeholder: supportSubjectLabel,
                                        className: "h-9 w-full rounded-md border border-zinc-300 px-2 text-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 341,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        rows: 4,
                                        value: supportMessage,
                                        onChange: (e)=>setSupportMessage(e.target.value),
                                        placeholder: supportMessageLabel,
                                        className: "w-full rounded-md border border-zinc-300 px-2 py-2 text-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 347,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-end gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setSupportOpen(false),
                                                className: "rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-700",
                                                children: closeLabel
                                            }, void 0, false, {
                                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                                lineNumber: 355,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                disabled: supportLoading || !supportSubject.trim() || !supportMessage.trim() || !session?.loggedIn && (!supportName.trim() || !supportEmail.trim()),
                                                className: "inline-flex items-center gap-1.5 rounded-md bg-[#4A90E2] px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50",
                                                children: [
                                                    supportLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        className: "h-3.5 w-3.5 animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                                        lineNumber: 372,
                                                        columnNumber: 39
                                                    }, this) : null,
                                                    supportSubmitLabel
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                                lineNumber: 362,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 354,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                lineNumber: 318,
                                columnNumber: 15
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                        lineNumber: 289,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: onSubmit,
                        className: "border-t border-zinc-200 bg-white p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-2 flex justify-start",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setSupportOpen((value)=>!value),
                                    className: "rounded-full border border-zinc-300 bg-yellow-100/60 px-3 py-1.5 text-sm text-zinc-700 hover:bg-yellow-100",
                                    children: supportButtonLabel
                                }, void 0, false, {
                                    fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                    lineNumber: 382,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                lineNumber: 381,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: input,
                                        onChange: (e)=>setInput(e.target.value),
                                        placeholder: inputPlaceholder,
                                        className: "h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none"
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 391,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: loading || !input.trim(),
                                        className: "inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#4A90E2] px-3 text-xs font-semibold text-white transition hover:bg-[#3A7FD1] disabled:opacity-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                                lineNumber: 402,
                                                columnNumber: 17
                                            }, this),
                                            sendLabel
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 397,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                lineNumber: 390,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                        lineNumber: 380,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                lineNumber: 250,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true);
}
_s(SalesBotWidget, "XVezJfCKob5eGHPi9UzaGsnQDWw=");
_c = SalesBotWidget;
var _c;
__turbopack_context__.k.register(_c, "SalesBotWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/data:c09bcc [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "setUiLanguageAction",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"4060c1b5d6843d5ed8308820011f0b2317f03d3595":{"name":"setUiLanguageAction"}},"src/app/ui-language-actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4060c1b5d6843d5ed8308820011f0b2317f03d3595", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "setUiLanguageAction");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/ui-language.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Cookie-navn — delt mellem server actions, RSC og klient (OAuth m.m.). */ __turbopack_context__.s([
    "SUPPORTED_UI_LANGUAGE_CODES",
    ()=>SUPPORTED_UI_LANGUAGE_CODES,
    "UI_LANGUAGE_COOKIE",
    ()=>UI_LANGUAGE_COOKIE,
    "UI_LANGUAGE_LABELS",
    ()=>UI_LANGUAGE_LABELS,
    "isSupportedUiLanguage",
    ()=>isSupportedUiLanguage,
    "resolveLanguageFromAcceptLanguage",
    ()=>resolveLanguageFromAcceptLanguage
]);
const UI_LANGUAGE_COOKIE = "ui_language";
const SUPPORTED_UI_LANGUAGE_CODES = [
    "en-US",
    "en-IE",
    "de",
    "de-AT",
    "nl",
    "nl-BE",
    "bg",
    "hr",
    "cs",
    "da",
    "et",
    "fi",
    "fr",
    "el",
    "hu",
    "it",
    "lv",
    "lt",
    "lb",
    "mt",
    "pl",
    "pt",
    "ro",
    "sk",
    "sl",
    "es",
    "sv"
];
const SUPPORTED = new Set(SUPPORTED_UI_LANGUAGE_CODES);
function isSupportedUiLanguage(code) {
    return SUPPORTED.has(code);
}
const UI_LANGUAGE_LABELS = {
    "en-US": "English (United States)",
    "en-IE": "English (Ireland)",
    de: "German",
    "de-AT": "German (Austria)",
    nl: "Dutch",
    "nl-BE": "Dutch (Belgium)",
    bg: "Bulgarian",
    hr: "Croatian",
    cs: "Czech",
    da: "Danish",
    et: "Estonian",
    fi: "Finnish",
    fr: "French",
    el: "Greek",
    hu: "Hungarian",
    it: "Italian",
    lv: "Latvian",
    lt: "Lithuanian",
    lb: "Luxembourgish",
    mt: "Maltese",
    pl: "Polish",
    pt: "Portuguese",
    ro: "Romanian",
    sk: "Slovak",
    sl: "Slovenian",
    es: "Spanish",
    sv: "Swedish"
};
function resolveLanguageFromAcceptLanguage(header) {
    if (!header?.trim()) return "en-US";
    const parts = header.split(",").map((part)=>{
        const [tag, ...params] = part.trim().split(";");
        let q = 1;
        for (const p of params){
            const s = p.trim();
            if (s.startsWith("q=")) {
                const n = parseFloat(s.slice(2));
                if (!Number.isNaN(n)) q = n;
            }
        }
        return {
            tag: tag.trim().replace(/_/g, "-"),
            q
        };
    });
    parts.sort((a, b)=>b.q - a.q);
    for (const { tag } of parts){
        for (const code of SUPPORTED_UI_LANGUAGE_CODES){
            if (code.toLowerCase() === tag.toLowerCase()) return code;
        }
        const primary = tag.split("-")[0]?.toLowerCase();
        if (!primary) continue;
        if (primary === "en") return "en-US";
        for (const code of SUPPORTED_UI_LANGUAGE_CODES){
            if (code.toLowerCase() === primary) return code;
        }
    }
    return "en-US";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/ui-language-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "persistUiLanguageCookieClient",
    ()=>persistUiLanguageCookieClient,
    "syncLoginUiLanguageFromPicker",
    ()=>syncLoginUiLanguageFromPicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ui-language.ts [app-client] (ecmascript)");
;
function persistUiLanguageCookieClient(languageCode) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSupportedUiLanguage"])(languageCode)) return;
    if (typeof document === "undefined") return;
    const maxAge = 60 * 60 * 24 * 365;
    const parts = [
        `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UI_LANGUAGE_COOKIE"]}=${encodeURIComponent(languageCode)}`,
        "path=/",
        `max-age=${maxAge}`,
        "samesite=lax"
    ];
    if (("TURBOPACK compile-time value", "object") !== "undefined" && window.location.protocol === "https:") {
        parts.push("secure");
    }
    document.cookie = parts.join("; ");
}
function syncLoginUiLanguageFromPicker() {
    if (typeof document === "undefined") return;
    const el = document.getElementById("login-ui-language");
    const v = el?.value?.trim();
    if (v && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSupportedUiLanguage"])(v)) persistUiLanguageCookieClient(v);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/login/login-language-picker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginLanguagePicker",
    ()=>LoginLanguagePicker,
    "UiLanguageSelect",
    ()=>UiLanguageSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/languages.js [app-client] (ecmascript) <export default as Languages>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$3a$c09bcc__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/data:c09bcc [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ui-language-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ui-language.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function UiLanguageSelect({ currentLanguage, ariaLabel, id = "ui-language", variant = "default" }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [pending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    function onChange(e) {
        const next = e.target.value;
        if (next === currentLanguage) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistUiLanguageCookieClient"])(next);
        startTransition(async ()=>{
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$3a$c09bcc__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["setUiLanguageAction"])(next);
            router.refresh();
        });
    }
    const selectClass = variant === "light" ? "max-w-[min(18rem,calc(100vw-6rem))] rounded-md border border-black/20 bg-white py-1.5 pl-2 pr-8 text-sm text-black shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:opacity-60" : "max-w-[min(18rem,calc(100vw-6rem))] rounded-md border border-zinc-200 bg-white py-1.5 pl-2 pr-8 text-sm text-zinc-800 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-60";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-w-0 items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__["Languages"], {
                className: variant === "light" ? "h-5 w-5 shrink-0 text-black/60" : "h-5 w-5 shrink-0 text-zinc-400",
                "aria-hidden": true,
                strokeWidth: 1.75
            }, void 0, false, {
                fileName: "[project]/app/login/login-language-picker.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                className: "sr-only",
                children: ariaLabel
            }, void 0, false, {
                fileName: "[project]/app/login/login-language-picker.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                id: id,
                value: currentLanguage,
                onChange: onChange,
                disabled: pending,
                "aria-label": ariaLabel,
                className: selectClass,
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORTED_UI_LANGUAGE_CODES"].map((code)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: code,
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ui$2d$language$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UI_LANGUAGE_LABELS"][code] ?? code
                    }, code, false, {
                        fileName: "[project]/app/login/login-language-picker.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/login/login-language-picker.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/login/login-language-picker.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_s(UiLanguageSelect, "bS6iYTA6A+xoIWTYyEHZ+6tNDOQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
_c = UiLanguageSelect;
function LoginLanguagePicker({ currentLanguage, ariaLabel }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed right-4 top-4 z-50 flex items-center gap-2 sm:right-6 sm:top-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UiLanguageSelect, {
            currentLanguage: currentLanguage,
            ariaLabel: ariaLabel,
            id: "login-ui-language"
        }, void 0, false, {
            fileName: "[project]/app/login/login-language-picker.tsx",
            lineNumber: 85,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/login/login-language-picker.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_c1 = LoginLanguagePicker;
var _c, _c1;
__turbopack_context__.k.register(_c, "UiLanguageSelect");
__turbopack_context__.k.register(_c1, "LoginLanguagePicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/employer-signup/employer-signup-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmployerSignupForm",
    ()=>EmployerSignupForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const DEFAULT_COPY_EN = {
    labelProduct: "Product",
    productBasic: "Basic (free)",
    productProPlanner: "Pro Planner",
    productHybridApp: "Hybrid App",
    productAutopilot: "Autopilot",
    labelCompanyName: "Company name",
    labelFirstName: "First name",
    labelLastName: "Last name",
    labelEmail: "Email",
    labelVat: "VAT / company number",
    labelPhone: "Phone",
    labelAddress: "Address",
    labelPostalCode: "Postal code",
    labelCity: "City",
    labelCountry: "Country",
    placeholderSelectCountry: "Select country",
    labelEmployeeCount: "Number of employees",
    labelCardholderName: "Cardholder name",
    labelCardNumber: "Card number",
    labelCardExpiry: "Expiry (MM/YY)",
    labelCardCvc: "CVC",
    placeholderCompanyName: "e.g. Sunrise Cafe Ltd.",
    placeholderFirstName: "First name",
    placeholderLastName: "Last name",
    placeholderEmail: "name@company.com",
    placeholderCardholderName: "Name on card",
    placeholderCardNumber: "1234 5678 9012 3456",
    placeholderCardExpiry: "MM/YY",
    placeholderCardCvc: "123",
    marketingConsentText: "By placing an order, you accept that ShiftBob may send marketing emails. You can unsubscribe at any time.",
    buttonBack: "Back",
    buttonNext: "Next",
    buttonDownloadExcel: "Download Excel schedule",
    buttonCreateCompany: "Create company",
    buttonStartAccountTemplate: "Start {productName} {price} & create account",
    buttonSending: "Sending...",
    errorRequiredFieldsStep1: "Please fill in all required fields.",
    errorRequiredFieldsStep2: "Please fill in all fields in step 2.",
    errorConsentRequired: "You must accept marketing emails to continue.",
    errorSubmitFailed: "Could not create the request right now. Please try again in a moment.",
    errorNetwork: "Network error. Check your connection and try again.",
    successBasicTemplate: "Thanks! We created your request ({ticketId}). The download step will be connected soon.",
    successOtherTemplate: "Thanks! We received your signup ({ticketId}). We will contact you as soon as possible."
};
const DEFAULT_COPY_DA = {
    labelProduct: "Produkt",
    productBasic: "Basic (gratis)",
    productProPlanner: "Pro Planner",
    productHybridApp: "Hybrid App",
    productAutopilot: "Autopilot",
    labelCompanyName: "Virksomhedsnavn",
    labelFirstName: "Fornavn",
    labelLastName: "Efternavn",
    labelEmail: "E-mail",
    labelVat: "CVR / VAT",
    labelPhone: "Telefon",
    labelAddress: "Adresse",
    labelPostalCode: "Postnr.",
    labelCity: "By",
    labelCountry: "Land",
    placeholderSelectCountry: "Vælg land",
    labelEmployeeCount: "Antal ansatte",
    labelCardholderName: "Kortholders navn",
    labelCardNumber: "Kortnummer",
    labelCardExpiry: "Udløb (MM/AA)",
    labelCardCvc: "CVC",
    placeholderCompanyName: "Fx Cafe Solsiden ApS",
    placeholderFirstName: "Fornavn",
    placeholderLastName: "Efternavn",
    placeholderEmail: "navn@virksomhed.dk",
    placeholderCardholderName: "Navn på kort",
    placeholderCardNumber: "1234 5678 9012 3456",
    placeholderCardExpiry: "MM/AA",
    placeholderCardCvc: "123",
    marketingConsentText: "Ved at bestille, så accepterer du at ShiftBob må sende markedsføringsmail. Det kan til enhver tid afmeldes.",
    buttonBack: "Tilbage",
    buttonNext: "Videre",
    buttonDownloadExcel: "Hent Excel vagtplan",
    buttonCreateCompany: "Opret virksomhed",
    buttonStartAccountTemplate: "Start {productName} {price} & opret konto",
    buttonSending: "Sender...",
    errorRequiredFieldsStep1: "Udfyld venligst alle obligatoriske felter.",
    errorRequiredFieldsStep2: "Udfyld venligst alle felter i trin 2.",
    errorConsentRequired: "Du skal acceptere markedsføringsmail for at fortsætte.",
    errorSubmitFailed: "Kunne ikke oprette forespørgslen lige nu. Prøv igen om et øjeblik.",
    errorNetwork: "Netværksfejl. Tjek forbindelsen og prøv igen.",
    successBasicTemplate: "Tak! Vi har oprettet din anmodning ({ticketId}). Download-trinnet kobles på snart.",
    successOtherTemplate: "Tak! Vi har modtaget din oprettelse ({ticketId}). Vi kontakter dig hurtigst muligt."
};
function resolveFallbackCopy(languageCode) {
    const code = (languageCode ?? "da").toLowerCase();
    if (code.startsWith("da")) return DEFAULT_COPY_DA;
    return DEFAULT_COPY_EN;
}
const COUNTRY_OPTIONS = [
    {
        code: "AT",
        nativeName: "Österreich"
    },
    {
        code: "BE",
        nativeName: "België / Belgique / Belgien"
    },
    {
        code: "BG",
        nativeName: "Bălgariya"
    },
    {
        code: "CH",
        nativeName: "Schweiz / Suisse / Svizzera / Svizra"
    },
    {
        code: "CY",
        nativeName: "Kypros / Kıbrıs"
    },
    {
        code: "CZ",
        nativeName: "Česko"
    },
    {
        code: "DE",
        nativeName: "Deutschland"
    },
    {
        code: "DK",
        nativeName: "Danmark"
    },
    {
        code: "EE",
        nativeName: "Eesti"
    },
    {
        code: "ES",
        nativeName: "España"
    },
    {
        code: "FI",
        nativeName: "Suomi"
    },
    {
        code: "FR",
        nativeName: "France"
    },
    {
        code: "GB",
        nativeName: "United Kingdom"
    },
    {
        code: "GR",
        nativeName: "Elláda"
    },
    {
        code: "HR",
        nativeName: "Hrvatska"
    },
    {
        code: "HU",
        nativeName: "Magyarország"
    },
    {
        code: "IE",
        nativeName: "Éire / Ireland"
    },
    {
        code: "IS",
        nativeName: "Ísland"
    },
    {
        code: "IT",
        nativeName: "Italia"
    },
    {
        code: "LI",
        nativeName: "Liechtenstein"
    },
    {
        code: "LT",
        nativeName: "Lietuva"
    },
    {
        code: "LU",
        nativeName: "Lëtzebuerg / Luxembourg"
    },
    {
        code: "LV",
        nativeName: "Latvija"
    },
    {
        code: "MT",
        nativeName: "Malta"
    },
    {
        code: "NL",
        nativeName: "Nederland"
    },
    {
        code: "NO",
        nativeName: "Norge"
    },
    {
        code: "PL",
        nativeName: "Polska"
    },
    {
        code: "PT",
        nativeName: "Portugal"
    },
    {
        code: "RO",
        nativeName: "România"
    },
    {
        code: "SE",
        nativeName: "Sverige"
    },
    {
        code: "SI",
        nativeName: "Slovenija"
    },
    {
        code: "SK",
        nativeName: "Slovensko"
    }
];
function submitLabelFor(product) {
    if (product === "basic") return "download_excel";
    return "create_company";
}
function priceForProduct(product) {
    if (product === "pro_planner") return "49 EUR";
    if (product === "hybrid_app") return "29 EUR";
    if (product === "autopilot") return "59 EUR";
    return "0 EUR";
}
function EmployerSignupForm({ initialProduct, languageCode = "da", copy: copyProp }) {
    _s();
    const copy = copyProp ?? resolveFallbackCopy(languageCode);
    const productOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EmployerSignupForm.useMemo[productOptions]": ()=>[
                {
                    id: "basic",
                    label: copy.productBasic
                },
                {
                    id: "pro_planner",
                    label: copy.productProPlanner
                },
                {
                    id: "hybrid_app",
                    label: copy.productHybridApp
                },
                {
                    id: "autopilot",
                    label: copy.productAutopilot
                }
            ]
    }["EmployerSignupForm.useMemo[productOptions]"], [
        copy
    ]);
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [product, setProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialProduct);
    const [companyName, setCompanyName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [firstName, setFirstName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [lastName, setLastName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [vat, setVat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [postalCode, setPostalCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [employeeCount, setEmployeeCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("5-20");
    const [city, setCity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [country, setCountry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [cardholderName, setCardholderName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [cardNumber, setCardNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [cardExpiry, setCardExpiry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [cardCvc, setCardCvc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [marketingConsent, setMarketingConsent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const submitLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EmployerSignupForm.useMemo[submitLabel]": ()=>submitLabelFor(product) === "download_excel" ? copy.buttonDownloadExcel : copy.buttonCreateCompany
    }["EmployerSignupForm.useMemo[submitLabel]"], [
        copy.buttonCreateCompany,
        copy.buttonDownloadExcel,
        product
    ]);
    const productLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EmployerSignupForm.useMemo[productLabel]": ()=>productOptions.find({
                "EmployerSignupForm.useMemo[productLabel]": (p)=>p.id === product
            }["EmployerSignupForm.useMemo[productLabel]"])?.label ?? copy.productBasic
    }["EmployerSignupForm.useMemo[productLabel]"], [
        copy.productBasic,
        product,
        productOptions
    ]);
    const startAccountLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EmployerSignupForm.useMemo[startAccountLabel]": ()=>{
            const price = priceForProduct(product);
            const template = copy.buttonStartAccountTemplate ?? DEFAULT_COPY_EN.buttonStartAccountTemplate;
            return template.replace("{productName}", productLabel).replace("{price}", price);
        }
    }["EmployerSignupForm.useMemo[startAccountLabel]"], [
        copy.buttonStartAccountTemplate,
        product,
        productLabel
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EmployerSignupForm.useEffect": ()=>{
            setProduct(initialProduct);
            setStep(1);
        }
    }["EmployerSignupForm.useEffect"], [
        initialProduct
    ]);
    async function submitLead(params) {
        const trimmedVat = vat.trim();
        const trimmedPhone = phone.trim();
        const trimmedAddress = address.trim();
        const trimmedPostalCode = postalCode.trim();
        const trimmedCity = city.trim();
        const trimmedCountry = country.trim().toUpperCase();
        const trimmedCardholder = cardholderName.trim();
        const trimmedCardNumber = cardNumber.trim();
        const trimmedCardExpiry = cardExpiry.trim();
        const trimmedCardCvc = cardCvc.trim();
        const details = [
            `Produkt: ${productLabel}`,
            `Virksomhed: ${params.trimmedCompanyName}`,
            `Fornavn: ${params.trimmedFirstName}`,
            `Efternavn: ${params.trimmedLastName}`,
            `E-mail: ${params.trimmedEmail}`,
            `Antal ansatte: ${employeeCount}`,
            `CVR/VAT: ${trimmedVat || "-"}`,
            `Telefon: ${trimmedPhone || "-"}`,
            `Adresse: ${trimmedAddress || "-"}`,
            `Postnr: ${trimmedPostalCode || "-"}`,
            `By: ${trimmedCity || "-"}`,
            `Land: ${trimmedCountry || "-"}`,
            `Kortholder: ${trimmedCardholder || "-"}`,
            `Kortnummer: ${trimmedCardNumber || "-"}`,
            `Udlob: ${trimmedCardExpiry || "-"}`,
            `CVC: ${trimmedCardCvc || "-"}`,
            `Marketing samtykke: ${marketingConsent ? "Ja" : "Nej"}`,
            `Flow trin: ${step}`
        ].join("\n");
        const res = await fetch("/api/salesbot/support-ticket", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                languageCode,
                subject: `Employer signup: ${productLabel}`,
                message: `Ny oprettelsesforesporgsel fra arbejdsgiver:\n\n${details}`,
                name: `${params.trimmedFirstName} ${params.trimmedLastName}`.trim(),
                email: params.trimmedEmail
            })
        });
        return await res.json();
    }
    async function onSubmit(e) {
        e.preventDefault();
        setMessage(null);
        const trimmedCompanyName = companyName.trim();
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        if (!trimmedCompanyName || !trimmedFirstName || !trimmedLastName || !trimmedEmail) {
            setMessage({
                kind: "error",
                text: copy.errorRequiredFieldsStep1
            });
            return;
        }
        if (!marketingConsent) {
            setMessage({
                kind: "error",
                text: copy.errorConsentRequired
            });
            return;
        }
        if (step === 1 && product !== "basic") {
            setStep(2);
            return;
        }
        if (step === 2) {
            const trimmedAddress = address.trim();
            const trimmedPostalCode = postalCode.trim();
            const trimmedCity = city.trim();
            const trimmedCountry = country.trim().toUpperCase();
            const trimmedVat = vat.trim();
            const trimmedPhone = phone.trim();
            const trimmedCardholder = cardholderName.trim();
            const trimmedCardNumber = cardNumber.trim();
            const trimmedCardExpiry = cardExpiry.trim();
            const trimmedCardCvc = cardCvc.trim();
            if (!trimmedVat || !trimmedPhone || !trimmedAddress || !trimmedPostalCode || !trimmedCity || !trimmedCountry || !trimmedCardholder || !trimmedCardNumber || !trimmedCardExpiry || !trimmedCardCvc) {
                setMessage({
                    kind: "error",
                    text: copy.errorRequiredFieldsStep2
                });
                return;
            }
        }
        setSubmitting(true);
        try {
            const data = await submitLead({
                trimmedCompanyName,
                trimmedFirstName,
                trimmedLastName,
                trimmedEmail
            });
            if (!data.ok) {
                setMessage({
                    kind: "error",
                    text: copy.errorSubmitFailed
                });
                return;
            }
            setMessage({
                kind: "success",
                text: product === "basic" ? copy.successBasicTemplate.replace("{ticketId}", data.ticketId) : copy.successOtherTemplate.replace("{ticketId}", data.ticketId)
            });
        } catch  {
            setMessage({
                kind: "error",
                text: copy.errorNetwork
            });
        } finally{
            setSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: (e)=>void onSubmit(e),
        className: "space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "mb-1 block text-sm font-medium text-zinc-700",
                        children: [
                            copy.labelProduct,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-red-600",
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 431,
                                columnNumber: 31
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        required: true,
                        value: product,
                        onChange: (e)=>setProduct(e.target.value),
                        className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
                        children: productOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: option.id,
                                children: option.label
                            }, option.id, false, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 440,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 433,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                lineNumber: 429,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 sm:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sm:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-1 block text-sm font-medium text-zinc-700",
                                children: [
                                    copy.labelCompanyName,
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-red-600",
                                        children: "*"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 450,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 449,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                required: true,
                                value: companyName,
                                onChange: (e)=>setCompanyName(e.target.value),
                                className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
                                placeholder: copy.placeholderCompanyName
                            }, void 0, false, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 452,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 448,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-1 block text-sm font-medium text-zinc-700",
                                children: [
                                    copy.labelFirstName,
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-red-600",
                                        children: "*"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 463,
                                        columnNumber: 35
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 462,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                required: true,
                                value: firstName,
                                onChange: (e)=>setFirstName(e.target.value),
                                className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
                                placeholder: copy.placeholderFirstName
                            }, void 0, false, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 465,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 461,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-1 block text-sm font-medium text-zinc-700",
                                children: [
                                    copy.labelLastName,
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-red-600",
                                        children: "*"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 476,
                                        columnNumber: 34
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 475,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                required: true,
                                value: lastName,
                                onChange: (e)=>setLastName(e.target.value),
                                className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
                                placeholder: copy.placeholderLastName
                            }, void 0, false, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 478,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 474,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-1 block text-sm font-medium text-zinc-700",
                                children: [
                                    copy.labelEmail,
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-red-600",
                                        children: "*"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 489,
                                        columnNumber: 31
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 488,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "email",
                                required: true,
                                value: email,
                                onChange: (e)=>setEmail(e.target.value),
                                className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
                                placeholder: copy.placeholderEmail
                            }, void 0, false, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 491,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 487,
                        columnNumber: 9
                    }, this),
                    step === 2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-sm font-medium text-zinc-700",
                                        children: [
                                            copy.labelVat,
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-600",
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                                lineNumber: 505,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 504,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        required: true,
                                        value: vat,
                                        onChange: (e)=>setVat(e.target.value),
                                        className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 507,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 503,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-sm font-medium text-zinc-700",
                                        children: [
                                            copy.labelPhone,
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-600",
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                                lineNumber: 517,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 516,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "tel",
                                        required: true,
                                        value: phone,
                                        onChange: (e)=>setPhone(e.target.value),
                                        className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 519,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 515,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-sm font-medium text-zinc-700",
                                        children: [
                                            copy.labelAddress,
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-600",
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                                lineNumber: 530,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 529,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        required: true,
                                        value: address,
                                        onChange: (e)=>setAddress(e.target.value),
                                        className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 532,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 528,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-sm font-medium text-zinc-700",
                                        children: [
                                            copy.labelPostalCode,
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-600",
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                                lineNumber: 542,
                                                columnNumber: 40
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 541,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        required: true,
                                        value: postalCode,
                                        onChange: (e)=>setPostalCode(e.target.value),
                                        className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 544,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 540,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-sm font-medium text-zinc-700",
                                        children: [
                                            copy.labelCity,
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-600",
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                                lineNumber: 554,
                                                columnNumber: 34
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 553,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        required: true,
                                        value: city,
                                        onChange: (e)=>setCity(e.target.value),
                                        className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 556,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 552,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : null,
                    step === 2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-1 block text-sm font-medium text-zinc-700",
                                children: [
                                    copy.labelCountry,
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-red-600",
                                        children: "*"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 569,
                                        columnNumber: 35
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 568,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                required: true,
                                value: country,
                                onChange: (e)=>setCountry(e.target.value),
                                className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        disabled: true,
                                        children: copy.placeholderSelectCountry
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 577,
                                        columnNumber: 15
                                    }, this),
                                    COUNTRY_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: option.code,
                                            children: option.nativeName
                                        }, option.code, false, {
                                            fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                            lineNumber: 581,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 571,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 567,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-1 block text-sm font-medium text-zinc-700",
                                children: copy.labelEmployeeCount
                            }, void 0, false, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 590,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: employeeCount,
                                onChange: (e)=>setEmployeeCount(e.target.value),
                                className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "1-4",
                                        children: "1-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 596,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "5-20",
                                        children: "5-20"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 597,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "21-50",
                                        children: "21-50"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 598,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "51-100",
                                        children: "51-100"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 599,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "100+",
                                        children: "100+"
                                    }, void 0, false, {
                                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                        lineNumber: 600,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                lineNumber: 591,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 589,
                        columnNumber: 9
                    }, this),
                    step === 2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sm:col-span-2 rounded-xl border border-[#4A90E2]/25 bg-[#4A90E2]/8 p-4 sm:p-5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 sm:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sm:col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "mb-1 block text-sm font-medium text-zinc-700",
                                            children: [
                                                copy.labelCardholderName,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-red-600",
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                                    lineNumber: 609,
                                                    columnNumber: 46
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                            lineNumber: 608,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            required: true,
                                            value: cardholderName,
                                            onChange: (e)=>setCardholderName(e.target.value),
                                            className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
                                            placeholder: copy.placeholderCardholderName
                                        }, void 0, false, {
                                            fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                            lineNumber: 611,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                    lineNumber: 607,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sm:col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "mb-1 block text-sm font-medium text-zinc-700",
                                            children: [
                                                copy.labelCardNumber,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-red-600",
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                                    lineNumber: 621,
                                                    columnNumber: 42
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                            lineNumber: 620,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            required: true,
                                            value: cardNumber,
                                            onChange: (e)=>setCardNumber(e.target.value),
                                            className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
                                            inputMode: "numeric",
                                            placeholder: copy.placeholderCardNumber
                                        }, void 0, false, {
                                            fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                            lineNumber: 623,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                    lineNumber: 619,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "mb-1 block text-sm font-medium text-zinc-700",
                                            children: [
                                                copy.labelCardExpiry,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-red-600",
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                                    lineNumber: 634,
                                                    columnNumber: 42
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                            lineNumber: 633,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            required: true,
                                            value: cardExpiry,
                                            onChange: (e)=>setCardExpiry(e.target.value),
                                            className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
                                            placeholder: copy.placeholderCardExpiry
                                        }, void 0, false, {
                                            fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                            lineNumber: 636,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                    lineNumber: 632,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "mb-1 block text-sm font-medium text-zinc-700",
                                            children: [
                                                copy.labelCardCvc,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-red-600",
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                                    lineNumber: 646,
                                                    columnNumber: 39
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                            lineNumber: 645,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            required: true,
                                            value: cardCvc,
                                            onChange: (e)=>setCardCvc(e.target.value),
                                            className: "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
                                            inputMode: "numeric",
                                            placeholder: copy.placeholderCardCvc
                                        }, void 0, false, {
                                            fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                            lineNumber: 648,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                                    lineNumber: 644,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                            lineNumber: 606,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 605,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                lineNumber: 447,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        required: true,
                        checked: marketingConsent,
                        onChange: (e)=>setMarketingConsent(e.target.checked),
                        className: "mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#4A90E2] focus:ring-[#4A90E2]"
                    }, void 0, false, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 663,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-zinc-700",
                        children: copy.marketingConsentText
                    }, void 0, false, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 670,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                lineNumber: 662,
                columnNumber: 7
            }, this),
            message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `rounded-lg border px-3 py-2 text-sm ${message.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`,
                children: message.text
            }, void 0, false, {
                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                lineNumber: 676,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-3",
                children: [
                    step === 2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setStep(1),
                        className: "inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50",
                        children: copy.buttonBack
                    }, void 0, false, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 689,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: submitting || !marketingConsent,
                        className: "inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#4A90E2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3A7FD1] disabled:cursor-not-allowed disabled:opacity-60",
                        children: submitting ? copy.buttonSending : step === 1 ? product === "basic" ? submitLabel : copy.buttonNext : product === "basic" ? submitLabel : startAccountLabel
                    }, void 0, false, {
                        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                        lineNumber: 697,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
                lineNumber: 687,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/employer-signup/employer-signup-form.tsx",
        lineNumber: 425,
        columnNumber: 5
    }, this);
}
_s(EmployerSignupForm, "fUJoQAA+AinBvYLMfjPZHZRY/rI=");
_c = EmployerSignupForm;
var _c;
__turbopack_context__.k.register(_c, "EmployerSignupForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0jg~g9g._.js.map