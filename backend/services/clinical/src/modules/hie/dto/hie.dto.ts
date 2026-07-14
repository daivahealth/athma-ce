import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CaptureMethod } from '@zeal/shared-types';

/**
 * Create a consent request authorising an external-record fetch for a patient.
 * Backed by the existing consent service using the `hie_participation` type.
 */
export class CreateHieConsentRequestDto {
  @ApiProperty({ description: 'Patient the consent is captured for' })
  @IsUUID()
  patientId!: string;

  @ApiPropertyOptional({
    description: 'Purpose of the external-record fetch',
    default: 'Fetch external health records via HIE',
  })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiPropertyOptional({ description: 'How consent was captured' })
  @IsOptional()
  @IsString()
  captureMethod?: CaptureMethod;

  @ApiPropertyOptional({
    description: 'External patient identifier in the target HIE (ABHA / EID / MRN)',
  })
  @IsOptional()
  @IsString()
  patientReference?: string;

  @ApiPropertyOptional({ description: 'Free-form audit metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

/**
 * Consent-gated request to fetch external records via the configured provider.
 */
export class FetchExternalRecordsDto {
  @ApiProperty({ description: 'Patient to fetch external records for' })
  @IsUUID()
  patientId!: string;

  @ApiPropertyOptional({
    description: 'Record categories to fetch; omit for all available',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recordTypes?: string[];

  @ApiPropertyOptional({
    description: 'External patient identifier in the target HIE (ABHA / EID / MRN)',
  })
  @IsOptional()
  @IsString()
  patientReference?: string;

  @ApiPropertyOptional({
    description:
      'Demo/sandbox only: force the mock provider to fail so the retry path can be exercised',
  })
  @IsOptional()
  @IsBoolean()
  simulateFailure?: boolean;
}
