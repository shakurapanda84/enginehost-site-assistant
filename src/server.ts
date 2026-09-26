import type { AssistantRequest, AssistantResponse, AssistantSiteConfig } from './contracts'
import { validateAssistantResponse } from './contracts'

export type AssistantFetcher = typeof fetch

export async function requestAssistant(config: AssistantSiteConfig, apiKey: string, input: AssistantRequest, fetcher: AssistantFetcher = fetch): Promise<AssistantResponse | null> {
  try {
    const response = await fetcher(config.apiBaseUrl + '/api/public/' + config.slug + '/assistant', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) return null
    const result = validateAssistantResponse(await response.json(), config.domain)
    return result.ok ? result.value : null
  } catch {
    return null
  }
}
