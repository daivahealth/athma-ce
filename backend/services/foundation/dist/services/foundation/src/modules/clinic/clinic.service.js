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
exports.ClinicService = void 0;
const common_1 = require("@nestjs/common");
const clinic_repository_1 = require("./clinic.repository");
const database_foundation_1 = require("@zeal/database-foundation");
let ClinicService = class ClinicService {
    clinicRepo;
    prisma;
    constructor(clinicRepo, prisma) {
        this.clinicRepo = clinicRepo;
        this.prisma = prisma;
    }
    async create(departmentId, createClinicDto) {
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
            throw new common_1.NotFoundException(`Department with ID ${departmentId} not found`);
        }
        if (department.departmentType !== 'opd') {
            throw new common_1.BadRequestException('Clinics can only be created in OPD departments');
        }
        if (department.status !== 'active') {
            throw new common_1.BadRequestException('Cannot create clinic for inactive department');
        }
        // Check if code already exists for this department
        if (createClinicDto.code) {
            const codeExists = await this.clinicRepo.checkCodeExists(departmentId, createClinicDto.code);
            if (codeExists) {
                throw new common_1.BadRequestException(`Clinic code '${createClinicDto.code}' already exists for this department`);
            }
        }
        return this.clinicRepo.create(departmentId, createClinicDto);
    }
    async findAll(departmentId, specialty) {
        // Verify department exists
        const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
            select: { id: true },
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID ${departmentId} not found`);
        }
        return this.clinicRepo.findAll(departmentId, specialty);
    }
    async findOne(id) {
        const clinic = await this.clinicRepo.findOne(id);
        if (!clinic) {
            throw new common_1.NotFoundException(`Clinic with ID ${id} not found`);
        }
        return clinic;
    }
    async update(id, updateClinicDto) {
        const existing = await this.clinicRepo.findOne(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Clinic with ID ${id} not found`);
        }
        // Check if code is being changed and if it already exists
        if (updateClinicDto.code && updateClinicDto.code !== existing.code) {
            const codeExists = await this.clinicRepo.checkCodeExists(existing.departmentId, updateClinicDto.code, id);
            if (codeExists) {
                throw new common_1.BadRequestException(`Clinic code '${updateClinicDto.code}' already exists for this department`);
            }
        }
        return this.clinicRepo.update(id, updateClinicDto);
    }
    async remove(id) {
        const existing = await this.clinicRepo.findOne(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Clinic with ID ${id} not found`);
        }
        // Check if clinic has active spaces
        const hasActiveSpaces = existing.spaces.some((s) => s.isActive);
        if (hasActiveSpaces) {
            throw new common_1.BadRequestException('Cannot deactivate clinic with active spaces');
        }
        return this.clinicRepo.remove(id);
    }
};
exports.ClinicService = ClinicService;
exports.ClinicService = ClinicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clinic_repository_1.ClinicRepository,
        database_foundation_1.PrismaService])
], ClinicService);
//# sourceMappingURL=clinic.service.js.map