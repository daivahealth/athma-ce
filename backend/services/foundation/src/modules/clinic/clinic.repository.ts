import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Injectable()
export class ClinicRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(departmentId: string, data: CreateClinicDto) {
    return this.prisma.clinic.create({
      data: {
        ...data,
        departmentId,
        totalRooms: data.totalRooms || 0,
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

  async findAll(departmentId: string, specialty?: string) {
    return this.prisma.clinic.findMany({
      where: {
        departmentId,
        ...(specialty && { specialty }),
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
            spaces: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.clinic.findUnique({
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
        spaces: {
          select: {
            id: true,
            name: true,
            spaceNumber: true,
            spaceType: true,
            floorNumber: true,
            capacity: true,
            isActive: true,
          },
          orderBy: {
            spaceNumber: 'asc',
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateClinicDto) {
    return this.prisma.clinic.update({
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
    return this.prisma.clinic.update({
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

    const existing = await this.prisma.clinic.findFirst({ where });
    return !!existing;
  }
}
