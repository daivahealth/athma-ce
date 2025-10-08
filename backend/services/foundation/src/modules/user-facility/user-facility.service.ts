import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserFacilityRepository } from './user-facility.repository';
import { AssignFacilityDto } from './dto/assign-facility.dto';
import { SetDefaultFacilityDto } from './dto/set-default-facility.dto';
import { PrismaService } from '@zeal/shared-database';

@Injectable()
export class UserFacilityService {
  constructor(
    private readonly userFacilityRepo: UserFacilityRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Get all facilities for a user
   */
  async getUserFacilities(userId: string) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, tenantId: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const facilities = await this.userFacilityRepo.getUserFacilities(userId);
    const defaultFacility = facilities.find((f) => f.isDefault);

    return {
      defaultFacility: defaultFacility
        ? {
            id: defaultFacility.facility.id,
            name: defaultFacility.facility.name,
            facilityType: defaultFacility.facility.facilityType,
            accessLevel: defaultFacility.accessLevel,
          }
        : null,
      facilities: facilities.map((f) => ({
        id: f.facility.id,
        name: f.facility.name,
        facilityType: f.facility.facilityType,
        city: f.facility.city,
        emirate: f.facility.emirate,
        accessLevel: f.accessLevel,
        isDefault: f.isDefault,
        grantedAt: f.grantedAt,
      })),
    };
  }

  /**
   * Assign facility access to user
   */
  async assignFacility(userId: string, dto: AssignFacilityDto, grantedBy?: string) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, tenantId: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verify facility exists and belongs to same tenant
    const facility = await this.prisma.facility.findUnique({
      where: { id: dto.facilityId },
      select: { id: true, tenantId: true, name: true, status: true },
    });

    if (!facility) {
      throw new NotFoundException(`Facility with ID ${dto.facilityId} not found`);
    }

    if (facility.tenantId !== user.tenantId) {
      throw new BadRequestException('Facility must belong to the same tenant as the user');
    }

    if (facility.status !== 'active') {
      throw new BadRequestException('Cannot assign access to inactive facility');
    }

    const assignData: {
      userId: string;
      facilityId: string;
      accessLevel: string;
      grantedBy?: string;
      setAsDefault?: boolean;
    } = {
      userId,
      facilityId: dto.facilityId,
      accessLevel: dto.accessLevel || 'standard',
      setAsDefault: dto.setAsDefault || false,
    };

    if (grantedBy) {
      assignData.grantedBy = grantedBy;
    }

    const userFacility = await this.userFacilityRepo.assignFacility(assignData);

    return {
      success: true,
      facilityAccess: {
        facilityId: userFacility.facilityId,
        facilityName: (userFacility as any).facility?.name || facility.name,
        accessLevel: userFacility.accessLevel,
        isDefault: userFacility.isDefault,
        grantedAt: userFacility.grantedAt,
      },
    };
  }

  /**
   * Set default facility for user
   */
  async setDefaultFacility(userId: string, dto: SetDefaultFacilityDto) {
    try {
      const defaultFacility = await this.userFacilityRepo.setDefaultFacility(userId, dto.facilityId);

      if (!defaultFacility || !defaultFacility.facility) {
        throw new Error('Failed to set default facility');
      }

      return {
        success: true,
        defaultFacility: {
          id: defaultFacility.facility.id,
          name: defaultFacility.facility.name,
          facilityType: defaultFacility.facility.facilityType,
        },
      };
    } catch (error: any) {
      if (error.message === 'User does not have access to this facility') {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Revoke facility access for user
   */
  async revokeFacility(userId: string, facilityId: string) {
    try {
      await this.userFacilityRepo.revokeFacility(userId, facilityId);

      return {
        success: true,
        message: 'Facility access revoked successfully',
      };
    } catch (error: any) {
      if (error.message && error.message.includes('Cannot revoke access to default facility')) {
        throw new BadRequestException(error.message);
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Facility access not found');
      }
      throw error;
    }
  }

  /**
   * Check if user has access to facility
   */
  async hasAccessToFacility(userId: string, facilityId: string): Promise<boolean> {
    return this.userFacilityRepo.hasAccessToFacility(userId, facilityId);
  }

  /**
   * Get all users with access to a facility
   */
  async getFacilityUsers(facilityId: string) {
    const users = await this.userFacilityRepo.getFacilityUsers(facilityId);

    return {
      facilityId,
      users: users.map((u) => ({
        id: u.user.id,
        email: u.user.email,
        firstName: u.user.firstName,
        lastName: u.user.lastName,
        role: u.user.role,
        accessLevel: u.accessLevel,
        isDefault: u.isDefault,
        grantedAt: u.grantedAt,
      })),
    };
  }
}

