import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';

@Injectable()
export class StaffRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    tenantId: string;
    prefix?: string | null;
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
    qualification?: string | null;
    languages: string[];
    displayName: string;
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
      prefix: string | null;
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
      qualification: string | null;
      languages: string[];
      displayName: string;
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
    prefix: true,
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
    qualification: true,
    languages: true,
    displayName: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    staffSpecialties: {
      select: {
        facilityId: true,
        primaryFlag: true,
        specialty: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    },
  } as const;
}
