/**
 * DTO for bed board query parameters
 */

import {
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class BedBoardQueryDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeDischargedToday?: boolean = false;
}
