import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum FacilityAccessLevel {
  STANDARD = 'standard',
  ADMIN = 'admin',
  READ_ONLY = 'read_only',
}

export class AssignFacilityDto {
  @IsUUID()
  facilityId!: string;

  @IsEnum(FacilityAccessLevel)
  @IsOptional()
  accessLevel?: FacilityAccessLevel = FacilityAccessLevel.STANDARD;

  @IsBoolean()
  @IsOptional()
  setAsDefault?: boolean = false;
}

