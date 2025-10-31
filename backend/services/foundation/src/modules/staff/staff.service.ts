import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StaffRepository } from './staff.repository';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ConfigService } from '../config/config.service';

@Injectable()
export class StaffService {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly configService: ConfigService
  ) {}

  async create(dto: CreateStaffDto) {
    const collision = await this.staffRepository.findByEmployeeId(dto.tenantId, dto.employeeId);
    if (collision) {
      throw new ConflictException('Employee ID already exists for tenant');
    }

    const prefix = dto.prefix?.trim() || null;
    const firstName = dto.firstName.trim();
    const lastName = dto.lastName.trim();
    const middleName = dto.middleName?.trim();
    const languages = (dto.languages ?? []).map((language) => language.trim()).filter((language) => language.length > 0);
    const qualification = dto.qualification?.trim() || null;

    const data: Parameters<StaffRepository['create']>[0] = {
      tenantId: dto.tenantId,
      prefix,
      firstName,
      lastName,
      dateOfBirth: new Date(dto.dateOfBirth),
      gender: dto.gender,
      employeeId: dto.employeeId,
      staffType: dto.staffType,
      qualification,
      languages,
      displayName: '',
    };

    if (dto.middleName !== undefined && dto.middleName !== null) {
      data.middleName = middleName ?? null;
    }

    if (dto.phoneNumber !== undefined && dto.phoneNumber !== null) {
      data.phoneNumber = dto.phoneNumber ?? null;
    }

    if (dto.email !== undefined && dto.email !== null) {
      data.email = dto.email ?? null;
    }

    if (dto.licenseNumber !== undefined && dto.licenseNumber !== null) {
      data.licenseNumber = dto.licenseNumber ?? null;
    }

    if (dto.licenseExpiry !== undefined && dto.licenseExpiry !== null) {
      data.licenseExpiry = new Date(dto.licenseExpiry);
    }

    data.displayName = await this.buildDisplayName(dto.tenantId, {
      prefix: data.prefix ?? null,
      firstName: data.firstName,
      middleName: data.middleName ?? null,
      lastName: data.lastName,
    });

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

    if (dto.prefix !== undefined) {
      updateData.prefix = dto.prefix ? dto.prefix.trim() : null;
    }

    if (dto.firstName !== undefined && dto.firstName !== null) {
      updateData.firstName = dto.firstName.trim();
    }

    if (dto.lastName !== undefined && dto.lastName !== null) {
      updateData.lastName = dto.lastName.trim();
    }

    if (dto.middleName !== undefined) {
      updateData.middleName = dto.middleName ? dto.middleName.trim() : null;
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

    if (dto.qualification !== undefined) {
      updateData.qualification = dto.qualification ? dto.qualification.trim() : null;
    }

    if (dto.languages !== undefined) {
      updateData.languages = (dto.languages ?? []).map((language) => language.trim()).filter((language) => language.length > 0);
    }

    const effectivePrefix = updateData.prefix ?? current.prefix ?? null;
    const effectiveFirstName = updateData.firstName ?? current.firstName;
    const effectiveMiddleName = updateData.middleName !== undefined ? updateData.middleName : current.middleName ?? null;
    const effectiveLastName = updateData.lastName ?? current.lastName;

    updateData.displayName = await this.buildDisplayName(current.tenantId, {
      prefix: effectivePrefix,
      firstName: effectiveFirstName,
      middleName: effectiveMiddleName,
      lastName: effectiveLastName,
    });

    return this.staffRepository.update(id, updateData);
  }

  async archive(id: string) {
    await this.get(id);
    await this.staffRepository.delete(id);
  }

  private async buildDisplayName(
    tenantId: string,
    parts: { prefix: string | null; firstName: string; middleName: string | null; lastName: string }
  ): Promise<string> {
    let template = '{prefix} {firstName} {middleName} {lastName}';

    try {
      const config = await this.configService.resolve('clinical.staff_name_format', {
        tenantId,
      });

      if (typeof config.value === 'string' && config.value.trim().length > 0) {
        template = config.value;
      }
    } catch (error) {
      // Fallback to default template if config missing
    }

    const replacementMap: Record<string, string> = {
      prefix: parts.prefix ?? '',
      firstName: parts.firstName ?? '',
      middleName: parts.middleName ?? '',
      lastName: parts.lastName ?? '',
    };

    let result = template;
    for (const [key, value] of Object.entries(replacementMap)) {
      const regex = new RegExp(`\\{${key}\\}`, 'gi');
      result = result.replace(regex, value.trim());
    }

    // Remove any unresolved placeholders
    result = result.replace(/\{[^}]+\}/g, '');

    // Collapse whitespace and trim
    result = result
      .split(' ')
      .filter((segment) => segment.trim().length > 0)
      .join(' ')
      .trim();

    if (result.length === 0) {
      result = [parts.prefix, parts.firstName, parts.middleName, parts.lastName]
        .filter((segment) => (segment ?? '').trim().length > 0)
        .join(' ')
        .trim();
    }

    return result;
  }
}
