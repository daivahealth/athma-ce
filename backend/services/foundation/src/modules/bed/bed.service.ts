import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BedRepository } from './bed.repository';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';
import { PrismaService as FoundationPrismaService } from '@zeal/database-foundation';
import { WardRepository } from '../ward/ward.repository';

@Injectable()
export class BedService {
  constructor(
    private readonly bedRepo: BedRepository,
    private readonly wardRepo: WardRepository,
    private readonly foundationPrisma: FoundationPrismaService,
  ) {}

  async create(wardId: string, createBedDto: CreateBedDto) {
    // Verify ward exists
    const ward = await this.foundationPrisma.ward.findUnique({
      where: { id: wardId },
      select: { 
        id: true, 
        status: true,
        department: {
          select: {
            facility: {
              select: {
                tenantId: true,
              },
            },
          },
        },
      },
    });

    if (!ward) {
      throw new NotFoundException(`Ward with ID ${wardId} not found`);
    }

    if (ward.status !== 'active') {
      throw new BadRequestException('Cannot create bed for inactive ward');
    }

    // Check if bed number already exists for this ward
    const bedNumberExists = await this.bedRepo.checkBedNumberExists(wardId, createBedDto.bedNumber);
    if (bedNumberExists) {
      throw new BadRequestException(
        `Bed number '${createBedDto.bedNumber}' already exists for this ward`,
      );
    }

    // Create bed
    const bed = await this.bedRepo.create(wardId, createBedDto);

    // Update ward bed counts
    await this.wardRepo.updateBedCounts(wardId);

    return bed;
  }

  async findAll(wardId: string, status?: string) {
    // Verify ward exists
    const ward = await this.foundationPrisma.ward.findUnique({
      where: { id: wardId },
      select: { id: true },
    });

    if (!ward) {
      throw new NotFoundException(`Ward with ID ${wardId} not found`);
    }

    return this.bedRepo.findAll(wardId, status);
  }

  async findOne(id: string) {
    const bed = await this.bedRepo.findOne(id);

    if (!bed) {
      throw new NotFoundException(`Bed with ID ${id} not found`);
    }

    return bed;
  }

  async update(id: string, updateBedDto: UpdateBedDto) {
    const existing = await this.bedRepo.findOne(id);

    if (!existing) {
      throw new NotFoundException(`Bed with ID ${id} not found`);
    }

    // Check if bed number is being changed and if it already exists
    if (updateBedDto.bedNumber && updateBedDto.bedNumber !== existing.bedNumber) {
      const bedNumberExists = await this.bedRepo.checkBedNumberExists(
        existing.wardId,
        updateBedDto.bedNumber,
        id,
      );
      if (bedNumberExists) {
        throw new BadRequestException(
          `Bed number '${updateBedDto.bedNumber}' already exists for this ward`,
        );
      }
    }

    return this.bedRepo.update(id, updateBedDto);
  }

  async remove(id: string) {
    const existing = await this.bedRepo.findOne(id);

    if (!existing) {
      throw new NotFoundException(`Bed with ID ${id} not found`);
    }

    const wardId = existing.wardId;

    // Delete bed
    await this.bedRepo.remove(id);

    // Update ward bed counts
    await this.wardRepo.updateBedCounts(wardId);

    return { success: true, message: 'Bed deleted successfully' };
  }

  async findAvailable(wardId?: string, filters?: { bedType?: string; genderRestriction?: string; requiresIsolation?: boolean }) {
    return this.bedRepo.findAvailable(wardId, filters);
  }
}
