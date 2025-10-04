import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StaffRepository } from './staff.repository';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(private readonly staffRepository: StaffRepository) {}

  async create(dto: CreateStaffDto) {
    const collision = await this.staffRepository.findByEmployeeId(dto.tenantId, dto.employeeId);
    if (collision) {
      throw new ConflictException('Employee ID already exists for tenant');
    }

    const data: Parameters<StaffRepository['create']>[0] = {
      tenantId: dto.tenantId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: new Date(dto.dateOfBirth),
      gender: dto.gender,
      employeeId: dto.employeeId,
      staffType: dto.staffType,
    };

    if (dto.middleName !== undefined && dto.middleName !== null) {
      data.middleName = dto.middleName;
    }

    if (dto.phoneNumber !== undefined && dto.phoneNumber !== null) {
      data.phoneNumber = dto.phoneNumber;
    }

    if (dto.email !== undefined && dto.email !== null) {
      data.email = dto.email;
    }

    if (dto.licenseNumber !== undefined && dto.licenseNumber !== null) {
      data.licenseNumber = dto.licenseNumber;
    }

    if (dto.licenseExpiry !== undefined && dto.licenseExpiry !== null) {
      data.licenseExpiry = new Date(dto.licenseExpiry);
    }

    return this.staffRepository.create(data);
  }

  list(tenantId: string) {
    return this.staffRepository.findMany(tenantId);
  }

  async get(id: string) {
    const staff = await this.staffRepository.findById(id);
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }
    return staff;
  }

  async update(id: string, dto: UpdateStaffDto) {
    const current = await this.get(id);

    if (dto.employeeId && dto.employeeId !== current.employeeId) {
      const collision = await this.staffRepository.findByEmployeeId(current.tenantId, dto.employeeId);
      if (collision && collision.id !== id) {
        throw new ConflictException('Employee ID already exists for tenant');
      }
    }

    const updateData: Parameters<StaffRepository['update']>[1] = {};

    if (dto.firstName !== undefined && dto.firstName !== null) {
      updateData.firstName = dto.firstName;
    }

    if (dto.lastName !== undefined && dto.lastName !== null) {
      updateData.lastName = dto.lastName;
    }

    if (dto.middleName !== undefined) {
      updateData.middleName = dto.middleName ?? null;
    }

    if (dto.dateOfBirth !== undefined && dto.dateOfBirth !== null) {
      updateData.dateOfBirth = new Date(dto.dateOfBirth);
    }

    if (dto.gender !== undefined && dto.gender !== null) {
      updateData.gender = dto.gender;
    }

    if (dto.phoneNumber !== undefined) {
      updateData.phoneNumber = dto.phoneNumber ?? null;
    }

    if (dto.email !== undefined) {
      updateData.email = dto.email ?? null;
    }

    if (dto.staffType !== undefined && dto.staffType !== null) {
      updateData.staffType = dto.staffType;
    }

    if (dto.licenseNumber !== undefined) {
      updateData.licenseNumber = dto.licenseNumber ?? null;
    }

    if (dto.licenseExpiry !== undefined) {
      updateData.licenseExpiry = dto.licenseExpiry ? new Date(dto.licenseExpiry) : null;
    }

    return this.staffRepository.update(id, updateData);
  }

  async archive(id: string) {
    await this.get(id);
    await this.staffRepository.delete(id);
  }
}
