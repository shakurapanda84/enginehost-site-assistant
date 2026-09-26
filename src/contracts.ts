export type AssistantRole = 'user' | 'assistant'
export type AssistantTurn = Readonly<{ role: AssistantRole; content: string }>
export type AssistantRequest = Readonly<{ message: string; history: readonly AssistantTurn[] }>
export type AssistantSource = Readonly<{ title: string; url: string; type: string }>
export type AssistantResponse = Readonly<{ answer: string; grounded: boolean; sources: readonly AssistantSource[] }>
export type AssistantSiteConfig = Readonly<{ slug: string; domain: string; apiBaseUrl: string; name?: string; greeting?: string; contactText?: string }>
type Validation<T> = { ok: true; value: T } | { ok: false }
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const bounded = (value: unknown): string | null => typeof value === 'string' && value.trim() && Array.from(value.trim()).length <= 600 ? value.trim() : null

export function createSiteAssistantConfig(input: { slug: string; domain: string; apiBaseUrl: string; name?: string; greeting?: string; contactText?: string }): AssistantSiteConfig {
  const domain = new URL(input.domain.includes('://') ? input.domain : 'https://' + input.domain)
  if (domain.protocol !== 'https:') throw new Error('assistant domain must use HTTPS')
  const apiBaseUrl = new URL(input.apiBaseUrl)
  if (apiBaseUrl.protocol !== 'https:' && !(apiBaseUrl.hostname === 'localhost' && apiBaseUrl.protocol === 'http:')) throw new Error('assistant API must use HTTPS')
  if (!/^[a-z0-9-]+$/.test(input.slug)) throw new Error('assistant slug is invalid')
  return { ...input, domain: 'https://' + domain.hostname.replace(/^www\./, ''), apiBaseUrl: apiBaseUrl.toString().replace(/\/$/, '') }
}

export function validateAssistantRequest(input: unknown): Validation<AssistantRequest> {
  if (!record(input)) return { ok: false }
  const message = bounded(input.message)
  const history = input.history ?? []
  if (!message || !Array.isArray(history) || history.length > 6) return { ok: false }
  const turns: AssistantTurn[] = []
  for (const item of history) {
    if (!record(item) || (item.role !== 'user' && item.role !== 'assistant')) return { ok: false }
    const content = bounded(item.content)
    if (!content || turns.at(-1)?.role === item.role) return { ok: false }
    turns.push({ role: item.role, content })
  }
  return { ok: true, value: { message, history: turns } }
}

export function validateAssistantResponse(input: unknown, tenantDomain: string): Validation<AssistantResponse> {
  if (!record(input) || typeof input.answer !== 'string' || !input.answer.trim() || typeof input.grounded !== 'boolean' || !Array.isArray(input.sources) || input.sources.length > 3) return { ok: false }
  const tenant = new URL(tenantDomain).hostname.replace(/^www\./, '')
  const sources: AssistantSource[] = []
  for (const item of input.sources) {
    if (!record(item) || typeof item.title !== 'string' || typeof item.url !== 'string' || typeof item.type !== 'string') return { ok: false }
    const url = new URL(item.url)
    if (url.protocol !== 'https:' || ![tenant, 'www.' + tenant].includes(url.hostname)) return { ok: false }
    sources.push({ title: item.title.trim(), url: item.url, type: item.type.trim() })
  }
  return { ok: true, value: { answer: input.answer.trim(), grounded: input.grounded, sources } }
}
