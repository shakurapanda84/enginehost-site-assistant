'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
export function AssistantWidget({ config }) {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState('');
    const [answer, setAnswer] = useState(null);
    const launcher = useRef(null);
    const input = useRef(null);
    useEffect(() => { if (open)
        input.current?.focus(); }, [open]);
    const close = () => { setOpen(false); launcher.current?.focus(); };
    return _jsxs("aside", { className: "assistant-widget", children: [open ? _jsxs("section", { className: "assistant-panel", role: "dialog", "aria-modal": "true", "aria-labelledby": "site-assistant-title", onKeyDown: (event) => { if (event.key === 'Escape')
                    close(); }, children: [_jsxs("header", { className: "assistant-panel__header", children: [_jsx("h2", { id: "site-assistant-title", children: config.name ?? 'Assistant' }), _jsx("button", { type: "button", onClick: close, "aria-label": "Close assistant", children: "\u00D7" })] }), _jsx("p", { children: answer ?? config.greeting ?? 'How can I help?' }), _jsxs("form", { onSubmit: async (event) => { event.preventDefault(); const message = draft.trim(); if (!message)
                            return; const response = await fetch('/api/assistant', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message, history: [] }) }); const result = await response.json(); setAnswer(result.answer ?? config.contactText ?? 'Please try again.'); setDraft(''); }, children: [_jsx("label", { htmlFor: "site-assistant-question", children: "Your question" }), _jsx("textarea", { id: "site-assistant-question", ref: input, value: draft, maxLength: 600, onChange: (event) => setDraft(event.target.value) }), _jsx("button", { type: "submit", children: "Send" })] })] }) : null, _jsx("button", { ref: launcher, type: "button", className: "assistant-launcher", "aria-expanded": open, onClick: () => setOpen(true), children: config.name ?? 'Assistant' })] });
}
