import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';

@Injectable()
export class BedRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(wardId: string, data: CreateBedDto) {
    return this.prisma.bed.create({
      data: {
        ...data,
        wardId,
        status: data.status || 'available',
      },
      include: {
        ward: {
          select: {
            id: true,
            name: true,
            departmentId: true,
          },
        },
      },
    });
  }

  async findAll(wardId: string, status?: string) {
    return this.prisma.bed.findMany({
      where: {
        wardId,
        ...(status && { status }),
      },
      include: {
        ward: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        bedNumber: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.bed.findUnique({
      where: { id },
      include: {
        ward: {
          select: {
            id: true,
            name: true,
            wardType: true,
            departmentId: true,
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
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateBedDto) {
    return this.prisma.bed.update({
      where: { id },
      data,
      include: {
        ward: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.bed.delete({
      where: { id },
    });
  }

  async assignPatient(bedId: string, patientId: string) {
    return this.prisma.bed.update({
      where: { id: bedId },
      data: {
        currentPatientId: patientId,
        status: 'occupied',
        assignedAt: new Date(),
      },
      include: {
        ward: true,
      },
    });
  }

  async releasePatient(bedId: string) {
    return this.prisma.bed.update({
      where: { id: bedId },
      data: {
        currentPatientId: null,
        status: 'available',
        assignedAt: null,
      },
      include: {
        ward: true,
      },
    });
  }

  async checkBedNumberExists(wardId: string, bedNumber: string, excludeId?: string) {
    const where: any = {
      wardId,
      bedNumber,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existing = await this.prisma.bed.findFirst({ where });
    return !!existing;
  }

  async findAvailable(wardId?: string) {
    return this.prisma.bed.findMany({
      where: {
        ...(wardId && { wardId }),
        status: 'available',
      },
      include: {
        ward: {
          select: {
            id: true,
            name: true,
            wardType: true,
            department: {
              select: {
                id: true,
                name: true,
                facility: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [
        { ward: { name: 'asc' } },
        { bedNumber: 'asc' },
      ],
    });
  }
}
