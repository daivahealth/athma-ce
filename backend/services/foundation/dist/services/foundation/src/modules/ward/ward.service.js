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
exports.WardService = void 0;
const common_1 = require("@nestjs/common");
const ward_repository_1 = require("./ward.repository");
const database_foundation_1 = require("@zeal/database-foundation");
let WardService = class WardService {
    wardRepo;
    prisma;
    constructor(wardRepo, prisma) {
        this.wardRepo = wardRepo;
        this.prisma = prisma;
    }
    async create(departmentId, createWardDto) {
        // Verify department exists and is IPD type
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
        if (department.departmentType !== 'ipd') {
            throw new common_1.BadRequestException('Wards can only be created in IPD departments');
        }
        if (department.status !== 'active') {
            throw new common_1.BadRequestException('Cannot create ward for inactive department');
        }
        // Check if code already exists for this department
        if (createWardDto.code) {
            const codeExists = await this.wardRepo.checkCodeExists(departmentId, createWardDto.code);
            if (codeExists) {
                throw new common_1.BadRequestException(`Ward code '${createWardDto.code}' already exists for this department`);
            }
        }
        return this.wardRepo.create(departmentId, createWardDto);
    }
    async findAll(departmentId, wardType) {
        // Verify department exists
        const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
            select: { id: true },
        });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID ${departmentId} not found`);
        }
        return this.wardRepo.findAll(departmentId, wardType);
    }
    async findOne(id) {
        const ward = await this.wardRepo.findOne(id);
        if (!ward) {
            throw new common_1.NotFoundException(`Ward with ID ${id} not found`);
        }
        return ward;
    }
    async update(id, updateWardDto) {
        const existing = await this.wardRepo.findOne(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Ward with ID ${id} not found`);
        }
        // Check if code is being changed and if it already exists
        if (updateWardDto.code && updateWardDto.code !== existing.code) {
            const codeExists = await this.wardRepo.checkCodeExists(existing.departmentId, updateWardDto.code, id);
            if (codeExists) {
                throw new common_1.BadRequestException(`Ward code '${updateWardDto.code}' already exists for this department`);
            }
        }
        return this.wardRepo.update(id, updateWardDto);
    }
    async remove(id) {
        const existing = await this.wardRepo.findOne(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Ward with ID ${id} not found`);
        }
        // Check if ward has occupied beds
        const hasOccupiedBeds = existing.beds.some((b) => b.status === 'occupied');
        if (hasOccupiedBeds) {
            throw new common_1.BadRequestException('Cannot deactivate ward with occupied beds');
        }
        return this.wardRepo.remove(id);
    }
    async getAvailability(id) {
        const availability = await this.wardRepo.getAvailability(id);
        if (!availability) {
            throw new common_1.NotFoundException(`Ward with ID ${id} not found`);
        }
        return {
            wardId: availability.id,
            wardName: availability.name,
            totalBeds: availability.totalBeds,
            availableBeds: availability.availableBeds,
            occupiedBeds: availability.totalBeds - availability.availableBeds,
            occupancyRate: availability.totalBeds > 0
                ? ((availability.totalBeds - availability.availableBeds) / availability.totalBeds) * 100
                : 0,
            availableBedsList: availability.beds,
        };
    }
};
exports.WardService = WardService;
exports.WardService = WardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ward_repository_1.WardRepository,
        database_foundation_1.PrismaService])
], WardService);
//# sourceMappingURL=ward.service.js.map