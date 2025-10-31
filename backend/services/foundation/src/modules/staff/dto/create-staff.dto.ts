import { IsArray, IsDateString, IsOptional, IsString, MaxLength, ArrayMaxSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({
    description: 'Tenant UUID',
    example: '223e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  tenantId!: string;

  @ApiPropertyOptional({
    description: 'Name prefix (Dr., Mr., Ms., etc.)',
    example: 'Dr.',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  prefix?: string;

  @ApiProperty({
    description: 'Staff first name',
    example: 'Ahmed',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({
    description: 'Staff last name',
    example: 'Hassan',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  lastName!: string;

  @ApiPropertyOptional({
    description: 'Staff middle name',
    example: 'Mohamed',
  })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({
    description: 'Date of birth (ISO 8601 format)',
    example: '1985-03-15',
  })
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({
    description: 'Gender (male, female, other)',
    example: 'male',
    enum: ['male', 'female', 'other'],
  })
  @IsString()
  gender!: string;

  @ApiPropertyOptional({
    description: 'Contact phone number',
    example: '+971-50-1234567',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'ahmed.hassan@hospital.ae',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Unique employee identifier',
    example: 'EMP001',
  })
  @IsString()
  employeeId!: string;

  @ApiProperty({
    description: 'Type of staff (physician, nurse, technician, administrative)',
    example: 'physician',
    enum: ['physician', 'nurse', 'technician', 'administrative', 'support'],
  })
  @IsString()
  staffType!: string;

  @ApiPropertyOptional({
    description: 'Professional license number (e.g., DHA license)',
    example: 'DHA-12345',
  })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({
    description: 'License expiry date (ISO 8601 format)',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsDateString()
  licenseExpiry?: string;

  @ApiPropertyOptional({
    description: 'Educational qualification or degree',
    example: 'MBBS, MD Cardiology',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  qualification?: string;

  @ApiPropertyOptional({
    description: 'Languages spoken by the staff member (ISO 639-1 codes)',
    example: ['en', 'ar'],
    type: [String],
    maxItems: 10,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  languages?: string[];
}
