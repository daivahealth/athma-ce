"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncounterStatsDto = exports.VitalsResponseDto = exports.ClinicalNoteResponseDto = exports.EncounterResponseDto = exports.CreateOrderDto = exports.CreateVitalsDto = exports.UpdateClinicalNoteDto = exports.CreateClinicalNoteDto = exports.EncounterSearchDto = exports.EncounterQueryDto = exports.UpdateEncounterDto = exports.CreateEncounterDto = void 0;
const zod_1 = require("zod");
// Encounter status enum
const encounterStatusSchema = zod_1.z.enum([
    'planned',
    'arrived',
    'in_progress',
    'onleave',
    'finished',
    'cancelled',
    'entered_in_error',
    'unknown'
]);
// Encounter class enum
const encounterClassSchema = zod_1.z.enum([
    'AMB', // Ambulatory
    'EMER', // Emergency
    'FLD', // Field
    'HH', // Home Health
    'IMP', // Inpatient
    'ACUTE', // Acute
    'NONAC', // Non-acute
    'PRENC', // Pre-admission
    'SS', // Short Stay
    'VR', // Virtual
    'OBSENC', // Observation
    'AMB', // Outpatient
]);
// Encounter priority enum
const encounterPrioritySchema = zod_1.z.enum([
    'immediate',
    'urgent',
    'asap',
    'routine'
]);
// Base encounter schemas
exports.CreateEncounterDto = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    facilityId: zod_1.z.string().uuid(),
    appointmentId: zod_1.z.string().uuid().optional(),
    primaryStaffId: zod_1.z.string().uuid(),
    encounterClass: encounterClassSchema.default('AMB'),
    status: encounterStatusSchema.default('planned'),
    priority: encounterPrioritySchema.default('routine'),
    startTime: zod_1.z.string().datetime().or(zod_1.z.date()),
    endTime: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
    encounterSource: zod_1.z.enum(['appointment', 'walk_in', 'emergency', 'telemedicine']).default('appointment'),
    walkInDetails: zod_1.z.object({
        reason: zod_1.z.string().max(500),
        urgency: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
        referredBy: zod_1.z.string().max(100).optional(),
    }).optional(),
    chiefComplaint: zod_1.z.string().max(1000).optional(),
    presentingSymptoms: zod_1.z.string().max(2000).optional(),
    vitalSigns: zod_1.z.object({
        height: zod_1.z.number().positive().optional(), // cm
        weight: zod_1.z.number().positive().optional(), // kg
        temperature: zod_1.z.number().optional(), // Celsius
        bloodPressure: zod_1.z.object({
            systolic: zod_1.z.number().positive(),
            diastolic: zod_1.z.number().positive(),
        }).optional(),
        heartRate: zod_1.z.number().positive().optional(), // bpm
        respiratoryRate: zod_1.z.number().positive().optional(), // breaths per minute
        oxygenSaturation: zod_1.z.number().min(0).max(100).optional(), // percentage
        painScore: zod_1.z.number().min(0).max(10).optional(),
    }).optional(),
    allergies: zod_1.z.array(zod_1.z.string()).optional(),
    currentMedications: zod_1.z.array(zod_1.z.string()).optional(),
    medicalHistory: zod_1.z.string().max(2000).optional(),
    socialHistory: zod_1.z.string().max(1000).optional(),
    familyHistory: zod_1.z.string().max(1000).optional(),
    notes: zod_1.z.string().max(5000).optional(),
});
exports.UpdateEncounterDto = zod_1.z.object({
    primaryStaffId: zod_1.z.string().uuid().optional(),
    encounterClass: encounterClassSchema.optional(),
    status: encounterStatusSchema.optional(),
    priority: encounterPrioritySchema.optional(),
    startTime: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
    endTime: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
    chiefComplaint: zod_1.z.string().max(1000).optional(),
    presentingSymptoms: zod_1.z.string().max(2000).optional(),
    vitalSigns: zod_1.z.object({
        height: zod_1.z.number().positive().optional(),
        weight: zod_1.z.number().positive().optional(),
        temperature: zod_1.z.number().optional(),
        bloodPressure: zod_1.z.object({
            systolic: zod_1.z.number().positive(),
            diastolic: zod_1.z.number().positive(),
        }).optional(),
        heartRate: zod_1.z.number().positive().optional(),
        respiratoryRate: zod_1.z.number().positive().optional(),
        oxygenSaturation: zod_1.z.number().min(0).max(100).optional(),
        painScore: zod_1.z.number().min(0).max(10).optional(),
    }).optional(),
    allergies: zod_1.z.array(zod_1.z.string()).optional(),
    currentMedications: zod_1.z.array(zod_1.z.string()).optional(),
    medicalHistory: zod_1.z.string().max(2000).optional(),
    socialHistory: zod_1.z.string().max(1000).optional(),
    familyHistory: zod_1.z.string().max(1000).optional(),
    notes: zod_1.z.string().max(5000).optional(),
    dischargeDisposition: zod_1.z.string().max(500).optional(),
    followUpInstructions: zod_1.z.string().max(1000).optional(),
});
exports.EncounterQueryDto = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    patientId: zod_1.z.string().uuid().optional(),
    facilityId: zod_1.z.string().uuid().optional(),
    primaryStaffId: zod_1.z.string().uuid().optional(),
    appointmentId: zod_1.z.string().uuid().optional(),
    status: encounterStatusSchema.optional(),
    encounterClass: encounterClassSchema.optional(),
    priority: encounterPrioritySchema.optional(),
    encounterSource: zod_1.z.enum(['appointment', 'walk_in', 'emergency', 'telemedicine']).optional(),
    dateRange: zod_1.z.object({
        from: zod_1.z.string().datetime().or(zod_1.z.date()),
        to: zod_1.z.string().datetime().or(zod_1.z.date()),
    }).optional(),
    sortBy: zod_1.z.enum(['startTime', 'endTime', 'createdAt', 'patientName', 'staffName']).default('startTime'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
exports.EncounterSearchDto = zod_1.z.object({
    q: zod_1.z.string().min(1).max(255),
    fields: zod_1.z.array(zod_1.z.enum(['chiefComplaint', 'presentingSymptoms', 'notes', 'patientName', 'staffName'])).optional(),
    dateRange: zod_1.z.object({
        from: zod_1.z.string().datetime().or(zod_1.z.date()),
        to: zod_1.z.string().datetime().or(zod_1.z.date()),
    }).optional(),
    limit: zod_1.z.number().int().min(1).max(50).default(10),
});
// Clinical notes
exports.CreateClinicalNoteDto = zod_1.z.object({
    encounterId: zod_1.z.string().uuid(),
    noteType: zod_1.z.enum(['soap', 'progress', 'assessment', 'plan', 'procedure', 'discharge']),
    title: zod_1.z.string().max(200),
    content: zod_1.z.string().min(1),
    authorStaffId: zod_1.z.string().uuid(),
    isTemplate: zod_1.z.boolean().default(false),
    templateId: zod_1.z.string().uuid().optional(),
    isSigned: zod_1.z.boolean().default(false),
    signedAt: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
    signedBy: zod_1.z.string().uuid().optional(),
});
exports.UpdateClinicalNoteDto = zod_1.z.object({
    title: zod_1.z.string().max(200).optional(),
    content: zod_1.z.string().min(1).optional(),
    isTemplate: zod_1.z.boolean().optional(),
    templateId: zod_1.z.string().uuid().optional(),
    isSigned: zod_1.z.boolean().optional(),
    signedAt: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
    signedBy: zod_1.z.string().uuid().optional(),
});
// Vitals
exports.CreateVitalsDto = zod_1.z.object({
    encounterId: zod_1.z.string().uuid(),
    recordedBy: zod_1.z.string().uuid(),
    recordedAt: zod_1.z.string().datetime().or(zod_1.z.date()).default(() => new Date().toISOString()),
    height: zod_1.z.number().positive().optional(), // cm
    weight: zod_1.z.number().positive().optional(), // kg
    temperature: zod_1.z.number().optional(), // Celsius
    bloodPressure: zod_1.z.object({
        systolic: zod_1.z.number().positive(),
        diastolic: zod_1.z.number().positive(),
    }).optional(),
    heartRate: zod_1.z.number().positive().optional(), // bpm
    respiratoryRate: zod_1.z.number().positive().optional(), // breaths per minute
    oxygenSaturation: zod_1.z.number().min(0).max(100).optional(), // percentage
    painScore: zod_1.z.number().min(0).max(10).optional(),
    bmi: zod_1.z.number().positive().optional(),
    headCircumference: zod_1.z.number().positive().optional(), // cm (for pediatrics)
    notes: zod_1.z.string().max(500).optional(),
});
// Orders
exports.CreateOrderDto = zod_1.z.object({
    encounterId: zod_1.z.string().uuid(),
    orderType: zod_1.z.enum(['medication', 'lab', 'imaging', 'procedure', 'referral', 'diet', 'nursing']),
    priority: zod_1.z.enum(['routine', 'urgent', 'stat', 'asap']).default('routine'),
    status: zod_1.z.enum(['draft', 'active', 'completed', 'cancelled', 'on_hold']).default('draft'),
    requestedBy: zod_1.z.string().uuid(),
    notes: zod_1.z.string().max(1000).optional(),
    clinicalIndication: zod_1.z.string().max(500).optional(),
    // Order-specific data will be in separate tables
});
// Response DTOs
exports.EncounterResponseDto = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    patientId: zod_1.z.string().uuid(),
    facilityId: zod_1.z.string().uuid(),
    appointmentId: zod_1.z.string().uuid().optional(),
    primaryStaffId: zod_1.z.string().uuid(),
    encounterClass: encounterClassSchema,
    status: encounterStatusSchema,
    priority: encounterPrioritySchema,
    startTime: zod_1.z.string().datetime(),
    endTime: zod_1.z.string().datetime().optional(),
    encounterSource: zod_1.z.enum(['appointment', 'walk_in', 'emergency', 'telemedicine']),
    walkInDetails: zod_1.z.any().optional(),
    chiefComplaint: zod_1.z.string().optional(),
    presentingSymptoms: zod_1.z.string().optional(),
    vitalSigns: zod_1.z.any().optional(),
    allergies: zod_1.z.array(zod_1.z.string()).optional(),
    currentMedications: zod_1.z.array(zod_1.z.string()).optional(),
    medicalHistory: zod_1.z.string().optional(),
    socialHistory: zod_1.z.string().optional(),
    familyHistory: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    dischargeDisposition: zod_1.z.string().optional(),
    followUpInstructions: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    patient: zod_1.z.any().optional(),
    primaryStaff: zod_1.z.any().optional(),
    facility: zod_1.z.any().optional(),
    appointment: zod_1.z.any().optional(),
    clinicalNotes: zod_1.z.array(zod_1.z.any()).optional(),
    vitals: zod_1.z.array(zod_1.z.any()).optional(),
    orders: zod_1.z.array(zod_1.z.any()).optional(),
});
exports.ClinicalNoteResponseDto = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    encounterId: zod_1.z.string().uuid(),
    noteType: zod_1.z.enum(['soap', 'progress', 'assessment', 'plan', 'procedure', 'discharge']),
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    authorStaffId: zod_1.z.string().uuid(),
    isTemplate: zod_1.z.boolean(),
    templateId: zod_1.z.string().uuid().optional(),
    isSigned: zod_1.z.boolean(),
    signedAt: zod_1.z.string().datetime().optional(),
    signedBy: zod_1.z.string().uuid().optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    author: zod_1.z.any().optional(),
});
exports.VitalsResponseDto = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    encounterId: zod_1.z.string().uuid(),
    recordedBy: zod_1.z.string().uuid(),
    recordedAt: zod_1.z.string().datetime(),
    height: zod_1.z.number().optional(),
    weight: zod_1.z.number().optional(),
    temperature: zod_1.z.number().optional(),
    bloodPressure: zod_1.z.any().optional(),
    heartRate: zod_1.z.number().optional(),
    respiratoryRate: zod_1.z.number().optional(),
    oxygenSaturation: zod_1.z.number().optional(),
    painScore: zod_1.z.number().optional(),
    bmi: zod_1.z.number().optional(),
    headCircumference: zod_1.z.number().optional(),
    notes: zod_1.z.string().optional(),
    recordedByStaff: zod_1.z.any().optional(),
});
// Statistics
exports.EncounterStatsDto = zod_1.z.object({
    total: zod_1.z.number(),
    byStatus: zod_1.z.record(zod_1.z.number()),
    byClass: zod_1.z.record(zod_1.z.number()),
    bySource: zod_1.z.record(zod_1.z.number()),
    byStaff: zod_1.z.record(zod_1.z.number()),
    byFacility: zod_1.z.record(zod_1.z.number()),
    averageDuration: zod_1.z.number(),
    averageWaitTime: zod_1.z.number(),
    walkInRate: zod_1.z.number(),
});
//# sourceMappingURL=encounter.dto.js.map
//# sourceMappingURL=encounter.dto.js.map