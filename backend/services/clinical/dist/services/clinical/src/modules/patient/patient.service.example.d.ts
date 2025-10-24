/**
 * Patient Service - Example Implementation
 *
 * Shows how to integrate patient history tracking with patient updates
 */
import { PrismaClient } from '@zeal/database-clinical';
import { PatientHistoryService } from './patient-history.service';
export interface RequestContext {
    userId: string;
    tenantId: string;
    facilityId: string;
    userRole: string;
    ipAddress?: string;
    userAgent?: string;
}
export interface CreatePatientDto {
    nationalId?: string;
    nationalIdType?: string;
    issuingCountry?: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: Date;
    gender: string;
    maritalStatus?: string;
    nationality?: string;
    preferredLanguage?: string;
    phoneNumber?: string;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    bloodGroup?: string;
    emergencyContact?: any;
    insuranceInfo?: any;
    registrationSource?: string;
    registrationNotes?: string;
}
export interface UpdatePatientDto {
    [key: string]: any;
    changeReason?: string;
    supportingDocUrl?: string;
    patientConsent?: boolean;
    consentDocUrl?: string;
}
export declare class PatientService {
    private prisma;
    private historyService;
    constructor(prisma: PrismaClient, historyService: PatientHistoryService);
    /**
     * Register a new patient
     */
    registerPatient(dto: CreatePatientDto, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        nationalId: string | null;
        nationalIdType: string | null;
        issuingCountry: string | null;
        firstName: string;
        lastName: string;
        middleName: string | null;
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
    /**
     * Update patient with change history tracking
     */
    updatePatient(patientId: string, dto: UpdatePatientDto, context: RequestContext): Promise<{
        id: string;
        tenantId: string;
        nationalId: string | null;
        nationalIdType: string | null;
        issuingCountry: string | null;
        firstName: string;
        lastName: string;
        middleName: string | null;
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
    /**
     * Get patient with history
     */
    getPatientWithHistory(patientId: string, tenantId: string): Promise<{
        history: {
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
        }[];
        appointments: {
            id: string;
            tenantId: string;
            patientId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            startTime: Date;
            facilityId: string;
            spaceId: string | null;
            staffId: string | null;
            appointmentType: string;
            endTime: Date;
            duration: number;
            notes: string | null;
            visitType: string | null;
            linkedEncounterId: string | null;
            seriesId: string | null;
            cancellationReason: string | null;
            rescheduleReason: string | null;
        }[];
        documents: {
            id: string;
            tenantId: string;
            patientId: string;
            issuingCountry: string;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            documentNumber: string;
            issuingAuthority: string | null;
            issueDate: Date | null;
            expiryDate: Date | null;
            isPrimaryIdentity: boolean;
            documentUrl: string | null;
            verificationStatus: string;
            verifiedBy: string | null;
            verifiedAt: Date | null;
            verificationNotes: string | null;
            metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        }[];
        id: string;
        tenantId: string;
        nationalId: string | null;
        nationalIdType: string | null;
        issuingCountry: string | null;
        firstName: string;
        lastName: string;
        middleName: string | null;
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
    /**
     * Patient-initiated change request
     * Requires approval before applying
     */
    createChangeRequest(patientId: string, requestedChanges: UpdatePatientDto, context: RequestContext & {
        requestedBy: 'patient' | 'guardian';
    }): Promise<{
        message: string;
        pendingChanges: {
            fieldName: string;
            oldValue: string | null;
            newValue: string | null;
        }[];
    }>;
    /**
     * Approve and apply change request
     */
    approveChangeRequest(historyId: string, context: RequestContext): Promise<{
        message: string;
    }>;
    /**
     * Get field change timeline
     */
    getFieldTimeline(patientId: string, tenantId: string, fieldName: string): Promise<{
        fieldName: string;
        currentValue: any;
        changes: {
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
        }[];
    }>;
    /**
     * Get audit report for a patient
     */
    getAuditReport(patientId: string, tenantId: string): Promise<{
        patient: {
            id: string;
            name: string;
            nationalId: string | null;
        };
        registeredBy: string;
        registeredAt: Date;
        registeredAtFacility: string;
        totalChanges: number;
        changesByType: Record<string, {
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
        recentChanges: {
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
        }[];
    }>;
}
//# sourceMappingURL=patient.service.example.d.ts.map