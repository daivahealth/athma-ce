/**
 * Update Patient DTO
 */

import { IsString, IsOptional, IsEmail, IsDateString, IsBoolean } from 'class-validator';

export class UpdatePatientDto {
  // Any field from CreatePatientDto can be updated
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  alternateContactNumber?: string;

  // Alias for phoneNumber (for frontend compatibility)
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  addressLine1?: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  nationalIdType?: string;

  @IsOptional()
  @IsString()
  issuingCountry?: string;

  @IsOptional()
  @IsString()
  passportNumber?: string;

  @IsOptional()
  emergencyContact?: any;

  // Emergency contact flat fields (for frontend compatibility)
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactNumber?: string;

  @IsOptional()
  @IsString()
  emergencyContactRelation?: string;

  @IsOptional()
  insuranceInfo?: any;

  // Additional metadata for updates
  @IsOptional()
  @IsString()
  changeReason?: string;

  @IsOptional()
  @IsString()
  supportingDocUrl?: string;

  @IsOptional()
  @IsBoolean()
  patientConsent?: boolean;

  @IsOptional()
  @IsString()
  consentDocUrl?: string;
}
