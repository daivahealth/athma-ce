import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  CARE_CHANNEL_READ,
  CARE_CHANNEL_CREATE,
  CARE_CHANNEL_CLOSE,
  CARE_CHANNEL_UPDATE,
} from '@zeal/contracts';

@Controller('inpatient/channels')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  /**
   * Get channel by admission ID
   * GET /api/v1/inpatient/admissions/:admissionId/channel
   */
  @Get(':admissionId/by-admission')
  @Permissions(CARE_CHANNEL_READ)
  async getChannelByAdmission(
    @Param('admissionId') admissionId: string,
    @TenantId() tenantId: string,
  ) {
    return this.channelService.getChannelByAdmissionId(admissionId, tenantId);
  }

  /**
   * Create channel (usually auto-created, but exposed for manual trigger)
   * POST /api/v1/inpatient/channels
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(CARE_CHANNEL_CREATE)
  async createChannel(
    @Body() dto: CreateChannelDto,
    @Context() context: any,
  ) {
    return this.channelService.createChannel(dto.admissionId, context);
  }

  /**
   * Close channel
   * PATCH /api/v1/inpatient/channels/:channelId/close
   */
  @Patch(':channelId/close')
  @Permissions(CARE_CHANNEL_CLOSE)
  async closeChannel(
    @Param('channelId') channelId: string,
    @Body('closureReason') closureReason: string,
    @TenantId() tenantId: string,
    @Context() context: any,
  ) {
    return this.channelService.closeChannel(
      channelId,
      closureReason || 'manual_closure',
      context.userId,
      tenantId,
    );
  }

  /**
   * Reopen channel
   * PATCH /api/v1/inpatient/channels/:channelId/reopen
   */
  @Patch(':channelId/reopen')
  @Permissions(CARE_CHANNEL_UPDATE)
  async reopenChannel(
    @Param('channelId') channelId: string,
    @TenantId() tenantId: string,
    @Context() context: any,
  ) {
    return this.channelService.reopenChannel(
      channelId,
      context.userId,
      tenantId,
    );
  }
}
