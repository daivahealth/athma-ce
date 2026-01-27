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
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { PostTextMessageDto } from './dto/post-message.dto';
import { GetTimelineDto } from './dto/get-timeline.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  CARE_MESSAGE_READ,
  CARE_MESSAGE_CREATE,
  CARE_MESSAGE_DELETE,
} from '@zeal/contracts';

@Controller('inpatient/channels')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  /**
   * Post text message (human chat)
   * POST /api/v1/inpatient/channels/:channelId/messages
   */
  @Post(':channelId/messages')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(CARE_MESSAGE_CREATE)
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
  @Permissions(CARE_MESSAGE_READ)
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
  @Permissions(CARE_MESSAGE_READ)
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
  @Permissions(CARE_MESSAGE_DELETE)
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
  @Permissions(CARE_MESSAGE_READ)
  async searchMessages(
    @Param('channelId') channelId: string,
    @Query('q') searchTerm: string,
    @TenantId() tenantId: string,
  ) {
    return this.messageService.searchMessages(channelId, searchTerm, tenantId);
  }
}
