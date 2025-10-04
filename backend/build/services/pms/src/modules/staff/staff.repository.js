var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';
let StaffRepository = class StaffRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.staff.create({
            data: {
                ...data,
                dateOfBirth: new Date(data.dateOfBirth),
                licenseExpiry: data.licenseExpiry ? new Date(data.licenseExpiry) : undefined,
            },
        });
    }
    async findById(id) {
        return this.prisma.staff.findUnique({
            where: { id },
        });
    }
    async findByEmployeeId(tenantId, employeeId) {
        return this.prisma.staff.findUnique({
            where: {
                tenantId_employeeId: {
                    tenantId,
                    employeeId
                }
            },
        });
    }
    async findMany(query) {
        const { page = 1, limit = 20, staffType, status, facilityId, search } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (staffType)
            where.staffType = staffType;
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { employeeId: { contains: search } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [staff, total] = await Promise.all([
            this.prisma.staff.findMany({
                where,
                orderBy: { lastName: 'asc' },
                skip,
                take: limit,
            }),
            this.prisma.staff.count({ where }),
        ]);
        return {
            data: staff,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            },
        };
    }
    async update(id, data) {
        const updateData = { ...data };
        if (data.dateOfBirth) {
            updateData.dateOfBirth = new Date(data.dateOfBirth);
        }
        if (data.licenseExpiry) {
            updateData.licenseExpiry = new Date(data.licenseExpiry);
        }
        return this.prisma.staff.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id) {
        return this.prisma.staff.update({
            where: { id },
            data: { status: 'terminated' },
        });
    }
    async getAvailability(id, query) {
        // This would implement staff availability logic
        // For now, return a simple structure
        return {
            staffId: id,
            available: true,
            schedule: [],
        };
    }
    async getSchedule(id, query) {
        // Get appointments for this staff member
        const appointments = await this.prisma.appointment.findMany({
            where: {
                staffId: id,
                startTime: {
                    gte: query.from ? new Date(query.from) : new Date(),
                },
                endTime: {
                    lte: query.to ? new Date(query.to) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                },
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                facility: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                space: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { startTime: 'asc' },
        });
        return {
            staffId: id,
            appointments,
        };
    }
};
StaffRepository = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], StaffRepository);
export { StaffRepository };
//# sourceMappingURL=staff.repository.js.map