import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(facilityId: string, data: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: {
        ...data,
        facilityId,
        status: data.status || 'active',
      },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            tenantId: true,
          },
        },
        hod: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
          },
        },
      },
    });
  }

  async findAll(facilityId: string, departmentType?: string) {
    return this.prisma.department.findMany({
      where: {
        facilityId,
        ...(departmentType && { departmentType }),
        status: 'active',
      },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
          },
        },
        hod: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
          },
        },
        _count: {
          select: {
            wards: true,
            clinics: true,
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
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            tenantId: true,
          },
        },
        hod: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
          },
        },
        wards: {
          select: {
            id: true,
            name: true,
            code: true,
            wardType: true,
            totalBeds: true,
            availableBeds: true,
            status: true,
          },
        },
        clinics: {
          select: {
            id: true,
            name: true,
            code: true,
            specialty: true,
            totalRooms: true,
            status: true,
          },
        },
        spaces: {
          select: {
            id: true,
            name: true,
            spaceType: true,
            isActive: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { id },
      data,
      include: {
        facility: {
          select: {
            id: true,
            name: true,
          },
        },
        hod: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.department.update({
      where: { id },
      data: {
        status: 'inactive',
      },
    });
  }

  async checkCodeExists(facilityId: string, code: string, excludeId?: string) {
    const where: any = {
      facilityId,
      code,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existing = await this.prisma.department.findFirst({ where });
    return !!existing;
  }
}
