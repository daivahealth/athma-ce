/**
 * DTO for ward board query parameters
 * Supports filtering by admission status, discharge status, and acuity
 */

import {
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { InpatientAdmissionStatus, InpatientAcuity } from './create-event.dto';

export class BedBoardQueryDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeDischargedToday?: boolean = false;

  @IsArray()
  @IsEnum(InpatientAdmissionStatus, { each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') return value.split(',').map(v => v.trim());
    return value;
  })
  statusFilter?: InpatientAdmissionStatus[];

  @IsArray()
  @IsEnum(InpatientAcuity, { each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') return value.split(',').map(v => v.trim());
    return value;
  })
  acuityFilter?: InpatientAcuity[];
}
