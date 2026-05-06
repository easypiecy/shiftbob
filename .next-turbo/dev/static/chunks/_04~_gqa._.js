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
function SalesBotWidget({ languageCode, iconUrl, logoUrl, buttonLabel, panelTitle, initialAssistantMessage, inputPlaceholder, sendLabel, closeLabel, supportButtonLabel, supportPanelTitle, supportSubjectLabel, supportMessageLabel, supportNameLabel, supportEmailLabel, supportSubmitLabel, supportSuccessTemplate, supportNeedIdentityMessage, resetLabel, dismissLabel, dismissStorageKey }) {
    _s();
    const headerLogoSrc = logoUrl?.trim() || "/ShiftBob-circle-logo-dark-1024.png";
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dismissed, setDismissed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SalesBotWidget.useState": ()=>{
            if (!dismissStorageKey || ("TURBOPACK compile-time value", "object") === "undefined") return false;
            try {
                return window.localStorage.getItem(dismissStorageKey) === "1";
            } catch  {
                return false;
            }
        }
    }["SalesBotWidget.useState"]);
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
    function dismissWidget() {
        setOpen(false);
        setDismissed(true);
        if (!dismissStorageKey) return;
        try {
            window.localStorage.setItem(dismissStorageKey, "1");
        } catch  {
        // Ignore private mode / quota errors.
        }
    }
    if (dismissed) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-5 right-5 z-[70]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: async ()=>{
                            setOpen((value)=>!value);
                            if (!open) {
                                await initializeChat();
                            }
                        },
                        className: "inline-flex items-center justify-center p-0 transition hover:scale-105",
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
                            lineNumber: 268,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this),
                    dismissLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: (e)=>{
                            e.preventDefault();
                            e.stopPropagation();
                            dismissWidget();
                        },
                        className: "absolute bottom-0 right-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900/85 text-[11px] font-semibold text-white hover:bg-zinc-900",
                        "aria-label": dismissLabel,
                        title: dismissLabel,
                        children: "×"
                    }, void 0, false, {
                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                        lineNumber: 277,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                lineNumber: 255,
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
                                            lineNumber: 298,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 297,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: panelTitle
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 306,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                lineNumber: 296,
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
                                            lineNumber: 319,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 309,
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
                                            lineNumber: 328,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 321,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                lineNumber: 308,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                        lineNumber: 295,
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
                                            lineNumber: 343,
                                            columnNumber: 17
                                        }, this),
                                        message.role === "assistant" && message.ctaLabel && message.ctaHref ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: message.ctaHref,
                                            className: "mt-2 inline-flex text-sm font-semibold text-[#3A7FD1] underline underline-offset-2 hover:text-[#2b69af]",
                                            children: message.ctaLabel
                                        }, void 0, false, {
                                            fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                            lineNumber: 345,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, message.id, true, {
                                    fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                    lineNumber: 335,
                                    columnNumber: 15
                                }, this)),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "h-3.5 w-3.5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 356,
                                        columnNumber: 17
                                    }, this),
                                    "Thinking..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                lineNumber: 355,
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
                                        lineNumber: 366,
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
                                                lineNumber: 371,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: supportEmail,
                                                onChange: (e)=>setSupportEmail(e.target.value),
                                                placeholder: supportEmailLabel,
                                                className: "h-9 rounded-md border border-zinc-300 px-2 text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                                lineNumber: 377,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 370,
                                        columnNumber: 19
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: supportSubject,
                                        onChange: (e)=>setSupportSubject(e.target.value),
                                        placeholder: supportSubjectLabel,
                                        className: "h-9 w-full rounded-md border border-zinc-300 px-2 text-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 385,
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
                                        lineNumber: 391,
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
                                                lineNumber: 399,
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
                                                        lineNumber: 416,
                                                        columnNumber: 39
                                                    }, this) : null,
                                                    supportSubmitLabel
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                                lineNumber: 406,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 398,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                lineNumber: 362,
                                columnNumber: 15
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                        lineNumber: 333,
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
                                    lineNumber: 426,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                lineNumber: 425,
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
                                        lineNumber: 435,
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
                                                lineNumber: 446,
                                                columnNumber: 17
                                            }, this),
                                            sendLabel
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                        lineNumber: 441,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                                lineNumber: 434,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/landing/sales-bot-widget.tsx",
                        lineNumber: 424,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/landing/sales-bot-widget.tsx",
                lineNumber: 294,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true);
}
_s(SalesBotWidget, "vEf0/4FddKkrURbEjU4xT8/87Gc=");
_c = SalesBotWidget;
var _c;
__turbopack_context__.k.register(_c, "SalesBotWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/auth-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signOutAndRedirectToLogin",
    ()=>signOutAndRedirectToLogin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-client] (ecmascript)");
;
async function signOutAndRedirectToLogin() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    try {
        await supabase.auth.signOut({
            scope: "global"
        });
    } catch  {
    /* stadig redirect */ }
    window.location.href = "/login";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin-workspace-shell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminWorkspaceShell",
    ()=>AdminWorkspaceShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$landing$2f$sales$2d$bot$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/landing/sales-bot-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeftRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left-right.js [app-client] (ecmascript) <export default as ArrowLeftRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-clock.js [app-client] (ecmascript) <export default as CalendarClock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$translations$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/translations-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const ADMIN_NAV_LINKS = [
    {
        href: "/dashboard",
        navKey: "admin.nav.calendar",
        labelDa: "Vagtplan",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        href: "/dashboard/fremtiden",
        navKey: "admin.nav.future",
        labelDa: "Automatisk udrulning",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__["CalendarClock"]
    },
    {
        href: "/dashboard/indstillinger",
        navKey: "admin.nav.settings",
        labelDa: "Indstillinger",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    }
];
function AdminWorkspaceShell({ showAdminNav, children, initialLayoutTheme }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$translations$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(("TURBOPACK compile-time truthy", 1) ? window.innerWidth >= 768 : "TURBOPACK unreachable");
    const [signingOut, setSigningOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [settingsNavigationPending, setSettingsNavigationPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (!showAdminNav) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    const isActive = (href)=>{
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname === href || pathname.startsWith(`${href}/`);
    };
    /** Dark: mørkt cirkel-logo. Light + unicorn: lyst cirkel-logo (unicorn bruger også `dark` på `<html>`). */ const showDarkCircleLogo = initialLayoutTheme === "dark";
    const showSettingsLoaderOverlay = settingsNavigationPending && pathname !== "/dashboard/indstillinger";
    function openSpreadsheetImportPage() {
        router.push("/dashboard/import-regneark");
        setSidebarOpen(false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex min-h-screen flex-1 bg-zinc-100 dark:bg-zinc-950",
        children: [
            sidebarOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": t("common.menu.close_overlay", "Luk menu"),
                className: "fixed inset-0 z-[90] bg-black/40 md:hidden",
                onClick: ()=>setSidebarOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                lineNumber: 97,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: sidebarOpen ? "fixed inset-y-0 left-0 z-[100] flex h-screen max-h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 md:relative md:inset-auto md:z-10 md:shadow-none" : "hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative shrink-0 px-3 pb-3 pt-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setSidebarOpen(false),
                                className: "absolute right-0 top-0 z-10 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                                "aria-label": t("common.menu.hide_sidebar", "Skjul menu"),
                                title: t("common.menu.hide_sidebar", "Skjul menu"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    className: "h-5 w-5",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center px-1 pr-7",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard",
                                    className: "outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sidebar-logo-wrap inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/ShiftBob-circle-logo-light-1024.png",
                                                alt: t("common.brand_name", "ShiftBob"),
                                                width: 1024,
                                                height: 1024,
                                                className: `h-[6.5rem] w-[6.5rem] object-contain object-center sm:h-[7.25rem] sm:w-[7.25rem] ${showDarkCircleLogo ? "hidden" : "block"}`,
                                                priority: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                lineNumber: 128,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/ShiftBob-circle-logo-dark-1024.png",
                                                alt: t("common.brand_name", "ShiftBob"),
                                                width: 1024,
                                                height: 1024,
                                                className: `h-[6.5rem] w-[6.5rem] object-contain object-center sm:h-[7.25rem] sm:w-[7.25rem] ${showDarkCircleLogo ? "block" : "hidden"}`,
                                                priority: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                lineNumber: 138,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex min-h-0 flex-1 flex-col px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-0.5",
                                    children: ADMIN_NAV_LINKS.map(({ href, navKey, labelDa, icon: Icon })=>{
                                        const active = isActive(href);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: href,
                                            onClick: (e)=>{
                                                if (href !== "/dashboard/indstillinger") {
                                                    setSettingsNavigationPending(false);
                                                    return;
                                                }
                                                if (active) {
                                                    setSettingsNavigationPending(false);
                                                    return;
                                                }
                                                e.preventDefault();
                                                setSettingsNavigationPending(true);
                                                router.push(href);
                                            },
                                            className: active ? "flex items-center gap-2 rounded-lg bg-zinc-200 px-3 py-2.5 text-sm font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50" : "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    className: "h-4 w-4 shrink-0 text-zinc-500",
                                                    "aria-hidden": true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "inline-flex items-center",
                                                    children: t(navKey, labelDa)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, href, true, {
                                            fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                            lineNumber: 158,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 px-2 pb-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: openSpreadsheetImportPage,
                                    className: "flex w-full items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                            className: "h-4 w-4 shrink-0",
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                            lineNumber: 193,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: t("admin.nav.import_spreadsheet", "Hent regneark")
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                            lineNumber: 194,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sidebar-menu-footer shrink-0 pt-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 px-2 pb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: (e)=>{
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSigningOut(true);
                                                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOutAndRedirectToLogin"])();
                                            },
                                            disabled: signingOut,
                                            className: "relative z-[100] flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-zinc-800",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                    className: "h-4 w-4 shrink-0 text-zinc-500",
                                                    "aria-hidden": true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: signingOut ? t("common.logout.loading", "Logger ud…") : t("common.logout", "Log ud")
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                            lineNumber: 199,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/select-workplace",
                                            className: "shrink-0 rounded-lg p-2.5 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                                            title: t("admin.sidebar.switch_workplace", "Skift arbejdsplads"),
                                            "aria-label": t("admin.sidebar.switch_workplace", "Skift arbejdsplads"),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeftRight$3e$__["ArrowLeftRight"], {
                                                className: "h-4 w-4",
                                                strokeWidth: 2,
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                                lineNumber: 223,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                            lineNumber: 217,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                    lineNumber: 198,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            !sidebarOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setSidebarOpen(true),
                className: "fixed left-3 top-3 z-[100] flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-md transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800",
                "aria-label": t("common.menu.show_sidebar", "Vis menu"),
                title: t("common.menu.show_sidebar", "Vis menu"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                    className: "h-5 w-5",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/admin-workspace-shell.tsx",
                    lineNumber: 238,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                lineNumber: 231,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: sidebarOpen ? "min-w-0 flex-1 overflow-auto" : "min-w-0 flex-1 overflow-auto pt-14 md:pt-0",
                children: [
                    showSettingsLoaderOverlay ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-[120] flex items-center justify-center bg-zinc-100/85 dark:bg-zinc-950/85",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "bob-loader-shell",
                            "aria-label": t("common.loading_page", "Siden loader"),
                            role: "status",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bob-loader-row",
                                "aria-hidden": "true",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bob-orb bob-orb-1",
                                        children: "B"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                        lineNumber: 257,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bob-orb bob-orb-2",
                                        children: "O"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                        lineNumber: 258,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bob-orb bob-orb-3",
                                        children: "B"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                        lineNumber: 259,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                                lineNumber: 256,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin-workspace-shell.tsx",
                            lineNumber: 251,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin-workspace-shell.tsx",
                        lineNumber: 250,
                        columnNumber: 11
                    }, this) : null,
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$landing$2f$sales$2d$bot$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SalesBotWidget"], {
                languageCode: "da",
                iconUrl: "https://pwooqmqdershicxpnfuo.supabase.co/storage/v1/object/public/website_assets/chat.png",
                logoUrl: "/ShiftBob-circle-logo-dark-1024.png",
                buttonLabel: t("landing.salesbot.button_aria", "Sporg shiftBOB"),
                panelTitle: "shiftBOB",
                initialAssistantMessage: t("landing.salesbot.initial_message", "Sporg mig om ShiftBob, vagtplaner eller regler."),
                inputPlaceholder: t("landing.salesbot.input_placeholder", "Skriv dit sporgsmal..."),
                sendLabel: t("landing.salesbot.send", "Send"),
                closeLabel: t("landing.salesbot.close", "Luk chat"),
                supportButtonLabel: t("landing.salesbot.support_button", "Support ticket"),
                supportPanelTitle: t("landing.salesbot.support_panel_title", "Opret support ticket"),
                supportSubjectLabel: t("landing.salesbot.support_subject", "Emne"),
                supportMessageLabel: t("landing.salesbot.support_message", "Beskriv dit problem"),
                supportNameLabel: t("landing.salesbot.support_name", "Dit navn"),
                supportEmailLabel: t("landing.salesbot.support_email", "Din e-mail"),
                supportSubmitLabel: t("landing.salesbot.support_submit", "Send ticket"),
                supportSuccessTemplate: t("landing.salesbot.support_success", "Tak! Din support ticket er oprettet: {ticketId}"),
                supportNeedIdentityMessage: t("landing.salesbot.support_need_identity", "For at oprette en support ticket skal du angive navn og e-mail."),
                resetLabel: t("landing.salesbot.reset", "Nulstil chat"),
                dismissLabel: t("common.chat.dismiss_widget", "Skjul widget"),
                dismissStorageKey: "shiftbob.chat.dismiss.admin"
            }, void 0, false, {
                fileName: "[project]/src/components/admin-workspace-shell.tsx",
                lineNumber: 266,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin-workspace-shell.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_s(AdminWorkspaceShell, "elU8ai8SFAAlJo74ERMnk0LXn9c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$translations$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AdminWorkspaceShell;
var _c;
__turbopack_context__.k.register(_c, "AdminWorkspaceShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/types/roles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ROLES",
    ()=>ROLES,
    "isRole",
    ()=>isRole
]);
const ROLES = [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "EMPLOYEE"
];
function isRole(value) {
    return ROLES.includes(value);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/roles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTIVE_ROLE_COOKIE",
    ()=>ACTIVE_ROLE_COOKIE,
    "ROLE_LABELS",
    ()=>ROLE_LABELS,
    "setActiveRoleCookie",
    ()=>setActiveRoleCookie
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-client] (ecmascript)");
;
const ACTIVE_ROLE_COOKIE = "active_role";
const ROLE_LABELS = {
    SUPER_ADMIN: {
        title: "Superadmin",
        description: "Fuld adgang til system og konfiguration."
    },
    ADMIN: {
        title: "Administrator",
        description: "Administrer brugere og overordnede indstillinger."
    },
    MANAGER: {
        title: "Manager",
        description: "Led vagtplaner og team."
    },
    EMPLOYEE: {
        title: "Medarbejder",
        description: "Standard adgang til egne vagter og opgaver."
    }
};
function setActiveRoleCookie(role) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set(ACTIVE_ROLE_COOKIE, role, {
        path: "/",
        sameSite: "lax",
        expires: 30
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/super-admin.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertSuperAdminAccess",
    ()=>assertSuperAdminAccess,
    "hasSuperAdminAccess",
    ()=>hasSuperAdminAccess
]);
async function hasSuperAdminAccess(supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: siteSa, error: rpcErr } = await supabase.rpc("has_super_admin_membership");
    if (!rpcErr && siteSa === true) return true;
    const { data: wm } = await supabase.from("workplace_members").select("user_id").eq("user_id", user.id).eq("role", "SUPER_ADMIN").limit(1).maybeSingle();
    if (wm) return true;
    const { data: ur, error: urErr } = await supabase.from("user_roles").select("id").eq("user_id", user.id).eq("role", "SUPER_ADMIN").limit(1).maybeSingle();
    return !urErr && !!ur;
}
async function assertSuperAdminAccess(supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Ikke logget ind.");
    }
    if (!await hasSuperAdminAccess(supabase)) {
        throw new Error("Ingen adgang til Super Admin.");
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/workplaces.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTIVE_WORKPLACE_COOKIE",
    ()=>ACTIVE_WORKPLACE_COOKIE,
    "fetchUserRolesForWorkplace",
    ()=>fetchUserRolesForWorkplace,
    "fetchUserWorkplaces",
    ()=>fetchUserWorkplaces,
    "getActiveWorkplaceIdFromCookie",
    ()=>getActiveWorkplaceIdFromCookie,
    "routeAfterLogin",
    ()=>routeAfterLogin,
    "routeRolesForActiveWorkplace",
    ()=>routeRolesForActiveWorkplace,
    "setActiveWorkplaceCookie",
    ()=>setActiveWorkplaceCookie
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/roles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/roles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/super-admin.ts [app-client] (ecmascript)");
;
;
;
;
const ACTIVE_WORKPLACE_COOKIE = "active_workplace";
function setActiveWorkplaceCookie(workplaceId) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set(ACTIVE_WORKPLACE_COOKIE, workplaceId, {
        path: "/",
        sameSite: "lax",
        expires: 30
    });
}
function getActiveWorkplaceIdFromCookie() {
    if (typeof document === "undefined") return null;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(ACTIVE_WORKPLACE_COOKIE) ?? null;
}
async function fetchUserWorkplaces(supabase) {
    const { data: rpcRows, error: rpcErr } = await supabase.rpc("get_my_workplaces");
    if (!rpcErr && rpcRows != null && Array.isArray(rpcRows)) {
        return rpcRows.sort((a, b)=>a.name.localeCompare(b.name, "da"));
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: mids, error: e1 } = await supabase.from("workplace_members").select("workplace_id").eq("user_id", user.id);
    if (e1) throw e1;
    const ids = [
        ...new Set((mids ?? []).map((m)=>m.workplace_id))
    ];
    if (ids.length === 0) return [];
    const { data: places, error: e2 } = await supabase.from("workplaces").select("id, name, created_at").in("id", ids);
    if (e2) throw e2;
    return (places ?? []).sort((a, b)=>a.name.localeCompare(b.name, "da"));
}
async function fetchUserRolesForWorkplace(supabase, workplaceId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: rpcRoles, error: rpcErr } = await supabase.rpc("get_my_roles_for_workplace", {
        p_workplace_id: workplaceId
    });
    if (!rpcErr && rpcRoles != null) {
        const raw = Array.isArray(rpcRoles) ? rpcRoles : [];
        const list = raw.map((r)=>String(r)).filter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRole"]);
        return [
            ...new Set(list)
        ].sort((a, b)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].indexOf(a) - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].indexOf(b));
    }
    const { data, error } = await supabase.from("workplace_members").select("role").eq("user_id", user.id).eq("workplace_id", workplaceId);
    if (error) throw error;
    const list = (data ?? []).map((row)=>row.role).filter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRole"]);
    return [
        ...new Set(list)
    ].sort((a, b)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].indexOf(a) - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROLES"].indexOf(b));
}
async function routeRolesForActiveWorkplace(supabase, router, workplaceId) {
    let roles;
    try {
        roles = await fetchUserRolesForWorkplace(supabase, workplaceId);
    } catch  {
        return "fetch_error";
    }
    if (roles.length === 0) return "no_roles";
    if (roles.length === 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$roles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setActiveRoleCookie"])(roles[0]);
        router.push("/dashboard");
        return "routed";
    }
    router.push("/select-role");
    return "routed";
}
async function routeAfterLogin(supabase, router) {
    if (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasSuperAdminAccess"])(supabase)) {
        router.push("/select-workplace");
        return "routed";
    }
    let workplaces;
    try {
        workplaces = await fetchUserWorkplaces(supabase);
    } catch  {
        return "fetch_error";
    }
    if (workplaces.length === 0) return "no_workplaces";
    if (workplaces.length === 1) {
        const only = workplaces[0];
        setActiveWorkplaceCookie(only.id);
        return routeRolesForActiveWorkplace(supabase, router, only.id);
    }
    router.push("/select-workplace");
    return "routed";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard-onboarding-guard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardOnboardingGuard",
    ()=>DashboardOnboardingGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/workplaces.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function DashboardOnboardingGuard({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardOnboardingGuard.useEffect": ()=>{
            if (pathname?.startsWith("/dashboard/complete-profile")) {
                setReady(true);
                return;
            }
            const wp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplaces$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getActiveWorkplaceIdFromCookie"])();
            if (!wp) {
                setReady(true);
                return;
            }
            let cancelled = false;
            async function run() {
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user || cancelled) {
                    if (!cancelled) setReady(true);
                    return;
                }
                const { data: wm, error } = await supabase.from("workplace_members").select("profile_onboarding_completed").eq("user_id", user.id).eq("workplace_id", wp).maybeSingle();
                if (cancelled) return;
                if (error) {
                    setReady(true);
                    return;
                }
                if (wm?.profile_onboarding_completed === false) {
                    router.replace("/dashboard/complete-profile");
                    return;
                }
                setReady(true);
            }
            void run();
            return ({
                "DashboardOnboardingGuard.useEffect": ()=>{
                    cancelled = true;
                }
            })["DashboardOnboardingGuard.useEffect"];
        }
    }["DashboardOnboardingGuard.useEffect"], [
        pathname,
        router
    ]);
    if (!ready) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[40vh] flex-1 items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard-onboarding-guard.tsx",
                lineNumber: 68,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard-onboarding-guard.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(DashboardOnboardingGuard, "2xvvkElGqFS/Gd/z5bRVUO+PmR0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DashboardOnboardingGuard;
var _c;
__turbopack_context__.k.register(_c, "DashboardOnboardingGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_04~_gqa._.js.map