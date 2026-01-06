import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';

@Injectable()
export class WardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(departmentId: string, data: CreateWardDto) {
    return this.prisma.ward.create({
      data: {
        ...data,
        departmentId,
        totalBeds: data.totalBeds || 0,
        status: data.status || 'active',
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            facilityId: true,
          },
        },
        specialty: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(departmentId: string, filters?: { wardType?: string; genderRestriction?: string; specialtyId?: string }) {
    const where: any = {
      departmentId,
      status: 'active',
    };

    if (filters?.wardType) {
      where.wardType = filters.wardType;
    }

    if (filters?.genderRestriction) {
      where.genderRestriction = filters.genderRestriction;
    }

    if (filters?.specialtyId) {
      where.specialtyId = filters.specialtyId;
    }

    return this.prisma.ward.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        specialty: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        _count: {
          select: {
            beds: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.ward.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            facilityId: true,
            facility: {
              select: {
                id: true,
                name: true,
                tenantId: true,
              },
            },
          },
        },
        specialty: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        beds: {
          select: {
            id: true,
            bedNumber: true,
            bedType: true,
            status: true,
            features: true,
            requiresIsolation: true,
            isolationType: true,
            genderRestriction: true,
          },
          orderBy: {
            bedNumber: 'asc',
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateWardDto) {
    return this.prisma.ward.update({
      where: { id },
      data,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.ward.update({
      where: { id },
      data: {
        status: 'inactive',
      },
    });
  }

  async checkCodeExists(departmentId: string, code: string, excludeId?: string) {
    const where: any = {
      departmentId,
      code,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existing = await this.prisma.ward.findFirst({ where });
    return !!existing;
  }

  async getAvailability(id: string) {
    return this.prisma.ward.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        totalBeds: true,
        beds: {
          where: {
            status: 'active',
          },
          select: {
            id: true,
            bedNumber: true,
            bedType: true,
            features: true,
            requiresIsolation: true,
            genderRestriction: true,
          },
        },
      },
    });
  }

  async updateBedCounts(wardId: string) {
    const ward = await this.prisma.ward.findUnique({
      where: { id: wardId },
      include: {
        beds: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!ward) return null;

    const totalBeds = ward.beds.filter((b) => b.status === 'active').length;

    return this.prisma.ward.update({
      where: { id: wardId },
      data: {
        totalBeds,
      },
    });
  }
}
