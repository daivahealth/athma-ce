var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { StaffRepository } from './staff.repository';
let StaffService = class StaffService {
    staffRepository;
    constructor(staffRepository) {
        this.staffRepository = staffRepository;
    }
    async createStaff(createStaffDto) {
        // Check if employee ID already exists
        const existingStaff = await this.staffRepository.findByEmployeeId(createStaffDto.tenantId, createStaffDto.employeeId);
        if (existingStaff) {
            throw new ConflictException('Staff member with this employee ID already exists');
        }
        return this.staffRepository.create(createStaffDto);
    }
    async getStaff(query) {
        return this.staffRepository.findMany(query);
    }
    async getStaffById(id) {
        const staff = await this.staffRepository.findById(id);
        if (!staff) {
            throw new NotFoundException('Staff member not found');
        }
        return staff;
    }
    async updateStaff(id, updateStaffDto) {
        const existingStaff = await this.staffRepository.findById(id);
        if (!existingStaff) {
            throw new NotFoundException('Staff member not found');
        }
        // Check for employee ID conflicts if being updated
        if (updateStaffDto.employeeId && updateStaffDto.employeeId !== existingStaff.employeeId) {
            const conflictStaff = await this.staffRepository.findByEmployeeId(existingStaff.tenantId, updateStaffDto.employeeId);
            if (conflictStaff && conflictStaff.id !== id) {
                throw new ConflictException('Staff member with this employee ID already exists');
            }
        }
        await this.staffRepository.update(id, updateStaffDto);
        return this.staffRepository.findById(id);
    }
    async deleteStaff(id) {
        const staff = await this.staffRepository.findById(id);
        if (!staff) {
            throw new NotFoundException('Staff member not found');
        }
        await this.staffRepository.delete(id);
    }
    async getStaffAvailability(id, query) {
        const staff = await this.staffRepository.findById(id);
        if (!staff) {
            throw new NotFoundException('Staff member not found');
        }
        return this.staffRepository.getAvailability(id, query);
    }
    async getStaffSchedule(id, query) {
        const staff = await this.staffRepository.findById(id);
        if (!staff) {
            throw new NotFoundException('Staff member not found');
        }
        return this.staffRepository.getSchedule(id, query);
    }
};
StaffService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [StaffRepository])
], StaffService);
export { StaffService };
//# sourceMappingURL=staff.service.js.map