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
exports.DepartmentRepository = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
let DepartmentRepository = class DepartmentRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(facilityId, data) {
        return this.prisma.department.create({
            data: {
                ...data,
                facilityId,
                status: data.status || 'active',
            },
            include: {
                facility: {
                    select: {
                        id: true,
                        name: true,
                        tenantId: true,
                    },
                },
                hod: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        employeeId: true,
                    },
                },
            },
        });
    }
    async findAll(facilityId, departmentType) {
        return this.prisma.department.findMany({
            where: {
                facilityId,
                ...(departmentType && { departmentType }),
                status: 'active',
            },
            include: {
                facility: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                hod: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        employeeId: true,
                    },
                },
                _count: {
                    select: {
                        wards: true,
                        clinics: true,
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
        return this.prisma.department.findUnique({
            where: { id },
            include: {
                facility: {
                    select: {
                        id: true,
                        name: true,
                        tenantId: true,
                    },
                },
                hod: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        employeeId: true,
                    },
                },
                wards: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        wardType: true,
                        totalBeds: true,
                        availableBeds: true,
                        status: true,
                    },
                },
                clinics: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        specialty: true,
                        totalRooms: true,
                        status: true,
                    },
                },
                spaces: {
                    select: {
                        id: true,
                        name: true,
                        spaceType: true,
                        isActive: true,
                    },
                },
            },
        });
    }
    async update(id, data) {
        return this.prisma.department.update({
            where: { id },
            data,
            include: {
                facility: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                hod: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        return this.prisma.department.update({
            where: { id },
            data: {
                status: 'inactive',
            },
        });
    }
    async checkCodeExists(facilityId, code, excludeId) {
        const where = {
            facilityId,
            code,
        };
        if (excludeId) {
            where.id = { not: excludeId };
        }
        const existing = await this.prisma.department.findFirst({ where });
        return !!existing;
    }
};
exports.DepartmentRepository = DepartmentRepository;
exports.DepartmentRepository = DepartmentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], DepartmentRepository);
//# sourceMappingURL=department.repository.js.map