import { Body, Controller, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CorrelationService } from './correlation.service';
import { RegisterCorrelationDto, PutHipMappingDto } from './dto';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';

/**
 * Internal surface for the clinical service (and, later, connector-internal
 * workflows) to register outbound transactions and maintain HIP routing.
 */
@Controller('internal')
@UseGuards(InternalApiKeyGuard)
export class CorrelationController {
  constructor(private readonly correlationService: CorrelationService) {}

  @Post('correlations')
  async register(@Body() dto: RegisterCorrelationDto) {
    return { success: true, data: await this.correlationService.register(dto) };
  }

  @Get('correlations/:txnId')
  async get(@Param('txnId') txnId: string) {
    const entry = await this.correlationService.resolve(txnId);
    if (!entry) throw new NotFoundException(`Transaction '${txnId}' unknown or expired`);
    return { success: true, data: entry };
  }

  @Put('hip-mappings')
  async putHipMapping(@Body() dto: PutHipMappingDto) {
    return {
      success: true,
      data: await this.correlationService.putHipMapping(dto.hipId, dto.tenantId, dto.facilityId),
    };
  }

  @Get('hip-mappings/:hipId')
  async getHipMapping(@Param('hipId') hipId: string) {
    const mapping = await this.correlationService.getHipMapping(hipId);
    if (!mapping) throw new NotFoundException(`No facility mapped for HIP '${hipId}'`);
    return { success: true, data: mapping };
  }
}
