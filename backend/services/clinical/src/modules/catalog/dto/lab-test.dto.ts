import { IsString, IsOptional, IsNotEmpty, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateLabTestDto {
  @ApiPropertyOptional({ description: 'Tenant ID (null for global test)' })
  @IsString()
  @IsOptional()
  tenantId?: string;

  @ApiProperty({ description: 'Test name' })
  @IsString()
  @IsNotEmpty()
  testName!: string;

  @ApiProperty({ description: 'LOINC code for test identification' })
  @IsString()
  @IsNotEmpty()
  loincCode!: string;

  @ApiPropertyOptional({ description: 'CPT code for billing' })
  @IsString()
  @IsOptional()
  cptCode?: string;

  @ApiPropertyOptional({ description: 'Facility-specific code' })
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

  @ApiProperty({ description: 'Test category (e.g., hematology, chemistry, microbiology)' })
  @IsString()
  @IsNotEmpty()
  testCategory!: string;

  @ApiPropertyOptional({ description: 'Test subcategory (e.g., CBC, lipid panel)' })
  @IsString()
  @IsOptional()
  testSubcategory?: string;

  @ApiProperty({ description: 'Specimen type (e.g., blood, urine, stool, sputum)' })
  @IsString()
  @IsNotEmpty()
  specimenType!: string;

  @ApiPropertyOptional({ description: 'Collection method (e.g., venipuncture, fingerstick)' })
  @IsString()
  @IsOptional()
  collectionMethod?: string;

  @ApiPropertyOptional({ description: 'Fasting required', default: false })
  @IsBoolean()
  @IsOptional()
  fastingRequired?: boolean;

  @ApiPropertyOptional({ description: 'Fasting duration in hours' })
  @IsInt()
  @IsOptional()
  fastingDurationHours?: number;

  @ApiPropertyOptional({ description: 'Preparation instructions' })
  @IsString()
  @IsOptional()
  preparationInstructions?: string;

  @ApiPropertyOptional({ description: 'Normal range for males' })
  @IsString()
  @IsOptional()
  normalRangeMale?: string;

  @ApiPropertyOptional({ description: 'Normal range for females' })
  @IsString()
  @IsOptional()
  normalRangeFemale?: string;

  @ApiPropertyOptional({ description: 'Normal range for pediatric patients' })
  @IsString()
  @IsOptional()
  normalRangePediatric?: string;

  @ApiPropertyOptional({ description: 'Units of measurement' })
  @IsString()
  @IsOptional()
  units?: string;

  @ApiPropertyOptional({ description: 'Test methodology' })
  @IsString()
  @IsOptional()
  methodology?: string;

  @ApiPropertyOptional({ description: 'Turnaround time in hours' })
  @IsInt()
  @IsOptional()
  turnaroundTimeHours?: number;

  @ApiPropertyOptional({ description: 'Reporting structure: structured, narrative, or hybrid' })
  @IsString()
  @IsOptional()
  reportStyle?: string;

  @ApiPropertyOptional({ description: 'Lab discipline: hematology, chemistry, histopathology, cytology, microbiology, etc.' })
  @IsString()
  @IsOptional()
  labDiscipline?: string;

  @ApiPropertyOptional({ description: 'Reference lab name' })
  @IsString()
  @IsOptional()
  referenceLab?: string;

  @ApiPropertyOptional({ description: 'Is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateLabTestDto extends PartialType(CreateLabTestDto) {}

export interface LabTestResponseDto {
  id: string;
  tenantId?: string | null;
  testName: string;
  loincCode: string;
  cptCode?: string | null;
  localCode?: string | null;
  billingCode?: string | null;
  billingCodeType?: string | null;
  billingDescription?: string | null;
  testCategory: string;
  testSubcategory?: string | null;
  specimenType: string;
  collectionMethod?: string | null;
  fastingRequired: boolean;
  fastingDurationHours?: number | null;
  preparationInstructions?: string | null;
  normalRangeMale?: string | null;
  normalRangeFemale?: string | null;
  normalRangePediatric?: string | null;
  units?: string | null;
  methodology?: string | null;
  turnaroundTimeHours?: number | null;
  reportStyle: string;
  labDiscipline?: string | null;
  referenceLab?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
