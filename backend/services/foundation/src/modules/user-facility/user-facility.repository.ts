import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';

@Injectable()
export class UserFacilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all facilities for a user (excluding revoked access)
   */
  async getUserFacilities(userId: string) {
    return this.prisma.userFacility.findMany({
      where: {
        userId,
        revokedAt: null,
      },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            facilityType: true,
            city: true,
            emirate: true,
            status: true,
          },
        },
      },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
  }

  /**
   * Get user's default facility
   */
  async getDefaultFacility(userId: string) {
    return this.prisma.userFacility.findFirst({
      where: {
        userId,
        isDefault: true,
        revokedAt: null,
      },
      include: {
        facility: true,
      },
    });
  }

  /**
   * Check if user has access to a facility
   */
  async hasAccessToFacility(userId: string, facilityId: string): Promise<boolean> {
    const access = await this.prisma.userFacility.findUnique({
      where: {
        userId_facilityId: {
          userId,
          facilityId,
        },
      },
      select: { revokedAt: true },
    });

    return access !== null && access.revokedAt === null;
  }

  /**
   * Assign facility access to user
   */
  async assignFacility(data: {
    userId: string;
    facilityId: string;
    accessLevel: string;
    grantedBy?: string;
    setAsDefault?: boolean;
  }) {
    // If setting as default, unset other defaults first
    if (data.setAsDefault) {
      await this.prisma.userFacility.updateMany({
        where: {
          userId: data.userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Create or update the facility access
    const userFacility = await this.prisma.userFacility.upsert({
      where: {
        userId_facilityId: {
          userId: data.userId,
          facilityId: data.facilityId,
        },
      },
      create: {
        userId: data.userId,
        facilityId: data.facilityId,
        accessLevel: data.accessLevel,
        isDefault: data.setAsDefault || false,
        grantedBy: data.grantedBy || null,
        grantedAt: new Date(),
      },
      update: {
        accessLevel: data.accessLevel,
        isDefault: data.setAsDefault || false,
        revokedAt: null, // Restore access if previously revoked
        grantedBy: data.grantedBy || null,
        grantedAt: new Date(),
      },
      include: {
        facility: true,
      },
    });

    // If this is set as default, update the user's defaultFacilityId
    if (data.setAsDefault) {
      await this.prisma.user.update({
        where: { id: data.userId },
        data: { defaultFacilityId: data.facilityId },
      });
    }

    return userFacility;
  }

  /**
   * Set a facility as default for user
   */
  async setDefaultFacility(userId: string, facilityId: string) {
    // Verify user has access to this facility
    const hasAccess = await this.hasAccessToFacility(userId, facilityId);
    if (!hasAccess) {
      throw new Error('User does not have access to this facility');
    }

    // Unset current default
    await this.prisma.userFacility.updateMany({
      where: {
        userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    // Set new default
    await this.prisma.userFacility.update({
      where: {
        userId_facilityId: {
          userId,
          facilityId,
        },
      },
      data: {
        isDefault: true,
      },
    });

    // Update user's defaultFacilityId
    await this.prisma.user.update({
      where: { id: userId },
      data: { defaultFacilityId: facilityId },
    });

    return this.getDefaultFacility(userId);
  }

  /**
   * Revoke facility access for user
   */
  async revokeFacility(userId: string, facilityId: string) {
    // Check if this is the default facility
    const defaultFacility = await this.getDefaultFacility(userId);
    if (defaultFacility?.facilityId === facilityId) {
      throw new Error('Cannot revoke access to default facility. Set a new default facility first.');
    }

    return this.prisma.userFacility.update({
      where: {
        userId_facilityId: {
          userId,
          facilityId,
        },
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Get all users with access to a facility
   */
  async getFacilityUsers(facilityId: string) {
    return this.prisma.userFacility.findMany({
      where: {
        facilityId,
        revokedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
          },
        },
      },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
  }
}

