import { IsUUID, IsOptional, IsObject, ValidateIf } from 'class-validator';

export class ActivatePluginDto {
  @ValidateIf((o) => o.tenantId !== undefined && o.tenantId !== '')
  @IsUUID()
  tenantId?: string;

  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;
}
