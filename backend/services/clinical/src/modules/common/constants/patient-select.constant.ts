/**
 * Standardized Patient Select for API Responses
 *
 * This ensures consistent patient data across all APIs.
 * All services should use this constant when selecting patient fields.
 *
 * Fields included:
 * - id: Patient UUID
 * - mrn: Medical Record Number
 * - displayName: Full name (computed or stored)
 * - firstName: First name (for fallback if displayName is null)
 * - lastName: Last name (for fallback if displayName is null)
 * - dateOfBirth: Date of birth
 * - gender: Gender
 * - phoneNumber: Primary phone number
 */
export const STANDARD_PATIENT_SELECT = {
  id: true,
  mrn: true,
  displayName: true,
  firstName: true,
  lastName: true,
  dateOfBirth: true,
  gender: true,
  phoneNumber: true,
  nationalId: true,
  nationalIdType: true,
  email: true,
  nationality: true,
  preferredLanguage: true,
} as const;

/**
 * Helper type for patient data returned by standard select
 */
export type StandardPatientData = {
  id: string;
  mrn: string;
  displayName: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  phoneNumber: string | null;
  nationalId: string | null;
  nationalIdType: string | null;
  email: string | null;
  nationality: string | null;
  preferredLanguage: string | null;
};
