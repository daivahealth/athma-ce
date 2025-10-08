import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WardRepository } from './ward.repository';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { PrismaService } from '@zeal/shared-database';

@Injectable()
export class WardService {
  constructor(
    private readonly wardRepo: WardRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(departmentId: string, createWardDto: CreateWardDto) {
    // Verify department exists and is IPD type
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      select: { 
        id: true, 
        departmentType: true, 
        status: true,
        facility: {
          select: {
            tenantId: true,
          },
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }

    if (department.departmentType !== 'ipd') {
      throw new BadRequestException('Wards can only be created in IPD departments');
    }

    if (department.status !== 'active') {
      throw new BadRequestException('Cannot create ward for inactive department');
    }

    // Check if code already exists for this department
    if (createWardDto.code) {
      const codeExists = await this.wardRepo.checkCodeExists(departmentId, createWardDto.code);
      if (codeExists) {
        throw new BadRequestException(
          `Ward code '${createWardDto.code}' already exists for this department`,
        );
      }
    }

    return this.wardRepo.create(departmentId, createWardDto);
  }

  async findAll(departmentId: string, wardType?: string) {
    // Verify department exists
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      select: { id: true },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }

    return this.wardRepo.findAll(departmentId, wardType);
  }

  async findOne(id: string) {
    const ward = await this.wardRepo.findOne(id);

    if (!ward) {
      throw new NotFoundException(`Ward with ID ${id} not found`);
    }

    return ward;
  }

  async update(id: string, updateWardDto: UpdateWardDto) {
    const existing = await this.wardRepo.findOne(id);

    if (!existing) {
      throw new NotFoundException(`Ward with ID ${id} not found`);
    }

    // Check if code is being changed and if it already exists
    if (updateWardDto.code && updateWardDto.code !== existing.code) {
      const codeExists = await this.wardRepo.checkCodeExists(
        existing.departmentId,
        updateWardDto.code,
        id,
      );
      if (codeExists) {
        throw new BadRequestException(
          `Ward code '${updateWardDto.code}' already exists for this department`,
        );
      }
    }

    return this.wardRepo.update(id, updateWardDto);
  }

  async remove(id: string) {
    const existing = await this.wardRepo.findOne(id);

    if (!existing) {
      throw new NotFoundException(`Ward with ID ${id} not found`);
    }

    // Check if ward has occupied beds
    const hasOccupiedBeds = existing.beds.some((b) => b.status === 'occupied');

    if (hasOccupiedBeds) {
      throw new BadRequestException('Cannot deactivate ward with occupied beds');
    }

    return this.wardRepo.remove(id);
  }

  async getAvailability(id: string) {
    const availability = await this.wardRepo.getAvailability(id);

    if (!availability) {
      throw new NotFoundException(`Ward with ID ${id} not found`);
    }

    return {
      wardId: availability.id,
      wardName: availability.name,
      totalBeds: availability.totalBeds,
      availableBeds: availability.availableBeds,
      occupiedBeds: availability.totalBeds - availability.availableBeds,
      occupancyRate: availability.totalBeds > 0 
        ? ((availability.totalBeds - availability.availableBeds) / availability.totalBeds) * 100 
        : 0,
      availableBedsList: availability.beds,
    };
  }
}
