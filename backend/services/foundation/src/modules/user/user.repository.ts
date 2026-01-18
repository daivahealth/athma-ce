import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    role?: string;
    staffId?: string;
  }) {
    return this.prisma.user.create({
      data: {
        tenantId: data.tenantId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash: data.passwordHash,
        role: data.role ?? 'user',
        staffId: data.staffId ?? null,
      },
      select: {
        id: true,
        tenantId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        staffId: true,
        createdAt: true,
        updatedAt: true,
        staff: {
          select: {
            id: true,
            employeeId: true,
            displayName: true,
            firstName: true,
            lastName: true,
            staffType: true,
          },
        },
      },
    });
  }

  findMany(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      orderBy: { lastName: 'asc' },
      select: {
        id: true,
        tenantId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        staffId: true,
        createdAt: true,
        updatedAt: true,
        staff: {
          select: {
            id: true,
            employeeId: true,
            displayName: true,
            firstName: true,
            lastName: true,
            staffType: true,
          },
        },
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        tenantId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        staffId: true,
        createdAt: true,
        updatedAt: true,
        staff: {
          select: {
            id: true,
            employeeId: true,
            displayName: true,
            firstName: true,
            lastName: true,
            staffType: true,
          },
        },
      },
    });
  }

  findByEmail(tenantId: string, email: string) {
    return this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email,
        },
      },
    });
  }

  update(
    id: string,
    data: Partial<{ firstName: string; lastName: string; role: string; status: string; passwordHash: string; email: string }>,
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        tenantId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
