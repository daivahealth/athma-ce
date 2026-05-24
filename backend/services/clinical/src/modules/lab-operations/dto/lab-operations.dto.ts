import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum LabSpecimenStatus {
  PENDING_COLLECTION = 'pending_collection',
  COLLECTED = 'collected',
  RECEIVED = 'received',
  ACCESSIONED = 'accessioned',
  REJECTED = 'rejected',
  PROCESSING = 'processing',
  RESULT_ENTERED = 'result_entered',
  COMPLETED = 'completed',
}

export enum LabSpecimenEventType {
  LABEL_PREPARED = 'label_prepared',
  LABEL_PRINT_REQUESTED = 'label_print_requested',
  COLLECTED = 'collected',
  RECEIVED = 'received',
  ACCESSIONED = 'accessioned',
  REJECTED = 'rejected',
  PROCESSING_STARTED = 'processing_started',
  RESULT_ENTRY_STARTED = 'result_entry_started',
  RESULT_ENTERED = 'result_entered',
}

export enum LabAccessionStatus {
  RECEIVED = 'received',
  ACCESSIONED = 'accessioned',
  REJECTED = 'rejected',
  CLOSED = 'closed',
}

export enum LabProcessingRunType {
  MANUAL = 'manual',
  ANALYZER = 'analyzer',
}

export enum LabProcessingStatus {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum LabWorklistStage {
  COLLECTION = 'collection',
  RECEIVING = 'receiving',
  ACCESSIONING = 'accessioning',
  PROCESSING = 'processing',
  RESULT_ENTRY = 'result-entry',
}

export class PrepareLabSpecimenDto {
  @ApiProperty({ description: 'Clinical order ID' })
  @IsUUID('4')
  orderId!: string;

  @ApiProperty({ description: 'Ordered lab test IDs mapped to this specimen', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  labOrderTestIds!: string[];

  @ApiPropertyOptional({ description: 'Specimen type' })
  @IsOptional()
  @IsString()
  specimenType?: string;

  @ApiPropertyOptional({ description: 'Container type' })
  @IsOptional()
  @IsString()
  containerType?: string;

  @ApiPropertyOptional({ description: 'Collection site' })
  @IsOptional()
  @IsString()
  collectionSite?: string;

  @ApiPropertyOptional({ description: 'Barcode affixed at collection time' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ description: 'Preparation notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CollectLabSpecimenDto {
  @ApiPropertyOptional({ description: 'Prepared specimen ID to finalize as collected' })
  @IsOptional()
  @IsUUID('4')
  specimenId?: string;

  @ApiPropertyOptional({ description: 'Clinical order ID for manual collection fallback' })
  @IsOptional()
  @IsUUID('4')
  orderId?: string;

  @ApiPropertyOptional({ description: 'Ordered lab test IDs mapped to this specimen', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  labOrderTestIds?: string[];

  @ApiPropertyOptional({ description: 'Specimen type' })
  @IsOptional()
  @IsString()
  specimenType?: string;

  @ApiPropertyOptional({ description: 'Container type' })
  @IsOptional()
  @IsString()
  containerType?: string;

  @ApiPropertyOptional({ description: 'Collection site' })
  @IsOptional()
  @IsString()
  collectionSite?: string;

  @ApiPropertyOptional({ description: 'Barcode affixed at collection time' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ description: 'Collection timestamp' })
  @IsOptional()
  @IsDateString()
  collectedAt?: string;

  @ApiPropertyOptional({ description: 'Collector user/staff ID' })
  @IsOptional()
  @IsUUID('4')
  collectedBy?: string;

  @ApiPropertyOptional({ description: 'Collection notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class PrintLabSpecimenLabelDto {
  @ApiPropertyOptional({ description: 'Optional print request note' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReceiveLabSpecimenDto {
  @ApiPropertyOptional({ description: 'Received timestamp' })
  @IsOptional()
  @IsDateString()
  receivedAt?: string;

  @ApiPropertyOptional({ description: 'Receiver user/staff ID' })
  @IsOptional()
  @IsUUID('4')
  receivedBy?: string;

  @ApiPropertyOptional({ description: 'Receiving location' })
  @IsOptional()
  @IsString()
  receivingLocation?: string;

  @ApiPropertyOptional({ description: 'Receiving notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AccessionLabSpecimenDto {
  @ApiPropertyOptional({ description: 'Accession number. Auto-generated if omitted.' })
  @IsOptional()
  @IsString()
  accessionNumber?: string;

  @ApiPropertyOptional({ description: 'Accession timestamp' })
  @IsOptional()
  @IsDateString()
  accessionedAt?: string;

  @ApiPropertyOptional({ description: 'Accessioning user/staff ID' })
  @IsOptional()
  @IsUUID('4')
  accessionedBy?: string;

  @ApiPropertyOptional({ description: 'Accession notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RejectLabSpecimenDto {
  @ApiProperty({ description: 'Rejection reason' })
  @IsString()
  rejectionReason!: string;

  @ApiPropertyOptional({ description: 'Rejection notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateLabProcessingRunDto {
  @ApiProperty({ description: 'Specimen ID' })
  @IsUUID('4')
  specimenId!: string;

  @ApiProperty({ description: 'Lab order test ID' })
  @IsUUID('4')
  labOrderTestId!: string;

  @ApiPropertyOptional({ description: 'Run type', enum: LabProcessingRunType, default: LabProcessingRunType.MANUAL })
  @IsOptional()
  @IsEnum(LabProcessingRunType)
  runType?: LabProcessingRunType;

  @ApiPropertyOptional({ description: 'Instrument code' })
  @IsOptional()
  @IsString()
  instrumentCode?: string;

  @ApiPropertyOptional({ description: 'Instrument run ID' })
  @IsOptional()
  @IsString()
  instrumentRunId?: string;

  @ApiPropertyOptional({ description: 'Processing status', enum: LabProcessingStatus, default: LabProcessingStatus.PROCESSING })
  @IsOptional()
  @IsEnum(LabProcessingStatus)
  status?: LabProcessingStatus;

  @ApiPropertyOptional({ description: 'Analyzer or processing payload' })
  @IsOptional()
  @IsObject()
  rawPayload?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Processing timestamp' })
  @IsOptional()
  @IsDateString()
  processedAt?: string;

  @ApiPropertyOptional({ description: 'Operator user/staff ID' })
  @IsOptional()
  @IsUUID('4')
  processedBy?: string;
}

export class StartLabResultEntryDto {
  @ApiProperty({ description: 'Lab order test ID' })
  @IsUUID('4')
  labOrderTestId!: string;

  @ApiPropertyOptional({ description: 'Specimen ID. If omitted, latest linked specimen is used.' })
  @IsOptional()
  @IsUUID('4')
  specimenId?: string;
}

export class CompleteLabResultEntryDto {
  @ApiProperty({ description: 'Lab order test ID' })
  @IsUUID('4')
  labOrderTestId!: string;

  @ApiPropertyOptional({ description: 'Specimen ID' })
  @IsOptional()
  @IsUUID('4')
  specimenId?: string;

  @ApiPropertyOptional({ description: 'Completion note' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class LabWorklistQueryDto {
  @ApiPropertyOptional({ description: 'Encounter filter' })
  @IsOptional()
  @IsUUID('4')
  encounterId?: string;

  @ApiPropertyOptional({ description: 'Patient filter' })
  @IsOptional()
  @IsUUID('4')
  patientId?: string;
}

export class LabResultEntryContextResponseDto {
  @ApiProperty({ description: 'Draft or active report ID' })
  @IsString()
  reportId!: string;
}
