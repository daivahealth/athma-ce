import { IsUUID, IsOptional } from 'class-validator';

export class LinkStaffDto {
  @IsOptional()
  @IsUUID("all")
  staffId?: string | null;
}
