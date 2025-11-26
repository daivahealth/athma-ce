import { IsString, IsUUID, IsEnum, IsOptional, IsBoolean, IsInt, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Coding session status values
 */
export enum CodingSessionStatus {
  AUTO_GENERATED = 'auto_generated',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SUBMITTED = 'submitted',
}

/**
 * Diagnosis type values
 */
export enum DiagnosisType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ADMITTING = 'admitting',
  DISCHARGE = 'discharge',
}

/**
 * DTO for updating a coding diagnosis
 */
export class UpdateCodingDiagnosisDto {
  @ApiPropertyOptional({ description: 'ICD code' })
  @IsOptional()
  @IsString()
  diagnosisCode?: string;

  @ApiPropertyOptional({ description: 'ICD version (ICD10, ICD11)' })
  @IsOptional()
  @IsString()
  diagnosisCodeType?: string;

  @ApiPropertyOptional({ description: 'Diagnosis display name' })
  @IsOptional()
  @IsString()
  diagnosisDisplay?: string;

  @ApiPropertyOptional({ description: 'Diagnosis display name in Arabic' })
  @IsOptional()
  @IsString()
  diagnosisDisplayAr?: string;

  @ApiPropertyOptional({ description: 'Diagnosis type', enum: DiagnosisType })
  @IsOptional()
  @IsEnum(DiagnosisType)
  diagnosisType?: DiagnosisType;

  @ApiPropertyOptional({ description: 'Sequence number' })
  @IsOptional()
  @IsInt()
  sequence?: number;

  @ApiPropertyOptional({ description: 'Whether to use for billing' })
  @IsOptional()
  @IsBoolean()
  usedForBilling?: boolean;
}

/**
 * DTO for updating a coding procedure
 */
export class UpdateCodingProcedureDto {
  @ApiPropertyOptional({ description: 'Procedure code (CPT, HCPCS, etc.)' })
  @IsOptional()
  @IsString()
  procedureCode?: string;

  @ApiPropertyOptional({ description: 'Code type' })
  @IsOptional()
  @IsString()
  procedureCodeType?: string;

  @ApiPropertyOptional({ description: 'Procedure display name' })
  @IsOptional()
  @IsString()
  procedureDisplay?: string;

  @ApiPropertyOptional({ description: 'Procedure display name in Arabic' })
  @IsOptional()
  @IsString()
  procedureDisplayAr?: string;

  @ApiPropertyOptional({ description: 'Number of units' })
  @IsOptional()
  @IsInt()
  units?: number;

  @ApiPropertyOptional({ description: 'Sequence number' })
  @IsOptional()
  @IsInt()
  sequence?: number;

  @ApiPropertyOptional({ description: 'Service date' })
  @IsOptional()
  @IsDateString()
  serviceDate?: string;

  @ApiPropertyOptional({ description: 'Modifier codes (comma-separated)' })
  @IsOptional()
  @IsString()
  modifiers?: string;
}

/**
 * DTO for updating a coding session
 */
export class UpdateCodingSessionDto {
  @ApiPropertyOptional({ description: 'Session status', enum: CodingSessionStatus })
  @IsOptional()
  @IsEnum(CodingSessionStatus)
  status?: CodingSessionStatus;

  @ApiPropertyOptional({ description: 'Coder notes' })
  @IsOptional()
  @IsString()
  coderNotes?: string;

  @ApiPropertyOptional({ description: 'Array of diagnosis updates' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateCodingDiagnosisDto)
  diagnoses?: UpdateCodingDiagnosisDto[];

  @ApiPropertyOptional({ description: 'Array of procedure updates' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateCodingProcedureDto)
  procedures?: UpdateCodingProcedureDto[];
}

/**
 * DTO for submitting a coding session
 */
export class SubmitCodingSessionDto {
  @ApiProperty({ description: 'Coder final notes' })
  @IsOptional()
  @IsString()
  coderNotes?: string;

  @ApiProperty({ description: 'Whether to generate claim immediately' })
  @IsOptional()
  @IsBoolean()
  generateClaim?: boolean;
}

/**
 * DTO for querying coding sessions
 */
export class CodingSessionQueryDto {
  @ApiPropertyOptional({ description: 'Filter by status', enum: CodingSessionStatus })
  @IsOptional()
  @IsEnum(CodingSessionStatus)
  status?: CodingSessionStatus;

  @ApiPropertyOptional({ description: 'Filter by encounter ID' })
  @IsOptional()
  @IsUUID()
  encounterId?: string;

  @ApiPropertyOptional({ description: 'Filter by patient ID (via encounter)' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Date from (ISO format)' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Date to (ISO format)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Limit results' })
  @IsOptional()
  @IsInt()
  limit?: number;
}

/**
 * DTO for adding a new diagnosis to a coding session
 */
export class CreateCodingDiagnosisDto {
  @ApiProperty({ description: 'ICD code' })
  @IsString()
  diagnosisCode!: string;

  @ApiProperty({ description: 'ICD version (ICD10, ICD11)' })
  @IsString()
  diagnosisCodeType!: string;

  @ApiProperty({ description: 'Diagnosis display name' })
  @IsString()
  diagnosisDisplay!: string;

  @ApiPropertyOptional({ description: 'Diagnosis display name in Arabic' })
  @IsOptional()
  @IsString()
  diagnosisDisplayAr?: string;

  @ApiProperty({ description: 'Diagnosis type', enum: DiagnosisType })
  @IsEnum(DiagnosisType)
  diagnosisType!: DiagnosisType;

  @ApiProperty({ description: 'Sequence number' })
  @IsInt()
  sequence!: number;

  @ApiPropertyOptional({ description: 'Whether to use for billing', default: true })
  @IsOptional()
  @IsBoolean()
  usedForBilling?: boolean;
}

/**
 * DTO for adding a new procedure to a coding session
 */
export class CreateCodingProcedureDto {
  @ApiProperty({ description: 'Billing item ID' })
  @IsUUID()
  billingItemId!: string;

  @ApiProperty({ description: 'Procedure code (CPT, HCPCS, etc.)' })
  @IsString()
  procedureCode!: string;

  @ApiProperty({ description: 'Code type' })
  @IsString()
  procedureCodeType!: string;

  @ApiProperty({ description: 'Procedure display name' })
  @IsString()
  procedureDisplay!: string;

  @ApiPropertyOptional({ description: 'Procedure display name in Arabic' })
  @IsOptional()
  @IsString()
  procedureDisplayAr?: string;

  @ApiProperty({ description: 'Number of units' })
  @IsInt()
  units!: number;

  @ApiProperty({ description: 'Sequence number' })
  @IsInt()
  sequence!: number;

  @ApiProperty({ description: 'Service date' })
  @IsDateString()
  serviceDate!: string;

  @ApiPropertyOptional({ description: 'Modifier 1' })
  @IsOptional()
  @IsString()
  modifier1?: string;

  @ApiPropertyOptional({ description: 'Modifier 2' })
  @IsOptional()
  @IsString()
  modifier2?: string;

  @ApiPropertyOptional({ description: 'Modifier 3' })
  @IsOptional()
  @IsString()
  modifier3?: string;
}
