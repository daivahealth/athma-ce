import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@zeal/shared-database';

@Injectable()
export class TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; domain: string; settings?: Record<string, unknown> }) {
    return this.prisma.tenant.create({
      data: {
        name: data.name,
        domain: data.domain,
        settings: (data.settings ?? {}) as Prisma.InputJsonValue,
      },
    });
  }

  findMany() {
    return this.prisma.tenant.findMany({
      orderBy: { name: 'asc' },
    });
  }

  findByNameOrDomain(name: string, domain: string) {
    return this.prisma.tenant.findFirst({
      where: {
        OR: [{ name }, { domain }],
      },
    });
  }

  findById(id: string) {
    return this.prisma.tenant.findUnique({ where: { id } });
  }

  update(id: string, data: { name?: string; domain?: string; settings?: Record<string, unknown> }) {
    const updateData: Prisma.TenantUpdateInput = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.domain !== undefined) {
      updateData.domain = data.domain;
    }
    if (data.settings !== undefined) {
      updateData.settings = data.settings as Prisma.InputJsonValue;
    }

    return this.prisma.tenant.update({
      where: { id },
      data: updateData,
    });
  }

  delete(id: string) {
    return this.prisma.tenant.delete({ where: { id } });
  }
}
