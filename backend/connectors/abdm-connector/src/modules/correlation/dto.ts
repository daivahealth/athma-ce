import { IsInt, IsObject, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

// Seeded platform ids are UUID-shaped but not RFC-variant, so IsUUID() rejects them.
const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


export class RegisterCorrelationDto {
  @IsString()
  @MaxLength(200)
  txnId!: string;

  /** Workflow key, e.g. 'abha.enrol', 'abha.verify', 'link.care-context'. */
  @IsString()
  @MaxLength(100)
  flow!: string;

  @Matches(UUID_SHAPE)
  tenantId!: string;

  @IsOptional()
  @Matches(UUID_SHAPE)
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

  @Matches(UUID_SHAPE)
  tenantId!: string;

  @Matches(UUID_SHAPE)
  facilityId!: string;
}
