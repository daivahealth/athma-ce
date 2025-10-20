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
exports.StaffSpecialtyRepository = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
let StaffSpecialtyRepository = class StaffSpecialtyRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assignSpecialty(data) {
        // If setting as primary, first remove primary flag from all others AT THIS FACILITY
        if (data.primaryFlag) {
            await this.prisma.staffSpecialty.updateMany({
                where: {
                    staffId: data.staffId,
                    facilityId: data.facilityId,
                },
                data: {
                    primaryFlag: false,
                },
            });
        }
        // Upsert the staff specialty
        return this.prisma.staffSpecialty.upsert({
            where: {
                staffId_specialtyId_facilityId: {
                    staffId: data.staffId,
                    specialtyId: data.specialtyId,
                    facilityId: data.facilityId,
                },
            },
            create: data,
            update: {
                primaryFlag: data.primaryFlag,
            },
            include: {
                specialty: {
                    include: {
                        translations: true,
                    },
                },
                facility: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async removeSpecialty(staffId, facilityId, specialtyId) {
        return this.prisma.staffSpecialty.delete({
            where: {
                staffId_specialtyId_facilityId: {
                    staffId,
                    specialtyId,
                    facilityId,
                },
            },
        });
    }
    async getStaffSpecialties(staffId, facilityId, locale) {
        const where = { staffId };
        if (facilityId) {
            where.facilityId = facilityId;
        }
        return this.prisma.staffSpecialty.findMany({
            where,
            include: {
                specialty: {
                    include: {
                        translations: locale
                            ? {
                                where: { lang: locale },
                            }
                            : true,
                        authorityCodes: true,
                    },
                },
                facility: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
            orderBy: [{ primaryFlag: 'desc' }, { createdAt: 'asc' }],
        });
    }
    async getPrimarySpecialty(staffId, facilityId) {
        return this.prisma.staffSpecialty.findFirst({
            where: {
                staffId,
                facilityId,
                primaryFlag: true,
            },
            include: {
                specialty: {
                    include: {
                        translations: true,
                    },
                },
            },
        });
    }
    async findStaffBySpecialty(params) {
        const { tenantId, specialtyId, specialtyCode, staffType, primaryOnly, activeOnly, facilityId, locale, } = params;
        // Build where clause
        const where = {
            tenantId,
            staff: {
                status: activeOnly ? 'active' : undefined,
                staffType: staffType || undefined,
            },
            primaryFlag: primaryOnly ? true : undefined,
        };
        // Add specialty filter
        if (specialtyId) {
            where.specialtyId = specialtyId;
        }
        else if (specialtyCode) {
            where.specialty = {
                code: specialtyCode,
            };
        }
        const staffSpecialties = await this.prisma.staffSpecialty.findMany({
            where,
            include: {
                staff: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                status: true,
                            },
                        },
                        departments: facilityId
                            ? {
                                where: { facilityId },
                                select: {
                                    id: true,
                                    name: true,
                                    code: true,
                                },
                            }
                            : true,
                    },
                },
                specialty: {
                    include: {
                        translations: locale
                            ? {
                                where: { lang: locale },
                            }
                            : true,
                    },
                },
            },
            orderBy: [
                { primaryFlag: 'desc' },
                { staff: { lastName: 'asc' } },
                { staff: { firstName: 'asc' } },
            ],
        });
        return staffSpecialties;
    }
    async bulkAssignSpecialties(data) {
        const { tenantId, staffId, facilityId, primarySpecialtyId, secondarySpecialtyIds } = data;
        return this.prisma.$transaction(async (tx) => {
            // Remove all existing specialties FOR THIS FACILITY
            await tx.staffSpecialty.deleteMany({
                where: {
                    staffId,
                    facilityId,
                },
            });
            // Add primary specialty
            const primary = await tx.staffSpecialty.create({
                data: {
                    tenantId,
                    staffId,
                    facilityId,
                    specialtyId: primarySpecialtyId,
                    primaryFlag: true,
                },
                include: {
                    specialty: {
                        include: {
                            translations: true,
                        },
                    },
                    facility: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            // Add secondary specialties
            const secondaries = secondarySpecialtyIds
                ? await Promise.all(secondarySpecialtyIds.map((specialtyId) => tx.staffSpecialty.create({
                    data: {
                        tenantId,
                        staffId,
                        facilityId,
                        specialtyId,
                        primaryFlag: false,
                    },
                    include: {
                        specialty: {
                            include: {
                                translations: true,
                            },
                        },
                        facility: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                })))
                : [];
            return {
                primary,
                secondaries,
            };
        });
    }
    async changePrimarySpecialty(staffId, facilityId, newPrimarySpecialtyId) {
        return this.prisma.$transaction(async (tx) => {
            // Remove primary flag from all AT THIS FACILITY
            await tx.staffSpecialty.updateMany({
                where: {
                    staffId,
                    facilityId,
                },
                data: { primaryFlag: false },
            });
            // Set new primary
            const newPrimary = await tx.staffSpecialty.update({
                where: {
                    staffId_specialtyId_facilityId: {
                        staffId,
                        specialtyId: newPrimarySpecialtyId,
                        facilityId,
                    },
                },
                data: { primaryFlag: true },
                include: {
                    specialty: {
                        include: {
                            translations: true,
                        },
                    },
                    facility: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            return newPrimary;
        });
    }
    async getSpecialtyStats(tenantId) {
        // Count staff by specialty (primary only)
        const stats = await this.prisma.staffSpecialty.groupBy({
            by: ['specialtyId'],
            where: {
                tenantId,
                primaryFlag: true,
                staff: {
                    status: 'active',
                },
            },
            _count: {
                staffId: true,
            },
        });
        // Enrich with specialty details
        const enriched = await Promise.all(stats.map(async (stat) => {
            const specialty = await this.prisma.specialty.findUnique({
                where: { id: stat.specialtyId },
                include: {
                    translations: true,
                },
            });
            return {
                specialty,
                count: stat._count.staffId,
            };
        }));
        return enriched;
    }
    async getFacilitySpecialties(facilityId, locale) {
        // Get distinct specialties at this facility with staff counts
        const specialties = await this.prisma.staffSpecialty.groupBy({
            by: ['specialtyId'],
            where: {
                facilityId,
                primaryFlag: true,
                staff: {
                    status: 'active',
                },
            },
            _count: {
                staffId: true,
            },
        });
        // Enrich with specialty details and translations
        const enriched = await Promise.all(specialties.map(async (spec) => {
            const specialty = await this.prisma.specialty.findUnique({
                where: { id: spec.specialtyId },
                include: {
                    translations: locale
                        ? {
                            where: { lang: locale },
                        }
                        : true,
                    authorityCodes: true,
                },
            });
            // Get staff list
            const staff = await this.prisma.staffSpecialty.findMany({
                where: {
                    facilityId,
                    specialtyId: spec.specialtyId,
                    primaryFlag: true,
                    staff: {
                        status: 'active',
                    },
                },
                include: {
                    staff: {
                        select: {
                            id: true,
                            employeeId: true,
                            firstName: true,
                            lastName: true,
                            phoneNumber: true,
                            email: true,
                            licenseNumber: true,
                        },
                    },
                },
            });
            return {
                specialty,
                staffCount: spec._count.staffId,
                staff: staff.map((s) => s.staff),
            };
        }));
        return enriched.sort((a, b) => (b.staffCount || 0) - (a.staffCount || 0));
    }
};
exports.StaffSpecialtyRepository = StaffSpecialtyRepository;
exports.StaffSpecialtyRepository = StaffSpecialtyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], StaffSpecialtyRepository);
//# sourceMappingURL=staff-specialty.repository.js.map