import { ReceiptService } from '../services/receipt.service';
import { CreateReceiptDto, UpdateReceiptDto, AllocateReceiptDto, PaymentMethod } from '../dto/receipt.dto';
export declare class ReceiptController {
    private readonly receiptService;
    constructor(receiptService: ReceiptService);
    create(tenantId: string, dto: CreateReceiptDto): Promise<({
        allocations: ({
            invoice: {
                status: string;
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                encounterId: string | null;
                currency: string;
                grossAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                mrn: string | null;
                patientDisplayName: string | null;
                invoiceNumber: string;
                invoiceDate: Date;
                dueDate: Date | null;
                totalDiscounts: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                netAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                amountPaid: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                balanceDue: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            invoiceId: string;
            allocatedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            receiptId: string;
        })[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        notes: string | null;
        currency: string;
        mrn: string | null;
        patientDisplayName: string | null;
        amount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        invoiceId: string | null;
        receiptNumber: string;
        receiptDate: Date;
        paymentMethod: string;
        txnReference: string | null;
    }) | null>;
    findAll(tenantId: string, patientId?: string, invoiceId?: string, paymentMethod?: PaymentMethod, dateFrom?: string, dateTo?: string): Promise<({
        allocations: ({
            invoice: {
                status: string;
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                encounterId: string | null;
                currency: string;
                grossAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                mrn: string | null;
                patientDisplayName: string | null;
                invoiceNumber: string;
                invoiceDate: Date;
                dueDate: Date | null;
                totalDiscounts: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                netAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                amountPaid: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                balanceDue: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            invoiceId: string;
            allocatedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            receiptId: string;
        })[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        notes: string | null;
        currency: string;
        mrn: string | null;
        patientDisplayName: string | null;
        amount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        invoiceId: string | null;
        receiptNumber: string;
        receiptDate: Date;
        paymentMethod: string;
        txnReference: string | null;
    })[]>;
    getStatistics(tenantId: string, patientId?: string): Promise<{
        total: number;
        totalAmount: number | import("@zeal/database-rcm/generated/runtime/library").Decimal;
        byPaymentMethod: Record<string, any>;
    }>;
    findByReceiptNumber(tenantId: string, receiptNumber: string): Promise<{
        allocations: ({
            invoice: {
                status: string;
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                encounterId: string | null;
                currency: string;
                grossAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                mrn: string | null;
                patientDisplayName: string | null;
                invoiceNumber: string;
                invoiceDate: Date;
                dueDate: Date | null;
                totalDiscounts: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                netAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                amountPaid: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                balanceDue: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            invoiceId: string;
            allocatedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            receiptId: string;
        })[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        notes: string | null;
        currency: string;
        mrn: string | null;
        patientDisplayName: string | null;
        amount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        invoiceId: string | null;
        receiptNumber: string;
        receiptDate: Date;
        paymentMethod: string;
        txnReference: string | null;
    }>;
    findByPatient(tenantId: string, patientId: string): Promise<({
        allocations: {
            id: string;
            createdAt: Date;
            invoiceId: string;
            allocatedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            receiptId: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        notes: string | null;
        currency: string;
        mrn: string | null;
        patientDisplayName: string | null;
        amount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        invoiceId: string | null;
        receiptNumber: string;
        receiptDate: Date;
        paymentMethod: string;
        txnReference: string | null;
    })[]>;
    findById(tenantId: string, id: string): Promise<{
        allocations: ({
            invoice: {
                status: string;
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                encounterId: string | null;
                currency: string;
                grossAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                mrn: string | null;
                patientDisplayName: string | null;
                invoiceNumber: string;
                invoiceDate: Date;
                dueDate: Date | null;
                totalDiscounts: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                netAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                amountPaid: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                balanceDue: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            invoiceId: string;
            allocatedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            receiptId: string;
        })[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        notes: string | null;
        currency: string;
        mrn: string | null;
        patientDisplayName: string | null;
        amount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        invoiceId: string | null;
        receiptNumber: string;
        receiptDate: Date;
        paymentMethod: string;
        txnReference: string | null;
    }>;
    update(tenantId: string, id: string, dto: UpdateReceiptDto): Promise<{
        allocations: ({
            invoice: {
                status: string;
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                encounterId: string | null;
                currency: string;
                grossAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                mrn: string | null;
                patientDisplayName: string | null;
                invoiceNumber: string;
                invoiceDate: Date;
                dueDate: Date | null;
                totalDiscounts: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                netAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                amountPaid: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                balanceDue: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            invoiceId: string;
            allocatedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            receiptId: string;
        })[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        notes: string | null;
        currency: string;
        mrn: string | null;
        patientDisplayName: string | null;
        amount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        invoiceId: string | null;
        receiptNumber: string;
        receiptDate: Date;
        paymentMethod: string;
        txnReference: string | null;
    }>;
    allocate(tenantId: string, id: string, dto: AllocateReceiptDto): Promise<({
        allocations: ({
            invoice: {
                status: string;
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                encounterId: string | null;
                currency: string;
                grossAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                mrn: string | null;
                patientDisplayName: string | null;
                invoiceNumber: string;
                invoiceDate: Date;
                dueDate: Date | null;
                totalDiscounts: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                netAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                amountPaid: import("@zeal/database-rcm/generated/runtime/library").Decimal;
                balanceDue: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            invoiceId: string;
            allocatedAmount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
            receiptId: string;
        })[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        notes: string | null;
        currency: string;
        mrn: string | null;
        patientDisplayName: string | null;
        amount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        invoiceId: string | null;
        receiptNumber: string;
        receiptDate: Date;
        paymentMethod: string;
        txnReference: string | null;
    }) | null>;
    delete(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        notes: string | null;
        currency: string;
        mrn: string | null;
        patientDisplayName: string | null;
        amount: import("@zeal/database-rcm/generated/runtime/library").Decimal;
        invoiceId: string | null;
        receiptNumber: string;
        receiptDate: Date;
        paymentMethod: string;
        txnReference: string | null;
    }>;
}
//# sourceMappingURL=receipt.controller.d.ts.map