/**
 * Triage Controller
 *
 * REST API endpoints for triage management
 */
import { TriageService } from './triage.service';
import { CreateTriageDto, UpdateTriageDto } from './dto/triage.dto';
export declare class TriageController {
    private readonly triageService;
    constructor(triageService: TriageService);
    /**
     * POST /triage - Create a new triage record
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
     * GET /triage/encounter/:encounterId - Get triage by encounter ID
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
     * GET /triage/patient/:patientId - Get patient's triage history
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
     * GET /triage/level/:triageLevel - Get triages by priority level
     */
    getTriagesByLevel(triageLevel: string, tenantId: string): Promise<({
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
    /**
     * GET /triage/:id - Get triage by ID
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
     * PUT /triage/:id - Update triage
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
     * DELETE /triage/:id - Delete triage
     */
    deleteTriage(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=triage.controller.d.ts.map