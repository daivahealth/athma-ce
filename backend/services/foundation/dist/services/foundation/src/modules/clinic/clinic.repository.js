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
exports.ClinicRepository = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
let ClinicRepository = class ClinicRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(departmentId, data) {
        return this.prisma.clinic.create({
            data: {
                ...data,
                departmentId,
                totalRooms: data.totalRooms || 0,
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
    async findAll(departmentId, specialty) {
        return this.prisma.clinic.findMany({
            where: {
                departmentId,
                ...(specialty && { specialty }),
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
                        spaces: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        return this.prisma.clinic.findUnique({
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
                spaces: {
                    select: {
                        id: true,
                        name: true,
                        spaceNumber: true,
                        spaceType: true,
                        floorNumber: true,
                        capacity: true,
                        isActive: true,
                    },
                    orderBy: {
                        spaceNumber: 'asc',
                    },
                },
            },
        });
    }
    async update(id, data) {
        return this.prisma.clinic.update({
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
        return this.prisma.clinic.update({
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
        const existing = await this.prisma.clinic.findFirst({ where });
        return !!existing;
    }
};
exports.ClinicRepository = ClinicRepository;
exports.ClinicRepository = ClinicRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], ClinicRepository);
//# sourceMappingURL=clinic.repository.js.map