import { IsString, IsOptional } from 'class-validator';

export class RemoveMemberDto {
  @IsOptional()
  @IsString()
  removalReason?: string;
}
