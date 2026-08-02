import { IsBoolean, IsEnum, IsObject, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { IdentityVerificationStatus } from '@zeal/database-clinical';

export class ValidateIdentityDto {
  @IsString()
  @Length(2, 2)
  country!: string;

  @IsString()
  identityType!: string;

  @IsString()
  value!: string;
}

export class StartChallengeDto {
  @IsString()
  @Length(2, 2)
  country!: string;

  @IsString()
  identityType!: string;

  /** 'verify' an existing identity, or 'enroll' a brand-new one. */
  @IsEnum(['verify', 'enroll'])
  purpose!: 'verify' | 'enroll';

  /** e.g. 'aadhaar' | 'mobile' | 'abha-number' */
  @IsString()
  loginHint!: string;

  /**
   * SENSITIVE. The raw identifier (Aadhaar/mobile/ABHA number). Encrypted by
   * the provider before transmission; never persisted or logged.
   */
  @IsString()
  loginId!: string;

  /** Optional patient to attach the identity to on successful verification. */
  @IsOptional()
  @IsUUID()
  patientId?: string;
}

export class CompleteChallengeDto {
  /** SENSITIVE. Never persisted or logged. */
  @IsString()
  otp!: string;

  /** Optional mobile to attach during enrolment. SENSITIVE. */
  @IsOptional()
  @IsString()
  mobile?: string;

  /** Overrides the patient captured when the challenge was started. */
  @IsOptional()
  @IsUUID()
  patientId?: string;
}

export class CreatePatientIdentityDto {
  @IsString()
  @Length(2, 2)
  country!: string;

  @IsString()
  identityType!: string;

  @IsString()
  value!: string;

  @IsOptional()
  @IsString()
  secondaryValue?: string;

  @IsOptional()
  @IsEnum(IdentityVerificationStatus)
  verificationStatus?: IdentityVerificationStatus;

  @IsOptional()
  @IsString()
  verificationMethod?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class UpdatePatientIdentityDto {
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsString()
  secondaryValue?: string;

  @IsOptional()
  @IsEnum(IdentityVerificationStatus)
  verificationStatus?: IdentityVerificationStatus;
}

export class AbhaAddressSuggestionsDto {
  @IsString()
  txnId!: string;
}

export class CreateAbhaAddressDto {
  @IsString()
  txnId!: string;

  @IsString()
  abhaAddress!: string;

  @IsOptional()
  @IsUUID()
  patientId?: string;
}
