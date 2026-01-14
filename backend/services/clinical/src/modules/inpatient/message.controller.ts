import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { PostTextMessageDto } from './dto/post-message.dto';
import { GetTimelineDto } from './dto/get-timeline.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';

@Controller('inpatient/channels')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  /**
   * Post text message (human chat)
   * POST /api/v1/inpatient/channels/:channelId/messages
   */
  @Post(':channelId/messages')
  @HttpCode(HttpStatus.CREATED)
  async postMessage(
    @Param('channelId') channelId: string,
    @Body() dto: PostTextMessageDto,
    @Context() context: any,
  ) {
    return this.messageService.postTextMessage(
      channelId,
      dto,
      context.userId, // Assuming userId is staff ID
      context,
    );
  }

  /**
   * Get timeline (paginated messages)
   * GET /api/v1/inpatient/channels/:channelId/messages
   * Query params: limit, offset, messageType, messageSubtype, since, search
   */
  @Get(':channelId/messages')
  async getTimeline(
    @Param('channelId') channelId: string,
    @Query() filters: GetTimelineDto,
    @TenantId() tenantId: string,
  ) {
    return this.messageService.getTimeline(channelId, filters, tenantId);
  }

  /**
   * Get single message
   * GET /api/v1/inpatient/channels/:channelId/messages/:messageId
   */
  @Get(':channelId/messages/:messageId')
  async getMessage(
    @Param('messageId') messageId: string,
    @TenantId() tenantId: string,
  ) {
    return this.messageService.getMessage(messageId, tenantId);
  }

  /**
   * Delete message (soft delete)
   * DELETE /api/v1/inpatient/channels/:channelId/messages/:messageId
   */
  @Delete(':channelId/messages/:messageId')
  @HttpCode(HttpStatus.OK)
  async deleteMessage(
    @Param('messageId') messageId: string,
    @TenantId() tenantId: string,
    @Context() context: any,
  ) {
    return this.messageService.deleteMessage(
      messageId,
      context.userId,
      tenantId,
    );
  }

  /**
   * Search messages
   * GET /api/v1/inpatient/channels/:channelId/messages/search
   * Query param: q (search term)
   */
  @Get(':channelId/messages/search')
  async searchMessages(
    @Param('channelId') channelId: string,
    @Query('q') searchTerm: string,
    @TenantId() tenantId: string,
  ) {
    return this.messageService.searchMessages(channelId, searchTerm, tenantId);
  }
}
