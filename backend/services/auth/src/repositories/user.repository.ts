import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import { RequestContext } from '@zeal/shared-utils';

export interface AuthUserRecord {
  id: string;
  email: string;
  passwordHash: string;
  tenantId: string;
  status: string;
}

@Injectable()
class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        tenantId: true,
        status: true,
      },
    });

    return user ?? null;
  }

  async findById(id: string): Promise<AuthUserRecord | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        tenantId: true,
        status: true,
      },
    });

    return user ?? null;
  }

  async updateLastLogin(userId: string): Promise<void> {
    const store = RequestContext.getStore();
    if (!store?.tenantId || !store?.userId) {
      throw new Error('Request context missing tenant/user for updateLastLogin');
    }

    await this.prisma.runWithRequestContext(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          lastLogin: new Date(),
        },
      });
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    const store = RequestContext.getStore();
    if (!store?.tenantId || !store?.userId) {
      throw new Error('Request context missing tenant/user for updatePassword');
    }

    await this.prisma.runWithRequestContext(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          passwordHash,
        },
      });
    });
  }
}

export { UserRepository };
