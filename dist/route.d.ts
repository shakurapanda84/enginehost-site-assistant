import type { AssistantSiteConfig } from './contracts';
import type { AssistantFetcher } from './server';
export declare function createAssistantRoute(config: AssistantSiteConfig, options: {
    apiKey: string;
    fetcher?: AssistantFetcher;
}): (request: Request) => Promise<Response>;
