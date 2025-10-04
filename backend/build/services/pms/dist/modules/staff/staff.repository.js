"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffRepository = void 0;
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function")
        throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn)
            context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access)
            context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done)
            throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0)
                continue;
            if (result === null || typeof result !== "object")
                throw new TypeError("Object expected");
            if (_ = accept(result.get))
                descriptor.get = _;
            if (_ = accept(result.set))
                descriptor.set = _;
            if (_ = accept(result.init))
                initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field")
                initializers.unshift(_);
            else
                descriptor[key] = _;
        }
    }
    if (target)
        Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
const common_1 = require("@nestjs/common");
const shared_database_1 = require("@zeal/shared-database");
let StaffRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var StaffRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            StaffRepository = _classThis = _classDescriptor.value;
            if (_metadata)
                Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
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
    return StaffRepository = _classThis;
})();
exports.StaffRepository = StaffRepository;
//# sourceMappingURL=staff.repository.js.map
//# sourceMappingURL=staff.repository.js.map