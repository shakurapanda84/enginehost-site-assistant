import type { AssistantRequest, AssistantResponse, AssistantSiteConfig } from './contracts.js';
export type AssistantFetcher = typeof fetch;
export declare function requestAssistant(config: AssistantSiteConfig, apiKey: string, input: AssistantRequest, fetcher?: AssistantFetcher): Promise<AssistantResponse | null>;
