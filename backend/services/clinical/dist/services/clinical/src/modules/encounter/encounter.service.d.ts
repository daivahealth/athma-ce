/**
 * Encounter Service
 *
 * Business logic for encounter management
 */
import { PrismaService } from '@zeal/database-clinical';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { UpdateEncounterDto } from './dto/update-encounter.dto';
import { SearchEncounterDto } from './dto/search-encounter.dto';
export declare class EncounterService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    /**
     * Create a new encounter
     */
    createEncounter(dto: CreateEncounterDto, context: any): Promise<{
        patient: {
            id: string;
            mrn: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            gender: string;
        };
        appointment: {
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
        } | null;
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
    }>;
    /**
     * Search encounters with filters
     */
    searchEncounters(tenantId: string, query: SearchEncounterDto): Promise<{
        data: ({
            patient: {
                id: string;
                mrn: string;
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: string;
            };
            appointment: {
                id: string;
                status: string;
                appointmentType: string;
            } | null;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    /**
     * Get encounter by ID
     */
    getEncounterById(id: string, tenantId: string): Promise<{
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
        appointment: {
            id: string;
            status: string;
            startTime: Date;
            appointmentType: string;
            endTime: Date;
        } | null;
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
    }>;
    /**
     * Update encounter
     */
    updateEncounter(id: string, dto: UpdateEncounterDto, context: any): Promise<{
        patient: {
            id: string;
            mrn: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            gender: string;
        };
        appointment: {
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
        } | null;
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
    }>;
    /**
     * Update encounter status
     */
    updateEncounterStatus(id: string, status: string, tenantId: string): Promise<{
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
    }>;
    /**
     * Get patient encounters
     */
    getPatientEncounters(patientId: string, tenantId: string): Promise<({
        appointment: {
            id: string;
            status: string;
            appointmentType: string;
        } | null;
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
    })[]>;
    /**
     * Get today's encounters for a facility
     */
    getTodayEncounters(facilityId: string, tenantId: string): Promise<({
        patient: {
            id: string;
            mrn: string;
            firstName: string;
            lastName: string;
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
    })[]>;
}
//# sourceMappingURL=encounter.service.d.ts.map