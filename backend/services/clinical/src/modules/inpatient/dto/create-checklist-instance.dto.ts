import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ChecklistContext } from '@zeal/database-clinical';

export class CreateChecklistInstanceDto {
  @IsString()
  templateId!: string;

  @IsString()
  patientId!: string;

  @IsOptional()
  @IsString()
  encounterId?: string;

  @IsOptional()
  @IsString()
  admissionId?: string;

  @IsOptional()
  @IsString()
  careChannelId?: string;

  @IsOptional()
  @IsEnum(ChecklistContext)
  context?: ChecklistContext;

  @IsOptional()
  @IsDateString()
  dueAt?: string;
}
