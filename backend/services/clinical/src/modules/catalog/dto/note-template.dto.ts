import { IsString, IsUUID, IsOptional, IsEnum, IsInt, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NoteTemplateType } from '@zeal/database-clinical';

// Enum for template status
export enum TemplateStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

// DTO for creating a note template
export class CreateNoteTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Template description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Template type/category',
    enum: NoteTemplateType,
    default: NoteTemplateType.GENERAL
  })
  @IsOptional()
  @IsEnum(NoteTemplateType)
  templateType?: NoteTemplateType;

  @ApiPropertyOptional({ description: 'Specialty ID (Foundation DB reference)' })
  @IsOptional()
  @IsUUID("loose" as any)
  specialtyId?: string;

  @ApiPropertyOptional({ description: 'Template status', enum: TemplateStatus, default: TemplateStatus.ACTIVE })
  @IsOptional()
  @IsEnum(TemplateStatus)
  status?: TemplateStatus;

  @ApiProperty({ description: 'Template schema (sections + fields)' })
  @IsObject()
  schema!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Change log for this version' })
  @IsOptional()
  @IsString()
  changeLog?: string;

  @ApiPropertyOptional({ description: 'Staff ID creating the template' })
  @IsOptional()
  @IsUUID("loose" as any)
  createdBy?: string;
}

// DTO for updating a note template
export class UpdateNoteTemplateDto {
  @ApiPropertyOptional({ description: 'Template name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Template description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Template type/category', enum: NoteTemplateType })
  @IsOptional()
  @IsEnum(NoteTemplateType)
  templateType?: NoteTemplateType;

  @ApiPropertyOptional({ description: 'Specialty ID (Foundation DB reference)' })
  @IsOptional()
  @IsUUID("loose" as any)
  specialtyId?: string;

  @ApiPropertyOptional({ description: 'Template status', enum: TemplateStatus })
  @IsOptional()
  @IsEnum(TemplateStatus)
  status?: TemplateStatus;
}

// DTO for creating a new template version
export class CreateTemplateVersionDto {
  @ApiProperty({ description: 'Template schema (sections + fields)' })
  @IsObject()
  schema!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Change log for this version' })
  @IsOptional()
  @IsString()
  changeLog?: string;

  @ApiPropertyOptional({ description: 'Staff ID creating the version' })
  @IsOptional()
  @IsUUID("loose" as any)
  createdBy?: string;
}

// DTO for template version response
export class NoteTemplateVersionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  templateId!: string;

  @ApiProperty()
  version!: number;

  @ApiProperty({ description: 'Template schema (sections + fields)' })
  schema!: Record<string, any>;

  @ApiPropertyOptional()
  changeLog?: string;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

// DTO for template response with versions
export class NoteTemplateResponseDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional()
  tenantId?: string;

  @ApiPropertyOptional()
  specialtyId?: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: NoteTemplateType })
  templateType!: NoteTemplateType;

  @ApiProperty({ enum: TemplateStatus })
  status!: TemplateStatus;

  @ApiProperty()
  currentVersion!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional({ type: [NoteTemplateVersionResponseDto] })
  versions?: NoteTemplateVersionResponseDto[];
}
