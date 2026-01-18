import { IsUUID, IsOptional } from 'class-validator';

export class LinkStaffDto {
  @IsOptional()
  @IsUUID()
  staffId?: string | null;
}
