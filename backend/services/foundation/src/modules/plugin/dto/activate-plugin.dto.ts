import { IsUUID, ValidateIf } from 'class-validator';

export class ActivatePluginDto {
  @ValidateIf((o) => o.tenantId !== undefined && o.tenantId !== '')
  @IsUUID()
  tenantId?: string;
}
