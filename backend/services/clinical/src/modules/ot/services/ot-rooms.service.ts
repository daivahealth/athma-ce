import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { OtFoundationService } from './ot-foundation.service';
import { UpdateOtRoomConfigDto, UpsertOtRoomConfigDto } from '../dto/ot-room.dto';

@Injectable()
export class OtRoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly foundationService: OtFoundationService,
  ) {}

  async list(tenantId: string, facilityId?: string, includeInactive = false) {
    const configs = await this.prisma.otRoomConfig.findMany({
      where: {
        tenantId,
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!facilityId) {
      const enriched = await Promise.all(
        configs.map(async (config) => ({
          ...config,
          space: await this.foundationService.getSpace(config.spaceId, tenantId),
        })),
      );
      return enriched;
    }

    const spaces = await this.foundationService.listSpaces(facilityId, tenantId);
    const spaceMap = new Map(spaces.map((space: any) => [space.id, space]));

    return configs
      .filter((config) => spaceMap.has(config.spaceId))
      .map((config) => ({
        ...config,
        space: spaceMap.get(config.spaceId) || null,
      }));
  }

  async getBySpaceId(tenantId: string, spaceId: string) {
    const config = await this.prisma.otRoomConfig.findUnique({
      where: {
        tenantId_spaceId: {
          tenantId,
          spaceId,
        },
      },
    });

    if (!config) {
      throw new NotFoundException(`OT room configuration for space ${spaceId} not found`);
    }

    return {
      ...config,
      space: await this.foundationService.getSpace(spaceId, tenantId),
    };
  }

  async getBySpaceIds(tenantId: string, spaceIds: string[]) {
    const uniqueSpaceIds = [...new Set(spaceIds.filter(Boolean))];
    if (uniqueSpaceIds.length === 0) {
      return new Map();
    }

    const configs = await this.prisma.otRoomConfig.findMany({
      where: {
        tenantId,
        spaceId: { in: uniqueSpaceIds },
      },
      orderBy: { createdAt: 'asc' },
    });

    const enriched = await Promise.all(
      configs.map(async (config) => ({
        ...config,
        space: await this.foundationService.getSpace(config.spaceId, tenantId),
      }))
    );

    return new Map(enriched.map((room) => [room.spaceId, room]));
  }

  async upsert(tenantId: string, userId: string, dto: UpsertOtRoomConfigDto) {
    const space = await this.foundationService.getSpace(dto.spaceId, tenantId);
    if (!space) {
      throw new BadRequestException(`Space ${dto.spaceId} not found in Foundation`);
    }

    const config = await this.prisma.otRoomConfig.upsert({
      where: {
        tenantId_spaceId: {
          tenantId,
          spaceId: dto.spaceId,
        },
      },
      create: {
        tenantId,
        spaceId: dto.spaceId,
        specialty: dto.specialty ?? null,
        isActive: dto.isActive ?? true,
        notes: dto.notes ?? null,
        createdBy: userId,
        updatedBy: userId,
      },
      update: {
        updatedBy: userId,
        ...(dto.specialty !== undefined ? { specialty: dto.specialty } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
    });

    return {
      ...config,
      space,
    };
  }

  async update(tenantId: string, spaceId: string, userId: string, dto: UpdateOtRoomConfigDto) {
    await this.getBySpaceId(tenantId, spaceId);

    const config = await this.prisma.otRoomConfig.update({
      where: {
        tenantId_spaceId: {
          tenantId,
          spaceId,
        },
      },
      data: {
        updatedBy: userId,
        ...(dto.specialty !== undefined ? { specialty: dto.specialty } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
    });

    return {
      ...config,
      space: await this.foundationService.getSpace(spaceId, tenantId),
    };
  }

  async ensureActiveRoom(tenantId: string, spaceId: string) {
    const room = await this.prisma.otRoomConfig.findUnique({
      where: {
        tenantId_spaceId: {
          tenantId,
          spaceId,
        },
      },
    });

    if (!room || !room.isActive) {
      throw new BadRequestException(`Space ${spaceId} is not configured as an active OT room`);
    }

    return room;
  }
}
