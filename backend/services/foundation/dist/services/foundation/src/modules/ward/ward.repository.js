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
exports.WardRepository = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
let WardRepository = class WardRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(departmentId, data) {
        return this.prisma.ward.create({
            data: {
                ...data,
                departmentId,
                totalBeds: data.totalBeds || 0,
                availableBeds: data.totalBeds || 0,
                status: data.status || 'active',
            },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                        facilityId: true,
                    },
                },
            },
        });
    }
    async findAll(departmentId, wardType) {
        return this.prisma.ward.findMany({
            where: {
                departmentId,
                ...(wardType && { wardType }),
                status: 'active',
            },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        beds: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        return this.prisma.ward.findUnique({
            where: { id },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                        facilityId: true,
                        facility: {
                            select: {
                                id: true,
                                name: true,
                                tenantId: true,
                            },
                        },
                    },
                },
                beds: {
                    select: {
                        id: true,
                        bedNumber: true,
                        bedType: true,
                        status: true,
                        currentPatientId: true,
                        assignedAt: true,
                    },
                    orderBy: {
                        bedNumber: 'asc',
                    },
                },
            },
        });
    }
    async update(id, data) {
        return this.prisma.ward.update({
            where: { id },
            data,
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        return this.prisma.ward.update({
            where: { id },
            data: {
                status: 'inactive',
            },
        });
    }
    async checkCodeExists(departmentId, code, excludeId) {
        const where = {
            departmentId,
            code,
        };
        if (excludeId) {
            where.id = { not: excludeId };
        }
        const existing = await this.prisma.ward.findFirst({ where });
        return !!existing;
    }
    async getAvailability(id) {
        return this.prisma.ward.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                totalBeds: true,
                availableBeds: true,
                beds: {
                    where: {
                        status: 'available',
                    },
                    select: {
                        id: true,
                        bedNumber: true,
                        bedType: true,
                    },
                },
            },
        });
    }
    async updateBedCounts(wardId) {
        const ward = await this.prisma.ward.findUnique({
            where: { id: wardId },
            include: {
                beds: {
                    select: {
                        status: true,
                    },
                },
            },
        });
        if (!ward)
            return null;
        const totalBeds = ward.beds.length;
        const availableBeds = ward.beds.filter((b) => b.status === 'available').length;
        return this.prisma.ward.update({
            where: { id: wardId },
            data: {
                totalBeds,
                availableBeds,
            },
        });
    }
};
exports.WardRepository = WardRepository;
exports.WardRepository = WardRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], WardRepository);
//# sourceMappingURL=ward.repository.js.map