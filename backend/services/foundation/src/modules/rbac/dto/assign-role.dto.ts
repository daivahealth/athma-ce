import { IsDateString, IsOptional, IsString } from 'class-validator';

export class AssignRoleDto {
  @IsString()
  userId!: string;

  @IsString()
  roleId!: string;

  @IsOptional()
  @IsString()
  assignedBy?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
