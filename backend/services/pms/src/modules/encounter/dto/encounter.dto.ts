import { z } from 'zod';

// Encounter status enum
const encounterStatusSchema = z.enum([
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
const encounterClassSchema = z.enum([
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
const encounterPrioritySchema = z.enum([
  'immediate',
  'urgent',
  'asap',
  'routine'
]);

// Base encounter schemas
export const CreateEncounterDto = z.object({
  patientId: z.string().uuid(),
  facilityId: z.string().uuid(),
  appointmentId: z.string().uuid().optional(),
  primaryStaffId: z.string().uuid(),
  encounterClass: encounterClassSchema.default('AMB'),
  status: encounterStatusSchema.default('planned'),
  priority: encounterPrioritySchema.default('routine'),
  startTime: z.string().datetime().or(z.date()),
  endTime: z.string().datetime().or(z.date()).optional(),
  encounterSource: z.enum(['appointment', 'walk_in', 'emergency', 'telemedicine']).default('appointment'),
  walkInDetails: z.object({
    reason: z.string().max(500),
    urgency: z.enum(['low', 'medium', 'high', 'critical']),
    referredBy: z.string().max(100).optional(),
  }).optional(),
  chiefComplaint: z.string().max(1000).optional(),
  presentingSymptoms: z.string().max(2000).optional(),
  vitalSigns: z.object({
    height: z.number().positive().optional(), // cm
    weight: z.number().positive().optional(), // kg
    temperature: z.number().optional(), // Celsius
    bloodPressure: z.object({
      systolic: z.number().positive(),
      diastolic: z.number().positive(),
    }).optional(),
    heartRate: z.number().positive().optional(), // bpm
    respiratoryRate: z.number().positive().optional(), // breaths per minute
    oxygenSaturation: z.number().min(0).max(100).optional(), // percentage
    painScore: z.number().min(0).max(10).optional(),
  }).optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  medicalHistory: z.string().max(2000).optional(),
  socialHistory: z.string().max(1000).optional(),
  familyHistory: z.string().max(1000).optional(),
  notes: z.string().max(5000).optional(),
});

export const UpdateEncounterDto = z.object({
  primaryStaffId: z.string().uuid().optional(),
  encounterClass: encounterClassSchema.optional(),
  status: encounterStatusSchema.optional(),
  priority: encounterPrioritySchema.optional(),
  startTime: z.string().datetime().or(z.date()).optional(),
  endTime: z.string().datetime().or(z.date()).optional(),
  chiefComplaint: z.string().max(1000).optional(),
  presentingSymptoms: z.string().max(2000).optional(),
  vitalSigns: z.object({
    height: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    temperature: z.number().optional(),
    bloodPressure: z.object({
      systolic: z.number().positive(),
      diastolic: z.number().positive(),
    }).optional(),
    heartRate: z.number().positive().optional(),
    respiratoryRate: z.number().positive().optional(),
    oxygenSaturation: z.number().min(0).max(100).optional(),
    painScore: z.number().min(0).max(10).optional(),
  }).optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  medicalHistory: z.string().max(2000).optional(),
  socialHistory: z.string().max(1000).optional(),
  familyHistory: z.string().max(1000).optional(),
  notes: z.string().max(5000).optional(),
  dischargeDisposition: z.string().max(500).optional(),
  followUpInstructions: z.string().max(1000).optional(),
});

export const EncounterQueryDto = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  patientId: z.string().uuid().optional(),
  facilityId: z.string().uuid().optional(),
  primaryStaffId: z.string().uuid().optional(),
  appointmentId: z.string().uuid().optional(),
  status: encounterStatusSchema.optional(),
  encounterClass: encounterClassSchema.optional(),
  priority: encounterPrioritySchema.optional(),
  encounterSource: z.enum(['appointment', 'walk_in', 'emergency', 'telemedicine']).optional(),
  dateRange: z.object({
    from: z.string().datetime().or(z.date()),
    to: z.string().datetime().or(z.date()),
  }).optional(),
  sortBy: z.enum(['startTime', 'endTime', 'createdAt', 'patientName', 'staffName']).default('startTime'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const EncounterSearchDto = z.object({
  q: z.string().min(1).max(255),
  fields: z.array(z.enum(['chiefComplaint', 'presentingSymptoms', 'notes', 'patientName', 'staffName'])).optional(),
  dateRange: z.object({
    from: z.string().datetime().or(z.date()),
    to: z.string().datetime().or(z.date()),
  }).optional(),
  limit: z.number().int().min(1).max(50).default(10),
});

// Clinical notes
export const CreateClinicalNoteDto = z.object({
  encounterId: z.string().uuid(),
  noteType: z.enum(['soap', 'progress', 'assessment', 'plan', 'procedure', 'discharge']),
  title: z.string().max(200),
  content: z.string().min(1),
  authorStaffId: z.string().uuid(),
  isTemplate: z.boolean().default(false),
  templateId: z.string().uuid().optional(),
  isSigned: z.boolean().default(false),
  signedAt: z.string().datetime().or(z.date()).optional(),
  signedBy: z.string().uuid().optional(),
});

export const UpdateClinicalNoteDto = z.object({
  title: z.string().max(200).optional(),
  content: z.string().min(1).optional(),
  isTemplate: z.boolean().optional(),
  templateId: z.string().uuid().optional(),
  isSigned: z.boolean().optional(),
  signedAt: z.string().datetime().or(z.date()).optional(),
  signedBy: z.string().uuid().optional(),
});

// Vitals
export const CreateVitalsDto = z.object({
  encounterId: z.string().uuid(),
  recordedBy: z.string().uuid(),
  recordedAt: z.string().datetime().or(z.date()).default(() => new Date().toISOString()),
  height: z.number().positive().optional(), // cm
  weight: z.number().positive().optional(), // kg
  temperature: z.number().optional(), // Celsius
  bloodPressure: z.object({
    systolic: z.number().positive(),
    diastolic: z.number().positive(),
  }).optional(),
  heartRate: z.number().positive().optional(), // bpm
  respiratoryRate: z.number().positive().optional(), // breaths per minute
  oxygenSaturation: z.number().min(0).max(100).optional(), // percentage
  painScore: z.number().min(0).max(10).optional(),
  bmi: z.number().positive().optional(),
  headCircumference: z.number().positive().optional(), // cm (for pediatrics)
  notes: z.string().max(500).optional(),
});

// Orders
export const CreateOrderDto = z.object({
  encounterId: z.string().uuid(),
  orderType: z.enum(['medication', 'lab', 'imaging', 'procedure', 'referral', 'diet', 'nursing']),
  priority: z.enum(['routine', 'urgent', 'stat', 'asap']).default('routine'),
  status: z.enum(['draft', 'active', 'completed', 'cancelled', 'on_hold']).default('draft'),
  requestedBy: z.string().uuid(),
  notes: z.string().max(1000).optional(),
  clinicalIndication: z.string().max(500).optional(),
  // Order-specific data will be in separate tables
});

// Response DTOs
export const EncounterResponseDto = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  facilityId: z.string().uuid(),
  appointmentId: z.string().uuid().optional(),
  primaryStaffId: z.string().uuid(),
  encounterClass: encounterClassSchema,
  status: encounterStatusSchema,
  priority: encounterPrioritySchema,
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  encounterSource: z.enum(['appointment', 'walk_in', 'emergency', 'telemedicine']),
  walkInDetails: z.any().optional(),
  chiefComplaint: z.string().optional(),
  presentingSymptoms: z.string().optional(),
  vitalSigns: z.any().optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  medicalHistory: z.string().optional(),
  socialHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  notes: z.string().optional(),
  dischargeDisposition: z.string().optional(),
  followUpInstructions: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  patient: z.any().optional(),
  primaryStaff: z.any().optional(),
  facility: z.any().optional(),
  appointment: z.any().optional(),
  clinicalNotes: z.array(z.any()).optional(),
  vitals: z.array(z.any()).optional(),
  orders: z.array(z.any()).optional(),
});

export const ClinicalNoteResponseDto = z.object({
  id: z.string().uuid(),
  encounterId: z.string().uuid(),
  noteType: z.enum(['soap', 'progress', 'assessment', 'plan', 'procedure', 'discharge']),
  title: z.string(),
  content: z.string(),
  authorStaffId: z.string().uuid(),
  isTemplate: z.boolean(),
  templateId: z.string().uuid().optional(),
  isSigned: z.boolean(),
  signedAt: z.string().datetime().optional(),
  signedBy: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  author: z.any().optional(),
});

export const VitalsResponseDto = z.object({
  id: z.string().uuid(),
  encounterId: z.string().uuid(),
  recordedBy: z.string().uuid(),
  recordedAt: z.string().datetime(),
  height: z.number().optional(),
  weight: z.number().optional(),
  temperature: z.number().optional(),
  bloodPressure: z.any().optional(),
  heartRate: z.number().optional(),
  respiratoryRate: z.number().optional(),
  oxygenSaturation: z.number().optional(),
  painScore: z.number().optional(),
  bmi: z.number().optional(),
  headCircumference: z.number().optional(),
  notes: z.string().optional(),
  recordedByStaff: z.any().optional(),
});

// Statistics
export const EncounterStatsDto = z.object({
  total: z.number(),
  byStatus: z.record(z.number()),
  byClass: z.record(z.number()),
  bySource: z.record(z.number()),
  byStaff: z.record(z.number()),
  byFacility: z.record(z.number()),
  averageDuration: z.number(),
  averageWaitTime: z.number(),
  walkInRate: z.number(),
});

// Type exports
export type CreateEncounterDto = z.infer<typeof CreateEncounterDto>;
export type UpdateEncounterDto = z.infer<typeof UpdateEncounterDto>;
export type EncounterQueryDto = z.infer<typeof EncounterQueryDto>;
export type EncounterSearchDto = z.infer<typeof EncounterSearchDto>;
export type CreateClinicalNoteDto = z.infer<typeof CreateClinicalNoteDto>;
export type UpdateClinicalNoteDto = z.infer<typeof UpdateClinicalNoteDto>;
export type CreateVitalsDto = z.infer<typeof CreateVitalsDto>;
export type CreateOrderDto = z.infer<typeof CreateOrderDto>;
export type EncounterResponseDto = z.infer<typeof EncounterResponseDto>;
export type ClinicalNoteResponseDto = z.infer<typeof ClinicalNoteResponseDto>;
export type VitalsResponseDto = z.infer<typeof VitalsResponseDto>;
export type EncounterStatsDto = z.infer<typeof EncounterStatsDto>;



