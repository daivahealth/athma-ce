import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';

@Injectable()
export class StaffRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    tenantId: string;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    dateOfBirth: Date;
    gender: string;
    phoneNumber?: string | null;
    email?: string | null;
    employeeId: string;
    staffType: string;
    licenseNumber?: string | null;
    licenseExpiry?: Date | null;
  }) {
    return this.prisma.staff.create({
      data,
      select: this.selectFields,
    });
  }

  findMany(tenantId: string) {
    return this.prisma.staff.findMany({
      where: { tenantId },
      orderBy: { lastName: 'asc' },
      select: this.selectFields,
    });
  }

  findById(id: string) {
    return this.prisma.staff.findUnique({
      where: { id },
      select: this.selectFields,
    });
  }

  findByEmployeeId(tenantId: string, employeeId: string) {
    return this.prisma.staff.findFirst({
      where: {
        tenantId,
        employeeId,
      },
      select: this.selectFields,
    });
  }

  update(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      middleName: string | null;
      dateOfBirth: Date;
      gender: string;
      phoneNumber: string | null;
      email: string | null;
      staffType: string;
      licenseNumber: string | null;
      licenseExpiry: Date | null;
      status: string;
    }>,
  ) {
    return this.prisma.staff.update({
      where: { id },
      data,
      select: this.selectFields,
    });
  }

  delete(id: string) {
    return this.prisma.staff.update({
      where: { id },
      data: { status: 'inactive' },
      select: this.selectFields,
    });
  }

  private readonly selectFields = {
    id: true,
    tenantId: true,
    firstName: true,
    lastName: true,
    middleName: true,
    dateOfBirth: true,
    gender: true,
    phoneNumber: true,
    email: true,
    employeeId: true,
    staffType: true,
    licenseNumber: true,
    licenseExpiry: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  } as const;
}
