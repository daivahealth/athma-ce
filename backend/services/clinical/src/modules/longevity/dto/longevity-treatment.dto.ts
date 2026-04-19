import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsBoolean,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum LongevityTreatmentStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ADVERSE_EVENT = 'ADVERSE_EVENT',
}

export class CreateLongevityProtocolDto {
  @ApiProperty({ description: 'Protocol code' })
  @IsString()
  code!: string;

  @ApiProperty({ description: 'Protocol name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Protocol type (iv_therapy, hormone_optimization, nad_plus, etc.)' })
  @IsString()
  protocolType!: string;

  @ApiProperty({ description: 'Administration route (iv, im, sc, topical, oral)' })
  @IsString()
  administrationRoute!: string;

  @ApiPropertyOptional({ description: 'Typical duration in minutes' })
  @IsOptional()
  @IsInt()
  typicalDuration?: number;

  @ApiPropertyOptional({ description: 'Frequency recommendation' })
  @IsOptional()
  @IsString()
  frequencyRecommendation?: string;

  @ApiProperty({ description: 'Components/ingredients' })
  @IsArray()
  components!: Array<{
    name: string;
    dose: number;
    unit: string;
    optional?: boolean;
  }>;

  @ApiPropertyOptional({ description: 'Contraindications' })
  @IsOptional()
  @IsObject()
  contraindications?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Pre-requirements (labs, assessments)' })
  @IsOptional()
  @IsObject()
  preRequirements?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Monitoring protocol' })
  @IsOptional()
  @IsObject()
  monitoringProtocol?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Consent required' })
  @IsOptional()
  @IsBoolean()
  consentRequired?: boolean;

  @ApiPropertyOptional({ description: 'Consent template ID' })
  @IsOptional()
  @IsUUID("all")
  consentTemplateId?: string;

  @ApiPropertyOptional({ description: 'Estimated cost' })
  @IsOptional()
  @IsNumber()
  estimatedCost?: number;
}

export class UpdateLongevityProtocolDto {
  @ApiPropertyOptional({ description: 'Protocol name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Components' })
  @IsOptional()
  @IsArray()
  components?: Array<Record<string, any>>;

  @ApiPropertyOptional({ description: 'Contraindications' })
  @IsOptional()
  @IsObject()
  contraindications?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Pre-requirements' })
  @IsOptional()
  @IsObject()
  preRequirements?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ScheduleTreatmentDto {
  @ApiProperty({ description: 'Facility ID' })
  @IsUUID("all")
  facilityId!: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("all")
  patientId!: string;

  @ApiProperty({ description: 'Protocol ID' })
  @IsUUID("all")
  protocolId!: string;

  @ApiPropertyOptional({ description: 'Encounter ID' })
  @IsOptional()
  @IsUUID("all")
  encounterId?: string;

  @ApiProperty({ description: 'Scheduled date/time' })
  @IsDateString()
  scheduledAt!: string;

  @ApiPropertyOptional({ description: 'Session in series' })
  @IsOptional()
  @IsInt()
  sessionInSeries?: number;

  @ApiPropertyOptional({ description: 'Provider ID' })
  @IsOptional()
  @IsUUID("all")
  providerId?: string;

  @ApiPropertyOptional({ description: 'Nurse ID' })
  @IsOptional()
  @IsUUID("all")
  nurseId?: string;
}

export class StartTreatmentDto {
  @ApiPropertyOptional({ description: 'Pre-treatment vitals' })
  @IsOptional()
  @IsObject()
  preVitals?: {
    bp?: string;
    hr?: number;
    temp?: number;
    spo2?: number;
    weight?: number;
  };

  @ApiPropertyOptional({ description: 'Pre-treatment notes' })
  @IsOptional()
  @IsString()
  preTreatmentNotes?: string;

  @ApiPropertyOptional({ description: 'Consent obtained' })
  @IsOptional()
  @IsBoolean()
  consentObtained?: boolean;

  @ApiPropertyOptional({ description: 'Consent ID' })
  @IsOptional()
  @IsUUID("all")
  consentId?: string;
}

export class CompleteTreatmentDto {
  @ApiPropertyOptional({ description: 'Actual components administered' })
  @IsOptional()
  @IsObject()
  actualComponents?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Lot numbers' })
  @IsOptional()
  @IsObject()
  lotNumbers?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Duration in minutes' })
  @IsOptional()
  @IsInt()
  duration?: number;

  @ApiPropertyOptional({ description: 'Post-treatment vitals' })
  @IsOptional()
  @IsObject()
  postVitals?: {
    bp?: string;
    hr?: number;
    temp?: number;
    spo2?: number;
  };

  @ApiPropertyOptional({ description: 'Immediate reactions' })
  @IsOptional()
  @IsString()
  immediateReactions?: string;

  @ApiPropertyOptional({ description: 'Post-treatment notes' })
  @IsOptional()
  @IsString()
  postTreatmentNotes?: string;

  @ApiPropertyOptional({ description: 'Adverse event occurred' })
  @IsOptional()
  @IsBoolean()
  adverseEventOccurred?: boolean;

  @ApiPropertyOptional({ description: 'Adverse event details' })
  @IsOptional()
  @IsString()
  adverseEventDetails?: string;
}

export class LongevityProtocolResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  protocolType!: string;

  @ApiProperty()
  administrationRoute!: string;

  @ApiPropertyOptional()
  typicalDuration?: number;

  @ApiPropertyOptional()
  frequencyRecommendation?: string;

  @ApiProperty()
  components!: Array<Record<string, any>>;

  @ApiPropertyOptional()
  contraindications?: Record<string, any>;

  @ApiPropertyOptional()
  preRequirements?: Record<string, any>;

  @ApiProperty()
  consentRequired!: boolean;

  @ApiPropertyOptional()
  estimatedCost?: number;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class LongevityTreatmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  facilityId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  protocolId!: string;

  @ApiPropertyOptional()
  encounterId?: string;

  @ApiProperty()
  treatmentNumber!: string;

  @ApiProperty()
  sessionInSeries!: number;

  @ApiProperty({ enum: LongevityTreatmentStatus })
  status!: LongevityTreatmentStatus;

  @ApiPropertyOptional()
  scheduledAt?: Date;

  @ApiPropertyOptional()
  startedAt?: Date;

  @ApiPropertyOptional()
  completedAt?: Date;

  @ApiPropertyOptional()
  providerId?: string;

  @ApiPropertyOptional()
  nurseId?: string;

  @ApiPropertyOptional()
  preVitals?: Record<string, any>;

  @ApiPropertyOptional()
  postVitals?: Record<string, any>;

  @ApiPropertyOptional()
  actualComponents?: Record<string, any>;

  @ApiPropertyOptional()
  duration?: number;

  @ApiProperty()
  consentObtained!: boolean;

  @ApiProperty()
  adverseEventOccurred!: boolean;

  @ApiPropertyOptional()
  adverseEventDetails?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
