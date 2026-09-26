import { validateAssistantResponse } from './contracts';
export async function requestAssistant(config, apiKey, input, fetcher = fetch) {
    try {
        const response = await fetcher(config.apiBaseUrl + '/api/public/' + config.slug + '/assistant', {
            method: 'POST',
            cache: 'no-store',
            headers: { 'content-type': 'application/json', 'x-api-key': apiKey },
            body: JSON.stringify(input),
            signal: AbortSignal.timeout(10000),
        });
        if (!response.ok)
            return null;
        const result = validateAssistantResponse(await response.json(), config.domain);
        return result.ok ? result.value : null;
    }
    catch {
        return null;
    }
}
