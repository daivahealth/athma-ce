import { IsString, IsOptional, IsInt, Min, IsObject } from 'class-validator';

export class CreateClinicDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsString()
  @IsOptional()
  floorNumber?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  totalRooms?: number;

  @IsObject()
  @IsOptional()
  operatingHours?: Record<string, any>;

  @IsString()
  @IsOptional()
  status?: string;
}
