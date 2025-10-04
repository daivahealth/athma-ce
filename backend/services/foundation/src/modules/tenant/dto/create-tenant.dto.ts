import { IsString, IsOptional, IsObject, MaxLength, MinLength } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  domain!: string;

  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;
}
