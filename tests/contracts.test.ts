import { describe, expect, it } from 'vitest'
import { createSiteAssistantConfig, validateAssistantRequest, validateAssistantResponse } from '../src/contracts'

describe('shared assistant contracts', () => {
  it('requires a fixed HTTPS tenant domain', () => {
    expect(() => createSiteAssistantConfig({ slug: 'zheep', domain: 'zheep.com', apiBaseUrl: 'https://dashboard.zheep.com' })).not.toThrow()
    expect(() => createSiteAssistantConfig({ slug: 'zheep', domain: 'http://evil.example', apiBaseUrl: 'https://dashboard.zheep.com' })).toThrow()
  })

  it('bounds requests and alternating history', () => {
    expect(validateAssistantRequest({ message: 'hello', history: [] }).ok).toBe(true)
    expect(validateAssistantRequest({ message: 'x'.repeat(601), history: [] }).ok).toBe(false)
    expect(validateAssistantRequest({ message: 'hello', history: [{ role: 'user', content: 'one' }, { role: 'user', content: 'two' }] }).ok).toBe(false)
  })

  it('rejects response sources outside the configured tenant', () => {
    const result = validateAssistantResponse({ answer: 'ok', grounded: true, sources: [{ title: 'bad', url: 'https://other.example/a', type: 'article' }] }, 'https://zheep.com')
    expect(result.ok).toBe(false)
  })
})
