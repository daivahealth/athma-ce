/**
 * Patient Entity Types
 * Matches backend Patient model from Clinical database
 */

export interface Patient {
  id: string;
  mrn: string;
  tenantId: string;

  // Personal Information
  firstName: string;
  middleName?: string | null;
  lastName: string;
  fullName?: string;

  // Demographics
  dateOfBirth: string; // ISO date string
  gender: 'male' | 'female' | 'other';
  nationality?: string | null;
  bloodGroup?: string | null;

  // Identity
  nationalId?: string | null;
  nationalIdType?: string | null;
  passportNumber?: string | null;

  // Contact
  phoneNumber: string;
  alternateContactNumber?: string | null;
  email?: string | null;

  // Address
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;

  // Emergency Contact
  emergencyContactName?: string | null;
  emergencyContactNumber?: string | null;
  emergencyContactRelation?: string | null;

  // Medical
  allergies?: string | null;
  chronicConditions?: string | null;
  currentMedications?: string | null;

  // Insurance
  insuranceProvider?: string | null;
  insurancePolicyNumber?: string | null;
  insuranceExpiryDate?: string | null;

  // Status
  status: 'active' | 'inactive' | 'deceased';
  registrationDate?: string | null;

  // Audit Fields
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string | null;
  createdAtFacility: string;
  updatedAtFacility?: string | null;
}

/**
 * DTO for creating a new patient
 */
export interface CreatePatientDto {
  // Required fields
  firstName: string;
  lastName: string;
  dateOfBirth: string; // Format: YYYY-MM-DD
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;

  // Optional fields
  middleName?: string;
  nationality?: string;
  bloodGroup?: string;
  nationalId?: string;
  nationalIdType?: string;
  passportNumber?: string;
  alternateContactNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactRelation?: string;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
}

/**
 * DTO for updating a patient
 */
export interface UpdatePatientDto extends Partial<CreatePatientDto> {}

/**
 * DTO for searching patients
 */
export interface SearchPatientsDto {
  search?: string;       // Search by name, MRN, contact
  query?: string;        // Alias for search
  page?: number;
  limit?: number;
  gender?: 'male' | 'female' | 'other';
  status?: 'active' | 'inactive' | 'deceased';
  minAge?: number;
  maxAge?: number;
}

/**
 * Patient form values for React Hook Form
 */
export interface PatientFormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  bloodGroup: string;
  nationalId: string;
  nationalIdType: string;
  passportNumber: string;
  phoneNumber: string;
  alternateContactNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelation: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceExpiryDate: string;
}

/**
 * Patient list item (minimal data for tables)
 */
export interface PatientListItem {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  dateOfBirth: string;
  age?: number;
  gender: string;
  phoneNumber: string;
  email?: string | null;
  status: string;
}
