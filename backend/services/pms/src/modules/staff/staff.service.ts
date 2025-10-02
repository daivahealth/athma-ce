import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { StaffRepository } from './staff.repository';

@Injectable()
export class StaffService {
  constructor(private readonly staffRepository: StaffRepository) {}

  async createStaff(createStaffDto: any): Promise<any> {
    // Check if employee ID already exists
    const existingStaff = await this.staffRepository.findByEmployeeId(createStaffDto.employeeId);
    if (existingStaff) {
      throw new ConflictException('Staff member with this employee ID already exists');
    }

    return this.staffRepository.create(createStaffDto);
  }

  async getStaff(query: any): Promise<any> {
    return this.staffRepository.findMany(query);
  }

  async getStaffById(id: string): Promise<any> {
    const staff = await this.staffRepository.findById(id);
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }
    return staff;
  }

  async updateStaff(id: string, updateStaffDto: any): Promise<any> {
    const existingStaff = await this.staffRepository.findById(id);
    if (!existingStaff) {
      throw new NotFoundException('Staff member not found');
    }

    // Check for employee ID conflicts if being updated
    if (updateStaffDto.employeeId && updateStaffDto.employeeId !== existingStaff.employeeId) {
      const conflictStaff = await this.staffRepository.findByEmployeeId(updateStaffDto.employeeId);
      if (conflictStaff && conflictStaff.id !== id) {
        throw new ConflictException('Staff member with this employee ID already exists');
      }
    }

    await this.staffRepository.update(id, updateStaffDto);
    return this.staffRepository.findById(id);
  }

  async deleteStaff(id: string): Promise<void> {
    const staff = await this.staffRepository.findById(id);
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    await this.staffRepository.delete(id);
  }

  async getStaffAvailability(id: string, query: any): Promise<any> {
    const staff = await this.staffRepository.findById(id);
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return this.staffRepository.getAvailability(id, query);
  }

  async getStaffSchedule(id: string, query: any): Promise<any> {
    const staff = await this.staffRepository.findById(id);
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return this.staffRepository.getSchedule(id, query);
  }
}
