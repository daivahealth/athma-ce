import { z } from 'zod';
// Emirates ID validation
const emiratesIdSchema = z.string().regex(/^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]{1}$/, 'Invalid Emirates ID format');
// Base patient schemas
export const CreatePatientDto = z.object({
    emiratesId: emiratesIdSchema,
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    middleName: z.string().max(100).optional(),
    dateOfBirth: z.string().datetime().or(z.date()),
    gender: z.enum(['male', 'female', 'other', 'unknown']),
    maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'other']).optional(),
    nationality: z.string().max(100).default('UAE'),
    preferredLanguage: z.string().max(10).default('en'),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
    email: z.string().email().optional(),
    addressLine1: z.string().max(255).optional(),
    addressLine2: z.string().max(255).optional(),
    city: z.string().max(100).optional(),
    emirate: z.enum(['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah']).optional(),
    postalCode: z.string().max(20).optional(),
    emergencyContact: z.object({
        name: z.string().min(1).max(100),
        relationship: z.string().min(1).max(50),
        phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
        email: z.string().email().optional(),
    }).optional(),
    insuranceInfo: z.object({
        provider: z.string().min(1).max(100),
        policyNumber: z.string().min(1).max(100),
        groupNumber: z.string().max(100).optional(),
        expiryDate: z.string().datetime().or(z.date()).optional(),
        copayAmount: z.number().positive().optional(),
        copayType: z.enum(['fixed', 'percentage']).optional(),
    }).optional(),
});
export const UpdatePatientDto = CreatePatientDto.partial();
export const PatientQueryDto = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    gender: z.enum(['male', 'female', 'other', 'unknown']).optional(),
    status: z.enum(['active', 'inactive', 'deleted']).optional(),
    emirate: z.enum(['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah']).optional(),
    ageRange: z.object({
        min: z.number().int().min(0).max(150).optional(),
        max: z.number().int().min(0).max(150).optional(),
    }).optional(),
    dateRange: z.object({
        from: z.string().datetime().or(z.date()).optional(),
        to: z.string().datetime().or(z.date()).optional(),
    }).optional(),
    sortBy: z.enum(['firstName', 'lastName', 'dateOfBirth', 'createdAt', 'updatedAt']).default('lastName'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
});
export const PatientSearchDto = z.object({
    q: z.string().min(1).max(255),
    fields: z.array(z.enum(['firstName', 'lastName', 'emiratesId', 'phoneNumber', 'email'])).optional(),
    limit: z.number().int().min(1).max(50).default(10),
});
export const PatientConsentDto = z.object({
    consentType: z.enum(['data_sharing', 'research', 'marketing', 'emergency_contact']),
    consentStatus: z.enum(['granted', 'denied', 'withdrawn']),
    consentDate: z.string().datetime().or(z.date()),
    expirationDate: z.string().datetime().or(z.date()).optional(),
    consentMethod: z.enum(['digital_signature', 'verbal', 'written']),
    notes: z.string().max(1000).optional(),
});
export const PatientTranslationDto = z.object({
    fieldName: z.string().min(1).max(100),
    languageCode: z.string().length(2), // ISO 639-1 language code
    translatedText: z.string().min(1).max(1000),
});
export const MergePatientsDto = z.object({
    secondaryPatientId: z.string().uuid(),
    mergeReason: z.string().min(1).max(500),
    keepPrimaryData: z.boolean().default(true),
});
export const DuplicateSearchDto = z.object({
    threshold: z.number().min(0).max(1).default(0.8),
    searchFields: z.array(z.enum(['firstName', 'lastName', 'dateOfBirth', 'phoneNumber', 'email'])).default(['firstName', 'lastName', 'dateOfBirth']),
});
// Response DTOs
export const PatientResponseDto = z.object({
    id: z.string().uuid(),
    emiratesId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().optional(),
    dateOfBirth: z.string().datetime(),
    gender: z.enum(['male', 'female', 'other', 'unknown']),
    maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'other']).optional(),
    nationality: z.string(),
    preferredLanguage: z.string(),
    phoneNumber: z.string().optional(),
    email: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    emirate: z.enum(['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah']).optional(),
    postalCode: z.string().optional(),
    emergencyContact: z.any().optional(),
    insuranceInfo: z.any().optional(),
    status: z.enum(['active', 'inactive', 'deleted']),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    translations: z.array(z.any()).optional(),
});
export const PatientSearchResultDto = z.object({
    id: z.string().uuid(),
    emiratesId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.string().datetime(),
    gender: z.enum(['male', 'female', 'other', 'unknown']),
    phoneNumber: z.string().optional(),
    email: z.string().optional(),
    matchScore: z.number().min(0).max(1).optional(),
    matchReason: z.string().optional(),
});
export const PatientMedicalHistoryDto = z.object({
    patientId: z.string().uuid(),
    appointments: z.array(z.any()),
    encounters: z.array(z.any()),
    diagnoses: z.array(z.any()),
    medications: z.array(z.any()),
    allergies: z.array(z.any()),
    immunizations: z.array(z.any()),
    vitals: z.array(z.any()),
    labResults: z.array(z.any()),
    imagingResults: z.array(z.any()),
    summary: z.object({
        totalVisits: z.number(),
        lastVisit: z.string().datetime().optional(),
        primaryDiagnoses: z.array(z.string()),
        currentMedications: z.array(z.string()),
        knownAllergies: z.array(z.string()),
    }),
});
export const PatientConsentResponseDto = z.object({
    id: z.string().uuid(),
    patientId: z.string().uuid(),
    consentType: z.enum(['data_sharing', 'research', 'marketing', 'emergency_contact']),
    consentStatus: z.enum(['granted', 'denied', 'withdrawn']),
    consentDate: z.string().datetime(),
    expirationDate: z.string().datetime().optional(),
    consentMethod: z.enum(['digital_signature', 'verbal', 'written']),
    notes: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
//# sourceMappingURL=patient.dto.js.map