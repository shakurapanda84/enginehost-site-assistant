'use client'

import { useEffect, useRef, useState } from 'react'
import type { AssistantSiteConfig } from './contracts'

export function AssistantWidget({ config }: { config: AssistantSiteConfig }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { if (open) input.current?.focus() }, [open])
  const close = () => { setOpen(false); launcher.current?.focus() }
  return <aside className="assistant-widget">
    {open ? <section className="assistant-panel" role="dialog" aria-modal="true" aria-labelledby="site-assistant-title" onKeyDown={(event) => { if (event.key === 'Escape') close() }}>
      <header className="assistant-panel__header"><h2 id="site-assistant-title">{config.name ?? 'Assistant'}</h2><button type="button" onClick={close} aria-label="Close assistant">×</button></header>
      <p>{answer ?? config.greeting ?? 'How can I help?'}</p>
      <form onSubmit={async (event) => { event.preventDefault(); const message = draft.trim(); if (!message) return; const response = await fetch('/api/assistant', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message, history: [] }) }); const result = await response.json() as { answer?: string }; setAnswer(result.answer ?? config.contactText ?? 'Please try again.'); setDraft('') }}>
        <label htmlFor="site-assistant-question">Your question</label><textarea id="site-assistant-question" ref={input} value={draft} maxLength={600} onChange={(event) => setDraft(event.target.value)} /><button type="submit">Send</button>
      </form>
    </section> : null}
    <button ref={launcher} type="button" className="assistant-launcher" aria-expanded={open} onClick={() => setOpen(true)}>{config.name ?? 'Assistant'}</button>
  </aside>
}
