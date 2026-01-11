import { IsOptional, IsUUID, IsEnum } from 'class-validator';

export enum BedBrowserStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  CLEANING = 'cleaning',
  MAINTENANCE = 'maintenance',
}

export class BedBrowserQueryDto {
  @IsUUID()
  @IsOptional()
  wardId?: string;

  @IsEnum(BedBrowserStatus)
  @IsOptional()
  status?: BedBrowserStatus;
}
