/**
 * DTO for cancelling discharge
 */

import { IsString } from 'class-validator';

export class CancelDischargeDto {
  @IsString()
  cancellationReason!: string;
}
