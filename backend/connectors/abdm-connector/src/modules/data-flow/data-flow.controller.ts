import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Matches } from 'class-validator';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';
import { DataFlowService } from './data-flow.service';

const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class ListDto {
  @Matches(UUID_SHAPE)
  tenantId!: string;
}

/** Health-information request visibility for operators. */
@Controller('internal/data-requests')
@UseGuards(InternalApiKeyGuard)
export class DataFlowController {
  constructor(private readonly dataFlow: DataFlowService) {}

  @Get()
  async list(@Query() query: ListDto) {
    return { success: true, data: await this.dataFlow.list(query.tenantId) };
  }
}
