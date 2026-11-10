/**
 * Messages Controller
 * Read-only access to patient message history
 */

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@zeal/shared-utils';
import { MessagesService } from './messages.service';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { ListMessagesQueryDto } from './dto/list-messages.query';

@ApiTags('Patients')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('v1/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get patient message history' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully, as { data, total, limit, offset }',
  })
  async findAll(@TenantId() tenantId: string, @Query() query: ListMessagesQueryDto) {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;
    const { data, total } = await this.messagesService.findAll(tenantId, {
      patientId: query.patientId || undefined,
      channel: query.channel || undefined,
      status: query.status || undefined,
      limit,
      offset,
    });

    return { data, total, limit, offset };
  }

  @Get(':messageId')
  @ApiOperation({ summary: 'Get message by ID' })
  @ApiResponse({ status: 200, description: 'Message retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async findOne(@TenantId() tenantId: string, @Param('messageId') messageId: string) {
    return this.messagesService.findOne(tenantId, messageId);
  }
}
