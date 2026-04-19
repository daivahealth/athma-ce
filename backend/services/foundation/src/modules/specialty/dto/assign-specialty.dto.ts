import { IsString, IsBoolean, IsUUID, IsOptional } from 'class-validator';

export class AssignSpecialtyDto {
  @IsUUID("loose" as any)
  facilityId!: string;

  @IsUUID("loose" as any)
  specialtyId!: string;

  @IsBoolean()
  @IsOptional()
  primaryFlag?: boolean;
}

export class BulkAssignSpecialtiesDto {
  @IsUUID("loose" as any)
  facilityId!: string;

  @IsString()
  @IsUUID("loose" as any)
  primarySpecialtyId!: string;

  @IsUUID('4', { each: true })
  @IsOptional()
  secondarySpecialtyIds?: string[];
}
