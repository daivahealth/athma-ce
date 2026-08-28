import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';
import { ConsentService } from './consent.service';

const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class ListDto {
  @Matches(UUID_SHAPE)
  tenantId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  abhaAddress?: string;
}

/** Consent-artefact visibility for core services / operators. */
@Controller('internal/consents')
@UseGuards(InternalApiKeyGuard)
export class ConsentController {
  constructor(private readonly consents: ConsentService) {}

  @Get()
  async list(@Query() query: ListDto) {
    return { success: true, data: await this.consents.list(query.tenantId, query.abhaAddress) };
  }
}
