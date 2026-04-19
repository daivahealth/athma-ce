import { IsString, IsBoolean, IsUUID, IsOptional } from 'class-validator';

export class AssignSpecialtyDto {
  @IsUUID("all")
  facilityId!: string;

  @IsUUID("all")
  specialtyId!: string;

  @IsBoolean()
  @IsOptional()
  primaryFlag?: boolean;
}

export class BulkAssignSpecialtiesDto {
  @IsUUID("all")
  facilityId!: string;

  @IsString()
  @IsUUID("all")
  primarySpecialtyId!: string;

  @IsUUID('4', { each: true })
  @IsOptional()
  secondarySpecialtyIds?: string[];
}
