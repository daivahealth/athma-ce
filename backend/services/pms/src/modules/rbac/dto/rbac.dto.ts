import { IsString, IsOptional, IsBoolean, IsUUID, IsDateString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'Tenant ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ description: 'Role code', example: 'physician' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Role name', example: 'Physician' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Role description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Is system role', default: false })
  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ description: 'Role name', example: 'Physician' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'Role description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class CreatePermissionDto {
  @ApiProperty({ description: 'Permission code', example: 'patients.read' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  code: string;

  @ApiProperty({ description: 'Permission name', example: 'Read Patients' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ description: 'Permission description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Resource', example: 'patients' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  resource?: string;

  @ApiPropertyOptional({ description: 'Action', example: 'read' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  action?: string;
}

export class AssignRoleDto {
  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Role ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  roleId: string;

  @ApiPropertyOptional({ description: 'Assigned by user ID' })
  @IsOptional()
  @IsUUID()
  assignedBy?: string;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class RbacStatsDto {
  @ApiProperty({ description: 'Total number of roles' })
  totalRoles: number;

  @ApiProperty({ description: 'Number of system roles' })
  systemRoles: number;

  @ApiProperty({ description: 'Number of custom roles' })
  customRoles: number;

  @ApiProperty({ description: 'Total number of permissions' })
  totalPermissions: number;

  @ApiProperty({ description: 'Total number of role assignments' })
  totalRoleAssignments: number;

  @ApiProperty({ description: 'Number of active role assignments' })
  activeRoleAssignments: number;
}





