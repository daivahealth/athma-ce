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
let FacilityRepository = class FacilityRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.facility.create({
            data,
        });
    }
    async findById(id) {
        return this.prisma.facility.findUnique({
            where: { id },
            include: {
                spaces: true,
            },
        });
    }
    async findMany(query) {
        const { page = 1, limit = 20, facilityType, status, search } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (facilityType)
            where.facilityType = facilityType;
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { licenseNumber: { contains: search } },
                { city: { contains: search, mode: 'insensitive' } },
                { emirate: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [facilities, total] = await Promise.all([
            this.prisma.facility.findMany({
                where,
                orderBy: { name: 'asc' },
                skip,
                take: limit,
                include: {
                    spaces: {
                        select: {
                            id: true,
                            name: true,
                            spaceType: true,
                            isActive: true,
                        },
                    },
                },
            }),
            this.prisma.facility.count({ where }),
        ]);
        return {
            data: facilities,
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
        return this.prisma.facility.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return this.prisma.facility.update({
            where: { id },
            data: { status: 'inactive' },
        });
    }
    async getSpaces(facilityId, query) {
        const { page = 1, limit = 50, spaceType, isActive } = query;
        const skip = (page - 1) * limit;
        const where = { facilityId };
        if (spaceType)
            where.spaceType = spaceType;
        if (isActive !== undefined)
            where.isActive = isActive;
        const [spaces, total] = await Promise.all([
            this.prisma.space.findMany({
                where,
                orderBy: { name: 'asc' },
                skip,
                take: limit,
            }),
            this.prisma.space.count({ where }),
        ]);
        return {
            data: spaces,
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
    async getStaff(facilityId, query) {
        // This would typically involve a junction table or facility-staff relationship
        // For now, return all staff (in a real implementation, this would be filtered by facility)
        const { page = 1, limit = 50, staffType, status } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (staffType)
            where.staffType = staffType;
        if (status)
            where.status = status;
        const [staff, total] = await Promise.all([
            this.prisma.staff.findMany({
                where,
                orderBy: { lastName: 'asc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    staffType: true,
                    specialties: true,
                    status: true,
                },
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
    async getSchedule(facilityId, query) {
        // Get appointments for this facility
        const appointments = await this.prisma.appointment.findMany({
            where: {
                facilityId,
                startTime: {
                    gte: query.from ? new Date(query.from) : new Date(),
                },
                endTime: {
                    lte: query.to ? new Date(query.to) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
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
                staff: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
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
            facilityId,
            appointments,
        };
    }
};
FacilityRepository = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], FacilityRepository);
export { FacilityRepository };
//# sourceMappingURL=facility.repository.js.map