import { IsInt, IsObject, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

export class RegisterCorrelationDto {
  @IsString()
  @MaxLength(200)
  txnId!: string;

  /** Workflow key, e.g. 'abha.enrol', 'abha.verify', 'link.care-context'. */
  @IsString()
  @MaxLength(100)
  flow!: string;

  @IsUUID()
  tenantId!: string;

  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(24 * 60 * 60)
  ttlSeconds?: number;

  /** Non-sensitive routing context only. */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class PutHipMappingDto {
  @IsString()
  @MaxLength(200)
  hipId!: string;

  @IsUUID()
  tenantId!: string;

  @IsUUID()
  facilityId!: string;
}
