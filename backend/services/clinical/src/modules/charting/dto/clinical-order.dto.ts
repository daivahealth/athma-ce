import { Type } from 'class-transformer';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsObject,
  IsDateString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsInt,
  IsNumber,
} from 'class-validator';
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
  LOCAL = 'LOCAL',
}

export enum PackageOrderStatus {
  ORDERED = 'ordered',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class LabOrderTestDto {
  @ApiPropertyOptional({ description: 'Lab test master ID' })
  @IsOptional()
  @IsUUID("loose" as any)
  labTestMasterId?: string;

  @ApiProperty({ description: 'Test code' })
  @IsString()
  testCode!: string;

  @ApiPropertyOptional({ description: 'Code system', enum: CodeSystem, default: CodeSystem.LOINC })
  @IsOptional()
  @IsEnum(CodeSystem)
  codeSystem?: CodeSystem;

  @ApiProperty({ description: 'Test name in English' })
  @IsString()
  testName!: string;

  @ApiPropertyOptional({ description: 'LOINC code' })
  @IsOptional()
  @IsString()
  loincCode?: string;

  @ApiPropertyOptional({ description: 'CPT code' })
  @IsOptional()
  @IsString()
  cptCode?: string;

  @ApiPropertyOptional({ description: 'Specimen type' })
  @IsOptional()
  @IsString()
  specimenType?: string;

  @ApiPropertyOptional({ description: 'Collection method' })
  @IsOptional()
  @IsString()
  collectionMethod?: string;

  @ApiPropertyOptional({ description: 'Fasting required', default: false })
  @IsOptional()
  @IsBoolean()
  fastingRequired?: boolean;

  @ApiPropertyOptional({ description: 'Fasting duration in hours' })
  @IsOptional()
  @IsInt()
  fastingDurationHours?: number;

  @ApiPropertyOptional({ description: 'Quantity', default: 1 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Sort order', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Lab order test notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ImagingOrderDetailDto {
  @ApiPropertyOptional({ description: 'Imaging study master ID' })
  @IsOptional()
  @IsUUID("loose" as any)
  imagingStudyMasterId?: string;

  @ApiProperty({ description: 'Study code' })
  @IsString()
  studyCode!: string;

  @ApiPropertyOptional({ description: 'Code system', enum: CodeSystem, default: CodeSystem.CPT })
  @IsOptional()
  @IsEnum(CodeSystem)
  codeSystem?: CodeSystem;

  @ApiProperty({ description: 'Study name in English' })
  @IsString()
  studyName!: string;

  @ApiPropertyOptional({ description: 'CPT code' })
  @IsOptional()
  @IsString()
  cptCode?: string;

  @ApiPropertyOptional({ description: 'Modality' })
  @IsOptional()
  @IsString()
  modality?: string;

  @ApiPropertyOptional({ description: 'Body part' })
  @IsOptional()
  @IsString()
  bodyPart?: string;

  @ApiPropertyOptional({ description: 'Contrast required', default: false })
  @IsOptional()
  @IsBoolean()
  contrastRequired?: boolean;

  @ApiPropertyOptional({ description: 'Contrast type' })
  @IsOptional()
  @IsString()
  contrastType?: string;

  @ApiPropertyOptional({ description: 'Preparation instructions' })
  @IsOptional()
  @IsString()
  preparationInstructions?: string;

  @ApiPropertyOptional({ description: 'Quantity', default: 1 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Sort order', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Imaging detail notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ProcedureOrderDetailDto {
  @ApiPropertyOptional({ description: 'Procedure master ID' })
  @IsOptional()
  @IsUUID("loose" as any)
  procedureMasterId?: string;

  @ApiProperty({ description: 'Procedure code' })
  @IsString()
  procedureCode!: string;

  @ApiPropertyOptional({ description: 'Code system', enum: CodeSystem, default: CodeSystem.CPT })
  @IsOptional()
  @IsEnum(CodeSystem)
  codeSystem?: CodeSystem;

  @ApiProperty({ description: 'Procedure name in English' })
  @IsString()
  procedureName!: string;

  @ApiPropertyOptional({ description: 'CPT code' })
  @IsOptional()
  @IsString()
  cptCode?: string;

  @ApiPropertyOptional({ description: 'ICD-10-PCS code' })
  @IsOptional()
  @IsString()
  icd10PcsCode?: string;

  @ApiPropertyOptional({ description: 'Procedure category' })
  @IsOptional()
  @IsString()
  procedureCategory?: string;

  @ApiPropertyOptional({ description: 'Body system' })
  @IsOptional()
  @IsString()
  bodySystem?: string;

  @ApiPropertyOptional({ description: 'Anesthesia type' })
  @IsOptional()
  @IsString()
  anesthesiaType?: string;

  @ApiPropertyOptional({ description: 'Facility required' })
  @IsOptional()
  @IsString()
  facilityRequired?: string;

  @ApiPropertyOptional({ description: 'Estimated duration in minutes' })
  @IsOptional()
  @IsInt()
  estimatedDurationMinutes?: number;

  @ApiPropertyOptional({ description: 'Preparation instructions' })
  @IsOptional()
  @IsString()
  preparationInstructions?: string;

  @ApiPropertyOptional({ description: 'Consent required', default: false })
  @IsOptional()
  @IsBoolean()
  consentRequired?: boolean;

  @ApiPropertyOptional({ description: 'Quantity', default: 1 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Sort order', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Procedure detail notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

// DTO for creating a clinical order
export class CreateClinicalOrderDto {
  @ApiProperty({ description: 'Encounter ID' })
  @IsUUID("loose" as any)
  encounterId!: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("loose" as any)
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

  @ApiPropertyOptional({ description: 'Runtime package order ID when generated from a package' })
  @IsOptional()
  @IsUUID("loose" as any)
  packageOrderId?: string;

  @ApiPropertyOptional({ description: 'Lab execution-detail rows for lab orders', type: [LabOrderTestDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LabOrderTestDto)
  labTests?: LabOrderTestDto[];

  @ApiPropertyOptional({ description: 'Imaging execution-detail rows for imaging orders', type: [ImagingOrderDetailDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImagingOrderDetailDto)
  imagingDetails?: ImagingOrderDetailDto[];

  @ApiPropertyOptional({ description: 'Procedure execution-detail rows for procedure orders', type: [ProcedureOrderDetailDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcedureOrderDetailDto)
  procedureDetails?: ProcedureOrderDetailDto[];

  @ApiProperty({ description: 'Staff ID who ordered' })
  @IsUUID("loose" as any)
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

export class CreatePackageOrderDto {
  @ApiProperty({ description: 'Package catalog ID' })
  @IsUUID("loose" as any)
  packageId!: string;

  @ApiProperty({ description: 'Encounter ID' })
  @IsUUID("loose" as any)
  encounterId!: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("loose" as any)
  patientId!: string;

  @ApiPropertyOptional({ description: 'Default order priority to apply to expanded clinical orders', enum: OrderPriority })
  @IsOptional()
  @IsEnum(OrderPriority)
  priority?: OrderPriority;

  @ApiPropertyOptional({ description: 'Shared clinical indication for expanded orders' })
  @IsOptional()
  @IsString()
  clinicalIndication?: string;

  @ApiPropertyOptional({ description: 'Shared special instructions for expanded orders' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiPropertyOptional({ description: 'Package order notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Staff ID who ordered the package' })
  @IsUUID("loose" as any)
  orderedBy!: string;
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
  @IsUUID("loose" as any)
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

  @ApiPropertyOptional()
  packageOrderId?: string;

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

  @ApiPropertyOptional({ type: [LabOrderTestDto] })
  labTests?: LabOrderTestDto[];

  @ApiPropertyOptional({ type: [ImagingOrderDetailDto] })
  imagingDetails?: ImagingOrderDetailDto[];

  @ApiPropertyOptional({ type: [ProcedureOrderDetailDto] })
  procedureDetails?: ProcedureOrderDetailDto[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class PackageOrderResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  packageId!: string;

  @ApiProperty()
  encounterId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty({ enum: PackageOrderStatus })
  status!: PackageOrderStatus;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  orderedBy!: string;

  @ApiProperty()
  orderedAt!: Date;

  @ApiPropertyOptional()
  packageCode?: string;

  @ApiPropertyOptional()
  packageName?: string;

  @ApiProperty({ type: [ClinicalOrderResponseDto] })
  clinicalOrders!: ClinicalOrderResponseDto[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class ChildTypeSummaryDto {
  @ApiProperty()
  lab!: number;

  @ApiProperty()
  imaging!: number;

  @ApiProperty()
  procedure!: number;
}

export class ChartPackageOrderResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  packageId!: string;

  @ApiProperty()
  packageCode!: string;

  @ApiProperty()
  packageName!: string;

  @ApiProperty({ enum: PackageOrderStatus })
  status!: PackageOrderStatus;

  @ApiProperty()
  orderedBy!: string;

  @ApiProperty()
  orderedAt!: Date;

  @ApiProperty()
  childOrderCount!: number;

  @ApiProperty({ type: ChildTypeSummaryDto })
  childTypeSummary!: ChildTypeSummaryDto;

  @ApiProperty({ type: [ClinicalOrderResponseDto] })
  clinicalOrders!: ClinicalOrderResponseDto[];
}

export class EncounterChartOrdersResponseDto {
  @ApiProperty({ type: [ClinicalOrderResponseDto] })
  standaloneOrders!: ClinicalOrderResponseDto[];

  @ApiProperty({ type: [ChartPackageOrderResponseDto] })
  packageOrders!: ChartPackageOrderResponseDto[];
}
