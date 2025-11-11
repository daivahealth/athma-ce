import { IsString, IsUUID, IsOptional, IsEnum, IsBoolean, IsInt, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Enum for diagnosis type
export enum DiagnosisType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  RULE_OUT = 'rule_out',
  DIFFERENTIAL = 'differential',
}

// DTO for creating a diagnosis
export class CreateDiagnosisDto {
  @ApiProperty({ description: 'Encounter ID' })
  @IsUUID()
  encounterId!: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ description: 'ICD-10 code' })
  @IsString()
  icdCode!: string;

  @ApiPropertyOptional({ description: 'ICD version', default: 'ICD-10' })
  @IsOptional()
  @IsString()
  icdVersion?: string;

  @ApiProperty({ description: 'Diagnosis name in English' })
  @IsString()
  diagnosisName!: string;

  @ApiPropertyOptional({ description: 'Diagnosis name in Arabic' })
  @IsOptional()
  @IsString()
  diagnosisNameAr?: string;

  @ApiProperty({ description: 'Diagnosis type', enum: DiagnosisType })
  @IsEnum(DiagnosisType)
  diagnosisType!: DiagnosisType;

  @ApiPropertyOptional({ description: 'Diagnosis rank (1 = primary, 2+ = secondary)' })
  @IsOptional()
  @IsInt()
  diagnosisRank?: number;

  @ApiPropertyOptional({ description: 'Present on admission flag' })
  @IsOptional()
  @IsBoolean()
  isPresentOnAdmission?: boolean;

  @ApiPropertyOptional({ description: 'Chronic condition flag' })
  @IsOptional()
  @IsBoolean()
  isChronic?: boolean;

  @ApiPropertyOptional({ description: 'Onset date' })
  @IsOptional()
  @IsDateString()
  onsetDate?: string;

  @ApiPropertyOptional({ description: 'Clinical notes' })
  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @ApiProperty({ description: 'Staff ID who diagnosed' })
  @IsUUID()
  diagnosedBy!: string;
}

// DTO for updating a diagnosis
export class UpdateDiagnosisDto {
  @ApiPropertyOptional({ description: 'Diagnosis type', enum: DiagnosisType })
  @IsOptional()
  @IsEnum(DiagnosisType)
  diagnosisType?: DiagnosisType;

  @ApiPropertyOptional({ description: 'Diagnosis rank' })
  @IsOptional()
  @IsInt()
  diagnosisRank?: number;

  @ApiPropertyOptional({ description: 'Present on admission flag' })
  @IsOptional()
  @IsBoolean()
  isPresentOnAdmission?: boolean;

  @ApiPropertyOptional({ description: 'Chronic condition flag' })
  @IsOptional()
  @IsBoolean()
  isChronic?: boolean;

  @ApiPropertyOptional({ description: 'Onset date' })
  @IsOptional()
  @IsDateString()
  onsetDate?: string;

  @ApiPropertyOptional({ description: 'Clinical notes' })
  @IsOptional()
  @IsString()
  clinicalNotes?: string;
}

// Response DTO
export class DiagnosisResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  encounterId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  icdCode!: string;

  @ApiProperty()
  icdVersion!: string;

  @ApiProperty()
  diagnosisName!: string;

  @ApiPropertyOptional()
  diagnosisNameAr?: string;

  @ApiProperty({ enum: DiagnosisType })
  diagnosisType!: DiagnosisType;

  @ApiPropertyOptional()
  diagnosisRank?: number;

  @ApiProperty()
  isPresentOnAdmission!: boolean;

  @ApiProperty()
  isChronic!: boolean;

  @ApiPropertyOptional()
  onsetDate?: Date;

  @ApiPropertyOptional()
  clinicalNotes?: string;

  @ApiProperty()
  diagnosedBy!: string;

  @ApiProperty()
  diagnosedAt!: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
