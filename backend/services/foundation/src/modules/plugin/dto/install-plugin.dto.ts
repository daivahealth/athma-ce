import { IsString, IsOptional, IsObject } from 'class-validator';

export class InstallPluginDto {
  @IsString()
  packagePath!: string;

  @IsOptional()
  @IsObject()
  manifest?: Record<string, unknown>;
}
