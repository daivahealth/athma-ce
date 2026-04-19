import { IsUUID } from 'class-validator';

export class SetDefaultFacilityDto {
  @IsUUID("all")
  facilityId!: string;
}

