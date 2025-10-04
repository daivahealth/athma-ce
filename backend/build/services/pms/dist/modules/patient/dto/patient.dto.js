"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientConsentResponseDto = exports.PatientMedicalHistoryDto = exports.PatientSearchResultDto = exports.PatientResponseDto = exports.DuplicateSearchDto = exports.MergePatientsDto = exports.PatientTranslationDto = exports.PatientConsentDto = exports.PatientSearchDto = exports.PatientQueryDto = exports.UpdatePatientDto = exports.CreatePatientDto = void 0;
const zod_1 = require("zod");
// Emirates ID validation
const emiratesIdSchema = zod_1.z.string().regex(/^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]{1}$/, 'Invalid Emirates ID format');
// Base patient schemas
exports.CreatePatientDto = zod_1.z.object({
    emiratesId: emiratesIdSchema,
    firstName: zod_1.z.string().min(1).max(100),
    lastName: zod_1.z.string().min(1).max(100),
    middleName: zod_1.z.string().max(100).optional(),
    dateOfBirth: zod_1.z.string().datetime().or(zod_1.z.date()),
    gender: zod_1.z.enum(['male', 'female', 'other', 'unknown']),
    maritalStatus: zod_1.z.enum(['single', 'married', 'divorced', 'widowed', 'other']).optional(),
    nationality: zod_1.z.string().max(100).default('UAE'),
    preferredLanguage: zod_1.z.string().max(10).default('en'),
    phoneNumber: zod_1.z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
    email: zod_1.z.string().email().optional(),
    addressLine1: zod_1.z.string().max(255).optional(),
    addressLine2: zod_1.z.string().max(255).optional(),
    city: zod_1.z.string().max(100).optional(),
    emirate: zod_1.z.enum(['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah']).optional(),
    postalCode: zod_1.z.string().max(20).optional(),
    emergencyContact: zod_1.z.object({
        name: zod_1.z.string().min(1).max(100),
        relationship: zod_1.z.string().min(1).max(50),
        phoneNumber: zod_1.z.string().regex(/^\+?[1-9]\d{1,14}$/),
        email: zod_1.z.string().email().optional(),
    }).optional(),
    insuranceInfo: zod_1.z.object({
        provider: zod_1.z.string().min(1).max(100),
        policyNumber: zod_1.z.string().min(1).max(100),
        groupNumber: zod_1.z.string().max(100).optional(),
        expiryDate: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
        copayAmount: zod_1.z.number().positive().optional(),
        copayType: zod_1.z.enum(['fixed', 'percentage']).optional(),
    }).optional(),
});
exports.UpdatePatientDto = exports.CreatePatientDto.partial();
exports.PatientQueryDto = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    search: zod_1.z.string().optional(),
    gender: zod_1.z.enum(['male', 'female', 'other', 'unknown']).optional(),
    status: zod_1.z.enum(['active', 'inactive', 'deleted']).optional(),
    emirate: zod_1.z.enum(['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah']).optional(),
    ageRange: zod_1.z.object({
        min: zod_1.z.number().int().min(0).max(150).optional(),
        max: zod_1.z.number().int().min(0).max(150).optional(),
    }).optional(),
    dateRange: zod_1.z.object({
        from: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
        to: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
    }).optional(),
    sortBy: zod_1.z.enum(['firstName', 'lastName', 'dateOfBirth', 'createdAt', 'updatedAt']).default('lastName'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('asc'),
});
exports.PatientSearchDto = zod_1.z.object({
    q: zod_1.z.string().min(1).max(255),
    fields: zod_1.z.array(zod_1.z.enum(['firstName', 'lastName', 'emiratesId', 'phoneNumber', 'email'])).optional(),
    limit: zod_1.z.number().int().min(1).max(50).default(10),
});
exports.PatientConsentDto = zod_1.z.object({
    consentType: zod_1.z.enum(['data_sharing', 'research', 'marketing', 'emergency_contact']),
    consentStatus: zod_1.z.enum(['granted', 'denied', 'withdrawn']),
    consentDate: zod_1.z.string().datetime().or(zod_1.z.date()),
    expirationDate: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
    consentMethod: zod_1.z.enum(['digital_signature', 'verbal', 'written']),
    notes: zod_1.z.string().max(1000).optional(),
});
exports.PatientTranslationDto = zod_1.z.object({
    fieldName: zod_1.z.string().min(1).max(100),
    languageCode: zod_1.z.string().length(2), // ISO 639-1 language code
    translatedText: zod_1.z.string().min(1).max(1000),
});
exports.MergePatientsDto = zod_1.z.object({
    secondaryPatientId: zod_1.z.string().uuid(),
    mergeReason: zod_1.z.string().min(1).max(500),
    keepPrimaryData: zod_1.z.boolean().default(true),
});
exports.DuplicateSearchDto = zod_1.z.object({
    threshold: zod_1.z.number().min(0).max(1).default(0.8),
    searchFields: zod_1.z.array(zod_1.z.enum(['firstName', 'lastName', 'dateOfBirth', 'phoneNumber', 'email'])).default(['firstName', 'lastName', 'dateOfBirth']),
});
// Response DTOs
exports.PatientResponseDto = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    emiratesId: zod_1.z.string(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    middleName: zod_1.z.string().optional(),
    dateOfBirth: zod_1.z.string().datetime(),
    gender: zod_1.z.enum(['male', 'female', 'other', 'unknown']),
    maritalStatus: zod_1.z.enum(['single', 'married', 'divorced', 'widowed', 'other']).optional(),
    nationality: zod_1.z.string(),
    preferredLanguage: zod_1.z.string(),
    phoneNumber: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    addressLine1: zod_1.z.string().optional(),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    emirate: zod_1.z.enum(['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah']).optional(),
    postalCode: zod_1.z.string().optional(),
    emergencyContact: zod_1.z.any().optional(),
    insuranceInfo: zod_1.z.any().optional(),
    status: zod_1.z.enum(['active', 'inactive', 'deleted']),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    translations: zod_1.z.array(zod_1.z.any()).optional(),
});
exports.PatientSearchResultDto = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    emiratesId: zod_1.z.string(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    dateOfBirth: zod_1.z.string().datetime(),
    gender: zod_1.z.enum(['male', 'female', 'other', 'unknown']),
    phoneNumber: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    matchScore: zod_1.z.number().min(0).max(1).optional(),
    matchReason: zod_1.z.string().optional(),
});
exports.PatientMedicalHistoryDto = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    appointments: zod_1.z.array(zod_1.z.any()),
    encounters: zod_1.z.array(zod_1.z.any()),
    diagnoses: zod_1.z.array(zod_1.z.any()),
    medications: zod_1.z.array(zod_1.z.any()),
    allergies: zod_1.z.array(zod_1.z.any()),
    immunizations: zod_1.z.array(zod_1.z.any()),
    vitals: zod_1.z.array(zod_1.z.any()),
    labResults: zod_1.z.array(zod_1.z.any()),
    imagingResults: zod_1.z.array(zod_1.z.any()),
    summary: zod_1.z.object({
        totalVisits: zod_1.z.number(),
        lastVisit: zod_1.z.string().datetime().optional(),
        primaryDiagnoses: zod_1.z.array(zod_1.z.string()),
        currentMedications: zod_1.z.array(zod_1.z.string()),
        knownAllergies: zod_1.z.array(zod_1.z.string()),
    }),
});
exports.PatientConsentResponseDto = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    patientId: zod_1.z.string().uuid(),
    consentType: zod_1.z.enum(['data_sharing', 'research', 'marketing', 'emergency_contact']),
    consentStatus: zod_1.z.enum(['granted', 'denied', 'withdrawn']),
    consentDate: zod_1.z.string().datetime(),
    expirationDate: zod_1.z.string().datetime().optional(),
    consentMethod: zod_1.z.enum(['digital_signature', 'verbal', 'written']),
    notes: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
//# sourceMappingURL=patient.dto.js.map
//# sourceMappingURL=patient.dto.js.map