import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';

@Injectable()
export class StaffRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<any> {
    return this.prisma.staff.create({
      data: {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        licenseExpiry: data.licenseExpiry ? new Date(data.licenseExpiry) : undefined,
      },
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.staff.findUnique({
      where: { id },
    });
  }

  async findByEmployeeId(tenantId: string, employeeId: string): Promise<any> {
    return this.prisma.staff.findUnique({
      where: { 
        tenantId_employeeId: {
          tenantId,
          employeeId
        }
      },
    });
  }

  async findMany(query: any): Promise<any> {
    const { page = 1, limit = 20, staffType, status, facilityId, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (staffType) where.staffType = staffType;
    if (status) where.status = status;

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [staff, total] = await Promise.all([
      this.prisma.staff.findMany({
        where,
        orderBy: { lastName: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.staff.count({ where }),
    ]);

    return {
      data: staff,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async update(id: string, data: any): Promise<any> {
    const updateData: any = { ...data };

    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }
    if (data.licenseExpiry) {
      updateData.licenseExpiry = new Date(data.licenseExpiry);
    }

    return this.prisma.staff.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<any> {
    return this.prisma.staff.update({
      where: { id },
      data: { status: 'terminated' },
    });
  }

  async getAvailability(id: string, query: any): Promise<any> {
    // This would implement staff availability logic
    // For now, return a simple structure
    return {
      staffId: id,
      available: true,
      schedule: [],
    };
  }

  async getSchedule(id: string, query: any): Promise<any> {
    // Get appointments for this staff member
    const appointments = await this.prisma.appointment.findMany({
      where: {
        staffId: id,
        startTime: {
          gte: query.from ? new Date(query.from) : new Date(),
        },
        endTime: {
          lte: query.to ? new Date(query.to) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        facility: {
          select: {
            id: true,
            name: true,
          },
        },
        space: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    return {
      staffId: id,
      appointments,
    };
  }
}
