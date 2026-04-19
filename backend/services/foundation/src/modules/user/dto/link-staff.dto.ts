import { IsUUID, IsOptional } from 'class-validator';

export class LinkStaffDto {
  @IsOptional()
  @IsUUID("loose" as any)
  staffId?: string | null;
}
