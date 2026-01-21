/**
 * DTO for creating a new discharge summary version
 */

import { IsObject, IsOptional, IsString, IsNotEmptyObject } from 'class-validator';

export class CreateDischargeSummaryVersionDto {
  @IsObject()
  @IsNotEmptyObject()
  data!: Record<string, unknown>;

  @IsString()
  @IsOptional()
  changeReason?: string;
}
