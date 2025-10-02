var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';
let FacilityRepository = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FacilityRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FacilityRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
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
    return FacilityRepository = _classThis;
})();
export { FacilityRepository };
//# sourceMappingURL=facility.repository.js.map