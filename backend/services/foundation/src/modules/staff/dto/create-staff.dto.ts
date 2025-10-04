import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  tenantId!: string;

  @IsString()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @MaxLength(100)
  lastName!: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsString()
  gender!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  employeeId!: string;

  @IsString()
  staffType!: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsDateString()
  licenseExpiry?: string;
}
