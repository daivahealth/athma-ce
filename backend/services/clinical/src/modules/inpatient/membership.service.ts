import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CareTeamRole } from '@zeal/database-clinical';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Add a member to the care channel
   * @param channelId - Channel ID
   * @param dto - Member details
   * @param userId - User adding the member
   * @param tenantId - Tenant ID
   * @returns Created membership
   */
  async addMember(channelId: string, dto: AddMemberDto, userId: string, tenantId: string) {
    // Verify channel exists
    const channel = await this.prisma.careChannel.findUnique({
      where: { id: channelId, tenantId },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with ID ${channelId} not found`);
    }

    // Check if member already active in channel
    const existingMember = await this.prisma.careChannelMember.findFirst({
      where: {
        channelId,
        staffId: dto.staffId,
        removedAt: null, // Active member
        tenantId,
      },
    });

    if (existingMember) {
      throw new BadRequestException(
        `Staff ${dto.staffId} is already an active member of this channel`,
      );
    }

    // Add member
    const member = await this.prisma.careChannelMember.create({
      data: {
        tenantId,
        channelId,
        staffId: dto.staffId,
        memberRole: dto.memberRole,
        addedBy: userId,
      },
    });

    this.logger.log(
      `Member added to channel ${channelId}: ${dto.staffId} as ${dto.memberRole}`,
    );

    return member;
  }

  /**
   * Remove a member from the care channel (temporal removal)
   * @param memberId - Membership ID
   * @param reason - Removal reason
   * @param userId - User removing the member
   * @param tenantId - Tenant ID
   * @returns Updated membership
   */
  async removeMember(memberId: string, reason: string | undefined, userId: string, tenantId: string) {
    const member = await this.prisma.careChannelMember.findUnique({
      where: { id: memberId, tenantId },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    if (member.removedAt) {
      throw new BadRequestException(`Member ${memberId} has already been removed`);
    }

    // Temporal removal
    const updatedMember = await this.prisma.careChannelMember.update({
      where: { id: memberId },
      data: {
        removedAt: new Date(),
        removedBy: userId,
        removalReason: reason || null,
      },
    });

    this.logger.log(
      `Member removed from channel: ${member.staffId}. Reason: ${reason || 'Not specified'}`,
    );

    return updatedMember;
  }

  /**
   * Get active members of a channel
   * @param channelId - Channel ID
   * @param tenantId - Tenant ID
   * @returns List of active members
   */
  async getActiveMembers(channelId: string, tenantId: string) {
    return this.prisma.careChannelMember.findMany({
      where: {
        channelId,
        tenantId,
        removedAt: null, // Active only
      },
      orderBy: [{ memberRole: 'asc' }, { addedAt: 'asc' }],
    });
  }

  /**
   * Get full membership history (including removed members)
   * @param channelId - Channel ID
   * @param tenantId - Tenant ID
   * @returns Full membership history
   */
  async getMembershipHistory(channelId: string, tenantId: string) {
    return this.prisma.careChannelMember.findMany({
      where: {
        channelId,
        tenantId,
      },
      orderBy: { addedAt: 'desc' },
    });
  }

  /**
   * Sync care team from admission record
   * Auto-adds attending physician, primary nurse, and consulting physicians
   * @param admissionId - Admission ID
   * @param tenantId - Tenant ID
   * @param userId - User performing the sync (system user)
   * @returns List of added members
   */
  async syncAdmissionTeam(admissionId: string, tenantId: string, userId: string) {
    // Get admission with care team
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
      select: {
        attendingPhysicianId: true,
        primaryNurseId: true,
        consultingPhysicians: true,
        careChannel: {
          select: { id: true },
        },
      },
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${admissionId} not found`);
    }

    if (!admission.careChannel) {
      throw new NotFoundException(`No care channel exists for admission ${admissionId}`);
    }

    const channelId = admission.careChannel.id;
    const addedMembers = [];

    // Add attending physician
    try {
      const attendingMember = await this.addMember(
        channelId,
        {
          staffId: admission.attendingPhysicianId,
          memberRole: CareTeamRole.ATTENDING_PHYSICIAN,
        },
        userId,
        tenantId,
      );
      addedMembers.push(attendingMember);
    } catch (error: any) {
      // Member might already exist - log and continue
      this.logger.warn(
        `Could not add attending physician to channel ${channelId}: ${error.message}`,
      );
    }

    // Add primary nurse if present
    if (admission.primaryNurseId) {
      try {
        const nurseMember = await this.addMember(
          channelId,
          {
            staffId: admission.primaryNurseId,
            memberRole: CareTeamRole.PRIMARY_NURSE,
          },
          userId,
          tenantId,
        );
        addedMembers.push(nurseMember);
      } catch (error: any) {
        this.logger.warn(
          `Could not add primary nurse to channel ${channelId}: ${error.message}`,
        );
      }
    }

    // Add consulting physicians
    if (admission.consultingPhysicians && admission.consultingPhysicians.length > 0) {
      for (const consultingPhysicianId of admission.consultingPhysicians) {
        try {
          const consultingMember = await this.addMember(
            channelId,
            {
              staffId: consultingPhysicianId,
              memberRole: CareTeamRole.CONSULTING_PHYSICIAN,
            },
            userId,
            tenantId,
          );
          addedMembers.push(consultingMember);
        } catch (error: any) {
          this.logger.warn(
            `Could not add consulting physician ${consultingPhysicianId} to channel ${channelId}: ${error.message}`,
          );
        }
      }
    }

    this.logger.log(
      `Team synced to channel ${channelId}: ${addedMembers.length} members added`,
    );

    return addedMembers;
  }
}
