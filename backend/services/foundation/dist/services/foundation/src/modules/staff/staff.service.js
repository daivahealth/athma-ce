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
const config_service_1 = require("../config/config.service");
let StaffService = class StaffService {
    staffRepository;
    configService;
    constructor(staffRepository, configService) {
        this.staffRepository = staffRepository;
        this.configService = configService;
    }
    async create(dto) {
        const collision = await this.staffRepository.findByEmployeeId(dto.tenantId, dto.employeeId);
        if (collision) {
            throw new common_1.ConflictException('Employee ID already exists for tenant');
        }
        const prefix = dto.prefix?.trim() || null;
        const firstName = dto.firstName.trim();
        const lastName = dto.lastName.trim();
        const middleName = dto.middleName?.trim();
        const languages = (dto.languages ?? []).map((language) => language.trim()).filter((language) => language.length > 0);
        const qualification = dto.qualification?.trim() || null;
        const data = {
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
    async archive(id) {
        await this.get(id);
        await this.staffRepository.delete(id);
    }
    async buildDisplayName(tenantId, parts) {
        let template = '{prefix} {firstName} {middleName} {lastName}';
        try {
            const config = await this.configService.resolve('clinical.staff_name_format', {
                tenantId,
            });
            if (typeof config.value === 'string' && config.value.trim().length > 0) {
                template = config.value;
            }
        }
        catch (error) {
            // Fallback to default template if config missing
        }
        const replacementMap = {
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
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [staff_repository_1.StaffRepository,
        config_service_1.ConfigService])
], StaffService);
//# sourceMappingURL=staff.service.js.map