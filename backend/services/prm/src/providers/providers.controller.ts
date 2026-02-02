/**
 * Providers Controller
 * Webhook endpoints for message delivery status
 */

import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@zeal/shared-utils';
import { ProvidersService } from './providers.service';
import { TenantId } from '../common/decorators/tenant-id.decorator';

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
  @ApiQuery({ name: 'channel', required: false, type: String })
  @ApiQuery({ name: 'processed', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Callbacks retrieved successfully' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('channel') channel?: string,
    @Query('processed') processed?: string,
  ) {
    const filters: any = {};
    if (channel) filters.channel = channel;
    if (processed !== undefined) filters.processed = processed === 'true';

    return this.providersService.findAll(tenantId, filters);
  }
}
