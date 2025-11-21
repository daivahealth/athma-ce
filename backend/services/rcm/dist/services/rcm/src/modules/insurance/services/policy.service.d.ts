import { PrismaService } from '@zeal/database-rcm';
import { CreatePolicyDto, UpdatePolicyDto, PolicyStatus } from '../dto/policy.dto';
export declare class PolicyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, dto: CreatePolicyDto): Promise<{
        payer: {
            payerName: string;
            payerId: string | null;
            payerType: string | null;
            contactInfo: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            status: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        payerName: string;
        payerId: string;
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        policyNumber: string;
        groupNumber: string | null;
        relationship: string | null;
        effectiveDate: Date | null;
        expirationDate: Date | null;
        benefits: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
        isPrimary: boolean;
    }>;
    findAll(tenantId: string, patientId?: string, status?: PolicyStatus): Promise<({
        payer: {
            payerName: string;
            payerId: string | null;
            payerType: string | null;
            contactInfo: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            status: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        payerName: string;
        payerId: string;
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        policyNumber: string;
        groupNumber: string | null;
        relationship: string | null;
        effectiveDate: Date | null;
        expirationDate: Date | null;
        benefits: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
        isPrimary: boolean;
    })[]>;
    findById(tenantId: string, id: string): Promise<{
        payer: {
            payerName: string;
            payerId: string | null;
            payerType: string | null;
            contactInfo: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            status: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        payerName: string;
        payerId: string;
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        policyNumber: string;
        groupNumber: string | null;
        relationship: string | null;
        effectiveDate: Date | null;
        expirationDate: Date | null;
        benefits: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
        isPrimary: boolean;
    }>;
    findByPatient(tenantId: string, patientId: string): Promise<({
        payer: {
            payerName: string;
            payerId: string | null;
            payerType: string | null;
            contactInfo: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            status: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        payerName: string;
        payerId: string;
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        policyNumber: string;
        groupNumber: string | null;
        relationship: string | null;
        effectiveDate: Date | null;
        expirationDate: Date | null;
        benefits: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
        isPrimary: boolean;
    })[]>;
    findPrimaryPolicy(tenantId: string, patientId: string): Promise<{
        payer: {
            payerName: string;
            payerId: string | null;
            payerType: string | null;
            contactInfo: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            status: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        payerName: string;
        payerId: string;
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        policyNumber: string;
        groupNumber: string | null;
        relationship: string | null;
        effectiveDate: Date | null;
        expirationDate: Date | null;
        benefits: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
        isPrimary: boolean;
    }>;
    update(tenantId: string, id: string, dto: UpdatePolicyDto): Promise<{
        payer: {
            payerName: string;
            payerId: string | null;
            payerType: string | null;
            contactInfo: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            configuration: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            status: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        payerName: string;
        payerId: string;
        status: string;
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        policyNumber: string;
        groupNumber: string | null;
        relationship: string | null;
        effectiveDate: Date | null;
        expirationDate: Date | null;
        benefits: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
        isPrimary: boolean;
    }>;
    delete(tenantId: string, id: string): Promise<{
        message: string;
    }>;
    checkExpiredPolicies(tenantId: string): Promise<{
        expiredCount: number;
        expiredPolicies: {
            payerName: string;
            payerId: string;
            status: string;
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            policyNumber: string;
            groupNumber: string | null;
            relationship: string | null;
            effectiveDate: Date | null;
            expirationDate: Date | null;
            benefits: import("@zeal/database-rcm/generated/runtime/library").JsonValue;
            isPrimary: boolean;
        }[];
    }>;
    getPolicyStatistics(tenantId: string, patientId?: string): Promise<{
        total: number;
        byStatus: Record<string, number>;
        primaryCount: number;
    }>;
}
//# sourceMappingURL=policy.service.d.ts.map