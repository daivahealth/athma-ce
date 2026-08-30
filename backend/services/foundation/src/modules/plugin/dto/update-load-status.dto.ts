import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateLoadStatusDto {
  @IsIn(['active', 'error'])
  status!: 'active' | 'error';

  /** Truncated load/init error detail when status is 'error'. */
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  error?: string;

  /**
   * The manifest the host service actually loaded. Sent with status 'active'
   * so the registry snapshot (version, description, permissions) tracks the
   * deployed plugin instead of freezing at whatever was installed first.
   * Ignored for status 'error' — a quarantined plugin's manifest is not
   * authoritative.
   */
  @IsOptional()
  @IsObject()
  manifest?: Record<string, unknown>;
}
