import { IsString, IsUUID, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Enum for prescription status
export enum PrescriptionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISCONTINUED = 'discontinued',
}

// Enum for drug code system
export enum DrugCodeSystem {
  NDC = 'NDC',
  RXNORM = 'RxNorm',
  LOCAL = 'local',
}

// DTO for creating a prescription order
export class CreatePrescriptionDto {
  @ApiProperty({ description: 'Encounter ID' })
  @IsUUID("all")
  encounterId!: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("all")
  patientId!: string;

  @ApiProperty({ description: 'Drug code (NDC, RxNorm, or local formulary code)' })
  @IsString()
  drugCode!: string;

  @ApiPropertyOptional({ description: 'Code system', enum: DrugCodeSystem, default: DrugCodeSystem.NDC })
  @IsOptional()
  @IsEnum(DrugCodeSystem)
  codeSystem?: DrugCodeSystem;

  @ApiProperty({ description: 'Drug name in English' })
  @IsString()
  drugName!: string;

  @ApiPropertyOptional({ description: 'Drug name in Arabic' })
  @IsOptional()
  @IsString()
  drugNameAr?: string;

  @ApiPropertyOptional({ description: 'Generic name' })
  @IsOptional()
  @IsString()
  genericName?: string;

  @ApiProperty({ description: 'Dosage (e.g., "500mg")' })
  @IsString()
  dosage!: string;

  @ApiProperty({ description: 'Route (e.g., oral, IV, topical)' })
  @IsString()
  route!: string;

  @ApiProperty({ description: 'Frequency (e.g., "twice daily")' })
  @IsString()
  frequency!: string;

  @ApiPropertyOptional({ description: 'Duration (e.g., "7 days")' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ description: 'Quantity' })
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiPropertyOptional({ description: 'Number of refills', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  refills?: number;

  @ApiPropertyOptional({ description: 'Instructions in English' })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional({ description: 'Instructions in Arabic' })
  @IsOptional()
  @IsString()
  instructionsAr?: string;

  @ApiProperty({ description: 'Staff ID who prescribed' })
  @IsUUID("all")
  prescribedBy!: string;
}

// DTO for updating a prescription order
export class UpdatePrescriptionDto {
  @ApiPropertyOptional({ description: 'Dosage' })
  @IsOptional()
  @IsString()
  dosage?: string;

  @ApiPropertyOptional({ description: 'Frequency' })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiPropertyOptional({ description: 'Duration' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ description: 'Quantity' })
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiPropertyOptional({ description: 'Number of refills' })
  @IsOptional()
  @IsInt()
  @Min(0)
  refills?: number;

  @ApiPropertyOptional({ description: 'Instructions in English' })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional({ description: 'Instructions in Arabic' })
  @IsOptional()
  @IsString()
  instructionsAr?: string;

  @ApiPropertyOptional({ description: 'Status', enum: PrescriptionStatus })
  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;
}

// Response DTO
export class PrescriptionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  encounterId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  drugCode!: string;

  @ApiProperty({ enum: DrugCodeSystem })
  codeSystem!: DrugCodeSystem;

  @ApiProperty()
  drugName!: string;

  @ApiPropertyOptional()
  drugNameAr?: string;

  @ApiPropertyOptional()
  genericName?: string;

  @ApiProperty()
  dosage!: string;

  @ApiProperty()
  route!: string;

  @ApiProperty()
  frequency!: string;

  @ApiPropertyOptional()
  duration?: string;

  @ApiPropertyOptional()
  quantity?: string;

  @ApiProperty()
  refills!: number;

  @ApiPropertyOptional()
  instructions?: string;

  @ApiPropertyOptional()
  instructionsAr?: string;

  @ApiProperty({ enum: PrescriptionStatus })
  status!: PrescriptionStatus;

  @ApiProperty()
  prescribedBy!: string;

  @ApiProperty()
  prescribedAt!: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
