import { PayerService } from '../services/payer.service';
import { CreatePayerDto, UpdatePayerDto, PayerStatus } from '../dto/payer.dto';
export declare class PayerController {
    private readonly payerService;
    constructor(payerService: PayerService);
    create(tenantId: string, dto: CreatePayerDto): Promise<{
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
    }>;
    findAll(tenantId: string, status?: PayerStatus): Promise<{
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
    }[]>;
    getStatistics(tenantId: string): Promise<{
        total: number;
        byStatus: Record<string, number>;
        policyCounts: Record<string, number>;
    }>;
    findById(tenantId: string, id: string): Promise<{
        policies: {
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
    } & {
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
    }>;
    update(tenantId: string, id: string, dto: UpdatePayerDto): Promise<{
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
    }>;
    delete(tenantId: string, id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=payer.controller.d.ts.map