/**
 * Triage Service
 *
 * Business logic for triage management
 */
import { PrismaService } from '@zeal/database-clinical';
import { CreateTriageDto, UpdateTriageDto } from './dto/triage.dto';
export declare class TriageService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    /**
     * Create a new triage record
     */
    createTriage(dto: CreateTriageDto, context: any): Promise<{
        encounter: {
            patient: {
                id: string;
                mrn: string;
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: string;
            };
        } & {
            id: string;
            tenantId: string;
            patientId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            facilityId: string;
            startTime: Date;
            endTime: Date | null;
            notes: string | null;
            appointmentId: string | null;
            primaryStaffId: string;
            encounterClass: string;
            priority: string;
            encounterSource: string;
            walkInDetails: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            chiefComplaint: string | null;
            presentingSymptoms: string | null;
            vitalSigns: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            allergies: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            currentMedications: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            medicalHistory: string | null;
            socialHistory: string | null;
            familyHistory: string | null;
            dischargeDisposition: string | null;
            followUpInstructions: string | null;
            encounterType: string;
        };
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        vitalSigns: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        allergies: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        currentMedications: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        encounterId: string;
        triageStaffId: string;
        triageLevel: number;
        chiefComplaintsAndHPI: string;
        painScore: number | null;
        triageNotes: string | null;
        triageTime: Date;
    }>;
    /**
     * Get triage by encounter ID
     */
    getTriageByEncounterId(encounterId: string, tenantId: string): Promise<{
        encounter: {
            patient: {
                id: string;
                mrn: string;
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: string;
            };
        } & {
            id: string;
            tenantId: string;
            patientId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            facilityId: string;
            startTime: Date;
            endTime: Date | null;
            notes: string | null;
            appointmentId: string | null;
            primaryStaffId: string;
            encounterClass: string;
            priority: string;
            encounterSource: string;
            walkInDetails: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            chiefComplaint: string | null;
            presentingSymptoms: string | null;
            vitalSigns: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            allergies: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            currentMedications: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            medicalHistory: string | null;
            socialHistory: string | null;
            familyHistory: string | null;
            dischargeDisposition: string | null;
            followUpInstructions: string | null;
            encounterType: string;
        };
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        vitalSigns: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        allergies: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        currentMedications: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        encounterId: string;
        triageStaffId: string;
        triageLevel: number;
        chiefComplaintsAndHPI: string;
        painScore: number | null;
        triageNotes: string | null;
        triageTime: Date;
    }>;
    /**
     * Get triage by ID
     */
    getTriageById(id: string, tenantId: string): Promise<{
        encounter: {
            patient: {
                id: string;
                mrn: string;
                firstName: string;
                lastName: string;
                middleName: string | null;
                dateOfBirth: Date;
                gender: string;
                phoneNumber: string | null;
                email: string | null;
            };
        } & {
            id: string;
            tenantId: string;
            patientId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            facilityId: string;
            startTime: Date;
            endTime: Date | null;
            notes: string | null;
            appointmentId: string | null;
            primaryStaffId: string;
            encounterClass: string;
            priority: string;
            encounterSource: string;
            walkInDetails: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            chiefComplaint: string | null;
            presentingSymptoms: string | null;
            vitalSigns: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            allergies: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            currentMedications: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            medicalHistory: string | null;
            socialHistory: string | null;
            familyHistory: string | null;
            dischargeDisposition: string | null;
            followUpInstructions: string | null;
            encounterType: string;
        };
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        vitalSigns: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        allergies: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        currentMedications: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        encounterId: string;
        triageStaffId: string;
        triageLevel: number;
        chiefComplaintsAndHPI: string;
        painScore: number | null;
        triageNotes: string | null;
        triageTime: Date;
    }>;
    /**
     * Update triage
     */
    updateTriage(id: string, dto: UpdateTriageDto, context: any): Promise<{
        encounter: {
            patient: {
                id: string;
                mrn: string;
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: string;
            };
        } & {
            id: string;
            tenantId: string;
            patientId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            facilityId: string;
            startTime: Date;
            endTime: Date | null;
            notes: string | null;
            appointmentId: string | null;
            primaryStaffId: string;
            encounterClass: string;
            priority: string;
            encounterSource: string;
            walkInDetails: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            chiefComplaint: string | null;
            presentingSymptoms: string | null;
            vitalSigns: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            allergies: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            currentMedications: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            medicalHistory: string | null;
            socialHistory: string | null;
            familyHistory: string | null;
            dischargeDisposition: string | null;
            followUpInstructions: string | null;
            encounterType: string;
        };
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        vitalSigns: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        allergies: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        currentMedications: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        encounterId: string;
        triageStaffId: string;
        triageLevel: number;
        chiefComplaintsAndHPI: string;
        painScore: number | null;
        triageNotes: string | null;
        triageTime: Date;
    }>;
    /**
     * Delete triage
     */
    deleteTriage(id: string, tenantId: string): Promise<{
        message: string;
    }>;
    /**
     * Get all triages by patient ID
     */
    getPatientTriages(patientId: string, tenantId: string): Promise<({
        encounter: {
            id: string;
            status: string;
            startTime: Date;
            encounterClass: string;
        };
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        vitalSigns: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        allergies: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        currentMedications: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        encounterId: string;
        triageStaffId: string;
        triageLevel: number;
        chiefComplaintsAndHPI: string;
        painScore: number | null;
        triageNotes: string | null;
        triageTime: Date;
    })[]>;
    /**
     * Get triages by triage level (for prioritization)
     */
    getTriagesByLevel(triageLevel: number, tenantId: string): Promise<({
        encounter: {
            patient: {
                id: string;
                mrn: string;
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: string;
            };
        } & {
            id: string;
            tenantId: string;
            patientId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            facilityId: string;
            startTime: Date;
            endTime: Date | null;
            notes: string | null;
            appointmentId: string | null;
            primaryStaffId: string;
            encounterClass: string;
            priority: string;
            encounterSource: string;
            walkInDetails: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            chiefComplaint: string | null;
            presentingSymptoms: string | null;
            vitalSigns: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            allergies: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            currentMedications: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
            medicalHistory: string | null;
            socialHistory: string | null;
            familyHistory: string | null;
            dischargeDisposition: string | null;
            followUpInstructions: string | null;
            encounterType: string;
        };
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        createdAt: Date;
        updatedAt: Date;
        vitalSigns: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        allergies: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        currentMedications: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        encounterId: string;
        triageStaffId: string;
        triageLevel: number;
        chiefComplaintsAndHPI: string;
        painScore: number | null;
        triageNotes: string | null;
        triageTime: Date;
    })[]>;
}
//# sourceMappingURL=triage.service.d.ts.map