/**
 * Consent Integration Examples
 *
 * Shows how to integrate consent checks into existing workflows
 */
import { ConsentService } from './consent.service';
import { ConsentType } from '@zeal/shared-types';
import { PrismaClient } from '@zeal/database-clinical';
export declare class PatientRegistrationService {
    private prisma;
    private consentService;
    constructor(prisma: PrismaClient, consentService: ConsentService);
    registerPatientWithConsents(patientData: any, consents: Array<{
        consentType: ConsentType;
        signatureUrl?: string;
        documentUrl?: string;
    }>, context: any): Promise<{
        id: string;
        tenantId: string;
        mrn: string;
        nationalId: string | null;
        nationalIdType: string | null;
        issuingCountry: string | null;
        title: string | null;
        firstName: string;
        lastName: string;
        middleName: string | null;
        displayName: string | null;
        dateOfBirth: Date;
        gender: string;
        maritalStatus: string | null;
        nationality: string | null;
        preferredLanguage: string | null;
        phoneNumber: string | null;
        email: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        state: string | null;
        postalCode: string | null;
        country: string | null;
        bloodGroup: string | null;
        emergencyContact: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        insuranceInfo: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        createdBy: string;
        createdAtFacility: string;
        registrationSource: string;
        registrationNotes: string | null;
        updatedBy: string | null;
        updatedAtFacility: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare class NotificationService {
    private consentService;
    constructor(consentService: ConsentService);
    sendSMS(patientId: string, tenantId: string, message: string): Promise<{
        sent: boolean;
        message: string;
    }>;
    sendEmail(patientId: string, tenantId: string, subject: string, body: string): Promise<{
        sent: boolean;
        message: string;
    }>;
    private sendSMSInternal;
    private sendEmailInternal;
}
export declare class InsuranceService {
    private consentService;
    constructor(consentService: ConsentService);
    shareDataWithInsurance(patientId: string, tenantId: string, claimData: any): Promise<{
        submitted: boolean;
    }>;
    private submitInsuranceClaim;
}
export declare class ResearchService {
    private prisma;
    private consentService;
    constructor(prisma: PrismaClient, consentService: ConsentService);
    getAnonymizedDataForResearch(tenantId: string): Promise<{
        dateOfBirth: Date;
        gender: string;
        nationality: string | null;
        bloodGroup: string | null;
    }[]>;
}
export declare class SurgeryService {
    private prisma;
    private consentService;
    constructor(prisma: PrismaClient, consentService: ConsentService);
    scheduleSurgery(patientId: string, surgeryDetails: any, signatureUrl: string, witnessedBy: string, witnessSignatureUrl: string, context: any): Promise<{
        surgery: unknown;
        consent: {
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
        };
    }>;
}
export declare class PatientDataChangeService {
    private prisma;
    private consentService;
    constructor(prisma: PrismaClient, consentService: ConsentService);
    patientRequestDataChange(patientId: string, tenantId: string, changes: any, consentDocUrl: string, context: any): Promise<{
        consent: {
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
        };
        message: string;
    }>;
}
import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class ConsentGuard implements CanActivate {
    private consentService;
    private requiredConsentType;
    constructor(consentService: ConsentService, requiredConsentType: ConsentType);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class MarketingService {
    private prisma;
    private consentService;
    constructor(prisma: PrismaClient, consentService: ConsentService);
    sendMarketingCampaign(tenantId: string, campaignMessage: string): Promise<{
        totalRecipients: number;
        campaign: string;
    }>;
}
export declare class ConsentExpiryJobService {
    private consentService;
    constructor(consentService: ConsentService);
    notifyExpiringConsents(tenantId: string): Promise<{
        notified: number;
        consents: ({
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
        })[];
    }>;
    private sendConsentRenewalNotification;
}
export declare class GDPRService {
    private consentService;
    private prisma;
    constructor(consentService: ConsentService, prisma: PrismaClient);
    exportPatientData(patientId: string, tenantId: string): Promise<{
        patient: {
            id: string;
            tenantId: string;
            mrn: string;
            nationalId: string | null;
            nationalIdType: string | null;
            issuingCountry: string | null;
            title: string | null;
            firstName: string;
            lastName: string;
            middleName: string | null;
            displayName: string | null;
            dateOfBirth: Date;
            gender: string;
            maritalStatus: string | null;
            nationality: string | null;
            preferredLanguage: string | null;
            phoneNumber: string | null;
            email: string | null;
            addressLine1: string | null;
            addressLine2: string | null;
            city: string | null;
            state: string | null;
            postalCode: string | null;
            country: string | null;
            bloodGroup: string | null;
            emergencyContact: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            insuranceInfo: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            createdBy: string;
            createdAtFacility: string;
            registrationSource: string;
            registrationNotes: string | null;
            updatedBy: string | null;
            updatedAtFacility: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        consents: {
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
        };
        exportDate: string;
        exportReason: string;
    }>;
    deletePatientData(patientId: string, tenantId: string, context: any): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=consent-integration.example.d.ts.map