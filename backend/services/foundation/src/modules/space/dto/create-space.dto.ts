import { IsBoolean, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  facilityId!: string;

  @IsString()
  @MaxLength(150)
  name!: string;

  @IsOptional()
  @IsString()
  spaceNumber?: string;

  @IsOptional()
  @IsString()
  spaceType?: string;

  @IsOptional()
  @IsInt()
  capacity?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
