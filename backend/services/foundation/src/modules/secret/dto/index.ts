import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

// Seeded platform ids are UUID-shaped but not RFC-variant, so IsUUID() rejects them.
const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


const KEY_PATTERN = /^[a-z][a-z0-9_.]*$/;
const OWNER_PATTERN = /^[a-z][a-z0-9-]*$/;

export class PutSecretDto {
  /** The secret value. Never echoed back by any response. */
  @IsString()
  @MinLength(1)
  @MaxLength(16384)
  value!: string;

  /** Owning integration identity, e.g. 'abdm', 'nhcx', 'ai-gateway'. */
  @IsString()
  @Matches(OWNER_PATTERN)
  ownerId!: string;

  /** Facility scope for per-facility credentials (e.g. ABDM per-HIP). */
  @IsOptional()
  @Matches(UUID_SHAPE)
  facilityId?: string;
}

export class SecretScopeQueryDto {
  @IsString()
  @Matches(OWNER_PATTERN)
  ownerId!: string;

  @IsOptional()
  @Matches(UUID_SHAPE)
  facilityId?: string;
}

export class InternalSecretQueryDto {
  @Matches(UUID_SHAPE)
  tenantId!: string;

  @IsOptional()
  @Matches(UUID_SHAPE)
  facilityId?: string;

  @IsString()
  @Matches(OWNER_PATTERN)
  ownerId!: string;

  @IsString()
  @Matches(KEY_PATTERN)
  key!: string;
}
