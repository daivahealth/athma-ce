import { IsString, IsOptional, IsObject, IsEnum, IsEmail, MinLength, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Tenant ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ description: 'Password', example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiProperty({ description: 'User role', example: 'physician' })
  @IsString()
  @IsEnum(['admin', 'physician', 'nurse', 'billing_staff', 'receptionist'])
  role: string;

  @ApiPropertyOptional({ description: 'User permissions', example: { patients: ['read', 'write'], appointments: ['read'] } })
  @IsOptional()
  @IsObject()
  permissions?: Record<string, any>;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'First name', example: 'John' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name', example: 'Doe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({ description: 'User role', example: 'physician' })
  @IsOptional()
  @IsString()
  @IsEnum(['admin', 'physician', 'nurse', 'billing_staff', 'receptionist'])
  role?: string;

  @ApiPropertyOptional({ description: 'User status', enum: ['active', 'inactive', 'suspended'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: string;

  @ApiPropertyOptional({ description: 'User permissions', example: { patients: ['read', 'write'], appointments: ['read'] } })
  @IsOptional()
  @IsObject()
  permissions?: Record<string, any>;
}

export class UserSearchDto {
  @ApiPropertyOptional({ description: 'Search query for name or email' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Filter by role', enum: ['admin', 'physician', 'nurse', 'billing_staff', 'receptionist'] })
  @IsOptional()
  @IsString()
  @IsEnum(['admin', 'physician', 'nurse', 'billing_staff', 'receptionist'])
  role?: string;

  @ApiPropertyOptional({ description: 'Filter by status', enum: ['active', 'inactive', 'suspended'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}

export class UserStatsDto {
  @ApiProperty({ description: 'Total number of users' })
  totalUsers: number;

  @ApiProperty({ description: 'Number of active users' })
  activeUsers: number;

  @ApiProperty({ description: 'Number of inactive users' })
  inactiveUsers: number;

  @ApiProperty({ description: 'Users by role' })
  usersByRole: Record<string, number>;

  @ApiProperty({ description: 'Number of recent logins (last 7 days)' })
  recentLogins: number;
}



