/**
 * Providers Controller
 * Webhook endpoints for message delivery status
 */

import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@zeal/shared-utils';
import { ProvidersService } from './providers.service';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { ListProviderCallbacksQueryDto } from './dto/list-provider-callbacks.query';

@ApiTags('Providers')
@ApiBearerAuth('bearer')
@Controller('v1/providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post('webhooks/:channel')
  @ApiOperation({ summary: 'Receive webhook callback from provider (Twilio, SendGrid, etc.)' })
  @ApiResponse({ status: 201, description: 'Webhook received successfully' })
  async handleWebhook(
    @TenantId() tenantId: string,
    @Body() payload: any,
  ) {
    // Extract provider message ID from payload (varies by provider)
    const providerMessageId = payload.MessageSid || payload.message_id || payload.id;
    const channel = payload.channel || 'sms';

    return this.providersService.storeCallback(tenantId, channel, providerMessageId, payload);
  }

  @Get('callbacks')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get webhook callback history' })
  @ApiResponse({
    status: 200,
    description: 'Callbacks retrieved successfully, as { data, total, limit, offset }',
  })
  async findAll(@TenantId() tenantId: string, @Query() query: ListProviderCallbacksQueryDto) {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;
    const { data, total } = await this.providersService.findAll(tenantId, {
      channel: query.channel || undefined,
      processed: query.processed === undefined ? undefined : query.processed === 'true',
      limit,
      offset,
    });

    return { data, total, limit, offset };
  }
}
