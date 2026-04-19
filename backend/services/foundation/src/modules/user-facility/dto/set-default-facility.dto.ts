import { IsUUID } from 'class-validator';

export class SetDefaultFacilityDto {
  @IsUUID("loose" as any)
  facilityId!: string;
}

