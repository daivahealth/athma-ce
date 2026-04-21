import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DrugCodeSystem } from './prescription.dto';

// ─── Prescription item (drug line) ───────────────────────────────────────────

export class PrescriptionItemDto {
  @ApiProperty({ description: 'Drug code (NDC, RxNorm, or local formulary code)' })
  @IsString()
  drugCode!: string;

  @ApiPropertyOptional({ description: 'Code system', enum: DrugCodeSystem, default: DrugCodeSystem.NDC })
  @IsOptional()
  @IsEnum(DrugCodeSystem)
  codeSystem?: DrugCodeSystem;

  @ApiProperty({ description: 'Drug name (English)' })
  @IsString()
  drugName!: string;

  @ApiPropertyOptional({ description: 'Drug name (Arabic)' })
  @IsOptional()
  @IsString()
  drugNameAr?: string;

  @ApiPropertyOptional({ description: 'Generic name' })
  @IsOptional()
  @IsString()
  genericName?: string;

  @ApiProperty({ description: 'Dosage e.g. "500mg"' })
  @IsString()
  dosage!: string;

  @ApiProperty({ description: 'Route e.g. oral, IV, topical' })
  @IsString()
  route!: string;

  @ApiProperty({ description: 'Frequency e.g. "twice daily"' })
  @IsString()
  frequency!: string;

  @ApiPropertyOptional({ description: 'Duration e.g. "7 days"' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ description: 'Quantity e.g. "14 tablets"' })
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiPropertyOptional({ description: 'Number of refills', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  refills?: number;

  @ApiPropertyOptional({ description: 'Patient instructions (English)' })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional({ description: 'Patient instructions (Arabic)' })
  @IsOptional()
  @IsString()
  instructionsAr?: string;
}

// ─── Create prescription header + drug lines ─────────────────────────────────

export class CreatePrescriptionWithItemsDto {
  @ApiProperty({ description: 'Encounter ID' })
  @IsUUID('loose' as any)
  encounterId!: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID('loose' as any)
  patientId!: string;

  @ApiProperty({ description: 'Staff ID who is prescribing' })
  @IsUUID('loose' as any)
  prescribedBy!: string;

  @ApiPropertyOptional({ description: 'Display name of the prescribing staff member' })
  @IsOptional()
  @IsString()
  prescribedByName?: string;

  @ApiPropertyOptional({ description: 'Clinical notes for this prescription' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Drug line items (at least one required)',
    type: [PrescriptionItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items!: PrescriptionItemDto[];
}

// ─── Amend prescription ───────────────────────────────────────────────────────

export class AmendPrescriptionDto {
  @ApiPropertyOptional({ description: 'Updated notes for the amended prescription' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Updated drug line items (replaces all items on the new version). Omit to copy from original.',
    type: [PrescriptionItemDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items?: PrescriptionItemDto[];
}

// ─── Cancel prescription ──────────────────────────────────────────────────────

export class CancelPrescriptionDto {
  @ApiPropertyOptional({ description: 'Reason for cancellation' })
  @IsOptional()
  @IsString()
  reason?: string;
}

// ─── Response shapes ──────────────────────────────────────────────────────────

export class PrescriptionHeaderResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() tenantId!: string;
  @ApiProperty() prescriptionNumber!: string;
  @ApiProperty() version!: number;
  @ApiPropertyOptional() parentId?: string | null;
  @ApiProperty() encounterId!: string;
  @ApiProperty() patientId!: string;
  @ApiProperty() status!: string;
  @ApiProperty() prescribedBy!: string;
  @ApiPropertyOptional() prescribedByName?: string | null;
  @ApiProperty() prescribedAt!: Date;
  @ApiPropertyOptional() notes?: string | null;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;

  // Flattened patient context (from Encounter → Patient join)
  @ApiPropertyOptional() mrn?: string | null;
  @ApiPropertyOptional() patientDisplayName?: string | null;
  @ApiPropertyOptional() dateOfBirth?: Date | null;
  @ApiPropertyOptional() gender?: string | null;
  @ApiPropertyOptional() encounterNumber?: string | null;
  @ApiPropertyOptional() encounterType?: string | null;

  @ApiProperty({ description: 'Drug line items' }) items!: any[];
}
