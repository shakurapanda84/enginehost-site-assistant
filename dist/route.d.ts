import type { AssistantSiteConfig } from './contracts.js';
import type { AssistantFetcher } from './server.js';
export declare function createAssistantRoute(config: AssistantSiteConfig, options: {
    apiKey: string;
    fetcher?: AssistantFetcher;
}): (request: Request) => Promise<Response>;
