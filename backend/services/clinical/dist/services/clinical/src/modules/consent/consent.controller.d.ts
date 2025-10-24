/**
 * Consent Controller
 *
 * REST API endpoints for patient consent management
 */
import { ConsentService } from './consent.service';
import { ConsentType } from '@zeal/shared-types';
export declare class ConsentController {
    private readonly consentService;
    constructor(consentService: ConsentService);
    /**
     * POST /patients/:patientId/consents - Create consent
     */
    createConsent(patientId: string, dto: any, req: any): Promise<{
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
     * GET /patients/:patientId/consents - Get patient consents
     */
    getConsents(patientId: string, includeRevoked: string, category: string, consentType: ConsentType, req: any): Promise<{
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
     * GET /patients/:patientId/consents/:consentId - Get consent by ID
     */
    getConsent(consentId: string, req: any): Promise<{
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
     * POST /patients/:patientId/consents/:consentId/revoke - Revoke consent
     */
    revokeConsent(consentId: string, dto: {
        reason: string;
        revocationMethod: string;
    }, req: any): Promise<{
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
     * POST /patients/:patientId/consents/:consentId/renew - Renew consent
     */
    renewConsent(consentId: string, req: any): Promise<{
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
     * GET /patients/:patientId/consents/history - Get consent history
     */
    getConsentHistory(patientId: string, consentType: ConsentType, req: any): Promise<{
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
     * GET /patients/:patientId/consents/required - Get required consents
     */
    getRequiredConsents(): Promise<{
        required: ConsentType[];
    }>;
    /**
     * GET /patients/:patientId/consents/validate - Validate required consents
     */
    validateConsents(patientId: string, req: any): Promise<{
        isValid: boolean;
        missing: ConsentType[];
    }>;
    /**
     * POST /patients/:patientId/consents/bulk - Bulk create consents
     */
    bulkCreateConsents(patientId: string, body: {
        consents: any[];
    }, req: any): Promise<{
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
     * GET /patients/:patientId/consents/audit - Get consent audit trail
     */
    getAuditTrail(patientId: string, req: any): Promise<{
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
     * POST /patients/:patientId/consents/check-action - Check consent for action
     */
    checkAction(patientId: string, body: {
        action: string;
    }, req: any): Promise<{
        allowed: boolean;
        consentType?: ConsentType;
        reason?: string;
    }>;
    /**
     * GET /patients/:patientId/consents/export - Export consent data
     */
    exportConsents(patientId: string, req: any): Promise<{
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
    /**
     * GET /patients/:patientId/consents/expiring - Get expiring consents
     */
    getExpiringConsents(days: string, req: any): Promise<({
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
}
//# sourceMappingURL=consent.controller.d.ts.map