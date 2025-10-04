export interface RequestContextStore {
    tenantId?: string;
    userId?: string;
    userAgent?: string;
}
export declare class RequestContext {
    static run<T>(store: RequestContextStore, callback: () => T): T;
    static set(values: Partial<RequestContextStore>): void;
    static getStore(): RequestContextStore | undefined;
    static getTenantId(): string | undefined;
    static getUserId(): string | undefined;
    static getUserAgent(): string | undefined;
}
//# sourceMappingURL=request-context.d.ts.map