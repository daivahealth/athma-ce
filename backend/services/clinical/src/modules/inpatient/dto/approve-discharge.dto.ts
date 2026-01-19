/**
 * DTO for approving discharge
 */

import { IsString, IsOptional } from 'class-validator';

export class ApproveDischargeDto {
  @IsString()
  @IsOptional()
  approvalRemarks?: string;
}
