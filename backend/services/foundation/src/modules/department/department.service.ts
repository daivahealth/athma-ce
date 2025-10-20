import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DepartmentRepository } from './department.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from '@zeal/database-foundation';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly departmentRepo: DepartmentRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(facilityId: string, createDepartmentDto: CreateDepartmentDto) {
    // Verify facility exists
    const facility = await this.prisma.facility.findUnique({
      where: { id: facilityId },
      select: { id: true, tenantId: true, status: true },
    });

    if (!facility) {
      throw new NotFoundException(`Facility with ID ${facilityId} not found`);
    }

    if (facility.status !== 'active') {
      throw new BadRequestException('Cannot create department for inactive facility');
    }

    // Check if code already exists for this facility
    if (createDepartmentDto.code) {
      const codeExists = await this.departmentRepo.checkCodeExists(
        facilityId,
        createDepartmentDto.code,
      );
      if (codeExists) {
        throw new BadRequestException(
          `Department code '${createDepartmentDto.code}' already exists for this facility`,
        );
      }
    }

    // Verify head of department exists if provided
    if (createDepartmentDto.headOfDepartment) {
      const staff = await this.prisma.staff.findUnique({
        where: { id: createDepartmentDto.headOfDepartment },
        select: { id: true, tenantId: true, status: true },
      });

      if (!staff) {
        throw new NotFoundException(
          `Staff with ID ${createDepartmentDto.headOfDepartment} not found`,
        );
      }

      if (staff.tenantId !== facility.tenantId) {
        throw new BadRequestException('Staff must belong to the same tenant as the facility');
      }

      if (staff.status !== 'active') {
        throw new BadRequestException('Cannot assign inactive staff as head of department');
      }
    }

    return this.departmentRepo.create(facilityId, createDepartmentDto);
  }

  async findAll(facilityId: string, departmentType?: string) {
    // Verify facility exists
    const facility = await this.prisma.facility.findUnique({
      where: { id: facilityId },
      select: { id: true },
    });

    if (!facility) {
      throw new NotFoundException(`Facility with ID ${facilityId} not found`);
    }

    return this.departmentRepo.findAll(facilityId, departmentType);
  }

  async findOne(id: string) {
    const department = await this.departmentRepo.findOne(id);

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const existing = await this.departmentRepo.findOne(id);

    if (!existing) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    // Check if code is being changed and if it already exists
    if (updateDepartmentDto.code && updateDepartmentDto.code !== existing.code) {
      const codeExists = await this.departmentRepo.checkCodeExists(
        existing.facilityId,
        updateDepartmentDto.code,
        id,
      );
      if (codeExists) {
        throw new BadRequestException(
          `Department code '${updateDepartmentDto.code}' already exists for this facility`,
        );
      }
    }

    // Verify new head of department if provided
    if (updateDepartmentDto.headOfDepartment) {
      const staff = await this.prisma.staff.findUnique({
        where: { id: updateDepartmentDto.headOfDepartment },
        select: { id: true, tenantId: true, status: true },
      });

      if (!staff) {
        throw new NotFoundException(
          `Staff with ID ${updateDepartmentDto.headOfDepartment} not found`,
        );
      }

      if (staff.tenantId !== existing.facility.tenantId) {
        throw new BadRequestException('Staff must belong to the same tenant as the facility');
      }

      if (staff.status !== 'active') {
        throw new BadRequestException('Cannot assign inactive staff as head of department');
      }
    }

    return this.departmentRepo.update(id, updateDepartmentDto);
  }

  async remove(id: string) {
    const existing = await this.departmentRepo.findOne(id);

    if (!existing) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    // Check if department has active wards, clinics, or spaces
    const hasActiveWards = existing.wards.some((w) => w.status === 'active');
    const hasActiveClinics = existing.clinics.some((c) => c.status === 'active');
    const hasActiveSpaces = existing.spaces.some((s) => s.isActive);

    if (hasActiveWards || hasActiveClinics || hasActiveSpaces) {
      throw new BadRequestException(
        'Cannot deactivate department with active wards, clinics, or spaces',
      );
    }

    return this.departmentRepo.remove(id);
  }
}
