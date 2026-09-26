import type { AssistantSiteConfig } from './contracts.js'
import type { AssistantFetcher } from './server.js'
import { validateAssistantRequest } from './contracts.js'
import { requestAssistant } from './server.js'

const MAX_BYTES = 16 * 1024

export function createAssistantRoute(config: AssistantSiteConfig, options: { apiKey: string; fetcher?: AssistantFetcher }) {
  return async function POST(request: Request): Promise<Response> {
    const mediaType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
    if (mediaType !== 'application/json') return Response.json({ code: 'invalid' }, { status: 415 })
    const origin = request.headers.get('origin')
    if (origin && origin !== config.domain && origin !== config.domain.replace('https://', 'https://www.')) return Response.json({ ok: false, code: 'forbidden' }, { status: 403 })
    if (Number(request.headers.get('content-length') ?? 0) > MAX_BYTES) return Response.json({ ok: false, code: 'invalid' }, { status: 400 })
    let raw: unknown
    try {
      if (!request.body) throw new Error('missing body')
      const reader = request.body.getReader()
      const decoder = new TextDecoder()
      let text = ''; let bytes = 0
      while (true) {
        const chunk = await reader.read()
        if (chunk.done) break
        bytes += chunk.value.byteLength
        if (bytes > MAX_BYTES) { await reader.cancel(); return Response.json({ ok: false, code: 'invalid' }, { status: 400 }) }
        text += decoder.decode(chunk.value, { stream: true })
      }
      raw = JSON.parse(text + decoder.decode())
    } catch { return Response.json({ ok: false, code: 'invalid' }, { status: 400 }) }
    const input = validateAssistantRequest(raw)
    if (!input.ok) return Response.json({ ok: false, code: 'invalid' }, { status: 400 })
    if (!options.apiKey || !config.apiBaseUrl || config.apiBaseUrl.startsWith('http://localhost')) return Response.json({ ok: false, code: 'unavailable' }, { status: 503 })
    const result = await requestAssistant(config, options.apiKey, input.value, options.fetcher)
    return result ? Response.json(result) : Response.json({ ok: false, code: 'unavailable' }, { status: 503 })
  }
}
