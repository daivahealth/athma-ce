/**
 * Create Patient DTO
 */
export declare class CreatePatientDto {
    nationalId?: string;
    nationalIdType?: string;
    passportNumber?: string;
    issuingCountry?: string;
    title?: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus?: string;
    nationality?: string;
    preferredLanguage?: string;
    phoneNumber?: string;
    alternateContactNumber?: string;
    contactNumber?: string;
    email?: string;
    address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    bloodGroup?: string;
    emergencyContact?: any;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    emergencyContactRelation?: string;
    insuranceInfo?: any;
    registrationSource?: string;
    registrationNotes?: string;
}
//# sourceMappingURL=create-patient.dto.d.ts.map