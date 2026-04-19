import { IsOptional, IsUUID, IsEnum } from 'class-validator';

export enum BedBrowserStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  CLEANING = 'cleaning',
  MAINTENANCE = 'maintenance',
}

export class BedBrowserQueryDto {
  @IsUUID("loose" as any)
  @IsOptional()
  wardId?: string;

  @IsEnum(BedBrowserStatus)
  @IsOptional()
  status?: BedBrowserStatus;
}
