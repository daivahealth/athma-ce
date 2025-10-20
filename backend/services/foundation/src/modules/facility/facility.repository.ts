import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';

@Injectable()
export class FacilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    tenantId: string;
    name: string;
    facilityType?: string;
    licenseNumber?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    emirate?: string;
    postalCode?: string;
    phoneNumber?: string;
    email?: string;
    website?: string;
  }) {
    return this.prisma.facility.create({
      data,
      select: this.selectFields,
    });
  }

  findMany(tenantId: string) {
    return this.prisma.facility.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
      select: this.selectFields,
    });
  }

  findById(id: string) {
    return this.prisma.facility.findUnique({
      where: { id },
      select: this.selectFields,
    });
  }

  update(
    id: string,
    data: Partial<{
      name: string;
      facilityType: string;
      licenseNumber: string;
      addressLine1: string;
      addressLine2: string;
      city: string;
      emirate: string;
      postalCode: string;
      phoneNumber: string;
      email: string;
      website: string;
      status: string;
    }>,
  ) {
    return this.prisma.facility.update({
      where: { id },
      data,
      select: this.selectFields,
    });
  }

  delete(id: string) {
    return this.prisma.facility.update({
      where: { id },
      data: { status: 'inactive' },
      select: this.selectFields,
    });
  }

  private readonly selectFields = {
    id: true,
    tenantId: true,
    name: true,
    facilityType: true,
    licenseNumber: true,
    addressLine1: true,
    addressLine2: true,
    city: true,
    emirate: true,
    postalCode: true,
    phoneNumber: true,
    email: true,
    website: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  } as const;
}
