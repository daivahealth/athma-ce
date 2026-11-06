import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';

@Injectable()
export class StaffSpecialtyRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** True when the staff member belongs to the tenant. */
  async staffBelongsToTenant(tenantId: string, staffId: string): Promise<boolean> {
    const count = await this.prisma.staff.count({ where: { id: staffId, tenantId } });
    return count > 0;
  }

  /** True when the facility belongs to the tenant. */
  async facilityBelongsToTenant(tenantId: string, facilityId: string): Promise<boolean> {
    const count = await this.prisma.facility.count({ where: { id: facilityId, tenantId } });
    return count > 0;
  }

  async assignSpecialty(data: {
    tenantId: string;
    staffId: string;
    facilityId: string;
    specialtyId: string;
    primaryFlag: boolean;
  }) {
    // If setting as primary, first remove primary flag from all others AT THIS FACILITY
    if (data.primaryFlag) {
      await this.prisma.staffSpecialty.updateMany({
        where: {
          tenantId: data.tenantId,
          staffId: data.staffId,
          facilityId: data.facilityId,
        },
        data: {
          primaryFlag: false,
        },
      });
    }

    // Upsert the staff specialty
    return this.prisma.staffSpecialty.upsert({
      where: {
        staffId_specialtyId_facilityId: {
          staffId: data.staffId,
          specialtyId: data.specialtyId,
          facilityId: data.facilityId,
        },
      },
      create: data,
      update: {
        primaryFlag: data.primaryFlag,
      },
      include: {
        specialty: {
          include: {
            translations: true,
          },
        },
        facility: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async removeSpecialty(
    tenantId: string,
    staffId: string,
    facilityId: string,
    specialtyId: string
  ) {
    return this.prisma.staffSpecialty.deleteMany({
      where: { tenantId, staffId, facilityId, specialtyId },
    });
  }

  async getStaffSpecialties(
    tenantId: string,
    staffId: string,
    facilityId?: string,
    locale?: string
  ) {
    const where: any = { tenantId, staffId };
    if (facilityId) {
      where.facilityId = facilityId;
    }
    
    return this.prisma.staffSpecialty.findMany({
      where,
      include: {
        specialty: {
          include: {
            translations: locale
              ? {
                  where: { lang: locale },
                }
              : true,
            authorityCodes: true,
          },
        },
        facility: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: [{ primaryFlag: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async getPrimarySpecialty(tenantId: string, staffId: string, facilityId: string) {
    return this.prisma.staffSpecialty.findFirst({
      where: {
        tenantId,
        staffId,
        facilityId,
        primaryFlag: true,
      },
      include: {
        specialty: {
          include: {
            translations: true,
          },
        },
      },
    });
  }

  async findStaffBySpecialty(params: {
    tenantId: string;
    specialtyId?: string;
    specialtyCode?: string;
    staffType?: string;
    primaryOnly?: boolean;
    activeOnly?: boolean;
    facilityId?: string;
    locale?: string;
  }) {
    const {
      tenantId,
      specialtyId,
      specialtyCode,
      staffType,
      primaryOnly,
      activeOnly,
      facilityId,
      locale,
    } = params;

    // Build where clause
    const where: any = {
      tenantId,
      staff: {
        status: activeOnly ? 'active' : undefined,
        staffType: staffType || undefined,
      },
      primaryFlag: primaryOnly ? true : undefined,
    };

    // Add specialty filter
    if (specialtyId) {
      where.specialtyId = specialtyId;
    } else if (specialtyCode) {
      where.specialty = {
        code: specialtyCode,
      };
    }

    const staffSpecialties = await this.prisma.staffSpecialty.findMany({
      where,
      include: {
        staff: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                status: true,
              },
            },
            departments: facilityId
              ? {
                  where: { facilityId },
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                }
              : true,
          },
        },
        specialty: {
          include: {
            translations: locale
              ? {
                  where: { lang: locale },
                }
              : true,
          },
        },
      },
      orderBy: [
        { primaryFlag: 'desc' },
        { staff: { lastName: 'asc' } },
        { staff: { firstName: 'asc' } },
      ],
    });

    return staffSpecialties;
  }

  async bulkAssignSpecialties(data: {
    tenantId: string;
    staffId: string;
    facilityId: string;
    primarySpecialtyId: string;
    secondarySpecialtyIds?: string[];
  }) {
    const { tenantId, staffId, facilityId, primarySpecialtyId, secondarySpecialtyIds } = data;

    return this.prisma.$transaction(async (tx) => {
      // Remove all existing specialties FOR THIS FACILITY
      await tx.staffSpecialty.deleteMany({
        where: {
          tenantId,
          staffId,
          facilityId,
        },
      });

      // Add primary specialty
      const primary = await tx.staffSpecialty.create({
        data: {
          tenantId,
          staffId,
          facilityId,
          specialtyId: primarySpecialtyId,
          primaryFlag: true,
        },
        include: {
          specialty: {
            include: {
              translations: true,
            },
          },
          facility: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Add secondary specialties
      const secondaries = secondarySpecialtyIds
        ? await Promise.all(
            secondarySpecialtyIds.map((specialtyId) =>
              tx.staffSpecialty.create({
                data: {
                  tenantId,
                  staffId,
                  facilityId,
                  specialtyId,
                  primaryFlag: false,
                },
                include: {
                  specialty: {
                    include: {
                      translations: true,
                    },
                  },
                  facility: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              })
            )
          )
        : [];

      return {
        primary,
        secondaries,
      };
    });
  }

  async changePrimarySpecialty(
    tenantId: string,
    staffId: string,
    facilityId: string,
    newPrimarySpecialtyId: string
  ) {
    return this.prisma.$transaction(async (tx) => {
      // The new primary must already be assigned to this staff member, in this tenant
      const target = await tx.staffSpecialty.findFirst({
        where: { tenantId, staffId, facilityId, specialtyId: newPrimarySpecialtyId },
        select: { id: true },
      });
      if (!target) {
        return null;
      }

      // Remove primary flag from all AT THIS FACILITY
      await tx.staffSpecialty.updateMany({
        where: {
          tenantId,
          staffId,
          facilityId,
        },
        data: { primaryFlag: false },
      });

      // Set new primary
      const newPrimary = await tx.staffSpecialty.update({
        where: { id: target.id },
        data: { primaryFlag: true },
        include: {
          specialty: {
            include: {
              translations: true,
            },
          },
          facility: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return newPrimary;
    });
  }

  async getSpecialtyStats(tenantId: string) {
    // Count staff by specialty (primary only)
    const stats = await this.prisma.staffSpecialty.groupBy({
      by: ['specialtyId'],
      where: {
        tenantId,
        primaryFlag: true,
        staff: {
          status: 'active',
        },
      },
      _count: {
        staffId: true,
      },
    });

    // Enrich with specialty details
    const enriched = await Promise.all(
      stats.map(async (stat) => {
        const specialty = await this.prisma.specialty.findUnique({
          where: { id: stat.specialtyId },
          include: {
            translations: true,
          },
        });

        return {
          specialty,
          count: stat._count.staffId,
        };
      })
    );

    return enriched;
  }

  async getFacilitySpecialties(tenantId: string, facilityId: string, locale?: string) {
    // Get distinct specialties at this facility with staff counts
    const specialties = await this.prisma.staffSpecialty.groupBy({
      by: ['specialtyId'],
      where: {
        tenantId,
        facilityId,
        primaryFlag: true,
        staff: {
          status: 'active',
        },
      },
      _count: {
        staffId: true,
      },
    });

    // Enrich with specialty details and translations
    const enriched = await Promise.all(
      specialties.map(async (spec) => {
        const specialty = await this.prisma.specialty.findUnique({
          where: { id: spec.specialtyId },
          include: {
            translations: locale
              ? {
                  where: { lang: locale },
                }
              : true,
            authorityCodes: true,
          },
        });

        // Get staff list
        const staff = await this.prisma.staffSpecialty.findMany({
          where: {
            tenantId,
            facilityId,
            specialtyId: spec.specialtyId,
            primaryFlag: true,
            staff: {
              status: 'active',
            },
          },
          include: {
            staff: {
              select: {
                id: true,
                employeeId: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                email: true,
                licenseNumber: true,
              },
            },
          },
        });

        return {
          specialty,
          staffCount: spec._count.staffId,
          staff: staff.map((s) => s.staff),
        };
      })
    );

    return enriched.sort((a, b) => (b.staffCount || 0) - (a.staffCount || 0));
  }
}
