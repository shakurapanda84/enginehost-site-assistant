import { validateAssistantRequest } from './contracts.js';
import { requestAssistant } from './server.js';
const MAX_BYTES = 16 * 1024;
export function createAssistantRoute(config, options) {
    return async function POST(request) {
        const mediaType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
        if (mediaType !== 'application/json')
            return Response.json({ code: 'invalid' }, { status: 415 });
        const origin = request.headers.get('origin');
        if (origin && origin !== config.domain && origin !== config.domain.replace('https://', 'https://www.'))
            return Response.json({ code: 'forbidden' }, { status: 403 });
        if (Number(request.headers.get('content-length') ?? 0) > MAX_BYTES)
            return Response.json({ code: 'invalid' }, { status: 400 });
        let raw;
        try {
            raw = await request.json();
        }
        catch {
            return Response.json({ code: 'invalid' }, { status: 400 });
        }
        const input = validateAssistantRequest(raw);
        if (!input.ok)
            return Response.json({ code: 'invalid' }, { status: 400 });
        const result = await requestAssistant(config, options.apiKey, input.value, options.fetcher);
        return result ? Response.json(result) : Response.json({ code: 'unavailable' }, { status: 503 });
    };
}
