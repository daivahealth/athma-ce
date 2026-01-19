/**
 * DTO for marking discharge as ready
 */

import { IsString, IsOptional } from 'class-validator';

export class MarkReadyDto {
  @IsString()
  @IsOptional()
  readyRemarks?: string;
}
