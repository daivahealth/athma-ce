import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

export enum BedType {
  STANDARD = 'standard',
  ICU = 'icu',
  ISOLATION = 'isolation',
  PRIVATE = 'private',
  SEMI_PRIVATE = 'semi_private',
}

export enum BedStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved',
}

export class CreateBedDto {
  @IsString()
  bedNumber!: string;

  @IsEnum(BedType)
  bedType!: BedType;

  @IsObject()
  @IsOptional()
  features?: Record<string, any>; // { oxygen: true, monitor: true, ventilator: false }

  @IsEnum(BedStatus)
  @IsOptional()
  status?: BedStatus;
}
