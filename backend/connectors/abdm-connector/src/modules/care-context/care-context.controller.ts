import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { IsOptional, Matches } from 'class-validator';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';
import { CareContextService } from './care-context.service';

const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class ListDto {
  @Matches(UUID_SHAPE)
  tenantId!: string;

  @IsOptional()
  @Matches(UUID_SHAPE)
  patientId?: string;
}

/** Visibility into HIP care-context state for core services / operators. */
@Controller('internal/care-contexts')
@UseGuards(InternalApiKeyGuard)
export class CareContextController {
  constructor(private readonly careContexts: CareContextService) {}

  @Get()
  async list(@Query() query: ListDto) {
    return {
      success: true,
      data: await this.careContexts.list(query.tenantId, query.patientId),
    };
  }
}
