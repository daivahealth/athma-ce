import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';

@Controller('inpatient/channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  /**
   * Get channel by admission ID
   * GET /api/v1/inpatient/admissions/:admissionId/channel
   */
  @Get(':admissionId/by-admission')
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
