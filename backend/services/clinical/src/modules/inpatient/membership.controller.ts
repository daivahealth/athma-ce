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
import { MembershipService } from './membership.service';
import { AddMemberDto } from './dto/add-member.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';

@Controller('inpatient/channels')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  /**
   * Add member to care team
   * POST /api/v1/inpatient/channels/:channelId/members
   */
  @Post(':channelId/members')
  @HttpCode(HttpStatus.CREATED)
  async addMember(
    @Param('channelId') channelId: string,
    @Body() dto: AddMemberDto,
    @TenantId() tenantId: string,
    @Context() context: any,
  ) {
    return this.membershipService.addMember(
      channelId,
      dto,
      context.userId,
      tenantId,
    );
  }

  /**
   * Remove member from care team (soft delete)
   * DELETE /api/v1/inpatient/channels/:channelId/members/:memberId
   */
  @Delete(':channelId/members/:memberId')
  @HttpCode(HttpStatus.OK)
  async removeMember(
    @Param('memberId') memberId: string,
    @Body() dto: RemoveMemberDto,
    @TenantId() tenantId: string,
    @Context() context: any,
  ) {
    return this.membershipService.removeMember(
      memberId,
      dto.removalReason,
      context.userId,
      tenantId,
    );
  }

  /**
   * Get active members of channel
   * GET /api/v1/inpatient/channels/:channelId/members
   */
  @Get(':channelId/members')
  async getMembers(
    @Param('channelId') channelId: string,
    @Query('includeHistory') includeHistory: string,
    @TenantId() tenantId: string,
  ) {
    if (includeHistory === 'true') {
      return this.membershipService.getMembershipHistory(channelId, tenantId);
    }
    return this.membershipService.getActiveMembers(channelId, tenantId);
  }

  /**
   * Sync members from admission record
   * POST /api/v1/inpatient/channels/:channelId/members/sync
   */
  @Post(':channelId/members/sync')
  @HttpCode(HttpStatus.OK)
  async syncMembers(
    @Param('channelId') channelId: string,
    @Body('admissionId') admissionId: string,
    @TenantId() tenantId: string,
    @Context() context: any,
  ) {
    return this.membershipService.syncAdmissionTeam(
      admissionId,
      tenantId,
      context.userId,
    );
  }
}
