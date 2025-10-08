import { IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';

export enum WardType {
  GENERAL = 'general',
  ICU = 'icu',
  NICU = 'nicu',
  PICU = 'picu',
  ISOLATION = 'isolation',
  MATERNITY = 'maternity',
}

export class CreateWardDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(WardType)
  wardType!: WardType;

  @IsString()
  @IsOptional()
  floorNumber?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  totalBeds?: number;

  @IsString()
  @IsOptional()
  nursingStation?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
