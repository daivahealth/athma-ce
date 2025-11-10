import { IsString, IsUUID, IsOptional, IsEnum, IsArray, ValidateNested, IsInt, IsBoolean, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Enum for note types
export enum NoteType {
  SOAP = 'soap',
  H_AND_P = 'h_and_p',
  PROGRESS = 'progress',
  DISCHARGE = 'discharge',
  PROCEDURE = 'procedure',
  CONSULTATION = 'consultation',
}

// Enum for note status
export enum NoteStatus {
  DRAFT = 'draft',
  FINAL = 'final',
  AMENDED = 'amended',
  SIGNED = 'signed',
}

// Enum for language
export enum NoteLanguage {
  EN = 'en',
  AR = 'ar',
}

// DTO for clinical note section
export class ClinicalNoteSectionDto {
  @ApiProperty({ description: 'Section code (e.g., subjective, objective, assessment, plan)' })
  @IsString()
  sectionCode!: string;

  @ApiProperty({ description: 'Section name' })
  @IsString()
  sectionName!: string;

  @ApiProperty({ description: 'Content as JSON (can be free-text or structured)' })
  @IsObject()
  content!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Sort order for section display' })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Whether section is empty' })
  @IsOptional()
  @IsBoolean()
  isEmpty?: boolean;
}

// DTO for creating a clinical note
export class CreateClinicalNoteDto {
  @ApiProperty({ description: 'Encounter ID' })
  @IsUUID()
  encounterId!: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ description: 'Note type', enum: NoteType })
  @IsEnum(NoteType)
  noteType!: NoteType;

  @ApiPropertyOptional({ description: 'Language', enum: NoteLanguage, default: NoteLanguage.EN })
  @IsOptional()
  @IsEnum(NoteLanguage)
  language?: NoteLanguage;

  @ApiPropertyOptional({ description: 'Note title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Author staff ID' })
  @IsUUID()
  authorStaffId!: string;

  @ApiPropertyOptional({ description: 'Co-signer staff ID' })
  @IsOptional()
  @IsUUID()
  coSignStaffId?: string;

  @ApiPropertyOptional({ description: 'Note sections', type: [ClinicalNoteSectionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClinicalNoteSectionDto)
  sections?: ClinicalNoteSectionDto[];
}

// DTO for updating a clinical note
export class UpdateClinicalNoteDto {
  @ApiPropertyOptional({ description: 'Note title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Note status', enum: NoteStatus })
  @IsOptional()
  @IsEnum(NoteStatus)
  status?: NoteStatus;

  @ApiPropertyOptional({ description: 'Co-signer staff ID' })
  @IsOptional()
  @IsUUID()
  coSignStaffId?: string;

  @ApiPropertyOptional({ description: 'Amendment reason (required when status is amended)' })
  @IsOptional()
  @IsString()
  amendmentReason?: string;
}

// DTO for adding/updating sections
export class UpdateNoteSectionsDto {
  @ApiProperty({ description: 'Note sections', type: [ClinicalNoteSectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClinicalNoteSectionDto)
  sections!: ClinicalNoteSectionDto[];
}

// DTO for signing a note
export class SignNoteDto {
  @ApiProperty({ description: 'Staff ID signing the note' })
  @IsUUID()
  staffId!: string;

  @ApiPropertyOptional({ description: 'Whether this is a co-signature' })
  @IsOptional()
  @IsBoolean()
  isCoSign?: boolean;
}

// Response DTO
export class ClinicalNoteResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  encounterId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty({ enum: NoteType })
  noteType!: NoteType;

  @ApiProperty({ enum: NoteLanguage })
  language!: NoteLanguage;

  @ApiPropertyOptional()
  title?: string;

  @ApiProperty({ enum: NoteStatus })
  status!: NoteStatus;

  @ApiProperty()
  version!: number;

  @ApiProperty()
  authorStaffId!: string;

  @ApiPropertyOptional()
  coSignStaffId?: string;

  @ApiPropertyOptional()
  signedAt?: Date;

  @ApiPropertyOptional()
  coSignedAt?: Date;

  @ApiPropertyOptional()
  amendmentReason?: string;

  @ApiPropertyOptional()
  supersededBy?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional({ type: [ClinicalNoteSectionDto] })
  sections?: ClinicalNoteSectionDto[];
}
