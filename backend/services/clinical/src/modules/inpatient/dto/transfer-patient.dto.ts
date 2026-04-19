/**
 * DTO for transferring a patient to a new bed/ward
 */

import {
  IsUUID,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum TransferType {
  CLINICAL_NEED = 'clinical_need',
  BED_AVAILABILITY = 'bed_availability',
  PATIENT_REQUEST = 'patient_request',
  INFECTION_CONTROL = 'infection_control',
}

export class TransferPatientDto {
  @IsUUID("loose" as any)
  toWardId!: string;

  @IsUUID("loose" as any)
  toBedId!: string;

  @IsString()
  transferReason!: string;

  @IsEnum(TransferType)
  transferType!: TransferType;

  @IsString()
  @IsOptional()
  notes?: string;
}
