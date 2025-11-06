/**
 * DTO for updating an encounter
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateEncounterDto } from './create-encounter.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateEncounterDto extends PartialType(CreateEncounterDto) {
  @IsString()
  @IsOptional()
  dischargeDisposition?: string;

  @IsString()
  @IsOptional()
  followUpInstructions?: string;
}
