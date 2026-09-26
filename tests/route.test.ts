import { describe, expect, it, vi } from 'vitest'
import { createAssistantRoute } from '../src/route'
import { createSiteAssistantConfig } from '../src/contracts'

describe('shared assistant route', () => {
  it('uses the fixed tenant and forwards a valid request', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ answer: 'ok', grounded: false, sources: [] }), { status: 200 }))
    const route = createAssistantRoute(createSiteAssistantConfig({ slug: 'zheep', domain: 'zheep.com', apiBaseUrl: 'https://dashboard.zheep.com' }), { apiKey: 'secret', fetcher })
    const response = await route(new Request('https://zheep.com/api/assistant', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://zheep.com' }, body: JSON.stringify({ message: 'hello', history: [] }) }))
    expect(response.status).toBe(200)
    expect(fetcher).toHaveBeenCalledWith('https://dashboard.zheep.com/api/public/zheep/assistant', expect.objectContaining({ method: 'POST' }))
  })
})
