export const CreatePatientDto: z.ZodObject<{
    emiratesId: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    middleName: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    gender: z.ZodEnum<["male", "female", "other", "unknown"]>;
    maritalStatus: z.ZodOptional<z.ZodEnum<["single", "married", "divorced", "widowed", "other"]>>;
    nationality: z.ZodDefault<z.ZodString>;
    preferredLanguage: z.ZodDefault<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    addressLine1: z.ZodOptional<z.ZodString>;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    emirate: z.ZodOptional<z.ZodEnum<["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]>>;
    postalCode: z.ZodOptional<z.ZodString>;
    emergencyContact: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        relationship: z.ZodString;
        phoneNumber: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        phoneNumber: string;
        name: string;
        relationship: string;
        email?: string | undefined;
    }, {
        phoneNumber: string;
        name: string;
        relationship: string;
        email?: string | undefined;
    }>>;
    insuranceInfo: z.ZodOptional<z.ZodObject<{
        provider: z.ZodString;
        policyNumber: z.ZodString;
        groupNumber: z.ZodOptional<z.ZodString>;
        expiryDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        copayAmount: z.ZodOptional<z.ZodNumber>;
        copayType: z.ZodOptional<z.ZodEnum<["fixed", "percentage"]>>;
    }, "strip", z.ZodTypeAny, {
        provider: string;
        policyNumber: string;
        groupNumber?: string | undefined;
        expiryDate?: string | Date | undefined;
        copayAmount?: number | undefined;
        copayType?: "fixed" | "percentage" | undefined;
    }, {
        provider: string;
        policyNumber: string;
        groupNumber?: string | undefined;
        expiryDate?: string | Date | undefined;
        copayAmount?: number | undefined;
        copayType?: "fixed" | "percentage" | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    emiratesId: string;
    dateOfBirth: string | Date;
    gender: "unknown" | "male" | "female" | "other";
    nationality: string;
    preferredLanguage: string;
    email?: string | undefined;
    phoneNumber?: string | undefined;
    middleName?: string | undefined;
    maritalStatus?: "other" | "single" | "married" | "divorced" | "widowed" | undefined;
    addressLine1?: string | undefined;
    addressLine2?: string | undefined;
    city?: string | undefined;
    emirate?: "Abu Dhabi" | "Dubai" | "Sharjah" | "Ajman" | "Umm Al Quwain" | "Ras Al Khaimah" | "Fujairah" | undefined;
    postalCode?: string | undefined;
    emergencyContact?: {
        phoneNumber: string;
        name: string;
        relationship: string;
        email?: string | undefined;
    } | undefined;
    insuranceInfo?: {
        provider: string;
        policyNumber: string;
        groupNumber?: string | undefined;
        expiryDate?: string | Date | undefined;
        copayAmount?: number | undefined;
        copayType?: "fixed" | "percentage" | undefined;
    } | undefined;
}, {
    firstName: string;
    lastName: string;
    emiratesId: string;
    dateOfBirth: string | Date;
    gender: "unknown" | "male" | "female" | "other";
    email?: string | undefined;
    phoneNumber?: string | undefined;
    middleName?: string | undefined;
    maritalStatus?: "other" | "single" | "married" | "divorced" | "widowed" | undefined;
    nationality?: string | undefined;
    preferredLanguage?: string | undefined;
    addressLine1?: string | undefined;
    addressLine2?: string | undefined;
    city?: string | undefined;
    emirate?: "Abu Dhabi" | "Dubai" | "Sharjah" | "Ajman" | "Umm Al Quwain" | "Ras Al Khaimah" | "Fujairah" | undefined;
    postalCode?: string | undefined;
    emergencyContact?: {
        phoneNumber: string;
        name: string;
        relationship: string;
        email?: string | undefined;
    } | undefined;
    insuranceInfo?: {
        provider: string;
        policyNumber: string;
        groupNumber?: string | undefined;
        expiryDate?: string | Date | undefined;
        copayAmount?: number | undefined;
        copayType?: "fixed" | "percentage" | undefined;
    } | undefined;
}>;
export const UpdatePatientDto: z.ZodObject<{
    emiratesId: z.ZodOptional<z.ZodString>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    middleName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    dateOfBirth: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    gender: z.ZodOptional<z.ZodEnum<["male", "female", "other", "unknown"]>>;
    maritalStatus: z.ZodOptional<z.ZodOptional<z.ZodEnum<["single", "married", "divorced", "widowed", "other"]>>>;
    nationality: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    preferredLanguage: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    phoneNumber: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    addressLine1: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    addressLine2: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    city: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    emirate: z.ZodOptional<z.ZodOptional<z.ZodEnum<["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]>>>;
    postalCode: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    emergencyContact: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        relationship: z.ZodString;
        phoneNumber: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        phoneNumber: string;
        name: string;
        relationship: string;
        email?: string | undefined;
    }, {
        phoneNumber: string;
        name: string;
        relationship: string;
        email?: string | undefined;
    }>>>;
    insuranceInfo: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        provider: z.ZodString;
        policyNumber: z.ZodString;
        groupNumber: z.ZodOptional<z.ZodString>;
        expiryDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        copayAmount: z.ZodOptional<z.ZodNumber>;
        copayType: z.ZodOptional<z.ZodEnum<["fixed", "percentage"]>>;
    }, "strip", z.ZodTypeAny, {
        provider: string;
        policyNumber: string;
        groupNumber?: string | undefined;
        expiryDate?: string | Date | undefined;
        copayAmount?: number | undefined;
        copayType?: "fixed" | "percentage" | undefined;
    }, {
        provider: string;
        policyNumber: string;
        groupNumber?: string | undefined;
        expiryDate?: string | Date | undefined;
        copayAmount?: number | undefined;
        copayType?: "fixed" | "percentage" | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    phoneNumber?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    emiratesId?: string | undefined;
    middleName?: string | undefined;
    dateOfBirth?: string | Date | undefined;
    gender?: "unknown" | "male" | "female" | "other" | undefined;
    maritalStatus?: "other" | "single" | "married" | "divorced" | "widowed" | undefined;
    nationality?: string | undefined;
    preferredLanguage?: string | undefined;
    addressLine1?: string | undefined;
    addressLine2?: string | undefined;
    city?: string | undefined;
    emirate?: "Abu Dhabi" | "Dubai" | "Sharjah" | "Ajman" | "Umm Al Quwain" | "Ras Al Khaimah" | "Fujairah" | undefined;
    postalCode?: string | undefined;
    emergencyContact?: {
        phoneNumber: string;
        name: string;
        relationship: string;
        email?: string | undefined;
    } | undefined;
    insuranceInfo?: {
        provider: string;
        policyNumber: string;
        groupNumber?: string | undefined;
        expiryDate?: string | Date | undefined;
        copayAmount?: number | undefined;
        copayType?: "fixed" | "percentage" | undefined;
    } | undefined;
}, {
    email?: string | undefined;
    phoneNumber?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    emiratesId?: string | undefined;
    middleName?: string | undefined;
    dateOfBirth?: string | Date | undefined;
    gender?: "unknown" | "male" | "female" | "other" | undefined;
    maritalStatus?: "other" | "single" | "married" | "divorced" | "widowed" | undefined;
    nationality?: string | undefined;
    preferredLanguage?: string | undefined;
    addressLine1?: string | undefined;
    addressLine2?: string | undefined;
    city?: string | undefined;
    emirate?: "Abu Dhabi" | "Dubai" | "Sharjah" | "Ajman" | "Umm Al Quwain" | "Ras Al Khaimah" | "Fujairah" | undefined;
    postalCode?: string | undefined;
    emergencyContact?: {
        phoneNumber: string;
        name: string;
        relationship: string;
        email?: string | undefined;
    } | undefined;
    insuranceInfo?: {
        provider: string;
        policyNumber: string;
        groupNumber?: string | undefined;
        expiryDate?: string | Date | undefined;
        copayAmount?: number | undefined;
        copayType?: "fixed" | "percentage" | undefined;
    } | undefined;
}>;
export const PatientQueryDto: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<["male", "female", "other", "unknown"]>>;
    status: z.ZodOptional<z.ZodEnum<["active", "inactive", "deleted"]>>;
    emirate: z.ZodOptional<z.ZodEnum<["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]>>;
    ageRange: z.ZodOptional<z.ZodObject<{
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        min?: number | undefined;
        max?: number | undefined;
    }, {
        min?: number | undefined;
        max?: number | undefined;
    }>>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
        to: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    }, "strip", z.ZodTypeAny, {
        from?: string | Date | undefined;
        to?: string | Date | undefined;
    }, {
        from?: string | Date | undefined;
        to?: string | Date | undefined;
    }>>;
    sortBy: z.ZodDefault<z.ZodEnum<["firstName", "lastName", "dateOfBirth", "createdAt", "updatedAt"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortBy: "firstName" | "lastName" | "createdAt" | "updatedAt" | "dateOfBirth";
    sortOrder: "asc" | "desc";
    status?: "active" | "inactive" | "deleted" | undefined;
    search?: string | undefined;
    gender?: "unknown" | "male" | "female" | "other" | undefined;
    emirate?: "Abu Dhabi" | "Dubai" | "Sharjah" | "Ajman" | "Umm Al Quwain" | "Ras Al Khaimah" | "Fujairah" | undefined;
    ageRange?: {
        min?: number | undefined;
        max?: number | undefined;
    } | undefined;
    dateRange?: {
        from?: string | Date | undefined;
        to?: string | Date | undefined;
    } | undefined;
}, {
    status?: "active" | "inactive" | "deleted" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    sortBy?: "firstName" | "lastName" | "createdAt" | "updatedAt" | "dateOfBirth" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    gender?: "unknown" | "male" | "female" | "other" | undefined;
    emirate?: "Abu Dhabi" | "Dubai" | "Sharjah" | "Ajman" | "Umm Al Quwain" | "Ras Al Khaimah" | "Fujairah" | undefined;
    ageRange?: {
        min?: number | undefined;
        max?: number | undefined;
    } | undefined;
    dateRange?: {
        from?: string | Date | undefined;
        to?: string | Date | undefined;
    } | undefined;
}>;
export const PatientSearchDto: z.ZodObject<{
    q: z.ZodString;
    fields: z.ZodOptional<z.ZodArray<z.ZodEnum<["firstName", "lastName", "emiratesId", "phoneNumber", "email"]>, "many">>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    q: string;
    fields?: ("email" | "phoneNumber" | "firstName" | "lastName" | "emiratesId")[] | undefined;
}, {
    q: string;
    limit?: number | undefined;
    fields?: ("email" | "phoneNumber" | "firstName" | "lastName" | "emiratesId")[] | undefined;
}>;
export const PatientConsentDto: z.ZodObject<{
    consentType: z.ZodEnum<["data_sharing", "research", "marketing", "emergency_contact"]>;
    consentStatus: z.ZodEnum<["granted", "denied", "withdrawn"]>;
    consentDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    expirationDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    consentMethod: z.ZodEnum<["digital_signature", "verbal", "written"]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    consentType: "data_sharing" | "research" | "marketing" | "emergency_contact";
    consentStatus: "granted" | "denied" | "withdrawn";
    consentDate: string | Date;
    consentMethod: "digital_signature" | "verbal" | "written";
    expirationDate?: string | Date | undefined;
    notes?: string | undefined;
}, {
    consentType: "data_sharing" | "research" | "marketing" | "emergency_contact";
    consentStatus: "granted" | "denied" | "withdrawn";
    consentDate: string | Date;
    consentMethod: "digital_signature" | "verbal" | "written";
    expirationDate?: string | Date | undefined;
    notes?: string | undefined;
}>;
export const PatientTranslationDto: z.ZodObject<{
    fieldName: z.ZodString;
    languageCode: z.ZodString;
    translatedText: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fieldName: string;
    languageCode: string;
    translatedText: string;
}, {
    fieldName: string;
    languageCode: string;
    translatedText: string;
}>;
export const MergePatientsDto: z.ZodObject<{
    secondaryPatientId: z.ZodString;
    mergeReason: z.ZodString;
    keepPrimaryData: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    secondaryPatientId: string;
    mergeReason: string;
    keepPrimaryData: boolean;
}, {
    secondaryPatientId: string;
    mergeReason: string;
    keepPrimaryData?: boolean | undefined;
}>;
export const DuplicateSearchDto: z.ZodObject<{
    threshold: z.ZodDefault<z.ZodNumber>;
    searchFields: z.ZodDefault<z.ZodArray<z.ZodEnum<["firstName", "lastName", "dateOfBirth", "phoneNumber", "email"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    threshold: number;
    searchFields: ("email" | "phoneNumber" | "firstName" | "lastName" | "dateOfBirth")[];
}, {
    threshold?: number | undefined;
    searchFields?: ("email" | "phoneNumber" | "firstName" | "lastName" | "dateOfBirth")[] | undefined;
}>;
export const PatientResponseDto: z.ZodObject<{
    id: z.ZodString;
    emiratesId: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    middleName: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodString;
    gender: z.ZodEnum<["male", "female", "other", "unknown"]>;
    maritalStatus: z.ZodOptional<z.ZodEnum<["single", "married", "divorced", "widowed", "other"]>>;
    nationality: z.ZodString;
    preferredLanguage: z.ZodString;
    phoneNumber: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    addressLine1: z.ZodOptional<z.ZodString>;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    emirate: z.ZodOptional<z.ZodEnum<["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]>>;
    postalCode: z.ZodOptional<z.ZodString>;
    emergencyContact: z.ZodOptional<z.ZodAny>;
    insuranceInfo: z.ZodOptional<z.ZodAny>;
    status: z.ZodEnum<["active", "inactive", "deleted"]>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    translations: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "active" | "inactive" | "deleted";
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    emiratesId: string;
    dateOfBirth: string;
    gender: "unknown" | "male" | "female" | "other";
    nationality: string;
    preferredLanguage: string;
    email?: string | undefined;
    phoneNumber?: string | undefined;
    middleName?: string | undefined;
    maritalStatus?: "other" | "single" | "married" | "divorced" | "widowed" | undefined;
    addressLine1?: string | undefined;
    addressLine2?: string | undefined;
    city?: string | undefined;
    emirate?: "Abu Dhabi" | "Dubai" | "Sharjah" | "Ajman" | "Umm Al Quwain" | "Ras Al Khaimah" | "Fujairah" | undefined;
    postalCode?: string | undefined;
    emergencyContact?: any;
    insuranceInfo?: any;
    translations?: any[] | undefined;
}, {
    id: string;
    status: "active" | "inactive" | "deleted";
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    emiratesId: string;
    dateOfBirth: string;
    gender: "unknown" | "male" | "female" | "other";
    nationality: string;
    preferredLanguage: string;
    email?: string | undefined;
    phoneNumber?: string | undefined;
    middleName?: string | undefined;
    maritalStatus?: "other" | "single" | "married" | "divorced" | "widowed" | undefined;
    addressLine1?: string | undefined;
    addressLine2?: string | undefined;
    city?: string | undefined;
    emirate?: "Abu Dhabi" | "Dubai" | "Sharjah" | "Ajman" | "Umm Al Quwain" | "Ras Al Khaimah" | "Fujairah" | undefined;
    postalCode?: string | undefined;
    emergencyContact?: any;
    insuranceInfo?: any;
    translations?: any[] | undefined;
}>;
export const PatientSearchResultDto: z.ZodObject<{
    id: z.ZodString;
    emiratesId: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    dateOfBirth: z.ZodString;
    gender: z.ZodEnum<["male", "female", "other", "unknown"]>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    matchScore: z.ZodOptional<z.ZodNumber>;
    matchReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    firstName: string;
    lastName: string;
    emiratesId: string;
    dateOfBirth: string;
    gender: "unknown" | "male" | "female" | "other";
    email?: string | undefined;
    phoneNumber?: string | undefined;
    matchScore?: number | undefined;
    matchReason?: string | undefined;
}, {
    id: string;
    firstName: string;
    lastName: string;
    emiratesId: string;
    dateOfBirth: string;
    gender: "unknown" | "male" | "female" | "other";
    email?: string | undefined;
    phoneNumber?: string | undefined;
    matchScore?: number | undefined;
    matchReason?: string | undefined;
}>;
export const PatientMedicalHistoryDto: z.ZodObject<{
    patientId: z.ZodString;
    appointments: z.ZodArray<z.ZodAny, "many">;
    encounters: z.ZodArray<z.ZodAny, "many">;
    diagnoses: z.ZodArray<z.ZodAny, "many">;
    medications: z.ZodArray<z.ZodAny, "many">;
    allergies: z.ZodArray<z.ZodAny, "many">;
    immunizations: z.ZodArray<z.ZodAny, "many">;
    vitals: z.ZodArray<z.ZodAny, "many">;
    labResults: z.ZodArray<z.ZodAny, "many">;
    imagingResults: z.ZodArray<z.ZodAny, "many">;
    summary: z.ZodObject<{
        totalVisits: z.ZodNumber;
        lastVisit: z.ZodOptional<z.ZodString>;
        primaryDiagnoses: z.ZodArray<z.ZodString, "many">;
        currentMedications: z.ZodArray<z.ZodString, "many">;
        knownAllergies: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        totalVisits: number;
        primaryDiagnoses: string[];
        currentMedications: string[];
        knownAllergies: string[];
        lastVisit?: string | undefined;
    }, {
        totalVisits: number;
        primaryDiagnoses: string[];
        currentMedications: string[];
        knownAllergies: string[];
        lastVisit?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    appointments: any[];
    encounters: any[];
    summary: {
        totalVisits: number;
        primaryDiagnoses: string[];
        currentMedications: string[];
        knownAllergies: string[];
        lastVisit?: string | undefined;
    };
    patientId: string;
    diagnoses: any[];
    medications: any[];
    allergies: any[];
    immunizations: any[];
    vitals: any[];
    labResults: any[];
    imagingResults: any[];
}, {
    appointments: any[];
    encounters: any[];
    summary: {
        totalVisits: number;
        primaryDiagnoses: string[];
        currentMedications: string[];
        knownAllergies: string[];
        lastVisit?: string | undefined;
    };
    patientId: string;
    diagnoses: any[];
    medications: any[];
    allergies: any[];
    immunizations: any[];
    vitals: any[];
    labResults: any[];
    imagingResults: any[];
}>;
export const PatientConsentResponseDto: z.ZodObject<{
    id: z.ZodString;
    patientId: z.ZodString;
    consentType: z.ZodEnum<["data_sharing", "research", "marketing", "emergency_contact"]>;
    consentStatus: z.ZodEnum<["granted", "denied", "withdrawn"]>;
    consentDate: z.ZodString;
    expirationDate: z.ZodOptional<z.ZodString>;
    consentMethod: z.ZodEnum<["digital_signature", "verbal", "written"]>;
    notes: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    consentType: "data_sharing" | "research" | "marketing" | "emergency_contact";
    consentStatus: "granted" | "denied" | "withdrawn";
    consentDate: string;
    consentMethod: "digital_signature" | "verbal" | "written";
    patientId: string;
    expirationDate?: string | undefined;
    notes?: string | undefined;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    consentType: "data_sharing" | "research" | "marketing" | "emergency_contact";
    consentStatus: "granted" | "denied" | "withdrawn";
    consentDate: string;
    consentMethod: "digital_signature" | "verbal" | "written";
    patientId: string;
    expirationDate?: string | undefined;
    notes?: string | undefined;
}>;
import { z } from 'zod';
//# sourceMappingURL=patient.dto.d.ts.map