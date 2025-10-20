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
exports.BedRepository = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
let BedRepository = class BedRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(wardId, data) {
        return this.prisma.bed.create({
            data: {
                ...data,
                wardId,
                status: data.status || 'available',
            },
            include: {
                ward: {
                    select: {
                        id: true,
                        name: true,
                        departmentId: true,
                    },
                },
            },
        });
    }
    async findAll(wardId, status) {
        return this.prisma.bed.findMany({
            where: {
                wardId,
                ...(status && { status }),
            },
            include: {
                ward: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                bedNumber: 'asc',
            },
        });
    }
    async findOne(id) {
        return this.prisma.bed.findUnique({
            where: { id },
            include: {
                ward: {
                    select: {
                        id: true,
                        name: true,
                        wardType: true,
                        departmentId: true,
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
                    },
                },
            },
        });
    }
    async update(id, data) {
        return this.prisma.bed.update({
            where: { id },
            data,
            include: {
                ward: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        return this.prisma.bed.delete({
            where: { id },
        });
    }
    async assignPatient(bedId, patientId) {
        return this.prisma.bed.update({
            where: { id: bedId },
            data: {
                currentPatientId: patientId,
                status: 'occupied',
                assignedAt: new Date(),
            },
            include: {
                ward: true,
            },
        });
    }
    async releasePatient(bedId) {
        return this.prisma.bed.update({
            where: { id: bedId },
            data: {
                currentPatientId: null,
                status: 'available',
                assignedAt: null,
            },
            include: {
                ward: true,
            },
        });
    }
    async checkBedNumberExists(wardId, bedNumber, excludeId) {
        const where = {
            wardId,
            bedNumber,
        };
        if (excludeId) {
            where.id = { not: excludeId };
        }
        const existing = await this.prisma.bed.findFirst({ where });
        return !!existing;
    }
    async findAvailable(wardId) {
        return this.prisma.bed.findMany({
            where: {
                ...(wardId && { wardId }),
                status: 'available',
            },
            include: {
                ward: {
                    select: {
                        id: true,
                        name: true,
                        wardType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                facility: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: [
                { ward: { name: 'asc' } },
                { bedNumber: 'asc' },
            ],
        });
    }
};
exports.BedRepository = BedRepository;
exports.BedRepository = BedRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], BedRepository);
//# sourceMappingURL=bed.repository.js.map