/**
 * Messages Controller
 * Read-only access to patient message history
 */

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@zeal/shared-utils';
import { MessagesService } from './messages.service';
import { TenantId } from '../common/decorators/tenant-id.decorator';

@ApiTags('Patients')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('v1/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get patient message history' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'channel', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('patientId') patientId?: string,
    @Query('channel') channel?: string,
    @Query('status') status?: string,
  ) {
    const filters: any = {};
    if (patientId) filters.patientId = patientId;
    if (channel) filters.channel = channel;
    if (status) filters.status = status;

    return this.messagesService.findAll(tenantId, filters);
  }

  @Get(':messageId')
  @ApiOperation({ summary: 'Get message by ID' })
  @ApiResponse({ status: 200, description: 'Message retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async findOne(@TenantId() tenantId: string, @Param('messageId') messageId: string) {
    return this.messagesService.findOne(tenantId, messageId);
  }
}
