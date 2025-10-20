import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';

@Injectable()
export class SpaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    facilityId: string;
    name: string;
    spaceNumber?: string;
    spaceType?: string;
    capacity?: number;
    isActive?: boolean;
  }) {
    return this.prisma.space.create({
      data: {
        facilityId: data.facilityId,
        name: data.name,
        spaceNumber: data.spaceNumber ?? null,
        spaceType: data.spaceType ?? 'general',
        capacity: data.capacity ?? 1,
        isActive: data.isActive ?? true,
      },
      select: this.selectFields,
    });
  }

  findMany(facilityId: string) {
    return this.prisma.space.findMany({
      where: { facilityId },
      orderBy: { name: 'asc' },
      select: this.selectFields,
    });
  }

  findById(id: string) {
    return this.prisma.space.findUnique({
      where: { id },
      select: this.selectFields,
    });
  }

  update(
    id: string,
    data: Partial<{
      name: string;
      spaceNumber: string;
      spaceType: string;
      capacity: number;
      isActive: boolean;
    }>,
  ) {
    return this.prisma.space.update({
      where: { id },
      data,
      select: this.selectFields,
    });
  }

  delete(id: string) {
    return this.prisma.space.update({
      where: { id },
      data: { isActive: false },
      select: this.selectFields,
    });
  }

  private readonly selectFields = {
    id: true,
    facilityId: true,
    name: true,
    spaceNumber: true,
    spaceType: true,
    capacity: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  } as const;
}
