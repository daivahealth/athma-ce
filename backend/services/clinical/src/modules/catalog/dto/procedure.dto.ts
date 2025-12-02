import { IsString, IsOptional, IsNotEmpty, IsBoolean, IsInt, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateProcedureDto {
  @ApiPropertyOptional({ description: 'Tenant ID (null for global procedure)' })
  @IsString()
  @IsOptional()
  tenantId?: string;

  @ApiProperty({ description: 'Procedure name' })
  @IsString()
  @IsNotEmpty()
  procedureName!: string;

  @ApiPropertyOptional({ description: 'CPT code for billing' })
  @IsString()
  @IsOptional()
  cptCode?: string;

  @ApiPropertyOptional({ description: 'ICD-10-PCS code' })
  @IsString()
  @IsOptional()
  icd10PcsCode?: string;

  @ApiPropertyOptional({ description: 'Facility-specific procedure code' })
  @IsString()
  @IsOptional()
  localCode?: string;

  @ApiPropertyOptional({ description: 'Billing code' })
  @IsString()
  @IsOptional()
  billingCode?: string;

  @ApiPropertyOptional({ description: 'Billing code type (e.g., INTERNAL, CPT, DHA)' })
  @IsString()
  @IsOptional()
  billingCodeType?: string;

  @ApiPropertyOptional({ description: 'Billing description' })
  @IsString()
  @IsOptional()
  billingDescription?: string;

  @ApiProperty({ description: 'Procedure category (e.g., surgical, diagnostic, therapeutic)' })
  @IsString()
  @IsNotEmpty()
  procedureCategory!: string;

  @ApiProperty({ description: 'Body system (e.g., cardiovascular, respiratory)' })
  @IsString()
  @IsNotEmpty()
  bodySystem!: string;

  @ApiPropertyOptional({ description: 'Procedure type (e.g., minor, major, endoscopic)' })
  @IsString()
  @IsOptional()
  procedureType?: string;

  @ApiPropertyOptional({ description: 'Anesthesia type (e.g., local, regional, general, none)' })
  @IsString()
  @IsOptional()
  anesthesiaType?: string;

  @ApiPropertyOptional({ description: 'Facility required (e.g., clinic, hospital, surgery_center)' })
  @IsString()
  @IsOptional()
  facilityRequired?: string;

  @ApiPropertyOptional({ description: 'Estimated duration in minutes' })
  @IsInt()
  @IsOptional()
  estimatedDurationMinutes?: number;

  @ApiPropertyOptional({ description: 'Preparation instructions' })
  @IsString()
  @IsOptional()
  preparationInstructions?: string;

  @ApiPropertyOptional({ description: 'Post-procedure instructions' })
  @IsString()
  @IsOptional()
  postProcedureInstructions?: string;

  @ApiPropertyOptional({ description: 'Risks and complications', type: [String] })
  @IsArray()
  @IsOptional()
  risksAndComplications?: string[];

  @ApiPropertyOptional({ description: 'Contraindications', type: [String] })
  @IsArray()
  @IsOptional()
  contraindications?: string[];

  @ApiPropertyOptional({ description: 'Consent required', default: false })
  @IsBoolean()
  @IsOptional()
  consentRequired?: boolean;

  @ApiPropertyOptional({ description: 'Consent type (e.g., informed_consent, anesthesia_consent)' })
  @IsString()
  @IsOptional()
  consentType?: string;

  @ApiPropertyOptional({ description: 'Pre-procedure requirements', type: [String] })
  @IsArray()
  @IsOptional()
  preProcedureRequirements?: string[];

  @ApiPropertyOptional({ description: 'Post-procedure monitoring' })
  @IsString()
  @IsOptional()
  postProcedureMonitoring?: string;

  @ApiPropertyOptional({ description: 'Recovery time in hours' })
  @IsInt()
  @IsOptional()
  recoveryTimeHours?: number;

  @ApiPropertyOptional({ description: 'Is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateProcedureDto extends PartialType(CreateProcedureDto) {}

export interface ProcedureResponseDto {
  id: string;
  tenantId?: string | null;
  procedureName: string;
  cptCode?: string | null;
  icd10PcsCode?: string | null;
  localCode?: string | null;
  billingCode?: string | null;
  billingCodeType?: string | null;
  billingDescription?: string | null;
  procedureCategory: string;
  bodySystem: string;
  procedureType?: string | null;
  anesthesiaType?: string | null;
  facilityRequired?: string | null;
  estimatedDurationMinutes?: number | null;
  preparationInstructions?: string | null;
  postProcedureInstructions?: string | null;
  risksAndComplications: string[];
  contraindications: string[];
  consentRequired: boolean;
  consentType?: string | null;
  preProcedureRequirements: string[];
  postProcedureMonitoring?: string | null;
  recoveryTimeHours?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
