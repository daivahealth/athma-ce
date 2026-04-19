import {
    IsString,
    IsUUID,
    IsOptional,
    IsEnum,
    IsInt,
    IsNumber,
    IsObject,
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

    @ApiPropertyOptional({ description: 'Protocol description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Protocol type (iv_therapy, nad_plus, etc.)' })
    @IsString()
    protocolType!: string;

    @ApiProperty({ description: 'Administration route (iv, im, sc, etc.)' })
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

    @ApiProperty({ description: 'Components/Ingredients' })
    @IsArray()
    components!: Array<{
        name: string;
        dose: string;
        unit: string;
        optional?: boolean;
    }>;

    @ApiPropertyOptional({ description: 'Contraindications' })
    @IsOptional()
    @IsObject()
    contraindications?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Pre-requirements' })
    @IsOptional()
    @IsObject()
    preRequirements?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Monitoring protocol' })
    @IsOptional()
    @IsObject()
    monitoringProtocol?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Consent required' })
    @IsOptional()
    consentRequired?: boolean;

    @ApiPropertyOptional({ description: 'Consent template ID' })
    @IsOptional()
    @IsUUID("loose" as any)
    consentTemplateId?: string;

    @ApiPropertyOptional({ description: 'Estimated cost' })
    @IsOptional()
    @IsNumber()
    estimatedCost?: number;
}

export class CreateLongevityTreatmentDto {
    @ApiProperty({ description: 'Facility ID' })
    @IsUUID("loose" as any)
    facilityId!: string;

    @ApiProperty({ description: 'Patient ID' })
    @IsUUID("loose" as any)
    patientId!: string;

    @ApiProperty({ description: 'Protocol ID' })
    @IsUUID("loose" as any)
    protocolId!: string;

    @ApiPropertyOptional({ description: 'Encounter ID' })
    @IsOptional()
    @IsUUID("loose" as any)
    encounterId?: string;

    @ApiPropertyOptional({ description: 'Scheduled date/time' })
    @IsOptional()
    @IsDateString()
    scheduledAt?: string;

    @ApiPropertyOptional({ description: 'Provider ID' })
    @IsOptional()
    @IsUUID("loose" as any)
    providerId?: string;

    @ApiPropertyOptional({ description: 'Pre-treatment notes' })
    @IsOptional()
    @IsString()
    preTreatmentNotes?: string;
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
    components!: any;

    @ApiPropertyOptional()
    contraindications?: any;

    @ApiPropertyOptional()
    preRequirements?: any;

    @ApiPropertyOptional()
    monitoringProtocol?: any;

    @ApiProperty()
    consentRequired!: boolean;

    @ApiPropertyOptional()
    consentTemplateId?: string;

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
    preVitals?: any;

    @ApiPropertyOptional()
    preTreatmentNotes?: string;

    @ApiPropertyOptional()
    actualComponents?: any;

    @ApiPropertyOptional()
    treatmentNotes?: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}
