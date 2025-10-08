import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';
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
        availableBeds: data.totalBeds || 0,
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
      },
    });
  }

  async findAll(departmentId: string, wardType?: string) {
    return this.prisma.ward.findMany({
      where: {
        departmentId,
        ...(wardType && { wardType }),
        status: 'active',
      },
      include: {
        department: {
          select: {
            id: true,
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
        beds: {
          select: {
            id: true,
            bedNumber: true,
            bedType: true,
            status: true,
            currentPatientId: true,
            assignedAt: true,
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
        availableBeds: true,
        beds: {
          where: {
            status: 'available',
          },
          select: {
            id: true,
            bedNumber: true,
            bedType: true,
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

    const totalBeds = ward.beds.length;
    const availableBeds = ward.beds.filter((b) => b.status === 'available').length;

    return this.prisma.ward.update({
      where: { id: wardId },
      data: {
        totalBeds,
        availableBeds,
      },
    });
  }
}
