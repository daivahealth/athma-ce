/**
 * Create Patient DTO
 */

import { IsString, IsOptional, IsEmail, IsDateString, IsIn } from 'class-validator';

export class CreatePatientDto {
  // Identity
  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  nationalIdType?: string;

  @IsOptional()
  @IsString()
  issuingCountry?: string;

  // Demographics
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender!: string;

  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  // Contact
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // Address
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

  // Medical
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsOptional()
  emergencyContact?: any;

  @IsOptional()
  insuranceInfo?: any;

  // Registration
  @IsOptional()
  @IsString()
  registrationSource?: string;

  @IsOptional()
  @IsString()
  registrationNotes?: string;
}
