import { IsUUID, IsOptional, IsObject } from 'class-validator';

export class ActivatePluginDto {
  @IsUUID()
  tenantId: string;

  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;
}
