import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';

@Injectable()
export class SpecialtyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    return this.prisma.specialty.findMany({
      where,
      include: {
        translations: true,
        authorityCodes: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findByCode(code: string) {
    return this.prisma.specialty.findUnique({
      where: { code },
      include: {
        translations: true,
        authorityCodes: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.specialty.findUnique({
      where: { id },
      include: {
        translations: true,
        authorityCodes: true,
      },
    });
  }

  async findByAuthorityCode(authority: string, authorityCode: string) {
    return this.prisma.specialty.findFirst({
      where: {
        authorityCodes: {
          some: {
            authority,
            authorityCode,
            isActive: true,
          },
        },
      },
      include: {
        translations: true,
        authorityCodes: true,
      },
    });
  }

  async getWithTranslation(id: string, locale: string) {
    return this.prisma.specialty.findUnique({
      where: { id },
      include: {
        translations: {
          where: { lang: locale },
        },
        authorityCodes: true,
      },
    });
  }
}
