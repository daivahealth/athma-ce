import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ClinicRepository } from './clinic.repository';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { PrismaService } from '@zeal/shared-database';

@Injectable()
export class ClinicService {
  constructor(
    private readonly clinicRepo: ClinicRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(departmentId: string, createClinicDto: CreateClinicDto) {
    // Verify department exists and is OPD type
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

    if (department.departmentType !== 'opd') {
      throw new BadRequestException('Clinics can only be created in OPD departments');
    }

    if (department.status !== 'active') {
      throw new BadRequestException('Cannot create clinic for inactive department');
    }

    // Check if code already exists for this department
    if (createClinicDto.code) {
      const codeExists = await this.clinicRepo.checkCodeExists(departmentId, createClinicDto.code);
      if (codeExists) {
        throw new BadRequestException(
          `Clinic code '${createClinicDto.code}' already exists for this department`,
        );
      }
    }

    return this.clinicRepo.create(departmentId, createClinicDto);
  }

  async findAll(departmentId: string, specialty?: string) {
    // Verify department exists
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      select: { id: true },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }

    return this.clinicRepo.findAll(departmentId, specialty);
  }

  async findOne(id: string) {
    const clinic = await this.clinicRepo.findOne(id);

    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    return clinic;
  }

  async update(id: string, updateClinicDto: UpdateClinicDto) {
    const existing = await this.clinicRepo.findOne(id);

    if (!existing) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    // Check if code is being changed and if it already exists
    if (updateClinicDto.code && updateClinicDto.code !== existing.code) {
      const codeExists = await this.clinicRepo.checkCodeExists(
        existing.departmentId,
        updateClinicDto.code,
        id,
      );
      if (codeExists) {
        throw new BadRequestException(
          `Clinic code '${updateClinicDto.code}' already exists for this department`,
        );
      }
    }

    return this.clinicRepo.update(id, updateClinicDto);
  }

  async remove(id: string) {
    const existing = await this.clinicRepo.findOne(id);

    if (!existing) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    // Check if clinic has active spaces
    const hasActiveSpaces = existing.spaces.some((s) => s.isActive);

    if (hasActiveSpaces) {
      throw new BadRequestException('Cannot deactivate clinic with active spaces');
    }

    return this.clinicRepo.remove(id);
  }
}
