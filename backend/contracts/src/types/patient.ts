/**
 * Shared Patient DTOs
 * These DTOs are used across backend services and frontend
 */

/**
 * Patient display information for UI components
 * Used in ward boards, patient lists, and other display contexts
 */
export interface PatientDisplayDto {
    patientId: string;
    mrn: string;
    firstName: string;
    lastName: string;
    displayName: string;
    age: number;
    dateOfBirth: string; // ISO 8601 date
    gender: string;
    nationalId?: string;
    nationalIdType?: string;
    phoneNumber?: string;
    email?: string;
    nationality?: string;
    preferredLanguage?: string;
}
