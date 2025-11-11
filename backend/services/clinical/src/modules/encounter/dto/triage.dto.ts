import {
  IsString,
  IsUUID,
  IsInt,
  IsOptional,
  IsObject,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new triage record
 */
export class CreateTriageDto {
  @ApiProperty({
    description: 'Encounter ID this triage is associated with',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  encounterId!: string;

  @ApiProperty({
    description: 'Patient ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  patientId!: string;

  @ApiProperty({
    description: 'Staff ID who performed the triage',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  triageStaffId!: string;

  @ApiProperty({
    description: 'Triage priority level (1=Critical, 2=Emergency, 3=Urgent, 4=Semi-Urgent, 5=Non-Urgent)',
    example: 3,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  triageLevel!: number;

  @ApiProperty({
    description: 'Chief complaints and History of Present Illness (HPI)',
    example: 'Patient presents with acute chest pain radiating to left arm, started 2 hours ago...',
  })
  @IsString()
  chiefComplaintsAndHPI!: string;

  @ApiPropertyOptional({
    description: 'Vital signs captured during triage',
    example: {
      temperature: 37.2,
      temperatureUnit: 'celsius',
      heartRate: 85,
      systolicBP: 130,
      diastolicBP: 85,
      respiratoryRate: 18,
      oxygenSaturation: 97,
      weight: 70,
      weightUnit: 'kg',
      height: 175,
      heightUnit: 'cm',
      bmi: 22.9,
    },
  })
  @IsOptional()
  @IsObject()
  vitalSigns?: {
    temperature?: number;
    temperatureUnit?: 'celsius' | 'fahrenheit';
    heartRate?: number;
    systolicBP?: number;
    diastolicBP?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    weightUnit?: 'kg' | 'lbs';
    height?: number;
    heightUnit?: 'cm' | 'in';
    bmi?: number;
    bloodGlucose?: number;
    bloodGlucoseUnit?: 'mg/dL' | 'mmol/L';
    headCircumference?: number;
  };

  @ApiPropertyOptional({
    description: 'Pain score (0-10 scale)',
    example: 7,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  painScore?: number;

  @ApiPropertyOptional({
    description: 'Patient allergies',
    example: [
      { allergen: 'Penicillin', reaction: 'Rash', severity: 'Moderate' },
      { allergen: 'Peanuts', reaction: 'Anaphylaxis', severity: 'Severe' },
    ],
  })
  @IsOptional()
  @IsArray()
  allergies?: Array<{
    allergen: string;
    reaction?: string;
    severity?: string;
  }>;

  @ApiPropertyOptional({
    description: 'Current medications patient is taking',
    example: [
      { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    ],
  })
  @IsOptional()
  @IsArray()
  currentMedications?: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
  }>;

  @ApiPropertyOptional({
    description: 'Additional triage notes and observations',
    example: 'Patient appears anxious, diaphoretic. Alert and oriented x3.',
  })
  @IsOptional()
  @IsString()
  triageNotes?: string;
}

/**
 * DTO for updating an existing triage record
 */
export class UpdateTriageDto {
  @ApiPropertyOptional({
    description: 'Staff ID who performed the triage',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsOptional()
  @IsUUID()
  triageStaffId?: string;

  @ApiPropertyOptional({
    description: 'Triage priority level (1=Critical, 2=Emergency, 3=Urgent, 4=Semi-Urgent, 5=Non-Urgent)',
    example: 3,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  triageLevel?: number;

  @ApiPropertyOptional({
    description: 'Chief complaints and History of Present Illness (HPI)',
    example: 'Patient presents with acute chest pain radiating to left arm, started 2 hours ago...',
  })
  @IsOptional()
  @IsString()
  chiefComplaintsAndHPI?: string;

  @ApiPropertyOptional({
    description: 'Vital signs captured during triage',
    example: {
      temperature: 37.2,
      temperatureUnit: 'celsius',
      heartRate: 85,
      systolicBP: 130,
      diastolicBP: 85,
      respiratoryRate: 18,
      oxygenSaturation: 97,
      weight: 70,
      weightUnit: 'kg',
      height: 175,
      heightUnit: 'cm',
      bmi: 22.9,
    },
  })
  @IsOptional()
  @IsObject()
  vitalSigns?: {
    temperature?: number;
    temperatureUnit?: 'celsius' | 'fahrenheit';
    heartRate?: number;
    systolicBP?: number;
    diastolicBP?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    weightUnit?: 'kg' | 'lbs';
    height?: number;
    heightUnit?: 'cm' | 'in';
    bmi?: number;
    bloodGlucose?: number;
    bloodGlucoseUnit?: 'mg/dL' | 'mmol/L';
    headCircumference?: number;
  };

  @ApiPropertyOptional({
    description: 'Pain score (0-10 scale)',
    example: 7,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  painScore?: number;

  @ApiPropertyOptional({
    description: 'Patient allergies',
    example: [
      { allergen: 'Penicillin', reaction: 'Rash', severity: 'Moderate' },
      { allergen: 'Peanuts', reaction: 'Anaphylaxis', severity: 'Severe' },
    ],
  })
  @IsOptional()
  @IsArray()
  allergies?: Array<{
    allergen: string;
    reaction?: string;
    severity?: string;
  }>;

  @ApiPropertyOptional({
    description: 'Current medications patient is taking',
    example: [
      { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    ],
  })
  @IsOptional()
  @IsArray()
  currentMedications?: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
  }>;

  @ApiPropertyOptional({
    description: 'Additional triage notes and observations',
    example: 'Patient appears anxious, diaphoretic. Alert and oriented x3.',
  })
  @IsOptional()
  @IsString()
  triageNotes?: string;
}

/**
 * Response DTO for triage data
 */
export class TriageResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  encounterId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  triageStaffId!: string;

  @ApiProperty()
  triageLevel!: number;

  @ApiProperty()
  chiefComplaintsAndHPI!: string;

  @ApiPropertyOptional()
  vitalSigns?: any;

  @ApiPropertyOptional()
  painScore?: number;

  @ApiPropertyOptional()
  allergies?: any;

  @ApiPropertyOptional()
  currentMedications?: any;

  @ApiPropertyOptional()
  triageNotes?: string;

  @ApiProperty()
  triageTime!: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
