/**
 * Patient History Service
 *
 * Handles tracking and querying patient data change history
 */
import { PrismaService } from '@zeal/database-clinical';
export interface ChangeHistoryEntry {
    fieldName: string;
    oldValue: string | null;
    newValue: string | null;
}
export interface RecordChangeOptions {
    tenantId: string;
    patientId: string;
    changes: ChangeHistoryEntry[];
    changeType: 'update' | 'correction' | 'patient_request' | 'merge' | 'import';
    changeReason?: string;
    changedBy: string;
    changedAtFacility?: string;
    approvedBy?: string;
    patientConsent?: boolean;
    consentDocUrl?: string;
    supportingDocUrl?: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare class PatientHistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Record multiple field changes in history
     */
    recordChanges(options: RecordChangeOptions): Promise<void>;
    /**
     * Get complete change history for a patient
     */
    getPatientHistory(tenantId: string, patientId: string, options?: {
        fieldName?: string;
        changeType?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        fieldName: string;
        changeType: string;
        id: string;
        tenantId: string;
        patientId: string;
        oldValue: string | null;
        newValue: string | null;
        changeReason: string | null;
        supportingDocUrl: string | null;
        changedBy: string;
        approvedBy: string | null;
        changedAtFacility: string | null;
        changedAt: Date;
        patientConsent: boolean;
        consentDocUrl: string | null;
        ipAddress: string | null;
        userAgent: string | null;
    }[]>;
    /**
     * Get history for a specific field
     */
    getFieldHistory(tenantId: string, patientId: string, fieldName: string): Promise<{
        fieldName: string;
        changeType: string;
        id: string;
        tenantId: string;
        patientId: string;
        oldValue: string | null;
        newValue: string | null;
        changeReason: string | null;
        supportingDocUrl: string | null;
        changedBy: string;
        approvedBy: string | null;
        changedAtFacility: string | null;
        changedAt: Date;
        patientConsent: boolean;
        consentDocUrl: string | null;
        ipAddress: string | null;
        userAgent: string | null;
    }[]>;
    /**
     * Get all changes made by a specific user
     */
    getChangesByUser(tenantId: string, userId: string, options?: {
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<{
        fieldName: string;
        changeType: string;
        id: string;
        tenantId: string;
        patientId: string;
        oldValue: string | null;
        newValue: string | null;
        changeReason: string | null;
        supportingDocUrl: string | null;
        changedBy: string;
        approvedBy: string | null;
        changedAtFacility: string | null;
        changedAt: Date;
        patientConsent: boolean;
        consentDocUrl: string | null;
        ipAddress: string | null;
        userAgent: string | null;
    }[]>;
    /**
     * Get changes requiring approval
     */
    getPendingApprovals(tenantId: string): Promise<{
        fieldName: string;
        changeType: string;
        id: string;
        tenantId: string;
        patientId: string;
        oldValue: string | null;
        newValue: string | null;
        changeReason: string | null;
        supportingDocUrl: string | null;
        changedBy: string;
        approvedBy: string | null;
        changedAtFacility: string | null;
        changedAt: Date;
        patientConsent: boolean;
        consentDocUrl: string | null;
        ipAddress: string | null;
        userAgent: string | null;
    }[]>;
    /**
     * Approve a change
     */
    approveChange(historyId: string, approvedBy: string): Promise<{
        fieldName: string;
        changeType: string;
        id: string;
        tenantId: string;
        patientId: string;
        oldValue: string | null;
        newValue: string | null;
        changeReason: string | null;
        supportingDocUrl: string | null;
        changedBy: string;
        approvedBy: string | null;
        changedAtFacility: string | null;
        changedAt: Date;
        patientConsent: boolean;
        consentDocUrl: string | null;
        ipAddress: string | null;
        userAgent: string | null;
    }>;
    /**
     * Get change statistics
     */
    getChangeStats(tenantId: string, options?: {
        startDate?: Date;
        endDate?: Date;
        groupBy?: 'changeType' | 'fieldName' | 'changedBy';
    }): Promise<(import("@zeal/database-clinical").Prisma.PickEnumerable<import("@zeal/database-clinical").Prisma.PatientHistoryGroupByOutputType, any[]> & {
        _count: {
            id: number;
        };
    })[]>;
    /**
     * Compare patient state at two points in time
     */
    getPatientStateAt(tenantId: string, patientId: string, timestamp: Date): Promise<Record<string, any>>;
    /**
     * Detect unusual change patterns (for fraud detection)
     */
    detectUnusualPatterns(tenantId: string, options?: {
        threshold?: number;
        timeWindow?: number;
    }): Promise<unknown>;
}
//# sourceMappingURL=patient-history.service.d.ts.map