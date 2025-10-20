export declare class MfaService {
    getMfaStatus(userId: string): Promise<{
        enabled: boolean;
        methods: any[];
    }>;
    verifyMfa(data: any): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=mfa.service.d.ts.map