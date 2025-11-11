import { IsString, IsUUID, IsOptional, IsEnum, IsObject, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Enum for order type
export enum OrderType {
  LAB = 'lab',
  IMAGING = 'imaging',
  PROCEDURE = 'procedure',
}

// Enum for order priority
export enum OrderPriority {
  STAT = 'stat',
  URGENT = 'urgent',
  ROUTINE = 'routine',
}

// Enum for order status
export enum OrderStatus {
  ORDERED = 'ordered',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Enum for result status
export enum ResultStatus {
  PENDING = 'pending',
  PRELIMINARY = 'preliminary',
  FINAL = 'final',
  AMENDED = 'amended',
}

// Enum for code system
export enum CodeSystem {
  LOINC = 'LOINC',
  CPT = 'CPT',
  SNOMED = 'SNOMED',
}

// DTO for creating a clinical order
export class CreateClinicalOrderDto {
  @ApiProperty({ description: 'Encounter ID' })
  @IsUUID()
  encounterId!: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ description: 'Order type', enum: OrderType })
  @IsEnum(OrderType)
  orderType!: OrderType;

  @ApiProperty({ description: 'Order code (LOINC, CPT, SNOMED)' })
  @IsString()
  orderCode!: string;

  @ApiProperty({ description: 'Code system', enum: CodeSystem })
  @IsEnum(CodeSystem)
  codeSystem!: CodeSystem;

  @ApiProperty({ description: 'Order name in English' })
  @IsString()
  orderName!: string;

  @ApiPropertyOptional({ description: 'Order name in Arabic' })
  @IsOptional()
  @IsString()
  orderNameAr?: string;

  @ApiPropertyOptional({ description: 'Order priority', enum: OrderPriority, default: OrderPriority.ROUTINE })
  @IsOptional()
  @IsEnum(OrderPriority)
  priority?: OrderPriority;

  @ApiPropertyOptional({ description: 'Clinical indication' })
  @IsOptional()
  @IsString()
  clinicalIndication?: string;

  @ApiPropertyOptional({ description: 'Special instructions' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiProperty({ description: 'Staff ID who ordered' })
  @IsUUID()
  orderedBy!: string;
}

// DTO for updating a clinical order
export class UpdateClinicalOrderDto {
  @ApiPropertyOptional({ description: 'Order priority', enum: OrderPriority })
  @IsOptional()
  @IsEnum(OrderPriority)
  priority?: OrderPriority;

  @ApiPropertyOptional({ description: 'Order status', enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ description: 'Clinical indication' })
  @IsOptional()
  @IsString()
  clinicalIndication?: string;

  @ApiPropertyOptional({ description: 'Special instructions' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

// DTO for adding order results
export class AddOrderResultDto {
  @ApiProperty({ description: 'Result status', enum: ResultStatus })
  @IsEnum(ResultStatus)
  resultStatus!: ResultStatus;

  @ApiProperty({ description: 'Result data as JSON' })
  @IsObject()
  resultData!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Result notes' })
  @IsOptional()
  @IsString()
  resultNotes?: string;

  @ApiPropertyOptional({ description: 'Staff ID who performed the procedure' })
  @IsOptional()
  @IsUUID()
  performedBy?: string;

  @ApiPropertyOptional({ description: 'When the procedure was performed' })
  @IsOptional()
  @IsDateString()
  performedAt?: string;
}

// Response DTO
export class ClinicalOrderResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  encounterId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty({ enum: OrderType })
  orderType!: OrderType;

  @ApiProperty()
  orderCode!: string;

  @ApiProperty({ enum: CodeSystem })
  codeSystem!: CodeSystem;

  @ApiProperty()
  orderName!: string;

  @ApiPropertyOptional()
  orderNameAr?: string;

  @ApiProperty({ enum: OrderPriority })
  priority!: OrderPriority;

  @ApiProperty({ enum: OrderStatus })
  status!: OrderStatus;

  @ApiPropertyOptional()
  clinicalIndication?: string;

  @ApiPropertyOptional()
  specialInstructions?: string;

  @ApiPropertyOptional({ enum: ResultStatus })
  resultStatus?: ResultStatus;

  @ApiPropertyOptional()
  resultData?: Record<string, any>;

  @ApiPropertyOptional()
  resultNotes?: string;

  @ApiPropertyOptional()
  resultedAt?: Date;

  @ApiProperty()
  orderedBy!: string;

  @ApiProperty()
  orderedAt!: Date;

  @ApiPropertyOptional()
  performedBy?: string;

  @ApiPropertyOptional()
  performedAt?: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
