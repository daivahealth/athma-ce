import { IsString, IsOptional, IsEnum, IsUUID, IsObject } from 'class-validator';

export enum DepartmentType {
  OPD = 'opd',
  IPD = 'ipd',
  RADIOLOGY = 'radiology',
  LABORATORY = 'laboratory',
  SURGERY = 'surgery',
  EMERGENCY = 'emergency',
  PHARMACY = 'pharmacy',
}

export class CreateDepartmentDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(DepartmentType)
  departmentType!: DepartmentType;

  @IsUUID("loose" as any)
  @IsOptional()
  headOfDepartment?: string;

  @IsString()
  @IsOptional()
  floorNumber?: string;

  @IsString()
  @IsOptional()
  phoneExtension?: string;

  @IsObject()
  @IsOptional()
  operatingHours?: Record<string, any>;

  @IsString()
  @IsOptional()
  status?: string;
}
