"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRepository = void 0;
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
const appointment_dto_1 = require("./dto/appointment.dto");
let AppointmentRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppointmentRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppointmentRepository = _classThis = _classDescriptor.value;
            if (_metadata)
                Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async create(data) {
            return this.prisma.appointment.create({
                data: {
                    ...data,
                    startTime: new Date(data.startTime),
                    endTime: new Date(data.endTime),
                },
            });
        }
        async findById(id) {
            return this.prisma.appointment.findUnique({
                where: { id },
            });
        }
        async findByIdWithDetails(id) {
            return this.prisma.appointment.findUnique({
                where: { id },
                include: {
                    patient: true,
                    staff: true,
                    facility: true,
                    space: true,
                    encounter: true,
                },
            });
        }
        async findMany(query) {
            const { page, limit, patientId, staffId, facilityId, spaceId, status, appointmentType, visitType, dateRange, timeRange, sortBy, sortOrder } = query;
            const skip = (page - 1) * limit;
            // Build where clause
            const where = {};
            if (patientId)
                where.patientId = patientId;
            if (staffId)
                where.staffId = staffId;
            if (facilityId)
                where.facilityId = facilityId;
            if (spaceId)
                where.spaceId = spaceId;
            if (status)
                where.status = status;
            if (appointmentType)
                where.appointmentType = appointmentType;
            if (visitType)
                where.visitType = visitType;
            if (dateRange) {
                where.startTime = {};
                if (dateRange.from) {
                    where.startTime.gte = new Date(dateRange.from);
                }
                if (dateRange.to) {
                    where.startTime.lte = new Date(dateRange.to);
                }
            }
            if (timeRange) {
                // This would need more complex logic for time-only filtering
                // For now, we'll implement basic date filtering
            }
            // Build orderBy clause
            const orderBy = {};
            orderBy[sortBy] = sortOrder;
            const [appointments, total] = await Promise.all([
                this.prisma.appointment.findMany({
                    where,
                    orderBy,
                    skip,
                    take: limit,
                    include: {
                        patient: true,
                        staff: true,
                        facility: true,
                        space: true,
                    },
                }),
                this.prisma.appointment.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                data: appointments,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            };
        }
        async search(searchDto) {
            const { q, fields = ['patientName', 'staffName'], dateRange, limit } = searchDto;
            const searchConditions = fields.map(field => {
                switch (field) {
                    case 'patientName':
                        return {
                            patient: {
                                OR: [
                                    { firstName: { contains: q, mode: 'insensitive' } },
                                    { lastName: { contains: q, mode: 'insensitive' } },
                                ],
                            },
                        };
                    case 'staffName':
                        return {
                            staff: {
                                OR: [
                                    { firstName: { contains: q, mode: 'insensitive' } },
                                    { lastName: { contains: q, mode: 'insensitive' } },
                                ],
                            },
                        };
                    case 'facilityName':
                        return {
                            facility: {
                                name: { contains: q, mode: 'insensitive' },
                            },
                        };
                    case 'notes':
                        return {
                            notes: { contains: q, mode: 'insensitive' },
                        };
                    default:
                        return {};
                }
            }).filter(condition => Object.keys(condition).length > 0);
            const where = {
                OR: searchConditions,
            };
            if (dateRange) {
                where.startTime = {};
                if (dateRange.from) {
                    where.startTime.gte = new Date(dateRange.from);
                }
                if (dateRange.to) {
                    where.startTime.lte = new Date(dateRange.to);
                }
            }
            return this.prisma.appointment.findMany({
                where,
                take: limit,
                include: {
                    patient: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            emiratesId: true,
                        },
                    },
                    staff: {
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
                },
            });
        }
        async update(id, data) {
            const updateData = { ...data };
            if (data.startTime) {
                updateData.startTime = new Date(data.startTime);
            }
            if (data.endTime) {
                updateData.endTime = new Date(data.endTime);
            }
            return this.prisma.appointment.update({
                where: { id },
                data: updateData,
            });
        }
        async checkConflicts(appointmentData, excludeId) {
            const where = {
                AND: [
                    {
                        OR: [
                            {
                                AND: [
                                    { startTime: { lt: new Date(appointmentData.endTime) } },
                                    { endTime: { gt: new Date(appointmentData.startTime) } },
                                ],
                            },
                        ],
                    },
                    {
                        status: {
                            notIn: ['cancelled', 'completed'],
                        },
                    },
                ],
            };
            if (excludeId) {
                where.id = { not: excludeId };
            }
            if (appointmentData.staffId) {
                where.staffId = appointmentData.staffId;
            }
            if (appointmentData.spaceId) {
                where.spaceId = appointmentData.spaceId;
            }
            return this.prisma.appointment.findMany({
                where,
                include: {
                    patient: true,
                    staff: true,
                    space: true,
                },
            });
        }
        async checkAvailability(checkAvailabilityDto) {
            const conflicts = await this.checkConflicts({
                startTime: checkAvailabilityDto.startTime,
                endTime: checkAvailabilityDto.endTime,
                staffId: checkAvailabilityDto.staffId,
                spaceId: checkAvailabilityDto.spaceId,
            }, checkAvailabilityDto.excludeAppointmentId);
            return {
                available: conflicts.length === 0,
                conflicts,
            };
        }
        async getAvailability(query) {
            const { facilityId, staffId, spaceId, date, duration, includeWeekends } = query;
            const targetDate = new Date(date);
            const slots = [];
            // Get facility operating hours (this would come from facility configuration)
            const operatingHours = {
                open: '08:00',
                close: '17:00',
                breaks: [
                    { start: '12:00', end: '13:00' },
                ],
            };
            // Generate time slots
            const openTime = this.parseTime(operatingHours.open);
            const closeTime = this.parseTime(operatingHours.close);
            let currentTime = new Date(targetDate);
            currentTime.setHours(openTime.hours, openTime.minutes, 0, 0);
            const endTime = new Date(targetDate);
            endTime.setHours(closeTime.hours, closeTime.minutes, 0, 0);
            while (currentTime < endTime) {
                const slotEndTime = new Date(currentTime.getTime() + duration * 60000);
                // Check if slot overlaps with break time
                const isBreakTime = operatingHours.breaks.some(breakTime => {
                    const breakStart = this.parseTime(breakTime.start);
                    const breakEnd = this.parseTime(breakTime.end);
                    const breakStartTime = new Date(targetDate);
                    breakStartTime.setHours(breakStart.hours, breakStart.minutes, 0, 0);
                    const breakEndTime = new Date(targetDate);
                    breakEndTime.setHours(breakEnd.hours, breakEnd.minutes, 0, 0);
                    return (currentTime < breakEndTime && slotEndTime > breakStartTime);
                });
                // Check for conflicts
                const conflicts = await this.checkConflicts({
                    startTime: currentTime.toISOString(),
                    endTime: slotEndTime.toISOString(),
                    staffId,
                    spaceId,
                    facilityId,
                });
                const isWeekend = currentTime.getDay() === 0 || currentTime.getDay() === 6;
                const available = !isBreakTime && conflicts.length === 0 && (includeWeekends || !isWeekend);
                slots.push({
                    startTime: currentTime.toISOString(),
                    endTime: slotEndTime.toISOString(),
                    duration,
                    available,
                    reason: !available ? this.getUnavailabilityReason(isBreakTime, conflicts.length > 0, isWeekend) : undefined,
                });
                // Move to next slot
                currentTime = new Date(currentTime.getTime() + 30 * 60000); // 30-minute increments
            }
            return {
                date,
                facilityId,
                staffId,
                spaceId,
                slots,
                operatingHours,
            };
        }
        async cancelRecurringAppointments(seriesId, reason, cancelFutureOnly) {
            const where = { seriesId };
            if (cancelFutureOnly) {
                where.startTime = { gte: new Date() };
            }
            return this.prisma.appointment.updateMany({
                where,
                data: {
                    status: 'cancelled',
                    cancellationReason: reason,
                },
            });
        }
        async addToWaitlist(data) {
            return this.prisma.appointmentWaitlist.create({
                data,
            });
        }
        async getWaitlist(query) {
            const { page = 1, limit = 20, facilityId, staffId, status } = query;
            const skip = (page - 1) * limit;
            const where = {};
            if (facilityId)
                where.facilityId = facilityId;
            if (staffId)
                where.staffId = staffId;
            if (status)
                where.status = status;
            const [waitlist, total] = await Promise.all([
                this.prisma.appointmentWaitlist.findMany({
                    where,
                    orderBy: { createdAt: 'asc' },
                    skip,
                    take: limit,
                    include: {
                        patient: true,
                        staff: true,
                        facility: true,
                    },
                }),
                this.prisma.appointmentWaitlist.count({ where }),
            ]);
            return {
                data: waitlist,
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
        async updateWaitlistItem(id, updates) {
            return this.prisma.appointmentWaitlist.update({
                where: { id },
                data: updates,
            });
        }
        async removeFromWaitlist(id) {
            return this.prisma.appointmentWaitlist.delete({
                where: { id },
            });
        }
        async getDayView(date, query) {
            const targetDate = new Date(date);
            const startOfDay = new Date(targetDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(targetDate);
            endOfDay.setHours(23, 59, 59, 999);
            const where = {
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            };
            if (query.facilityId)
                where.facilityId = query.facilityId;
            if (query.staffId)
                where.staffId = query.staffId;
            return this.prisma.appointment.findMany({
                where,
                orderBy: { startTime: 'asc' },
                include: {
                    patient: true,
                    staff: true,
                    facility: true,
                    space: true,
                },
            });
        }
        async getWeekView(week, query) {
            // Implementation for week view
            return [];
        }
        async getMonthView(month, query) {
            // Implementation for month view
            return [];
        }
        async getStaffUtilization(staffId, query) {
            // Implementation for staff utilization
            return {};
        }
        async getSpaceUtilization(spaceId, query) {
            // Implementation for space utilization
            return {};
        }
        async getFacilityUtilization(facilityId, query) {
            // Implementation for facility utilization
            return {};
        }
        async getConflicts(query) {
            // Implementation for getting all conflicts
            return [];
        }
        async getAppointmentConflicts(id) {
            const appointment = await this.findById(id);
            if (!appointment) {
                return [];
            }
            return this.checkConflicts(appointment, id);
        }
        async getAppointmentTemplates(query) {
            // Implementation for appointment templates
            return [];
        }
        async createAppointmentTemplate(templateDto) {
            // Implementation for creating appointment templates
            return {};
        }
        async getAppointmentStats(query) {
            const { dateRange, facilityId, staffId } = query;
            const where = {};
            if (facilityId)
                where.facilityId = facilityId;
            if (staffId)
                where.staffId = staffId;
            if (dateRange) {
                where.startTime = {};
                if (dateRange.from)
                    where.startTime.gte = new Date(dateRange.from);
                if (dateRange.to)
                    where.startTime.lte = new Date(dateRange.to);
            }
            const [total, byStatus, byType, byStaff, byFacility,] = await Promise.all([
                this.prisma.appointment.count({ where }),
                this.prisma.appointment.groupBy({
                    by: ['status'],
                    where,
                    _count: true,
                }),
                this.prisma.appointment.groupBy({
                    by: ['appointmentType'],
                    where,
                    _count: true,
                }),
                this.prisma.appointment.groupBy({
                    by: ['staffId'],
                    where,
                    _count: true,
                }),
                this.prisma.appointment.groupBy({
                    by: ['facilityId'],
                    where,
                    _count: true,
                }),
            ]);
            return {
                total,
                byStatus: this.groupByToRecord(byStatus),
                byType: this.groupByToRecord(byType),
                byStaff: this.groupByToRecord(byStaff),
                byFacility: this.groupByToRecord(byFacility),
                averageDuration: 30, // This would be calculated from actual data
                noShowRate: 0.05, // This would be calculated from actual data
                cancellationRate: 0.1, // This would be calculated from actual data
                utilizationRate: 0.8, // This would be calculated from actual data
            };
        }
        async getAppointmentAnalytics(query) {
            // Implementation for appointment analytics
            return {};
        }
        parseTime(timeString) {
            const [hours, minutes] = timeString.split(':').map(Number);
            return { hours, minutes };
        }
        getUnavailabilityReason(isBreakTime, hasConflicts, isWeekend) {
            if (isBreakTime)
                return 'Break time';
            if (hasConflicts)
                return 'Conflicting appointment';
            if (isWeekend)
                return 'Weekend not included';
            return 'Unavailable';
        }
        groupByToRecord(groupByResult) {
            return groupByResult.reduce((acc, item) => {
                const key = Object.keys(item).find(key => key !== '_count');
                if (key) {
                    acc[item[key]] = item._count;
                }
                return acc;
            }, {});
        }
    };
    return AppointmentRepository = _classThis;
})();
exports.AppointmentRepository = AppointmentRepository;
//# sourceMappingURL=appointment.repository.js.map
//# sourceMappingURL=appointment.repository.js.map