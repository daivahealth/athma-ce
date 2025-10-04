"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const staff_repository_1 = require("./staff.repository");
let StaffService = class StaffService {
    staffRepository;
    constructor(staffRepository) {
        this.staffRepository = staffRepository;
    }
    async create(dto) {
        const collision = await this.staffRepository.findByEmployeeId(dto.tenantId, dto.employeeId);
        if (collision) {
            throw new common_1.ConflictException('Employee ID already exists for tenant');
        }
        const data = {
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
    list(tenantId) {
        return this.staffRepository.findMany(tenantId);
    }
    async get(id) {
        const staff = await this.staffRepository.findById(id);
        if (!staff) {
            throw new common_1.NotFoundException('Staff member not found');
        }
        return staff;
    }
    async update(id, dto) {
        const current = await this.get(id);
        if (dto.employeeId && dto.employeeId !== current.employeeId) {
            const collision = await this.staffRepository.findByEmployeeId(current.tenantId, dto.employeeId);
            if (collision && collision.id !== id) {
                throw new common_1.ConflictException('Employee ID already exists for tenant');
            }
        }
        const updateData = {};
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
    async archive(id) {
        await this.get(id);
        await this.staffRepository.delete(id);
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [staff_repository_1.StaffRepository])
], StaffService);
//# sourceMappingURL=staff.service.js.map