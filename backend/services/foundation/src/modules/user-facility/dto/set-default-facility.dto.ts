import { IsUUID } from 'class-validator';

export class SetDefaultFacilityDto {
  @IsUUID()
  facilityId!: string;
}

