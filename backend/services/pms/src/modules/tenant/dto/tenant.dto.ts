import { IsString, IsOptional, IsObject, IsEnum, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ description: 'Tenant name', example: 'Al Rashid Medical Center' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Tenant domain', example: 'alrashid.zeal.com' })
  @IsString()
  @MinLength(3)
  @MaxLength(253)
  @Matches(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/, {
    message: 'Invalid domain format'
  })
  domain: string;

  @ApiPropertyOptional({ description: 'Tenant settings', example: { timezone: 'Asia/Dubai', language: 'en' } })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

export class UpdateTenantDto {
  @ApiPropertyOptional({ description: 'Tenant name', example: 'Al Rashid Medical Center' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ description: 'Tenant domain', example: 'alrashid.zeal.com' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(253)
  @Matches(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/, {
    message: 'Invalid domain format'
  })
  domain?: string;

  @ApiPropertyOptional({ description: 'Tenant status', enum: ['active', 'inactive', 'suspended'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: string;

  @ApiPropertyOptional({ description: 'Tenant settings', example: { timezone: 'Asia/Dubai', language: 'en' } })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

export class TenantSearchDto {
  @ApiPropertyOptional({ description: 'Search query for name or domain' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Filter by status', enum: ['active', 'inactive', 'suspended'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: string;
}

export class TenantStatsDto {
  @ApiProperty({ description: 'Total number of users' })
  totalUsers: number;

  @ApiProperty({ description: 'Total number of patients' })
  totalPatients: number;

  @ApiProperty({ description: 'Total number of facilities' })
  totalFacilities: number;

  @ApiProperty({ description: 'Total number of staff' })
  totalStaff: number;

  @ApiProperty({ description: 'Total number of appointments' })
  totalAppointments: number;

  @ApiProperty({ description: 'Number of active appointments' })
  activeAppointments: number;
}
