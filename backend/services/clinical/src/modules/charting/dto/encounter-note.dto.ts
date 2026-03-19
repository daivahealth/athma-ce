import { IsString, IsUUID, IsOptional, IsEnum, IsBoolean, IsObject } from 'class-validator';
import { Exclude, Type } from 'class-transformer';
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

// DTO for creating an encounter note
export class CreateEncounterNoteDto {
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

  @ApiPropertyOptional({ description: 'Note content as JSON' })
  @IsOptional()
  @IsObject()
  @Type(() => Object)
  content?: Record<string, any>;
}

// DTO for updating an encounter note
export class UpdateEncounterNoteDto {
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

  @ApiPropertyOptional({ description: 'Note content as JSON' })
  @IsOptional()
  @IsObject()
  @Type(() => Object)
  content?: Record<string, any>;
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
export class EncounterNoteResponseDto {
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

  @ApiPropertyOptional({ description: 'Note content as JSON' })
  content?: Record<string, any>;
}
