/**
 * DTO for creating a new encounter
 */
export declare enum EncounterClass {
    AMB = "AMB",// Ambulatory
    EMER = "EMER",// Emergency
    FLD = "FLD",// Field
    HH = "HH",// Home Health
    IMP = "IMP",// Inpatient Encounter
    ACUTE = "ACUTE",// Inpatient Acute
    NONAC = "NONAC",// Inpatient Non-acute
    OBSENC = "OBSENC",// Observation Encounter
    PRENC = "PRENC",// Pre-admission
    SS = "SS",// Short Stay
    VR = "VR"
}
export declare enum EncounterStatus {
    PLANNED = "planned",
    ARRIVED = "arrived",
    TRIAGED = "triaged",
    IN_PROGRESS = "in-progress",
    ON_LEAVE = "onleave",
    FINISHED = "finished",
    CANCELLED = "cancelled",
    ENTERED_IN_ERROR = "entered-in-error",
    UNKNOWN = "unknown"
}
export declare enum EncounterPriority {
    STAT = "stat",// Immediate
    ASAP = "asap",// As soon as possible
    URGENT = "urgent",// Urgent
    ROUTINE = "routine",// Routine
    ELECTIVE = "elective"
}
export declare enum EncounterSource {
    APPOINTMENT = "appointment",
    WALK_IN = "walk-in",
    REFERRAL = "referral",
    EMERGENCY = "emergency",
    TRANSFER = "transfer"
}
export declare class CreateEncounterDto {
    patientId: string;
    appointmentId?: string;
    primaryStaffId: string;
    encounterClass?: EncounterClass;
    status?: EncounterStatus;
    priority?: EncounterPriority;
    startTime: string;
    endTime?: string;
    encounterSource?: EncounterSource;
    walkInDetails?: {
        arrivalTime?: string;
        arrivalMode?: string;
        reasonForVisit?: string;
    };
    chiefComplaint?: string;
    presentingSymptoms?: string;
    vitalSigns?: {
        temperature?: number;
        bloodPressureSystolic?: number;
        bloodPressureDiastolic?: number;
        heartRate?: number;
        respiratoryRate?: number;
        oxygenSaturation?: number;
        weight?: number;
        height?: number;
        bmi?: number;
    };
    allergies?: Array<{
        allergen: string;
        reaction?: string;
        severity?: string;
    }>;
    currentMedications?: Array<{
        name: string;
        dosage?: string;
        frequency?: string;
    }>;
    medicalHistory?: string;
    socialHistory?: string;
    familyHistory?: string;
    notes?: string;
}
//# sourceMappingURL=create-encounter.dto.d.ts.map