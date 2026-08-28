import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IsObject, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';
import { RegistriesService, RegistryKind } from './registries.service';
import { AbdmProviderError } from '../abha/abdm-error';

// Seeded platform ids are UUID-shaped but not RFC-variant, so IsUUID() rejects them.
const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const REGISTRY_ID = /^[A-Za-z0-9-]{4,30}$/;

class ScopedDto {
  @Matches(UUID_SHAPE)
  tenantId!: string;

  @IsOptional()
  @Matches(UUID_SHAPE)
  facilityId?: string;
}

class SearchDto extends ScopedDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @Matches(REGISTRY_ID)
  registryId?: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, string>;
}

class LinkDto extends ScopedDto {
  /** Core entity being linked (facility id or staff id). */
  @Matches(UUID_SHAPE)
  entityId!: string;

  @Matches(REGISTRY_ID)
  registryId!: string;
}

/** HFR/HPR lookups for core services (internal surface). */
@Controller('internal/registries')
@UseGuards(InternalApiKeyGuard)
export class RegistriesController {
  constructor(private readonly registries: RegistriesService) {}

  @Post(':kind/search')
  @HttpCode(HttpStatus.OK)
  async search(@Param('kind') kind: string, @Body() dto: SearchDto) {
    return this.run(() =>
      this.registries.search(this.kind(kind), this.scope(dto), {
        name: dto.name,
        registryId: dto.registryId,
        filters: dto.filters,
      }),
    );
  }

  @Post(':kind/link')
  @HttpCode(HttpStatus.OK)
  async link(@Param('kind') kind: string, @Body() dto: LinkDto) {
    return this.run(() =>
      this.registries.link(this.kind(kind), this.scope(dto), dto.entityId, dto.registryId),
    );
  }

  private kind(raw: string): RegistryKind {
    if (raw !== 'facility' && raw !== 'practitioner') {
      throw new HttpException(`Unknown registry '${raw}'`, HttpStatus.NOT_FOUND);
    }
    return raw;
  }

  private scope(dto: ScopedDto) {
    return { tenantId: dto.tenantId, facilityId: dto.facilityId };
  }

  private async run<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof AbdmProviderError) {
        throw new HttpException(
          { code: error.code, message: error.message, retryable: error.retryable },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw error;
    }
  }
}
