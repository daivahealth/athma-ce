/**
 * Patient Consent Service
 *
 * GDPR-compliant consent management
 */
import { PrismaService } from '@zeal/database-clinical';
import { ConsentType, ConsentCategory, CaptureMethod, RevocationMethod, LinkedEntityType } from '@zeal/shared-types';
export interface RequestContext {
    userId: string;
    tenantId: string;
    facilityId: string;
    userRole: string;
    ipAddress?: string;
    userAgent?: string;
}
export interface CreateConsentDto {
    patientId: string;
    consentType: ConsentType;
    purpose: string;
    description?: string;
    captureMethod: CaptureMethod;
    effectiveFrom?: Date;
    effectiveUntil?: Date;
    signatureUrl?: string;
    documentUrl?: string;
    witnessedBy?: string;
    witnessSignatureUrl?: string;
    linkedEntityType?: LinkedEntityType;
    linkedEntityId?: string;
    metadata?: Record<string, any>;
}
export interface RevokeConsentDto {
    reason: string;
    revocationMethod: RevocationMethod;
}
export declare class ConsentService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Create a new patient consent
     */
    createConsent(dto: CreateConsentDto, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        documentUrl: string | null;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        consentStatus: string;
        consentScope: string | null;
        purpose: string;
        description: string | null;
        legalBasis: string | null;
        effectiveFrom: Date;
        effectiveUntil: Date | null;
        isActive: boolean;
        captureMethod: string;
        capturedBy: string | null;
        capturedAt: Date;
        capturedAtFacility: string | null;
        signatureUrl: string | null;
        witnessedBy: string | null;
        witnessSignatureUrl: string | null;
        revokedAt: Date | null;
        revokedBy: string | null;
        revocationReason: string | null;
        revocationMethod: string | null;
        version: number;
        parentConsentId: string | null;
        linkedEntityType: string | null;
        linkedEntityId: string | null;
    }>;
    /**
     * Revoke a patient consent
     */
    revokeConsent(consentId: string, dto: RevokeConsentDto, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        documentUrl: string | null;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        consentStatus: string;
        consentScope: string | null;
        purpose: string;
        description: string | null;
        legalBasis: string | null;
        effectiveFrom: Date;
        effectiveUntil: Date | null;
        isActive: boolean;
        captureMethod: string;
        capturedBy: string | null;
        capturedAt: Date;
        capturedAtFacility: string | null;
        signatureUrl: string | null;
        witnessedBy: string | null;
        witnessSignatureUrl: string | null;
        revokedAt: Date | null;
        revokedBy: string | null;
        revocationReason: string | null;
        revocationMethod: string | null;
        version: number;
        parentConsentId: string | null;
        linkedEntityType: string | null;
        linkedEntityId: string | null;
    }>;
    /**
     * Check if patient has active consent for a specific type
     */
    hasActiveConsent(tenantId: string, patientId: string, consentType: ConsentType): Promise<boolean>;
    /**
     * Get all active consents for a patient
     */
    getPatientConsents(tenantId: string, patientId: string, options?: {
        includeRevoked?: boolean;
        category?: ConsentCategory;
        consentType?: ConsentType;
    }): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        documentUrl: string | null;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        consentStatus: string;
        consentScope: string | null;
        purpose: string;
        description: string | null;
        legalBasis: string | null;
        effectiveFrom: Date;
        effectiveUntil: Date | null;
        isActive: boolean;
        captureMethod: string;
        capturedBy: string | null;
        capturedAt: Date;
        capturedAtFacility: string | null;
        signatureUrl: string | null;
        witnessedBy: string | null;
        witnessSignatureUrl: string | null;
        revokedAt: Date | null;
        revokedBy: string | null;
        revocationReason: string | null;
        revocationMethod: string | null;
        version: number;
        parentConsentId: string | null;
        linkedEntityType: string | null;
        linkedEntityId: string | null;
    }[]>;
    /**
     * Get consent history for a patient
     */
    getConsentHistory(tenantId: string, patientId: string, consentType?: ConsentType): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        documentUrl: string | null;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        consentStatus: string;
        consentScope: string | null;
        purpose: string;
        description: string | null;
        legalBasis: string | null;
        effectiveFrom: Date;
        effectiveUntil: Date | null;
        isActive: boolean;
        captureMethod: string;
        capturedBy: string | null;
        capturedAt: Date;
        capturedAtFacility: string | null;
        signatureUrl: string | null;
        witnessedBy: string | null;
        witnessSignatureUrl: string | null;
        revokedAt: Date | null;
        revokedBy: string | null;
        revocationReason: string | null;
        revocationMethod: string | null;
        version: number;
        parentConsentId: string | null;
        linkedEntityType: string | null;
        linkedEntityId: string | null;
    }[]>;
    /**
     * Get required consents for patient registration
     */
    getRequiredConsents(): ConsentType[];
    /**
     * Check if all required consents are granted
     */
    validateRequiredConsents(tenantId: string, patientId: string): Promise<{
        isValid: boolean;
        missing: ConsentType[];
    }>;
    /**
     * Expire outdated consents (run as scheduled job)
     */
    expireOutdatedConsents(tenantId: string): Promise<import("@zeal/database-clinical").Prisma.BatchPayload>;
    /**
     * Get consents expiring soon (for notifications)
     */
    getExpiringConsents(tenantId: string, daysUntilExpiry?: number): Promise<({
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            phoneNumber: string | null;
            email: string | null;
        };
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        documentUrl: string | null;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        consentStatus: string;
        consentScope: string | null;
        purpose: string;
        description: string | null;
        legalBasis: string | null;
        effectiveFrom: Date;
        effectiveUntil: Date | null;
        isActive: boolean;
        captureMethod: string;
        capturedBy: string | null;
        capturedAt: Date;
        capturedAtFacility: string | null;
        signatureUrl: string | null;
        witnessedBy: string | null;
        witnessSignatureUrl: string | null;
        revokedAt: Date | null;
        revokedBy: string | null;
        revocationReason: string | null;
        revocationMethod: string | null;
        version: number;
        parentConsentId: string | null;
        linkedEntityType: string | null;
        linkedEntityId: string | null;
    })[]>;
    /**
     * Bulk create consents (for patient registration)
     */
    createBulkConsents(patientId: string, consents: CreateConsentDto[], context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        documentUrl: string | null;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        consentStatus: string;
        consentScope: string | null;
        purpose: string;
        description: string | null;
        legalBasis: string | null;
        effectiveFrom: Date;
        effectiveUntil: Date | null;
        isActive: boolean;
        captureMethod: string;
        capturedBy: string | null;
        capturedAt: Date;
        capturedAtFacility: string | null;
        signatureUrl: string | null;
        witnessedBy: string | null;
        witnessSignatureUrl: string | null;
        revokedAt: Date | null;
        revokedBy: string | null;
        revocationReason: string | null;
        revocationMethod: string | null;
        version: number;
        parentConsentId: string | null;
        linkedEntityType: string | null;
        linkedEntityId: string | null;
    }[]>;
    /**
     * Get consent audit trail
     */
    getConsentAuditTrail(tenantId: string, patientId: string): Promise<{
        id: string;
        consentType: string;
        consentStatus: string;
        capturedAt: Date;
        capturedBy: string | null;
        revokedAt: Date | null;
        revokedBy: string | null;
        revocationReason: string | null;
        effectiveFrom: Date;
        effectiveUntil: Date | null;
    }[]>;
    /**
     * Check consent for specific action
     */
    checkConsentForAction(tenantId: string, patientId: string, action: string): Promise<{
        allowed: boolean;
        consentType?: ConsentType;
        reason?: string;
    }>;
    /**
     * Get consent statistics
     */
    getConsentStatistics(tenantId: string): Promise<{
        totalPatients: number;
        consentStats: (import("@zeal/database-clinical").Prisma.PickEnumerable<import("@zeal/database-clinical").Prisma.PatientConsentGroupByOutputType, ("consentType" | "consentStatus")[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
    /**
     * Renew consent (for auto-renewable consents)
     */
    renewConsent(consentId: string, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        documentUrl: string | null;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        consentStatus: string;
        consentScope: string | null;
        purpose: string;
        description: string | null;
        legalBasis: string | null;
        effectiveFrom: Date;
        effectiveUntil: Date | null;
        isActive: boolean;
        captureMethod: string;
        capturedBy: string | null;
        capturedAt: Date;
        capturedAtFacility: string | null;
        signatureUrl: string | null;
        witnessedBy: string | null;
        witnessSignatureUrl: string | null;
        revokedAt: Date | null;
        revokedBy: string | null;
        revocationReason: string | null;
        revocationMethod: string | null;
        version: number;
        parentConsentId: string | null;
        linkedEntityType: string | null;
        linkedEntityId: string | null;
    }>;
    /**
     * Export consent data for patient (GDPR data portability)
     */
    exportPatientConsents(tenantId: string, patientId: string): Promise<{
        patientId: string;
        exportDate: string;
        consents: {
            consentType: string;
            consentStatus: string;
            purpose: string;
            effectiveFrom: Date;
            effectiveUntil: Date | null;
            capturedAt: Date;
            revokedAt: Date | null;
            revocationReason: string | null;
        }[];
    }>;
}
//# sourceMappingURL=consent.service.d.ts.map