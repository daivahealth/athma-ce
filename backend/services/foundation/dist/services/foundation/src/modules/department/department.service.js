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
exports.DepartmentService = void 0;
const common_1 = require("@nestjs/common");
const department_repository_1 = require("./department.repository");
const database_foundation_1 = require("@zeal/database-foundation");
let DepartmentService = class DepartmentService {
    departmentRepo;
    prisma;
    constructor(departmentRepo, prisma) {
        this.departmentRepo = departmentRepo;
        this.prisma = prisma;
    }
    async create(facilityId, createDepartmentDto) {
        // Verify facility exists
        const facility = await this.prisma.facility.findUnique({
            where: { id: facilityId },
            select: { id: true, tenantId: true, status: true },
        });
        if (!facility) {
            throw new common_1.NotFoundException(`Facility with ID ${facilityId} not found`);
        }
        if (facility.status !== 'active') {
            throw new common_1.BadRequestException('Cannot create department for inactive facility');
        }
        // Check if code already exists for this facility
        if (createDepartmentDto.code) {
            const codeExists = await this.departmentRepo.checkCodeExists(facilityId, createDepartmentDto.code);
            if (codeExists) {
                throw new common_1.BadRequestException(`Department code '${createDepartmentDto.code}' already exists for this facility`);
            }
        }
        // Verify head of department exists if provided
        if (createDepartmentDto.headOfDepartment) {
            const staff = await this.prisma.staff.findUnique({
                where: { id: createDepartmentDto.headOfDepartment },
                select: { id: true, tenantId: true, status: true },
            });
            if (!staff) {
                throw new common_1.NotFoundException(`Staff with ID ${createDepartmentDto.headOfDepartment} not found`);
            }
            if (staff.tenantId !== facility.tenantId) {
                throw new common_1.BadRequestException('Staff must belong to the same tenant as the facility');
            }
            if (staff.status !== 'active') {
                throw new common_1.BadRequestException('Cannot assign inactive staff as head of department');
            }
        }
        return this.departmentRepo.create(facilityId, createDepartmentDto);
    }
    async findAll(facilityId, departmentType) {
        // Verify facility exists
        const facility = await this.prisma.facility.findUnique({
            where: { id: facilityId },
            select: { id: true },
        });
        if (!facility) {
            throw new common_1.NotFoundException(`Facility with ID ${facilityId} not found`);
        }
        return this.departmentRepo.findAll(facilityId, departmentType);
    }
    async findOne(id) {
        const department = await this.departmentRepo.findOne(id);
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID ${id} not found`);
        }
        return department;
    }
    async update(id, updateDepartmentDto) {
        const existing = await this.departmentRepo.findOne(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Department with ID ${id} not found`);
        }
        // Check if code is being changed and if it already exists
        if (updateDepartmentDto.code && updateDepartmentDto.code !== existing.code) {
            const codeExists = await this.departmentRepo.checkCodeExists(existing.facilityId, updateDepartmentDto.code, id);
            if (codeExists) {
                throw new common_1.BadRequestException(`Department code '${updateDepartmentDto.code}' already exists for this facility`);
            }
        }
        // Verify new head of department if provided
        if (updateDepartmentDto.headOfDepartment) {
            const staff = await this.prisma.staff.findUnique({
                where: { id: updateDepartmentDto.headOfDepartment },
                select: { id: true, tenantId: true, status: true },
            });
            if (!staff) {
                throw new common_1.NotFoundException(`Staff with ID ${updateDepartmentDto.headOfDepartment} not found`);
            }
            if (staff.tenantId !== existing.facility.tenantId) {
                throw new common_1.BadRequestException('Staff must belong to the same tenant as the facility');
            }
            if (staff.status !== 'active') {
                throw new common_1.BadRequestException('Cannot assign inactive staff as head of department');
            }
        }
        return this.departmentRepo.update(id, updateDepartmentDto);
    }
    async remove(id) {
        const existing = await this.departmentRepo.findOne(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Department with ID ${id} not found`);
        }
        // Check if department has active wards, clinics, or spaces
        const hasActiveWards = existing.wards.some((w) => w.status === 'active');
        const hasActiveClinics = existing.clinics.some((c) => c.status === 'active');
        const hasActiveSpaces = existing.spaces.some((s) => s.isActive);
        if (hasActiveWards || hasActiveClinics || hasActiveSpaces) {
            throw new common_1.BadRequestException('Cannot deactivate department with active wards, clinics, or spaces');
        }
        return this.departmentRepo.remove(id);
    }
};
exports.DepartmentService = DepartmentService;
exports.DepartmentService = DepartmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [department_repository_1.DepartmentRepository,
        database_foundation_1.PrismaService])
], DepartmentService);
//# sourceMappingURL=department.service.js.map