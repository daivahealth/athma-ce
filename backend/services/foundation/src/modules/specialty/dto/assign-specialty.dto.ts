import { IsString, IsBoolean, IsUUID, IsOptional } from 'class-validator';

export class AssignSpecialtyDto {
  @IsUUID()
  facilityId!: string;

  @IsUUID()
  specialtyId!: string;

  @IsBoolean()
  @IsOptional()
  primaryFlag?: boolean;
}

export class BulkAssignSpecialtiesDto {
  @IsUUID()
  facilityId!: string;

  @IsString()
  @IsUUID()
  primarySpecialtyId!: string;

  @IsUUID('4', { each: true })
  @IsOptional()
  secondarySpecialtyIds?: string[];
}
