import { IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

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
  @IsUUID()
  facilityId?: string;
}

export class SecretScopeQueryDto {
  @IsString()
  @Matches(OWNER_PATTERN)
  ownerId!: string;

  @IsOptional()
  @IsUUID()
  facilityId?: string;
}

export class InternalSecretQueryDto {
  @IsUUID()
  tenantId!: string;

  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @IsString()
  @Matches(OWNER_PATTERN)
  ownerId!: string;

  @IsString()
  @Matches(KEY_PATTERN)
  key!: string;
}
