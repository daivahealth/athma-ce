/**
 * Patient Controller
 *
 * REST API endpoints for patient management
 */
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { SearchPatientsDto } from './dto/search-patients.dto';
export declare class PatientController {
    private readonly patientService;
    constructor(patientService: PatientService);
    /**
     * POST /patients - Create a new patient
     */
    createPatient(dto: CreatePatientDto, context: any): Promise<{
        id: string;
        tenantId: string;
        mrn: string;
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
     * GET /patients/registration/defaults - Default values for registration form
     * IMPORTANT: Must come before :id route to avoid "registration" being treated as an ID
     */
    getRegistrationDefaults(context: any): Promise<{
        country: {
            name: string;
            isoCode: string;
        };
        city: string;
        nationality: {
            name: string;
            isoCode: string;
        };
    }>;
    /**
     * GET /patients - Search patients
     */
    searchPatients(query: SearchPatientsDto, tenantId: string): Promise<{
        data: {
            id: string;
            tenantId: string;
            mrn: string;
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
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * GET /patients/:id - Get patient by ID
     */
    getPatient(id: string, tenantId: string): Promise<{
        id: string;
        tenantId: string;
        mrn: string;
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
     * PUT /patients/:id - Update patient
     */
    updatePatient(id: string, dto: UpdatePatientDto, context: any): Promise<{
        id: string;
        tenantId: string;
        mrn: string;
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
     * GET /patients/:id/history - Get patient with history
     */
    getPatientWithHistory(id: string, tenantId: string): Promise<{
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
            facilityId: string;
            startTime: Date;
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
        mrn: string;
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
     * POST /patients/:id/change-request - Create change request
     */
    createChangeRequest(id: string, dto: UpdatePatientDto, context: any): Promise<{
        message: string;
        pendingChanges: {
            fieldName: string;
            oldValue: string | null;
            newValue: string | null;
        }[];
    }>;
    /**
     * POST /patients/:id/approve/:historyId - Approve change request
     */
    approveChangeRequest(historyId: string, context: any): Promise<{
        message: string;
    }>;
    /**
     * GET /patients/:id/field/:fieldName/timeline - Get field timeline
     */
    getFieldTimeline(id: string, fieldName: string, tenantId: string): Promise<{
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
     * GET /patients/:id/audit - Get audit report
     */
    getAuditReport(id: string, tenantId: string): Promise<{
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
//# sourceMappingURL=patient.controller.d.ts.map