export type AssistantRole = 'user' | 'assistant';
export type AssistantTurn = Readonly<{
    role: AssistantRole;
    content: string;
}>;
export type AssistantRequest = Readonly<{
    message: string;
    history: readonly AssistantTurn[];
}>;
export type AssistantSource = Readonly<{
    title: string;
    url: string;
    type: string;
}>;
export type AssistantResponse = Readonly<{
    answer: string;
    grounded: boolean;
    sources: readonly AssistantSource[];
}>;
export type AssistantSiteConfig = Readonly<{
    slug: string;
    domain: string;
    apiBaseUrl: string;
    name?: string;
    greeting?: string;
    contactText?: string;
}>;
type Validation<T> = {
    ok: true;
    value: T;
} | {
    ok: false;
};
export declare function createSiteAssistantConfig(input: {
    slug: string;
    domain: string;
    apiBaseUrl: string;
    name?: string;
    greeting?: string;
    contactText?: string;
}): AssistantSiteConfig;
export declare function validateAssistantRequest(input: unknown): Validation<AssistantRequest>;
export declare function validateAssistantResponse(input: unknown, tenantDomain: string): Validation<AssistantResponse>;
export {};
