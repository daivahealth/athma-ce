import { IsString, IsOptional, IsNotEmpty, IsBoolean, IsInt, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateImagingStudyDto {
  @ApiPropertyOptional({ description: 'Tenant ID (null for global study)' })
  @IsString()
  @IsOptional()
  tenantId?: string;

  @ApiProperty({ description: 'Study name' })
  @IsString()
  @IsNotEmpty()
  studyName!: string;

  @ApiPropertyOptional({ description: 'CPT code for billing' })
  @IsString()
  @IsOptional()
  cptCode?: string;

  @ApiPropertyOptional({ description: 'Facility-specific radiology code' })
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

  @ApiProperty({ description: 'Modality (e.g., X-ray, CT, MRI, Ultrasound)' })
  @IsString()
  @IsNotEmpty()
  modality!: string;

  @ApiProperty({ description: 'Body part (e.g., chest, abdomen, head)' })
  @IsString()
  @IsNotEmpty()
  bodyPart!: string;

  @ApiPropertyOptional({ description: 'Study category (e.g., diagnostic, screening, interventional)' })
  @IsString()
  @IsOptional()
  studyCategory?: string;

  @ApiPropertyOptional({ description: 'Contrast required', default: false })
  @IsBoolean()
  @IsOptional()
  contrastRequired?: boolean;

  @ApiPropertyOptional({ description: 'Contrast type (e.g., IV, oral, rectal)' })
  @IsString()
  @IsOptional()
  contrastType?: string;

  @ApiPropertyOptional({ description: 'Preparation instructions' })
  @IsString()
  @IsOptional()
  preparationInstructions?: string;

  @ApiPropertyOptional({ description: 'Positioning instructions' })
  @IsString()
  @IsOptional()
  positioningInstructions?: string;

  @ApiPropertyOptional({ description: 'Contraindications', type: [String] })
  @IsArray()
  @IsOptional()
  contraindications?: string[];

  @ApiPropertyOptional({ description: 'Radiation dose' })
  @IsString()
  @IsOptional()
  radiationDose?: string;

  @ApiPropertyOptional({ description: 'Estimated duration in minutes' })
  @IsInt()
  @IsOptional()
  estimatedDurationMinutes?: number;

  @ApiPropertyOptional({ description: 'Facility requirements (e.g., hospital, clinic, imaging center)' })
  @IsString()
  @IsOptional()
  facilityRequirements?: string;

  @ApiPropertyOptional({ description: 'Equipment requirements' })
  @IsString()
  @IsOptional()
  equipmentRequirements?: string;

  @ApiPropertyOptional({ description: 'Radiologist required', default: true })
  @IsBoolean()
  @IsOptional()
  radiologistRequired?: boolean;

  @ApiPropertyOptional({ description: 'Is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateImagingStudyDto extends PartialType(CreateImagingStudyDto) {}

export interface ImagingStudyResponseDto {
  id: string;
  tenantId?: string | null;
  studyName: string;
  cptCode?: string | null;
  localCode?: string | null;
  billingCode?: string | null;
  billingCodeType?: string | null;
  billingDescription?: string | null;
  modality: string;
  bodyPart: string;
  studyCategory?: string | null;
  contrastRequired: boolean;
  contrastType?: string | null;
  preparationInstructions?: string | null;
  positioningInstructions?: string | null;
  contraindications: string[];
  radiationDose?: string | null;
  estimatedDurationMinutes?: number | null;
  facilityRequirements?: string | null;
  equipmentRequirements?: string | null;
  radiologistRequired: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
